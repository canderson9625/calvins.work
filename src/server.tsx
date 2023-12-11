import { argv } from 'node:process';
const BUILD = {
    "sharp": false,
    "compile": false,
    "ssr": false
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
import liveReload from 'livereload';
import connectLiveReload from 'connect-livereload';

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
            });
        });
    }

    if ( BUILD.compile ) {
        console.log('Compiling assets with esbuild');
        // execSync('npm run build', {stdio: 'inherit'});
        execSync('npm run build');
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

//Live Reload
const liveReloadServer = liveReload.createServer();
liveReloadServer.server.once("connection", () => {
    setTimeout(() => {
        console.log('reload requested');
        liveReloadServer.refresh("/");
    }, 100);
});
liveReloadServer.watch([path.join(__dirname + '/dist'), path.join(__dirname + '/dist/index.html')]);
app.use(connectLiveReload());

app.use(express.static(path.resolve(__dirname + '/dist')));
const PORT = process.env.PORT || 80;
app.listen(PORT, () => {
    console.log('started on port ' + PORT);
});

// Shutdown server gracefully in docker
process.on('SIGTERM', process.exit);
process.on('SIGINT', process.exit);