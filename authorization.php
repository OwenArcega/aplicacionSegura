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

    if($_SERVER['REQUEST_METHOD'] == 'POST'){
        $requestBody = file_get_contents('php://input');
        $jsonData = json_decode($requestBody, true);
    
        if ($jsonData !== null) {
            $username = $jsonData['username'];
            $key = $jsonData['key'];
    
            $sql = "SELECT clave FROM users WHERE nombre = :username;";

            $stmt = $conn->prepare($sql);
            $stmt->bind_param(":username", $username);
            $stmt->execute();

            $stmt->store_result();
        
            if($stmt->num_rows > 0){
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



