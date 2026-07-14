const GH_API = 'https://api.github.com';

function ghHeaders() {
  return {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    Accept: 'application/vnd.github+json',
    'User-Agent': 'borc-takip'
  };
}

module.exports = async (req, res) => {
  try {
    const url = `${GH_API}/repos/${process.env.DATA_REPO}/contents/data.json?ref=main`;
    const r = await fetch(url, { headers: ghHeaders() });
    if (!r.ok) throw new Error(`GitHub ${r.status}`);
    const j = await r.json();
    const data = JSON.parse(Buffer.from(j.content, 'base64').toString('utf8'));
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: 'Veri okunamadı: ' + e.message });
  }
};
