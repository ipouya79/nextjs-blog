import { BASE_URL } from '../../src/BASE_URL/baseUrl';
import { toast } from 'react-toastify';

const CommentForm = ({ commentState, commentType, setCommentState }) => {
  let url =
    commentType === 'blog' ? `/api/blog/comment` : '/api/sample/comment';

  const sendComment = async (e) => {
    e.preventDefault();

    let field = commentType === 'blog' ? 'blogId' : 'sampleId';

    let body = {
      authorName: commentState.authorName,
      authorEmail: commentState.authorEmail,
      content: commentState.content,
    };

    if (commentState.isTopLvl) {
      body = {
        ...body,
        [field]: commentState.frkTopLvl,
      };
    } else {
      body = {
        ...body,
        commentId: commentState.frkComment,
      };
    }

    const reqComment = await fetch(BASE_URL + url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (reqComment.status === 201) {
      setCommentState((prvs) => {
        return { ...prvs, authorEmail: '', authorName: '', content: '' };
      });
      toast.success(
        'نظر شما با موفقیت ثبت شد و پس از بررسی در سایت به نمایش گذاشته میشود',
        {
          position: 'top-center',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      );
    } else {
      toast.error('مشکلی رخ داده است لطفا دوباره تلاش کنید', {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <div>
      <form className="commentForm" onSubmit={sendComment}>
        <div className="form-floating mb-2 w-75">
          <input
            type="email"
            className="form-control"
            id="commentEmail"
            value={commentState.authorEmail}
            onChange={(e) => {
              setCommentState((prvs) => {
                return { ...prvs, authorEmail: e.target.value };
              });
            }}
          />
          <label htmlFor="commentEmail">ایمیل</label>
        </div>
        <div className="form-floating w-75 mb-2">
          <input
            type="text"
            className="form-control"
            id="commentName"
            value={commentState.authorName}
            onChange={(e) => {
              setCommentState((prvs) => {
                return { ...prvs, authorName: e.target.value };
              });
            }}
          />
          <label htmlFor="commentName">نام و نام خانوادگی</label>
        </div>
        <div className="form-floating mb-2">
          <textarea
            className="form-control"
            aria-label="With textarea"
            id="commentText"
            value={commentState.content}
            onChange={(e) => {
              setCommentState((prvs) => {
                return { ...prvs, content: e.target.value };
              });
            }}
          ></textarea>
          <label htmlFor="commentText">متن نظر</label>
        </div>
        <button type="submit" className="btn btn-primary">
          ارسال
        </button>
      </form>
    </div>
  );
};

export default CommentForm;
