import { createServer } from "http"
import { Server } from "socket.io"
import express from 'express';
import path from 'path';


//html

const app = express();
const __dirname = path.resolve();
app.use(express.static(__dirname));
const filePath = path.join(__dirname, 'index.html');
app.get('/', (rea, res) => {
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error('Error sending file:', err);
            res.status(err.status).end();
        } else {
            console.log('File sent successfully');
        }
    });
})

const port = 3000;
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
})


//socket
let user_count = 1;
const SOCKET_PORT = 3500;
const httpServer = createServer()
const io = new Server(httpServer, {
    cors: {
        origin: "*"
    },
    transports: ['websocket', 'polling'], 
})

function assignUser(socket) {
    socket.userCount = user_count;
    user_count++;
}

io.on('connection', socket => {
    assignUser(socket);
    socket.join('robby');
    socket.room = 'robby';
    console.log(`User${socket.userCount} connected and sent to ${socket.room}`)

    io.to(socket.room).emit('message', `User${socket.userCount} entered in ${socket.room}`);


    //user sent message
    socket.on('message', data => {
        io.to(socket.room).emit('message', `User${socket.userCount}: ${data}`)
    })

    //end sequence
    socket.on('disconnect', () => {
        console.log(`User${socket.userCount} disconnected`);
        
        //leave the room where user in
        socket.leave(socket.room);
        socket.emit('delete-messages', "")

        io.to(socket.room).emit('message', `User${socket.userCount} left the ${socket.room}`);
    })

    //when user want to change room
    socket.on('enter-room', new_room => {
        socket.leave(socket.room);
        socket.join(new_room);
        socket.room = new_room;

        io.to(socket.room).emit('message', `User${socket.userCount} join the room: ${socket.room}`);
    })
})

httpServer.listen(SOCKET_PORT, () => console.log(`socket listening on port ${SOCKET_PORT}`));