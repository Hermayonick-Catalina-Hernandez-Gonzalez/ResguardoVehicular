<?php
require '../php/conexion.php';

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

if (!isset($_GET['numero_economico'])) {
    echo json_encode(["error" => "Falta el parámetro 'numero_economico'"]);
    exit;
}

$numeroEconomico = $_GET['numero_economico'];

try {
    $sql = "EXEC dbo.CONSULTA_DATOS_VEHICULO_EMPLEADO @NUM_ECONOMICO = :num";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':num', $numeroEconomico);
    $stmt->execute();

    $vehiculo = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($vehiculo) {
        echo json_encode($vehiculo);
    } else {
        echo json_encode(["error" => "Vehículo no encontrado"]);
    }
} catch (Exception $e) {
    echo json_encode(["error" => "Error en la consulta: " . $e->getMessage()]);
}

$conn = null;
?>

