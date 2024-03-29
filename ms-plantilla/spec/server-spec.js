/**
 * @file server-spec.js
 * @description Fichero con la especificación de las pruebas TDD para server.js del MS MS Plantilla
 *              Este fichero DEBE llamarse server-spec.js
 *              Este fichero DEBE ubicarse en el subdirectorio spec/
 * @author Víctor M. Rivas Santos <vrivas@ujaen.es>
 * @date 03-Feb-2023
 */


const supertest = require('supertest');
const assert = require('assert')
const app = require('../server');

/**
 * Test para las rutas "estáticas": / y /acerdade
 */
describe('Servidor PLANTILLA:', () => {
  describe('Rutas / y /acercade', () => {
    it('Devuelve MS Plantilla Home Page', (done) => {
      supertest(app)
        .get('/')
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(function (res) {
          //console.log( res.body ); // Para comprobar qué contiene exactamente res.body
          assert(res.body.hasOwnProperty('mensaje'));
          assert(res.body.mensaje === "Microservicio MS Plantilla: home");

        })
        .end((error) => { error ? done.fail(error) : done() })
    });
    it('Devuelve MS Plantilla Acerca De', (done) => {
      supertest(app)
        .get('/acercade')
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(function (res) {
          //console.log( "BODY ACERCA DE ", res.body ); // Para comprobar qué contiene exactamente res.body
          assert(res.body.hasOwnProperty('mensaje'));
          assert(res.body.mensaje === "Microservicio MS Plantilla: acerca de");
          assert(res.body.autor == "Manuel Lara Torres");
          assert(res.body.email == "mlt00024@red.ujaen.es");
          assert(res.body.fecha == "21-04-2023");

        })
        .end((error) => { error ? done.fail(error) : done() })
    });
  })

  /**
   * Tests para acceso a la BBDD
   */
  describe('Acceso a BBDD:', () => {
    it('Devuelve los nombres al ir por la ruta test_db', (done) => {
      supertest(app)
        .get('/test_db')
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(function (res) {
          //console.log( res.body ); // Para comprobar qué contiene exactamente res.body
          assert(res.body.data[0].data.hasOwnProperty('nombre'));
          assert(res.body.data[0].data.nombre === "Leo");

        })
        .end((error) => { error ? done.fail(error) : done(); }
        );
    });

  })

  /**
   * Listar jugadores
   */
  describe('Lista de jugadores:', () => {
    it('Devuelve un listado con todos los jugadores', (done) => {
      supertest(app)
        .get('/get_jugadores')
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(function (res) {
          //console.log( res.body ); // Para comprobar qué contiene exactamente res.body
          assert(res.body.data[0].data.hasOwnProperty('nombre'));
          assert(res.body.data[0].data.hasOwnProperty('apellidos'));
          assert(res.body.data[0].data.nombre === "Leo");
          assert(res.body.data[0].data.nombre != "Messi");
          assert(res.body.data.length === 10);
        })
        .end((error) => { error ? done.fail(error) : done(); }
        );
    });
  })
  /**
   * Listar todos los datos de los jugadores
   */
describe('Lista de jugadores completa:', () => {
  it('Devuelve un listado con todos los jugadores', (done) => {
    supertest(app)
      .get('/get_jugadores_completa')
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(function (res) {
        //console.log( res.body ); // Para comprobar qué contiene exactamente res.body
        assert(res.body.data[0].data.hasOwnProperty('nombre'));
        assert(res.body.data[0].data.hasOwnProperty('apellidos'));
        assert(res.body.data[0].data.hasOwnProperty('fnac'));
        assert(res.body.data[0].data.hasOwnProperty('equipos'));
        assert(res.body.data[0].data.hasOwnProperty('goles'));
        assert(res.body.data[0].data.nombre === "Leo");
        assert(res.body.data[0].data.nombre != "Messi");
        assert(res.body.data[0].data.fnac.dia === 21);
        assert(res.body.data[0].data.equipos[0] === "F.C Barcelona");
        assert(res.body.data.length === 10);
      })
      .end((error) => { error ? done.fail(error) : done(); }
      );
  });
})
});


