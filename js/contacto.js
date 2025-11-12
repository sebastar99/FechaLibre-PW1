export class Contacto{

    constructor(){
        const form= document.querySelector ("#form");
        const consulta= document.querySelector("#consulta");
        const contador = document.querySelector("#contadorConsulta");
        const dialogo = document.querySelector("#dialogo");
        const mensaje = document.querySelector("#dialogoMensaje");
        const btnCerrar = document.querySelector("#dialogoCerrar");

        let esValido = false;
       consulta.addEventListener("input", () => {
         const total = consulta.value.length;
         contador.textContent = `${total} / 1000 caracteres`;
       });

        
         btnCerrar.addEventListener("click", () => {
            dialogo.close()
            if(esValido){
             window.location.href = "/home.html"
            }
        });


        form.addEventListener("submit", (event)=>{

            event.preventDefault();
            const nombre=document.querySelector ("#username");
            const apellido=document.querySelector ("#surname");
            const email=document.querySelector ("#email");
            const numeroTel=document.querySelector ("#phone");
            
           function mostrarDialogo(texto, valido=false) {
            esValido=valido;
             mensaje.textContent = texto;
             dialogo.showModal();
            }

           function validaCampos (){
                const nomAValidar= nombre.value.trim();
                const apeAValidar= apellido.value.trim();
                if(!nomAValidar || !apeAValidar){
                 mostrarDialogo ("Nombre y apellido no pueden estar vacios")
                 return false;

                 }
                const emailAValidar= email.value.trim();
                const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                if (!emailValido.test(emailAValidar)) {
                 mostrarDialogo("Por favor ingresá un email válido");
                 return false;
                } 

                const telAValidar= numeroTel.value.trim();
                const telValido= /^(\d{4}-\d{4})/

                if(telAValidar !== ""){
                    if(!telValido.test(telAValidar)){
                        mostrarDialogo("El teléfono debe tener 8 dígitos seprados por un guión en el medio (ej: 1234-5678)");
                        return false;
                    }
                }
                const texto = consulta.value.trim();
                if(texto.length>1000){
                    return false;
                }


             return true;

            }

        
         if (validaCampos()){
             mostrarDialogo("Consulta enviada", true);

            }
            
        })

    }
}