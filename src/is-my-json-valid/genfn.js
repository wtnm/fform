var INDENT_START = /[\{\[]/
var INDENT_END = /[\}\]]/
var sprintf = require("sprintf-js").sprintf


module.exports = function () {
  var lines = []
  var indent = 0

  var push = function (str) {
    var spaces = ''
    while (spaces.length < indent * 2) spaces += '  '
    lines.push(spaces + str)
  }

  var line = function (fmt) {
    if (!fmt) return line
    // console.log(sprintf.apply(null, arguments));
    if (INDENT_END.test(fmt.trim()[0]) && INDENT_START.test(fmt[fmt.length - 1])) {
      indent--
      push(sprintf.apply(null, arguments))
      indent++
      return line
    }
    if (INDENT_START.test(fmt[fmt.length - 1])) {
      push(sprintf.apply(null, arguments))
      indent++
      return line
    }
    if (INDENT_END.test(fmt.trim()[0])) {
      indent--
      push(sprintf.apply(null, arguments))
      return line
    }

    push(sprintf.apply(null, arguments))
    return line
  }

  line.toString = function () {
    return lines.join('\n')
  }

  line.toFunction = function (scope) {
    var src = 'return (' + line.toString() + ')'

    var keys = Object.keys(scope || {}).map(function (key) {
      return key
    })

    var vals = keys.map(function (key) {
      return scope[key]
    })

    return Function.apply(null, keys.concat(src)).apply(null, vals)
  }

  if (arguments.length) line.apply(null, arguments)

  return line
}
