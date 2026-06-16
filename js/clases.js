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