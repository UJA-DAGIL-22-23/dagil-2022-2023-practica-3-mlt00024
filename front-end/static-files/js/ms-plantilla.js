/**
 * @file Plantilla.js
 * @description Funciones para el procesamiento de la info enviada por el MS Plantilla
 * @author Víctor M. Rivas <vrivas@ujaen.es>
 * @date 03-feb-2023
 */

"use strict";

/// Creo el espacio de nombres
let Plantilla = {};

// Plantilla de datosDescargados vacíos
Plantilla.datosDescargadosNulos = {
    mensaje: "Datos Descargados No válidos",
    autor: "",
    email: "",
    fecha: ""
}


/**
 * Función que descarga la info MS Plantilla al llamar a una de sus rutas
 * @param {string} ruta Ruta a descargar
 * @param {función} callBackFn Función a la que se llamará una vez recibidos los datos.
 */
Plantilla.descargarRuta = async function (ruta, callBackFn) {
    let response = null

    // Intento conectar con el microservicio Plantilla
    try {
        const url = Frontend.API_GATEWAY + ruta
        response = await fetch(url)

    } catch (error) {
        alert("Error: No se han podido acceder al API Gateway")
        console.error(error)
        //throw error
    }

    // Muestro la info que se han descargado
    let datosDescargados = null
    if (response) {
        datosDescargados = await response.json()
        callBackFn(datosDescargados)
    }
}


/**
 * Función principal para mostrar los datos enviados por la ruta "home" de MS Plantilla
 */
Plantilla.mostrarHome = function (datosDescargados) {
    // Si no se ha proporcionado valor para datosDescargados
    datosDescargados = datosDescargados || this.datosDescargadosNulos

    // Si datos descargados NO es un objeto 
    if (typeof datosDescargados !== "object") datosDescargados = this.datosDescargadosNulos

    // Si datos descargados NO contiene el campo mensaje
    if (typeof datosDescargados.mensaje === "undefined") datosDescargados = this.datosDescargadosNulos

    Frontend.Article.actualizar("Plantilla Home", datosDescargados.mensaje)
}

/**
 * Función principal para mostrar los datos enviados por la ruta "acerca de" de MS Plantilla
 */
Plantilla.mostrarAcercaDe = function (datosDescargados) {
    // Si no se ha proporcionado valor para datosDescargados
    datosDescargados = datosDescargados || this.datosDescargadosNulos

    // Si datos descargados NO es un objeto 
    if (typeof datosDescargados !== "object") datosDescargados = this.datosDescargadosNulos

    // Si datos descargados NO contiene los campos mensaje, autor, o email
    if (typeof datosDescargados.mensaje === "undefined" ||
        typeof datosDescargados.autor === "undefined" ||
        typeof datosDescargados.email === "undefined" ||
        typeof datosDescargados.fecha === "undefined"
    ) datosDescargados = this.datosDescargadosNulos

    const mensajeAMostrar = `<div>
    <p>${datosDescargados.mensaje}</p>
    <ul>
        <li><b>Autor/a</b>: ${datosDescargados.autor}</li>
        <li><b>E-mail</b>: ${datosDescargados.email}</li>
        <li><b>Fecha</b>: ${datosDescargados.fecha}</li>
    </ul>
    </div>
    `;
    Frontend.Article.actualizar("Plantilla Acerca de", mensajeAMostrar)
}

/**
 * Función principal para mostrar los datos enviados por la ruta "get_jugadores" de MS Plantilla
 * @param {función} callBackFn Función a la que se llamará una vez recibidos los datos.
 */

Plantilla.recupera = async function (callBackFn) {
    let response = null

    // Intento conectar con el microservicio 
    try {
        const url = Frontend.API_GATEWAY + "/plantilla/get_jugadores"
        response = await fetch(url)

    } catch (error) {
        alert("Error: No se ha podido acceder al API Gateway")
        console.error(error)
        //throw error
    }

    // Muestro todos los jugadores que se han descargado
    let vjugadores = null
    if (response) {
        vjugadores = await response.json()
        callBackFn(vjugadores.data)
    }
}

/**
 * Función principal para responder al evento de elegir la opción "Home"
 */
Plantilla.procesarHome = function () {
    this.descargarRuta("/plantilla/", this.mostrarHome);
}

/**
 * Función principal para responder al evento de elegir la opción "Acerca de"
 */
Plantilla.procesarAcercaDe = function () {
    this.descargarRuta("/plantilla/acercade", this.mostrarAcercaDe);
}

// Tags que voy a usar para sustituir los campos
Plantilla.plantillaTags = {
    "nombre": "### nombre ###",
    "apellidos" : "### apellidos ###",
    "fnac": "### fnac ###",
    "equipos": "### equipos ###",
    "goles": "### goles ###",
}
/// Plantilla para poner los datos de varios jugadores dentro de una tabla
Plantilla.plantillaTablaJugadores = {}

// Cabecera de la tabla de jugadores
Plantilla.plantillaTablaJugadores.cabecera = `<table width="100%" class="listado-personas">
                    <thead>
                        <th width="20%">Nombre</th>
                        <th width="20%">Apellidos</th>
                    </thead>
                    <tbody>`;

// Elemento TR que muestra los nombres y apellidos de los jugadores
Plantilla.plantillaTablaJugadores.cuerpo = `
    <tr title="${Plantilla.plantillaTags.nombre}">
        <td>${Plantilla.plantillaTags.nombre}</td>
        <td>${Plantilla.plantillaTags.apellidos}</td>
        <td>
                    <div></div>
        </td>
    </tr>
    `;

// Pie de la tabla
//pie de la tabla 
Plantilla.plantillaTablaJugadores.pie = `</tbody>
</table>
`;

/**
 * Actualiza el cuerpo de la plantilla deseada con los datos del jugador que se le pasa
 * @param {String} plantilla Cadena conteniendo HTML en la que se desea cambiar los campos de la plantilla por datos
 * @param {Plantilla} jugador Objeto con los datos del jugador que queremos escribir en el TR
 * @returns La plantilla del cuerpo de la tabla con los datos actualizados 
 */ 
Plantilla.sustituyeTags = function (plantilla, jugador) {
    return plantilla
        //.replace(new RegExp(Plantilla.plantillaTags.nombre, 'g'), jugador.ref['@ref'].nombre)
        .replace(new RegExp(Plantilla.plantillaTags.nombre, 'g'), jugador.data.nombre)
        .replace(new RegExp(Plantilla.plantillaTags.apellidos, 'g'), jugador.data.apellidos)
}

/**
 * Función para mostrar en pantalla todos los nombres de los jugadores que se han recuperado de la BD.
 * @param {vector-de-jugadores} vector Vector con los datos de los jugadores a mostrar
 */

Plantilla.imprimenombres = function (vector) {
    let msj = Plantilla.plantillaTablaJugadores.cabecera
    if (vector && Array.isArray(vector)) {
        vector.forEach(e => msj += Plantilla.plantillaTablaJugadores.actualizajugador(e));
    }
    msj += Plantilla.plantillaTablaJugadores.pie

    Frontend.Article.actualizar("Nombres de los jugadores", msj)
}

/**
 * Actualiza el formulario con los datos del jugador que se le pasa
 * @param {Plantilla} Plantilla Objeto con los datos del jugador que queremos escribir en el TR
 * @returns La plantilla del cuerpo de la tabla con los datos actualizados 
 */
Plantilla.plantillaTablaJugadores.actualizajugador = function (jugador) {
    return Plantilla.sustituyeTags(this.cuerpo, jugador)
}

/**
 * Función principal para recuperar los jugadores desde el MS y, posteriormente, imprimirlos.
 */
Plantilla.procesarListaJugadores = function () {
    Plantilla.recupera(Plantilla.imprimenombres);
}

/**
 * Función que recuperar todos los jugadores llamando al MS Plantilla
 * @param {función} callBackFn Función a la que se llamará una vez recibidos los datos.
 */

Plantilla.recuperatodo = async function (callBackFn) {
    let response = null

    // Intento conectar con el microservicio 
    try {
        const url = Frontend.API_GATEWAY + "/plantilla/get_jugadores_completa"
        response = await fetch(url)

    } catch (error) {
        alert("Error: No se han podido acceder al API Gateway")
        console.error(error)
        //throw error
    }

    // Muestro todos los jugadores que se han descargado
    let vectorJugadores = null
    if (response) {
        vectorJugadores = await response.json()
        callBackFn(vectorJugadores.data)
    }
}

/**
 * Actualiza el cuerpo de la plantilla deseada con los datos del jugador que se le pasa
 * @param {String} plantilla Cadena conteniendo HTML en la que se desea cambiar los campos de la plantilla por datos
 * @param {Plantilla} jugador Objeto con los datos del jugador que queremos escribir en el TR
 * @returns La plantilla del cuerpo de la tabla con los datos actualizados 
 */ 
Plantilla.sustituyeTodosTags = function (plantilla, jugador) {
    return plantilla
        .replace(new RegExp(Plantilla.plantillaTags.nombre, 'g'), jugador.data.nombre)
        .replace(new RegExp(Plantilla.plantillaTags.apellidos, 'g'), jugador.data.apellidos)
        .replace(new RegExp(Plantilla.plantillaTags.fnac, 'g'), jugador.data.fnac.dia+"/"
                                        +jugador.data.fnac.mes+"/"+jugador.data.fnac.anio)
        .replace(new RegExp(Plantilla.plantillaTags["equipos"], 'g'), jugador.data.equipos)
        .replace(new RegExp(Plantilla.plantillaTags.goles, 'g'), jugador.data.goles)
}

/// Plantilla para poner los datos de varios jugadores dentro de una tabla
Plantilla.plantillaTablaJugadoresAll = {}

// Cabecera de la tabla de jugadores
Plantilla.plantillaTablaJugadoresAll.cabecera = `<table width="100%" class="listado-personas">
                    <thead>
                        <th width="20%">Nombre</th>
                        <th width="20%">Apellidos</th>
                        <th width="20%">Fecha de nacimiento</th>
                        <th width="20%">Equipos</th>
                        <th width="20%">Goles</th>
                    </thead>
                    <tbody>`;

// Elemento TR que muestra los datos de los jugadores
Plantilla.plantillaTablaJugadoresAll.cuerpo = `
    <tr title="${Plantilla.plantillaTags.nombre}">
        <td>${Plantilla.plantillaTags.nombre}</td>
        <td>${Plantilla.plantillaTags.apellidos}</td>
        <td>${Plantilla.plantillaTags.fnac}</td>
        <td>${Plantilla.plantillaTags["equipos"]}</td>
        <td>${Plantilla.plantillaTags.goles}</td>
        <td>
                    <div></div>
        </td>
    </tr>
    `;

// Pie de la tabla
Plantilla.plantillaTablaJugadoresAll.pie = `</tbody>
</table>
`;

             /**
 * Actualiza el formulario con los datos del jugador que se le pasa
 * @param {Plantilla} Plantilla Objeto con los datos del jugador que queremos escribir en el TR
 * @returns La plantilla del cuerpo de la tabla con los datos actualizados 
 */

Plantilla.plantillaTablaJugadoresAll.actualizatodojugador = function (jugador) {
    return Plantilla.sustituyeTodosTags(this.cuerpo, jugador)
}

/**
 * Función para mostrar en pantalla todos los datos de jugadores que se han recuperado de la BD.
 * @param {Vector_de_jugadores} vector Vector con los datos de los jugadores a mostrar
 */

Plantilla.imprimetodo = function (vector) {
    let msj = Plantilla.plantillaTablaJugadoresAll.cabecera
    if (vector && Array.isArray(vector)) {
        vector.forEach(e => msj += Plantilla.plantillaTablaJugadoresAll.actualizatodojugador(e));
    }
    msj += Plantilla.plantillaTablaJugadoresAll.pie

    Frontend.Article.actualizar("Datos de los jugadores", msj)
}

/**
 * Función principal para recuperar los jugadores desde el MS y, posteriormente, imprimirlos.
 */
Plantilla.procesarListaJugadoresCompleta = function () {
    Plantilla.recuperatodo(Plantilla.imprimetodo);
}

/**
 * Función que imprime todos los datos de todos los jugadores ordenados alfabéticamente
 * @param {Vector_de_jugadores} vector 
 */
Plantilla.imprimeorden = function(vector) {
    // Compongo el contenido que se va a mostrar dentro de la tabla
    let msj = Plantilla.plantillaTablaJugadores.cabecera
    if (vector && Array.isArray(vector)) {
        vector.sort(function(a, b) {
            let nombreA = a.data.nombre.toUpperCase(); 
            let nombreB = b.data.nombre.toUpperCase(); 
            if (nombreA > nombreB) {
                return 1;
            }
            if (nombreA < nombreB) {
                return -1;
            }
            return 0;
        });

        vector.forEach(e => msj += Plantilla.plantillaTablaJugadores.actualizajugador(e));
    }
    msj += Plantilla.plantillaTablaJugadores.pie

    // Borrar toda la información del Article y la sustituyo por la que ma interesa
    Frontend.Article.actualizar("Nombres de los jugadores ordenados alfabeticamente", msj)
}


/**
 * Función principal para recuperar los jugadores desde el MS y, posteriormente, ordenarlos.
 */
Plantilla.ordenaListaNombresJugadores = function () {
    Plantilla.recupera(Plantilla.imprimeorden);
}


