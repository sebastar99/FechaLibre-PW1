export class Home {

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
            <a href="${link}">
              <button class="caracteristicas">Ver Curso</button>
            </a>
          </div>
        `;
      })
      .join('');
    this.container.innerHTML = cursosHTML;
  }
}


