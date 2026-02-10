const button = document.getElementById("screenInfoButton");

button.addEventListener(
    "click",
    () => {
        const screenWidth = window.screen.width;
        const screenHeight = window.screen.height;
        const availWidth = window.screen.availWidth;
        const availHeight = window.screen.availHeight;
        const innerWidth = window.innerWidth;
        const innerHeight = window.innerHeight;
        const pixelRatio = window.devicePixelRatio;

        const message = 
            `Размеры экрана:\n` +
            `- Ширина: ${screenWidth}px\n` +
            `- Высота: ${screenHeight}px\n\n` +
            `Доступное пространство (без панелей):\n` +
            `- Ширина: ${availWidth}px\n` +
            `- Высота: ${availHeight}px\n\n` +
            `Окно браузера:\n` +
            `- Ширина: ${innerWidth}px\n` +
            `- Высота: ${innerHeight}px\n\n` +
            `Плотность пикселей: ${pixelRatio}x`;
          
        alert(message)
    }
);
