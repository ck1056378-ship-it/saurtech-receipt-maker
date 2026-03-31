import { useState } from 'react';
import { type ReceiptData } from '@/components/ReceiptPreview';

interface Props {
  history: ReceiptData[];
  onView: (data: ReceiptData) => void;
  onDelete: (index: number) => void;
}

export default function ReceiptHistory({ history, onView, onDelete }: Props) {
  const [search, setSearch] = useState('');

  if (history.length === 0) return null;

  const filtered = history.filter(item => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      item.receiptNo.toLowerCase().includes(q) ||
      item.customerName.toLowerCase().includes(q) ||
      item.date.toLowerCase().includes(q)
    );
  });

  return (
    <div className="history-card">
      <h3 className="history-title">Receipt History ({history.length})</h3>
      <div className="history-search">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by receipt no, name, or date..."
          className="history-search-input"
        />
      </div>
      <div className="history-list">
        {filtered.length === 0 ? (
          <div className="history-empty">No receipts match your search.</div>
        ) : (
          filtered.map((item, i) => {
            const originalIndex = history.indexOf(item);
            return (
              <div key={`${item.receiptNo}-${i}`} className="history-item">
                <div className="history-info">
                  <span className="history-no">#{item.receiptNo}</span>
                  <span className="history-name">{item.customerName}</span>
                  <span className="history-amt">₹ {Number(item.amount).toLocaleString('en-IN')}</span>
                  <span className="history-date">{item.date}</span>
                </div>
                <div className="history-actions">
                  <button className="btn btn-sm btn-view" onClick={() => onView(item)}>View</button>
                  <button className="btn btn-sm btn-del" onClick={() => onDelete(originalIndex)}>✕</button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
