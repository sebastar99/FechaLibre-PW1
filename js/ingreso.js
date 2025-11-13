export class Ingreso {
  constructor(options = {}) {
    this.storageKey = options.storageKey || 'Usuarios';
    this.sessionKey = options.sessionKey || 'UsuarioActual';

    this.ids = Object.assign({
      mensaje: 'mensaje',
      userName: 'userName',
      userIcon: 'userIcon',
      favIcon: 'favIcon',
      cartIcon: 'cartIcon',
      btnLogout: 'btnLogout',
      btnEliminar: 'btnEliminar'
    }, options.ids || {});

    if (options.setupEventListeners !== false) {
      this.setupEventListeners();
    }

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
      compras: [],
      favoritos: []
    };

    usuarios.push(nuevoUsuario);
    localStorage.setItem(this.storageKey, JSON.stringify(usuarios));
    this.resetRegistroForm();
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

  async recuperarContrasena() {
    const prev = document.getElementById('dlgRecuperar');
    if (prev) prev.remove();

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

    try { dialog.showModal(); } catch (e) { try { dialog.show(); } catch (e) { } }

    const emailInput = dialog.querySelector('#dlgEmail');
    const passInput = dialog.querySelector('#dlgPass');
    const feedback = dialog.querySelector('#dlgFeedback');
    const btnCancel = dialog.querySelector('#dlgCancel');
    const btnSubmit = dialog.querySelector('#dlgSubmit');

    const closeAndRemove = () => {
      try { dialog.close(); } catch (e) { }
      dialog.remove();
    };

    dialog.addEventListener('click', (ev) => { if (ev.target === dialog) closeAndRemove(); });

    btnCancel.addEventListener('click', () => closeAndRemove());

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

      const usuarios = JSON.parse(localStorage.getItem(this.storageKey)) || [];
      const usuarioIndex = usuarios.findIndex(u => u.email === email);

      if (usuarioIndex === -1) {
        feedback.textContent = 'No existe una cuenta asociada a ese correo.';
        emailInput.focus();
        return;
      }

      usuarios[usuarioIndex].pass = nuevaPass;
      localStorage.setItem(this.storageKey, JSON.stringify(usuarios));

      feedback.style.color = '#2ecc71';
      feedback.textContent = 'Contraseña actualizada correctamente';

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
        if (!cartIcon.href || cartIcon.href.endsWith('#')) cartIcon.href = '/pages/perfil.html';
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
}
