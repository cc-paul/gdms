<?php
ini_set('log_errors', 1);
ini_set('error_log', 'error.log');

require dirname(__FILE__,2) . '/program_assets/php/connection/conn.php';
if(!isset($_SESSION)) { session_start(); } 
use alhimik1986\PhpExcelTemplator\PhpExcelTemplator;
use alhimik1986\PhpExcelTemplator\params\ExcelParam;
use alhimik1986\PhpExcelTemplator\params\CallbackParam;
use alhimik1986\PhpExcelTemplator\setters\CellSetterArrayValueSpecial;

require( __DIR__ . '\samples\Bootstrap.php');
define('SPECIAL_ARRAY_TYPE', CellSetterArrayValueSpecial::class);

$pref = $_GET["ref"];
$id = $_SESSION["id"];
$total = 0;
$primarySource = 0;
$otherSource = 0;
$specAmount = 0;
$approvedBy = "";
$approvedByPosition = "";
$preparedBy = "";
$preparedByPosition = "";
$dateEndorse = "";
$dateEndorse_format = "";
$ref = "";
$row_count = 1;
$seconds  = date('YmdHis', time());

$sql = "
    SELECT 
        FORMAT(a.totalAmount,2) AS totalAmount,
        a.`year`,
        a.`status`,
        c.approvedBy,
        c.approvedByPosition,
        c.preparedBy,
        c.preparedByPosition,
        DATE_FORMAT(a.dateEndorse, '%m/%d/%Y') AS dateEndorse,
        CONCAT(
            'Endorsed GPB #',
            a.`year`,
            '-00',
            LPAD(EXTRACT(MINUTE FROM a.dateEndorse), 2, '0'),
            LPAD(EXTRACT(SECOND FROM a.dateEndorse), 2, '0')
        ) as ref,
        CONCAT(
            DATE_FORMAT(a.dateEndorse, '%b'),
            ' ',
            LPAD(EXTRACT(DAY FROM a.dateEndorse), 2, '0'),
            ', ',
            EXTRACT(YEAR FROM a.dateEndorse) 
        ) AS dateEndorse_format
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
    WHERE
        a.parentFolderID = '$pref'
    ORDER BY
        a.id DESC 
    LIMIT 1
";
$result = mysqli_query($con,$sql);
while ($row  = mysqli_fetch_assoc($result)) {
    $total = $row["totalAmount"];
    $approvedBy = $row["approvedBy"];
    $approvedByPosition = $row["approvedByPosition"];
    $preparedBy = $row["preparedBy"];
    $preparedByPosition =$row["preparedByPosition"];
    $dateEndorse = $row["dateEndorse"];
    $dateEndorse_format = $row["dateEndorse_format"];
    $ref = $row["ref"];
}

$sql = "
    SELECT
    IFNULL((
        SELECT GROUP_CONCAT(CONCAT(budgetSource) SEPARATOR '~~') FROM omg_gbp_budget WHERE folderID = a.folderID
    ),'') AS budgetSource,
    IFNULL((
        SELECT GROUP_CONCAT(CONCAT(budget) SEPARATOR '~~') FROM omg_gbp_budget WHERE folderID = a.folderID
    ),'') AS specAmount,
    IFNULL((
        SELECT GROUP_CONCAT(CONCAT(IF(budgetSource = 'GAA',budget,0)) SEPARATOR '~~') FROM omg_gbp_budget WHERE folderID = a.folderID
    ),'') AS primarySource,
    IFNULL((
        SELECT GROUP_CONCAT(CONCAT(IF(budgetSource != 'GAA',budget,0)) SEPARATOR '~~') FROM omg_gbp_budget WHERE folderID = a.folderID
    ),'') AS otherSource
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
        a.parentFolderID = '$pref'
    GROUP BY
        a.folderID
";
$result = mysqli_query($con,$sql);
while ($row  = mysqli_fetch_assoc($result)) {
    $specAmount += $row["specAmount"];
    $primarySource += $row["primarySource"];
    $otherSource += $row["otherSource"];
}

function getData($whatQuery,$whatToReturn) {
    global $pref,$con,$row_count;
    $sql = "";
    
        if ($whatQuery == "client") {
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
                    actualResult,
                    IFNULL((
                            SELECT GROUP_CONCAT(CONCAT(budgetSource,'~',budgetItem,'~',REPLACE(FORMAT(budget,2),'.00','')) SEPARATOR '~~') FROM omg_gbp_budget WHERE folderID = a.folderID
                    ),'') AS arrBudget,
                    IFNULL((
                            SELECT GROUP_CONCAT(CONCAT(budgetSource) SEPARATOR '~~') FROM omg_gbp_budget WHERE folderID = a.folderID
                    ),'') AS budgetSource,
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
                    IFNULL(a.actualResult,'') AS actualResult,
                    IFNULL((
                            SELECT GROUP_CONCAT(CONCAT(source,'~',item,'~',FORMAT(expense,2)) SEPARATOR '~~') FROM omg_gbp_actual_cost WHERE parentFolderID = a.folderID
                    ),'') AS actualCost,
                    IFNULL((
                            SELECT GROUP_CONCAT(CONCAT(FORMAT(variance,2),'~',remarks) SEPARATOR '~~') FROM omg_gbp_variance WHERE parentFolderID = a.folderID
                    ),'') AS varianceRemarks
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
                    a.tab = 1
                AND
                    a.parentFolderID = '$pref'
                GROUP BY
                    a.folderID
            ";
        }
        
        ;
        
        if ($whatQuery == "org") {
            $sql    = "
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
                    actualResult,
                    IFNULL((
                            SELECT GROUP_CONCAT(CONCAT(budgetSource,'~',budgetItem,'~',REPLACE(FORMAT(budget,2),'.00','')) SEPARATOR '~~') FROM omg_gbp_budget WHERE folderID = a.folderID
                    ),'') AS arrBudget,
                    IFNULL((
                            SELECT GROUP_CONCAT(CONCAT(budgetSource) SEPARATOR '~~') FROM omg_gbp_budget WHERE folderID = a.folderID
                    ),'') AS budgetSource,
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
                    IFNULL(a.actualResult,'') AS actualResult,
                    IFNULL((
                            SELECT GROUP_CONCAT(CONCAT(source,'~',item,'~',FORMAT(expense,2)) SEPARATOR '~~') FROM omg_gbp_actual_cost WHERE parentFolderID = a.folderID
                    ),'') AS actualCost,
                    IFNULL((
                            SELECT GROUP_CONCAT(CONCAT(FORMAT(variance,2),'~',remarks) SEPARATOR '~~') FROM omg_gbp_variance WHERE parentFolderID = a.folderID
                    ),'') AS varianceRemarks
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
                    a.tab = 2
                AND
                    a.parentFolderID = '$pref'
                GROUP BY
                    a.folderID
            ";
        };
        
        if ($whatQuery == "attr") {
            $sql    = "
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
                    ),'') AS arrPerformanceIndicator,
                    IFNULL(a.actualResult,'') AS actualResult,
                    IFNULL((
                            SELECT GROUP_CONCAT(CONCAT(source,'~',item,'~',FORMAT(expense,2)) SEPARATOR '~~') FROM omg_gbp_actual_cost WHERE parentFolderID = a.folderID
                    ),'') AS actualCost,
                    IFNULL((
                            SELECT GROUP_CONCAT(CONCAT(FORMAT(variance,2),'~',remarks) SEPARATOR '~~') FROM omg_gbp_variance WHERE parentFolderID = a.folderID
                    ),'') AS varianceRemarks
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
                    a.parentFolderID = '$pref'
                AND
                    a.tab = 0
                GROUP BY
                    a.folderID
            ";
        };

        $result = mysqli_query($con,$sql);
        $arrReturn = [];
        
        
        while ($row  = mysqli_fetch_assoc($result)) {
            if ($whatToReturn == "q1") {
                $arrReturn[] = $row_count;
                $row_count++;
            }
            
            if ($whatToReturn == "q2") {
                $arrReturn[] = $row["gender"];
            }
            
            if ($whatToReturn == "q3") {
                $arrReturn[] = $row["arrGenderIssue"];
            }
            
            if ($whatToReturn == "q4") {
                $arrReturn[] = str_replace('~', "\n", $row["arrGADResult"]);
            }
            
            if ($whatToReturn == "q5") {
                $arrReturn[] = str_replace('~', "\n", $row["arrMFO"]);
            }
            
            if ($whatToReturn == "q6") {
                $arrReturn[] = $row["gadActivity"];
            }
            
            if ($whatToReturn == "q7") {
                $arrReturn[] = str_replace('~', "\n", $row["arrPerformanceIndicator"]);
            }
            
            if ($whatToReturn == "q8") {
                $arrReturn[] = $row["actualResult"];
            }
            
            if ($whatToReturn == "q9") {
                $arrReturn[] = str_replace('~', "\n", $row["arrBudget"]);
            }
            
            if ($whatToReturn == "q10") {
                $arrReturn[] = str_replace('~', "\n", $row["actualCost"]);
            }
            
            if ($whatToReturn == "q11") {
                $arrReturn[] = str_replace('~', "\n", $row["arrOffices"]);
            }
            
            if ($whatToReturn == "q12") {
                $arrReturn[] = str_replace('~', "\n", $row["varianceRemarks"]);
            }
        }
        
    return $arrReturn;
}

PhpExcelTemplator::outputToFile('./ar_template.xlsx', './ar_'.$seconds.'.xlsx', [
	'{ref}' => $ref,
	'{date_endorse}' => $dateEndorse,
    '{org}' => $_SESSION["college"],
	'{org_cat}' => 'Organization Category: State Universities and Colleges, State University or College (Main Campus)',
    '{total_gaa}' => $_SESSION["total_gaa"],
	'{actual_gaa}' => $_SESSION["act_gad"],
    '{org_budget}' => $_SESSION["orig_bud"],
	'{util_bud}' => $_SESSION["util_bud"].'%',
    '{per_gad}' => $_SESSION["per_gad"].'%',
    '[cf1]' => new ExcelParam(SPECIAL_ARRAY_TYPE,getData("client","q1")),
    '[cf2]' => new ExcelParam(SPECIAL_ARRAY_TYPE,getData("client","q2")),
    '[cf3]' => new ExcelParam(SPECIAL_ARRAY_TYPE,getData("client","q3")),
    '[cf4]' => new ExcelParam(SPECIAL_ARRAY_TYPE,getData("client","q4")),
    '[cf5]' => new ExcelParam(SPECIAL_ARRAY_TYPE,getData("client","q5")),
    '[cf6]' => new ExcelParam(SPECIAL_ARRAY_TYPE,getData("client","q6")),
    '[cf7]' => new ExcelParam(SPECIAL_ARRAY_TYPE,getData("client","q7")),
    '[cf8]' => new ExcelParam(SPECIAL_ARRAY_TYPE,getData("client","q8")),
    '[cf9]' => new ExcelParam(SPECIAL_ARRAY_TYPE,getData("client","q9")),
    '[cf10]' => new ExcelParam(SPECIAL_ARRAY_TYPE,getData("client","q10")),
    '[cf11]' => new ExcelParam(SPECIAL_ARRAY_TYPE,getData("client","q11")),
    '[cf12]' => new ExcelParam(SPECIAL_ARRAY_TYPE,getData("client","q12")),
    '[of1]' => new ExcelParam(SPECIAL_ARRAY_TYPE,getData("org","q1")),
    '[of2]' => new ExcelParam(SPECIAL_ARRAY_TYPE,getData("org","q2")),
    '[of3]' => new ExcelParam(SPECIAL_ARRAY_TYPE,getData("org","q3")),
    '[of4]' => new ExcelParam(SPECIAL_ARRAY_TYPE,getData("org","q4")),
    '[of5]' => new ExcelParam(SPECIAL_ARRAY_TYPE,getData("org","q5")),
    '[of6]' => new ExcelParam(SPECIAL_ARRAY_TYPE,getData("org","q6")),
    '[of7]' => new ExcelParam(SPECIAL_ARRAY_TYPE,getData("org","q7")),
    '[of8]' => new ExcelParam(SPECIAL_ARRAY_TYPE,getData("org","q8")),
    '[of9]' => new ExcelParam(SPECIAL_ARRAY_TYPE,getData("org","q9")),
    '[of10]' => new ExcelParam(SPECIAL_ARRAY_TYPE,getData("org","q10")),
    '[of11]' => new ExcelParam(SPECIAL_ARRAY_TYPE,getData("org","q11")),
    '[of12]' => new ExcelParam(SPECIAL_ARRAY_TYPE,getData("org","q12")),
    '[at1]' => new ExcelParam(SPECIAL_ARRAY_TYPE,getData("attr","q1")),
    '[at2]' => new ExcelParam(SPECIAL_ARRAY_TYPE,getData("attr","q2")),
    '[at3]' => new ExcelParam(SPECIAL_ARRAY_TYPE,getData("attr","q3")),
    '[at4]' => new ExcelParam(SPECIAL_ARRAY_TYPE,getData("attr","q4")),
    '[at5]' => new ExcelParam(SPECIAL_ARRAY_TYPE,getData("attr","q5")),
    '[at6]' => new ExcelParam(SPECIAL_ARRAY_TYPE,getData("attr","q6")),
    '[at7]' => new ExcelParam(SPECIAL_ARRAY_TYPE,getData("attr","q7")),
    '[at8]' => new ExcelParam(SPECIAL_ARRAY_TYPE,getData("attr","q8")),
    '[at9]' => new ExcelParam(SPECIAL_ARRAY_TYPE,getData("attr","q9")),
    '[at10]' => new ExcelParam(SPECIAL_ARRAY_TYPE,getData("attr","q10")),
    '[at11]' => new ExcelParam(SPECIAL_ARRAY_TYPE,getData("attr","q11")),
    '[at12]' => new ExcelParam(SPECIAL_ARRAY_TYPE,getData("attr","q12")),
    
    '{footer_subtotal}' => number_format($specAmount, 2, '.', ','),
    '{footer_total}' => number_format($specAmount, 2, '.', ','),
    '{footer_prepared_by}' => $preparedBy,
    '{footer_approved_by}' => $approvedBy,
    '{footer_date}' => $dateEndorse,
    '{footer_position1}' => $preparedByPosition,
    '{footer_position2}' => $approvedByPosition
]);
?>