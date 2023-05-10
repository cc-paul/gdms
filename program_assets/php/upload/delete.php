<?php
    if(!isset($_SESSION)) { session_start(); } 
    
    unlink('../../../profile/' .$_SESSION['id']. '.png');
?>