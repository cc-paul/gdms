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
        case "load_acc" :
            
            $id = $_SESSION["id"];
            
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
                    b.email,
                    DATE_FORMAT(a.dateEndorse, '%m/%d/%Y') AS dateEndorse
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
                    a.`status` = 'Endorse' 
                AND
                    a.createdBy = $id
                ORDER BY
                    a.id DESC
            ";
            return builder($con,$sql);
            
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
                    FORMAT(SUM(e.budget) / 2,2) budget,
                    actualResult,
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
                    ),'') AS arrPerformanceIndicator,
                    IFNULL((
                        SELECT GROUP_CONCAT(CONCAT(source,'~',item,'~',FORMAT(expense,2)) SEPARATOR '~~') FROM omg_gbp_actual_cost WHERE parentFolderID = a.folderID
                    ),'') AS actualCost,
                    FORMAT(IFNULL((
                        SELECT SUM(expense) FROM omg_gbp_actual_cost WHERE parentFolderID = a.folderID
                    ),0),2) AS totalActualCost,
                    IFNULL((
                        SELECT GROUP_CONCAT(CONCAT(FORMAT(variance,2),'~',remarks) SEPARATOR '~~') FROM omg_gbp_variance WHERE parentFolderID = a.folderID
                    ),'') AS varianceRemarks,
                    FORMAT(IFNULL((
                        SELECT SUM(variance) FROM omg_gbp_variance WHERE parentFolderID = a.folderID
                    ),0),2) AS totalVariance
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
                    IFNULL((SELECT statement FROM omg_masterfile WHERE id = a.genderID),' - ') AS gender,
                    IFNULL((SELECT statement FROM omg_masterfile WHERE id = a.gadID),' - ') AS gad,
                    d.performanceIndicator,
                    FORMAT(SUM(e.budget) / 2,2) budget,
                    actualResult,
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
                    ),'') AS arrPerformanceIndicator,
                    IFNULL((
                        SELECT GROUP_CONCAT(CONCAT(source,'~',item,'~',expense) SEPARATOR '~~') FROM omg_gbp_actual_cost WHERE parentFolderID = a.folderID
                    ),'') AS actualCost,
                    FORMAT(IFNULL((
                        SELECT SUM(expense) FROM omg_gbp_actual_cost WHERE parentFolderID = a.folderID
                    ),0),2) AS totalActualCost,
                    IFNULL((
                        SELECT GROUP_CONCAT(CONCAT(variance,'~',remarks) SEPARATOR '~~') FROM omg_gbp_variance WHERE parentFolderID = a.folderID
                    ),'') AS varianceRemarks,
                    FORMAT(IFNULL((
                        SELECT SUM(variance) FROM omg_gbp_variance WHERE parentFolderID = a.folderID
                    ),0),2) AS totalVariance
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
                GROUP BY
                    a.folderID
            ";
            return builder($con,$sql);
            
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
                    ),'') AS arrBudget,
                    a.actualResult,
                    IFNULL((
                        SELECT GROUP_CONCAT(CONCAT(source,'~',item,'~',FORMAT(expense,2)) SEPARATOR '~~') FROM omg_gbp_actual_cost WHERE parentFolderID = a.folderID
                    ),'') AS actualCost,
                    FORMAT(IFNULL((
                        SELECT SUM(expense) FROM omg_gbp_actual_cost WHERE parentFolderID = a.folderID
                    ),0),2) AS totalActualCost,
                    IFNULL((
                        SELECT GROUP_CONCAT(CONCAT(FORMAT(variance,2),'~',remarks) SEPARATOR '~~') FROM omg_gbp_variance WHERE parentFolderID = a.folderID
                    ),'') AS varianceRemarks,
                    FORMAT(IFNULL((
                        SELECT SUM(variance) FROM omg_gbp_variance WHERE parentFolderID = a.folderID
                    ),0),2) AS totalVariance
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
    
        case "save_acc" :
            
            $parentFolderID = $_POST["parentFolderID"];
            $outcome        = $_POST["outcome"];
            $expenses       = $_POST["expenses"];
            $variance       = $_POST["variance"];
            
            
            mysqli_query($con,"DELETE FROM omg_gbp_actual_cost WHERE parentFolderID = '$parentFolderID'");
            mysqli_query($con,"DELETE FROM omg_gbp_variance WHERE parentFolderID = '$parentFolderID'");
            mysqli_query($con,"INSERT INTO omg_gbp_actual_cost (parentFolderID,source,item,expense) VALUES $expenses");
            mysqli_query($con,"INSERT INTO omg_gbp_variance (parentFolderID,variance,remarks) VALUES $variance");
            
            $query = "UPDATE omg_gbp SET actualResult = ? WHERE folderID = ?";
            if ($stmt = mysqli_prepare($con, $query)) {
                mysqli_stmt_bind_param($stmt,"ss",$outcome,$parentFolderID);
                mysqli_stmt_execute($stmt);
               
                $error   = false;
                $color   = "green";
                $message = "Accomplishment has been updated"; 
               
            } else {
                $error   = true;
                $color   = "red";
                $message = "Error updating accomplishment"; 
            }
            
            $json[] = array(
                'error' => $error,
                'color' => $color,
                'message' => $message
            );
            echo json_encode($json);
            
        break;
    
        case "all_cost" :
            
            $parentFolderID = $_POST["parentFolderID"];
            $exp = 0;
            $budget = 0;
            
            $sql    = "
                SELECT 
                    FORMAT(SUM(IFNULL(a.expense,0)),2) AS totalExpense 
                FROM
                    omg_gbp_actual_cost a 
                WHERE
                    a.parentFolderID IN (
                    SELECT
                        folderID 
                    FROM 
                        omg_gbp 
                    WHERE
                        parentFolderID = '$parentFolderID'
                )
            ";
            $result = mysqli_query($con,$sql);
            
            while ($row  = mysqli_fetch_assoc($result)) {
                $exp = $row["totalExpense"];
            }
    
            $sql    = "
                SELECT 
                    FORMAT(SUM(IFNULL(a.budget,0)),2) AS totalBudget 
                FROM 
                    omg_gbp_budget a 
                WHERE
                    a.folderID IN (
                        SELECT
                            folderID 
                        FROM 
                            omg_gbp 
                        WHERE
                            parentFolderID = '$parentFolderID'
                    )
            ";
            $result = mysqli_query($con,$sql);
            
            while ($row  = mysqli_fetch_assoc($result)) {
                $budget = $row["totalBudget"];
            }
            
            $json = array();
            $json[] = array(
                'totalExpense' => $exp,
                'totalBudget' => $budget
            );
            echo json_encode($json);
            
        break;
    }
    
    mysqli_close($con);
?>