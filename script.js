// ============================================
// PENGATURAN — ubah bagian ini sesuai acaramu
// ============================================
const DATA = {
  tahun: 2026,
  tema: '"Glory to Glory"',
  tanggalISO: '2026-12-25T18:00:00+07:00', // format: TAHUN-BULAN-TANGGALTJAM:MENIT:DETIK+07:00 (jam 24 format, WIB)
  tanggalTeks: 'Jumat, 25 Desember 2026',
  waktuTeks: '18.00 WIB - selesai',
  tempat: 'GPdI Agape Purwokerto, Klenteng, Kedungrandu, Patikraja, Banyumas Regency, Central Java 53171',
  linkMaps: 'https://maps.app.goo.gl/GDah51ZpWUZ8Xo3r5',
  penyelenggara: 'Panitia Natal Keluarga Besar',
  instagram: 'gpdiagapepurwokerto' // isi username saja, tanpa @ (kosongkan '' kalau tidak mau ditampilkan)
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
$('btnMaps').href = DATA.linkMaps;
$('penyelenggara').textContent = DATA.penyelenggara;

// Tombol Instagram
const ig = DATA.instagram.replace('@', '').trim();
if (ig) {
  $('btnInstagram').href = `https://instagram.com/${ig}`;
  $('btnInstagram').textContent = `📷 @${ig}`;
} else {
  $('btnInstagram').style.display = 'none';
}

// Nama tamu dari link, contoh: index.html?to=Budi%20Santoso
const params = new URLSearchParams(window.location.search);
const namaTamu = params.get('to');
if (namaTamu) {
  $('namaTamu').textContent = namaTamu;
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
// EFEK BINTANG & SALJU
// ============================================
const canvas = $('snow');
const ctx = canvas.getContext('2d');
let flakes = [];
let bintang = [];

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

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  buatSalju();
  buatBintang();
}
window.addEventListener('resize', resize);
resize();

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

function animasi() {
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

  requestAnimationFrame(animasi);
}
animasi();