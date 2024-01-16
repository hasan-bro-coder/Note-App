<template lang="">
  <div class="body">
    <nav ref="nav">
      <div class="top">
        <button class="new" @click="save(true)">
          save
        </button>
        <button class="new" @click="$refs.dialog.showModal()">NEW</button>
      </div>
      <div class="bottom">
        <div class="notes" v-for="note in notes">
          <div class="note" @click="load(note)">
            <h3>{{ note.name }}</h3>
            <h6 style="color:gray">{{ note.date }}</h6>
          </div>
        </div>
      </div>
        
    </nav>
    <main v-show="selected">
      <div class="top-nav" >
        <h1 class="header" contenteditable="true" autocomplete="off" autocorrect="off" autocapitalize="none" spellcheck="false" ref="header">Bro Notes</h1>
        <div class="flex" style="gap:10px">
          <button @click="md=!md;input()" class="good">markdown</button>
          <button @click="share" class="blue">share</button>  
          <button @click="delet" class="danger">delete</button>
        </div>
      </div>
      <div class="main">
      <div class="input-container" style="border-left: none">
        <textarea class="input" ref="input" value=" " @input="input"> </textarea>
      </div>
      <div class="input-container" v-show="md">
        <!-- <h1 class="header">Mark down</h1> -->
        <!-- <hr /> -->
        <!-- <br /> -->
        <div class="show"></div>
      </div>
    </div>
    </main>
    <main v-show="!selected" style="flex-direction: column">
      <div class="top-nav">
        <h1 class="logo">Bro Notes</h1>
        <div class="flex" style="gap:10px">
          <button @click="$refs.dialog.showModal()" class="blue">New Project</button>  
          <!-- <div></div> -->
          <button @click="logout()" class="danger">logout</button>
        </div>
      </div>
      <dialog ref="dialog">
        <div class="dialog">
          <h1>Create New Note</h1>
          <form class="max-w-sm mx-auto" @submit.prevent="newNote">
            <div class="mb-5">
              <label
                for="email"
                class="text-2xl block mb-2 font-medium text-gray-900 dark:text-white"
                >Note name:</label
              >
              <input
                type="text"
                id="email"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="name"
                required
              />
            </div>
            <button
              type="submit"
              class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-4 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Submit
            </button>
          </form>
        </div>
      </dialog>

      <div class="note-con">
          <div class="note-section" >
            <div class="noter" v-if="notes.length > 0" @click="load(note)" v-for="note in notes.slice(0, 6)">
                <h3>{{ note.name }}</h3>
                <h5 style="color:gray;font-weight:300">{{ note?.date }}</h5>
            </div>
            <div v-else>
                <h1 class="text-center " style="color: gray">no projects found (￣﹃￣)</h1>
            </div>
        </div>
    </div>
    </main>
  </div>
</template>
<script>
import { createClient } from "@supabase/supabase-js";
import markdownit from "markdown-it";
const marked = markdownit({
  linkify: true,
});
const supabaseUrl = "https://tvfskypksxpqwurntbuc.supabase.co";
const supabaseKey = import.meta.env.PUBLIC_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);
import { v4 as uuidv4 } from "uuid";
export default {
  data() {
    return {
      user: {},
      notes: [],
      md: false,
      selected: false,
      currnote: []
    };
  },
  async mounted() {
    const datas = await supabase.auth.getUser();
    if (datas.error) {
      alert("login")
      location.pathname = "/"
    }
    this.user = datas.data.user;
    let { data, error } = await supabase
      .from("note_list")
      .select("*")
      .eq("account", datas.data.user.id);
    if (data) {
      this.notes = JSON.parse(data[0].notes);
    }
    if (error) {
      alert(JSON.stringify(error))
    }
  },
  methods: {
    async share() {
      try {
        let that = this
        navigator.clipboard.writeText((location.host || "http://localhost:4321") + `/read/` + this.currnote.uid)
      } catch (err) {
        alert("error while sharing note" + JSON.stringify(err))
      }
    },
    async delet() {
      try {

        let that = this
        const { error } = await supabase
          .from('notes')
          .delete()
          .eq('account', this.user.id)
          .eq('uid', this.currnote.uid)
        let newNote = this.notes.filter(function (note) {
          return note.uid !== that.currnote.uid;
        });
        this.notes = newNote
        const notes_list = await supabase
          .from("note_list")
          .update({ notes: newNote })
          .eq("account", that.user.id)
          .select();
        this.selected = false;
        if (error || notes_list.error) {
          alert("error while delleting note" + JSON.stringify(error || notes_list.error))
        }
      } catch (err) {
        alert("error while delleting note" + JSON.stringify(err))
      }
    },
    async logout() {
      let { data, error } = await supabase.auth.signOut()
      if (!error) {
        location.pathname = '/'
      }
    },
    async save(verbose) {
      try {

        let that = this
        const { data, error } = await supabase
          .from('notes')
          .update({ data: this.$refs.input.value, name: this.$refs.header.innerText })
          .eq('account', this.user.id)
          .eq("uid", this.currnote.uid)
          .select()
        if (verbose) {
          let newNote = this.notes.map(function (note) {
            if (note.uid == that.currnote.uid) {
              note.name = that.$refs.header.innerText
            }
            return note;
          });
          const notes_list = await supabase
            .from("note_list")
            .update({ notes: newNote })
            .eq("account", that.user.id)
            .select();
        }
      } catch (err) {
        alert("error while saving the file" + "")
      }
    },

    async load(note) {
      this.selected = true;
      this.$refs.header.innerText = note.name
      this.currnote = note

      let { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq("uid", note.uid)
      this.$refs.input.value = data[0].data || " "
      this.input()
    },
    async newNote() {
      this.$refs.dialog.close();
      let that = this;
      let uid = uuidv4();
      let date = new Date();
      that.notes.push({
        name: document.querySelector("#email").value,
        uid: uid,
        date: date.toLocaleDateString()
      });

      const notes = await supabase
        .from("notes")
        .insert([
          {
            name: document.querySelector("#email").value,
            uid: uid,
            account: that.user.id,
            username: this.user.user_metadata.user_name || "unknown",
          },
        ])
        .select();
      if (notes.error) {
        alert(error)
      }
      const notes_list = await supabase
        .from("note_list")
        .update({ notes: that.notes })
        .eq("account", that.user.id)
        .select();
    },
    input() {
      this.save()
      if (!this.md) return 0;
      let input = document.querySelector(".input");
      let markdown = marked.render(input.value);
      document.querySelector(".show").innerHTML = markdown;
    },
  },
};
</script>
<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Open+Sans:wght@400&display=swap");




button {
  font-size: 13px;
}

dialog {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #13151a;
  border: 1px solid white;
  border-radius: 12px;

  .dialog {
    padding: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 20px;
  }

  h1 {
    font-size: 30px;
  }

  button {
    border: 1px solid white;
    border-radius: 3px;
    padding: 3px;
    background-color: transparent;
  }
}



.body {
  display: flex;
  gap: 20px;
  font-family: "Open Sans", system-ui, -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue",
    sans-serif !important;

  // justify-content: center;
  // align-items: center;
  nav {
    overflow-y: hidden;
    border-right: 1px solid white;
    border-bottom: 1px solid white;
    width: 20px;
    // opacity: 0;
    height: 100vh;
    overflow-x: hidden;
    transition: 1s;

    .bottom {
      scrollbar-color: transparent transparent;
      // overflow-y: scroll;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      scrollbar-width: thin;

      .notes {

        opacity: 0;
        transition: 1s;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        height: 50px;
        width: 100%;

        &:hover {
          background-color: gray;
          // transform: translate(0px,-20px);
        }

        .note {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
        }
      }
    }

    &:hover {
      .top {
        opacity: 1;
      }

      .notes {
        opacity: 1;
      }

      overflow-y:auto;
      width: max(200px, 20vw);
    }

    .top {
      transition: 1s;
      opacity: 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 50px;
      padding: 10px;
      border-bottom: 1px solid white;

      button {
        border: 1px solid white;
        border-radius: 3px;
        padding: 3px;
        background-color: transparent;
      }

    }
  }

  main {
    .note-con {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 80vh;
      width: 100%;

      .note-section {
        overflow: visible;
        display: grid;
        width: 60%;
        margin-top: 20vh;
        padding: 20px;
        height: 100%;
        grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
        grid-template-rows: repeat(auto-fit, 100px);
        gap: 20px;

        // border: 1px solid white;
        .noter {
          display: flex;
          justify-content: center;
          align-items: center;
          text-align: center;
          flex-direction: column;
          // aspect-ratio: 2/1;
          background-color: #1d2027;
          border: 1px solid rgb(61, 60, 60);
          border-radius: 6px;
          transition: 500ms;

          &:hover {
            transform: translate(0px, -30px);
          }
        }
      }
    }

    .top-nav {
      .header {
        border: none;
        outline: none;

      }

      padding: 5px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 60px;
      width: 100%;

      button {
        border: 1px solid white;
        border-radius: 4px;
        padding: 10px;
        background-color: transparent;
        transition: 400ms;

        &:hover {
          background-color: white;
          color: black;
        }
      }

      .danger {
        border: 1px solid rgb(202, 122, 3);
        border-radius: 4px;
        padding: 10px;
        background-color: transparent;
        transition: 400ms;
        color: rgb(255, 145, 0);

        &:hover {
          background-color: rgb(202, 122, 3);
          color: rgb(248, 245, 245);
        }
      }

      .good {
        border: 1px solid rgb(26, 202, 3);
        border-radius: 4px;
        padding: 10px;
        background-color: transparent;
        transition: 400ms;
        color: rgb(51, 255, 0);

        &:hover {
          background-color: rgb(26, 202, 3);
          color: rgb(248, 245, 245);
        }
      }

      .blue {
        border: 1px solid rgb(3, 156, 202);
        border-radius: 4px;
        padding: 10px;
        background-color: transparent;
        transition: 400ms;
        color: rgb(0, 204, 255);

        &:hover {
          background-color: rgb(3, 156, 202);
          color: rgb(248, 245, 245);
        }
      }
    }

    .main {
      display: flex;
    }

    display: flex;
    flex-direction: column;
    // justify-content: center;
    // align-items: center;
    // border-top: 1px solid white;
    // padding: 20px;
    width: 100%;

    .show {
      padding: 20px;
      overflow: auto;
      width: 100%;
      // display: block;
      height: 100%;
      background-color: transparent;

      table {
        font-family: arial, sans-serif;
        border-collapse: collapse;
        width: 100%;
      }

      td,
      th {
        border: 1px solid #dddddd;
        text-align: left;
        padding: 8px;
      }

      tr:nth-child(even) {
        background-color: #dddddd;
      }

      hr {
        margin: 10px 0px;
      }

      code {
        display: block;
        margin: 10px 0px;
        font-family: Consolas, "courier new";
        background-color: rgb(34, 34, 34);
        width: 100%;
        padding: 8px;
        font-size: 105%;
        border: 1px solid white;
        border-radius: 6px;
      }

      ul {
        list-style-type: disc;
        list-style-position: inside;
      }

      ol {
        list-style-type: decimal;
        list-style-position: inside;
      }

      ul ul,
      ol ul {
        list-style-type: circle;
        list-style-position: inside;
        margin-left: 15px;
      }

      ol ol,
      ul ol {
        list-style-type: lower-latin;
        list-style-position: inside;
        margin-left: 15px;
      }
    }

    .input-container {
      border-left: 1px solid white;
      width: max(10vw, 100%);
      height: calc(100vh - 100px);
      padding: 20px;

      .input {
        resize: none;
        font-family: "Open Sans", system-ui, -apple-system, BlinkMacSystemFont,
          "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans",
          "Helvetica Neue", sans-serif !important;
        overflow: auto;
        width: 100%;
        // width: 35vw;
        font-size: calc(10px * 1.608);
        line-height: calc(16px * 1.608);
        height: 100%;
        background-color: transparent;
        outline: none !important;
        border: none !important;
        // color: black;
      }
    }
  }
}

@media (max-width: 630px) {
  .note-con {
    height: 80vh !important;
    // justify-content: flex-start !important;
  }

  .note-section {
    // background-color: white;
    // width: 90% !important;
    // grid-template-columns: repeat(2, 120px) !important;
    // grid-template-rows: repeat(12, 2fr) !important;
    // grid-template-rows: repeat(5,min(1fr,100px));
  }
}</style>
