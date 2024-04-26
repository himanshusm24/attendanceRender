import Link from 'next/link';

const Pagination = ({ currentPage, totalPages, clickEventFun }) => {
    const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);
    console.log(clickEventFun);
    return (
        <div>
            {pageNumbers.map((pageNumber, index) => (
                <Link className={(pageNumber === currentPage) ? 'join-item btn btn-square text-white  bg-blue-700' : 'join-item btn btn-square text-white bg-gray-300'} key={pageNumber} href={`/admin/manage-attendance?page_number=` + index} onClick={(e) => clickEventFun(index)} >
                    <label style={{ textDecoration: 'none' }}>
                        {pageNumber === currentPage ? <strong>{pageNumber}</strong> : pageNumber}
                    </label>
                </Link>
            ))}
        </div>
    );
};

export default Pagination;
