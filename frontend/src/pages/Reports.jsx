import { FiDownload } from 'react-icons/fi';

const Reports = () => {
  return (
    <div className="d-flex flex-column gap-4">
      <div>
        <h1 className="h3 mb-1 text-white fw-bold">Procurement Reports & Analytics</h1>
        <p className="text-secondary small">Analyze procurement volume, vendor performance ratings, and budget spent charts.</p>
      </div>

      <div className="row g-4">
        {/* Report Card 1 */}
        <div className="col-12 col-md-6">
          <div className="card p-4">
            <h5 className="text-white mb-2 fw-semibold">Vendor Quality Audit</h5>
            <p className="text-secondary small mb-4">Detailed compliance reports outlining supplier delivery rates and audit scores.</p>
            <button type="button" className="btn btn-secondary d-flex align-items-center justify-content-center gap-2">
              <FiDownload /> Export Excel Report
            </button>
          </div>
        </div>

        {/* Report Card 2 */}
        <div className="col-12 col-md-6">
          <div className="card p-4">
            <h5 className="text-white mb-2 fw-semibold">Quarterly Budget Allocations</h5>
            <p className="text-secondary small mb-4">Analysis of contract spend against budgeted values for all active departments.</p>
            <button type="button" className="btn btn-secondary d-flex align-items-center justify-content-center gap-2">
              <FiDownload /> Export PDF Analytics
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
