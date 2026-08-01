document.addEventListener("DOMContentLoaded", () => {

    const search = document.querySelector("#image-search");

    if (!search) return;


    const images = document.querySelectorAll(".image-container");


    search.addEventListener("input", () => {

        const value = search.value.toLowerCase();


        images.forEach(image => {

            const name = image.dataset.name;


            if (name.includes(value)) {
                image.style.display = "";
            } else {
                image.style.display = "none";
            }

        });

    });

});

document.addEventListener("click", function(e) {

    if (!e.target.classList.contains("copy-btn")) return;

    const url = new URL(
        e.target.dataset.url,
        window.location.origin + window.location.pathname
    ).href;


    navigator.clipboard.writeText(url)
        .then(() => {

            e.target.textContent = "Copied!";

            setTimeout(() => {
                e.target.textContent = "Copy URL";
            }, 1500);

        })
        .catch(err => {
            console.error("Copy failed:", err);
        });

});