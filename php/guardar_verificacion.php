<?php
require "../php/conexion.php";

header("Content-Type: application/json");
$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !isset($data["datos"]) || !isset($data["vehiculo_id"])) {
    echo json_encode(["error" => "Datos inválidos. Falta el ID del vehículo"]);
    exit;
}

$vehiculo_id = $data["vehiculo_id"];

try {
    $conn->beginTransaction();

    foreach ($data["datos"] as $dato) {
        if ($dato["elemento"] === "Observaciones") {
            $stmt = $conn->prepare("INSERT INTO Observacionesverificacion (categoria, observaciones, vehiculo_id) VALUES (?, ?, ?)");
            $stmt->execute([$dato["categoria"], $dato["estado"],$vehiculo_id]); 
        } else {
            $stmt = $conn->prepare("INSERT INTO verificacion (vehiculo_id, categoria, elemento, estado) VALUES (?, ?, ?, ?)");
            $stmt->execute([$vehiculo_id, $dato["categoria"], $dato["elemento"], $dato["estado"]]);
        }
    }

    $conn->commit();
    echo json_encode([
        "mensaje" => "Datos guardados con éxito",
        "vehiculo_id" => $vehiculo_id 
    ]);
} catch (Exception $e) {
    $conn->rollBack();
    echo json_encode(["error" => "Error al guardar: " . $e->getMessage()]);
}
?>
