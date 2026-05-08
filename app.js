const SECTIONS = [
  { id: 'palco-left', label: 'Palco Izq', area: 'palco-left', rows: 'ABCDEFGH', cols: 8 },
  { id: 'palco-center', label: 'Palco Centro', area: 'palco-center', rows: 'JKLMNOPQR', cols: 12 },
  { id: 'palco-right', label: 'Palco Der', area: 'palco-right', rows: 'ABCDEFGH', cols: 8 },
  { id: 'luneta-left', label: 'Luneta Izq', area: 'luneta-left', rows: 'ABCDEFGH', cols: 10, wheelchairRows: ['A'] },
  { id: 'luneta-center', label: 'Luneta Centro', area: 'luneta-center', rows: 'FGHIJKLMNOPQR', cols: 14, hasCabina: true },
  { id: 'luneta-right', label: 'Luneta Der', area: 'luneta-right', rows: 'ABCDEFGH', cols: 10, wheelchairRows: ['A'] },
  { id: 'mezz-left', label: 'Mezz Izq', area: 'mezz-left', rows: 'ABCDEFGH', cols: 6 },
  { id: 'mezz-center', label: 'Mezz Centro', area: 'mezz-center', rows: 'JKLMNOPQR', cols: 10, wheelchairRows: ['J'] },
  { id: 'mezz-right', label: 'Mezz Der', area: 'mezz-right', rows: 'ABCDEFGH', cols: 6 }
];

const CONFIG = window.SEAT_APP_CONFIG || {};
const seatIndex = new Map();
const occupiedSeats = new Set();
let selectedSeatId = null;
let supabaseClient = null;
let realtimeChannel = null;

const theaterMap = document.querySelector('#theaterMap');
const selectedSeatLabel = document.querySelector('#selectedSeatLabel');
const confirmButton = document.querySelector('#confirmButton');
const modal = document.querySelector('#reservationModal');
const closeModal = document.querySelector('#closeModal');
const modalSeatLabel = document.querySelector('#modalSeatLabel');
const reservationForm = document.querySelector('#reservationForm');
const formMessage = document.querySelector('#formMessage');
const submitButton = document.querySelector('#submitButton');
const toast = document.querySelector('#toast');
const connectionDot = document.querySelector('#connectionDot');
const connectionLabel = document.querySelector('#connectionLabel');
const connectionHelp = document.querySelector('#connectionHelp');

function buildSeatId(section, row, col) {
  return `${section.id}-${row}-${col}`;
}

function getSeatLabel(seat) {
  return `${seat.sectionLabel} · fila ${seat.row}, asiento ${seat.col}`;
}

function createSeat(section, row, col) {
  const id = buildSeatId(section, row, col);
  const isWheelchair = section.wheelchairRows?.includes(row) || false;
  const seat = { id, section: section.id, sectionLabel: section.label, row, col, isWheelchair };
  seatIndex.set(id, seat);

  const button = document.createElement('button');
  button.type = 'button';
  button.className = `seat${isWheelchair ? ' wheelchair' : ''}`;
  button.dataset.seatId = id;
  button.dataset.section = section.id;
  button.dataset.row = row;
  button.dataset.col = String(col);
  button.setAttribute('aria-label', getSeatLabel(seat));
  button.textContent = `${row}${col}`;
  button.addEventListener('click', () => selectSeat(id));
  return button;
}

function renderMap() {
  theaterMap.innerHTML = '';

  SECTIONS.forEach(renderSection);
}

function renderSection(section) {
  const card = document.createElement('article');
  card.className = 'section-card';
  card.style.gridArea = section.area;

  if (section.hasCabina) {
    const cabina = document.createElement('div');
    cabina.className = 'cabina';
    cabina.textContent = 'CABINA';
    card.appendChild(cabina);
  }

  const title = document.createElement('h3');
  title.textContent = section.label;
  card.appendChild(title);

  const grid = document.createElement('div');
  grid.className = 'seat-grid';
  grid.style.gridTemplateColumns = `repeat(${section.cols}, minmax(0, 1fr))`;

  section.rows.split('').forEach((row) => {
    for (let col = 1; col <= section.cols; col += 1) {
      grid.appendChild(createSeat(section, row, col));
    }
  });

  card.appendChild(grid);
  theaterMap.appendChild(card);
}

function selectSeat(id) {
  if (occupiedSeats.has(id)) return;

  selectedSeatId = selectedSeatId === id ? null : id;
  updateSeatStates();
}

function updateSeatStates() {
  document.querySelectorAll('.seat').forEach((button) => {
    const id = button.dataset.seatId;
    const isOccupied = occupiedSeats.has(id);
    const isSelected = selectedSeatId === id;
    button.classList.toggle('occupied', isOccupied);
    button.classList.toggle('selected', isSelected);
    button.disabled = isOccupied;
    button.setAttribute('aria-pressed', String(isSelected));
  });

  if (selectedSeatId) {
    selectedSeatLabel.textContent = getSeatLabel(seatIndex.get(selectedSeatId));
    confirmButton.disabled = false;
  } else {
    selectedSeatLabel.textContent = 'Ninguno';
    confirmButton.disabled = true;
  }
}

function setConnection(status, label, help) {
  connectionDot.className = `status-dot ${status}`;
  connectionLabel.textContent = label;
  connectionHelp.textContent = help;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  window.setTimeout(() => toast.classList.remove('show'), 3600);
}

function normalizeSeatRecord(record) {
  return `${record.section}-${record.row}-${record.col}`;
}

async function loadOccupiedSeats() {
  if (!supabaseClient) return;

  const { data, error } = await supabaseClient
    .from('seats')
    .select('section,row,col')
    .not('occupied_at', 'is', null);

  if (error) throw error;
  occupiedSeats.clear();
  data.forEach((seat) => occupiedSeats.add(normalizeSeatRecord(seat)));
  if (occupiedSeats.has(selectedSeatId)) selectedSeatId = null;
  updateSeatStates();
}

function subscribeToSeatChanges() {
  if (!supabaseClient) return;

  realtimeChannel = supabaseClient
    .channel('public:seats')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'seats' }, (payload) => {
      const record = payload.new?.id ? payload.new : payload.old;
      if (!record) return;
      const id = normalizeSeatRecord(record);
      if (payload.eventType === 'DELETE' || !payload.new?.occupied_at) {
        occupiedSeats.delete(id);
      } else {
        occupiedSeats.add(id);
      }
      if (occupiedSeats.has(selectedSeatId)) {
        selectedSeatId = null;
        showToast('Ese asiento acaba de ser ocupado por otra persona. Elige otro lugar.');
      }
      updateSeatStates();
    })
    .subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        setConnection('online', 'Sincronización activa', 'Los asientos ocupados se actualizan en tiempo real.');
      }
    });
}

function initSupabase() {
  if (!CONFIG.supabaseUrl || !CONFIG.supabaseAnonKey || !window.supabase) {
    setConnection('', 'Modo demostración', 'Configura Supabase para sincronización en vivo.');
    return;
  }

  supabaseClient = window.supabase.createClient(CONFIG.supabaseUrl, CONFIG.supabaseAnonKey);
  loadOccupiedSeats()
    .then(() => {
      setConnection('online', 'Conectado a Supabase', 'Cargando ocupación y escuchando cambios.');
      subscribeToSeatChanges();
    })
    .catch((error) => {
      console.error(error);
      setConnection('error', 'Error de conexión', 'Revisa URL, anon key, RLS y permisos de realtime.');
    });
}

async function reserveSeat({ name, email }) {
  const seat = seatIndex.get(selectedSeatId);
  if (!seat) throw new Error('Selecciona un asiento válido.');
  if (occupiedSeats.has(seat.id)) throw new Error('Ese asiento ya está ocupado.');

  if (!supabaseClient) {
    occupiedSeats.add(seat.id);
    return;
  }

  const { data, error } = await supabaseClient.rpc('reserve_seat', {
    seat_section: seat.section,
    seat_row: seat.row,
    seat_col: seat.col,
    guest_name: name,
    guest_email: email,
    wheelchair: seat.isWheelchair
  });

  if (error) throw error;
  if (!data) throw new Error('Ese asiento ya fue reservado por otra persona.');
  occupiedSeats.add(seat.id);
}

confirmButton.addEventListener('click', () => {
  if (!selectedSeatId) return;
  formMessage.textContent = '';
  modalSeatLabel.textContent = getSeatLabel(seatIndex.get(selectedSeatId));
  modal.showModal();
});

closeModal.addEventListener('click', () => modal.close());

reservationForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(reservationForm);
  const name = String(formData.get('guestName')).trim();
  const email = String(formData.get('guestEmail')).trim().toLowerCase();

  formMessage.textContent = '';
  submitButton.disabled = true;
  submitButton.textContent = 'Guardando...';

  try {
    await reserveSeat({ name, email });
    const reservedLabel = selectedSeatLabel.textContent;
    selectedSeatId = null;
    updateSeatStates();
    reservationForm.reset();
    modal.close();
    showToast(`${reservedLabel} confirmado. ¡Gracias!`);
  } catch (error) {
    formMessage.textContent = error.message || 'No se pudo reservar el asiento.';
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = 'Guardar reserva';
  }
});

window.addEventListener('beforeunload', () => {
  if (realtimeChannel) supabaseClient.removeChannel(realtimeChannel);
});

renderMap();
updateSeatStates();
initSupabase();
