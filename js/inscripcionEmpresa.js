export class InscripcionEmpresa {
  constructor() {
    this.contenedor = document.getElementById('contenedorParticipantes');
    this.btnAgregar = document.getElementById('agregarPersona');
    this.cursoSelect = document.getElementById('curso');
    this.totalDisplay = document.getElementById('total');
    this.btnInscribir = document.getElementById('btnInscribir');
    this.modal = document.getElementById('modalResumen');
    this.listaResumen = document.getElementById('listaResumen');
    this.totalModal = document.getElementById('totalModal');
    this.confirmarPagoBtn = this.modal?.querySelector('#confirmarPago');
    this.closeButtons = this.modal ? Array.from(this.modal.querySelectorAll('.close')) : [];

    this._handlerConfirmarPago = null;
    this._handlerCerrarModal = this._ocultarModal.bind(this);

    if (!this.contenedor || !this.btnAgregar || !this.cursoSelect || !this.totalDisplay || !this.btnInscribir || !this.modal) {
      console.warn('InscripcionEmpresa: faltan elementos del DOM necesarios.');
      return;
    }

    this.init();
  }

  init() {
    this._cargarCursosEnSelect();
    this._agregarEventos();

    if (this.contenedor.querySelectorAll('.persona-row').length === 0) {
      this._agregarFila();
    }

    this._actualizarTotal();
  }

  _cargarCursosEnSelect() {
    const cursosLS = JSON.parse(localStorage.getItem('cursos')) || [];

    this.cursoSelect.innerHTML = '';
    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.disabled = true;
    placeholder.selected = true;
    placeholder.textContent = 'Elegí un curso';
    this.cursoSelect.appendChild(placeholder);

    cursosLS.forEach(curso => {
      const option = document.createElement('option');
      option.value = String(curso.id);
      option.textContent = curso.nombre;
      this.cursoSelect.appendChild(option);
    });
  
    const seleccionado = localStorage.getItem('cursoAPagar')
    if (this.cursoSelect.querySelector(`[value="${seleccionado}"]`)) 
      this.cursoSelect.value = seleccionado;
  }

  _agregarEventos() {
    this.cursoSelect.addEventListener('change', () => this._actualizarTotal());

    this.btnAgregar.addEventListener('click', (e) => {
      e.preventDefault();
      if (!this._validarUltimaFila()) {
        alert('Completá la fila antes de agregar otra.');
        return;
      }
      this._agregarFila();
    });

    this.contenedor.addEventListener('click', (e) => {
      const btnEliminar = e.target.closest('.btn-eliminar');
      if (btnEliminar) {
        const fila = btnEliminar.closest('.persona-row');
        this._eliminarFila(fila);
      }
    });

    this.btnInscribir.addEventListener('click', (e) => {
      e.preventDefault();
      if (!this._validarTodasFilasCompleto()) {
        alert('Completá todos los campos.');
        return;
      }
      if (!this.cursoSelect.value) {
        alert('Seleccioná un curso.');
        return;
      }
      this._mostrarResumen();
    });

    this.closeButtons.forEach(btn => {
      btn.removeEventListener('click', this._handlerCerrarModal);
      btn.addEventListener('click', this._handlerCerrarModal);
    });

    window.addEventListener('click', (event) => {
      if (event.target === this.modal) this._ocultarModal();
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this._ocultarModal();
    });
  }

  _validarUltimaFila() {
    const filas = this.contenedor.querySelectorAll('.persona-row');
    if (filas.length === 0) return true;

    const ultima = filas[filas.length - 1];
    const inputs = ultima.querySelectorAll('input');
    return Array.from(inputs).every(inp => inp.value.trim() !== '');
  }

  _validarTodasFilasCompleto() {
    let ok = true;
    this.contenedor.querySelectorAll('.persona-row input').forEach(inp => {
      if (inp.value.trim() === '') {
        inp.style.border = "1px solid red";
        ok = false;
      } else inp.style.border = "";
    });
    return ok;
  }

  _agregarFila() {
    const divRow = document.createElement('div');
    divRow.classList.add('persona-row');

    divRow.innerHTML = `
      <div class="inputs-grupo">
        <input type="text" name="nombre" placeholder="Nombre" required>
        <input type="text" name="apellido" placeholder="Apellido" required>
        <input type="number" name="dni" placeholder="DNI" required>
        <input type="email" name="email" placeholder="Email" required>
        <input type="tel" name="telefono" placeholder="Teléfono" required>
      </div>
      <button type="button" class="btn-eliminar"><i class="fas fa-minus"></i></button>
    `;
    this.contenedor.appendChild(divRow);
    this._actualizarTotal();
  }

  _eliminarFila(fila) {
    fila.remove();
    if (this.contenedor.querySelectorAll('.persona-row').length === 0) {
      this._agregarFila();
    }
    this._actualizarTotal();
  }

  _obtenerPrecioCurso() {
    const idNum = Number(this.cursoSelect.value);
    if (!idNum) return 0;

    const cursosLS = JSON.parse(localStorage.getItem('cursos')) || [];
    const curso = cursosLS.find(c => Number(c.id) === idNum);
    if (!curso) return 0;

    return Number(String(curso.precio).replace(/[^\d]/g, '')) || 0;
  }

  _actualizarTotal() {
    const cantidad = this.contenedor.querySelectorAll('.persona-row').length;
    const precio = this._obtenerPrecioCurso();
    const total = cantidad * precio;

    this.totalDisplay.textContent = this.cursoSelect.value
      ? `$${total.toLocaleString()} (${cantidad} x $${precio.toLocaleString()})`
      : `$0`;
  }

  _mostrarResumen() {
    const filas = [...this.contenedor.querySelectorAll('.persona-row')];
    this.listaResumen.innerHTML = '';

    filas.forEach((fila, i) => {
      const inputs = [...fila.querySelectorAll('input')];
      const datos = inputs.map(inp => `${inp.placeholder}: ${inp.value}`).join(' — ');
      const li = document.createElement('li');
      li.textContent = `Participante ${i + 1}: ${datos}`;
      this.listaResumen.appendChild(li);
    });

    const precioUnitario = this._obtenerPrecioCurso();
    const total = filas.length * precioUnitario;

    this.totalModal.textContent = `Total a pagar: $${total.toLocaleString()}`;

    if (this._handlerConfirmarPago && this.confirmarPagoBtn) {
      this.confirmarPagoBtn.removeEventListener('click', this._handlerConfirmarPago);
    }

    this._handlerConfirmarPago = () => this._procesarCompraEmpresa();
    this.confirmarPagoBtn.addEventListener('click', this._handlerConfirmarPago);

    this.modal.style.display = "flex";
  }

  _ocultarModal() {
    this.modal.style.display = "none";
  }

  _procesarCompraEmpresa() {
    const cursoId = Number(this.cursoSelect.value);

    const cursosLS = JSON.parse(localStorage.getItem('cursos')) || [];
    const curso = cursosLS.find(c => Number(c.id) === cursoId);

    if (!curso) {
      alert("No se encontró el curso.");
      return;
    }

    const filas = [...this.contenedor.querySelectorAll('.persona-row')];
    const participantes = filas.map(fila => {
      const obj = {};
      fila.querySelectorAll('input').forEach(inp => obj[inp.name] = inp.value.trim());
      return obj;
    });

    const sessionKey = "UsuarioActual";
    const storageKey = "Usuarios";

    const usuarioSesion = JSON.parse(localStorage.getItem(sessionKey));
    if (!usuarioSesion || !usuarioSesion.email) {
      alert("Debés iniciar sesión.");
      this._ocultarModal();
      return;
    }

    const usuarios = JSON.parse(localStorage.getItem(storageKey)) || [];
    const idx = usuarios.findIndex(u => u.email === usuarioSesion.email);
    if (idx === -1) {
      alert("Usuario no encontrado.");
      this._ocultarModal();
      return;
    }

    usuarios[idx].carrito = usuarios[idx].carrito || [];
    usuarios[idx].compras = usuarios[idx].compras || [];
    usuarios[idx].carrito = usuarios[idx].carrito.filter(c => Number(c.id) !== Number(curso.id));

    if (!usuarios[idx].compras.some(c => c.id === (curso.id))) {    
      usuarios[idx].compras.push({
        ...curso,
        compradoEn: new Date().toISOString(),
        participantes
      });
    }

    localStorage.setItem(storageKey, JSON.stringify(usuarios));
    localStorage.setItem(sessionKey, JSON.stringify(usuarios[idx]));

    
    const total = filas.length * this._obtenerPrecioCurso();
    localStorage.setItem('totalAPagar', total);

    mostrarDialogoVerde(`Compra registrada: ${curso.nombre}`);

    this._ocultarModal();
    setTimeout(() => {
      window.location.href = "/pages/pagoInscripcion.html";
    }, 800);
  }
}

function mostrarDialogoVerde(mensaje) {
  const dialogo = document.createElement('div');
  dialogo.textContent = mensaje;
  dialogo.style.position = 'fixed';
  dialogo.style.bottom = '20px';
  dialogo.style.right = '20px';
  dialogo.style.background = '#27ae60';
  dialogo.style.color = '#fff';
  dialogo.style.padding = '10px 14px';
  dialogo.style.borderRadius = '8px';
  dialogo.style.zIndex = '9999';
  dialogo.style.opacity = '0';
  dialogo.style.transition = '0.25s';

  document.body.appendChild(dialogo);

  requestAnimationFrame(() => dialogo.style.opacity = '1');

  setTimeout(() => {
    dialogo.style.opacity = '0';
    setTimeout(() => dialogo.remove(), 250);
  }, 1200);
}

document.addEventListener('DOMContentLoaded', () => {
  new InscripcionEmpresa();
});
