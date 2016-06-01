#!/usr/bin/env node
var os = require('os')
  , pkgjson = require('../package.json')
  , path = require('path')
  , sh = require('shelljs')
  , argv = require('optimist').argv;

var appVersion = pkgjson.version
  , electronPackager = 'electron-packager'
  , electronVersion = pkgjson.config.electronVersion
  , archs = ['ia32', 'x64'];

function buildForPlatform(platform) {
   archs.forEach(function (arch) {
    pack(platform, arch);
  });
}

if (argv.all) {
  var platforms = ['linux', 'darwin'];
  if(process.platform === 'win32') platforms.push('win32');
  platforms.forEach(function (plat) {
   buildForPlatform(plat);
  });
} else if (argv.platform) {
  buildForPlatform(argv.platform);
} else {
  // build for current platform only
  pack(os.platform(), os.arch());
}

function pack (plat, arch) {

  var outputPath = path.join('.', 'build', 'releases');

  sh.exec('./node_modules/.bin/rimraf ' + outputPath);

  var appName = pkgjson.name;
  if(plat == 'linux') appName = appName.toLowerCase();

  // there is no darwin ia32 electron
  if (plat === 'darwin' && arch === 'ia32') return;

  var cmds = [];

  var location = './compile';

  cmds.push(electronPackager + ' '+location+' ' + appName +
    ' --platform=' + plat +
    ' --arch=' + arch +
    ' --version=' + electronVersion +
    ' --app-version=' + appVersion +
    ' --icon=./build/icon.icns' +
    ' --out=' + outputPath +
    ((plat == 'linux') ? '' : ' --prune') +
    ((plat === 'win32') ? ' --asar=true' : '') +
    ' --ignore="build|electron-packager"');

  for(var i in cmds){
    console.log(cmds[i]);
    if(process.platform == 'win32'){
      sh.exec(cmds[i], {silent:true});
    } else {
      sh.exec(cmds[i]);
    }
  }

}
