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

    updateElementFiltre(elementClick) {
        for (let element in this.elementsIDs) {
            // Remplacez 'blender' par le nom de l'élément que vous souhaitez supprimer
            if (element === elementClick.toLowerCase()) {
                delete this.elementsIDs[element]; // Supprimez l'élément spécifié par la variable
                console.log(this.elementsIDs);
                break;
            }
        }
        this.filtreDOM.innerHTML = "";
        this.template();
    }

    initEvenementClick(element) {
        element.addEventListener('click', (event) => {
            const div = document.createElement('div');
            const span = document.createElement('span');
            const clickedElement = event.currentTarget;
            span.textContent = clickedElement.textContent;
            div.append(span);
            this.choixFiltresDOM.append(div);
            this.updateElementFiltre(clickedElement.textContent);
        });
    }

    capitalizeFirstLetter(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    template() {
        // Créez un élément <ul> (liste non ordonnée) pour contenir les éléments <li>
        for (let element in this.elementsIDs) {

            const li = document.createElement('li');
            li.textContent = this.capitalizeFirstLetter(element);
            this.initEvenementClick(li);
            // Ajoutez l'élément <li> à la liste <ul>
            this.filtreDOM.appendChild(li);
        }

        // Retournez l'élément <ul> complet
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
                return new IngredientsFiltre();
            case "appareils":
                return new AppareilsFiltre();
            case "ustensils":
                return new UstensilsFiltre();
            default:
                throw new Error("Type de modèle Filtre.");
        }
    }
}