/* Autores: Mariana Gómez Munist - Nro de estudiante: 207978
            Lucero Scigliano - Nro de estudiante: 292302 */

class Influencer {
    constructor(nombre, mail, comision) {
        this.nombre = nombre;
        this.mail = mail;
        this.comision = comision; // número, ej: 10 (representa 10%)
    }
}

class Articulo {
    constructor(codigo, descripcion, precio) {
        this.codigo = codigo;
        this.descripcion = descripcion;
        this.precio = precio; // número
    }
}

class Venta {
    constructor(numero, articulo, influencer, cantidad, medio) {
        this.numero = numero;
        this.articulo = articulo;       // objeto Articulo
        this.influencer = influencer;   // objeto Influencer
        this.cantidad = cantidad;       // número
        this.medio = medio;             // string, ej: "1-Instagram"
    }

    calcularTotal() {
        return this.articulo.precio * this.cantidad;
    }

    calcularComision() {
        return this.calcularTotal() * (this.influencer.comision / 100);
    }
}

class Sistema {
    constructor() {
        this.influencers = [];
        this.articulos = [];
        this.ventas = [];
        this.proximoNumeroVenta = 1;
    }

    // INFLUENCERS

    agregarInfluencer(influencer) {
        if (this.buscarInfluencerPorMail(influencer.mail)) {
            return false;
        }
        this.influencers.push(influencer);
        return true;
    }

    buscarInfluencerPorMail(mail) {
        for (let i = 0; i < this.influencers.length; i++) {
            if (this.influencers[i].mail.toLowerCase() === mail.toLowerCase()) {
                return this.influencers[i];
            }
        }
        return null;
    }

    // ARTÍCULOS

    agregarArticulo(articulo) {
        if (this.buscarArticuloPorCodigo(articulo.codigo)) {
            return false;
        }
        this.articulos.push(articulo);
        return true;
    }

    buscarArticuloPorCodigo(codigo) {
        for (let i = 0; i < this.articulos.length; i++) {
            if (this.articulos[i].codigo.toLowerCase() === codigo.toLowerCase()) {
                return this.articulos[i];
            }
        }
        return null;
    }

    // VENTAS

    agregarVenta(articulo, influencer, cantidad, medio) {
        let venta = new Venta(this.proximoNumeroVenta, articulo, influencer, cantidad, medio);
        this.proximoNumeroVenta++;
        this.ventas.push(venta);
        return venta;
    }

    anularVenta(numero) {
        let seguir = true;
        for (let i = 0; i < this.ventas.length && seguir; i++) {
            if (this.ventas[i].numero === numero) {
                this.ventas.splice(i, 1);
                seguir = false;
            }
        }
    }

    // CÁLCULOS

    calcularTotalComisionInfluencer(influencer) {
        let total = 0;
        for (let i = 0; i < this.ventas.length; i++) {
            if (this.ventas[i].influencer.mail === influencer.mail) {
                total += this.ventas[i].calcularComision();
            }
        }
        return total;
    }

    // Devuelve el influencer con mayor total de comisiones (o null si no hay ventas)
    influencerTopComision() {
        let max = -1;
        let top = null;
        for (let i = 0; i < this.influencers.length; i++) {
            let total = this.calcularTotalComisionInfluencer(this.influencers[i]);
            if (total > max) {
                max = total;
                top = this.influencers[i];
            }
        }
        // Solo es top ventas si cobró algo
        if (max <= 0) {
            return null;
        }
        return top;
    }

    // Devuelve el influencer con la venta más cara (mayor monto en una sola venta)
    influencerVentaMasCara() {
        let maxMonto = -1;
        let top = null;
        for (let i = 0; i < this.ventas.length; i++) {
            let monto = this.ventas[i].calcularTotal();
            if (monto > maxMonto) {
                maxMonto = monto;
                top = this.ventas[i].influencer;
            }
        }
        return top;
    }

    // Devuelve true si el influencer no tiene ninguna venta
    influencerSinVentas(influencer) {
        for (let i = 0; i < this.ventas.length; i++) {
            if (this.ventas[i].influencer.mail === influencer.mail) {
                return false;
            }
        }
        return true;
    }

    // Devuelve el artículo con mayor cantidad de unidades vendidas (o null si no hay ventas)
    articuloMasVendido() {
        if (this.ventas.length === 0) {
            return null;
        }
        let maxCantidad = -1;
        let top = null;
        for (let i = 0; i < this.articulos.length; i++) {
            let total = 0;
            for (let j = 0; j < this.ventas.length; j++) {
                if (this.ventas[j].articulo.codigo === this.articulos[i].codigo) {
                    total += this.ventas[j].cantidad;
                }
            }
            if (total > maxCantidad) {
                maxCantidad = total;
                top = this.articulos[i];
            }
        }
        // Solo si vendió algo
        if (maxCantidad <= 0) {
            return null;
        }
        return top;
    }

    // Devuelve las ventas de un influencer ordenadas por número creciente
    ventasDeInfluencer(influencer) {
        let resultado = [];
        for (let i = 0; i < this.ventas.length; i++) {
            if (this.ventas[i].influencer.mail === influencer.mail) {
                resultado.push(this.ventas[i]);
            }
        }
        // Ordenar por número creciente (burbuja)
        for (let i = 0; i < resultado.length - 1; i++) {
            for (let j = 0; j < resultado.length - 1 - i; j++) {
                if (resultado[j].numero > resultado[j + 1].numero) {
                    let temp = resultado[j];
                    resultado[j] = resultado[j + 1];
                    resultado[j + 1] = temp;
                }
            }
        }
        return resultado;
    }

    // Devuelve total vendido en pesos por cada medio (array de 6 posiciones, índice 0 = Instagram)
    totalVentasPorMedio() {
        let totales = [0, 0, 0, 0, 0, 0];
        for (let i = 0; i < this.ventas.length; i++) {
            let medio = this.ventas[i].medio;
            // medio es "1-Instagram", "2-YouTube", etc.
            let numero = parseInt(medio);
            if (numero >= 1 && numero <= 6) {
                totales[numero - 1] += this.ventas[i].calcularTotal();
            }
        }
        return totales;
    }
}