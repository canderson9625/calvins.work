import * as path from 'path';
import { fileURLToPath } from 'url';
import * as esbuild from "esbuild"

let rawDirname = path.dirname(fileURLToPath(import.meta.url));
// const __dirname = rawDirname.includes('src') ? rawDirname.substring(0, rawDirname.length - 4) : rawDirname;
const __dirname = rawDirname;

// transform paths and bundle the js
esbuild.build({
    entryPoints: ['src/ts/testserver.tsx'],
    bundle: true,
    outfile: 'src/ts/testserver.js',
    sourcemap: false,
    platform: 'node',
    format: 'esm',
    minify: false,
    packages: 'external',
    plugins: [
        {
            name: 'custom path resolver',
            setup(build) {
                const options = build.initialOptions
                options.define = options.define || {}
                options.define['process.env.NODE_ENV'] =
                options.minify ? '"production"' : '"development"'

                build.onResolve({ filter: new RegExp(/^@/) }, (args) => {
                    // console.log(args);
                    // all imports with the @ symbol should resolve
                    const isIndex = args.path.includes('/') ? '.tsx' : '/index.tsx';
                    const filePath = path.join(__dirname, args.path.slice(1) + isIndex);
                    // console.log(rawDirname, __dirname, isIndex, filePath)
                    return { path: filePath }
                });
            }
        }
    ]
})