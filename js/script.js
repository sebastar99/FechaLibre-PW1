import { Ingreso } from "./ingreso.js";
import { Cursos } from "./cursos.js";
import { Calendario } from "./calendario.js";
import { Giftcard } from "./giftcard.js";
import { Home } from "./home.js";
import { Giftcard } from "./giftcard.js";
import { Contacto } from "./contacto.js";
import { Slider } from "./slider.js";
import { InscripcionEmpresa } from "./inscripcionEmpresa.js";

export let ingreso;

document.addEventListener('DOMContentLoaded', () => {

    // 1. Inicializacion de los cursos
    const cursos = new Cursos();
    cursos.inicializarDetalle();
    cursos.mostrarRecomendados('#recomendadosContenedor', '/pages/detalleCurso.html');

    // 2. Funcionamiento de la sesion
    ingreso = new Ingreso();
    if (document.body.classList.contains('profile-page') || document.getElementById('perfilNombre')) {
        ingreso.populateProfile();
    }

    // 3. Carga de cursos en el calendario
    new Calendario();

    // 4. Carga de cursos en el Home
    const cursosHome = new Home('#cursosContenedor', '/pages/detalleCurso.html');
    cursosHome.mostrarCursosHome();

    // 5. Lógica para contacto
    if (document.querySelector('#form')) {
        new Contacto();
    }

    // 6. Logica para carrousel
    const sliderContainer = document.querySelector('.slider-container');
    if (sliderContainer) {
        new Slider(sliderContainer, 5000);
    }

    // 8. Logica giftcard
    new Giftcard();

    // 9. Logica inscripcion para empresas
    new InscripcionEmpresa();
});


