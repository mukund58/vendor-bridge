using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.Data;
using Backend.DTOs;
using Backend.Entities;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services;

public interface IApprovalService
{
    Task<IEnumerable<ApprovalDto>> GetPendingApprovalsAsync();
    Task<ApprovalDto?> GetApprovalByIdAsync(int id);
    Task<bool> ApproveApprovalAsync(int id, ApproveRejectDto dto, int userId, string userRole);
    Task<bool> RejectApprovalAsync(int id, ApproveRejectDto dto, int userId, string userRole);
    Task<Approval> CreateApprovalAsync(int rfqId, int quotationId);
}

public class ApprovalService : IApprovalService
{
    private readonly AppDbContext _context;

    public ApprovalService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<ApprovalDto>> GetPendingApprovalsAsync()
    {
        var approvals = await _context.Approvals
            .Include(a => a.RFQ!)
                .ThenInclude(r => r.CreatedBy!)
            .Include(a => a.Quotation!)
                .ThenInclude(q => q.Vendor!)
            .Where(a => a.Status == ApprovalStatus.PENDING || a.Status == ApprovalStatus.L1_APPROVED)
            .OrderByDescending(a => a.CreatedAt)
            .ToListAsync();

        return approvals.Select(MapToDto);
    }

    public async Task<ApprovalDto?> GetApprovalByIdAsync(int id)
    {
        var approval = await _context.Approvals
            .Include(a => a.RFQ!)
                .ThenInclude(r => r.CreatedBy!)
            .Include(a => a.Quotation!)
                .ThenInclude(q => q.Vendor!)
            .FirstOrDefaultAsync(a => a.Id == id);

        return approval == null ? null : MapToDto(approval);
    }

    public async Task<bool> ApproveApprovalAsync(int id, ApproveRejectDto dto, int userId, string userRole)
    {
        var approval = await _context.Approvals
            .Include(a => a.RFQ)
            .Include(a => a.Quotation)
            .FirstOrDefaultAsync(a => a.Id == id);

        if (approval == null) return false;

        if (approval.Status == ApprovalStatus.PENDING)
        {
            // Level 1 Approval requires MANAGER or ADMIN
            if (userRole != "MANAGER" && userRole != "ADMIN")
                return false;

            approval.Status = ApprovalStatus.L1_APPROVED;
            approval.Level = 2;
            approval.ApproverId = userId;
            approval.Remarks = dto.Remarks;
            approval.ApprovedAt = DateTime.UtcNow;
        }
        else if (approval.Status == ApprovalStatus.L1_APPROVED)
        {
            // Level 2 Approval requires ADMIN
            if (userRole != "ADMIN")
                return false;

            approval.Status = ApprovalStatus.L2_APPROVED;
            approval.ApproverId = userId;
            approval.Remarks = dto.Remarks;
            approval.ApprovedAt = DateTime.UtcNow;

            // Final approval transition:
            if (approval.RFQ != null)
            {
                approval.RFQ.Status = RFQStatus.Completed;
            }

            if (approval.Quotation != null)
            {
                approval.Quotation.Status = QuotationStatus.Selected;

                // Reject other quotations for this RFQ
                var otherQuotes = await _context.Quotations
                    .Where(q => q.RFQId == approval.RFQId && q.Id != approval.QuotationId)
                    .ToListAsync();
                foreach (var q in otherQuotes)
                {
                    q.Status = QuotationStatus.Rejected;
                }
            }
        }
        else
        {
            return false;
        }

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> RejectApprovalAsync(int id, ApproveRejectDto dto, int userId, string userRole)
    {
        var approval = await _context.Approvals
            .Include(a => a.RFQ)
            .Include(a => a.Quotation)
            .FirstOrDefaultAsync(a => a.Id == id);

        if (approval == null) return false;
        if (approval.Status != ApprovalStatus.PENDING && approval.Status != ApprovalStatus.L1_APPROVED) return false;

        // Requires MANAGER or ADMIN
        if (userRole != "MANAGER" && userRole != "ADMIN")
            return false;

        approval.Status = ApprovalStatus.REJECTED;
        approval.ApproverId = userId;
        approval.Remarks = dto.Remarks;
        approval.ApprovedAt = DateTime.UtcNow;

        // Reset RFQ back to QuotationReceived so another quote can be selected
        if (approval.RFQ != null)
        {
            approval.RFQ.Status = RFQStatus.QuotationReceived;
        }

        if (approval.Quotation != null)
        {
            approval.Quotation.Status = QuotationStatus.Rejected;
        }

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<Approval> CreateApprovalAsync(int rfqId, int quotationId)
    {
        var approval = new Approval
        {
            RFQId = rfqId,
            QuotationId = quotationId,
            Level = 1,
            Status = ApprovalStatus.PENDING
        };

        _context.Approvals.Add(approval);
        await _context.SaveChangesAsync();
        return approval;
    }

    private static ApprovalDto MapToDto(Approval a) => new ApprovalDto
    {
        Id = a.Id,
        RFQId = a.RFQId,
        RfqTitle = a.RFQ?.Title ?? "Unknown RFQ",
        VendorName = a.Quotation?.Vendor?.CompanyName ?? "Unknown Vendor",
        Amount = a.Quotation?.TotalPrice ?? 0,
        Status = a.Status.ToString(),
        CreatedAt = a.CreatedAt,
        Requester = a.RFQ?.CreatedBy?.Name ?? "Unknown User",
        Description = a.RFQ?.Description ?? string.Empty,
        Remarks = a.Remarks
    };
}
