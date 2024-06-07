//Récupération des projets depuis l'API
const reponse = await fetch("http://localhost:5678/api/works");
const projet = await reponse.json();
//Recupération des categories depuis l,API
const catReponse = await fetch("http://localhost:5678/api/categories");
const categorie = await catReponse.json();

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

//Ecoute du bouton modifier en mode connecté
const btnModif = document.getElementById('modif');
btnModif.addEventListener('click', (event) => {
    modal();
});


//Ecoute des comportements sur les modales (btn fermer, echap et click ext)
const btnClose = document.querySelector('#closeModal');
btnClose.addEventListener('click', () => {
    closeModal();
});

/*Clique exterieur pour fermer la modale. ne fonctionne pas
overlay.addEventListener("click", closeModal());
// Empêcher la propagation de l'événement de clic dans la modale
modal.addEventListener("click", stopPropagation);*/

window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        closeModal();
    }
});

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

// Ecoute du bouton return de la modal
const retour = document.querySelector("#return");
retour.addEventListener('click', (event) => {
    const gallerieView = document.querySelector("#galleryView");
    gallerieView.classList.remove('hide');
    gallerieView.classList.add('show');
    const addPhotoView = document.querySelector('#addPhotoView');
    addPhotoView.classList.remove('show');
    addPhotoView.classList.add('hide');
})

/******Fonctions*******/
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

//Changement du logIn pour le logOut
function chgLog() {
    const logout = document.getElementById("logOut");
    logout.classList.remove("hide");
    const login = document.getElementById("logIn");
    login.classList.add("hide");
}

//Appel de toutes le fonctions pour changement en mode connecté
function modeEdition() {
    chgLog();
    bandeaumodeEdition();
    filtersHide();
    titleModeEdition();
}

//Affichage de la gallery de la modale
function affichageModal(works){
    const affichage = document.querySelector(".galleryModal");
    affichage.innerHTML = "";
    for (let i=0; i<works.length; i++){
        //Création des éléments
        const figure = document.createElement("figure");
        const imageElement = createImageElement(works[i]);
        const btnSuppr = createbtnSuppr(works[i]);
        const divImg = document.createElement('div');
        divImg.id = "divImage";
        divImg.appendChild(imageElement);
        divImg.appendChild(btnSuppr);
        figure.appendChild(divImg);
        //Rattachement au DOM
        affichage.appendChild(figure);
    }
}

function createbtnSuppr(work) {
    const btnSuppr = document.createElement('button');
    btnSuppr.innerHTML = `<i class="fa-solid fa-trash-can"></i>`; 
    btnSuppr.id = "suppr-" + work.id;
    btnSuppr.classList.add("suppr");
    
    // Écoute du bouton supprimer des projets de la modale Fonctionne mais raffraichissement complet de la page...
    btnSuppr.addEventListener('click', (event) => {
        event.preventDefault();
        const response = fetch(`http://localhost:5678/api/works/${work.id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${key}`
            }
        })
        .then(response => {
            if (response.ok) {
                event.preventDefault();
                console.log('Travail supprimé avec succès');
                btnSuppr.parentElement.remove();
            } else {
                console.error('Échec de la suppression du travail');
            }
        })
        .catch(error => {
            console.error('Erreur :', error);
        });
    });
    return btnSuppr;
}

//Creation de l'element image
function createImageElement(work) {
    const imageElement = document.createElement("img");
    imageElement.src = work.imageUrl;
    imageElement.alt = work.title;
    imageElement.id = work.id;

    return imageElement;
}

//Apparition de la modale
function modal() {
    const openModal = document.querySelector("#modal");
    openModal.setAttribute('aria-hidden', 'false');
    openModal.style.display = 'flex';
    affichageModal(projet);
}

function modalAjout() {
    //Creation de l'ajout de la photo
    const modalAjout = document.querySelector(".modalAjout");
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

    const reader = new FileReader();
    reader.onload = function (e) {
        fondAjout.innerHTML = '';
        const image = document.createElement('img');
        image.src = e.target.result;
        image.style.width = '100%';
        image.style.height = '169px';
        image.style.width = '129px';
        image.style.aspectRatio = 'auto';
        image.style.borderRadius = '10px';
        fondAjout.appendChild(image);
    };

    reader.readAsDataURL(file);
});


//Recuperation des données du form et changement du btnSubmit Ne fonctionne pas
function validateForm () {
    const photoInput = document.getElementById("photoProjet");
    const titleInput = document.getElementById("titre");
    const categorieSelect = document.getElementById("categorie");
    const btnSubmit = document.getElementById("envoyerProjet");

    if (titleInput.value && categorieSelect.value && photoInput.files.length > 0) {
        btnSubmit.style.backgroundColor = 'green';
        btnSubmit.disabled = false;
        console.log("recperé");
    } else {
        btnSubmit.style.backgroundColor = 'gray';
        btnSubmit.disabled = true;
        console.log("pas recu");
        return;
    }
}

//Ecouter les evenements du form
function listenerForm () {
    const photoInput = document.getElementById("photoProjet");
    const titleInput = document.getElementById("titre");
    const categorieSelect = document.getElementById("categorie");
    photoInput.addEventListener('change' () => {
        validateForm();
    });

    titleInput.addEventListener('input' validateForm);
    categorieSelect.addEventListener('change' validateForm);
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

function closeModal() {
    const closeModal = document.querySelector("#modal");
    closeModal.setAttribute('aria-hidden', 'true');
    closeModal.style.display = 'none';
}

//code du mentor
Object.values(projets).forEach( projet => {
    // creates modal page element
    const modalFigureElement = document.createElement("figure");
    modalFigureElement.id = "fig_mod_img_"+projet.id;
    modalFigureElement.classList.add("image-container");
      // img
    const modalImageElement = document.createElement("img");
    modalImageElement.src = projet.imageUrl; // adds API value
      // dustbin container
    const modalDustbinElement = document.createElement("div");
    modalDustbinElement.id = "img_"+projet.id; // updates id with API value
    modalDustbinElement.classList.add("dustbin-container");
      // dustbin img
    const modalDustbinImg = document.createElement("span");
    modalDustbinImg.classList.add( "fa-sm","fa-regular","fa-trash-can", "dustbin");
    modalDustbinImg.setAttribute("aria-hidden", "true");

 // adds elements to the DOM
    const modalGallery = document.querySelector(".modal-gallery");
    modalGallery.appendChild(modalFigureElement);
    modalFigureElement.appendChild(modalImageElement);
    modalFigureElement.appendChild(modalDustbinElement);
    modalDustbinElement.appendChild(modalDustbinImg);
    
    modalDustbinImg.addEventListener('click', confirmRemoveProject);
});
David Diop11:33
Object.values(projets).forEach( projet => {
    // creates modal page element
    const modalFigureElement = document.createElement("figure");
    modalFigureElement.id = "fig_mod_img_"+projet.id;
    modalFigureElement.classList.add("image-container");
      // img
    const modalImageElement = document.createElement("img");
    modalImageElement.src = projet.imageUrl; // adds API value
      // dustbin container
    const modalDustbinElement = document.createElement("div");
    modalDustbinElement.id = "img_"+projet.id; // updates id with API value
    modalDustbinElement.classList.add("dustbin-container");
      // dustbin img
    const modalDustbinImg = document.createElement("span");
    modalDustbinImg.classList.add( "fa-sm","fa-regular","fa-trash-can", "dustbin");
    modalDustbinImg.setAttribute("aria-hidden", "true");

 // adds elements to the DOM
    const modalGallery = document.querySelector(".modal-gallery");
    modalGallery.appendChild(modalFigureElement);
    modalFigureElement.appendChild(modalImageElement);
    modalFigureElement.appendChild(modalDustbinElement);
    modalDustbinElement.appendChild(modalDustbinImg);
    
    modalDustbinImg.addEventListener('click', confirmRemoveProject);
});

Object.values(projets).forEach( projet => {
    // creates modal page element
    const modalFigureElement = document.createElement("figure");
    modalFigureElement.id = "fig_mod_img_"+projet.id;
    modalFigureElement.classList.add("image-container");
      // img
    const modalImageElement = document.createElement("img");
    modalImageElement.src = projet.imageUrl; // adds API value
      // dustbin container
    const modalDustbinElement = document.createElement("div");
    modalDustbinElement.id = "img_"+projet.id; // updates id with API value
    modalDustbinElement.classList.add("dustbin-container");
      // dustbin img
    const modalDustbinImg = document.createElement("span");
    modalDustbinImg.classList.add( "fa-sm","fa-regular","fa-trash-can", "dustbin");
    modalDustbinImg.setAttribute("aria-hidden", "true");

 // adds elements to the DOM
    const modalGallery = document.querySelector(".modal-gallery");
    modalGallery.appendChild(modalFigureElement);
    modalFigureElement.appendChild(modalImageElement);
    modalFigureElement.appendChild(modalDustbinElement);
    modalDustbinElement.appendChild(modalDustbinImg);
    
    modalDustbinImg.addEventListener('click', confirmRemoveProject);
});
