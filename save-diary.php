<?php
header('Content-Type: application/json');

// 数据库配置
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

// 获取前端提交的数据
$data = json_decode(file_get_contents('php://input'), true);
$content = $conn->real_escape_string($data['content']);
$weather = $conn->real_escape_string($data['weather']);
$mood = $conn->real_escape_string($data['mood']);
$created_at = $conn->real_escape_string($data['created_at']);

// 插入数据
$sql = "INSERT INTO diaries (content, weather, mood, created_at) VALUES ('$content', '$weather', '$mood', '$created_at')";

if ($conn->query($sql) === TRUE) {
    echo json_encode(['success' => true, 'message' => '日记保存成功']);
} else {
    echo json_encode(['success' => false, 'error' => '保存失败: ' . $conn->error]);
}

$conn->close();