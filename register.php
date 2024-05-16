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
            $username = $conn->real_escape_string($jsonData['name']);
            $email = $conn->real_escape_string($jsonData['email']);
            $hashedPassword = $conn->real_escape_string($jsonData['password']);
        
            $sql = "SELECT * FROM users WHERE nombre = '$username';";
            $result = $conn->query($sql);
            if($result->num_rows > 0){
                echo json_encode(array("found"=>true));
            } else{
                require_once 'vendor/autoload.php';
            
                $authenticator = new \Sonata\GoogleAuthenticator\GoogleAuthenticator();
                $secret = $authenticator->generateSecret();
            
                $qrCodeUrl = $authenticator->getUrl('Aplicacion segura', $username, $secret);
            
                $sql = "INSERT INTO users VALUES('','$username','$email','$hashedPassword','$secret',0)";
                $result = $conn->query($sql);
    
                if($result == true){
                    echo json_encode(array("res"=>true));
                } else{
                    echo json_encode(array("res"=>false));
                    die();
                }
            }
        } else {
            echo json_encode(array("res"=>false));
            die();
        }
    } else{
        echo json_encode(array("res"=>false));
        die();
    }




    