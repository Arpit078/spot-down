const SearchBar = () =>{
    return(
        /*html*/`
    <style>
    .search-bar {
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        top: 1rem;
        width: 20rem; /* Increased width */
        background-color: #f0f0f0; /* Light grey background for better visibility */
        padding: 0.5rem; /* Added padding */
        border-radius: 10px; /* Rounded corners */
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Slight shadow for depth */
    }

    .search-bar input[type="text"] {
        width: 100%;
        padding: 0.5rem;
        border: none;
        outline: none;
        border-radius: 20px;
        background-color: transparent; /* Makes background blend with the search bar */
        font-size: 1rem;
        margin-right: 0.5rem; /* Space between input and icon */
    }

    .search-bar img {
        width: 1.5rem; /* Adjusted size for better proportion */
        height: 1.5rem;
        cursor: pointer;
    }
    </style>

    <div class="search-bar">
        <input type="text" placeholder="Search">
        <img src="public/icons8-search.svg" alt="">
    </div>

   `
    )
  }
  export default SearchBar