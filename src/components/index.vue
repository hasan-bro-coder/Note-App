<template >
    <div>
        <nav>
		<h2 class="logo text-gradient">Bro Notes</h2>
		<div class="btn-container">
			<div class="gradient-border">
				<button class="gradient-btn sign-in"><a href="/new">Sign In</a></button>
			</div>
			<div class="gradient-border-revers">
				<button class="gradient-btn login"><a href="/login">Login</a></button>
			</div>
      <div class="gradient-border-revers">
				<button class="gradient-btn login"><a href="https://github.com/hasan-bro-coder" target="_blank">github</a></button>
			</div>
		</div>
	</nav>
	<main>
		<h1 class="gradient">Bro Notes</h1>
		<p>found none but ,so made one</p>
		<div class="gradient-border">
			<button class="gradient-btn" ><a :href="login ? '/main' : '/new'" style="text-decoration: none;">{{login ? 'Dashboard' : 'Get Started'}}</a></button>
		</div>
	</main>
    </div>
</template>
<script>
import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://tvfskypksxpqwurntbuc.supabase.co";
const supabaseKey = import.meta.env.PUBLIC_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default {
    data() {
        return {
            login: false
        }
    },
    async mounted(){
        try{
	const {data,error} = await supabase.auth.getUser();
	if(!error){
  console.log("logedin")
        this.login = true
	}
}catch(err){
  console.log("not logedin")
}
    }
}
</script>
<style lang="scss">
nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  padding: 0px 10px;
  .btn-container {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
  }
  .gradient-border {
    background: linear-gradient(
      90deg,
      rgba(0, 44, 232, 1) 0%,
      rgba(0, 212, 255, 1) 100%
    );
    border-radius: 6px;
    padding: 1px;
  }
  .gradient-border-revers {
    background: linear-gradient(
      90deg,
      rgba(0, 212, 255, 1) 0%,
      rgba(0, 44, 232, 1) 100%
    );
    border-radius: 6px;
    padding: 1px;
  }
  .gradient-btn {
    a {
      color: white;
      text-decoration: none;
    }
    background-color: #13151a;
    border: none;
    border-radius: 6px;
    transition: 400ms;
    padding: 10px 10px;
    font-family: system-ui, sans-serif;
    font-weight: 600;
    font-size: 13px;
    &:hover {
      background-color: transparent;
    }
  }
  .navbutton {
    height: 40px;
    width: 60px;
    background-color: transparent;
    border: 1px solid white;
    color: white;
    border-radius: 6px;
    transition: 400ms;
    font-family: system-ui, sans-serif;
    font-weight: 600;
    &:hover {
      background-color: white;
      color: black;
    }
  }
}

	main{
		height: 300px;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		.gradient{
			font-size: 72px;
  background:  linear-gradient(90deg, rgba(0,44,232,1) 0%, rgba(0,212,255,1) 100%);
		background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
		}
		.gradient-border{
			background:  linear-gradient(90deg, rgba(0,44,232,1) 0%, rgba(0,212,255,1) 100%);
			margin-bottom: -40px;
			margin-top: 25px;
			border-radius: 6px;
			padding: 1px;
		}
		.gradient-btn{
			// height: 35px;
			// width: 70px;
			background-color: #13151a;
			border: none;
			color: white;
			border-radius: 6px;
			transition: 400ms;
			padding: 10px 20px;
			font-family: system-ui, sans-serif;
			font-weight: 600;
			font-size: 13px;
			// font-family:Verdana, Geneva, Tahoma, sans-serif;
			// font-weight: 500;
			&:hover{
			background-color: transparent;
			// color: black;
			}
		}
		p{
			color: gray;
			font-size: 16px;
		}
	}
</style>