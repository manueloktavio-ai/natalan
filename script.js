// ============================================
// PENGATURAN — ubah bagian ini sesuai acaramu
// ============================================
const DATA = {
  tahun: 2026,
  tema: '"Damai Natal di Hati Kita"',
  tanggalISO: '2026-12-25T18:00:00',      // format: TAHUN-BULAN-TANGGALTJAM:MENIT:DETIK
  tanggalTeks: 'Jumat, 25 Desember 2026',
  waktuTeks: '18.00 WIB - selesai',
  tempat: 'Gereja / Rumah Keluarga, Jl. Contoh No. 1, Purbalingga',
  dresscode: 'Merah, Hijau, atau Putih',
  linkMaps: 'https://maps.google.com',
  penyelenggara: 'Panitia Natal Keluarga Besar',
  nomorWA: '6281234567890',               // awali dengan 62, tanpa + atau 0
  rundown: [
    { jam: '18.00', acara: 'Registrasi & ramah tamah' },
    { jam: '18.30', acara: 'Ibadah / doa Natal' },
    { jam: '19.30', acara: 'Makan malam bersama' },
    { jam: '20.30', acara: 'Tukar kado & hiburan' },
    { jam: '21.30', acara: 'Foto bersama & penutup' }
  ]
};

// ============================================
// ISI DATA KE HALAMAN
// ============================================
const $ = (id) => document.getElementById(id);

$('tahun').textContent = DATA.tahun;
$('tema').textContent = DATA.tema;
$('tanggal').textContent = DATA.tanggalTeks;
$('waktu').textContent = DATA.waktuTeks;
$('tempat').textContent = DATA.tempat;
$('dresscode').textContent = 'Dress code: ' + DATA.dresscode;
$('btnMaps').href = DATA.linkMaps;
$('penyelenggara').textContent = DATA.penyelenggara;

$('rundown').innerHTML = DATA.rundown
  .map((r) => `<li><b>${r.jam}</b><span>${r.acara}</span></li>`)
  .join('');

// Nama tamu dari link, contoh: index.html?to=Budi%20Santoso
const params = new URLSearchParams(window.location.search);
const namaTamu = params.get('to');
if (namaTamu) {
  $('namaTamu').textContent = namaTamu;
  $('inputNama').value = namaTamu;
}

// ============================================
// BUKA UNDANGAN
// ============================================
$('btnBuka').addEventListener('click', () => {
  $('cover').classList.add('keluar');
  $('isi').classList.remove('hidden');
  window.scrollTo(0, 0);
  setTimeout(() => ($('cover').style.display = 'none'), 900);
  setTimeout(munculkanKartu, 300);
});

// Animasi kartu muncul saat di-scroll
function munculkanKartu() {
  const kartu = document.querySelectorAll('.card');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('muncul');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  kartu.forEach((k) => obs.observe(k));
}

// ============================================
// HITUNG MUNDUR
// ============================================
function updateCountdown() {
  const selisih = new Date(DATA.tanggalISO).getTime() - Date.now();

  if (selisih <= 0) {
    ['hari', 'jam', 'menit', 'detik'].forEach((id) => ($(id).textContent = '0'));
    return;
  }

  $('hari').textContent = Math.floor(selisih / 86400000);
  $('jam').textContent = Math.floor((selisih / 3600000) % 24);
  $('menit').textContent = Math.floor((selisih / 60000) % 60);
  $('detik').textContent = Math.floor((selisih / 1000) % 60);
}
updateCountdown();
setInterval(updateCountdown, 1000);

// ============================================
// RSVP LEWAT WHATSAPP
// ============================================
$('formRsvp').addEventListener('submit', (e) => {
  e.preventDefault();

  const nama = $('inputNama').value.trim();
  const hadir = $('inputHadir').value;
  const jumlah = $('inputJumlah').value;
  const pesan = $('inputPesan').value.trim();

  let teks = `Halo, saya *${nama}*.\n` +
             `Konfirmasi Natal ${DATA.tahun}: *${hadir}*`;
  if (hadir === 'Hadir') teks += ` (${jumlah} orang)`;
  if (pesan) teks += `\nPesan: ${pesan}`;

  window.open(`https://wa.me/${DATA.nomorWA}?text=${encodeURIComponent(teks)}`, '_blank');
});

// ============================================
// BAGIKAN UNDANGAN
// ============================================
$('btnBagikan').addEventListener('click', async () => {
  // buang ?to=Nama supaya nama tamu tidak ikut terbagikan
  const url = window.location.href.split('?')[0];
  const judul = `Undangan Natal ${DATA.tahun}`;
  const teks = `${judul}\n${DATA.tanggalTeks}, ${DATA.waktuTeks}\n${DATA.tempat}`;

  if (navigator.share) {
    try {
      await navigator.share({ title: judul, text: teks, url });
    } catch (err) { /* dibatalkan pengguna */ }
  } else {
    window.open(`https://wa.me/?text=${encodeURIComponent(teks + '\n' + url)}`, '_blank');
  }
});

// ============================================
// EFEK SALJU
// ============================================
const canvas = $('snow');
const ctx = canvas.getContext('2d');
let flakes = [];

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

function buatSalju() {
  const jumlah = window.innerWidth < 600 ? 50 : 100;
  flakes = Array.from({ length: jumlah }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 3 + 1,
    kecepatan: Math.random() * 1 + 0.5,
    goyang: Math.random() * Math.PI * 2
  }));
}
buatSalju();

// Bintang berkelip (putih dan emas)
let bintang = [];

function buatBintang() {
  const jumlah = window.innerWidth < 600 ? 90 : 180;
  bintang = Array.from({ length: jumlah }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.4 + 0.3,
    fase: Math.random() * Math.PI * 2,
    laju: Math.random() * 0.03 + 0.01,
    emas: Math.random() < 0.2
  }));
}
buatBintang();
window.addEventListener('resize', buatBintang);

function gambarBintang() {
  bintang.forEach((b) => {
    b.fase += b.laju;
    const alpha = 0.3 + 0.7 * Math.abs(Math.sin(b.fase));
    ctx.fillStyle = b.emas
      ? `rgba(245,197,66,${alpha})`
      : `rgba(255,255,255,${alpha})`;
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
    ctx.fill();
  });
}

function animasiSalju() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  gambarBintang();
  ctx.fillStyle = 'rgba(255,255,255,0.85)';

  flakes.forEach((f) => {
    f.y += f.kecepatan;
    f.goyang += 0.02;
    f.x += Math.sin(f.goyang) * 0.6;

    if (f.y > canvas.height) {
      f.y = -5;
      f.x = Math.random() * canvas.width;
    }

    ctx.beginPath();
    ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
    ctx.fill();
  });

  requestAnimationFrame(animasiSalju);
}
animasiSalju();