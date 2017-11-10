/*******
This module provides all the functionalities to prepare the site main page to be ready for use.
********/

/* setting permissions on each conference and document according to the user identity */
function displayPermissions(){
	
	$.ajax({
		type: "get",
		url: "../php/setPermissions.php",
		dataType: 'json', 
		success: function(result){

			/* filling globals */
			for (var k in result[0]) isChair[k] = result[0][k];
			for (var k in result[1]) isReviewer[k] = result[1][k];	

			console.log("isChair: ", isChair);
			console.log("isReviewer: ", isReviewer);

		},
		error: function(XMLHttpRequest, textStatus, errorThrown){
			console.log(textStatus, errorThrown);
		}
	});
}

/* filling the paperStatus global variable*/
function setPaperStatus(){
	$.getJSON( "../js/status.json", function( data ){
		paperStatus = data;

	});
}
	

/* displaying glyphicons in the sidebar */
function addGlyphiconsChair(){

	$('#events-list > li').each(function( index ) {
		var acrConf = $(this).attr('id');
  		if (isChair[acrConf]) {
  			
  			$(this).append('<span class="glyphicon glyphicon-king" aria-hidden="true"></span>');
  		}
  		/* when every article has been closed */
  		if (canCloseEvent(acrConf)) {
  			
  			$(this).append('<a class="close-conference" style="display:inline"><span class="glyphicon glyphicon-send" aria-hidden="true"></span></a>');
  		}
  		else console.log("the conf can't be closed ",acrConf);

	});
}


/* displays articles relative to the clicked event (as <a> element)*/
function displayPapers(event){

	if (!($(event).data('clicked'))) {
			$.getJSON("../project-files/events.json", function(data){

				$.each( data, function( key, val ) {

					var eventId = $(event).parent().attr('id');

					if (eventId == val.acronym){
						var id = val.acronym;
						/* updating global */
						openConf = id;
						/* creating a list of papers for each conference */
						var papers = $('<ul/>');
						var sub = val.submissions;
						/* checking paperStatus according to event acronym */	
						/* maybe use lookup table (acronym -> number) */	
						var j = 0;	
						if (openConf == "IGBC 2016") j = 5; 
						else if (openConf == "IWCC 2016") j = 0;
						
						for (var i = j, k = 0; k < sub.length; i++, k++){
							
							var item = "<li><a href='' class='paper' id='"+sub[k].url+"'>" + sub[k].title + "</a>";																				
							/*setting reviewer glyphicon, pencil for 'has to review', tick for 'has reviewed'*/
							if ((isReviewer[sub[k].url]) || (isChair[openConf])) {
								/* the user already gave his final judgement */
								if (paperStatus[i]['reviewedby'][currentReviewer] == true)
									item = item + '<span class="glyphicon glyphicon-ok" aria-hidden="true"></span>';
								else 
									item = item + '<span class="glyphicon glyphicon-pencil" aria-hidden="true"></span>';
							}

							if (isChair[openConf] && (paperStatus[i]['status'] == 'awaiting decision'))
								item = item + '<span class="glyphicon glyphicon-education" aria-hidden="true"></span>';
							else if (isChair[openConf] && (paperStatus[i]['status'] == 'accepted')){
								item = item + '<span class="glyphicon glyphicon-thumbs-up" aria-hidden="true"</span>';

							}
							else if (isChair[openConf] && (paperStatus[i]['status'] == 'rejected'))
								item = item + '<span class="glyphicon glyphicon-thumbs-down" aria-hidden="true"</span>';
							
							item = item + "</li>";
							papers.append(item);
						}

						/* selecting the right list item */
						var parentLi = $(event).parent();
						$(parentLi).append(papers);
						papers.attr('class', 'papers-list');
					}
		  		});	

		  		$(this).data("clicked", true);
			});
	}

 	else {

 		/* if the element has already been clicked, avoid a second ajax call */
 		$(event).siblings('ul').slideToggle();
 	}
	

}

/* display all the available events (closed one are excluded) in a list on the sidebar */
function displayEvents(){

	$.getJSON("../project-files/events.json", function(data) {

		var items = [];
 		$.each( data, function( key, val ) {
 			if (val.status == 'open')
 				items.push( "<li id='" + val.acronym + "'><a href='#' class='conf'>" + val['conference'] + "</a></li>" );
 		});
 		
	 	var length = items.length;
	 	for (var i = 0; i < length; i++)
	  		$("#events-list").append(items[i]);
	 	
	 	setTimeout(addGlyphiconsChair, 100);
	});		
}


function closeEvent(acronym){
	$.ajax ({
		url: '../php/closeEvent.php', 
		type: 'post',
		async: 'true',
		data: {acronym:acronym},
		success: function() {

			/* displaying a success message on the navbar */
			var alert = '<div class="alert alert-success"><strong>Success!</strong> You\'v just submitted the accepted papers to the publishing house.</div>';
			$('#myNavbar').append('<div id="success"></div>');
			$('#success').append(alert);
			
			setTimeout(function(){
				$('#success').fadeOut('slow', function(){
					$('#success').remove();
				});
			}, 3000);
			setTimeout(function() {
			    window.location.reload();
			}, 3010);		
			
			$('#close-conference-modal').modal('toggle').remove();
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) { console.log(textStatus, errorThrown); }	
	});
}


$(document).ready(
	function(event){

		setPaperStatus();
		displayEvents();
		displayPermissions();
	
		var confName;
		
		/* if any of the conf link is clicked */
		$("#events-list").on('click', 'li > a[class=conf]', function(e) {
	        e.preventDefault();
			confName = $(this).parent().attr('id');
			console.log(confName);
   			displayPapers(this);
   			/* to avoid multiple getJSON()*/
   			$(this).data('clicked', true);
		});

	/* handling toggle button */
	$("#menu-toggle").click(function(e) {
	    e.preventDefault();
	    $("#wrapper").toggleClass("toggled");
	});

	/* before refreshing the page */
	window.unbeforeunload = function() {
		inAnnotatorMode = false;
		releaseLock();
		$('#annotator-div').hide();
		$('#chair-div').hide();
		clearTimeout(globalTimer);
	}

	/* when a Chair clicks on "close conference" button */
	$("#events-list").on('click', '.close-conference', function(e){
		console.log('glyphicon send conference pressed');
		e.preventDefault();
		var acronym = $(this).parent().attr('id');
		var closeConferenceModal = '\
		<div id="close-conference-modal" class="modal fade" role="dialog">\
		<div class="modal-dialog">\
	  		<div class="modal-content">\
	      		<div class="modal-header">\
	        		<button type="button" class="close" data-dismiss="modal">&times;</button>\
	        		<h4 class="modal-title">Close conference</h4>\
	      		</div>\
			    <div class="modal-body">\
					<form>\
						<div><p>Are you sure you want to close this event?</p>\
							<p>If you confirm, all the papers accepted for publication\
								will be submitted to the publishing house and they won\' t be available for further reading or reviewing.</p>\
								<p>Confirm?</p></div>\
					    <button class="btn btn-lg btn-primary btn-block" type="button" value="Close event" id="confirmation-close-button" data-acronym ="'+acronym+'"> \
					    Close event</button></form>\
			    </div>\
			    <div class="modal-footer">\
			    </div>\
	 		</div>\
	   	</div>\
		</div>';
		
		$('body').append(closeConferenceModal);
		$('#close-conference-modal').modal('toggle');
	});
	
	$('body').on('click', '#confirmation-close-button', function(){
		closeEvent($(this).attr('data-acronym'));
			
	});

});



