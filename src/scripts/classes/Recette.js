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
        this.chaineCaractere = this.name + this.servings + this.time + this.description + this.appliance + this.ustensils //Manque les ingredients
        this.src = "../assets/images/PhotoRecettes/"
        this.render = this.render()
    }

    render() {
        const article = document.createElement('article');
        const img = document.createElement('img');
        img.src = this.src + this.id + '.jpg';
        img.alt = 'Image la recette ' + this.name;
        const nameh1 = document.createElement('h1');
        const recetteH2 = document.createElement('h2');
        const recetteSpan = document.createElement('span');
        const IngredientsH2 = document.createElement('h2');

        nameh1.textContent = this.name;
        recetteH2.textContent = "RECETTE";
        recetteSpan.textContent = this.description;
        IngredientsH2.textContent = "INGREDIENTS"
        const divIngredients = document.createElement('div');
        this.ingredients.forEach(ingredient => {
            const div = document.createElement('div');
            const h3 = document.createElement('h3');
            h3.textContent = ingredient.ingredient;
            const span = document.createElement('span');
            span.textContent = ingredient.quantity + ingredient.unit;
            div.appendChild(h3);
            div.appendChild(span)
            divIngredients.appendChild(div);
        });


        article.appendChild(img)
        article.appendChild(nameh1);
        article.appendChild(recetteH2);
        article.appendChild(recetteSpan);
        article.appendChild(IngredientsH2);

        article.appendChild(divIngredients);



        return article;
    }
}