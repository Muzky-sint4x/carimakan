module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ message: 'Method Not Allowed' });
    return;
  }

  try {
    const { id } = req.query;
    if (!id) {
      res.status(400).json({ message: 'Missing id' });
      return;
    }

    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${encodeURIComponent(id)}`);
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Vercel API detail error:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};
