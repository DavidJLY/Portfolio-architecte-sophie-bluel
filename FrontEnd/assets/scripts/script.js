//Récupération des projets depuis l'API
const reponse = await fetch("http://localhost:5678/api/works");
const projet = await reponse.json();

//Affichage de tous les projets
//affichage(projet);

//Test de la présence du token et affichage en fonction
let key = sessionStorage.getItem("token");
if(key) {
    modeEdition();
    affichage(projet);
console.log("connecté");
}else{
    affichage(projet);
    console.log("site mode visiteur");
}

//Logout
const logout = document.querySelector("#logOut");
logout.addEventListener('click', (event) => {
    event.preventDefault();
    sessionStorage.removeItem("token");
    window.location.href = "../FrontEnd/index.html";
});

//Ecoute des boutons filtres
const buttonTous = document.querySelector("#tous");
const buttonObjets = document.querySelector("#objets");
const buttonAppart = document.querySelector("#appart");
const buttonHr = document.querySelector("#hr");
buttonObjets.addEventListener("click", function() {
    filtreCategorie(1);
});
buttonAppart.addEventListener("click", function() {
    filtreCategorie(2);
});
buttonHr.addEventListener("click", function() {
    filtreCategorie(3);
});
buttonTous.addEventListener("click", function() {
    document.querySelector(".gallery").innerHTML = "";
    affichage(projet);
});

//Fonctions
function filtreCategorie (categoryId){
    const objets = projet.filter((projet) => projet.categoryId == categoryId);
    document.querySelector(".gallery").innerHTML = "";
    affichage(objets);
}

function affichage(works){
    for (let i=0; i<works.length; i++){
        //Création des éléments
        const affichage = document.querySelector(".gallery");
        const figure = document.createElement("figure");
        const imageElement = document.createElement("img");
        imageElement.src = works[i].imageUrl;
        imageElement.alt = works[i].title;
        const titleElement = document.createElement("figcaption");
        titleElement.innerText = works[i].title;
        //Rattachement au DOM
        affichage.appendChild(figure);
        figure.appendChild(imageElement);
        figure.appendChild(titleElement);
    }
}

//On essaye de former la page connectée
function bandeaumodeEdition () {
    const header = document.querySelector("header");
    let bandeau =`<div class = "bandeau" style = "background-color: black;
        height: 59px;
        color: white;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 20px;"
        <i class="fa-regular fa-pen-to-square"></i>
        <p>Mode édition</p></div>`
    header.insertAdjacentHTML('beforebegin', bandeau);
    }

//Pour cacher les boutons filtres avant la gallerie
function filtersHide() {
    const filters = document.querySelector("#filtres");
    filters.classList.remove("filters");
    filters.classList.add("loginHide");
}

//Affichage du bouton modifier au titleProject
function titleModeEdition() {
    const title = document.querySelector("#modif");
    title.classList.remove("loginHide");
    title.style.marginBottom = "100px";
}

//Changement du logIn pour le logOut
function chgLog() {
    const logout = document.getElementById("logOut");
    logout.classList.remove("loginHide");
    const login = document.getElementById("logIn");
    login.classList.add("loginHide");
}

//Appel de toutes le fonctions pour changement en mode connecté
function modeEdition() {
    chgLog();
    bandeaumodeEdition();
    filtersHide();
    titleModeEdition();
}

//Ecoute du bouton modifier en mode connecté
const btnModif = document.getElementById('modif');
btnModif.addEventListener('click', (event) => {
    const openModal = document.querySelector("#modal1");
    openModal.setAttribute('aria-hidden', 'false');
    openModal.style.display = 'flex';
});
/*function accesModal() {
    const filtersChange = document.querySelector("#portfolio");
    filtersChange.innerHTML = 
}*/

//<span class="material-symbols-outlined">delete</span>
//Creer une figure id du projet
//element image, image et button id du projet



