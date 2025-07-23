<?php
/**
 * 日记数据提交接口
 * 接收并存储新日记到diaries表
 */

// 包含数据库连接工具
require_once $_SERVER['DOCUMENT_ROOT'] . '/api/database/db_connect.php';

// 验证请求方法
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'error' => '只允许POST请求'
    ]);
    exit();
}

// 获取并验证请求数据
$input = json_decode(file_get_contents('php://input'), true);

// 验证必填字段
if (empty($input['content'])) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => '日记内容为必填项'
    ]);
    exit();
}

try {
    // 获取数据库连接
    $db = getDB();

    // 准备并执行插入语句
    $stmt = $db->prepare(
        'INSERT INTO diaries (content, weather, mood, created_at) 
        VALUES (:content, :weather, :mood, CURRENT_TIMESTAMP())'
    );

    $stmt->execute([
        ':content' => trim($input['content']),
        ':weather' => isset($input['weather']) ? trim($input['weather']) : null,
        ':mood' => isset($input['mood']) ? trim($input['mood']) : null
    ]);

    // 获取新插入记录的ID
    $newId = $db->lastInsertId();

    // 返回成功响应
    http_response_code(201);
    echo json_encode([
        'success' => true,
        'message' => '日记创建成功',
        'data' => [
            'id' => $newId,
            'content' => $input['content'],
            'weather' => $input['weather'] ?? null,
            'mood' => $input['mood'] ?? null,
            'created_at' => date('Y-m-d H:i:s')
        ]
    ]);
} catch (Exception $e) {
    // 记录错误日志
    error_log('日记创建错误: ' . $e->getMessage(), 3, $_SERVER['DOCUMENT_ROOT'] . '/php_errors.log');

    // 返回错误响应
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => '日记创建失败',
        'details' => $e->getMessage()
    ]);
}