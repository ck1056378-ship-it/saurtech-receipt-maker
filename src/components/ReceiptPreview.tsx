import { forwardRef } from 'react';
import companyLogo from '@/assets/company_logo.png';
import stampImg from '@/assets/stamp.png';
import signatureImg from '@/assets/signature.png';
import { amountToWords, formatIndianCurrency } from '@/lib/amountToWords';

export interface ReceiptData {
  customerName: string;
  amount: string;
  through: string;
  onAccountOf: string;
  receiptNo: string;
  date: string;
}

interface Props {
  data: ReceiptData | null;
}

const ReceiptPreview = forwardRef<HTMLDivElement, Props>(({ data }, ref) => {
  const amt = data ? Number(data.amount) : 0;

  return (
    <div className="receipt-preview-wrapper">
      <span className="preview-label">Live Preview</span>
      <div className="receipt-paper" ref={ref}>
        {/* Header */}
        <div className="receipt-header">
          <div className="receipt-logo-section">
            <img src={companyLogo} alt="A.R. Saurtech Energy" className="receipt-logo" />
          </div>
          <div className="receipt-company-info">
            <h1 className="company-name">A.R. Saurtech Energy Pvt. Ltd.</h1>
            <p>A-21, Sector-67, Noida, Uttar Pradesh, India</p>
            <p>+91-9917979979 | +91-9045052587</p>
            <p>hello@arsaurtech.com | solarsaurtechinfo@gmail.com</p>
            <p><a href="https://arsaurtechenergy.com/" target="_blank" rel="noopener noreferrer" className="company-website-link">www.arsaurtechenergy.com</a></p>
          </div>
        </div>

        <div className="receipt-header-line"></div>

        <div className="receipt-title-bar">
          <h2>Receipt Voucher</h2>
        </div>
        <div className="receipt-title-underline"></div>

        {/* Top info */}
        <div className="receipt-info-row">
          <div><strong>Receipt No:</strong> {data?.receiptNo || '—'}</div>
          <div><strong>Date:</strong> {data?.date || '—'}</div>
        </div>

        {/* Table */}
        <table className="receipt-table">
          <thead>
            <tr>
              <th className="col-particulars">Particulars</th>
              <th className="col-amount">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="particulars-cell">
                {data ? (
                  <>
                    <div className="particular-item">
                      <div className="particular-label">Account:</div>
                      <div className="particular-value">{data.customerName}</div>
                    </div>
                    <div className="particular-item">
                      <div className="particular-label">Through:</div>
                      <div className="particular-value">{data.through}</div>
                    </div>
                    <div className="particular-item">
                      <div className="particular-label">On Account of:</div>
                      <div className="particular-value">{data.onAccountOf}</div>
                    </div>
                    <div className="particular-item">
                      <div className="particular-label">Amount (in words):</div>
                      <div className="particular-value amount-words">{amountToWords(amt)}</div>
                    </div>
                  </>
                ) : (
                  <span className="placeholder-text">Fill the form and click "Generate Receipt"</span>
                )}
              </td>
              <td className="amount-cell">
                {data ? '₹ ' + formatIndianCurrency(amt).replace('₹ ', '') : '—'}
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td className="total-label"><strong>Total</strong></td>
              <td className="total-amount"><strong>{data ? '₹ ' + formatIndianCurrency(amt).replace('₹ ', '') : '—'}</strong></td>
            </tr>
          </tfoot>
        </table>

        {/* Footer — Signature & Stamp */}
        <div className="receipt-footer">
          <div className="footer-spacer"></div>
          <div className="signatory-block">
            {data && (
              <div className="stamp-signature-overlay">
                <img src={stampImg} alt="Company Stamp" className="stamp-img" />
                <img src={signatureImg} alt="Signature" className="signature-img" />
              </div>
            )}
            <div className="signature-line"></div>
            <p className="signatory-title">Authorised Signatory</p>
            <p className="signatory-company">A.R. Saurtech Energy Pvt. Ltd.</p>
          </div>
        </div>
      </div>
    </div>
  );
});

ReceiptPreview.displayName = 'ReceiptPreview';
export default ReceiptPreview;
