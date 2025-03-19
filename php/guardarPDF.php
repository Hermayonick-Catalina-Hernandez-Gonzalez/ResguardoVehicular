<?php
session_start();
include '../php/conexion.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["error" => "Método de solicitud no permitido."]);
    exit;
}

$vehiculo_id = $_POST['vehiculo_id'] ?? null;
$pdfFile = $_FILES['archivo'] ?? null;

if (!$vehiculo_id || !$pdfFile) {
    echo json_encode(["error" => "Faltan parámetros obligatorios."]);
    exit;
}

try {
    $conn = new PDO("sqlsrv:server=$serverName;Database=$database", $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::SQLSRV_ATTR_ENCODING => PDO::SQLSRV_ENCODING_UTF8
    ]);

    $uploadDir = "../archivos/";
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    $nombreArchivo = 'archivos_' . time() . '_' . basename($pdfFile['name']);
    $extension = pathinfo($nombreArchivo, PATHINFO_EXTENSION);
    $rutaFinal = $uploadDir . $nombreArchivo;

    if (move_uploaded_file($pdfFile['tmp_name'], $rutaFinal)) {
        $stmt = $conn->prepare("INSERT INTO archivos (vehiculo_id, nombre_archivo, ruta_archivo, extension, tamaño) VALUES (?, ?, ?, ?, ?)");
        $tamaño = filesize($rutaFinal);

        $stmt->bindParam(1, $vehiculo_id, PDO::PARAM_INT);
        $stmt->bindParam(2, $nombreArchivo, PDO::PARAM_STR);
        $stmt->bindParam(3, $rutaFinal, PDO::PARAM_STR);
        $stmt->bindParam(4, $extension, PDO::PARAM_STR);
        $stmt->bindParam(5, $tamaño, PDO::PARAM_INT);

        if ($stmt->execute()) {
            echo json_encode(["mensaje" => "📄 PDF guardado correctamente", "vehiculo_id" => $vehiculo_id]);
        } else {
            error_log("Error al guardar en la BD: " . print_r($stmt->errorInfo(), true));
            echo json_encode(["error" => "Error al guardar en la base de datos"]);
        }
    } else {
        error_log("Error al mover el archivo: $rutaFinal");
        echo json_encode(["error" => "No se pudo mover el archivo"]);
    }
} catch (PDOException $e) {
    error_log("Error de conexión: " . $e->getMessage());
    echo json_encode(["error" => "Error de conexión a la base de datos"]);
}
?>
