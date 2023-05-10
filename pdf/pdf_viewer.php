<?php
    $url = $_GET["ref"];
    header('Content-type: application/pdf');
    readfile($url  . ".pdf");
    unlink($url  . ".pdf");
?>