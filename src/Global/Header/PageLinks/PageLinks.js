import HeaderLink from './HeaderLink/HeaderLink';
import info from '../../../../public/info.svg';
import ad from '../../../../public/ad.svg';
import blog from '../../../../public/blog.svg';
import styles from './HeaderLink/HeaderLink.module.css';

const PageLinks = ({ cls, navLiClass }) => {
  return (
    <ul className={`${cls} ${styles[navLiClass]}`}>
      <HeaderLink linkTo="/Chat" content="آگهی" icon={ad} />
      <HeaderLink linkTo="/" content="بانک اطلاعات" icon={info} />
      <HeaderLink linkTo="#" content="بلاگ" icon={blog} />
    </ul>
  );
};

export default PageLinks;
