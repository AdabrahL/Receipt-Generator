import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'; // Make sure to add the CSS shown below

const App = () => {
  const [buyer, setBuyer] = useState('');
  const [items, setItems] = useState([]);
  const [desc, setDesc] = useState('');
  const [qty, setQty] = useState(1);
  const [price, setPrice] = useState('');
  const [dateTime, setDateTime] = useState('');
  const receiptRef = useRef();

  useEffect(() => {
    const interval = setInterval(() => {
      setDateTime(new Date().toLocaleString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const addItem = () => {
    if (!desc.trim() || qty <= 0 || price < 0) {
      alert('Please enter valid item details.');
      return;
    }

    const newItem = {
      desc: desc.trim(),
      qty: parseFloat(qty),
      price: parseFloat(price)
    };
    setItems([...items, newItem]);
    setDesc('');
    setQty(1);
    setPrice('');
  };

  const removeItem = (index) => {
    const updated = [...items];
    updated.splice(index, 1);
    setItems(updated);
  };

  const calculateTotals = () => {
    let subtotal = 0;
    items.forEach(item => {
      subtotal += item.qty * item.price;
    });

    const discount = subtotal > 100 ? subtotal * 0.05 : 0;
    const grandTotal = subtotal - discount;

    return {
      subtotal,
      discount,
      grandTotal
    };
  };

  const { subtotal, discount, grandTotal } = calculateTotals();

  const printReceipt = () => {
    window.print();
  };

  return (
    <div className="container py-4">
      <h2 className="mb-3">🧾 Receipt Generator</h2>
      <p className="text-end text-muted">{dateTime}</p>

      {/* Buyer Info */}
      <div className="mb-4 no-print">
        <label className="form-label fw-bold">Buyer's Name</label>
        <input
          type="text"
          className="form-control"
          value={buyer}
          onChange={(e) => setBuyer(e.target.value)}
          placeholder="Enter buyer's full name"
        />
      </div>

      {/* Input Form */}
      <div className="row g-2 align-items-end mb-4 no-print">
        <div className="col-md-5">
          <label>Description</label>
          <input
            className="form-control"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Item Description"
          />
        </div>
        <div className="col-md-2">
          <label>Qty</label>
          <input
            type="number"
            className="form-control"
            min="1"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <label>Price (₵)</label>
          <input
            type="number"
            className="form-control"
            min="0"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <div className="col-md-2">
          <button className="btn btn-success w-100" onClick={addItem}>
            Add
          </button>
        </div>
      </div>

      {/* Receipt Preview */}
      <div ref={receiptRef} className="table-responsive print-area">
        <div className="mb-3">
          <h5>Receipt Preview</h5>
          {buyer && <p className="fw-bold">Buyer: {buyer}</p>}
          <p className="text-muted">{dateTime}</p>
        </div>

        <table className="table table-bordered table-striped align-middle">
          <thead className="table-secondary">
            <tr>
              <th>#</th>
              <th>Description</th>
              <th>Qty</th>
              <th>Price (₵)</th>
              <th>Total (₵)</th>
              <th className="no-print"></th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center">No items added.</td>
              </tr>
            ) : (
              items.map((item, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{item.desc}</td>
                  <td>{item.qty}</td>
                  <td>₵{item.price.toFixed(2)}</td>
                  <td>₵{(item.qty * item.price).toFixed(2)}</td>
                  <td className="no-print">
                    <button className="btn btn-sm btn-danger" onClick={() => removeItem(i)}>×</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
          <tfoot>
            <tr>
              <th colSpan="4" className="text-end">Subtotal:</th>
              <th colSpan="2">₵{subtotal.toFixed(2)}</th>
            </tr>
            <tr>
              <th colSpan="4" className="text-end text-success">Discount (5% if > ₵100):</th>
              <th colSpan="2">₵{discount.toFixed(2)}</th>
            </tr>
            <tr>
              <th colSpan="4" className="text-end fw-bold">Grand Total:</th>
              <th colSpan="2" className="fw-bold text-primary">₵{grandTotal.toFixed(2)}</th>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="text-end no-print">
        <button className="btn btn-outline-primary" onClick={printReceipt}>
          🖨️ Print Receipt
        </button>
      </div>
    </div>
  );
};

export default App;