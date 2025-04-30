// 初始化Supabase客户端
const supabaseUrl = 'https://xlifqkkeewtsejxrrabg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhsaWZxa2tlZXd0c2VqeHJyYWJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU2MDI1NjYsImV4cCI6MjA2MTE3ODU2Nn0.n8L-yTNGd4W82Ax7M9_6MdfcH73nRSx5zW6kzrDw5Hc';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// 心情日记墙交互逻辑
const moodForm = document.querySelector('.mood-form');
const moodGrid = document.querySelector('.mood-grid');
const emojiOptions = document.querySelectorAll('.emoji-option');
const textarea = moodForm.querySelector('textarea');
const saveButton = moodForm.querySelector('.save-button');

let selectedEmoji = '😊';

// 选择表情
emojiOptions.forEach(option => {
    option.addEventListener('click', () => {
        selectedEmoji = option.textContent;
        emojiOptions.forEach(opt => opt.style.transform = 'scale(1)');
        option.style.transform = 'scale(1.3)';
    });
});

// 保存心情
saveButton.addEventListener('click', async () => {
    const moodText = textarea.value.trim();
    if (moodText) {
        // 保存到Supabase
        const { data, error } = await supabase
            .from('moods')
            .insert([
                { 
                    emoji: selectedEmoji, 
                    text: moodText,
                    created_at: new Date().toISOString()
                }
            ]);
            
        if (!error) {
            addMoodCard(selectedEmoji, moodText);
            textarea.value = '';
            
            // 触发爱心粒子效果
            createHeartParticles();
        } else {
            console.error('保存失败:', error);
        }
    }
});

// 添加心情卡片
function addMoodCard(emoji, text) {
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()} ${now.getHours()}:${now.getMinutes()}`;
    
    const moodCard = document.createElement('div');
    moodCard.className = 'mood-card';
    moodCard.innerHTML = `
        <div class="mood-emoji">${emoji}</div>
        <div class="mood-date">${dateStr}</div>
        <div class="mood-content">${text}</div>
    `;
    
    // 添加动画效果
    moodCard.style.opacity = '0';
    moodCard.style.transform = 'translateY(20px)';
    
    moodGrid.prepend(moodCard);
    
    // 触发动画
    setTimeout(() => {
        moodCard.style.transition = 'all 0.5s ease';
        moodCard.style.opacity = '1';
        moodCard.style.transform = 'translateY(0)';
    }, 10);
}

// 创建爱心粒子效果
function createHeartParticles() {
    for (let i = 0; i < 10; i++) {
        const heart = document.createElement('div');
        heart.className = 'heart-particle';
        heart.innerHTML = '❤️';
        heart.style.left = `${Math.random() * 100}%`;
        heart.style.top = `${Math.random() * 100}%`;
        heart.style.fontSize = `${Math.random() * 20 + 10}px`;
        heart.style.animation = `heart-float ${Math.random() * 2 + 1}s forwards`;
        
        document.body.appendChild(heart);
        
        // 动画结束后移除
        setTimeout(() => {
            heart.remove();
        }, 1000);
    }
}

// 从Supabase加载心情
async function loadMoods() {
    const { data, error } = await supabase
        .from('moods')
        .select('*')
        .order('created_at', { ascending: false });
        
    if (!error && data.length > 0) {
        data.forEach(mood => {
            addMoodCard(mood.emoji, mood.text);
        });
    } else {
        // 默认示例心情
        addMoodCard('😊', '今天天气真好，心情愉悦！');
        addMoodCard('😢', '遇到了一些小挫折，但我会加油的！');
        addMoodCard('🤔', '思考人生中...');
    }
}

// 初始化加载
window.addEventListener('DOMContentLoaded', loadMoods);