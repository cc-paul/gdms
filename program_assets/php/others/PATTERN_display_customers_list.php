<?php
	include 'connection/conn.php';
	include 'builder/builder_select.php';

	$sql = 'CALL sp_display_customers_list';
	generate_select($con,$sql);
?>