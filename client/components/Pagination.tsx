import React from "react";
import ReactPaginate from "react-paginate";

type PaginationProps = {
  pageCount:number ,
  handlePageClick:(selectedItem: { selected: number }) => void,
  currentPage:number
}
export default function Pagination({
  pageCount,
  handlePageClick,
  currentPage,
}:PaginationProps) {
  return (
    <div>
      {/*<button
        onClick={() => handlePageClick({selected:0})}
        disabled={currentPage === 1}
      >
        first
      </button>*/}
      <ReactPaginate
        previousLabel={"previous"}
        nextLabel={"next"}
        breakLabel={"..."}
        breakClassName={"break-me"}
        pageCount={pageCount}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageClick}
        containerClassName={"pagination"}
        activeClassName={"active"}
        pageClassName={"page-item"}
        pageLinkClassName={"page-link"}
        previousClassName={"page-item"}
        nextClassName={"page-item"}
        previousLinkClassName={"page-link"}
        nextLinkClassName={"page-link"}
        breakLinkClassName={"page-link"}
        disabledClassName={"disabled"}
        forcePage={currentPage - 1}
      />
      {/*<button
        onClick={() => handlePageClick({ selected: pageCount - 1 })}
        disabled={currentPage === pageCount}
      >
        last
      </button>*/}
    </div>
  );
}
