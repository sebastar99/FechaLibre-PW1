import { Ingreso } from "./ingreso.js";
import { Cursos } from "./cursos.js";
import { Calendario } from "./calendario.js";
import { Home } from "./home.js";

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
    const calendario = new Calendario();
    

    // 4. Carga de cursos en el Home
    const cursosHome = new Home('#cursosContenedor', '/pages/detalleCurso.html');
    cursosHome.mostrarCursosHome();

});
