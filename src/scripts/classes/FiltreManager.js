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

        this.recettes = recettes;
        this.idRecettesActifs = this.initIdRecettesActifs();
        this.idRecettesDesactive = [];


    }

    initIdRecettesActifs() {
        return Array.from({ length: this.recettes.length }, (_, index) => index);
    }

    recherchePrincpalAndSecondaire() {
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


        let idrecettesactifs = []
        if (this.FiltrePrincipalDOM.value.length >= 0) {

            this.idRecettesActifs.forEach(idRecette => {
                if (this.recettes[idRecette].indexChaine.indexOf(this.FiltrePrincipalDOM.value.toLowerCase()) !== -1) {
                    this.recettes[idRecette].indexChaine
                    console.log(this.recettes[idRecette].indexChaine);
                    console.log(this.FiltrePrincipalDOM.value.toLowerCase());
                    idrecettesactifs.push(idRecette);
                }
            });

            this.idRecettesActifs = idrecettesactifs;
        }

    }

    renderTotalRecettes() {
        this.textTotalRecettesDom.textContent = this.idRecettesActifs.length + " Recettes";
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

    updateFiltres() {


        let items = this.itemsSuprime.filter(element => {
            const elementId = element.id;
            return this.idRecettesActifs.some(id => elementId.includes(id));
        });
        // Mise à jour de this.itemsSuprime en excluant les éléments réintégrés
        this.itemsSuprime = this.itemsSuprime.filter(element => !items.includes(element));

        items.forEach(element => {
            this.filtresSecondaire[element.filtre].items.push({
                item: element.item,
                id: element.id,
            });
        });

        for (const key in this.filtresSecondaire) {

            let filtre = this.filtresSecondaire[key]
            // Utilisez .filter() pour obtenir un nouveau tableau avec les éléments ayant des IDs en commun
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
            DOM.innerHTML = "";
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
        this.idRecettesActifs.forEach(id => {
            this.recettesDOM.appendChild(this.recettes[id].render);
        });

        this.renderTotalRecettes();

    }

    renderItem(DOM, item, key) {
        const li = document.createElement('li');
        li.textContent = item.item;
        DOM.appendChild(li);
        const self = this;
        li.addEventListener('click', function () {
            if (!self.filtresSecondaireActif[key]) {
                self.filtresSecondaireActif[key] = [];
            }
            self.filtresSecondaireActif[key].push(item);
            const index = self.filtresSecondaire[key].items.indexOf(item); //Recherche l'index de l'element
            if (index !== -1) {
                self.filtresSecondaire[key].items.splice(index, 1);
            }
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
                div.remove();

                if (!self.filtresSecondaire[key]) {
                    self.filtresSecondaire[key] = {
                        items: [],
                    };
                }
                self.filtresSecondaire[key].items.push(item);

                // Supprimez également l'élément de self.filtresActif[key]
                const indexActif = self.filtresSecondaireActif[key].indexOf(item);
                if (indexActif !== -1) {
                    self.filtresSecondaireActif[key].splice(indexActif, 1);
                }
                self.refreshPage()
            });

            self.refreshPage();
        });
    }

    refreshPage() {
        this.recherchePrincpalAndSecondaire();
        this.updateFiltres();
        this.renderRecettes();
        this.renderFiltres();
    }

}