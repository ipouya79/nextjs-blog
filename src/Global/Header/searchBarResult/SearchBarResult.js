import Results from './Results/Results';

const SearchBarResult = ({ userSearch, searchBarClass }) => {
  return (
    <div id="searchBarOverLay">
      <Results
        results={userSearch.ads}
        type="ad"
        searchBarClass={searchBarClass}
      />
      <Results
        results={userSearch.infoBanks}
        type="bank-info"
        searchBarClass={searchBarClass}
      />
    </div>
  );
};

export default SearchBarResult;
