var isChair = {};
var isReviewer = {};
/* current logged user (as email)*/
var currentReviewer = "";
var firstName = "";
var lastName = "";
var creationDate = ""; /*user since...*/

/* default colors used */
var annotationColors = ["yellow","orange","lightblue","lightgreen","pink"];
/* unsavedAnnotations[idfragment]*/
var unsavedAnnotations = {};
/* number of comments on the open document, it is initialized whenever a doc is opened */
var numOfComments = 0; 
var inAnnotatorMode = false;
/* iife to obtain current logged user */
(function(){
	
	$.ajax({
		type:"get",
		async: true, 
		url: "../php/getCurrentUser.php",
		dataType: "json",
		success: function(data){
			currentReviewer = data[0];
			firstName = data[1];
			lastName = data[2];
			creationDate = data[3];
			
			console.log("logged user:",currentReviewer, firstName, lastName, creationDate);
			fillUserPanel();
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			console.log(textStatus, errorThrown);
		}
	});
		

}()
);

/*open doc url */
var openDoc = "";
/* open conference acronym */
var openConf = "";
/* represents the content of status.json */
var paperStatus = {};
 /* status of the open document */
var currentStatus = {};
/* used to release lock */
var globalTimer;

