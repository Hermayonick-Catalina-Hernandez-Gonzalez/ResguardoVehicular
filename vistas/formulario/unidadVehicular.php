<?php
session_start();
if (!isset($_SESSION['usuario_id'])) {
    header("Location: ../../index.php"); 
    exit();
}'
'
?>
<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Unidad Vehicular</title>
    <link rel="shortcut icon" href="../../img/Icono.png" />
    <link rel="stylesheet" href="../../css/stylesformulario.css">
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
</head>

<body>
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

    <div class="right-section">
        <h1>Datos Vehiculares</h1>
        <form id="formularioVehiculo">
            <div class="form-row">
                <div class="form-group">
                    <label for="numero_economico">Número Económico:</label>
                    <input type="text" id="numero_economico" name="numero_economico" required  onchange="buscarVehiculo()">
                </div>

                <div class="form-group">
                    <label for="placa">Placa:</label>
                    <input type="text" id="placa" name="placa" required>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="numero_serie">Serie:</label>
                    <input type="text" id="numero_serie" name="numero_serie" required onchange="buscarVehiculo()">
                </div>
                <div class="form-group">
                    <label for="color">Color:</label>
                    <input type="text" id="color" name="color" required>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="clase_vehiculo">Clase:</label>
                    <input type="text" id="clase_vehiculo" name="clase_vehiculo" required>
                </div>
                <div class="form-group">
                    <label for="marca_vehiculo">Marca:</label>
                    <input type="text" id="marca_vehiculo" name="marca_vehiculo" required>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="submarca">Submarca:</label>
                    <input type="text" id="submarca" name="submarca" required>
                </div>
                <div class="form-group">
                    <label for="modelo_vehiculo">Modelo:</label>
                    <input type="text" id="modelo_vehiculo" name="modelo_vehiculo" required>
                </div>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label for="propio">Propio:</label>
                    <input type="radio" id="propio" name="tipo_condicion" value="propio">
                </div>
                <div class="form-group">
                    <label for="aprendado">Arrendado:</label>
                    <input type="radio" id="arrendado" name="tipo_condicion" value="arrendado">
                </div>
                <div class="form-group">
                    <label for="decomisado">Decomisado:</label>
                    <input type="radio" id="decomisado" name="tipo_condicion" value="decomisado">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="kilometraje">Kilómetraje:</label>
                    <input type="number" id="kilometraje" name="kilometraje" required>
                </div>
            </div>
            <label for="tipo_ocupacion">Tipo de Ocupación:</label>
            <select id="tipo_ocupacion" name="tipo_ocupacion">
                <option value="" disabled selected>Seleccione una opción</option>
                <option value="operativo">Operativo</option>
                <option value="administrativo">Administrativo</option>
            </select>

        </form>
        <button class="btn" type="button" onclick="guardarVehiculo()">Siguiente</button>
    </div>

    <script src="../../JS/acciones.js"></script>
    <script src="../../JS/unidadVehicular.js"></script>
</body>

</html>