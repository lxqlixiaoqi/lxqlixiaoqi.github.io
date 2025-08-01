# Supabase 配置指南

本指南介绍如何将项目连接到Supabase PostgreSQL数据库。

## 配置步骤

1. **获取Supabase连接信息和密码**
   - 登录Supabase控制台
   - 进入您的项目
   - 在左侧菜单中选择"数据库"
   - 点击"连接字符串"
   - 选择"事务池连接"或"会话池连接"
   - 复制连接信息
   - 数据库密码获取方式：
     - 项目创建时生成的初始密码（仅显示一次）
     - 若忘记密码，可在"数据库" > "设置" > "重置密码"中重新生成
     - 密码不会在控制台中显示，重置后请妥善保存
Transaction pooler
Shared Pooler
Ideal for stateless applications like serverless functions where each interaction with Postgres is brief and isolated.

postgresql://postgres.xlifqkkeewtsejxrrabg:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres

Does not support PREPARE statements


View parameters
host:
aws-0-ap-southeast-1.pooler.supabase.com

port:
6543

database:
postgres

user:
postgres.xlifqkkeewtsejxrrabg

pool_mode:
transaction

For security reasons, your database password is never shown.
Suitable for a large number of connected clients
Pre-warmed connection pool to Postgres
IPv4 compatible
Transaction pooler connections are IPv4 proxied for free.
Session pooler
Shared Pooler
Only recommended as an alternative to Direct Connection, when connecting via an IPv4 network.

postgresql://postgres.xlifqkkeewtsejxrrabg:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres



2. **更新数据库配置**
   - 打开 `config.php` 文件
   - 替换 `[YOUR-PASSWORD]` 为您的Supabase数据库密码
   - 根据您选择的连接类型（事务池或会话池），取消相应的注释

3. **创建必要的表**
   在Supabase SQL编辑器中执行以下SQL语句来创建所需的表：

```sql
-- 创建留言表
CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    contact VARCHAR(200),
    content TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 创建日记表
CREATE TABLE diaries (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    weather VARCHAR(50),
    mood VARCHAR(50),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 创建心情表
CREATE TABLE moods (
    id SERIAL PRIMARY KEY,
    emoji VARCHAR(20) NOT NULL,
    text TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

## 注意事项

1. PostgreSQL和MySQL在SQL语法上有一些差异，请确保所有自定义查询都兼容PostgreSQL。
2. 事务池连接(端口6543)不支持PREPARE语句，如果您的代码中使用了预处理语句，请使用会话池连接(端口5432)。
3. 请确保在Supabase控制台中设置了适当的网络访问规则，允许您的应用访问数据库。
4. 出于安全原因，不要在代码中硬编码密码，考虑使用环境变量。

## API密钥说明

Supabase提供了两种类型的API密钥：

1. **可发布密钥(Publishable key)**
   - 用于前端浏览器环境
   - 安全使用的前提是启用了行级别安全性(RLS)和适当的策略
   - 示例: sb_publishable_-9EIdBPsSAzWKE5GhJkjvw_OIfM1tFw

2. **密钥(Secret keys)**
   - 用于后端服务器环境
   - 提供对项目API的特权访问
   - 示例: sb_secret_PMUtDl4uy3IKlNTyrPReWw_sHeZj0qP
   - 切勿在客户端代码中暴露此密钥

## API密钥与数据库密码的区别

**API密钥不能代替数据库密码**，原因如下：

1. **用途不同**：
   - 数据库密码用于直接连接到PostgreSQL数据库服务器
   - API密钥用于访问Supabase提供的REST API或其他服务

2. **认证机制不同**：
   - 数据库连接使用传统的用户名/密码认证
   - API调用使用密钥进行身份验证

3. **当前项目架构**：
   - 本项目通过PDO直接连接数据库，需要数据库密码
   - 若要使用API密钥，需重构项目以使用Supabase的REST API或客户端库

**安全建议：**
- 不要将密钥或密码硬编码在代码中
- 使用环境变量存储敏感信息
- 定期轮换密钥和密码
- 为不同环境(开发、生产)使用不同的凭证

## 故障排除

- 如果连接失败，请检查您的密码和连接信息是否正确。
- 确保您的Supabase项目已启用PostgreSQL扩展。
- 检查网络访问规则是否允许您的IP地址访问数据库。