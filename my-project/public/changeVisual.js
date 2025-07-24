const textToSend = "hello there! this is post from api node.js programming";
console.log('send')
fetch('https://api-twitter-7.onrender.com/send-text', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ text: textToSend })
})
    .then(response => response.text())
    .then(data => {
        alert('post sended')
    });
