<?php
session_start();
if ($_SESSION['rol'] != 'resguardante') {
    header("Location: ../index.php");
    exit();
}

if (isset($_POST['numeroEconomico'])) {
    $numeroEconomico = $_POST['numeroEconomico'];
} else {
    $numeroEconomico = "No disponible";
}
?>

<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Historial Vehicular</title>
    <link rel="shortcut icon" href="../img/Icono.png" />
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.29/jspdf.plugin.autotable.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <link rel="stylesheet" href="../css/styleshistorial.css">
</head>

<body>
    <header class="head">
        <div class="esquina-container">
            <button class="btn-regresar" onclick="window.history.back()">
                <img src="../img/Regresar.png" alt="Salir">
            </button>
            <div class="esquina">
                <img src="../img/Esquina.png" alt="Imagen de Esquina">
            </div>
        </div>
        <div class="titulo">
            <h1>Historial Vehicular</h1>
        </div>
        <div class="logo">
            <img src="../img/Logo.png" alt="Logo FGJ">
        </div>
    </header>

    <div class="container">
        <div class="profile-section">
            <img  alt="Foto de vehículo" class="profile-picture">
            <div class="profile-info">
                <p><strong>Número Económico:</strong> <span id="numeroEconomico"></span></p>
                <p><strong>Placa:</strong> <span id="placa"></span></p>
                <p><strong>Serie:</strong> <span id="serie"></span></p>
                <p><strong>Color:</strong> <span id="color"></span></p>
                <p><strong>Clase:</strong> <span id="clase"></span></p>
                <p><strong>Marca:</strong> <span id="marca"></span></p>
                <p><strong>Submarca:</strong> <span id="submarca"></span></p>
                <p><strong>Modelo:</strong> <span id="modelo"></span></p>
            </div>

        </div>

        <div class="barra-busqueda">
            <input type="text" id="search" placeholder="Buscar..." oninput="buscarHistorial()">
            <img src="../img/Buscador.png" alt="Buscar" class="icono-buscar">
        </div>

        <div class="history-section" id="history-section">
            <div class="history-card">
                <p>Cargando historial...</p>
            </div>
        </div>
    </div>
    <script src="../JS/acciones.js"></script>
    <script src="../JS/historial.js"></script>

</body>

</html>