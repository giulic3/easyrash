/* For Desktop and large screens*/
	if ( $(window).width() > 979) {      
		$('#menu-toggle'). on('click', function(){
	    		if (($('#wrapper').attr('class'))===('toggled')){
	    			$('#page-content-wrapper').css('left', '0px');
	 		  	$('#page-content-wrapper').css('width', '100vw');
				$('#sidebar-wrapper').css('width', '0vw');
				$('#sidedoc').css('width', '0vh');
				$('#wrapper').css('padding-left','0vh');
				$('ul#events-list > li').css('width','0vh');
			}
			else {
				//$('#page-content-wrapper').css('left', '30vw');	
	 		  	$('#page-content-wrapper').css('width', '70vw');
				$('#sidebar-wrapper').css('width', '30vw');
				$('#sidedoc').css('width', '30vw');
				$('#wrapper').css('padding-left','30vw');
				$('ul#events-list > li').css('width','30vw');
			}
		});
	} /* for tablets and laptops */
	else if ($(window).width() > 767){
	  	$('#menu-toggle'). on('click', function(){
		   	if (($('#wrapper').attr('class'))===('toggled')){
	    			$('#page-content-wrapper').css('left', '0px');
	 		  	$('#page-content-wrapper').css('width', '100vw');
				$('#sidebar-wrapper').css('width', '0vw');
				$('#sidedoc').css('width', '0vh');
				$('#wrapper').css('padding-left','0vh');
				$('ul#events-list > li').css('width','0vh');
			}
			else {
	 		  	$('#page-content-wrapper').css('width', '60vw');
				$('#sidebar-wrapper').css('width', '40vw');
				$('#sidedoc').css('width', '40vw');
				$('#wrapper').css('padding-left','40vw');
				$('ul#events-list > li').css('width','40vw');
			}
		});
	} /* for smartphones */
	else /*if ( $(window).width() > 320)*/ {     
		$("#events-list").on('click', '.papers-list li a', function() {
			$('#wrapper').attr("class", "toggled");
			$('#page-content-wrapper').css('left', '0px');
		  	$('#page-content-wrapper').css('width', '100vw');
		  	$('#sidebar-wrapper').css('width', '0vw');
			$('#sidedoc').css('width', '0vw');
			$('#wrapper').css('padding-left','0vw');
			$('ul#events-list > li').css('width','0vw');
		});
		$('#menu-toggle'). on('click', function(){
		    	if (($('#wrapper').attr('class'))===('')){
		    		$('#page-content-wrapper').css('left', '0px');
	 		  	$('#page-content-wrapper').css('width', '0vw');
	 		  	$('#sidebar-wrapper').css('width', '100vw');
				$('#sidedoc').css('width', '100vw');
				$('#wrapper').css('padding-left','100vw');
				$('ul#events-list > li').css('width','100vw');
			}
		});
	}
