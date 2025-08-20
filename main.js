let keranjang = [];

function tambahItem(nama, harga) {
  // cek apakah item sudah ada
  const item = keranjang.find(i => i.nama === nama);
  if (item) {
    item.jumlah += 1;
  } else {
    keranjang.push({ nama, harga, jumlah: 1 });
  }
  renderKeranjang();
}

function hapusItem(index) {
  keranjang.splice(index, 1);
  renderKeranjang();
}

function renderKeranjang() {
  const tbody = document.getElementById("tabelKeranjang");
  tbody.innerHTML = "";

  let total = 0;

  keranjang.forEach((item, i) => {
    const subtotal = item.harga * item.jumlah;
    total += subtotal;

    const row = `
      <tr>
        <td>${i + 1}</td>
        <td>${item.nama}</td>
        <td>Rp${item.harga.toLocaleString()}</td>
        <td>${item.jumlah}</td>
        <td>Rp${subtotal.toLocaleString()}</td>
        <td><button onclick="hapusItem(${i})">Hapus</button></td>
      </tr>
    `;
    tbody.innerHTML += row;
  });

  document.getElementById("totalHarga").textContent = 
    "Total: Rp" + total.toLocaleString();
}

// Daftarkan Service Worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js")
    .then(() => console.log("Service Worker terdaftar"))
    .catch(err => console.error("SW gagal:", err));
}
