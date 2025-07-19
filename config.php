<?php
// 强制JSON响应头（防HTML解析错误）
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

// 全局错误处理（转JSON输出）
error_reporting(E_ALL);
ini_set('display_errors', '0');
ini_set('log_errors', '1');
ini_set('error_log', __DIR__.'/php_errors.log');
set_error_handler(function($errno, $errstr, $errfile, $errline) {
    http_response_code(500);
echo json_encode(['success' => false, 'error' => "PHP错误: $errstr (行$errline)"]);
exit;
});

// 数据库配置（根据用户提供的MySQL信息设置）
define('DB_HOST', 'sql309.infinityfree.com');
define('DB_USER', 'if0_39452447');
define('DB_PASS', 'wyz831201');
define('DB_NAME', 'if0_39452447_lxqdata');
define('DB_PORT', 3306);