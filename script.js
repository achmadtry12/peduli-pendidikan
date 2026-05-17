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

addEventListener("DOMContentLoaded", function () {
  const fontSizeToggle = document.getElementById("fontSizeToggle");
  fontSizeToggle.addEventListener("click", function () {
    document.body.classList.toggle("large-font");
  });
});
