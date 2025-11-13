import { Ingreso } from "./ingreso.js";

export class Cursos {
  constructor() {
    const datosDeLosCursos = [
      {
        id: 1,
        nombre: "Introducción a JavaScript",
        duracion: "38 horas",
        tipo: "Presencial",
        precio: "$158.000",
        img: "/multimedia/cursoDestacado.png",
        descripcion:
          "En este curso aprenderás los fundamentos de JavaScript y cómo usarlos para crear páginas web interactivas.",
        requisitos: "HTML y CSS básicos",
        duracionSemanas: "15 semanas",
        dedicacionSemanal: "4 a 6 hs semanales",
        clasesEnVivo: "1 clase semanal de 2hs",
        unidades: [
          {
            titulo: "Unidad 1: Fundamentos del Lenguaje",
            items: [
              "Sintaxis básica, variables y tipos de datos",
              "Estructuras de control y funciones",
              "Buenas prácticas en programación"
            ]
          },
          {
            titulo: "Unidad 2: DOM y Eventos",
            items: [
              "Selección y manipulación de elementos del DOM",
              "Eventos y manejo de interacciones del usuario",
              "Creación de interfaces dinámicas"
            ]
          },
          {
            titulo: "Unidad 3: Proyecto Final",
            items: [
              "Desarrollo de aplicación interactiva",
              "Depuración y optimización del código",
              "Entrega y presentación del proyecto"
            ]
          }
        ]
      },
      {
        id: 2,
        nombre: "JavaScript Avanzado",
        duracion: "38 horas",
        tipo: "Online",
        precio: "$150.000",
        img: "/multimedia/cursoJavaScript.png",
        imgBanner: "/multimedia/cursoDestacado.png",
        descripcion:
          "Curso avanzado donde profundizarás en asincronismo, patrones de diseño y frameworks modernos.",
        requisitos: "JavaScript básico",
        duracionSemanas: "20 semanas",
        dedicacionSemanal: "6 a 8 hs semanales",
        clasesEnVivo: "2 clases semanales de 2hs",
        unidades: [
          {
            titulo: "Unidad 1: Asincronismo y APIs",
            items: [
              "Promesas, async/await y fetch",
              "Consumo de APIs REST",
              "Manejo de errores y tiempo de espera"
            ]
          },
          {
            titulo: "Unidad 2: Arquitectura y Patrones",
            items: [
              "Patrones de diseño comunes (Module, Observer, MVC)",
              "Programación funcional y clases ES6",
              "Optimización del rendimiento"
            ]
          },
          {
            titulo: "Unidad 3: Aplicación Completa",
            items: [
              "Proyecto con Node.js o framework front-end",
              "Persistencia de datos y routing",
              "Despliegue en entorno productivo"
            ]
          }
        ]
      },
      {
        id: 3,
        nombre: "Introducción a la IA",
        duracion: "20 horas",
        tipo: "Presencial",
        precio: "$130.000",
        img: "/multimedia/cursoIA.png",
        descripcion:
          "Aprende los conceptos fundamentales de la Inteligencia Artificial y el aprendizaje automático.",
        requisitos: "Ninguno",
        duracionSemanas: "10 semanas",
        dedicacionSemanal: "2 a 4 hs semanales",
        clasesEnVivo: "1 clase semanal de 2hs",
        unidades: [
          {
            titulo: "Unidad 1: Conceptos Básicos de IA",
            items: [
              "Historia y aplicaciones de la IA",
              "Tipos de aprendizaje: supervisado y no supervisado",
              "Modelos y algoritmos más comunes"
            ]
          },
          {
            titulo: "Unidad 2: Machine Learning Práctico",
            items: [
              "Entrenamiento y validación de modelos",
              "Uso de datasets reales",
              "Evaluación con métricas"
            ]
          },
          {
            titulo: "Unidad 3: Proyecto de Clasificación",
            items: [
              "Implementación de modelo simple",
              "Visualización de resultados",
              "Análisis y mejora del modelo"
            ]
          }
        ]
      },
      {
        id: 4,
        nombre: "Curso de Diseño Web",
        duracion: "24 horas",
        tipo: "Online",
        precio: "$100.000",
        img: "/multimedia/cursoDiseñoWeb.png",
        descripcion:
          "Aprenderás a crear sitios web desde cero con HTML, CSS, SASS y Bootstrap.",
        requisitos: "Ninguno",
        duracionSemanas: "12 semanas",
        dedicacionSemanal: "2 a 4 hs semanales",
        clasesEnVivo: "1 clase semanal de 2hs",
        unidades: [
          {
            titulo: "Unidad 1: Estructura y Maquetado",
            items: [
              "HTML5 semántico y accesible",
              "Diseño adaptable (responsive)",
              "Uso de Flexbox y Grid"
            ]
          },
          {
            titulo: "Unidad 2: Estilos y Componentes",
            items: [
              "CSS avanzado y animaciones",
              "SASS y variables personalizadas",
              "Bootstrap y componentes reutilizables"
            ]
          },
          {
            titulo: "Unidad 3: Proyecto Final",
            items: [
              "Creación de un sitio completo",
              "Optimización de rendimiento y SEO básico",
              "Publicación en hosting gratuito"
            ]
          }
        ]
      },
      {
        id: 5,
        nombre: "Introducción a Java",
        duracion: "80 horas",
        tipo: "Presencial",
        precio: "$200.000",
        img: "/multimedia/cursoPoo.png",
        descripcion:
          "Aprenderás los fundamentos de la programación orientada a objetos con Java.",
        requisitos: "Ninguno",
        duracionSemanas: "18 semanas",
        dedicacionSemanal: "4 a 5 hs semanales",
        clasesEnVivo: "2 clases semanales de 2hs",
        unidades: [
          {
            titulo: "Unidad 1: Fundamentos del Lenguaje Java",
            items: [
              "Sintaxis básica y estructuras de control",
              "Clases, objetos y métodos",
              "Tipos de datos y operadores"
            ]
          },
          {
            titulo: "Unidad 2: POO y Colecciones",
            items: [
              "Herencia, polimorfismo y encapsulamiento",
              "Interfaces y clases abstractas",
              "Uso de colecciones y genéricos"
            ]
          },
          {
            titulo: "Unidad 3: Proyecto Final con Java",
            items: [
              "Desarrollo de aplicación de consola",
              "Manejo de archivos y excepciones",
              "Buenas prácticas de programación"
            ]
          }
        ]
      },
      {
        id: 6,
        nombre: "Introducción a C#",
        duracion: "30 horas",
        tipo: "Online",
        precio: "$180.000",
        img: "/multimedia/cursoC.png",
        descripcion:
          "Sumérgete en C# y aprende los fundamentos esenciales de la programación moderna.",
        requisitos: "Ninguno",
        duracionSemanas: "18 semanas",
        dedicacionSemanal: "4 a 5 hs semanales",
        clasesEnVivo: "2 clases semanales de 2hs",
        unidades: [
          {
            titulo: "Unidad 1: Fundamentos de C#",
            items: [
              "Sintaxis básica, variables y tipos",
              "Estructuras de control y bucles",
              "Manejo de entrada/salida"
            ]
          },
          {
            titulo: "Unidad 2: Programación Orientada a Objetos",
            items: [
              "Clases, objetos y métodos",
              "Constructores y sobrecarga",
              "Encapsulamiento y herencia"
            ]
          },
          {
            titulo: "Unidad 3: Proyecto Práctico",
            items: [
              "Aplicación simple con C# y .NET",
              "Depuración y testing básico",
              "Optimización del código"
            ]
          }
        ]
      }
    ];

    localStorage.setItem("cursos", JSON.stringify(datosDeLosCursos));
  }

  // Metodos de Busqueda
  static leerCursos() {
    return JSON.parse(localStorage.getItem("cursos") || "[]");
  }

  static obtenerCursoPorId(id) {
    const cursos = Cursos.leerCursos();
    return cursos.find(c => Number(c.id) === Number(id)) || null;
  }

  // Informacion del curso
  inicializarDetalle() {
    const params = new URLSearchParams(window.location.search);
    const cursoId = params.has("id") ? parseInt(params.get("id"), 10) : null;
    const curso = cursoId ? Cursos.obtenerCursoPorId(cursoId) : Cursos.leerCursos()[0];

    const imgEl = document.querySelector(".curso__foto");
    const tituloEl = document.querySelector(".titulo");
    const descripcionContainer = document.querySelector(".curso__info__descripcion");
    const botones = document.querySelectorAll(".curso__boton");
    const contenidoEl = document.querySelector(".curso__info__contenido");
    const barras = document.querySelectorAll(".curso__barra__info");

    if (imgEl && curso.img) {
      imgEl.src = curso.img;
      imgEl.alt = curso.nombre || "Imagen del curso";
    }


    if (tituloEl) tituloEl.textContent = curso.nombre || "Sin título";

    if (descripcionContainer) {
      const precio = curso.precio || "$0";
      const duracionTexto = curso.duracion || curso.duracionSemanas || "N/D";
      const requisitos = curso.requisitos || "Ninguno";
      const tipo = curso.tipo || "Sin especificar";
      const descripcion = curso.descripcion || "Descripción no disponible.";
      const certificadoHref = curso.certificadoImage || "/multimedia/ejemploCertificado.png";

      descripcionContainer.innerHTML = `
        <p><strong>Valor:</strong> ${precio}</p>
        <p><strong>Tiempo de dedicación necesario:</strong> ${duracionTexto}</p>
        <p><strong>Modalidad de cursada:</strong> ${tipo}</p>
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
          // Verificar usuario logueado
          const usuarioActual = JSON.parse(localStorage.getItem("UsuarioActual"));
          if (!usuarioActual) {
            mostrarDialogoVerde("Debes iniciar sesión para inscribirte");
            return;
          }

          // Obtener todos los usuarios
          const usuarios = JSON.parse(localStorage.getItem("Usuarios")) || [];
          const indiceUsuario = usuarios.findIndex(us => us.email === usuarioActual.email);

          if (indiceUsuario === -1) {
            mostrarDialogoVerde("Error al cargar usuario");
            return;
          }

          const usuario = usuarios[indiceUsuario];
          usuario.carrito = usuario.carrito || [];

          // Verificar si el curso ya está en el carrito
          const yaEsta = usuario.carrito.some(c => Number(c.id) === Number(curso.id));
          if (yaEsta) {
            mostrarDialogoVerde("El curso ya está en tu carrito");
            return;
          }

          usuario.carrito.push({
            id: curso.id,
            nombre: curso.nombre,
            precio: curso.precio
          });

          usuarios[indiceUsuario] = usuario;

          localStorage.setItem("Usuarios", JSON.stringify(usuarios));

          mostrarDialogoVerde("Curso agregado al carrito ✅");
        });
      }
    }


    function mostrarDialogoVerde(mensaje) {
      const dialogo = document.createElement("div");
      dialogo.textContent = mensaje;
      dialogo.style.position = "fixed";
      dialogo.style.bottom = "20px";
      dialogo.style.right = "20px";
      dialogo.style.backgroundColor = "#2ecc71";
      dialogo.style.color = "#fff";
      dialogo.style.padding = "10px 16px";
      dialogo.style.borderRadius = "8px";
      dialogo.style.boxShadow = "0 2px 8px rgba(0,0,0,0.2)";
      dialogo.style.fontSize = "14px";
      dialogo.style.fontWeight = "500";
      dialogo.style.zIndex = "1000";
      dialogo.style.opacity = "0";
      dialogo.style.transition = "opacity 0.3s ease";

      document.body.appendChild(dialogo);

      // Animar entrada
      requestAnimationFrame(() => {
        dialogo.style.opacity = "1";
      });

      // Ocultar automáticamente
      setTimeout(() => {
        dialogo.style.opacity = "0";
        setTimeout(() => dialogo.remove(), 300);
      }, 2000);
    }

    if (contenidoEl) {
      contenidoEl.innerHTML = "";
      const unidadesCurso = Array.isArray(curso.unidades) ? curso.unidades : [];
      const safeItems = (arr) => {
        if (!Array.isArray(arr) || arr.length === 0) return null;
        return arr.map(i => String(i));
      };

      for (let i = 0; i < 3; i++) {
        const unidadExistente = unidadesCurso[i] || null;
        const titulo = unidadExistente?.titulo || `UNIDAD ${i + 1}`;
        let items = safeItems(unidadExistente?.items);

        const details = document.createElement("details");
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
    if (!contenedor) return;
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

document.addEventListener('DOMContentLoaded', () => {
  //DETALLE DE LOS CURSOS
  const cursos = new Cursos();
  cursos.inicializarDetalle();
  //MOSTRAR CURSOS RECOMENDADOS
  cursos.mostrarRecomendados();
  //ACTUALIZAR HEADER
  const ingreso = new Ingreso({ setupEventListeners: false });
  ingreso.updateHeader();
});

