<?php
    if(!isset($_SESSION)) { session_start(); } 
    include 'appkey_generator.php';
    include dirname(__FILE__,2) . '/config.php';
    include $main_location . '/connection/conn.php';
    include '../builder/builder_select.php';
    include '../builder/builder_table.php';

    $sql    = "
        SELECT
            a.id,
            CONCAT(a.fName,' ',a.lName) AS fullName
        FROM
            mp_admin_therapist a
        WHERE
            positionID = 2
        AND
            a.isActive = 1
        ORDER BY
            CONCAT(a.fName,' ',a.lName) ASC
    ";
    $result = mysqli_query($con,$sql);
    
    while ($row  = mysqli_fetch_row($result)) {
        echo "<option value='".$row[0]."' title='".$row[1]."'>".$row[1]."</option>";
    }

    mysqli_free_result($result);
    mysqli_close($con);
?>