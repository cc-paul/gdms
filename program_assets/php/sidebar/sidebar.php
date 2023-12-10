<?php

	include dirname(__FILE__,2) . '/config.php';;
	include $main_location . '/connection/conn.php';

	if(!isset($_SESSION)) { session_start(); } 

	$param_username = $_SESSION['username'];
	$assigned_menus = array();
	//$filterHeaderMenu = "";
	//
	//switch ($_SESSION['positionID']) {
	//	case 1 :
	//		$filterHeaderMenu = "
	//			AND id IN (1)
	//		";
	//	break;
	//	case 8 :
	//		$filterHeaderMenu = "
	//			AND id IN (2)
	//		";
	//	break;
	//}
	
	
	$header_sql = "SELECT * FROM omg_menu_header WHERE 1 AND is_active = 1 ORDER BY sort ASC;";
	
	$header_result     = mysqli_query($con,$header_sql);
	while ($row_header = mysqli_fetch_row($header_result)) {
		$header_id     = $row_header[0];
		$header_menu   = $row_header[1];
		$header_icon   = $row_header[2];

		echo '<li id="hm-' .$header_id. '" name="hm-' .$header_id. '" class="treeview active">';
		echo '	<a>';
		echo '		<i class="fa '.$header_icon.'"></i> <span>'.$header_menu.'</span>';
		echo '		<span class="pull-right-container">';
		echo '			<i class="fa fa-angle-left pull-right"></i>';
		echo '		</span>';
		echo '	</a>';
		echo '<ul class="treeview-menu">';
		$detail_sql        = "
			
			SELECT
				b.detail_menu_name,
				b.detail_menu_icon,
				b.php_page,
				b.description,
				b.id
			FROM
				omg_menu_build a
			INNER JOIN
				omg_menu_details b
			ON
				a.menuDetailsID = b.id
			WHERE
				a.menuHeaderID = $header_id
			GROUP BY
				a.menuHeaderID,
				a.menuDetailsID
		
		";
		$detail_result     = mysqli_query($con,$detail_sql);
		while ($row_detail = mysqli_fetch_row($detail_result)) {
			$detail_menu   = $row_detail[0];
			$detail_icon   = $row_detail[1];
			$detail_file   = $row_detail[2];
			$detail_desc   = $row_detail[3];
			$li_id_name    = strtolower(str_replace(" ","_",$detail_menu));
			$menu_id       = $row_detail[4];
			$positionID    = $_SESSION['positionID'];
			$message_counter = "";

			if ($positionID == 1) {
				if ($menu_id == 8 || $menu_id == 2 || $menu_id == 4 || $menu_id == 7 || $menu_id == 10 || $menu_id == 11) {
					echo '<li id='.$li_id_name.' name='.$li_id_name.'>';
					echo '	<a data-id="sm-' .$header_id. '" href="'.$detail_file.'" data-header="'.$header_menu.'" data-desc="'.$detail_desc.'"><i class="fa '.$detail_icon.'"></i>'.$detail_menu.'</a>';
					echo '</li>';
				}
			}
			
			//if ($positionID == 3) {
			//	if ($menu_id == 8 || $menu_id == 2 || $menu_id == 9 || $menu_id == 4 || $menu_id == 7 || $menu_id == 6) {
			//		echo '<li id='.$li_id_name.' name='.$li_id_name.'>';
			//		echo '	<a data-id="sm-' .$header_id. '" href="'.$detail_file.'" data-header="'.$header_menu.'" data-desc="'.$detail_desc.'"><i class="fa '.$detail_icon.'"></i>'.$detail_menu.'</a>';
			//		echo '</li>';
			//	}
			//}
			
			if ($positionID == 4 || $positionID == 10) {
				if ($menu_id == 8 || $menu_id == 2 || $menu_id == 6 || $menu_id == 11) {
					echo '<li id='.$li_id_name.' name='.$li_id_name.'>';
					echo '	<a data-id="sm-' .$header_id. '" href="'.$detail_file.'" data-header="'.$header_menu.'" data-desc="'.$detail_desc.'"><i class="fa '.$detail_icon.'"></i>'.$detail_menu.'</a>';
					echo '</li>';
				}
			}
			
			if ($positionID == 2 || $positionID == 3) {
				echo '<li id='.$li_id_name.' name='.$li_id_name.'>';
				echo '	<a data-id="sm-' .$header_id. '" href="'.$detail_file.'" data-header="'.$header_menu.'" data-desc="'.$detail_desc.'"><i class="fa '.$detail_icon.'"></i>'.$detail_menu.'</a>';
				echo '</li>';
			}

			$assigned_menus[] = $detail_file;
		}
			
		echo '</ul>';
		echo '</li>';
	}

	/* add this also not default menus */
	$assigned_menus[] = 'not_found';
	$assigned_menus[] = 'profile';
	$assigned_menus[] = 'server_maintenance';
	$assigned_menus[] = 'message_counting';

	$current_page = str_replace('.php','', basename($_SERVER['PHP_SELF']));
	if (!in_array($current_page,$assigned_menus)) {
		echo "<script type='text/javascript'>window.location.href='not_found';</script>"; exit;
	}

	mysqli_free_result($header_result);
	mysqli_free_result($detail_result);
	mysqli_close($con);
?>
						