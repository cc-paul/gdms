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
        case "create_folder" :
            
            $folderID = $_POST["folderID"];
            
            if (!mkdir('../../../documents/' . $folderID, 0777, true)) {
                $error   = true;
                $color   = "red";
                $message = "There is an error creating folder"; 
            }
            
            $json[] = array(
                'error' => $error,
                'color' => $color,
                'message' => $message
            );
            echo json_encode($json);
            
        break;
    
        case "create_folder_copy" :
            
            $oldFolderID = $_POST["oldFolderID"];
            $newFolderID = $_POST["newFolderID"];
            
            if (!mkdir('../../../documents/' . $newFolderID, 0777, true)) {
                $error   = true;
                $color   = "red";
                $message = "There is an error creating folder";
            } else {
                recursiveCopy('../../../documents/' . $oldFolderID,'../../../documents/' . $newFolderID);
            }
            
            $json[] = array(
                'error' => $error,
                'color' => $color,
                'message' => $message
            );
            echo json_encode($json);
            
        break;
    
        case "upload_file" :
            
            $folderID   = $_POST["folderID"];
            $fileName   = $_POST["fileName"];
            $location   = '../../../documents/'. $folderID . '/' . $fileName;
            
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
            
            $folderID   = $_POST["folderID"];
            $fileName   = $_POST["fileName"];
            $location   = '../../../documents/'. $folderID . '/' . $fileName;
            
            if (unlink($location)) {
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
        
        case "save_gbp";
            
            $folderID                = $_POST["folderID"];
            $genderIssueAddress      = $_POST["genderIssueAddress"];
            $gadAddress              = $_POST["gadAddress"];
            $gadActivity             = $_POST["gadActivity"];
            $arrGenderIssue          = $_POST["arrGenderIssue"];
            $arrGADStatement         = $_POST["arrGADStatement"];
            $arrRelevantMFO          = $_POST["arrRelevantMFO"];
            $arrPerformanceIndicator = $_POST["arrPerformanceIndicator"];
            $arrBudget               = $_POST["arrBudget"];
            $arrResponsibleOffices   = $_POST["arrResponsibleOffices"];
            $arrFiles                = $_POST["arrFiles"];
            $selectedTab             = $_POST["selectedTab"];
            $parentFolderID          = $_POST["parentFolderID"];
            
            mysqli_query($con,"DELETE FROM omg_gbp_budget WHERE folderID = '$folderID'");
            mysqli_query($con,"DELETE FROM omg_gbp_files WHERE folderID = '$folderID'");
            mysqli_query($con,"DELETE FROM omg_gbp_gadresult WHERE folderID = '$folderID'");
            mysqli_query($con,"DELETE FROM omg_gbp_genderissue WHERE folderID = '$folderID'");
            mysqli_query($con,"DELETE FROM omg_gbp_mfo WHERE folderID = '$folderID'");
            mysqli_query($con,"DELETE FROM omg_gbp_offices WHERE folderID = '$folderID'");
            mysqli_query($con,"DELETE FROM omg_gbp_performanceindicator WHERE folderID = '$folderID'");
            
            //sleep(2);
            
            if ($arrGenderIssue != "") {
                mysqli_query($con,"INSERT INTO omg_gbp_genderissue (folderID,genderIssue) VALUES $arrGenderIssue");
            }
            
            if ($arrGADStatement != "") {
                mysqli_query($con,"INSERT INTO omg_gbp_gadresult (folderID,gadResult) VALUES $arrGADStatement");
            }
            
            if ($arrRelevantMFO != "") {
                mysqli_query($con,"INSERT INTO omg_gbp_mfo (folderID,type,statement) VALUES $arrRelevantMFO");
            }
            
            if ($arrPerformanceIndicator != "") {
                mysqli_query($con,"INSERT INTO omg_gbp_performanceindicator (folderID,performanceIndicator,target) VALUES $arrPerformanceIndicator");
            }
            
            if ($arrBudget != "") {
                mysqli_query($con,"INSERT INTO omg_gbp_budget (folderID,budgetSource,budgetItem,budget) VALUES $arrBudget");
            }
            
            if ($arrResponsibleOffices != "") {
                mysqli_query($con,"INSERT INTO omg_gbp_offices (folderID,responsibleOffices) VALUES $arrResponsibleOffices");
            }
            
            if ($arrFiles != "") {
                mysqli_query($con,"INSERT INTO omg_gbp_files (folderID,filename) VALUES $arrFiles");
            }
            
            $find_query = mysqli_query($con,"SELECT * FROM omg_gbp WHERE folderID = '$folderID'");
            if (mysqli_num_rows($find_query) == 0) {
                mysqli_next_result($con);
               
                $query = "INSERT INTO omg_gbp (folderID,genderID,gadID,gadActivity,tab,parentFolderID) VALUES (?,?,?,?,?,?)";
                if ($stmt = mysqli_prepare($con, $query)) {
                    mysqli_stmt_bind_param($stmt,"ssssss",$folderID,$genderIssueAddress,$gadAddress,$gadActivity,$selectedTab,$parentFolderID);
                    mysqli_stmt_execute($stmt);
                   
                    $error   = false;
                    $color   = "green";
                    $message = "GBP has been added successfully"; 
                   
                } else {
                    $error   = true;
                    $color   = "red";
                    $message = "Error adding GBP"; 
                }
               
            } else {
                $query = "UPDATE omg_gbp SET genderID = ?,gadID = ?,gadActivity = ?,parentFolderID = ? WHERE folderID = ?";
                if ($stmt = mysqli_prepare($con, $query)) {
                    mysqli_stmt_bind_param($stmt,"sssss",$genderIssueAddress,$gadAddress,$gadActivity,$parentFolderID,$folderID);
                    mysqli_stmt_execute($stmt);
                   
                    $error   = false;
                    $color   = "green";
                    $message = "GBP has been updated successfully"; 
                   
                } else {
                    $error   = true;
                    $color   = "red";
                    $message = "Error adding GBP"; 
                }
            }
            
            $json[] = array(
                'error' => $error,
                'color' => $color,
                'message' => $message
            );
            echo json_encode($json);
            
        break;
    
        case "save_gbp_attr";
            
            $folderID  = $_POST["folderID"];
            $program   = $_POST["program"];
            $arrBudget = $_POST["arrBudget"];
            $arrFiles  = $_POST["arrFiles"];
            $parentFolderID = $_POST["parentFolderID"];
            
            mysqli_query($con,"DELETE FROM omg_gbp_budget WHERE folderID = '$folderID'");
            mysqli_query($con,"DELETE FROM omg_gbp_files WHERE folderID = '$folderID'");
            
            if ($arrBudget != "") {
                mysqli_query($con,"INSERT INTO omg_gbp_budget (folderID,budgetSource,budgetItem,budget) VALUES $arrBudget");
            }
            
            if ($arrFiles != "") {
                mysqli_query($con,"INSERT INTO omg_gbp_files (folderID,filename) VALUES $arrFiles");
            }
            
            $find_query = mysqli_query($con,"SELECT * FROM omg_gbp WHERE folderID = '$folderID'");
            if (mysqli_num_rows($find_query) == 0) {
                mysqli_next_result($con);
               
                $query = "INSERT INTO omg_gbp (folderID,program,parentFolderID) VALUES (?,?,?)";
                if ($stmt = mysqli_prepare($con, $query)) {
                    mysqli_stmt_bind_param($stmt,"sss",$folderID,$program,$parentFolderID);
                    mysqli_stmt_execute($stmt);
                   
                    $error   = false;
                    $color   = "green";
                    $message = "Attribute has been added successfully"; 
                   
                } else {
                    $error   = true;
                    $color   = "red";
                    $message = "Error adding attribute"; 
                }
               
            } else {
                $query = "UPDATE omg_gbp SET program = ?,parentFolderID = ? WHERE folderID = ?";
                if ($stmt = mysqli_prepare($con, $query)) {
                    mysqli_stmt_bind_param($stmt,"ss",$program,$parentFolderID,$folderID);
                    mysqli_stmt_execute($stmt);
                   
                    $error   = false;
                    $color   = "green";
                    $message = "GBP has been updated successfully"; 
                   
                } else {
                    $error   = true;
                    $color   = "red";
                    $message = "Error adding GBP"; 
                }
            }
            
            $json[] = array(
                'error' => $error,
                'color' => $color,
                'message' => $message
            );
            echo json_encode($json);
            
        break;
        
        case "load_activity" :
            
            $tab = $_POST["tab"];
            $parentFolderID = $_POST["parentFolderID"];
            
            $sql = "
                SELECT
                    a.id,
                    a.folderID,
                    a.genderID,
                    a.gadID,
                    a.gadActivity,                    
                    IFNULL((SELECT statement FROM omg_masterfile WHERE id = a.genderID),' - ') AS gender,
                    IFNULL((SELECT statement FROM omg_masterfile WHERE id = a.gadID),' - ') AS gad,
                    d.performanceIndicator,
                    FORMAT(SUM(e.budget),2) budget,
                    IFNULL((
                            SELECT GROUP_CONCAT(CONCAT(budgetSource,'~',budgetItem,'~',budget) SEPARATOR '~~') FROM omg_gbp_budget WHERE folderID = a.folderID
                    ),'') AS arrBudget,
                    IFNULL((
                            SELECT GROUP_CONCAT(CONCAT(fileName) SEPARATOR '~~') FROM omg_gbp_files WHERE folderID = a.folderID
                    ),'') AS arrFiles,
                    IFNULL((
                            SELECT GROUP_CONCAT(CONCAT(gadResult) SEPARATOR '~~') FROM omg_gbp_gadresult WHERE folderID = a.folderID
                    ),'') AS arrGADResult,
                    IFNULL((
                            SELECT GROUP_CONCAT(CONCAT(genderIssue) SEPARATOR '~~') FROM omg_gbp_genderissue WHERE folderID = a.folderID
                    ),'') AS arrGenderIssue,
                    IFNULL((
                            SELECT GROUP_CONCAT(CONCAT(type,'~',statement) SEPARATOR '~~') FROM omg_gbp_mfo WHERE folderID = a.folderID
                    ),'') AS arrMFO,
                    IFNULL((
                            SELECT GROUP_CONCAT(CONCAT(responsibleOffices) SEPARATOR '~~') FROM omg_gbp_offices WHERE folderID = a.folderID
                    ),'') AS arrOffices,
                    IFNULL((
                            SELECT GROUP_CONCAT(CONCAT(performanceIndicator,'~',target) SEPARATOR '~~') FROM omg_gbp_performanceindicator WHERE folderID = a.folderID
                    ),'') AS arrPerformanceIndicator
                FROM
                    omg_gbp a 
                INNER JOIN
                    omg_gbp_performanceindicator d 
                ON 
                    a.folderID = d.folderID 
                INNER JOIN
                    omg_gbp_budget e 
                ON 
                    a.folderID = e.folderID
                WHERE
                    a.isRemoved = 0
                AND
                    a.parentFolderID = '$parentFolderID'
                AND
                    a.tab = $tab
                GROUP BY
                    a.folderID
            ";
            return builder($con,$sql);
            
        break;
    
        case "load_activity_parent" :
            
            $sql    = "
                SELECT 
                    a.id,   
                    a.parentFolderID,
                    FORMAT(a.totalAmount,2) AS totalAmount,
                    a.`year`,
                    a.`status`,
                    c.approvedBy,
                    c.approvedByPosition,
                    c.preparedBy,
                    c.preparedByPosition
                FROM
                    omg_gbp_parent a 
                INNER JOIN
                    omg_gbp b 
                ON 
                    a.parentFolderID = b.parentFolderID 
                LEFT JOIN
                    omg_signatory c 
                ON 
                    a.parentFolderID = c.parentFolderID
                ORDER BY
                    a.id DESC 
                LIMIT 1
            ";
            $result = mysqli_query($con,$sql);
            
            $json = array();
            while ($row  = mysqli_fetch_assoc($result)) {
                $json[] = array(
                    'id'              => $row["id"],
                    'parentFolderID'  => $row["parentFolderID"],
                    'totalAmount'     => $row["totalAmount"],
                    'year'            => $row["year"],
                    'status'          => $row["status"],
                    'approvedBy'         => $row["approvedBy"],
                    'approvedByPosition' => $row["approvedByPosition"],
                    'preparedBy'         => $row["preparedBy"],
                    'preparedByPosition' => $row["preparedByPosition"]
                );
            }
            echo json_encode($json);
            
        break;
    
        case "load_activity_view" :
            
            $tab = $_POST["tab"];
            $parentFolderID = $_POST["parentFolderID"];
            
            $sql = "
                SELECT
                    a.id,
                    a.folderID,
                    a.genderID,
                    a.gadID,
                    a.gadActivity,                    
                    IFNULL((SELECT statement FROM omg_masterfile WHERE id = a.genderID),' - ') AS gender,
                    IFNULL((SELECT statement FROM omg_masterfile WHERE id = a.gadID),' - ') AS gad,
                    d.performanceIndicator,
                    FORMAT(SUM(e.budget),2) budget,
                    IFNULL((
                            SELECT GROUP_CONCAT(CONCAT(budgetSource,'~',budgetItem,'~',REPLACE(FORMAT(budget,2),'.00','')) SEPARATOR '~~') FROM omg_gbp_budget WHERE folderID = a.folderID
                    ),'') AS arrBudget,
                    IFNULL((
                            SELECT GROUP_CONCAT(CONCAT(fileName) SEPARATOR '~~') FROM omg_gbp_files WHERE folderID = a.folderID
                    ),'') AS arrFiles,
                    IFNULL((
                            SELECT GROUP_CONCAT(CONCAT(gadResult) SEPARATOR '~~') FROM omg_gbp_gadresult WHERE folderID = a.folderID
                    ),'') AS arrGADResult,
                    IFNULL((
                            SELECT GROUP_CONCAT(CONCAT(genderIssue) SEPARATOR '~~') FROM omg_gbp_genderissue WHERE folderID = a.folderID
                    ),'') AS arrGenderIssue,
                    IFNULL((
                            SELECT GROUP_CONCAT(CONCAT(type,'~',statement) SEPARATOR '~~') FROM omg_gbp_mfo WHERE folderID = a.folderID
                    ),'') AS arrMFO,
                    IFNULL((
                            SELECT GROUP_CONCAT(CONCAT(responsibleOffices) SEPARATOR '~~') FROM omg_gbp_offices WHERE folderID = a.folderID
                    ),'') AS arrOffices,
                    IFNULL((
                            SELECT GROUP_CONCAT(CONCAT(performanceIndicator,'~',target) SEPARATOR '~~') FROM omg_gbp_performanceindicator WHERE folderID = a.folderID
                    ),'') AS arrPerformanceIndicator
                FROM
                    omg_gbp a 
                INNER JOIN
                    omg_gbp_performanceindicator d 
                ON 
                    a.folderID = d.folderID 
                INNER JOIN
                    omg_gbp_budget e 
                ON 
                    a.folderID = e.folderID
                WHERE
                    a.isRemoved = 0
                AND
                    a.parentFolderID = '$parentFolderID'
                AND
                    a.tab = $tab
                GROUP BY
                    a.folderID
            ";
            
            $result = mysqli_query($con,$sql);
            
            $json = array();
            while ($row  = mysqli_fetch_assoc($result)) {
                $json[] = array(
                    'id' => $row["id"],
                    'folderID' => $row["folderID"],
                    'genderID' => $row["genderID"],
                    'gadID' => $row["gadID"],
                    'gadActivity' => $row["gadActivity"],
                    'gender' => $row["gender"],
                    'gad' => $row["gad"],
                    'performanceIndicator' => $row["performanceIndicator"],
                    'budget' => $row["budget"],
                    'arrBudget' => $row["arrBudget"],
                    'arrFiles' => $row["arrFiles"],
                    'arrGADResult' => $row["arrGADResult"],
                    'arrGenderIssue' => $row["arrGenderIssue"],
                    'arrMFO' => $row["arrMFO"],
                    'arrOffices' => $row["arrOffices"],
                    'arrPerformanceIndicator' => $row["arrPerformanceIndicator"]
                );
            }
            echo json_encode($json);
            
        break;
    
        case "load_attr_view" :
            
            $tab = $_POST["tab"];
            $parentFolderID = $_POST["parentFolderID"];
            
            $sql = "
                SELECT
                    a.id,
                    a.folderID,
                    a.genderID,
                    a.gadID,
                    a.program AS gadActivity,                    
                    IFNULL((SELECT statement FROM omg_masterfile WHERE id = a.genderID),' - ') AS gender,
                    IFNULL((SELECT statement FROM omg_masterfile WHERE id = a.gadID),' - ') AS gad,
                    d.performanceIndicator,
                    FORMAT(SUM(e.budget),2) budget,
                    IFNULL((
                                    SELECT GROUP_CONCAT(CONCAT(budgetSource,'~',budgetItem,'~',REPLACE(FORMAT(budget,2),'.00','')) SEPARATOR '~~') FROM omg_gbp_budget WHERE folderID = a.folderID
                    ),'') AS arrBudget,
                    IFNULL((
                                    SELECT GROUP_CONCAT(CONCAT(fileName) SEPARATOR '~~') FROM omg_gbp_files WHERE folderID = a.folderID
                    ),'') AS arrFiles,
                    IFNULL((
                                    SELECT GROUP_CONCAT(CONCAT(gadResult) SEPARATOR '~~') FROM omg_gbp_gadresult WHERE folderID = a.folderID
                    ),'') AS arrGADResult,
                    IFNULL((
                                    SELECT GROUP_CONCAT(CONCAT(genderIssue) SEPARATOR '~~') FROM omg_gbp_genderissue WHERE folderID = a.folderID
                    ),'') AS arrGenderIssue,
                    IFNULL((
                                    SELECT GROUP_CONCAT(CONCAT(type,'~',statement) SEPARATOR '~~') FROM omg_gbp_mfo WHERE folderID = a.folderID
                    ),'') AS arrMFO,
                    IFNULL((
                                    SELECT GROUP_CONCAT(CONCAT(responsibleOffices) SEPARATOR '~~') FROM omg_gbp_offices WHERE folderID = a.folderID
                    ),'') AS arrOffices,
                    IFNULL((
                                    SELECT GROUP_CONCAT(CONCAT(performanceIndicator,'~',target) SEPARATOR '~~') FROM omg_gbp_performanceindicator WHERE folderID = a.folderID
                    ),'') AS arrPerformanceIndicator
                FROM
                    omg_gbp a 
                LEFT JOIN
                    omg_gbp_performanceindicator d 
                ON 
                    a.folderID = d.folderID 
                LEFT JOIN
                    omg_gbp_budget e 
                ON 
                    a.folderID = e.folderID
                WHERE
                    a.isRemoved = 0
                AND
                    a.parentFolderID = '$parentFolderID'
                AND
                    a.tab = $tab
                GROUP BY
                    a.folderID
            ";
            
            $result = mysqli_query($con,$sql);
            
            $json = array();
            while ($row  = mysqli_fetch_assoc($result)) {
                $json[] = array(
                    'id' => $row["id"],
                    'folderID' => $row["folderID"],
                    'genderID' => $row["genderID"],
                    'gadID' => $row["gadID"],
                    'gadActivity' => $row["gadActivity"],
                    'gender' => $row["gender"],
                    'gad' => $row["gad"],
                    'performanceIndicator' => $row["performanceIndicator"],
                    'budget' => $row["budget"],
                    'arrBudget' => $row["arrBudget"],
                    'arrFiles' => $row["arrFiles"],
                    'arrGADResult' => $row["arrGADResult"],
                    'arrGenderIssue' => $row["arrGenderIssue"],
                    'arrMFO' => $row["arrMFO"],
                    'arrOffices' => $row["arrOffices"],
                    'arrPerformanceIndicator' => $row["arrPerformanceIndicator"]
                );
            }
            echo json_encode($json);
            
        break;
    
        case "load_activity2" :
            
            $tab = $_POST["tab"];
            $parentFolderID = $_POST["parentFolderID"];
            
            $sql = "
                SELECT
                    a.id,
                    a.folderID,
                    a.genderID,
                    a.gadID,
                    a.gadActivity,
                    b.statement AS gender,
                    c.statement AS gad,
                    d.performanceIndicator,
                    FORMAT(SUM(e.budget),2) budget,
                    IFNULL((
                            SELECT GROUP_CONCAT(CONCAT(budgetSource,'~',budgetItem,'~',budget) SEPARATOR '~~') FROM omg_gbp_budget WHERE folderID = a.folderID
                    ),'') AS arrBudget,
                    IFNULL((
                            SELECT GROUP_CONCAT(CONCAT(fileName) SEPARATOR '~~') FROM omg_gbp_files WHERE folderID = a.folderID
                    ),'') AS arrFiles,
                    IFNULL((
                            SELECT GROUP_CONCAT(CONCAT(gadResult) SEPARATOR '~~') FROM omg_gbp_gadresult WHERE folderID = a.folderID
                    ),'') AS arrGADResult,
                    IFNULL((
                            SELECT GROUP_CONCAT(CONCAT(genderIssue) SEPARATOR '~~') FROM omg_gbp_genderissue WHERE folderID = a.folderID
                    ),'') AS arrGenderIssue,
                    IFNULL((
                            SELECT GROUP_CONCAT(CONCAT(type,'~',statement) SEPARATOR '~~') FROM omg_gbp_mfo WHERE folderID = a.folderID
                    ),'') AS arrMFO,
                    IFNULL((
                            SELECT GROUP_CONCAT(CONCAT(responsibleOffices) SEPARATOR '~~') FROM omg_gbp_offices WHERE folderID = a.folderID
                    ),'') AS arrOffices,
                    IFNULL((
                            SELECT GROUP_CONCAT(CONCAT(performanceIndicator,'~',target) SEPARATOR '~~') FROM omg_gbp_performanceindicator WHERE folderID = a.folderID
                    ),'') AS arrPerformanceIndicator
                FROM
                    omg_gbp a 
                INNER JOIN
                    omg_masterfile b 
                ON 
                    a.genderID = b.id 
                INNER JOIN
                    omg_masterfile c 
                ON 
                    a.gadID = c.id 
                INNER JOIN
                    omg_gbp_performanceindicator d 
                ON 
                    a.folderID = d.folderID 
                INNER JOIN
                    omg_gbp_budget e 
                ON 
                    a.folderID = e.folderID
                WHERE
                    a.isRemoved = 0 
                AND
                    a.parentFolderID = '$parentFolderID'
                AND
                    a.tab IN (1,2)
                GROUP BY
                    a.folderID
            ";
            return builder($con,$sql);
            
        break;
        
        case "delete_activity" :
            
            $id = $_POST["id"];
            
            $query = "UPDATE omg_gbp SET isRemoved = 1 WHERE id = ?";
            if ($stmt = mysqli_prepare($con, $query)) {
                mysqli_stmt_bind_param($stmt,"i",$id);
                mysqli_stmt_execute($stmt);
               
                $error   = false;
                $color   = "green";
                $message = "Activity has been removed successfully"; 
               
            } else {
                $error   = true;
                $color   = "red";
                $message = "Error when deleting activity"; 
            }
            
            $json[] = array(
                'error' => $error,
                'color' => $color,
                'message' => $message
            );
            echo json_encode($json);
            
        break;
        
        case "copy_activity" :
            
            $oldFolderID = $_POST["oldFolderID"];
            $newFolderID = $_POST["newFolderID"];
            
            $query1 = mysqli_query($con,"INSERT INTO omg_gbp (folderID,genderID,gadID,gadActivity,program,tab,parentFolderID) SELECT '$newFolderID',genderID,gadID,gadActivity,program,tab,parentFolderID FROM omg_gbp WHERE folderID = '$oldFolderID'");
            $query2 = mysqli_query($con,"INSERT INTO omg_gbp_genderissue (folderID,genderIssue) SELECT '$newFolderID',genderIssue FROM omg_gbp_genderissue WHERE folderID = '$oldFolderID'");
            $query3 = mysqli_query($con,"INSERT INTO omg_gbp_gadresult (folderID,gadResult) SELECT '$newFolderID',gadResult FROM omg_gbp_gadresult WHERE folderID = '$oldFolderID'");
            $query4 = mysqli_query($con,"INSERT INTO omg_gbp_mfo (folderID,type,statement) SELECT '$newFolderID',type,statement FROM omg_gbp_mfo WHERE folderID = '$oldFolderID'");
            $query5 = mysqli_query($con,"INSERT INTO omg_gbp_performanceindicator (folderID,performanceIndicator,target) SELECT '$newFolderID',performanceIndicator,target FROM omg_gbp_performanceindicator WHERE folderID = '$oldFolderID'");
            $query6 = mysqli_query($con,"INSERT INTO omg_gbp_budget (folderID,budgetSource,budgetItem,budget) SELECT '$newFolderID',budgetSource,budgetItem,budget FROM omg_gbp_budget WHERE folderID = '$oldFolderID'");
            $query7 = mysqli_query($con,"INSERT INTO omg_gbp_offices (folderID,responsibleOffices) SELECT '$newFolderID',responsibleOffices FROM omg_gbp_offices WHERE folderID = '$oldFolderID'");
            $query8 = mysqli_query($con,"INSERT INTO omg_gbp_files (folderID,filename) SELECT '$newFolderID',filename FROM omg_gbp_files WHERE folderID = '$oldFolderID'");
            
            if (
                $query1 &&
                $query2 &&
                $query3 &&
                $query4 &&
                $query5 &&
                $query6 &&
                $query7 &&
                $query8
            ) {
                $error   = false;
                $color   = "green";
                $message = "Selected activity has been duplicated"; 
            } else {
                $error   = true;
                $color   = "green";
                $message = "Error copying activity"; 
            }
            
            $json[] = array(
                'error' => $error,
                'color' => $color,
                'message' => $message
            );
            echo json_encode($json);
            
        break;
    
        case "delete_all_activity" :
            
            $folderIDS = $_POST["folderIDS"];
            $tab = $_POST["tab"];
            
            $query = mysqli_query($con,"UPDATE omg_gbp SET isRemoved = 1 WHERE folderID IN ($folderIDS) AND tab = $tab");
            
            if ($query) {
                $error   = false;
                $color   = "green";
                $message = "All activity has been deleted"; 
            } else {
                $error   = true;
                $color   = "green";
                $message = "Error deleting all activity"; 
            }
            
            $json[] = array(
                'error' => $error,
                'color' => $color,
                'message' => $message
            );
            echo json_encode($json);
            
            
        break;
    
        case "load_attr" :
            
            $parentFolderID = $_POST["parentFolderID"];
            
            $sql = "
                SELECT
                    a.program,
                    REPLACE(FORMAT(SUM(b.budget),2),'.00','') AS budget,
                    (
                        SELECT GROUP_CONCAT(CONCAT(budgetSource,'~',budgetItem,'~',REPLACE(FORMAT(budget,2),'.00','')) SEPARATOR '~~') FROM omg_gbp_budget WHERE folderID = a.folderID
                    ) AS source,
                    (
                        SELECT GROUP_CONCAT(fileName) FROM omg_gbp_files WHERE folderID = a.folderID
                    ) AS files,
                    a.folderID,
                    a.id,
                    IFNULL((
                            SELECT GROUP_CONCAT(CONCAT(budgetSource,'~',budgetItem,'~',budget) SEPARATOR '~~') FROM omg_gbp_budget WHERE folderID = a.folderID
                    ),'') AS arrBudget
                FROM
                    omg_gbp a 
                INNER JOIN
                    omg_gbp_budget b 
                ON
                    a.folderID = b.folderID 
                WHERE
                    IFNULL(a.program,'') != '' 
                AND 
                    a.isRemoved = 0
                AND
                    a.parentFolderID = '$parentFolderID'
                GROUP BY
                  a.id
                ORDER BY
                a.id Desc;
            ";
            return builder($con,$sql);
            
        break;
    
        case "save_parent_gbp" :
            
            $parentFolderID = $_POST["parentFolderID"]; 
            $year           = $_POST["year"]; 
            $total          = str_replace(",","",$_POST["total"]);
            
            $find_query = mysqli_query($con,"SELECT * FROM omg_gbp_parent WHERE parentFolderID = '$parentFolderID'");
            if (mysqli_num_rows($find_query) == 0) {
                mysqli_next_result($con);
               
                $query = "INSERT INTO omg_gbp_parent (parentFolderID,totalAmount,year) VALUES (?,?,?)";
                if ($stmt = mysqli_prepare($con, $query)) {
                    mysqli_stmt_bind_param($stmt,"sss",$parentFolderID,$total,$year);
                    mysqli_stmt_execute($stmt);
                   
                    $error   = false;
                    $color   = "green";
                    $message = "GBP has been saved as Draft. You can still edit it or refresh the page to create a new one"; 
                   
                } else {
                    $error   = true;
                    $color   = "red";
                    $message = "Error saving GBP"; 
                }
               
            } else {
                $query = "UPDATE omg_gbp_parent SET totalAmount = ?,year =? WHERE parentFolderID = ?";
                if ($stmt = mysqli_prepare($con, $query)) {
                    mysqli_stmt_bind_param($stmt,"sss",$total,$year,$parentFolderID);
                    mysqli_stmt_execute($stmt);
                   
                    $error   = false;
                    $color   = "green";
                    $message = "GBP has been updated successfully. You can still edit it or refresh the page to create a new one"; 
                   
                } else {
                    $error   = true;
                    $color   = "red";
                    $message = "Error saving GBP"; 
                }
            }
            
            $json[] = array(
                'error' => $error,
                'color' => $color,
                'message' => $message
            );
            echo json_encode($json);
            
        break;
    
        case "gbp_group" :
            
            $parentFolderID = $_POST["parentFolderID"];
            
            $sql    = "
                SELECT
                    a.budgetSource,
                    FORMAT(SUM(a.budget),2) AS alloc_budget
                FROM
                    omg_gbp_budget a
                WHERE
                    a.folderID IN (
                        SELECT folderID FROM omg_gbp WHERE parentFolderID = '$parentFolderID' AND `tab` IN (1,2)
                    )
                GROUP BY
                    a.budgetSource
            ";
            $result = mysqli_query($con,$sql);
            
            $json = array();
            while ($row  = mysqli_fetch_assoc($result)) {
                $json[] = array(
                    'budgetSource' => $row["budgetSource"],
                    'alloc_budget' => $row["alloc_budget"]
                );
            }
            echo json_encode($json);
            
        break;
    
        case "save_signatory" :
            
            $parentFolderID = $_POST["parentFolderID"];
            $preparedBy = $_POST["preparedBy"];
            $preparedByPosition = $_POST["preparedByPosition"];
            $approvedBy = $_POST["approvedBy"];
            $approvedByPosition = $_POST["approvedByPosition"];
            
            $find_query = mysqli_query($con,"SELECT * FROM omg_signatory WHERE parentFolderID = '$parentFolderID'");
            if (mysqli_num_rows($find_query) == 0) {
                mysqli_next_result($con);
           
                $query = "INSERT INTO omg_signatory (parentFolderID,preparedBy,preparedByPosition,approvedBy,approvedByPosition) VALUES (?,?,?,?,?)";
                if ($stmt = mysqli_prepare($con, $query)) {
                    mysqli_stmt_bind_param($stmt,"sssss",$parentFolderID,$preparedBy,$preparedByPosition,$approvedBy,$approvedByPosition);
                    mysqli_stmt_execute($stmt);
                   
                    $error   = false;
                    $color   = "green";
                    $message = "Signatory has been saved"; 
                   
                } else {
                    $error   = true;
                    $color   = "red";
                    $message = "Error saving signatory"; 
                }
               
            } else {
                
                $query = "UPDATE omg_signatory SET preparedBy = ?,preparedByPosition = ?,approvedBy = ?,approvedByPosition = ? WHERE parentFolderID = ?";
                if ($stmt = mysqli_prepare($con, $query)) {
                    mysqli_stmt_bind_param($stmt,"sssss",$preparedBy,$preparedByPosition,$approvedBy,$approvedByPosition,$parentFolderID);
                    mysqli_stmt_execute($stmt);
                   
                    $error   = false;
                    $color   = "green";
                    $message = "Signatory has been updated"; 
                   
                } else {
                    $error   = true;
                    $color   = "red";
                    $message = "Error saving signatory"; 
                }
                
            }
            
            $json[] = array(
                'error' => $error,
                'color' => $color,
                'message' => $message
            );
            echo json_encode($json);
            
        break;
    
        case "show_signatory" :
            
            $parentFolderID = $_POST["parentFolderID"];
            
            $sql    = "SELECT * FROM omg_signatory WHERE parentFolderID = '$parentFolderID'";
            $result = mysqli_query($con,$sql);
            
            $json = array();
            while ($row  = mysqli_fetch_assoc($result)) {
                $json[] = array(
                    'preparedBy'  => $row["preparedBy"],
                    'preparedByPosition' => $row["preparedByPosition"],
                    'approvedBy'  => $row["approvedBy"],
                    'approvedByPosition'  => $row["approvedByPosition"]
                );
            }
            echo json_encode($json);
            
        break;
    
        case "save_comment" :
            
            $commentMotherID = $_POST["commentMotherID"];
            $comment         = $_POST["comment"];
            $dateCreated     = $global_date;
            $createdBy       = $_SESSION["id"];
            
            $query = "INSERT INTO omg_comments (commentMotherID,comment,dateCreated,createdBy) VALUES (?,?,?,?)";
            if ($stmt = mysqli_prepare($con, $query)) {
                mysqli_stmt_bind_param($stmt,"ssss",$commentMotherID,$comment,$dateCreated,$createdBy);
                mysqli_stmt_execute($stmt);
               
                $error   = false;
                $color   = "green";
                $message = "Comment has been saved successfully"; 
               
            } else {
                $error   = true;
                $color   = "red";
                $message = "Error saving comment"; 
            }
            
            $json[] = array(
                'error' => $error,
                'color' => $color,
                'message' => $message,
                'last_id' => mysqli_insert_id($con)
            );
            echo json_encode($json);
            
        break;
    
        case "upload_file_comment" :
            
            $folderID   = $_POST["folderID"];
            $fileName   = $_POST["fileName"];
            $commentMotherID = $_POST["commentMotherID"];
            $location   = '../../../documents/'. $folderID . '/' . $fileName;
            
            if ( 0 < $_FILES['file']['error'] ) {
                $error   = true;
                $color   = "red";
                $message = "There is an error uploading your file. Please try again later";
            } else {
                
                if (!mkdir('../../../documents/' . $folderID, 0777, true)) {
                    $error   = true;
                    $color   = "red";
                    $message = "There is an error creating folder"; 
                }
                
                if (file_exists($location)) {
                    
                    $error   = true;
                    $color   = "red";
                    $message = "File already added";
                    
                } else {
                    if (move_uploaded_file($_FILES['file']['tmp_name'], $location)) {
                        
                        $query = "UPDATE omg_comments SET folderID=?,fileName=? WHERE id = ?";
                        if ($stmt = mysqli_prepare($con, $query)) {
                            mysqli_stmt_bind_param($stmt,"sss",$folderID,$fileName,$commentMotherID);
                            mysqli_stmt_execute($stmt);
                           
                            $error   = false;
                            $color   = "green";
                            $message = "Comment has been added";
                           
                        } else {
                            $error   = true;
                            $color   = "red";
                            $message = "There is an error adding comment. Please try again later";
                        }
                        
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
    
        case "show_comments" :
            
            $commentMotherID = $_POST["commentMotherID"];
            
            $sql    = "
                SELECT
                    CONCAT(b.lastName,', ',b.firstName,' ',IFNULL(b.middleName,'')) AS fullName,
                    a.`comment`,
                    a.dateCreated,
                    a.folderID,
                    a.fileName,
                    a.id
                FROM
                    omg_comments a 
                INNER JOIN
                    omg_registration b
                ON
                    a.createdBy = b.id
                WHERE
                    commentMotherID = '$commentMotherID'
                ORDER BY
                    a.dateCreated DESC;
            ";
            $result = mysqli_query($con,$sql);
            
            $json = array();
            while ($row  = mysqli_fetch_assoc($result)) {
                $json[] = array(
                    'fullName'    => $row["fullName"],
                    'comment'     => $row["comment"],
                    'dateCreated' => formatTimeAgo($row["dateCreated"]),
                    'folderID'    => $row["folderID"],
                    'fileName'    => $row["fileName"],
                    'id'          => $row["id"]
                );
            }
            echo json_encode($json);
            
        break;
    
        case "delete_comment" :
            
            $query = "DELETE FROM omg_comments WHERE id = ?";
            if ($stmt = mysqli_prepare($con, $query)) {
                mysqli_stmt_bind_param($stmt,"s",$_POST["commentID"]);
                mysqli_stmt_execute($stmt);
               
                $error   = false;
                $color   = "green";
                $message = ""; 
               
            } else {
                $error   = true;
                $color   = "red";
                $message = ""; 
            }
            
            $json[] = array(
                'error' => $error,
                'color' => $color,
                'message' => $message
            );
            echo json_encode($json);
            
        break;
        
        case "gbp_for_approval" :
            
            $parentFolderID = $_POST["parentFolderID"];
            $remarks        = $_POST["remarks"];
            
            $query = "UPDATE omg_gbp_parent SET `status` = 'For Review',remarks = ? WHERE parentFolderID =?";
            if ($stmt = mysqli_prepare($con, $query)) {
                mysqli_stmt_bind_param($stmt,"ss",$remarks,$parentFolderID);
                mysqli_stmt_execute($stmt);
               
                $error   = false;
                $color   = "green";
                $message = "GBP has been sent for approval"; 
               
            } else {
                $error   = true;
                $color   = "red";
                $message = "Error submitting GBP"; 
            }
            
            $json[] = array(
                'error' => $error,
                'color' => $color,
                'message' => $message
            );
            echo json_encode($json);
            
        break;
    }
    
    function recursiveCopy($source, $destination) {
        if (!file_exists($destination)) {
            mkdir($destination);
        }
    
        $splFileInfoArr = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($source), RecursiveIteratorIterator::SELF_FIRST);
    
        foreach ($splFileInfoArr as $fullPath => $splFileinfo) {
            //skip . ..
            if (in_array($splFileinfo->getBasename(), [".", ".."])) {
                continue;
            }
            //get relative path of source file or folder
            $path = str_replace($source, "", $splFileinfo->getPathname());
    
            if ($splFileinfo->isDir()) {
                mkdir($destination . "/" . $path);
            } else {
            copy($fullPath, $destination . "/" . $path);
            }
        }
    }
    
    function formatTimeAgo($dateString) {
        $timestamp = strtotime($dateString);
        $currentTimestamp = time();
        $difference = $currentTimestamp - $timestamp;
        
        $intervals = array(
            array('years', 31536000),
            array('months', 2592000),
            array('weeks', 604800),
            array('days', 86400),
            array('hours', 3600),
            array('minutes', 60),
            array('seconds', 1)
        );
        
        foreach ($intervals as $interval) {
            $unit = $interval[0];
            $seconds = $interval[1];
            if ($difference >= $seconds) {
                $value = floor($difference / $seconds);
                $output = $value . ' ' . $unit;
                if ($value > 1) {
                    $output .= 's';
                }
                $output .= ' ago';
                return $output;
            }
        }
        
        return 'Just now';
    }

    
    mysqli_close($con);
?>