export default class FiltreManager {
    constructor() {
        this.filtres = [];
        this.filtresDOM = [];
        this.deletesElement = {};
        this.choixFiltres = {};
        this.tabIdRecettes = [];
    }

    setFiltre(filtre) {
        this.filtres.push(filtre);
    }

    closeFiltre(elementClose) {
        const elementCloseLowerCase = elementClose.toLowerCase();

        if (this.choixFiltres.hasOwnProperty(elementCloseLowerCase)) {
            // Récupérez l'élément à supprimer de this.choixFiltres
            const elementASupprimer = this.choixFiltres[elementCloseLowerCase];
            console.log(this.choixFiltres[elementCloseLowerCase]);
            // Supprimez l'élément de this.choixFiltres


            for (let element in this.filtres) {
                if (this.filtres[element].constructor.name === elementASupprimer.className) {

                    this.filtres[element].elementsIDs[elementCloseLowerCase] = this.choixFiltres[elementCloseLowerCase].recettesId;
                    console.log(this.filtres[element].elementsIDs);

                }
            }

            delete this.choixFiltres[elementCloseLowerCase];
            // Ajoutez l'élément à this.filtres
        }


    }

    update(elementClick, filtre) {
        for (let element in filtre.elementsIDs) {
            if (element === elementClick.toLowerCase()) {
                var idRecettesElement = filtre.elementsIDs[element];

                this.choixFiltres[element] = {   //On sauvegarde le choix du filtres
                    className: filtre.constructor.name,
                    recettesId: idRecettesElement
                };

                this.getElementsSameId(idRecettesElement);
                console.log(this.choixFiltres);
                delete filtre.elementsIDs[element]; //Puis on le delette du filtre
                break;

            }
        }
    }

    getElementsSameId(idRecettesElement) {
        for (let u in this.filtres) {
            var filtre = this.filtres[u];
            for (let i in filtre.elementsIDs) {
                var recettesId = filtre.elementsIDs[i];
                const tableauResultat = idRecettesElement.filter((element) => recettesId.includes(element));
                if (tableauResultat.length === 0) {
                    if (!this.deletesElement.hasOwnProperty(i)) {
                        this.deletesElement[i] = {
                            className: filtre.constructor.name,
                            recettesId: recettesId
                        };
                        delete filtre.elementsIDs[i];
                    };
                }
            }


        }
    }
}