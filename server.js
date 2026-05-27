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
    
      // Создаём 5 разных промптов с чёткой структурой
    const urls = Array.from({ length: 5 }, (_, i) => {
      const style = i === 0 ? 'professional product photography, clean studio lighting' :
                    i === 1 ? 'minimalist e-commerce design, white background' :
                    i === 2 ? 'vibrant marketing layout, eye-catching colors' :
                    i === 3 ? 'premium product card, soft shadows, elegant' : 'modern marketplace style, high contrast';
      
      // Улучшенный промпт с акцентом на текст и характеристики
      const prompt = `Product card for marketplace. Main object: ${title}. Background: ${background || 'clean white studio'}. Color scheme: ${colors || 'modern balanced'}. Display these features prominently: ${specs || ''}. Style: ${style}. Professional quality, text must be clear and readable, commercial photography, e-commerce standard.`;
      
      const seed = Math.floor(Math.random() * 999999);
      return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1024&height=1024&nologo=true&seed=${seed}&enhance=true`;
    });

    res.json({ urls });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка генерации' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Сервер запущен на http://localhost:${PORT}`));
