<?php
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

// 获取前端提交的留言数据
$data = json_decode(file_get_contents('php://input'), true);
$content = $conn->real_escape_string($data['content']);
$name = $conn->real_escape_string($data['name']);
$created_at = $conn->real_escape_string($data['created_at']);

// 插入留言数据（假设留言表名为messages）
$sql = "INSERT INTO messages (name, contact, content, created_at) VALUES ('$name', '$contact', '$content', '$created_at')";

if ($conn->query($sql) === TRUE) {
    echo json_encode(['success' => true, 'message' => '留言保存成功']);
} else {
    echo json_encode(['success' => false, 'error' => '保存失败: ' . $conn->error]);
}

$conn->close();