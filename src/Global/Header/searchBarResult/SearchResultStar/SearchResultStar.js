const SearchResultStar = ({ count }) => {
  let stars = [];

  for (let i = 0; i < count + 1; i++) {
    stars.push(
      <i
        className="fa fa-star"
        style={{ color: 'gold' }}
        aria-hidden="true"
        key={i}
      ></i>
    );
  }

  return <span style={{ marginLeft: '11px' }}>{stars}</span>;
};

export default SearchResultStar;
