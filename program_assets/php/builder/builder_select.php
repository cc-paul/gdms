<?php
	function generate_select($con,$sql) {
		$result = mysqli_query($con,$sql);
		while ($row = mysqli_fetch_row($result)) {
			$id    = $row[0];
			$value = $row[1];
			echo '<option value="'.$id.'">'.$value.'</option>';
		}
		mysqli_close($con);
	}
?>