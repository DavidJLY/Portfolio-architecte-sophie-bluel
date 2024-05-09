//Affichage par défaut Récupération des projets depuis l'API
const reponse = await fetch("http://localhost:5678/api/works");
const projet = await reponse.json();
console.log(projet[0]);
//Création des éléments 
const affichageProjet = projet[0];

for (let i=0; i<projet.length; i++){
    const affichage = document.querySelector(".gallery");
    const figure = document.createElement("figure");
    const imageElement = document.createElement("img");
    imageElement.src = projet[i].imageUrl;
    const titleElement = document.createElement("figcaption");
    titleElement.innerText = projet[i].title;
    //Rattachement au DOM
    affichage.appendChild(figure);
    figure.appendChild(imageElement);
    figure.appendChild(titleElement);
}
