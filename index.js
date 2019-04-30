'use strict'

function downloadFile (filePath) {
  axios.get(filePath, { responseType: 'blob' })
    .then(getBlob)
    .then(function (blob) {
      var fileName = basename(filePath)

      var msSaveBlobOr = partial(
        iif,
        function () { return navigator.msSaveBlob },
        function (blob) { navigator.msSaveBlob(blob, fileName) }) // IE11 and Edge 12-18

      var saveObjectUrlOrDataUrl = iif(
        function () {
          var userAgent = navigator.userAgent
          return URL && URL.createObjectURL
            && userAgent.indexOf('Chrom') !== -1 && userAgent.indexOf('Safari') !== -1
        },
        function (readerBlob) { // Chrome and Firefox
          var blob = readerBlob.blob
          var url = URL.createObjectURL(blob)

          saveFile(url, fileName)
          URL.revokeObjectURL(url)
        },
        function (readerBlob) { // Safari
          var reader = readerBlob.reader
          var url = reader.result

          saveFile('ibooks://' + url, fileName)
        }
      )

      var save = msSaveBlobOr(function (blob) {
        var reader = new FileReader
        reader.onloadend = saveObjectUrlOrDataUrl({
          reader: reader,
          blob: blob,
          fileName: fileName
        })
        reader.readAsDataURL(blob)
      })

      save(blob)
    })
}

function saveFile (file, fileName) {
  console.log(file)
  var a = document.createElement("a")
  a.href = file
  a.style.display = 'none'
  a.setAttribute('download', 'fileName')
  a.download = fileName

  document.body.appendChild(a)

  a.click()

  a.parentNode.removeChild(a)
}

function partial (f) {
  var xs = Array.prototype.slice.call(arguments, 1)
  var x = xs.shift()
  return x == null
    ? f
    : partial.apply(null, [f.bind(null, x)].concat(xs))
}

function iif (expression, truePart, falsePart) {
  return function (argument) {
    return expression (argument) ? truePart (argument) : falsePart (argument)
  }
}

function basename (path) {
  var match = path.match(/\/?([^\/]+)$/)
  return match ? match[1] : ''
}
