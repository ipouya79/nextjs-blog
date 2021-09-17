import styles from './ChatView.module.css';
import Conversation from './Conversation/Conversation';
import DefaultView from './DefaultView/DefaultView';

const ChatView = ({ defaultView, setDefaultView, otherUser }) => {
  return (
    <div className="position-relative col-md-7">
      <div className={`position-sticky top-0 mx-auto ${styles.chatView}`}>
        {!defaultView ? (
          <DefaultView />
        ) : (
          <Conversation
            setDefaultView={setDefaultView}
            chatId={defaultView}
            otherUser={otherUser}
          />
        )}
      </div>
    </div>
  );
};

export default ChatView;
