/* Autores: Mariana Gómez Munist - Nro de estudiante: 207978
            Lucero Scigliano - Nro de estudiante: 292302 */

let sistema = new Sistema();
let ordenInfluencers = "asc"; // "asc" o "desc"
let ordenArticulos = "asc";

window.addEventListener("load", inicio);

function inicio() {
    // Botones para abrir modales de alta
    document.getElementById("btn-agregar-influencer").addEventListener("click", abrirModalInfluencer);
    document.getElementById("btn-agregar-articulo").addEventListener("click", abrirModalArticulo);
    document.getElementById("btn-agregar-venta").addEventListener("click", abrirModalVenta);

    // Botones Cancelar dentro de los modales
    document.getElementById("btn-cancelar-influencer").addEventListener("click", cerrarModalInfluencer);
    document.getElementById("btn-cancelar-articulo").addEventListener("click", cerrarModalArticulo);
    document.getElementById("btn-cancelar-venta").addEventListener("click", cerrarModalVenta);

    // Botones Agregar dentro de los modales
    document.getElementById("btn-confirmar-influencer").addEventListener("click", agregarInfluencer);
    document.getElementById("btn-confirmar-articulo").addEventListener("click", agregarArticulo);
    document.getElementById("btn-confirmar-venta").addEventListener("click", agregarVenta);

    // Botones de ordenamiento
    document.getElementById("btn-orden-influencers").addEventListener("click", toggleOrdenInfluencers);
    document.getElementById("btn-orden-articulos").addEventListener("click", toggleOrdenArticulos);

    actualizarTodo();
}

// MODALES

function abrirModalInfluencer() {
    limpiarFormularioInfluencer();
    document.getElementById("dialog-influencer").showModal();
}

function cerrarModalInfluencer() {
    document.getElementById("dialog-influencer").close();
}

function abrirModalArticulo() {
    limpiarFormularioArticulo();
    document.getElementById("dialog-articulo").showModal();
}

function cerrarModalArticulo() {
    document.getElementById("dialog-articulo").close();
}

function abrirModalVenta() {
    if (sistema.articulos.length === 0 || sistema.influencers.length === 0) {
        alert("Debe haber al menos un artículo y un influencer registrados para agregar una venta.");
        return;
    }
    limpiarFormularioVenta();
    cargarSelectsVenta();
    actualizarNumeroVenta();
    document.getElementById("dialog-venta").showModal();
}

function cerrarModalVenta() {
    document.getElementById("dialog-venta").close();
}

// LIMPIAR FORMULARIOS

function limpiarFormularioInfluencer() {
    document.getElementById("txt-nombre").value = "";
    document.getElementById("txt-mail").value = "";
    document.getElementById("txt-comision").value = "";
}

function limpiarFormularioArticulo() {
    document.getElementById("txt-codigo").value = "";
    document.getElementById("txt-descripcion").value = "";
    document.getElementById("txt-precio").value = "";
}

function limpiarFormularioVenta() {
    document.getElementById("txt-cantidad").value = "";
}

// ALTA INFLUENCER

function agregarInfluencer() {
    let nombre = document.getElementById("txt-nombre").value.trim();
    let mail = document.getElementById("txt-mail").value.trim();
    let comisionStr = document.getElementById("txt-comision").value.trim();

    if (nombre === "" || mail === "" || comisionStr === "") {
        alert("Todos los datos del influencer son requeridos.");
        return;
    }

    let comision = parseFloat(comisionStr);
    if (isNaN(comision) || comision < 0 || comision > 100) {
        alert("El porcentaje de comisión debe ser un número entre 0 y 100.");
        return;
    }

    if (!validarMail(mail)) {
        alert("El mail ingresado no tiene un formato válido.");
        return;
    }

    let influencer = new Influencer(nombre, mail, comision);
    let resultado = sistema.agregarInfluencer(influencer);

    if (!resultado) {
        alert("Ya existe un influencer con ese mail.");
        return;
    }

    cerrarModalInfluencer();
    actualizarTodo();
}

function validarMail(mail) {
    let arroba = mail.indexOf("@");
    if (arroba <= 0) {
        return false;
    }
    let punto = mail.indexOf(".", arroba);
    if (punto <= arroba + 1) {
        return false;
    }
    if (punto >= mail.length - 1) {
        return false;
    }
    return true;
}

// ALTA ARTÍCULO 

function agregarArticulo() {
    let codigo = document.getElementById("txt-codigo").value.trim();
    let descripcion = document.getElementById("txt-descripcion").value.trim();
    let precioStr = document.getElementById("txt-precio").value.trim();

    if (codigo === "" || descripcion === "" || precioStr === "") {
        alert("Todos los datos del artículo son requeridos.");
        return;
    }

    let precio = parseFloat(precioStr);
    if (isNaN(precio) || precio < 0) {
        alert("El precio debe ser un número mayor o igual a 0.");
        return;
    }

    let articulo = new Articulo(codigo, descripcion, precio);
    let resultado = sistema.agregarArticulo(articulo);

    if (!resultado) {
        alert("Ya existe un artículo con ese código.");
        return;
    }

    cerrarModalArticulo();
    actualizarTodo();
}

// ALTA VENTA 

function cargarSelectsVenta() {
    let selArticulo = document.getElementById("sel-articulo");
    selArticulo.innerHTML = "";
    for (let i = 0; i < sistema.articulos.length; i++) {
        let opcion = document.createElement("option");
        opcion.value = sistema.articulos[i].codigo;
        opcion.innerHTML = sistema.articulos[i].codigo + " - " + sistema.articulos[i].descripcion;
        selArticulo.appendChild(opcion);
    }

    let selInfluencer = document.getElementById("sel-influencer");
    selInfluencer.innerHTML = "";
    for (let i = 0; i < sistema.influencers.length; i++) {
        let opcion = document.createElement("option");
        opcion.value = sistema.influencers[i].mail;
        opcion.innerHTML = sistema.influencers[i].nombre;
        selInfluencer.appendChild(opcion);
    }
}

function actualizarNumeroVenta() {
    document.getElementById("span-nro-venta").innerHTML = sistema.proximoNumeroVenta;
}

function agregarVenta() {
    let codigoArticulo = document.getElementById("sel-articulo").value;
    let mailInfluencer = document.getElementById("sel-influencer").value;
    let cantidadStr = document.getElementById("txt-cantidad").value.trim();
    let medio = document.getElementById("sel-medio").value;

    if (cantidadStr === "") {
        alert("La cantidad es requerida.");
        return;
    }

    let cantidad = parseInt(cantidadStr);
    if (isNaN(cantidad) || cantidad <= 0) {
        alert("La cantidad debe ser un número entero mayor a 0.");
        return;
    }

    let articulo = sistema.buscarArticuloPorCodigo(codigoArticulo);
    let influencer = sistema.buscarInfluencerPorMail(mailInfluencer);

    if (!articulo || !influencer) {
        alert("Artículo o influencer no encontrado.");
        return;
    }

    sistema.agregarVenta(articulo, influencer, cantidad, medio);
    cerrarModalVenta();
    actualizarTodo();
}

// ANULAR VENTA 

function anularVenta(numero) {
    let confirmado = confirm("¿Está seguro que desea eliminar la venta Nro " + numero + "?");
    if (confirmado) {
        sistema.anularVenta(numero);
        actualizarTodo();
    }
}

// ORDENAMIENTO 

function toggleOrdenInfluencers() {
    if (ordenInfluencers === "asc") {
        ordenInfluencers = "desc";
    } else {
        ordenInfluencers = "asc";
    }
    actualizarTablaInfluencers();
}

function toggleOrdenArticulos() {
    if (ordenArticulos === "asc") {
        ordenArticulos = "desc";
    } else {
        ordenArticulos = "asc";
    }
    actualizarTablaArticulos();
}

function ordenarInfluencers(lista) {
    // Ordenamiento burbuja por nombre
    let copia = [];
    for (let i = 0; i < lista.length; i++) {
        copia.push(lista[i]);
    }
    for (let i = 0; i < copia.length - 1; i++) {
        for (let j = 0; j < copia.length - 1 - i; j++) {
            let comparacion = copia[j].nombre.toUpperCase().localeCompare(copia[j + 1].nombre.toUpperCase());
            if (ordenInfluencers === "asc" && comparacion > 0) {
                let temp = copia[j];
                copia[j] = copia[j + 1];
                copia[j + 1] = temp;
            } else if (ordenInfluencers === "desc" && comparacion < 0) {
                let temp = copia[j];
                copia[j] = copia[j + 1];
                copia[j + 1] = temp;
            }
        }
    }
    return copia;
}

function ordenarArticulos(lista) {
    let copia = [];
    for (let i = 0; i < lista.length; i++) {
        copia.push(lista[i]);
    }
    for (let i = 0; i < copia.length - 1; i++) {
        for (let j = 0; j < copia.length - 1 - i; j++) {
            let comparacion = copia[j].codigo.toUpperCase().localeCompare(copia[j + 1].codigo.toUpperCase());
            if (ordenArticulos === "asc" && comparacion > 0) {
                let temp = copia[j];
                copia[j] = copia[j + 1];
                copia[j + 1] = temp;
            } else if (ordenArticulos === "desc" && comparacion < 0) {
                let temp = copia[j];
                copia[j] = copia[j + 1];
                copia[j + 1] = temp;
            }
        }
    }
    return copia;
}

// ACTUALIZAR PANTALLA 

function actualizarTodo() {
    actualizarTablaInfluencers();
    actualizarTablaArticulos();
    actualizarTablaVentas();
    actualizarGraficoBurbujas();
}

function actualizarTablaInfluencers() {
    let tbody = document.getElementById("tbody-influencers");
    tbody.innerHTML = "";

    let topComision = sistema.influencerTopComision();
    let topVentaCara = sistema.influencerVentaMasCara();

    let lista = ordenarInfluencers(sistema.influencers);

    for (let i = 0; i < lista.length; i++) {
        let inf = lista[i];
        let total = sistema.calcularTotalComisionInfluencer(inf);
        let fila = tbody.insertRow();

        // Nombre
        let celdaNombre = fila.insertCell();
        celdaNombre.innerHTML = inf.nombre;

        // Mail
        let celdaMail = fila.insertCell();
        celdaMail.innerHTML = inf.mail;

        // Comisión
        let celdaComision = fila.insertCell();
        celdaComision.innerHTML = inf.comision + "%";

        // Total a cobrar
        let celdaTotal = fila.insertCell();
        celdaTotal.innerHTML = "$ " + total;

        // Etiquetas
        let celdaEtiquetas = fila.insertCell();
        let etiquetas = "";
        if (topComision !== null && topComision.mail === inf.mail) {
            etiquetas += "🔥";
        }
        if (sistema.influencerSinVentas(inf)) {
            etiquetas += "🧊";
        }
        if (topVentaCara !== null && topVentaCara.mail === inf.mail) {
            etiquetas += "🟢";
        }
        celdaEtiquetas.innerHTML = etiquetas;

        // Botón Ventas (detalle comisión)
        let celdaDetalle = fila.insertCell();
        let btn = document.createElement("button");
        btn.innerHTML = "Ventas";
        btn.addEventListener("click", crearMostrarDetalle(inf));
        celdaDetalle.appendChild(btn);
    }

    // Actualizar flecha del botón de orden
    let btnOrden = document.getElementById("btn-orden-influencers");
    if (ordenInfluencers === "asc") {
        btnOrden.innerHTML = "Nombre ↑";
    } else {
        btnOrden.innerHTML = "Nombre ↓";
    }
}

// Genera una función de cierre (closure) para mostrar el detalle del influencer
function crearMostrarDetalle(influencer) {
    return function () {
        mostrarDetalleInfluencer(influencer);
    };
}

function mostrarDetalleInfluencer(influencer) {
    let ventas = sistema.ventasDeInfluencer(influencer);
    let texto = "Ventas:\n";
    if (ventas.length === 0) {
        texto += "(No tiene ventas)";
    } else {
        for (let i = 0; i < ventas.length; i++) {
            let v = ventas[i];
            let total = v.calcularTotal();
            let comision = v.calcularComision();
            texto += "Nro " + v.numero + " → " + v.cantidad + "→" + v.articulo.codigo +
                " →$" + v.articulo.precio + "c/u Total $" + total +
                "→ Comisión: $" + comision + "\n";
        }
    }
    alert(texto);
}

function actualizarTablaArticulos() {
    let tbody = document.getElementById("tbody-articulos");
    tbody.innerHTML = "";

    let topMasVendido = sistema.articuloMasVendido();
    let lista = ordenarArticulos(sistema.articulos);

    for (let i = 0; i < lista.length; i++) {
        let art = lista[i];
        let fila = tbody.insertRow();

        let celdaCodigo = fila.insertCell();
        let textoCodigo = art.codigo;
        if (topMasVendido !== null && topMasVendido.codigo === art.codigo) {
            textoCodigo += " ⭐";
        }
        celdaCodigo.innerHTML = textoCodigo;

        let celdaDesc = fila.insertCell();
        celdaDesc.innerHTML = art.descripcion;

        let celdaPrecio = fila.insertCell();
        celdaPrecio.innerHTML = "$ " + art.precio;
    }

    // Actualizar flecha del botón de orden
    let btnOrden = document.getElementById("btn-orden-articulos");
    if (ordenArticulos === "asc") {
        btnOrden.innerHTML = "Código ↑";
    } else {
        btnOrden.innerHTML = "Código ↓";
    }
}

function actualizarTablaVentas() {
    let tbody = document.getElementById("tbody-ventas");
    tbody.innerHTML = "";

    for (let i = 0; i < sistema.ventas.length; i++) {
        let v = sistema.ventas[i];
        let fila = tbody.insertRow();

        let celdaNro = fila.insertCell();
        celdaNro.innerHTML = v.numero;

        let celdaArticulo = fila.insertCell();
        celdaArticulo.innerHTML = v.articulo.codigo;

        let celdaInfluencer = fila.insertCell();
        celdaInfluencer.innerHTML = v.influencer.nombre;

        let celdaCantidad = fila.insertCell();
        celdaCantidad.innerHTML = v.cantidad;

        let celdaMedio = fila.insertCell();
        celdaMedio.innerHTML = v.medio;

        let celdaAccion = fila.insertCell();
        let btn = document.createElement("button");
        btn.innerHTML = "❌";
        btn.classList.add("btn-eliminar");
        btn.addEventListener("click", crearAnularVenta(v.numero));
        celdaAccion.appendChild(btn);
    }
}

function crearAnularVenta(numero) {
    return function () {
        anularVenta(numero);
    };
}

// GRÁFICO DE BURBUJAS

function actualizarGraficoBurbujas() {
    let canvas = document.getElementById("canvas-burbujas");
    let ctx = canvas.getContext("2d");
    let totales = sistema.totalVentasPorMedio();
    let etiquetas = ["1 - Instagram", "2 - YouTube", "3 - X", "4 - TikTok", "5 - Facebook", "6 - Otras"];
    let colores = ["#ff2b14", "#0062a3", "#0f813f", "#ebc623", "#a01873", "#81251e"];

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let maxValor = 0;
    for (let i = 0; i < totales.length; i++) {
        if (totales[i] > maxValor) {
            maxValor = totales[i];
        }
    }

    let radioMax = 50;
    let radioMin = radioMax * 0.10; // 10% del radio máximo para el mínimo

    let n = totales.length;
    let anchoZona = canvas.width / n;
    let centroY = canvas.height / 2 - 20;

    for (let i = 0; i < n; i++) {
        let radio;
        if (maxValor === 0) {
            radio = radioMin;
        } else if (totales[i] === 0) {
            radio = radioMin;
        } else {
            // Escalar proporcionalmente entre radioMin y radioMax
            radio = radioMin + (totales[i] / maxValor) * (radioMax - radioMin);
        }

        let centroX = anchoZona * i + anchoZona / 2;

        // Dibujar burbuja
        ctx.beginPath();
        ctx.arc(centroX, centroY, radio, 0, 2 * Math.PI);
        ctx.fillStyle = colores[i];
        ctx.fill();
        ctx.closePath();

        // Texto dentro de la burbuja (monto)
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 11px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("$" + totales[i], centroX, centroY);

        // Etiqueta debajo
        ctx.fillStyle = "#333333";
        ctx.font = "11px Arial";
        ctx.textBaseline = "top";
        ctx.fillText(etiquetas[i], centroX, centroY + radioMax + 8);
    }
}