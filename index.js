const express = require("express");
const http = require("http");
const app = express();
const server = http.Server(app);
const io = require("socket.io")(server);
//172.20.65.142
const ip = "127.0.0.1";
const port = 4000;

app.use(express.static("public"));
app.get("/", (req, res) => {
    res.sendFile("index.html", { root: __dirname });
})

const users = [];
const publicMessages = [];

io.on("connection", (socket) => {

    socket.emit("init", { message: "IFACHAT مرحباً بك" })

    socket.on("sendLog", (data) => {
        //securisation par authenticator
        data.id = socket.id;
        users.push(data);
    })
    socket.on("publicMessage", (data) => {
        data.id = socket.id;
        publicMessages.push(data);
        //console.dir(publicMessages);
        socket.broadcast.emit("publicMessageGlobal", data);
    })
    socket.on("disconnect",() => {
        let indexDisconnect;
        users.forEach((element,i) => {
            if(element.id === socket.id){
                indexDisconnect = i;
            }
        });
        users.splice(indexDisconnect,1);
        console.dir(users);
    })
})

server.listen(port, ip, () => {
    console.log("Demarer sur http://" + ip + ":" + port);
})