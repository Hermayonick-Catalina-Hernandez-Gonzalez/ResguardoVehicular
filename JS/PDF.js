function verPDF() {
    const vehiculoId = localStorage.getItem("vehiculo_id");
    
    if (vehiculoId) {
        obtenerDatosVehiculo(vehiculoId, false);
    } else {
        alert("No se encontró el ID del vehículo.");
    }
}

function descargarPDFs() {
    const vehiculoId = localStorage.getItem("vehiculo_id");
    if (vehiculoId) {
        obtenerDatosVehiculo(vehiculoId, true); 
    } else {
        alert("No se encontró el ID del vehículo.");
    }
}


function obtenerDatosVehiculo(vehiculoId, descargar) {
    fetch('http://localhost/xampp/VehiculosSQLSERVE/php/obtenerHistorial.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `vehiculo_id=${vehiculoId}`
    })
        .then(response => response.json())
        .then(data => {
            if (data.error || !data.marca || !data.modelo || !data.placa) {
                alert("Datos del vehículo no disponibles.");
            } else {
                if (descargar) {
                    generarYDescargarPDFs(data);
                } else {
                    generarYGuardarPDFs(data, vehiculoId);
                    generarVistaPreviaPDFs(data);
                }
            }
        })
        .catch(error => {
            alert("Error al obtener los datos del vehículo.");
        });
}

function generarYGuardarPDFs(vehiculo, vehiculoId) {
    const { jsPDF } = window.jspdf;
    const img = new Image();
    img.src = '../../img/Logo.png';

    img.onload = function () {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const imgData = canvas.toDataURL('image/png');

        let pdf1 = generarPDF1(imgData, vehiculo, true);
        let pdf2 = generarPDF2(imgData, vehiculo, true);

        let pdfBlob1 = pdf1.output("blob");
        let pdfBlob2 = pdf2.output("blob");

        let file1 = new File([pdfBlob1], "Reglas_Vehiculo.pdf", { type: "application/pdf" });
        let file2 = new File([pdfBlob2], "Resguardo_Vehiculo.pdf", { type: "application/pdf" });

        // **Enviar PDFs al servidor**
        subirPDF(file1, vehiculoId);
        subirPDF(file2, vehiculoId);
    };
}

function subirPDF(pdfFile, vehiculoId) {
    let formData = new FormData();
    formData.append("vehiculo_id", vehiculoId);
    formData.append("archivo", pdfFile);

    fetch('http://localhost/xampp/VehiculosSQLSERVE/php/guardarPDF.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.text()) 
    .then(data => {
        
    })
    .catch(error => console.error("❌ Error en la solicitud:", error));
}


function generarVistaPreviaPDFs(vehiculo) {
    const { jsPDF } = window.jspdf;
    const img = new Image();
    img.src = '../../img/Logo.png';

    img.onload = function () {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const imgData = canvas.toDataURL('image/png');

        // Generar PDFs para vista previa
        let pdf1 = generarPDF1(imgData, vehiculo, false); // false = solo vista previa
        let pdf2 = generarPDF2(imgData, vehiculo, false);

        document.getElementById("preview1").src = pdf1;
        document.getElementById("preview2").src = pdf2;
    };
}

function generarYDescargarPDFs(vehiculo) {
    const { jsPDF } = window.jspdf;
    const img = new Image();
    img.src = '../../img/Logo.png';

    img.onload = function () {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const imgData = canvas.toDataURL('image/png');

        let pdf1 = generarPDF1(imgData, vehiculo, true); // true = descargar
        let pdf2 = generarPDF2(imgData, vehiculo, true);

        pdf1.save("Reglas_Vehiculo.pdf");
        pdf2.save("Resguardo_Vehiculo.pdf");
    };
}

function generarPDF1(imgData, vehiculo, descargar) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: [612, 1300]
    });

    doc.addImage(imgData, 'PNG', 40, 30, 80, 40);

    doc.setFontSize(12);
    doc.setTextColor(255, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.text("N° 0342", 500, 70);

    // Restablecer color a negro para el resto del documento
    doc.setTextColor(0, 0, 0);

    // **Tabla de información del vehículo**
    doc.autoTable({
        startY: 80,
        head: [["MARCA", "SUBMARCA", "SERIE", "MODELO", "PLACA", "N° ECO"]],
        body: [
            [vehiculo.marca, vehiculo.submarca, vehiculo.serie, vehiculo.modelo, vehiculo.placa, vehiculo.numero_economico],
            [{ content: "AREA", styles: { textColor: [255, 255, 255], fontStyle: "bold" } },
            { content: vehiculo.departamento_area, colSpan: 5, styles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], halign: "center" } }]
        ],
        theme: "grid",
        styles: {
            fontSize: 10,
            cellPadding: 5,
            halign: "center",
            fillColor: [26, 35, 65],
            textColor: [0, 0, 0]
        },
        headStyles: {
            fillColor: [26, 35, 65],
            textColor: [255, 255, 255]
        },
        alternateRowStyles: {
            fillColor: [240, 240, 240]
        }
    });

    let y = doc.autoTable.previous.finalY + 20;

    // **Lista de reglas**
    const reglas = [
        "1.- Las unidades deberán ser conducidas por servidores públicos que conozcan el Reglamento de Tránsito en vigor y cuenten con licencia para conducir vigente y credencial institucional de la FGJET.",
        "2.- El usuario es responsable de mantener la unidad en perfectas condiciones de uso, por lo que deberá cumplir con los programas de revisión y mantenimiento preventivo y/o correctivo, según se mencione en la póliza de garantía del vehículo.",
        "3.- El usuario no deberá transferir la unidad a otro usuario sin previo aviso por escrito a la Dirección de Recursos Materiales y Servicios, para que se genere un nuevo formato de resguardo vehicular",
        "4.- El usuario no podrá realizar cambios en las características físicas de la unidad.",
        "5.- El vehículo no se destinará para uso distinto del entregado, ni podrá subarrendar ni prestarlo; de lo contrario, el usuario será responsable por los daños y perjuicios que pudieran ocasionarse.",
        "6.- El usuario se obliga a entregar el vehículo en el momento que se requiera por la Dirección de Recursos Materiales y Servicios, entregándose en el mismo contexto y estado físico con el que se recibió (pese al desgaste natural del vehículo), con todos sus accesorios.",
        "7.- El usuario tiene la responsabilidad de carácter administrativo, por cualquier daño y/o faltante ocasionado intencionalmente, por negligencia, mal uso, etc.., de la unidad que tenga Asignada, así como de la documentación, placas, llaves, equipo y accesorios entregados a su cuidado.",
        "8.- Será responsabilidad del El Usuario, una vez que reciba la documentación oficial (tarjeta de circulación, holograma y copia de la póliza de seguro) colocarla en la unidad, a fin de que circule con documentos actualizados.",
        "9.- En caso de colisión o accidente, El usuario sea responsable en cualquiera de las modalidades, este deberá cubrir todos lo daños, multas y demás conceptos derivados que no sean cubiertos por el seguro y deberá reportar de manera inmediata el siniestro a la aseguradora y dar aviso por escrito , en un plazo no mayor de 72 horas a la Dirección General de Administración, para determinar las responsabilidades a las que pudiera ser acreedor, y de igual forma se le dará vista a la Dirección de Recursos Materiales y Servicios.",
        "10.- En caso de colisión o accidente El  Usuario será responsable de la  verificación y situación que guarde con relación a la reparación efectuada a la unidad, debiendo notificar por escrito a la Dirección el estatus de esta.",
        "11.- En caso de robo o incendio parcial o total de la unidad, El Usuario deberá levantar el acta correspondiente ante el ministerio Público y dar aviso a la Dirección General de Administración para los trámites correspondientes .",
        "12.- El Usuario, sin excepciones, está obligado a acudir a cualquier citatorio enviado por la Dirección General de Administración de esta Fiscalía General de Justicia del Estado de Tamaulipas, para realización de aclaraciones y/o revisiones relacionadas con las unidades que tiene asignadas.",
        "13.- El usuario será responsable de administrar y darle buen uso a la tarjeta de combustible asignada al vehículo; así como de comprobar en el tiempo establecido, el gasto de combustible asignado, dicha tarjeta no podrá ser utilizada para otro vehiculo .",
        "Cualquier acto u omisión a lo aquí establecido se regulará conforme a las atribuciones y responsabilidades inherentes al orden jurídico aplicable, la Ley de Responsabilidades Administrativas del Estado de Tamaulipas y el reglamento para el uso y control de vehículos oficiales.",
        "En caso de que se realice un cambio de resguardo, deberá ser informado a la Dirección General de Administración vía oficio y mediante correo electrónico a: actualizar.resguardovehicular@fgjtam.gob.tam en un plazo no mayor a 24 horas. En caso contrario, la responsabilidad por negligencia, mal uso, siniestro y cualquier uso indebido de la unidad oficial recaerá en el último resguardante registrado en esta Dirección General de Administración.",
        "Con fundamento en el artículo 93, fracción I del reglamento de la Ley Orgánica de la Fiscalía General de Justicia del Estado de Tamaulipas, así como en los capítulos segundo (numerales IV, V y VI) y tercero (numerales VII, VIII, IX, X, XI, XII, XIII, XIV, XV y XVI) de los Lineamientos para la asignación, uso y control de vehículos, combustibles y cajones de estacionamiento de la Fiscalía General de Justicia del Estado de Tamaulipas."
    ];

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);

    // Justificar el texto 
    reglas.forEach((texto) => {
        const lines = doc.splitTextToSize(texto, 520);
        lines.forEach((line, index) => {
            const lineY = y + (index * 15);
            doc.text(line, 40, lineY, {
                align: 'justify',
                lineHeightFactor: 1.5,
                maxWidth: 520
            });
        });
        y += lines.length * 15 + 10; 
    });


    y += 20; 

    doc.setFont("helvetica", "bold");
    doc.text("Firma del Resguardante Interno", doc.internal.pageSize.getWidth() / 2, y, { align: 'center' });
    y += 20;

    let firmaBase64 = localStorage.getItem("firmaBase64");
    if (firmaBase64) {
        doc.addImage(firmaBase64, "PNG", doc.internal.pageSize.getWidth() / 2 - 50, y, 100, 50);
    }

    y += 60; 
    doc.line(doc.internal.pageSize.getWidth() / 2 - 80, y, doc.internal.pageSize.getWidth() / 2 + 80, y);
    y += 10;
    doc.text("Nombre y Firma", doc.internal.pageSize.getWidth() / 2, y, { align: 'center' });

    if (descargar) {
        return doc; 
    } else {
        return doc.output("bloburl"); 
    }

}


function generarPDF2(imgData, vehiculo, descargar) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: [612, 1400]
    });

    doc.addImage(imgData, 'PNG', 40, 30, 80, 40);

    // Encabezado
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text("DIRECCIÓN GENERAL DE ADMINISTRACIÓN", 250, 50);
    doc.text("DIRECCIÓN DE RECURSOS MATERIALES Y SERVICIOS", 220, 60);
    doc.text("RESGUARDO VEHICULAR", 290, 70);
    doc.setFontSize(12);
    doc.setTextColor(255, 0, 0);

    doc.text("N° 0342", 500, 74);
    doc.setTextColor(0, 0, 0);

    let y = 100;

    function drawCell(x, y, width, height, text, fillColor = [255, 255, 255]) {
        doc.setFillColor(fillColor[0], fillColor[1], fillColor[2]);
        doc.rect(x, y, width, height, 'F'); // Relleno
        doc.rect(x, y, width, height); // Borde
        doc.setFontSize(9);
        doc.setTextColor(0, 0, 0);
        doc.text(text, x + 5, y + 13);
    }

    // Convertir la fecha a formato legible (dd/mm/yyyy)
    function formatFecha(fecha) {
        if (!fecha) return "Sin fecha"; // Si no hay fecha, mostrar texto alternativo
        let date = new Date(fecha);
        return date.toLocaleDateString("es-MX", { day: "2-digit", month: "2-digit", year: "numeric" });
    }

    // Datos generales 
    drawCell(40, y, 80, 20, "FECHA:", [220, 220, 220]);
    drawCell(110, y, 120, 20, formatFecha(vehiculo.fech));
    drawCell(220, y, 90, 20, "MUNICIPIO:", [220, 220, 220]);
    drawCell(300, y, 120, 20, vehiculo.municipio);
    drawCell(400, y, 80, 20, "FGJRM:", [220, 220, 220]);
    drawCell(480, y, 90, 20, vehiculo.FGJRM);
    y += 30;


    // Datos adicionales (resguardante, cargo, etc.)
    let fields = [
        { label: "RESGUARDANTE:", value: vehiculo.resguardante },
        { label: "CARGO:", value: vehiculo.cargo },
        { label: "LICENCIA:", value: vehiculo.licencia },
        { label: "VIGENCIA:", value: vehiculo.vigencia },
        { label: "FISCALÍA GENERAL:", value: vehiculo.fiscalia_general },
        { label: "FISCALÍA ESPECIALIZADA EN:", value: vehiculo.fiscalia_especializada_en },
        { label: "VICEFISCALÍA EN:", value: vehiculo.vicefiscalia_en },
        { label: "DIRECCIÓN GENERAL:", value: vehiculo.direccion_general },
        { label: "DEPARTAMENTO/ÁREA:", value: vehiculo.departamento_area }
    ];

    fields.forEach(field => {
        drawCell(40, y, 160, 20, field.label, [220, 220, 220]); // Celda con fondo gris
        drawCell(200, y, 370, 20, String(field.value || ""));  // Aseguramos que el valor sea un string
        y += 20;
    });
    y += 10;

    // Datos internos (resguardante interno, cargo, etc.)
    let internalFields = [
        { label: "RESGUARDANTE INTERNO:", value: vehiculo.resguardante_interno },
        { label: "CARGO:", value: vehiculo.cargo_interno },
        { label: "LICENCIA:", value: vehiculo.licencia_interna },
        { label: "VIGENCIA:", value: vehiculo.vigencia_interna },
        { label: "NÚMERO EMPLEADO:", value: vehiculo.numero_empleado_interno }, // Corregido: numero_empleado_interno
        { label: "CELULAR:", value: vehiculo.celular }
    ];

    internalFields.forEach(field => {
        drawCell(40, y, 160, 20, field.label, [220, 220, 220]); // Celda con fondo gris
        drawCell(200, y, 370, 20, String(field.value || ""));  // Aseguramos que el valor sea un string
        y += 20;
    });
    y += 10;

    // Datos de la unidad
    doc.setFont('helvetica', 'bold');
    doc.text("DATOS DE LA UNIDAD:", 250, 460);
    doc.setFont('helvetica', 'normal');
    y += 20;

    //tabla de unidad
    let unidadHeaders = ["PLACA", "N° ECONÓMICO", "SERIE", "COLOR"];
    let unidadData = [[vehiculo.placa, vehiculo.numero_economico, vehiculo.serie, vehiculo.color]];

    let unidadH = ["CLASE", "MARCA", "SUBMARCA", "MODELO"];
    let unidadD = [[vehiculo.clase, vehiculo.marca, vehiculo.submarca, vehiculo.modelo]];

    // Dibujar primera tabla (Unidad)
    doc.setFont('helvetica', 'bold');
    unidadHeaders.forEach((label, index) => {
        let cellX = 40 + (index * 130);
        let cellY = y + 10;
        doc.text(label, cellX + 65, cellY, { align: 'center' });
    });
    y += 17;

    doc.setFont('helvetica', 'normal');
    unidadData.forEach(row => {
        row.forEach((data, index) => {
            drawCell(40 + (index * 130), y, 130, 20, data);
        });
        y += 20;
    });
    y += 5;

    // Dibujar segunda tabla (Clase, Marca, etc.)
    doc.setFont('helvetica', 'bold');
    unidadH.forEach((label, index) => {
        let cellX = 40 + (index * 130);
        let cellY = y + 10;
        doc.text(label, cellX + 65, cellY, { align: 'center' });
    });
    y += 17;

    doc.setFont('helvetica', 'normal');
    unidadD.forEach(row => {
        row.forEach((data, index) => {
            drawCell(40 + (index * 130), y, 130, 20, data);
        });
        y += 20;
    });


    // Dibujar los recuadros alrededor de los textos y los cuadros de selección
    y += 10;
    // Definir los textos y sus posiciones
    let opciones = [
        { texto: "PROPIO:", x: 40, valor: "propio" },
        { texto: "ARRENDADO:", x: 180, valor: "arrendado" },
        { texto: "DECOMISADO:", x: 320, valor: "decomisado" }
    ];

    // Dibujar los recuadros alrededor de los textos y los cuadros de selección
    opciones.forEach(opcion => {
        let textWidth = doc.getTextWidth(opcion.texto) + 13;
        let rectHeight = 15; // Altura del rectángulo
        let padding = 5; // Espacio interno

        // Dibujar el rectángulo del texto
        doc.rect(opcion.x, y, textWidth, rectHeight);
        doc.text(opcion.texto, opcion.x + padding, y + 11);

        // Dibujar el cuadro de selección al lado derecho del texto
        let checkBoxSize = 12; // Tamaño del cuadro de selección
        let checkBoxX = opcion.x + textWidth + 5; // Posición del cuadro de selección
        doc.rect(checkBoxX, y, checkBoxSize, checkBoxSize);

        // Si la opción coincide con el estado de la base de datos, marcar con "X"
        if (vehiculo.estado === opcion.valor) {
            doc.text("X", checkBoxX + 3, y + 10);
        }
    });


    // Dibujar el texto "KM." con el valor del kilometraje
    doc.text("KM. " + String(vehiculo.kilometraje || ""), 420, y + 10);

    // Dibujar la línea debajo del bloque de opciones
    doc.line(40, y + 15, 560, y + 15);
    y += 35;

    function drawCell(x, y, width, height, text, fillColor = [255, 255, 255]) {
        if (!Array.isArray(fillColor) || fillColor.length !== 3 || fillColor.some(isNaN)) {
            fillColor = [255, 255, 255]; // Color blanco por defecto
        }
        doc.setFillColor(...fillColor);
        doc.rect(x, y, width, height, 'F'); // Relleno
        doc.rect(x, y, width, height); // Borde
        doc.setFontSize(9);
        doc.setTextColor(0, 0, 0);
        doc.text(String(text || ""), x + 5, y + 13);
    }

    //  **Verificaciones y Observaciones en Tablas**
    let verificaciones = Array.isArray(vehiculo.verificaciones) ? vehiculo.verificaciones : [];
    let observaciones = Array.isArray(vehiculo.observaciones) ? vehiculo.observaciones : [];

    const colWidthsExterior = [70, 35, 35, 35, 70, 35, 35, 35, 70, 35, 35, 35];
    const colWidthsInterior = [70, 35, 35, 35, 70, 35, 35, 35, 185];
    const cellHeight = 20;
    const startX = 40;
    let startY = y;

    doc.setFont('helvetica', 'bold');

    //  Dibujar encabezados de la tabla Exterior
    let tableHeadersExterior = ["Exterior", "B", "R", "M", "Exterior", "B", "R", "M", "Exterior", "B", "R", "M"];
    let xPos = startX;

    tableHeadersExterior.forEach((header, index) => {
        drawCell(xPos, startY, colWidthsExterior[index], cellHeight, header, [220, 220, 220]);
        xPos += colWidthsExterior[index];
    });
    startY += cellHeight;

    // **Configurar distribución de filas y columnas**
    const filasPorColumnaExterior = 9;
    let elementosExterior = verificaciones.filter(v => v.categoria === "Exterior");

    //  **Determinar cuántas columnas se necesitan**
    let totalColumnas = Math.ceil(elementosExterior.length / filasPorColumnaExterior);
    let filasDibujadas = 0;
    let columnaActual = 0;
    let startYExterior = startY;

    //  **Dibujar filas de Exterior**
    elementosExterior.forEach((ext, index) => {
        if (filasDibujadas === filasPorColumnaExterior) {
            //  **Moverse a la siguiente columna**
            columnaActual++;
            filasDibujadas = 0;
            startY = startYExterior; // Volver al inicio
            xPos = startX + (columnaActual * (70 + (35 * 3))); // Avanzar a la siguiente columna
        }

        xPos = startX + (columnaActual * (70 + (35 * 3))); // Ajustar la posición en la columna
        drawCell(xPos, startY, 70, cellHeight, ext.elemento);
        xPos += 70;

        let estadoIndex = { bien: 0, regular: 1, mal: 2 }[ext.estado?.toLowerCase()] ?? -1;
        for (let i = 0; i < 3; i++) {
            drawCell(xPos, startY, 35, cellHeight, estadoIndex === i ? "X" : "");
            xPos += 35;
        }

        startY += cellHeight;
        filasDibujadas++;
    });

    //  **Rellenar con celdas vacías para mantener la alineación**
    while (filasDibujadas < filasPorColumnaExterior) {
        xPos = startX + (columnaActual * (70 + (35 * 3)));
        drawCell(xPos, startY, 70, cellHeight, ""); // Celda vacía
        xPos += 70;

        for (let j = 0; j < 3; j++) {
            drawCell(xPos, startY, 35, cellHeight, ""); // Celda vacía
            xPos += 35;
        }

        startY += cellHeight;
        filasDibujadas++;
    }
    // Dibujar encabezados de la tabla Interior
    let tableHeadersInterior = ["Interior", "B", "R", "M", "Interior", "B", "R", "M", "Observaciones"];
    xPos = startX;
    tableHeadersInterior.forEach((header, index) => {
        drawCell(xPos, startY, colWidthsInterior[index], cellHeight, header, [220, 220, 220]);
        xPos += colWidthsInterior[index];
    });
    startY += cellHeight;

    // Obtener elementos de Interior
    let elementosInterior = verificaciones.filter(v => v.categoria === "Interior");

    //Variables para controlar el salto de columna
    const filasPorColumna = 5;
    let columnaActualIN = 0;
    let filasDibujadasIN = 0;
    let maxColumnas = Math.ceil(elementosInterior.length / filasPorColumna);
    let startYInicial = startY; // Guardamos la posición inicial

    //Dibujar filas de Interior
    elementosInterior.forEach((int, index) => {
        if (filasDibujadasIN === filasPorColumna) {
            // Pasar a la siguiente columna
            columnaActualIN++;
            filasDibujadasIN = 0;
            startY = startYInicial; // Volver arriba para la nueva columna
            xPos += 70 + (35 * 3); // Mover a la siguiente columna
        }

        xPos = startX + (columnaActualIN * (70 + (35 * 3))); // Ajustar posición
        drawCell(xPos, startY, 70, cellHeight, int.elemento);
        xPos += 70;

        let estadoIndex = { bien: 0, regular: 1, mal: 2 }[int.estado?.toLowerCase()] ?? -1;
        for (let i = 0; i < 3; i++) {
            drawCell(xPos, startY, 35, cellHeight, estadoIndex === i ? "X" : "");
            xPos += 35;
        }

        startY += cellHeight;
        filasDibujadasIN++;
    });

    xPos = startX + (maxColumnas * (70 + (35 * 3)));
    let alturaObservaciones = cellHeight * filasPorColumna;

    let observacionTexto = observaciones.map(obs => obs.observaciones).join("\n");
    drawCell(xPos, startYInicial, 185, alturaObservaciones, observacionTexto);

    startY = startYInicial + alturaObservaciones;
    let startYAccesorios = startY;
    // **Tabla de Accesorios**
    let tableHeadersAccesorios = ["Accesorio", "Sí", "No", "Accesorio", "Sí", "No", "Tipo de ocupación"];
    const colWidthsAccesorios = [80, 40, 40, 80, 40, 40, 215];

    doc.setFont('helvetica', 'bold');
    xPos = startX;

    //  Dibujar encabezados Accesorios
    tableHeadersAccesorios.forEach((header, index) => {
        drawCell(xPos, startYAccesorios, colWidthsAccesorios[index], cellHeight, header, [220, 220, 220]);
        xPos += colWidthsAccesorios[index];
    });

    startYAccesorios += cellHeight;

    // **Variables para el control de columnas**
    const filasPorColumnaAccesorios = 5;
    let columnaActualAcc = 0;
    let filasDibujadasAcc = 0;
    let startYAccesoriosInicial = startYAccesorios; // Guardamos la posición inicial

    //  **Filtrar accesorios**
    let accesorios = verificaciones.filter(v => v.categoria === "Accesorios");

    //  **Dibujar filas Accesorios**
    for (let i = 0; i < filasPorColumnaAccesorios * 2; i++) {
        if (filasDibujadasAcc === filasPorColumnaAccesorios) {
            // Pasar a la siguiente columna
            columnaActualAcc++;
            filasDibujadasAcc = 0;
            startYAccesorios = startYAccesoriosInicial; // Reiniciar Y para nueva columna
            xPos += 80 + (40 * 2); // Mover a la siguiente columna
        }

        xPos = startX + (columnaActualAcc * (80 + (40 * 2))); // Ajustar posición

        let verificacion = accesorios[i] || { elemento: "", estado: "" }; // Si no hay más elementos, dejar vacío
        drawCell(xPos, startYAccesorios, 80, cellHeight, verificacion.elemento);
        xPos += 80;

        // Determinar qué columna marcar según estado (Sí/No)
        let estadoIndex = verificacion.estado.toLowerCase() === "si" ? 0 : 1;
        for (let j = 0; j < 2; j++) {
            drawCell(xPos, startYAccesorios, 40, cellHeight, estadoIndex === j ? "X" : "");
            xPos += 40;
        }

        startYAccesorios += cellHeight;
        filasDibujadasAcc++;
    }

    //  **Dibujar Tipo de Ocupación como un cuadro alineado**
    xPos += 0
    drawCell(xPos, startYAccesoriosInicial, 215, cellHeight * filasPorColumnaAccesorios, vehiculo.ocupacion); // Cuadro grande

    let startYTexto = Math.max(startY, startYAccesorios); // Elegimos la mayor posición Y de las tablas
    startYTexto += 20; // Espacio extra antes del texto

    // **Dibujar el texto informativo**
    doc.setFont('helvetica', 'normal');
    let textoAviso = "AL MOMENTO DE CAMBIO DE RESGUARDANTE DEL VEHÍCULO, DEBERÁ INFORMAR A LA " +
        "DIRECCIÓN GENERAL DE ADMINISTRACIÓN DE FORMA INMEDIATA, " +
        "al correo: actualizar.reguardovehicular@fgjtam.gob.mx " +
        "o a los tels. 834 318 51 00 ext. 70258 y 70234.";

    // **Ajustar el texto para que no se salga del margen**
    let textoFormateado = doc.splitTextToSize(textoAviso, 550);
    doc.text(textoFormateado, 40, startYTexto);

    let alturaTexto = doc.getTextDimensions(textoFormateado).h;
    startYTexto += alturaTexto + 10;

    // **Obtener las primeras 4 imágenes del vehículo**
    let imagenes = Array.isArray(vehiculo.fotos) ? vehiculo.fotos.slice(0, 4) : [];

    // **Tamaño y posición de las imágenes**
    const imgWidth = 180;
    const imgHeight = 70;
    const espacioEntreImagenes = 20;
    const margenIzquierdo = (doc.internal.pageSize.getWidth() - (imgWidth * 2 + espacioEntreImagenes)) / 2; // Centrado

    // **Función para cargar una imagen y convertirla a base64**
    function cargarImagen(foto) {
        return new Promise((resolve) => {
            let imgElement = new Image();
            imgElement.src = `http://localhost/xampp/VehiculosSQLSERVE//vehiculos/${foto.nombre_archivo}`;
            imgElement.crossOrigin = "Anonymous";

            imgElement.onload = function () {
                let canvas = document.createElement("canvas");
                canvas.width = imgElement.width;
                canvas.height = imgElement.height;
                let ctx = canvas.getContext("2d");
                ctx.drawImage(imgElement, 0, 0);
                let base64Image = canvas.toDataURL("image/png");
                resolve(base64Image);
            };

            imgElement.onerror = function () {
                resolve(null);
            };
        });
    }

    Promise.all(imagenes.map(foto => cargarImagen(foto))).then(cargas => {
        cargas.forEach((base64Image, index) => {
            if (base64Image) {
                let imgX = margenIzquierdo + (index % 2) * (imgWidth + espacioEntreImagenes);
                let imgY = startYTexto + Math.floor(index / 2) * (imgHeight + espacioEntreImagenes);

                doc.addImage(base64Image, "PNG", imgX, imgY, imgWidth, imgHeight);
            }
        });

        // **Generar PDF y mostrar vista previa**
        let pdfBlob = doc.output("blob");
        let pdfURL = URL.createObjectURL(pdfBlob);
        document.getElementById("preview2").src = pdfURL;
    });

    y = 1300;
    const firmas = [
        "Resguardante Oficial",
        "Resguardante Interno",
        "Verificador",
        "Autorización Depto. REC. MAT"
    ];

    const pageWidth = doc.internal.pageSize.getWidth();
    const startXFirma = 40;
    const spacing = (pageWidth - startXFirma * 2) / firmas.length;

    firmas.forEach((texto, index) => {
        let x = startXFirma + index * spacing;
        doc.text(texto, x + spacing / 2, y, { align: "center" });

        let lineStartX = x + 10;
        let lineEndX = x + spacing - 10;
        doc.line(lineStartX, y + 40, lineEndX, y + 40);

    
        if (index === 1) {
            let firmaBase64 = localStorage.getItem("firmaBase64");
            if (firmaBase64) {
                doc.addImage(firmaBase64, "PNG", x + spacing / 2 - 50, y - 20, 100, 50);
            }
        }
    });


    if (descargar) {
        return doc; 
    } else {
        return doc.output("bloburl"); 
    }
}
