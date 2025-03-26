<?php
require '../php/conexion.php';

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

if (!isset($_GET['numero_economico']) && !isset($_GET['numero_serie'])) {
    echo json_encode(["error" => "Falta el parámetro 'numero_economico' o 'numero_serie'"]);
    exit;
}

$numeroEconomico = isset($_GET['numero_economico']) ? $_GET['numero_economico'] : '';
$numeroSerie = isset($_GET['numero_serie']) ? $_GET['numero_serie'] : '';

try {
    $sql = "EXEC dbo.CONSULTA_DATOS_VEHICULO_EMPLEADO @NUM_ECONOMICO = :num, @NUM_SERIE = :num_serie";
    $stmt = $conn->prepare($sql);
    
    $stmt->bindParam(':num', $numeroEconomico);
    $stmt->bindParam(':num_serie', $numeroSerie);
    
    $stmt->execute();
    
    while ($stmt->columnCount() === 0 && $stmt->nextRowset()) {
       
    }
    
  
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
