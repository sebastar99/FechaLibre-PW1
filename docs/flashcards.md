# Flashcards para practicar la defensa — FechaLibre

Cada sección contiene preguntas frecuentes y respuestas breves que pueden usarse como tarjetas para practicar en voz alta.

---

## script.js
1. ¿Cuál es la responsabilidad principal de `script.js`?
- Orquestar la inicialización de los módulos en `DOMContentLoaded` y actualizar el icono del carrito.

2. ¿Qué hace `actualizarIconoCarrito()`?
- Lee `UsuarioActual` y `Usuarios`/`sessionStorage` para fijar el `data-contador` del icono del carrito.

3. ¿Por qué es útil centralizar la inicialización?
- Mantiene el código modular y testable; permite reutilizar clases sin depender del DOM en su constructor.

4. Nombre una mejora sencilla para `script.js`.
- Extraer rutas y keys a un objeto de configuración central.

---

## cursos.js
1. ¿Dónde se almacenan los cursos y por qué?
- En `localStorage['cursos']` para simular un backend y facilitar la demo offline.

2. ¿Qué hace `obtenerCursoPorId(id)`?
- Busca y devuelve el curso cuyo `id` coincide o `null` si no existe.

3. ¿Qué sucede cuando el usuario hace clic en "Inscribirse" en la página de detalle?
- Verifica sesión; si hay usuario añade el curso a `usuario.carrito` dentro de `localStorage['Usuarios']`.

4. Riesgo principal de esta implementación.
- Guardar datos sensibles (contraseñas) en `localStorage` no es seguro para producción.

5. Mejora práctica para el catálogo.
- No sobrescribir `localStorage['cursos']` si ya existe; usar migraciones o checks.

---

## home.js
1. ¿Qué renderiza `mostrarCursosHome()`?
- Tarjetas de cursos con imagen, nombre, y botones "Ver Curso" y "Comprar".

2. ¿Cómo maneja el caso "usuario no logueado" al presionar Comprar?
- Redirige a `/pages/ingreso.html`.

3. ¿Cómo actualiza el contador del carrito?
- Usa `sessionStorage['contadorCarrito']` y también guarda el carrito en `localStorage['Usuarios']` cuando usuario está logueado.

4. ¿Qué evento se dispara al agregar al carrito para sincronizar UI?
- Se dispara `window.dispatchEvent(new Event('carritoActualizado'))`.

---

## calendario.js
1. ¿Qué datos usa para marcar días con eventos?
- Lee `localStorage['cursos']` y mapea cursos a fechas (hay un array de fechas fallback en el código).

2. ¿Cómo se muestra la información de un evento?
- Al hacer click se abre un tooltip con título, duración, precio, y botones a detalle/inscripción.

3. ¿Qué medidas de accesibilidad incluye?
- Usa `role="gridcell"` y `aria-label` en enlaces de eventos.

4. Menciona una mejora técnica.
- Quitar fecha hardcodeada (`setFullYear(2025,10,1`) y usar `new Date()` real o permitir inicialización dinámica.

---

## ingreso.js
1. ¿Qué contiene `localStorage['Usuarios']` y `localStorage['UsuarioActual']`?
- `Usuarios` es un array de objetos con {nombre,email,pass,carrito,compras}. `UsuarioActual` es el objeto de sesión {nombre,email}.

2. Describe el flujo de eliminar cuenta.
- Pide contraseña, muestra confirmación (dialogos) y si confirma elimina del array `Usuarios` y remueve `UsuarioActual`.

3. ¿Qué debés decir sobre seguridad?
- No almacenar contraseñas en texto plano. En producción usar backend con hashing y tokens.

4. ¿Qué hace `recuperarContrasena()`?
- Muestra un diálogo para actualizar la contraseña buscando el usuario por email y guardando la nueva en `Usuarios`.

---

## inscripcionEmpresa.js
1. ¿Qué permite hacer este módulo?
- Agregar múltiples participantes, eliminar filas, validar campos y calcular el total.

2. ¿Cómo calcula el precio total?
- Multiplica cantidad de filas por el precio del curso obtenido desde `localStorage['cursos']` (se limpia el string de peso y signos).

3. Mejora para evitar errores por nombre de curso.
- Usar el id del curso en el select en lugar del nombre para buscar precio.

---

## pago.js
1. ¿Qué hace `_findRawPrice()`?
- Busca una fuente de monto en varias keys de `localStorage` o, si hay un `selectedCourseId`, busca el curso en `localStorage['cursos']`.

2. ¿Cómo convierte "$158.000" a número usable?
- `_parsePrice()` elimina todo lo que no es dígito y devuelve Number(158000).

3. Comportamiento frente a monto no encontrado.
- Deja el input en placeholder "Monto no disponible" y bloquea el submit.

---

## giftcard.js
1. ¿Qué elementos sincroniza con el preview?
- Nombre, monto, color de fuente, tamaño de fuente, fondo y posición.

2. ¿Cómo obtiene el color seleccionado?
- Lee `getComputedStyle` del elemento visual dentro del label asociado al radio.

3. Posible mejora/próximo paso.
- Guardar la personalización para descarga o para enviar al servidor.

---

## contacto.js
1. ¿Qué validaciones realiza antes de enviar?
- Nombre/apellido no vacíos, email con regex, teléfono opcional con formato `1234-5678`, consulta <= 1000 chars.

2. UX de conteo de caracteres.
- Muestra contador en tiempo real con `input` event.

3. Qué hacer en producción.
- Además de validación cliente, validar y sanitizar en servidor.

---

## datalist.js (Detailist)
1. ¿Qué hace el buscador?
- Busca coincidencia exacta del nombre (toLowerCase) y redirige a `detalleCurso.html?id=...` si lo encuentra.

2. Mejora de usabilidad.
- Implementar búsqueda por substring o autocompletado con `datalist`.

---

## slider.js
1. ¿Cómo funciona el autoplay?
- `startAutoPlay()` inicia un `setInterval` que llama `nextSlide()` cada X ms.

2. ¿Cómo detener autoplay al interactuar?
- `stopAutoPlay()` limpia el intervalo; se llama antes de `showSlide()` cuando el usuario hace click en un dot.

3. Mejora de accesibilidad.
- Agregar navegación por teclado y roles ARIA.

---

## carrito.js
1. ¿Qué hace el método `agregarAlCarrito()`?
- Incrementa el atributo `data-contador` del icono `#fa-shopping-cart` al click en `#agregarCarrito`.

2. Por qué centralizar la lógica del carrito.
- Para sincronizar estado entre páginas y manejar persistencia en un solo lugar (evita inconsistencias).

---

# Cómo usar estas flashcards
- Imprimir o leer en voz alta. Cada miembro puede tomar 3–4 tarjetas por módulo y practicar respuestas de 30–45s.
- Para practicar, primero contestá en voz alta y luego compará con la respuesta escrita.

---

¡Listo! Si querés, convierto estas tarjetas a un PDF o genero un set de diapositivas (PowerPoint/HTML) para la defensa.