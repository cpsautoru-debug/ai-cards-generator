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
    
    // Создаём 5 РАЗНЫХ промптов на АНГЛИЙСКОМ (ИИ лучше понимает)
    const prompts = [
      `Professional product photography of ${title} on ${background || 'white studio background'}, ${colors || 'modern colors'}, features: ${specs || ''}, e-commerce card, text overlays, clean design`,
      `Minimalist e-commerce product card ${title}, ${background || 'clean background'}, ${colors || 'balanced palette'}, specs: ${specs || ''}, marketplace style, professional`,
      `Marketing infographic for ${title}, ${background || 'studio'}, color scheme: ${colors || 'modern'}, highlight: ${specs || ''}, commercial photography, high quality`,
      `Premium product showcase ${title}, ${background || 'white'}, ${colors || 'elegant tones'}, features: ${specs || ''}, soft lighting, e-commerce standard`,
      `Modern marketplace card ${title}, ${background || 'neutral'}, ${colors || 'vibrant'}, specs visible: ${specs || ''}, professional product photo`
    ];

    // Генерируем все 5 карточек с обработкой ошибок
    const urls = await Promise.all(
      prompts.map(async (prompt, index) => {
        try {
          const seed = 1000 + index; // Фиксированные seed для стабильности
          const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1024&height=1024&nologo=true&seed=${seed}&enhance=true`;
          return url;
        } catch (err) {
          console.error(`Error generating image ${index}:`, err);
          return null;
        }
      })
    );

    // Фильтруем неудачные генерации
    const validUrls = urls.filter(url => url !== null);
    
    res.json({ urls: validUrls });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка генерации: ' + err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Сервер запущен на http://localhost:${PORT}`));
