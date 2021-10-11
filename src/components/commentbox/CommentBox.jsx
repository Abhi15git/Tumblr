import { Button } from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { ContextApi } from "../ContextApi/ContextApiProvider";
import Comments from "./Comments";
import styles from "./Comments.module.css";

const CommentBox = ({ handleClose, post_id }) => {
  const { token,closeStream,setCloseStream } = useContext(ContextApi);
  const [commentInput, setCommentInput] = useState({ comment: "" });
  const [comments, setComments] = useState([]);

  

  const handleCommentInput = (e) => {
    const { name, value } = e.target;
    setCommentInput({ [name]: value });
  };

  const handleCommentBox = async () => {
    if (commentInput.comment === "") return;
    await postComments(post_id, token, commentInput, setComments);
    setCommentInput({ comment: "" });
  };

  let stream = async ()=>{
   let x = await getComments(post_id,  setComments);
   setCloseStream(x)
   
  }

  useEffect( () => {
   stream();
   return ()=>{
     if(closeStream)
     closeStream.close();
   }
  }, []);
  
  return (
    <div className={styles.commentBackground} onClick={handleClose}>
      <div
        className={styles.commentContainer}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.commentBox}>
          <p><b>Comments</b></p>
          {comments.map((el) => {
            return <Comments comment={el} />;
          })}
        </div>
        <div className={styles.newComment}>
          <input
            type="text"
            placeholder="comment"
            value={commentInput.comment}
            name="comment"
            onChange={handleCommentInput}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleCommentBox}
          >
            Comment
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CommentBox;

// api request
const getComments = (post_id, setComments) => {
  const sse = new EventSource(`${process.env.REACT_APP_API_URL}comments/sse/${post_id}`);
 
   console.log('open')
sse.addEventListener('message',function(e){
  console.log('reading message')
  try{

     setComments(JSON.parse(e.data));
  }
  catch{
     
  }
 
}
)
 

 return sse

  // axios
  //   .get(`${process.env.REACT_APP_API_URL}comments/${post_id}`, {
  //     headers: {
  //       Authorization: "Bearer " + token,
  //     },
  //   })
  //   .then((res) => {
  //     setComments(res.data.comments);
  //     getComments(post_id, token, setComments);
  //   })
  //   .catch((err) =>
  //     setTimeout(() => {
  //       getComments(post_id, token, setComments);
  //     }, 3000)
  //   );
};

//sse 


// post comment

const postComments = (post_id, token, payload, setComments) => {
  axios
    .post(`${process.env.REACT_APP_API_URL}comments/${post_id}`, payload, {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
    .then((res) => console.log(res.status))
    .catch((err) => console.log());
};
