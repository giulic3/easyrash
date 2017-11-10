/* HANDLING LOGOUT, USER, ABOUT AND HELP BUTTONS */

function logout(){

        $.ajax({
        url: '../php/logout.php?argument=logout',
        async: true,
        success: function(data){
            window.location.href = data;
        }
    });
}

function fillUserPanel(){
  
    /* retrieves user info from globals and show them in the user panel */
	$('#user-panel-firstname').text(firstName);
	$('#user-panel-lastname').text(" "+lastName);
	$('#user-panel-email').text(currentReviewer);
	creationDate = creationDate.split(" ")[0];
	$('#user-panel-date').text(creationDate);
}

$(document).ready(
	function(){
		
		$("#logout").on('click', function(){
			logout();
		});

		$('#user-panel-change-password').on('click', function(){
			$('#change-password-modal form').find('input[type="text"], input[type="password"]').val("");
			$('#change-password-modal').modal('show');	
		});
		
		$('#user-panel-delete-account').on('click', function(){
			$('#delete-account-modal form').find('input[type="text"], input[type="password"]').val("");
			$('#delete-account-modal').modal('show');
		});
		
		

	}
);


