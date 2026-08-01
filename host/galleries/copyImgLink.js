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