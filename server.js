const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// 初始化Supabase客户端
const supabaseUrl = 'https://xlifqkkeewtsejxrrabg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhsaWZxa2tlZXd0c2VqeHJyYWJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU2MDI1NjYsImV4cCI6MjA2MTE3ODU2Nn0.n8L-yTNGd4W82Ax7M9_6MdfcH73nRSx5zW6kzrDw5Hc';
const supabase = createClient(supabaseUrl, supabaseKey);

// 表情配置
const weatherEmoji = {
  sunny: '☀️',
  cloudy: '☁️',
  rainy: '🌧️',
  snowy: '❄️'
};

const moodEmoji = {
  happy: '😊',
  sad: '😢',
  angry: '😠',
  calm: '😌'
};

// 获取日记历史记录
app.get('/api/diaries', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('diaries')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    res.json({
      success: true,
      data: data.map(diary => ({
        ...diary,
        weatherEmoji: weatherEmoji[diary.weather],
        moodEmoji: moodEmoji[diary.mood]
      }))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// 保存新日记
app.post('/api/diaries', async (req, res) => {
  try {
    const { content, weather, mood } = req.body;
    
    const cleanHtmlContent = content
      .replace(/class=".*?"/g, '')
      .replace(/style=".*?"/g, '');
    
    const { data, error } = await supabase
      .from('diaries')
      .insert([{
        content: cleanHtmlContent,
        weather,
        mood,
        created_at: new Date().toISOString()
      }]);
      
    if (error) throw error;
    
    res.json({
      success: true,
      message: '日记保存成功！✨'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});