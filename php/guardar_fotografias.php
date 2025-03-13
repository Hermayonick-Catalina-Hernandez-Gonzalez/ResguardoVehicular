<?php
session_start();
include '../php/conexion.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $vehiculo_id = $_POST['vehiculo_id'] ?? null;

    if (!$vehiculo_id) {
        echo json_encode(["error" => "No se recibió el ID del vehículo."]);
        exit;
    }

    $imagenesNormales = $_FILES['imagenes'] ?? null;
    $imagenesExtras = $_FILES['imagenes_extra'] ?? null;
    $observacionesNormales = $_POST['observaciones_normales'] ?? [];
    $observacionesExtras = $_POST['observaciones_extra'] ?? [];

    if (!$imagenesNormales && !$imagenesExtras) {
        echo json_encode(["error" => "No se recibieron imágenes."]);
        exit;
    }

    try {
        $conn = new PDO("sqlsrv:server=$serverName;Database=$database", $username, $password, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::SQLSRV_ATTR_ENCODING => PDO::SQLSRV_ENCODING_UTF8
        ]);

        $uploadDir = "../vehiculos/";
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }

        function guardarImagenes($conn, $vehiculo_id, $imagenes, $observaciones, $uploadDir) {
            foreach ($imagenes['name'] as $key => $name) {
                $tmpName = $imagenes['tmp_name'][$key];
                $extension = pathinfo($name, PATHINFO_EXTENSION);
                $nombreArchivo = 'vehiculo_' . time() . '_' . $key . '.' . $extension;
                $rutaFinal = $uploadDir . $nombreArchivo;

                if (move_uploaded_file($tmpName, $rutaFinal)) {
                    $stmt = $conn->prepare("INSERT INTO fotos (vehiculo_id, nombre, nombre_archivo, extension, tamaño, observaciones) VALUES (?, ?, ?, ?, ?, ?)");
                    $nombre = "Imagen_" . time();
                    $tamaño = filesize($rutaFinal);
                    $observacion = $observaciones[$key] ?? null;

                    $stmt->bindParam(1, $vehiculo_id, PDO::PARAM_INT);
                    $stmt->bindParam(2, $nombre, PDO::PARAM_STR);
                    $stmt->bindParam(3, $nombreArchivo, PDO::PARAM_STR);
                    $stmt->bindParam(4, $extension, PDO::PARAM_STR);
                    $stmt->bindParam(5, $tamaño, PDO::PARAM_INT);
                    $stmt->bindParam(6, $observacion, PDO::PARAM_STR);

                    if (!$stmt->execute()) {
                        error_log("Error al guardar en la BD: " . print_r($stmt->errorInfo(), true));
                    }
                } else {
                    error_log("Error al mover el archivo: $rutaFinal");
                }
            }
        }

        // Guardar imágenes normales
        if ($imagenesNormales) {
            guardarImagenes($conn, $vehiculo_id, $imagenesNormales, $observacionesNormales, $uploadDir);
        }

        // Guardar imágenes extras
        if ($imagenesExtras) {
            guardarImagenes($conn, $vehiculo_id, $imagenesExtras, $observacionesExtras, $uploadDir);
        }

        echo json_encode(["mensaje" => "Imágenes guardadas correctamente", "vehiculo_id" => $vehiculo_id]);

    } catch (PDOException $e) {
        error_log("Error de conexión: " . $e->getMessage());
        echo json_encode(["error" => "Error de conexión a la base de datos"]);
    }
} else {
    echo json_encode(["error" => "Método de solicitud no permitido."]);
}
