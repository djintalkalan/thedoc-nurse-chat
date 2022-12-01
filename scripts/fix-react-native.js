const fs = require('fs');

const replaced = `get ViewPropTypes(): $FlowFixMe {`;
const replacement = `get ViewPropTypes(): $FlowFixMe { return {};`;

const files = [
    'node_modules/react-native/index.js',
];

files.forEach(file => {
    fs.readFile(file, 'utf8', function (err, data) {
        if (err) {
            return console.log(err);
        }
        if (data.includes(replacement)) {
            return
        }
        // console.log("data", data);
        const result = data.replace(replaced, replacement);
        fs.writeFile(file, result, 'utf8', function (err) {
            if (err) return console.log(err);
        });
    });
});
