const fs = require('fs');
const pdf = require('pdf-parse');

const dataBuffer = fs.readFileSync('18-11-25_Resume_Kshitij.pdf');

pdf(dataBuffer).then(function (data) {
    console.log(data.text);
}).catch(err => {
    console.error('Error:', err);
});
