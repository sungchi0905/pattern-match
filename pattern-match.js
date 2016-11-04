var Transform = require('stream').Transform;
var util = require( "util" ).inherits;

// For Node 0.8 users
if (!Transform) {
  Transform = require('readable-stream/transform');
}

/** Constructor logic includes Internal state logic. PatternMatch needs to consider
 *  it beacuse it has to parse chunks that get transformed
 */
function PatternMatch(pattern) {
  this.pattern = pattern;
  
  // Switching on object mode so when stream reads sensordata it emits single pattern match.
  Transform.call(this, { objectMode: true });
}

/** Extend the Transform class.
 *  --
 * NOTE: This only extends the class methods - not the internal properties. As such we
 * have to make sure to call the Transform constructor (above).
 */
util(PatternMatch, Transform);

/** Transform classes require that we implement a single method called _transform and
 *  optionally implement a method called _flush. Your assignment will implement both.
 */
PatternMatch.prototype._transform = function(chunk, encoding, getNextChunk) {
  // Make sure chunk is string
  var data = chunk.toString();

  //if (this._lastLineData) {  data = this._lastLineData + data;  }

  // Split data by pattern
  var lines = data.split(this.pattern);

  //this._lastLineData = lines.splice(lines.length - 1, 1)[0];
  
  lines.splice(lines.length - 1, 1)[0];
	
  lines.forEach(this.push.bind(this));

  getNextChunk();
};

/** After stream has been read and transformed, the _flush method is called. It is a great
 *  place to push values to output stream and clean up existing data
 */
/*
PatternMatch.prototype._flush = function (flushCompleted) {
    if (this._lastLineData) {  this.push(this._lastLineData);  }
    console.log(this._lastLineData);
    this._lastLineData = null;
    flushCompleted();
};
*/
module.exports = PatternMatch;
// That wraps up our little patternMatch module.
