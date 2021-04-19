import { useState } from "react"
import "./App.css"
import usePlay from "./usePlay"

function App() {
  const [userName, setUsername] = useState("")
  const { makeMove, joinGame, player, move, joinLocalGame } = usePlay()
  console.log(player)

  const handleOnChange = (e) => {
    setUsername(e.target.value)
  }
  const handleClick = () => {
    joinGame(userName)
  }
  const onMakeMove = () => {
    makeMove(Math.random())
  }

  const handleLogin = () => {}

  const handlePlayLocalGame = () => {
    joinLocalGame("");
  }
  return (
    <div className="App">
      <input onChange={handleOnChange} />
      <button onClick={handleClick}>Create Online Game</button>
      <button onClick={handlePlayLocalGame}>Play Local Game</button>
      <button onClick={handleLogin}>Login</button>
      
      <div>
        <button onClick={onMakeMove}>
          Move example will send the move to the server
        </button>
        Move:{move}
      </div>
    </div>
  )
}

export default App
