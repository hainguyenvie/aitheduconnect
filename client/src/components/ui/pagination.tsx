import React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
}: PaginationProps) {
  // Tạo mảng số trang để hiển thị
  const getPageNumbers = () => {
    const pageNumbers = [];
    
    // Luôn hiển thị trang đầu
    pageNumbers.push(1);
    
    // Tính toán khoảng trang để hiển thị xung quanh trang hiện tại
    const startPage = Math.max(2, currentPage - siblingCount);
    const endPage = Math.min(totalPages - 1, currentPage + siblingCount);
    
    // Thêm dấu ... nếu có khoảng cách
    if (startPage > 2) {
      pageNumbers.push('...');
    }
    
    // Thêm các trang ở giữa
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    // Thêm dấu ... nếu có khoảng cách
    if (endPage < totalPages - 1) {
      pageNumbers.push('...');
    }
    
    // Luôn hiển thị trang cuối nếu có nhiều hơn 1 trang
    if (totalPages > 1) {
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };
  
  // Không hiển thị phân trang nếu chỉ có 1 trang
  if (totalPages <= 1) {
    return null;
  }
  
  const pageNumbers = getPageNumbers();
  
  return (
    <nav className="flex items-center justify-center">
      <ul className="flex items-center gap-1">
        {/* Nút Previous */}
        <li>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Trang trước"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </li>
        
        {/* Số trang */}
        {pageNumbers.map((page, index) => (
          <li key={index}>
            {page === '...' ? (
              <span className="px-3 py-2">
                <MoreHorizontal className="h-4 w-4" />
              </span>
            ) : (
              <Button
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => typeof page === 'number' && onPageChange(page)}
                className={`min-w-[40px] ${currentPage === page ? 'text-white' : ''}`}
              >
                {page}
              </Button>
            )}
          </li>
        ))}
        
        {/* Nút Next */}
        <li>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Trang sau"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </li>
      </ul>
    </nav>
  );
}