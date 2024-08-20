// function handleCredentialResponse(response) {
//     console.log("Encoded JWT ID token: " + response.credential);
//   }
//   window.onload = function () {
//     google.accounts.id.initialize({
//       client_id: "65896163100-i21sg0hjlmr0rbk0kvolo4b71dj4bp17.apps.googleusercontent.com",
//       callback: handleCredentialResponse
//     });
//     google.accounts.id.renderButton(
//       document.getElementById("buttonDiv"),
//       { theme: "outline", size: "large" }  // customization attributes
//     );
//     google.accounts.id.prompt(); // also display the One Tap dialog
//   }