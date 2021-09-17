import { useEffect, useState } from 'react';
import ChatList from './ChatList/ChatList';
import ChatView from './ChatView/ChatView';
import socket from './socket.io/socket.io';
import { UseAppContext } from '../../src/Context/context';

const ChatComponenet = () => {
  const [defaultView, setDefaultView] = useState('');
  const [otherUser, setOtherUser] = useState({
    username: '',
    avatar: '',
  });

  const { user } = UseAppContext();

  useEffect(() => {
    socket.connect();

    if (user) {
      socket.emit('setup', user.mongoId);
    }
  }, []);

  return (
    <section className="container">
      <div className="row justify-content-center">
        {!defaultView ? (
          <ChatList
            setDefaultView={setDefaultView}
            setOtherUser={setOtherUser}
          />
        ) : null}
        <ChatView
          defaultView={defaultView}
          setDefaultView={setDefaultView}
          otherUser={otherUser}
        />
      </div>
    </section>
  );
};

export default ChatComponenet;
