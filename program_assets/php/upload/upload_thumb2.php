<?php
    if(!isset($_SESSION)) { session_start(); }
    include dirname(__FILE__,2) . '/config.php';
    include $main_location . '/connection/conn.php';
    
    $id       = $_POST["id"];
    $error    = false;
    $color    = "green";
    $message  = "";
	
	if ( 0 < $_FILES['file']['error'] ) {
        
        $error   = true;
        $color   = "red";
        $message = "Error uploading files"; 
        
    } else {
        move_uploaded_file($_FILES['file']['tmp_name'], '../../../thumbnails/' . $id.".png");
        
        $query = "UPDATE in_mealplan SET hasThumbnail = 1 WHERE id = ?";
        if ($stmt = mysqli_prepare($con, $query)) {
            mysqli_stmt_bind_param($stmt,"s",$id);
            mysqli_stmt_execute($stmt);
            
            $error   = false;
            $color   = "green";
            $message = "Thumbnail has been added successfully"; 
        } else {
            $error   = true;
            $color   = "red";
            $message = "Error uploading thumbnail"; 
        }


    }
    
    $json[] = array(
        'error' => $error,
        'color' => $color,
        'message' => $message
    );
    echo json_encode($json);
?>