export class Carrito {
  constructor() {
    this.storageKey = "Usuarios";
    this.sessionKey = "UsuarioActual";
    this.cartIcon = null;

    if (window.__carritoManagerInstanciado) return window.__carritoManager;
    window.__carritoManagerInstanciado = true;

    // iniciar
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this._init());
    } else {
      this._init();
    }
  }

  _init() {
    this.obtenerIdCurso();

    this.cartIcon = document.getElementById("cartIcon");
    if (this.cartIcon && this.cartIcon.getAttribute("data-contador") === null) {
      this.cartIcon.setAttribute("data-contador", "0");
    }

    this.updateCounter();

    this._handlerClick = (e) => {
      const btn = e.target.closest("[data-add-carrito], #btnAgregarCarrito");
      if (!btn) return;

      const id = btn.dataset.id;
      if (!id) {
        console.warn("Botón sin data-id, no se puede agregar al carrito.");
        return;
      }

      this.addById(id);
    };

    document.removeEventListener("click", this._handlerClick);
    document.addEventListener("click", this._handlerClick);
    document.addEventListener("carrito:updated", () => this.updateCounter());
    window.addEventListener("storage", () => this.updateCounter());
  }

  obtenerIdCurso() {
    const params = new URLSearchParams(window.location.search);
    const idParam = params.get('id');

    if (!idParam) return;

    const cursos = JSON.parse(localStorage.getItem('cursos')) || [];
    const curso = cursos.find(c => String(c.id) === String(idParam));

    if (!curso) {
      console.warn("No se encontró curso con id:", idParam);
      return;
    }

    const tituloEl = document.querySelector('.titulo');
    if (tituloEl) tituloEl.textContent = curso.nombre;

    const imgEl = document.querySelector('.curso__foto');
    if (imgEl) imgEl.src = curso.img;

    const descEl = document.querySelector('.curso__info__descripcion p:last-child');
    if (descEl) descEl.textContent = curso.descripcion;

    const precioSpan = document.getElementById("precioCurso");
    if (precioSpan) precioSpan.textContent = curso.precio;

    const btn = document.getElementById("btnAgregarCarrito");
    if (btn) {
      btn.setAttribute("data-id", curso.id);
      btn.setAttribute("data-nombre", curso.nombre);
      btn.setAttribute("data-precio", curso.precio);
    }
  }

  _leerUsuarios() {
    return JSON.parse(localStorage.getItem(this.storageKey)) || [];
  }
  _guardarUsuarios(arr) {
    localStorage.setItem(this.storageKey, JSON.stringify(arr));
  }
  _leerSesion() {
    return JSON.parse(localStorage.getItem(this.sessionKey)) || null;
  }
  _leerCursos() {
    return JSON.parse(localStorage.getItem("cursos")) || [];
  }
  _usuarioActualObj() {
    const ses = this._leerSesion();
    if (!ses) return null;
    return this._leerUsuarios().find(u => u.email === ses.email) || null;
  }

  updateCounter() {
    if (!this.cartIcon) this.cartIcon = document.getElementById("cartIcon");
    if (!this.cartIcon) return;

    const usuario = this._usuarioActualObj();
    const count = usuario?.carrito?.length || 0;

    this.cartIcon.setAttribute("data-contador", String(count));
  }

  addById(id) {
    const cursos = this._leerCursos();
    const curso = cursos.find(c => String(c.id) === String(id));

    if (!curso) {
      console.warn("El curso no existe en localStorage.cursos:", id);
      return;
    }

    this._agregarCursoObj(curso);
  }

  _agregarCursoObj(cursoObj) {
    const ses = this._leerSesion();
    if (!ses) {
      alert("Debes iniciar sesión para agregar al carrito.");
      return;
    }

    const usuarios = this._leerUsuarios();
    const idx = usuarios.findIndex(u => u.email === ses.email);
    if (idx === -1) return;

    usuarios[idx].carrito = usuarios[idx].carrito || [];

    const existe = usuarios[idx].carrito.some(c => String(c.id) === String(cursoObj.id));

    if (!existe) {
      usuarios[idx].carrito.push(cursoObj);
      this._guardarUsuarios(usuarios);

      document.dispatchEvent(new CustomEvent("carrito:updated", {
        detail: { tipo: "add", id: cursoObj.id }
      }));
    }

    this.updateCounter();
  }

  removeById(id) {
    const ses = this._leerSesion();
    if (!ses) return;

    const usuarios = this._leerUsuarios();
    const idx = usuarios.findIndex(u => u.email === ses.email);
    if (idx === -1) return;

    const antes = usuarios[idx].carrito?.length || 0;
    usuarios[idx].carrito = usuarios[idx].carrito.filter(c => String(c.id) !== String(id));
    const despues = usuarios[idx].carrito.length;

    if (antes !== despues) {
      this._guardarUsuarios(usuarios);

      document.dispatchEvent(new CustomEvent("carrito:updated", {
        detail: { tipo: "remove", id }
      }));
    }

    this.updateCounter();
  }

  getCarritoActual() {
    return this._usuarioActualObj()?.carrito || [];
  }
}

if (!window.carritoManager) {
  window.carritoManager = new Carrito();
}

