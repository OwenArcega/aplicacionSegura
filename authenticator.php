<?php
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

    require_once 'vendor/autoload.php';

    $authenticator = new \Sonata\GoogleAuthenticator\GoogleAuthenticator();

    $sql = "SELECT * FROM users ORDER BY id DESC LIMIT 1";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        while($fila = $result->fetch_assoc()) {
            $qrCodeUrl = $authenticator->getUrl('Aplicacion segura', $fila["nombre"], $fila["clave"]);
        }
    } else {
        echo "No se encontraron resultados";
        die();
    }
?>
    <html>
        <head>
            <link type="text/css" rel="stylesheet" href="register.css">
            <script src="register.js"></script>
        </head>
        <body>
            <h1>Autenticación de 2 pasos</h1>
            <p>Por favor escanee el siguiente código QR con la aplicación <b>Google Authentiator</b> para continuar con su registro.</p>
            <?php echo '<img src="' . $qrCodeUrl . '">';?>
            <p>Una vez registrado haga clic en el siguiente botón para regresar al menú de incio</p>
            <button id="backBtn">Regresar</button>
        </body>
    </html>