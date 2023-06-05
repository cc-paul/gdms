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
        case "new_user" :
            
            $firstName    = $_POST["firstName"];
            $middleName   = $_POST["middleName"];
            $lastName     = $_POST["lastName"];
            $birthDate    = $_POST["birthDate"];
            $gender       = $_POST["gender"];
            $mobileNumber = $_POST["mobileNumber"];
            $emailAddress = $_POST["emailAddress"];
            $username     = $_POST["username"];
            $password     = $_POST["password"];
            $college      = $_POST["college"];
            $arr_exist    = array();
            
            $find_email = mysqli_query($con,"SELECT * FROM omg_registration WHERE email = '$emailAddress'");
            if (mysqli_num_rows($find_email) != 0) {
                mysqli_next_result($con);
                array_push($arr_exist,"Email");
            }
            
            $find_user = mysqli_query($con,"SELECT * FROM omg_registration WHERE username = '$username'");
            if (mysqli_num_rows($find_user) != 0) {
                mysqli_next_result($con);
                array_push($arr_exist,"Username");
            }
            
            if (count($arr_exist) != 0) {
                $error   = true;
                $color   = "red";
                $message = implode(" and ",$arr_exist) . " already exist";
            } else {
                $query = "
                    INSERT INTO omg_registration (
                        firstName,
                        middleName,
                        lastName,
                        email,
                        username,
                        password,
                        mobileNumber,
                        birthDate,
                        sex,
                        dateCreated,
                        collegeID
                    ) VALUES (
                        ?,?,?,?,?,MD5(?),?,?,?,?,?
                    )
                ";
                if ($stmt = mysqli_prepare($con, $query)) {
                    mysqli_stmt_bind_param($stmt,"sssssssssss",$firstName,$middleName,$lastName,$emailAddress,$username,$password,$mobileNumber,$birthDate,$gender,$global_date,$college);
                    mysqli_stmt_execute($stmt);
                   
                    $error   = false;
                    $color   = "green";
                    $message = "Account has been registered successfully. Please wait for the activation that will sent to your email"; 
                   
                } else {
                    $error   = true;
                    $color   = "red";
                    $message = "Unable to register account"; 
                }
            }
            
            $json[] = array(
                'error' => $error,
                'color' => $color,
                'message' => $message
            );
            echo json_encode($json);
            
        break;
    
        case "reset_password_email" :
            
            $email    = $_POST["email"];
            $chars    = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            $new_pass = substr(str_shuffle($chars),0,8);
            $messageBody = "";
            
            $query = "UPDATE omg_registration SET `password` = MD5(?),isPasswordChange = 0 WHERE email = ?";
            if ($stmt = mysqli_prepare($con, $query)) {
                mysqli_stmt_bind_param($stmt,"ss",$new_pass,$email);
                mysqli_stmt_execute($stmt);
                
                $error   = false;
                $color   = "green";
                $message = "Password has been reset. Please check your email";
                $messageBody = "Your new password is " . $new_pass;
                
            } else {
                $error   = true;
                $color   = "red";
                $message = "Error reseting password";
            }

            $json[] = array(
                'error' => $error,
                'color' => $color,
                'message' => $message,
                'messageBody' => $messageBody
            );
            echo json_encode($json);
            
        break;
        
        case "load_account" :
            
            $sql = "
                SELECT 
                    a.id,
                    a.firstName,
                    a.middleName,
                    a.lastName,
                    a.email,
                    a.username,
                    a.mobileNumber,
                    a.birthDate,
                    a.sex,
                    a.accountStatus,
                    a.isPasswordChange,
                    DATE_FORMAT(a.dateCreated,'%m/%d/%Y') AS dateCreated,
                    DATE_FORMAT(a.birthDate,'%m/%d/%Y') AS fBirthDate,
                    b.position,
                    b.id AS positionID
                FROM
                    omg_registration a 
                LEFT JOIN
                    omg_positions b 
                ON 
                    a.positionID = b.id
                ORDER BY
                    a.dateCreated DESC;
            ";
            return builder($con,$sql);
            
        break;

        case "update_user" :
            
            $userID        = $_POST["userID"];
            $accountStatus = $_POST["accountStatus"];
            $position = $_POST["position"];
            
            $query = "UPDATE omg_registration SET accountStatus = ?,positionID = ? WHERE id = ?";
            if ($stmt = mysqli_prepare($con, $query)) {
                mysqli_stmt_bind_param($stmt,"sss",$accountStatus,$position,$userID);
                mysqli_stmt_execute($stmt);
               
                $error   = false;
                $color   = "green";
                $message = "Account has been updated"; 
               
            } else {
                $error   = true;
                $color   = "red";
                $message = "Error updating account"; 
            }
            
            $json[] = array(
                'error' => $error,
                'color' => $color,
                'message' => $message
            );
            echo json_encode($json);
            
        break;
    }
    
    mysqli_close($con);
?>