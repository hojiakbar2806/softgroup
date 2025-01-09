import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { usePathname, useRouter } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";

interface PaginationProps {
  totalPages: number;
}

const CustomPagination: React.FC<PaginationProps> = ({ totalPages }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentPage = Number(searchParams?.get("page")) || 1;

  // Tugmalar sonini aniqlash (mobil yoki desktop uchun)
  // const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;
  // const delta = isMobile ? 1 : 2; // Mobil uchun 1, katta ekranlar uchun 2

  // const getPageNumbers = (): (number | string)[] => {
  //   const range: number[] = [];
  //   const rangeWithDots: (number | string)[] = [];

  //   for (
  //     let i = Math.max(2, currentPage - delta);
  //     i <= Math.min(totalPages - 1, currentPage + delta);
  //     i++
  //   ) {
  //     range.push(i);
  //   }

  //   if (currentPage - delta > 2) {
  //     rangeWithDots.push(1, "...");
  //   } else {
  //     rangeWithDots.push(1);
  //   }

  //   rangeWithDots.push(...range);

  //   if (currentPage + delta < totalPages - 1) {
  //     rangeWithDots.push("...", totalPages);
  //   } else if (totalPages > 1) {
  //     rangeWithDots.push(totalPages);
  //   }

  //   return rangeWithDots;
  // };

  const createQueryString = (name: string, value: string) => {
    const params = searchParams
      ? new URLSearchParams(searchParams.toString())
      : new URLSearchParams();
    params.set(name, value);
    return params.toString();
  };

  const handlePageChange = (page: number) => {
    if (page !== currentPage) {
      const queryString = createQueryString("page", page.toString());
      router.push(`${pathname}?${queryString}`);
    }
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
            className={`${
              currentPage === 1
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            } select-none`}
            aria-disabled={currentPage === 1}
          />
        </PaginationItem>

        {currentPage}

        {/* {getPageNumbers().map((pageNumber, idx) => (
          <PaginationItem key={idx}>
            {pageNumber === "..." ? (
              <span className="px-4 py-2">...</span>
            ) : (
              <PaginationLink
                onClick={() => handlePageChange(Number(pageNumber))}
                isActive={currentPage === pageNumber}
                className={`cursor-pointer select-none ${
                  currentPage === pageNumber ? "bg-blue-500 text-white" : ""
                }`}
              >
                {pageNumber}
              </PaginationLink>
            )}
          </PaginationItem>
        ))} */}

        <PaginationItem>
          <PaginationNext
            onClick={() =>
              handlePageChange(Math.min(totalPages, currentPage + 1))
            }
            className={`${
              currentPage === totalPages
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            } select-none`}
            aria-disabled={currentPage === totalPages}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default CustomPagination;
