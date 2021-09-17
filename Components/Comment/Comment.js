import { useState } from 'react';
import CommentForm from './CommentForm';
import CommentList from './CommentList';
import SubComment from './SubComment';
import { useQuery } from 'react-query';
import getRequest from '../../src/Util/GET/getRequest';

const Comment = ({ commentType, id }) => {
  const [commentState, setCommentState] = useState({
    authorName: '',
    authorEmail: '',
    content: '',
    isTopLvl: true,
    frkTopLvl: id,
    frkComment: '',
    type: commentType,
  });

  let url =
    commentType === 'blog'
      ? `/api/comments/of/blog/${id}`
      : `/api/comments/of/sample/${id}`;

  let keyName = commentType === 'blog' ? 'blogComment' : 'sampleComment';

  const { data } = useQuery([keyName, id, commentType], getRequest(url));

  return (
    <section className="container">
      <CommentForm
        commentState={commentState}
        commentType={commentType}
        setCommentState={setCommentState}
      />
      {commentState.isTopLvl ? (
        <CommentList commentList={data} setCommentState={setCommentState} />
      ) : (
        <SubComment
          commentState={commentState}
          setCommentState={setCommentState}
          commentType={commentType}
        />
      )}
    </section>
  );
};

export default Comment;
