<?php
/**
 * 日记数据读取接口
 * 从diaries表获取所有日记并返回JSON格式数据
 */

// 包含数据库连接工具
require_once $_SERVER['DOCUMENT_ROOT'] . '/api/database/db_connect.php';

try {
    // 获取数据库连接
    $db = getDB();

    // 查询日记数据（按创建时间倒序）
    $stmt = $db->query('SELECT id, content, weather, mood, created_at FROM diaries ORDER BY created_at DESC');
    $diaries = $stmt->fetchAll();

    // 返回成功响应
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'data' => $diaries,
        'count' => count($diaries)
    ]);
} catch (Exception $e) {
    // 记录错误日志
    error_log('日记读取错误: ' . $e->getMessage(), 3, $_SERVER['DOCUMENT_ROOT'] . '/php_errors.log');

    // 返回错误响应
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => '无法加载日记数据',
        'details' => $e->getMessage()
    ]);
}