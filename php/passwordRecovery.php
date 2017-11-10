<?php

	session_start();
	if (isset($_POST['email-forgot'])){

		$email = $_POST['email-forgot'];
		
		/*check if inserted email belongs to currently registered user */
		$check = -1;
		$count = 0;

		$jsonfile = file_get_contents("../project-files/users.json");
		$users = json_decode($jsonfile, true);
			foreach ($users as $key){
				if(strcmp($email,$key['email']) == 0) {
					$check = $count;
					break;
				}
				$count++;
			}

		if ($check != -1){
			$msg = '
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
	<div id="status"><h1>An email with subject "Password Recovery" has been sent to the address that you provided, <br />follow the instructions to recover your account credentials.</h1></div>
</body>';
			$hash = md5( rand(0,1000) ); 

			$admin = "giulia.cantini2@studio.unibo.it";
			$subject = "EasyRash Password Recovery";
			$content = "Dear ".$email.", 
please click on the link below to be redirected to a page where you will be asked to change your password. 
Ignore this mail if it wasn't you to fill in the request.
http://site1607.web.cs.unibo.it/php/setNewPassword.php?email=".$email."&hash=".$hash."
The Admins";
			mail($email, "$subject", $content, "From:" . $admin);
			
		}
		else{
			$msg = "This is not a registered address. Please follow the sign up procedure if you want to continue in EasyRash"; 
			header('Location: ../index.html');

		}

		echo $msg;
		
	}
?>
