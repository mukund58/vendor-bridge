import { useState } from 'react';
import { 
  FiStar, 
  FiAward, 
  FiCheck, 
  FiX, 
  FiSliders
} from 'react-icons/fi';
import './Quotations.css';

// Mock comparisons datasets conforming exactly to GET /rfqs/{id}/comparison
const mockComparisons = {
  1: {
    rfqId: 1,
    rfqTitle: 'Raw Steel Sheet Coils',
    category: 'Raw Materials',
    quotations: [
      { quotationId: 101, vendor: 'Apex Metals Ltd', amount: 42500, deliveryDays: 5, rating: 4.8 },
      { quotationId: 102, vendor: 'Titan Heavy Machinery', amount: 45000, deliveryDays: 3, rating: 4.2 },
      { quotationId: 103, vendor: 'Stark Industries', amount: 39500, deliveryDays: 8, rating: 4.9 }
    ]
  },
  2: {
    rfqId: 2,
    rfqTitle: 'Cloud Server Hardware Racks',
    category: 'IT Solutions',
    quotations: [
      { quotationId: 201, vendor: 'NetScale Solutions', amount: 18900, deliveryDays: 14, rating: 4.5 },
      { quotationId: 202, vendor: 'Barry Labs', amount: 19500, deliveryDays: 7, rating: 4.1 }
    ]
  }
};

const Quotations = () => {
  const [selectedRfqId, setSelectedRfqId] = useState(1);
  const [sortOption, setSortOption] = useState('price-asc');
  const [selectedWinnerId, setSelectedWinnerId] = useState(null); // stores quotationId
  const [winningRemarks, setWinningRemarks] = useState('');
  
  // Selection Modal states
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [candidateQuote, setCandidateQuote] = useState(null);

  const activeComparison = mockComparisons[selectedRfqId];
  const { quotations, rfqTitle, category } = activeComparison;

  // Find lowest price and fastest delivery dynamics
  const lowestPrice = Math.min(...quotations.map(q => q.amount));
  const fastestDelivery = Math.min(...quotations.map(q => q.deliveryDays));

  // Recommendation logic: highest rating + lowest cost, or highest score
  // For raw steel sheets, Stark Industries is lowest and highest rating, so recommended
  // For cloud servers, NetScale is recommended
  const isRecommended = (quote) => {
    if (selectedRfqId === 1 && quote.quotationId === 103) return true;
    if (selectedRfqId === 2 && quote.quotationId === 201) return true;
    return false;
  };

  // Sort logic
  const sortedQuotations = [...quotations].sort((a, b) => {
    if (sortOption === 'price-asc') return a.amount - b.amount;
    if (sortOption === 'price-desc') return b.amount - a.amount;
    if (sortOption === 'delivery-asc') return a.deliveryDays - b.deliveryDays;
    if (sortOption === 'rating-desc') return b.rating - a.rating;
    return 0;
  });

  // Action: Select winner
  const initiateSelection = (quote) => {
    setCandidateQuote(quote);
    setIsConfirmOpen(true);
  };

  const handleConfirmSelection = (e) => {
    e.preventDefault();

    // Axios client payload print simulation (POST /rfqs/{id}/select-quotation)
    const payload = {
      quotationId: candidateQuote.quotationId,
      remarks: winningRemarks
    };
    
    console.log(`Axios POST /api/v1/rfqs/${selectedRfqId}/select-quotation payload:`, payload);
    
    setSelectedWinnerId(candidateQuote.quotationId);
    setIsConfirmOpen(false);
    setWinningRemarks('');
  };

  const handleResetSelection = () => {
    setSelectedWinnerId(null);
  };

  // Helper star renderer
  const renderStars = (rating) => {
    const stars = [];
    const floor = Math.floor(rating);
    for (let i = 1; i <= 5; i++) {
      if (i <= floor) {
        stars.push(<FiStar key={i} fill="currentColor" size={13} />);
      } else {
        stars.push(<FiStar key={i} size={13} style={{ opacity: 0.3 }} />);
      }
    }
    return <span className="rating-stars me-1.5">{stars}</span>;
  };

  return (
    <div className="d-flex flex-column gap-4">
      {/* Header Panel */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3">
        <div>
          <h1 className="h3 mb-1 text-white fw-bold">Quotation Comparison</h1>
          <p className="text-secondary small">Compare supplier bidding prices, timelines, ratings, and authorize winner bids.</p>
        </div>
        
        {/* RFQ Select Dropdown */}
        <div className="d-flex align-items-center bg-secondary px-3 py-1.5 rounded-3 border border-light">
          <label htmlFor="rfq-select" className="text-muted extra-small me-2 mb-0 uppercase fw-bold">RFQ Scope:</label>
          <select 
            id="rfq-select"
            className="form-select form-select-sm bg-transparent border-0 text-white cursor-pointer py-0 outline-none fw-semibold"
            style={{ width: '250px' }}
            value={selectedRfqId}
            onChange={(e) => {
              setSelectedRfqId(parseInt(e.target.value));
              setSelectedWinnerId(null); // Reset winner selection on RFQ toggle
            }}
          >
            <option value={1} style={{ backgroundColor: 'var(--bg-secondary)' }}>RFQ-0041: Steel Sheet Coils</option>
            <option value={2} style={{ backgroundColor: 'var(--bg-secondary)' }}>RFQ-0040: Cloud Server Racks</option>
          </select>
        </div>
      </div>

      {/* Target RFQ Scope Alert card */}
      <div className="card p-3 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
        <div>
          <div className="d-flex align-items-center gap-2">
            <span className="badge-status badge-info uppercase extra-small">{category}</span>
            <span className="text-muted small">RFQ ID: {selectedRfqId}</span>
          </div>
          <h5 className="text-white fw-bold mt-1.5 mb-0">{rfqTitle}</h5>
        </div>
        {selectedWinnerId && (
          <div className="d-flex align-items-center gap-3">
            <div className="badge-status badge-success py-1.5 px-3 rounded d-flex align-items-center gap-2">
              <FiCheck /> Winning Bid Locked
            </div>
            <button type="button" className="btn btn-secondary btn-sm" onClick={handleResetSelection}>
              Reset Selection
            </button>
          </div>
        )}
      </div>

      {/* Side-by-side Comparative Cards */}
      <div className="d-flex flex-column gap-2">
        <h6 className="text-secondary small fw-bold uppercase tracking-wider mb-2">Side-by-Side Analysis</h6>
        <div className="row g-3">
          {quotations.map((quote) => {
            const isLowest = quote.amount === lowestPrice;
            const isFastest = quote.deliveryDays === fastestDelivery;
            const recommended = isRecommended(quote);
            const isWinner = selectedWinnerId === quote.quotationId;

            return (
              <div key={quote.quotationId} className="col-12 col-md-6 col-lg-4">
                <div 
                  className={`card h-100 p-4 comparison-card ${
                    isWinner ? 'winner-active' : recommended ? 'recommended' : ''
                  }`}
                >
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <h5 className="text-white fw-bold mb-1 fs-6">{quote.vendor}</h5>
                      <span className="text-muted extra-small">Quote Ref: QTN-{quote.quotationId}</span>
                    </div>
                    
                    {/* Top Right recommendation badge */}
                    {recommended ? (
                      <span className="badge-status badge-info d-flex align-items-center gap-1">
                        <FiAward size={12} /> Recommended
                      </span>
                    ) : isWinner ? (
                      <span className="badge-status badge-success d-flex align-items-center gap-1">
                        <FiCheck size={12} /> Winner
                      </span>
                    ) : null}
                  </div>

                  <div className="d-flex flex-column gap-3 py-3 border-top border-bottom border-light">
                    {/* Amount */}
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="text-secondary small">Bidding Cost:</span>
                      <div className="d-flex align-items-center gap-1.5">
                        <span className={`fw-bold fs-5 ${isLowest ? 'text-success' : 'text-white'}`}>
                          ${quote.amount.toLocaleString()}
                        </span>
                        {isLowest && (
                          <span className="badge bg-success bg-opacity-10 text-success extra-small py-0.5 px-1.5 rounded">
                            Lowest
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Delivery Days */}
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="text-secondary small">Delivery Window:</span>
                      <div className="d-flex align-items-center gap-1.5">
                        <span className="text-white fw-medium">{quote.deliveryDays} Days</span>
                        {isFastest && (
                          <span className="badge bg-info bg-opacity-10 text-info extra-small py-0.5 px-1.5 rounded">
                            Fastest
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="text-secondary small">Audited Rating:</span>
                      <div className="d-flex align-items-center">
                        {renderStars(quote.rating)}
                        <span className="text-white fw-bold small">{quote.rating}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card bottom action button */}
                  <div className="mt-4 pt-1 text-center">
                    <button
                      type="button"
                      disabled={selectedWinnerId !== null}
                      className={`btn btn-sm w-100 ${
                        isWinner 
                          ? 'btn-success' 
                          : recommended 
                            ? 'btn-primary' 
                            : 'btn-secondary'
                      }`}
                      onClick={() => initiateSelection(quote)}
                    >
                      {isWinner ? 'Winning Vendor Selected' : 'Select Winning Quotation'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Comprehensive Table & Filter view */}
      <div className="card p-4 mt-2">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-stretch align-items-md-center gap-3 mb-4">
          <div>
            <h5 className="text-white mb-1 fw-semibold fs-6">Compare Quotations Ledger</h5>
            <p className="text-secondary extra-small mb-0">Tabular comparison of received quotations</p>
          </div>
          
          {/* Sorting panel */}
          <div className="d-flex align-items-center bg-secondary px-3 py-1 rounded-3 border border-light" style={{ width: '220px' }}>
            <FiSliders className="text-muted me-2" size={14} />
            <select 
              className="form-select form-select-sm bg-transparent border-0 text-white cursor-pointer py-0 outline-none" 
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              aria-label="Sort options"
            >
              <option value="price-asc" style={{ backgroundColor: 'var(--bg-secondary)' }}>Price: Low to High</option>
              <option value="price-desc" style={{ backgroundColor: 'var(--bg-secondary)' }}>Price: High to Low</option>
              <option value="delivery-asc" style={{ backgroundColor: 'var(--bg-secondary)' }}>Delivery: Fast to Slow</option>
              <option value="rating-desc" style={{ backgroundColor: 'var(--bg-secondary)' }}>Rating: High to Low</option>
            </select>
          </div>
        </div>

        <div className="table-responsive border-0">
          <table className="table custom-table text-nowrap align-middle">
            <thead>
              <tr>
                <th scope="col">Vendor</th>
                <th scope="col">Amount</th>
                <th scope="col">Delivery Days</th>
                <th scope="col">Rating</th>
                <th scope="col">Recommendation</th>
                <th scope="col" className="text-end">Action</th>
              </tr>
            </thead>
            <tbody>
              {sortedQuotations.map((quote) => {
                const isLowest = quote.amount === lowestPrice;
                const isFast = quote.deliveryDays === fastestDelivery;
                const recommended = isRecommended(quote);
                const isWinner = selectedWinnerId === quote.quotationId;

                return (
                  <tr key={quote.quotationId} className={isWinner ? 'highlight-lowest' : ''}>
                    <td className="fw-semibold text-white">
                      <div className="d-flex flex-column">
                        <span>{quote.vendor}</span>
                        <span className="text-muted extra-small">QTN-{quote.quotationId}</span>
                      </div>
                    </td>
                    <td className={`fw-bold ${isLowest ? 'text-success' : 'text-white'}`}>
                      ${quote.amount.toLocaleString()}
                    </td>
                    <td>
                      <span className={`fw-medium ${isFast ? 'text-info' : ''}`}>
                        {quote.deliveryDays} Days
                      </span>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        {renderStars(quote.rating)}
                        <span className="small text-secondary">{quote.rating}</span>
                      </div>
                    </td>
                    <td>
                      {recommended ? (
                        <span className="badge-status badge-info extra-small">
                          <FiAward size={10} className="me-1" /> Best Value
                        </span>
                      ) : isWinner ? (
                        <span className="badge-status badge-success extra-small">
                          <FiCheck size={10} className="me-1" /> Selected
                        </span>
                      ) : (
                        <span className="text-muted small">-</span>
                      )}
                    </td>
                    <td className="text-end">
                      <button 
                        type="button" 
                        disabled={selectedWinnerId !== null}
                        className={`btn btn-sm ${isWinner ? 'btn-success' : 'btn-primary'}`}
                        onClick={() => initiateSelection(quote)}
                        style={{ fontSize: '0.8rem' }}
                      >
                        {isWinner ? 'Selected' : 'Select Vendor'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirm Selection Custom Modal */}
      {isConfirmOpen && (
        <div className="custom-modal-overlay">
          <div className="custom-modal-content card p-4 glass border border-light" style={{ width: '450px' }}>
            <div className="d-flex justify-content-between align-items-center mb-3.5 pb-2.5 border-bottom border-light">
              <h5 className="text-white fw-bold m-0">Confirm Selection</h5>
              <button 
                type="button" 
                className="btn border-0 p-0 text-white text-muted-hover"
                onClick={() => setIsConfirmOpen(false)}
                aria-label="Close modal"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-secondary small">
                You are selecting <strong className="text-white">{candidateQuote.vendor}</strong> as the winner for <strong className="text-white">{rfqTitle}</strong> scope.
              </p>
              
              <div className="p-3 winning-badge-banner d-flex justify-content-between align-items-center mt-3 mb-3">
                <div>
                  <span className="text-muted extra-small uppercase">Quotation Total Cost</span>
                  <div className="text-success fw-bold fs-5">${candidateQuote.amount.toLocaleString()}</div>
                </div>
                <div className="text-end">
                  <span className="text-muted extra-small uppercase">Delivery Days</span>
                  <div className="text-white fw-bold fs-5">{candidateQuote.deliveryDays} Days</div>
                </div>
              </div>

              <form onSubmit={handleConfirmSelection} className="d-flex flex-column gap-3">
                <div className="form-group">
                  <label className="text-secondary small mb-1 fw-medium" htmlFor="winning-remarks">Evaluation Remarks / Feedback</label>
                  <div className="form-input-wrapper px-3 py-2 rounded-3">
                    <textarea 
                      id="winning-remarks"
                      rows={3}
                      required
                      placeholder="e.g. Best price + fastest timeline matching steel requirements."
                      className="bg-transparent border-0 text-white w-100 fs-7 outline-none"
                      value={winningRemarks}
                      onChange={(e) => setWinningRemarks(e.target.value)}
                    />
                  </div>
                </div>

                <div className="d-flex justify-content-end gap-2 mt-3.5 pt-2 border-top border-light">
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => setIsConfirmOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary btn-sm px-4 fw-medium">
                    Confirm & Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Quotations;
