<?php
// 关闭错误显示，避免非JSON内容污染响应
error_reporting(0);
ini_set('display_errors', 0);
header('Content-Type: application/json');

// 引入集中配置
require_once 'config.php';

// 创建连接
$conn = new mysqli($host, $user, $password, $database, $port);

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
$stmt->bind_param("ssss", $content, $weather, $mood, $created_at);

if ($stmt->execute() === TRUE) {
    echo json_encode(['success' => true, 'message' => '日记保存成功']);
} else {
    echo json_encode(['success' => false, 'error' => '保存失败: ' . $conn->error]);
}

$conn->close();