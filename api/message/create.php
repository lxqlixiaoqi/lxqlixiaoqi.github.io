<?php
error_reporting(0);
ini_set('display_errors', 0);
// 留言板创建接口
require_once '../../config.php';

// 设置CORS和响应头
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// 处理预检请求
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// 获取POST数据
$data = json_decode(file_get_contents('php://input'), true);

// 验证必填字段
if (!isset($data['name']) || !isset($data['content'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => '姓名和留言内容不能为空']);
    exit;
}

try {
    // 连接数据库
    $pdo = new PDO(
        "mysql:host=".DB_HOST.";dbname=".DB_NAME.";charset=utf8mb4",
        DB_USER,
        DB_PASS,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );

    // 准备SQL语句
    $stmt = $pdo->prepare("INSERT INTO messages (name, contact, content) VALUES (?, ?, ?)");
    $stmt->execute([
        $data['name'],
        $data['contact'] ?? null,
        $data['content']
    ]);

    // 获取新创建的留言ID
    $messageId = $pdo->lastInsertId();

    // 查询新创建的留言完整信息
    $stmt = $pdo->prepare("SELECT id, name, contact, content, created_at FROM messages WHERE id = ?");
    $stmt->execute([$messageId]);
    $message = $stmt->fetch(PDO::FETCH_ASSOC);

    // 返回成功响应
    echo json_encode([
        'success' => true,
        'message' => '留言提交成功',
        'data' => $message
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => '数据库错误: ' . $e->getMessage()]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => '服务器错误: ' . $e->getMessage()]);
}