const express = require('express');
const cors = require('cors');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ─── Terjemahan ─────────────────────────────────────────────────────────────
// Memecah teks panjang menjadi chunks ≤ 450 karakter (batas MyMemory API)
const splitIntoChunks = (text, maxLen = 450) => {
    const sentences = text.match(/[^.!?\r\n]+[.!?\r\n]*/g) || [text];
    const chunks = [];
    let current = '';

    for (const sentence of sentences) {
        if ((current + sentence).length > maxLen) {
            if (current) chunks.push(current.trim());
            // Jika satu kalimat > maxLen, potong paksa
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

// Terjemahkan satu chunk teks EN → ID via MyMemory
const translateChunk = async (text) => {
    try {
        const res = await axios.get('https://api.mymemory.translated.net/get', {
            params: { q: text, langpair: 'en|id' },
            timeout: 8000
        });
        const translated = res.data?.responseData?.translatedText;
        // Jika terjemahan gagal atau mengembalikan error, gunakan teks asli
        if (!translated || translated.toUpperCase().includes('MYMEMORY WARNING')) {
            return text;
        }
        return translated;
    } catch {
        return text; // fallback ke teks asli
    }
};

// Terjemahkan teks panjang dengan memecahnya terlebih dahulu
const translateText = async (text) => {
    if (!text) return text;
    const chunks = splitIntoChunks(text);
    const translated = await Promise.all(chunks.map(translateChunk));
    return translated.join(' ');
};

// ─── Terjemahkan nama bahan ──────────────────────────────────────────────────
const translateIngredients = async (meal) => {
    const translatedMeal = { ...meal };
    const ingredientPromises = [];
    
    for (let i = 1; i <= 20; i++) {
        const key = `strIngredient${i}`;
        if (meal[key] && meal[key].trim()) {
            ingredientPromises.push(
                translateChunk(meal[key]).then(t => { translatedMeal[key] = t; })
            );
        }
    }
    await Promise.all(ingredientPromises);
    return translatedMeal;
};

// ─── Endpoints ───────────────────────────────────────────────────────────────

// Cari makanan (tanpa terjemahan, cukup cepat)
app.get('/api/foods/search', async (req, res) => {
    try {
        const query = req.query.q || '';
        const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching foods:', error.message);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

// Detail makanan — dengan terjemahan instruksi & bahan ke Bahasa Indonesia
app.get('/api/foods/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);

        if (!response.data.meals || response.data.meals.length === 0) {
            return res.json(response.data);
        }

        const meal = response.data.meals[0];

        console.log(`Menerjemahkan resep: ${meal.strMeal}...`);

        // Jalankan terjemahan instruksi dan bahan secara bersamaan
        const [translatedInstructions, translatedMeal] = await Promise.all([
            translateText(meal.strInstructions),
            translateIngredients(meal)
        ]);

        translatedMeal.strInstructions = translatedInstructions;

        res.json({ meals: [translatedMeal] });
    } catch (error) {
        console.error('Error fetching food detail:', error.message);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server berjalan di port ${PORT}`);
    console.log(`Terjemahan otomatis EN → ID aktif`);
});
