const app = require("express")()
const http = require("http").createServer(app)
const PORT = 8080

const io = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
})
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*")
  next()
})
http.listen(PORT)

const playerStore = require("./db")
const store = playerStore()

io.on("connection", function (client) {
  client.on("joinGame", function ({ username }) {
    store.addPlayer(client, username)
    io.emit("joinedGame", { username, client: client.id })
    console.log(store.getAllPlayers()) // see all the players
  })
  client.on("joinLocalGame", function ({ username }) {
    store.joinLocalGame(client, username)
    io.emit("joinedLocalGame", { username, client: client.id })
    console.log(store.getLocalGame()) // see local game
  })
  client.on("makeMove", function (move) {
    io.emit("onMove", move)
    console.log(store) // see all the players
  })
  client.on("disconnect", function () {
    store.removePlayer(client)
  })
})
