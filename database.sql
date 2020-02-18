-- phpMyAdmin SQL Dump
-- version 4.8.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Jan 28, 2020 at 06:29 AM
-- Server version: 5.7.24
-- PHP Version: 5.6.40

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `knowyourgene`
--

-- --------------------------------------------------------

--
-- Table structure for table `packages`
--

DROP TABLE IF EXISTS `packages`;
CREATE TABLE IF NOT EXISTS `packages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  `percentage` float NOT NULL,
  `min_test_range` int(11) NOT NULL,
  `max_test_range` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `packages`
--

INSERT INTO `packages` (`id`, `name`, `percentage`, `min_test_range`, `max_test_range`) VALUES
(1, 'P1', 10, 0, 10),
(2, 'P2', 12, 11, 50),
(3, 'P3', 15, 51, 100),
(4, 'P4', 20, 101, 200);

-- --------------------------------------------------------

--
-- Table structure for table `test_master`
--

DROP TABLE IF EXISTS `test_master`;
CREATE TABLE IF NOT EXISTS `test_master` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `test` varchar(150) NOT NULL,
  `mrp` float NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `test_master`
--

INSERT INTO `test_master` (`id`, `test`, `mrp`) VALUES
(1, 'Wellness', 15000),
(2, 'Skin', 16000),
(3, 'Cardiomet', 12000);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` varchar(100) NOT NULL,
  `parent_id` varchar(100) NOT NULL,
  `email` varchar(500) NOT NULL,
  `password` varchar(200) NOT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'A',
  `ref_code` varchar(20) NOT NULL,
  `datetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `user_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=72 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`Id`, `user_id`, `parent_id`, `email`, `password`, `status`, `ref_code`, `datetime`) VALUES
(20, '191018020', 'root', 'aakashmourya03@gmail.com', '123', 'A', '', '2019-10-18 10:35:52'),
(71, '202001240071', '191018020', 'wephyre.aakashmourya@gmail.com', '123', 'A', 'R20200071', '2020-01-24 13:07:53');

-- --------------------------------------------------------

--
-- Table structure for table `user_contracts`
--

DROP TABLE IF EXISTS `user_contracts`;
CREATE TABLE IF NOT EXISTS `user_contracts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `contract_no` varchar(100) NOT NULL,
  `user_id` varchar(100) NOT NULL,
  `from_date` varchar(50) NOT NULL,
  `to_date` varchar(50) NOT NULL,
  `document` varchar(500) NOT NULL,
  `ref_by` varchar(20) NOT NULL,
  `ref_percentage` float NOT NULL,
  `datetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=30 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user_contracts`
--

INSERT INTO `user_contracts` (`id`, `contract_no`, `user_id`, `from_date`, `to_date`, `document`, `ref_by`, `ref_percentage`, `datetime`) VALUES
(26, 'C-202001270026', 'sss34', '3444-67-23', '3444-45-56', '2020-01-27T11_33_18.355Z5d22c824396cc066eedcb62d_HLC.png', 'ddd34', 23, '2020-01-27 17:03:18'),
(25, 'C-202001270025', '202001240071', '2020-01-01', '2020-01-31', '2020-01-27T11_32_26.254Zacrobatpdf.jpg', 'tg', 23, '2020-01-27 17:02:26'),
(24, 'C-202001270024', '202001240071', '2020-01-01', '2020-01-31', '2020-01-27T11_30_45.379Zacrobatpdf.jpg', '234', 34, '2020-01-27 17:00:45'),
(23, 'C-202001270023', 'sss34', '3444-67-23', '3444-45-56', '2020-01-27T11_30_18.017Z5d22c824396cc066eedcb62d_HLC.png', 'ddd34', 34, '2020-01-27 17:00:18'),
(22, 'C-202001270022', 'sss34', '3444-67-23', '3444-45-56', '2020-01-27T11_01_33.052Z5d22c824396cc066eedcb62d_HLC.png', 'ddd34', 34, '2020-01-27 16:31:33'),
(21, 'C-202001270021', 'sss34', '3444-67-23', '3444-45-56', '2020-01-27T10_25_22.445Z5d22c824396cc066eedcb62d_HLC.png', 'ddd34', 34, '2020-01-27 15:55:22'),
(20, 'C-202001270020', 'sss34', '3444-67-23', '3444-45-56', '2020-01-27T09_59_46.739Z5d22c824396cc066eedcb62d_HLC.png', 'ddd34', 34, '2020-01-27 15:29:46'),
(19, 'C-202001270019', 'sss34', '3444', '3444', '2020-01-27T09_56_31.251Z5d22c824396cc066eedcb62d_HLC.png', 'ddd34', 34, '2020-01-27 15:26:31'),
(18, 'C-202001270018', 'sss34', '3444', '3444', '2020-01-27T09_52_34.216Z5d22c824396cc066eedcb62d_HLC.png', 'ddd34', 34, '2020-01-27 15:22:34'),
(17, 'C-202001270017', '202001240071', '2020-01-01', '2020-01-31', '2020-01-27T09_39_20.696Zacrobatpdf.jpg', '3333', 444, '2020-01-27 15:09:20'),
(16, 'C-202001270016', '202001240071', '2020-01-01', '2020-01-31', '2020-01-27T07_33_33.241Zacrobatpdf.jpg', '2333', 3444, '2020-01-27 13:03:33'),
(27, 'C-202001280027', '202001240071', '2020-01-08', '2020-01-15', '2020-01-28T06_21_06.082Zacrobatpdf.jpg', '34', 34, '2020-01-28 11:51:06'),
(28, 'C-202001280028', '202001240071', '2020-01-01', '2020-01-23', '2020-01-28T06_27_30.245Zacrobatpdf.jpg', '43', 43, '2020-01-28 11:57:30'),
(29, 'C-202001280029', '202001240071', '2020-01-01', '2020-01-31', '2020-01-28T06_28_22.691Z1047px-MS_word_DOC_icon.svg.png', '2332', 34, '2020-01-28 11:58:22');

-- --------------------------------------------------------

--
-- Table structure for table `user_contract_tests`
--

DROP TABLE IF EXISTS `user_contract_tests`;
CREATE TABLE IF NOT EXISTS `user_contract_tests` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `contract_no` varchar(100) NOT NULL,
  `test_id` varchar(100) NOT NULL,
  `package_id` varchar(100) NOT NULL,
  `percentage` float NOT NULL,
  `mrp` float NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=18 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user_contract_tests`
--

INSERT INTO `user_contract_tests` (`id`, `contract_no`, `test_id`, `package_id`, `percentage`, `mrp`) VALUES
(1, 'C-202001270016', '1', '1', 104, 15000),
(2, 'C-202001270016', '3', '4', 20, 12000),
(3, 'C-202001270016', '2', '3', 15, 16000),
(4, 'C-202001270017', '1', '1', 10, 15000),
(5, 'C-202001270018', '1', '1', 10, 15000),
(6, 'C-202001270019', '1', '1', 10, 15000),
(7, 'C-202001270020', '1', '1', 10, 15000),
(8, 'C-202001270021', '1', '1', 10, 15000),
(9, 'C-202001270022', '1', '1', 10, 15000),
(10, 'C-202001270023', '1', '1', 10, 15000),
(11, 'C-202001270024', '1', '1', 10, 15000),
(12, 'C-202001270025', '1', '1', 10, 15000),
(13, 'C-202001270025', '1', '1', 10, 15000),
(14, 'C-202001270026', '1', '1', 10, 15000),
(15, 'C-202001270026', '1', '1', 10, 15000),
(16, 'C-202001280027', '1', '1', 10, 15000),
(17, 'C-202001280029', '3', '1', 10, 12000);

-- --------------------------------------------------------

--
-- Table structure for table `user_details`
--

DROP TABLE IF EXISTS `user_details`;
CREATE TABLE IF NOT EXISTS `user_details` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` varchar(100) NOT NULL,
  `name` varchar(200) NOT NULL,
  `company_name` varchar(300) NOT NULL,
  `mobile` varchar(50) NOT NULL,
  `address` text NOT NULL,
  `gst` varchar(100) NOT NULL,
  `reg_type` varchar(100) NOT NULL,
  `datetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`)
) ENGINE=MyISAM AUTO_INCREMENT=43 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user_details`
--

INSERT INTO `user_details` (`id`, `user_id`, `name`, `company_name`, `mobile`, `address`, `gst`, `reg_type`, `datetime`) VALUES
(1, '191018020', 'AAKASH MOURYA', 'Gennext IT', '7840079095', '', '0909090909090909', 'company', '2019-12-12 16:30:27'),
(42, '202001240071', 'aakash mourya', 'rt', '847 608 9809', 'delhi', 'yt', 'company', '2020-01-24 13:07:53');

-- --------------------------------------------------------

--
-- Table structure for table `user_types`
--

DROP TABLE IF EXISTS `user_types`;
CREATE TABLE IF NOT EXISTS `user_types` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(200) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user_types`
--

INSERT INTO `user_types` (`id`, `type`) VALUES
(1, 'Distributor'),
(2, 'Sub Distributor'),
(3, 'Agent'),
(4, 'Sub Agent');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
