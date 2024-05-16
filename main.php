<?php
    header('Content-Type: application/json');

    require 'vendor/autoload.php';
    use Dotenv\Dotenv;

    $dotenv = Dotenv::createImmutable(__DIR__);
    $dotenv->load();

    $server = $_ENV['SERVER'];
    $db_username = $_ENV['DB_ADMIN'];
    $db_password = $_ENV['DB_ADMIN_PASSWORD'];
    $db_name = $_ENV['DB_NAME_ADMIN'];

    $conn = new mysqli($server . ":3390", $db_username, $db_password, $db_name);

    if($conn->connect_error){
        die("Connection failed: " . $conn->connect_error);
    }

    $arr = array();

    if($_SERVER['REQUEST_METHOD'] == 'POST'){
        $requestBody = file_get_contents('php://input');
        $jsonData = json_decode($requestBody, true);
    
        if ($jsonData !== null) {
            $username = $conn->real_escape_string($jsonData['username']);
    
            $sql = "SELECT id,  nombre, correo, contrasena FROM users WHERE nombre = '$username';";
            $result = $conn->query($sql);
        
            if($result->num_rows > 0){
                while($row = $result->fetch_assoc()) {
                    echo json_encode(array("id"=>$row["id"],"nombre" => $row["nombre"], "correo" => $row["correo"], "contrasena" => $row["contrasena"]));
                }
            }else{
                echo json_encode(array("res"=>false));
                die("". $conn->error);
            }
        } else {
            echo json_encode(array('res' => false));
            die("". $conn->error);
        }
    } else if($_SERVER['REQUEST_METHOD'] == "PUT"){
        $requestBody = file_get_contents('php://input');
        $jsonData = json_decode($requestBody, true);
    
        if ($jsonData !== null) {
            $username = $conn->real_escape_string($jsonData['username']);
            $email = $conn->real_escape_string($jsonData['email']);
            $password = $conn->real_escape_string($jsonData['password']);
            $id = $conn->real_escape_string($jsonData['id']);

            $sql = "UPDATE users SET nombre = '$username', correo = '$email', contrasena = '$password' WHERE id = $id;";
            $result = $conn->query($sql);
        
            if($result == true){
                echo json_encode(array("res"=> true));
            }else{
                echo json_encode(array("res"=>false));
                die("". $conn->error);
            }
        } else {
            echo json_encode(array('res' => false));
            die("". $conn->error);
        }
    } else {
        echo json_encode(array('res'=> false));
        die("". $conn->error);
    }