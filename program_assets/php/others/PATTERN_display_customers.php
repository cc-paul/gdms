<?php
	include 'connection/conn.php';
	include 'builder/builder_select.php';
	include 'builder/builder_table.php';

	$sql = 'CALL sp_display_customers';
	return builder($con,$sql);
	mysqli_close($con);
?>