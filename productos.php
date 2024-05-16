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
            $nombre = $conn->real_escape_string($jsonData['nombre']);
            $cantidad = $conn->real_escape_string($jsonData['cantidad']);
            $precio = $conn->real_escape_string($jsonData['precio']);
            $descripcion = $conn->real_escape_string($jsonData['descripcion']);
            $imagen = $conn->real_escape_string($jsonData['imagen']);
    
            $sql = "INSERT INTO productos VALUES('','$nombre',$cantidad,$precio,'$descripcion','$imagen');";
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
    } else if($_SERVER['REQUEST_METHOD'] == 'GET'){ 
        $sql = "SELECT nombre, cantidad, precio, descripcion, imagen FROM productos;";
        $result = $conn->query($sql);
        while($row = $result->fetch_assoc()){
            array_push($arr, array("nombre"=>$row["nombre"],"cantidad"=>$row['cantidad'],"precio"=>$row['precio'],"descripcion"=>$row['descripcion'], "imagen"=>$row['imagen']));
        }
        echo json_encode($arr);
        die();
    } else {
        echo json_encode(array('res'=> false));
        die("". $conn->error);
    }