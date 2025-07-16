<?php
header('Content-Type: application/json');

// 数据库配置（与日记、留言共用）
$host = 'sql309.infinityfree.com';
$user = 'if0_39452447';
$password = 'wyz831201';
$database = 'if0_39452447_lxqdata';
$port = 3306;

// 创建连接
$conn = new mysqli($host, $user, $password, $database, $port);

// 检查连接
if ($conn->connect_error) {
    die(json_encode(['success' => false, 'error' => '连接失败: ' . $conn->connect_error]));
}

// 获取前端提交的心情数据
$data = json_decode(file_get_contents('php://input'), true);
$emoji = $conn->real_escape_string($data['emoji']);
$text = $conn->real_escape_string($data['text']);
$created_at = $conn->real_escape_string($data['created_at']);

// 插入心情数据（假设心情表名为moods）
$sql = "INSERT INTO moods (emoji, text, created_at) VALUES ('$emoji', '$text', '$created_at')";

if ($conn->query($sql) === TRUE) {
    echo json_encode(['success' => true, 'message' => '心情保存成功']);
} else {
    echo json_encode(['success' => false, 'error' => '保存失败: ' . $conn->error]);
}

$conn->close();