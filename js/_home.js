export class Home {
  constructor() {

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
