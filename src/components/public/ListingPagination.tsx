interface ListingPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

/** Shown only when there is more than one page. */
export function ListingPagination({ page, totalPages, onPageChange }: ListingPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav className="listing-pagination" aria-label="Pagination">
      <button
        type="button"
        className="btn btn-secondary"
        disabled={page <= 0}
        onClick={() => onPageChange(page - 1)}
      >
        Previous
      </button>
      <span className="listing-pagination-status">
        Page {page + 1} of {totalPages}
      </span>
      <button
        type="button"
        className="btn btn-secondary"
        disabled={page >= totalPages - 1}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </button>
    </nav>
  );
}
