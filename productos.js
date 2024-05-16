window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
      window.location.reload();
    }
  });

  document.addEventListener('DOMContentLoaded', ()=>{
    if(sessionStorage.getItem("allowed") === "true"){
        const urlParams = new URLSearchParams(window.location.search);
        const username = urlParams.get('username');
        const productContainer = document.getElementById("products-container");
        const carrito = document.getElementById('cart-aside');
        const contenedorItems = document.getElementById('cart-items');

        const abrirCarritoBtn = document.getElementById('abrir-carrito');
        abrirCarritoBtn.addEventListener('click', ()=>{
          carrito.classList.add('open');  
        })

        let productosAgregados = [];

        const resultado = document.getElementById('resultado');

        function hacerSuma(){
            let total = 0;
            productosAgregados.forEach(producto => {
                if(producto.cantidad > 0){
                    total += producto.precio * producto.cantidad;
                }
            })
            resultado.innerText = "Total: " + total;
        }

        function agregarItem(){
            let nuevoProducto = productosAgregados[productosAgregados.length-1]
            const container = document.createElement('div');
            container.classList.add('cart-item');

            const imagen = document.createElement('img');
            imagen.src = nuevoProducto.imagen;
    
            const nombre = document.createElement('p');
            nombre.innerText = nuevoProducto.nombre;
    
            const cantidad = document.createElement('input');
            cantidad.value = nuevoProducto.cantidad;
            cantidad.type = "number";
            cantidad.min = "0";
            cantidad.addEventListener('change', ()=> {
                productosAgregados.forEach(producto => {
                    if(producto.nombre == nuevoProducto.nombre){
                        if(Number(cantidad.value) > producto.maximo){
                            alert("Máximo de unidades alcanzado")
                            cantidad.value = Number(producto.maximo);
                        } else{
                            producto.cantidad = cantidad.value;
                        }
                    }
                })
                hacerSuma();
            });
    
            container.appendChild(imagen);
            container.appendChild(nombre);
            container.appendChild(cantidad);
            contenedorItems.appendChild(container);
        }

        const cerrarBtn = document.getElementById('cart-close-btn');
        cerrarBtn.addEventListener('click', ()=> {
            carrito.classList.remove('open');
        });

        fetch('productos.php', {
            method: 'GET',
            headers: {"Content-type":"application/json; charset=UTF-8"}
        })
        .then(res => res.json())
        .then(data => {
            data.forEach(product => {
                if(product.cantidad > 0){
                    let imagen = document.createElement('img');
                    imagen.src = product.imagen;
    
                    let nombre = document.createElement('h3');
                    nombre.innerText = product.nombre;
    
                    let descripcion = document.createElement('p');
                    descripcion.innerText = product.descripcion;
    
                    let cantidad = product.cantidad;

                    let precio = document.createElement('p');
                    precio.innerText = product.precio;
    
                    let comprarBtn = document.createElement('button');
                    comprarBtn.textContent = "Añadir al carrito";
                    comprarBtn.id = product.nombre;
                    comprarBtn.addEventListener('click', ()=>{
                        carrito.classList.add('open');
                        if(productosAgregados.length != 0){
                            let found = false;
                            let index = 0;
                            while(index < productosAgregados.length){
                                if(productosAgregados[index].nombre == comprarBtn.id){
                                    found = true;
                                }
                                index++;
                            }
                            if(!found){
                                let nuevoProducto = {};
                                data.forEach(product => {
                                    if(product.nombre == comprarBtn.id){
                                        nuevoProducto.nombre = product.nombre;
                                        nuevoProducto.imagen = product.imagen;
                                        nuevoProducto.cantidad = 1;
                                        nuevoProducto.precio = product.precio;
                                        nuevoProducto.maximo = cantidad;
                                        productosAgregados.push(nuevoProducto);
                                        agregarItem();
                                    }
                                })
                            }
                        } else{
                            let producto = {};
                            producto.nombre = comprarBtn.id;
                            producto.cantidad = 1;
                            producto.imagen = imagen.src;
                            producto.precio = precio.innerText;
                            producto.maximo = cantidad;
                            productosAgregados.push(producto);
                            agregarItem();
                        }
                        hacerSuma();
                    })
    
                    let contenedor = document.createElement('div');
                    contenedor.classList.add('product-card')
    
                    contenedor.appendChild(imagen);
                    contenedor.appendChild(nombre);
                    contenedor.appendChild(descripcion);
                    contenedor.appendChild(precio);
                    contenedor.appendChild(comprarBtn);
                    productContainer.appendChild(contenedor);
                    
                } else{

                }
            });
        })
        .catch(err => {
            console.error("Error: " + err);
            alert("Error por parte del servidor");
        })

        const checkOutBtn = document.getElementById('checkout-btn');
        checkOutBtn.addEventListener('click', ()=>{
            productosAgregados.forEach(producto => {
                if(producto.cantidad > 0){
                    fetch('descontar.php', {
                        method: "POST",
                        body: JSON.stringify({
                            "nombre": producto.nombre,
                            "cantidad": producto.cantidad
                        }),
                        headers: {"Content-type":"application/json; charset=UTF-8"}
                    })
                    .catch(err => {
                        console.error("Error: " + err);
                        alert("Error al hacer la compra");
                    })
                    let total = document.getElementById("resultado").innerText;
                    total = total.slice(7,)
                    console.log(total);
                    fetch('realizarCompra.php', {
                        method: "POST",
                        body: JSON.stringify({
                            "usuario": username,
                            "total": Number(total)
                        }),
                        headers: {"Content-type":"application/json; charset=UTF-8"}
                    })
                    .then(res => res.json())
                    .then(data => {
                        if(data.res == true){
                            alert("Compra realizada exitosamente");
                            window.location.reload();
                        } else{
                            alert("Hubo un problema con el servidor");
                        }
                    })
                    .catch(err => {
                        console.error("Error: " + err);
                        alert("Error al realizar la compra");
                    })
        
                    productosAgregados = [];
                    contenedorItems.innerHTML = "";
                    carrito.classList.remove('open');
                }
            })
        })

        const cuentaBtn = document.getElementById('cuenta');
        cuentaBtn.addEventListener('click', ()=>{
            productosAgregados = [];
            carrito.classList.remove('open');
            window.location = "main.html?username=" + username;
        })

        const cerrarSesion = document.getElementById("cerrarSesion");
        cerrarSesion.addEventListener("click", (event)=>{
            event.preventDefault()
            sessionStorage.clear();
            productosAgregados = [];
            contenedorItems.innerHTML = "";
            carrito.classList.remove('open');
            window.location = "index.htm";
        });

    } else{
        window.location = "denied_access.html";
    }
})