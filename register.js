window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
      window.location.reload();
    }
  });

document.addEventListener("DOMContentLoaded", ()=>{
    if(sessionStorage.getItem("registering") === "true"){
        sessionStorage.clear();
        const backBtn = document.getElementById("backBtn");
        backBtn.addEventListener("click", ()=>{
            window.location.href = "index.htm";
        })
    } else{
        window.location = "denied_access.html";
    }

})