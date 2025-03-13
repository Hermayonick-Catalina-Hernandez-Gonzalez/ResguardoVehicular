<?php
session_start();
if (!isset($_SESSION['usuario_id'])) {
    header("Location: ../../index.php"); 
    exit();
}
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Fotografías Vehicular</title>
    <link rel="shortcut icon" href="../../img/Icono.png" />
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.29/jspdf.plugin.autotable.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <link rel="stylesheet" href="../../css/stylesformulario.css">
</head>

<body>

    <!-- Barra lateral -->
    <div class="menu">
        <img src="../../img/Logo2.png" alt="Logo FGJ" class="logo">
        <nav>
            <ul>
                <li><a href="../formulario/resguardante.php" class="menu-link">Resguardante</a></li>
                <li><a href="../formulario/unidadVehicular.php" class="menu-link">Datos de la unidad</a></li>
                <li><a href="../formulario/verificacion.php" class="menu-link">Verificación</a></li>
                <li><a href="../formulario/fotografias.php" class="menu-link">Fotografías de la unidad</a></li>
            </ul>
        </nav>
        <button class="btn-salir" onclick="cerrar()">
            <img src="../../img/Salir.png" alt="Salir">Salir
        </button>
        <img src="../../img/Vehiculo.png" alt="Vehículo" class="vehiculo">
    </div>

    <!-- Sección principal -->
    <div class="right-section">
        <h1>Fotografías Vehicular</h1>
        <div class="foto-apartado-container">
            <div class="foto-apartado">
                <p>Lado Frontal:</p>
                <img src="../../img/agregar.png" alt="Foto Frontal" class="foto-preview" id="foto-frontal" onclick="abrirCamara('foto-frontal')">
                <textarea id="observaciones-foto-frontal" name="observaciones[]" rows="2" cols="5" placeholder="Observaciones"></textarea>
            </div>
            <div class="foto-apartado">
                <p>Lado Posterior:</p>
                <img src="../../img/agregar.png" alt="Foto Posterior" class="foto-preview" id="foto-posterior" onclick="abrirCamara('foto-posterior')">
                <textarea id="observaciones-foto-posterior" name="observaciones[]" rows="2" cols="5" placeholder="Observaciones"></textarea>
            </div>
        </div>
        <div class="foto-apartado-container">
            <div class="foto-apartado">
                <p>Lado Derecho:</p>
                <img src="../../img/agregar.png" alt="Foto Lado Derecho" class="foto-preview" id="foto-derecho" onclick="abrirCamara('foto-derecho')">
                <textarea id="observaciones-foto-derecho" name="observaciones[]" rows="2" cols="5" placeholder="Observaciones"></textarea>
            </div>
            <div class="foto-apartado">
                <p>Lado Izquierdo:</p>
                <img src="../../img/agregar.png" alt="Foto Lado Izquierdo" class="foto-preview" id="foto-izquierdo" onclick="abrirCamara('foto-izquierdo')">
                <textarea id="observaciones-foto-izquierdo" name="observaciones[]" rows="2" cols="5" placeholder="Observaciones"></textarea>
            </div>
        </div>
        <div class="foto-apartado-container">
            <div class="foto-apartado">
                <p>Kilometraje:</p>
                <img src="../../img/agregar.png" alt="Kilometraje" class="foto-preview" id="foto-kilometraje" onclick="abrirCamara('foto-kilometraje')">
                <textarea id="observaciones-foto-kilometraje" name="observaciones[]" rows="2" cols="5" placeholder="Observaciones"></textarea>
            </div>
            <div class="foto-apartado">
                <p>Numero de Serie:</p>
                <img src="../../img/agregar.png" alt="Numero de serie" class="foto-preview" id="numero-serie" onclick="abrirCamara('numero-serie')">
                <textarea id="observaciones-foto-numero-serie" name="observaciones[]" rows="2" cols="5" placeholder="Observaciones"></textarea>
            </div>
        </div>
        <button onclick="agregarFotoExtra()" class="btn">Agregar Fotografía Extra</button>
        <div id="extra-fotos-container"></div>
        <button type="button" onclick="guardar()" class="btn">Guardar</button>

    </div>

    <!-- Modal de Cámara -->
    <div id="modalCamara" class="modal">
        <div class="modal-content">
            <h2>Capturar Imagen</h2>
            <video id="video" autoplay></video>
            <canvas id="canvas" style="display: none;"></canvas>
            <br>
            <button onclick="tomarFoto()" class="btn-foto">Tomar Foto</button>
            <button onclick="cerrarCamara()" class="btn-close">Cerrar</button>
        </div>
    </div>

    <script src="../../JS/fotografias.js"></script>
    <script src="../../JS/acciones.js"></script>
    <script src="../../JS/PDF.js"></script>

</body>

</html>