import getRequest from '../../Util/GET/getRequest';
import ChatItem from './ChatItem/ChatItem';
import styles from './ChatList.module.css';
import { useQuery } from 'react-query';

const ChatList = ({ setDefaultView, setOtherUser }) => {
  const { data } = useQuery('chatList', getRequest('/api/my/chats'), {
    refetchOnMount: true,
  });

  let chatRecords =
    data &&
    data.length &&
    data.map((itm) => {
      return (
        <ChatItem
          setDefaultView={setDefaultView}
          setOtherUser={setOtherUser}
          chatData={itm}
          key={itm._id}
        />
      );
    });

  return (
    <div className="col-md-5 bg-muted ps-3">
      <h5 className={styles.listTitle}>لیست گفتگوها</h5>
      <ul className="list-group ps-2">{chatRecords}</ul>
    </div>
  );
};

export default ChatList;
