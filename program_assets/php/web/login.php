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
			a.accountStatus,
			b.college,
			c.position,
			c.id
		FROM
			omg_registration a
		INNER JOIN
			omg_colleges b 
		ON
			a.collegeID = b.id
		INNER JOIN 
			omg_positions c 
		ON 
			a.positionID = c.id
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
			$_SESSION['college']          = $row[6];
			$_SESSION['position']         = $row[7];
			$_SESSION['positionID']       = $row[8];
			
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