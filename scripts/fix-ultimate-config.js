const fs = require('fs');

const replacements = [
    {
        replaced: `project.getConfigurations().implementation.setCanBeResolved(true)`,
        replacement: `// project.getConfigurations().implementation.setCanBeResolved(true)`
    },
    {
        replaced: `classpath += files(project.getConfigurations().getByName('implementation').asList())`,
        replacement: `// classpath += files(project.getConfigurations().getByName('implementation').asList())`
    }
]

const files = [
    'node_modules/react-native-ultimate-config/android/build.gradle',
];

files.forEach(file => {
    fs.readFile(file, 'utf8', function (err, data) {
        if (err) {
            return console.log(err);
        }
        let result = data
        for (const { replaced, replacement } of replacements) {
            if (result.includes(replacement)) {
                return
            }
            result = result.replace(replaced, replacement);
        }
        fs.writeFile(file, result, 'utf8', function (err) {
            if (err) return console.log(err);
        });
    });
});
