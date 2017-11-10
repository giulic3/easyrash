<?php 

	$id = $_POST['id'];
	$newbody = $_POST['body'];
	/*contains the json review to be saved in the head.*/
	$newhead = $_POST['head']; 
	$reviewer = $_POST['reviewer'];
	/*can be from finalJudgement or saveReview*/
	$caller = $_POST['caller']; 
	
	$filename = "../project-files/dataset/".$id;
	$filetext = file_get_contents($filename);
	
	$startpos = strpos($filetext, "<body>")+6;
	$endpos = strpos($filetext, "</body>");
	$oldbody = substr($filetext, $startpos, $endpos - $startpos);
	$filetext = str_replace($oldbody, $newbody, $filetext);

	file_put_contents($filename, $filetext); 
	
	$doc = new DOMDocument(); 
	/* '@' is used to avoid warnings */
	@$doc->loadHTMLFile("../project-files/dataset/".$id);
	/* updating body */

	/* select the script element containing the previous review, oldnode could be null*/
	$oldnode = $doc->getElementById($reviewer); 
	$parent = $doc->getElementsByTagName("head")->item(0);
	
	if ($oldnode != null){
		/* removing the previous review (from the head) to add the updated one*/
		$parent->removeChild($oldnode); 
	} 
	
	$newnode = $doc->createElement("script", $newhead);
	$newnode = $parent->appendChild($newnode); //aggiungo il nuovo script ann
	$newnode->setAttribute("type", "application/ld+son");
	$newnode->setAttribute("id", $reviewer);
	
	$json = file_get_contents("../js/status.json");
	$status = json_decode($json, true);

	foreach ($status as $key => $entry){
		/* checking if the user has not left the final comment yet */
		if ((strcmp($entry['url'], $id) == 0) && ($status[$key]['reviewedby'][$reviewer] == false)){	
			
			if (strcmp($caller, "saveReview") == 0)
				$status[$key]['commentedby'][$reviewer] = true;
			/* ajax call by finalJudgement */
			else if (strcmp($caller, 'finalJudgement') == 0) {	
					
				$status[$key]['reviewedby'][$reviewer] = true;
				$annotators = $status[$key]['reviewedby'];
				/* if true the status can change to awaiting decision (if everyone reviewed)*/
				$everyone_reviewed = true;
				foreach ($annotators as $a => $bool){

					if ($bool == false)
						$everyone_reviewed = false;
				}
				/* can change the status of the paper */
				if ($everyone_reviewed == true) $status[$key]['status'] = 'awaiting decision';
			
			}
		}

	}
	$updatedStatus = json_encode($status, JSON_PRETTY_PRINT);
	file_put_contents("../js/status.json", $updatedStatus);
	
	echo $doc->saveHTMLFile($filename);
	
?>
