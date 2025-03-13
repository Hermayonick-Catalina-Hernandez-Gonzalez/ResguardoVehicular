<?php
session_start();
if (!isset($_SESSION['usuario_id'])) {
    header("Location: ../../index.php"); 
    exit();
}
?>
<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Resguardante</title>
    <link rel="shortcut icon" href="../../img/Icono.png" />
    <link rel="stylesheet" href="../../css/stylesformulario.css">
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <link rel="stylesheet" href="https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
</head>

<body>

    <!-- Menú lateral -->
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

    <!-- Sección del formulario -->
    <div class="right-section">
        <h1>Resguardo Vehicular</h1>
        <form id="formularioResguardante" action="../../php/guardar_resguardante.php" method="POST">
            <div class="form-row">
                <div class="form-group">
                    <label for="fecha">Fecha:</label>
                    <input type="date" id="fecha" name="fecha" disabled>
                </div>
                <div class="form-group">
                    <label for="municipio">Municipio:</label>
                    <input type="text" id="municipio" name="municipio" required>
                </div>
                <div class="form-group">
                    <label for="FGJRM">FGJRM:</label>
                    <input type="text" id="FGJRM" name="FGJRM" required>
                </div>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label for="numero_empleado">Número de Empleado:</label>
                    <input type="number" id="numero_empleado" name="numero_empleado" onblur="buscarEmpleado('numero_empleado')" required>
                </div>

                <!-- Resguardante -->
                <div class="form-group">
                    <label for="resguardante">Resguardante:</label>
                    <input type="text" id="resguardante" name="resguardante" required>
                </div>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label for="cargo">Cargo:</label>
                    <input type="text" id="cargo" name="cargo" required>
                </div>
                <div class="form-group">
                    <label for="licencia">Licencia:</label>
                    <input type="text" id="licencia" name="licencia" required>
                </div>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label for="vigencia">Vigencia:</label>
                    <input type="text" id="vigencia" name="vigencia" required>
                </div>
                <div class="form-group">
                    <label for="fiscalia_general">Fiscalía General:</label>
                    <input type="text" id="fiscalia_general" name="fiscalia_general" required>
                </div>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label for="fiscalia_especializada_en">Fiscalía Especializada en:</label>
                    <input type="text" id="fiscalia_especializada_en" name="fiscalia_especializada_en" required>
                </div>
                <div class="form-group">
                    <label for="vicefiscalia_en">Vicefiscalía en:</label>
                    <input type="text" id="vicefiscalia_en" name="vicefiscalia_en" required>
                </div>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label for="direccion_general">Dirección General:</label>
                    <input type="text" id="direccion_general" name="direccion_general" required>
                </div>
                <div class="form-group">
                    <label for="departamento_area">Departamento/Área:</label>
                    <input type="text" id="departamento_area" name="departamento_area" required>
                </div>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label for="numero_empleado_interno">Número de Empleado Interno:</label>
                    <input type="number" id="numero_empleado_interno" name="numero_empleado_interno" onblur="buscarEmpleado('numero_empleado_interno')" required>
                </div>
                <div class="form-group">
                    <label for="resguardante_interno">Resguardante Interno:</label>
                    <input type="text" id="resguardante_interno" name="resguardante_interno" required>
                </div>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label for="cargo_interno">Cargo:</label>
                    <input type="text" id="cargo_interno" name="cargo_interno" required>
                </div>
                <div class="form-group">
                    <label for="licencia_interna">Licencia:</label>
                    <input type="text" id="licencia_interna" name="licencia_interna" required>
                </div>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label for="vigencia_interna">Vigencia:</label>
                    <input type="text" id="vigencia_interna" name="vigencia_interna" required>
                </div>
                <div class="form-group">
                    <label for="celular">Celular:</label>
                    <input type="text" id="celular" name="celular" required>
                </div>
            </div>


            <button class="btn" type="button" onclick="guardarDatos()">Siguiente</button>
        </form>
    </div>

    <script src="../../JS/resguardante.js"></script>
    <script src="../../JS/municipios.js"></script>
</body>

</html>