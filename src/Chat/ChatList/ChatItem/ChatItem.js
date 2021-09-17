import timeDifference from '../../../Util/ChangeDisplayFormat/changeDate';
import socket from '../../socket.io/socket.io';
import styles from './ChatItem.module.css';
import { UseAppContext } from '../../../Context/context';

const ChatItem = ({ setDefaultView, chatData, setOtherUser }) => {
  const { user } = UseAppContext();

  let date = timeDifference(
    Date.now(),
    new Date(chatData.latestMessage.createdAt)
  );

  let userTitle =
    chatData &&
    chatData.users
      .filter((itm) => itm._id !== user.mongoId)
      .map((itm) => itm.username)
      .join(',');

  const setChatView = () => {
    setOtherUser({ username: userTitle, avatar: '' });

    socket.emit('join room', chatData._id);

    setDefaultView(chatData._id);
  };

  return (
    <li
      className={`list-group-item border-0 mb-3 rounded-pill d-flex align-items-center position-relative ${styles.chatListContainer}`}
      onClick={setChatView}
    >
      <div className={styles.userImageContainer}>
        <img src="https://toppng.com/uploads/preview/circled-user-icon-user-pro-icon-11553397069rpnu1bqqup.png"></img>
      </div>
      <div className={`${styles.resultsDetailsContainer}`}>
        <span className={`${styles.heading} ellipsis`}>{userTitle}</span>
        <span className={`${styles.subText} text-muted`}>
          {chatData.latestMessage.content}
        </span>
      </div>
      <span className={styles.lastChatDate}>{date}</span>
    </li>
  );
};

export default ChatItem;
