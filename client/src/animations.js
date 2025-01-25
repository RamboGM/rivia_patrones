document.addEventListener('DOMContentLoaded', function() {
    const logoContainer = document.querySelector('.logo-container');
    const header = document.querySelector('.header');
    const welcomeContainer = document.querySelector('.welcome-container');

    // Verificamos si los elementos existen antes de acceder a ellos
    if (logoContainer) {
        // Animación de subida del logo después de 2 segundos
        setTimeout(() => {
            logoContainer.classList.add('logo-top'); // Inicia el movimiento hacia arriba

            // Mostrar botones de sesión después de que el logo suba
            if (header && welcomeContainer) {
                setTimeout(() => {
                    header.classList.add('visible');
                    welcomeContainer.classList.add('show');
                }, 1500); // Espera la duración de la transición del logo (1.5s)
            }
        }, 2000); // Delay inicial para la animación de entrada del logo
    }
});
