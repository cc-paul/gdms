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


//PhpExcelTemplator::saveToFile('./template.xlsx', './exported_file.xlsx', [
//	'{current_date}' => date('d-m-Y'),
//	'{department}' => 'Sales department',
//]);

define('SPECIAL_ARRAY_TYPE', CellSetterArrayValueSpecial::class);
$ref = $_GET["ref"];
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
$rowCount = 1;
$seconds  = date('YmdHis', time());

$sql = "
    SELECT 
        a.totalAmount,
        a.`year`,
        a.`status`,
        c.approvedBy,
        c.approvedByPosition,
        c.preparedBy,
        c.preparedByPosition,
        DATE_FORMAT(a.dateEndorse, '%m/%d/%Y') AS dateEndorse
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
        a.parentFolderID = '$ref'
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
        a.parentFolderID = '$ref'
    GROUP BY
        a.folderID
";
$result = mysqli_query($con,$sql);
while ($row  = mysqli_fetch_assoc($result)) {
    $specAmount += $row["specAmount"];
    $primarySource += $row["primarySource"];
    $otherSource += $row["otherSource"];
}

$amountRemoved = $primarySource + $otherSource;
$percentageRemoved = ($amountRemoved / str_replace(',', "", $total)) * 100;

function getClientFocused($whatQuery,$whatToReturn) {
    global $ref,$con,$rowCount;
    $sql = "";
    
    if ($whatQuery == "client") {
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
                a.parentFolderID = '$ref'
            GROUP BY
                a.folderID
        ";
    }
    
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
                a.parentFolderID = '$ref'
            GROUP BY
                a.folderID
        ";
    }
    
    
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
                '' AS budgetSource,
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
                a.parentFolderID = '$ref'
            AND
                a.tab = 0
            GROUP BY
                a.folderID
        ";
    }
    
    
    $result = mysqli_query($con,$sql);
    $arrReturn = [];
    
    while ($row  = mysqli_fetch_assoc($result)) {
        if ($whatToReturn == "count") {
            $arrReturn[] = $rowCount;
            $rowCount++;
        }
        
        if ($whatToReturn == "gen_gad") {
            $arrReturn[] = $row["gender"];
        }
        
        if ($whatToReturn == "cause_gender") {
            $arrReturn[] = $row["arrGenderIssue"];
        }
        
        if ($whatToReturn == "gad_obj") {
            $arrReturn[] = str_replace('~', "\n", $row["arrGADResult"]);
        }
        
        if ($whatToReturn == "relevant") {
            $arrReturn[] = str_replace('~', "\n", $row["arrMFO"]);
        }
        
        if ($whatToReturn == "gad_act") {
            $arrReturn[] = $row["gadActivity"];
        }
        
        if ($whatToReturn == "performance") {
            $arrReturn[] = str_replace('~', "\n", $row["arrPerformanceIndicator"]);
        }
        
        if ($whatToReturn == "gad_bud") {
            $arrReturn[] = str_replace('~', "\n", $row["arrBudget"]);
        }
        
        if ($whatToReturn == "other_source") {
            $arrReturn[] = $row["budgetSource"];
        }
        
        if ($whatToReturn == "office") {
            $arrReturn[] = str_replace('~', "\n", $row["arrOffices"]);
        }
    }
    
    return $arrReturn;
}

 //to download the file from web page
PhpExcelTemplator::outputToFile('gbp_template.xlsx', 'gbp_'.$seconds.'.xlsx', [
	'{org}' => $_SESSION["college"],
	'{org_cat}' => 'State Universities and Colleges, State University or College (Main Campus)',
    '{total_gad}' => number_format($total, 2, '.', ','),
    '{total_bud_gaa}' => number_format($specAmount, 2, '.', ','),
	'{primary}' => number_format($primarySource, 2, '.', ','),
    '{per_gad}' => number_format($percentageRemoved,2).'%',
	'{other}' => number_format($otherSource, 2, '.', ','),
    '[numbering]' => new ExcelParam(SPECIAL_ARRAY_TYPE,getClientFocused("client","count")),
    '[gen_gad]' => new ExcelParam(SPECIAL_ARRAY_TYPE,getClientFocused("client","gen_gad")),
    '[cause_gender]' => new ExcelParam(SPECIAL_ARRAY_TYPE,getClientFocused("client","cause_gender")),
    '[gad_obj]' => new ExcelParam(SPECIAL_ARRAY_TYPE,getClientFocused("client","gad_obj")),
    '[relevant]' => new ExcelParam(SPECIAL_ARRAY_TYPE,getClientFocused("client","relevant")),
    '[gad_act]' => new ExcelParam(SPECIAL_ARRAY_TYPE,getClientFocused("client","gad_act")),
    '[performance]' => new ExcelParam(SPECIAL_ARRAY_TYPE,getClientFocused("client","performance")),
    '[gad_bud]' => new ExcelParam(SPECIAL_ARRAY_TYPE,getClientFocused("client","gad_bud")),
    '[other_source]' => new ExcelParam(SPECIAL_ARRAY_TYPE,getClientFocused("client","other_source")),
    '[office]' => new ExcelParam(SPECIAL_ARRAY_TYPE,getClientFocused("client","office")),
    
    '[numbering1]' => new ExcelParam(SPECIAL_ARRAY_TYPE,getClientFocused("org","count")),
    '[gen_gad1]' => new ExcelParam(SPECIAL_ARRAY_TYPE,getClientFocused("org","gen_gad")),
    '[cause_gender1]' => new ExcelParam(SPECIAL_ARRAY_TYPE,getClientFocused("org","cause_gender")),
    '[gad_obj1]' => new ExcelParam(SPECIAL_ARRAY_TYPE,getClientFocused("org","gad_obj")),
    '[relevant1]' => new ExcelParam(SPECIAL_ARRAY_TYPE,getClientFocused("org","relevant")),
    '[gad_act1]' => new ExcelParam(SPECIAL_ARRAY_TYPE,getClientFocused("org","gad_act")),
    '[performance1]' => new ExcelParam(SPECIAL_ARRAY_TYPE,getClientFocused("org","performance")),
    '[gad_bud1]' => new ExcelParam(SPECIAL_ARRAY_TYPE,getClientFocused("org","gad_bud")),
    '[other_source1]' => new ExcelParam(SPECIAL_ARRAY_TYPE,getClientFocused("org","other_source")),
    '[office1]' => new ExcelParam(SPECIAL_ARRAY_TYPE,getClientFocused("org","office")),
    
    '[numbering2]' => new ExcelParam(SPECIAL_ARRAY_TYPE,getClientFocused("attr","count")),
    '[gen_gad2]' => new ExcelParam(SPECIAL_ARRAY_TYPE,getClientFocused("attr","gen_gad")),
    '[cause_gender2]' => new ExcelParam(SPECIAL_ARRAY_TYPE,getClientFocused("attr","cause_gender")),
    '[gad_obj2]' => new ExcelParam(SPECIAL_ARRAY_TYPE,getClientFocused("attr","gad_obj")),
    '[relevant2]' => new ExcelParam(SPECIAL_ARRAY_TYPE,getClientFocused("attr","relevant")),
    '[gad_act2]' => new ExcelParam(SPECIAL_ARRAY_TYPE,getClientFocused("attr","gad_act")),
    '[performance2]' => new ExcelParam(SPECIAL_ARRAY_TYPE,getClientFocused("attr","performance")),
    '[gad_bud2]' => new ExcelParam(SPECIAL_ARRAY_TYPE,getClientFocused("attr","gad_bud")),
    '[other_source2]' => new ExcelParam(SPECIAL_ARRAY_TYPE,getClientFocused("attr","other_source")),
    '[office2]' => new ExcelParam(SPECIAL_ARRAY_TYPE,getClientFocused("attr","office")),
    
    '{footer_sub_total}' => number_format($specAmount, 2, '.', ','),
	'{footer_total}' => number_format($specAmount, 2, '.', ','),
    '{footer_prepared_by}' => $preparedBy,
    '{footer_approved_by}' => $approvedBy,
    '{footer_date}' => $dateEndorse,
    '{footer_position1}' => $preparedByPosition,
    '{footer_position2}' => $approvedByPosition
]);



 //to download the file from web page
//PhpExcelTemplator::outputToFile('gbp_template.xlsx', 'gbp.xlsx', [
//	'{current_date}' => date('d-m-Y'),
//	'{department}' => 'Sales department',
//]);
