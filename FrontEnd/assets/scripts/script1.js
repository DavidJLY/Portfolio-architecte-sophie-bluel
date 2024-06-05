//Récupération des projets depuis l'API
const reponse = await fetch("http://localhost:5678/api/works");
const projet = await reponse.json();
//Recupération des categories depuis l,API
const catReponse = await fetch("http://localhost:5678/api/categories");
const categorie = await catReponse.json();

const windowModal = document.getElementById("modal");

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
    affichage(projet);
});

//Affichage général ou par catégorie
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

/*--------Appel de toutes le fonctions pour changements en mode connecté--------*/

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
    affichageModal(projet);
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

//Creation de l'element image
function createImageElement(work) {
    const imageElement = document.createElement("img");
    imageElement.src = work.imageUrl;
    imageElement.alt = work.title;
    imageElement.id = work.id;

    return imageElement;
}

function createbtnSuppr(work) {
    const btnSuppr = document.createElement('button');
    btnSuppr.innerHTML = `<i class="fa-solid fa-trash-can"></i>`; 
    btnSuppr.id = "suppr-" + work.id;
    btnSuppr.classList.add("suppr");
    
    // Écoute du bouton supprimer des projets de la modale Fonctionne mais raffraichissement complet de la page...
    btnSuppr.addEventListener('click', async(event) => {
        event.preventDefault();
        event.stopPropagation();
        await supprProjet(work);
    });

    async function supprProjet(work) {
        try {
            const response = await fetch(`http://localhost:5678/api/works/${work.id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${key}`
                }
            });
            if (response.ok) {
                console.log('Travail supprimé avec succès');
                btnSuppr.closest('figure').remove();
            } else {
                console.error('Échec de la suppression du travail');
            }
        } catch (error) {
            console.error('Erreur :', error);
        }
    
        }
    return btnSuppr;
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
    }
    reader.readAsDataURL(file);
    });


//Recuperation du formulaire
    const photoP = document.getElementById("photoProjet");
    const nom = document.getElementById("titre");
    const cat = document.getElementById("categorie");
    const btnValider = document.getElementById("envoyerProjet");

    function checkInputs() {
        if (nom.value && cat.value && photoP.files.length > 0) {
            btnValider.style.backgroundColor = '#1D6154';
            btnValider.disabled = false;
        } else {
            btnValider.style.backgroundColor = '#B3B3B3';
            btnValider.disabled = true;
            return;
        }
    }

    formAjout.addEventListener('change', function (event) {
        checkInputs();
    });

    btnValider.addEventListener('click', validerProjet);

   
}

//Récupération des données du form et envoi à l'API Ne fonctionne pas 
 async function validerProjet (event) {
        event.preventDefault();
        console.log("Données récupérées");
        const photoP = document.getElementById("photoProjet").files[0];
        const nom = document.getElementById("titre").value;
        const cat = document.getElementById("categorie").value;
        
        try {
            const nouveauProjet = new FormData();
            nouveauProjet.append("title", nom);
            nouveauProjet.append("image", photoP);
            nouveauProjet.append("category", cat);

            const response = await fetch('http://localhost:5678/api/works', {
                method: 'POST',
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                body: nouveauProjet
            });
            if (response.ok) {
                console.log("Projet ajouté!");
            } else {
                console.error("Erreur lors de l'ajout du projet:", response.status, response.statusText);
                const errorResponse = await response.json();
                console.error("Contenu de la réponse:", errorResponse);
                afficherMessage("Erreur lors de l'ajout du projet.");
            }
        } catch (error) {
            console.error("Erreur lors de la requête POST:", error);
            afficherMessage("Une erreur est survenue. Veuillez réessayer.");
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
    const gallerieView = document.querySelector("#galleryView");
    gallerieView.classList.remove('hide');
    gallerieView.classList.add('show');
    const addPhotoView = document.querySelector('#addPhotoView');
    addPhotoView.classList.remove('show');
    addPhotoView.classList.add('hide');
});

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


