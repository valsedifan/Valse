console.log("INDEX.JS STARTED");

const fs = require("fs");
const path = require("path");

const rootFolder = __dirname;
const outputFolder = path.join(rootFolder, "galleries");

const imageExtensions = /\.(png|jpg|jpeg|gif|webp|img)$/i;


if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder);
}


function findImageFolders(dir) {

    let folders = [];

    const files = fs.readdirSync(dir, {
        withFileTypes: true
    });

    const containsImages = files.some(file =>
        file.isFile() && imageExtensions.test(file.name)
    );

    if (containsImages) {
        folders.push(dir);
    }


    files
        .filter(file => file.isDirectory())
        .forEach(folder => {

            if (folder.name === "galleries") return;

            folders.push(
                ...findImageFolders(
                    path.join(dir, folder.name)
                )
            );
        });


    return folders;
}


console.log("Scanning:", rootFolder);

const folders = findImageFolders(rootFolder);

console.log("Found:", folders);

function createGallery(folder) {

    const images = fs.readdirSync(folder)
        .filter(file => imageExtensions.test(file))
        .map(file =>
            path.relative(rootFolder, path.join(folder, file))
                .replaceAll("\\", "/")
        );


    const relativeFolder = path.relative(rootFolder, folder);

    const title = relativeFolder
        .replaceAll("/", " ");


    const filename = relativeFolder
        .replaceAll("\\", "-")
        .replaceAll("/", "-")
        .toLowerCase();


    const html = `
<!DOCTYPE html>
<html>

<head>
<meta charset="UTF-8">
<title>${title}</title>
<link rel="stylesheet" href="../stylesheet.css">
</head>

<body>

<a href="../index.html">← Back</a>

<h1>${title}</h1>

<div class="gallery">

${images.map(img => `
<div class="image-container">

    <img src="../${img}" loading="lazy">

    <button class="copy-btn" data-url="${img}">
        Copy URL
    </button>

</div>
`).join("")}

</div>

</body>
</html>
`;


    fs.writeFileSync(
        path.join(outputFolder, `${filename}.html`),
        html
    );


    return {
        title,
        filename
    };
}


const galleries = folders.map(createGallery);


const indexHTML = `
<!DOCTYPE html>
<html>

<head>
<meta charset="UTF-8">
<title>Gallery</title>
<link rel="stylesheet" href="stylesheet.css">
</head>

<body>

<h1>Gallery</h1>

<div class="folders">

${galleries.map(g => `
<a href="galleries/${g.filename}.html">
${g.title}
</a>
`).join("")}

</div>

</body>

</html>
`;


fs.writeFileSync(
    path.join(rootFolder, "index.html"),
    indexHTML
);


console.log("Gallery generated!");


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