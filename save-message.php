<?php
// 关闭错误显示，避免非JSON内容污染响应
error_reporting(0);
ini_set('display_errors', 0);
// 设置CORS和响应头
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
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
// 验证JSON解析是否成功
if (!$data) {
    die(json_encode(['success' => false, 'error' => '接收数据格式错误']));
}
$content = $conn->real_escape_string($data['content']);
$name = $conn->real_escape_string($data['name']);
// 检查contact字段是否存在，不存在则设为空
$contact = isset($data['contact']) ? $conn->real_escape_string($data['contact']) : '';
// 移除前端传递的created_at，使用数据库默认值

// 预处理插入留言数据（假设留言表名为messages）
$stmt = $conn->prepare("INSERT INTO messages (name, contact, content) VALUES (?, ?, ?)");
if (!$stmt) {
    die(json_encode(['success' => false, 'error' => '预处理语句失败: ' . $conn->error]));
}
$stmt->bind_param("sss", $name, $contact, $content);

if ($stmt->execute() === TRUE) {
    $lastId = $conn->insert_id;
    $selectSql = "SELECT id, name, contact, content, created_at FROM messages WHERE id = ?";
    $selectStmt = $conn->prepare($selectSql);
    $selectStmt->bind_param("i", $lastId);
    $selectStmt->execute();
    $result = $selectStmt->get_result();
    $message = $result->fetch_assoc();
    echo json_encode(['success' => true, 'message' => $message]);
} else {
    echo json_encode(['success' => false, 'error' => '保存失败: ' . $conn->error]);
}

$conn->close();