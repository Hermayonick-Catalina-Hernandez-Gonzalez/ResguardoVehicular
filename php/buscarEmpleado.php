<?php
session_start();
include '../php/conexion.php';

header('Content-Type: application/json'); 
header("Access-Control-Allow-Origin: *");

if (!isset($_GET['numero_empleado'])) {
    echo json_encode(["error" => "Falta el parámetro 'numero_empleado'"]);
    exit;
}

$numeroEmpleado = $_GET['numero_empleado'];

try {
    $sql = "EXEC dbo.CONSULTA_DATOS_EMPLEADO @NUM_EMPLEADO = ?";
    $stmt = $conn->prepare($sql);
    $stmt->execute([$numeroEmpleado]);
    $empleado = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($empleado) {
        $empleado['nombre_completo'] = $empleado['NOMBRE'] . ' ' . $empleado['APELLIDO'];  // Concatenamos el nombre y apellido
        echo json_encode($empleado); 
    } else {
        echo json_encode(["error" => "Empleado no encontrado"]);
    }
    
} catch (Exception $e) {
    echo json_encode(["error" => "Error en la consulta: " . $e->getMessage()]);
}

$conn = null;
?>
