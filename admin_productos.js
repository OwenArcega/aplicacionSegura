window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
      window.location.reload();
    }
  });

  document.addEventListener('DOMContentLoaded', ()=>{

    function cleanForms(){
        let inputs = document.querySelectorAll("input");
        inputs.forEach(input => {
            if (input.tagName.toLowerCase() === 'input') {
            input.value = '';
            }
        });
    }

    if(sessionStorage.getItem("admin") === "true"){
        const productosForm = document.getElementById('productosForm');
        productosForm.addEventListener('submit', (e)=>{
            e.preventDefault();
            const nombre = document.getElementById('nombre').value;
            const cantidad = document.getElementById('cantidad').value;
            const precio = document.getElementById('precio').value;
            const descripcion = document.getElementById('descripcion').value;
            const imagen = document.getElementById('imagen').value;

            let unico = undefined;
            fetch('productos.php', {
                method: "GET",
                headers: {"Content-type":"application/json; charset=UTF-8"}
            })
            .then(res => res.json())
            .then(data => {
                data.forEach(product => {
                    if(product.nombre.toLowerCase() === nombre.toLowerCase()){
                        unico = false;
                    }
                })
                if(unico === undefined){
                    unico = true;
                }
                if(!!nombre && !!cantidad && !!precio && !!descripcion && !!imagen){
                    if(cantidad <= 0){
                        alert("Error al ingresar la cantidad");
                        cleanForms();
                    } else{
                        if(precio <= 0){
                            alert("Error al ingresar el preceio");
                            cleanForms();
                        } else{
                            if(unico === true){
                                fetch('productos.php', {
                                    method: 'POST',
                                    body: JSON.stringify({
                                        'nombre': nombre,
                                        'cantidad' : cantidad,
                                        'precio': precio,
                                        'descripcion': descripcion,
                                        'imagen': imagen
                                    }),
                                    headers: {"Content-type":"application/json; charset=UTF-8"}
                                })
                                .then(res => res.json())
                                .then(data => {
                                    console.log(data);
                                    if(data.res === true){
                                        alert('Datos guardados correctamente');
                                        cleanForms();
                                    } else{
                                        alert('Error al guardar los datos');
                                    }
                                })
                                .catch(err => {
                                    console.error("Error " + err);
                                    alert("Error al mandar la información");
                                })
                            } else{
                                alert("El producto ya existe");
                                cleanForms()
                            }
                        }
                    }
                } else{
                    alert("Por favor llene todos los campos");
                }
            })
            .catch(err => {
                console.error("Error: " + err);
                alert("Error en el servidor");
            })
        })

        const cerrarSesion = document.getElementById("cerrarSesion");
        cerrarSesion.addEventListener("click", (event)=>{
            event.preventDefault()
            sessionStorage.clear();
            window.location = "index.htm";
        });

        const cambiarAcceso = document.getElementById('cambiarAcceso');
        cambiarAcceso.addEventListener('click', (event)=>{
            event.preventDefault();
            cleanForms();
            window.location = "admin.html";
        });

    } else{
        window.location = "denied_access.html";
    }
  })