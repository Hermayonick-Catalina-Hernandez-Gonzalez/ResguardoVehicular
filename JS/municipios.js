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

    $("#municipio").autocomplete({
        source: municipiosTamaulipas,
        select: function (event, ui) {
            localStorage.setItem("municipio", ui.item.value);
        }
    });

    let savedMunicipio = localStorage.getItem("municipio");
    if (savedMunicipio) {
        $("#municipio").val(savedMunicipio);
    }

    $("#municipio").on("input", function () {
        localStorage.setItem("municipio", $(this).val());
    });

    $("#formularioResguardante").submit(function (e) {
        let municipioValue = $("#municipio").val();
        if (municipioValue.trim() === "") {
            e.preventDefault(); 
            Swal.fire({
                icon: "warning",
                title: "Campo obligatorio",
                text: "El campo Municipio es obligatorio.",
                confirmButtonText: "Aceptar",
                backdrop: false
            });
        }
    });
});
