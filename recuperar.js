let currentEmail = '';
let currentCode = '';

function handlePaso1(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    
    currentEmail = email;
    currentCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    console.log('Código enviado a', email, ':', currentCode);
    
    document.getElementById('paso1').classList.add('hidden');
    document.getElementById('paso2').classList.remove('hidden');
    document.getElementById('emailMostrado').textContent = email;
    
    showToast('Código enviado a ' + email);
}

function handlePaso2(event) {
    event.preventDefault();
    const codigo = document.getElementById('codigo').value;
    
    if (codigo === currentCode) {
        document.getElementById('paso2').classList.add('hidden');
        document.getElementById('paso3').classList.remove('hidden');
        showToast('Código verificado correctamente');
    } else {
        showToast('El código ingresado es incorrecto');
    }
}

function handlePaso3(event) {
    event.preventDefault();
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (newPassword !== confirmPassword) {
        showToast('Las contraseñas no coinciden');
        return;
    }

    if (newPassword.length < 8) {
        showToast('La contraseña debe tener al menos 8 caracteres');
        return;
    }

    document.getElementById('paso3').classList.add('hidden');
    document.getElementById('paso4').classList.remove('hidden');
    showToast('¡Contraseña actualizada exitosamente!');
}

function resendCode() {
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    currentCode = newCode;
    console.log('Nuevo código enviado:', newCode);
    showToast('Se ha reenviado el código a ' + currentEmail);
}

function volverPaso1() {
    document.getElementById('paso2').classList.add('hidden');
    document.getElementById('paso1').classList.remove('hidden');
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
