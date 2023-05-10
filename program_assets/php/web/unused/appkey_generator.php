<?php
	date_default_timezone_set('Asia/Manila');
	if(!isset($_SESSION)) { session_start(); }
	$date = date('mdYHis', time());
	$global_date  = date('Y-m-d H:i:s', time());
	$trans_appkey = "UID" . $_SESSION["id"] . $date;
?>


