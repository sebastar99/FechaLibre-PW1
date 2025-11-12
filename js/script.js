import { Ingreso } from "./ingreso.js";
import { Cursos } from "./cursos.js";
import { Calendario } from "./calendario.js";
import { Home } from "./home.js";
import { Giftcard } from "./giftcard.js";
import { Contacto } from "./contacto.js";
import { Slider } from "./slider.js";
import { InscripcionEmpresa } from "./inscripcionEmpresa.js";
import Pago from "./pago.js";
import { Detailist } from "./datalist.js";

export let ingreso;

function actualizarIconoCarrito() {
    const carritoIcon = document.querySelector('.fa-shopping-cart');
    if (!carritoIcon) return;

    const usuarioSesion = JSON.parse(localStorage.getItem('UsuarioActual'));
    if (usuarioSesion) {
        carritoIcon.style.display = 'inline-block';
    } else {
        carritoIcon.style.display = 'none';
        return;
    }

    let contador = parseInt(sessionStorage.getItem('contadorCarrito')) || 0;

    if (contador === 0) {
        const usuarios = JSON.parse(localStorage.getItem('Usuarios')) || [];
        const usuarioObj = usuarios.find(u => u.email === usuarioSesion.email);
        contador = usuarioObj && usuarioObj.carrito ? usuarioObj.carrito.length : 0;
    }

    carritoIcon.setAttribute('data-contador', contador);
}

document.addEventListener('DOMContentLoaded', () => {

    //0. Actualizar el ícono y contador del carrito en todas las páginas
    actualizarIconoCarrito();

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

    

    // 11. Logica del pago
    const formPago = document.querySelector('#paymentForm');
    if (formPago) {
        const pago = new Pago({
            montoKey: 'montoSeleccionado',
            montoInputSelector: '#monto',
            formSelector: '#paymentForm'
        });
        pago.init();
    }

    // 12. logica detailist 
    new Detailist();
});
