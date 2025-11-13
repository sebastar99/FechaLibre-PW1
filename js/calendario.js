import { Ingreso } from "./ingreso.js";

export class Calendario {
    constructor(options = {}) {
        this.detailPage = options.detailPage || './detalleCurso.html';
        this.inscripcionPage = options.inscripcionPage || './perfil.html';

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
        // Nota: Si quieres que inicie en Noviembre 2025 (como indica tu código original), mantenlo
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
    <div style="max-width:420px;">
      <h4 style="margin:0 0 6px 0;">${titulo}</h4>
      <p style="margin:0 0 6px 0;"><strong>Duración:</strong> ${duracion} — <strong>Precio:</strong> ${precio}</p>
      <p style="margin:0 0 8px 0;">${descripcionCorta}${(curso.descripcion || '').length > 150 ? '...' : ''}</p>
      <div style="display:flex; gap:8px;">
        <a href="${this.escapeHtml(urlDetalle)}" target="_blank" class="btn btn-detalle" style="flex:1;">Ver Detalle</a>
        <button type="button" id="btnAddCart" class="btn btn-inscribirse" style="flex:1;">Agregar</button>
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

        const btn = this.tooltip.querySelector('#btnAddCart');
        if (!btn) return;

        btn.addEventListener('click', (e) => {
            e.preventDefault();

            try {
                const ingreso = window.ingreso instanceof Object ? window.ingreso : new Ingreso();

                let usuarioSesion = null;
                try { usuarioSesion = ingreso.getCurrentUser(); } catch (err) { usuarioSesion = null; }
                if (!usuarioSesion) {
                    const maybeKey = ingreso.sessionKey || 'UsuarioActual';
                    try { usuarioSesion = JSON.parse(localStorage.getItem(maybeKey)); } catch (e) { usuarioSesion = null; }
                }

                if (!usuarioSesion || !usuarioSesion.email) {
                    const msg = 'Debes iniciar sesión para agregar cursos al carrito.';
                    if (typeof Swal !== 'undefined') {
                        Swal.fire({ icon: 'info', title: msg, toast: true, position: 'bottom-end', showConfirmButton: true });
                    } else {
                        alert(msg);
                    }
                    return;
                }

                const storageKey = ingreso.storageKey || 'Usuarios';
                const usuarios = JSON.parse(localStorage.getItem(storageKey)) || [];
                const uIndex = usuarios.findIndex(u => u.email === usuarioSesion.email);

                if (uIndex === -1) {
                    const msg = 'No se encontró tu cuenta en el sistema. Intenta volver a iniciar sesión.';
                    if (typeof Swal !== 'undefined') {
                        Swal.fire({ icon: 'error', title: msg, toast: true, position: 'bottom-end', showConfirmButton: true });
                    } else {
                        alert(msg);
                    }
                    return;
                }

                usuarios[uIndex].carrito = usuarios[uIndex].carrito || [];

                const existe = usuarios[uIndex].carrito.some(c => Number(c.id) === Number(curso.id));
                if (existe) {
                    const msg = 'El curso ya está en tu carrito.';
                    if (typeof Swal !== 'undefined') {
                        Swal.fire({ icon: 'info', title: msg, toast: true, position: 'bottom-end', showConfirmButton: false, timer: 1400 });
                    } else {
                        alert(msg);
                    }
                    btn.disabled = true;
                    btn.textContent = 'En el carrito ✓';
                    return;
                }

                const cursoParaCarrito = {
                    id: curso.id,
                    nombre: curso.nombre,
                    precio: curso.precio
                };
                usuarios[uIndex].carrito.push(cursoParaCarrito);

                // guardar cambios
                localStorage.setItem(storageKey, JSON.stringify(usuarios));

                // feedback visual
                btn.disabled = true;
                btn.textContent = 'Añadido ✓';
                btn.style.opacity = '0.9';

                // actualizar header/perfil si existe la función
                try { if (typeof ingreso.updateHeader === 'function') ingreso.updateHeader(); } catch (e) { /* noop */ }

                // mostrar notificación
                const notMsg = `Curso "${curso.nombre}" agregado al carrito.`;
                if (typeof Swal !== 'undefined') {
                    Swal.fire({ toast: true, position: 'bottom-end', icon: 'success', title: notMsg, showConfirmButton: false, timer: 1400 });
                } else {
                    alert(notMsg);
                }
            } catch (err) {
                console.error('Error al agregar al carrito:', err);
                alert('Ocurrió un error al agregar al carrito. Revisa la consola.');
            }
        }, { once: true });
    }


    esconderPopUp() {
        this.tooltip.classList.remove('visible');
        this.tooltip.setAttribute('aria-hidden', 'true');
    }

    positionTooltip(rect) {
        const padding = 12;
        const tooltipRect = this.tooltip.getBoundingClientRect();

        let left = rect.left + window.scrollX + (rect.width / 2) - (tooltipRect.width / 2);
        let top = rect.top + window.scrollY + rect.height + 10;

        if (left < window.scrollX + padding) left = window.scrollX + padding;
        if (left + tooltipRect.width + padding > window.innerWidth + window.scrollX) {
            left = window.innerWidth + window.scrollX - tooltipRect.width - padding;
        }
        if (top + tooltipRect.height + padding > window.innerHeight + window.scrollY) {
            top = rect.top + window.scrollY - tooltipRect.height - 12;
        }

        this.tooltip.style.left = `${left}px`;
        this.tooltip.style.top = `${top}px`;
        const arrowLeft = Math.max(12, (rect.left + window.scrollX + (rect.width / 2)) - left);
        this.tooltip.style.setProperty('--arrow-left', `${arrowLeft}px`);
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
    const calendario = new Calendario();
    const ingreso = new Ingreso({ setupEventListeners: false });
    ingreso.updateHeader();
});