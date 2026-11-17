function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember').checked;

    if (email && password) {
        localStorage.setItem('vacured_user', JSON.stringify({
            email: email,
            logged: true,
            remember: remember
        }));
        
        showToast('¡Bienvenido! Redirigiendo al dashboard...');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }
}

function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    toastMessage.textContent = message;
    toast.classList.remove('hidden');
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
}

window.addEventListener('load', () => {
    const user = localStorage.getItem('vacured_user');
    if (user) {
        window.location.href = 'index.html';
    }
});
