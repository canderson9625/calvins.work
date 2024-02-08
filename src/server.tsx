// custom arguments for build
import { argv } from 'node:process';
const BUILD = {
    isBuilding: false,
    "sharp": false,
    "compile": false,
    "ssr": true, // Default: false
    "css": true
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
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

let rawDirname = path.dirname(fileURLToPath(import.meta.url));
const __dirname = rawDirname.includes('src') ? rawDirname.substring(0, rawDirname.length - 4) : rawDirname;

// Build related imports
import fs from 'fs';
// import sharp from 'sharp';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import App from './ts/main';
// import * as esbuild from "esbuild";

const build = async () => {
    BUILD.isBuilding = true;

    // if ( BUILD.sharp ) {
    //     console.log('Converting images to webp');
    //     fs.readdir(path.resolve(__dirname + '/src/media'), (err, files) => {
    //         if (err) { throw err; }
    //         files.forEach(file => {
    //             sharp(path.resolve(__dirname + '/src/media/' + file))
    //                 .toFormat('webp')
    //                 .toFile(path.resolve(__dirname + '/dist/assets/media/' + file + '.webp'));

    //             // copy the originals
    //             fs.copyFileSync(path.resolve(__dirname + '/src/media/' + file), path.resolve(__dirname + '/dist/assets/media/' + file));
    //         });
    //     });
    // }

    if ( BUILD.css ) {
        console.log('Bundling Sass');
        execSync('npm run css');
    }

    if ( BUILD.ssr ) {
        const promise = new Promise(async (resolve: CallableFunction) => {
            console.log('Rendering...')
            fs.readFile(__dirname + '/src/index.html', 'utf-8', (err, data) => {
                const REACT = ReactDOMServer.renderToString(<App />);

                if ( data && REACT ) {
                    const SSR_CONTENT = data.replace(
                        /<!-- SSR-OUTLET -->/, 
                        REACT
                    );
        
                    fs.writeFileSync(
                        path.join(__dirname + '/dist/index.html'), 
                        SSR_CONTENT,
                        'utf-8'
                    ); 
                }
            });
            // esbuild.build({
            //     entryPoints: ['src/client.tsx'],
            //     bundle: true,
            //     outfile: 'dist/assets/js/client.js',
            //     sourcemap: true,
            //     platform: 'node',
            //     format: 'esm',
            //     minify: false,
            //     plugins: [
            //         {
            //             name: 'custom path resolver',
            //             setup(build) {
            //                 const options = build.initialOptions
            //                 options.define = options.define || {}
            //                 options.define['process.env.NODE_ENV'] =
            //                 options.minify ? '"production"' : '"development"'

            //                 build.onResolve({ filter: new RegExp(/^@/) }, (args) => {
            //                     // console.log(args);
            //                     // all imports with the @ symbol should resolve
            //                     const isIndex = args.path.includes('/') ? '.tsx' : '/index.tsx';
            //                     const filePath = path.join(__dirname + '/src/ts/', args.path.slice(1) + isIndex);
            //                     return { path: filePath }
            //                 });
            //             }
            //         }
            //     ]
            // })
            await Bun.build({
                entrypoints: [__dirname + '/src/client.js'],
                outdir: __dirname + '/dist/assets/js'
            })
            resolve();
        })
        promise.then(() => {
            console.log('Finished');
        })
        promise.catch((err) => {
            throw new Error(err);
        });
    }
}
build();

app.use(express.static(path.resolve(__dirname + '/dist')));
const PORT = process.env.PORT || 80;
app.listen(PORT, () => {
    console.log('started on port ' + PORT);
});

// Shutdown server gracefully in docker
function gracefullyClose() {
    process.exit();
}
process.on('SIGINT', gracefullyClose);
process.on('SIGTERM', gracefullyClose);