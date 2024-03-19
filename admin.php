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

    $arr = array();

    $sql = "SELECT nombre, correo, contrasena, autorizado FROM users;";


    if($_SERVER['REQUEST_METHOD'] == "POST"){
        $requestBody = file_get_contents('php://input');
        $jsonData = json_decode($requestBody, true);

        if($jsonData != null){
            if($jsonData["permission"] == true){
                $permission = 1;
            } else{
                $permission = 0;
            }
            $username = $conn->real_escape_string($jsonData["username"]);
    
            $sql = "UPDATE users SET autorizado = $permission WHERE nombre = '$username'";
            $result = $conn->query($sql);
            if($result == true){
                if($permission == 1){
                    echo json_encode(array("res"=> true, "changed"=>"0"));
                } else{
                    echo json_encode(array("res"=> true, "changed"=>"1"));
                }
            } else{
                echo json_encode(array("res"=> false));
                die();
            }
        } else{
            echo json_encode(array("res"=> false));
            die();
        }
    } else{
        $result = $conn->query($sql);
    if($result->num_rows > 0){
        while($row = $result->fetch_assoc()){
            array_push($arr, array("nombre"=>$row["nombre"],"correo"=>$row['correo'],"contrasena"=>$row['contrasena'],"autorizado"=>$row['autorizado']));
        }
        echo json_encode($arr);
        die();
    } else {
        echo json_encode(array('res'=> false));
        die();
    }
    }
