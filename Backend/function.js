//Affichage de la gallerie principale
export function affichage(works){
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

//Affichage de la gallery de la modale
 function affichageModal(works){
    for (let i=0; i<works.length; i++){
        //Création des éléments
        const affichage = document.querySelector(".galleryModal");
        const figure = document.createElement("figure");
        const imageElement = document.createElement("img");
        imageElement.src = works[i].imageUrl;
        imageElement.alt = works[i].title;
        //Rattachement au DOM
        affichage.appendChild(figure);
        figure.appendChild(imageElement);
    }
}