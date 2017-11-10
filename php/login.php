<?php
	session_start();

		if (isset($_POST['email']) && isset($_POST['password'])){
			$email = $_POST['email'];
			$password = $_POST['password'];

			$check = -1;
			$count = 0;

			$jsonfile = file_get_contents("../project-files/users.json");
			$users = json_decode($jsonfile, true);
			foreach ($users as $key){
				if((strcmp($email,$key['email']) == 0) && (crypt($password,$key['pass']) == $key['pass'])) { 
					$given_name = $key['given_name'];
					$family_name = $key['family_name'];
					$creation_date = $key['creation_date'];
					$check = $count;
					break;
				}
				$count++;
			}

			if ($check != -1){
				$_SESSION['email'] = $email; 
				$_SESSION['given_name'] = $given_name;
				$_SESSION['family_name'] = $family_name;
				$_SESSION['creation_date'] = $creation_date;
				header('Location: ../html/main.php');
			}
			else{
				echo "<p>Invalid username or password. Try again.</p>";
				header('Location: ../index.html');

			}

		}

?>



