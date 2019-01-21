const yargs = require('yargs');

const merge = require('./merge.js');

const argv = yargs
.command('merge', 'Merge JSON objects', {})
.options({
    f : {
        describe: 'File names - space separated. Include file extension.',
        demand: true,
        type: 'array',
        alias: 'fileName'
      },
    m : {
        describe: 'Desired merged filename. Include file extension.',
        demand: true,
        alias: 'mergedName'
    }
})
.help()
.argv;
var command = argv._[0];

if(command === 'merge'){
    let invalidFilenames = merge.checkFilenames(argv.fileName);
    if(invalidFilenames.length === 0){
        merge.mergeFiles(argv.mergedName, argv.fileName);
    } else
        console.log(`Could not find file(s) ${invalidFilenames}`)
  }else {
    console.log('Command not recognized');
  }
