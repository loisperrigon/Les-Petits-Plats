import FiltreManager from '../classes/FiltreManager.js';

import Recette from '../classes/Recette.js';
import { recipes } from '../../../data/recipes.js'; // Import de la variable qui contient les recettes, leurs ingrédients, etc...


document.querySelectorAll(".liste-title").forEach((title) => {
    title.addEventListener("click", () => {
        var liste = title.nextElementSibling;
        if (liste.className === 'liste-input-icon') {
            liste.className = 'liste-input-icon-active';
            title.className = 'liste-title-active';
        } else {
            liste.className = 'liste-input-icon';
            title.className = 'liste-title';
        }
    });
});

function initData() {
    var tab = [];
    recipes.forEach((element) => {
        tab.push(new Recette(element));
    });
    return tab;
}


function init() {
    var recettes = initData(); //initialistion d'un tableau de classe obj
    console.log(recettes)
    const filtreManager = new FiltreManager(recettes);
    filtreManager.triItemsForFiltreSecondaire();
    filtreManager.renderFiltres();
    filtreManager.renderRecettes();
}


init(); 
