<?php
include "../php/conexion.php";

if (isset($_GET['numeroEconomico'])) {
    $numeroEconomico = $_GET['numeroEconomico'];

    $query = "SELECT * FROM vehiculo WHERE numero_economico = :numeroEconomico";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':numeroEconomico', $numeroEconomico);
    $stmt->execute();

    $vehiculo = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($vehiculo) {
        echo json_encode($vehiculo);
    } else {
        echo json_encode(null);
    }
}
?>
