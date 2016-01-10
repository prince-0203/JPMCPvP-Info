<?php
// データベースに接続
$mysqli = new mysqli('mysql1.webcrow-php.netowl.jp', 'prince_root', 'fukurou29', 'prince_wp1');
if (!$mysqli->connect_error) {
	$mysqli->set_charset("utf8");

	// 日付の取得
	date_default_timezone_set('Asia/Tokyo');
	$accessTime = $mysqli->real_escape_string(date("Y-m-d H:i:s"));
	// ＵＲＬの取得
	$requestUrl = $mysqli->real_escape_string($_SERVER['REQUEST_URI']);
	// ブラウザ情報の取得
	$requestBrowser = $mysqli->real_escape_string($_SERVER['HTTP_USER_AGENT']);
	// 遷移元ページを取得
	if(isset($_SERVER['HTTP_REFERER'])) {
		$httpReferer = $mysqli->real_escape_string($_SERVER['HTTP_REFERER']);
	} else {
		$httpReferer = NULL;
	}

	// データを追加
	$sql = 'INSERT INTO log_02 VALUES ' .
		"('$accessTime', '$requestUrl', '$requestBrowser', " . ((!is_null($httpReferer)) ? "'$httpReferer'" : 'NULL') .  ');';

	$mysqli->query($sql);
	
	// データベースから切断
	$mysqli->close();
}
?>