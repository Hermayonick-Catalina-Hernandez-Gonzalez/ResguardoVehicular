<?php
require_once '../php/conexion.php';  

// Datos del primer usuario (Verificador)
$correo_verificador = "verificador@fgj.tam";
$contraseña_verificador = "verificador";
$rol_verificador = "verificador";  

// Datos del segundo usuario (Resguardante)
$correo_resguardante = "resguardante@fgj.tam";
$contraseña_resguardante = "resguardante";
$rol_resguardante = "resguardante";

// Encriptar las contraseñas con BCRYPT
$contraseña_encriptada_verificador = password_hash($contraseña_verificador, PASSWORD_BCRYPT);
$contraseña_encriptada_resguardante = password_hash($contraseña_resguardante, PASSWORD_BCRYPT);

try {
    // Iniciar transacción para insertar ambos usuarios
    $conn->beginTransaction();

    // Insertar el primer usuario (Verificador)
    $sql = "INSERT INTO usuarios (correo, contra, rol) VALUES (?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->execute([$correo_verificador, $contraseña_encriptada_verificador, $rol_verificador]);

    // Insertar el segundo usuario (Resguardante)
    $stmt->execute([$correo_resguardante, $contraseña_encriptada_resguardante, $rol_resguardante]);

    // Confirmar la transacción
    $conn->commit();

    echo "Usuarios creados con éxito.";
} catch (PDOException $e) {
    // En caso de error, deshacer la transacción
    $conn->rollBack();
    echo "Error al crear usuarios: " . $e->getMessage();
}

$conn = null; // Cerrar conexión
?>
