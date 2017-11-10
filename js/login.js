/* checks consistency of the values inserted in the registration form */
function validateRegistrationForm() {

	$(function() {
	  $("form[name='registration']").validate({
	    rules: {
	      firstname: {
	      	required: true
	      },
	      lastname: {
	      	required: true
	      },

	      email: {
	        required: true,
	        email: true
	      },
	      password: {
	        required: true,
	        minlength: 5
	      },
	      confirm_password: {
	    	required: true,
	    	minlength: 5,
	    	equalTo: "#pass-reg" //id of password field form
	      }
	    },
	    messages: {
	      firstname: {
	      	required: "Please insert your first name"
	      },
	      lastname: {
	      	required:"Please insert your last name"
	      },
	      password: {
	        required: "Please provide a password",
	        minlength: "Your password must be at least 5 characters long"
	      },
	      confirm_password: {
				required: "Please provide a password",
				minlength: "Your password must be at least 5 characters long",
				equalTo: "Please enter the same password as above"
	      },
	      email: "Please enter a valid email address"
	    },
	  });
	});

}


/* checks consistency of the values inserted in the login form */
function validateLoginForm() {

	/* wait for the DOM to be ready */
	$(function() {
	  /* Initialize form validation on the login form. it has the name attribute "login" */
	  $("form[name='login']").validate({
	    // Specify validation rules
	    rules: {
	      /* the key name on the left side is the name attribute of an input field. Validation rules are defined on the right side */
	      email: {
	        required: true,
	        email: true
	      },
	      password: {
	        required: true,
	        minlength: 5
	      }
	    },
	    /* specify validation error messages */
	    messages: {
	      password: {
	        required: "Please provide a password",
	        minlength: "Your password must be at least 5 characters long"
	      },
	      email: "Please enter a valid email address"
	    },

	  });
	});

}

function changeVisibleForm(){
	if (loginVisible) {
		$("#login-form + .panel-body").hide();
		$("#reg-form + .panel-body").show();
		loginVisible = false;
	}
	else {
		$("#login-form + .panel-body").show();
		$("#reg-form + .panel-body").hide();
		loginVisible = true;
	}
}
$(document).ready(

	function(){
		
		document.getElementById("log-form").reset();
		document.getElementById("registration-form").reset();
	/* used to determine behaviour of current visible form */
	loginVisible = true;

		$(".show").click(function(){

			changeVisibleForm();
		});


		$("#login-submit").click(function(){

			validateLoginForm();
			//submitLogin();
		})

		$("#reg-submit").click(function(){

			validateRegistrationForm();
		})
	}
);

