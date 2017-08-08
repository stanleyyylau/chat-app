var net = require('net')

var server = net.createServer()

var sockets = []

server.on('connection', function(socket) {
    console.log('Got a new connection')

    socket.setEncoding('utf8')
    sockets.push(socket);
    
    socket.on('data', function(data) {
        console.log('Got data:', data)

        sockets.forEach(function(otherSocket) {
            if (otherSocket !== socket) {
                otherSocket.write(data);
            }
        })
    })

    socket.on('close', function() {
        console.log('connection closed')
        var index = sockets.indexOf(socket)
        sockets.splice(index, 1)
    })
})

server.on('error', function(err) {
    console.log('Server error:', err.message)
})

server.on('close', function() {
    console.log('server closed')
})

server.listen(4001, function() {
    console.log('server listening on port 4001')
})