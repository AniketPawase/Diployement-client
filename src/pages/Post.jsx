import axios from 'axios';
import '../css/Post.css'
import React, { useContext, useEffect, useState } from 'react'
import {useParams,useNavigate} from 'react-router-dom'
import {AuthContext} from '../helpers/authContext'
 

function Post() {
    let {id} = useParams();
    const [postObj,setPostObj]= useState({});
    const [comments,setComments]= useState([]);
    const [newComment,setNewComment]=useState('');
    const {authState} = useContext(AuthContext)
    const navigate = useNavigate();

    useEffect(()=>{
        axios.get(`https://deployement-server.vercel.app/posts/${id}`).then((response)=>{
        console.log(response.data);
        setPostObj(response.data);
        });

        axios.get(`https://deployement-server.vercel.app/comments/${id}`).then((response)=>{
        console.log(response.data);
        setComments(response.data);
        });
    },[id]);

    //Adding A comment
    const addComment = () =>{
        axios
        .post(
          "https://deployement-server.vercel.app/comments",
          {
            commentBody: newComment,
            PostId: id,
          },
          {
            headers: {
                accessToken: localStorage.getItem("accessToken"),
            },
          }
        )
        .then((response) => {
          if (response.data.error) {
            alert(response.data.error);
          } else {
            const commentToAdd = { commentBody: newComment , username: response.data.username };
            setComments([...comments, commentToAdd]);
            setNewComment("");
          }
        });
    };

    //Deleting Comment
    const deleteComment=(id)=>{
      axios.delete(`https://deployement-server.vercel.app/comments/${id}`,{
        headers:{
          accessToken: localStorage.getItem("accessToken")
        }
      })
      .then(()=>{
        setComments(comments.filter((val)=>{
          return val.id  !== id;
        }))
      })
    }

    //Deleting a Post
//Deleting a Post
const deletePost = (id) => {
  axios.delete(`https://deployement-server.vercel.app/posts/${id}`, {
    headers: {
      accessToken: localStorage.getItem("accessToken"),
    },
  })
  .then((response) => {
    console.log(response.data); // Log the response to check if it's successful
    console.log("Post Deleted");
    navigate('/');
  })
  .catch((error) => {
    console.error("Error deleting post:", error);
    // Handle any error that might occur during deletion
  });
}


  const editPost =(option)=>{
    if(option === 'title'){
      let newTitle = prompt('Enter new Title')
      axios.put("https://deployement-server.vercel.app/posts/title",
      {newTitle: newTitle,
         id: id},{
        headers:{
          accessToken: localStorage.getItem("accessToken")
        }
      });
      setPostObj({...postObj,title: newTitle})
    }else{
      let newPostText = prompt('Enter new Text')
      axios.put("https://deployement-server.vercel.app/posts/postText",
      {newText: newPostText,
         id: id},{
        headers:{
          accessToken: localStorage.getItem("accessToken")
        }
      });
      setPostObj({...postObj,postText:newPostText})
    }
  }


  return (
    <div className='postPage'>
     <div className='leftSide'>
      <div className='post' id='indivisual'>
        {/* Title */}
      <div className='title'
      onClick={()=>{
        if(authState.username === postObj.username ){
        editPost('title')}}}>
        {postObj.title}
      </div>
      {/* Content */}
      <div className='body'
      onClick={()=>{
        if(authState.username === postObj.username ) {
        editPost('body')}}}>
        {postObj.postText}
      </div>

      <div className='footer'>{postObj.username}
      {authState.username === postObj.username &&
      <button 
        onClick={()=>{deletePost(postObj.id)}} >
        Delete A Post</button>}
      </div>  
      </div>  
     </div>
     <div className='rightSide'>
        <div className='addCommentContainer'>
            <input type='text'
            value={newComment} 
            placeholder='Comment ...'
            onChange={(event)=>{setNewComment(event.target.value)}}>  
            </input>
            <button onClick={addComment}>Add Comment</button>
        </div>
        <div className='listOfComments'>
            {comments.map((comment,key)=>{
                return(
                    <div key={key} className='comment'>
                        {comment.commentBody}
                        <label><h4>Username: {comment.username}</h4></label>
                        {authState.username === comment.username ? 
                        <button
                        className='deleteButton'
                        onClick={()=>{deleteComment(comment.id)}}>X</button>: null}
                    </div>
                      );
                    })}
        </div>
     </div>
    </div>
  )
}

export default Post