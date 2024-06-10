//Appel et écoute du bouton "Se connecter"
const btConnect = document.getElementById('connexionButton');
    btConnect.addEventListener('click',(event) => {
        //désactivation du rechargement de la page
        event.preventDefault();
        const login = form();
        if (login) {
            api(login.email, login.password);
        }
        }
    )

//Récupération des valeurs dans le formulaire
function form() {
    let emailinput = document.getElementById("email");
    let passwordinput = document.getElementById("pass");
    //vérification que les champs du form ne soient pas vides
   let email = emailinput.value.trim();
   let password = passwordinput.value.trim();
   if (!email || !password) {
    afficherErreur("Veuillez remplir tous les champs du formulaire.")
    return null; // retourne null pour indiquer qu'il y a une erreur
    }else{   
    return {email, password};
    }
}

//Envoi des identifiants à l'Api
function api(email, password) {
    let chargeUtile = JSON.stringify({email, password});
    fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: chargeUtile
    })
    .then(res => {
        //récupération du token dans la réponse de l'api, stockage du token et redirection
        res.json().then(data => {
            if (data.token) {
                sessionStorage.setItem("token", data.token);
                window.location.href = "../../index.html";
                console.log("Connexion réussie");
            }else{
                afficherErreur("Connexion échouée, les identifiants sont incorrect");
            }
        })
    })
}

//Affichage d'erreur
export function afficherErreur(message) {
    let span = document.getElementById("erreur");
    let messageErreur = message;
    span.innerText = messageErreur;
}