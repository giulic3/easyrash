<?php

	// Original PHP code by Chirp Internet: www.chirp.com.au
	// Please acknowledge use of this code by including this header.
	function better_crypt($input, $rounds = 7){
	    $salt = "";
	    $salt_chars = array_merge(range('A','Z'), range('a','z'), range(0,9));
	    for($i=0; $i < 22; $i++) {
	      $salt .= $salt_chars[array_rand($salt_chars)];
	    }
	    return crypt($input, sprintf('$2y$%02d$', $rounds) . $salt);
  	}

	session_start();

		if (isset($_POST['firstname']) && isset($_POST['lastname']) && isset($_POST['email']) && isset($_POST['password'])){

			$firstname = $_POST['firstname'];		
			$lastname = $_POST['lastname'];
			$email = $_POST['email'];
			$password = $_POST['password'];
			$sex = $_POST['sex'];
			$msg = "
<html>
<head>
	<link href='https://fonts.googleapis.com/css?family=Nunito' rel='stylesheet' type='text/css'>
	<meta charset='utf-8'>		 
	<link rel='stylesheet' href='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css'>
    
<style>

	body {
		background-color:#E9E9E9;
	}
	
	h1 {
		font-family: 'Nunito', sans-serif;
		color: #99D3DF;
		font-size: 40px;
		position: relative;
		top: 30px;
		text-align: center;
	}
</style>

</head>
<body>
	<div id='status'><h1>Your account has been created, <br /> please verify it by clicking the activation link that has been sent to your email.</h1></div>
</body>";

			$hash = md5( rand(0,1000) ); 
			/* using crypt with Blowfish */
			$password = better_crypt($password, 5);

			$cdate = date("Y-m-d H:i:s");
			$admin = "giulia.cantini2@studio.unibo.it";
			$subject = "EasyRash Verify registration";
			$content = $firstname.", 
thanks for registering in EasyRash, please click on the confirmation link below to verify your account or ignore this mail if it wasn't you to fill in the form.
http://site1607.web.cs.unibo.it/php/verifyAccount.php?email=".$email."&hash=".$hash." 
This is an automated email notification of user registration. Save this email for future reference. Read http://site1607.web.cs.unibo.it/html/help.html to know more about this website.
Note: If you got this email by mistake: Somebody ".$firstname." " .$lastname. " registered in EasyRash using your email address " .$email. 
" Contact the admin.";
			mail($email, "$subject", $content, "From:" . $admin);
			
			/* for example key = Jessica Jones <jessica.jones@alias.com> */
			$key = $firstname." ".$lastname." <".$email.">";
			
			/* updating users.json with info on my account */
			$jsonfile = file_get_contents("../project-files/users.json");
			$users = json_decode($jsonfile, true);
			
			$new_user = array($key => array(
			'given_name' => $firstname,
			'family_name' => $lastname,
			'email' => $email,
			'pass' => $password,
			'sex' => $sex,
			'hash' => $hash,		    
			'creation_date' => $cdate,
			'active' => 'no'));

			/* using array_merge to merge associative arrays */
			$users = array_merge($users, $new_user);
			$update = json_encode($users, JSON_PRETTY_PRINT);
			file_put_contents('../project-files/users.json', $update);

			echo $msg;
			
		}


?>


