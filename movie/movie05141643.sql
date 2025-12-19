/*
 Navicat Premium Data Transfer

 Source Server         : 本地
 Source Server Type    : MySQL
 Source Server Version : 50732
 Source Host           : 127.0.0.1:3306
 Source Schema         : movie

 Target Server Type    : MySQL
 Target Server Version : 50732
 File Encoding         : 65001

 Date: 14/05/2025 16:43:05
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for collect
-- ----------------------------
DROP TABLE IF EXISTS `collect`;
CREATE TABLE `collect`  (
  `collect_id` int(10) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `movie_id` int(10) NOT NULL COMMENT '商品ID',
  `user_id` int(10) NOT NULL COMMENT '用户ID',
  PRIMARY KEY (`collect_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 27 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci COMMENT = '影片收藏' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of collect
-- ----------------------------
INSERT INTO `collect` VALUES (19, 4, 6);
INSERT INTO `collect` VALUES (25, 4, 7);

-- ----------------------------
-- Table structure for comments
-- ----------------------------
DROP TABLE IF EXISTS `comments`;
CREATE TABLE `comments`  (
  `comments_id` int(10) NOT NULL AUTO_INCREMENT,
  `movie_id` int(10) NOT NULL,
  `comments_content` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `score` int(5) NULL DEFAULT NULL,
  `comments_time` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `state` varchar(5) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT '审核状态，1：待审核，2：已审核，3：已拒绝',
  PRIMARY KEY (`comments_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of comments
-- ----------------------------

-- ----------------------------
-- Table structure for menu
-- ----------------------------
DROP TABLE IF EXISTS `menu`;
CREATE TABLE `menu`  (
  `menu_id` int(11) NOT NULL AUTO_INCREMENT,
  `menu_name` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `menu_role` varchar(5) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`menu_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of menu
-- ----------------------------
INSERT INTO `menu` VALUES (1, '首页', '0');
INSERT INTO `menu` VALUES (2, '周边', '0');
INSERT INTO `menu` VALUES (3, '收藏', '0');
INSERT INTO `menu` VALUES (4, '订单', '0');
INSERT INTO `menu` VALUES (5, '内容管理', '1');
INSERT INTO `menu` VALUES (6, '购物车', '0');

-- ----------------------------
-- Table structure for movie
-- ----------------------------
DROP TABLE IF EXISTS `movie`;
CREATE TABLE `movie`  (
  `movie_id` int(10) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `movie_name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '影片名称',
  `type_id` int(10) NOT NULL COMMENT '类型ID',
  `director` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '导演名称',
  `starring` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '主演',
  `year` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '年份',
  `remark` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '简介',
  `img_url` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '封面',
  `state` varchar(5) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '状态，1：未审核，2：已审核',
  `rating` decimal(3, 1) NULL DEFAULT NULL COMMENT '评分',
  `ratingCount` int(11) NULL DEFAULT NULL COMMENT '评分人数',
  PRIMARY KEY (`movie_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 17 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of movie
-- ----------------------------
INSERT INTO `movie` VALUES (4, '唐探1900', 2, '陈思诚', '王宝强', '2023', '1900年，在美国旧金山唐人街，华裔印第安猎人阿鬼与留美青年秦福因一场凶杀案偶然结识，误打误撞组成\"唐人街神探\"组合。开启了一场笑闹探案之旅……', 'z0FPvuJ1o9i3SDykpDz5TwCN.jpg', NULL, 3.0, 10);
INSERT INTO `movie` VALUES (5, '满江红', 4, '张艺谋', '岳云鹏', '2023', '南宋绍兴年间，岳飞死后四年，秦桧率兵与金国会谈。会谈前夜，金国使者死在宰相驻地，所携密信也不翼而飞。小兵张大与亲兵营副统领孙均机缘巧合被裹挟进这巨大阴谋之中，宰相秦桧命两人限一个时辰之内找到凶手。伴随危机四伏的深入调查,宰相府总管何立、副总管武义淳、舞姬瑶琴等人卷入局中,案件的背后似乎隐藏着一场更大的阴谋。局中有局、人心叵测，一夜之间风云变幻，各方势力暗流涌动……', 'mykZuN2A3FpFX0M6PJWasTMF.jpg', NULL, 3.7, 3);
INSERT INTO `movie` VALUES (6, '志愿军：存亡之战', 6, '1', '陈凯歌', '2023', '陈凯歌执导，电影《志愿军》三部曲第二部《志愿军:存亡之战》聚焦铁原阻击战中国人民志愿军第63军2.5万将士与近5万敌军激战12昼夜，在铁原战场. 上构筑了一道冲不破的铁长城。志愿军将士们浴血奋战，终于把敌军打上了谈判桌。', 'cR7QTN1oPnCUJ6f-S0CjNIHp.jpg', NULL, NULL, NULL);
INSERT INTO `movie` VALUES (7, '哪吒之魔童降世', 5, '哈喽', '哪吒', '2019', '天地灵气孕育出一颗能量巨大的混元珠,元始天尊将混元珠提炼成灵珠和魔丸，灵珠投胎为人，助周伐纣时可堪大用;而魔丸则会诞出魔王，为祸人间。元始天尊启动了天劫咒语，3年后天雷将会降临，摧毁魔丸。太乙受命将灵珠托生于陈塘关李靖家的儿子哪吒身上。然而阴差阳错,灵珠和魔丸竟然被掉包。本应是灵珠英雄的哪吒却成了混世大魔王。调皮捣蛋顽劣不堪的哪吒却徒有一颗做英雄的心。然而面对众人对魔丸的误解和即将来临的天雷的降临，哪吒是否命中注定会立地成魔?他将何去何从', '5arkfcTRE8jHiZ2fpPM3Zois.jpg', NULL, 1.0, 1);
INSERT INTO `movie` VALUES (8, '人生大事', 8, '欢子', '陈建斌', '2022', '殡葬师莫三妹在刑满释放不久后的一次出殡中，遇到了孤儿武小文，小文的出现，意外地改变了莫三妹对职业和生活的态度。', 'lw5ppjpauI2TkM30BrDyFKEo.jpg', NULL, NULL, NULL);
INSERT INTO `movie` VALUES (9, '小小的我', 7, '我', '我', '2023', '患有脑瘫的刘春和勇敢冲破身心的枷锁，为外婆圆梦舞台的同时，也努力寻求着自己人生的坐标。在经历一个盛夏的蜕变后，他终于踏上了新的旅程。', 'sMRipxacMjdrI-bcRFEc43h5.jpg', NULL, NULL, NULL);
INSERT INTO `movie` VALUES (10, '749局', 3, '749局', '749局', '2023', '故事发生在近未来，因为未知神秘生物的出现，导致整个城市面临前所未有的危机。一桩被隐藏多年的秘密计划浮出水面。少年马山被带入749局，进入层层迷宫，开启一程冒险之旅，并在这一旅程中完成了一次自我的成长与救赎。', 'gz7D4oey-8QOpI3IL_xwRGeQ.jpg', NULL, NULL, NULL);
INSERT INTO `movie` VALUES (16, 'test', 11, '11', '111', '2026', '222', '9octkP2E-IMcga10Zukk-y8s.jpg', NULL, 5.0, 1);

-- ----------------------------
-- Table structure for movie_comments
-- ----------------------------
DROP TABLE IF EXISTS `movie_comments`;
CREATE TABLE `movie_comments`  (
  `comments_id` int(10) NOT NULL AUTO_INCREMENT,
  `movie_id` int(10) NOT NULL,
  `comments_content` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `score` int(5) NULL DEFAULT NULL,
  `comments_time` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `state` varchar(5) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '审核状态，1：待审核，2：已审核，3：已拒绝',
  `user_id` int(10) NULL DEFAULT NULL,
  PRIMARY KEY (`comments_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 35 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of movie_comments
-- ----------------------------
INSERT INTO `movie_comments` VALUES (17, 4, '哈哈', 5, '2025-05-14 11:07:13', '2', 2);
INSERT INTO `movie_comments` VALUES (18, 4, '1', 1, '2025-05-14 11:09:26', '2', 2);
INSERT INTO `movie_comments` VALUES (19, 4, '1分不值', 1, '2025-05-14 11:12:14', '2', 2);
INSERT INTO `movie_comments` VALUES (20, 4, '呵呵', 2, '2025-05-14 11:13:35', '2', 2);
INSERT INTO `movie_comments` VALUES (21, 4, '23423', 5, '2025-05-14 11:22:02', '2', 2);
INSERT INTO `movie_comments` VALUES (22, 4, '1231123', 5, '2025-05-14 14:28:22', '1', 2);
INSERT INTO `movie_comments` VALUES (23, 4, '2222', 1, '2025-05-14 14:28:29', '1', 2);
INSERT INTO `movie_comments` VALUES (24, 5, '1', 5, '2025-05-14 14:29:22', '1', 2);
INSERT INTO `movie_comments` VALUES (25, 5, '1', 2, '2025-05-14 14:29:27', '1', 2);
INSERT INTO `movie_comments` VALUES (26, 7, '1', 1, '2025-05-14 14:31:46', '1', 2);
INSERT INTO `movie_comments` VALUES (27, 5, '4', 4, '2025-05-14 15:16:32', '2', 2);
INSERT INTO `movie_comments` VALUES (28, 11, '1', 5, '2025-05-14 15:18:36', '3', 2);
INSERT INTO `movie_comments` VALUES (29, 11, '3', 3, '2025-05-14 15:18:39', '2', 2);
INSERT INTO `movie_comments` VALUES (30, 4, '111', NULL, '2025-05-14 15:36:10', '2', 6);
INSERT INTO `movie_comments` VALUES (31, 4, '32', 5, '2025-05-14 15:36:13', '2', 6);
INSERT INTO `movie_comments` VALUES (32, 4, '垃圾哦', 1, '2025-05-14 15:36:43', '2', 6);
INSERT INTO `movie_comments` VALUES (33, 4, '好', 4, '2025-05-14 15:55:01', '2', 7);
INSERT INTO `movie_comments` VALUES (34, 16, '满分', 5, '2025-05-14 15:57:06', '1', 2);

-- ----------------------------
-- Table structure for order
-- ----------------------------
DROP TABLE IF EXISTS `order`;
CREATE TABLE `order`  (
  `order_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '订单id',
  `order_no` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '订单编号',
  `order_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '下单时间',
  `user_id` int(11) NULL DEFAULT NULL COMMENT '用户账号',
  `contact_way` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '联系方式',
  `pay_type` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '支付方式',
  `order_state` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '1' COMMENT '订单状态，1：待处理，2：已完成，3：已取消',
  `accept_address` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '收货地址',
  `remark` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `total` decimal(10, 2) NULL DEFAULT NULL,
  `total_num` int(10) NULL DEFAULT NULL,
  PRIMARY KEY (`order_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 25 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '订单表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of order
-- ----------------------------
INSERT INTO `order` VALUES (23, 'ORD20250514155526337', '2025-05-14 15:55:26', 7, NULL, NULL, '2', NULL, '满江红 岳飞卡片|变形金刚', 650.51, 2);
INSERT INTO `order` VALUES (24, 'ORD20250514155539883', '2025-05-14 15:55:39', 7, NULL, NULL, '3', NULL, '满江红 岳飞卡片', 51.01, 1);

-- ----------------------------
-- Table structure for order_detail
-- ----------------------------
DROP TABLE IF EXISTS `order_detail`;
CREATE TABLE `order_detail`  (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `product_id` int(10) NOT NULL COMMENT '商品ID',
  `product_name` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `product_num` int(10) NULL DEFAULT NULL COMMENT '数量',
  `subtotal` float(10, 2) NULL DEFAULT NULL COMMENT '小计',
  `user_id` int(10) NULL DEFAULT NULL,
  `order_no` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `out_price` decimal(10, 2) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 33 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of order_detail
-- ----------------------------
INSERT INTO `order_detail` VALUES (30, 1, '满江红 岳飞卡片', 1, 51.01, 7, 'ORD20250514155526337', 51.01);
INSERT INTO `order_detail` VALUES (31, 2, '变形金刚', 1, 599.50, 7, 'ORD20250514155526337', 599.50);
INSERT INTO `order_detail` VALUES (32, 1, '满江红 岳飞卡片', 1, 51.01, 7, 'ORD20250514155539883', 51.01);

-- ----------------------------
-- Table structure for product
-- ----------------------------
DROP TABLE IF EXISTS `product`;
CREATE TABLE `product`  (
  `product_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '商品id',
  `product_no` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '商品编号',
  `product_name` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '商品名称',
  `out_price` double NOT NULL COMMENT '售价',
  `product_url` varchar(200) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '商品图片',
  `remark` varchar(500) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '描述',
  `rating` decimal(3, 1) NULL DEFAULT 1.0 COMMENT '评分',
  `ratingCount` int(11) NULL DEFAULT 0,
  PRIMARY KEY (`product_id`) USING BTREE,
  UNIQUE INDEX `UNIQUE`(`product_no`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '商品表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of product
-- ----------------------------
INSERT INTO `product` VALUES (1, 'po1010111010', '满江红 岳飞卡片', 51.01, '1.jpg', '满江红 岳飞卡片', 4.2, 12);
INSERT INTO `product` VALUES (2, 'po1010111011', '变形金刚', 599.5, '2.jpg', '变形金刚', 3.4, 9);
INSERT INTO `product` VALUES (3, 'po10101111012', '哪吒 敖丙卡牌', 66.6, '6.jpg', '套哪吒 敖丙卡牌', 5.0, 1);

-- ----------------------------
-- Table structure for product_comments
-- ----------------------------
DROP TABLE IF EXISTS `product_comments`;
CREATE TABLE `product_comments`  (
  `comments_id` int(10) NOT NULL AUTO_INCREMENT,
  `product_id` int(10) NOT NULL,
  `comments_content` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `rating` int(5) NULL DEFAULT NULL,
  `comments_time` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `state` varchar(5) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '审核状态，1：待审核，2：已审核，3：已拒绝',
  `user_id` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`comments_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 41 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '商品评价' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of product_comments
-- ----------------------------
INSERT INTO `product_comments` VALUES (19, 2, '1', 5, '2025-05-14 10:47:56', NULL, NULL);
INSERT INTO `product_comments` VALUES (20, 2, '1', 3, '2025-05-14 10:47:59', NULL, NULL);
INSERT INTO `product_comments` VALUES (21, 2, '1', 1, '2025-05-14 10:48:04', NULL, NULL);
INSERT INTO `product_comments` VALUES (22, 2, '3', 2, '2025-05-14 10:48:22', NULL, NULL);
INSERT INTO `product_comments` VALUES (23, 2, '2', 4, '2025-05-14 10:49:30', NULL, NULL);
INSERT INTO `product_comments` VALUES (24, 2, '423', 5, '2025-05-14 10:49:36', NULL, NULL);
INSERT INTO `product_comments` VALUES (25, 2, '2', 1, '2025-05-14 10:49:41', NULL, NULL);
INSERT INTO `product_comments` VALUES (26, 2, '1', 5, '2025-05-14 10:50:17', NULL, NULL);
INSERT INTO `product_comments` VALUES (27, 1, '1312', 5, '2025-05-14 10:50:29', NULL, NULL);
INSERT INTO `product_comments` VALUES (28, 1, '3', 2, '2025-05-14 10:50:32', NULL, NULL);
INSERT INTO `product_comments` VALUES (29, 1, '2', 5, '2025-05-14 11:22:49', NULL, NULL);
INSERT INTO `product_comments` VALUES (30, 1, '哈哈', 5, '2025-05-14 11:23:59', NULL, NULL);
INSERT INTO `product_comments` VALUES (31, 1, '12312', 5, '2025-05-14 11:24:46', NULL, NULL);
INSERT INTO `product_comments` VALUES (32, 1, '嘎嘎', 5, '2025-05-14 11:25:32', NULL, NULL);
INSERT INTO `product_comments` VALUES (33, 1, '123123', 5, '2025-05-14 11:29:11', '1', '2');
INSERT INTO `product_comments` VALUES (34, 1, '111', 2, '2025-05-14 11:29:33', '1', '2');
INSERT INTO `product_comments` VALUES (35, 1, '44', 3, '2025-05-14 11:29:37', '1', '2');
INSERT INTO `product_comments` VALUES (36, 1, '1', 5, '2025-05-14 11:29:50', '1', '2');
INSERT INTO `product_comments` VALUES (37, 2, '1', 5, '2025-05-14 11:29:58', '1', '2');
INSERT INTO `product_comments` VALUES (38, 3, '好', 5, '2025-05-14 14:33:07', '1', '2');
INSERT INTO `product_comments` VALUES (39, 1, '垃圾', 3, '2025-05-14 15:37:04', '1', '6');
INSERT INTO `product_comments` VALUES (40, 1, '很好', 5, '2025-05-14 15:55:56', '1', '7');

-- ----------------------------
-- Table structure for shopping_cart
-- ----------------------------
DROP TABLE IF EXISTS `shopping_cart`;
CREATE TABLE `shopping_cart`  (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `product_id` int(10) NOT NULL COMMENT '商品ID',
  `product_num` int(10) NULL DEFAULT NULL COMMENT '数量',
  `subtotal` float(10, 2) NULL DEFAULT NULL COMMENT '小计',
  `user_id` int(10) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 17 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of shopping_cart
-- ----------------------------
INSERT INTO `shopping_cart` VALUES (1, 1, 3, 3.03, 1);
INSERT INTO `shopping_cart` VALUES (11, 1, 1, 1.01, 6);
INSERT INTO `shopping_cart` VALUES (12, 2, 1, 599.50, 6);
INSERT INTO `shopping_cart` VALUES (13, 3, 1, 66.60, 6);
INSERT INTO `shopping_cart` VALUES (15, 1, 1, 51.01, 7);

-- ----------------------------
-- Table structure for type
-- ----------------------------
DROP TABLE IF EXISTS `type`;
CREATE TABLE `type`  (
  `type_id` int(10) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `type_name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '分类名称',
  `type_remark` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '分类描述',
  `type_num` int(10) NOT NULL DEFAULT 0 COMMENT '分类数量',
  PRIMARY KEY (`type_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 12 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of type
-- ----------------------------
INSERT INTO `type` VALUES (2, '喜剧', '喜剧', 0);
INSERT INTO `type` VALUES (3, '科幻', '科幻科幻科幻科幻科幻科幻科幻科幻科幻科幻科幻', 0);
INSERT INTO `type` VALUES (4, '悬疑', '悬疑悬疑悬疑悬疑', 0);
INSERT INTO `type` VALUES (5, '动画', '动画动画动画', 0);
INSERT INTO `type` VALUES (6, '战争', '战争战争战争战争', 0);
INSERT INTO `type` VALUES (7, '爱情', '爱情爱情爱情', 0);
INSERT INTO `type` VALUES (8, '恐怖', '恐怖恐怖恐怖', 0);
INSERT INTO `type` VALUES (9, '历史', '历史历史历史', 0);
INSERT INTO `type` VALUES (10, '动作', '动作动作动作', 0);
INSERT INTO `type` VALUES (11, '高清', '1', 0);

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `user_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '用户id',
  `user_name` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '用户昵称',
  `password` varchar(60) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '用户密码',
  `user_sex` varchar(6) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '用户性别',
  `telephone` varchar(11) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '2' COMMENT '用户手机号',
  `creat_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '注册时间',
  `login_time` timestamp NULL DEFAULT NULL COMMENT '登录时间',
  `summary` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '个人简介',
  `user_address` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '用户地址',
  `avatar_url` varchar(200) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '用户头像',
  `background_url` varchar(200) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '背景图片',
  `status` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '2' COMMENT '用户身份',
  PRIMARY KEY (`user_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 8 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '用户表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES (1, 'admin', 'admin1', '男', NULL, '2025-05-09 15:27:35', NULL, NULL, NULL, NULL, NULL, '1');
INSERT INTO `user` VALUES (2, 'test', '123123', NULL, '13123222222', '2025-05-10 11:15:35', NULL, NULL, NULL, NULL, NULL, '1');
INSERT INTO `user` VALUES (3, 'test1', '123123', NULL, 'cuizx', '2025-05-10 14:41:36', NULL, NULL, NULL, NULL, NULL, '1');
INSERT INTO `user` VALUES (4, 'test2', '123123', NULL, 'cuizx', '2025-05-10 14:41:54', NULL, NULL, NULL, NULL, NULL, '1');
INSERT INTO `user` VALUES (5, 'aaa', '123123', NULL, 'cuizx', '2025-05-10 15:58:54', NULL, NULL, NULL, NULL, NULL, '2');
INSERT INTO `user` VALUES (6, 'haha', '123123', NULL, 'test', '2025-05-14 15:35:53', NULL, NULL, NULL, NULL, NULL, '2');
INSERT INTO `user` VALUES (7, 'test5', '123123', NULL, '1333333333', '2025-05-14 15:54:43', NULL, NULL, NULL, NULL, NULL, '2');

-- ----------------------------
-- Table structure for years_dict
-- ----------------------------
DROP TABLE IF EXISTS `years_dict`;
CREATE TABLE `years_dict`  (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `lable` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL COMMENT '年份',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of years_dict
-- ----------------------------

SET FOREIGN_KEY_CHECKS = 1;
