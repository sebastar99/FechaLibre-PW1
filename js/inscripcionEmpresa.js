export class InscripcionEmpresa {
  constructor() {
    this.cursoSelect = document.getElementById('curso');
    this.totalSection = document.getElementById('total');
    this.btnAgregar = document.getElementById('agregarPersona');
    this.listaPersonas = document.getElementById('listaPersonas');
    this.formPersona = document.getElementById('formPersona');

    if (!this.cursoSelect || !this.totalSection) return;

    this._agregarEventos();
    this._actualizarTotalYLista();
  }

  _agregarEventos() {
    this.cursoSelect.addEventListener('change', () => this._actualizarTotalYLista());
    if (this.btnAgregar) {
      this.btnAgregar.addEventListener('click', (e) => {
        e.preventDefault();
        this._agregarPersona();
      });
    }
  }

  // obtiene el precio del curso desde localStorage
  _obtenerPrecioCurso() {
    if (!this.cursoSelect) return 0;
    const cursoNombre = this.cursoSelect.value;
    const cursosLS = JSON.parse(localStorage.getItem('datosDeLosCursos')) || [];
    const cursoEncontrado = cursosLS.find(c => c.nombre === cursoNombre);
    if (!cursoEncontrado) return 0;

    // convierte "$158.000" → 158000
    const precioStr = cursoEncontrado.precio.replace(/[^0-9]/g, '');
    return Number(precioStr) || 0;
  }

  // lee las personas cargadas desde el DOM
  _leerPersonasDesdeDOM() {
    if (!this.listaPersonas) return [];
    const personas = [...this.listaPersonas.querySelectorAll('li')].map(li => li.textContent);
    return personas;
  }

  // agrega una persona a la lista
  _agregarPersona() {
    const nombreInput = document.getElementById('personaNombre');
    if (!nombreInput || !nombreInput.value.trim()) return alert('Ingrese un nombre');
    const nombre = nombreInput.value.trim();

    const li = document.createElement('li');
    li.textContent = nombre;
    const btnQuitar = document.createElement('button');
    btnQuitar.textContent = 'Quitar';
    btnQuitar.addEventListener('click', () => {
      li.remove();
      this._actualizarTotalYLista();
    });
    li.appendChild(btnQuitar);
    this.listaPersonas.appendChild(li);
    nombreInput.value = '';

    this._actualizarTotalYLista();
  }

  // calcula el total a pagar
  _calcularTotal() {
    const personas = this._leerPersonasDesdeDOM();
    const count = personas.length || 0;
    const basePrice = this._obtenerPrecioCurso();
    const total = (basePrice * count);
    return { basePrice, count, total };
  }

  // renderiza el total en pantalla
  _actualizarTotalYLista() {
    const { basePrice, count, total } = this._calcularTotal();
    if (this.totalSection) {
      this.totalSection.textContent =
        `$${total.toLocaleString()} ( ${count} × $${basePrice.toLocaleString()}`;
    }
  }
}
