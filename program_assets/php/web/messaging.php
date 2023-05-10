<?php
    use PHPMailer\PHPMailer\PHPMailer; 
    use PHPMailer\PHPMailer\Exception;
    //
    require '../phpmailer/src/Exception.php';
    require '../phpmailer/src/PHPMailer.php';
    require '../phpmailer/src/SMTP.php';

    if(!isset($_SESSION)) { session_start(); } 
    include dirname(__FILE__,2) . '/config.php';
    include $main_location . '/connection/conn.php';
    include '../builder/builder_select.php';
    include '../builder/builder_table.php';
    
    $command = $_POST["command"];
    $error   = false;
    $color   = "green";
    $message = "";
    $json    = array();
    $ampm    = date('A', time());
    
    switch($command) {
    
        case "load_student_checkbox" :
            
            $id = $_SESSION["id"];
            
            $sql = "
                SELECT
                    a.id,
                    CONCAT(IFNULL(a.lastName,''),', ',IFNULL(a.firstName,''),' ',IFNULL(a.middleName,'')) AS fullName
                FROM
                    omg_registration a 
                WHERE
                    a.id <> $id
                AND
                    a.accountStatus = 'Approved'
            ";
            
            $result = mysqli_query($con,$sql);
            
            $json = array();
            while ($row  = mysqli_fetch_assoc($result)) {
                $json[] = array(
                    'id' => $row["id"],
                    'fullName' => $row["fullName"]
                );
            }
            echo json_encode($json);
            
        break;
    
        case "create_folder" :
            
            $folderID = $_POST["folderID"];
            
            if (mkdir('../../../documents/'.$folderID, 0777, true)) {
                $error   = false;
                $color   = "green";
                $message = ""; 
            } else {
                $error   = true;
                $color   = "red";
                $message = "Unable to create folder"; 
            }
            
            $json[] = array(
                'error' => $error,
                'color' => $color,
                'message' => $message
            );
            echo json_encode($json);
            
        break;
    
        case "upload_file" :
            
            $fileName   = $_POST["fileName"];
            $folderName = $_POST["folderName"];
            $ext        = $_POST["ext"];
            $location   = '../../../documents/'.$folderName.'/' . $fileName;
            
            if ( 0 < $_FILES['file']['error'] ) {
                $error   = true;
                $color   = "red";
                $message = "There is an error uploading your file. Please try again later";
            } else {        
                if (file_exists($location)) {
                    
                    $error   = true;
                    $color   = "red";
                    $message = "File already added";
                    
                } else {
                    if (move_uploaded_file($_FILES['file']['tmp_name'], $location)) {
                        $error   = false;
                        $color   = "green";
                        $message = "File has been added successfully";
                    } else {
                        $error   = true;
                        $color   = "red";
                        $message = "There is an error uploading your file. Please try again later";
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
    
        case "remove_file" :
            
            $fileName = $_POST["fileName"];
            $folderID = $_POST["folderID"];
            
            if (unlink('../../../documents/'.$folderID.'/' . $fileName)) {
                $error   = false;
                $color   = "green";
                $message = "File has been deleted successfully";
            } else {
                $error   = true;
                $color   = "red";
                $message = "There is an error deleting your file. Please try again later";
            }
            
            $json[] = array(
                'error' => $error,
                'color' => $color,
                'message' => $message
            );
            echo json_encode($json);
            
        break;
            
        break;
    
        case "send_message_a" :
            
            $folderID = $_POST["folderID"];
            $header   = $_POST["header"];
            $message  = $_POST["message"];
            $id       = $_SESSION["id"];
            $arrSelectedStudent = $_POST["arrSelectedStudent"];
            $isAnnouncement = 0;
            $rEmail = "";
            
            $find_query = mysqli_query($con,"SELECT * FROM omg_email_header WHERE header = '$header' AND isAnnouncement = 1");
            if (mysqli_num_rows($find_query) == 0) {
                mysqli_next_result($con);
               
                $query = "INSERT INTO omg_email_header (folderID,header,deadline,message,dateCreated,createdBy,isAnnouncement) VALUES (?,?,?,?,?,?,?)";
                if ($stmt = mysqli_prepare($con, $query)) {
                    mysqli_stmt_bind_param($stmt,"sssssss",$folderID,$header,$deadline,$message,$global_date,$id,$isAnnouncement);
                    mysqli_stmt_execute($stmt);
                   
                    $insert_receiver = mysqli_query($con,"INSERT INTO omg_email_details (studentID,folderID) SELECT id,'$folderID' FROM omg_registration WHERE id IN (".$arrSelectedStudent.")");
                    
                    if ($insert_receiver) {
                        $error   = false;
                        $color   = "green";
                        $message = "Message has been sent"; 
                    } else {
                        $error   = true;
                        $color   = "red";
                        $message = "Error sending announcement to the receiver"; 
                    }
                   
                } else {
                    $error   = true;
                    $color   = "red";
                    $message = "Error sending announcement"; 
                }
               
            } else {
                $error   = true;
                $color   = "red";
                $message = "Please provide different announcement title"; 
            }
            
            
            $sql    = "SELECT GROUP_CONCAT(email) AS email FROM omg_registration WHERE id IN (".$arrSelectedStudent.")";
            $result = mysqli_query($con,$sql);

            while ($row  = mysqli_fetch_assoc($result)) {             
                $rEmail = $row["email"];
            }
            
            $json[] = array(
                'error' => $error,
                'color' => $color,
                'message' => $message,
                'rEmail' => $rEmail
            );
            echo json_encode($json);
            
        break;
    
        case "load_message" :
            
            $id = $_SESSION["id"];
            
            $sql = "
            SELECT
                CONCAT(IFNULL(b.lastName,''),', ',IFNULL(b.firstName,''),' ',IFNULL(b.middleName,'')) AS fullName,
                a.header,
                a.message,
                DATE_FORMAT(a.dateCreated,'%m/%d/%Y') AS dateSent,
                DATE_FORMAT(a.dateCreated,'%m/%d/%Y') AS dateSent,(
                        SELECT 
                                GROUP_CONCAT(CONCAT(IFNULL(aa.firstName,''),' ',IFNULL(aa.middleName,''),' ',IFNULL(aa.lastName,''))) 
                        FROM
                                omg_registration aa 
                        INNER JOIN 
                                omg_email_details bb 
                        ON 
                                aa.id = bb.studentID 
                        WHERE
                                bb.folderID = a.folderID
                ) AS receivers,
                a.folderID,
                DATE_FORMAT(a.deadline,'%m/%d/%Y') AS deadline
            FROM
                omg_email_header a 
            INNER JOIN
                omg_registration b 
            ON 
                a.createdBy = b.id
            WHERE
                a.createdBy = $id
            AND
                a.isAnnouncement = 0
            ORDER BY
                a.dateCreated DESC
            ";
            return builder($con,$sql);
            
        break;
    
        case "load_message_inbox" :
            
            $id = $_SESSION["id"];
            
            $sql = "
            SELECT
                CONCAT(IFNULL(b.lastName,''),', ',IFNULL(b.firstName,''),' ',IFNULL(b.middleName,'')) AS fullName,
                a.header,
                a.message,
                DATE_FORMAT(a.dateCreated,'%m/%d/%Y') AS dateSent,
                DATE_FORMAT(a.dateCreated,'%m/%d/%Y') AS dateSent,(
                        SELECT 
                                GROUP_CONCAT(CONCAT(IFNULL(aa.firstName,''),' ',IFNULL(aa.middleName,''),' ',IFNULL(aa.lastName,''))) 
                        FROM
                                omg_registration aa 
                        INNER JOIN 
                                omg_email_details bb 
                        ON 
                                aa.id = bb.studentID 
                        WHERE
                                bb.folderID = a.folderID
                ) AS receivers,
                a.folderID,
                DATE_FORMAT(a.dateCreated,'%m/%d/%Y') AS dateSent,
                DATE_FORMAT(a.deadline,'%m/%d/%Y') AS deadline
            FROM
                omg_email_header a 
            INNER JOIN
                omg_registration b 
            ON 
                a.createdBy = b.id
            WHERE
                a.folderID IN (SELECT folderID from omg_email_details WHERE studentID = $id)
            AND
                a.isAnnouncement = 0
            ORDER BY
                a.dateCreated DESC
            ";
            
            return builder($con,$sql);
            
        break;
    
        case "load_file" :
        
            $folderID  = $_POST["folderID"];
            $directory = '../../../documents/'. $folderID . '/';
            $texts     = glob($directory . "*");
            $json      = array();
            
            foreach($texts as $text) {
                $json[] = array(
                    'fileName' => str_replace('../../../documents/'. $folderID . '/',"",$text)
                );
            }
            
            echo json_encode($json);         
            
        break;
    }
    
    mysqli_close($con); 
?>
