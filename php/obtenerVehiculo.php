<?php
include "../php/conexion.php";

if (isset($_GET['numeroEconomico'])) {
    $numeroEconomico = $_GET['numeroEconomico'];

    $query = "SELECT TOP 1 * FROM vehiculo WHERE numero_economico = :numeroEconomico ORDER BY id DESC";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':numeroEconomico', $numeroEconomico, PDO::PARAM_STR);
    $stmt->execute();

    $vehiculo = $stmt->fetch(PDO::FETCH_ASSOC);

    header('Content-Type: application/json');
    echo json_encode($vehiculo ? $vehiculo : ["error" => "No se encontró el vehículo"]);
}
?>
