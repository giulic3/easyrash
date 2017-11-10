<?php 
if(isset($_GET['email']) && !empty($_GET['email']) AND isset($_GET['hash']) && !empty($_GET['hash'])){
    /* set email variable */
    $email = $_GET['email']; 
    /* set hash variable */
    $hash = $_GET['hash'];
    
    /* position of the registered user inside .json*/
    $check = -1; 
    $count = -1;

    $jsonfile = file_get_contents("../project-files/users.json");
    $users = json_decode($jsonfile, true);
    

    foreach ($users as $key => $el) {
    	$count++;
    	if (strcmp($email, $el['email']) == 0 && strcmp($hash, $el['hash']) == 0) {
    		$users[$key]['active'] = 'yes';
    		//aggiorno il file
    		$update = json_encode($users, JSON_PRETTY_PRINT);
    		file_put_contents("../project-files/users.json", $update);
    		$check = $count;
    		break;
    	}
    }
    /* user found */
    if ($check != -1) {
    	
    	echo "
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
	<div><h1>Your account has been activated.</h1></div>
</body>";
    	header( "refresh:5; url=../index.html" );
    }
    
    else 
    	echo "<h1>Invalid attempt</h1>";
}
?>
