window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
      window.location.reload();
    }
  });
  
document.addEventListener("DOMContentLoaded", ()=>{
    if(sessionStorage.getItem("admin") === "true"){

        const cerrarSesion = document.getElementById("cerrarSesion");
        cerrarSesion.addEventListener("click", (event)=>{
            event.preventDefault()
            sessionStorage.clear();
            console.log(sessionStorage.getItem("admin"));
            window.location = "index.htm";
        });

        const table_body = document.getElementById("tb_body");
        fetch("admin.php", {
            method: "GET",
            headers: {"Content-type":"application/json; charset=UTF-8"}
        })
        .then(res => res.json())
        .then(data => {
            
            data.forEach(register => {
                const row = document.createElement('tr');
                const name = document.createElement('td');
                const email = document.createElement('td');
                const password = document.createElement('td');
                const authorized = document.createElement('td');
                const button = document.createElement('button');
                const buttonContainer = document.createElement('td');
    
                let auhtorization = register['autorizado'] === '0' ? true : false;
    
                name.innerHTML = register['nombre'];
                email.innerHTML = register['correo'];
                password.innerHTML = register['contrasena'];
                authorized.innerHTML = auhtorization ? "Sin permiso" :  "Con permiso";
                button.innerHTML = auhtorization ? "Permitir Acceso" : "Restringir Acceso";
                button.classList.add(auhtorization ? "admit-button" : "deny-button");
                button.value = register['nombre'];
    
                button.addEventListener('click', () => {
                    fetch('admin.php',{
                        method: "POST",
                        body: JSON.stringify({
                            "username": button.value,
                            "permission": button.innerHTML === "Permitir Acceso" ? true : false
                        }),
                        headers: {"Content-type":"application/json; charset=UTF-8"}
                    })
                    .then(res => res.json())
                    .then(data => {
                        if(data['changed'] == '0'){
                            button.parentNode.previousSibling.innerHTML = "Con permiso";
                            button.classList.remove("admit-button");
                            button.classList.add("deny-button");
                            button.innerHTML = "Restringir Acceso";
                        } else{
                            button.parentNode.previousSibling.innerHTML = "Sin permiso";
                            button.classList.remove("deny-button");
                            button.classList.add("admit-button");
                            button.innerHTML = "Permitir Acceso";
                        }
                    })
                    .catch(err => {
                        console.error("Error " + err);
                    })
                })
                buttonContainer.appendChild(button);
    
                row.appendChild(name);
                row.appendChild(email);
                row.appendChild(password);
                row.appendChild(authorized);
                row.appendChild(buttonContainer);
    
                table_body.appendChild(row)
            });
        })
        .catch(err => console.error("Error: " + err))

        const agregarProductosBtn = document.getElementById('agregarProductos');
        agregarProductosBtn.addEventListener('click', (e)=>{
            e.preventDefault();
            window.location = 'admin_productos.html';
        })
    } else{
        window.location = "denied_access.html";
    }
});