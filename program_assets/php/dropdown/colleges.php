<?php
    include dirname(__FILE__,2) . '/config.php';;
	include $main_location . '/connection/conn.php';
    
    $sql    = "
        SELECT
            a.id,
            a.college
        FROM
            omg_colleges a 
        WHERE
            a.isActive = 1
        ORDER BY
            a.college ASC;
    ";
    $result = mysqli_query($con,$sql);
    
    while ($row  = mysqli_fetch_row($result)) {
        echo "<option value='".$row[0]."' title='".$row[1]."'>".$row[1]."</option>";
    }

    mysqli_free_result($result);
    mysqli_close($con);
?>