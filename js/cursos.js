export class Cursos {
  constructor() {
    const datosDeLosCursos = [
      {
        id: 1,
        nombre: "Introduccion a JavaScript",
        duracion: "38 horas",
        precio: "$158.000",
        img: "/multimedia/cursoDestacado.png",
        imgBanner: "/multimedia/cursoDestacado.png",
        descripcion:
          "En este curso aprenderás los fundamentos de JavaScript y cómo usarlos para crear páginas web interactivas. Verás sintaxis básica, variables, tipos de datos, operadores y estructuras de control (condicionales y bucles). Aprenderás a crear y usar funciones, manejar arreglos y objetos, y trabajar con el DOM para responder a eventos del usuario. También cubrirás conceptos modernos de ES6+ (let/const, arrow functions, template literals) y técnicas básicas de depuración. Al final desarrollarás pequeños proyectos prácticos (calculadoras, listas interactivas y consumo de APIs) que te permitirán aplicar lo aprendido y empezar a construir tu portafolio.",
        requisitos: "HTML y CSS básicos",
        duracionSemanas: "15 semanas",
        dedicacionSemanal: "4 a 6 hs semanales",
        clasesEnVivo: "1 clase semanal de 2hs"
      },
      {
        id: 2,
        nombre: "JavaScript avanzado",
        duracion: "38 horas",
        precio: "$150.000",
        img: "/multimedia/cursoJavaScript.png",
        imgBanner: "/multimedia/cursoDestacado.png",
        descripcion:
          "Curso avanzado donde profundizarás en patrones de diseño, asincronismo avanzado (async/await), Node.js, y desarrollo de aplicaciones web complejas con frameworks modernos. Ideal para quienes buscan ser desarrolladores Full-Stack.",
        requisitos: "JavaScript basico",
        duracionSemanas: "20 semanas",
        dedicacionSemanal: "6 a 8 hs semanales",
        clasesEnVivo: "2 clases semanal de 2hs"
      },
      {
        id: 3,
        nombre: "Introduccion a la IA",
        duracion: "20 horas",
        precio: "$130.000",
        img: "/multimedia/cursoIA.png",
        descripcion:
          "En este curso aprenderás los conceptos fundamentales de la Inteligencia Artificial y el aprendizaje automático, desde la teoría básica hasta su aplicación práctica. Trabajarás con técnicas clave como regresión, clasificación, árboles de decisión, clustering y redes neuronales, y aprenderás a elegir la técnica adecuada según el problema.",
        requisitos: "Ninguno",
        duracionSemanas: "10 semanas",
        dedicacionSemanal: "2 a 4 hs semanales",
        clasesEnVivo: "1 clase semanal de 2hs"
      },
      {
        id: 4,
        nombre: "Curso Diseño Web",
        duracion: "24 horas",
        precio: "$100.000",
        img: "/multimedia/cursoDiseñoWeb.png",
        imgBanner: "/multimedia/cursoDestacado.png",
        descripcion:
          "Aprenderás a crear tu sitio web partiendo del prototipo. Te sumergirás en las mejores prácticas de HTML y CSS, optimización, versionado con GIT, SASS y Bootstrap. Al finalizar, sabrás cómo presentar un presupuesto y atender a tu cliente final.",
        requisitos: "Ninguno",
        duracionSemanas: "12 semanas",
        dedicacionSemanal: "2 a 4 hs semanales",
        clasesEnVivo: "1 clase semanal de 2hs"
      },
      {
        id: 5,
        nombre: "Introduccion a Java",
        duracion: "80 horas",
        precio: "$200.000",
        img: "/multimedia/cursoPoo.png",
        imgBanner: "/multimedia/cursoDestacado.png",
        descripcion:
          "Aprenderás los fundamentos de la programación orientada a objetos (POO) con Java. Cubrirás sintaxis, clases, herencia, polimorfismo, manejo de excepciones y colecciones. Ideal para construir aplicaciones robustas de back-end.",
        requisitos: "Ninguno",
        duracionSemanas: "18 semanas",
        dedicacionSemanal: "4 a 5 hs semanales",
        clasesEnVivo: "2 clases semanal de 2hs"
      },
      {
        id: 6,
        nombre: "Introduccion a C#",
        duracion: "30 horas",
        precio: "$180.000",
        img: "/multimedia/cursoPoo.png",
        imgBanner: "/multimedia/cursoDestacado.png",
        descripcion:
          "Sumérgete en C# y aprende los fundamentos esenciales de la programación moderna. Este curso cubre la sintaxis básica, el manejo de variables y tipos de datos, y el uso de estructuras de control como condicionales y bucles. Adquirirás una introducción práctica a la Programación Orientada a Objetos (POO), creando clases y objetos, preparándote para construir tus primeras aplicaciones en el ecosistema .NET.",
        requisitos: "Ninguno",
        duracionSemanas: "18 semanas",
        dedicacionSemanal: "4 a 5 hs semanales",
        clasesEnVivo: "2 clases semanal de 2hs"
      }
    ];

    // Guardar en localStorage solo si no existe (evita sobrescribir durante dev)
    if (!localStorage.getItem("cursos")) {
      localStorage.setItem("cursos", JSON.stringify(datosDeLosCursos));
    }
  }

  // helpers
  static leerCursos() {
    try {
      return JSON.parse(localStorage.getItem("cursos") || "[]");
    } catch (e) {
      console.error("Error parseando cursos:", e);
      return [];
    }
  }

  static obtenerCursoPorId(id) {
    const cursos = Cursos.leerCursos();
    return cursos.find(c => Number(c.id) === Number(id)) || null;
  }

  // inicializa la vista de detalle: toma ?id=... y reemplaza el contenido del HTML
  static inicializarDetalle() {
    const params = new URLSearchParams(window.location.search);
    const cursoId = params.has("id") ? parseInt(params.get("id"), 10) : null;
    const curso = cursoId ? Cursos.obtenerCursoPorId(cursoId) : Cursos.leerCursos()[0];

    const imgEl = document.querySelector(".curso__foto");
    const tituloEl = document.querySelector(".titulo");
    const descripcionContainer = document.querySelector(".curso__info__descripcion");
    const botones = document.querySelectorAll(".curso__boton");
    const contenidoEl = document.querySelector(".curso__info__contenido");
    const barras = document.querySelectorAll(".curso__barra__info");


    if (tituloEl) tituloEl.textContent = curso.nombre || "Sin título";

    if (descripcionContainer) {
      const precio = curso.precio || "$0";
      const duracionTexto = curso.duracion || curso.duracionSemanas || "N/D";
      const requisitos = curso.requisitos || "Ninguno";
      const descripcion = curso.descripcion || "Descripción no disponible.";
      const certificadoHref = curso.certificadoImage || "/multimedia/ejemploCertificado.png";

      descripcionContainer.innerHTML = `
        <p><strong>Valor:</strong> ${precio}</p>
        <p><strong>Tiempo de dedicación necesario:</strong> ${duracionTexto}</p>
        <p><strong>Descripción del curso:</strong> ${descripcion}</p>
        <p><strong>Requisitos Previos:</strong> ${requisitos}</p>
        <p><strong>Certificado:</strong>
          <a id="linkCertificado" href="${certificadoHref}" target="_blank" rel="noopener">Ver ejemplo de certificado</a>
        </p>
      `;
    }

    // --- Botones ---
    if (botones && botones.length) {
      if (botones[0]) {
        const btn = botones[0].cloneNode(true);
        botones[0].parentNode.replaceChild(btn, botones[0]);
        btn.addEventListener("click", () => {
          localStorage.setItem("cursoSeleccionado", JSON.stringify({ id: curso.id, nombre: curso.nombre, precio: curso.precio }));
          window.location.href = "./inscripcion.html";
        });
      }
      if (botones[1]) {
        const btn2 = botones[1].cloneNode(true);
        botones[1].parentNode.replaceChild(btn2, botones[1]);
        btn2.addEventListener("click", () => {
          localStorage.setItem("cursoParaRegalo", JSON.stringify({ id: curso.id, nombre: curso.nombre, precio: curso.precio }));
          window.open("./giftcard.html", "_blank");
        });
      }
    }

    if (contenidoEl) {
      // siempre dejamos espacio en blanco y luego generamos 3 detalles
      contenidoEl.innerHTML = "";

      // tomar unidades definidas en el curso (si las hay)
      const unidadesCurso = Array.isArray(curso.unidades) ? curso.unidades : [];

      // helper para crear un listado de items seguro
      const safeItems = (arr) => {
        if (!Array.isArray(arr) || arr.length === 0) return null;
        return arr.map(i => String(i));
      };

      // generar exactamente 3 <details>
      for (let i = 0; i < 3; i++) {
        const unidadExistente = unidadesCurso[i] || null;

        // si existe la unidad en los datos, use su título + items; si no, crear contenido por defecto
        const titulo = unidadExistente?.titulo || `UNIDAD ${i + 1}`;
        let items = safeItems(unidadExistente?.items);

        if (!items) {
          // si no hay items, intentamos extraer fragmentos útiles:
          if (i === 0 && curso.descripcion) {
            // primer detalle: usar parte de la descripción como items útiles
            const desc = String(curso.descripcion);
            const primeraLinea = desc.split('.').slice(0, 2).join('.').trim();
            items = primeraLinea ? [primeraLinea + (primeraLinea.endsWith('.') ? '' : '.'), 'Ejercicios prácticos', 'Material descargable'] : ['Contenido próximamente'];
          } else {
            items = ['Contenido próximamente', 'Próximas actualizaciones', 'Contacto para más info'];
          }
        }

        const details = document.createElement("details");
        // Abrir el primer detalle por defecto
        if (i === 0) details.open = true;

        const summary = document.createElement("summary");
        summary.textContent = titulo;
        details.appendChild(summary);

        const ul = document.createElement("ul");
        ul.style.margin = '0.5em 0 1em 1.1em';
        items.forEach(it => {
          const li = document.createElement("li");
          li.textContent = it;
          ul.appendChild(li);
        });

        details.appendChild(ul);
        contenidoEl.appendChild(details);
      }
    }

    if (barras && barras.length > 1) {
      const barraInferior = barras[1];
      const bloques = barraInferior.querySelectorAll("div");
      if (bloques.length >= 4) {
        const duracionValor = curso.duracionSemanas || curso.duracion || "N/D";
        const dedicacionValor = curso.dedicacionSemanal || "N/D";
        const clasesValor = curso.clasesEnVivo || "N/D";
        const requisitosValor = curso.requisitos || "Ninguno";

        const setSegundoP = (bloque, texto) => {
          const ps = bloque.querySelectorAll("p");
          if (ps.length >= 2) ps[1].textContent = texto;
        };

        setSegundoP(bloques[0], duracionValor);
        setSegundoP(bloques[1], dedicacionValor);
        setSegundoP(bloques[2], clasesValor);
        setSegundoP(bloques[3], requisitosValor);
      }
    }
  }

  mostrarRecomendados(containerSelector = '#recomendadosContenedor', detailPage = '/pages/detalleCurso.html') {
    const contenedor = document.querySelector(containerSelector);
    if (!contenedor) return; // si no existe el contenedor, salir silenciosamente
    const cursos = Cursos.leerCursos() || [];
    contenedor.innerHTML = '';

    cursos.forEach(curso => {
      const div = document.createElement('div');
      div.className = 'curso__tarjeta';
      div.innerHTML = `
        <div class="curso__tarjeta__img">
            <img src="${curso.img}" alt="Imagen de ${curso.nombre}">
            <div class="curso__tarjeta__precio">${curso.precio}</div>
            <div class="curso__tarjeta__hora"><strong>${curso.duracion}</strong> <span style="font-weight:400;font-size:11px">hs</span></div>
        </div>
        <div class="curso__tarjeta__info">
            <h3>${curso.nombre}</h3>
            <div class="curso__tarjeta__links">
                <a href="${detailPage}?id=${curso.id}">Ver Detalle</a>
                <a href="/pages/inscripcion.html">
                    <button type="button">Inscribirse</button>
                </a>
            </div>
        </div>
      `;
      contenedor.appendChild(div);
    });
  }
} 
