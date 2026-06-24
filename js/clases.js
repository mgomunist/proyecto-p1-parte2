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
}
  // --- Influencers ---
 
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


