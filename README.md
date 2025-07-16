# 蘑菇的小站

个人博客网站，包含心情墙、日记、留言板等功能，支持动态蘑菇雨特效，通过PHP与MySQL数据库交互实现数据存储。

## 功能特性
- **心情墙**：发布带表情的心情动态，支持自动加载历史记录
- **电子日记**：撰写并保存带标题的日记内容
- **留言板**：访客留下姓名、联系方式和留言信息
- **动态特效**：页面顶部飘落可爱蘑菇雨（原樱花雨改造）
- **响应式设计**：适配不同屏幕尺寸（手机/平板/PC）

## 目录结构
```
├── .vscode/          # VSCode配置
├── scripts/          # JavaScript脚本
│   ├── _shared/      # 共享工具类
│   ├── diary.js      # 日记功能逻辑
│   ├── mood-wall.js  # 心情墙功能逻辑
│   └── sakura.js     # 蘑菇雨特效（原樱花雨）
├── styles/           # CSS样式
│   └── main.css      # 全局样式
├── *.html            # 页面文件（首页/日记/留言等）
├── *.php             # 后端接口（数据存储/加载）
└── README.md         # 当前说明文件
```

## 安装与配置
### 环境要求
- Web服务器（如Apache/Nginx）
- PHP 7.4+（需开启PDO MySQL扩展）
- MySQL 5.7+ 数据库

### 数据库初始化
执行以下SQL创建必要数据表（需提前创建数据库）：
```sql
-- 心情表
CREATE TABLE moods (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  emoji VARCHAR(10) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 日记表
CREATE TABLE diary (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 留言表
CREATE TABLE messages (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  contact VARCHAR(100),
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### 配置后端接口
修改各PHP文件中的数据库连接信息（示例在`save-mood.php`中）：
```php
$pdo = new PDO('mysql:host=localhost;dbname=your_db;charset=utf8mb4', 'username', 'password');
```

## 运行与测试
1. 将项目文件部署到Web服务器根目录
2. 访问`index.html`查看首页
3. 测试功能：
   - 心情墙：输入内容点击发布，检查数据库是否新增记录
   - 日记：填写标题和内容提交，验证列表页是否显示
   - 留言板：输入信息提交，确认后台能正确接收

## 技术栈
- 前端：HTML5/CSS3/JavaScript（ES6+）
- 后端：PHP（原生）
- 数据库：MySQL
- 特效：自定义JavaScript动画（蘑菇雨）

## 贡献说明
欢迎提交Issue反馈问题或PR优化代码，提交前请确保：
- 新功能添加测试用例
- 修改后本地测试无错误
- 代码风格与现有文件保持一致