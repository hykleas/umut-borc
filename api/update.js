const GH_API = 'https://api.github.com';

function ghHeaders() {
  return {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    Accept: 'application/vnd.github+json',
    'User-Agent': 'borc-takip'
  };
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Sadece POST' });
  }
  const { password, data, verifyOnly } = req.body || {};
  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'unauthorized' });
  }
  if (verifyOnly) {
    return res.status(200).json({ ok: true });
  }

  if (!data || typeof data !== 'object') {
    return res.status(400).json({ error: 'Geçersiz veri' });
  }
  const clean = {
    name: String(data.name || 'Umut Ardan').slice(0, 100),
    amount: Math.max(0, Number(data.amount) || 0),
    paid: Math.max(0, Number(data.paid) || 0),
    debtDate: String(data.debtDate || '2026-06-01').slice(0, 10),
    faizPerDay: Math.max(0, Number(data.faizPerDay) || 0),
    photo: String(data.photo || ''),
    note: String(data.note || '').slice(0, 500),
    messages: Array.isArray(data.messages)
      ? data.messages.map(m => String(m).slice(0, 200)).slice(0, 50)
      : []
  };
  if (clean.photo && !clean.photo.startsWith('data:image/')) {
    return res.status(400).json({ error: 'Fotoğraf formatı geçersiz' });
  }
  if (clean.photo.length > 900000) {
    return res.status(400).json({ error: 'Fotoğraf çok büyük, daha küçük bir görsel seç' });
  }

  try {
    const url = `${GH_API}/repos/${process.env.DATA_REPO}/contents/data.json`;
    const cur = await fetch(`${url}?ref=main`, { headers: ghHeaders() });
    if (!cur.ok) throw new Error(`GitHub okuma ${cur.status}`);
    const curJson = await cur.json();

    const put = await fetch(url, {
      method: 'PUT',
      headers: { ...ghHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Borç güncellemesi (admin paneli)',
        content: Buffer.from(JSON.stringify(clean, null, 2)).toString('base64'),
        sha: curJson.sha,
        branch: 'main'
      })
    });
    if (!put.ok) {
      const err = await put.json().catch(() => ({}));
      throw new Error(`GitHub yazma ${put.status}: ${err.message || ''}`);
    }
    res.status(200).json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: 'Kaydedilemedi: ' + e.message });
  }
};
