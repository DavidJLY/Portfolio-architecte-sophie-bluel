import { affichage } from "./function.js";
import { affichageModal } from "./function.js";
//Récupération des projets depuis l'API
const reponse = await fetch("http://localhost:5678/api/works");
const projet = await reponse.json();

affichage(projet);
affichageModal(projet);

//Ecoute du bouton modifier
const btnModif = document.getElementById('modif');
btnModif.addEventListener('click', (event) => {
    const openModal = document.querySelector("#modal1");
    openModal.setAttribute('aria-hidden', 'false');
    openModal.style.display = 'flex';
});

const btnClose = document.getElementById('closeIcone');
btnClose.addEventListener('click', (event) => {
    closeModal();
});

window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        closeModal();
    }
});

function closeModal() {
    const close = document.querySelector("#modal1");
    close.setAttribute('aria-hidden', 'true');
    close.style.display = 'none';
}
