$(document).ready(function () {
    let municipiosTamaulipas = [
        "Abasolo", "Aldama", "Altamira", "Antiguo Morelos", "Burgos", "Bustamante", "Camargo",
        "Casas", "Ciudad Madero", "Cruillas", "Gómez Farías", "González", "Güémez",
        "Guerrero", "Gustavo Díaz Ordaz", "Hidalgo", "Jaumave", "Jiménez", "Llera",
        "Mainero", "El Mante", "Matamoros", "Méndez", "Mier", "Miguel Alemán",
        "Miquihuana", "Nuevo Laredo", "Nuevo Morelos", "Ocampo", "Padilla", "Palmillas",
        "Reynosa", "Río Bravo", "San Carlos", "San Fernando", "San Nicolás", "Soto la Marina",
        "Tampico", "Tula", "Valle Hermoso", "Victoria", "Villagrán", "Xicoténcatl"
    ];

    // Autocompletar municipios
    $("#municipio").autocomplete({
        source: municipiosTamaulipas,
        select: function (event, ui) {
            localStorage.setItem("municipio", ui.item.value);
        }
    });

    // Restaurar el valor guardado en localStorage al recargar la página
    let savedMunicipio = localStorage.getItem("municipio");
    if (savedMunicipio) {
        $("#municipio").val(savedMunicipio);
    }

    // Guardar en localStorage cuando el usuario escriba
    $("#municipio").on("input", function () {
        localStorage.setItem("municipio", $(this).val());
    });

    // Antes de enviar el formulario, asegurarnos de que el valor de municipio esté presente
    $("#formularioResguardante").submit(function (e) {
        let municipioValue = $("#municipio").val();
        if (municipioValue.trim() === "") {
            e.preventDefault(); // Evitar el envío si municipio está vacío
            alert("El campo Municipio es obligatorio.");
        }
    });
});
