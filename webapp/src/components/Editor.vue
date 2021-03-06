<template>
  <div class="container">
    <editor-floating-menu
      :editor="editor"
      v-slot="{ commands, isActive, menu }"
    >
      <div
        class="editor__floating-menu"
        :class="{ 'is-active': menu.isActive }"
        :style="`top: ${menu.top}px`"
      >
        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.bold() }"
          @click="commands.bold"
        >
          <md-icon>format_bold</md-icon>
        </button>

        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.italic() }"
          @click="commands.italic"
        >
          <md-icon>format_italic</md-icon>
        </button>

        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.strike() }"
          @click="commands.strike"
        >
          <md-icon>format_strikethrough</md-icon>
        </button>

        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.underline() }"
          @click="commands.underline"
        >
          <md-icon>format_underline</md-icon>
        </button>

        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.heading({ level: 1 }) }"
          @click="commands.heading({ level: 1 })"
        >
          H1
        </button>

        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.heading({ level: 2 }) }"
          @click="commands.heading({ level: 2 })"
        >
          H2
        </button>

        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.heading({ level: 3 }) }"
          @click="commands.heading({ level: 3 })"
        >
          H3
        </button>

        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.bullet_list() }"
          @click="commands.bullet_list"
        >
          <md-icon>format_list_bulleted</md-icon>
        </button>

        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.ordered_list() }"
          @click="commands.ordered_list"
        >
          <md-icon>format_list_numbered</md-icon>
        </button>

        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.blockquote() }"
          @click="commands.blockquote"
        >
          <md-icon>format_quote</md-icon>
        </button>

        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.code_block() }"
          @click="commands.code_block"
        >
          <md-icon>code</md-icon>
        </button>

        <button class="menubar__button" @click="commands.horizontal_rule">
          <md-icon>horizontal_rule</md-icon>
        </button>

        <button class="menubar__button" @click="commands.undo">
          <md-icon>undo</md-icon>
        </button>

        <button class="menubar__button" @click="commands.redo">
          <md-icon>redo</md-icon>
        </button>
      </div>
    </editor-floating-menu>
    <template v-if="editor && !loading">
      <div class="count">
        {{ count }} {{ count === 1 ? "user" : "users" }} connected
      </div>
      <editor-content class="editor__content" :editor="editor" />
    </template>
    <em v-else> Connecting to socket server … </em>
  </div>
</template>

<script>
import io from "socket.io-client";
import { Editor, EditorContent, EditorFloatingMenu } from "tiptap";
import {
  Blockquote,
  CodeBlock,
  CodeBlockHighlight,
  Collaboration,
  HardBreak,
  Heading,
  HorizontalRule,
  OrderedList,
  BulletList,
  ListItem,
  TodoItem,
  TodoList,
  Bold,
  Italic,
  Link,
  Strike,
  Underline,
  History,
  Placeholder,
} from "tiptap-extensions";
import Doc from "./Doc";
import Title from "./Title";

import javascript from "highlight.js/lib/languages/javascript";
import css from "highlight.js/lib/languages/css";

export default {
  name: "Editor",
  components: {
    EditorContent,
    EditorFloatingMenu,
  },
  data: function () {
    return {
      editor: null,
      loading: true,
      socket: null,
      count: 0,
    };
  },
  methods: {
    onInit: function ({ doc, version }) {
      this.loading = false;

      if (this.editor) {
        this.editor.destroy();
      }

      this.editor = new Editor({
        content: doc,
        autoFocus: true,
        extensions: [
          new Collaboration({
            version,
            debounce: 250,
            onSendable: ({ sendable }) => {
              this.socket.emit("update", sendable);
            },
          }),
          new Doc(),
          new Title(),
          new Placeholder({
            showOnlyCurrent: false,
            emptyNodeText: (node) => {
              if (node.type.name === "title") {
                return "Give me a name";
              }
              return "Write something";
            },
          }),
          new Blockquote(),
          new BulletList(),
          new CodeBlock(),
          new CodeBlockHighlight({
            languages: {
              javascript,
              css,
            },
          }),
          new HardBreak(),
          new Heading({ levels: [1, 2, 3] }),
          new HorizontalRule(),
          new ListItem(),
          new OrderedList(),
          new TodoItem(),
          new TodoList(),
          new Link(),
          new Bold(),
          new Italic(),
          new Strike(),
          new Underline(),
          new History(),
        ],
      });
    },
    setCount: function (count) {
      this.count = count;
    },
  },
  mounted() {
    this.socket = io("http://127.0.0.1:3000")
      .on("init", (data) => this.onInit(data))
      .on("update", (data) =>
        this.editor.extensions.options.collaboration.update(data)
      )
      .on("getCount", (count) => this.setCount(count));
  },
  beforeDestroy() {
    this.editor.destroy();
    this.socket.destroy();
  },
};
</script>
<style lang="scss">
.count {
  display: flex;
  align-items: center;
  font-weight: bold;
  color: rgba(0, 0, 0, 0.5);
  color: #27b127;
  margin-bottom: 1rem;
  text-transform: uppercase;
  font-size: 0.7rem;
  line-height: 1;
  &:before {
    content: "";
    display: inline-flex;
    background-color: #27b127;
    width: 0.4rem;
    height: 0.4rem;
    border-radius: 50%;
    margin-right: 0.3rem;
  }
}
.ProseMirror:focus {
  outline: none;
}
.container {
  text-align: left;
}
.editor {
  position: relative;
  &__floating-menu {
    position: absolute;
    z-index: 1;
    margin-top: -0.25rem;
    visibility: hidden;
    opacity: 0;
    transition: opacity 0.2s, visibility 0.2s;
    &.is-active {
      opacity: 1;
      visibility: visible;
    }
  }
}
.editor .is-empty:first-child:before,
.editor .is-empty:nth-child(2):before {
  content: attr(data-empty-text);
  float: left;
  color: rgb(255, 255, 255);
  pointer-events: none;
  height: 0;
  font-style: italic;
}
blockquote {
  border-left: 1px solid var(--default-editor-color);
  padding-left: 0.8rem;
  font-style: italic;
}
.menubar__button {
  height: 30px;
  min-width: 30px;
  font-weight: 700;
  display: -webkit-inline-box;
  display: inline;
  background: transparent;
  border: 0;
  color: rgba(255, 255, 255, 0.5);
  padding: 0.2rem 0.5rem;
  margin-right: 0.2rem;
  border-radius: 3px;
  --md-theme-default-icon-on-background: rgba(255, 255, 255, 0.5);
  font-weight: 200;
  cursor: pointer;

  &.is-active {
    background-color: rgba(255, 255, 255, 0.1);
  }
  &:hover {
    background-color: rgba(255, 255, 255, 0.05);
  }
}
pre {
  padding: 0.7rem 1rem;
  border-radius: 5px;
  background: #000;
  color: #fff;
  font-size: 0.8rem;
  overflow-x: auto;
  text-align: left;
  &::before {
    content: attr(data-language);
    text-transform: uppercase;
    display: block;
    text-align: right;
    font-weight: bold;
    font-size: 0.6rem;
  }
  code {
    .hljs-comment,
    .hljs-quote {
      color: #999999;
    }
    .hljs-variable,
    .hljs-template-variable,
    .hljs-attribute,
    .hljs-tag,
    .hljs-name,
    .hljs-regexp,
    .hljs-link,
    .hljs-name,
    .hljs-selector-id,
    .hljs-selector-class {
      color: #f2777a;
    }
    .hljs-number,
    .hljs-meta,
    .hljs-built_in,
    .hljs-builtin-name,
    .hljs-literal,
    .hljs-type,
    .hljs-params {
      color: #f99157;
    }
    .hljs-string,
    .hljs-symbol,
    .hljs-bullet {
      color: #99cc99;
    }
    .hljs-title,
    .hljs-section {
      color: #ffcc66;
    }
    .hljs-keyword,
    .hljs-selector-tag {
      color: #6699cc;
    }
    .hljs-emphasis {
      font-style: italic;
    }
    .hljs-strong {
      font-weight: 700;
    }
  }
}
</style>