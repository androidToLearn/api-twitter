const textToSend = "hello there! this is post from api node.js programming";
console.log('send')
fetch('http://localhost:3000/send-text', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ text: textToSend })
})
    .then(response => response.text())
    .then(data => {
        console.log('תגובה מהשרת:', data);
    });
