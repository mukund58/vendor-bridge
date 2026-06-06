
const Invoices = () => {
  const invoicesList = [
    { id: 'INV-7790', po: 'PO-2026-1028', vendor: 'Titan Heavy Machinery', amount: '$8,400.00', dueDate: 'Jun 30, 2026', status: 'Settled', badge: 'badge-success' },
    { id: 'INV-7791', po: 'PO-2026-1029', vendor: 'Apex Metals Ltd', amount: '$42,500.00', dueDate: 'Jul 05, 2026', status: 'Unpaid / Open', badge: 'badge-warning' },
  ];

  return (
    <div className="d-flex flex-column gap-4">
      <div>
        <h1 className="h3 mb-1 text-white fw-bold">Supplier Invoicing & Billing</h1>
        <p className="text-secondary small">Reconcile received invoices against purchase order slips and process vendor payouts.</p>
      </div>

      <div className="card p-4">
        <h6 className="text-white mb-3 fw-semibold">Billing Ledger</h6>
        <div className="table-responsive border-0">
          <table className="table custom-table text-nowrap align-middle">
            <thead>
              <tr>
                <th scope="col">Invoice Number</th>
                <th scope="col">Associated PO</th>
                <th scope="col">Supplier Partner</th>
                <th scope="col">Due Date</th>
                <th scope="col">Total Bill</th>
                <th scope="col">Payment State</th>
              </tr>
            </thead>
            <tbody>
              {invoicesList.map((inv) => (
                <tr key={inv.id}>
                  <td className="text-primary fw-medium">{inv.id}</td>
                  <td>{inv.po}</td>
                  <td className="fw-semibold text-white">{inv.vendor}</td>
                  <td>{inv.dueDate}</td>
                  <td className="fw-bold">{inv.amount}</td>
                  <td>
                    <span className={`badge-status ${inv.badge}`}>
                      {inv.status}
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

export default Invoices;
