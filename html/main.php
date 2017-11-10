<?php

session_start();

function debug_to_console($data) {
	if(is_array($data) || is_object($data))
	{
		echo("<script>console.log('PHP: ".json_encode($data)."');</script>");
	} else {
		echo("<script>console.log('PHP: ".$data."');</script>");
	}
}

debug_to_console($_SESSION['email']);

if (!isset($_SESSION['email']))
{
	header("Location: ../index.html");
	die();
}
?>

<!DOCTYPE html>
<html>
<head>
	<meta class="maintag" charset="utf-8">
	<meta class="maintag" http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title class="maintag">EasyRASH</title>
	<!-- Bootstrap Core CSS -->
	<link class="maintag" href="../css/bootstrap.min.css" rel="stylesheet">
	<link class="maintag" href="../css/bootstrap-toggle.min.css" rel="stylesheet">
	<!-- Custom CSS -->
	<link class="maintag" href="../css/scrolling-nav.css" rel="stylesheet">
  	<link class="maintag" rel="stylesheet" href="../five-star-rating-master/css/font-awesome.min.css">
  	<link class="maintag" rel="stylesheet" href="../five-star-rating-master/css/style.min.css">
  	<link class="maintag" rel="stylesheet" href="../five-star-rating-master/css/rating.min.css">


	<!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
	<!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
	<!--[if lt IE 9]>
	<script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
	<script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
	<![endif]-->

	<!-- including DATASET files -->
	<link class="maintag" rel="stylesheet" href="../project-files/dataset/css/bootstrap.min.css">
	<script class="maintag" src="../project-files/dataset/js/jquery.min.js"></script>
	<script class="maintag" src="../project-files/dataset/js/bootstrap.min.js"></script>
	<script class="maintag" src="../js/bootstrap-toggle.min.js"></script>
		 
	<!--including personal CSS file-->

	<link class="maintag" rel="stylesheet" href="../css/simple-sidebar.css">
	<link class="maintag" rel="stylesheet" href="../css/main.css">

</head>

   
<body>

	<!-- Navigation -->
	<nav class="navbar navbar-default navbar-fixed-top" role="navigation">
		<div class="container">
			<div class="navbar-header">
				<a class="navbar-brand page-scroll" href="#page-top">easyrash</a>
				<button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
				<span class="icon-bar"></span>
				<span class="icon-bar"></span>
				<span class="icon-bar"></span>                        
				</button>
			</div>
			<div class="collapse navbar-collapse" id="myNavbar">
				<ul class="nav navbar-nav navbar-right">
					<li id="switch-mode"><a><input id="toggle-switch" data-toggle="toggle" data-on="Annotator" data-off="Reader" data-width="100" type="checkbox"></a></li>
					<li><a href="#" id="logout">Logout</a></li>
					<li class="dropdown"><a href="#" id="user-panel" class="dropdown-toggle" data-toggle="dropdown">User <b class="caret"></b></a>
					<ul class="dropdown-menu">
				    		<div>
							<h4 class="glyphicon glyphicon-user"></h4><br>
							<h4><span id="user-panel-firstname"></span> 
							<span id="user-panel-lastname"></span></h4>
							<p>
					    			<i class="glyphicon glyphicon-envelope"></i><span id="user-panel-email"></span><br>
					    			<i class="glyphicon glyphicon-calendar"></i><br>User since <br><span id="user-panel-date"></span>
							</p>
						      	<li><a id="user-panel-change-password" href="#">Change password</a></li>
						      	<li><a id="user-panel-delete-account" href="#">Delete account</a></li>
				    		</div>
					</ul>
					<li class="dropdown"><a href="#" id="about" class="dropdown-toggle" data-toggle="dropdown">About <b class="caret"></b></a>
					<ul class="dropdown-menu">
				    		<li style="text-align: center;"><i>Developed by</i></li>
							<li style="text-align: center;">laura.bugo@studio.unibo.it</li>
							<li style="text-align: center;">giulia.cantini2@studio.unibo.it</li>
							<li style="text-align: center;">antonella.eustazio@studio.unibo.it</li>
	
					</ul>
					<li><a href="./help.html" id="help">Help</a></li>
				</ul>
			</div>
		</div>
	</nav>


    <div id="wrapper">

        <!-- Sidebar -->
        <div id="sidebar-wrapper">
        	<div id="sidedoc">
           		<ul id="events-list" class="sidebar-nav">
           			<!-- <li id="IWCC 2016">
           					<a class="conf" href="#">International Web Comics Conference 2016</>
           					<ul class="papers-list">
           						<li>
           							<a id="wade-savesd2016.html" class="paper" href=""></a>
           						</li>
           						<li></li>
           						<li></li>
           						<li></li>
           						<li></li>
           					</ul>
           				</li> 
           				 <li id="IGBC 2016"> ... </li>-->
           		</ul>	
           	
           	</div>
        </div>
        <!-- /#sidebar-wrapper -->
	

        <!-- Page Content -->
        <div id="page-content-wrapper">
                    <div class="container-fluid">
            	<a id="menu-toggle">
  					<span class="glyphicon glyphicon-list"></span>
  				</a>
	                <div class="row">
	                    <div class="col-lg-12 col-sm-12 col-xs-12" id="docarea">
	                    		<div id="doc-header" class="page-header container cgen">
	                    		</div>
	                    		<div id="doc-body">
			                        <h3>How EasyRASH works </h3>
			                        <p>Available events are listed in the sidebar on the left.</p>
			                        <p>Click one of the titles to see the relative submitted papers and their contents.</p>
			                        <p>Start reviewing.</p>
			                       	<p>For further explanation click on the button below.</p>
			                       	
    								<button id ="button-tutorial" type="button" onclick="location.href='./help.html';">Go to tutorial</button>
									
		                        </div>
	                    </div>                    
	                </div>
            </div>
		<div id="button-div">
		    	<div id="annotator-div">
		      		<button id="save-button" type="button" class="btn" disabled>Save <span class="glyphicon glyphicon-floppy-disk"></span></button>
	    	      		<button id="judgement-button" type="button" class="btn">Final judgement <span class="glyphicon glyphicon-send"></span></button>
	  	    	</div>
			<div id="chair-div">
				<button id="close-button" type="button" class="btn" disabled>Close the article <span class="glyphicon glyphicon-education"></span></button>
			</div>
		</div>
        </div>
        <!-- /#page-content-wrapper -->
    </div>
    <!-- /#wrapper -->
    
    
    		
	<!-- ANNOTATION MODAL START -->
	<!-- Modal -->
	<div id="annotation-modal" class="modal fade" role="dialog">
		<div class="modal-dialog">
	    	<!-- Modal content-->
	  		<div class="modal-content">
	      		<div class="modal-header">
	        		<h4 class="modal-title">Annotation</h4>
	      		</div>
			    <div class="modal-body">
			    	<p>Insert here your comment:</p>
			    	<form>
			    		<textarea id="modal-text"rows="6" cols="20" style="min-width: 100%"></textarea>
			    	</form>
			    </div>
			    <div class="modal-footer">
			    	<button id="add-ann" type="button" class="btn btn-default" data-dismiss="modal">Submit</button>
			        <button id="close-modal" type="button" class="btn btn-default" data-dismiss="modal">Close</button>
			    </div>
	 		</div>
	   	</div>
	</div>
	<!-- ANNOTATION MODAL END -->
	
	<!--  FINAL JUDGEMENT MODAL -->
	<div id = "judgement-modal" class="modal fade">
  		<div class="modal-dialog" role="document">
    		<div class="modal-content">
      			<div class="modal-header">
        			<button type="button" class="close" data-dismiss="modal" aria-label="Close">
          				<span aria-hidden="true">&times;</span>
        			</button>
        			<h4 class="modal-title">Final Judgement Modal</h4>
      			</div>
      			<div class="modal-body">
      				<form>
      					<p>Insert your valutation:</p>
      					<textarea id="fg-modal-text"rows="6" cols="20" style="min-width: 100%"></textarea>
      					<div id="star-rating">
      						<div class="c-rating-item">
      						<!-- 
	      						<div class="c-rating-item__img"></div>
	    						<div class="c-rating-item__details">
		      						<h3 class="c-rating-item__title"></h3>
		      						<p class="c-rating-item__description"></p>
		      						<ul class="c-rating"></ul>
	      						</div>
	      					-->
      						</div>
      						
      					</div>
      				</form>
      			</div>
      			<div class="modal-footer">
      				<button class="fg-buttons" type="button" class="btn btn-primary" value="review-accept" data-dismiss="modal">Accept</button>
        			<button class="fg-buttons" type="button" class="btn btn-secondary" value="review-reject" data-dismiss="modal">Reject</button>
      			</div>
    		</div><!-- /.modal-content -->
  		</div><!-- /.modal-dialog -->
	</div><!-- /.modal -->

	<!-- CLOSE THE ARTICLE MODAL -->
	<div id = "chair-modal" class="modal fade">
  		<div class="modal-dialog" role="document">
    		<div class="modal-content">
      			<div class="modal-header">
        			<button type="button" class="close" data-dismiss="modal" aria-label="Close">
          				<span aria-hidden="true">&times;</span>
        			</button>
        			<h4 class="modal-title">Close the article</h4>
      			</div>
      			<div class="modal-body">
      				<table id="close-article-table">
      				</table>
      			</div>
      			<div id=modal-body-close class="modal-body">
      				<button id="acceptArticle" type="button" class="btn" >Accept</button>
        			<button id="rejectArticle" type="button" class="btn" data-dismiss="modal">Reject</button>
      			</div>
    		</div><!-- /.modal-content -->
  		</div><!-- /.modal-dialog -->
	</div><!-- /.modal -->
	
    <!--  ANNOTATION-READER MODAL -->
    <div id = "annotationReader-modal" class="modal fade">
      	<div class="modal-dialog" role="document">
        	<div class="modal-content">
          		<div class="modal-header">
            		<button type="button" class="close" data-dismiss="modal" aria-label="Close">
              			<span aria-hidden="true">&times;</span>
            		</button>

    			<div id="modal-header-title">Annotation details</div>
          		</div>
          		<div id="modal-body-reader" class="modal-body">

          		<form>
          				<p id="modal-author">Author: </p>
          				<p id="modal-target">Target: </p>
      					<textarea id="modal-comment"rows="6" cols="20" style="min-width: 100%"> </textarea>
      					<p id="modal-date">Date: </p>
      			</form>
                
                  <button id="update-comment-btn" type="button" class="btn" data-dismiss="modal">Update</button>
                  <button id="delete-comment-btn" type="button" class="btn" data-dismiss="modal">Delete</button>
                
          		</div>
        	</div><!-- /.modal-content -->
      	</div><!-- /.modal-dialog -->
    </div><!-- /.modal -->


	<!-- CHANGE PASSWORD MODAL -->
	<div id="change-password-modal" class="modal fade" role="dialog">
		<div class="modal-dialog">
	  		<div class="modal-content">
	      		<div class="modal-header">
	        		<button type="button" class="close" data-dismiss="modal">&times;</button>
	        		<h4 class="modal-title">Set a new password</h4>
	      		</div>
			    <div class="modal-body">
					<form action="../php/changePassword.php" method="POST" name="change-password-form"> <!--da dove prendere l'email?-->
						<div class="form-group"><input id="pass1" class="form-control" placeholder="Password" name="password" type="password" value=""></div>
					    	<div class="form-group"><input class="form-control" placeholder="Repeat Password" name="repassword" type="password" value=""></div>
					    	<input class="btn btn-lg btn-primary btn-block" type="submit" value="Change password" id="change-password-button"> 
					</form>
			    </div>
			    <div class="modal-footer">
			    </div>
	 		</div>
	   	</div>
	</div>

	<!-- DELETE ACCOUNT MODAL -->
	<div id="delete-account-modal" class="modal fade" role="dialog">
		<div class="modal-dialog">
	  		<div class="modal-content">
	      		<div class="modal-header">
	        		<button type="button" class="close" data-dismiss="modal">&times;</button>
	        		<h4 class="modal-title">Delete your account</h4>
	      		</div>
			    <div class="modal-body">
					<form action="../php/deleteAccount.php" method="POST">
						<div class="form-group"><input class="form-control" placeholder="Your password" name="pass1" type="password" value=""></div>
					    <div class="form-group"><input class="form-control" placeholder="Confirm your password" name="pass2" type="password" value=""></div>
					    <input class="btn btn-lg btn-primary btn-block" type="submit" value="Delete account" id="delete-account-button"> 
					</form>
			    </div>
			    <div class="modal-footer">
			    </div>
	 		</div>
	   	</div>
	</div>
	
	<!-- DISPLAY UNSAVED ANNOTATIONS MODAL -->
	<div id="unsaved-annotations-modal" class="modal fade" role="dialog">
		<div class="modal-dialog">
	  		<div class="modal-content">
	      		<div class="modal-header">
	        		<button type="button" class="close" data-dismiss="modal">&times;</button>
	        		<h4 class="modal-title">Your unsaved annotations</h4>
	      		</div>
			    <div class="modal-body">
				<table id="unsaved-annotations-table">
				</table>
			    </div>
			    <div class="modal-footer">
					<button id="saveAnn-button" type="button" class="btn btn-primary" >Save</button>
					<button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
			    </div>
	 		</div>
	   	</div>
	</div>
	
	<script type="text/javascript" src="../js/TextHighlighter.min.js"></script>
	<script src="../five-star-rating-master/js/dist/rating.min.js"></script>

	<script src="../js/globals.js"></script><?php 

		if(isset($_GET['email']) && !empty($_GET['email'])){
		    // Verify data
			$email = $_GET['email'];
		 } 
?>
<!DOCTYPE html>
	
	<script src="../js/init.js"></script>
	<script src="../js/responsivePresentation.js"></script>
	<script src="../js/navbarButtons.js"></script>
	<script src="../js/readerMode.js"></script>
	<script src="../js/annotatorMode.js"></script>
	


</body>
</html>
