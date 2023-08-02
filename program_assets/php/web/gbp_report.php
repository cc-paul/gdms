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
    
    switch($command) {
        case "load_gbp_table" :
            
            $report  = $_POST["report"];
            $year    = $_POST["year"];
            $status  = $_POST["status"];
            $id      = $_SESSION["id"];
            $college = $_POST["college"];
            
            $q_report = $report == '-' ? '' : " OR a.reportType = '$report' ";
            $q_year   = $year   == '-' ? '' : " OR a.`year` = '$year' ";
            $q_status = $status == '-' ? '' : " OR a.`status` = '$status' ";
            $q_status = $status == '-' ? '' : " OR a.`status` = '$status' ";
            $q_college = $college == '-' ? '' : " OR c.`collegeID` = '$college' ";
            
            $sql = "
                SELECT 
                    a.id,
                    a.parentFolderID,
                    a.reportType,
                    c.college,
                    a.`year`,
                    a.`status`,
                    FORMAT(a.totalAmount,2) AS totalAmount,
                    CONCAT(IFNULL(b.lastName,''),', ',IFNULL(b.firstName,''),' ',IFNULL(middleName,'')) AS fullName,
                    d.approvedBy,
                    d.approvedByPosition,
                    d.preparedBy,
                    d.preparedByPosition,
                    b.email
                FROM
                    omg_gbp_parent a 
                INNER JOIN 
                    omg_registration b 
                ON 
                    a.createdBy = b.id 
                INNER JOIN	
                    omg_colleges c 
                ON 
                    b.collegeID = c.id 
                LEFT JOIN
                    omg_signatory d
                ON 
                    a.parentFolderID = d.parentFolderID
                WHERE
                    a.`status` != 'Draft' 
                    $q_report $q_year $q_status $q_college
                ORDER BY
                    a.id DESC
            ";
            return builder($con,$sql);
            
        break;
    
        case "change_status" :
            
            $status = $_POST["status"];
            $parentFolderID = $_POST["parentFolderID"];
            
            $query = "UPDATE omg_gbp_parent SET `status` = ? WHERE parentFolderID = ?";
            if ($stmt = mysqli_prepare($con, $query)) {
                mysqli_stmt_bind_param($stmt,"ss",$status,$parentFolderID);
                mysqli_stmt_execute($stmt);
               
                $error   = false;
                $color   = "green";
                $message = "GPB Status has been updated.";
                
                if ($status == "Endorse") {
                    $query = "UPDATE omg_gbp_parent SET dateEndorse = ?,reportType='GAD Plan and Budget (GPB)' WHERE parentFolderID = ?";
                    if ($stmt = mysqli_prepare($con, $query)) {
                        mysqli_stmt_bind_param($stmt,"ss",$global_date,$parentFolderID);
                        mysqli_stmt_execute($stmt);
                    }
                }
                
                $subject      = "";
                $notifRemarks = "";
                
                if ($status == "Draft") {
                    $subject = "For Revision of GPB for 2023";
                    $notifRemarks = "Your GPB created has been returned to you.";
                }
                
                if ($status == "Endorse") {
                    $subject = "For Endorse of GPB for 2023";
                    $notifRemarks = "Your GPB created has been endorse as AR.";
                }
                

                $fromID       = $_SESSION["id"];
                $notifDate    = $global_date;
                
                $query = "INSERT INTO omg_gbp_notification (parenteFolderID,subject,remarks,fromID,dateCreated) VALUES (?,?,?,?,?)";
                $stmt  = mysqli_prepare($con, $query);
                mysqli_stmt_bind_param($stmt,"sssss",$parentFolderID,$subject,$notifRemarks,$fromID,$notifDate);
                mysqli_stmt_execute($stmt);
                
                //if ($status == "Re  Endorse") {
                //    $query = "UPDATE omg_gbp_parent SET dateEndorse = ? WHERE parentFolderID = ? AND dateEndorse IS NULL";
                //    if ($stmt = mysqli_prepare($con, $query)) {
                //        mysqli_stmt_bind_param($stmt,"ss",$global_date,$parentFolderID);
                //        mysqli_stmt_execute($stmt);
                //    }
                //}
               
            } else {
                $error   = true;
                $color   = "red";
                $message = "Error updating GPB Status" . mysqli_error($con); 
            }
            
            $json[] = array(
                'error' => $error,
                'color' => $color,
                'message' => $message
            );
            echo json_encode($json);
            
        break;
    
        case "save_ann" :
            
            $subject = $_POST["subject"];
            $description = $_POST["description"];
            $annID = $_POST["annID"];
            $oldSubject = $_POST["oldSubject"];
            $isNewAnnouncement = $_POST["isNewAnnouncement"];
            $isAnn = $_POST["isAnn"];
            
            if ($annID == 0) {
                $find_query = mysqli_query($con,"SELECT * FROM omg_announcement WHERE `subject` = '$subject' AND isDeleted = 0");
                if (mysqli_num_rows($find_query) == 0) {
                    mysqli_next_result($con);
                   
                    $query = "INSERT INTO omg_announcement (subject,description,dateCreated,isAnnouncement) VALUES (?,?,?,?)";
                    if ($stmt = mysqli_prepare($con, $query)) {
                        mysqli_stmt_bind_param($stmt,"ssss",$subject,$description,$global_date,$isAnn);
                        mysqli_stmt_execute($stmt);
                       
                        $error   = false;
                        $color   = "green";
                        $message = "Announcement has been saved"; 
                       
                    } else {
                        $error   = true;
                        $color   = "red";
                        $message = "Error saving announcement"; 
                    }
                   
                } else {
                    $error   = true;
                    $color   = "red";
                    $message = "Announcement already exist"; 
                }
            } else {
                
                if ($subject != $oldSubject) {
                    $find_query = mysqli_query($con,"SELECT * FROM omg_announcement WHERE `subject` = '$subject' AND isDeleted = 0");
                    if (mysqli_num_rows($find_query) == 0) {
                        mysqli_next_result($con);
                       
                        $query = "UPDATE omg_announcement SET `subject` = ?,description = ?,isAnnouncement=? WHERE id = ?";
                        if ($stmt = mysqli_prepare($con, $query)) {
                            mysqli_stmt_bind_param($stmt,"ssss",$subject,$description,$isAnn,$annID);
                            mysqli_stmt_execute($stmt);
                           
                            $error   = false;
                            $color   = "green";
                            $message = "Announcement has been updated"; 
                           
                        } else {
                            $error   = true;
                            $color   = "red";
                            $message = "Error updating announcement"; 
                        }
                       
                    } else {
                        $error   = true;
                        $color   = "red";
                        $message = "Announcement already exist"; 
                    }
                } else {
                    $query = "UPDATE omg_announcement SET `subject` = ?,description = ?,isAnnouncement=? WHERE id = ?";
                    if ($stmt = mysqli_prepare($con, $query)) {
                        mysqli_stmt_bind_param($stmt,"ssss",$subject,$description,$isAnn,$annID);
                        mysqli_stmt_execute($stmt);
                       
                        $error   = false;
                        $color   = "green";
                        $message = "Announcement has been updated"; 
                       
                    } else {
                        $error   = true;
                        $color   = "red";
                        $message = "Error updating announcement"; 
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
    
        case "load_ann" :
            
            $sql = "
                SELECT
                    a.id,
                    a.`subject`,
                    a.description,
                    IF(a.isAnnouncement = 1,'Announcement','Schedule') as type,
                    DATE_FORMAT(a.dateCreated,'%m/%d/%Y') AS dateCreated,
                    a.isAnnouncement
                FROM
                    omg_announcement a
                WHERE
                    a.isDeleted = 0
                ORDER BY
                    a.dateCreated DESC;
            ";
            return builder($con,$sql);
            
        break;
    
        case "delete_ann" :
        
            $annID = $_POST["annID"];
            
            $query = "UPDATE omg_announcement SET isDeleted = 1 WHERE id = ?";
            if ($stmt = mysqli_prepare($con, $query)) {
                mysqli_stmt_bind_param($stmt,"s",$annID);
                mysqli_stmt_execute($stmt);
               
                $error   = false;
                $color   = "green";
                $message = "Announcement has been deleted"; 
               
            } else {
                $error   = true;
                $color   = "red";
                $message = "Error deleting announcement"; 
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