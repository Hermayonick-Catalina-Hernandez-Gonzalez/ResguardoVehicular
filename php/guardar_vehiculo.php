<?php
session_start();
require_once '../php/conexion.php'; 

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $numero_economico = trim($_POST['numero_economico']);
    $placa_nueva = trim($_POST['placa']);
    $serie = trim($_POST['numero_serie']); 
    $color = trim($_POST['color']);
    $clase_vehiculo = trim($_POST['clase_vehiculo']);
    $marca_vehiculo = trim($_POST['marca_vehiculo']);
    $submarca = trim($_POST['submarca']);
    $modelo_vehiculo = trim($_POST['modelo_vehiculo']);
    $tipo_condicion = trim($_POST['tipo_condicion']);
    $kilometraje = intval($_POST['kilometraje']);
    $tipo_ocupacion = trim($_POST['tipo_ocupacion']);
    $resguardante_id = $_POST['resguardante_id'];

    $valores_permitidos = ['propio', 'arrendado', 'decomisado'];
    if (!in_array($tipo_condicion, $valores_permitidos)) {
        echo json_encode(["error" => "Error: El estado del vehículo no es válido."]);
        exit;
    }

    try {
        $sql_consulta = "EXEC dbo.CONSULTA_DATOS_VEHICULO_EMPLEADO @NUM_ECONOMICO = :num, @NUM_SERIE = :num_serie";
        $stmt_consulta = $conn->prepare($sql_consulta);
        $stmt_consulta->bindParam(':num', $numero_economico);
        $stmt_consulta->bindParam(':num_serie', $serie);
        $stmt_consulta->execute();
        
        while ($stmt_consulta->columnCount() === 0 && $stmt_consulta->nextRowset()) { }
        $vehiculo_actual = $stmt_consulta->fetch(PDO::FETCH_ASSOC);
        
        $placa_actual = $vehiculo_actual ? $vehiculo_actual['PLACAS'] : "";
        
        $sql_insert = "INSERT INTO vehiculo (resguardante_id, numero_economico, placa, serie, color, clase, marca, submarca, modelo, estado, kilometraje, ocupacion) 
                       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        $stmt_insert = $conn->prepare($sql_insert);
        $stmt_insert->bindParam(1, $resguardante_id);
        $stmt_insert->bindParam(2, $numero_economico);
        $stmt_insert->bindParam(3, $placa_nueva);
        $stmt_insert->bindParam(4, $serie);
        $stmt_insert->bindParam(5, $color);
        $stmt_insert->bindParam(6, $clase_vehiculo);
        $stmt_insert->bindParam(7, $marca_vehiculo);
        $stmt_insert->bindParam(8, $submarca);
        $stmt_insert->bindParam(9, $modelo_vehiculo);
        $stmt_insert->bindParam(10, $tipo_condicion);
        $stmt_insert->bindParam(11, $kilometraje);
        $stmt_insert->bindParam(12, $tipo_ocupacion);
        $stmt_insert->execute();
        $vehiculo_id = $conn->lastInsertId();
        
        if ($placa_nueva !== $placa_actual) {
            $sql_update = "EXEC dbo.ACTUALIZAR_DATOS_VEHICULO @NUM_ECONOMICO = :num, @PLACA_A_ACTUALIZAR = :placa_actual";
            $stmt_update = $conn->prepare($sql_update);
            $stmt_update->bindParam(':num', $numero_economico);
            $stmt_update->bindParam(':placa_actual', $placa_nueva);
            $stmt_update->execute();
        }
        
        echo json_encode([
            "success" => "Datos guardados correctamente",
            "vehiculo_id" => $vehiculo_id
        ]);
    } catch (PDOException $e) {
        echo json_encode(["error" => "Error al guardar los datos: " . $e->getMessage()]);
    }
}
?>
