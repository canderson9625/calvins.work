const express = require('express')
const app = express();
const port = 8080;
const path = require('path');

const fs = require('fs');
const sharp = require('sharp');

const liveReload = require('livereload');
const connectLiveReload = require('connect-livereload');

async function build () {
    console.log('building');
    // Convert images to webp
    fs.readdir(path.resolve(__dirname + '/src/media'), (err, files) => {
        if (err) { throw err; }
        files.forEach(file => {
            sharp(path.resolve(__dirname + '/src/media/' + file))
                .toFormat('webp')
                .toFile(path.resolve(__dirname + '/dist/media/' + file + '.webp'));
        });
    });

    // execSync('npm run build', {stdio: 'inherit'});
    require('child_process').execSync('npm run build');
}

new Promise(async () => { 
    await build();
});

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
app.listen(port, () => {
    console.log('started');
});