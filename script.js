const btn_send = document.querySelector('.main__chat-controls-button-send');
const icon1 = document.querySelector('.main__button-icon1');
const icon2 = document.querySelector('.main__button-icon2');

const message_input = document.querySelector('.main__chat-controls-input');
const output = document.querySelector('.main__chat-messages');
const btn_geo = document.querySelector('.main__button-geo');

function writeToScreen(message, isLeft = false) {
    let chat_message = document.createElement("div");
    chat_message.classList.add('main__chat-message');
    chat_message.classList.add(isLeft ? 'left' : 'right');
    chat_message.innerHTML = message;
    
    output.appendChild(chat_message);
}

const wsUri = "wss://echo-ws-service.herokuapp.com";

let websocket;

document.addEventListener("DOMContentLoaded", (event) => {
    console.log("DOM fully loaded and parsed");

    websocket = new WebSocket(wsUri);

    websocket.onopen = function(e) {
        console.log('websocket connected');
    };

    websocket.onclose = function(e) {
        console.log('websocket disconnected');
    };

    websocket.onmessage = function(e) {
        writeToScreen(e.data, true);
    };

    websocket.onerror = function(e) {
        console.log(`websocket error: ${e.data}`);
    }
});

window.addEventListener("beforeunload", (e) => {
    websocket.close();
    websocket = null;

    const confirmationMessage = "\\o/";
  
    // Gecko + IE
    (e || window.event).returnValue = confirmationMessage;
  
    // Safari, Chrome, and other WebKit-derived browsers
    return confirmationMessage;
});

btn_send.addEventListener('click', () => {
    icon1.classList.toggle('hide');
    icon2.classList.toggle('hide');

    // get screen size
    const width = document.documentElement.clientWidth;
    const height = document.documentElement.clientHeight;
    console.log(`Screen size: width: ${width}, height: ${height}`);

    let message = message_input.value || 'empty';
    writeToScreen(message);
    websocket.send(message);
});

// Функция, срабатывающая при успешном получении геолокации
const success = (position) => {
    console.log('position', position);
    const latitude  = position.coords.latitude;
    const longitude = position.coords.longitude;
    const link = `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`;
    
    writeToScreen(`<a href="${link}">Гео-локация</a>`);
}

// Функция, выводящая текст об ошибке
const error = () => {
    writeToScreen('Невозможно получить ваше местоположение');
}

btn_geo.addEventListener('click', () => {
    if (!navigator.geolocation) {
        writeToScreen('Geolocation не поддерживается вашим браузером');
    } else {
        // Определение местоположения
        navigator.geolocation.getCurrentPosition(success, error);
    }
});