/* eslint-disable quote-props */

const minimist = require('minimist');
const fs = require('fs');
const packager = require('electron-packager');
const path = require('path');
const archiver = require('archiver');
const pkg = require('./package.json');

const args = minimist(process.argv.slice(2));
const target = args._[0] || 'all';
const distPath = path.join(__dirname, "dist");

const platforms = {};
const defaults = {
  dir: './app',
  'app-version': pkg.version,
  out: distPath,
  overwrite: true,
  prune: true
};

const cb = (err, paths) => {
  if (err) {
    console.log(err.message);
    process.exit(1);
  }
};

platforms.macos = () => {
  packager(Object.assign({}, defaults, {
    platform: 'darwin',
    arch: 'x64',
    'app-bundle-id': 'me.whtsky.swagger-editor',
    icon: './build/icon.icns'
  }), (err, paths) => {
    cb(err, paths);
    const output = fs.createWriteStream(
      path.join(distPath, "Swagger Editor-macOS.zip")
    );
    const archive = archiver('zip');
    archive.pipe(output);
    archive.directory(path.join(paths[0], "Swagger Editor.app"), "Swagger Editor.app");
    archive.finalize();
  });
};

platforms.windows = () => {
  packager(Object.assign({}, defaults, {
    platform: 'win32',
    arch: 'x64',
    icon: './build/icon.ico',
    'version-string': {
      productName: pkg.productName
    }
  }), (err, paths) => {
    cb(err, paths);
    const output = fs.createWriteStream(
      path.join(distPath, "Swagger Editor-Windows.zip")
    );
    const archive = archiver('zip');
    archive.pipe(output);
    archive.directory(paths[0], "Swagger Editor");
    archive.finalize();
  });
};

platforms.all = () => {
  platforms.macos();
  platforms.windows();
};

platforms[target]();
