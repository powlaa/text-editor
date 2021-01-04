<template>
  <div id="app">
    <Editor id="editor" />
  </div>
</template>

<script>
import Editor from "./components/Editor.vue";

export default {
  name: "App",
  components: {
    Editor,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  padding-top: 60px;
  background-color: rgb(47, 52, 55);
  --default-editor-color: rgba(255, 255, 255, 0.9);
  color: var(--default-editor-color);
  height: 100vh;
}
#editor {
  width: 90vw;
  margin-left: 5vw;
}
</style>
