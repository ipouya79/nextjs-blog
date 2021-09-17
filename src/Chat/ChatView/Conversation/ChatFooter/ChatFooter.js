import { useEffect, useState } from 'react';
import useRequest from '../../../../CustomHook/useRequest';
import styles from './ChatFooter.module.css';
import { useMutation, useQueryClient } from 'react-query';
import socket from '../../../socket.io/socket.io';

const ChatFooter = ({ chatId }) => {
  const [messageData, setMessageData] = useState({ chatId, content: '' });

  const typing = (e) => {
    setMessageData((prvs) => {
      return { ...prvs, content: e.target.value };
    });
    socket.emit('typing', chatId);
  };

  const stopType = () => {
    socket.emit('stop typing', chatId);
  };

  const doRequest = useRequest({
    url: '/api/message/new',
    method: 'POST',
    body: messageData,
  });

  const queryClient = useQueryClient();

  const mutation = useMutation(() => doRequest(), {
    onSuccess: (data) => {
      queryClient.setQueryData(['chat', chatId], (prvs) => {
        return { ...prvs, messages: [...prvs.messages, data] };
      });

      socket.emit('new message', data);

      setMessageData((prvs) => {
        return { ...prvs, content: '' };
      });
    },
  });

  const enterHandler = (e) => {
    if (e.keyCode === 13 || e.which === 13) {
      e.preventDefault();
      mutation.mutate();
      socket.emit('stop typing', chatId);
    }
  };

  useEffect(() => {
    socket.on('message received', (newMessage) => {
      queryClient.setQueryData(['chat', chatId], (prvs) => {
        return { ...prvs, messages: [...prvs.messages, newMessage] };
      });
    });
  }, [socket]);

  return (
    <div className={`${styles.footer}`}>
      <textarea
        value={messageData.content}
        onBlur={stopType}
        onChange={typing}
        onKeyDown={enterHandler}
      ></textarea>
      <button onClick={() => mutation.mutate()}>
        <i className="fas fa-paper-plane" aria-hidden="true"></i>
      </button>
    </div>
  );
};

export default ChatFooter;
