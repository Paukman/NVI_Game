import { useState, useEffect, useRef } from "react"

import socketIOClient from "socket.io-client"
const ENDPOINT = "http://localhost:8080"

const usePlay = () => {
  const socketRef = useRef()
  const [player, setPlayer] = useState()
  const [move, setMove] = useState()
  useEffect(() => {
    socketRef.current = socketIOClient(ENDPOINT)
    socketRef.current.on("joinedGame", (data) => {
      console.log("joined the game", data)
      setPlayer(data)
    })
    socketRef.current.on("joinedLocalGame", (data) => {
      console.log("joined the localgame", data)
      setPlayer(data)
    })
    socketRef.current.on("onMove", (move) => {
      console.log("moved", move)
      alert(move)
      setMove(move)
    })
    return () => {
      socketRef.current.emit("disconnect")
    }
  }, [])

  const joinGame = (username) => {
    socketRef.current.emit("joinGame", { username })
  }

  const makeMove = (place) => {
    socketRef.current.emit("makeMove", place)
  }

  const joinLocalGame = (username) => {
    socketRef.current.emit("joinLocalGame", username)
  }

  return { makeMove, joinGame, player, move, joinLocalGame }
}

export default usePlay
