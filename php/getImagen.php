<?php
include '../php/conexion.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $numeroEconomico = $_POST['numeroEconomico'] ?? '';

    try {
        // Obtener el ID del vehículo
        $sqlVehiculo = "SELECT id FROM vehiculo WHERE numero_economico = :numeroEconomico";
        $stmtVehiculo = $conn->prepare($sqlVehiculo);
        $stmtVehiculo->bindParam(':numeroEconomico', $numeroEconomico, PDO::PARAM_STR);
        $stmtVehiculo->execute();
        $vehiculo = $stmtVehiculo->fetch(PDO::FETCH_ASSOC);

        if (!$vehiculo) {
            echo json_encode(["error" => "Vehículo no encontrado"]);
            exit;
        }

        $vehiculo_id = $vehiculo['id'];

        // Obtener la primera imagen registrada
        $sqlImagen = "SELECT TOP 1 nombre_archivo FROM fotos WHERE vehiculo_id = :vehiculo_id ORDER BY id ASC";
        $stmtImagen = $conn->prepare($sqlImagen);
        $stmtImagen->bindParam(':vehiculo_id', $vehiculo_id, PDO::PARAM_INT);
        $stmtImagen->execute();
        $imagen = $stmtImagen->fetch(PDO::FETCH_ASSOC);

        if ($imagen) {
            $rutaImagen = "../vehiculos/" . $imagen['nombre_archivo'];
        } else {
            $rutaImagen = "../img/Vehiculo.png"; // Imagen por defecto
        }

        echo json_encode(["imagenFrontal" => $rutaImagen]);

    } catch (PDOException $e) {
        echo json_encode(["error" => "Error en la consulta: " . $e->getMessage()]);
    }
}
?>
