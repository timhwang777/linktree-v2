import { useState } from "react";
import ReactPaginate from "react-paginate";
import { Link } from "@/types";
import { LinkCard } from "@/components/link-card";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface LinkGridProps {
  links: Link[];
  itemsPerPage?: number;
}

export function LinkGrid({ links, itemsPerPage = 5 }: LinkGridProps) {
  const [currentPage, setCurrentPage] = useState(0);

  // Calculate total number of pages
  const pageCount = Math.ceil(links.length / itemsPerPage);
  
  // Calculate the current items to display
  const offset = currentPage * itemsPerPage;
  const currentItems = links.slice(offset, offset + itemsPerPage);

  // Handle page change
  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected);
    
    // Scroll to top of grid on page change
    window.scrollTo({
      top: document.getElementById('link-grid')?.offsetTop || 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className="w-full space-y-8">
      <div id="link-grid" className="grid grid-cols-1 gap-3">
        {currentItems.map((link, index) => (
          <LinkCard key={`${link.title}-${index}`} link={link} />
        ))}
      </div>
      
      {pageCount > 1 && (
        <ReactPaginate
          previousLabel={<ChevronLeft className="h-4 w-4" />}
          nextLabel={<ChevronRight className="h-4 w-4" />}
          breakLabel="..."
          pageCount={pageCount}
          marginPagesDisplayed={1}
          pageRangeDisplayed={2}
          onPageChange={handlePageChange}
          containerClassName="flex justify-center items-center gap-1"
          pageLinkClassName="flex items-center justify-center h-8 w-8 rounded-md 
            border border-input bg-background 
            hover:bg-accent hover:text-accent-foreground
            dark:hover:bg-accent dark:hover:text-accent-foreground
            data-[state=selected]:bg-primary data-[state=selected]:text-primary-foreground"
          previousLinkClassName="flex items-center justify-center h-8 w-8 rounded-md border border-input bg-card text-card-foreground shadow-xs 
            hover:bg-accent hover:text-accent-foreground hover:border-primary
            dark:bg-card dark:text-card-foreground dark:hover:bg-accent dark:hover:text-accent-foreground
            transition-all duration-200 hover:scale-[1.02]"
          nextLinkClassName="flex items-center justify-center h-8 w-8 rounded-md border border-input bg-card text-card-foreground shadow-xs 
            hover:bg-accent hover:text-accent-foreground hover:border-primary
            dark:bg-card dark:text-card-foreground dark:hover:bg-accent dark:hover:text-accent-foreground
            transition-all duration-200 hover:scale-[1.02]"
          breakLinkClassName="flex items-center justify-center h-8 w-8"
          activeLinkClassName="bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
          disabledLinkClassName="text-muted-foreground cursor-not-allowed hover:bg-transparent"
        />
      )}
    </div>
  );
} 