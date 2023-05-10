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
        case "load_meal_list" :
            
            $sql = "
                SELECT
                    a.id,
                    a.meal,
                    a.description,
                    a.description AS unf_description,
                    IF(a.isActive = 1,'Active','Inactive') AS status,
                    DATE_FORMAT(a.dateCreated,'%M %d %Y %r') AS dateCreated,
                    a.isActive
                FROM
                    in_meal_type a 
                ORDER BY
                    a.meal ASC;
            ";
            return builder($con,$sql);
            
        break;
    
        case "new_meal" :
            
            $meal        = $_POST["meal"];
            $description = $_POST["description"];
            $isActive    = $_POST["isActive"];
            $isNewMeal   = $_POST["isNewMeal"];
            $oldMeal     = $_POST["oldMeal"];
            $mealID      = $_POST["mealID"];
            
            if ($isNewMeal == 1) {
                
                $find_query = mysqli_query($con,"SELECT * FROM in_meal_type WHERE meal = '$meal'");
                if (mysqli_num_rows($find_query) == 0) {
                    mysqli_next_result($con);
                    
                    $query = "INSERT INTO in_meal_type (meal,description,isActive,dateCreated) VALUES (?,?,?,?)";
                    if ($stmt = mysqli_prepare($con, $query)) {
                        mysqli_stmt_bind_param($stmt,"ssss",$meal,$description,$isActive,$global_date);
                        mysqli_stmt_execute($stmt);
                        
                        $error   = false;
                        $color   = "green";
                        $message = "Meal has been saved"; 
                        
                    } else {
                        $error   = true;
                        $color   = "red";
                        $message = "Error saving meal"; 
                    }
                    
                } else {
                    $error   = true;
                    $color   = "red";
                    $message = "Meal already exist"; 
                }
                
            } else {
                    
                $isExist = 0;
                
                if (strtolower($oldMeal) != strtolower($meal)) {
                    $find_query = mysqli_query($con,"SELECT * FROM in_meal_type WHERE meal = '$meal'");
                    if (mysqli_num_rows($find_query) != 0) {
                        mysqli_next_result($con);
                        
                        $isExist = 1;
                    }   
                }
                
                if ($isExist == 1) {
                    $error   = true;
                    $color   = "red";
                    $message = "Meal already exist"; 
                } else {
                    $query = "UPDATE in_meal_type SET meal=?,description=?,isActive=? WHERE id=?";
                    if ($stmt = mysqli_prepare($con, $query)) {
                        mysqli_stmt_bind_param($stmt,"ssss",$meal,$description,$isActive,$mealID);
                        mysqli_stmt_execute($stmt);
                        
                        $error   = false;
                        $color   = "green";
                        $message = "Meal has been updated"; 
                        
                    } else {
                        $error   = true;
                        $color   = "red";
                        $message = "Error updating meal"; 
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
    
        case "save_mealplan" :
            
            $isNewMealPlan  = $_POST["isNewMealPlan"];
            $mealPlanName   = $_POST["mealPlanName"];
            $caloriesCount  = $_POST["caloriesCount"];
            $mealTime       = $_POST["mealTime"];
            $description    = $_POST["description"];
            $arrMealType    = $_POST["arrMealType"];
            $arrRecipes     = $_POST["arrRecipes"];
            $arrProcedures  = $_POST["arrProcedures"];
            $isActive       = $_POST["isActive"];
            $myID           = $_SESSION["id"];
            $oldMealPlan    = $_POST["oldMealPlan"];
            $oldMealPlanID  = $_POST["oldMealPlanID"];

            
            if ($isNewMealPlan == 1) {
                
                $find_query = mysqli_query($con,"SELECT * FROM in_mealplan WHERE mealPlanName = '$mealPlanName' AND isActive = 1");
                if (mysqli_num_rows($find_query) == 0) {
                    mysqli_next_result($con);
                   
                    $query = "INSERT INTO in_mealplan (mealPlanName,caloriesCount,mealTime,description,isActive,dateCreated,createdBy) VALUES (?,?,?,?,?,?,?)";
                    if ($stmt = mysqli_prepare($con, $query)) {
                        mysqli_stmt_bind_param($stmt,"sssssss",$mealPlanName,$caloriesCount,$mealTime,$description,$isActive,$global_date,$myID);
                        mysqli_stmt_execute($stmt);
                       
                        $fitNessID        = mysqli_insert_id($con);
                        $curArrMealType   = str_replace("fitNessID",$fitNessID,$arrMealType);
                        $curArrRecipes    = str_replace("fitNessID",$fitNessID,$arrRecipes);
                        $curArrProcedures = str_replace("fitNessID",$fitNessID,$arrProcedures);
                        
                        //echo "INSERT INTO in_mealplan_type (mealPlanID,mealTypeID) VALUES $curArrMealType";
                        //echo "INSERT INTO in_mealplan_procrec (mealPlanID,description,`group`) VALUES $curArrRecipes";
                        //echo "INSERT INTO in_mealplan_procrec (mealPlanID,description,`group`) VALUES $curArrProcedures";
                        
                        $saveArrMealType   = mysqli_query($con,"INSERT INTO in_mealplan_type (mealPlanID,mealTypeID) VALUES $curArrMealType");
                        $saveArrRecipes    = mysqli_query($con,"INSERT INTO in_mealplan_procrec (mealPlanID,description,`group`) VALUES $curArrRecipes");
                        $saveArrProcedures = mysqli_query($con,"INSERT INTO in_mealplan_procrec (mealPlanID,description,`group`) VALUES $curArrProcedures");
                        
                        if ($saveArrMealType && $saveArrRecipes && $saveArrProcedures) {
                            
                            $error   = false;
                            $color   = "green";
                            $message = "Meal Plan saved successfully"; 
                            
                        } else {
                            
                            $error   = true;
                            $color   = "red";
                            $message = "Error saving meal plan" . mysqli_error($con); 
                            
                        }
                       
                    } else {
                        $error   = true;
                        $color   = "red";
                        $message = "Error saving meal plan". mysqli_error($con); 
                    }
                   
                } else {
                    $error   = true;
                    $color   = "red";
                    $message = "Meal Plan already exist"; 
                }
                                
            } else {
                
                $find_query = mysqli_query($con,"SELECT * FROM in_mealplan WHERE mealPlanName = '$mealPlanName' AND isActive = 1");
                if (mysqli_num_rows($find_query) != 0 && strtolower($mealPlanName) != strtolower($oldMealPlan)) {
                    mysqli_next_result($con);
                    
                    $error   = true;
                    $color   = "red";
                    $message = "Meal Plan already exist";
                    
                } else {
                    
                    $query = "UPDATE in_mealplan SET mealPlanName=?,caloriesCount=?,mealTime=?,description=?,isActive=? WHERE id = ?";
                    if ($stmt = mysqli_prepare($con, $query)) {
                        mysqli_stmt_bind_param($stmt,"ssssss",$mealPlanName,$caloriesCount,$mealTime,$description,$isActive,$oldMealPlanID);
                        mysqli_stmt_execute($stmt);
                       
                        $fitNessID        = $oldMealPlanID;
                        $curArrMealType   = str_replace("fitNessID",$fitNessID,$arrMealType);
                        $curArrRecipes    = str_replace("fitNessID",$fitNessID,$arrRecipes);
                        $curArrProcedures = str_replace("fitNessID",$fitNessID,$arrProcedures);
                        
                        $deleteMealType    = mysqli_query($con,"DELETE FROM in_mealplan_type WHERE mealPlanID = $fitNessID");
                        $deleteRecProc     = mysqli_query($con,"DELETE FROM in_mealplan_procrec WHERE mealPlanID = $fitNessID");
                        $saveArrMealType   = mysqli_query($con,"INSERT INTO in_mealplan_type (mealPlanID,mealTypeID) VALUES $curArrMealType");
                        $saveArrRecipes    = mysqli_query($con,"INSERT INTO in_mealplan_procrec (mealPlanID,description,`group`) VALUES $curArrRecipes");
                        $saveArrProcedures = mysqli_query($con,"INSERT INTO in_mealplan_procrec (mealPlanID,description,`group`) VALUES $curArrProcedures");
                        
                        if ($deleteMealType && $deleteRecProc && $saveArrMealType && $saveArrRecipes && $saveArrProcedures) {
                            
                            $error   = false;
                            $color   = "green";
                            $message = "Meal Plan saved successfully" . mysqli_error($con); 
                            
                        } else {
                            
                            $error   = true;
                            $color   = "red";
                            $message = "Error saving meal plan" . mysqli_error($con); 
                            
                        }
                       
                    } else {
                        $error   = true;
                        $color   = "red";
                        $message = "Error saving meal plan" . mysqli_error($con); 
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
    
        case "load_mealplan" :
            
            $sql = "
                SELECT
                    a.id,
                    a.mealPlanName,
                    a.caloriesCount,
                    a.mealTime,
                    GROUP_CONCAT(CONCAT(c.id,'~',c.meal)) AS mealTypes,
                    GROUP_CONCAT(c.meal) AS fmealTypes,
                    a.description,
                    a.description AS unf_description,
                    IF(a.isActive = 1,'Active','Inactive') AS status,
                    DATE_FORMAT(a.dateCreated,'%M %d %Y %r') AS dateCreated,
                    a.isActive,
                    (
                        SELECT GROUP_CONCAT(description SEPARATOR '~') FROM in_mealplan_procrec WHERE mealPlanID = a.id AND `group` = 1
                    ) AS recipes,
                    (
                        SELECT GROUP_CONCAT(description SEPARATOR '~') FROM in_mealplan_procrec WHERE mealPlanID = a.id AND `group` = 2
                    ) AS `procedure`,
                    IF(a.hasThumbnail > 0,1,0) AS hasThumbnail
                FROM
                    in_mealplan a 
                INNER JOIN
                    in_mealplan_type b 
                ON 
                    a.id = b.mealPlanID 
                INNER JOIN
                    in_meal_type c 
                ON 
                    b.mealTypeID = c.id 
                GROUP BY
                    a.id
                ORDER BY
                    a.dateCreated DESC;
            ";
            return builder($con,$sql);
            
        break;
        
        case "create_folder" :
            
            $folderID       = $_POST["folderID"];
            $folderLocation = '../../../diet/'.$folderID;
            
            if (file_exists($folderLocation)) {
                
                $error   = false;
                $color   = "green";
                $message = ""; 
                
            } else {
                if (mkdir($folderLocation, 0777, true)) {
                    $error   = false;
                    $color   = "green";
                    $message = ""; 
                } else {
                    $error   = true;
                    $color   = "red";
                    $message = "Unable to create folder"; 
                }
            }
            
            $json[] = array(
                'error' => $error,
                'color' => $color,
                'message' => $message
            );
            echo json_encode($json);
            
        break;
    
        case "upload_photo" :
            
            $folderID = $_POST["folderID"];
            $filename = date('YmdHis', time());
            
            if ( 0 < $_FILES['file']['error'] ) {
                
                $error   = true;
                $color   = "red";
                $message = "Error uploading files"; 
                
            } else {
        
                if (move_uploaded_file($_FILES['file']['tmp_name'], '../../../diet/'. $folderID . '/' . $filename.".png")) {
                    
                    $query = "UPDATE in_mealplan SET hasThumbnail = hasThumbnail + 1 WHERE id = ?";
                    if ($stmt = mysqli_prepare($con, $query)) {
                        mysqli_stmt_bind_param($stmt,"s",$folderID);
                        mysqli_stmt_execute($stmt);
                        
                        $error   = false;
                        $color   = "green";
                        $message = "Image has been added successfully"; 
                    } else {
                        $error   = true;
                        $color   = "red";
                        $message = "Error uploading files"; 
                    }
                    
                } else {
                    $error   = true;
                    $color   = "red";
                    $message = "Error uploading photo"; 
                }
        
            }
            
            $json[] = array(
                'error' => $error,
                'color' => $color,
                'message' => $message
            );
            echo json_encode($json);
                    
        break;
    
        case "load_files" :
            
            $folderID  = $_POST["folderID"];
            $directory = '../../../diet/'. $folderID . '/';
            $texts     = glob($directory . "*.png");
            $json      = array();
            
            foreach($texts as $text) {
                $json[] = array(
                    'fileName' => str_replace('../../../diet/'. $folderID . '/',"",$text)
                );
            }
            
            echo json_encode($json);            
            
        break;
    
        case "delete_photo" :
            
            $fileName = $_POST["fileName"];
            $folderID = $_POST["folderID"];
            
            
            if (unlink('../../../diet/'. $folderID . '/' .$fileName)) {
                
                $query = "UPDATE in_mealplan SET hasThumbnail = hasThumbnail - 1 WHERE id = ?";
                if ($stmt = mysqli_prepare($con, $query)) {
                    mysqli_stmt_bind_param($stmt,"s",$folderID);
                    mysqli_stmt_execute($stmt);
                    
                    $error   = false;
                    $color   = "green";
                    $message = "Image has been remove successfully"; 
                } else {
                    $error   = true;
                    $color   = "red";
                    $message = "Error deleting files"; 
                }
                
            } else {
                $error   = true;
                $color   = "red";
                $message = "Error deleting files"; 
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