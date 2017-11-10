<?php
	session_start();
	$user_info = array($_SESSION['email'], $_SESSION['given_name'], $_SESSION['family_name'], $_SESSION['creation_date']);
	echo json_encode($user_info);
?>