export default class Pago {

    constructor({ montoKey = 'montoSeleccionado', montoInputSelector = '#monto', formSelector = '#paymentForm' } = {}) {
        this.montoKey = montoKey;
        this.montoInput = document.querySelector(montoInputSelector);
        this.form = document.querySelector(formSelector);
    }


    _parsePrice(priceStr) {
        if (priceStr == null) return null;
        if (typeof priceStr === 'number') return priceStr;
        const cleaned = String(priceStr).replace(/[^\d]/g, '');
        if (!cleaned) return null;
        return Number(cleaned);
    }


    _findRawPrice() {
        let raw = localStorage.getItem(this.montoKey);
        if (raw) return raw;


        const alternativos = [
            'cursoSeleccionado',
            'selectedCourse',
            'montoSeleccionado',
            'selectedCoursePrice',
            'monto',
            'precioCurso'
        ];
        for (const k of alternativos) {
            const v = localStorage.getItem(k);
            if (v) return v;
        }
        const selId = localStorage.getItem('selectedCourseId') || localStorage.getItem('cursoIdSeleccionado');
        const cursosRaw = localStorage.getItem('cursos');
        if (selId && cursosRaw) {
            try {
                const cursos = JSON.parse(cursosRaw);
                if (Array.isArray(cursos)) {
                    const found = cursos.find(c => String(c.id) === String(selId));
                    if (found) return found.precio || found.price || found.monto || JSON.stringify(found);
                }
            } catch (e) {  }
        }


        if (cursosRaw) {
            try {
                const cursos = JSON.parse(cursosRaw);
                if (Array.isArray(cursos) && cursos.length > 0) {
                    return cursos[0].precio || cursos[0].price || cursos[0].monto || JSON.stringify(cursos[0]);
                }
            } catch (e) { }
        }

        return null;
    }

    populateMonto() {
        if (!this.montoInput) return;
        const raw = this._findRawPrice();
        let candidate = null;

        if (raw) {

            try {
                const maybeObj = JSON.parse(raw);
                if (maybeObj && typeof maybeObj === 'object') {
                    candidate = maybeObj.precio || maybeObj.price || maybeObj.monto || maybeObj.amount || JSON.stringify(maybeObj);
                } else {
                    candidate = raw;
                }
            } catch (e) {
                candidate = raw;
            }
        }

        const amount = this._parsePrice(candidate);
        if (amount != null) {
            this.montoInput.value = amount;
            this.montoInput.readOnly = true;
            this.montoInput.dataset.monto = amount;
        } else {
            this.montoInput.value = '';
            this.montoInput.placeholder = 'Monto no disponible';
            this.montoInput.readOnly = true;
            console.warn('Pago: no se encontró monto en localStorage (keys buscadas).');
        }
    }

    init() {
        this.populateMonto();

        if (this.form) {
            this.form.addEventListener('submit', (e) => {
                
                if (!this.montoInput || !this.montoInput.value) {
                    e.preventDefault();
                    alert('No hay monto disponible para procesar el pago.');
                    return;
                }
            });
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const pago = new Pago();
    pago.init();
});