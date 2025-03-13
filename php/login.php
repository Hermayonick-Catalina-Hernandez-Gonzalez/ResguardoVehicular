<?php
include "../php/conexion.php";
session_start();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $correo = $_POST['correo'];
    $contra = $_POST['contra'];

    try {
        $sql = "SELECT * FROM usuarios WHERE correo = ?";
        $stmt = $conn->prepare($sql);
        $stmt->execute([$correo]);
        $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($usuario) {
            if (password_verify($contra, $usuario['contra'])) {
                $_SESSION['usuario_id'] = $usuario['id'];
                $_SESSION['correo'] = $usuario['correo'];
                $_SESSION['rol'] = $usuario['rol'];  // Guardar el rol en la sesión

                // Redirigir según el rol
                if ($_SESSION['rol'] == 'verificador') {
                    header("Location: ../vistas/formulario/resguardante.php");  // Página para verificadores
                } elseif ($_SESSION['rol'] == 'resguardante') {
                    header("Location: ../vistas/inicio.php");  // Página para resguardantes
                }
                exit();
            } else {
                $_SESSION['error'] = "Contraseña incorrecta";
            }
        } else {
            $_SESSION['error'] = "No se encontró un usuario con ese correo";
        }
    } catch (PDOException $e) {
        $_SESSION['error'] = "Error de conexión: " . $e->getMessage();
    }

    header("Location: ../index.php");
    exit();
}
