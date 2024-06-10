//Récupération des projets depuis l'API
const reponse = await fetch("http://localhost:5678/api/works");
const projects = await reponse.json();
//Recupération des categories depuis l'API
const catReponse = await fetch("http://localhost:5678/api/categories");
const categorie = await catReponse.json();

async function loadProject() {
    console.log("hehe");
    const reponse = await fetch("http://localhost:5678/api/works");
    //projects = await reponse.json();
    return reponse.json();
}

const windowModal = document.getElementById("modal");

//Test de la présence du token et affichage en fonction
let key = sessionStorage.getItem("token");
if(key) {
    modeEdition();
} else {
    console.log("Site en mode visiteur");
}
affichage(projects);

//Logout
const logout = document.querySelector("#logOut");
logout.addEventListener('click', (event) => {
    event.preventDefault();
    sessionStorage.removeItem("token");
    window.location.href = "../../index.html";
});

//Ecoute des boutons filtres en mode visiteur
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
    affichage(projects);
});

//Affichage général ou par catégorie
function filtreCategorie (categoryId){
    const objets = projects.filter((projet) => projet.categoryId == categoryId);
    document.querySelector(".gallery").innerHTML = "";
    affichage(objets);
}

function affichage(projects){
    const affichage = document.querySelector(".gallery");
    affichage.innerHTML = "";
    for (let i=0; i<projects.length; i++){
        //Création des éléments
        const figure = document.createElement("figure");
        const imageElement = document.createElement("img");
        imageElement.src = projects[i].imageUrl;
        imageElement.alt = projects[i].title;
        const titleElement = document.createElement("figcaption");
        titleElement.innerText = projects[i].title;
        //Rattachement au DOM
        affichage.appendChild(figure);
        figure.appendChild(imageElement);
        figure.appendChild(titleElement);
    }
}

/*--------Appel de toutes les fonctions pour changements en mode connecté--------*/

function modeEdition() {
    chgLog();
    bandeaumodeEdition();
    filtersHide();
    titleModeEdition();
}

//Changement du logIn pour le logOut
function chgLog() {
    const logout = document.getElementById("logOut");
    logout.classList.remove("hide");
    const login = document.getElementById("logIn");
    login.classList.add("hide");
}

//Changements de la page connectée
function bandeaumodeEdition () {
    const bandeau = document.querySelector(".bandeau");
    const iconeTitre = document.createElement("p");
    iconeTitre.innerHTML = '<i class="fa-regular fa-pen-to-square"></i> Mode édition';
    iconeTitre.style.display = 'flex';
    iconeTitre.style.justifyContent = 'center';
    iconeTitre.style.alignItems = 'center';
    iconeTitre.style.gap = '20px';
    iconeTitre.style.height = '59px'
    iconeTitre.style.color = 'white';
    iconeTitre.style.backgroundColor = 'black';
    iconeTitre.style.width = '1440px';
    iconeTitre.style.position = 'relative';
	iconeTitre.style.left = '-150px';
    bandeau.appendChild(iconeTitre);
}

//Pour cacher les boutons filtres avant la gallerie
function filtersHide() {
    const filters = document.querySelector("#filtres");
    filters.classList.remove("filters");
    filters.classList.add("hide");
}

//Affichage du bouton modifier au titleProject
function titleModeEdition() {
    const title = document.querySelector("#modif");
    title.classList.remove("hide");
    title.style.marginBottom = "100px";
}

/*-------Mise en place de la modale-------*/

//Ecoute du bouton modifier en mode connecté
const btnModif = document.getElementById('modif');
btnModif.addEventListener('click', (event) => {
    modal();
});

//Apparition de la première vue de la modale
function modal() {
    const openModal = document.querySelector("#modal");
    openModal.setAttribute('aria-hidden', 'false');
    openModal.style.display = 'flex';
    affichageModal(projects);
}

//Affichage de la gallery de la modale
function affichageModal(projects){
    const affichage = document.querySelector(".galleryModal");
    affichage.innerHTML = "";
    for (let i=0; i<projects.length; i++){
        //Création des éléments
        const figure = document.createElement("figure");
        figure.id = "figure" + projects[i].id;
        const imageElement = createImageElement(projects[i]);
        const btnSuppr = createbtnSuppr(projects[i]);
        const divImg = document.createElement('div');
        divImg.id = "divImage";
        //Rattachement au DOM
        divImg.appendChild(imageElement);
        divImg.appendChild(btnSuppr);
        figure.appendChild(divImg);
        affichage.appendChild(figure);
    }
}

//Creation de l'element image
function createImageElement(project) {
    const imageElement = document.createElement("img");
    imageElement.src = project.imageUrl;
    imageElement.alt = project.title;
    imageElement.id = project.id;

    return imageElement;
}

function createbtnSuppr(project) {
    const btnSuppr = document.createElement('button');
    btnSuppr.innerHTML = `<i class="fa-solid fa-trash-can"></i>`; 
    btnSuppr.id = "suppr-" + project.id;
    btnSuppr.classList.add("suppr");
    
    // Écoute du bouton supprimer des projets de la modale
    btnSuppr.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        supprProjet(project).then(function(response){
            console.log(response);
            console.log("suppr");
            if (response.ok) {
                document.getElementById("figure" + project.id).remove();
                console.log('Travail supprimé avec succès');
                supprProjet(project);
                loadProject().then(function(reponse){
                    affichageModal(reponse);
                    affichage(reponse);
                })
            } else {
                console.error('Échec de la suppression du travail');
            }
        });
        console.log("on est content");
    });
    return btnSuppr;
}

async function supprProjet(project) {
    const response = await fetch(`http://localhost:5678/api/works/${project.id}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${key}`
        }
    });
    return response;
}

/*-------Mise en place de la seconde vue de la modale-------*/

//changement de modale au clique ajoutPhoto
const ajoutPhoto = document.querySelector("#ajoutPhoto");
ajoutPhoto.addEventListener('click', (event) => {
    const gallerieView = document.querySelector("#galleryView");
    gallerieView.classList.remove('show');
    gallerieView.classList.add('hide');
    const addPhotoView = document.querySelector('#addPhotoView');
    addPhotoView.classList.remove('hide');
    addPhotoView.classList.add('show');
    modalAjout();
})

//Creation de la seconde vue de la modale
function modalAjout() {
    //Creation de l'ajout de la photo
    const modalAjout = document.querySelector(".modalAjout");
    modalAjout.innerHTML = "";
    const intModal = document.createElement("div");
    intModal.id = "intModal"
    const fondAjout = document.createElement("div");
    fondAjout.id = "fondAjout";
    const logoAjout = document.createElement("span");
    logoAjout.id = "logoAjout";
    logoAjout.innerHTML = '<i class="fa-regular fa-image"></i>';
    const label = document.createElement("label");
    label.htmlFor = "photoProjet";
    label.classList.add("styleAjoutPhoto");
    label.innerHTML = '+ Ajouter Photo';
    label.id = "labelId";
    const input = document.createElement("input");
    input.id = "photoProjet";
    input.type = "file"
    input.classList.add("hide")
    const p = document.createElement("p");
    p.id = "format";
    p.innerHTML = 'jpg, png: 4mo max';
    //Formulaire
    const formAjout = document.createElement("form");
    formAjout.id = "formAjout";
    const labelTitre = document.createElement("label");
    labelTitre.htmlFor = "titre";
    labelTitre.id = "labelTitre";
    labelTitre.innerHTML = 'Titre';
    const inputName = document.createElement("input");
    inputName.type = "text";
    inputName.name = "titre";
    inputName.id = "titre";
    const labelCategorie = document.createElement("label");
    labelCategorie.htmlFor = "categorie";
    labelCategorie.id = "labelCategorie";
    labelCategorie.innerHTML = "Catégorie";
    const selectCat = document.createElement("select");
    selectCat.name = "categorie";
    selectCat.id = "categorie";
    const submit = document.createElement("input");
    submit.type = "submit";
    submit.value = "Valider";
    submit.id = "envoyerProjet";
    
    //Ajout au DOM
    modalAjout.appendChild(intModal);
    intModal.appendChild(fondAjout);
    fondAjout.appendChild(logoAjout);
    fondAjout.appendChild(label);
    fondAjout.appendChild(input);
    fondAjout.appendChild(p);
    intModal.appendChild(formAjout);
    formAjout.appendChild(labelTitre);
    formAjout.appendChild(inputName);
    formAjout.appendChild(labelCategorie);
    formAjout.appendChild(selectCat);
    setOption(selectCat);
    formAjout.appendChild(submit);

    // Affiche l'image lorsqu'elle est sélectionnée
document.getElementById('photoProjet').addEventListener('change', function (event) {

    const file = event.target.files[0];
    const fondAjout = document.getElementById('fondAjout');
    const labelId = document.getElementById("labelId");
    const logoFond = document.getElementById("logoAjout");
    const p = document.getElementById("format");
    if (photoP.files[0].type === "image/jpeg" || photoP.files[0].type === "image/png") {

    const reader = new FileReader();
    reader.onload = function (e) {
        //fondAjout.innerHTML = '';
        labelId.classList.remove("styleAjoutPhoto");
        labelId.classList.add("hide");
        logoFond.classList.add("hide");
        p.classList.add("hide");
        const image = document.createElement('img');
        image.src = e.target.result;
        image.style.width = '100%';
        image.style.height = '169px';
        image.style.width = '129px';
        image.style.aspectRatio = 'auto';
        image.style.borderRadius = '10px';
        fondAjout.appendChild(image);
    }
    reader.readAsDataURL(file);
    
    }else{
        p.innerHTML = "Erreur de format d'image";
        p.style.color = "red";
    }
});

//Recuperation du formulaire
    const photoP = document.getElementById("photoProjet");
    const nom = document.getElementById("titre");
    const cat = document.getElementById("categorie");
    const btnValider = document.getElementById("envoyerProjet");
    const nouveauProjet = new FormData();
            nouveauProjet.append("title", nom);
            nouveauProjet.append("image", photoP);
            nouveauProjet.append("category", cat);


    function checkInputs() {
        if (nom.value && cat.value && photoP.files.length > 0) {
            btnValider.style.backgroundColor = '#1D6154';
            btnValider.disabled = false;
            console.log(nom.value, cat.value);
        } else {
            btnValider.style.backgroundColor = '#B3B3B3';
            btnValider.disabled = true;
            console.log("erreur");
            return;
        }
    }

    formAjout.addEventListener('change', function (event) {
        checkInputs();
    });

    btnValider.addEventListener('click', (event) => {
        event.preventDefault();
        validerProjet();
        
        console.log("ok sans reload");
    });

}

//Récupération des données du form et envoi à l'API Ne fonctionne pas. Ne trouve pas les données
 async function validerProjet (event) {
        const photoP = document.getElementById("photoProjet").files[0];
        const nom = document.getElementById("titre").value;
        const cat = document.getElementById("categorie").value;
        console.log("Données récupérées");
        
        try {
            const nouveauProjet = new FormData();
            nouveauProjet.append("title", nom);
            nouveauProjet.append("image", photoP);
            nouveauProjet.append("category", cat);

            const response = await fetch('http://localhost:5678/api/works', {
                method: 'POST',
                headers: {
                    "Authorization": `Bearer ${key}`
                },
                body: nouveauProjet
            });
            if (response.ok) {
                console.log("Projet ajouté!");
                loadProject().then(function(reponse){
                    affichageModal(reponse);
                    affichage(reponse);
                })
                retourGallery();
            } else {
                console.error("Erreur lors de l'ajout du projet:", response.status, response.statusText);
                const errorResponse = await response.json();
                console.error("Contenu de la réponse:", errorResponse);
            }
        } catch (error) {
            console.error("Erreur lors de la requête POST:", error);
        }
    }

//Utilisation de l'API pour creer les categories selectionnables
function setOption(selectCat) {
    for(let i=0; i<categorie.length; i++) {
        const option = document.createElement("option");
        option.innerHTML = categorie[i].name;
        option.value = categorie[i].id;
        selectCat.appendChild(option);
    }
}

/*------Fermeture et navigation dans la modale------*/

function closeModal() {
    const closeModal = document.querySelector("#modal");
    closeModal.setAttribute('aria-hidden', 'true');
    closeModal.style.display = 'none';
}

// Ecoute du bouton return de la modal
const retour = document.querySelector("#return");
retour.addEventListener('click', (event) => {
    retourGallery();
});

//Fonction pour retour sur la modaleGallery
function retourGallery (){
    const gallerieView = document.querySelector("#galleryView");
gallerieView.classList.remove('hide');
gallerieView.classList.add('show');
const addPhotoView = document.querySelector('#addPhotoView');
addPhotoView.classList.remove('show');
addPhotoView.classList.add('hide');
}

//Ecoute des comportements sur les modales (btn fermer, echap et click ext)
const btnClose = document.querySelector('#closeModal');
btnClose.addEventListener('click', () => {
    closeModal();
});

window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        closeModal();
    }
});
//fermeture au click exterieur à la modale
window.addEventListener("click", function(event) {
    if (event.target === windowModal) {
        closeModal();
      }
});


