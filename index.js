var net = require('net')

var server = net.createServer()

var sockets = []

server.on('connection', function(socket) {
    console.log('Got a new connection')

    socket.setEncoding('utf8')
    sockets.push(socket);

    let num = sockets.length

    socket.write(`Welcome, there are ${num} people here now...\n`)

    if(sockets.length > 1) {
        sockets.forEach(function(otherSocket) {
            if (otherSocket !== socket) {
                otherSocket.write(`Someone just join the room, there are now ${num} people here\n`);
            }
        })
    }
    
    socket.on('data', function(data) {
        console.log('Got data:', data)
        console.log(!!(data.toString().toLowerCase().trim() === 'quit'))
        
        if (data.toString().toLowerCase().trim() === 'quit') {
            let num = sockets.length - 1
            sockets.forEach(function(otherSocket) {
                if (otherSocket !== socket) {
                    otherSocket.write(`Someone just left the room, there are now ${num} people here\n`);
                }
            })
            socket.write(`Bye Bye\n`)
            return socket.end()
        } else {
            sockets.forEach(function(otherSocket) {
                if (otherSocket !== socket) {
                    otherSocket.write(data);
                }
            })            
        }
    })

    socket.on('close', function(socket) {
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