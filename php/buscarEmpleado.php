<?php
session_start();
include '../php/conexion.php';

header('Content-Type: application/json');  // Asegúrate de que se devuelve JSON
header("Access-Control-Allow-Origin: *");

if (!isset($_GET['numero_empleado'])) {
    echo json_encode(["error" => "Falta el parámetro 'numero_empleado'"]);
    exit;
}

$numeroEmpleado = $_GET['numero_empleado'];

// Llamada al procedimiento almacenado
try {
    $sql = "EXEC dbo.CONSULTA_DATOS_EMPLEADO @NUM_EMPLEADO = ?";
    $stmt = $conn->prepare($sql);
    $stmt->execute([$numeroEmpleado]);
    $empleado = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($empleado) {
        // Asumimos que tienes los campos 'nombre' y 'apellido' en la base de datos
        $empleado['nombre_completo'] = $empleado['NOMBRE'] . ' ' . $empleado['APELLIDO'];  // Concatenamos el nombre y apellido
        echo json_encode($empleado);  // Devuelve un JSON con los datos
    } else {
        echo json_encode(["error" => "Empleado no encontrado"]);
    }
    
} catch (Exception $e) {
    echo json_encode(["error" => "Error en la consulta: " . $e->getMessage()]);
}

$conn = null;
?>
