<?php
/**
 * 数据库连接工具类
 * 提供统一的数据库连接和基础操作
 */
class Database {
    private static $instance = null;
    private $pdo;

    // 私有构造函数，防止直接实例化
    private function __construct() {
        try {
            // 从配置文件获取数据库信息
            require_once $_SERVER['DOCUMENT_ROOT'] . '/config.php';

            // 创建PDO连接
            $this->pdo = new PDO(
                "mysql:host=".DB_HOST.";dbname=".DB_NAME.";charset=utf8mb4",
                DB_USER,
                DB_PASS,
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false
                ]
            );
        } catch (PDOException $e) {
            // 记录连接错误
            error_log("数据库连接失败: " . $e->getMessage(), 3, $_SERVER['DOCUMENT_ROOT'] . '/php_errors.log');
            throw new Exception("数据库连接失败: " . $e->getMessage());
        }
    }

    // 单例模式获取数据库连接实例
    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    // 获取PDO对象
    public function getPdo() {
        return $this->pdo;
    }

    // 防止克隆
    private function __clone() {}

    // 防止反序列化
    private function __wakeup() {}

    /**
     * 执行查询并返回结果
     * @param string $sql SQL语句
     * @param array $params 参数数组
     * @return array 查询结果
     */
    public function query($sql, $params = []) {
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    /**
     * 执行增删改操作
     * @param string $sql SQL语句
     * @param array $params 参数数组
     * @return int 受影响的行数
     */
    public function execute($sql, $params = []) {
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt->rowCount();
    }

    /**
     * 获取最后插入的ID
     * @return string 最后插入的ID
     */
    public function lastInsertId() {
        return $this->pdo->lastInsertId();
    }
}

// 提供便捷的数据库访问函数
function getDB() {
    return Database::getInstance()->getPdo();
}

// 设置JSON响应头
header('Content-Type: application/json; charset=utf-8');

// 设置CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// 处理OPTIONS请求
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}