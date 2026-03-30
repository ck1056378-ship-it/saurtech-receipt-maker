import { useState } from 'react';

interface FormData {
  customerName: string;
  amount: string;
  through: string;
  onAccountOf: string;
  receiptNo: string;
  date: string;
}

interface Props {
  onGenerate: (data: FormData) => void;
  onReset: () => void;
  onResetCounter: () => void;
  nextReceiptNo: number;
}

function getFormattedDate() {
  const d = new Date();
  const day = String(d.getDate()).padStart(2, '0');
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${day}-${months[d.getMonth()]}-${d.getFullYear()}`;
}

export default function ReceiptForm({ onGenerate, onReset, onResetCounter, nextReceiptNo }: Props) {
  const [form, setForm] = useState<FormData>({
    customerName: '',
    amount: '',
    through: '',
    onAccountOf: '',
    receiptNo: '',
    date: getFormattedDate(),
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const validate = (): boolean => {
    const e: typeof errors = {};
    if (!form.customerName.trim()) e.customerName = 'Customer Name is required';
    if (!form.amount.trim()) e.amount = 'Amount is required';
    else if (isNaN(Number(form.amount)) || Number(form.amount) <= 0) e.amount = 'Enter a valid amount greater than 0';
    if (!form.through.trim()) e.through = 'Payment details are required';
    if (!form.onAccountOf.trim()) e.onAccountOf = 'This field is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleGenerate = () => {
    if (validate()) {
      onGenerate({
        ...form,
        receiptNo: form.receiptNo.trim() || String(nextReceiptNo),
      });
    }
  };

  const handleReset = () => {
    setForm({ customerName: '', amount: '', through: '', onAccountOf: '', receiptNo: '', date: getFormattedDate() });
    setErrors({});
    onReset();
  };

  const set = (field: keyof FormData, value: string) => {
    setForm(f => ({ ...f, [field]: value }));
    if (errors[field]) setErrors(e => ({ ...e, [field]: undefined }));
  };

  return (
    <div className="receipt-form-card">
      <h2 className="form-title">Receipt Details</h2>
      
      <div className="form-grid">
        <div className="form-group full-width">
          <label>Customer Name <span className="required">*</span></label>
          <input type="text" value={form.customerName} onChange={e => set('customerName', e.target.value)} placeholder="Enter customer name" />
          {errors.customerName && <span className="error-msg">{errors.customerName}</span>}
        </div>

        <div className="form-group">
          <label>Amount (₹) <span className="required">*</span></label>
          <input type="number" value={form.amount} onChange={e => set('amount', e.target.value)} placeholder="Enter amount" min="1" step="0.01" />
          {errors.amount && <span className="error-msg">{errors.amount}</span>}
        </div>

        <div className="form-group">
          <label>Date</label>
          <input type="text" value={form.date} onChange={e => set('date', e.target.value)} />
        </div>

        <div className="form-group full-width">
          <label>Through / Payment Details <span className="required">*</span></label>
          <textarea value={form.through} onChange={e => set('through', e.target.value)} placeholder="e.g. Cash, UPI, Bank Transfer, Cheque No..." rows={2} />
          {errors.through && <span className="error-msg">{errors.through}</span>}
        </div>

        <div className="form-group full-width">
          <label>On Account Of <span className="required">*</span></label>
          <textarea value={form.onAccountOf} onChange={e => set('onAccountOf', e.target.value)} placeholder="e.g. Solar panel installation advance" rows={2} />
          {errors.onAccountOf && <span className="error-msg">{errors.onAccountOf}</span>}
        </div>

        <div className="form-group">
          <label>Receipt Number</label>
          <input type="text" value={form.receiptNo} onChange={e => set('receiptNo', e.target.value)} placeholder={`Auto: ${nextReceiptNo}`} />
        </div>
      </div>

      <div className="form-actions">
        <button className="btn btn-generate" onClick={handleGenerate}>Generate Receipt</button>
        <button className="btn btn-reset" onClick={handleReset}>Reset Form</button>
        <button className="btn btn-counter-reset" onClick={onResetCounter}>Reset Receipt Counter</button>
      </div>
    </div>
  );
}
