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
    
        case "load_college" :
            
            $sql = "
                SELECT
                    id,
                    college
                FROM
                    omg_colleges
                WHERE
                    isActive = 1
                ORDER BY
                    college ASC;
            ";
            return builder($con,$sql);
            
        break;
    
        case "save_college" :
            
            $collegeID  = $_POST["collegeID"];
            $college    = $_POST["college"];
            $oldCollege = $_POST["oldCollege"];
            
            if ($collegeID == 0) {
                
                $find_query = mysqli_query($con,"SELECT * FROM omg_colleges WHERE college = '$college' AND isActive = 1");
                if (mysqli_num_rows($find_query) == 0) {
                    mysqli_next_result($con);
                   
                    $query = "INSERT INTO omg_colleges (college) VALUES (?)";
                    if ($stmt = mysqli_prepare($con, $query)) {
                        mysqli_stmt_bind_param($stmt,"s",$college);
                        mysqli_stmt_execute($stmt);
                       
                        $error   = false;
                        $color   = "green";
                        $message = "College has been saved successfully"; 
                       
                    } else {
                        $error   = true;
                        $color   = "red";
                        $message = "Error saving college"; 
                    }
                   
                } else {
                    $error   = true;
                    $color   = "red";
                    $message = "College already exist"; 
                }
                
            } else {
                
                if ($college != $oldCollege) {
                    
                    $find_query = mysqli_query($con,"SELECT * FROM omg_colleges WHERE college = '$college' AND isActive = 1");
                    if (mysqli_num_rows($find_query) == 0) {
                        mysqli_next_result($con);
                       
                        $query = "UPDATE omg_colleges SET college=? WHERE id=?";
                        if ($stmt = mysqli_prepare($con, $query)) {
                            mysqli_stmt_bind_param($stmt,"ss",$college,$collegeID);
                            mysqli_stmt_execute($stmt);
                           
                            $error   = false;
                            $color   = "green";
                            $message = "College has been updated successfully"; 
                           
                        } else {
                            $error   = true;
                            $color   = "red";
                            $message = "Error updating college"; 
                        }
                       
                    } else {
                        $error   = true;
                        $color   = "red";
                        $message = "College already exist"; 
                    }
                    
                } else {
                    $query = "UPDATE omg_colleges SET college=? WHERE id=?";
                    if ($stmt = mysqli_prepare($con, $query)) {
                        mysqli_stmt_bind_param($stmt,"ss",$college,$collegeID);
                        mysqli_stmt_execute($stmt);
                       
                        $error   = false;
                        $color   = "green";
                        $message = "College has been updated successfully"; 
                       
                    } else {
                        $error   = true;
                        $color   = "red";
                        $message = "Error updating college"; 
                    }
                }
                
            }
            
            $json[] = array(
                'error' => $error,
                'color' => $color,
                'message' => $message
            );
            echo json_encode($json);
            
        break;
    
        case "delete_college" :
            
            $collegeID  = $_POST["collegeID"];
            
            $query = "UPDATE omg_colleges SET isActive = 0 WHERE id=?";
            if ($stmt = mysqli_prepare($con, $query)) {
                mysqli_stmt_bind_param($stmt,"s",$collegeID);
                mysqli_stmt_execute($stmt);
               
                $error   = false;
                $color   = "green";
                $message = "College has been removed successfully"; 
               
            } else {
                $error   = true;
                $color   = "red";
                $message = "Error removing college"; 
            }
            
            $json[] = array(
                'error' => $error,
                'color' => $color,
                'message' => $message
            );
            echo json_encode($json);
            
        break;
    
        case "save_sched" :
            
            $dateFrom = $_POST["dateFrom"];
            $dateTo   = $_POST["dateTo"];
            $message  = $_POST["message"];
            
            $query = "INSERT INTO omg_schedule (dateFrom,dateTo,message,dateCreated) VALUES (?,?,?,?)";
            if ($stmt = mysqli_prepare($con, $query)) {
                mysqli_stmt_bind_param($stmt,"ssss",$dateFrom,$dateTo,$message,$global_date);
                mysqli_stmt_execute($stmt);
               
                $error   = false;
                $color   = "green";
                $message = "Schedule has been added successfully"; 
               
            } else {
                $error   = true;
                $color   = "red";
                $message = "Error saving schedule"; 
            }
            
            $json[] = array(
                'error' => $error,
                'color' => $color,
                'message' => $message
            );
            echo json_encode($json);
            
        break;
    
        case "show_sched" :
            
            $sql    = "SELECT * FROM omg_schedule ORDER BY dateCreated DESC LIMIT 1";
            $result = mysqli_query($con,$sql);
            
            $json = array();
            while ($row  = mysqli_fetch_assoc($result)) {
                $json[] = array(
                    'dateFrom' => $row["dateFrom"],
                    'dateTo'   => $row["dateTo"],
                    'message'  => $row["message"]
                );
            }
            echo json_encode($json);
            
        break;
    }
    
?>