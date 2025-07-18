<?php
// 关闭错误显示，避免非JSON内容污染响应
error_reporting(0);
ini_set('display_errors', 0);
header('Content-Type: application/json');

// 引入集中配置
require_once 'config.php';

// 从config.php获取数据库配置
$host = DB_HOST;
$user = DB_USER;
$password = DB_PASS;
$database = DB_NAME;
$port = DB_PORT;

// 创建连接
$conn = new mysqli($host, $user, $password, $database, $port);

// 检查连接
if ($conn->connect_error) {
    die(json_encode(['success' => false, 'error' => '连接失败: ' . $conn->connect_error]));
}

// 获取前端提交的心情数据
$data = json_decode(file_get_contents('php://input'), true);
// 验证JSON解析是否成功
if (!$data) {
    die(json_encode(['success' => false, 'error' => '接收数据格式错误']));
}
$emoji = $conn->real_escape_string($data['emoji']);
$text = $conn->real_escape_string($data['text']);
$created_at = $conn->real_escape_string($data['created_at']);

// 预处理插入心情数据（假设心情表名为moods）
$stmt = $conn->prepare("INSERT INTO moods (emoji, text, created_at) VALUES (?, ?, ?)");
$stmt->bind_param("sss", $emoji, $text, $created_at);

if ($stmt->execute() === TRUE) {
    $lastId = $conn->insert_id;
    $selectSql = "SELECT emoji, text, created_at FROM moods WHERE id = ?";
    $selectStmt = $conn->prepare($selectSql);
    $selectStmt->bind_param("i", $lastId);
    $selectStmt->execute();
    $result = $selectStmt->get_result();
    $mood = $result->fetch_assoc();
    echo json_encode(['success' => true, 'mood' => $mood]);
} else {
    echo json_encode(['success' => false, 'error' => '保存失败: ' . $conn->error]);
}

$conn->close();