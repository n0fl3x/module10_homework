// const socket = new WebSocket("wss://echo-ws-service.herokuapp.com");

// Использовал другой. Тот, что указан в материалах модуля не захотел у меня работать.
const socket = new WebSocket("wss://echo.websocket.org");

const messagesEl = document.getElementById("messages");
const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const geoBtn = document.getElementById("geoBtn");


/**
 * Добавляет сообщение в чат.
 * @param {string} text - текст сообщения.
 * @param {"user" | "echo"} type - тип сообщения: user - от пользователя, echo - ответ сервера.
 * @returns {void}
 */
function addMessage(
    text,
    type
) {
    const msgDiv = document.createElement("div");

    msgDiv.className = `message ${type}`;
    msgDiv.textContent = text;
    messagesEl.appendChild(msgDiv);
    messagesEl.scrollTop = messagesEl.scrollHeight
};

/**
 * Обработчик клика по кнопке "отправить".
 * Отправляет сообщение на сервер и отображает его в чате.
 * @returns {void}
 */
sendBtn.addEventListener(
    "click",
    () => {
        const text = messageInput.value.trim();
        if ( !text ) return;
        
        socket.send(text);
        addMessage(
            text,
            "user"
        );
        messageInput.value = ""
    }
);

/**
 * Обработчик нажатия клавиш в поле ввода.
 * Отправляет сообщение по нажатию клавиши Enter (без Shift).
 * @param {KeyboardEvent} event - событие клавиатуры.
 * @returns {void}
 */
messageInput.addEventListener(
    "keydown",
    (event) => {
        if ( event.key === "Enter" && !event.shiftKey ) {
            event.preventDefault();
            sendBtn.click()
        }
    }
);

/**
 * Обработчик входящих сообщений от сервера.
 * @param {MessageEvent} event - событие с данными от сервера.
 * @returns {void}
 */
socket.addEventListener(
    "message",
    (event) => {
        const response = event.data;
        if ( response.startsWith("https://www.openstreetmap.org/") ) return;

        addMessage(
            response,
            "echo"
        )
    }
);

/**
 * Обработчик клика по кнопке "геолокация".
 * Запрашивает координаты и отправляет ссылку на openstreetmap.org.
 * @returns {void}
 */
geoBtn.addEventListener(
    "click",
    () => {
        if ( !navigator.geolocation ) {
            addMessage(
                "Геолокация не поддерживается вашим браузером.",
                "echo"
            );
            return
        };
        
        /**
         * Успешный callback с координатами.
         * @param {GeolocationPosition} position - объект с данными геолокации.
         */
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                // #map=15 - коэффициент приближения карты
                const url = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=15/${lat}/${lng}`;
                socket.send(url);
                
                const link = document.createElement("a");
                link.href = url;
                link.target = "_blank";
                link.textContent = `Ваша геолокация (${lat.toFixed(6)}, ${lng.toFixed(6)})`;
                
                const msgDiv = document.createElement("div");
                msgDiv.className = "message user";
                msgDiv.appendChild(link);
                messagesEl.appendChild(msgDiv);
                messagesEl.scrollTop = messagesEl.scrollHeight
            },
            
            /**
             * Callback ошибки геолокации.
             * @param {GeolocationPositionError} error - объект ошибки.
             */
            (error) => {
                addMessage(
                    `Ошибка геолокации: ${error.message}`,
                    "echo"
                )
            },
    
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            }
        )
    }
);

/**
 * Обработчик события открытия соединения.
 * @param {Event} event - событие открытия.
 * @returns {void}
 */
socket.addEventListener(
    "open",
    () => {
        addMessage(
            "Подключено к эхо‑серверу.",
            "echo"
        )
    }
);

/**
 * Обработчик закрытия соединения.
 * @param {CloseEvent} event - событие закрытия.
 * @returns {void}
 */
socket.addEventListener(
    "close",
    () => {
        addMessage(
            "Соединение закрыто.",
            "echo"
        )
    }
);

/**
 * Обработчик ошибки соединения.
 * @param {Event} event - событие ошибки.
 * @returns {void}
 */
socket.addEventListener(
    "error",
    () => {
        addMessage(
            "Ошибка соединения.",
            "echo"
        )
    }
);
