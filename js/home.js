// js/CursosSimple.js
export class Home {
  /**
   * containerSelector: selector CSS del contenedor donde insertar (p. ej. '#cursosContenedor')
   * detailPage: ruta base para los links de detalle (p. ej. '/pages/detalleCurso.html')
   */
  constructor(containerSelector, detailPage = '/pages/detalleCurso.html') {
    this.container = document.querySelector(containerSelector);
    this.detailPage = detailPage;
    this.usuariosArr = [1000, 800, 600, 400, 200];
  }

  mostrarCursosHome() {
    if (!this.container) return;
    const cursos = JSON.parse(localStorage.getItem('cursos')) || [];
    const cursosHTML = cursos
      .map((curso, index) => {
        const claseCurso = `curso-card curso-${index + 1}-frente`;
        const usuarios = this.usuariosArr[index] || this.usuariosArr[this.usuariosArr.length - 1];
        const link = `${this.detailPage}?id=${curso.id}`;
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
              <button class="caracteristicas comprar-btn" data-id="${curso.id}">Comprar</button>
            </div>
          </div>
        `;
      })
      .join('');
    this.container.innerHTML = cursosHTML;

    const carritoIcon = document.querySelector('.fa-shopping-cart');
    let contador = parseInt(sessionStorage.getItem('contadorCarrito')) || 0;
    if (carritoIcon) {
      carritoIcon.setAttribute('data-contador', contador);
    }

    const botonesComprar = this.container.querySelectorAll('.comprar-btn');
    botonesComprar.forEach(btn => {
      btn.addEventListener('click', () => {
        let contador = parseInt(sessionStorage.getItem('contadorCarrito')) || 0;
        contador++;
        sessionStorage.setItem('contadorCarrito', contador);
        if (carritoIcon) {
          carritoIcon.setAttribute('data-contador', contador);
        }
      });
    });
  }
}


