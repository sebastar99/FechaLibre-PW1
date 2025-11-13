import { Cursos } from './cursos.js';

export class Home {
    constructor(containerSelector, detailPage = '/pages/detalleCurso.html', options = {}) {
        this.container = document.querySelector(containerSelector);
        this.detailPage = detailPage;
        this.usuariosArr = [1000, 800, 600, 400, 200];

        this.storageKey = options.storageKey || 'Usuarios';
        this.sessionKey = options.sessionKey || 'UsuarioActual';
    }

    mostrarCursosHome() {
        if (!this.container) return;
        let cursos = Cursos.leerCursos();
        if (cursos.length === 0) {
            new Cursos();
            cursos = Cursos.leerCursos();
        }

        const cursosHTML = cursos.map((curso, index) => {
            const link = `${this.detailPage}?id=${encodeURIComponent(curso.id)}`;
            const claseCurso = `curso-card curso-${index + 1}-frente`;
            const usuarios = this.usuariosArr[index] || this.usuariosArr[this.usuariosArr.length - 1];
            const esPresencial = curso.tipo === 'Presencial';
            const textoBoton = esPresencial ? 'Inscribirse' : 'Comprar';

            return `
      <div class="${claseCurso}">
        <div class="header-curso-info">
          <div class="usuarios">
            <h6>+${usuarios} usuarios recibidos</h6>
          </div>
          <div class="estrellas">
            <i class="far fa-star"></i>
            <i class="far fa-star"></i>
            <i class="far fa-star"></i>
            <i class="far fa-star"></i>
            <i class="far fa-star"></i>
          </div>
        </div>
        <img src="${curso.img}" alt="foto-${curso.nombre.toLowerCase().replace(/\s+/g, '-')}" />
        <h3>${curso.nombre}</h3>
        <div class="botones-curso-home">
          <a href="${link}">
            <button class="caracteristicas">Ver Curso</button>
          </a>
          <button class="caracteristicas comprar-btn" data-id="${curso.id}">${textoBoton}</button>
        </div>
      </div>
    `;
        }).join('');

        this.container.innerHTML = cursosHTML;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const home = new Home('#cursosContenedor');
    home.mostrarCursosHome();
});