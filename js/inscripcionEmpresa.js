/*export class InscripcionEmpresa {
  constructor() {
    // Selectores del nuevo HTML
    this.contenedor = document.getElementById('contenedorParticipantes');
    this.btnAgregar = document.getElementById('agregarPersona');
    this.cursoSelect = document.getElementById('curso');
    this.totalDisplay = document.getElementById('total');
    this.btnInscribir = document.getElementById('btnInscribir');
    this.modal = document.getElementById('modalResumen');
    
    // Inicialización
    this.init();
  }

init() {
    // Verificación de seguridad: Si no hay cursos, alertar o intentar recargar
    if (!localStorage.getItem('cursos')) {
        alert("No se cargaron los cursos correctamente. Por favor volvé al Inicio para recargar el sistema.");
    }
    
    this._agregarEventos();
    this._agregarFila(); 
  }

_agregarEventos() {
    // 1. Escuchar cambios en el curso para recalcular total
    if (this.cursoSelect) {
      this.cursoSelect.addEventListener('change', () => this._actualizarTotal());
    }

    // 2. Botón agregar persona (CON VALIDACIÓN)
    if (this.btnAgregar) {
      this.btnAgregar.addEventListener('click', (e) => {
        e.preventDefault();
        
        // ¡NUEVO! Validamos antes de agregar
        if (this._validarCamposCompletos()) {
            this._agregarFila();
        } else {
            alert("Por favor, completá todos los datos del participante actual antes de agregar otro.");
        }
      });
    }

    // 3. Delegación para el botón Eliminar
    if (this.contenedor) {
      this.contenedor.addEventListener('click', (e) => {
        // Usamos closest para detectar el click aunque sea en el ícono
        const btnEliminar = e.target.closest('.btn-eliminar');
        if (btnEliminar) {
          // Busamos la fila padre de ese botón específico
          const fila = btnEliminar.closest('.persona-row');
          this._eliminarFila(fila);
        }
      });
    }
    
    // 4. Botón Inscribir
    if (this.btnInscribir) {
        this.btnInscribir.addEventListener('click', (e) => {
            e.preventDefault();
            if (this._validarCamposCompletos()) {
                this._mostrarResumen();
            } else {
                alert("Hay campos incompletos. Por favor revisalos antes de continuar.");
            }
        });
    }
    
    // 5. Cerrar modal
    window.onclick = (event) => {
        if (event.target == this.modal) {
            this.modal.style.display = "none";
        }
    }
  }
  // Verifica que NO haya inputs vacíos en el formulario
  _validarCamposCompletos() {
    const inputs = this.contenedor.querySelectorAll('input');
    let todoCompleto = true;
    
    inputs.forEach(input => {
        if (input.value.trim() === '') {
            todoCompleto = false;
            // Opcional: resaltar el borde en rojo
            input.style.border = "1px solid red"; 
        } else {
            input.style.border = ""; // Limpiar borde si está bien
        }
    });
    
    return todoCompleto;
  }

  _agregarFila() {
    // Creamos un div contenedor para la fila
    const divRow = document.createElement('div');
    divRow.classList.add('persona-row');
    
    // HTML interno con los 5 campos requeridos + botón eliminar
    divRow.innerHTML = `
      <div class="inputs-grupo">
        <input type="text" name="nombre" placeholder="Nombre" required>
        <input type="text" name="apellido" placeholder="Apellido" required>
        <input type="number" name="dni" placeholder="DNI" required>
        <input type="email" name="email" placeholder="Email" required>
        <input type="tel" name="telefono" placeholder="Teléfono" required>
      </div>
      <button type="button" class="btn-eliminar" title="Eliminar fila">
        <i class="fas fa-minus"></i>
      </button>
    `;

    this.contenedor.appendChild(divRow);
    this._actualizarTotal();
  }

  _eliminarFila(fila) {
    const filas = this.contenedor.querySelectorAll('.persona-row');
    
    // REGLA: Si es la única fila, solo limpiamos los inputs
    if (filas.length === 1) {
      const inputs = fila.querySelectorAll('input');
      inputs.forEach(input => input.value = '');
    } else {
      // Si hay más de una, la eliminamos del DOM
      fila.remove();
    }
    this._actualizarTotal();
  }

_obtenerPrecioCurso() {
    if (!this.cursoSelect) return 0;
    
    const nombreCursoSeleccionado = this.cursoSelect.value;
    
    // IMPORTANTE: Tu archivo cursos.js guarda los datos bajo la clave "cursos"
    // Si esto devuelve null, intentamos cargar un array vacío para no romper el código.
    const cursosLS = JSON.parse(localStorage.getItem('cursos'));
    
    if (!cursosLS) {
        console.error("Error: No hay cursos cargados en localStorage. Asegurate de haber visitado la página de inicio o que cursos.js se haya ejecutado.");
        return 0;
    }

    // Buscamos el curso (usamos trim() para evitar errores por espacios vacíos)
    const cursoEncontrado = cursosLS.find(c => c.nombre.trim() === nombreCursoSeleccionado.trim());
    
    if (!cursoEncontrado) {
      console.warn('Curso no encontrado:', nombreCursoSeleccionado);
      return 0;
    }

    // Limpieza del precio: "$158.000" -> 158000
    // Elimina todo lo que NO sea número
    const precioLimpio = cursoEncontrado.precio.replace(/\D/g, '');
    
    return Number(precioLimpio) || 0;
  }

  _actualizarTotal() {
    const filas = this.contenedor.querySelectorAll('.persona-row');
    const cantidad = filas.length;
    const precioUnitario = this._obtenerPrecioCurso();
    const total = cantidad * precioUnitario;

    if (this.totalDisplay) {
      this.totalDisplay.textContent = `$${total.toLocaleString()} (${cantidad} x $${precioUnitario.toLocaleString()})`;
    }
  }

  _mostrarResumen() {
      // Aquí recogeríamos los datos y los mostraríamos en el modal
      // Por ahora solo mostramos el modal
      if(this.modal) this.modal.style.display = "block";
  }
}*/