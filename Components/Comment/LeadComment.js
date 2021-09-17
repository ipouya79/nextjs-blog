function timeDifference(current, previous) {
  var msPerMinute = 60 * 1000;
  var msPerHour = msPerMinute * 60;
  var msPerDay = msPerHour * 24;
  var msPerMonth = msPerDay * 30;
  var msPerYear = msPerDay * 365;
  var elapsed = current - previous;

  if (elapsed < msPerMinute) {
    if (elapsed / 1000 < 30) return "هم اکنون";
    return Math.round(elapsed / 1000) + "  ثانیه پیش";
  } else if (elapsed < msPerHour) {
    return Math.round(elapsed / msPerMinute) + " دقیقه پیش ";
  } else if (elapsed < msPerDay) {
    return Math.round(elapsed / msPerHour) + "ساعت پیش";
  } else if (elapsed < msPerMonth) {
    return Math.round(elapsed / msPerDay) + "  روز پیش";
  } else if (elapsed < msPerYear) {
    return Math.round(elapsed / msPerMonth) + "  ماه پیش";
  } else {
    return Math.round(elapsed / msPerYear) + " سال پیش";
  }
}

const LeadComment = ({ mainComment, setCommentState }) => {
  const prevComment = () => {
    if (mainComment.parentComment) {
      setCommentState((prvs) => {
        return { ...prvs, frkComment: mainComment.parentComment };
      });
    } else {
      setCommentState((prvs) => {
        return { ...prvs, frkComment: '', isTopLvl: true };
      });
    }
  };

  if (mainComment) {
    return (
      <div className="leadComment rounded p-2 shadow position-relative">
        <div className="d-flex flex-column">
          <h4>{mainComment.authorName}</h4>
          <small className="text-muted">
            {timeDifference(new Date(), new Date(mainComment.createdAt))}
          </small>
        </div>
        <p className="lead mt-1">{mainComment.content}</p>
        <i className="fa fa-undo" aria-hidden="true" onClick={prevComment}></i>
      </div>
    );
  } else return null;
};

export default LeadComment;
