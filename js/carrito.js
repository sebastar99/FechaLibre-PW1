export class Carrito {

    agregarAlCarrito() {
        const agregar = document.getElementById("agregarCarrito");
        const carrito = document.getElementById("fa-shopping-cart");
        agregar.addEventListener("click", () => {

            let contadorNum = parseInt(carrito.getAttribute("data-contador")) || 0;
            contadorNum++;
            carrito.setAttribute("data-contador", contadorNum);
            console.log(contadorNum);
        })
    }


}