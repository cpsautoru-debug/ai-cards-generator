const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.static(path.join(__dirname)));

app.post('/api/generate', async (req, res) => {
  try {
    const { title, background, colors, specs } = req.body;
    
    // Создаём 5 разных промптов для вариативности
    const urls = Array.from({ length: 5 }, (_, i) => {
      const style = i === 0 ? 'professional product photography' :
                    i === 1 ? 'clean minimalist design' :
                    i === 2 ? 'vibrant marketing layout' :
                    i === 3 ? 'soft studio lighting' : 'modern e-commerce style';
      
      const prompt = `Infographic card for "${title}". Background: ${background || 'studio'}. Colors: ${colors || 'modern'}. Features: "${specs || ''}". Style: ${style}, high quality, commercial.`;
      
      // Уникальный seed для каждой карточки, чтобы они отличались
      const seed = Math.floor(Math.random() * 999999);
      return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1024&height=1024&nologo=true&seed=${seed}`;
    });

    res.json({ urls });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка генерации' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Сервер запущен на http://localhost:${PORT}`));