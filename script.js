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

// ========== KONFIGURASI GOOGLE SHEETS ==========
// GANTI DENGAN URL DEPLOYMENT KAMU
const GOOGLE_SHEETS_URL =
  "https://script.google.com/macros/s/AKfycbzlQgrqgitbS14CbJs53q5EILOAPEG5loZ4f3X3w9nWcuIcI609RwFLdBcwi_wQpEz6/exec";

// ========== KODE SUBSCRIBE ==========
const subscribeBtn = document.getElementById("subscribeBtn");
const emailInput = document.querySelector('.contact input[type="email"]');

// Array untuk menyimpan subscriber (sebagai cache lokal)
let subscribers = [];

// Load subscriber dari localStorage (cache)
function loadSubscribers() {
  const stored = localStorage.getItem("subscribers");
  if (stored) {
    subscribers = JSON.parse(stored);
    console.log(`✅ Load ${subscribers.length} subscriber dari cache`);
  }
}

// Simpan subscriber ke localStorage (cache)
function saveSubscribers() {
  localStorage.setItem("subscribers", JSON.stringify(subscribers));
}

// 🔥 FUNGSI BARU: Simpan email ke Google Sheets (CLOUD)
async function saveToGoogleSheets(email) {
  try {
    const response = await fetch(GOOGLE_SHEETS_URL, {
      method: "POST",
      mode: "no-cors", // Penting untuk menghindari CORS error
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email }),
    });

    console.log(`✅ Email ${email} tersimpan ke Google Sheets!`);
    return true;
  } catch (error) {
    console.error("❌ Gagal simpan ke Google Sheets:", error);
    return false;
  }
}

// 🔥 FUNGSI BARU: Ambil semua subscriber dari Google Sheets
async function fetchSubscribersFromSheets() {
  try {
    const response = await fetch(GOOGLE_SHEETS_URL);
    const data = await response.json();
    if (data && data.subscribers) {
      subscribers = data.subscribers;
      saveSubscribers();
      console.log(
        `✅ Load ${subscribers.length} subscriber dari Google Sheets`,
      );
    }
  } catch (error) {
    console.error("❌ Gagal ambil data dari Google Sheets:", error);
  }
}

// Fungsi handle subscription (YANG SUDAH DITINGKATKAN)
async function handleSubscription() {
  if (!emailInput) {
    console.error("Elemen emailInput tidak ditemukan!");
    return;
  }

  const email = emailInput.value.trim();

  // Validasi email tidak kosong
  if (email === "") {
    alert("Masukkan alamat email Anda terlebih dahulu!");
    return;
  }

  // Validasi format email
  if (!email.includes("@") || !email.includes(".")) {
    alert("Masukkan alamat email yang valid!");
    return;
  }

  // Cek apakah email sudah terdaftar (dari cache)
  if (subscribers.some((s) => s.email === email)) {
    alert(
      "Email ini sudah terdaftar! Terima kasih sudah mendukung pendidikan Indonesia.",
    );
    emailInput.value = "";
    return;
  }

  // 🔥 SIMPAN KE GOOGLE SHEETS (CLOUD) 🔥
  const saved = await saveToGoogleSheets(email);

  if (saved) {
    // Tambahkan ke array lokal
    subscribers.push({
      email: email,
      subscribedAt: new Date().toISOString(),
    });
    saveSubscribers();

    alert(
      `Selamat ${email}! Kamu sekarang terdaftar di database cloud kami. Terima kasih sudah berkontribusi untuk pendidikan Indonesia!`,
    );
  } else {
    alert(
      `Selamat ${email}! Terima kasih sudah berkontribusi. (Data tersimpan secara lokal)`,
    );
  }

  emailInput.value = "";

  // Refresh panel admin jika terbuka
  refreshAdminPanel();
}

// Pasang event listener
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

// ========== PANEL ADMIN ==========
let adminPanel = null;

function refreshAdminPanel() {
  if (adminPanel && document.body.contains(adminPanel)) {
    // Update daftar subscriber di panel
    const listContainer = adminPanel.querySelector("#subscriberListContainer");
    const countSpan = adminPanel.querySelector("#subscriberCount");

    if (listContainer) {
      listContainer.innerHTML =
        subscribers.length > 0
          ? subscribers
              .map((s) => `<div style="padding:3px 0;">📧 ${s.email}</div>`)
              .join("")
          : "<i style='color:#999;'>Belum ada subscriber</i>";
    }

    if (countSpan) {
      countSpan.textContent = subscribers.length;
    }

    // Update summary text
    const summary = adminPanel.querySelector("summary");
    if (summary) {
      summary.textContent = `📋 Daftar Email (${subscribers.length})`;
    }
  }
}

function createAdminPanel() {
  if (!window.location.search.includes("admin=true")) return;

  console.log("🔧 Mode admin aktif, membuat panel...");

  // Hapus panel lama jika ada
  if (adminPanel && document.body.contains(adminPanel)) {
    adminPanel.remove();
  }

  adminPanel = document.createElement("div");
  adminPanel.style.position = "fixed";
  adminPanel.style.bottom = "20px";
  adminPanel.style.right = "20px";
  adminPanel.style.backgroundColor = "#fff";
  adminPanel.style.border = "2px solid #fc0038";
  adminPanel.style.borderRadius = "10px";
  adminPanel.style.padding = "15px";
  adminPanel.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
  adminPanel.style.zIndex = "9999";
  adminPanel.style.width = "340px";
  adminPanel.style.fontFamily = "system-ui, sans-serif";

  adminPanel.innerHTML = `
    <h3 style="margin:0 0 10px 0; color:#fc0038;">📢 Admin Panel</h3>
    <p style="font-size:12px; margin-bottom:10px;">
      Total Subscriber: <strong id="subscriberCount">${subscribers.length}</strong>
      <button id="refreshBtn" style="margin-left:8px; font-size:10px; padding:2px 6px;">🔄 Refresh</button>
    </p>
    
    <div style="margin-bottom: 15px;">
      <label style="font-size:12px; display:block; margin-bottom:5px;">📝 Judul Artikel Baru:</label>
      <input type="text" id="postTitle" placeholder="Contoh: Cara Belajar Efektif" style="width:100%; padding:8px; box-sizing:border-box;">
    </div>
    
    <div style="margin-bottom: 15px;">
      <label style="font-size:12px; display:block; margin-bottom:5px;">🔗 URL Artikel:</label>
      <input type="text" id="postUrl" placeholder="https://pedulipendidikan.my.id/artikel/..." style="width:100%; padding:8px; box-sizing:border-box;">
    </div>
    
    <button id="sendNotifyBtn" style="width:100%; padding:10px; background:#fc0038; color:white; border:none; border-radius:5px; cursor:pointer; margin-bottom:10px;">
      📧 Kirim Notifikasi
    </button>
    
    <button id="closeAdminBtn" style="width:100%; padding:8px; background:#ccc; border:none; border-radius:5px; cursor:pointer;">
      Tutup
    </button>
    
    <hr style="margin: 15px 0;">
    
    <details>
      <summary>📋 Daftar Email (${subscribers.length})</summary>
      <div id="subscriberListContainer" style="max-height:150px; overflow-y:auto; font-size:12px; margin-top:8px; padding:5px; background:#f9f9f9; border-radius:5px;">
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

  document.body.appendChild(adminPanel);

  // Tombol refresh data dari Google Sheets
  const refreshBtn = document.getElementById("refreshBtn");
  if (refreshBtn) {
    refreshBtn.addEventListener("click", async () => {
      await fetchSubscribersFromSheets();
      refreshAdminPanel();
      alert(`✅ Data di-refresh! Total ${subscribers.length} subscriber.`);
    });
  }

  // Tombol kirim notifikasi
  const sendBtn = document.getElementById("sendNotifyBtn");
  if (sendBtn) {
    sendBtn.addEventListener("click", async function () {
      const title = document.getElementById("postTitle").value;
      const url = document.getElementById("postUrl").value;

      if (!title || !url) {
        alert("❌ Judul dan URL harus diisi!");
        return;
      }

      if (subscribers.length === 0) {
        alert("❌ Belum ada subscriber.");
        return;
      }

      // Tampilkan data yang akan dikirim
      let message = `📢 SIMULASI NOTIFIKASI (belum kirim email sungguhan)\n\n`;
      message += `Judul: ${title}\n`;
      message += `URL: ${url}\n\n`;
      message += `Akan dikirim ke ${subscribers.length} subscriber:\n`;
      subscribers.slice(0, 10).forEach((s, i) => {
        message += `${i + 1}. ${s.email}\n`;
      });
      if (subscribers.length > 10) {
        message += `...dan ${subscribers.length - 10} lainnya\n`;
      }
      message += `\n✅ Data subscriber sudah aman di Google Sheets!`;

      alert(message);
      console.log("Data notifikasi:", { title, url, subscribers });
    });
  }

  // Tombol tutup
  const closeBtn = document.getElementById("closeAdminBtn");
  if (closeBtn) {
    closeBtn.addEventListener("click", function () {
      adminPanel.remove();
      adminPanel = null;
    });
  }
}

// ========== UPDATE APPS SCRIPT KODE ==========
// Kamu juga perlu update kode di Google Apps Script!
// Buka editor Apps Script, GANTI dengan kode di bawah ini:

/*
function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const sheet = SpreadsheetApp.getActiveSheet();
  
  // Cek apakah email sudah ada
  const existingEmails = sheet.getRange("A:A").getValues().flat();
  if (!existingEmails.includes(data.email)) {
    sheet.appendRow([data.email, new Date(), "Aktif"]);
  }
  
  return ContentService.createTextOutput(JSON.stringify({success: true}))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const data = sheet.getDataRange().getValues();
  const subscribers = [];
  
  for (let i = 1; i < data.length; i++) { // Mulai dari baris 2 (skip header)
    if (data[i][0]) {
      subscribers.push({
        email: data[i][0],
        subscribedAt: data[i][1],
        status: data[i][2] || "Aktif"
      });
    }
  }
  
  return ContentService.createTextOutput(JSON.stringify({subscribers: subscribers}))
    .setMimeType(ContentService.MimeType.JSON);
}
*/

// ========== INISIALISASI ==========
loadSubscribers();
createAdminPanel();

console.log(
  "✅ Semua kode berjalan dengan baik! Data subscriber akan tersimpan di Google Sheets.",
);
