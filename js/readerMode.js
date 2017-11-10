/* load the content of the selected paper on the page */
function loadDoc(paperTitle){
	
	var title = $(paperTitle).text();

	$.ajax({
		type:"get",
		async: true,
		url: "../php/load.php",
		data: {title:title},
		dataType: "html",
		error: function(XMLHttpRequest, textStatus, errorThrown) { console.log(textStatus, errorThrown); },
		success: function(result){
				
				$('#switch-mode').attr("style", "display:block");
				
				var startTitle = result.indexOf('<title'); 
				var endTitle = result.indexOf('</title>'); 
				var endTitleTag = result.indexOf(">", startTitle);
				var countTitle = result.substring(endTitleTag + 1, endTitle );
				
				countTitle = "<h1 id=\"div-title\"class='title'>" + countTitle + "</h1>";
				
				var startBody = result.indexOf('<body>'); startBody += 6;
				var endBody = result.indexOf('</body>');
				var countBody = result.substring(startBody,endBody);

				countBody = countBody.replace( new RegExp("img/", "gi"), "../project-files/dataset/img/" );

				/*resetting to return to original head */
				$('head [class!="maintag"]').remove();
				
				var startHead = result.indexOf('<head>'); startHead += 6; 
				var endHead = result.indexOf('</head>');
				var countHead = result.substring(startHead, endHead);
			
				countHead = countHead.replace("css/rash.css", "../project-files/dataset/css/rash.css ");
				countHead = countHead.replace("js/rash.js", "../project-files/dataset/js/customrash.js ");	
				
				/* these are not needed */
				countHead = countHead.replace("css/bootstrap.min.css", "");
				countHead = countHead.replace("js/bootstrap.min.js", "");
				countHead = countHead.replace("js/jquery.min.js", "");
		
				$('head').append(countHead);
				
				$('#docarea #doc-body').html('<div id="content-body">'+countBody+'</div>');

				var startXml = result.indexOf('<');
				var countXml = result.substring(startXml, startHead);
				countXml = countXml.replace("grammar/rash.rng", "../project-files/dataset/grammar/rash.rng");
				$('head').before(countXml);

				/* inserting the original title of the paper */
				fixTitle();
				/* preparing annotations for visualization */
				loadAnnotationsArea();
				/* setting globals */
				openDoc = $(paperTitle).attr('id');				
				/* every annotation is hidden when the doc is loaded */
				$(".ann").css("background-color", "transparent");
				
				$('#doc-header').prepend(countTitle);
				
				/* filling the global currentStatus with the status of the loaded article*/
				$.each(paperStatus, function(i, el){
					if (paperStatus[i]['url'] == openDoc){
						currentStatus = paperStatus[i];
					}
				});
			} 
		});
}

/* patch to delete the wrong title created by rash.js */
function fixTitle(){
	var trueTitle = $('#doc-body h0').text();
	$('#doc-header h1').html(trueTitle);
	$('#doc-body h0').remove();
}

/* adding names of the users that have already commented the paper (whether they completed their review or not) */
function loadAnnotationsArea(){

	$('#annlist').empty();
	var currentAnnotations = $('.ann');
	var users = [];
	
	$.each(currentAnnotations, function(index, value){
		users[index] = value.className.split(' ')[1];
	});

	var uniqueUsers = ["All"];
	$.each(users, function(i, el){
	    if($.inArray(el, uniqueUsers) === -1) uniqueUsers.push(el);
	});

	
	/* building filters button */
	 var filters = "<div class='btn-group'><button type='button' id = 'annFilter' class='btn dropdown-toggle' data-toggle='dropdown' >Filters <span class='caret'></span></button><ul class='dropdown-menu'>";

	 for (var i = 0; i < uniqueUsers.length; i++) {
		 filters += '<li><a id="button#'+uniqueUsers[i]+'" class="userfilter" href="">'+uniqueUsers[i]+'</a></li>';
	 }

	 filters += "</ul></div>";
	 $('#page-content-wrapper').append(filters); 
	
}

/* filling up the modal that appears when a user clicks on a highlighted text.  */
function modalAnnotations(text, target, date, author, fragmentId) {	
	/* visualize annotation details in human-readable format */
	$('#modal-author').text("Author: "+author);
	$('#modal-target').text("Target: "+target);
	document.getElementById("modal-comment").innerHTML = text;
	$('#modal-date').text("Date: "+date);
	
	/*checking if buttons update and delete can be pressed
	must be unsaved, user in annotator mode, and user == author, else buttons are disabled */
	
	if (unsavedAnnotations[fragmentId] != null && inAnnotatorMode && currentReviewer == author) {
		document.getElementById("delete-comment-btn").disabled = false;
		document.getElementById("update-comment-btn").disabled = false;
		$('#update-comment-btn').attr('data-annid', fragmentId);
		$('#delete-comment-btn').attr('data-annid', fragmentId);
	}
	else {
		document.getElementById("delete-comment-btn").disabled = true;
		document.getElementById("update-comment-btn").disabled = true;		
	}
}



$(document).ready(function(){

	$("#events-list").on('click', '.papers-list li a',
			function(e){
				e.preventDefault();
				
				if (inAnnotatorMode){

					var alert = '<div class="alert alert-warning"><strong>Warning!</strong> Deactivate annotator mode by clicking on the switch before leaving the document.</div>';
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
					
				}
				else {

					loadDoc(this);
					
					if (window.matchMedia('(max-width: 767px)').matches)
						$('#wrapper').attr("class", "toggled");
				}

	});
	
	$('#page-content-wrapper').on('click', '.userfilter', function(e){
		e.preventDefault();
		var clicked = $(this).text();
		$(".ann").css("background-color", "transparent");
		if (clicked === "All") 
			$(".ann").css("background-color", "yellow");
		else { /* means I chose to view only the comments left by a specific reviewer */
			var x = document.getElementsByClassName(clicked);
			var i;
			for (i = 0; i < x.length; i++) {
			    x[i].style.backgroundColor = "lightgreen";
			}
		}
	});

	/* clicking on a highlighted text, a modal displaying the relative annotation appears */
	$("#page-content-wrapper").on('click', '.ann', function() {

		var thisId = $(this).attr("id"); 
		var thisTarget = $(this).text();
		/* the second element in the array, is the reviewer email */
		var author = document.getElementById(thisId).className.split(/\s+/)[1]; 
		var date = "";
		var annotationText = "";

		/* if the annotation is unsaved I can edit it */
		if (unsavedAnnotations[thisId] != null) {
			annotationText = unsavedAnnotations[thisId];
			var date = ""; ///tanto la data che sarà salvata è quella di quando premo save
		}
		/* the annotation has already been saved and cannot be modified */
		else { 
			var review = $('script[id="'+author+'"]').html();
			review = JSON.parse(review);		
			for (var i = 0; i < review.length; i++){
				if (review[i]['ref'] == thisId){
					annotationText = review[i]['text'];
					date = review[i]['date'];
				}
			}			
		}
		/* filling the annotation-reader modal*/
		modalAnnotations(annotationText, thisTarget, date, author, thisId);
		$('#annotationReader-modal').modal("show");
	});
		

	$('#save-button').on('click', function() {	
		var tableTh = '<tr><th>Author</th><th>Target</th><th>Text</th></tr>';
		var tableElements = "";
		for (var key in unsavedAnnotations) {
			if (unsavedAnnotations.hasOwnProperty(key)) {

				var currentAnn = "";
				if ($('#\\'+key) != undefined) currentAnn = $('#\\'+key); /* case id like #fragmentnumber */
				else if ($('#'+key) != undefined) currentAnn = $('#'+key); /* case annotation with its own id */

				var currentAnnClass = currentAnn.attr('class').split(' ');
				var numOfClasses = currentAnnClass.length;
				var author = currentAnnClass[numOfClasses-1];

				tableElements = tableElements + '<tr><td>'+author+'</td><td>'+currentAnn.text()+'</td><td>'+unsavedAnnotations[key]+'</td></tr>';

			}
		}

		$('#unsaved-annotations-table').append(tableTh, tableElements);
		$('#unsaved-annotations-modal').modal('toggle');
	});
	/* Bootstrap 2.x.x compatible */
	$('#unsaved-annotations-modal').on('hidden', function () {
		$('#unsaved-annotations-table').html('');
	});
	/* Bootstrap 3.x.x compatible */
	$("#unsaved-annotations-modal").on("hidden.bs.modal", function () {
		$('#unsaved-annotations-table').html('');
	});

	$("#change-password-button").click(function(){
		$("form[name='change-password-form']").validate({
			rules: {
				password: {
					required: true,
					minlength: 5
				},
				repassword: {
					required: true,
					minlength: 5,
					equalTo: "#pass1"
	    		},
			},
	    	messages: {
				password: {
					required: "Please provide a password",
					minlength: "Your password must be at least 5 characters long"
				},
				repassword: {
					required: "Please provide a password",
					minlength: "Your password must be at least 5 characters long",
					equalTo: "Please enter the same password as above"
				}
	      	},
	  	});
	});

	$("#delete-account-button").click(function(){
		$("form[name='change-password-form']").validate({
			rules: {
				pass1: {
					required: true,
					minlength: 5
				},
				pass2: {
					required: true,
					minlength: 5,
					equalTo: "#pass1"
				}
	    	},
	    	messages: {
				pass1: {
					required: "Please provide a password",
					minlength: "Your password must be at least 5 characters long"
				},
				pass2: {
					required: "Please provide a password",
					minlength: "Your password must be at least 5 characters long",
					equalTo: "Please enter the same password as above"
				}
	      	},
	  	});
	});

	
});

