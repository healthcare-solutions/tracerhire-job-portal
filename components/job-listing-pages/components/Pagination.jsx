const Pagination = ({handlePageChange, currentPage, noOfPage}) => {
  console.log(noOfPage)
  const pages = [ ...Array(noOfPage).keys() ].map( i => i+1);
  return (
    <nav className="ls-pagination">
      <ul>
        <li className="prev" onClick={ () => {
          if(currentPage > 1) handlePageChange(currentPage - 1)
          else handlePageChange(currentPage)
        }}>
          <a href="#">
            <i className="fa fa-arrow-left"></i>
          </a>
        </li>
        {pages.map((item) => 
          <li onClick={ () => handlePageChange(item)}>
            <a href="#" className={`${currentPage == item ? "current-page" : ""}`}>{item}</a>
          </li>
        )}
        {/* <li onClick={ () => handlePageChange(1)}>
          <a href="#" className={`${currentPage == 1 ? "current-page" : ""}`}>1</a>
        </li>
        <li onClick={ () => handlePageChange(2)}>
          <a href="#" className={`${currentPage == 2 ? "current-page" : ""}`}>
            2
          </a>
        </li>
        <li onClick={ () => handlePageChange(3)}>
          <a href="#" className={`${currentPage == 3 ? "current-page" : ""}`}>3</a>
        </li> */}
        <li className="next">
          <a href="#">
            <i className="fa fa-arrow-right"></i>
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
