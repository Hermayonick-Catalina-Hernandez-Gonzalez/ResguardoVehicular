<?php
include '../php/conexion.php';
session_start();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $numeroEconomico = $_POST['numeroEconomico'] ?? '';

    try {
        $sql = "SELECT 
                    FORMAT(fecha_resguardo, 'dd/MM/yyyy HH:mm:ss') AS fecha_resguardo, 
                    municipio, 
                    resguardante, 
                    cargo, 
                    resguardante_interno, 
                    cargo_interno, 
                    observaciones, 
                    observaciones_fotos,
                    archivos_pdf 
                FROM historial 
                WHERE numero_economico = :numeroEconomico";

        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':numeroEconomico', $numeroEconomico, PDO::PARAM_STR);
        $stmt->execute();

        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if (count($rows) > 0) {
            foreach ($rows as $row) {
                echo '<div class="history-card">
                        <div class="history-content">
                            <p><strong>Fecha:</strong> ' . htmlspecialchars($row['fecha_resguardo']) . '</p>
                            <p><strong>Municipio:</strong> ' . htmlspecialchars($row['municipio']) . '</p>
                            <p><strong>Resguardante Externo:</strong> ' . htmlspecialchars($row['resguardante'])  . '</p>
                            <p><strong>Resguardante Interno:</strong> ' . htmlspecialchars($row['resguardante_interno'])  . '</p> '; 

                            if (!empty($row['observaciones']) && trim(str_replace('|', '', $row['observaciones'])) !== '') {
                                echo '<p><strong>Observaciones Generales:</strong> ' . htmlspecialchars($row['observaciones']) . '</p>';
                            }
                            
                            if (!empty($row['observaciones_fotos']) && trim(str_replace('|', '', $row['observaciones_fotos'])) !== '') {
                                echo '<p><strong>Observaciones de Fotos:</strong> ' . htmlspecialchars($row['observaciones_fotos']) . '</p>';
                            }
                            
                $pdfsJson = "[]";

                if (!empty($row['archivos_pdf'])) {
                    $archivosPDF = explode(" | ", $row['archivos_pdf']);
                    $listaPDFs = [];

                    foreach ($archivosPDF as $archivo) {
                        if (strpos($archivo, "(") !== false) {
                            list($nombre, $ruta) = explode(" (", rtrim($archivo, ")"));
                        } else {
                            $nombre = $archivo;
                            $ruta = "https://pruebas-vehiculos.fgjtam.gob.mx/archivos/" . $nombre;
                        }

                        $rutaCompleta = trim($ruta);
                        if (!filter_var($rutaCompleta, FILTER_VALIDATE_URL)) {
                            $rutaCompleta = "https://pruebas-vehiculos.fgjtam.gob.mx/archivos/" . $nombre;
                        }

                        $listaPDFs[] = $rutaCompleta;
                    }

                    $pdfsJson = htmlspecialchars(json_encode($listaPDFs));
                }

                $botonDescarga = '<button class="download-button" onclick="descargarPDFs(this)" data-pdfs=\'' . $pdfsJson . '\'>Descargar PDFs</button>';

                echo '</div>' . $botonDescarga . '</div>';
            }
        } else {
            echo "<p>No se encontró historial para este vehículo.</p>";
        }
    } catch (PDOException $e) {
        echo "Error en la consulta: " . $e->getMessage();
    }
}
?>
