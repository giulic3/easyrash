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
	
	/* handling change password from login page or from main page */
	if(( isset($_POST['email']) && !empty($_POST['email']) && isset($_POST['password']) && !empty($_POST['password']) ) ||
	( isset($_SESSION['email']) && !empty($_SESSION['email']) && isset($_POST['password']) && !empty($_POST['password']) )){

	    if (!empty($_SESSION['email'])) $email = $_SESSION['email'];
	    else $email = $_POST['email'];
 
	    $password = $_POST['password']; 
	    /* position of the registered user inside .json*/
	    $check = -1; 
	    $count = -1;

	    $jsonfile = file_get_contents("../project-files/users.json");
	    $users = json_decode($jsonfile, true);
	    
	    foreach ($users as $key => $el) {
	    	$count++;
	    	if (strcmp($email, $el['email']) == 0) {
	    		/* encrypt and save the new password */
	    		$encrypted_password = better_crypt($password, 5);
	    		$users[$key]['pass'] = $encrypted_password; 

	    		$update = json_encode($users, JSON_PRETTY_PRINT);
	    		file_put_contents("../project-files/users.json", $update);
	    		$check = $count;
	    		break;
	    	}
	    }
	    
	    if ($check != -1) {
	    	
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
	<div id="status"><h1>Your password has been updated. You will be redirected to the login page.</h1></div>
</body>';
	    	header( "refresh:5; url=../index.html" );
	    }
	    
	    else
	    	echo "<h1>Invalid attempt</h1>";
	}
	else {
		echo "<h1>Global variables empty or null</h1>";
	}
?>
