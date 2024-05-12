//Affichage par défaut Récupération des projets depuis l'API
const reponse = await fetch("http://localhost:5678/api/works");
const projet = await reponse.json();

affichage(projet);

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
    affichage(projet);
});

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
        const titleElement = document.createElement("figcaption");
        titleElement.innerText = works[i].title;
        //Rattachement au DOM
        affichage.appendChild(figure);
        figure.appendChild(imageElement);
        figure.appendChild(titleElement);
    }
}



