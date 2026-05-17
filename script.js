// ========== KODE PENCARIAN ==========
const pencarianForm = document.getElementById("pencarianForm");
if (pencarianForm) {
  pencarianForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const query = document.querySelector(
      '#pencarianForm input[type="text"]',
    ).value;
    console.log("Mencari:", query);
    alert("Fitur pencarian sedang dalam pengembangan!");
  });
}

const btn = document.getElementById("btn");
if (btn) {
  btn.addEventListener("click", function () {
    const query = document.querySelector(
      '#pencarianForm input[type="text"]',
    ).value;
    console.log("Mencari:", query);
    alert("Fitur pencarian sedang dalam pengembangan!");
  });
}

console.log("✅ Script loaded successfully!");

// ========== KODE SUBSCRIBE (LENGKAP) ==========
const subscribeBtn = document.getElementById("subscribeBtn");
const emailInput = document.querySelector('.contact input[type="email"]');

// Array untuk menyimpan SEMUA subscriber
let subscribers = [];

// Load subscriber yang sudah ada dari localStorage
function loadSubscribers() {
  const stored = localStorage.getItem("subscribers");
  if (stored) {
    subscribers = JSON.parse(stored);
    console.log(`✅ Load ${subscribers.length} subscriber`);
  }
}

// Simpan SEMUA subscriber ke localStorage
function saveSubscribers() {
  localStorage.setItem("subscribers", JSON.stringify(subscribers));
}

// Fungsi handle subscription (YANG SUDAH BENAR)
function handleSubscription() {
  if (!emailInput) {
    console.error("Elemen emailInput tidak ditemukan!");
    return;
  }

  const email = emailInput.value.trim();

  if (email === "") {
    alert("Masukkan alamat email Anda terlebih dahulu!");
    return;
  }

  if (!email.includes("@") || !email.includes(".")) {
    alert("Masukkan alamat email yang valid!");
    return;
  }

  // Cek apakah email sudah terdaftar
  if (subscribers.some((s) => s.email === email)) {
    alert(
      "Email ini sudah terdaftar! Terima kasih sudah mendukung pendidikan Indonesia.",
    );
    emailInput.value = "";
    return;
  }

  // Tambahkan email ke array subscribers
  subscribers.push({
    email: email,
    subscribedAt: new Date().toISOString(),
  });
  saveSubscribers();

  alert(
    `Selamat ${email}! Kamu adalah salah satu manusia yang sudah mau berkontribusi untuk pendidikan di Indonesia!`,
  );

  emailInput.value = "";
}

// Pasang event listener jika elemen tersedia
if (subscribeBtn) {
  subscribeBtn.addEventListener("click", handleSubscription);
}

if (emailInput) {
  emailInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      handleSubscription();
    }
  });
}

// ========== PANEL ADMIN (TANPA EMAILJS DULU) ==========
function createAdminPanel() {
  // Cek apakah URL mengandung ?admin=true
  if (window.location.search.includes("admin=true")) {
    console.log("🔧 Mode admin aktif, membuat panel...");

    const panel = document.createElement("div");
    panel.style.position = "fixed";
    panel.style.bottom = "20px";
    panel.style.right = "20px";
    panel.style.backgroundColor = "#fff";
    panel.style.border = "2px solid #fc0038";
    panel.style.borderRadius = "10px";
    panel.style.padding = "15px";
    panel.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
    panel.style.zIndex = "9999";
    panel.style.width = "320px";
    panel.style.fontFamily = "system-ui, sans-serif";

    panel.innerHTML = `
      <h3 style="margin:0 0 10px 0; color:#fc0038;">📢 Admin Panel</h3>
      <p style="font-size:12px; margin-bottom:10px;">
        Subscriber: <strong id="subscriberCount">${subscribers.length}</strong>
      </p>
      
      <div style="margin-bottom: 15px;">
        <label style="font-size:12px; display:block; margin-bottom:5px;">Judul Artikel Baru:</label>
        <input type="text" id="postTitle" placeholder="Contoh: Cara Belajar Efektif" style="width:100%; padding:8px; box-sizing:border-box;">
      </div>
      
      <div style="margin-bottom: 15px;">
        <label style="font-size:12px; display:block; margin-bottom:5px;">URL Artikel:</label>
        <input type="text" id="postUrl" placeholder="https://pedulipendidikan.my.id/artikel/..." style="width:100%; padding:8px; box-sizing:border-box;">
      </div>
      
      <button id="sendNotifyBtn" style="width:100%; padding:10px; background:#fc0038; color:white; border:none; border-radius:5px; cursor:pointer; margin-bottom:10px;">
        📧 Kirim Notifikasi (Simulasi)
      </button>
      
      <button id="closeAdminBtn" style="width:100%; padding:8px; background:#ccc; border:none; border-radius:5px; cursor:pointer;">
        Tutup
      </button>
      
      <hr style="margin: 15px 0;">
      
      <details>
        <summary style="cursor:pointer; font-size:13px;">📋 Daftar Email (${subscribers.length})</summary>
        <div style="max-height:150px; overflow-y:auto; font-size:12px; margin-top:8px; padding:5px; background:#f9f9f9; border-radius:5px;">
          ${
            subscribers.length > 0
              ? subscribers
                  .map((s) => `<div style="padding:3px 0;">📧 ${s.email}</div>`)
                  .join("")
              : "<i style='color:#999;'>Belum ada subscriber</i>"
          }
        </div>
      </details>
    `;

    document.body.appendChild(panel);

    // Tombol kirim notifikasi (versi simulasi dulu)
    const sendBtn = document.getElementById("sendNotifyBtn");
    if (sendBtn) {
      sendBtn.addEventListener("click", function () {
        const title = document.getElementById("postTitle").value;
        const url = document.getElementById("postUrl").value;

        if (!title || !url) {
          alert("❌ Judul dan URL harus diisi!");
          return;
        }

        if (subscribers.length === 0) {
          alert("❌ Belum ada subscriber. Silakan subscribe dulu!");
          return;
        }

        // TAMPILKAN DATA YANG AKAN DIKIRIM (simulasi)
        let message = `📢 SIMULASI NOTIFIKASI\n\n`;
        message += `Judul: ${title}\n`;
        message += `URL: ${url}\n\n`;
        message += `Akan dikirim ke ${subscribers.length} subscriber:\n`;
        subscribers.forEach((s, i) => {
          message += `${i + 1}. ${s.email}\n`;
        });
        message += `\n✅ (Ini masih simulasi. Email belum benar-benar terkirim)`;

        alert(message);
        console.log("Data yang akan dikirim:", { title, url, subscribers });
      });
    }

    // Tombol tutup
    const closeBtn = document.getElementById("closeAdminBtn");
    if (closeBtn) {
      closeBtn.addEventListener("click", function () {
        panel.remove();
      });
    }
  }
}

// ========== MEMUAT DATA & MENJALANKAN PANEL ==========
loadSubscribers();
createAdminPanel();

console.log("✅ Semua kode berjalan dengan baik!");
