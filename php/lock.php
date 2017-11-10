<?php

	function debug_to_console($data) {
	    if(is_array($data) || is_object($data)){
			echo("console.log('PHP: ".json_encode($data)."');");
	    } 
	    else {
			echo("console.log('PHP: ".$data."');");
		}
	}

	$url = $_POST['url'];
	$actionType = $_POST['type'];
	$return = "";
	
	if (strcmp($actionType, "request") == 0){

		$json = file_get_contents("../js/status.json");
		$status = json_decode($json, true);
	
		/* obtains lock only if the doc is currently unlocked */
		foreach ($status as $key => $entry){
			if (strcmp($entry['url'], $url) == 0){
				if (($entry['locked'] == false)){
					$status[$key]['locked'] = true;
					$return = "success";
				}
				else $return = "failure";
					
				break;
			}
		}
	}
	else if (strcmp($actionType, "release") == 0){
		
		$json = file_get_contents("../js/status.json");
		$status = json_decode($json, true);
		/* releasing lock */
		foreach ($status as $key => $entry){
			if (strcmp($entry['url'], $url) == 0){
					$status[$key]['locked'] = false;
					$return = "success";
					break;
			}
		}
	}
	
	$updatedStatus = json_encode($status, JSON_PRETTY_PRINT);
	file_put_contents("../js/status.json", $updatedStatus);
	
	echo $return;
?>
