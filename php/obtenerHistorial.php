<?php
header('Content-Type: application/json');
require "../php/conexion.php"; 

if (isset($_POST['vehiculo_id']) && !empty($_POST['vehiculo_id'])) {
    $vehiculo_id = $_POST['vehiculo_id'];

    if (!$conn) {
        echo json_encode(['error' => 'No se pudo establecer la conexión a la base de datos.']);
        exit();
    }

    try {
        // **Obtener datos del vehículo y resguardante**
        $sql = "SELECT v.*, r.* FROM vehiculo v 
                LEFT JOIN resguardante r ON v.resguardante_id = r.id
                WHERE v.id = :vehiculo_id";

        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':vehiculo_id', $vehiculo_id, PDO::PARAM_INT);
        $stmt->execute();
        $vehiculo = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$vehiculo) {
            echo json_encode(['error' => 'No se encontró el historial para el vehículo especificado']);
            exit();
        }

        // **Obtener verificaciones como array**
        $sqlVerificaciones = "SELECT categoria, elemento, estado FROM verificacion WHERE vehiculo_id = :vehiculo_id";
        $stmt = $conn->prepare($sqlVerificaciones);
        $stmt->bindParam(':vehiculo_id', $vehiculo_id, PDO::PARAM_INT);
        $stmt->execute();
        $vehiculo['verificaciones'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

        //  **Obtener observaciones como array**
        $sqlObservaciones = "SELECT categoria, observaciones FROM Observacionesverificacion WHERE vehiculo_id = :vehiculo_id";
        $stmt = $conn->prepare($sqlObservaciones);
        $stmt->bindParam(':vehiculo_id', $vehiculo_id, PDO::PARAM_INT);
        $stmt->execute();
        $vehiculo['observaciones'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

        //  **Obtener fotos como array**
        $sqlFotos = "SELECT nombre_archivo, extension, observaciones FROM fotos WHERE vehiculo_id = :vehiculo_id";
        $stmt = $conn->prepare($sqlFotos);
        $stmt->bindParam(':vehiculo_id', $vehiculo_id, PDO::PARAM_INT);
        $stmt->execute();
        $vehiculo['fotos'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

        //  **Devolver todo en JSON**
        echo json_encode($vehiculo);
    } catch (PDOException $e) {
        echo json_encode(['error' => 'Error al obtener el historial: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['error' => 'No se ha recibido el ID del vehículo']);
}
?>
