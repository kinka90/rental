import { db } from "./firebase.js";
import { ref, onValue, update, push, set } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const motorList = document.getElementById("motorList");
const rentModal = new bootstrap.Modal(document.getElementById('rentModal'));
const rentForm = document.getElementById('rentForm');
const estPrice = document.getElementById('estPrice');

let currentMotor = null;

// listen motors
const motorRef = ref(db, 'motors/');
onValue(motorRef, snap => {
  motorList.innerHTML = '';
  const data = snap.val() || {};
  for (const id in data) {
    const m = data[id];
    const status = m.status || 'available';
    const cls = status === 'available' ? 'available' : 'rented';
    motorList.innerHTML += `
      <div class="col-md-4">
        <div class="card p-3 ${cls}">
          <img src="${m.image || 'https://picsum.photos/seed/' + id + '/400/200'}" class="w-100 motor-img mb-2" />
          <h5>${m.name}</h5>
          <p class="small">Plat: ${m.plate || '-'}</p>
          <p>Status: <strong>${status}</strong></p>
          <div class="d-flex gap-2">
            <button class="btn btn-primary btn-sm" ${status!=='available' ? 'disabled' : ''} data-id="${id}" onclick="openRentForm('${id}')">Sewa</button>
            <button class="btn btn-danger btn-sm" ${status==='available' ? 'disabled' : ''} onclick="returnMotor('${id}')">Kembalikan</button>
          </div>
        </div>
      </div>
    `;
  }
});

// open rent modal
window.openRentForm = function(id) {
  currentMotor = id;
  document.getElementById('motorId').value = id;
  document.getElementById('renterName').value = '';
  document.getElementById('renterPhone').value = '';
  document.getElementById('startAt').value = '';
  document.getElementById('endAt').value = '';
  document.getElementById('pricePerHour').value = 5000;
  estPrice.value = '';
  rentModal.show();
}

// estimate price
document.getElementById('pricePerHour').addEventListener('input', calcEstimate);
document.getElementById('startAt').addEventListener('change', calcEstimate);
document.getElementById('endAt').addEventListener('change', calcEstimate);

function calcEstimate(){
  const start = new Date(document.getElementById('startAt').value);
  const end = new Date(document.getElementById('endAt').value);
  const p = Number(document.getElementById('pricePerHour').value || 0);
  if (!isNaN(start) && !isNaN(end) && end > start) {
    const diff = (end - start) / (1000*60*60); // hours
    const price = Math.ceil(diff) * p;
    estPrice.value = price.toLocaleString('id-ID');
  } else {
    estPrice.value = '';
  }
}

// submit rent
rentForm.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const id = currentMotor;
  const name = document.getElementById('renterName').value.trim();
  const phone = document.getElementById('renterPhone').value.trim();
  const start = document.getElementById('startAt').value;
  const end = document.getElementById('endAt').value;
  const p = Number(document.getElementById('pricePerHour').value || 0);
  if (!id || !name || !phone || !start || !end) return alert('Lengkapi form.');

  const s = new Date(start), en = new Date(end);
  const hours = Math.ceil((en - s) / (1000*60*60));
  const total = hours * p;

  // create transaction and update motor status
  const txRef = push(ref(db, 'transactions'));
  await set(txRef, {
    motorId: id,
    renterName: name,
    renterPhone: phone,
    startAt: start,
    endAt: end,
    pricePerHour: p,
    hours: hours,
    total: total,
    createdAt: new Date().toISOString(),
    status: 'ongoing'
  });

  await update(ref(db, `motors/${id}`), { status: 'rented' });

  rentModal.hide();

  // open WhatsApp with prefilled message (user will send)
  const msg = encodeURIComponent(
    `Konfirmasi Sewa Motor\nMotor: ${id} \nPenyewa: ${name}\nMulai: ${start}\nAkhir: ${end}\nTotal: Rp ${total.toLocaleString('id-ID')}`
  );
  window.open('https://wa.me/' + phone.replace(/[^0-9]/g,'') + '?text=' + msg, '_blank');
});

// return motor (set available, mark tx ended)
window.returnMotor = async function(id){
  // find ongoing tx for motor
  const txSnap = await (await fetch('https://jsonplaceholder.typicode.com/posts')).json(); // dummy to avoid CORS in static demo if DB not configured
  // in real use, we update DB:
  try {
    await update(ref(db, `motors/${id}`), { status: 'available' });
    // mark the transaction as finished - in real firebase you should find and update the tx
    alert('Motor dikembalikan (di demo: update status saja).');
  } catch(err){
    alert('Gagal mengembalikan: '+err);
  }
}
