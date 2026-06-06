import { FiPlus, FiSearch, FiSliders } from 'react-icons/fi';

const mockVendors = [
  { id: 'VND-001', name: 'Apex Metals Ltd', contact: 'John Carter', email: 'john@apexmetals.com', category: 'Raw Materials', rating: '9.4', status: 'Active', badge: 'badge-success' },
  { id: 'VND-002', name: 'NetScale Solutions', contact: 'Emma Stone', email: 'support@netscale.io', category: 'IT Solutions', rating: '8.8', status: 'Active', badge: 'badge-success' },
  { id: 'VND-003', name: 'Habitat Crafts', contact: 'Daniel Craig', email: 'sales@habitat.com', category: 'Office Goods', rating: '7.9', status: 'On Probation', badge: 'badge-warning' },
  { id: 'VND-004', name: 'Titan Heavy Machinery', contact: 'Sarah Connor', email: 'info@titanheavy.com', category: 'Equipment', rating: '9.1', status: 'Active', badge: 'badge-success' },
  { id: 'VND-005', name: 'Global Logistics Inc', contact: 'Bruce Wayne', email: 'bruce@globallogistics.com', category: 'Logistics', rating: '8.5', status: 'Inactive', badge: 'badge-danger' },
];

const Vendors = () => {
  return (
    <div className="d-flex flex-column gap-4">
      {/* Header */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3">
        <div>
          <h1 className="h3 mb-1 text-white fw-bold">Vendor Management</h1>
          <p className="text-secondary small">Onboard, manage credentials, and audit partner compliance ratings.</p>
        </div>
        <button type="button" className="btn btn-primary d-flex align-items-center gap-2">
          <FiPlus /> Add Vendor
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="card p-3">
        <div className="d-flex flex-column flex-md-row gap-3 justify-content-between align-items-stretch align-items-md-center">
          <div className="d-flex align-items-center bg-secondary px-3 py-1.5 rounded-3 border border-light flex-grow-1" style={{ maxWidth: '400px' }}>
            <FiSearch className="text-muted me-2" />
            <input type="text" className="bg-transparent border-0 text-white w-100 fs-7 outline-none" style={{ outline: 'none' }} placeholder="Filter by name, ID or category..." />
          </div>
          <div className="d-flex gap-2">
            <button type="button" className="btn btn-secondary d-flex align-items-center gap-2 text-nowrap btn-sm">
              <FiSliders /> Filters
            </button>
            <select className="form-select form-select-sm bg-secondary border-color text-white" style={{ width: '150px' }}>
              <option>Sort by Rating</option>
              <option>Sort by Name</option>
            </select>
          </div>
        </div>
      </div>

      {/* Vendors Table */}
      <div className="card p-4">
        <div className="table-responsive border-0">
          <table className="table custom-table text-nowrap align-middle">
            <thead>
              <tr>
                <th scope="col">Vendor ID</th>
                <th scope="col">Company Name</th>
                <th scope="col">Contact Person</th>
                <th scope="col">Category</th>
                <th scope="col">Audited Rating</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {mockVendors.map((vendor) => (
                <tr key={vendor.id}>
                  <td className="text-primary fw-medium">{vendor.id}</td>
                  <td className="fw-semibold text-white">{vendor.name}</td>
                  <td>
                    <div className="d-flex flex-column">
                      <span className="text-white small">{vendor.contact}</span>
                      <span className="text-muted extra-small">{vendor.email}</span>
                    </div>
                  </td>
                  <td>{vendor.category}</td>
                  <td>
                    <div className="d-flex align-items-center gap-1.5 text-white fw-bold">
                      <span className="text-primary">★</span> {vendor.rating}
                    </div>
                  </td>
                  <td>
                    <span className={`badge-status ${vendor.badge}`}>
                      {vendor.status}
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

export default Vendors;
