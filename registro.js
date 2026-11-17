function handleRegistro(event) {
    event.preventDefault();
    
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const dni = document.getElementById('dni').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const terms = document.getElementById('terms').checked;

    if (!terms) {
        showToast('Debes aceptar los términos de uso');
        return;
    }

    if (password !== confirmPassword) {
        showToast('Las contraseñas no coinciden');
        return;
    }

    if (password.length < 8) {
        showToast('La contraseña debe tener al menos 8 caracteres');
        return;
    }

    localStorage.setItem('vacured_user', JSON.stringify({
        nombre: nombre,
        email: email,
        dni: dni,
        logged: true
    }));
    
    showToast('¡Cuenta creada exitosamente! Redirigiendo...');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
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
