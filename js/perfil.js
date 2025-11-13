// /js/perfil.js
import { Ingreso } from './ingreso.js';

export class Perfil extends Ingreso {
  constructor(options = {}) {
    // evitamos que Ingreso autodetermine event listeners (porque en esta página ya no hay forms de login/signup)
    super(Object.assign({ setupEventListeners: false }, options));

    this.ids = Object.assign(this.ids || {}, {
      btnLogout: 'btnLogout',
      btnEliminar: 'btnEliminar'
    });

    this._itemSeleccionado = null;
  }

  populateProfile(selectors = {}) {
    const s = Object.assign({
      perfilNombre: 'perfilNombre',
      perfilEmail: 'perfilEmail',
      listaCarrito: 'listaCarrito',
      listaCompras: 'listaCompras'
    }, selectors);

    const usuario = this.getCurrentUser();
    if (!usuario) {
      window.location.href = '/pages/ingreso.html';
      return;
    }

    const perfilNombre = document.getElementById(s.perfilNombre);
    const perfilEmail = document.getElementById(s.perfilEmail);
    const listaFav = document.getElementById(s.listaCarrito);
    const listaComp = document.getElementById(s.listaCompras);

    if (perfilNombre) perfilNombre.textContent = usuario.nombre;
    if (perfilEmail) perfilEmail.textContent = usuario.email;

    const usuarios = JSON.parse(localStorage.getItem(this.storageKey)) || [];
    const usuarioCompleto = (function usersFindSafe(list, email) {
      if (!Array.isArray(list)) return { carrito: [], compras: [] };
      return list.find(u => u.email === email) || { carrito: [], compras: [] };
    })(usuarios, usuario.email);

    this._renderLista(listaFav, usuarioCompleto.carrito || [], 'No tienes cursos en el carrito aun.');
    this._renderLista(listaComp, usuarioCompleto.compras || [], 'No has comprado cursos aun.');

    const btnLogout = document.getElementById(this.ids.btnLogout);
    if (btnLogout && !btnLogout._hasHandler) {
      btnLogout.addEventListener('click', () => this.logout());
      btnLogout._hasHandler = true;
    }

    const btnEliminar = document.getElementById(this.ids.btnEliminar);
    if (btnEliminar && !btnEliminar._hasHandler) {
      btnEliminar.addEventListener('click', () => this.eliminar());
      btnEliminar._hasHandler = true;
    }

    // mantener header actualizado (por si el conteo o visibilidad cambia)
    if (typeof this.updateHeader === 'function') this.updateHeader();
  }

  // (incluye _renderLista, addFavorito, addCompra, modales; pego implementaciones mínimas y robustas)
  _renderLista(ulElement, items = [], textoVacio = '') {
    if (!ulElement) return;
    ulElement.innerHTML = '';

    const self = this;

    if (!document.getElementById('carritoStyles')) {
      const style = document.createElement('style');
      style.id = 'carritoStyles';
      style.textContent = `
        #listaCarrito, #listaCompras { list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:1rem; }
        .carrito-item { display:flex;justify-content:space-between;align-items:center;background:#fff;border:1px solid rgba(0,0,0,0.08);border-radius:10px;padding:1rem 1.2rem;gap:1em; }
        .carrito-info { display:flex;flex-direction:column;gap:.25rem;max-width:65%; }
        .carrito-nombre { font-weight:600;font-size:1rem;color:#222;overflow:hidden;text-overflow:ellipsis;white-space:nowrap; }
        .carrito-precio { font-size:.95rem;color:#555; }
        #listaCompras .carrito-actions{ display:none; }
        .carrito-actions { display:flex;gap:.5rem;align-items:center; }
        .carrito-btn { padding:.45rem .8rem;border-radius:6px;border:none;font-size:.9rem;cursor:pointer; }
        .btn-pagar{ background:#2ecc71;color:#fff } .btn-eliminar{ background:#e74c3c;color:#fff } .btn-gift{ background:#f1c40f;color:#333 }
        .small-muted { font-size:.82rem;color:#888 }
      `;
      document.head.appendChild(style);
    }

    if (!items.length) {
      const li = document.createElement('li');
      li.textContent = textoVacio;
      li.className = 'small-muted';
      ulElement.appendChild(li);
      return;
    }

    items.forEach(item => {
      const li = document.createElement('li');
      li.className = 'carrito-item';
      li.innerHTML = `
        <div class="carrito-info" title="${escapeHtml(item.nombre || '')}">
          <span class="carrito-nombre">${item.nombre || 'Curso sin título'}</span>
          <span class="carrito-precio">${item.precio || ''}</span>
        </div>
        <div class="carrito-actions">
          <button class="carrito-btn btn-gift" type="button">Giftcard</button>
          <button class="carrito-btn btn-pagar" type="button">Pagar</button>
          <button class="carrito-btn btn-eliminar" type="button">Eliminar</button>
        </div>
      `;

      const btnEliminar = li.querySelector('.btn-eliminar');
      const btnPagar = li.querySelector('.btn-pagar');
      const btnGift = li.querySelector('.btn-gift');

      btnEliminar.addEventListener('click', () => {
        const usuario = self.getCurrentUser();
        if (!usuario) return notify('Debes iniciar sesión.');

        const usuarios = JSON.parse(localStorage.getItem(self.storageKey)) || [];
        const uIndex = usuarios.findIndex(u => u.email === usuario.email);
        if (uIndex === -1) return notify('Usuario no encontrado.');

        usuarios[uIndex].carrito = (usuarios[uIndex].carrito || []).filter(c => c.id !== item.id);
        localStorage.setItem(self.storageKey, JSON.stringify(usuarios));
        self._renderLista(ulElement, usuarios[uIndex].carrito || [], textoVacio);
        if (typeof self.updateHeader === 'function') self.updateHeader();
      });

      btnPagar.addEventListener('click', () => {
        const usuario = self.getCurrentUser();
        if (!usuario) return notify('Debes iniciar sesión.');
        self._itemSeleccionado = item;
        self.mostrarOpcionPago();
      });

      btnGift.addEventListener('click', () => {
        const usuario = self.getCurrentUser();
        if (!usuario) return notify('Debes iniciar sesión.');
        window.location.href = '/pages/giftcard.html';
      });

      ulElement.appendChild(li);
    });

    function notify(msg) {
      if (typeof Swal !== 'undefined') {
        Swal.fire({ icon: 'success', title: msg, toast: true, position: 'bottom-end', showConfirmButton: false, timer: 1800 });
      } else {
        alert(msg);
      }
    }
    self.notify = notify;

    function escapeHtml(str = '') {
      return String(str).replace(/[&<>"']/g, s => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[s]));
    }
  }

  addFavorito(curso) {
    const usuario = this.getCurrentUser();
    if (!usuario) { alert('Debes iniciar sesión'); return; }
    const usuarios = JSON.parse(localStorage.getItem(this.storageKey)) || [];
    const u = usuarios.find(x => x.email === usuario.email);
    if (!u) return;
    u.favoritos = u.favoritos || [];
    u.favoritos.push(curso);
    localStorage.setItem(this.storageKey, JSON.stringify(usuarios));
    if (typeof this.updateHeader === 'function') this.updateHeader();
  }

  addCompra(curso) {
    const usuario = this.getCurrentUser();
    if (!usuario) { alert('Debes iniciar sesión'); return; }
    const usuarios = JSON.parse(localStorage.getItem(this.storageKey)) || [];
    const u = usuarios.find(x => x.email === usuario.email);
    if (!u) return;
    u.compras = u.compras || [];
    u.compras.push(curso);
    localStorage.setItem(this.storageKey, JSON.stringify(usuarios));
    if (typeof this.updateHeader === 'function') this.updateHeader();
  }

  agregarEstilosModal() {
    if (document.getElementById('estilosModal')) return;
    const style = document.createElement('style');
    style.id = 'estilosModal';
    style.textContent = `
      .modal{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:92vw;max-width:30rem;background:#fff;border:1px solid #ddd;border-radius:10px;padding:0;z-index:12000;}
      .modal::backdrop{background:rgba(0,0,0,.45)}
      .modal-header{display:flex;align-items:center;justify-content:space-between;padding:.8rem 1rem;border-bottom:1px solid #eee}
      .modal-titulo{margin:0;font-size:1rem;font-weight:600}
      .modal-cerrar{background:none;border:none;font-size:1rem;cursor:pointer;font-weight:bold}
      .modal-body{padding:1rem;text-align:center}
      .modal-botones{display:flex;gap:.6rem;justify-content:flex-end;padding:.8rem 1rem;border-top:1px solid #eee}
      .boton{padding:.55rem .9rem;border:1px solid #ddd;border-radius:8px;background:#f6f6f6;cursor:pointer}
      .boton.principal{background:#5499c7;color:#fff;border:none}
      .campo{display:flex;flex-direction:column;gap:.25rem;margin-bottom:.7rem}
      .entrada{padding:.55rem .7rem;border:1px solid #ddd;border-radius:8px;font-size:.95rem}
    `;
    document.head.appendChild(style);
  }

  mostrarOpcionPago() {
    this.agregarEstilosModal();
    const ventana = document.createElement('dialog');
    ventana.className = 'modal';
    ventana.innerHTML = `
      <div class="modal-header">
        <h3 class="modal-titulo">¿Cómo querés continuar?</h3>
        <button class="modal-cerrar">X</button>
      </div>
      <div class="modal-body">
        <p>
          Elegí si el pago es para 
          <button class="boton principal" id="botonEmpresa">empresa</button> 
          o 
          <button class="boton" id="botonPersona">persona</button>
        </p>
      </div>
    `;
    document.body.appendChild(ventana);

    const cerrar = () => { ventana.close?.(); ventana.remove(); };

    ventana.querySelector('.modal-cerrar').addEventListener('click', cerrar);
    ventana.addEventListener('click', (e) => { if (e.target === ventana) cerrar(); });

    ventana.querySelector('#botonEmpresa').addEventListener('click', () => {
      cerrar();
      window.location.href = '/pages/inscripcion.html';
    });

    ventana.querySelector('#botonPersona').addEventListener('click', () => {
      cerrar();
      this.mostrarFormularioPersona();
    });

    ventana.showModal ? ventana.showModal() : ventana.show();
  }

  mostrarFormularioPersona() {
    this.agregarEstilosModal();
    const ventana = document.createElement('dialog');
    ventana.className = 'modal';
    ventana.innerHTML = `
      <form id="formPersona">
        <div class="modal-header">
          <h3 class="modal-titulo">Datos de contacto</h3>
          <button type="button" class="modal-cerrar">X</button>
        </div>
        <div class="modal-body">
          <label class="campo">
            <span>Nombre</span>
            <input class="entrada" name="nombre" required placeholder="Juan Pérez">
          </label>
          <label class="campo">
            <span>Email</span>
            <input class="entrada" type="email" name="email" required placeholder="tu@correo.com">
          </label>
          <label class="campo">
            <span>Teléfono</span>
            <input class="entrada" name="telefono" required placeholder="+54 9 11 ...">
          </label>
        </div>
        <div class="modal-botones">
          <button type="button" class="boton" id="botonCancelar">Cancelar</button>
          <button class="boton principal" type="submit">Enviar y continuar</button>
        </div>
      </form>
    `;
    document.body.appendChild(ventana);

    const cerrar = () => { ventana.close?.(); ventana.remove(); };
    ventana.querySelector('.modal-cerrar').addEventListener('click', cerrar);
    ventana.addEventListener('click', (e) => { if (e.target === ventana) cerrar(); });
    ventana.querySelector('#botonCancelar').addEventListener('click', cerrar);

    const formulario = ventana.querySelector('#formPersona');
    formulario.addEventListener('submit', (e) => {
      e.preventDefault();
      cerrar();

      const usuario = this.getCurrentUser();
      if (usuario && this._itemSeleccionado) {
        const usuarios = JSON.parse(localStorage.getItem(this.storageKey)) || [];
        const uIndex = usuarios.findIndex(u => u.email === usuario.email);
        if (uIndex === -1) { this.notify?.('Usuario no encontrado.'); return; }

        const producto = this._itemSeleccionado;
        usuarios[uIndex].carrito = (usuarios[uIndex].carrito || []).filter(c => c.id !== producto.id);
        usuarios[uIndex].compras = usuarios[uIndex].compras || [];
        if (!usuarios[uIndex].compras.some(c => c.id === producto.id)) {
          usuarios[uIndex].compras.push(producto);
        }
        localStorage.setItem(this.storageKey, JSON.stringify(usuarios));

        const listaCarritoEl = document.getElementById('listaCarrito');
        const listaComprasEl = document.getElementById('listaCompras');
        if (listaCarritoEl) this._renderLista(listaCarritoEl, usuarios[uIndex].carrito || [], 'No tienes cursos en el carrito aun.');
        if (listaComprasEl) this._renderLista(listaComprasEl, usuarios[uIndex].compras || [], 'No has comprado cursos aun.');

        this.notify?.(`Pago simulado: ${producto.nombre} añadido a tus compras.`);
      }
      this._itemSeleccionado = null;

      setTimeout(() => {
        window.location.href = '/pages/pagoInscripcion.html';
      }, 1000);
    });

    ventana.showModal ? ventana.showModal() : ventana.show();
  }
}

// Auto-inicialización cuando se usa <script type="module" src="/js/perfil.js"></script>
document.addEventListener('DOMContentLoaded', () => {
  const perfil = new Perfil();
  perfil.populateProfile();
});
