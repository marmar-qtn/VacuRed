function updateSessionStatus() {
    const user = localStorage.getItem('vacured_user');
    const statusEl = document.getElementById('sessionStatus');
    
    if (user) {
        try {
            const userData = JSON.parse(user);
            statusEl.innerHTML = `<span class="text-green-600 font-bold">✓ Sesión Activa</span><br/>Email: ${userData.email}<br/>Nombre: ${userData.nombre || 'No especificado'}`;
        } catch (e) {
            statusEl.textContent = '✗ Error al leer sesión';
        }
    } else {
        statusEl.textContent = '✗ Sin sesión activa';
    }
}

function createTestSession() {
    const testUser = {
        nombre: 'Usuario de Prueba',
        email: 'prueba@vacured.test',
        dni: '12345678',
        logged: true
    };
    localStorage.setItem('vacured_user', JSON.stringify(testUser));
    updateSessionStatus();
    showModal('Sesión Creada', '✓ Se creó una sesión de prueba. Ahora puedes acceder al dashboard.');
}

function clearSession() {
    localStorage.removeItem('vacured_user');
    updateSessionStatus();
    showModal('Sesión Limpiada', '✗ La sesión ha sido eliminada. Ahora debes login/registro.');
}

function showSessionData() {
    const user = localStorage.getItem('vacured_user');
    if (user) {
        try {
            const data = JSON.parse(user);
            showModal('Datos de Sesión', '<pre style="text-align:left; overflow:auto;">' + JSON.stringify(data, null, 2) + '</pre>');
        } catch (e) {
            showModal('Error', 'No se puede leer los datos de sesión');
        }
    } else {
        showModal('Sin Sesión', 'No hay sesión activa');
    }
}

function showModal(title, content) {
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalContent').innerHTML = content;
    document.getElementById('modal').classList.remove('hidden');
    document.getElementById('modal').classList.add('flex');
}

function closeModal() {
    document.getElementById('modal').classList.add('hidden');
    document.getElementById('modal').classList.remove('flex');
}

function toggleCheck(el) {
    const checkbox = el.querySelector('input[type="checkbox"]');
    checkbox.checked = !checkbox.checked;
    el.style.backgroundColor = checkbox.checked ? '#f0f9ff' : '';
}

window.addEventListener('load', updateSessionStatus);
