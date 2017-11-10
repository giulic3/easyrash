<?php
    if ($_GET["argument"]=='logout'){
        if(session_id() == '') {
            session_start();
        }
        session_unset();
        session_destroy();

        $link = "../index.html";  
        
        echo $link; 
    }
?>

