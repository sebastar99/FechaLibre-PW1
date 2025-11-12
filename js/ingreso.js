export class Ingreso {
  constructor(options = {}) {
    this.storageKey = options.storageKey || 'Usuarios';
    this.sessionKey = options.sessionKey || 'UsuarioActual';

    this.ids = {
      mensaje: 'mensaje',
      userName: 'userName',
      userIcon: 'userIcon',
      favIcon: 'favIcon',
      cartIcon: 'cartIcon',
      btnLogout: 'btnLogout',
      btnEliminar: 'btnEliminar'
    };

    this.setupEventListeners();
    this.updateHeader();
  }

  // ---------- EVENT LISTENERS ----------
  setupEventListeners() {
    // registro
    const registroForm = document.getElementById('signupForm');
    if (registroForm) {
      registroForm.addEventListener('submit', (e) => this.registro(e));
    }

    // login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => this.login(e));
    }

    // logout
    const btnLogout = document.getElementById(this.ids.btnLogout);
    if (btnLogout) {
      btnLogout.addEventListener('click', () => this.logout());
    }

    // eliminar
    const btnEliminar = document.getElementById(this.ids.btnEliminar);
    if (btnEliminar) {
      btnEliminar.addEventListener('click', () => this.eliminar());
    }

    // Recuperar contraseña
    const forgotLink = document.querySelector(".olvidar");
    if (forgotLink) {
      forgotLink.addEventListener("click", (e) => {
        e.preventDefault();
        this.recuperarContrasena();
      });
    }
  }

  // ---------- REGISTRO ----------
  registro(evento) {
    evento.preventDefault();
    const nombre = (document.getElementById('RegistroNombre')?.value || '').trim();
    const email = (document.getElementById('RegistroEmail')?.value || '').trim();
    const pass = (document.getElementById('RegistroContraseña')?.value || '').trim();

    if (!nombre || !email || !pass) {
      alert('Completa todos los campos.');
      return;
    }

    const usuarios = JSON.parse(localStorage.getItem(this.storageKey)) || [];
    if (usuarios.find(u => u.email === email)) {
      alert('Error: Este correo electrónico ya se encuentra registrado.');
      return;
    }

    const nuevoUsuario = {
      nombre,
      email,
      pass,
      carrito: [],
      compras: []
    };

    usuarios.push(nuevoUsuario);
    localStorage.setItem(this.storageKey, JSON.stringify(usuarios));
    this.resetRegistroForm();

    // Notificar creación (pequeño diálogo)
    if (typeof Swal !== 'undefined') {
      Swal.fire({ icon: 'success', title: 'Usuario creado', text: 'Tu cuenta fue creada correctamente.', confirmButtonColor: '#5499c7' });
    } else {
      alert('Usuario creado correctamente.');
    }
  }

  resetRegistroForm() {
    if (document.getElementById('RegistroNombre')) document.getElementById('RegistroNombre').value = '';
    if (document.getElementById('RegistroEmail')) document.getElementById('RegistroEmail').value = '';
    if (document.getElementById('RegistroContraseña')) document.getElementById('RegistroContraseña').value = '';
  }

  // ---------- LOGIN ----------
  login(evento) {
    evento.preventDefault();
    const emailLogin = (document.getElementById('loginEmail')?.value || '').trim();
    const passLogin = (document.getElementById('loginPass')?.value || '').trim();

    const usuarios = JSON.parse(localStorage.getItem(this.storageKey)) || [];
    const usuario = usuarios.find(u => u.email === emailLogin);

    if (!usuario) {
      alert('No se encontró un usuario con ese email.');
      return;
    }

    if (usuario.pass !== passLogin) {
      alert('Contraseña incorrecta.');
      return;
    }

    const usuarioSesion = { nombre: usuario.nombre, email: usuario.email };
    localStorage.setItem(this.sessionKey, JSON.stringify(usuarioSesion));
    this.updateHeader();
    window.location.href = '/home.html';
  }

  getCurrentUser() {
    const json = localStorage.getItem(this.sessionKey);
    return json ? JSON.parse(json) : null;
  }

  logout(redirect = '/pages/ingreso.html') {
    localStorage.removeItem(this.sessionKey);
    this.updateHeader();
    if (redirect) window.location.href = redirect;
  }

  async eliminar() {
    const usuarioActual = JSON.parse(localStorage.getItem(this.sessionKey));
    const usuarios = JSON.parse(localStorage.getItem(this.storageKey)) || [];

    if (!usuarioActual) {
      alert('No hay sesión activa.');
      return;
    }

    const usuarioEncontrado = usuarios.find(u => u.email === usuarioActual.email);
    if (!usuarioEncontrado) {
      alert('Error: no se encontró el usuario actual.');
      return;
    }

    // Fallback si no soporta <dialog>
    if (typeof HTMLDialogElement !== 'function') {
      const passConfirm = prompt('Confirma tu contraseña para eliminar la cuenta:');
      if (!passConfirm) return;
      if (passConfirm !== usuarioEncontrado.pass) {
        alert('Contraseña incorrecta. No se eliminó la cuenta.');
        return;
      }
      const ok = confirm('¿Seguro que deseas eliminar tu cuenta? Esta acción no se puede deshacer.');
      if (!ok) return;
      const nuevosUsuarios = usuarios.filter(u => u.email !== usuarioActual.email);
      localStorage.setItem(this.storageKey, JSON.stringify(nuevosUsuarios));
      localStorage.removeItem(this.sessionKey);
      alert('Cuenta eliminada correctamente.');
      this.updateHeader();
      window.location.href = '/home.html';
      return;
    }

    // dialog con contraseña y confirmación (ya está correctamente implementado en tu código)
    if (!document.getElementById('style-dialog-eliminar')) {
      const style = document.createElement('style');
      style.id = 'style-dialog-eliminar';
      style.textContent = `
      .dlg-eliminar { position: fixed; top:50%; left:50%; transform: translate(-50%,-50%); max-width:480px; width:92%; border-radius:10px; box-shadow: 0 20px 50px rgba(0,0,0,.35); border:1px solid rgba(0,0,0,.06); background:#fff; z-index:12000; }
      .dlg-eliminar::backdrop { background: rgba(0,0,0,0.45); }
      .dlg-eliminar .body { padding:1rem; display:flex; flex-direction:column; gap:0.6rem; }
      .dlg-eliminar h3 { margin:0; font-size:1.05rem; }
      .dlg-eliminar .input { width:100%; padding:0.6rem; border:1px solid #ddd; border-radius:6px; font-size:0.95rem; box-sizing:border-box; }
      .dlg-eliminar .feedback { min-height:1.2em; color:#e74c3c; font-size:0.95rem; }
      .dlg-eliminar .actions { display:flex; justify-content:flex-end; gap:0.6rem; padding:0.8rem 1rem; background:#fafafa; border-top:1px solid rgba(0,0,0,0.03); border-radius:0 0 10px 10px; }
      .dlg-eliminar .btn { padding:0.55rem 0.9rem; border-radius:6px; border:1px solid #ddd; background:#f5f5f5; cursor:pointer; }
      .dlg-eliminar .btn.primary { background: var(--color__boton, #5499c7); color:#fff; border:none; }
    `;
      document.head.appendChild(style);
    }

    const usuariosLista = usuarios; // alias
    const dlg1 = document.createElement('dialog');
    dlg1.className = 'dlg-eliminar';
    dlg1.id = 'dlgEliminarPass';
    dlg1.innerHTML = `
      <div class="body" role="document" aria-labelledby="dlgEliminarTitle">
        <h3 id="dlgEliminarTitle">Eliminar cuenta</h3>
        <div class="feedback" id="dlgEliminarFeedback"></div>
        <label style="font-size:0.95rem;color:#222;">Confirma tu contraseña
          <input id="dlgEliminarPassInput" class="input" type="password" placeholder="Escribe tu contraseña..." />
        </label>
      </div>
      <div class="actions" role="toolbar">
        <button id="dlgEliminarCancel" type="button" class="btn">Cancelar</button>
        <button id="dlgEliminarNext" type="button" class="btn primary">Eliminar cuenta</button>
      </div>
    `;
    document.body.appendChild(dlg1);

    try { dlg1.showModal(); } catch (e) { try { dlg1.show(); } catch (e) { } }

    const inp = dlg1.querySelector('#dlgEliminarPassInput');
    const feedback = dlg1.querySelector('#dlgEliminarFeedback');
    const btnCancel = dlg1.querySelector('#dlgEliminarCancel');
    const btnNext = dlg1.querySelector('#dlgEliminarNext');

    const closeRemove = (el) => { try { el.close(); } catch (e) { } el.remove(); };

    dlg1.addEventListener('click', (ev) => { if (ev.target === dlg1) closeRemove(dlg1); });

    btnCancel.addEventListener('click', () => closeRemove(dlg1));

    inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') btnNext.click(); });

    const proceedToConfirm = () => {
      feedback.textContent = '';
      const passValue = (inp.value || '').trim();
      if (!passValue) {
        feedback.textContent = 'Debes ingresar tu contraseña';
        inp.focus();
        return false;
      }
      if (passValue !== usuarioEncontrado.pass) {
        feedback.textContent = 'Contraseña incorrecta';
        inp.focus();
        return false;
      }
      return true;
    };

    btnNext.addEventListener('click', async () => {
      if (!proceedToConfirm()) return;

      closeRemove(dlg1);

      const dlg2 = document.createElement('dialog');
      dlg2.className = 'dlg-eliminar';
      dlg2.id = 'dlgEliminarConfirm';
      dlg2.innerHTML = `
        <div class="body" role="document" aria-labelledby="dlgEliminarConfirmTitle">
          <h3 id="dlgEliminarConfirmTitle">¿Estás seguro?</h3>
          <p style="margin:0;color:#333;">Esta acción eliminará tu cuenta permanentemente y no se podrá deshacer.</p>
        </div>
        <div class="actions" role="toolbar">
          <button id="dlgEliminarConfirmCancel" type="button" class="btn">Cancelar</button>
          <button id="dlgEliminarConfirmOk" type="button" class="btn primary">Sí, eliminar</button>
        </div>
      `;
      document.body.appendChild(dlg2);
      try { dlg2.showModal(); } catch (e) { try { dlg2.show(); } catch (e) { } }

      const btnCancel2 = dlg2.querySelector('#dlgEliminarConfirmCancel');
      const btnOk2 = dlg2.querySelector('#dlgEliminarConfirmOk');

      dlg2.addEventListener('click', (ev) => { if (ev.target === dlg2) closeRemove(dlg2); });
      btnCancel2.addEventListener('click', () => closeRemove(dlg2));

      btnOk2.addEventListener('click', () => {
        // eliminar usuario
        const nuevosUsuarios = usuariosLista.filter(u => u.email !== usuarioActual.email);
        localStorage.setItem(this.storageKey, JSON.stringify(nuevosUsuarios));
        localStorage.removeItem(this.sessionKey);
        closeRemove(dlg2);
        this.updateHeader();
        window.location.href = '/home.html';
      });
    });

    dlg1.addEventListener('cancel', () => closeRemove(dlg1));
  }

  // Recuperar contraseña (dialog personalizado)
  async recuperarContrasena() {
    // eliminar dialog anterior si existe
    const prev = document.getElementById('dlgRecuperar');
    if (prev) prev.remove();

    // estilos (se agregan solo una vez)
    if (!document.getElementById('dlgRecuperarStyles')) {
      const style = document.createElement('style');
      style.id = 'dlgRecuperarStyles';
      style.textContent = `
      .custom-dialog { position: fixed; top:50%; left:50%; transform: translate(-50%,-50%); max-width:460px; width:92%; border-radius:10px; box-shadow:0 20px 50px rgba(0,0,0,0.35); border:1px solid rgba(0,0,0,0.08); background:#fff; z-index:12000; }
      .custom-dialog::backdrop { background: rgba(0,0,0,0.45); }
      .custom-dialog .dlg-body { padding:1.1rem; display:flex; flex-direction:column; gap:0.6rem; }
      .custom-dialog h3 { margin:0 0 0.2rem 0; font-size:1.05rem; }
      .custom-dialog .dlg-input { width:100%; padding:0.6rem; border:1px solid #ddd; border-radius:6px; box-sizing:border-box; font-size:0.95rem; }
      .custom-dialog .dlg-feedback { min-height:1.2em; font-size:0.92rem; color:#e74c3c; }
      .custom-dialog .dlg-actions { display:flex; justify-content:flex-end; gap:0.6rem; padding:0.8rem 1.1rem; background:#fafafa; border-top:1px solid rgba(0,0,0,0.03); border-radius:0 0 10px 10px; }
      .custom-dialog .dlg-btn { padding:0.55rem 0.9rem; border-radius:6px; border:1px solid #ddd; background:#f5f5f5; cursor:pointer; }
      .custom-dialog .dlg-btn.primary { background: var(--color__boton, #5499c7); color:#fff; border:none; }
    `;
      document.head.appendChild(style);
    }

    // crear dialog
    const dialog = document.createElement('dialog');
    dialog.id = 'dlgRecuperar';
    dialog.className = 'custom-dialog';
    dialog.innerHTML = `
    <div class="dlg-body" role="document" aria-labelledby="dlgRecuperarTitle">
      <h3 id="dlgRecuperarTitle">Recuperar contraseña</h3>
      <div class="dlg-feedback" id="dlgFeedback"></div>

      <label style="font-size:0.92rem;color:#333;">
        Correo electrónico
        <input id="dlgEmail" class="dlg-input" type="email" placeholder="tu@correo.com" />
      </label>

      <label style="font-size:0.92rem;color:#333;">
        Nueva contraseña
        <input id="dlgPass" class="dlg-input" type="password" placeholder="Nueva contraseña" />
      </label>
    </div>

    <div class="dlg-actions" role="toolbar">
      <button type="button" id="dlgCancel" class="dlg-btn">Cancelar</button>
      <button type="button" id="dlgSubmit" class="dlg-btn primary">Actualizar contraseña</button>
    </div>
  `;
    document.body.appendChild(dialog);

    // mostrar (compatibilidad)
    try { dialog.showModal(); } catch (e) { try { dialog.show(); } catch (e) { /* fallback silencioso */ } }

    // referencias
    const emailInput = dialog.querySelector('#dlgEmail');
    const passInput = dialog.querySelector('#dlgPass');
    const feedback = dialog.querySelector('#dlgFeedback');
    const btnCancel = dialog.querySelector('#dlgCancel');
    const btnSubmit = dialog.querySelector('#dlgSubmit');

    // helper para cerrar y eliminar
    const closeAndRemove = () => {
      try { dialog.close(); } catch (e) { }
      dialog.remove();
    };

    // close on backdrop click
    dialog.addEventListener('click', (ev) => { if (ev.target === dialog) closeAndRemove(); });

    // cancelar
    btnCancel.addEventListener('click', () => closeAndRemove());

    // submit on Enter
    [emailInput, passInput].forEach(input => {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          btnSubmit.click();
        }
      });
    });

    btnSubmit.addEventListener('click', () => {
      feedback.textContent = '';
      feedback.style.color = '#e74c3c';

      const email = (emailInput.value || '').trim();
      const nuevaPass = (passInput.value || '').trim();

      if (!email || !nuevaPass) {
        feedback.textContent = 'Completa ambos campos.';
        if (!email) emailInput.focus(); else passInput.focus();
        return;
      }

      // cargar usuarios y buscar
      const usuarios = JSON.parse(localStorage.getItem(this.storageKey)) || [];
      const usuarioIndex = usuarios.findIndex(u => u.email === email);

      if (usuarioIndex === -1) {
        feedback.textContent = 'No existe una cuenta asociada a ese correo.';
        emailInput.focus();
        return;
      }

      usuarios[usuarioIndex].pass = nuevaPass;
      localStorage.setItem(this.storageKey, JSON.stringify(usuarios));

      // feedback positivo
      feedback.style.color = '#2ecc71';
      feedback.textContent = 'Contraseña actualizada correctamente';

      // cerrar y mostrar confirmación
      setTimeout(() => {
        closeAndRemove();
        if (typeof Swal !== 'undefined') {
          Swal.fire({ icon: 'success', title: 'Contraseña actualizada', text: 'Tu nueva contraseña fue guardada correctamente.', confirmButtonColor: '#5499c7' });
        } else {
          alert('Contraseña actualizada correctamente.');
        }
      }, 800);
    });

    dialog.addEventListener('cancel', () => closeAndRemove());
  }

  // ---------- HEADER ----------
  updateHeader() {
    const mensaje = document.getElementById(this.ids.mensaje);
    const userNameSpan = document.getElementById(this.ids.userName);
    const userIcon = document.getElementById(this.ids.userIcon);
    const favIcon = document.getElementById(this.ids.favIcon);
    const cartIcon = document.getElementById(this.ids.cartIcon);

    const usuario = this.getCurrentUser();

    if (usuario) {
      if (userNameSpan) userNameSpan.textContent = usuario.nombre;
      if (mensaje) mensaje.style.display = 'inline';

      if (userIcon) {
        userIcon.href = '/pages/perfil.html';
        userIcon.title = 'Ir a tu perfil';
      }
      if (cartIcon) {
        cartIcon.style.display = 'inline-block';
        if (!cartIcon.href || cartIcon.href.endsWith('#')) cartIcon.href = '/pages/compras.html';
      }
    } else {
      if (userNameSpan) userNameSpan.textContent = '';
      if (mensaje) mensaje.style.display = 'none';
      if (userIcon) {
        userIcon.href = '/pages/ingreso.html';
        userIcon.title = 'Iniciar sesión';
      }
      if (favIcon) favIcon.style.display = 'none';
      if (cartIcon) cartIcon.style.display = 'none';
    }
  }

  // ---------- PERFIL (carrito & compras) ----------
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

    // cargar elementos y pintar
    const perfilNombre = document.getElementById(s.perfilNombre);
    const perfilEmail = document.getElementById(s.perfilEmail);
    const listaFav = document.getElementById(s.listaCarrito);
    const listaComp = document.getElementById(s.listaCompras);

    if (perfilNombre) perfilNombre.textContent = usuario.nombre;
    if (perfilEmail) perfilEmail.textContent = usuario.email;

    // obtengo el usuario completo del array para acceder a carrito/compras
    const usuarios = JSON.parse(localStorage.getItem(this.storageKey)) || [];
    const usuarioCompleto = usersFindSafe(usuarios, usuario.email);

    // renderizar carrito y compras
    this._renderLista(listaFav, usuarioCompleto.carrito || [], 'No tienes cursos en el carrito aun.');
    this._renderLista(listaComp, usuarioCompleto.compras || [], 'No has comprado cursos aun.');

    // aseguro que el logout del profile llame al método
    const btnLogout = document.getElementById(this.ids.btnLogout);
    if (btnLogout && !btnLogout._hasHandler) {
      btnLogout.addEventListener('click', () => this.logout('/pages/ingreso.html'));
      btnLogout._hasHandler = true;
    }

    const btnEliminar = document.getElementById(this.ids.btnEliminar);
    if (btnEliminar && !btnEliminar._hasHandler) {
      btnEliminar.addEventListener('click', () => this.eliminar('/pages/ingreso.html'));
      btnEliminar._hasHandler = true;
    }

    // helper local: evita crash si usuarios es undefined
    function usersFindSafe(list, email) {
      if (!Array.isArray(list)) return { carrito: [], compras: [] };
      return list.find(u => u.email === email) || { carrito: [], compras: [] };
    }
  }

  // ---------- RENDER LIST (carrito / compras) ----------
  _renderLista(ulElement, items = [], textoVacio = '') {
    if (!ulElement) return;
    ulElement.innerHTML = '';

    // Necesitamos referencia a this dentro de closures
    const self = this;

    // Insertar estilos si aún no existen
    if (!document.getElementById('carritoStyles')) {
      const style = document.createElement('style');
      style.id = 'carritoStyles';
      style.textContent = `
      #listaCarrito, #listaCompras {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }
      .carrito-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #fff;
        border: 1px solid rgba(0,0,0,0.08);
        border-radius: 10px;
        padding: 1rem 1.2rem;
        box-shadow: 0 3px 10px rgba(0,0,0,0.05);
        transition: transform .15s ease, box-shadow .15s ease;
        gap: 1em;
      }
      .carrito-item:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 18px rgba(0,0,0,0.08);
      }
      .carrito-info {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        max-width: 65%;
      }
      .carrito-nombre {
        font-weight: 600;
        font-size: 1rem;
        color: #222;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .carrito-precio {
        font-size: 0.95rem;
        color: #555;
      }
      .carrito-actions {
        display: flex;
        gap: 0.5rem;
        align-items: center;
      }
      .carrito-btn {
        padding: 0.45rem 0.8rem;
        border-radius: 6px;
        border: none;
        font-size: 0.9rem;
        cursor: pointer;
        transition: background .2s ease, transform .1s ease;
      }
      .carrito-btn:hover { transform: translateY(-1px); }
      .btn-pagar { background: #2ecc71; color: white; }
      .btn-eliminar { background: #e74c3c; color: white; }
      .btn-gift { background: #f1c40f; color: #333; }
      .small-muted { font-size:0.82rem; color:#888; }
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

      // estructura amigable (no JSON crudo)
      li.innerHTML = `
        <div class="carrito-info" title="${escapeHtml(item.nombre || '')}">
          <span class="carrito-nombre">${item.nombre || 'Curso sin título'}</span>
          <span class="carrito-precio">${item.precio || ''}</span>
        </div>
        <div class="carrito-actions">
          <button class="carrito-btn btn-gift" type="button">🎁 Giftcard</button>
          <button class="carrito-btn btn-pagar" type="button">💳 Pagar</button>
          <button class="carrito-btn btn-eliminar" type="button">🗑 Eliminar</button>
        </div>
      `;

      const btnEliminar = li.querySelector('.btn-eliminar');
      const btnPagar = li.querySelector('.btn-pagar');
      const btnGift = li.querySelector('.btn-gift');

      // Eliminar del carrito
      btnEliminar.addEventListener('click', () => {
        const usuario = self.getCurrentUser();
        if (!usuario) return notify('Debes iniciar sesión.');

        const usuarios = JSON.parse(localStorage.getItem(self.storageKey)) || [];
        const uIndex = usuarios.findIndex(u => u.email === usuario.email);
        if (uIndex === -1) return notify('Usuario no encontrado.');

        usuarios[uIndex].carrito = (usuarios[uIndex].carrito || []).filter(c => c.id !== item.id);
        localStorage.setItem(self.storageKey, JSON.stringify(usuarios));
        // re-renderizar lista actual
        self._renderLista(ulElement, usuarios[uIndex].carrito || [], textoVacio);
      });

      // Pagar persona/empresa
      btnPagar.addEventListener('click', () => {
        const usuario = self.getCurrentUser();
        if (!usuario) return notify('Debes iniciar sesión.');

        self._itemSeleccionado = item;
        self.mostrarOpcionPago();
      });

      // Asignar giftcard (simulado)
      btnGift.addEventListener('click', () => {
        const code = prompt('Ingresa el código de giftcard:');
        if (!code) return;
        const usuario = self.getCurrentUser();
        if (!usuario) return notify('Debes iniciar sesión.');

        const usuarios = JSON.parse(localStorage.getItem(self.storageKey)) || [];
        const uIndex = usuarios.findIndex(u => u.email === usuario.email);
        if (uIndex === -1) return notify('Usuario no encontrado.');

        // aplicar giftcard: añadimos propiedad giftcard al item en carrito
        usuarios[uIndex].carrito = usuarios[uIndex].carrito || [];
        const ci = usuarios[uIndex].carrito.find(c => c.id === item.id);
        if (ci) {
          ci.giftcard = code;
        } else {
          // si no está en carrito (raro), lo agregamos con giftcard
          usuarios[uIndex].carrito.push(Object.assign({}, item, { giftcard: code }));
        }
        localStorage.setItem(self.storageKey, JSON.stringify(usuarios));
        // re-render carrito
        const listaCarritoEl = document.getElementById('listaCarrito');
        if (listaCarritoEl) self._renderLista(listaCarritoEl, usuarios[uIndex].carrito || [], 'No tienes cursos en el carrito aun.');

        notify(`Giftcard "${code}" aplicada a ${item.nombre}`);
      });

      ulElement.appendChild(li);
    });

    // pequeño helper para notificaciones (usa Swal si está)
    function notify(msg) {
      if (typeof Swal !== 'undefined') {
        Swal.fire({ icon: 'success', title: msg, toast: true, position: 'bottom-end', showConfirmButton: false, timer: 1800 });
      } else {
        alert(msg);
      }
    }

    // escapar texto para title
    function escapeHtml(str = '') {
      return String(str).replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]));
    }
  }

  // FAVORITOS / COMPRAS helpers (los dejas como tenías)
  addFavorito(curso) {
    const usuario = this.getCurrentUser();
    if (!usuario) { alert('Debes iniciar sesión'); return; }
    const usuarios = JSON.parse(localStorage.getItem(this.storageKey)) || [];
    const u = usuarios.find(x => x.email === usuario.email);
    if (!u) return;
    u.favoritos = u.favoritos || [];
    u.favoritos.push(curso);
    localStorage.setItem(this.storageKey, JSON.stringify(usuarios));
    this.updateHeader();
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
    this.updateHeader();
  }

  // modal de pago

  agregarEstilosModal() {
    if (document.getElementById('estilosModal')) return;
    const style = document.createElement('style');
    style.id = 'estilosModal';
    style.textContent = `
    .modal { 
      position: fixed; 
      top: 50%; 
      left: 50%; 
      transform: translate(-50%, -50%);
      width: 92vw; 
      max-width: 30rem; 
      background: #fff; 
      border: 1px solid #ddd; 
      border-radius: 10px; 
      padding: 0; 
      z-index: 12000; 
    }

    .modal::backdrop { 
      background: rgba(0, 0, 0, .45); 
    }

    .modal-header { 
      display: flex; 
      align-items: center; 
      justify-content: space-between; 
      padding: .8rem 1rem; 
      border-bottom: 1px solid #eee; 
    }

    .modal-titulo { 
      margin: 0; 
      font-size: 1rem; 
      font-weight: 600; 
    }

    .modal-cerrar { 
      background: none; 
      border: none; 
      font-size: 1rem; 
      cursor: pointer; 
      font-weight: bold; 
    }

    .modal-body { 
      padding: 1rem; 
      text-align: center; 
    }

    .modal-botones { 
      display: flex; 
      gap: .6rem; 
      justify-content: flex-end; 
      padding: .8rem 1rem; 
      border-top: 1px solid #eee; 
    }

    .boton { 
      padding: .55rem .9rem; 
      border: 1px solid #ddd; 
      border-radius: 8px; 
      background: #f6f6f6; 
      cursor: pointer; 
    }

    .boton.principal { 
      background: #5499c7; 
      color: #fff; 
      border: none; 
    }

    .campo { 
      display: flex; 
      flex-direction: column; 
      gap: .25rem; 
      margin-bottom: .7rem; 
    }

    .entrada { 
      padding: .55rem .7rem; 
      border: 1px solid #ddd; 
      border-radius: 8px; 
      font-size: .95rem; 
    }
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

    // Función para cerrar el cartel
    function cerrar() {
      if (ventana.close) ventana.close();
      ventana.remove();
    }

    // Botón de cerrar y click fuera del cartel
    ventana.querySelector('.modal-cerrar').addEventListener('click', cerrar);
    ventana.addEventListener('click', (e) => { if (e.target === ventana) cerrar(); });

    // Botones principales
    ventana.querySelector('#botonEmpresa').addEventListener('click', () => {
      cerrar();
      window.location.href = '/pages/inscripcion.html';
    });

    ventana.querySelector('#botonPersona').addEventListener('click', () => {
      cerrar();
      this.mostrarFormularioPersona();
    });

    // Mostrar el modal
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

    // Función para cerrar el cartel
    function cerrar() {
      if (ventana.close) ventana.close();
      ventana.remove();
    }
    
    // Botón de cerrar y click fuera del cartel
    ventana.querySelector('.modal-cerrar').addEventListener('click', cerrar);
    ventana.addEventListener('click', (e) => { if (e.target === ventana) cerrar(); });
    ventana.querySelector('#botonCancelar').addEventListener('click', cerrar);
    
    // Envío del formulario
    const formulario = ventana.querySelector('#formPersona');
    formulario.addEventListener('submit', (e) => {
      e.preventDefault();
      cerrar();

      // Pagar -> mover a compras
      const usuario = this.getCurrentUser()
      if (usuario && this._itemSeleccionado) {
        const usuarios = JSON.parse(localStorage.getItem(this.storageKey)) || [];
        const uIndex = usuarios.findIndex(u => u.email === usuario.email);
        if (uIndex === -1) return notify('Usuario no encontrado.');

        // quitar del carrito
        const producto = this._itemSeleccionado;
        usuarios[uIndex].carrito = (usuarios[uIndex].carrito || []).filter(c => c.id !== producto.id);
        // agregar a compras (si no está)
        usuarios[uIndex].compras = usuarios[uIndex].compras || [];
        if (!usuarios[uIndex].compras.some(c => c.id === producto.id)) {
          usuarios[uIndex].compras.push(producto);
        }
        localStorage.setItem(this.storageKey, JSON.stringify(usuarios));
        // re-render ambos lists si están en el DOM
        const listaCarritoEl = document.getElementById('listaCarrito');
        const listaComprasEl = document.getElementById('listaCompras');
        if (listaCarritoEl) this._renderLista(listaCarritoEl, usuarios[uIndex].carrito || [], 'No tienes cursos en el carrito aun.');
        if (listaComprasEl) this._renderLista(listaComprasEl, usuarios[uIndex].compras || [], 'No has comprado cursos aun.');

        notify(`Pago simulado: ${producto.nombre} añadido a tus compras.`);
      }
      this._itemSeleccionado = null;
      window.location.href = '/pages/pagoInscripcion.html';
    });

    // Mostrar el modal
    ventana.showModal ? ventana.showModal() : ventana.show();
  }

}
