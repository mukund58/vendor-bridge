
const Quotations = () => {
  const quotations = [
    { id: 'QTN-4182', rfq: 'RFQ-2026-0041', vendor: 'Apex Metals Ltd', unitPrice: '$42,500.00', deliveryTime: '5 Days', score: '95%', status: 'Recommended', badge: 'badge-success' },
    { id: 'QTN-4183', rfq: 'RFQ-2026-0041', vendor: 'Titan Heavy Machinery', unitPrice: '$45,000.00', deliveryTime: '3 Days', score: '91%', status: 'Valid', badge: 'badge-info' },
    { id: 'QTN-4179', rfq: 'RFQ-2026-0040', vendor: 'NetScale Solutions', unitPrice: '$18,900.00', deliveryTime: '14 Days', score: '88%', status: 'Pending Review', badge: 'badge-warning' },
  ];

  return (
    <div className="d-flex flex-column gap-4">
      <div>
        <h1 className="h3 mb-1 text-white fw-bold">Supplier Quotations</h1>
        <p className="text-secondary small">Compare bids side-by-side, evaluate timelines, and approve quotes.</p>
      </div>

      <div className="card p-4">
        <h6 className="text-white mb-3 fw-semibold">Quotations Received</h6>
        <div className="table-responsive border-0">
          <table className="table custom-table text-nowrap align-middle">
            <thead>
              <tr>
                <th scope="col">Quotation ID</th>
                <th scope="col">RFQ Reference</th>
                <th scope="col">Vendor</th>
                <th scope="col">Total Price</th>
                <th scope="col">Delivery Speed</th>
                <th scope="col">Evaluation Score</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {quotations.map((q) => (
                <tr key={q.id}>
                  <td className="text-primary fw-medium">{q.id}</td>
                  <td className="text-secondary small">{q.rfq}</td>
                  <td className="fw-semibold text-white">{q.vendor}</td>
                  <td className="fw-bold">{q.unitPrice}</td>
                  <td>{q.deliveryTime}</td>
                  <td className="text-white">{q.score}</td>
                  <td>
                    <span className={`badge-status ${q.badge}`}>
                      {q.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Quotations;
