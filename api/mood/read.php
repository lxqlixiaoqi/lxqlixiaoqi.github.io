<?php
error_reporting(0);
ini_set('display_errors', 0);
// 心情墙加载接口
require_once '../../config.php';

// 设置CORS和响应头
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// 处理预检请求
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

try {
    // 连接数据库
    $pdo = new PDO(
        "mysql:host=".DB_HOST.";dbname=".DB_NAME.";charset=utf8mb4",
        DB_USER,
        DB_PASS,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );

    // 查询心情数据（按创建时间倒序）
    // 使用MySQL JSON函数直接生成JSON
    $stmt = $pdo->query("SELECT JSON_ARRAYAGG(JSON_OBJECT('id', id, 'emoji', emoji, 'text', text, 'created_at', created_at)) AS mood_json FROM moods ORDER BY created_at DESC");
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    $jsonData = $result['mood_json'] ?? '[]';

    // 直接输出JSON数据
    echo '{"success": true, "data": ' . $jsonData . '}';
} catch (PDOException $e) {
    http_response_code(500);
    echo '{"success": false, "error": "数据库错误: ' . addslashes($e->getMessage()) . '"}';
} catch (Exception $e) {
    http_response_code(500);
    echo '{"success": false, "error": "服务器错误: ' . addslashes($e->getMessage()) . '"}';
}