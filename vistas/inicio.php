<?php
session_start();
if ($_SESSION['rol'] != 'resguardante') {
    header("Location: ../index.php");
    exit();
}

include "../php/conexion.php";
$query = "SELECT DISTINCT numero_economico, placa, serie, clase, marca, modelo FROM vehiculo";
$stmt = $conn->prepare($query);
$stmt->execute();
$vehiculos = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>

<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Resguardo Vehicular</title>
    <link rel="shortcut icon" href="../img/Icono.png" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <link rel="stylesheet" href="../css/stylesInicio.css">
</head>

<body>
    <header class="head">
        <div class="esquina-container">
            <button class="btn-salir" onclick="salir()">
                <img src="../img/Salir.png" alt="Salir">
            </button>
            <div class="esquina">
                <img src="../img/Esquina.png" alt="Imagen de Esquina">
            </div>
        </div>
        <div class="titulo">
            <h1>Resguardo Vehicular</h1>
        </div>
        <div class="logo">
            <img src="../img/Logo.png" alt="Logo FGJ">
        </div>
    </header>

    <div class="barra-busqueda">
        <input type="text" id="search" placeholder="Buscar..." oninput="buscar()">
        <img src="../img/Buscador.png" alt="Buscar" class="icono-buscar">
    </div>

    <table>
        <thead>
            <tr>
                <th>N° Económico</th>
                <th>Placa</th>
                <th>Serie</th>
                <th>Clase</th>
                <th>Marca</th>
                <th>Modelo</th>
                <th>Historial</th>
            </tr>
        </thead>
        <tbody id="vehiculos">
            <?php if (!empty($vehiculos)): ?>
                <?php foreach ($vehiculos as $vehiculo): ?>
                    <tr>
                        <td><?= htmlspecialchars($vehiculo['numero_economico']) ?></td>
                        <td><?= htmlspecialchars($vehiculo['placa']) ?></td>
                        <td><?= htmlspecialchars($vehiculo['serie']) ?></td>
                        <td><?= htmlspecialchars($vehiculo['clase']) ?></td>
                        <td><?= htmlspecialchars($vehiculo['marca']) ?></td>
                        <td><?= htmlspecialchars($vehiculo['modelo']) ?></td>
                        <td>
                            <button onclick="verVehiculo('<?= $vehiculo['numero_economico'] ?>')"><i class="fa fa-eye"></i> Ver</button>
                        </td>
                    </tr>
                <?php endforeach; ?>
            <?php else: ?>
                <tr>
                    <td colspan="7">No hay vehículos registrados</td>
                </tr>
            <?php endif; ?>
        </tbody>
    </table>

    <script src="../JS/acciones.js"></script>
</body>

</html>