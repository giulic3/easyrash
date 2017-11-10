/* LOCK MECHANISM SECTION */

/* the lock is represented by a field in a paper status (status.json)*/
/* once a user switches to annotator mode, the doc is locked to all the other users */
function requestLock(){
	
	var url = openDoc;
	/* type of action: release/request */
	var type = "request"; 
	var ret = "";
	$.ajax({
		type: "post",
		async: false,
		url: "../php/lock.php",
		data: {url:url, type:type}, 
		success: function(result){
			
			/* 'result' is 'success' if I set the lock, else 'failure'*/
			ret = result;
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) { console.log(textStatus, errorThrown); }
		
	});
	
	return ret;
}
/* once a user switches from annotator to reader mode, the lock on the paper is released */
function releaseLock(){

	var url = openDoc;
	var type = "release";
	$.ajax({
		type: "post",
		async: true,
		url: "../php/lock.php",
		data: {url:url, type:type},
		success: function(result){
			
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) { console.log(textStatus, errorThrown); }
		
	});
}

/* when the timer expires, the lock is released.
This function is called when switching to annotator mode and called again whenever a mousedown event is detected  */
function setTimer(minutes){

	globalTimer = setTimeout(releaseLock, minutes*60*1000);
}


/*TEXT ANNOTATIONS SECTION (handling element tags) */

/* modified version (with ids) of the function available in TextHighlighter.js*/
    TextHighlighter.createWrapper = function (options) {
        var span = document.createElement('span');
        span.style.backgroundColor = options.color;
        span.className = "ann " + currentReviewer;
        span.id = idGenerator();
        return span;
    };

/* generates incremental id such as "#fragment1, #fragment2..." for annotations elements (only span)*/
function idGenerator() {
	var str = "#fragment";
	numOfComments++;
	str = str + numOfComments;
	
	return str;
}

/* preparing settings and callbacks based on the functionalities provided by TextHighlighter.js.
 * the library functions (with prototype modified) create the spans and give them an id, a timestamp and highlighted attribute, a class identifying the author */
function prepareAnnotationMode(){
	
	var colorIndex = 0;
	var docArea = document.getElementById('docarea');
	var hltr = new TextHighlighter(docArea, {
        onBeforeHighlight: function (range) {
            //console.log('Selected text: ' + range + '\nReally highlight?');
            if (inAnnotatorMode && selectExistingElement()){
            	console.log("inAnnotatoreMode e selectExistingElement()");
            	$('#annotation-modal').modal('toggle');
				/* not using the library function */
            	return false;
            }
            /* determining if a user can make a highlighted selection on the text */
            else if (inAnnotatorMode && checkSelection()){
                console.log("Valid selection");
            	$('#annotation-modal').modal('toggle');
            	return true;
            }
            else {
            	if (!inAnnotatorMode) console.log("First you must click on the switch...");
            	else console.log("Selection not valid");
            	return false;
            }
        },
        onAfterHighlight: function (range, highlights) {

        	/* update hightlighting color*/
        	colorIndex = (colorIndex + 1) % 5;
        	hltr.setColor(annotationColors[colorIndex]);

        },
        onRemoveHighlight: function (hl) {
            //return window.confirm('Are you sure you don\'t want to annotate this text anymore? "' + hl.innerText + '"');
        }
    });
	
	/* when the annotation modal is closed and no comment is submitted, modifications on text are discarded */
	

}
/* checks if the text highlighted by the user is a valid selection (follows golden rule) */
function checkSelection(){
	var html = "";
    var sel = window.getSelection();

    /* rangeCount (e.g. always 1) represents the number of selections in the page */
    if (sel.rangeCount) { 
        var container = document.createElement("div");
        for (var i = 0, len = sel.rangeCount; i < len; ++i) {
        	/**/
            container.appendChild(sel.getRangeAt(i).cloneContents()); 
        }
        /*'html' contains the selection (html tags included) and also adds the closing and opening tag, even if not selected.
         * It's empty if not compatible with the browser*/
        html = container.innerHTML;
           
        if (!goldenRule(sel)){	
	    	
	    	return false;
        }

        return true;
    }
}

/* custom function: selection of a html element with existing id (e.g. '<p>...</p>')*/
	function selectExistingElement(){
		if(window.getSelection){
			var selectionRange = window.getSelection();

			/* anchorNode is a textNode, contains only the text (and no HTML tags) of an element */
			/* a textNode parent is a HTML element */
			//console.log(selectionRange.anchorNode.parentNode);		
			var element = selectionRange.anchorNode.parentNode;
			
			/* checks if the element already has in id and if the selection contains every word in the textNode */
            var startingOffset = selectionRange.anchorOffset;
			var endingOffset = selectionRange.focusOffset;
			/* starting at index 0 */

            var selectionLength = selectionRange.toString().length;
			var totalLength = element.innerText.length;

			if (element.hasAttribute("id") && (selectionLength == totalLength)){
				
				var existingId = element.id;

				var previousClass = element.className;
				/* if previousClass contains '.ann' means I'm commenting on a text reviewed by someone else */
				if (element.classList.contains("ann"))
					element.setAttribute("class", previousClass+" "+currentReviewer);
				/* else I'm the first one commenting on an element with existing id */
				else
					element.setAttribute("class", "ann "+currentReviewer);
				
				element.style.backgroundColor = "lightgreen";
				console.log("element.id inside selectExistingElement(): ", element.id);
				$('#annotation-modal').attr("data-fragmentid", element.id);
				/* modifying DOM */
				document.getElementById(existingId).innerHTML = element.innerHTML; 				

				return true; 
			}
				
		}
		/* using library function */
		return false;
	}
				
/* checks if the locations of the starting and ending point of selection belong to text nodes which refer to the same parent element*/
function goldenRule(selection){
	/* browser compatibility should be checked */
	if (selection.anchorNode.parentNode == selection.focusNode.parentNode)
		return true;	
	else 
		return false;
}

/*SAVING ANNOTATIONS SECTION */

/* called when 'Submit' button is pressed, this function adds an unsaved annotation using a modal to retrieve id and text */
function addComment(){

	var modalContent = $('textarea#modal-text').val();
	/* emptying modal textarea for the next annotation */
	$('textarea#modal-text').val('');
	var idAnn = "";
	var annotationModal = $('#annotation-modal');
	if (annotationModal[0].hasAttribute('data-fragmentid')){
		idAnn = annotationModal.attr('data-fragmentid');
		$('#annotation-modal').removeAttr('data-fragmentid');
	}
	else idAnn = "#fragment" + numOfComments; 
	unsavedAnnotations[idAnn] = modalContent;
}

function saveReview(){

	var id = openDoc;
	var body = $("#content-body").html(); 
	var emailReviewer = "mailto:"+currentReviewer;
	var idReviewer = "review-"+currentReviewer;	
	var annotators = currentStatus['commentedby'];
	
	/* if user has not commented yet, no previous review exists on the document */
	if ((currentReviewer in annotators) && (annotators[currentReviewer] == false)){
		console.log("the user has never commented before");
		var jsonReview =  
		[
	      {
	    		"@context": "http://vitali.web.cs.unibo.it/twiki/pub/TechWeb16/context.json",
	    		"@type": "review",
	    		"@id": idReviewer,
	    		"article": {
	    			"@id": "", 
	    			"eval": {
	    				"@id": "#review1-eval",
	    				"@type": "score",
	    				"status": "", 
	    				"author": emailReviewer,
	    				"date": ""
	    			}
	    		},
	    		"comments": [] 
	    	}
		];	
		
		var reviewerName = firstName +" "+ lastName ;
		var userRole = "";
		if (isChair()) userRole = "pro:chair"; else userRole = "pro:reviewer";
		jsonReview.push(
           	{
          		"@context": "http://vitali.web.cs.unibo.it/twiki/pub/TechWeb16/context.json",
          		"@type": "person",
          		"@id": emailReviewer,
          		"name": reviewerName,
          		"as": {
          			"@id": "#role1",
          			"@type": "role",
          			"role_type": userRole,
          			"in": ""
          		}
          	}
    	);
	}
	/* user has left a comment previously, so the review should be updated */
	else {
		console.log("user has left a comment previously");
		var previousReview = $('script[id="'+currentReviewer+'"]').html();
		var jsonReview = JSON.parse(previousReview);

		
	}

	var now = new Date();
	var dateAnnotation = now.toString();
	var numAnn = Object.keys(unsavedAnnotations).length; 
	/* contains the number of comments left by the user */
	var cnum = jsonReview[0]['comments'].length;

	$.each(unsavedAnnotations, function(key, val){
		var idAnnotation = idReviewer+"-c"+cnum;
		cnum = cnum + 1;
		jsonReview[0]['comments'].push(idAnnotation);
		var refAnnotation = key;		
		var textAnnotation = unsavedAnnotations[refAnnotation];
		
		jsonReview.push(
              {
            		"@context": "http://vitali.web.cs.unibo.it/twiki/pub/TechWeb16/context.json",
            		"@type": "comment",
            		"@id": idAnnotation,
            		"text": textAnnotation,
            		"ref": refAnnotation,
            		"author": emailReviewer,
            		"date": dateAnnotation
            	}		
		);
		delete unsavedAnnotations[refAnnotation];
	});

	
	var head = JSON.stringify(jsonReview, null, "\t");
	var reviewer = currentReviewer;
	/* variable used to know how to update status.json */
	var caller = "saveReview";
	$.ajax({
		type: "post",
		async: true,
		url: "../php/save.php", 
		data: {id:id, body:body, head:head, reviewer:reviewer, caller:caller },
		success: function(result){
			setTimeout(function() {
			    window.location.reload();
			}, 10);
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) { console.log(textStatus, errorThrown); }
	});
	
}

/* unsaved annotations can by modified by clicking on a piece of selected text .
 works only for unsaved annotations, called when button update in the modal is clicked */
function modifyComment(commentId){

	var content = $('textarea#modal-comment').val();
	unsavedAnnotations[commentId] = content;
}

/* only for unsaved annotations, it is called pressing on button "Delete" */
function deleteComment(commentId){

	/* unrwaps a #fragment# element */
	$('#\\'+commentId).contents().unwrap();
	delete unsavedAnnotations[commentId];
	
}

/* checks if current user is chair for the conference of the open paper */
function isChair(){
	var ans = false;
	$.each(isChair, function(key, val){
		if ((key == openConf) && (val == true)){		
			ans = true;
			/* to exit $.each must return false */
			return false;
		}
	});
	return ans;
}
/* checks if logged user is a reviewer for the open paper */
function canReview(){
	var ans = false;
	$.each(isReviewer, function(key, val){
		if ((key == openDoc) && (val == true)){
			ans = true;
			return false;
		}
	});
	return ans;
}


/*checks if every article in a conference has been reviewed, in that case a chair can decide to close the event,
 * updating the relative field (i.e. status: closed/open) in events.json */
/* the function executes at docready */
function canCloseEvent(acrConf){

	var answer = true;

		var length = paperStatus.length; 
		for (var j = 0; j < length; j++){
			if ((paperStatus[j]['conf'] == acrConf) && ((paperStatus[j]['status'] == "under review") || (paperStatus[j]['status'] == "awaiting decision")))
				answer = false;
		}
	
	return answer; 

}

/* this function adds a global comment to the review, with a rating and an evaluation 'accept/reject'.
 * when 'reviewed = true' in status.json, this function cannot be used */
function finalJudgement(textAnnotation, rating, status){
	var id = openDoc;
	var body = $("#content-body").html(); 
	var emailReviewer = "mailto:"+currentReviewer;
	var idReviewer = "review-"+currentReviewer;
	var annotators = currentStatus['commentedby'];

	/* if the user has already commented, I can take the previousReview */
	if ((currentReviewer in annotators) && (annotators[currentReviewer] == false)){
		
		console.log("the user is trying to decide and has never commented before");
		var jsonReview =  
		[
	      {
	    		"@context": "http://vitali.web.cs.unibo.it/twiki/pub/TechWeb16/context.json",
	    		"@type": "review",
	    		"@id": idReviewer,
	    		"article": {
	    			"@id": "", 
	    			"eval": {
	    				"@id": "#review1-eval",
	    				"@type": "score",
	    				"status": "", 
	    				"author": emailReviewer,
	    				"date": ""
	    			}
	    		},
	    		"comments": [] 
	    	}
		];	
		
		var reviewerName = firstName +" "+ lastName ;
		var userRole = "";
		if (isChair()) userRole = "pro:chair"; else userRole = "pro:reviewer";
		jsonReview.push(
           	{
          		"@context": "http://vitali.web.cs.unibo.it/twiki/pub/TechWeb16/context.json",
          		"@type": "person",
          		"@id": emailReviewer,
          		"name": reviewerName,
          		"as": {
          			"@id": "#role1",
          			"@type": "role",
          			"role_type": userRole,
          			"in": ""
          		}
          	}
    	);
		
	}
	/* the user has left a comment previously */
	else {
		console.log('final judgement left updating the existing review');
		var previousReview = $('script[id="'+currentReviewer+'"]').html();
		var jsonReview = JSON.parse(previousReview);
	}
	var now = new Date();
	var dateAnnotation = now.toString();
	
	var decidedStatus = "";
	if (status == "review-reject") decidedStatus = "pso:rejected-for-publication";
	else if (status == "review-accept") decidedStatus = "pso:accepted-for-publication";
	jsonReview[0]['article']['eval']['status'] = decidedStatus;
	jsonReview[0]['article']['eval']['date'] = dateAnnotation;
	jsonReview[0]['comments'].push("#global");
	jsonReview[0]['comments'].push("#rating");
	jsonReview.push(
              {
            		"@context": "http://vitali.web.cs.unibo.it/twiki/pub/TechWeb16/context.json",
            		"@type": "comment",
            		"@id": "#global",
            		"text": textAnnotation,
            		"author": emailReviewer,
            		"date": dateAnnotation
            	}		
		);
	
	jsonReview.push(
            {
        		"@context": "http://vitali.web.cs.unibo.it/twiki/pub/TechWeb16/context.json",
        		"@type": "comment",
        		"@id": "#rating",
        		"text": rating,
        		"author": emailReviewer,
        		"date": dateAnnotation
        	});	
	
	/* contains the updated review */
	var head = JSON.stringify(jsonReview, null, "\t");
	var reviewer = currentReviewer;
	var caller = "finalJudgement";
	$.ajax({
		type: "post",
		async: true,
		url: "../php/save.php",
		data: {id:id, body:body, head:head, reviewer:reviewer, caller:caller},
		success: function(result){
			
			var alert = '<div class="alert alert-success"><strong>Success!</strong> You\'ve just submitted your evaluation. Wait for the page to refresh.</div>';
			$('#myNavbar').append('<div id="success"></div>');
			$('#success').append(alert);
			
			setTimeout(function(){
				$('#success').fadeOut('slow', function(){
					$('#success').remove();
				});
			}, 3000);
			setTimeout(function() {
			    window.location.reload();
			}, 4000);
			
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) { console.log(textStatus, errorThrown); }
	});
}

function chairDecision(stateOfArticle){
	
	var id = openDoc;
	var body = $("#content-body").html(); 		
	var status = currentStatus['status'];
	
	if (status == "awaiting decision"){

		var emailChair = "mailto:"+currentReviewer;
		var decisionId = "decision-"+currentReviewer;
		var now = new Date();
		var dateAnnotation = now.toString();

		var jsonDecision =  
		[
			{
				"@context": "http://vitali.web.cs.unibo.it/twiki/pub/TechWeb16/context.json",
				"@type": "decision",
				"@id": decisionId,
				"article": {
					"@id": "",
					"eval": {
						"@context": "easyrash.json",
						"@id": decisionId+"-eval",
						"@type": "score",
						"status": "pso:"+stateOfArticle,
						"author": emailChair,
						"date": dateAnnotation
					}
		 		}
			}

		];	
	
		var chairName = firstName +" "+ lastName ;
		var userRole = "";
		if (isChair()) userRole = "pro:chair"; else userRole = "pro:reviewer";
		jsonDecision.push(
	   	{
	  		"@context": "http://vitali.web.cs.unibo.it/twiki/pub/TechWeb16/context.json",
	  		"@type": "person",
	  		"@id": emailChair,
	  		"name": chairName,
	  		"as": {
	  			"@id": "#role1",
	  			"@type": "role",
	  			"role_type": userRole,
	  			"in": ""
	  		}
	  	}
    		);

		var head = JSON.stringify(jsonDecision, null, "\t");
		var reviewer = currentReviewer;
		var url = openDoc;

		$.ajax({
			type: "post",
			async: true,
			url: "../php/saveChair.php",
			data: {id:id, body:body, head:head, reviewer:reviewer, url:url, stateOfArticle:stateOfArticle},
			success: function(result){
				
				setTimeout(function() {
				    window.location.reload();
				}, 10);
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) { console.log(textStatus, errorThrown); }
		});	
	}

	else {
		console.log("already closed");
	}	
}


/* HANDLING RATINGS */

var data =
    {
      title: "Rating",
      description: "",
      rating: 0
    };

function buildRatingContainer(data) {
  var divItem = document.querySelector('.c-rating-item');
  
  var html = '<div class="c-rating-item__img"></div>' +
    '<div class="c-rating-item__details">' +
      '<h3 class="c-rating-item__title">' + data.title + '</h3>' +
      '<p class="c-rating-item__description">' + data.description + '</p>' +
      '<ul class="c-rating"></ul>' +
    '</div>';
  var div = document.querySelector('#star-rating');
  divItem.innerHTML = html;

  return divItem;
}

function addRatingWidget(div, data) {
    var ratingElement = div.querySelector('.c-rating');
    var currentRating = data.rating;
    var maxRating = 5;
    var callback = function(rating) { console.log(rating); data.rating = rating; };
    var r = rating(ratingElement, currentRating, maxRating, callback);
  }

/* function that fills up the close-article-table of final judgements left by the reviewers */
function setCloseArticleTable() {

	/* if the status is awaiting decision */
	if ((currentStatus['status'] == 'awaiting decision')){		
		
		var annotators = currentStatus['reviewedby'];
		var tableTh = '<tr><th>Global comment</th><th>Rating</th><th>Evaluation</th></tr>';
		
		var tableTd = "";
		/* for each reviewer that has left a final comment */
		$.each(annotators, function(key, el){
			
			/* parsing his json review to retrieve rating, global, comment and evaluation */
			var jsonReview = $('script[id="'+key+'"]').html();
			
			jsonReview = JSON.parse(jsonReview);
			
			var reviewLength = jsonReview.length;
			var rating = jsonReview[reviewLength-1]['text'];
			var globalComment = jsonReview[reviewLength-2]['text'];
			var evaluation = jsonReview[0]['article']['eval']['status'];
			/* changing 'pso:accepted-for-publication' into 'accepted' */
			evaluation = evaluation.split(":")[1];
			evaluation = evaluation.split("-")[0];
			
			tableTd = tableTd + '<tr><td>'+globalComment+'</td><td>'+rating+'</td><td>'+evaluation+'</td></tr>';

		});
		
		$('#close-article-table').append(tableTh, tableTd);
	}
}

/* AT DOCUMENT READY */

$(document).ready(
		
	function(){	
		/* patch to avoid the following trigger to activate when unwanted */
		var toggleSwitchDisabled = false;

		$('#toggle-switch').change(function() {
			
			if (toggleSwitchDisabled)
					return;
			    /* contains a reference to the checkbox in the toggle button, means I passed from off to on */  
			    if (this.checked) {
			        /* checking if user can comment */
			    	if (isChair() || canReview()){
			    		
			    		/* checking if the user has already left a final comment as a simple reviewer */
			    		/* if the user is a chair and has left a final comment he should be able to reenter the doc
			    		 * to see the reviews and make his decision */
			    		/* but if he's a chair and has already decided, he can't */

			    		if (((currentStatus['reviewedby'][currentReviewer] == true) && !(isChair())) || 
			    			((currentStatus['status'] == "accepted") || (currentStatus['status'] == "rejected") && 
			    			isChair())){

			    			var alert = '<div class="alert alert-warning"><strong>Warning!</strong> You can\'t annotate this document anymore.</div>';
						if ($(window).width() < 768)
							$('.navbar-header').append('<div id="warning"></div>');
						else
							$('#myNavbar').append('<div id="warning"></div>');				
						$('#warning').append(alert);

						setTimeout(function(){
							$('#warning').fadeOut('slow', function(){
								$('#warning').remove();
							});
						}, 3000);
							
			    			console.log("you've already left a final judgement, you can't comment anymore, or, f you\'re a chair, you already made your decision ");
			    			toggleSwitchDisabled = true;
							setTimeout(function() {toggleSwitchDisabled = false;}, 3000); 
							$('#toggle-switch').bootstrapToggle('off');
							return; 
			    		}

						/* requesting lock */
						var response = requestLock();
						if (response == "success"){
							numOfComments = $('.ann').length;
							/* setting environment for reviewing */
							prepareAnnotationMode();
							inAnnotatorMode = true;				

							$('#close-button').prop('disabled', true);
							/*contains buttons save, final judgement e close article (page bottom) */
							$('#button-div').show();
							
							if (isChair() && currentStatus['status'] == "awaiting decision"){ 
								$('#close-button').prop('disabled', false);
								/* filling up the close-article-table */
								setCloseArticleTable();
							}
							/* setting timer */
							setTimer(20);
						}			
						else {
							console.log("another user has locked the article, please wait");
							
							var alert = '<div class="alert alert-warning"><strong>Warning!</strong> Another user has locked the article, please wait.</div>';
							if ($(window).width() < 768)
								$('.navbar-header').append('<div id="warning"></div>');
							else
								$('#myNavbar').append('<div id="warning"></div>');				
							$('#warning').append(alert);

							setTimeout(function(){
								$('#warning').fadeOut('slow', function(){
									$('#warning').remove();
								});
							}, 3000);
							
							
							toggleSwitchDisabled = true;
							/* 3 seconds before enabling button again */
							setTimeout(function() {toggleSwitchDisabled = false;}, 3000); 
							$('#toggle-switch').bootstrapToggle('off');
						}
			    	}
			    	
			    	else {
			    		
						var alert = '<div class="alert alert-warning"><strong>Warning!</strong> You don\'t have the rights to annotate this document.</div>';

						if ($(window).width() < 768)
							$('.navbar-header').append('<div id="warning"></div>');
						else
							$('#myNavbar').append('<div id="warning"></div>');
				
						$('#warning').append(alert);
						
						setTimeout(function(){
							$('#warning').fadeOut('slow', function(){
								$('#warning').remove();
							});
						}, 3000);
						
						toggleSwitchDisabled = true;
						setTimeout(function() {toggleSwitchDisabled = false;}, 3000);
			    	 	$('#toggle-switch').bootstrapToggle('off');
			    	}
	
			    } 
			    /* means I passed from on to off, the checkbox is no longer checked */
			    else {
					inAnnotatorMode = false;
					releaseLock();
					clearTimeout(globalTimer);
					$('#save-button').prop('disabled', true);
					$('#button-div').hide();
					$('#warning').remove();
			    }
			    toggleSwitchDisabled = false;   
		});
		
		/* event attached to the Submit button in annotation modal */
		$('#add-ann').on('click', function(){
			addComment();
			/* so that a user can save only if has left a comment (still unsaved) */
			$('#save-button').prop('disabled', false);
		});
		
		/* saving from unsaved annotations modal */
		$('#saveAnn-button').on('click', function() {
			saveReview();
		})
		
		$('#judgement-button').on('click', function(){
			$('#judgement-modal').modal("show");
			addRatingWidget(buildRatingContainer(data), data);
			
		});
		/* when a user clicks on the close-the-article button */
		$('#close-button').on('click', function(){
			$('#chair-modal').modal("show");
		});
		
		/* button 'Accept' from chair modal*/
		$('#acceptArticle').on('click', function(){
			var newState = "accepted";
			chairDecision(newState);
		});

		$('#rejectArticle').on('click', function(){
			var newState = "rejected";
			chairDecision(newState);
		});
		/*only if unsaved*/
		$('#update-comment-btn').on('click', function(){
			var id = $(this).attr("data-annid");
			modifyComment(id);
		});
		/*only if unsaved*/
		$('#delete-comment-btn').on('click', function(){
			var id = $(this).attr("data-annid");
			deleteComment(id);
		});
		
		$('.fg-buttons').on('click', function(){
			var globalComment = $('#fg-modal-text').val();
			var starRating = data.rating;
			/* can be review-reject or review-accept */
			var status = $(this).val(); 
			finalJudgement(globalComment, starRating, status);
		});
		
		$('#close-modal').on('click', function(){

			$('textarea#modal-text').val('');	
			var annotationModal = $('#annotation-modal');

			if (annotationModal[0].hasAttribute('data-fragmentid')){
	
				var id = annotationModal[0].getAttribute('data-fragmentid');
				document.getElementById(id).setAttribute("style", "background-color: yellow");

				var classAttr = (document.getElementById(id).getAttribute("class"));
				classAttr = classAttr.replace(currentReviewer, "");

				if (classAttr == "ann") {
					document.getElementById(id).removeAttribute("class");
					document.getElementById(id).removeAttribute("data-timestamp");
					document.getElementById(id).removeAttribute("style");
					document.getElementById(id).removeAttribute("data-highlighted");
					document.getElementById(id).removeAttribute("id");
					numOfComments--;
				}
				else{ 
					document.getElementById(id).className = classAttr;
				}
			}
			else {
			
				document.getElementById('#fragment'+numOfComments).removeAttribute("class");
				document.getElementById('#fragment'+numOfComments).removeAttribute("data-timestamp");
				document.getElementById('#fragment'+numOfComments).removeAttribute("style");
				document.getElementById('#fragment'+numOfComments).removeAttribute("data-highlighted");
				document.getElementById('#fragment'+numOfComments).removeAttribute("id");
				$('#\\#fragment'+numOfComments).contents().unwrap();
				numOfComments--;
			}
		});
		
		/* event used to detect if the user has been inactive for a long time (i.e. 20 minutes) */
		$(document).mousedown(function(event){
		    clearTimeout(globalTimer);
			setTimer(20);
		}); 
		
		window.onbeforeunload = function() {
			inAnnotatorMode = false;
			releaseLock();
			$('#button-div').hide();
			clearTimeout(globalTimer);
			$('#warning').remove();
		}
		

});
