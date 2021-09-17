import styles from './Results.module.css';
import Link from 'next/link';
import SearchResultStar from '../SearchResultStar/SearchResultStar';

const Results = ({ results, type, searchBarClass }) => {
  let content = type === 'ad' ? 'آگهی ها' : 'بانک اطلاعات';

  let result =
    results &&
    results.map((itm) => {
      let url = `${type}/${itm.id}`;

      return (
        <li className="list-group-item" key={itm.id}>
          <SearchResultStar count={itm.adType} />
          <Link href="#">
            <a>{itm.title}</a>
          </Link>
        </li>
      );
    });

  return (
    <>
      <h5 className={`bg-white w-50 ${styles.searchHeading}`}>
        نتیجه جستجو در {content}
      </h5>
      {results && results.length ? (
        <ul className={`${searchBarClass} ${styles.searchBarUl}`}>{result}</ul>
      ) : (
        <p
          className="text-center bg-white w-50"
          style={{
            marginRight: '23%',
            marginBottom: '0',
            paddingBottom: '10px',
          }}
        >
          نتیجه ای یافت نشد
        </p>
      )}
    </>
  );
};

export default Results;
