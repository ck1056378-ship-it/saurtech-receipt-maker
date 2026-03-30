import { type ReceiptData } from '@/components/ReceiptPreview';

interface Props {
  history: ReceiptData[];
  onView: (data: ReceiptData) => void;
  onDelete: (index: number) => void;
}

export default function ReceiptHistory({ history, onView, onDelete }: Props) {
  if (history.length === 0) return null;

  return (
    <div className="history-card">
      <h3 className="history-title">Receipt History ({history.length})</h3>
      <div className="history-list">
        {history.map((item, i) => (
          <div key={`${item.receiptNo}-${i}`} className="history-item">
            <div className="history-info">
              <span className="history-no">#{item.receiptNo}</span>
              <span className="history-name">{item.customerName}</span>
              <span className="history-amt">₹ {Number(item.amount).toLocaleString('en-IN')}</span>
              <span className="history-date">{item.date}</span>
            </div>
            <div className="history-actions">
              <button className="btn btn-sm btn-view" onClick={() => onView(item)}>View</button>
              <button className="btn btn-sm btn-del" onClick={() => onDelete(i)}>✕</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
