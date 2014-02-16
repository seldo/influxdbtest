var influx = require('influx');
var readline = require('readline');
var stream = require('stream');
var parse = require('./parseLine')

var host = 'localhost'
var port = 8086
var username = 'localtest'
var password = 'localtest'
var database = 'localtest'
var client = influx(host, port, username, password, database);

process.stdin.setEncoding('utf8')

var counts = {}
var points = []
var outStream = new stream;
var batchMax = 1000

var rl = readline.createInterface({
  input: process.stdin,
  output: outStream
});

rl.on('line', function(line) {
  var log = parse(line)
  if(log !== false) {
    var dt = log[0]
    var day = log[1]
    var package = log[2]
    counts[day] = (counts[day] || {})
    counts[day][package] = (counts[day][package] || 0) + 1
    //console.log(day + ":" + package + "=" + counts[day][package])
    points.push({
      time: dt,
      package: package
    })
    if (points.length >= batchMax) {
      var insertBatch = points.slice(0)
      points.length = 0
      client.writePoints('package-downloads', insertBatch, {}, function(er) {
        if (er) {
          throw er
        } else {
          console.log("Wrote batch")
          console.log(insertBatch)
        }
      })
    }
  }
});

rl.on('close', function() {
  console.log(counts) // just to keep track
  console.log('done')
});