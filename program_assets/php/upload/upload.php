<?php
	include 'appkey_generator.php';
	$created_by  = $_SESSION['id'];
	$branch_id	 = $_SESSION['branch_id'];
	
	if ( 0 < $_FILES['file']['error'] ) {
        echo 'Error: ' . $_FILES['file']['error'] . '<br>';
    } else {
        move_uploaded_file($_FILES['file']['tmp_name'], '../../../excel/' . $trans_appkey.".xls");
		echo $trans_appkey.".xls";
    }

?>