<?php
ini_set('log_errors', 1);
ini_set('error_log', 'error.log');


require('fpdf.php');
require('mc_table.php');
require dirname(__FILE__,2) . '/program_assets/php/connection/conn.php';
if(!isset($_SESSION)) { session_start(); } 


$pref = $_GET["ref"];
$id = $_SESSION["id"];
$pdf = new PDF_MC_Table();
$pdf->AliasNbPages(); 
$pdf->AddPage('L');
$pdf->addWord("ANNUAL GENDER AND DEVELOPMENT (GAD) ACCOMPLISHMENT REPORT", 9, 'C');
$pdf->SetY($pdf->GetY() - 5);
$pdf->addWord("FY 2023", 9, 'C');

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
    
    
    $_SESSION["pdf_preparedby"] = $preparedBy;
    $_SESSION["pdf_preparedbyPosition"] = $preparedByPosition;
    $_SESSION["pdf_approvedby"] = $approvedBy;
    $_SESSION["pdf_approvedbyPosition"] = $approvedByPosition;
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

$amountRemoved = $primarySource + $otherSource;
$percentageRemoved = ($amountRemoved / str_replace(',', "", $total)) * 100;


$pdf->SetFont('Arial', '', 9);
$pdf->SetWidths(array(140, 140));
$pdf->Row(array('Reference: '.$ref, 'Date Endorsed: '.$dateEndorse_format));
$pdf->SetWidths(array(140, 140));
$pdf->Row(array('Organization: '.$_SESSION["college"], 'Organization Category: State Universities and Colleges, State University or College (Main Campus)'));
$pdf->SetWidths(array(280));
$pdf->Row(array('Organization Hierarchy: '.$_SESSION["college"]));
$pdf->SetWidths(array(56, 56, 56, 56, 56));

$pdf->Row(array(
    "Total Budget/GAA of Organization: \n" . $_SESSION["total_gaa"],
    "Actual GAD Expenditure: \n".$_SESSION["act_gad"],
    "Original Budget: \n" . $_SESSION["orig_bud"],
    "% Utilization of Budget: \n".$_SESSION["util_bud"].'%',
    "% of GAD Expenditure: \n".$_SESSION["per_gad"].'%'
));

$pdf->SetWidths(array(8, 35, 23, 23, 23, 23, 23, 30, 23, 23, 23, 23));
$pdf->Row(array(
    '',
    'Gender Issue/GAD Mandate', 
    'Cause of Gender Issue',
    'GAD Result Statement/GAD Objective',
    'Relevant Organization MFO/PAP or PPA',
    'GAD Activity',
    'Performance Indicators/Targets',
    'Actual Result (Outputs/Outcomes)',
    'Total Agency Approved Budget',
    'Actual Cost/Expenditure',
    'Responsible Unit/Office',
    'Variance/Remarks'
));
$pdf->SetWidths(array(8, 35, 23, 23, 23, 23, 23, 30, 23, 23, 23, 23));
$pdf->Row(array(
    '',
    '1', 
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    '11'
),'C');


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
        a.tab = 1
    AND
        a.parentFolderID = '$pref'
    GROUP BY
        a.folderID
";
$result = mysqli_query($con,$sql);
$total_count = mysqli_num_rows($result);
$row_count = 0;

if ($total_count != 0) {
    $pdf->SetWidths(array(280));
    $pdf->Row(array('CLIENT FOCUSED'),'C');
}
//
while ($row  = mysqli_fetch_assoc($result)) {
    $row_count++;

    $pdf->SetFont('Arial', '', 7);
    $pdf->SetWidths(array(8, 35, 23, 23, 23, 23, 23, 30, 23, 23, 23, 23));
    $pdf->Row(array(
        $row_count,
        $row["gender"], 
        $row["arrGenderIssue"], 
        str_replace('~', "\n", $row["arrGADResult"]), 
        str_replace('~', "\n", $row["arrMFO"]), 
        $row["gadActivity"], 
        str_replace('~', "\n", $row["arrPerformanceIndicator"]), 
        $row["actualResult"], 
        str_replace('~', "\n", $row["arrBudget"]), 
        str_replace('~', "\n", $row["actualCost"]),
        str_replace('~', "\n", $row["arrOffices"]),
        str_replace('~', "\n", $row["varianceRemarks"])
    ), 'L');
}


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
$result = mysqli_query($con,$sql);
$total_count2 = mysqli_num_rows($result);
$row_count = 0;

if ($total_count2 != 0) {
    $pdf->SetWidths(array(280));
    $pdf->Row(array('ORGANIZATIONAL FOCUSED'),'C');
}
//
while ($row  = mysqli_fetch_assoc($result)) {
    $row_count++;

    $pdf->SetFont('Arial', '', 7);
    $pdf->SetWidths(array(8, 35, 23, 23, 23, 23, 23, 30, 23, 23, 23, 23));
    $pdf->Row(array(
        $row_count,
        $row["gender"], 
        $row["arrGenderIssue"], 
        str_replace('~', "\n", $row["arrGADResult"]), 
        str_replace('~', "\n", $row["arrMFO"]), 
        $row["gadActivity"], 
        str_replace('~', "\n", $row["arrPerformanceIndicator"]), 
        $row["actualResult"], 
        str_replace('~', "\n", $row["arrBudget"]), 
        str_replace('~', "\n", $row["actualCost"]),
        str_replace('~', "\n", $row["arrOffices"]),
        str_replace('~', "\n", $row["varianceRemarks"])
    ), 'L');
}

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
$result = mysqli_query($con,$sql);
$total_count3 = mysqli_num_rows($result);

if ($total_count3 != 0) {
    $pdf->SetWidths(array(280));
    $pdf->Row(array('ATTRIBUTED PROGRAM'),'C');
}

while ($row  = mysqli_fetch_assoc($result)) {
    $row_count++;

    $pdf->SetFont('Arial', '', 7);
    $pdf->SetWidths(array(8, 35, 23, 23, 23, 23, 23, 30, 23, 23, 23, 23));
    $pdf->Row(array(
        $row_count,
        "", 
        "", 
        "", 
        "", 
        $row["gadActivity"], 
        "",
        "",
        str_replace('~', "\n", $row["arrBudget"]), 
        str_replace('~', "\n", $row["actualCost"]),
        str_replace('~', "\n", $row["arrOffices"]),
        str_replace('~', "\n", $row["varianceRemarks"])
    ), 'L');
}

$pdf->SetWidths(array(200, 80));
$pdf->Row(array('', 'SUB-TOTAL: '. number_format($specAmount, 2, '.', ',')));
$pdf->SetWidths(array(200, 80));
$pdf->Row(array('', 'TOTAL GAD BUDGET: '. number_format($specAmount, 2, '.', ',')));

$pdf->SetWidths(array(93,93,94));
$pdf->Row(array(
    'Prepared By',
    'Approved By', 
    'Date'
),'L');

$pdf->SetWidths(array(280));
$pdf->Row(array(''));

$pdf->SetWidths(array(93,93,94));
$pdf->Row(array(
    $preparedBy,
    $approvedBy, 
    $dateEndorse
),'L');

$pdf->SetWidths(array(93,93,94));
$pdf->Row(array(
    $preparedByPosition,
    $approvedByPosition, 
    ""
),'L');


$pdf->Output();
?>
