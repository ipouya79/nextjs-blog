import CommentList from './CommentList';
import LeadComment from './LeadComment';
import { useQuery } from 'react-query';
import getRequest from '../../src/Util/GET/getRequest';

const SubComment = ({ commentState, setCommentState, commentType }) => {
  let url =
    commentType === 'blog'
      ? '/api/comments/of/comment/'
      : '/api/comments/of/sample/comment/';
  const { data } = useQuery(
    ['commentz', commentState.frkComment, commentType],
    getRequest(url + commentState.frkComment)
  );

  let field = commentType === 'blog' ? 'BlogComments' : 'SampleDesignComments';

  return (
    <div>
      <LeadComment mainComment={data} setCommentState={setCommentState} />
      <CommentList
        commentList={data && data[field]}
        setCommentState={setCommentState}
      />
    </div>
  );
};

export default SubComment;
