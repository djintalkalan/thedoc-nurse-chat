const fs = require('fs');

const replaced = `compile `;
const replacement = `implementation `;

const files = ['node_modules/react-native-invoke-app/android/build.gradle'];

files.forEach(file => {
  fs.readFile(file, 'utf8', function (err, data) {
    if (err) {
      return console.log(err);
    }
    const result = data.replace(replaced, replacement);
    fs.writeFile(file, result, 'utf8', function (err) {
      if (err) return console.log(err);
    });
  });
});
