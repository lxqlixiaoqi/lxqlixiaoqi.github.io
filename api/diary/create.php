<?php
error_reporting(0);
ini_set('display_errors', 0);
// 日记创建接口
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
if (!isset($data['content'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => '日记内容不能为空']);
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
    $stmt = $pdo->prepare("INSERT INTO diaries (content, weather, mood) VALUES (?, ?, ?)");
    $stmt->execute([
        $data['content'],
        $data['weather'] ?? null,
        $data['mood'] ?? null
    ]);

    // 获取新创建的日记ID
    $diaryId = $pdo->lastInsertId();

    // 查询新创建的日记完整信息
    $stmt = $pdo->prepare("SELECT id, content, weather, mood, created_at FROM diaries WHERE id = ?");
    $stmt->execute([$diaryId]);
    $diary = $stmt->fetch(PDO::FETCH_ASSOC);

    // 返回成功响应
    // 使用MySQL JSON函数返回新创建的日记
    // 使用MySQL JSON函数返回新创建的日记
    // 获取新创建的日记ID
    $diaryId = $pdo->lastInsertId();
    
    // 使用MySQL JSON函数返回新创建的日记
    $stmt = $pdo->prepare("SELECT JSON_OBJECT('id', id, 'content', content, 'weather', weather, 'mood', mood, 'created_at', created_at) AS diary_json FROM diaries WHERE id = ?");
    $stmt->execute([$diaryId]);
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    $jsonData = $result['diary_json'] ?? '{}';

    // 直接输出JSON数据
    echo '{"success": true, "message": "日记创建成功", "data": ' . $jsonData . '}';
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => '数据库错误: ' . $e->getMessage()]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => '服务器错误: ' . $e->getMessage()]);
}