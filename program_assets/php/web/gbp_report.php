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
                $message = "GBP Status has been updated.";
                
                if ($status == "Endorse") {
                    $query = "UPDATE omg_gbp_parent SET dateEndorse = ? WHERE parentFolderID = ? AND dateEndorse IS NULL";
                    if ($stmt = mysqli_prepare($con, $query)) {
                        mysqli_stmt_bind_param($stmt,"ss",$global_date,$parentFolderID);
                        mysqli_stmt_execute($stmt);
                    }
                }
               
            } else {
                $error   = true;
                $color   = "red";
                $message = "Error updating GBP Status" . mysqli_error($con); 
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