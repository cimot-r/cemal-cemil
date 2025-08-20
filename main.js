let keranjang = [];

function tambahItem() {
  const item = "Bakso Bakar Rp2.500";
  keranjang.push(item);

  renderKeranjang();
}

function renderKeranjang() {
  const list = document.getElementById("keranjang");
  list.innerHTML = "";
  keranjang.forEach((item, i) => {
    const li = document.createElement("li");
    li.textContent = item;
    list.appendChild(li);
  });
}

// Daftarkan service worker untuk PWA
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js")
    .then(() => console.log("Service Worker terdaftar"))
    .catch(err => console.error("SW gagal:", err));
}
