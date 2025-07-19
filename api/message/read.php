<?php
// 捕获致命错误
register_shutdown_function(function() {
    $error = error_get_last();
    if ($error && in_array($error['type'], [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR])) {
        http_response_code(500);
        header('Content-Type: application/json');
        echo json_encode(['success' => false, 'error' => '服务器内部错误']);
    }
});
error_reporting(0);
ini_set('display_errors', 0);
// 留言板加载接口
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

    // 查询留言数据（按创建时间倒序）
    // 使用MySQL JSON函数直接生成JSON
    $stmt = $pdo->query("SELECT JSON_ARRAYAGG(JSON_OBJECT('id', id, 'name', name, 'contact', contact, 'content', content, 'created_at', created_at)) AS messages_json FROM messages ORDER BY created_at DESC");
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    $jsonData = $result['messages_json'] ?? '[]';

    // 直接输出JSON数据
    echo '{"success": true, "data": ' . $jsonData . '}';
} catch (PDOException $e) {
    // 记录详细错误日志（使用config.php配置的日志路径）
    error_log("[数据库错误] {$e->getMessage()} 行号: {$e->getLine()}", 3, __DIR__.'/../../php_errors.log');
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => '数据加载失败，请稍后重试']);
} catch (Exception $e) {
    error_log("[服务器错误] {$e->getMessage()} 行号: {$e->getLine()}", 3, __DIR__.'/../../php_errors.log');
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => '服务器异常，请联系管理员']);
} finally {
    // 关闭数据库连接
    $pdo = null;
}
