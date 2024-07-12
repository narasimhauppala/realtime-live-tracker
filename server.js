const express = require("express");
const app = express();
const socketio = require("socket.io");
const http = require("http");
const path = require("path");

const server = http.createServer(app);
const io = socketio(server);

// setting up ejs view
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')))

//socket listen 
io.on("connection", (socket) =>{
    socket.on("send-location",(data) =>{
        
        io.emit("receive-location",{id: socket.id, ...data})
    })
    
    socket.on("disconnect", ()=>{
        io.emit("user-disconnected", socket.id)
    })

})



app.get("/", (req, res) => {
  res.render('index')
});

server.listen(3000, (err, res) => {
  if (err) {
    console.log({ msg: "Server Not Running!" });
  }
  console.log({ msg: "Server Started!" });
});
