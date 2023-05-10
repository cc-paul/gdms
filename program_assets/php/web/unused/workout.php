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
        case "new_target_body" :
            
            $bodyPart        = $_POST["bodyPart"];
            $description     = $_POST["description"];
            $isActive        = $_POST["isActive"];
            $isNewTargetBody = $_POST["isNewTargetBody"];
            $oldBodyPart     = $_POST["oldBodyPart"];
            $bodyPartId      = $_POST["bodyPartId"];
            
            if ($isNewTargetBody == 1) {
                
                $find_query = mysqli_query($con,"SELECT * FROM in_body_parts WHERE bodyPart = '$bodyPart'");
                if (mysqli_num_rows($find_query) == 0) {
                    mysqli_next_result($con);
                    
                    $query = "INSERT INTO in_body_parts (bodyPart,description,isActive,dateCreated) VALUES (?,?,?,?)";
                    if ($stmt = mysqli_prepare($con, $query)) {
                        mysqli_stmt_bind_param($stmt,"ssss",$bodyPart,$description,$isActive,$global_date);
                        mysqli_stmt_execute($stmt);
                        
                        $error   = false;
                        $color   = "green";
                        $message = "Body part has been saved"; 
                        
                    } else {
                        $error   = true;
                        $color   = "red";
                        $message = "Error saving body part"; 
                    }
                    
                } else {
                    $error   = true;
                    $color   = "red";
                    $message = "Body part already exist"; 
                }
                
            } else {
                    
                $isExist = 0;
                
                if (strtolower($oldBodyPart) != strtolower($bodyPart)) {
                    $find_query = mysqli_query($con,"SELECT * FROM in_body_parts WHERE bodyPart = '$bodyPart'");
                    if (mysqli_num_rows($find_query) != 0) {
                        mysqli_next_result($con);
                        
                        $isExist = 1;
                    }   
                }
                
                if ($isExist == 1) {
                    $error   = true;
                    $color   = "red";
                    $message = "Body part already exist"; 
                } else {
                    $query = "UPDATE in_body_parts SET bodyPart=?,description=?,isActive=? WHERE id=?";
                    if ($stmt = mysqli_prepare($con, $query)) {
                        mysqli_stmt_bind_param($stmt,"ssss",$bodyPart,$description,$isActive,$bodyPartId);
                        mysqli_stmt_execute($stmt);
                        
                        $error   = false;
                        $color   = "green";
                        $message = "Body part has been updated"; 
                        
                    } else {
                        $error   = true;
                        $color   = "red";
                        $message = "Error updating body part"; 
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
    
        case "load_target_body" :
            
            $sql = "
                SELECT
                    a.id,
                    a.bodyPart,
                    a.description,
                    a.description AS unf_description,
                    IF(a.isActive = 1,'Active','Inactive') AS status,
                    DATE_FORMAT(a.dateCreated,'%M %d %Y %r') AS dateCreated,
                    a.isActive
                FROM
                    in_body_parts a 
                ORDER BY
                    a.bodyPart ASC;
            ";
            return builder($con,$sql);
            
        break;
    
        case "save_workout" :
            
            $workOutName        = $_POST["workOutName"];
            $targetLooseWeight  = $_POST["targetLooseWeight"];
            $intensity          = $_POST["intensity"];
            $workOutDescription = $_POST["workOutDescription"];
            $workOutProcedure   = $_POST["workOutProcedure"];
            $isActive           = $_POST["isActive"];
            $arrTargetBodyParts = explode(',',$_POST["arrTargetBodyParts"]);
            $isNewFitnessPlan   = $_POST["isNewFitnessPlan"];
            $oldWorkOutName     = $_POST["oldWorkOutName"];
            $fitnessIDC          = $_POST["fitnessID"];
            
            if ($isNewFitnessPlan == 1) {
                
                $find_query = mysqli_query($con,"SELECT * FROM in_fitness_plan WHERE workOutName = '$workOutName'");
                if (mysqli_num_rows($find_query) == 0) {
                    mysqli_next_result($con);
                    
                    $query = "  INSERT INTO in_fitness_plan
                                  (workOutName,targetLooseWeight,intensity,workOutDescription,workOutProcedure,isActive,dateCreated)
                                VALUES
                                  (?,?,?,?,?,?,?)";
                    if ($stmt = mysqli_prepare($con, $query)) {
                        mysqli_stmt_bind_param($stmt,"sssssss",$workOutName,$targetLooseWeight,$intensity,$workOutDescription,$workOutProcedure,$isActive,
                                               $global_date);
                        mysqli_stmt_execute($stmt);
                        
                        
                        
                        $fitNessID          = mysqli_insert_id($con);
                        $arrBodyPartIDquery = array();
                        
                        foreach($arrTargetBodyParts as $indexBodyPartID) {
                            array_push($arrBodyPartIDquery,"($fitNessID,$indexBodyPartID)");
                        }
                        
                        if (mysqli_query($con,"INSERT INTO in_fitness_plan_item (fitnessPlanID,bodyPartID) VALUES " . join(",",$arrBodyPartIDquery))) {
                            $error   = false;
                            $color   = "green";
                            $message = "Fitness plan has been saved";
                        } else {
                            $error   = true;
                            $color   = "red";
                            $message = "Error saving fitness plan" . mysqli_error($con); 
                        }
                        
                    } else {
                        $error   = true;
                        $color   = "red";
                        $message = "Error saving fitness plan" . mysqli_error($con); 
                    }
                    
                } else {
                    $error   = true;
                    $color   = "red";
                    $message = "Fitness plan already exist"; 
                }
                
            } else {
                $isExist = 0;
                
                if (strtolower($oldWorkOutName) != strtolower($workOutName)) {
                    $find_query = mysqli_query($con,"SELECT * FROM in_fitness_plan WHERE workOutName = '$workOutName'");
                    if (mysqli_num_rows($find_query) != 0) {
                        mysqli_next_result($con);
                        
                        $isExist = 1;
                    }   
                }
                
                if ($isExist == 1) {
                    $error   = true;
                    $color   = "red";
                    $message = "Fitness plan already exist"; 
                } else {
                    $query = "UPDATE in_fitness_plan SET workOutName=?,targetLooseWeight=?,intensity=?,workOutDescription=?,workOutProcedure=?,isActive=? WHERE id=?";
                    if ($stmt = mysqli_prepare($con, $query)) {
                        mysqli_stmt_bind_param($stmt,"sssssss",$workOutName,$targetLooseWeight,$intensity,$workOutDescription,$workOutProcedure,$isActive,
                                               $fitnessIDC);
                        mysqli_stmt_execute($stmt);
                        
                        $fitNessID = $fitnessIDC;
                        
                        if (mysqli_query($con,"DELETE FROM in_fitness_plan_item WHERE fitnessPlanID = $fitNessID")) {
                            $arrBodyPartIDquery = array();
                        
                            foreach($arrTargetBodyParts as $indexBodyPartID) {
                                array_push($arrBodyPartIDquery,"($fitNessID,$indexBodyPartID)");
                            }
                            
                            if (mysqli_query($con,"INSERT INTO in_fitness_plan_item (fitnessPlanID,bodyPartID) VALUES " . join(",",$arrBodyPartIDquery))) {
                                $error   = false;
                                $color   = "green";
                                $message = "Fitness plan has been saved";
                            } else {
                                $error   = true;
                                $color   = "red";
                                $message = "Error saving fitness plan" . mysqli_error($con); 
                            } 
                        } else {
                            $error   = true;
                            $color   = "red";
                            $message = "Error saving fitness plan" . mysqli_error($con); 
                        }
                        
                    } else {
                        $error   = true;
                        $color   = "red";
                        $message = "Error saving fitness plan" . mysqli_error($con); 
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
    
        case "load_workout" :
            
            $sql = "
                SELECT
                    a.*,
                    GROUP_CONCAT(c.bodyPart) AS bodyParts,
                    IF(a.isActive = 1,'Active','Inactive') AS status,
                    DATE_FORMAT(a.dateCreated,'%M %d %Y %r') AS dateCreatedF,
                    a.workOutDescription AS workOutDescriptionF,
                    a.workOutProcedure AS workOutProcedureF,
                    GROUP_CONCAT(CONCAT(c.id,'~',c.bodyPart)) AS bodyPartSelect
                FROM
                    in_fitness_plan a 
                INNER JOIN
                    in_fitness_plan_item b
                ON 
                    a.id = b.fitnessPlanID 
                INNER JOIN 
                    in_body_parts c 
                ON 
                    b.bodyPartID = c.id
                GROUP BY
                    a.id
                ORDER BY
                    a.workOutName ASC;
            ";
            return builder($con,$sql);
            
        break;
    
        case "display_select_fitness" :
            
            $sql  = "
                SELECT
                    a.id,
                    a.workOutName,
                    GROUP_CONCAT(c.bodyPart) AS bodyParts,
                    IF(a.isActive = 1,'Active','Inactive') AS status,
                    DATE_FORMAT(a.dateCreated,'%M %d %Y %r') AS dateCreatedF,
                    a.workOutDescription AS workOutDescriptionF,
                    a.workOutProcedure AS workOutProcedureF,
                    GROUP_CONCAT(CONCAT(c.id,'~',c.bodyPart)) AS bodyPartSelect,
                    a.intensity
                FROM
                    in_fitness_plan a 
                INNER JOIN
                    in_fitness_plan_item b
                ON 
                    a.id = b.fitnessPlanID 
                INNER JOIN 
                    in_body_parts c 
                ON 
                    b.bodyPartID = c.id
                WHERE
                    a.isActive = 1
                GROUP BY
                    a.id
                ORDER BY
                    a.workOutName ASC;
            ";
            $result = mysqli_query($con,$sql);
            
            $json = array();
            while ($row  = mysqli_fetch_row($result)) {
                $json[] = array(
                    'id' => $row[0],
                    'workOutName' => $row[1],
                    'bodyParts' => $row[2],
                    'intensity' => $row[8]
                );
            }
            echo json_encode($json);
            
        break;
        
        case "save_video" :
            
            $fitnessID     = $_POST["fitnessID"];
            $fileName      = $_POST["fileName"];
            $uploadedBy    = $_SESSION["id"];
            $dateCreated   = $global_date;
            $title         = str_replace("'","",$_POST["title"]);
            $trainersName  = $_POST["trainersName"];
            $youtubeLink   = $_POST["youtubeLink"];
            
            $find_query = mysqli_query($con,"SELECT * FROM in_videos WHERE title = '$title' AND isActive = 1");
            if (mysqli_num_rows($find_query) == 0) {
                mysqli_next_result($con);
               
                $query = "INSERT INTO in_videos (fitnessID,fileName,uploadedBy,dateCreated,title,trainersName,youtubeLink) VALUES (?,?,?,?,?,?,?)";
                if ($stmt = mysqli_prepare($con, $query)) {
                    mysqli_stmt_bind_param($stmt,"sssssss",$fitnessID,$fileName,$uploadedBy,$dateCreated,$title,$trainersName,$youtubeLink);
                    mysqli_stmt_execute($stmt);
                    
                    $error   = false;
                    $color   = "green";
                    $message = "Video has been added"; 
                    
                } else {
                    $error   = true;
                    $color   = "red";
                    $message = "Error saving video" . mysqli_error($con);  
                }
                   
            } else {
                
                $error   = true;
                $color   = "red";
                $message = "Please provide a different title";  
                
            }
            
            $json[] = array(
                'error' => $error,
                'color' => $color,
                'message' => $message
            );
            echo json_encode($json);
            
        break;
    
        case "display_fitness_video" :
            
            $search = $_POST["search"];
            
            $sql    = "
                SELECT
                    a.id,
                    c.workOutName,
                    a.fileName,
                    a.uploadedBy AS userID,
                    CONCAT(b.lastName,', ',b.firstName,' ',b.middleName) AS uploadedBy,
                    DATE_FORMAT(a.dateCreated,'%M %d %Y @ %r') AS dateCreated,
                    a.title,
                    a.hasThumbnail,
                    IFNULL(a.youtubeLink,'') AS youtubeLink,
                    a.isActive,
                    a.trainersName,
                    GROUP_CONCAT(e.bodyPart SEPARATOR '~') AS bodyParts
                FROM
                    in_videos a 
                INNER JOIN
                    in_user_registration b 
                ON
                    a.uploadedBy = b.id 
                INNER JOIN
                    in_fitness_plan c 
                ON 
                    a.fitnessID = c.id
                AND
                    c.isActive = 1
                INNER JOIN
                    in_fitness_plan_item d
                ON 
                    c.id = d.fitnessPlanID 
                INNER JOIN 
                    in_body_parts e 
                ON 
                    d.bodyPartID = e.id
                
                WHERE
                    c.workOutName LIKE '%$search%'
                OR
                    a.title LIKE '%$search%'
                OR
                    CONCAT(b.lastName,', ',b.firstName,' ',b.middleName) LIKE '%$search%'
                AND
                    a.isActive = 1
                GROUP BY
                    a.id
                ORDER BY
                    a.dateCreated DESC;
            ";
            $result = mysqli_query($con,$sql);
            
            $json = array();
            while ($row  = mysqli_fetch_row($result)) {
                if ($row[9] == 1) {
                    $json[] = array(
                        'id'           => $row[0],
                        'workOutName'  => $row[1],
                        'fileName'     => $row[2],
                        'userID'       => $row[3],
                        'uploadedBy'   => $row[4],
                        'dateCreated'  => $row[5],
                        'title'        => $row[6],
                        'hasThumbnail' => $row[7],
                        'youtubeLink'  => $row[8],
                        'trainersName' => $row[10],
                        'bodyParts'    => $row[11]
                    );
                }
            }
            echo json_encode($json);
            
        break;
        
        case "delete_video" :
            
            $id = $_POST["id"];
            
            $query = "UPDATE in_videos SET isActive = 0 WHERE id=?";
            if ($stmt = mysqli_prepare($con, $query)) {
                mysqli_stmt_bind_param($stmt,"s",$id);
                mysqli_stmt_execute($stmt);
                
                $error   = false;
                $color   = "green";
                $message = "Video has been removed successfully"; 
            } else {
                $error   = true;
                $color   = "red";
                $message = "Error removing video " . mysqli_error($con);
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