import { useRef, useState, useCallback, useEffect } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import ReceiptForm from '@/components/ReceiptForm';
import ReceiptPreview, { type ReceiptData } from '@/components/ReceiptPreview';
import ReceiptHistory from '@/components/ReceiptHistory';
import LoginPage, { isLoggedIn, logout } from '@/components/LoginPage';
import { supabase } from '@/integrations/supabase/client';
import '@/styles/receipt.css';

export default function Index() {
  const [authenticated, setAuthenticated] = useState(isLoggedIn);
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);
  const [nextNo, setNextNo] = useState(1);
  const [history, setHistory] = useState<ReceiptData[]>([]);
  const [loading, setLoading] = useState(true);
  const receiptRef = useRef<HTMLDivElement>(null);

  // Load counter and history from Supabase on login
  useEffect(() => {
    if (!authenticated) return;
    const load = async () => {
      setLoading(true);
      try {
        // Fetch counter
        const { data: counterData } = await supabase
          .from('receipt_counter')
          .select('counter')
          .eq('id', 1)
          .single();
        if (counterData) setNextNo(counterData.counter);

        // Fetch history
        const { data: historyData } = await supabase
          .from('receipts')
          .select('*')
          .order('created_at', { ascending: false });
        if (historyData) {
          setHistory(historyData.map(r => ({
            customerName: r.customer_name,
            amount: r.amount,
            through: r.through,
            onAccountOf: r.on_account_of,
            receiptNo: r.receipt_no,
            date: r.date,
          })));
        }
      } catch (e) {
        console.error('Failed to load data:', e);
      }
      setLoading(false);
    };
    load();
  }, [authenticated]);

  const handleGenerate = useCallback(async (data: ReceiptData & { receiptNo: string }) => {
    const usedNo = data.receiptNo || String(nextNo);
    const receipt = { ...data, receiptNo: usedNo };
    setReceiptData(receipt);
    setHistory(prev => [receipt, ...prev]);

    // Save to Supabase
    try {
      await supabase.from('receipts').insert({
        receipt_no: receipt.receiptNo,
        date: receipt.date,
        customer_name: receipt.customerName,
        amount: receipt.amount,
        through: receipt.through,
        on_account_of: receipt.onAccountOf,
      });

      // Update counter
      const newCounter = (!data.receiptNo || data.receiptNo === String(nextNo)) ? nextNo + 1 : nextNo;
      if (newCounter !== nextNo) {
        setNextNo(newCounter);
        await supabase.from('receipt_counter').update({ counter: newCounter }).eq('id', 1);
      }
    } catch (e) {
      console.error('Failed to save receipt:', e);
    }
  }, [nextNo]);

  const handleReset = () => setReceiptData(null);

  const handleResetCounter = async () => {
    setNextNo(1);
    await supabase.from('receipt_counter').update({ counter: 1 }).eq('id', 1);
  };

  const handleViewHistory = (data: ReceiptData) => setReceiptData(data);

  const handleDeleteHistory = async (index: number) => {
    const item = history[index];
    setHistory(prev => prev.filter((_, i) => i !== index));
    // Delete from Supabase by receipt_no match
    try {
      await supabase.from('receipts').delete().eq('receipt_no', item.receiptNo).eq('customer_name', item.customerName);
    } catch (e) {
      console.error('Failed to delete receipt:', e);
    }
  };

  const handleLogout = () => {
    logout();
    setAuthenticated(false);
    setReceiptData(null);
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
    pdf.link(10, 10, pdfW, pdfH, { url: 'https://arsaurtechenergy.com/' });
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

  if (!authenticated) {
    return <LoginPage onLogin={() => setAuthenticated(true)} />;
  }

  return (
    <div className="receipt-app">
      <header className="app-header">
        <div className="app-header-content">
          <div>
            <h1>Receipt Voucher Generator</h1>
            <p>A.R. Saurtech Energy Pvt. Ltd.</p>
          </div>
          <button className="btn btn-logout no-print" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#888' }}>Loading...</div>
      ) : (
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
      )}
    </div>
  );
}
