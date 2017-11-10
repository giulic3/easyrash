<?php

	function debug_to_console($data) {
	    if(is_array($data) || is_object($data)){
			echo("console.log('PHP: ".json_encode($data)."');");
	    } 
	    else {
			echo("console.log('PHP: ".$data."');");
		}
	}

	/* script used to load a paper in reader mode */

	if (isset($_GET['title'])) {
		
		$result = "";
		$paper_title = $_GET['title'];
		
		$jsonfile = file_get_contents("../project-files/events.json");
		$events = json_decode($jsonfile, true);
		/* searching for corresponding url */
		foreach ($events as $key){
			
			for ($i = 0; $i < count($key['submissions']); $i++) {
				if (strcmp($key['submissions'][$i]['title'], $paper_title) == 0)
					$result = ($key['submissions'][$i]['url']);
			}
			
			
		}

		readfile("../project-files/dataset/".$result);
	}
?>
