document.addEventListener("DOMContentLoaded", () => {

    const search = document.querySelector("#image-search");

    if (!search) return;

    search.addEventListener("input", () => {

        const value = search.value.toLowerCase();

        document.querySelectorAll(".image-container").forEach(container => {

            const img = container.querySelector("img");

            if (!img) return;

            const filename = img.src
                .split("/")
                .pop()
                .toLowerCase();

            container.style.display =
                filename.includes(value) ? "" : "none";

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