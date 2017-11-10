<?php 
	function debug_to_console($data) {
		if(is_array($data) || is_object($data))
		{
			echo("<script>console.log('PHP: ".json_encode($data)."');</script>");
		} else {
			echo("<script>console.log('PHP: ".$data."');</script>");
		}
	}

	$id = $_POST['id'];
	$newbody = $_POST['body'];
	$newhead = $_POST['head'];
	$reviewer = $_POST['reviewer'];
	$stateOfArticle = $_POST['stateOfArticle'];

	$url = $_POST['url'];
	
	$filename = "../project-files/dataset/".$id;
	
	$doc = new DOMDocument(); 
	@$doc->loadHTMLFile("../project-files/dataset/".$id);
	$parent = $doc->getElementsByTagName("head")->item(0);
	
	/* adding the new script element */
	$newnode = $doc->createElement("script", $newhead);
	$newnode = $parent->appendChild($newnode);
	$newnode->setAttribute("type", "application/ld+son");
	$newnode->setAttribute("id", $reviewer);
	
	/* updating status.json */
	$json = file_get_contents("../js/status.json");
	$status = json_decode($json, true);
	
	foreach ($status as $key => $entry){
		if ((strcmp($entry['url'], $url) == 0) && 
				(strcmp($entry['status'], "awaiting decision") == 0)){
			$status[$key]['status'] = $stateOfArticle;
			break;
		}
	}
	
	$updatedStatus = json_encode($status, JSON_PRETTY_PRINT);
	file_put_contents("../js/status.json", $updatedStatus);

	echo $doc->saveHTMLFile($filename);
?>
