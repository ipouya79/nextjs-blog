import CommentRecord from './CommentRecord';

const CommentList = ({ commentList, setCommentState }) => {
  let comments =
    commentList &&
    commentList.map((itm) => {
      return (
        <CommentRecord
          commentContent={itm}
          key={itm.id}
          setCommentState={setCommentState}
        />
      );
    });

  return <ul>{comments}</ul>;
};

export default CommentList;
