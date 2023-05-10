<?php
	if(!isset($_SESSION)) { session_start(); } 

	/* this is a shared variavles using sessions and etc */
	$requested = $_POST['requested'];

	switch ($requested) {
		case 'page_status':
			echo $_SESSION['page_status'];
			break;
		default:
			# do nothing for now
			break;
	}	
?>