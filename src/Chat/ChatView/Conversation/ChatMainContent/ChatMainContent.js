import styles from './ChatMainContent.module.css';
import ReactLoading from 'react-loading';

import { UseAppContext } from '../../../../Context/context';
import { useEffect, useRef, useState } from 'react';
import socket from '../../../socket.io/socket.io';

const ChatMainContent = ({ messageData }) => {
  const [typing, setTyping] = useState(styles.typingDots);
  const { user } = UseAppContext();

  const ulRef = useRef(null);

  useEffect(() => {
    if (ulRef.current) {
      ulRef.current.scrollTop = 1e9;
    }
  }, [messageData]);

  useEffect(() => {
    socket.on('typing', () => {
      setTyping(styles.typingDotsShow);
      if (ulRef.current) {
        ulRef.current.scrollTop = 1e9;
      }
    });

    socket.on('stop typing', () => {
      setTyping(styles.typingDots);
    });
  }, [socket]);

  let messages =
    messageData &&
    messageData.length &&
    messageData.map((itm) => {
      let sender = itm.sender._id == user.mongoId ? styles.mine : styles.theirs;

      return (
        <li key={itm.id} className={`${sender} ${styles.message}`}>
          <div className={`${styles.messageContainer}`}>
            <span className={`${styles.messageBody}`}>{itm.content}</span>
          </div>
        </li>
      );
    });

  return messageData ? (
    <ul className={`${styles.chatMessages} px-5`} ref={ulRef}>
      {messages}
      <div className={typing}>
        <ReactLoading type="bubbles" color="#6b6b6b" height={40} width={40} />
      </div>
    </ul>
  ) : (
    <div>
      <ReactLoading type="bubbles" color="#6b6b6b" height={40} width={40} />
    </div>
  );
};

export default ChatMainContent;
