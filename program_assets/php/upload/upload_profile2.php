<?php
    if(!isset($_SESSION)) { session_start(); }
    
    $id = $_SESSION["id"];
	
	if ( 0 < $_FILES['file']['error'] ) {
        echo 'Error: ' . $_FILES['file']['error'] . '<br>';
    } else {
        move_uploaded_file($_FILES['file']['tmp_name'], '../../../profile/' . $id.".png");
        $_SESSION["id"] = $id;
        echo $id;
    }
?>