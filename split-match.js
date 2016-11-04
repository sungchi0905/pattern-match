var fs = require('fs');
var program = require('commander');
var PatternMatch = require('./pattern-match');

// Globals used for I/O
var matches = []; 
var inputHeader = "\n-------------------- Input --------------------\n";
var outputHeader = "\n-------------------- Output --------------------\n";
program
  .option( '-p, --pattern <pattern>', 'Input Pattern such as . , / - ? ^ (etc)' )
  .parse( process.argv );

// Create an input stream from the file system
var inputStream = fs.createReadStream( 'input-sensor.txt' );

// Output input to console
console.log( inputHeader );
inputStream.pipe( process.stdout );

/** Create a Pattern Matching stream that will run through the input and find matches
 *  for the given pattern at the command line - "." and ","
 */
var patternStream = inputStream.pipe( new PatternMatch(program.pattern) );

// Object to hold matches
var matches = [];

// Read matches from the stream
patternStream.on( 'readable', function() {
  var line;
  while ( null !== (line = patternStream.read()) ){
    matches.push(line.trim());
  }

});

// Output matches when complete
patternStream.on( 'end', function() {
  console.log(outputHeader);
  console.log(matches);
});