<?php
	session_start();
	$email = $_SESSION['email'];
	$pass1 = $_POST['pass1'];
	$pass2 = $_POST['pass2'];
	
	if (strcmp($pass1, $pass2) != 0){
		echo '
<html>
<head>
	<link href="https://fonts.googleapis.com/css?family=Nunito" rel="stylesheet" type="text/css">
	<meta charset="utf-8">		 
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
    
<style>

	body {
		background-color:#E9E9E9;
	}
	
	h1 {
		font-family: "Nunito", sans-serif;
		color: #99D3DF;
		font-size: 40px;
		position: relative;
		top: 30px;
		text-align: center;
	}
</style>

</head>
<body>
	<div id="status"><h1>Password not matching.</h1></div>
</body>';
		header( "refresh:5; url=main.php" );
	}

	else {
		$json = file_get_contents("../project-files/users.json");
		$users = json_decode($json, true);

		foreach ($users as $key => $value) {
			if (in_array($email, $value)){
				if (crypt($pass1, $users[$key]['pass']) == $users[$key]['pass']) {
					unset($users[$key]);
					$update = json_encode($users, JSON_PRETTY_PRINT);
					file_put_contents('../project-files/users.json', $update);
					echo '
<html>
<head>
	<link href="https://fonts.googleapis.com/css?family=Nunito" rel="stylesheet" type="text/css">
	<meta charset="utf-8">		 
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
    
<style>

	body {
		background-color:#E9E9E9;
	}
	
	h1 {
		font-family: "Nunito", sans-serif;
		color: #99D3DF;
		font-size: 40px;
		position: relative;
		top: 30px;
		text-align: center;
	}
</style>

</head>
<body>
	<div id="status"><h1>Account deleted. You will be redirected to the homepage.</h1></div>
</body>';
					break;
				}
			}
		}

	}
	header( "refresh:5; url=../index.html" );
?>
