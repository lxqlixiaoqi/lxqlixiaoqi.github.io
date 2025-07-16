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