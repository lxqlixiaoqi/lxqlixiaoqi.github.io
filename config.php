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

// Supabase数据库配置
// 直接连接（适用于长连接应用）
// define('DB_URL', 'postgresql://postgres:[YOUR-PASSWORD]@db.xlifqkkeewtsejxrrabg.supabase.co:5432/postgres');

// 事务池连接（适用于无状态应用，IPv4兼容）
define('DB_HOST', 'aws-0-ap-southeast-1.pooler.supabase.com');
define('DB_USER', 'postgres.xlifqkkeewtsejxrrabg');
define('DB_PASS', 'wangyuzhen831201'); // 数据库密码
define('DB_NAME', 'postgres');
define('DB_PORT', 6543);

// 如需使用会话池连接，取消下面注释并注释上面的事务池配置
// define('DB_HOST', 'aws-0-ap-southeast-1.pooler.supabase.com');
// define('DB_USER', 'postgres.xlifqkkeewtsejxrrabg');
// define('DB_PASS', '[YOUR-PASSWORD]'); // 用户需要替换为实际密码
// define('DB_NAME', 'postgres');
// define('DB_PORT', 5432);