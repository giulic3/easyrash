<?php 

		if(isset($_GET['email']) && !empty($_GET['email'])){
		    
			$email = $_GET['email'];
		 } 
?>
<!DOCTYPE html>
<html>

<head>
<style>

body {
	background-color:#CDCDCD;
}


#change-submit{
    border: none;
    font-family: "Nunito", sans-serif;
    background-color: #b1dee7; /*#88BBD6;*/
    background-image: linear-gradient(to bottom,#99d3df, #99d3df);
    text-align: center;
    padding: 5px;
    border-radius: 10px;
    font-weight: 400;
	text-align: center;
	white-space: nowrap;
	vertical-align: middle;
	width: 100%;
	height: 50px;
	color: white;
}

#change:hover {
    background-image: linear-gradient(to bottom,#b1dee7, #b1dee7);
}

.panel-body {
	position: absolute;
	top: 35vh;
	left: 30vw;
	width: 40vw;
	height: 30vh;
}

form{
	border: none;
	background-color: #E9E9E9;
    font-family : "Nunito";
    font-weight: 200px;
    color: grey;
    font-size: 18px;
    padding: 20px;
    border-radius: 10px;
}

#text-div{
	position: absolute;
	top: 27vh;
	left:30vw;
}

p {
    font-family: "Nunito", sans-serif;
	text-align: center;
	color: #8C8C8C;
    font-size: 25px;
}

input{
	font-size: 18px;
	padding: 3px;
}

.form-control {
	width: 96%;
}

.form-group {
	padding-bottom: 15px;
}

fieldset{
	border: none;
}

</style>
</head>
<body>

	<div id="text-div"> <p> Insert here your new password for EasyRash </p> </div>
	<div id="cont-form" class="container">
	    <div class="row">
		<div class="col-md-4 col-md-offset-4">
		    <div class="panel panel-default"  id="login-form"  ></div>
		    <div class="panel-body">
		        <form id="change-form" accept-charset="UTF-8" role="form" name="change-form" action="./changePassword.php" method="POST">
		            <fieldset>
		                <div class="form-group">
		                    <input class="form-control" placeholder="E-mail" name="email" value=<?php echo $email;?> readonly="readonly">
		                </div>
		                <div class="form-group">
		                    <input class="form-control" placeholder="Password" name="password" id="pass-login" type="password" >
		                </div>
		                <!--
		               	<div class="form-group">
		                    <input class="form-control" placeholder="Confirm password" name="confirm-password" type="password" >
		                </div>
		                -->
		                <input class="btn btn-lg btn-primary btn-block" type="submit" value="Change password" id="change-submit" >
		            </fieldset>
		        </form>
		    </div>
		</div>
	    </div>
	</div>

	<script>
		$("#change-submit").click(function(){
			$("form[name='change-form']").validate({
				rules: {
					password: {
						required: true,
						minlength: 5
					}
		    		},
		    	messages: {
					password: {
						required: "Please provide a password",
						minlength: "Your password must be at least 5 characters long"
					}
		      	},
		  	});
		});
	</script>

		<!-- jQuery -->
    	<script src="js/jquery.js"></script>
    	<script src="js/jquery.validate.js"></script>
    	<!-- Bootstrap Core JavaScript -->
    	<script src="js/bootstrap.min.js"></script>

</body>

</html>
