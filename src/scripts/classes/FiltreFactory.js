import FiltresManager from '../classes/FiltresManager.js';

var filtresManager = new FiltresManager();


class Filtre {
    constructor() {
        this.filtreDOM;
        this.choixFiltresDOM = document.querySelector(".choixFiltres");

        this.elementsIDs = {};
        this.key;


    }

    key() {

    }

    keyIngredient() {

    }

    render(recettes) {
        recettes.forEach((recette) => {
            const recetteId = recette.id;
            this.init(recette);
            const elements = Array.isArray(this.key) ? this.key : [this.key];
            elements.forEach((element) => {
                element = this.keyIngredient(element);
                const elementLowerCase = element.toLowerCase(); // Convertir en minuscules
                if (!this.elementsIDs.hasOwnProperty(elementLowerCase)) {
                    // Si l'ustensile n'a pas encore été ajouté, créez un tableau d'IDs
                    this.elementsIDs[elementLowerCase] = [recetteId];
                } else {
                    // Si l'ustensile existe déjà, ajoutez l'ID de la recette au tableau
                    if (!this.elementsIDs[elementLowerCase].includes(recetteId)) {
                        this.elementsIDs[elementLowerCase].push(recetteId);
                    }
                }
            });
        });

        return this.elementsIDs;

    }

}

class IngredientsFiltre extends Filtre {

    init(recette) {
        this.key = recette.ingredients;
        this.filtreDOM = document.querySelector(".listeIngredients");
    }

    keyIngredient(ingredients) {
        return ingredients.ingredient;
    }
}

class AppareilsFiltre extends Filtre {

    init(recette) {
        this.key = recette.appliance;
        this.filtreDOM = document.querySelector(".listeAppareils");
    }

    keyIngredient(element) {
        return element;
    }
}

class UstensilsFiltre extends Filtre {

    init(recette) {
        this.key = recette.ustensils;
        this.filtreDOM = document.querySelector(".listeUstensiles");
    }

    keyIngredient(element) {
        return element;
    }
}

export default class FiltreFactory {
    createFiltre(type) {
        switch (type) {
            case "ingredients":
                var ingredientsFiltre = new IngredientsFiltre();
                filtresManager.setFiltre(ingredientsFiltre);
                return ingredientsFiltre;
            case "appareils":
                var appareilsFiltre = new AppareilsFiltre();
                filtresManager.setFiltre(appareilsFiltre);
                return appareilsFiltre;
            case "ustensils":
                var ustensilsFiltre = new UstensilsFiltre();
                filtresManager.setFiltre(ustensilsFiltre);
                return ustensilsFiltre;
            default:
                throw new Error("Type de modèle inconnu.");
        }
    }

    capitalizeFirstLetter(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }


    templateFiltre() {

        filtresManager.filtres.forEach(filtre => {
            // Créez un élément <ul> (liste non ordonnée) pour contenir les éléments <li>
            filtre.filtreDOM.innerHTML = ""; // on renitialise le DOM HTML

            for (let element in filtre.elementsIDs) {
                const li = document.createElement('li');
                li.textContent = this.capitalizeFirstLetter(element);
                this.initEvenementClick(li, filtre);
                // Ajoutez l'élément <li> à la liste <ul>
                filtre.filtreDOM.appendChild(li);
            }

            // Retournez l'élément <ul> complet
        });
        // Créez un élément <ul> (liste non ordonnée) pour contenir les éléments <li>

    }
    evenementClose(close, element, nomElement) {
        close.addEventListener('click', (event) => {
            element.parentNode.removeChild(element);
            filtresManager.closeFiltre(nomElement);
            this.templateFiltre();
        }
        );
    }


    initEvenementClick(element, filtre) {
        element.addEventListener('click', (event) => {
            const div = document.createElement('div');
            const divClose = document.createElement('div');
            const i = document.createElement('i');
            i.classList.add('fa-solid', 'fa-xmark');
            const span = document.createElement('span');
            const clickedElement = event.currentTarget;
            span.textContent = clickedElement.textContent;
            div.append(span);
            divClose.append(i);

            this.evenementClose(divClose, div, clickedElement.textContent);
            div.append(divClose);
            filtre.choixFiltresDOM.append(div);
            filtresManager.update(clickedElement.textContent, filtre);
            this.templateFiltre();
        });
    }

}

