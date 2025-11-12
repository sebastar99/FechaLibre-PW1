import { Ingreso } from "./ingreso.js";
import { Cursos } from "./cursos.js";
import { Calendario } from "./calendario.js";
import { Home } from "./home.js";
import { Slider } from "./slider.js";

export let ingreso;

document.addEventListener('DOMContentLoaded', () => {

    const cursos = new Cursos();
    cursos.inicializarDetalle();
    cursos.mostrarRecomendados('#recomendadosContenedor', '/pages/detalleCurso.html');

    ingreso = new Ingreso();
    if (document.body.classList.contains('profile-page') || document.getElementById('perfilNombre')) {
        ingreso.populateProfile();
    }

    const calendario = new Calendario();

    const cursosHome = new Home('#cursosContenedor', '/pages/detalleCurso.html');
    cursosHome.mostrarCursosHome();

    const sliderContainer = document.querySelector('.slider-container');
    if (sliderContainer) {
        new Slider(sliderContainer, 5000); 
    }

});
