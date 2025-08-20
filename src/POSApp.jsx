import React, { useState } from "react";

function POSApp() {
  const [buyers, setBuyers] = useState([]);
  const [foods, setFoods] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const [buyerForm, setBuyerForm] = useState({
    nama: "",
    alamat: "",
    no: "",
    rekening: "",
  });

  const [foodForm, setFoodForm] = useState({ nama: "", harga: "", stok: "" });

  const [cart, setCart] = useState([]);
  const [selectedBuyer, setSelectedBuyer] = useState("");
  const [proofFile, setProofFile] = useState(null);

  // Tambah pembeli
  const addBuyer = () => {
    if (!buyerForm.nama) return alert("Nama harus diisi");
    setBuyers([...buyers, { ...buyerForm }]);
    setBuyerForm({ nama: "", alamat: "", no: "", rekening: "" });
  };

  // Tambah makanan
  const addFood = () => {
    if (!foodForm.nama || !foodForm.harga) return alert("Nama & Harga wajib");
    setFoods([...foods, { ...foodForm, stok: parseInt(foodForm.stok || 0) }]);
    setFoodForm({ nama: "", harga: "", stok: "" });
  };

  // Tambah ke keranjang
  const addToCart = (food) => {
    if (food.stok <= 0) return alert("Stok habis");
    setCart([...cart, { ...food }]);
    setFoods(
      foods.map((f) =>
        f.nama === food.nama ? { ...f, stok: f.stok - 1 } : f
      )
    );
  };

  // Submit transaksi
  const submitTransaction = () => {
    if (!selectedBuyer) return alert("Pilih pembeli dulu");
    if (cart.length === 0) return alert("Keranjang kosong");
    if (!proofFile) return alert("Upload bukti transfer dulu");

    const newTransaction = {
      buyer: buyers.find((b) => b.nama === selectedBuyer),
      items: [...cart],
      total: cart.reduce((sum, f) => sum + parseFloat(f.harga), 0),
      proof: URL.createObjectURL(proofFile),
      date: new Date().toLocaleString(),
    };

    setTransactions([...transactions, newTransaction]);
    setCart([]);
    setProofFile(null);
  };

  // Export transaksi ke CSV
  const exportCSV = () => {
    const header = "Nama,Alamat,No,Rekening,Item,Total,Tanggal\n";
    const rows = transactions
      .map(
        (t) =>
          `${t.buyer.nama},${t.buyer.alamat},${t.buyer.no},${t.buyer.rekening},${t.items
            .map((i) => i.nama)
            .join(";")},${t.total},${t.date}`
      )
      .join("\n");

    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transaksi.csv";
    a.click();
  };

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h1>Cemal-Cemil POS</h1>

      {/* Pembeli */}
      <h2>Tambah Pembeli</h2>
      <input
        placeholder="Nama"
        value={buyerForm.nama}
        onChange={(e) => setBuyerForm({ ...buyerForm, nama: e.target.value })}
      />
      <input
        placeholder="Alamat"
        value={buyerForm.alamat}
        onChange={(e) => setBuyerForm({ ...buyerForm, alamat: e.target.value })}
      />
      <input
        placeholder="No HP"
        value={buyerForm.no}
        onChange={(e) => setBuyerForm({ ...buyerForm, no: e.target.value })}
      />
      <input
        placeholder="Rekening"
        value={buyerForm.rekening}
        onChange={(e) =>
          setBuyerForm({ ...buyerForm, rekening: e.target.value })
        }
      />
      <button onClick={addBuyer}>Tambah</button>

      {/* Makanan */}
      <h2>Tambah Makanan</h2>
      <input
        placeholder="Nama Makanan"
        value={foodForm.nama}
        onChange={(e) => setFoodForm({ ...foodForm, nama: e.target.value })}
      />
      <input
        type="number"
        placeholder="Harga"
        value={foodForm.harga}
        onChange={(e) => setFoodForm({ ...foodForm, harga: e.target.value })}
      />
      <input
        type="number"
        placeholder="Stok"
        value={foodForm.stok}
        onChange={(e) => setFoodForm({ ...foodForm, stok: e.target.value })}
      />
      <button onClick={addFood}>Tambah</button>

      {/* List makanan */}
      <h2>Daftar Makanan</h2>
      <ul>
        {foods.map((f, idx) => (
          <li key={idx}>
            {f.nama} - Rp{f.harga} | Stok: {f.stok}{" "}
            <button onClick={() => addToCart(f)}>+Keranjang</button>
          </li>
        ))}
      </ul>

      {/* Keranjang */}
      <h2>Keranjang</h2>
      <ul>
        {cart.map((c, idx) => (
          <li key={idx}>
            {c.nama} - Rp{c.harga}
          </li>
        ))}
      </ul>

      <h3>
        Total: Rp{cart.reduce((sum, f) => sum + parseFloat(f.harga || 0), 0)}
      </h3>

      <select
        value={selectedBuyer}
        onChange={(e) => setSelectedBuyer(e.target.value)}
      >
        <option value="">Pilih Pembeli</option>
        {buyers.map((b, idx) => (
          <option key={idx} value={b.nama}>
            {b.nama}
          </option>
        ))}
      </select>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setProofFile(e.target.files[0])}
      />

      <button onClick={submitTransaction}>Submit Transaksi</button>

      {/* History */}
      <h2>History Penjualan</h2>
      <button onClick={exportCSV}>Export CSV</button>
      <ul>
        {transactions.map((t, idx) => (
          <li key={idx}>
            {t.date} - {t.buyer.nama} - Rp{t.total}
            <br />
            <img src={t.proof} alt="Bukti" width={100} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default POSApp;
