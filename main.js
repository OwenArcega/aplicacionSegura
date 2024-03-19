window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
      window.location.reload();
    }
  });

document.addEventListener('DOMContentLoaded', ()=>{
    if(sessionStorage.getItem("allowed") === "true"){
        const form = document.getElementById("user_data");
        form.addEventListener("submit", (event) => {
            event.preventDefault();
        })
    
        const cerrarSesion = document.getElementById("cerrarSesion");
        cerrarSesion.addEventListener("click", (event)=>{
            event.preventDefault()
            sessionStorage.clear();
            console.log(sessionStorage.getItem("admin"));
            window.location = "index.htm";
        });

        const header = document.getElementById('header')
        const name = document.getElementById('nombre');
        const password = document.getElementById('contrasena');
        const email = document.getElementById('correo');
    
        const urlParams = new URLSearchParams(window.location.search);
        let username = urlParams.get('username');
    
        if(sessionStorage.getItem("username") === username){
            let userId = 0;
        
            fetch("main.php", {
                method: "POST",
                body: JSON.stringify({
                    "username": username
                }),
                headers: {"Content-type":"application/json; charset=UTF-8"}
            })
            .then(res => res.json())
            .then(data => {
                if(!!data.id || !!data.nombre || data.contrasena || data.correo){
                    userId = data.id;
                    name.value = data.nombre;
                    password.value = data.contrasena;
                    email.value = data.correo;
                    header.innerHTML = "Bienvenido " + data.nombre;
                } else{
                    console.log("Redirigiendo a no tiene permiso");
                }
            })
            .catch(err => console.error("Error" + err))
        
            let newUsername = "";
        
            const change_btn = document.getElementById("change_btn")
            change_btn.addEventListener("click", ()=>{
                newUsername = name.value;
        
                fetch("main.php", {
                    method: "PUT",
                    body: JSON.stringify({
                        "username": name.value,
                        "email": email.value,
                        "password": password.value,
                        "id": userId
                    }),
                    headers: {"Content-type":"application/json; charset=UTF-8"}
                })
                .then(res => res.json())
                .then(data => {
                    if(data.res === true){
                        fetch("main.php", {
                            method: "POST",
                            body: JSON.stringify({
                                "username": newUsername
                            }),
                            headers: {"Content-type":"application/json; charset=UTF-8"}
                        })
                        .then(res => res.json())
                        .then(data => {
                            name.value = data.nombre;
                            password.value = data.contrasena;
                            email.value = data.correo;
                            header.innerHTML = data.nombre;
                            username = data.nombre;
                        })
                        .catch(err => console.error("Error" + err))
                    } else{
                        alert("Error cambiando la informacion")
                    }
                })
                .catch(err => console.error("Error " + err))
            });

        } else{
            window.location = "denied_access.html";
        }
    } else{
        window.location = "denied_access.html";
    }
})