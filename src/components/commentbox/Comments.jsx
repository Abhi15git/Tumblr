import React, { useState } from 'react'
import styles from './Comments.module.css';
import { AvatarGenerator } from 'random-avatar-generator';
import { Button } from '@mui/material';
 
const generator = new AvatarGenerator();

const Comments = ({comment}) => {
    
    const [replyBox,setReplyBox] = useState(false);

    return (
        <div className={styles.comment}>
            <div>
                <img src={generator.generateRandomAvatar('avatar')} alt="" />
            </div>
            <div className={styles.commentText}>
                <span><b>{comment.user_id.blog_name}</b></span>
                <p>{comment.comment}</p>
            </div>
        </div>
    )
}

export default Comments
