var argv = require('optimist').argv
  , sh = require('shelljs')
  , pkgjson = require('../package.json')
  , cmds = [];

if(argv.ci)
    cmds.push('./import-certificates.sh');
cmds.push('xcrun -log codesign --deep --force --sign "'+pkgjson.config.certificate+'" '+
  '--keychain='+ (argv.ci ? 'ios-build' : 'login') +'.keychain' +
  ' ./build/releases/'+pkgjson.name+'-darwin-x64/'+pkgjson.name+'.app '
);

for(var i in cmds){
  console.log(cmds[i]);
  if(process.platform == 'win32'){
    sh.exec(cmds[i], {silent:true});
  } else {
    sh.exec(cmds[i]);
  }
}
