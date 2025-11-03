/*export class Ingreso {

    constructor() {
        // Definimos la "llave" que usará nuestro array en localStorage
        this.storageKey = 'Usuarios';
    }

    registrarse() {
        const registro = document.getElementById('signupForm');
        registro.addEventListener('submit', (evento) => {
            evento.preventDefault();

            const nombre = document.getElementById('RegistroNombre').value;
            const email = document.getElementById('RegistroEmail').value;
            const pass = document.getElementById('RegistroContraseña').value;

            if (!nombre || !email || !pass) {
                alert('Completa todos los campos.');
                return;
            }

            // 1. LEER: Obtenemos el array actual de localStorage.
            // Usamos JSON.parse para convertir el string guardado de vuelta a un array.
            // Si no existe nada (||), usamos un array vacío [].
            const usuariosGuardados = JSON.parse(localStorage.getItem(this.storageKey)) || [];

            // 2. MODIFICAR (B): Creamos el objeto del nuevo usuario
            const nuevoUsuario = {
                nombre: nombre,
                email: email,
                pass: pass // (¡Ver advertencia de seguridad abajo!)
            };

            // 2. MODIFICAR (C): Agregamos el nuevo usuario al array
            usuariosGuardados.push(nuevoUsuario);

            // 3. GUARDAR: Guardamos el array actualizado en localStorage.
            // Usamos JSON.stringify para convertir el array de JS a un string.
            localStorage.setItem(this.storageKey, JSON.stringify(usuariosGuardados));

            alert('¡Usuario registrado con éxito!');

            reset();
        });
    }


    iniciarSesion() {
        const iniciarSesion = document.getElementById("loginForm");
        iniciarSesion.addEventListener("submit", (event) => {
            event.preventDefault();

            const emailLogin = document.getElementById('loginEmail').value;
            const passLogin = document.getElementById('loginPass').value;

            const usuariosGuardados = JSON.parse(localStorage.getItem('Usuarios')) || [];
            const usuarioEncontrado = usuariosGuardados.find(Usuarios => Usuarios.email === emailLogin)
            if (!usuarioEncontrado) {
                alert("No se encontro el usuario");
            } else {
                if (usuarioEncontrado.pass === passLogin) {
                    alert("Usuario Logueado con exito");
                } else {
                    alert("Contraseña incorrecta.");
                }
            }
        });
    }


    reset() {
        document.getElementById('RegistroNombre').value = '';
        document.getElementById('RegistroEmail').value = '';
        document.getElementById('RegistroContraseña').value = '';
    }
}*/
/* /js/ingreso.js */
export class Ingreso {
  constructor(options = {}) {
    // claves en localStorage
    this.storageKey = options.storageKey || 'Usuarios';
    this.sessionKey = options.sessionKey || 'UsuarioActual';

    // ids de elementos del header — asegúrate que el header tenga estos ids
    this.ids = {
      welcomeMsg: 'welcomeMsg',
      userName: 'userName',
      userIcon: 'userIcon',
      favIcon: 'favIcon',
      cartIcon: 'cartIcon',
      btnLogout: 'btnLogout' // si existe en profile.html
    };

    // inicializo listeners y actualizo header si corresponde
    this.setupEventListeners();
    this.updateHeader(); // seguro: chequea existencia de elementos
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

    // estructura del usuario (puedes añadir favoritos/compras aquí)
    const nuevoUsuario = {
      nombre,
      email,
      pass,
      favoritos: [],
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
