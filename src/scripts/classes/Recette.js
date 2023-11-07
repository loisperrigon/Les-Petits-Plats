export default class Recette {
    constructor(element) {
        this.id = element.id;
        this.image = element.id;
        this.name = element.name;
        this.servings = element.servings;
        this.ingredients = element.ingredients;
        this.time = element.time;
        this.description = element.description;
        this.appliance = element.appliance;
        this.ustensils = element.ustensils;
        this.indexChaine = this.createIndexChaine();
        this.src = "../assets/images/PhotoRecettes/"
        this.render = this.render()
    }

    createIndexChaine() {
        let chaineCaractere = this.name + " " + this.servings + " " + this.time + " " + this.description + " " + this.appliance + " " + this.ustensils;
        this.ingredients.forEach(ingredient => {
            chaineCaractere += " " + ingredient.ingredient;
            if (ingredient.quantity) {
                chaineCaractere += " " + ingredient.quantity;
            }
            if (ingredient.unit) {
                chaineCaractere += " " + ingredient.unit;
            }
        });


        return chaineCaractere.toLowerCase();

    }

    render() {
        const article = document.createElement('article');
        const img = document.createElement('img');
        const divContainText = document.createElement('div');
        divContainText.classList.add('containText');
        img.src = this.src + this.id + '.jpg';
        img.alt = 'Image la recette ' + this.name;
        const nameh1 = document.createElement('h1');
        const recetteH2 = document.createElement('h2');

        const divDescriptionRecette = document.createElement('div');
        divDescriptionRecette.classList.add('descriptionRecette');
        const recetteSpan = document.createElement('span');
        divDescriptionRecette.appendChild(recetteSpan);
        const IngredientsH2 = document.createElement('h2');

        nameh1.textContent = this.name;
        recetteH2.textContent = "RECETTE";
        recetteSpan.textContent = this.description;
        IngredientsH2.textContent = "INGREDIENTS"
        const divIngredients = document.createElement('div');
        divIngredients.classList.add('ingredients');

        this.ingredients.forEach(ingredient => {
            const div = document.createElement('div');
            const h3 = document.createElement('h3');
            h3.textContent = ingredient.ingredient;
            const span = document.createElement('span');
            span.textContent = ingredient.quantity
            if (ingredient.unit) {
                span.textContent += " " + ingredient.unit;
            }

            div.appendChild(h3);
            div.appendChild(span)
            divIngredients.appendChild(div);
        });


        article.appendChild(img)
        divContainText.appendChild(nameh1);
        divContainText.appendChild(recetteH2);
        divContainText.appendChild(divDescriptionRecette);
        divContainText.appendChild(IngredientsH2);
        divContainText.appendChild(divIngredients);

        article.appendChild(divContainText);



        return article;
    }
}