import styles from './ChatTitleBar.module.css';

const ChatTitleBar = ({ setDefaultView, otherUser }) => {
  const returnList = () => {
    setDefaultView('');
  };

  return (
    <div className={`${styles.chatTitleBarContainer} position-relative`}>
      <div className={`${styles.chatImagesContainer}`}>
        <img src="https://toppng.com/uploads/preview/circled-user-icon-user-pro-icon-11553397069rpnu1bqqup.png" />
      </div>
      <span>{otherUser.username}</span>
      <i className="fas fa-angle-double-left" onClick={returnList}></i>
    </div>
  );
};

export default ChatTitleBar;
