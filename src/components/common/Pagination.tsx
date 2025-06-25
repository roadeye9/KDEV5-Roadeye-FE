import { Button } from "@nextui-org/react";

interface PaginationProps {
  currentPage: number;
  pageSize: number;
  totalElements: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, pageSize, totalElements, onPageChange }: PaginationProps) => {
  const totalPages = Math.ceil(totalElements / pageSize);
  const maxPageButtons = 10;
  const startPage = Math.floor((currentPage - 1) / maxPageButtons) * maxPageButtons + 1;
  const endPage = Math.min(startPage + maxPageButtons - 1, totalPages);
  const pageNumbers = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

  if (totalPages <= 1) return null;

  return (
    <footer className="py-4 flex justify-center bg-white border-t">
      <div className="flex gap-1">
        <Button
          size="sm"
          variant="light"
          isDisabled={startPage === 1}
          onClick={() => onPageChange(startPage - maxPageButtons > 0 ? startPage - maxPageButtons : 1)}
        >
          &lt;&lt;
        </Button>
        <Button
          size="sm"
          variant="light"
          isDisabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          &lt;
        </Button>
        {pageNumbers.map((pageNumber) => (
          <Button
            key={pageNumber}
            size="sm"
            variant={currentPage === pageNumber ? "solid" : "light"}
            color={currentPage === pageNumber ? "primary" : "default"}
            onClick={() => onPageChange(pageNumber)}
          >
            {pageNumber}
          </Button>
        ))}
        <Button
          size="sm"
          variant="light"
          isDisabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          &gt;
        </Button>
        <Button
          size="sm"
          variant="light"
          isDisabled={endPage >= totalPages}
          onClick={() => onPageChange(startPage + maxPageButtons)}
        >
          &gt;&gt;
        </Button>
      </div>
    </footer>
  );
};

export default Pagination; 