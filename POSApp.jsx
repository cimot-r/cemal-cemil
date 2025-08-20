import React, { useState } from "react";

function POSApp() {
  // State
  const [buyers, setBuyers] = useState([]);
  const [foods, setFoods] = useState([]);
  const [cart, setCart] = useState([]);
  const [history, setHistory] = useState([]);
  const [bukti, setBukti] = useState(null);

  // Input state
  const [buyer, setBuyer] = useState({ nama: "", alamat: "", no: "", rekening: "" });
  const [food, setFood] = useState({ nama: "", harga: "", stok: "" });

  // Tambah Pembeli
  const addBuyer = () => {
    if (!buyer.nama || !buyer.alamat) return alert("Lengkapi data pembeli!");
    setBuyers([...buyers, buyer]);
    setBuyer({ nama: "", alamat: "", no: "", rekening: "" });
  };

  // Tambah Makanan
  const addFood = () => {
    if (!food.nama || !food.harga || !food.stok) return alert("Lengkapi data makanan!");
    setFoods([...foods, { ...food, harga: Number(food.harga), stok: Number(food.stok) }]);
    setFood({ nama: "", harga: "", stok: "" });
  };

  // Tambah ke Keranjang
  const addToCart = (item) => {
    if (item.stok <= 0) return alert("Stok habis!");
    setCart([...cart, item]);
    setFoods(
      foods.map((f) => (f.nama === item.nama ? { ...f, stok: f.stok - 1 } : f))
    );
  };

  // Upload Bukti Transfer
  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBukti(URL.createObjectURL(file));
    }
  };

  // Submit Transaksi
  const submitTransaction = () => {
    if (buyers.length === 0) return alert("Tambahkan pembeli dulu!");
    if (cart.length === 0) return alert("Keranjang kosong!");
    if (!bukti) return alert("Upload bukti transfer!");

    const total = cart.reduce((sum, item) => sum + item.harga, 0);
    const newHistory = {
      pembeli: buyers[buyers.length - 1], // pembeli terakhir
      items: cart,
      total,
      bukti,
      waktu: new Date().toLocaleString(),
    };
    setHistory([...history, newHistory]);
    setCart([]);
    setBukti(null);
    alert("Transaksi berhasil disimpan!");
  };

  // Export CSV
  const exportCSV = () => {
    if (history.length === 0) return alert("Belum ada transaksi!");
    let csv = "Nama,Alamat,No HP,Rekening,Makanan,Total,Waktu\n";
    history.forEach((h) => {
      csv += `${h.pembeli.nama},${h.pembeli.alamat},${h.pembeli.no},${h.pembeli.rekening},"${h.items
        .map((i) => i.nama)
        .join(";")}",${h.total},${h.waktu}\n`;
    });
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "history.csv";
    a.click();
  };

  return (
    <div className="p-4 max-w-3xl mx-auto font-sans">
      <h1 className="text-2xl font-bold text-orange-600 mb-4">🍢 Cemal-Cemil POS</h1>

      {/* Tambah Pembeli */}
      <div className="mb-6 p-4 border rounded-lg shadow">
        <h2 className="font-semibold mb-2">Tambah Pembeli</h2>
        <input
          className="border p-1 mr-2"
          placeholder="Nama"
          value={buyer.nama}
          onChange={(e) => setBuyer({ ...buyer, nama: e.target.value })}
        />
        <input
          className="border p-1 mr-2"
          placeholder="Alamat"
          value={buyer.alamat}
          onChange={(e) => setBuyer({ ...buyer, alamat: e.target.value })}
        />
        <input
          className="border p-1 mr-2"
          placeholder="No HP"
          value={buyer.no}
          onChange={(e) => setBuyer({ ...buyer, no: e.target.value })}
        />
        <input
          className="border p-1 mr-2"
          placeholder="Rekening"
          value={buyer.rekening}
          onChange={(e) => setBuyer({ ...buyer, rekening: e.target.value })}
        />
        <button className="bg-orange-500 text-white px-2 py-1 rounded" onClick={addBuyer}>
          Simpan
        </button>
      </div>

      {/* Tambah Makanan */}
      <div className="mb-6 p-4 border rounded-lg shadow">
        <h2 className="font-semibold mb-2">Tambah Makanan</h2>
        <input
          className="border p-1 mr-2"
          placeholder="Nama Makanan"
          value={food.nama}
          onChange={(e) => setFood({ ...food, nama: e.target.value })}
        />
        <input
          className="border p-1 mr-2"
          placeholder="Harga"
          type="number"
          value={food.harga}
          onChange={(e) => setFood({ ...food, harga: e.target.value })}
        />
        <input
          className="border p-1 mr-2"
          placeholder="Stok"
          type="number"
          value={food.stok}
          onChange={(e) => setFood({ ...food, stok: e.target.value })}
        />
        <button className="bg-green-600 text-white px-2 py-1 rounded" onClick={addFood}>
          Simpan
        </button>
      </div>

      {/* List Menu */}
      <div className="mb-6">
        <h2 className="font-semibold mb-2">Daftar Menu</h2>
        <ul>
          {foods.map((f, idx) => (
            <li key={idx} className="flex justify-between items-center border-b py-1">
              {f.nama} - Rp{f.harga} ({f.stok} stok)
              <button
                className="bg-blue-500 text-white px-2 py-1 rounded"
                onClick={() => addToCart(f)}
              >
                + Keranjang
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Keranjang */}
      <div className="mb-6 p-4 border rounded-lg shadow">
        <h2 className="font-semibold mb-2">Keranjang</h2>
        <ul>
          {cart.map((c, idx) => (
            <li key={idx}>
              {c.nama} - Rp{c.harga}
            </li>
          ))}
        </ul>
        <p className="font-bold">
          Total: Rp{cart.reduce((sum, item) => sum + item.harga, 0)}
        </p>
        <input type="file" onChange={handleUpload} className="my-2" />
        {bukti && <img src={bukti} alt="Bukti TF" className="w-32 mb-2" />}
        <button
          className="bg-purple-600 text-white px-2 py-1 rounded"
          onClick={submitTransaction}
        >
          Submit Transaksi
        </button>
      </div>

      {/* History */}
      <div className="mb-6 p-4 border rounded-lg shadow">
        <h2 className="font-semibold mb-2">History Penjualan</h2>
        {history.map((h, idx) => (
          <div key={idx} className="border-b py-2">
            <p>
              <strong>{h.pembeli.nama}</strong> ({h.pembeli.no}) - {h.waktu}
            </p>
            <p>Makanan: {h.items.map((i) => i.nama).join(", ")}</p>
            <p>Total: Rp{h.total}</p>
            {h.bukti && <img src={h.bukti} alt="Bukti" className="w-24 mt-1" />}
          </div>
        ))}
        <button
          className="mt-2 bg-gray-700 text-white px-2 py-1 rounded"
          onClick={exportCSV}
        >
          Export CSV
        </button>
      </div>
    </div>
  );
}

export default POSApp;
