var argv = require('optimist').argv
  , sh = require('shelljs')
  , pkg = require('../package.json')
  , prefix = argv.target.toUpperCase()
  , d = new Date()
  , cmds = [
    'heroku config:set '+prefix+'_VERSION='+pkg.version+' --app anansi-podcast',
    'heroku config:set '+prefix+'_DATE='+d.getFullYear()+'-'+d.getMonth()+'-'+d.getDate()+' --app anansi-podcast',
  ]

 cmds.forEach((c) => sh.exec(c))
