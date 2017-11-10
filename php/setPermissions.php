<?php

	session_start();

	function setChair() {

		$jsonfile = file_get_contents("../project-files/events.json");
		$events = json_decode($jsonfile, true);
		$length = count($events);

		$email = $_SESSION['email'];
		$given_name = $_SESSION['given_name'];
		$family_name = $_SESSION['family_name'];

		$name = $given_name." ".$family_name." <".$email.">";

		for($i=0; $i<$length; $i++) {

			$chairs = $events[$i]['chairs'];

			$isChair[$events[$i]['acronym']] = false;

			foreach ($chairs as $key) {
				if (strcmp($key, $name) == 0){
					$isChair[$events[$i]['acronym']] = true;
				}
			}

		}

		return ($isChair);
	}

	function setAnnotator() {

		$jsonfile = file_get_contents("../project-files/events.json");
		$events = json_decode($jsonfile, true);
		$length = count($events);

		$email = $_SESSION['email'];
		$given_name = $_SESSION['given_name'];
		$family_name = $_SESSION['family_name'];

		$name = $given_name." ".$family_name." <".$email.">";

		for($i=0; $i<$length; $i++) {

			$submissions = $events[$i]['submissions'];

			foreach($submissions as $j) {

				$isAnnotator[$j['url']] = false;
				$reviewers = $j['reviewers'];

				foreach ($reviewers as $key) {
					if (strcmp($key, $name) == 0){
						$isAnnotator[$j['url']] = true;
					}
				}
			}

		}

		return ($isAnnotator);
	}

	echo json_encode(array(setChair(),setAnnotator()));

?>
