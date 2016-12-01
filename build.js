/* eslint-disable quote-props */

const minimist = require('minimist');
const packager = require('electron-packager');
const pkg = require('./package.json');

const args = minimist(process.argv.slice(2));
const target = args._[0] || 'all';

const platforms = {};
const defaults = {
  dir: './app',
  'app-version': pkg.version,
  out: 'dist/',
  overwrite: true,
  prune: true
};

const cb = (err, paths) => {
  if (err) {
    console.log(err.message);
    process.exit(1);
  }
  if (paths) console.log(paths.join('\n'));
};

platforms.macos = () => {
  packager(Object.assign({}, defaults, {
    platform: 'darwin',
    arch: 'x64',
    'app-bundle-id': 'me.whtsky.swagger-editor',
    icon: './build/icon.icns'
  }), (err, paths) => {
    cb(err, paths);
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
  });
};

platforms.all = () => {
  platforms.macos();
  platforms.windows();
};

platforms[target]();
