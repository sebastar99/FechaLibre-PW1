export class Ingreso {
  constructor(options = {}) {
    this.storageKey = options.storageKey || 'Usuarios';
    this.sessionKey = options.sessionKey || 'UsuarioActual';

    this.ids = {
      welcomeMsg: 'welcomeMsg',
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
      registroForm.addEventListener('submit', (e) => this.handleRegistro(e));
    }

    // login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => this.handleLogin(e));
    }

    // logout button (puede estar en profile.html)
    const btnLogout = document.getElementById(this.ids.btnLogout);
    if (btnLogout) {
      btnLogout.addEventListener('click', () => this.logout());
    }

    // eliminar button (puede estar en profile.html)
    const btnEliminar = document.getElementById(this.ids.btnEliminar);
    if (btnEliminar) {
      btnEliminar.addEventListener('click', () => this.eliminar());
    }

    // Recuperar contraseña
    const forgotLink = document.querySelector(".auth__forgot");
    if (forgotLink) {
      forgotLink.addEventListener("click", (e) => {
        e.preventDefault();
        this.recuperarContrasena();
      });
    }
  }

  // ---------- REGISTRO ----------
  handleRegistro(evento) {
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
    alert(`¡Usuario ${nombre} registrado con éxito!`);
    this.resetRegistroForm();
  }

  resetRegistroForm() {
    if (document.getElementById('RegistroNombre')) document.getElementById('RegistroNombre').value = '';
    if (document.getElementById('RegistroEmail')) document.getElementById('RegistroEmail').value = '';
    if (document.getElementById('RegistroContraseña')) document.getElementById('RegistroContraseña').value = '';
  }

  // ---------- LOGIN ----------
  handleLogin(evento) {
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

    // Guardar sesión (solo los datos públicos, sin contraseña)
    const usuarioSesion = { nombre: usuario.nombre, email: usuario.email };
    localStorage.setItem(this.sessionKey, JSON.stringify(usuarioSesion));

    // actualizar header (por si el login ocurrió en la misma página)
    this.updateHeader();

    // redirigir a home
    window.location.href = '/home.html';
  }

  // ---------- SESSION & HEADER ----------
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
      Swal.fire({
        icon: "error",
        title: "Sin sesión activa",
        text: "No hay ningún usuario logueado actualmente.",
      });
      return;
    }

    // Mostrar modal para pedir contraseña
    const { value: passConfirm } = await Swal.fire({
      title: "Eliminar cuenta",
      input: "password",
      inputLabel: "Confirma tu contraseña para eliminar tu cuenta",
      inputPlaceholder: "Escribe tu contraseña...",
      inputAttributes: {
        autocapitalize: "off",
        autocorrect: "off",
      },
      showCancelButton: true,
      confirmButtonText: "Eliminar cuenta",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#e74c3c",
      cancelButtonColor: "#6c757d",
      showLoaderOnConfirm: true,
      preConfirm: (pass) => {
        if (!pass) {
          Swal.showValidationMessage("Debes ingresar tu contraseña");
        }
        return pass;
      },
    });

    if (!passConfirm) return;

    // Buscar usuario en la lista
    const usuarioEncontrado = usuarios.find(u => u.email === usuarioActual.email);
    if (!usuarioEncontrado) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se encontró el usuario actual.",
      });
      return;
    }

    // Validar contraseña
    if (usuarioEncontrado.pass !== passConfirm) {
      Swal.fire({
        icon: "error",
        title: "Contraseña incorrecta",
        text: "No se eliminó la cuenta.",
      });
      return;
    }

    // Confirmación final
    const confirmacion = await Swal.fire({
      icon: "warning",
      title: "¿Seguro que deseas eliminar tu cuenta?",
      text: "Esta acción no se puede deshacer.",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#e74c3c",
    });

    if (!confirmacion.isConfirmed) return;

    const nuevosUsuarios = usuarios.filter(u => u.email !== usuarioActual.email);
    localStorage.setItem(this.storageKey, JSON.stringify(nuevosUsuarios));
    localStorage.removeItem(this.sessionKey);

    // Mostrar mensaje final
    await Swal.fire({
      icon: "success",
      title: "Cuenta eliminada",
      text: "Tu cuenta se eliminó correctamente.",
      confirmButtonColor: "#5499c7",
    });

    this.updateHeader();
    window.location.href = "/home.html";
  }


  // Reemplazar recuperarContrasena() por ESTE método
async recuperarContrasena() {
  // Si ya existe un dialog previo, lo eliminamos para evitar duplicados
  const prev = document.getElementById('dlgRecuperar');
  if (prev) prev.remove();

  // --- Crear estilos (si no existen) ---
  if (!document.getElementById('dlgRecuperarStyles')) {
    const style = document.createElement('style');
    style.id = 'dlgRecuperarStyles';
    style.textContent = `
      /* centrado y apariencia del dialog */
      .custom-dialog {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        max-width: 460px;
        width: 92%;
        border-radius: 10px;
        padding: 0;
        box-sizing: border-box;
        z-index: 12000;
        box-shadow: 0 20px 50px rgba(0,0,0,0.35);
        border: 1px solid rgba(0,0,0,0.08);
        background: #fff;
      }
      .custom-dialog::backdrop {
        background: rgba(0,0,0,0.45);
      }
      .custom-dialog .dlg-body {
        padding: 1.1rem;
        display:flex;
        flex-direction:column;
        gap:0.6rem;
      }
      .custom-dialog h3 {
        margin: 0 0 0.2rem 0;
        font-size: 1.05rem;
      }
      .custom-dialog .dlg-input {
        width:100%;
        padding:0.6rem;
        border:1px solid #ddd;
        border-radius:6px;
        box-sizing:border-box;
        font-size:0.95rem;
      }
      .custom-dialog .dlg-feedback {
        min-height:1.2em;
        font-size:0.92rem;
        color: #e74c3c;
      }
      .custom-dialog .dlg-actions {
        display:flex;
        justify-content:flex-end;
        gap:0.6rem;
        padding: 0.8rem 1.1rem;
        background: #fafafa;
        border-top: 1px solid rgba(0,0,0,0.03);
        border-radius: 0 0 10px 10px;
      }
      .custom-dialog .dlg-btn {
        padding:0.55rem 0.9rem;
        border-radius:6px;
        border:1px solid #ddd;
        background:#f5f5f5;
        cursor:pointer;
      }
      .custom-dialog .dlg-btn.primary {
        background: var(--color__boton, #5499c7);
        color:#fff;
        border:none;
      }
    `;
    document.head.appendChild(style);
  }

  // --- Crear el dialog DOM ---
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

  // Mostrar (try/catch por compatibilidad)
  try {
    dialog.showModal();
  } catch (err) {
    // algunos navegadores requieren append antes de showModal; ya lo hicimos
    try { dialog.show(); } catch (e) { /* fallback silencioso */ }
  }

  // Referencias
  const emailInput = dialog.querySelector('#dlgEmail');
  const passInput = dialog.querySelector('#dlgPass');
  const feedback = dialog.querySelector('#dlgFeedback');
  const btnCancel = dialog.querySelector('#dlgCancel');
  const btnSubmit = dialog.querySelector('#dlgSubmit');

  // Helper para cerrar y eliminar dialog
  const closeAndRemove = () => {
    try { dialog.close(); } catch (e) {}
    dialog.remove();
  };

  // Click fuera del dialog cierra (backdrop)
  dialog.addEventListener('click', (ev) => {
    if (ev.target === dialog) closeAndRemove();
  });

  // Cancel
  btnCancel.addEventListener('click', () => {
    closeAndRemove();
  });

  // Enter en inputs submit
  [emailInput, passInput].forEach(input => {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        btnSubmit.click();
      }
    });
  });

  // Submit
  btnSubmit.addEventListener('click', () => {
    feedback.textContent = '';
    const email = (emailInput.value || '').trim();
    const nuevaPass = (passInput.value || '');

    if (!email || !nuevaPass) {
      feedback.textContent = 'Completa ambos campos.';
      if (!email) emailInput.focus(); else passInput.focus();
      return;
    }

    // cargar usuarios
    const usuarios = JSON.parse(localStorage.getItem(this.storageKey)) || [];
    const usuario = usuarios.find(u => u.email === email);

    if (!usuario) {
      feedback.textContent = 'No existe una cuenta asociada a ese correo.';
      emailInput.focus();
      return;
    }

    // feedback positivo
    feedback.style.color = '#2ecc71';
    feedback.textContent = 'Contraseña actualizada correctamente.';

    // cerrar y notificar (pequeño delay para que el usuario vea el mensaje)
    setTimeout(() => {
      closeAndRemove();
    }, 700);
  });

  // cerrar con ESC (si el navegador soporta el evento 'cancel')
  dialog.addEventListener('cancel', () => closeAndRemove());
}




  updateHeader() {
    const welcomeMsg = document.getElementById(this.ids.welcomeMsg);
    const userNameSpan = document.getElementById(this.ids.userName);
    const userIcon = document.getElementById(this.ids.userIcon);
    const favIcon = document.getElementById(this.ids.favIcon);
    const cartIcon = document.getElementById(this.ids.cartIcon);

    const usuario = this.getCurrentUser();

    if (usuario) {
      if (userNameSpan) userNameSpan.textContent = usuario.nombre;
      if (welcomeMsg) welcomeMsg.style.display = 'inline';

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
      if (welcomeMsg) welcomeMsg.style.display = 'none';
      if (userIcon) {
        userIcon.href = '/pages/ingreso.html';
        userIcon.title = 'Iniciar sesión';
      }
      if (favIcon) favIcon.style.display = 'none';
      if (cartIcon) cartIcon.style.display = 'none';
    }
  }

  populateProfile(selectors = {}) {
    const s = Object.assign({
      perfilNombre: 'perfilNombre',
      perfilEmail: 'perfilEmail',
      listaFavoritos: 'listaFavoritos',
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
    const listaFav = document.getElementById(s.listaFavoritos);
    const listaComp = document.getElementById(s.listaCompras);

    if (perfilNombre) perfilNombre.textContent = usuario.nombre;
    if (perfilEmail) perfilEmail.textContent = usuario.email;

    // obtengo el usuario completo del array para acceder a favoritos/compras
    const usuarios = JSON.parse(localStorage.getItem(this.storageKey)) || [];
    const usuarioCompleto = usuarios.find(u => u.email === usuario.email) || { favoritos: [], compras: [] };

    this._renderLista(listaFav, usuarioCompleto.favoritos || [], 'No tienes cursos en el carrito aun.');
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
  }

  _renderLista(ulElement, items = [], textoVacio = '') {
    if (!ulElement) return;
    ulElement.innerHTML = '';
    if (!items.length) {
      const li = document.createElement('li');
      li.textContent = textoVacio;
      ulElement.appendChild(li);
      return;
    }
    items.forEach(it => {
      const li = document.createElement('li');
      li.textContent = typeof it === 'string' ? it : (it.titulo || JSON.stringify(it));
      ulElement.appendChild(li);
    });
  }

  // ---------- FAVORITOS / COMPRAS helpers ----------
  // agrega favorito al usuario logueado (guarda dentro del array Usuarios)
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
}
