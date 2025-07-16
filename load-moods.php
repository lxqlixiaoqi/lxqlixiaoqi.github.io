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

// 查询心情数据
$sql = "SELECT * FROM moods ORDER BY created_at DESC";
$result = $conn->query($sql);

$moods = [];
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $moods[] = $row;
    }
}

echo json_encode($moods);
$conn->close();