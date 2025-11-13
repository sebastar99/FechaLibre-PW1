import { Cursos } from "./cursos.js";
export class Detailist {

  constructor() {

    new Cursos();

    const formBuscador = document.querySelector("#buscadorCursos");
    const inputBusqueda = document.querySelector("#inputBusqueda");

    formBuscador.addEventListener("submit", (e) => {
      e.preventDefault();
      const termino = inputBusqueda.value.trim().toLowerCase();
      if (!termino) return;

      const cursos = Cursos.leerCursos();
      const cursoEncontrado = cursos.find(c =>
        c.nombre.toLowerCase() === termino
      );

      if (cursoEncontrado) {
        window.location.href = `/pages/detalleCurso.html?id=${cursoEncontrado.id}`;
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new Detailist();
});