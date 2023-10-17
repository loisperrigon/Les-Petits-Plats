document.querySelectorAll(".liste-title").forEach((title) => {
    title.addEventListener("click", () => {
        var liste = title.nextElementSibling;
        console.log(liste.className);
        if (liste.className === 'liste') {
            liste.className = 'liste-active';
            title.className = 'liste-title-active';
            console.log(liste.className);
        } else {
            liste.className = 'liste';
            title.className = 'liste-title';
        }
    });
});