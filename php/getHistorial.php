<?php
include '../php/conexion.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $numeroEconomico = $_POST['numeroEconomico'] ?? '';

    try {
        $sql = "SELECT * FROM historial WHERE numero_economico = :numeroEconomico";
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
                            <p><strong>Resguardante Externo:</strong> ' . htmlspecialchars($row['resguardante']) . ' (' . htmlspecialchars($row['cargo']) . ')</p>
                            <p><strong>Resguardante Interno:</strong> ' . htmlspecialchars($row['resguardante_interno']) . ' (' . htmlspecialchars($row['cargo_interno']) . ')</p>
                            <p><strong>Observaciones Generales:</strong> ' . htmlspecialchars($row['observaciones']) . '</p>';

                if (!empty($row['observaciones_fotos'])) {
                    echo '<p><strong>Observaciones de Fotos:</strong> ' . htmlspecialchars($row['observaciones_fotos']) . '</p>';
                }

                echo '</div>
                      <button class="download-button" onclick="imprimirHistorial(this)">🖨️ Imprimir</button>
                      </div>'; // Cierra history-card
            }
        } else {
            echo "<p>No se encontró historial para este vehículo.</p>";
        }
    } catch (PDOException $e) {
        echo "Error en la consulta: " . $e->getMessage();
    }
}
?>
