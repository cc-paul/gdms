<?php
    if(!isset($_SESSION)) { session_start(); } 
    $command = $_POST["command"];
    
    switch($command) {
        case "change_docu_status" :
            
            $docu_status = $_POST["docu_status"];
            $_SESSION["docu_status"] = $docu_status;
            
        break;
    }
?>