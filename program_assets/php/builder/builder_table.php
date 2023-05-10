<?php
	function builder($conn,$query) {
		$result = mysqli_query($conn,$query);
		$data   = array();

		if (!$result) {
			echo("Error description: " . mysqli_error($conn));
		}

		while ($array = mysqli_fetch_assoc($result)) {
			$data[] = $array;
		}

		$results = array(
			"sEcho"                => 1,
			"iTotalRecords"        => count($data),
			"iTotalDisplayRecords" => count($data),
			"aaData"               => $data
		);

		echo json_encode($results,JSON_PRETTY_PRINT);
		mysqli_free_result($result);
		mysqli_close($conn);
	}
?>