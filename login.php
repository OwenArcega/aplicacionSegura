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

    if($_SERVER['REQUEST_METHOD'] == "POST"){
        $requestBody = file_get_contents('php://input');
        $jsonData = json_decode($requestBody, true);
    
        if ($jsonData !== null) {
            $name = $conn->real_escape_string($jsonData['name']);
            $email = $conn->real_escape_string($jsonData['email']);
            $hashedPassword = $conn->real_escape_string($jsonData['password']);
        
            $sql = "SELECT * FROM administradores WHERE nombre = '$name' AND correo = '$email' AND contrasena = '$hashedPassword';";
            $result = $conn->query($sql);
            if($result->num_rows > 0){
                echo json_encode(array("admin"=>true));
            } else{
                $sql = "SELECT * FROM users WHERE nombre = '$name' AND correo = '$email' AND contrasena = '$hashedPassword'";
                $result = $conn->query($sql);
                if ($result->num_rows > 0) {
                    $response = array("found"=>true);
                } else {
                    $response = array("found"=>false);
                }
                echo json_encode($response);
            }
        } else {
            $response = array("found"=>false);
            echo json_encode($response);
            die();
        }
    } else{
        echo json_encode(array('found'=>false));
        die();
    }
