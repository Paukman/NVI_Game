module.exports = () => {
  const players = new Map(); // only loged in players
  const localGame = new Map(); // only for local players, only one instance untill 2 playes join and then removed.
  const onlineGames = new Map(); // only for loged in players


  const joinLocalGame = (client, username) => {
    const numOfLocalPlayers = localGame.size;
    console.log(numOfLocalPlayers);
    if (numOfLocalPlayers < 2){
      localGame.set(client.id, username);
    } else {
      localGame.clear();
    }
  }

  const addPlayer = (client, username) => {
    console.log("addPlayer");
    players.set(client.id, username)
  }

  const registerPlayer = (client, user) => {
    console.log("registerPlayer");
    players.set(client.id, { client, user })
  }

  const removePlayer = (client) => {
    console.log("removePlayer");
    players.delete(client.id)
  }
  const getAllPlayers = () => players;
  const getLocalGame = () => localGame;

  return {
    addPlayer,
    registerPlayer,
    removePlayer,
    getAllPlayers,
    joinLocalGame,
    getLocalGame
  }
}
