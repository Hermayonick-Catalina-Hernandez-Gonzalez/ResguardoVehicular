<?php
require_once __DIR__ . '/EnvLoader.php';

$env = new EnvLoader();
$serverName = $env->get('DB_HOST');
$database = $env->get('DB_NAME');
$username = $env->get('DB_USER');
$password = $env->get('DB_PASSWORD');

try {
    $conn = new PDO("sqlsrv:server=$serverName;Database=$database", $username, $password, array(
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::SQLSRV_ATTR_ENCODING => PDO::SQLSRV_ENCODING_UTF8, 
        "CharacterSet" => "UTF-8" 
    ));
} catch (PDOException $e) {
    echo "Error de conexión: " . $e->getMessage(); 
    echo $serverName;
}
?>
