<?php
error_reporting(0);
ini_set('display_errors', 0);
// 心情墙创建接口
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
if (!isset($data['emoji']) || !isset($data['text'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => '表情和心情文字不能为空']);
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
    $stmt = $pdo->prepare("INSERT INTO moods (emoji, text) VALUES (?, ?)");
    $stmt->execute([
        $data['emoji'],
        $data['text']
    ]);

    // 获取新创建的心情ID
    $moodId = $pdo->lastInsertId();

    // 查询新创建的心情完整信息
    $stmt = $pdo->prepare("SELECT id, emoji, text, created_at FROM moods WHERE id = ?");
    $stmt->execute([$moodId]);
    $mood = $stmt->fetch(PDO::FETCH_ASSOC);

    // 返回成功响应
    // 获取新创建的心情ID
    $moodId = $pdo->lastInsertId();
    
    // 使用MySQL JSON函数返回新创建的心情
    $stmt = $pdo->prepare("SELECT JSON_OBJECT('id', id, 'emoji', emoji, 'text', text, 'created_at', created_at) AS mood_json FROM moods WHERE id = ?");
    $stmt->execute([$moodId]);
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    $jsonData = $result['mood_json'] ?? '{}';

    // 直接输出JSON数据
    echo '{"success": true, "message": "心情添加成功", "data": ' . $jsonData . '}';
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => '数据库错误: ' . $e->getMessage()]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => '服务器错误: ' . $e->getMessage()]);
}