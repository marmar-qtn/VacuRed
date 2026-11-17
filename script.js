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
   VACURED · MI CUENTA (Pestañas de configuración)
   ===================================================== */

function switchAccountTab(tabId, btnElement) {
    // Ocultar todas las secciones de cuenta
    document.querySelectorAll('.account-section').forEach(section => {
        section.style.display = 'none';
    });

    // Remover la clase active de todas las pestañas
    document.querySelectorAll('#accountTabs .family-tab').forEach(tab => {
        tab.classList.remove('active');
    });

    // Mostrar la sección seleccionada y activar el botón
    const targetSection = document.getElementById('tab-' + tabId);
    if (targetSection) {
        targetSection.style.display = 'block';
    }

    if (btnElement) {
        btnElement.classList.add('active');
    }
}

/* =====================================================
   VACURED · CARNET FAMILIAR
   ===================================================== */

const people = {
    Maria: { name: 'María Quintana', initials: 'MQ', desc: 'Adulta · Responsable de la cuenta' },
    Tomas: { name: 'Tomás', initials: 'T', desc: 'Adolescente · Integrante familiar' },
    Ana: { name: 'Ana', initials: 'A', desc: 'Niña · Integrante familiar' }
};

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

    filterVaccines();
}

function matchesTimeFilter(dateText, timeRange) {
    if (timeRange === 'all') return true;
    const match = dateText.trim().match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (!match) return false;

    const [, day, month, year] = match;
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

function filterVaccines() {
    const searchEl = document.getElementById('searchVaccine');
    const timeEl = document.getElementById('timeFilter');
    const statusEl = document.getElementById('statusFilter');
    if (!searchEl || !timeEl || !statusEl) return;

    const q = searchEl.value.toLowerCase();
    const t = timeEl.value;
    const s = statusEl.value;
    let visible = 0;

    document.querySelectorAll('.vaccine-row').forEach(row => {
        const dateText = row.querySelectorAll('div')[2]?.querySelector('b')?.textContent || '';
        const ok =
            row.textContent.toLowerCase().includes(q) &&
            (selectedPerson === 'all' || row.dataset.person === selectedPerson) &&
            matchesTimeFilter(dateText, t) &&
            (s === 'all' || row.dataset.status === s);

        row.style.display = ok ? 'grid' : 'none';
        if (ok) visible++;
    });

    const emptyState = document.getElementById('emptyState');
    const vaccineCount = document.getElementById('vaccineCount');

    if (emptyState) emptyState.style.display = visible ? 'none' : 'block';
    if (vaccineCount) vaccineCount.textContent = visible;
}

function openVaccineModal() {
    modal(
        'Agregar vacuna',
        'Ingresá los datos para sumar un registro al carnet familiar.',
        '<label class="block font-bold mb-1">Integrante</label><select class="w-full h-10 px-3 border border-line rounded-lg bg-white mb-2"><option>María</option><option>Tomás</option><option>Ana</option></select><label class="block font-bold mb-1">Nombre de la vacuna</label><input class="w-full h-10 px-3 border border-line rounded-lg bg-white mb-2" placeholder="Ej. Antigripal"><label class="block font-bold mb-1">Fecha de aplicación</label><input class="w-full h-10 px-3 border border-line rounded-lg bg-white mb-2" type="date"><label class="block font-bold mb-1">Centro de vacunación (opcional)</label><input class="w-full h-10 px-3 border border-line rounded-lg bg-white mb-2" placeholder="Nombre del establecimiento"><label class="block font-bold mb-1">Observaciones (opcional)</label><input class="w-full h-10 px-3 border border-line rounded-lg bg-white mb-2" placeholder="Dosis, lote u otra información">'
    );
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