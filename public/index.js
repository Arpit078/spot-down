// Get references to the input element and the button
const input = document.getElementById('myInput');
const button = document.getElementById('myButton');
const heading = document.getElementById('heading')

// Add an event listener to the button
button.addEventListener('click', () => {
  // Retrieve the input value
  const playlistID= input.value.replace('https://open.spotify.com/playlist/', '').split('?si=')[0]
  console.log(playlistID)
  window.location = `${playlistID}`;
  heading.innerText = "wait while the playlist is being downloaded. refresh to download another playlist"
  button.style.display = "none"
  input.style.display = "none"
});
