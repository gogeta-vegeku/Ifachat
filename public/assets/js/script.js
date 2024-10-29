//declaration de variable
const sendPublic = document.querySelector("#sendPublic")
const messagePublic = document.getElementById("messagePublic")
const socket = io();
const query = window.location.search;
const urlSearchParams = new URLSearchParams(query);
const pseudo = urlSearchParams.get("pseudo");
console.log(pseudo);
const pwd = urlSearchParams.get("pwd");
console.log(pwd);

//declaration de function
const displayMessage = (data) => {
    messagePublic.innerHTML += `
    <div class="newMessage">
        <h2>${data.pseudo}</h2>
        <p class="content">${data.messageContent}</p>
        <p class="date">${data.date}</p>
    </div>`
}


tinymce.init({
    selector: '#textPublic',
    plugins: [
        'a11ychecker', 'advlist', 'advcode', 'advtable', 'autolink', 'checklist', 'markdown',
        'lists', 'link', 'image', 'charmap', 'preview', 'anchor', 'searchreplace', 'visualblocks',
        'powerpaste', 'fullscreen', 'formatpainter', 'insertdatetime', 'media', 'table', 'help', 'wordcount'
    ],
    toolbar: 'undo redo | formatpainter casechange blocks | bold italic backcolor | ' +
        'alignleft aligncenter alignright alignjustify | ' +
        'bullist numlist checklist outdent indent | removeformat | a11ycheck code table help'
});
socket.on("init", (data) => {
    console.dir(data);
    socket.emit("sendLog", {
        pseudo: pseudo,
        pwd: pwd
    });
})
sendPublic.addEventListener("click", () => {
    let messageContent = tinyMCE.get("textPublic").getContent();
    let date = new Date();
    //envoi du message public au server
    let data = { pseudo: pseudo, messageContent: messageContent, date: date }
    socket.emit("publicMessage", data);
    displayMessage(data);

})

socket.on("publicMessageGlobal", (data) => {
    console.dir(data);
    displayMessage(data);
})
