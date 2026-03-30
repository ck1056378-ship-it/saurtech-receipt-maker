import { useRef, useState, useCallback, useEffect } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import ReceiptForm from '@/components/ReceiptForm';
import ReceiptPreview, { type ReceiptData } from '@/components/ReceiptPreview';
import ReceiptHistory from '@/components/ReceiptHistory';
import '@/styles/receipt.css';

const COUNTER_KEY = 'ar_saurtech_receipt_counter';
const HISTORY_KEY = 'ar_saurtech_receipt_history';

function getCounter(): number {
  const stored = localStorage.getItem(COUNTER_KEY);
  return stored ? parseInt(stored, 10) : 1;
}

function incrementCounter(): number {
  const next = getCounter() + 1;
  localStorage.setItem(COUNTER_KEY, String(next));
  return next;
}

function getHistory(): ReceiptData[] {
  try {
    const stored = localStorage.getItem(HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch { return []; }
}

function saveHistory(history: ReceiptData[]) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

export default function Index() {
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);
  const [nextNo, setNextNo] = useState(getCounter);
  const [history, setHistory] = useState<ReceiptData[]>(getHistory);
  const receiptRef = useRef<HTMLDivElement>(null);

  useEffect(() => { saveHistory(history); }, [history]);

  const handleGenerate = useCallback((data: ReceiptData & { receiptNo: string }) => {
    const usedNo = data.receiptNo || String(nextNo);
    const receipt = { ...data, receiptNo: usedNo };
    setReceiptData(receipt);
    setHistory(prev => [receipt, ...prev]);
    if (!data.receiptNo || data.receiptNo === String(nextNo)) {
      const newNext = incrementCounter();
      setNextNo(newNext);
    }
  }, [nextNo]);

  const handleReset = () => setReceiptData(null);

  const handleResetCounter = () => {
    localStorage.setItem(COUNTER_KEY, '1');
    setNextNo(1);
  };

  const handleViewHistory = (data: ReceiptData) => setReceiptData(data);

  const handleDeleteHistory = (index: number) => {
    setHistory(prev => prev.filter((_, i) => i !== index));
  };

  const captureReceipt = async () => {
    if (!receiptRef.current) return null;
    return html2canvas(receiptRef.current, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
  };

  const downloadPDF = async () => {
    const canvas = await captureReceipt();
    if (!canvas || !receiptData) return;
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfW = pdf.internal.pageSize.getWidth() - 20;
    const pdfH = (canvas.height * pdfW) / canvas.width;
    pdf.addImage(imgData, 'PNG', 10, 10, pdfW, pdfH);
    pdf.save(`receipt-${receiptData.receiptNo}-${receiptData.customerName.replace(/\s+/g, '_')}.pdf`);
  };

  const downloadImage = async () => {
    const canvas = await captureReceipt();
    if (!canvas || !receiptData) return;
    const link = document.createElement('a');
    link.download = `receipt-${receiptData.receiptNo}-${receiptData.customerName.replace(/\s+/g, '_')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handlePrint = () => window.print();

  return (
    <div className="receipt-app">
      <header className="app-header">
        <h1>Receipt Voucher Generator</h1>
        <p>A.R. Saurtech Energy Pvt. Ltd.</p>
      </header>

      <div className="app-layout">
        <div className="form-section no-print">
          <ReceiptForm
            onGenerate={handleGenerate}
            onReset={handleReset}
            onResetCounter={handleResetCounter}
            nextReceiptNo={nextNo}
          />

          {receiptData && (
            <div className="export-actions">
              <button className="btn btn-pdf" onClick={downloadPDF}>📄 Download PDF</button>
              <button className="btn btn-img" onClick={downloadImage}>🖼️ Download Image</button>
              <button className="btn btn-print" onClick={handlePrint}>🖨️ Print</button>
            </div>
          )}

          <ReceiptHistory
            history={history}
            onView={handleViewHistory}
            onDelete={handleDeleteHistory}
          />
        </div>

        <div className="preview-section">
          <ReceiptPreview ref={receiptRef} data={receiptData} />
        </div>
      </div>
    </div>
  );
}
