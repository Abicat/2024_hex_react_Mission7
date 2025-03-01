import PropTypes from "prop-types";


function Pagination({     
  pageInfo,
  handlePageChange
 }) {
  const handleClick = (event, page) => {
    event.preventDefault();
    changePage(page);
  };

  return (

<div className="d-flex justify-content-center">
<nav>
    <ul className="pagination">
        <li className={`page-item ${!pageInfo?.has_pre && 'disabled'}`}>
            <button className="page-link" onClick={() => handlePageChange(pageInfo?.current_page - 1)}>
                上一頁
            </button>
        </li>
        {Array.from({ length: pageInfo?.total_pages }).map((_, index) => (
            <li key={index} className={`page-item ${(pageInfo?.current_page === index + 1) && 'active'}`}>
                <button className="page-link" onClick={() => handlePageChange(index + 1)}>
                    {index + 1}
                </button>
            </li>
        ))}
        <li className={`page-item ${!pageInfo?.has_next && 'disabled'}`}>
            <button className="page-link" onClick={() => handlePageChange(pageInfo?.current_page + 1)}>
                下一頁
            </button>
        </li>
    </ul>
</nav>
</div>
  );
}

// Pagination.propTypes = {
//   pagination: PropTypes.shape({
//     total_pages: PropTypes.number,
//     current_page: PropTypes.number,
//     has_pre: PropTypes.bool,
//     has_next: PropTypes.bool,
//   }).isRequired,
//   changePage: PropTypes.func.isRequired,
// };

export default Pagination;
