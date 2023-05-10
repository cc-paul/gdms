<?php
    if(!isset($_SESSION)) { session_start(); } 
    include dirname(__FILE__,2) . '/config.php';
    include $main_location . '/connection/conn.php';
    include '../builder/builder_select.php';
    include '../builder/builder_table.php';

    $command = $_POST["command"];
    
    switch ($command) {
        case "check_change_pass" :
                
            echo $_SESSION["isPasswordChange"];        
            
        break;
        
        case "update_pass" :
            
            $id               = $_SESSION['id'];
            $password         = $_POST["password"];
            $isPasswordChange = 1;
            
            $query = "UPDATE omg_registration SET password = MD5(?),isPasswordChange = ? WHERE id = ?";
            if ($stmt = mysqli_prepare($con, $query)) {
                mysqli_stmt_bind_param($stmt,"sii",$password,$isPasswordChange,$id);
                mysqli_stmt_execute($stmt);
                
                $_SESSION["isPasswordChange"] = $isPasswordChange;        
                echo 1;
            } else {
                echo 0;
            }    
            
        break;
    }
    
    mysqli_close($con);
?>