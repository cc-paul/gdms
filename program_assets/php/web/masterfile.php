<?php
    use PHPMailer\PHPMailer\PHPMailer; 
    use PHPMailer\PHPMailer\Exception;
    //
    require '../phpmailer/src/Exception.php';
    require '../phpmailer/src/PHPMailer.php';
    require '../phpmailer/src/SMTP.php';

    if(!isset($_SESSION)) { session_start(); } 
    //include 'appkey_generator.php';
    include dirname(__FILE__,2) . '/config.php';
    include $main_location . '/connection/conn.php';
    include '../builder/builder_select.php';
    include '../builder/builder_table.php';
    
    $command = $_POST["command"];
    $error   = false;
    $color   = "green";
    $message = "";
    $json    = array();

    switch ($command) {
        case "save_details" :
            
            $statement      = $_POST["statement"];
            $tab            = $_POST["tab"];
            $id             = $_POST["id"];
            
            if ($id == 0) {
                $find_query = mysqli_query($con,"SELECT * FROM omg_masterfile WHERE statement = '$statement' AND tab = '$tab'");
                if (mysqli_num_rows($find_query) == 0) {
                    mysqli_next_result($con);
                   
                    $query = "INSERT INTO omg_masterfile (statement,dateCreated,tab) VALUES (?,?,?)";
                    if ($stmt = mysqli_prepare($con, $query)) {
                        mysqli_stmt_bind_param($stmt,"sss",$statement,$global_date,$tab);
                        mysqli_stmt_execute($stmt);
                       
                        $error   = false;
                        $color   = "green";
                        $message = "Statement has been saved successfully"; 
                       
                    } else {
                        $error   = true;
                        $color   = "red";
                        $message = "Error saving statement"; 
                    }
                   
                } else {
                    $error   = true;
                    $color   = "red";
                    $message = "Statement already exist"; 
                }
            } else {
                $query = "UPDATE omg_masterfile SET statement = ? WHERE id = ?";
                if ($stmt = mysqli_prepare($con, $query)) {
                    mysqli_stmt_bind_param($stmt,"ss",$statement,$id);
                    mysqli_stmt_execute($stmt);
                   
                    $error   = false;
                    $color   = "green";
                    $message = "Statement has been updated successfully"; 
                   
                } else {
                    $error   = true;
                    $color   = "red";
                    $message = "Error updating statement"; 
                }
            }
            
            $json[] = array(
                'error' => $error,
                'color' => $color,
                'message' => $message
            );
            echo json_encode($json);
            
        break;
    
        case "load_gad" :
            
            $sql = "
                SELECT
                    YEAR(dateCreated) AS year,
                    statement,
                    id
                FROM
                    omg_masterfile
                WHERE
                    isActive = 1
                AND
                    tab = 'gad'
                ORDER BY
                    dateCreated DESC;
            ";
            return builder($con,$sql);
            
        break;
    
        case "load_gender" :
            
            $sql = "
                SELECT
                    YEAR(dateCreated) AS year,
                    statement,
                    id
                FROM
                    omg_masterfile
                WHERE
                    isActive = 1
                AND
                    tab = 'gender'
                ORDER BY
                    dateCreated DESC;
            ";
            return builder($con,$sql);
            
        break;
        
        case "delete_gad" :
            
            $id = $_POST["id"];
            
            $query = "UPDATE omg_masterfile SET isActive = 0 WHERE id = ?";
            if ($stmt = mysqli_prepare($con, $query)) {
                mysqli_stmt_bind_param($stmt,"s",$id);
                mysqli_stmt_execute($stmt);
               
                $error   = false;
                $color   = "green";
                $message = "Statement has been removed"; 
               
            } else {
                $error   = true;
                $color   = "red";
                $message = "Unable to remove statement"; 
            }
            
            $json[] = array(
                'error' => $error,
                'color' => $color,
                'message' => $message
            );
            echo json_encode($json);
            
        break;
    }
    
?>