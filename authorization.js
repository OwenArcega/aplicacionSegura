window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
      window.location.reload();
    }
  });

document.addEventListener("DOMContentLoaded", ()=>{
    if(sessionStorage.getItem("allowed") === "true"){
        const urlParams = new URLSearchParams(window.location.search);
        const username = urlParams.get('username');
        const sendBtn = document.getElementById("sendBtn");
        
        if(sessionStorage.getItem("username") === username){
            sendBtn.addEventListener("click", ()=>{
                const key = document.getElementById("keyInput").value;
        
                if(!!username && !!key){
                    fetch('authorization.php', {
                        method: "POST",
                        body: JSON.stringify({
                            "username": username,
                            "key": key
                        }),
                        headers: {"Content-type":"application/json; charset=UTF-8"}
                    })
                    .then(response => response.json())
                    .then(data => {
                        if(data.res === true){
                            window.location.href = "main.html?username=" + username;
                        } else{
                            alert("Error en el codigo, por favor intente lo nuevamente");
                        }
                    })
                    .catch(error => console.error("Error " + error))
                } else{
                    alert("Error al obtener código secreto");
                }
            })

        } else{
            window.location = "denied_access.html";
        }

    } else{
        window.location = "denied_access.html";
    }


});