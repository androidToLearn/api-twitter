const socket = io();

socket.on('updateText', (data) => {
    document.getElementById('myp').innerHTML = `    <p>${data.join('\n')}</p>
`;
});