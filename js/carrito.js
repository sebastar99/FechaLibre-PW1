export class Carrito {

    agregarAlCarrito() {
        const agregar = document.getElementById("agregarCarrito");
        const carrito = document.getElementById("fa-shopping-cart");
        // Inicializar contador desde sessionStorage
        let contadorNum = parseInt(sessionStorage.getItem('contadorCarrito')) || 0;
        if (carrito) {
            carrito.setAttribute("data-contador", contadorNum);
        }
        if (agregar) {
            agregar.addEventListener("click", () => {
                let contadorNum = parseInt(sessionStorage.getItem('contadorCarrito')) || 0;
                contadorNum++;
                sessionStorage.setItem('contadorCarrito', contadorNum);
                if (carrito) {
                    carrito.setAttribute("data-contador", contadorNum);
                }
                console.log(contadorNum);
            });
        }
    }
}