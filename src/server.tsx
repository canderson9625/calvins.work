import { argv } from 'node:process';
const BUILD = {
    "sharp": false,
    "compile": false,
    "ssr": false,
    "dev": false,
}
argv.forEach((val, index) => {
    if ( index < 2 ) {
        return;
    }

    let option: keyof typeof BUILD
    for ( option in BUILD ) {
        if ( val.includes(option) ) {
            BUILD[option] = true;
        }
    }
});

// Server related imports
import express from 'express';
const app = express();
import * as path from 'path';
import { execSync } from 'child_process'; // to run our npm scripts
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Build related imports
import fs from 'fs';
import sharp from 'sharp';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import App from './ts/main';


function build () {
    // IIFE as an alternative to the named function
    
    if ( BUILD.sharp ) {
        console.log('Converting images to webp');
        fs.readdir(path.resolve(__dirname + '/src/media'), (err, files) => {
            if (err) { throw err; }
            files.forEach(file => {
                sharp(path.resolve(__dirname + '/src/media/' + file))
                    .toFormat('webp')
                    .toFile(path.resolve(__dirname + '/dist/assets/media/' + file + '.webp'));

                // copy the originals
                fs.copyFileSync(path.resolve(__dirname + '/src/media/' + file), path.resolve(__dirname + '/dist/assets/media/' + file));
            });
        });
    }

    if ( !BUILD.dev && BUILD.compile ) {
        console.log('Compiling assets with esbuild');
        // execSync('npm run build', {stdio: 'inherit'});
        execSync('npm run build');
    }
    
    if ( BUILD.dev ) {
        execSync('npm run css && npm run devjs');
    }

    if ( BUILD.ssr ) {
        console.log('Rendering App to SSR-OUTLET')
        fs.readFile(path.join(__dirname + '/src/index.html'), 'utf-8', (err, data) => {
            const REACT = ReactDOMServer.renderToString(<App />);
            const SSR_CONTENT = data.replace(
                /<!-- SSR-OUTLET -->/, 
                REACT
            );

            fs.writeFileSync(
                path.join(__dirname + '/dist/index.html'), 
                SSR_CONTENT,
                'utf-8'
            );
        });
    }
}
build();

app.use(express.static(path.resolve(__dirname + '/dist')));
app.use(express.static(path.resolve(__dirname + '/src')));
const PORT = process.env.PORT || 80;
app.listen(PORT, () => {
    console.log('started on port ' + PORT);
});

// Shutdown server gracefully in docker
process.on('SIGINT', () => {
    console.log('Received SIGINT. Goodbye.');
    process.exit();
});
process.on('SIGTERM', process.exit);