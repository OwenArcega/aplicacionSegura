document.addEventListener("DOMContentLoaded", () => {
    let password_field_signup = document.getElementById("signup_password")
    
    let index = 0
    let users = {}

    let hashedPassword = ""

    password_field_signup.addEventListener("focusout", async ()=>{
        const password = password_field_signup.value

        if(!!password){
            hashedPassword = await hash(password)
            console.log(hashedPassword)
        }
})

function hash(string) {
    const utf8 = new TextEncoder().encode(string);
    return crypto.subtle.digest('SHA-256', utf8).then((hashBuffer) => {
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray
        .map((bytes) => bytes.toString(16).padStart(2, '0'))
        .join('');
      return hashHex;
    });
  }

  const signup_btn = document.getElementById("signup_btn")

  signup_btn.addEventListener("click", ()=>{
    const user = document.getElementById("signup_user")
    if(!!user && hashedPassword){
        alert("User created succesfully!")
        users[index] = {
            "username" : user.value,
            "password" : hashedPassword
        }
        index++
        user.value = ""
        document.getElementById("signup_password").value = ""
    } else{
        console.log("Error completing the register form")
    }
  })

  const login_btn = document.getElementById("login_btn")
  
  login_btn.addEventListener("click",async ()=>{
    const loginUsername = document.getElementById("login_user").value
    const loginPassword = document.getElementById("login_password").value
    const hashedLoginPassword = await hash(loginPassword)

    let entered = false
    if(!!loginPassword && !!loginUsername){
        let keys = Object.keys(users)
        for(let i = 0; i < keys.length; i++){
            if(users[i].username == loginUsername && users[i].password == hashedLoginPassword){
                alert("Login Succesfull!")
                i = keys.length
                entered = true
            }
        }
        entered ? pass : alert("User not found") 
    } else{
        console.log("Error in login user")
    }
  })
})