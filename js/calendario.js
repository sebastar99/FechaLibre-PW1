import { Ingreso } from "./ingreso.js";

function aplicarCSS() {
    const id = 'calendario-popup-css';
    if (document.getElementById(id)) return;
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = '/css/calendario-popup.css';
    document.head.appendChild(link);
}

function mostrarDialogoVerde(mensaje) {
    const dialogo = document.createElement("div");
    dialogo.className = 'cal-toast';
    dialogo.textContent = mensaje;
    document.body.appendChild(dialogo);


    requestAnimationFrame(() => dialogo.classList.add('show'));

    setTimeout(() => {
        dialogo.classList.remove('show');
        setTimeout(() => dialogo.remove(), 260);
    }, 2000);
}

export class Calendario {
    constructor(options = {}) {
        this.detailPage = options.detailPage || './detalleCurso.html';
        this.inscripcionPage = options.inscripcionPage || './perfil.html';
        aplicarCSS();

        this.contenedorDias = document.getElementById('calendarioDias');
        this.mesTitulo = document.getElementById('mesTitulo');
        this.tooltip = document.getElementById('calendario');
        this.todayBtn = document.getElementById('todayBtn');
        this.prevMesBtn = document.getElementById('prevMes');
        this.nextMesBtn = document.getElementById('nextMes');

        if (!this.contenedorDias || !this.mesTitulo || !this.tooltip) {
            return;
        }

        this.cursosData = this.cargarCursosDesdeStorage();
        this.eventos = this.mapearCursosAEventos(this.cursosData);

        this.meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
        this.fechaActual = new Date();
        this.fechaActual.setFullYear(2025, 10, 1);

        this.setupListeners();
        this.generarCalendario(this.fechaActual);

        window.addEventListener('storage', (e) => {
            if (e.key === 'cursos') this.actualizarEventos();
        });

        window.addEventListener('focus', () => {
            const nuevos = this.cargarCursosDesdeStorage();
            if (JSON.stringify(nuevos) !== JSON.stringify(this.cursosData)) {
                this.actualizarEventos();
            }
        });
    }

    cargarCursosDesdeStorage() {
        try {
            const raw = localStorage.getItem('cursos');
            return raw ? JSON.parse(raw) : [];
        } catch (err) {
            console.error('Error parseando cursos desde localStorage:', err);
            return [];
        }
    }

    mapearCursosAEventos(cursos) {
        const eventosMapeados = {};
        const fechasNoviembre = [
            "2025-11-25",
            "2025-11-30",
            "2025-12-12",
            "2025-12-15",
            "2025-12-18",
            "2025-12-25"
        ];

        const diaCurso = new Set(Object.values(eventosMapeados).map(e => Number(e.cursoData.id)));
        let fallbackIndex = 0;
        for (let i = 0; i < cursos.length && fallbackIndex < fechasNoviembre.length; i++) {
            const curso = cursos[i];
            if (diaCurso.has(Number(curso.id))) continue;
            const fecha = fechasNoviembre[fallbackIndex++];
            eventosMapeados[fecha] = {
                nombre: curso.nombre,
                link: `${this.detailPage}?id=${encodeURIComponent(curso.id)}`,
                cursoData: curso
            };
        }

        return eventosMapeados;
    }

    setupListeners() {
        this.prevMesBtn?.addEventListener('click', () => {
            this.fechaActual.setMonth(this.fechaActual.getMonth() - 1);
            this.generarCalendario(this.fechaActual);
            this.esconderPopUp();
        });
        this.nextMesBtn?.addEventListener('click', () => {
            this.fechaActual.setMonth(this.fechaActual.getMonth() + 1);
            this.generarCalendario(this.fechaActual);
            this.esconderPopUp();
        });
        this.todayBtn?.addEventListener('click', () => {
            this.fechaActual = new Date();
            this.generarCalendario(this.fechaActual);
            this.esconderPopUp();
        });

        window.addEventListener('click', (e) => {
            if (this.tooltip && this.tooltip.classList.contains('visible') &&
                !this.tooltip.contains(e.target) && !e.target.classList.contains('evento')) {
                this.esconderPopUp();
            }
        });

        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.esconderPopUp();
        });
    }

    generarCalendario(fecha) {
        this.contenedorDias.innerHTML = '';
        const año = fecha.getFullYear();
        const mes = fecha.getMonth();

        this.mesTitulo.textContent = `${this.meses[mes]} ${año}`;

        const primerDia = new Date(año, mes, 1);
        const ultimoDia = new Date(año, mes + 1, 0);

        let diaSemana = primerDia.getDay();
        diaSemana = (diaSemana === 0) ? 7 : diaSemana;

        for (let i = 1; i < diaSemana; i++) {
            const v = document.createElement('div');
            v.className = 'vacio';
            this.contenedorDias.appendChild(v);
        }

        const hoy = new Date();
        const hoyStr = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`;

        for (let d = 1; d <= ultimoDia.getDate(); d++) {
            const diaElem = document.createElement('div');
            diaElem.className = 'dia';
            diaElem.setAttribute('role', 'gridcell');

            const numero = document.createElement('div');
            numero.className = 'numero';
            numero.textContent = d;
            diaElem.appendChild(numero);

            const fechaStr = `${año}-${String(mes + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

            if (this.eventos[fechaStr]) {
                const ev = this.eventos[fechaStr];
                const a = document.createElement('a');
                a.className = 'evento';
                a.textContent = ev.nombre;
                a.href = ev.link;
                a.target = '_blank';
                a.setAttribute('aria-label', `Evento: ${ev.nombre}`);
                a.addEventListener('click', (e) => {
                    if (e.ctrlKey || e.metaKey) return;
                    e.preventDefault();
                    this.mostrarPopUp(e, ev);
                });
                diaElem.appendChild(a);
            }

            if (fechaStr === hoyStr && mes === hoy.getMonth() && año === hoy.getFullYear()) {
                diaElem.classList.add('hoy');
                const badge = document.createElement('div');
                badge.className = 'badge-hoy';
                badge.textContent = 'Hoy';
                diaElem.appendChild(badge);
            }

            this.contenedorDias.appendChild(diaElem);
        }

        const totalItems = this.contenedorDias.children.length;
        const resto = totalItems % 7;
        const faltan = (resto !== 0) ? 7 - resto : 0;
        for (let i = 0; i < faltan; i++) {
            const v = document.createElement('div');
            v.className = 'vacio';
            this.contenedorDias.appendChild(v);
        }
    }

    mostrarPopUp(evt, evData) {
        const curso = evData?.cursoData || {};
        const inscripcionParams = `?curso=${encodeURIComponent(curso.nombre || '')}&id=${encodeURIComponent(curso.id || '')}`;
        const urlInscripcion = `${this.inscripcionPage || '/pages/inscripcion.html'}${inscripcionParams}`;
        const urlDetalle = evData?.link || '#';

        const titulo = this.escapeHtml(curso.nombre || '');
        const duracion = this.escapeHtml(curso.duracion || curso.duracionSemanas || 'N/D');
        const precio = this.escapeHtml(curso.precio || 'N/D');
        const descripcionCorta = this.escapeHtml((curso.descripcion || '').slice(0, 150));
        this.tooltip.innerHTML = `
    <div class="cal-modal-backdrop" data-role="backdrop"></div>
    <div class="cal-modal-card" role="dialog" aria-modal="true" aria-label="Detalle del curso">
      <button class="cal-modal-close" aria-label="Cerrar">&times;</button>
      <h4>${titulo}</h4>
      <div class="cal-modal-meta"><strong>Duración:</strong> ${duracion} — <strong>Precio:</strong> ${precio}</div>
      <div class="cal-modal-desc">${descripcionCorta}${(curso.descripcion || '').length > 150 ? '...' : ''}</div>
      <div class="cal-modal-actions">
        <a href="${this.escapeHtml(urlDetalle)}" target="_blank" class="btn btn-detalle">Ver Detalle</a>
        <button type="button" id="btnAddCart" class="btn btn-inscribirse">Agregar</button>
      </div>
    </div>
  `;

        this.tooltip.setAttribute('aria-hidden', 'false');
        this.tooltip.classList.add('visible');

        let rect;
        if (evt && evt.target && evt.target.getBoundingClientRect) {
            rect = evt.target.getBoundingClientRect();
        } else if (evt && evt.clientX != null && evt.clientY != null) {
            rect = { left: evt.clientX, top: evt.clientY, width: 0, height: 0 };
        } else {
            rect = { left: window.innerWidth / 2, top: window.innerHeight / 2, width: 0, height: 0 };
        }
        requestAnimationFrame(() => this.positionTooltip(rect));

        const backdrop = this.tooltip.querySelector('[data-role="backdrop"]');
        const closeBtn = this.tooltip.querySelector('.cal-modal-close');
        const cerrar = () => this.esconderPopUp();
        backdrop?.addEventListener('click', cerrar);
        closeBtn?.addEventListener('click', cerrar);

        const btn = this.tooltip.querySelector('#btnAddCart');
        if (btn) {
            btn.replaceWith(btn.cloneNode(true));
            const newBtn = this.tooltip.querySelector('#btnAddCart');

            newBtn.addEventListener("click", () => {

                const usuarioActual = JSON.parse(localStorage.getItem("UsuarioActual"));
                if (!usuarioActual) {
                    mostrarDialogoVerde("Debes iniciar sesión para agregar cursos");
                    return;
                }

                if (!window.carritoManager) {
                    console.error("carritoManager no existe. Asegúrate de cargar carrito.js antes.");
                    mostrarDialogoVerde("Error interno del carrito");
                    return;
                }

                const carrito = window.carritoManager.getCarritoActual();
                const existe = carrito.some(c => Number(c.id) === Number(curso.id));

                if (existe) {
                    mostrarDialogoVerde("El curso ya está en tu carrito");
                    newBtn.disabled = true;
                    newBtn.classList.add('btn-disabled');
                    newBtn.textContent = "En el carrito ✓";
                    return;
                }

                window.carritoManager.addById(curso.id);

                mostrarDialogoVerde(`Curso "${curso.nombre}" agregado al carrito`);

                newBtn.disabled = true;
                newBtn.classList.add('btn-disabled');
                newBtn.textContent = "Añadido ✓";
                document.dispatchEvent(new CustomEvent("carrito:updated"));
            });
        }
    }

    esconderPopUp() {
        this.tooltip.classList.remove('visible');
        this.tooltip.setAttribute('aria-hidden', 'true');
        setTimeout(() => { if (!this.tooltip.classList.contains('visible')) this.tooltip.innerHTML = ''; }, 220);
    }

    positionTooltip(rect) {
        return;
    }

    escapeHtml(s) {
        return String(s || '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
    }

    actualizarEventos() {
        this.cursosData = this.cargarCursosDesdeStorage();
        this.eventos = this.mapearCursosAEventos(this.cursosData);
        this.generarCalendario(this.fechaActual);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Calendario();
    const ingreso = new Ingreso({ setupEventListeners: false });
    ingreso.updateHeader();
});
