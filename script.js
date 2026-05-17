const pencarianForm = document.getElementById("pencarianForm");

pencarianForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const query = document.querySelector(
    '#pencarianForm input[type="text"]',
  ).value;
  // Add your search logic here
});

const btn = document.getElementById("btn");
btn.addEventListener("click", function () {
  const query = document.querySelector(
    '#pencarianForm input[type="text"]',
  ).value;
  // Add your search logic here
});

console.log("Script loaded successfully!");

// Ambil elemen yang diperlukan
const subscribeBtn = document.getElementById("subscribeBtn");
const emailInput = document.querySelector('.contact input[type="email"]');

// Fungsi untuk menangani subscription
function handleSubscription() {
  const email = emailInput.value.trim();

  // Validasi email tidak kosong
  if (email === "") {
    alert("Masukkan alamat email Anda terlebih dahulu!");
    return;
  }

  // Validasi format email sederhana
  if (!email.includes("@") || !email.includes(".")) {
    alert("Masukkan alamat email yang valid!");
    return;
  }

  // Jika valid, simpan atau kirim data
  alert(
    `Selamat ${email} kamu adalah salah satu manusia yang sudah mau berkontribusi untuk pendidikan di Indonesia!`,
  );

  // Optional: Kosongkan input setelah berhasil
  emailInput.value = "";

  // Optional: Simpan ke localStorage
  localStorage.setItem("subscriberEmail", email);
}

// Tambahkan event listener ke tombol
subscribeBtn.addEventListener("click", handleSubscription);

// Optional: Tekan Enter di input juga bisa subscribe
emailInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    handleSubscription();
  }
});

// ========== INISIALISASI EMAILJS ==========
// GANTI DENGAN PUBLIC KEY DARI MENU INTEGRATION
emailjs.init("MASUKKAN_PUBLIC_KEY_KAMU"); // Contoh: "user_abc123xyz"

// Fungsi kirim notifikasi ke semua subscriber
async function notifyAllSubscribers(postTitle, postUrl) {
  let successCount = 0;

  for (const subscriber of subscribers) {
    // Buat link unsubscribe untuk setiap email
    const unsubscribeUrl = `https://pedulipendidikan.my.id/unsubscribe.html?email=${encodeURIComponent(subscriber.email)}`;

    try {
      await emailjs.send(
        "service_zrk6scd", // Ganti dengan Service ID kamu
        "template_7nxrf3l", // Ganti dengan Template ID kamu
        {
          name: "Sahabat Peduli Pendidikan", // Atau bisa pakai nama subscriber
          to_email: subscriber.email,
          postTitle: postTitle,
          postUrl: postUrl,
          unsubscribeUrl: unsubscribeUrl,
        },
      );
      successCount++;
      console.log(`✅ Email terkirim ke: ${subscriber.email}`);
    } catch (error) {
      console.error(`❌ Gagal kirim ke ${subscriber.email}:`, error);
    }
  }

  alert(
    `✅ Notifikasi terkirim ke ${successCount} dari ${subscribers.length} subscriber!`,
  );
  return successCount;
}

// ========== KODE UNTUK PANEL ADMIN ==========
// Fungsi untuk membuat panel admin yang muncul di pojok kanan bawah
function createAdminPanel() {
  // Cek apakah URL mengandung ?admin=true
  if (window.location.search.includes("admin=true")) {
    // Buat elemen div untuk panel
    const panel = document.createElement("div");
    panel.style.position = "fixed";
    panel.style.bottom = "20px";
    panel.style.right = "20px";
    panel.style.backgroundColor = "#fff";
    panel.style.border = "2px solid #fc0038"; // Warna sesuai tema Anda
    panel.style.borderRadius = "10px";
    panel.style.padding = "15px";
    panel.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
    panel.style.zIndex = "9999";
    panel.style.width = "300px";
    panel.style.fontFamily = "system-ui, sans-serif";

    // Isi konten panel
    panel.innerHTML = `
      <h3 style="margin:0 0 10px 0; color:#fc0038;">📢 Admin: Kirim Notifikasi</h3>
      <p style="font-size:12px; margin-bottom:10px;">Subscriber tersimpan: <strong id="subscriberCount">0</strong></p>
      <input type="text" id="postTitle" placeholder="Judul Artikel Baru" style="width:100%; margin-bottom:10px; padding:8px; box-sizing:border-box;">
      <input type="text" id="postUrl" placeholder="URL Artikel (contoh: https://...)" style="width:100%; margin-bottom:10px; padding:8px; box-sizing:border-box;">
      <button id="sendNotifyBtn" style="width:100%; padding:8px; background:#fc0038; color:white; border:none; border-radius:5px; cursor:pointer;">🚀 Kirim Notifikasi</button>
      <button id="closeAdminBtn" style="width:100%; margin-top:10px; padding:8px; background:#ccc; border:none; border-radius:5px; cursor:pointer;">Tutup</button>
      <hr style="margin: 15px 0;">
      <details>
        <summary>📋 Lihat Daftar Email (${subscribers ? subscribers.length : 0})</summary>
        <div style="max-height:150px; overflow-y:auto; font-size:12px; margin-top:8px;" id="subscriberList">
          ${
            subscribers && subscribers.length > 0
              ? subscribers.map((s) => `<div>📧 ${s.email}</div>`).join("")
              : "<i>Belum ada subscriber</i>"
          }
        </div>
      </details>
    `;

    // Tambahkan panel ke body halaman
    document.body.appendChild(panel);

    // Update jumlah subscriber di panel
    if (subscribers) {
      const countSpan = document.getElementById("subscriberCount");
      if (countSpan) countSpan.textContent = subscribers.length;
    }

    // Event listener untuk tombol kirim
    const sendBtn = document.getElementById("sendNotifyBtn");
    if (sendBtn) {
      sendBtn.addEventListener("click", async function () {
        const title = document.getElementById("postTitle").value;
        const url = document.getElementById("postUrl").value;

        if (!title || !url) {
          alert("❌ Judul dan URL harus diisi!");
          return;
        }

        if (!subscribers || subscribers.length === 0) {
          alert(
            "❌ Belum ada subscriber. Tambahkan email dulu lewat form langganan.",
          );
          return;
        }

        // Panggil fungsi kirim notifikasi (yang akan kita integrasikan nanti)
        if (typeof notifyAllSubscribers === "function") {
          await notifyAllSubscribers(title, url);
        } else {
          alert(
            "⚠️ Fungsi notifikasi belum siap. Pastikan EmailJS sudah di-setup.\n\nSementara ini, subscriber tersimpan di browser Anda.",
          );
          console.log("Data subscriber:", subscribers);
        }
      });
    }

    // Event listener untuk tombol tutup
    const closeBtn = document.getElementById("closeAdminBtn");
    if (closeBtn) {
      closeBtn.addEventListener("click", function () {
        panel.remove();
      });
    }
  }
}

// Panggil fungsi admin panel saat halaman dimuat
// Pastikan fungsi ini dipanggil SETELAH data subscribers dimuat
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", createAdminPanel);
} else {
  createAdminPanel();
}

addEventListener("DOMContentLoaded", function () {
  const fontSizeToggle = document.getElementById("fontSizeToggle");
  fontSizeToggle.addEventListener("click", function () {
    document.body.classList.toggle("large-font");
  });
});
