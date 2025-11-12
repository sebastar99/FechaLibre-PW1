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
    const cursos = JSON.parse(localStorage.getItem('cursos')) || [];
    const cursosHTML = cursos
      .map((curso, index) => {
        // --- FIX: construir 'link' aquí ---
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
      })
      .join('');

    this.container.innerHTML = cursosHTML;

    const carritoIcon = document.querySelector('.fa-shopping-cart');
    const usuarioSesion = JSON.parse(localStorage.getItem(this.sessionKey));
    let contador = 0;
    if (usuarioSesion) {
      const usuarios = JSON.parse(localStorage.getItem(this.storageKey)) || [];
      const usuarioObj = usuarios.find(u => u.email === usuarioSesion.email);
      contador = (usuarioObj && Array.isArray(usuarioObj.carrito)) ? usuarioObj.carrito.length : 0;
    } else {
      contador = parseInt(sessionStorage.getItem('contadorCarrito')) || 0;
    }
    sessionStorage.setItem('contadorCarrito', contador);
    if (carritoIcon) carritoIcon.setAttribute('data-contador', contador);

    const botonesComprar = this.container.querySelectorAll('.comprar-btn');
    botonesComprar.forEach(btn => {
      btn.addEventListener('click', () => {
        const cursoId = btn.getAttribute('data-id');
        const cursosAll = JSON.parse(localStorage.getItem('cursos')) || [];
        const cursoObj = cursosAll.find(c => String(c.id) === String(cursoId));
        if (!cursoObj) {
          this._notify('No se encontró el curso seleccionado.');
          return;
        }

        const usuarioSesion = JSON.parse(localStorage.getItem(this.sessionKey));
        if (!usuarioSesion) {
          window.location.href = '/pages/ingreso.html';
          return;
        }

        // cargar lista de usuarios y buscar el usuario que coincide
        const usuarios = JSON.parse(localStorage.getItem(this.storageKey)) || [];
        const uIndex = usuarios.findIndex(u => u.email === usuarioSesion.email);
        if (uIndex === -1) {
          this._notify('Usuario no encontrado. Vuelve a iniciar sesión.');
          return;
        }

        usuarios[uIndex].carrito = usuarios[uIndex].carrito || [];

        const yaEnCarrito = usuarios[uIndex].carrito.some(c => String(c.id) === String(cursoObj.id));
        if (yaEnCarrito) {
          this._notify('El curso ya está en tu carrito.');
        } else {
          const item = {
            id: cursoObj.id,
            nombre: cursoObj.nombre,
            precio: cursoObj.precio || '',
            img: cursoObj.img || '',
            tipo: cursoObj.tipo || ''
          };
          usuarios[uIndex].carrito.push(item);
          localStorage.setItem(this.storageKey, JSON.stringify(usuarios));

          const nuevoContador = usuarios[uIndex].carrito.length;
          sessionStorage.setItem('contadorCarrito', nuevoContador);
          if (carritoIcon) carritoIcon.setAttribute('data-contador', nuevoContador);

          window.dispatchEvent(new Event('carritoActualizado'));

          const listaCarritoEl = document.getElementById('listaCarrito');
          if (listaCarritoEl) {
            this._simpleRenderListaCarrito(listaCarritoEl, usuarios[uIndex].carrito);
          }

          this._notify(`"${cursoObj.nombre}" agregado al carrito.`);
        }
      });
    });
  }

  _simpleRenderListaCarrito(ulElement, items = []) {
    if (!ulElement) return;
    ulElement.innerHTML = '';
    if (!items.length) {
      const li = document.createElement('li');
      li.textContent = 'No tienes cursos en el carrito aun.';
      li.className = 'small-muted';
      ulElement.appendChild(li);
      return;
    }
    items.forEach(item => {
      const li = document.createElement('li');
      li.className = 'carrito-item';
      li.innerHTML = `
        <div class="carrito-info" title="${(item.nombre || '')}">
          <span class="carrito-nombre">${item.nombre || 'Curso sin título'}</span>
          <span class="carrito-precio">${item.precio || ''}</span>
        </div>
      `;
      ulElement.appendChild(li);
    });
  }

  _notify(msg) {
    if (typeof Swal !== 'undefined') {
      Swal.fire({
        icon: 'success',
        title: msg,
        toast: true,
        position: 'bottom-end',
        showConfirmButton: false,
        timer: 1600
      });
    } else {
      const prev = document.getElementById('home-notify-temp');
      if (prev) prev.remove();
      const div = document.createElement('div');
      div.id = 'home-notify-temp';
      div.style.position = 'fixed';
      div.style.right = '1rem';
      div.style.bottom = '1rem';
      div.style.background = 'rgba(0,0,0,0.8)';
      div.style.color = '#fff';
      div.style.padding = '0.6rem 0.9rem';
      div.style.borderRadius = '6px';
      div.style.zIndex = 99999;
      div.textContent = msg;
      document.body.appendChild(div);
      setTimeout(() => { try { div.remove(); } catch (e) { } }, 1600);
    }
  }
}
