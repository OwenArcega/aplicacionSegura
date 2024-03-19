<?php
    header('Content-Type: application/json');

    $server = "localhost";
    $db_username = "admin";
    $db_password = "`x.xWCUtdmn5>V!a{(lS{?PI63(#PU[{";
    $db_name = "user_control";

    $conn = new mysqli($server . ":3390", $db_username, $db_password, $db_name);

    if($conn->connect_error){
        die("Connection failed: " . $conn->connect_error);
    }

    if($_SERVER['REQUEST_METHOD'] == 'POST'){
        $requestBody = file_get_contents('php://input');
        $jsonData = json_decode($requestBody, true);
    
        if ($jsonData !== null) {
            $username = $jsonData['username'];
            $key = $jsonData['key'];
    
            $sql = "SELECT clave FROM users WHERE nombre = '$username';";
            $result = $conn->query($sql);
        
            if($result->num_rows > 0){
                while($fila = $result->fetch_assoc()) {
                    require_once 'vendor/autoload.php';
                    $authenticator = new \Sonata\GoogleAuthenticator\GoogleAuthenticator();   
                    $isValid = $authenticator->checkCode($fila['clave'], $key);
                }
                
                if ($isValid) {
                    echo json_encode(array("res"=>true));
                } else {
                    echo json_encode(array("res"=>false));
                    die();
                }
    
            }else{
                echo json_encode(array("res"=>false));
                die("". $conn->error);
            }
        } else {
            echo json_encode(array('res' => false));
            die();
        }
    } else {
        echo json_encode(array('res'=> false));
        die();
    }



