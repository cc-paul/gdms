<?php
	include dirname(__FILE__,2) . '/config.php';
	include $main_location . '/connection/conn.php';

	if(!isset($_SESSION)) { session_start(); } 

	$username = $_POST["username"];
	$password = $_POST["password"];
	$error = false;
	$color = "green";
	$message = "";

	$sql      = "
		SELECT
			a.id,
			CONCAT( IFNULL(a.firstName,''), ' ',IFNULL(a.middleName,''), ' ',IFNULL(a.lastName,'')) AS fullName,
			a.username,
			DATE_FORMAT( a.dateCreated, '%m/%d/%Y' ) AS member_since,
			a.isPasswordChange,
			a.accountStatus
		FROM
			omg_registration a
		WHERE
			a.username = '$username' 
		AND 
			a.`password` = MD5( '$password' )
	";
	
	$result   = mysqli_query($con,$sql);
	$count    = mysqli_num_rows($result);


	if ($count != 0) {
		while ($row = mysqli_fetch_row($result)) {
			$_SESSION['id']               = $row[0];
			$_SESSION['fullName']         = $row[1];
			$_SESSION['username']         = $row[2];
			$_SESSION['date_created']     = $row[3];
			$_SESSION['isPasswordChange'] = $row[4];
			
			switch ($row[5]) {
				case "For Approval" :
					$error   = true;
					$color   = "red";
					$message = "This account exsist but not yet approved. Kindly wait for the approval of admin";	
				break;
				case "Declined" :
					$error   = true;
					$color   = "red";
					$message = "Unable to login. This account has been declined";	
				break;
				default :
					$error   = false;
					$color   = "green";
					$message = "Account has been logged in successfully";	
				break;
			}
		}
	} else {
		$error   = true;
		$color   = "red";
		$message = "Username and Password does not exist";	
	}
	
	$json[] = array(
		'error' => $error,
		'color' => $color,
		'message' => $message
	);
	echo json_encode($json);
	
	mysqli_close($con);
?>