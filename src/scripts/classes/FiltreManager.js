export default class FiltreManager {
    constructor(recettes) {


        this.FiltrePrincipalDOM = document.getElementById('recherchePrincipal');
        this.FiltrePrincipalDOM.addEventListener('input', () => {
            this.refreshPage();
        });

        this.filtresSecondaire = {};
        this.filtresSecondaireActif = {};
        this.itemsSuprime = [];


        this.appareilsFiltreDom = document.querySelector(".listeAppareils");
        this.ingredientsFiltreDom = document.querySelector(".listeIngredients");
        this.ustensilsFiltreDom = document.querySelector(".listeUstensiles");

        this.rechercheAppareilsDOM = document.getElementById('rechercheAppareils');
        this.rechercheUstensilesDOM = document.getElementById('rechercheUstensiles');
        this.rechercheIngredientsDOM = document.getElementById('rechercheIngredients');


        this.rechercheAppareilsDOM.addEventListener('input', () => {
            this.renderFiltre(this.appareilsFiltreDom, this.rechercheAppareilsDOM, 'appareils');
        });
        this.rechercheUstensilesDOM.addEventListener('input', () => {
            this.renderFiltre(this.ustensilsFiltreDom, this.rechercheUstensilesDOM, 'ustensils');
        });
        this.rechercheIngredientsDOM.addEventListener('input', () => {
            this.renderFiltre(this.ingredientsFiltreDom, this.rechercheIngredientsDOM, 'ingredients');
        });

        this.textTotalRecettesDom = document.querySelector(".textTotalRecettes");
        this.filtresActifDOM = document.querySelector(".choixFiltres");
        this.recettesDOM = document.querySelector(".recettes");

        this.erreurRecherche = document.querySelector(".erreurRecherche");


        this.recettes = recettes;
        this.idRecettesActifs = this.initIdRecettesActifs();
        this.idRecettesDesactive = [];


    }

    addItemFiltreSecondaire(label, item, id) {
        if (!this.filtresSecondaire[label]) {
            this.filtresSecondaire[label] = {
                items: [],
            };
        }

        const items = this.filtresSecondaire[label].items;
        const existingItem = items.find(existingItem => existingItem.item === item);

        if (existingItem) {

            existingItem.id.push(id);
        } else {

            items.push({
                item: item,
                id: [id],
            });
        }
    }

    recuperationItem(label, items, id) {
        if (Array.isArray(items)) {
            items.forEach((item) => {
                this.addItemFiltreSecondaire(label, item, id);
            });
        } else {
            this.addItemFiltreSecondaire(label, items, id);
        }
    }

    triItemsForFiltreSecondaire() {
        this.recettes.forEach((recette) => {
            let id = recette.id
            let appliance = recette.appliance;
            let ustensils = recette.ustensils;
            let ingredientsObj = recette.ingredients;

            this.recuperationItem('appareils', appliance, id);
            this.recuperationItem('ustensils', ustensils, id);
            ingredientsObj.forEach((ingredients) => {
                let ingredient = ingredients.ingredient
                this.recuperationItem('ingredients', ingredient, id);
            });

        });

    }


    initIdRecettesActifs() {
        return Array.from({ length: this.recettes.length }, (_, index) => index);
    }

    recherchePrincpalAndSecondaire() {

        //Recherche secondaire
        const idFiltresActifs = [];

        for (const key in this.filtresSecondaireActif) {
            this.filtresSecondaireActif[key].forEach(item => {
                idFiltresActifs.push(item.id);
            });
        }

        if (idFiltresActifs.length === 0) {
            this.idRecettesActifs = this.initIdRecettesActifs();
        }
        else {
            this.idRecettesActifs = idFiltresActifs.reduce((commonIds, currentFilter, index) => {
                if (index === 0) {
                    return currentFilter;
                } else {
                    return commonIds.filter(id => currentFilter.includes(id));
                }
            }, []);
        }


        const numberOfRuns = 100000;
        let totalTime = 0;

        for (let i = 0; i < numberOfRuns; i++) {
            const startTime = performance.now();

            // Appel de la fonction mesurer
            this.recherchePrincipal(this.idRecettesActifs);

            // Ajoute le temps écoulé depuis le début du bloc de code au temps total
            totalTime += performance.now() - startTime;
        }

        console.log(`Total time: ${totalTime} milliseconds sur ${numberOfRuns} runs`);

        this.idRecettesActifs = this.recherchePrincipal(this.idRecettesActifs);

    }

    recherchePrincipal(idRecettesActifs) {
        //recherche Principal
        let newIdRecettesActifs = []
        if (this.FiltrePrincipalDOM.value.length >= 3) {
            const valueFiltrePrincipal = this.FiltrePrincipalDOM.value.toLowerCase()
            this.idRecettesActifs.forEach(idRecette => {

                if (this.recettes[idRecette].indexChaine.indexOf(valueFiltrePrincipal) !== -1) {
                    newIdRecettesActifs.push(idRecette);
                }

            });

            return newIdRecettesActifs;
        }

        return idRecettesActifs;
    }


    updateFiltresSecondaire() {

        //On regarde si dans les items deja suprimme si il ont au moins une meme id que les recettes
        let items = this.itemsSuprime.filter(item => {
            const elementId = item.id;
            return this.idRecettesActifs.some(id => elementId.includes(id));
        });
        // Mise à jour de this.itemsSuprime en excluant les éléments réintégrés
        this.itemsSuprime = this.itemsSuprime.filter(item => !items.includes(item));

        items.forEach(item => {
            this.filtresSecondaire[item.filtre].items.push({
                item: item.item,
                id: item.id,
            });
        });

        for (const key in this.filtresSecondaire) {

            let filtre = this.filtresSecondaire[key]
            // Utilise .filter() pour obtenir un nouveau tableau avec les éléments ayant des IDs en commun
            const elementsGardes = filtre.items.filter(element => {
                const elementId = element.id;
                return this.idRecettesActifs.some(id => elementId.includes(id));
            });
            // Utilisez .filter() de manière inverse pour obtenir les éléments supprimés
            const elementsSupprimesDuFiltre = filtre.items.filter(element => !elementsGardes.includes(element));

            // Ajoutez les éléments supprimés au tableau global des éléments supprimés avec une propriété 'filtre'
            elementsSupprimesDuFiltre.forEach(element => {
                element.filtre = key; // Ajoutez la propriété 'filtre'
                this.itemsSuprime.push(element);
            });

            //initialisation des items qui respecte les conditions
            filtre.items = elementsGardes;
        };
    }


    renderFiltres() {

        for (const key in this.filtresSecondaire) {
            let DOM;
            let DOMRecherche;
            switch (key) {
                case ('appareils'):
                    DOM = this.appareilsFiltreDom;
                    DOMRecherche = this.rechercheAppareilsDOM;
                    break;
                case ('ustensils'):
                    DOM = this.ustensilsFiltreDom;
                    DOMRecherche = this.rechercheUstensilesDOM;
                    break;
                case ('ingredients'):
                    DOM = this.ingredientsFiltreDom;
                    DOMRecherche = this.rechercheIngredientsDOM;
                    break;
            }
            this.renderFiltre(DOM, DOMRecherche, key);
        }
    }

    renderFiltre(DOM, DOMRecherche, key) {

        DOM.innerHTML = "";
        this.filtresSecondaire[key].items.forEach(item => {

            if (item.item.toLowerCase().indexOf(DOMRecherche.value.toLowerCase()) !== -1) {
                this.renderItem(DOM, item, key);
            }
        });

    }

    renderRecettes() {

        this.recettesDOM.innerHTML = "";
        if (this.idRecettesActifs.length > 0) {

            this.idRecettesActifs.forEach(id => {
                this.recettesDOM.appendChild(this.recettes[id].render);
            });

            this.erreurRecherche.textContent = "";
        }
        else {
            console.log('Aucune recette ne contient ‘' + this.FiltrePrincipalDOM.value + ' ’ vous pouvez chercher «tarte aux pommes », « poisson », etc.');
            this.erreurRecherche.textContent = 'Aucune recette ne contient ‘' + this.FiltrePrincipalDOM.value + ' ’ vous pouvez chercher «tarte aux pommes », « poisson », etc.'
        }

        this.renderTotalRecettes();

    }

    renderTotalRecettes() {
        this.textTotalRecettesDom.textContent = this.idRecettesActifs.length + " Recettes";
    }

    renderItem(DOM, item, key) {
        const li = document.createElement('li');
        li.textContent = item.item;
        DOM.appendChild(li);
        const self = this;
        li.addEventListener('click', function () {
            self.addItemActif(key, item);
            const div = document.createElement('div');
            const divClose = document.createElement('div');
            const span = document.createElement('span');
            const i = document.createElement('i');
            i.classList.add('fa-solid', 'fa-xmark');
            divClose.append(i);
            span.textContent = item.item;
            div.appendChild(span);
            div.appendChild(divClose);
            self.filtresActifDOM.appendChild(div)

            divClose.addEventListener('click', function () {
                // Supprimez l'élément div lorsque divClose est cliqué
                self.removeItemActif(div, key, item)
                self.refreshPage()
            });

            self.refreshPage();
        });
    }

    removeItemActif(div, key, item) {
        div.remove();

        if (!this.filtresSecondaire[key]) {
            this.filtresSecondaire[key] = {
                items: [],
            };
        }
        this.filtresSecondaire[key].items.push(item);

        // Supprimez également l'élément de self.filtresActif[key]
        const indexActif = this.filtresSecondaireActif[key].indexOf(item);
        if (indexActif !== -1) {
            this.filtresSecondaireActif[key].splice(indexActif, 1);
        }
    }

    addItemActif(key, item) {
        if (!this.filtresSecondaireActif[key]) {
            this.filtresSecondaireActif[key] = [];
        }
        this.filtresSecondaireActif[key].push(item);
        const index = this.filtresSecondaire[key].items.indexOf(item); //Recherche l'index de l'element
        if (index !== -1) {
            this.filtresSecondaire[key].items.splice(index, 1);
        }
    }

    refreshPage() {
        this.recherchePrincpalAndSecondaire();
        this.updateFiltresSecondaire();
        this.renderRecettes();
        this.renderFiltres();
    }

}