import FiltreFactory from '../classes/FiltreFactory.js';
import Recette from '../classes/Recette.js';
import { recipes } from '../../../data/recipes.js'; // Import de la variable qui contient les recettes, leurs ingrédients, etc...

// Instanciez la classe FiltreFactory
const filtreFactory = new FiltreFactory();

//Filtres
var tabFiltres = [];


document.querySelectorAll(".liste-title").forEach((title) => {
    title.addEventListener("click", () => {
        var liste = title.nextElementSibling;
        console.log(liste.className);
        if (liste.className === 'liste-input-icon') {
            liste.className = 'liste-input-icon-active';
            title.className = 'liste-title-active';
            console.log(title);
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

function initfiltres(recettes) {

    tabFiltres.push(filtreFactory.createFiltre('ingredients'));
    tabFiltres.push(filtreFactory.createFiltre('appareils'));
    tabFiltres.push(filtreFactory.createFiltre('ustensils'));

    tabFiltres.forEach((filtre) => {
        filtre.render(recettes)
    });
    filtreFactory.templateFiltre();

}


function init() {
    var recettes = initData(); //initialistion d'un tableau de classe obj

    initfiltres(recettes);
}

init();