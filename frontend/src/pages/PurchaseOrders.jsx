import { FiPlus, FiDownload } from 'react-icons/fi';

const PurchaseOrders = () => {
  const purchaseOrders = [
    { id: 'PO-2026-1029', vendor: 'Apex Metals Ltd', orderDate: 'Jun 05, 2026', deliveryDate: 'Jun 10, 2026', total: '$42,500.00', status: 'In Transit', badge: 'badge-info' },
    { id: 'PO-2026-1028', vendor: 'Titan Heavy Machinery', orderDate: 'May 30, 2026', deliveryDate: 'Jun 02, 2026', total: '$8,400.00', status: 'Delivered', badge: 'badge-success' },
  ];

  return (
    <div className="d-flex flex-column gap-4">
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <h1 className="h3 mb-1 text-white fw-bold">Purchase Orders (PO)</h1>
          <p className="text-secondary small">Track, export, and manage official purchase orders dispatched to suppliers.</p>
        </div>
        <button type="button" className="btn btn-primary d-flex align-items-center gap-2">
          <FiPlus /> New Order
        </button>
      </div>

      <div className="card p-4">
        <h6 className="text-white mb-3 fw-semibold">Dispatched Purchase Orders</h6>
        <div className="table-responsive border-0">
          <table className="table custom-table text-nowrap align-middle">
            <thead>
              <tr>
                <th scope="col">PO Number</th>
                <th scope="col">Vendor Partner</th>
                <th scope="col">Order Date</th>
                <th scope="col">Est. Delivery</th>
                <th scope="col">Amount</th>
                <th scope="col">Shipping Status</th>
                <th scope="col" className="text-center">Invoice Doc</th>
              </tr>
            </thead>
            <tbody>
              {purchaseOrders.map((po) => (
                <tr key={po.id}>
                  <td className="text-primary fw-medium">{po.id}</td>
                  <td className="fw-semibold text-white">{po.vendor}</td>
                  <td>{po.orderDate}</td>
                  <td>{po.deliveryDate}</td>
                  <td className="fw-bold">{po.total}</td>
                  <td>
                    <span className={`badge-status ${po.badge}`}>
                      {po.status}
                    </span>
                  </td>
                  <td>
                    <div className="d-flex justify-content-center">
                      <button type="button" className="btn btn-secondary btn-sm p-1.5 rounded-circle d-inline-flex" title="Download PDF PO">
                        <FiDownload size={14} />
                      </button>
                    </div>
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

export default PurchaseOrders;
