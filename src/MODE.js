import * as ohm from 'ohm-js'
import fs from 'fs';

const fileName = process.argv[2];

if (!fileName) {
    console.error('Usage: node src/MODE.js filename');
    process.exit(1);
}

try {
    const fileContent = fs.readFileSync('./src/MODE.ohm', 'utf8');
    const grammar = ohm.grammar(fileContent);
    console.log('Syntax is okay');
} catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
}
