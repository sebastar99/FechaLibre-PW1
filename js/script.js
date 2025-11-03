// /js/script.js
import { Ingreso } from "./ingreso.js";
import { Cursos } from "./cursos.js"; // Importa la clase Cursos
import { Calendario } from "./calendario.js";
import { Home } from "./home.js";

export let ingreso; // será inicializado en DOMContentLoaded

document.addEventListener('DOMContentLoaded', () => {

    // INICIALIZACIÓN DE DATOS (Cursos)
    const cursos = new Cursos();

    // Si Cursos.inicializarDetalle es un método estático, lo llamamos con chequeo
    if (typeof Cursos.inicializarDetalle === 'function') {
        Cursos.inicializarDetalle();
    }

    cursos.mostrarRecomendados('#recomendadosContenedor', '/pages/detalleCurso.html');

    // 2. Lógica de Ingreso/Formularios
    ingreso = new Ingreso();

    // Si estamos en profile.html (añade class="profile-page" al <body>)
    // o si detectamos el elemento #perfilNombre, rellenamos el perfil
    if (document.body.classList.contains('profile-page') || document.getElementById('perfilNombre')) {
        ingreso.populateProfile();
    }

    // 3. Lógica de Calendario
    const calendario = new Calendario();

    // 4. Lógica para cargar los cursos recomendados (home)
    const cursosHome = new Home('#cursosContenedor', '/pages/detalleCurso.html');
    cursosHome.mostrarCursosHome();

});
