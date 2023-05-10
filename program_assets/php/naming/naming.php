<?php
	if(!isset($_SESSION)) { session_start(); } 

	if ($to_display == "name") {
		echo $_SESSION['fullName'];
	}

	if ($to_display == "branch") {
		echo "Administrator";
	}

	if ($to_display == "date_created") {
		echo $_SESSION['date_created'];
	}
?>