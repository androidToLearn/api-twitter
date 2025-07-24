let myText = ''
let div = document.getElementById('myp')
setInterval(() => {
    fetch('/getText').then(response => response.json()).then(data => {
        if (data.text !== myText) {
            myText = data.text
            let p = document.createElement('p')
            p.innerText = myText;
            p.style.fontSize = '20px'
            div.appendChild(p)
        }
    })
}, 300)