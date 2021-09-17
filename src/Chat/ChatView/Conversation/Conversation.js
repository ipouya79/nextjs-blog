import ChatFooter from './ChatFooter/ChatFooter';
import ChatMainContent from './ChatMainContent/ChatMainContent';
import ChatTitleBar from './ChatTitleBar/ChatTitleBar';
import styles from './Conversation.module.css';
import { useQuery, useQueryClient } from 'react-query';
import getRequest from '../../../Util/GET/getRequest';
import { useEffect } from 'react';
import { BASE_URL } from '../../../BASE_URL/baseUrl';

const Conversation = ({ setDefaultView, chatId, otherUser }) => {
  const { data } = useQuery(
    ['chat', chatId],
    getRequest(`/api/messages/chat/${chatId}`),
    {
      enabled: !!chatId,
    }
  );

  const queryClient = useQueryClient();

  useEffect(() => {
    async function readChat() {
      try {
        await fetch(BASE_URL + '/api/mark/chat/as/read/' + chatId, {
          method: 'GET',
          credentials: 'include',
        });

        queryClient.invalidateQueries('unreadMessageCount');
      } catch (err) {
        return;
      }
    }

    readChat();
  }, [chatId]);

  return (
    <div className={`${styles.chatPageContainer}`}>
      <ChatTitleBar setDefaultView={setDefaultView} otherUser={otherUser} />
      <div className={`${styles.mainContentContainer}`}>
        <div className={`${styles.chatContainer}`}>
          <ChatMainContent messageData={data && data.messages} />
        </div>
      </div>
      <ChatFooter chatId={chatId} />
    </div>
  );
};

export default Conversation;
