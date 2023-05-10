<?php
    if(!isset($_SESSION)) { session_start(); }
    include 'appkey_generator.php';
    include dirname(__FILE__,2) . '/config.php';
    include $main_location . '/connection/conn.php';
    
    $id = $_POST["eventID"];
	
	if ( 0 < $_FILES['file']['error'] ) {
        echo 'Error: ' . $_FILES['file']['error'] . '<br>';
    } else {
        move_uploaded_file($_FILES['file']['tmp_name'], '../../../dist/img/' . $id.".png");
        
        
        $query = "UPDATE yp_event SET hasImage = 1 WHERE id = ?";
        if ($stmt = mysqli_prepare($con, $query)) {
            mysqli_stmt_bind_param($stmt,"s",$id);
            mysqli_stmt_execute($stmt);
        }
        
        echo $id;
    }
?>