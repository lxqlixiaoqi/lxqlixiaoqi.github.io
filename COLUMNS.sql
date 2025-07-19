-- phpMyAdmin SQL Dump
-- version 4.9.0.1
-- https://www.phpmyadmin.net/
--
-- 主机： sql309.infinityfree.com
-- 生成日期： 2025-07-19 07:39:39
-- 服务器版本： 11.4.7-MariaDB
-- PHP 版本： 7.2.22

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- 数据库： `INFORMATION_SCHEMA`
--

-- --------------------------------------------------------

--
-- 表的结构 `COLUMNS`
--

CREATE TEMPORARY TABLE `COLUMNS` (
  `TABLE_CATALOG` varchar(512) NOT NULL,
  `TABLE_SCHEMA` varchar(64) NOT NULL,
  `表名` varchar(64) NOT NULL,
  `字段名` varchar(64) NOT NULL,
  `ORDINAL_POSITION` bigint(21) UNSIGNED NOT NULL,
  `默认值` longtext,
  `是否允许为空` varchar(3) NOT NULL,
  `数据类型` varchar(64) NOT NULL,
  `CHARACTER_MAXIMUM_LENGTH` bigint(21) UNSIGNED,
  `CHARACTER_OCTET_LENGTH` bigint(21) UNSIGNED,
  `NUMERIC_PRECISION` bigint(21) UNSIGNED,
  `NUMERIC_SCALE` bigint(21) UNSIGNED,
  `DATETIME_PRECISION` bigint(21) UNSIGNED,
  `CHARACTER_SET_NAME` varchar(32),
  `COLLATION_NAME` varchar(64),
  `COLUMN_TYPE` longtext NOT NULL,
  `索引类型` varchar(3) NOT NULL,
  `额外信息` varchar(80) NOT NULL,
  `PRIVILEGES` varchar(80) NOT NULL,
  `字段注释` varchar(1024) NOT NULL,
  `IS_GENERATED` varchar(6) NOT NULL,
  `GENERATION_EXPRESSION` longtext,
  `IS_SYSTEM_TIME_PERIOD_START` varchar(3) NOT NULL,
  `IS_SYSTEM_TIME_PERIOD_END` varchar(3) NOT NULL
) ENGINE=Aria DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- 转存表中的数据 `COLUMNS`
--

INSERT INTO `COLUMNS` (`表名`, `字段名`, `数据类型`, `是否允许为空`, `默认值`, `索引类型`, `额外信息`, `字段注释`) VALUES
('diaries', 'id', 'int', 'NO', NULL, 'PRI', 'auto_increment', '主键ID'),
('diaries', 'content', 'text', 'NO', NULL, '', '', '日记内容'),
('diaries', 'weather', 'varchar', 'YES', 'NULL', '', '', '天气状况'),
('diaries', 'mood', 'varchar', 'YES', 'NULL', '', '', '心情状态'),
('diaries', 'created_at', 'datetime', 'YES', 'current_timestamp()', '', '', '创建时间'),
('messages', 'id', 'int', 'NO', NULL, 'PRI', 'auto_increment', '唯一ID'),
('messages', 'name', 'varchar', 'NO', NULL, '', '', '留言者姓名'),
('messages', 'contact', 'varchar', 'YES', 'NULL', '', '', '联系方式（邮箱/电话）'),
('messages', 'content', 'text', 'NO', NULL, '', '', '留言内容'),
('messages', 'created_at', 'timestamp', 'YES', 'current_timestamp()', '', '', '留言时间'),
('moods', 'id', 'int', 'NO', NULL, 'PRI', 'auto_increment', '主键ID'),
('moods', 'emoji', 'varchar', 'NO', NULL, '', '', '心情表情'),
('moods', 'text', 'text', 'NO', NULL, '', '', '心情文字'),
('moods', 'created_at', 'datetime', 'YES', 'current_timestamp()', '', '', '创建时间');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
