<template lang="">
    <div class="body">
        <nav ref="nav">
            <div class="top" >
                <button class="new" @click="$refs.nav.style.display = 'none'">CLOSE</button>
                <button class="new" @click="md">NEW</button>
            </div>
            <div class="notes">
            </div>
        </nav>
        <main v-if="selected">
            <div class="input-container" style="border-left: none">
                <h1 class="header">BRO</h1>
                <hr>
                <br>
                <textarea class="input" value="" @input="input">
                </textarea>
            </div>
            <div class="input-container" >
                <h1 class="header">Mark down</h1>
                <hr>
                <br>
                <div class="show">
                </div>
            </div>
        </main>
        <main v-else>
            <div class="top-nav">
                <h1 class="logo">Bro Notes</h1>
                <button>New Project</button>
            </div>
        </main>
    </div>
</template>
<script>
import { createClient } from "@supabase/supabase-js";
// import { marked } from "marked"
import markdownit from 'markdown-it'
const marked = markdownit({
    // highlight: (str)=>{console.log(str;},
    linkify: true
})
const supabaseUrl = "https://tvfskypksxpqwurntbuc.supabase.co";
const supabaseKey = import.meta.env.PUBLIC_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);
export default {
    data() {
        return {
            user: {},
            selected: false
        }
    },
    async mounted() {
        const datas = await supabase.auth.getUser();
        let currline
        window.addEventListener("keyup", (e) => {
            if (e.key == "Enter") {
                //     console.log(e)
                //     let input = document.querySelector(".input")
                // let markdown = marked.parse(currline + "\n")
                // console.log(input.innerText, markdown)
                // input.innerHTML += markdown 
            }
        })
    },
    methods: {
        md() {
            // console.log(input.innerText, markdown)
            // input.innerText = markdown
        },
        input() {
            let input = document.querySelector(".input")
            let markdown = marked.render(input.value)
            console.log(markdown,JSON.stringify(input.value))

            document.querySelector(".show").innerHTML = markdown
            // let input = document.querySelector(".input")
            // let markdown = marked.parse(input.innerText)
            // console.log(markdown)
            // input.innerHTML = markdown
        }
    }
}
</script>
<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400&display=swap');

* {
    // outline: 1px green solid;
}
body{
    overflow: hidden;
}
.body {
    display: flex;
    gap: 20px;
    font-family: 'Open Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif !important;

    // justify-content: center;
    // align-items: center;
    nav {
        border-right: 1px solid white;
        width: 20px;
        // opacity: 0;
        height: 100vh;
        overflow: hidden;
        transition: 1s;

        &:hover {
            .top {
                opacity: 1;
            }

            width:max(200px, 20vw);
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
        .top-nav{
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
                &:hover{
                    background-color: white;
                    color:black
                }
            }
        }
        display: flex;
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

            // h1{
            //     font-size: 30px !important;
            // }
            // h2{
            //     font-size: 20px !important;
            // }
            // li{
            //     list-style:circle;
            // }
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
            width: clamp(10vw,100%,50vw);
            height: calc(100vh);
            padding: 20px;

            .input {
    font-family: 'Open Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif !important;
                overflow: auto;
                width: 100%;
                // width: 35vw;
                font-size: calc(10px*1.608);
                line-height: calc(16px*1.608);
                height: 100%;
                background-color: transparent;
                outline: none !important;
                border: none !important;
                // color: black;
            }
        }
    }
}</style>