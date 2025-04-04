<?php
require_once "../php/conexion.php";
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
                $_SESSION['rol'] = $usuario['rol'];

                if ($_SESSION['rol'] === 'verificador') {
                    header("Location: ../vistas/formulario/resguardante.php");
                } elseif ($_SESSION['rol'] === 'resguardante') {
                    header("Location: ../vistas/inicio.php");
                } elseif ($_SESSION['rol'] === 'administrador') {
                    header("Location: ../vistas/administrador.php");
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
