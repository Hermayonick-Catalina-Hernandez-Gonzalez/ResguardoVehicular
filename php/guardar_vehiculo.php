<?php
session_start();
include '../php/conexion.php'; // Archivo con la conexión a SQL Server

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Recibir datos del formulario
    $numero_economico = trim($_POST['numero_economico']);
    $placa = trim($_POST['placa']);
    $serie = trim($_POST['serie']);
    $color = trim($_POST['color']);
    $clase_vehiculo = trim($_POST['clase_vehiculo']);
    $marca_vehiculo = trim($_POST['marca_vehiculo']);
    $submarca = trim($_POST['submarca']);
    $modelo_vehiculo = trim($_POST['modelo_vehiculo']);
    $tipo_condicion = trim($_POST['tipo_condicion']);
    $kilometraje = intval($_POST['kilometraje']);
    $tipo_ocupacion = trim($_POST['tipo_ocupacion']);
    $resguardante_id = $_POST['resguardante_id'];

    // Lista de valores permitidos para el campo 'estado'
    $valores_permitidos = ['propio', 'arrendado', 'decomisado'];

    if (!in_array($tipo_condicion, $valores_permitidos)) {
        echo json_encode(["error" => "Error: El estado del vehículo no es válido."]);
        exit;
    }

    try {
        // Consulta SQL para insertar datos
        $sql = "INSERT INTO vehiculo (resguardante_id, numero_economico, placa, serie, color, clase, marca, submarca, modelo, estado, kilometraje, ocupacion) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        $stmt = $conn->prepare($sql);

        // Enlazar los parámetros
        $stmt->bindParam(1, $resguardante_id);
        $stmt->bindParam(2, $numero_economico);
        $stmt->bindParam(3, $placa);
        $stmt->bindParam(4, $serie);
        $stmt->bindParam(5, $color);
        $stmt->bindParam(6, $clase_vehiculo);
        $stmt->bindParam(7, $marca_vehiculo);
        $stmt->bindParam(8, $submarca);
        $stmt->bindParam(9, $modelo_vehiculo);
        $stmt->bindParam(10, $tipo_condicion);
        $stmt->bindParam(11, $kilometraje);
        $stmt->bindParam(12, $tipo_ocupacion);

        // Ejecutar la consulta
        $stmt->execute();

        // Obtener el ID del vehículo insertado
        $vehiculo_id = $conn->lastInsertId();

        echo json_encode([
            "success" => "Datos guardados correctamente",
            "vehiculo_id" => $vehiculo_id
        ]);
    } catch (PDOException $e) {
        echo json_encode(["error" => "Error al guardar los datos: " . $e->getMessage()]);
    }
}
?>
