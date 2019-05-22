'use strict'

const http = require('http')
const fs = require('fs')
const path = require('path')

const server = http.createServer(function (req, res) {
    const filePath = `${__dirname}${req.url === '/' ? '/index.html' : req.url}`
    const fileName = path.basename(req.url)

    if (path.extname(fileName) === '.pdf') {
        res.setHeader('Content-Type','application/pdf; charset=utf-8')
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`)
    }

    later(timestamp => { console.log(timestamp, filePath) }, new Date().toISOString()) 

    const stream = fs.createReadStream(filePath)
    stream.on('error', err => {
        res.statusCode = 404
        res.end('404 Not Found')
        later(() => { console.error(err) })
    })
    stream.pipe(res)
})
server.listen(8000)

function later (f, ...args) {
    setTimeout(f.bind(null, ...args), 0)
}
