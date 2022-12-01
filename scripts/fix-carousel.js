const fs = require('fs');

const replaced = `<ScrollView ref={(c) => {`;
const replacement = `<ScrollView scrollEventThrottle={0} ref={(c) => {`;

const files = [
    'node_modules/react-native-carousel-loop/lib/index.js',
];

files.forEach(file => {
    fs.readFile(file, 'utf8', function (err, data) {
        if (err) {
            return console.log(err);
        }
        if (data.includes("scrollEventThrottle")) {
            return
        }
        // console.log("data", data);
        const result = data.replace(replaced, replacement);
        fs.writeFile(file, result, 'utf8', function (err) {
            if (err) return console.log(err);
        });
    });
});
