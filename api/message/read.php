<?php
/**
 * 留言板数据读取接口
 * 从messages表获取所有留言并返回JSON格式数据
 */

// 包含数据库连接工具
require_once $_SERVER['DOCUMENT_ROOT'] . '/api/database/db_connect.php';

try {
    // 获取数据库连接
    $db = getDB();

    // 查询留言数据（按创建时间倒序）
    $stmt = $db->query('SELECT id, name, contact, content, created_at FROM messages ORDER BY created_at DESC');
    $messages = $stmt->fetchAll();

    // 返回成功响应
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'data' => $messages,
        'count' => count($messages)
    ]);
} catch (Exception $e) {
    // 记录错误日志
    error_log('留言读取错误: ' . $e->getMessage(), 3, $_SERVER['DOCUMENT_ROOT'] . '/php_errors.log');

    // 返回错误响应
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => '无法加载留言数据',
        'details' => $e->getMessage()
    ]);
}
