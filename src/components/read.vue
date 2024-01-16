<template >
   <div class="md-con">
    <main>
      <div class="gradient-border-bottom">
        <div class="top">
          <h1>{{data[0].name || "title"}}</h1>
          <div>
            <h2>{{data[0].username || "unknown"}} </h2>
            <h6>{{data[0].created_at.split("T")[0].replaceAll("-", "/") || new Date().toLocaleDateString()}}</h6>
          </div>
        </div>
      </div>
      <!-- <br /> -->
      <!-- <hr /> -->
      <br />
      <div class="gradient-border">
        <div class="data" v-html="html" ></div>
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
export default {
    props: ['id'],
    data() {
        return {
            data: [{name: "", username: "", data: "", created_at: "", uid: ""}],
            html: "Loading"
        }
    },
    async mounted(){
const { data, error } = await supabase
  .from("notes")
  .select("*")
  .eq("uid", this.id)
  .eq("privet", false);
  console.log(data)
  if (error) {
    alert("Error fetchig data"+JSON.stringify(error))
    location.pathname = "/404";
  }
  if (data.length == 0) {
      location.pathname = "/404";
    }
    this.data = data
    this.html = marked.render(data[0].data)
},
}
</script>
<style lang="scss">
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
  .md-con {
    max-width: 100vw;
    display: flex;
    justify-content: center;
    align-items: center;
    main {
      width: 70vw;
      padding: 20px 20px 0px 20px;
      .data {
        background-color: #13151a;
        border-radius: 6px;
        padding: 25px 30px;
        line-height: calc(22px * 1.618);
      }
      .gradient-border {
        // min-height: calc(90vh - 80px);
        background: linear-gradient(
          90deg,
          rgba(97, 0, 232, 1) 0%,
          rgba(209, 0, 255, 1) 100%
        );
        border-radius: 6px;
        padding: 1px;
        margin-top: 10px;
      }
      .gradient-border-bottom {
        background: linear-gradient(
          90deg,
          rgba(97, 0, 232, 1) 0%,
          rgba(209, 0, 255, 1) 100%
        );
        border-radius: 6px;
        padding-bottom: 1px;
        margin-left: 20px;
      }
      .top {
        background-color: #13151a;
        height: 60px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        padding: 0px 5px 20px 5px;
        div {
          display: flex;
          justify-content: flex-end;
          align-items: flex-end;
          flex-direction: column;
          h2 {
            color: gray;
            font-size: 18px;
            font-family:
              system-ui,
              -apple-system,
              BlinkMacSystemFont,
              "Segoe UI",
              Roboto,
              Oxygen,
              Ubuntu,
              Cantarell,
              "Open Sans",
              "Helvetica Neue",
              sans-serif;
          }
          h6 {
            color: gray;
          }
        }
      }
    }
  }
</style> 