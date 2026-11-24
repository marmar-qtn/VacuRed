/* =====================================================
   VACURED · SCRIPT GENERAL Y DE NAVEGACIÓN
   ===================================================== */

let timer; 

function toast(t) { 
    let e = document.getElementById('toast'); 
    if (!e) return;
    e.textContent = t; 
    e.classList.add('show'); 
    clearTimeout(timer); 
    timer = setTimeout(() => e.classList.remove('show'), 2500); 
}

function logout() {
    localStorage.removeItem('vacured_user');
    toast('Sesión cerrada. Redirigiendo...');
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 1500);
}

function go(p) {
    if (p === 'Carnet familiar') {
        window.location.href = 'carnet.html';
        return;
    }

    if (p === 'Vacunatorios') {
        window.location.href = 'vacunatorios.html';
        return;
    }

    if (p === 'Turnos') {
        window.location.href = 'turnos.html';
        return;
    }

    if (p === 'Mi cuenta') {
        window.location.href = 'mi-cuenta.html';
        return;
    }

    if (p === 'Inicio') {
        window.location.href = 'index.html';
        return;
    }

    document.querySelectorAll('.nav button').forEach(b => {
        b.classList.toggle('active', b.dataset.page === p);
    });

    let crumb = document.querySelector('.crumb b');
    if (crumb) crumb.textContent = p;

    toast('Vista seleccionada: ' + p + ' · Navegación de prototipo');
}

function modal(t, d, f) { 
    const mtitle = document.getElementById('mtitle');
    const mdesc = document.getElementById('mdesc');
    const mfields = document.getElementById('mfields');
    const modalBg = document.getElementById('modal');

    if (mtitle) mtitle.textContent = t; 
    if (mdesc) mdesc.textContent = d; 
    if (mfields) mfields.innerHTML = f; 
    if (modalBg) modalBg.classList.add('open'); 
}

function closeModal() { 
    const modalBg = document.getElementById('modal');
    if (modalBg) modalBg.classList.remove('open'); 
}

function searchModal() { 
    modal('Buscar en VacuRed', 'Buscá vacunas, centros de salud o información.', '<label>¿Qué necesitás encontrar?</label><input placeholder="Ej. vacuna antigripal, vacunatorio...">'); 
}

function locationModal() { 
    modal('Cambiar ubicación', 'Elegí una zona para adaptar la búsqueda de vacunatorios.', '<label>Provincia</label><select><option>Buenos Aires</option><option>Ciudad Autónoma de Buenos Aires</option><option>Córdoba</option><option>Santa Fe</option></select><label>Municipio / localidad</label><input value="San Justo, La Matanza">'); 
}

function submitModal() { 
    let v = document.querySelector('#mfields input')?.value || document.querySelector('#mfields select')?.value || 'Tu búsqueda'; 
    closeModal(); 
    toast('Selección: ' + v + ' · Acción de demostración'); 
}

document.querySelectorAll('.nav button').forEach(b => {
    b.addEventListener('click', () => {
        if(b.dataset.page) go(b.dataset.page);
    });
});

const modalBgEl = document.getElementById('modal');
if (modalBgEl) {
    modalBgEl.addEventListener('click', e => { 
        if (e.target.id === 'modal') closeModal(); 
    });
}

document.addEventListener('keydown', e => { 
    if (e.key === 'Escape') {
        closeModal();
        closeBookingModal();
        closeAppointmentDetail();
        closeAddVaccineModal();
        closeVaccineDetail();
        closeMobileMenu();
    }
});


/* =====================================================
   VACURED · VACUNATORIOS
   ===================================================== */

const clinics = [
  {
    id: 1,
    name: 'Centro de Salud Familiar Norte',
    type: 'health',
    category: 'Centro de salud',
    address: 'Av. Principal 1250 · San Justo',
    hours: 'A confirmar con el establecimiento',
    phone: 'Consultar establecimiento',
    services: ['Vacunación infantil', 'Adultos', 'Calendario nacional'],
    searchable: 'centro de salud familiar norte san justo avenida principal',
    query: 'Centro de Salud Familiar Norte, San Justo, La Matanza'
  },
  {
    id: 2,
    name: 'Hospital General Metropolitano',
    type: 'public',
    category: 'Hospital público',
    address: 'Calle Central 840 · Ramos Mejía',
    hours: 'A confirmar con el establecimiento',
    phone: 'Consultar establecimiento',
    services: ['Vacunación infantil', 'Adultos', 'Calendario nacional'],
    searchable: 'hospital general metropolitano ramos mejia calle central',
    query: 'Hospital General Metropolitano, Ramos Mejía, La Matanza'
  },
  {
    id: 3,
    name: 'Centro Integral de Salud',
    type: 'private',
    category: 'Centro privado',
    address: 'Av. Rivadavia 15200 · Ramos Mejía',
    hours: 'A confirmar con el establecimiento',
    phone: 'Consultar establecimiento',
    services: ['Vacunación adultos', 'Calendario nacional'],
    searchable: 'centro integral salud privado ramos mejia rivadavia',
    query: 'Centro Integral de Salud, Ramos Mejía, La Matanza'
  }
];

let selectedClinic = 1;

function filterClinics() {
  const searchInput = document.getElementById('clinicSearch');
  if (!searchInput) return;

  const search = searchInput.value.toLowerCase().trim();
  const type = document.getElementById('clinicType').value;
  const service = document.getElementById('clinicService').value;

  let visible = 0;

  clinics.forEach(clinic => {
    const card = document.querySelector(`[data-clinic="${clinic.id}"]`);
    if(!card) return;

    const matchesSearch =
      clinic.name.toLowerCase().includes(search) ||
      clinic.address.toLowerCase().includes(search) ||
      clinic.searchable.includes(search);

    const matchesType = (type === 'all' || clinic.type === type);
    let matchesService = true;

    if (service === 'child') matchesService = clinic.services.includes('Vacunación infantil');
    if (service === 'adult') matchesService = clinic.services.includes('Vacunación adultos');
    if (service === 'calendar') matchesService = clinic.services.includes('Calendario nacional');

    const show = matchesSearch && matchesType && matchesService;
    card.style.display = show ? 'block' : 'none';
    if (show) visible++;
  });

  const resCount = document.getElementById('resultsCount');
  if (resCount) {
      resCount.textContent = visible + (visible === 1 ? ' establecimiento de ejemplo' : ' establecimientos de ejemplo');
  }

  const clinicEmpty = document.getElementById('clinicEmpty');
  const clinicDetail = document.getElementById('clinicDetail');

  if (clinicEmpty) clinicEmpty.style.display = visible === 0 ? 'block' : 'none';

  if (visible === 0) {
    if (clinicDetail) clinicDetail.style.display = 'none';
  } else {
    if (clinicDetail) clinicDetail.style.display = 'block';
    const selectedCard = document.querySelector(`[data-clinic="${selectedClinic}"]`);

    if (!selectedCard || selectedCard.style.display === 'none') {
      const firstVisible = clinics.find(clinic => {
        const card = document.querySelector(`[data-clinic="${clinic.id}"]`);
        return card && card.style.display !== 'none';
      });
      if (firstVisible) selectClinic(firstVisible.id);
    }
  }
}

function sortClinics() {
  const sortEl = document.getElementById('clinicSort');
  const container = document.getElementById('clinicList');
  if (!sortEl || !container) return;

  const order = sortEl.value;
  const cards = [...container.querySelectorAll('.clinic-card')];

  if (order === 'name') {
    cards.sort((a, b) => {
      const nameA = a.querySelector('h4').textContent;
      const nameB = b.querySelector('h4').textContent;
      return nameA.localeCompare(nameB);
    });
  } else {
    cards.sort((a, b) => Number(a.dataset.clinic) - Number(b.dataset.clinic));
  }

  cards.forEach(card => container.appendChild(card));
}

function selectClinic(id) {
  const clinic = clinics.find(c => c.id === id);
  if (!clinic) return;

  selectedClinic = id;

  document.querySelectorAll('.clinic-card').forEach(card => {
    card.classList.toggle('selected', Number(card.dataset.clinic) === id);
  });

  document.querySelectorAll('.map-pin').forEach(pin => {
    pin.classList.remove('active');
  });

  const pin = document.querySelector(`.pin-${id === 1 ? 'one' : id === 2 ? 'two' : 'three'}`);
  if (pin) pin.classList.add('active');

  const dName = document.getElementById('detailName');
  const dAddress = document.getElementById('detailAddress');
  const dHours = document.getElementById('detailHours');
  const dServices = document.getElementById('detailServices');
  const dPhone = document.getElementById('detailPhone');

  if (dName) dName.textContent = clinic.name;
  if (dAddress) dAddress.textContent = clinic.address;
  if (dHours) dHours.textContent = clinic.hours;
  if (dServices) dServices.textContent = clinic.services.join(' · ');
  if (dPhone) dPhone.textContent = clinic.phone;
}

function clearClinicFilters() {
  const cSearch = document.getElementById('clinicSearch');
  const cType = document.getElementById('clinicType');
  const cService = document.getElementById('clinicService');

  if (cSearch) cSearch.value = '';
  if (cType) cType.value = 'all';
  if (cService) cService.value = 'all';

  filterClinics();
  toast('Filtros restablecidos');
}

function openClinicDirections() {
  const clinic = clinics.find(c => c.id === selectedClinic);
  if (!clinic) return;
  const url = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(clinic.query);
  window.open(url, '_blank', 'noopener,noreferrer');
}

function requestClinicAppointment() {
  const clinic = clinics.find(c => c.id === selectedClinic);
  if (!clinic) return;
  toast('Centro seleccionado: ' + clinic.name + ' · Próximamente podrás gestionar tu turno.');
}


/* =========================================================
   VACURED · TURNOS (Sincronizado e interactivo)
   ========================================================= */

let appointments = [
    {
        id: 1,
        vaccine: "Vacunación antigripal",
        member: "María Quintana",
        service: "Dosis anual",
        center: "Centro de Salud San Justo",
        address: "Av. Brig. Gral. Juan Manuel de Rosas 3500",
        date: "2026-11-18",
        time: "10:30",
        status: "Confirmado"
    },
    {
        id: 2,
        vaccine: "Triple bacteriana",
        member: "Tomás",
        service: "Dosis de refuerzo",
        center: "Hospital Italiano de San Justo",
        address: "Av. Presidente Perón 2231",
        date: "2026-11-25",
        time: "09:00",
        status: "Pendiente"
    },
    {
        id: 3,
        vaccine: "Hepatitis B",
        member: "María Quintana",
        service: "Segunda dosis",
        center: "Centro de Salud San Justo",
        address: "Av. Brig. Gral. Juan Manuel de Rosas 3500",
        date: "2026-03-12",
        time: "11:00",
        status: "Realizado"
    },
    {
        id: 4,
        vaccine: "Triple viral",
        member: "Ana",
        service: "Dosis registrada",
        center: "Vacunatorio Municipal",
        address: "San Justo",
        date: "2026-02-20",
        time: "14:00",
        status: "Realizado"
    },
    {
        id: 5,
        vaccine: "Antigripal",
        member: "Tomás",
        service: "Dosis anual",
        center: "Centro de Salud San Justo",
        address: "San Justo",
        date: "2026-01-15",
        time: "10:00",
        status: "Realizado"
    }
];

function formatAppointmentDate(dateStr) {
    if (!dateStr) return { formatted: "", day: "", monthName: "", year: "" };
    const parts = dateStr.split("-");
    if (parts.length !== 3) return { formatted: dateStr, day: "", monthName: "", year: "" };
    
    const [year, month, day] = parts;
    const monthsNames = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];
    const monthName = monthsNames[parseInt(month, 10) - 1] || month;
    
    return { 
        formatted: `${day}/${month}/${year}`, 
        day, 
        monthName, 
        year 
    };
}

function getAppointmentStatusClass(status) {
    const classes = {
        "Confirmado": "confirmed",
        "Pendiente": "pending",
        "Realizado": "completed",
        "Cancelado": "cancelled"
    };
    return classes[status] || "";
}

/* Función auxiliar para renderizar los badges con clases de Tailwind */
function getStatusBadge(status) {
    const styles = {
        "Confirmado": "bg-vs text-violetbrand border border-violetbrand/40",
        "Pendiente":  "bg-rs text-redbrand border border-redbrand/40",
        "Realizado":  "bg-bs text-bluebrand border border-bluebrand/40",
        "Cancelado":  "bg-slate-100 text-muted border border-line"
    };
    const style = styles[status] || "bg-slate-100 text-muted border border-line";
    return `<span class="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${style}">${status}</span>`;
}

/* Función auxiliar para asignar el fondo y borde sutil a toda la tarjeta */
/* Degradado horizontal: de blanco limpio (izq) hacia un tinte pastel sutil (der) */
function getCardStyles(status) {
    const styles = {
        "Confirmado": "bg-gradient-to-r from-white via-white to-[#f5f1fc] border-line hover:border-violetbrand/40",
        "Realizado":  "bg-gradient-to-r from-white via-white to-[#f0f6fa] border-line hover:border-bluebrand/40",
        "Pendiente":  "bg-gradient-to-r from-white via-white to-[#fff2f3] border-line hover:border-redbrand/40",
        "Cancelado":  "bg-slate-50 border-line/60 opacity-65"
    };
    return styles[status] || "bg-white border-line hover:border-[#c6b9e9]";
}

function renderAppointments() {
    const list = document.getElementById("appointmentList");
    if (!list) return;

    const searchInput = document.getElementById("appointmentSearch");
    const memberSelect = document.getElementById("appointmentMember");
    const statusSelect = document.getElementById("appointmentStatus");

    const search = searchInput ? searchInput.value.toLowerCase() : "";
    const member = memberSelect ? memberSelect.value : "todos";
    const status = statusSelect ? statusSelect.value : "todos";

    const filtered = appointments.filter(a => {
        const matchesSearch = a.vaccine.toLowerCase().includes(search) || a.center.toLowerCase().includes(search);
        const matchesMember = (member === "todos" || a.member === member);
        const matchesStatus = (status === "todos" || a.status === status);
        return matchesSearch && matchesMember && matchesStatus;
    });

    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

    list.innerHTML = filtered.map(a => {
        const dateObj = formatAppointmentDate(a.date);
        const cardStyle = getCardStyles(a.status);

        return `
            <article class="${cardStyle} border rounded-xl p-4 sm:p-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition shadow-xs">
                <!-- Icono + Información Principal -->
                <div class="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
                    <div class="w-10 h-10 rounded-xl bg-white text-violetbrand grid place-items-center flex-shrink-0 shadow-xs">
                        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m18 2 4 4"/><path d="m17 7 3-3"/><path d="M19 9 8.5 19.5a2.1 2.1 0 0 1-3 0l-1-1a2.1 2.1 0 0 1 0-3L15 5"/><path d="m9 11 4 4"/><path d="m5 19-3 3"/><path d="m14 4 6 6"/></svg>
                    </div>
                    <div class="min-w-0 space-y-0.5">
                        <h4 class="text-sm sm:text-base font-bold text-ink leading-snug">${a.vaccine}</h4>
                        <p class="text-xs text-muted font-medium">${a.member} · <span class="text-ink/80">${a.service}</span></p>
                        <p class="text-xs text-muted flex items-center gap-1 truncate">
                            <span class="text-violetbrand shrink-0"><svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s-6.5-5.7-6.5-11a6.5 6.5 0 0 1 13 0c0 5.3-6.5 11-6.5 11Z"/><circle cx="12" cy="10" r="2.5"/></svg></span> ${a.center}
                        </p>
                    </div>
                </div>

                <!-- Fecha, Estado y Botón de Opciones -->
                <div class="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 border-line/60 pt-3 sm:pt-0">
                    <!-- Fecha y Hora -->
                    <div class="text-left sm:text-right min-w-[100px]">
                        <strong class="block text-xs sm:text-sm font-bold text-ink">${dateObj.formatted}</strong>
                        <span class="block text-xs text-muted font-medium">${a.time} hs</span>
                    </div>

                    <!-- Estado Badge -->
                    <div>
                        ${getStatusBadge(a.status)}
                    </div>

                    <!-- Botón de Opciones -->
                    <button class="w-8 h-8 rounded-lg border border-line/80 bg-white/90 text-muted hover:bg-white hover:text-violetbrand transition grid place-items-center text-base cursor-pointer" onclick="showAppointmentDetail(${a.id})" aria-label="Ver detalles" title="Ver detalles">
                        ⋯
                    </button>
                </div>
            </article>
        `;
    }).join("");

    const emptyState = document.getElementById("appointmentEmpty");
    if (emptyState) {
        emptyState.style.display = filtered.length ? "none" : "block";
    }

    updateAppointmentStats();
    renderNextAppointmentFeatured();
}

function showAppointmentDetail(id) {
    const a = appointments.find(item => item.id === id);
    if (!a) return;

    const dateInfo = formatAppointmentDate(a.date);
    const detailContent = document.getElementById("appointmentDetailContent");
    
    if (detailContent) {
        detailContent.innerHTML = `
            <div class="space-y-3 pt-1">
                <div class="flex items-center justify-between border-b border-line pb-3">
                    <h4 class="text-base font-bold text-ink">${a.vaccine}</h4>
                    ${getStatusBadge(a.status)}
                </div>
                <div class="space-y-2 text-xs">
                    <div class="flex justify-between py-1 border-b border-line/50"><span class="text-muted">Integrante:</span><strong class="text-ink">${a.member}</strong></div>
                    <div class="flex justify-between py-1 border-b border-line/50"><span class="text-muted">Servicio:</span><strong class="text-ink">${a.service}</strong></div>
                    <div class="flex justify-between py-1 border-b border-line/50"><span class="text-muted">Vacunatorio:</span><strong class="text-ink">${a.center}</strong></div>
                    <div class="flex justify-between py-1 border-b border-line/50"><span class="text-muted">Dirección:</span><strong class="text-ink">${a.address}</strong></div>
                    <div class="flex justify-between py-1"><span class="text-muted">Fecha y horario:</span><strong class="text-ink">${dateInfo.formatted} · ${a.time} hs</strong></div>
                </div>
            </div>
        `;
    }

    const detailModal = document.getElementById("appointmentDetailModal");
    if (detailModal) detailModal.classList.add("open");
}

function renderNextAppointmentFeatured() {
    const container = document.getElementById("nextAppointmentContainer");
    if (!container) return;

    const nextAppt = appointments.find(a => ["Confirmado", "Pendiente"].includes(a.status));

    if (!nextAppt) {
        container.style.display = "none";
        return;
    }

    container.style.display = "flex";
    const dateInfo = formatAppointmentDate(nextAppt.date);

    const dayEl = document.getElementById("nextDayLabel");
    const monEl = document.getElementById("nextMonthLabel");
    const yrEl = document.getElementById("nextYearLabel");

    if (dayEl) dayEl.textContent = dateInfo.day || "18";
    if (monEl) monEl.textContent = dateInfo.monthName || "NOV";
    if (yrEl) yrEl.textContent = dateInfo.year || "2026";

    const contentDiv = document.getElementById("nextAppointmentContent");
    if (contentDiv) {
        contentDiv.innerHTML = `
            <div class="flex items-center justify-between gap-3 flex-wrap w-full">
                <div class="inline-flex items-center gap-2 bg-white/95 border border-violetbrand/30 rounded-full px-3 py-1 text-[10px] font-extrabold text-violetbrand shadow-xs">
                    <span class="w-2 h-2 rounded-full bg-violetbrand animate-pulse"></span>
                    PRÓXIMO TURNO (${nextAppt.status.toUpperCase()})
                </div>
            </div>

            <div>
                <h2 class="text-xl sm:text-2xl font-extrabold text-ink tracking-tight mt-2 mb-1">${nextAppt.vaccine}</h2>
                <!-- Subtítulo en tono slate-700 para alto contraste sobre fondo verde -->
                <p class="text-xs text-slate-700 font-semibold flex items-center gap-1.5">
                    ${nextAppt.member} · ${nextAppt.service}
                </p>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
                <!-- Bloques blancos traslúcidos con texto slate-500 -->
                <div class="bg-white/90 backdrop-blur-xs border border-line/80 rounded-xl p-3 space-y-0.5 shadow-2xs">
                    <small class="block text-[9px] text-slate-500 font-extrabold tracking-wider uppercase">FECHA</small>
                    <strong class="block text-xs font-bold text-ink">${dateInfo.formatted}</strong>
                </div>

                <div class="bg-white/90 backdrop-blur-xs border border-line/80 rounded-xl p-3 space-y-0.5 shadow-2xs">
                    <small class="block text-[9px] text-slate-500 font-extrabold tracking-wider uppercase">HORARIO</small>
                    <strong class="block text-xs font-bold text-ink">${nextAppt.time} hs</strong>
                </div>

                <div class="bg-white/90 backdrop-blur-xs border border-line/80 rounded-xl p-3 space-y-0.5 shadow-2xs">
                    <small class="block text-[9px] text-slate-500 font-extrabold tracking-wider uppercase">LUGAR</small>
                    <strong class="block text-xs font-bold text-ink">${nextAppt.center}</strong>
                </div>
            </div>

            <div class="flex items-center gap-3 pt-3 flex-wrap">
                <button class="bg-ink text-white rounded-lg px-4 py-2.5 text-xs font-bold hover:bg-slate-800 transition shadow-xs cursor-pointer" onclick="showAppointmentDetail(${nextAppt.id})">
                    Ver detalles
                </button>
                <button class="text-redbrand text-xs font-bold hover:underline bg-transparent border-0 p-2 cursor-pointer ml-auto" onclick="cancelAppointment(${nextAppt.id})">
                    Cancelar turno
                </button>
            </div>
        `;
    }
}

function filterAppointments() {
    renderAppointments();
}

function updateAppointmentStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcoming = appointments.filter(a =>
        ["Confirmado", "Pendiente"].includes(a.status) &&
        new Date(a.date + "T00:00:00") >= today
    ).length;

    const completed = appointments.filter(a => a.status === "Realizado").length;
    const pending = appointments.filter(a => a.status === "Pendiente").length;

    const upEl = document.getElementById("upcomingCount");
    const compEl = document.getElementById("completedCount");
    const pendEl = document.getElementById("pendingCount");

    if (upEl) upEl.textContent = upcoming;
    if (compEl) compEl.textContent = completed;
    if (pendEl) pendEl.textContent = pending;
}

if (document.getElementById("appointmentList")) {
    renderAppointments();
}

function closeAppointmentDetail() {
    const detailModal = document.getElementById("appointmentDetailModal");
    if (detailModal) detailModal.classList.remove("open");
}

function cancelAppointment(id) {
    const a = appointments.find(item => item.id === id);
    if (!a || a.status === "Cancelado" || a.status === "Realizado") {
        toast("Este turno no se puede cancelar.");
        return;
    }

    const confirmed = confirm(`¿Querés cancelar el turno de ${a.member} para ${a.vaccine}?`);
    if (!confirmed) return;

    a.status = "Cancelado";
    renderAppointments();
    toast("El turno fue cancelado correctamente.");
}

// Flujo por pasos para solicitar turnos
let bookingStep = 1;
let bookingData = { member: "", center: "", vaccine: "", service: "", date: "", time: "" };

function openBookingModal() {
    bookingStep = 1;
    bookingData = { member: "", center: "", vaccine: "", service: "", date: "", time: "" };
    renderBookingStep();
    const bModal = document.getElementById("bookingModal");
    if (bModal) bModal.classList.add("open");
}

function closeBookingModal() {
    const bModal = document.getElementById("bookingModal");
    if (bModal) bModal.classList.remove("open");
}

function updateBookingSteps() {
    for (let i = 1; i <= 3; i++) {
        const step = document.getElementById("stepIndicator" + i);
        if (step) {
            step.classList.toggle("active", i === bookingStep);
            step.classList.toggle("done", i < bookingStep);
        }
    }
}

function renderBookingStep() {
    updateBookingSteps();
    const content = document.getElementById("bookingContent");
    const title = document.getElementById("bookingTitle");
    const description = document.getElementById("bookingDescription");
    const next = document.getElementById("bookingNext");

    if (!content) return;

    const fieldClass = "w-full h-[42px] px-3 border border-line rounded-lg bg-white text-ink text-xs outline-none focus:border-[#a99be0] focus:ring-2 focus:ring-violetbrand/10 transition";
    const labelClass = "text-[11px] font-bold text-ink mt-1";

    if (bookingStep === 1) {
        if (title) title.textContent = "Seleccioná el servicio";
        if (description) description.textContent = "Indicá para quién es el turno y qué vacunación necesita.";
        content.innerHTML = `
            <div class="grid gap-2">
                <label class="${labelClass}" for="bookingMember">Integrante de la familia</label>
                <select id="bookingMember" class="${fieldClass}">
                    <option value="">Seleccionar integrante</option>
                    <option value="María Quintana">María Quintana</option>
                    <option value="Tomás">Tomás</option>
                    <option value="Ana">Ana</option>
                </select>

                <label class="${labelClass}" for="bookingCenter">Vacunatorio</label>
                <select id="bookingCenter" class="${fieldClass}">
                    <option value="">Seleccionar vacunatorio</option>
                    <option value="Centro de Salud San Justo">Centro de Salud San Justo</option>
                    <option value="Hospital Italiano de San Justo">Hospital Italiano de San Justo</option>
                    <option value="Vacunatorio Municipal">Vacunatorio Municipal</option>
                </select>

                <label class="${labelClass}" for="bookingVaccine">Vacuna</label>
                <select id="bookingVaccine" class="${fieldClass}">
                    <option value="">Seleccionar vacuna</option>
                    <option value="Antigripal">Antigripal</option>
                    <option value="Hepatitis B">Hepatitis B</option>
                    <option value="Triple bacteriana">Triple bacteriana</option>
                    <option value="Triple viral">Triple viral</option>
                    <option value="COVID-19">COVID-19</option>
                    <option value="Otra vacuna">Otra vacuna</option>
                </select>

                <label class="${labelClass}" for="bookingService">Tipo de servicio</label>
                <select id="bookingService" class="${fieldClass}">
                    <option value="">Seleccionar servicio</option>
                    <option value="Primera dosis">Primera dosis</option>
                    <option value="Segunda dosis">Segunda dosis</option>
                    <option value="Dosis de refuerzo">Dosis de refuerzo</option>
                    <option value="Dosis anual">Dosis anual</option>
                </select>
            </div>
        `;
        if (next) next.textContent = "Continuar →";
    }

    if (bookingStep === 2) {
        if (title) title.textContent = "Elegí fecha y horario";
        if (description) description.textContent = "Seleccioná una fecha y un horario para tu visita.";
        content.innerHTML = `
            <div class="grid gap-2">
                <div class="grid gap-1 p-3.5 rounded-xl bg-bs border border-bluebrand/20 mb-1">
                    <span class="text-bluebrand text-[9px] font-extrabold tracking-wider uppercase">VACUNATORIO SELECCIONADO</span>
                    <strong class="text-xs font-bold text-ink">${bookingData.center}</strong>
                    <small class="text-[11px] text-muted">${bookingData.vaccine} · ${bookingData.member}</small>
                </div>

                <label class="${labelClass}" for="bookingDate">Fecha del turno</label>
                <input type="date" id="bookingDate" value="${bookingData.date}" class="${fieldClass}">

                <label class="${labelClass}" for="bookingTime">Horario disponible</label>
                <select id="bookingTime" class="${fieldClass}">
                    <option value="">Seleccionar horario</option>
                    <option value="09:00">09:00 hs</option>
                    <option value="09:30">09:30 hs</option>
                    <option value="10:00">10:00 hs</option>
                    <option value="10:30">10:30 hs</option>
                    <option value="11:00">11:00 hs</option>
                    <option value="11:30">11:30 hs</option>
                    <option value="14:00">14:00 hs</option>
                    <option value="14:30">14:30 hs</option>
                    <option value="15:00">15:00 hs</option>
                </select>

                <p class="text-[11px] leading-relaxed text-muted bg-bglight border border-[#e9eef4] rounded-xl p-3 mt-2">
                    Los horarios disponibles son ilustrativos y forman parte de la demostración del prototipo.
                </p>
            </div>
        `;
        const bDate = document.getElementById("bookingDate");
        const bTime = document.getElementById("bookingTime");
        if (bDate) bDate.value = bookingData.date;
        if (bTime) bTime.value = bookingData.time;
        if (next) next.textContent = "Revisar turno →";
    }

    if (bookingStep === 3) {
        if (title) title.textContent = "Confirmá tu turno";
        if (description) description.textContent = "Revisá que todos los datos sean correctos antes de finalizar.";
        const dateInfo = formatAppointmentDate(bookingData.date);
        content.innerHTML = `
            <div class="text-center">
                <div class="w-11 h-11 grid place-items-center rounded-2xl bg-vs text-violetbrand mx-auto mb-3"><svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="m8.5 12.3 2.4 2.4 4.6-5"/></svg></div>
                <h4 class="text-sm font-bold text-ink mb-4">Resumen de la reserva</h4>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-[1px] bg-line border border-line rounded-xl overflow-hidden text-left">
                    <div class="bg-white p-3 flex flex-col gap-1"><small class="text-muted text-[10px] font-semibold">Integrante</small><strong class="text-ink text-xs font-bold">${bookingData.member}</strong></div>
                    <div class="bg-white p-3 flex flex-col gap-1"><small class="text-muted text-[10px] font-semibold">Vacunatorio</small><strong class="text-ink text-xs font-bold">${bookingData.center}</strong></div>
                    <div class="bg-white p-3 flex flex-col gap-1"><small class="text-muted text-[10px] font-semibold">Vacuna</small><strong class="text-ink text-xs font-bold">${bookingData.vaccine}</strong></div>
                    <div class="bg-white p-3 flex flex-col gap-1"><small class="text-muted text-[10px] font-semibold">Servicio</small><strong class="text-ink text-xs font-bold">${bookingData.service}</strong></div>
                    <div class="bg-white p-3 flex flex-col gap-1"><small class="text-muted text-[10px] font-semibold">Fecha</small><strong class="text-ink text-xs font-bold">${dateInfo.formatted || bookingData.date}</strong></div>
                    <div class="bg-white p-3 flex flex-col gap-1"><small class="text-muted text-[10px] font-semibold">Horario</small><strong class="text-ink text-xs font-bold">${bookingData.time} hs</strong></div>
                </div>
                <p class="text-[11px] leading-relaxed text-muted bg-bglight border border-[#e9eef4] rounded-xl p-3 mt-3 text-left">
                    Al confirmar, el turno quedará registrado en tu lista de turnos como pendiente de confirmación.
                </p>
            </div>
        `;
        if (next) next.textContent = "Confirmar turno";
    }
}

function nextBookingStep() {
    if (bookingStep === 1) {
        const m = document.getElementById("bookingMember");
        const c = document.getElementById("bookingCenter");
        const v = document.getElementById("bookingVaccine");
        const s = document.getElementById("bookingService");

        bookingData.member = m ? m.value : "";
        bookingData.center = c ? c.value : "";
        bookingData.vaccine = v ? v.value : "";
        bookingData.service = s ? s.value : "";

        if (!bookingData.member || !bookingData.center || !bookingData.vaccine || !bookingData.service) {
            toast("Completá todos los campos para continuar.");
            return;
        }
        bookingStep = 2;
        renderBookingStep();
        return;
    }

    if (bookingStep === 2) {
        const d = document.getElementById("bookingDate");
        const t = document.getElementById("bookingTime");

        bookingData.date = d ? d.value : "";
        bookingData.time = t ? t.value : "";

        if (!bookingData.date || !bookingData.time) {
            toast("Seleccioná una fecha y un horario.");
            return;
        }
        bookingStep = 3;
        renderBookingStep();
        return;
    }

    if (bookingStep === 3) {
        confirmBooking();
    }
}

function confirmBooking() {
    const newAppointment = {
        id: Date.now(),
        vaccine: bookingData.vaccine,
        member: bookingData.member,
        service: bookingData.service,
        center: bookingData.center,
        address: "Dirección institucional de referencia",
        date: bookingData.date,
        time: bookingData.time,
        status: "Pendiente"
    };

    appointments.push(newAppointment);
    closeBookingModal();
    renderAppointments();
    toast("¡Tu solicitud de turno fue registrada!");
}
/* =====================================================
   VACURED · MI CUENTA (Pestañas, Edición y Familia)
   ===================================================== */

function switchAccountTab(tabId, btnElement) {
    // Ocultar todas las secciones de cuenta
    document.querySelectorAll('.account-section').forEach(section => {
        section.style.display = 'none';
    });

    // Actualizar estilos de las pestañas
    document.querySelectorAll('#accountTabs .family-tab').forEach(tab => {
        tab.classList.remove('active', 'bg-white', 'text-violetbrand', 'border-line', 'shadow-2xs');
        tab.classList.add('border-transparent', 'bg-transparent', 'text-[#68798b]');
    });

    // Mostrar la sección seleccionada y activar el botón
    const targetSection = document.getElementById('tab-' + tabId);
    if (targetSection) {
        targetSection.style.display = 'block';
    }

    if (btnElement) {
        btnElement.classList.add('active', 'bg-white', 'text-violetbrand', 'border-line', 'shadow-2xs');
        btnElement.classList.remove('border-transparent', 'bg-transparent', 'text-[#68798b]');
    }
}

let isEditingProfile = false;

function toggleEditProfile() {
    const btn = document.getElementById('editProfileBtn');
    const fields = document.querySelectorAll('#tab-perfil .profile-field');
    if (!btn || !fields.length) return;

    if (!isEditingProfile) {
        // Activar modo edición
        isEditingProfile = true;

        fields.forEach(input => {
            input.disabled = false;
            input.classList.remove('px-0', 'border-transparent', 'bg-transparent');
            input.classList.add('px-3', 'border-violetbrand/40', 'bg-white', 'focus:border-violetbrand', 'focus:ring-2', 'focus:ring-violetbrand/15', 'shadow-2xs');
        });

        btn.className = 'inline-flex items-center gap-2 bg-greenbrand text-white rounded-lg px-3.5 py-2 text-xs font-bold hover:bg-opacity-90 transition self-start sm:self-auto shadow-2xs cursor-pointer';
        btn.innerHTML = `
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>
            <span>Guardar cambios</span>
        `;

        const firstInput = document.getElementById('inputNombre');
        if (firstInput) firstInput.focus();
    } else {
        // Guardar cambios y volver a modo lectura
        const nombre = document.getElementById('inputNombre')?.value.trim() || '';
        const dni = document.getElementById('inputDni')?.value.trim() || '';
        const obraSocial = document.getElementById('inputObraSocial')?.value.trim() || 'Sin cobertura / Particular';
        const email = document.getElementById('inputEmail')?.value.trim() || '';

        if (!nombre || !email) {
            toast('Completá al menos tu nombre y correo electrónico.');
            return;
        }

        // Actualizar cabecera y sidebar con los datos editados
        const headerName = document.getElementById('profileHeaderName');
        const headerEmail = document.getElementById('profileHeaderEmail');
        const headerDni = document.getElementById('profileHeaderDni');
        const headerObraSocial = document.getElementById('profileHeaderObraSocial');
        const sidebarName = document.getElementById('sidebarUserName');

        if (headerName) headerName.textContent = nombre;
        if (headerEmail) headerEmail.textContent = `${email} · Cuenta familiar activa`;
        if (headerDni) headerDni.textContent = dni ? `DNI ${dni}` : 'Sin DNI cargado';
        if (headerObraSocial) headerObraSocial.textContent = obraSocial;
        if (sidebarName) sidebarName.textContent = nombre;

        isEditingProfile = false;

        fields.forEach(input => {
            input.disabled = true;
            input.classList.add('px-0', 'border-transparent', 'bg-transparent');
            input.classList.remove('px-3', 'border-violetbrand/40', 'bg-white', 'focus:border-violetbrand', 'focus:ring-2', 'focus:ring-violetbrand/15', 'shadow-2xs');
        });

        btn.className = 'inline-flex items-center gap-2 border border-violetbrand/30 bg-vs/70 text-violetbrand hover:bg-violetbrand hover:text-white rounded-lg px-3.5 py-2 text-xs font-bold transition self-start sm:self-auto cursor-pointer';
        btn.innerHTML = `
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
            <span>Editar perfil</span>
        `;

        toast('Cambios guardados correctamente');
    }
}

const accountFamilyMembers = [
    {
        firstName: 'Tomás',
        lastName: 'Quintana',
        relation: 'Hijo',
        pillClass: 'text-violetbrand',
        dni: '48.920.114',
        obraSocial: 'OSDE 210 (Grupo familiar)',
        nacimiento: '2014-09-19',
        email: 'tomas.quintana@email.com',
        telefono: '+54 11 4455-6677 (Titular)',
        localidad: 'San Justo, La Matanza'
    },
    {
        firstName: 'Ana',
        lastName: 'Quintana',
        relation: 'Hija',
        pillClass: 'text-[#2b7a67]',
        dni: '53.418.902',
        obraSocial: 'OSDE 210 (Grupo familiar)',
        nacimiento: '2021-03-04',
        email: 'maria.quintana@email.com (Titular)',
        telefono: '+54 11 4455-6677 (Titular)',
        localidad: 'San Justo, La Matanza'
    }
];

let currentFamilyMemberIndex = 0;
let isEditingFamilyMember = false;

function goToFamilyMember(targetIndex) {
    if (isEditingFamilyMember) {
        toast('Guardá los cambios del integrante antes de cambiar.');
        return;
    }

    const total = accountFamilyMembers.length;
    if (targetIndex < 0 || targetIndex >= total || targetIndex === currentFamilyMemberIndex) return;

    const direction = targetIndex > currentFamilyMemberIndex ? 1 : -1;
    currentFamilyMemberIndex = targetIndex;
    renderSelectedFamilyMember(direction);
}

function switchFamilyMember(direction) {
    if (isEditingFamilyMember) {
        toast('Guardá los cambios del integrante antes de cambiar.');
        return;
    }

    const total = accountFamilyMembers.length;
    currentFamilyMemberIndex = (currentFamilyMemberIndex + direction + total) % total;
    renderSelectedFamilyMember(direction);
}

function renderSelectedFamilyMember(direction = 1) {
    const member = accountFamilyMembers[currentFamilyMemberIndex];
    if (!member) return;

    const slideBox = document.getElementById('familyMemberSlideBox');
    const detailCard = document.getElementById('familyMemberDetailCard');
    const firstNameEl = document.getElementById('familyMemberFirstName');
    const lastNameEl = document.getElementById('familyMemberLastName');
    const pillEl = document.getElementById('familyMemberRelationPill');

    const inputNombre = document.getElementById('fmInputNombre');
    const inputRelacion = document.getElementById('fmInputRelacion');
    const inputDni = document.getElementById('fmInputDni');
    const inputObraSocial = document.getElementById('fmInputObraSocial');
    const inputNacimiento = document.getElementById('fmInputNacimiento');
    const inputEmail = document.getElementById('fmInputEmail');
    const inputTelefono = document.getElementById('fmInputTelefono');
    const inputLocalidad = document.getElementById('fmInputLocalidad');

    // Animar el slider de puntos sin destruir los nodos DOM para mantener transición fluida
    document.querySelectorAll('#familyMemberDots .family-dot').forEach((dot, idx) => {
        if (idx === currentFamilyMemberIndex) {
            dot.classList.remove('w-1.5', 'bg-slate-300/90', 'hover:bg-slate-400');
            dot.classList.add('w-6', 'bg-violetbrand');
        } else {
            dot.classList.remove('w-6', 'bg-violetbrand');
            dot.classList.add('w-1.5', 'bg-slate-300/90', 'hover:bg-slate-400');
        }
    });

    // Micro-animación direccional al cambiar de integrante
    const offset = direction >= 0 ? 'translate-x-2' : '-translate-x-2';
    if (slideBox) {
        slideBox.classList.add('opacity-0', offset);
    }
    if (detailCard) {
        detailCard.classList.add('opacity-60');
    }

    setTimeout(() => {
        if (firstNameEl) firstNameEl.textContent = member.firstName;
        if (lastNameEl) lastNameEl.textContent = member.lastName;
        if (pillEl) {
            pillEl.textContent = member.relation;
            pillEl.className = `mt-2.5 inline-flex items-center bg-white/45 backdrop-blur-md border border-white/75 rounded-full px-3 py-0.5 text-[10px] font-extrabold tracking-wide shadow-2xs ${member.pillClass}`;
        }

        if (inputNombre) inputNombre.value = `${member.firstName} ${member.lastName}`.trim();
        if (inputRelacion) inputRelacion.value = member.relation;
        if (inputDni) inputDni.value = member.dni;
        if (inputObraSocial) inputObraSocial.value = member.obraSocial;
        if (inputNacimiento) inputNacimiento.value = member.nacimiento;
        if (inputEmail) inputEmail.value = member.email;
        if (inputTelefono) inputTelefono.value = member.telefono;
        if (inputLocalidad) inputLocalidad.value = member.localidad;

        if (slideBox) {
            slideBox.classList.remove('opacity-0', 'translate-x-2', '-translate-x-2');
        }
        if (detailCard) {
            detailCard.classList.remove('opacity-60');
        }
    }, 140);
}

function toggleEditFamilyMember() {
    const btn = document.getElementById('editFamilyMemberBtn');
    const fields = document.querySelectorAll('#familyMemberDetailCard .family-field');
    const member = accountFamilyMembers[currentFamilyMemberIndex];
    if (!btn || !fields.length || !member) return;

    if (!isEditingFamilyMember) {
        isEditingFamilyMember = true;

        fields.forEach(input => {
            input.disabled = false;
            input.classList.remove('px-0', 'border-transparent', 'bg-transparent');
            input.classList.add('px-2.5', 'border-violetbrand/40', 'bg-white', 'focus:border-violetbrand', 'focus:ring-2', 'focus:ring-violetbrand/15', 'shadow-2xs');
        });

        btn.className = 'inline-flex items-center gap-2 bg-greenbrand text-white rounded-lg px-3.5 py-2 text-xs font-bold hover:bg-opacity-90 transition self-start sm:self-auto shadow-2xs cursor-pointer';
        btn.innerHTML = `
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>
            <span>Guardar cambios</span>
        `;

        const firstField = document.getElementById('fmInputNombre');
        if (firstField) firstField.focus();
    } else {
        const fullName = document.getElementById('fmInputNombre')?.value.trim() || '';
        const relation = document.getElementById('fmInputRelacion')?.value.trim() || '';

        if (!fullName || !relation) {
            toast('Completá el nombre y la relación con el titular.');
            return;
        }

        const nameParts = fullName.split(/\s+/);
        member.firstName = nameParts[0] || '';
        member.lastName = nameParts.slice(1).join(' ') || '';
        member.relation = relation;
        member.dni = document.getElementById('fmInputDni')?.value.trim() || '';
        member.obraSocial = document.getElementById('fmInputObraSocial')?.value.trim() || 'Sin cobertura';
        member.nacimiento = document.getElementById('fmInputNacimiento')?.value || '';
        member.email = document.getElementById('fmInputEmail')?.value.trim() || '';
        member.telefono = document.getElementById('fmInputTelefono')?.value.trim() || '';
        member.localidad = document.getElementById('fmInputLocalidad')?.value.trim() || '';

        isEditingFamilyMember = false;

        fields.forEach(input => {
            input.disabled = true;
            input.classList.add('px-0', 'border-transparent', 'bg-transparent');
            input.classList.remove('px-2.5', 'border-violetbrand/40', 'bg-white', 'focus:border-violetbrand', 'focus:ring-2', 'focus:ring-violetbrand/15', 'shadow-2xs');
        });

        btn.className = 'inline-flex items-center gap-2 border border-violetbrand/30 bg-vs/70 text-violetbrand hover:bg-violetbrand hover:text-white rounded-lg px-3.5 py-2 text-xs font-bold transition self-start sm:self-auto cursor-pointer';
        btn.innerHTML = `
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
            <span>Editar integrante</span>
        `;

        renderSelectedFamilyMember(0);
        toast(`Datos de ${member.firstName} actualizados correctamente`);
    }
}

/* =====================================================
   VACURED · CARNET FAMILIAR
   ===================================================== */

const people = {
    Maria: {
        name: 'María Quintana',
        initials: 'MQ',
        desc: 'Adulta · Responsable de la cuenta',
        colorClass: 'text-violetbrand',
        avatarBg: 'bg-vs text-violetbrand'
    },
    Tomas: {
        name: 'Tomás',
        initials: 'JT',
        desc: 'Adolescente · Integrante familiar',
        colorClass: 'text-bluebrand',
        avatarBg: 'bg-bs text-bluebrand'
    },
    Ana: {
        name: 'Ana',
        initials: 'AL',
        desc: 'Niña · Integrante familiar',
        colorClass: 'text-[#2b7a67]',
        avatarBg: 'bg-gs text-[#2b7a67]'
    }
};

let vaccines = [
    {
        id: 1,
        person: 'Maria',
        name: 'Antigripal',
        dose: 'Dosis anual',
        date: '2026-04-15',
        center: 'Centro de Salud San Justo',
        status: 'ok',
        notes: 'Campaña otoñal · Lote AG-2026-41',
        nextDose: 'Se recomienda aplicar la próxima dosis anual a partir de abril de 2027.'
    },
    {
        id: 2,
        person: 'Maria',
        name: 'Hepatitis B',
        dose: 'Esquema registrado',
        date: '2025-02-12',
        center: 'Registro personal',
        status: 'ok',
        notes: 'Esquema completo de 3 dosis validado en carnet.',
        nextDose: 'No aplica. El esquema completo brinda protección de por vida.'
    },
    {
        id: 3,
        person: 'Tomas',
        name: 'Triple bacteriana acelular',
        dose: 'Refuerzo',
        date: '2026-03-20',
        center: 'Centro de Salud San Justo',
        status: 'ok',
        notes: 'Refuerzo correspondiente a los 11 años · Lote TBA-89',
        nextDose: 'Próximo refuerzo (Doble adultos - dT) recomendado a los 21 años (2036).'
    },
    {
        id: 4,
        person: 'Tomas',
        name: 'Vacuna del calendario',
        dose: 'Revisar documentación',
        date: '',
        center: 'Dato pendiente',
        status: 'pending',
        notes: 'Registro cargado sin comprobante físico adjunto.',
        nextDose: 'Presentá el carnet físico en un vacunatorio para confirmar fecha y próxima dosis.'
    },
    {
        id: 5,
        person: 'Ana',
        name: 'Triple viral',
        dose: 'Dosis registrada',
        date: '2025-08-08',
        center: 'Centro de Salud San Justo',
        status: 'ok',
        notes: 'Primera dosis infantil · Lote TV-312',
        nextDose: 'Refuerzo obligatorio al ingreso escolar (entre los 5 y 6 años).'
    },
    {
        id: 6,
        person: 'Ana',
        name: 'Poliomielitis',
        dose: 'Dosis registrada',
        date: '2025-08-08',
        center: 'Centro de Salud San Justo',
        status: 'ok',
        notes: 'Vacuna inactivada IPV · Lote IPV-104',
        nextDose: 'Refuerzo escolar previsto al cumplir los 5 años según Calendario Nacional.'
    }
];

let selectedPerson = 'all';

function selectPerson(person, btn) {
    selectedPerson = person;
    document.querySelectorAll('#familyTabs .family-tab').forEach(t => {
        t.classList.remove('active', 'bg-white', 'text-violetbrand', 'border-line', 'shadow-2xs');
        t.classList.add('border-transparent', 'bg-transparent', 'text-[#68798b]');
    });

    if (btn) {
        btn.classList.add('active', 'bg-white', 'text-violetbrand', 'border-line', 'shadow-2xs');
        btn.classList.remove('border-transparent', 'bg-transparent', 'text-[#68798b]');
    }

    const p = people[person];
    const memberName = document.getElementById('memberName');
    const memberInitials = document.getElementById('memberInitials');
    const memberDesc = document.getElementById('memberDesc');

    if (memberName) memberName.textContent = p ? p.name : 'Grupo familiar';
    if (memberInitials) memberInitials.textContent = p ? p.initials : 'MQ';
    if (memberDesc) memberDesc.textContent = p ? p.desc : '3 integrantes registrados · Carnets organizados en un solo lugar.';

    renderVaccines();
}

function matchesTimeFilter(isoDate, timeRange) {
    if (timeRange === 'all') return true;
    if (!isoDate) return false;

    const parts = isoDate.split('-');
    if (parts.length !== 3) return false;

    const [year, month, day] = parts;
    const vaccineDate = new Date(Number(year), Number(month) - 1, Number(day));
    const now = new Date();
    now.setHours(23, 59, 59, 999);

    const cutoff = new Date(now);
    if (timeRange === 'week') cutoff.setDate(now.getDate() - 7);
    if (timeRange === 'month') cutoff.setMonth(now.getMonth() - 1);
    if (timeRange === 'year') cutoff.setFullYear(now.getFullYear() - 1);
    cutoff.setHours(0, 0, 0, 0);

    return vaccineDate >= cutoff && vaccineDate <= now;
}

function renderVaccines() {
    const list = document.getElementById('vaccineList');
    if (!list) return;

    const searchEl = document.getElementById('searchVaccine');
    const timeEl = document.getElementById('timeFilter');
    const statusEl = document.getElementById('statusFilter');

    const q = searchEl ? searchEl.value.toLowerCase().trim() : '';
    const t = timeEl ? timeEl.value : 'all';
    const s = statusEl ? statusEl.value : 'all';

    const filtered = vaccines.filter(v => {
        const personInfo = people[v.person] || { name: v.person };
        const searchableText = `${v.name} ${personInfo.name} ${v.dose} ${v.center}`.toLowerCase();
        return (
            searchableText.includes(q) &&
            (selectedPerson === 'all' || v.person === selectedPerson) &&
            matchesTimeFilter(v.date, t) &&
            (s === 'all' || v.status === s)
        );
    });

    // Ordenar más recientes primero (dejando sin confirmar al final)
    filtered.sort((a, b) => {
        if (!a.date) return 1;
        if (!b.date) return -1;
        return new Date(b.date) - new Date(a.date);
    });

    list.innerHTML = filtered.map(v => {
        const personInfo = people[v.person] || { name: v.person, colorClass: 'text-ink' };
        const isVerified = v.status === 'ok';
        const formattedDate = v.date ? formatAppointmentDate(v.date).formatted : 'Sin confirmar';

        // Degradado sutil de izquierda (blanco) a derecha (verde pastel o rojo pastel) + hover visual
        const rowGradientAndHover = isVerified
            ? 'bg-gradient-to-r from-white via-white to-[#edf6f2] border-[#e6edf2] hover:border-greenbrand/50'
            : 'bg-gradient-to-r from-white via-white to-[#fff2f3] border-[#f2e4e6] hover:border-redbrand/50';

        const iconBoxClass = isVerified
            ? 'bg-vs text-violetbrand group-hover:bg-violetbrand group-hover:text-white'
            : 'bg-rs text-redbrand group-hover:bg-redbrand group-hover:text-white';

        const statusBadge = isVerified
            ? '<span class="text-[10px] text-greenbrand bg-[#edf6f2] border border-greenbrand/25 font-bold px-2.5 py-1 rounded-full whitespace-nowrap">Registrada</span>'
            : '<span class="text-[10px] text-redbrand bg-rs border border-redbrand/25 font-bold px-2.5 py-1 rounded-full whitespace-nowrap">A verificar</span>';

        return `
            <div onclick="showVaccineDetail(${v.id})"
                role="button"
                tabindex="0"
                onkeydown="if(event.key==='Enter'||event.key===' ') showVaccineDetail(${v.id})"
                class="vaccine-row group grid grid-cols-[38px_1fr_auto] sm:grid-cols-[38px_1fr_140px_auto] items-center gap-3 p-3.5 border rounded-xl ${rowGradientAndHover} hover:shadow-sm hover:-translate-y-[1px] transition-all duration-150 cursor-pointer">
                
                <div class="w-9 h-9 rounded-xl ${iconBoxClass} grid place-items-center text-base font-bold flex-shrink-0 transition-colors">
                    <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m18 2 4 4"/><path d="m17 7 3-3"/><path d="M19 9 8.5 19.5a2.1 2.1 0 0 1-3 0l-1-1a2.1 2.1 0 0 1 0-3L15 5"/><path d="m9 11 4 4"/><path d="m5 19-3 3"/><path d="m14 4 6 6"/></svg>
                </div>

                <div class="min-w-0">
                    <b class="block text-xs sm:text-[13px] font-bold text-ink truncate">${v.name}</b>
                    <small class="block text-muted text-[11px] mt-0.5 truncate">
                        <span class="font-bold ${personInfo.colorClass}">${personInfo.name}</span> · ${v.dose}
                    </small>
                </div>

                <div class="hidden sm:block min-w-0">
                    <b class="block text-xs font-bold text-ink">${formattedDate}</b>
                    <small class="block text-muted text-[10px] truncate">${v.center}</small>
                </div>

                <div class="flex items-center gap-2 justify-self-end">
                    ${statusBadge}
                    <span class="text-muted/60 group-hover:text-ink group-hover:translate-x-0.5 transition-all text-xs font-bold">›</span>
                </div>
            </div>
        `;
    }).join('');

    const emptyState = document.getElementById('emptyState');
    const vaccineCount = document.getElementById('vaccineCount');
    const progressBar = document.getElementById('vaccineProgressBar');

    if (emptyState) emptyState.style.display = filtered.length ? 'none' : 'block';
    if (vaccineCount) vaccineCount.textContent = filtered.length;
    if (progressBar) {
        const verifiedCount = filtered.filter(v => v.status === 'ok').length;
        const pct = filtered.length ? Math.round((verifiedCount / filtered.length) * 100) : 0;
        progressBar.style.width = pct + '%';
    }
}

function filterVaccines() {
    renderVaccines();
}

function getRecommendedNextDose(vaccineName, dose) {
    const lower = vaccineName.toLowerCase();
    if (lower.includes('antigripal')) {
        return 'Se recomienda aplicar una dosis anual cada otoño antes del inicio del invierno.';
    }
    if (lower.includes('hepatitis b')) {
        return dose === 'Tercera dosis' || dose === 'Esquema registrado'
            ? 'Esquema completo. No requiere dosis adicionales.'
            : 'Completar las 3 dosis del esquema (0, 1 y 6 meses) según indicación médica.';
    }
    if (lower.includes('doble adultos') || lower.includes('triple bacteriana')) {
        return 'Refuerzo recomendado cada 10 años según el Calendario Nacional de Vacunación.';
    }
    if (lower.includes('triple viral') || lower.includes('poliomielitis')) {
        return 'Verificar refuerzo obligatorio al ingreso escolar (entre los 5 y 6 años).';
    }
    if (lower.includes('covid')) {
        return 'Consultar refuerzo semestral o anual según grupo de edad y factores de riesgo.';
    }
    return 'Consultá con un profesional de salud o el Calendario Nacional para verificar si corresponde refuerzo.';
}

function showVaccineDetail(id) {
    const v = vaccines.find(item => item.id === id);
    if (!v) return;

    const personInfo = people[v.person] || {
        name: v.person,
        initials: v.person.slice(0, 2).toUpperCase(),
        desc: 'Integrante familiar',
        avatarBg: 'bg-vs text-violetbrand'
    };

    const isVerified = v.status === 'ok';
    const formattedDate = v.date ? formatAppointmentDate(v.date).formatted : 'Sin confirmar';

    const titleEl = document.getElementById('detailVaccineTitle');
    const contentEl = document.getElementById('vaccineDetailContent');

    if (titleEl) titleEl.textContent = v.name;

    if (contentEl) {
        const statusPill = isVerified
            ? '<span class="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold bg-[#edf6f2] text-greenbrand border border-greenbrand/30">Registrada</span>'
            : '<span class="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold bg-rs text-redbrand border border-redbrand/30">A verificar</span>';

        contentEl.innerHTML = `
            <div class="space-y-3.5">
                <!-- Integrante y estado -->
                <div class="flex items-center justify-between gap-3 p-3 bg-bglight border border-line rounded-xl">
                    <div class="flex items-center gap-3 min-w-0">
                        <div class="w-9 h-9 rounded-xl ${personInfo.avatarBg} grid place-items-center text-xs font-extrabold shrink-0">
                            ${personInfo.initials}
                        </div>
                        <div class="min-w-0">
                            <b class="block text-xs font-bold text-ink truncate">${personInfo.name}</b>
                            <small class="block text-[10px] text-muted truncate">${personInfo.desc}</small>
                        </div>
                    </div>
                    ${statusPill}
                </div>

                <!-- Datos estructurados -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div class="bg-white border border-line rounded-xl p-3 space-y-0.5">
                        <small class="block text-[9px] text-muted font-extrabold tracking-wider uppercase">DOSIS APLICADA</small>
                        <strong class="block text-xs font-bold text-ink">${v.dose}</strong>
                    </div>

                    <div class="bg-white border border-line rounded-xl p-3 space-y-0.5">
                        <small class="block text-[9px] text-muted font-extrabold tracking-wider uppercase">FECHA DE APLICACIÓN</small>
                        <strong class="block text-xs font-bold text-ink">${formattedDate}</strong>
                    </div>

                    <div class="bg-white border border-line rounded-xl p-3 space-y-0.5 sm:col-span-2">
                        <small class="block text-[9px] text-muted font-extrabold tracking-wider uppercase">VACUNATORIO / LUGAR</small>
                        <strong class="block text-xs font-bold text-ink">${v.center}</strong>
                    </div>

                    ${v.notes ? `
                    <div class="bg-white border border-line rounded-xl p-3 space-y-0.5 sm:col-span-2">
                        <small class="block text-[9px] text-muted font-extrabold tracking-wider uppercase">OBSERVACIONES</small>
                        <p class="text-xs text-slate-700 font-medium">${v.notes}</p>
                    </div>` : ''}
                </div>

                <!-- Recomendación de próxima dosis -->
                <div class="bg-vs/70 border border-violetbrand/20 rounded-xl p-3.5 flex items-start gap-2.5">
                    <span class="w-7 h-7 rounded-lg bg-white text-violetbrand grid place-items-center shrink-0 mt-0.5 shadow-2xs">
                        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/></svg>
                    </span>
                    <div class="space-y-0.5">
                        <small class="block text-[9px] text-violetbrand font-extrabold tracking-wider uppercase">RECOMENDACIÓN DE PRÓXIMA DOSIS</small>
                        <p class="text-xs text-ink font-medium leading-relaxed">${v.nextDose}</p>
                    </div>
                </div>
            </div>
        `;
    }

    const detailModal = document.getElementById('vaccineDetailModal');
    if (detailModal) detailModal.classList.add('open');
}

function closeVaccineDetail() {
    const detailModal = document.getElementById('vaccineDetailModal');
    if (detailModal) detailModal.classList.remove('open');
}

function openAddVaccineModal() {
    const form = document.getElementById('addVaccineForm');
    if (form) form.reset();

    const customWrap = document.getElementById('customVaccineNameWrapper');
    if (customWrap) customWrap.classList.add('hidden');

    // Preseleccionar integrante si hay una pestaña individual activa
    if (selectedPerson !== 'all') {
        const memberSelect = document.getElementById('newVaccineMember');
        if (memberSelect) memberSelect.value = selectedPerson;
    }

    const addModal = document.getElementById('addVaccineModal');
    if (addModal) addModal.classList.add('open');
}

function closeAddVaccineModal() {
    const addModal = document.getElementById('addVaccineModal');
    if (addModal) addModal.classList.remove('open');
}

function toggleCustomVaccineInput() {
    const select = document.getElementById('newVaccineName');
    const wrapper = document.getElementById('customVaccineNameWrapper');
    if (!select || !wrapper) return;

    if (select.value === 'Otra') {
        wrapper.classList.remove('hidden');
    } else {
        wrapper.classList.add('hidden');
    }
}

function saveNewVaccine(event) {
    event.preventDefault();

    const person = document.getElementById('newVaccineMember')?.value || '';
    const dose = document.getElementById('newVaccineDose')?.value || '';
    const selectedName = document.getElementById('newVaccineName')?.value || '';
    const customName = document.getElementById('customVaccineName')?.value.trim() || '';
    const date = document.getElementById('newVaccineDate')?.value || '';
    const status = document.getElementById('newVaccineStatus')?.value || 'ok';
    const center = document.getElementById('newVaccineCenter')?.value.trim() || 'Centro de salud';
    const notes = document.getElementById('newVaccineNotes')?.value.trim() || '';

    const finalName = selectedName === 'Otra' ? customName : selectedName;

    if (!person || !dose || !finalName || !date) {
        toast('Completá los campos obligatorios (*) para guardar la vacuna.');
        return;
    }

    const newVaccine = {
        id: Date.now(),
        person,
        name: finalName,
        dose,
        date,
        center,
        status,
        notes: notes || 'Registro agregado manualmente por el titular.',
        nextDose: getRecommendedNextDose(finalName, dose)
    };

    vaccines.unshift(newVaccine);
    closeAddVaccineModal();
    renderVaccines();
    toast('¡Vacuna agregada al carnet familiar!');
}

// Inicializar renderizado si estamos en carnet.html
if (document.getElementById('vaccineList')) {
    renderVaccines();
}

/* =====================================================
   VACURED · PREGUNTAS FRECUENTES
   ===================================================== */

function initFaqPage() {
    const search = document.getElementById('faqSearch');
    if (!search) return;

    // 1. Detectar si el usuario llegó desde landing.html
    const params = new URLSearchParams(window.location.search);
    const fromLanding =
        params.get('from') === 'landing' ||
        document.referrer.toLowerCase().includes('landing.html');

    if (fromLanding) {
        const sidebar = document.getElementById('faqSidebar');
        const layout = document.getElementById('faqLayout');
        const breadcrumb = document.getElementById('faqBreadcrumb');
        const topbarActions = document.getElementById('topbarActions');
        const mobileBrand = document.getElementById('mobileBrand');

        if (sidebar) sidebar.remove();
        if (layout) layout.classList.remove('md:grid', 'md:grid-cols-[238px_1fr]');
        if (topbarActions) topbarActions.remove();
        if (mobileBrand) mobileBrand.classList.add('hidden');
        if (breadcrumb) {
            breadcrumb.classList.remove('hidden');
            breadcrumb.innerHTML = '<a href="landing.html" class="text-muted hover:underline">Landing</a> / <b class="text-ink">Preguntas frecuentes</b>';
        }
    }

    // 2. Buscador y filtros por categoría
    const chips = document.querySelectorAll('#faqChips .faq-chip');
    const groups = document.querySelectorAll('.faq-group');
    const empty = document.getElementById('faqEmpty');
    let cat = 'all';
    const norm = s => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    function apply() {
        const q = norm(search.value.trim());
        let total = 0;
        groups.forEach(g => {
            let visible = 0;
            const inCat = cat === 'all' || g.dataset.cat === cat;
            g.querySelectorAll('.faq-item').forEach(item => {
                const show = inCat && (!q || norm(item.textContent).includes(q));
                item.style.display = show ? '' : 'none';
                if (show) visible++;
            });
            g.style.display = visible ? '' : 'none';
            total += visible;
        });
        if (empty) empty.classList.toggle('hidden', total > 0);
    }

    chips.forEach(c => c.addEventListener('click', () => {
        cat = c.dataset.cat;
        chips.forEach(x => x.classList.toggle('active', x === c));
        apply();
    }));

    search.addEventListener('input', apply);
}

initFaqPage();

/* =====================================================
   VACURED · INICIO (Resumen interactivo y Campañas)
   ===================================================== */

function switchFamilySummaryTab(tabKey) {
    const buttons = document.querySelectorAll('#familySummaryTabs .summary-tab-btn');
    const panels = document.querySelectorAll('.summary-panel');
    if (!buttons.length || !panels.length) return;

    const activeStyles = {
        integrantes: ['border-2', 'border-violetbrand', 'shadow-xs'],
        vacunas: ['border-2', 'border-bluebrand', 'shadow-xs'],
        dosis: ['border-2', 'border-redbrand', 'shadow-xs']
    };

    const inactiveStyles = {
        integrantes: ['border', 'border-[#dcd3f5]'],
        vacunas: ['border', 'border-[#c8e0f2]'],
        dosis: ['border', 'border-[#f7c7cb]']
    };

    buttons.forEach(btn => {
        const key = btn.dataset.summaryTab;
        const isTarget = key === tabKey;
        const indicator = btn.querySelector('.summary-tab-indicator');

        btn.classList.remove(
            'active', 'border', 'border-2', 'shadow-xs',
            'border-violetbrand', 'border-bluebrand', 'border-redbrand',
            'border-[#dcd3f5]', 'border-[#c8e0f2]', 'border-[#f7c7cb]'
        );

        if (isTarget) {
            btn.classList.add('active', ...activeStyles[key]);
            if (indicator) {
                indicator.textContent = '▾';
                indicator.classList.remove('text-muted/60');
            }
        } else {
            btn.classList.add(...inactiveStyles[key]);
            if (indicator) {
                indicator.textContent = '▸';
                indicator.classList.add('text-muted/60');
            }
        }
    });

    panels.forEach(panel => {
        if (panel.id === 'summary-panel-' + tabKey) {
            panel.classList.remove('hidden', 'panel-fade-in');
            void panel.offsetWidth;
            panel.classList.add('panel-fade-in');
        } else {
            panel.classList.add('hidden');
            panel.classList.remove('panel-fade-in');
        }
    });
}

const dashboardCampaigns = [
    {
        tag: 'INFORMACIÓN OFICIAL',
        tagTextClass: 'text-redbrand',
        cardBg: 'bg-rs',
        cardBorder: 'border-redbrand/25',
        bannerBorder: 'border-redbrand/20',
        btnClass: 'bg-redbrand',
        title: 'Vacunarse en cada etapa de la vida',
        desc: 'Las vacunas acompañan cada etapa desde el nacimiento hasta la adultez mayor, previniendo enfermedades graves y protegiendo a toda la comunidad.',
        metaText: 'Gratuitas, sin orden médica y presentando DNI y carnet.',
        image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=900&q=85',
        imageAlt: 'Profesional de salud',
        link: 'https://www.argentina.gob.ar/salud/vacunas',
        linkText: 'Consultar información oficial'
    },
    {
        tag: 'CAMPAÑA PREVENTIVA',
        tagTextClass: 'text-violetbrand',
        cardBg: 'bg-vs',
        cardBorder: 'border-violetbrand/25',
        bannerBorder: 'border-violetbrand/20',
        btnClass: 'bg-violetbrand',
        title: 'Vacunación infantil e ingreso escolar',
        desc: 'Revisá los esquemas de los 5 y 11 años antes de clases para proteger contra sarampión, rubéola, poliomielitis y VPH.',
        metaText: 'Refuerzos obligatorios a los 5 y 11 años antes de clases.',
        image: 'https://images.unsplash.com/photo-1632053002928-1919605ee6f7?auto=format&fit=crop&w=900&q=85',
        imageAlt: 'Control pediátrico y vacunación infantil',
        link: 'https://www.argentina.gob.ar/salud/vacunas/calendario',
        linkText: 'Ver esquema escolar'
    },
    {
        tag: 'CAMPAÑA ESTACIONAL',
        tagTextClass: 'text-bluebrand',
        cardBg: 'bg-bs',
        cardBorder: 'border-bluebrand/25',
        bannerBorder: 'border-bluebrand/20',
        btnClass: 'bg-bluebrand',
        title: 'Prevención antigripal y refuerzos',
        desc: 'La vacunación anual reduce complicaciones respiratorias y hospitalizaciones en los grupos con mayor riesgo durante los meses fríos.',
        metaText: 'Dosis anual gratuita para embarazadas, niños y +65 años.',
        image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=900&q=85',
        imageAlt: 'Campaña antigripal y prevención',
        link: 'https://www.argentina.gob.ar/salud/vacunas/antigripal',
        linkText: 'Conocer más sobre la vacuna'
    },
    {
        tag: 'CUIDADO INTEGRAL',
        tagTextClass: 'text-[#2b7a67]',
        cardBg: 'bg-gs',
        cardBorder: 'border-[#2b7a67]/25',
        bannerBorder: 'border-[#2b7a67]/20',
        btnClass: 'bg-[#2b7a67]',
        title: 'Vacunas durante el embarazo',
        desc: 'Aplicarse las dosis indicadas en la gestación transfiere anticuerpos al bebé y lo protege desde el nacimiento.',
        metaText: 'Triple bacteriana acelular (sem. 20), antigripal y VSR.',
        image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=900&q=85',
        imageAlt: 'Cuidado materno y embarazo',
        link: 'https://www.argentina.gob.ar/salud/vacunas/embarazadas',
        linkText: 'Ver guía para embarazadas'
    },
    {
        tag: 'SALUD PREVENTIVA',
        tagTextClass: 'text-violetbrand',
        cardBg: 'bg-vs',
        cardBorder: 'border-violetbrand/25',
        bannerBorder: 'border-violetbrand/20',
        btnClass: 'bg-violetbrand',
        title: 'Esquemas para personas mayores',
        desc: 'A partir de los 65 años es clave mantener al día las vacunas contra el neumococo, la gripe y el refuerzo de doble adultos.',
        metaText: 'Antigripal anual, neumococo y doble adultos cada 10 años.',
        image: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=900&q=85',
        imageAlt: 'Vacunación en adultos mayores',
        link: 'https://www.argentina.gob.ar/salud/vacunas/adultos-mayores',
        linkText: 'Consultar esquema adultos'
    }
];

function selectCampaign(index) {
    const campaign = dashboardCampaigns[index];
    if (!campaign) return;

    const cards = document.querySelectorAll('#campaignSelectorList .campaign-selector-card');
    cards.forEach((card, idx) => {
        if (idx === index) {
            card.classList.add('active', 'border-2', 'border-slate-500', 'bg-slate-50/90', 'shadow-2xs');
            card.classList.remove('border', 'border-line', 'bg-white');
        } else {
            card.classList.remove('active', 'border-2', 'border-slate-500', 'bg-slate-50/90', 'shadow-2xs');
            card.classList.add('border', 'border-line', 'bg-white');
        }
    });

    const cardEl = document.getElementById('featuredCampaignCard');
    const bannerEl = document.getElementById('featuredCampaignBanner');
    const imgEl = document.getElementById('featuredCampaignImg');
    const bodyEl = document.getElementById('featuredCampaignBody');
    const tagEl = document.getElementById('featuredCampaignTag');
    const titleEl = document.getElementById('featuredCampaignTitle');
    const descEl = document.getElementById('featuredCampaignDesc');
    const metaTextEl = document.getElementById('featuredCampaignMetaText');
    const linkEl = document.getElementById('featuredCampaignLink');
    const linkTextEl = document.getElementById('featuredCampaignLinkText');

    if (cardEl) {
        cardEl.className = `flex flex-col ${campaign.cardBg} border ${campaign.cardBorder} rounded-2xl overflow-hidden shadow-2xs transition-colors duration-300`;
    }

    if (bannerEl) {
        bannerEl.className = `w-full h-28 sm:h-32 overflow-hidden relative border-b ${campaign.bannerBorder} flex flex-col justify-end p-3.5 sm:p-4`;
    }

    if (imgEl) {
        imgEl.src = campaign.image;
        imgEl.alt = campaign.imageAlt;
    }

    if (tagEl) {
        tagEl.textContent = campaign.tag;
        tagEl.className = `inline-flex items-center bg-white/95 rounded-full px-2.5 py-0.5 text-[9px] font-extrabold tracking-wider uppercase shadow-2xs ${campaign.tagTextClass}`;
    }

    if (titleEl) titleEl.textContent = campaign.title;
    if (descEl) descEl.textContent = campaign.desc;
    if (metaTextEl) metaTextEl.textContent = campaign.metaText;

    if (linkEl) {
        linkEl.href = campaign.link;
        linkEl.className = `inline-flex items-center gap-1.5 ${campaign.btnClass} text-white rounded-lg px-3.5 py-2 text-[11px] font-bold hover:bg-opacity-90 transition shadow-2xs`;
    }

    if (linkTextEl) linkTextEl.textContent = campaign.linkText;

    if (bodyEl) {
        bodyEl.classList.remove('panel-fade-in');
        void bodyEl.offsetWidth;
        bodyEl.classList.add('panel-fade-in');
    }
}

/* =====================================================
   VACURED · NAVEGACIÓN MÓVIL (Drawer lateral + Barra inferior)
   ===================================================== */

function getActivePageName() {
    const activeSidebarBtn = document.querySelector('aside button.bg-vs[data-page]');
    if (activeSidebarBtn) return activeSidebarBtn.dataset.page;

    const path = window.location.pathname.toLowerCase();
    if (path.includes('carnet')) return 'Carnet familiar';
    if (path.includes('vacunatorios')) return 'Vacunatorios';
    if (path.includes('turnos')) return 'Turnos';
    if (path.includes('mi-cuenta')) return 'Mi cuenta';
    if (path.includes('preguntas-frecuentes')) return 'Preguntas frecuentes';
    return 'Inicio';
}

function initMobileNavigation() {
    const sidebar = document.querySelector('aside');
    const mainEl = document.querySelector('main');
    if (!sidebar || !mainEl) return;

    const activePage = getActivePageName();

    const navItems = [
        {
            page: 'Inicio',
            shortLabel: 'Inicio',
            icon: '<svg class="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 11 12 4l8 7"/><path d="M6 10v9.5h4.5V14h3v5.5H18V10"/></svg>'
        },
        {
            page: 'Carnet familiar',
            shortLabel: 'Carnet',
            icon: '<svg class="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 2.5h6v3H9z"/><path d="m9 13 2 2 4-4"/></svg>'
        },
        {
            page: 'Vacunatorios',
            shortLabel: 'Vacunatorios',
            icon: '<svg class="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s-6.5-5.7-6.5-11a6.5 6.5 0 0 1 13 0c0 5.3-6.5 11-6.5 11Z"/><circle cx="12" cy="10" r="2.5"/></svg>'
        },
        {
            page: 'Turnos',
            shortLabel: 'Turnos',
            icon: '<svg class="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/></svg>'
        },
        {
            page: 'Mi cuenta',
            shortLabel: 'Mi cuenta',
            icon: '<svg class="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8.5" r="3.5"/><path d="M5 20c0-3.9 3.1-6 7-6s7 2.1 7 6"/></svg>'
        }
    ];

    // 1. Insertar botón hamburguesa en el topbar móvil junto al logo de VacuRed
    const mobileBrand = mainEl.querySelector('.md\\:hidden');
    if (mobileBrand && !document.getElementById('mobileMenuOpenBtn')) {
        const menuBtn = document.createElement('button');
        menuBtn.type = 'button';
        menuBtn.id = 'mobileMenuOpenBtn';
        menuBtn.setAttribute('aria-label', 'Abrir menú de navegación');
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.setAttribute('aria-controls', 'mobileNavDrawer');
        menuBtn.className = 'w-9 h-9 border border-line bg-white rounded-xl grid place-items-center text-ink hover:bg-vs hover:text-violetbrand hover:border-violetbrand/30 active:scale-95 transition cursor-pointer mr-1 shrink-0';
        menuBtn.innerHTML = '<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>';
        menuBtn.addEventListener('click', openMobileMenu);
        mobileBrand.prepend(menuBtn);
    }

    // 2. Crear Drawer lateral desplegable para móvil (misma estructura que el sidebar)
    if (!document.getElementById('mobileNavDrawer')) {
        const drawerLinksHtml = navItems.map(item => {
            const isActive = item.page === activePage;
            const classes = isActive
                ? 'bg-vs text-violetbrand font-bold'
                : 'text-[#607184] hover:bg-vs hover:text-violetbrand font-semibold';
            return `
                <button type="button"
                    onclick="closeMobileMenu(); go('${item.page}')"
                    class="w-full text-left px-3 py-2.5 rounded-xl flex items-center gap-3 text-xs ${classes} transition cursor-pointer">
                    <span class="w-5 grid place-items-center shrink-0">${item.icon}</span>
                    <span>${item.page}</span>
                </button>
            `;
        }).join('');

        const isFaqActive = activePage === 'Preguntas frecuentes';
        const faqCtaHtml = isFaqActive
            ? '<span class="inline-block bg-violetbrand text-white rounded-lg px-2.5 py-1.5 text-[11px] font-bold">Preguntas frecuentes ✓</span>'
            : '<a href="preguntas-frecuentes.html" class="inline-block bg-white border border-violetbrand rounded-lg px-2.5 py-1.5 text-violetbrand text-[11px] font-bold hover:bg-vs transition">Preguntas frecuentes ↗</a>';

        const drawer = document.createElement('div');
        drawer.id = 'mobileNavDrawer';
        drawer.className = 'md:hidden fixed inset-0 z-50 pointer-events-none';
        drawer.setAttribute('aria-hidden', 'true');
        drawer.innerHTML = `
            <!-- Fondo oscuro difuminado -->
            <div id="mobileNavBackdrop"
                onclick="closeMobileMenu()"
                class="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] opacity-0 transition-opacity duration-300"></div>

            <!-- Panel lateral -->
            <aside id="mobileNavPanel"
                class="relative w-[280px] max-w-[84vw] h-full bg-white border-r border-line shadow-2xl flex flex-col justify-between p-5 overflow-y-auto -translate-x-full transition-transform duration-300 ease-out">
                <div class="space-y-5">
                    <!-- Cabecera con marca y botón cerrar -->
                    <div class="flex items-center justify-between gap-2">
                        <div class="flex items-center gap-2.5 font-extrabold text-xl tracking-tight">
                            <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-violetbrand to-redbrand grid place-items-center text-white text-lg">✳</div>
                            <div>Vacu<span class="text-redbrand">Red</span><small class="block text-[10px] text-muted font-medium tracking-wide">Tu salud, en red.</small></div>
                        </div>
                        <button type="button"
                            onclick="closeMobileMenu()"
                            aria-label="Cerrar menú"
                            class="w-9 h-9 rounded-xl bg-slate-100 text-muted hover:bg-rs hover:text-redbrand grid place-items-center text-xl leading-none transition cursor-pointer shrink-0">
                            ×
                        </button>
                    </div>

                    <!-- Selector de ubicación (oculta en el topbar en móvil) -->
                    <button type="button"
                        onclick="closeMobileMenu(); locationModal()"
                        class="w-full flex items-center justify-between gap-2 border border-line bg-bglight/80 hover:bg-bs/50 rounded-xl px-3 py-2.5 text-[#566b80] text-xs font-semibold transition cursor-pointer">
                        <span class="flex items-center gap-2 truncate">
                            <svg class="w-4 h-4 text-bluebrand shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s-6.5-5.7-6.5-11a6.5 6.5 0 0 1 13 0c0 5.3-6.5 11-6.5 11Z"/><circle cx="12" cy="10" r="2.5"/></svg>
                            <span class="truncate">San Justo, Buenos Aires</span>
                        </span>
                        <span class="text-[10px] text-muted">▾</span>
                    </button>

                    <!-- Enlaces principales -->
                    <div>
                        <p class="text-[10px] text-[#9aa6b4] tracking-widest font-extrabold px-3 mb-2">MENÚ PRINCIPAL</p>
                        <nav class="grid gap-1">
                            ${drawerLinksHtml}
                        </nav>
                    </div>
                </div>

                <!-- Pie del menú lateral móvil -->
                <div class="space-y-3 pt-5 mt-5 border-t border-line">
                    <div class="bg-gradient-to-br from-[#eef4fa] to-[#f5f2fc] border border-line rounded-2xl p-3.5 space-y-2">
                        <b class="text-xs font-bold block">¿Necesitás ayuda?</b>
                        <p class="text-[11px] text-muted leading-relaxed">Encontrá respuestas sobre vacunas, carnets y el uso de VacuRed.</p>
                        ${faqCtaHtml}
                    </div>

                    <div class="flex items-center gap-2.5 p-2.5 bg-gradient-to-r from-[#f3f0fc] to-[#eaf3f9] border border-[#dcd3f5] rounded-xl text-xs font-bold">
                        <div class="w-9 h-9 rounded-full bg-[#e8e2f7] text-violetbrand flex items-center justify-center font-bold text-xs shrink-0">MQ</div>
                        <div class="flex-1 min-w-0">
                            <span class="block truncate">María Quintana</span>
                            <small class="block text-muted font-normal text-[10px] mt-0.5 truncate">Cuenta familiar (Titular)</small>
                        </div>
                        <button type="button"
                            onclick="closeMobileMenu(); logout()"
                            title="Cerrar sesión"
                            aria-label="Cerrar sesión"
                            class="w-9 h-9 rounded-lg grid place-items-center text-violetbrand hover:text-redbrand hover:bg-white/70 transition cursor-pointer shrink-0">
                            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 4H6.5A1.5 1.5 0 0 0 5 5.5v13A1.5 1.5 0 0 0 6.5 20H10"/><path d="M15 8l4 4-4 4M19 12H9"/></svg>
                        </button>
                    </div>
                </div>
            </aside>
        `;
        document.body.appendChild(drawer);
    }

    // 3. Crear barra de navegación inferior fija en móvil para acceso en 1 toque
    if (!document.getElementById('mobileBottomNav')) {
        const bottomItemsHtml = navItems.map(item => {
            const isActive = item.page === activePage;
            const textClass = isActive
                ? 'text-violetbrand font-extrabold'
                : 'text-[#607184] hover:text-violetbrand font-semibold';
            const pillClass = isActive
                ? 'bg-vs text-violetbrand'
                : 'bg-transparent';

            return `
                <button type="button"
                    onclick="go('${item.page}')"
                    aria-current="${isActive ? 'page' : 'false'}"
                    class="flex flex-col items-center justify-center gap-0.5 py-1 px-0.5 rounded-xl ${textClass} transition cursor-pointer min-w-0">
                    <span class="w-8 h-7 rounded-xl grid place-items-center ${pillClass} transition-colors">
                        ${item.icon}
                    </span>
                    <span class="text-[10px] leading-tight truncate max-w-full">${item.shortLabel}</span>
                </button>
            `;
        }).join('');

        const bottomNav = document.createElement('nav');
        bottomNav.id = 'mobileBottomNav';
        bottomNav.setAttribute('aria-label', 'Navegación principal móvil');
        bottomNav.className = 'md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-line px-1.5 py-1.5 shadow-[0_-4px_20px_rgba(32,50,71,0.06)]';
        bottomNav.innerHTML = `<div class="grid grid-cols-5 gap-1">${bottomItemsHtml}</div>`;
        document.body.appendChild(bottomNav);

        // Dar aire inferior al contenido y subir el toast en móvil para que no los tape la barra fija
        mainEl.classList.add('pb-24', 'md:pb-12');
        const toastEl = document.getElementById('toast');
        if (toastEl) {
            toastEl.classList.remove('bottom-5');
            toastEl.classList.add('bottom-20', 'md:bottom-5');
        }
    }
}

function openMobileMenu() {
    const drawer = document.getElementById('mobileNavDrawer');
    const backdrop = document.getElementById('mobileNavBackdrop');
    const panel = document.getElementById('mobileNavPanel');
    const openBtn = document.getElementById('mobileMenuOpenBtn');
    if (!drawer || !backdrop || !panel) return;

    drawer.classList.remove('pointer-events-none');
    drawer.setAttribute('aria-hidden', 'false');
    if (openBtn) openBtn.setAttribute('aria-expanded', 'true');

    requestAnimationFrame(() => {
        backdrop.classList.remove('opacity-0');
        backdrop.classList.add('opacity-100');
        panel.classList.remove('-translate-x-full');
        panel.classList.add('translate-x-0');
    });

    document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
    const drawer = document.getElementById('mobileNavDrawer');
    const backdrop = document.getElementById('mobileNavBackdrop');
    const panel = document.getElementById('mobileNavPanel');
    const openBtn = document.getElementById('mobileMenuOpenBtn');
    if (!drawer || !backdrop || !panel) return;

    backdrop.classList.remove('opacity-100');
    backdrop.classList.add('opacity-0');
    panel.classList.remove('translate-x-0');
    panel.classList.add('-translate-x-full');

    drawer.setAttribute('aria-hidden', 'true');
    if (openBtn) openBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';

    setTimeout(() => {
        if (drawer.getAttribute('aria-hidden') === 'true') {
            drawer.classList.add('pointer-events-none');
        }
    }, 300);
}

initMobileNavigation();