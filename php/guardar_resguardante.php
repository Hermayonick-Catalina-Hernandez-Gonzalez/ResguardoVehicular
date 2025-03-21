<?php
require '../php/conexion.php';

header('Content-Type: application/json');  
header("Access-Control-Allow-Origin: *");
$municipio = $_POST['municipio'];
$FGJRM = $_POST['FGJRM'];
$numeroEmpleado = $_POST['numero_empleado'];
$resguardante = $_POST['resguardante'];
$cargo = $_POST['cargo'];
$licencia = $_POST['licencia'];
$vigencia = $_POST['vigencia'];
$fiscaliaGeneral = $_POST['fiscalia_general'];
$fiscaliaEspecializada = $_POST['fiscalia_especializada_en'];
$vicefiscaliaEn = $_POST['vicefiscalia_en'];
$direccionGeneral = $_POST['direccion_general'];
$departamentoArea = $_POST['departamento_area'];
$numeroEmpleadoInterno = $_POST['numero_empleado_interno'];
$resguardanteInterno = $_POST['resguardante_interno'];
$cargoInterno = $_POST['cargo_interno'];
$licenciaInterna = $_POST['licencia_interna'];
$vigenciaInterna = $_POST['vigencia_interna'];
$celular = $_POST['celular'];

try {
    $sql = "INSERT INTO resguardante (
        municipio, FGJRM, numero_empleado, resguardante, cargo, licencia, vigencia,
        fiscalia_general, fiscalia_especializada_en, vicefiscalia_en, direccion_general,
        departamento_area, numero_empleado_interno, resguardante_interno, cargo_interno, 
        licencia_interna, vigencia_interna, celular
    ) VALUES (
        :municipio, :FGJRM, :numero_empleado, :resguardante, :cargo, :licencia, :vigencia,
        :fiscalia_general, :fiscalia_especializada_en, :vicefiscalia_en, :direccion_general,
        :departamento_area, :numero_empleado_interno, :resguardante_interno, :cargo_interno,
        :licencia_interna, :vigencia_interna, :celular
    )";

    $stmt = $conn->prepare($sql);
    $stmt->execute([
        ':municipio' => $municipio,
        ':FGJRM' => $FGJRM,
        ':numero_empleado' => $numeroEmpleado,
        ':resguardante' => $resguardante,
        ':cargo' => $cargo,
        ':licencia' => $licencia,
        ':vigencia' => $vigencia,
        ':fiscalia_general' => $fiscaliaGeneral,
        ':fiscalia_especializada_en' => $fiscaliaEspecializada,
        ':vicefiscalia_en' => $vicefiscaliaEn,
        ':direccion_general' => $direccionGeneral,
        ':departamento_area' => $departamentoArea,
        ':numero_empleado_interno' => $numeroEmpleadoInterno,
        ':resguardante_interno' => $resguardanteInterno,
        ':cargo_interno' => $cargoInterno,
        ':licencia_interna' => $licenciaInterna,
        ':vigencia_interna' => $vigenciaInterna,
        ':celular' => $celular
    ]);

    $resguardante_id = $conn->lastInsertId(); 

    echo json_encode([
        "success" => "Datos guardados correctamente",
        "resguardante_id" => $resguardante_id 
    ]);
} catch (Exception $e) {
    echo json_encode(["error" => "Error al guardar los datos: " . $e->getMessage()]);
}

exit;
