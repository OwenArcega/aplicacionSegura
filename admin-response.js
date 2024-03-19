document.addEventListener("DOMContentLoaded",()=>{
    const retryButton = document.getElementById("retry-button");
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('username');

    retryButton.addEventListener('click', ()=>{
        fetch('validate.php', {
            method: "POST",
            body: JSON.stringify({
                "username": username
            }),
            headers: {"Content-type":"application/json; charset=UTF-8"}
        })
        .then(res => res.json())
        .then(data => {
            if(data.auth == 1){
                alert("Acceso concedido, accediendo.")
                window.location = "main.html?username=" + username;
            } else{
                alert("Aun no cuenta con acceso.")
            }
        })
        .catch(err => console.error("Error " + err))
    })
});