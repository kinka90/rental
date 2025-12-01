import { auth, db } from "./firebase.js";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { ref, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const emailEl = document.getElementById('email');
const passEl = document.getElementById('password');
const loginBtn = document.getElementById('loginBtn');
const createBtn = document.getElementById('createBtn');
const logoutBtn = document.getElementById('logoutBtn');
const authBox = document.getElementById('authBox');
const adminArea = document.getElementById('adminArea');
const txTable = document.getElementById('txTable');
const totalIncome = document.getElementById('totalIncome');
const exportPdf = document.getElementById('exportPdf');

loginBtn.addEventListener('click', async ()=>{
  try{
    await signInWithEmailAndPassword(auth, emailEl.value, passEl.value);
  }catch(e){ alert(e.message); }
});

createBtn.addEventListener('click', async ()=>{
  try{
    await createUserWithEmailAndPassword(auth, emailEl.value, passEl.value);
    alert('Akun dibuat. Silakan login.');
  }catch(e){ alert(e.message); }
});

logoutBtn.addEventListener('click', async ()=>{
  await signOut(auth);
});

onAuthStateChanged(auth, user=>{
  if (user) {
    authBox.classList.add('d-none');
    adminArea.classList.remove('d-none');
    logoutBtn.classList.remove('d-none');
    loadTransactions();
  } else {
    authBox.classList.remove('d-none');
    adminArea.classList.add('d-none');
    logoutBtn.classList.add('d-none');
  }
});

function loadTransactions(){
  const txRef = ref(db, 'transactions/');
  onValue(txRef, snap=>{
    const data = snap.val() || {};
    let html = `<table class="table table-sm table-striped"><thead><tr><th>#</th><th>Motor</th><th>Penyewa</th><th>Periode</th><th>Total (Rp)</th><th>Status</th></tr></thead><tbody>`;
    let total=0; let i=0;
    for (const k in data){
      i++;
      const t = data[k];
      total += Number(t.total || 0);
      html += `<tr><td>${i}</td><td>${t.motorId}</td><td>${t.renterName} (${t.renterPhone})</td><td>${t.startAt} → ${t.endAt}</td><td>${Number(t.total).toLocaleString('id-ID')}</td><td>${t.status}</td></tr>`;
    }
    html += '</tbody></table>';
    txTable.innerHTML = html;
    totalIncome.innerText = 'Rp ' + total.toLocaleString('id-ID');
  });
}

exportPdf.addEventListener('click', async ()=>{
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.text('Laporan Transaksi - Sewa Motor', 10, 10);
  const rows = [];
  const txRef = ref(db, 'transactions/');
  // for demo we just grab current table text
  const txt = document.getElementById('txTable').innerText;
  doc.text(txt, 10, 20);
  doc.save('laporan-transaksi.pdf');
});
