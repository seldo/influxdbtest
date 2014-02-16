var lyRe = /^([0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}Z)/
var icRe = /^\[([a-zA-Z]{3}, [0-9]{2} [a-zA-Z]{3} [0-9]{4} [0-9]{2}:[0-9]{2}:[0-9]{2} GMT)\]/

var lyPkgRe = /"GET \/(?:npm\/public\/registry|isaacs\/public\/npm)\/([^\/]+)\/_attachments\/[^"]+?\.tgz"/
var icPkgRe = /GET \/registry\/([^\/]+)\/[^\? ]+?\.tgz(?:\?pkg=[^&]+&att=[^ ]+)? /

module.exports = function(line) {
  if (lyRe.test(line)) {
    return parseLy(line)
  } else if (icRe.test(line)) {
    return parseIc(line)
  }
}

var parseIc = function(line) {
  var m = line.match(icRe)
  if (!m)
    return false
  m = Date.parse(m[1])
  if (!m)
    return false
  var dt = new Date(m)
  var day = dt.toISOString().split('T')[0]

  if (!icPkgRe.test(line))
    return false

  var p = line.match(icPkgRe)[1]

  return [dt,day,p]
}

var parseLy = function(line) {
  var m = line.match(lyRe)

  if (!m)
    return false

  if (!Date.parse(m[1]))
    return false

  var dt = new Date(m[1])
  var day = m[1].split('T')[0]

  if (!lyPkgRe.test(line))
    return false

  var p = line.match(lyPkgRe)[1]

  return [dt,day,p]
}