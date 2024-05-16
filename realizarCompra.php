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
            $usuario = $conn->real_escape_string($jsonData['usuario']);
            $total = $conn->real_escape_string($jsonData['total']);
    
            $sql = "INSERT INTO compras VALUES('','$usuario',$total);";
            $result = $conn->query($sql);
        
            if($result == true){
                echo json_encode(array('res'=>true));
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