// 星座计算和运势展示功能
const zodiacSigns = {
    '白羊座': { dateRange: '3月21日-4月19日', emoji: '♈' },
    '金牛座': { dateRange: '4月20日-5月20日', emoji: '♉' },
    '双子座': { dateRange: '5月21日-6月21日', emoji: '♊' },
    '巨蟹座': { dateRange: '6月22日-7月22日', emoji: '♋' },
    '狮子座': { dateRange: '7月23日-8月22日', emoji: '♌' },
    '处女座': { dateRange: '8月23日-9月22日', emoji: '♍' },
    '天秤座': { dateRange: '9月23日-10月23日', emoji: '♎' },
    '天蝎座': { dateRange: '10月24日-11月22日', emoji: '♏' },
    '射手座': { dateRange: '11月23日-12月21日', emoji: '♐' },
    '摩羯座': { dateRange: '12月22日-1月19日', emoji: '♑' },
    '水瓶座': { dateRange: '1月20日-2月18日', emoji: '♒' },
    '双鱼座': { dateRange: '2月19日-3月20日', emoji: '♓' }
};

const fortunes = [
    '今天你会遇到意想不到的惊喜！✨',
    '幸运星正在照耀着你，大胆追求梦想吧！🌟',
    '保持微笑，美好的事情即将发生！😊',
    '今天适合尝试新事物，会有意外收获！🎁',
    '你的创意灵感爆棚，适合创作或学习！📚',
    '人际关系运势极佳，多和朋友交流吧！👭',
    '今天是你发光发热的日子，展现自我吧！💫',
    '放松心情，享受生活中的小确幸！☕',
    '保持积极心态，好运自然来！🌈',
    '今天适合规划未来，会有清晰方向！🧭'
];

function getZodiacSign(birthMonth, birthDay) {
    if ((birthMonth === 3 && birthDay >= 21) || (birthMonth === 4 && birthDay <= 19)) return '白羊座';
    if ((birthMonth === 4 && birthDay >= 20) || (birthMonth === 5 && birthDay <= 20)) return '金牛座';
    if ((birthMonth === 5 && birthDay >= 21) || (birthMonth === 6 && birthDay <= 21)) return '双子座';
    if ((birthMonth === 6 && birthDay >= 22) || (birthMonth === 7 && birthDay <= 22)) return '巨蟹座';
    if ((birthMonth === 7 && birthDay >= 23) || (birthMonth === 8 && birthDay <= 22)) return '狮子座';
    if ((birthMonth === 8 && birthDay >= 23) || (birthMonth === 9 && birthDay <= 22)) return '处女座';
    if ((birthMonth === 9 && birthDay >= 23) || (birthMonth === 10 && birthDay <= 23)) return '天秤座';
    if ((birthMonth === 10 && birthDay >= 24) || (birthMonth === 11 && birthDay <= 22)) return '天蝎座';
    if ((birthMonth === 11 && birthDay >= 23) || (birthMonth === 12 && birthDay <= 21)) return '射手座';
    if ((birthMonth === 12 && birthDay >= 22) || (birthMonth === 1 && birthDay <= 19)) return '摩羯座';
    if ((birthMonth === 1 && birthDay >= 20) || (birthMonth === 2 && birthDay <= 18)) return '水瓶座';
    return '双鱼座';
}

function getRandomFortune() {
    return fortunes[Math.floor(Math.random() * fortunes.length)];
}

function displayHoroscope() {
    const birthDate = document.getElementById('birthDate').value;
    if (!birthDate) {
        alert('请先输入你的生日日期！');
        return;
    }
    
    const [year, month, day] = birthDate.split('-').map(Number);
    const sign = getZodiacSign(month, day);
    const signInfo = zodiacSigns[sign];
    const fortune = getRandomFortune();
    
    document.getElementById('zodiacResult').innerHTML = `
        <h3>你的星座是: ${sign} ${signInfo.emoji}</h3>
        <p>日期范围: ${signInfo.dateRange}</p>
        <div class="fortune-box">
            <p class="fortune-text">${fortune}</p>
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('horoscopeForm').addEventListener('submit', (e) => {
        e.preventDefault();
        displayHoroscope();
    });
});