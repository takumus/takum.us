<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <router-view/>
  </div>
</template>

<style lang="scss">
@import "./scss/utils.scss";
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  @include pc {
  };
  @include sp {
  };
}
#nav {
  padding: 30px;
}
#nav a {
  font-weight: bold;
  color: #2c3e50;
}
#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
<script>
import * as io from 'socket.io-client';
import Config from '../../@config';
export default {
  name: "app",
  created() {
    const serverURL = `${Config.wsURL}:${Config.wsPort}`;
    const socket = io(serverURL);
    socket.on('connect', () => {
      console.log(`connected to server: '${serverURL}'`);
      socket.emit('data', {
        message: 'hello from client'
      })
    });
    socket.on('data', (data) => {
      console.log(data);
    });
  }
}
</script>