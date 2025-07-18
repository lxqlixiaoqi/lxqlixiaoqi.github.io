<?php
// 关闭错误显示，避免非JSON内容污染响应
error_reporting(0);
ini_set('display_errors', 0);
require_once 'config.php';

header('Content-Type: application/json');

try {
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME, DB_PORT);
    if ($conn->connect_error) {
        throw new Exception('数据库连接失败: ' . $conn->connect_error);
    }

    $sql = "SELECT content, weather, mood, created_at FROM diaries ORDER BY created_at DESC";
    $result = $conn->query($sql);
    if (!$result) {
        throw new Exception('查询失败: ' . $conn->error);
    }

    $diaries = [];
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $diaries[] = $row;
        }
    }

    echo json_encode($diaries);
    $conn->close();

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>