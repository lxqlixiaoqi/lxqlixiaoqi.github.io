<?php
/**
 * 心情墙数据读取接口
 * 从moods表获取所有心情记录并返回JSON格式数据
 */

// 包含数据库连接工具
require_once $_SERVER['DOCUMENT_ROOT'] . '/api/database/db_connect.php';

try {
    // 获取数据库连接
    $db = getDB();

    // 查询心情数据（按创建时间倒序）
    $stmt = $db->query('SELECT id, emoji, text, created_at FROM moods ORDER BY created_at DESC');
    $moods = $stmt->fetchAll();

    // 返回成功响应
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'data' => $moods,
        'count' => count($moods)
    ]);
} catch (Exception $e) {
    // 记录错误日志
    error_log('心情墙读取错误: ' . $e->getMessage(), 3, $_SERVER['DOCUMENT_ROOT'] . '/php_errors.log');

    // 返回错误响应
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => '无法加载心情墙数据',
        'details' => $e->getMessage()
    ]);
}
