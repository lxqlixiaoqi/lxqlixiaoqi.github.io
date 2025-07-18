<?php
// 关闭错误显示，避免非JSON内容污染响应
error_reporting(0);
ini_set('display_errors', 0);
header('Content-Type: application/json');

// 引入集中配置
require_once 'config.php';

// 创建连接
$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME, DB_PORT);

// 检查连接
if ($conn->connect_error) {
    die(json_encode(['success' => false, 'error' => '连接失败: ' . $conn->connect_error]));
}

// 获取前端提交的数据
$data = json_decode(file_get_contents('php://input'), true);
if (!$data) {
    die(json_encode(['success' => false, 'error' => '接收数据格式错误']));
} // 验证JSON解析是否成功
$content = $conn->real_escape_string($data['content']);
$weather = $conn->real_escape_string($data['weather']);
$mood = $conn->real_escape_string($data['mood']);
$created_at = $conn->real_escape_string($data['created_at']);

// 插入数据
$stmt = $conn->prepare("INSERT INTO diaries (content, weather, mood, created_at) VALUES (?, ?, ?, ?)");
if (!$stmt) {
    die(json_encode(['success' => false, 'error' => '预处理语句失败: ' . $conn->error]));
}
$stmt->bind_param("ssss", $content, $weather, $mood, $created_at);

if ($stmt->execute() === TRUE) {
    $lastId = $conn->insert_id;
    $selectSql = "SELECT content, weather, mood, created_at FROM diaries WHERE id = ?";
    $selectStmt = $conn->prepare($selectSql);
    $selectStmt->bind_param("i", $lastId);
    $selectStmt->execute();
    $result = $selectStmt->get_result();
    $diary = $result->fetch_assoc();
    echo json_encode(['success' => true, 'diary' => $diary]);
} else {
    echo json_encode(['success' => false, 'error' => '保存失败: ' . $conn->error]);
}

$conn->close();