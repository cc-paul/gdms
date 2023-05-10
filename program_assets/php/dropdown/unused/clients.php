<?php
    include dirname(__FILE__,2) . '/config.php';;
	include $main_location . '/connection/conn.php';

    $userID = $_SESSION["id"];
    $filter = " ";
    $current_page = str_replace(".php","",substr($_SERVER["SCRIPT_NAME"],strrpos($_SERVER["SCRIPT_NAME"],"/")+1));
    
    switch ($current_page) {
        case "client" :
            $filter = "
                AND a.id IN (
                    SELECT clientID FROM hris_client_assigned WHERE userID = $userID
                )
            ";
        break;
    }
    
    $sql    = "
        SELECT
            a.id,
            a.clientsName
        FROM
            hris_masterfile_client a
        WHERE
            a.isActive = 1 $filter
        ORDER BY
            a.clientsName ASC
    ";
    $result = mysqli_query($con,$sql);
    
    while ($row  = mysqli_fetch_row($result)) {
        echo "<option value='".$row[0]."' title='".$row[1]."'>".$row[1]."</option>";
    }

    mysqli_free_result($result);
    mysqli_close($con);
?>