<?php
    include dirname(__FILE__,2) . '/config.php';;
	include $main_location . '/connection/conn.php';
    
    $sql = "";
    
    switch($to_filter) {
        case "report" :
            
            $sql    = "
                SELECT
                    a.reportType,
                    a.reportType
                FROM
                    omg_gbp_parent a
                GROUP BY
                    a.reportType
                ORDER BY
                    a.reportType ASC;
            ";
            
        break;
    
        case "year" :
            
            $sql    = "
                SELECT
                    a.`year`,
                    a.`year`
                FROM
                    omg_gbp_parent a
                GROUP BY
                    a.`year`
                ORDER BY
                    a.`year` ASC;
            ";
            
        break;
    
        case "status" :
            
            $sql    = "
                SELECT
                    a.`status`,
                    a.`status`
                FROM
                    omg_gbp_parent a
                GROUP BY
                    a.`status`
                ORDER BY
                    a.`status` ASC;
            ";
            
        break;
    
        case "college" :
            
            $sql = "
                SELECT 
                    c.id,
                    c.college
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
                GROUP BY
                    c.college 
                ORDER BY 
                    c.college ASC
            ";
            
        break;
    }
    
    $result = mysqli_query($con,$sql);
    
    while ($row  = mysqli_fetch_row($result)) {
        echo "<option value='".$row[0]."'>".$row[1]."</option>";
    }

    mysqli_free_result($result);
    mysqli_close($con);
?>