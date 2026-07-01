export default async function handler(req, res) {
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

    const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${encodeURIComponent(id)}`;
    const response = await fetch(url);
    const data = await response.json();

    if (!data.meals || data.meals.length === 0) {
      return res.status(200).json(data);
    }

    const meal = data.meals[0];

    const splitIntoChunks = (text, maxLen = 450) => {
      const sentences = text.match(/[^.!?\r\n]+[.!?\r\n]*/g) || [text];
      const chunks = [];
      let current = '';
      for (const sentence of sentences) {
        if ((current + sentence).length > maxLen) {
          if (current) chunks.push(current.trim());
          if (sentence.length > maxLen) {
            for (let i = 0; i < sentence.length; i += maxLen) {
              chunks.push(sentence.slice(i, i + maxLen).trim());
            }
            current = '';
          } else {
            current = sentence;
          }
        } else {
          current += sentence;
        }
      }
      if (current.trim()) chunks.push(current.trim());
      return chunks;
    };

    const translateChunk = async (text) => {
      try {
        const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|id`);
        const json = await res.json();
        const translated = json?.responseData?.translatedText;
        if (!translated || translated.toUpperCase().includes('MYMEMORY WARNING')) return text;
        return translated;
      } catch {
        return text;
      }
    };

    const translateText = async (text) => {
      if (!text) return text;
      const chunks = splitIntoChunks(text);
      const translated = await Promise.all(chunks.map(translateChunk));
      return translated.join(' ');
    };

    const translateIngredients = async (mealObj) => {
      const translatedMeal = { ...mealObj };
      const promises = [];
      for (let i = 1; i <= 20; i++) {
        const key = `strIngredient${i}`;
        if (mealObj[key] && mealObj[key].trim()) {
          promises.push(
            translateChunk(mealObj[key]).then(t => { translatedMeal[key] = t; })
          );
        }
      }
      await Promise.all(promises);
      return translatedMeal;
    };

    const [translatedInstructions, translatedMeal] = await Promise.all([
      translateText(meal.strInstructions),
      translateIngredients(meal)
    ]);

    translatedMeal.strInstructions = translatedInstructions;
    res.status(200).json({ meals: [translatedMeal] });
  } catch (error) {
    console.error('Vercel API detail error:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
}
