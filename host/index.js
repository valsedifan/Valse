const fs = require("fs");
const path = require("path");

console.log("INDEX.JS STARTED");

const rootFolder = __dirname;
const outputFolder = path.join(rootFolder, "galleries");

const imageExtensions = /\.(png|jpg|jpeg|gif|webp|img)$/i;


// Create galleries folder
if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder);
}


// Find folders containing images
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

            // Ignore generated gallery folder
            if (folder.name === "galleries") return;

            folders.push(
                ...findImageFolders(
                    path.join(dir, folder.name)
                )
            );

        });


    return folders;
}


const folders = findImageFolders(rootFolder);

console.log("Scanning:", rootFolder);
console.log("Found:", folders);


// Create individual gallery pages
function createGallery(folder) {

    const images = fs.readdirSync(folder)
        .filter(file => imageExtensions.test(file))
        .map(file =>
            path.relative(
                rootFolder,
                path.join(folder, file)
            ).replaceAll("\\", "/")
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

<link href="https://valsedifan.github.io/Valse/revamp/blindinglightsfont/stylesheet.css" rel="stylesheet">

<link href="https://valsedifan.github.io/Valse/poppins.css" rel="stylesheet">

</head>


<body>


<a href="../index.html" class="back-btn">← Back</a>


<h1>${title}</h1>


<input
    type="text"
    id="image-search"
    placeholder="Search images..."
>


<div class="gallery">


${images.map(img => `

<div class="image-container" data-name="${path.basename(img).toLowerCase()}">

    <img src="../${img}" loading="lazy">

    <div class="personame">${path.basename(img).toLowerCase()}</div>

    <button 
        class="copy-btn"
        data-url="../${img}">
        Copy URL
    </button>

</div>

`).join("")}

</div>

<script src="copyImgLink.js"></script>
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


// Generate main index page

const indexHTML = `
<!DOCTYPE html>
<html>

<head>

<meta charset="UTF-8">

<title>hébergement blinding lights</title>

<link rel="stylesheet" href="stylesheet.css">

<link href="https://valsedifan.github.io/Valse/revamp/blindinglightsfont/stylesheet.css" rel="stylesheet">

<link href="https://valsedifan.github.io/Valse/poppins.css" rel="stylesheet">

</head>


<body>


<h1>hébergement blinding lights</h1>


<div class="folders">


${galleries.map(g => `

<div class="${g.filename}"><a href="galleries/${g.filename}.html">

${g.title}

</a></div>

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