import styles from './Icons.module.css';
import Link from 'next/link';
import { useQuery } from 'react-query';
import getRequest from '../../../Util/GET/getRequest';

const HeaderIcons = ({ iconStyle }) => {
  const { data: unreadMsgCount } = useQuery(
    'unreadMessageCount',
    getRequest('/api/unread/message/count')
  );

  const { data: unreadNotifications } = useQuery(
    'unreadNotificationCount',
    getRequest('/api/notifications/count')
  );

  return (
    <div className={`${styles[iconStyle]} row col-1 justify-content-between`}>
      <div className="col-3 text-center">
        <span
          className={`${styles.userBadge} badge badge-pill bg-success text-white`}
        >
          <small>{unreadNotifications && unreadNotifications.total}</small>
        </span>
        <Link href="#">
          <a>
            <i className={`far fa-bell ${styles.full}`} aria-hidden="true"></i>
          </a>
        </Link>
      </div>
      <div className="col-3 text-center">
        <span
          className={`${styles.userBadge} badge badge-pill bg-info text-white`}
        >
          <small>{unreadMsgCount && unreadMsgCount.unreadMessagesCount}</small>
        </span>
        <Link href="#">
          <a>
            <i className="far fa-comment-dots" aria-hidden="true"></i>
          </a>
        </Link>
      </div>
    </div>
  );
};

export default HeaderIcons;
