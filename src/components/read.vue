<template >
    {{note}}
    {{id}}
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
            note: {yo:"sdf"},
        }
    },
    async mounted(){
        console.log(this.id)
    const { data, error } = await supabase
         .from("notes")
         .select("*")
         .eq("uid", this.id);
        this.note = JSON.parse(data[0]);
        alert(JSON.stringify(error))
    },
}
</script>
<!-- <style lang="">
    
</style> -->