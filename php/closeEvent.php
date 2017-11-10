<?php 
	/* close an event according to $event_acronym value */
	$event_acronym = $_POST['acronym'];	
	$jsonfile = file_get_contents("../project-files/events.json");
	$events = json_decode($jsonfile, true);
	
	$length = count($events);
	for($i=0; $i<$length; $i++) {
		if (strcmp($events[$i]['acronym'], $event_acronym) == 0) 
			$events[$i]['status'] = 'closed';
	}
	
	$update = json_encode($events, JSON_PRETTY_PRINT);
	file_put_contents('../project-files/events.json', $update);
	
?>
