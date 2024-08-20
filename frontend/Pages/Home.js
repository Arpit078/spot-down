
//use inline html vs code extension to write html like these in template strings. Don't forget write /*html*/ or /*css*/
//before template string after installing inline html extention.
import Navbar from "../components/Navbar/Navbar.js"
const Home = /*html*/ `
<style>
    .login-box{
        color: aliceblue;
    }
</style>
<div class="background">
    <div class="login-box">
    </div>
</div>
`;
export default Home;
