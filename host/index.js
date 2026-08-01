const fs = require("fs");
const path = require("path");

const rootFolder = ".";
const outputFolder = "galleries";

const imageExtensions = /\.(png|jpg|jpeg|gif|webp)$/i;


// Create galleries folder
if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder);
}


// Find all folders containing images
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

            // Ignore generated folders
            if (folder.name === outputFolder) return;

            folders.push(
                ...findImageFolders(
                    path.join(dir, folder.name)
                )
            );
        });


    return folders;
}


const folders = findImageFolders(rootFolder);


console.log("Galleries found:");
console.log(folders);


// Generate gallery HTML pages
function createGallery(folder) {

    const images = fs.readdirSync(folder)
        .filter(file => imageExtensions.test(file))
        .map(file =>
            path.join(folder, file)
                .replaceAll("\\", "/")
        );


    const title = folder
        .replace("./", "")
        .replaceAll("/", " ");


    const filename = folder
        .replace("./", "")
        .replaceAll("/", "-")
        .toLowerCase();


    const html = `
<!DOCTYPE html>
<html lang="en">

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
<img src="../${img}" loading="lazy" alt="">
`).join("")}

</div>

<script src="../script.js"></script>

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


// Generate main index.html

const indexHTML = `
<!DOCTYPE html>
<html lang="en">

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
    "index.html",
    indexHTML
);


console.log("Gallery generated!");