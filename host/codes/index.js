const fs = require("fs");
const path = require("path");


const rootFolder = ".";
const outputFolder = "galleries";

const imageExtensions = /\.(png|jpg|jpeg|gif|webp)$/i;


if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder);
}


// Find every folder containing images
function findImageFolders(dir) {

    let folders = [];

    const files = fs.readdirSync(dir, {
        withFileTypes: true
    });


    const hasImages = files.some(file =>
        file.isFile() && imageExtensions.test(file.name)
    );


    if (hasImages) {
        folders.push(dir);
    }


    files
        .filter(file => file.isDirectory())
        .forEach(folder => {

            folders.push(
                ...findImageFolders(
                    path.join(dir, folder.name)
                )
            );

        });


    return folders;
}



const folders = findImageFolders(rootFolder)
    .filter(folder => !folder.startsWith(outputFolder));


console.log("Found galleries:");
console.log(folders);



function createGallery(folder) {

    const images = fs.readdirSync(folder)
        .filter(file => imageExtensions.test(file))
        .map(file =>
            path.join(folder, file).replaceAll("\\", "/")
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
<html>

<head>
<title>${title}</title>
<link rel="stylesheet" href="../stylesheet.css">
</head>

<body>

<a href="../index.html">← Back</a>

<h1>${title}</h1>

<div class="gallery">

${images.map(img => `
<img src="../${img}" loading="lazy">
`).join("")}

</div>

</body>

</html>
`;


    fs.writeFileSync(
        `${outputFolder}/${filename}.html`,
        html
    );


    return {
        title,
        filename
    };
}



const galleries = folders.map(createGallery);



// Generate index
const index = `
<!DOCTYPE html>
<html>

<head>
<title>Gallery</title>
<link rel="stylesheet" href="stylesheet.css">
</head>

<body>

<h1>Gallery</h1>

${galleries.map(g => `
<a href="galleries/${g.filename}.html">
${g.title}
</a><br>
`).join("")}

</body>

</html>
`;


fs.writeFileSync("index.html", index);

console.log("Gallery generated!");