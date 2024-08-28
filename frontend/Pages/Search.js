
import Navbar from "../components/Navbar/Navbar.js"
import SearchBar from "../components/SearchBar/SearchBar.js"
import songCards from "../components/SongCards/songCards.js"
let Projects = /*html*/`
    <div class="background">
        ${SearchBar()}
        ${songCards("arpit","arpit","")}
        ${songCards("arpit","loremasdasd adasdad d dasd asf asf fasd f","")}
        ${songCards("arpit","arpit","")}
        ${songCards("arpit","arpit","")}

    </div>
`

export default Projects