import axios from 'axios';
import '../css/Profile.css'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {AuthContext} from '../helpers/authContext'
import {toast} from "react-toastify" 

function Profile() {
    let {id} = useParams();
    const [username,setUsername]=useState("");
    const [listOfPosts,setListOfPosts]= useState([]);
    const navigate = useNavigate();
    const {authState} = useContext(AuthContext)

    useEffect(()=>{
        axios.get(`http://localhost:3001/auth/basicInfo/${id}`)
        .then((response)=>{
            console.log(response.data);
            setUsername(response.data.username);
        })
        axios.get(`http://localhost:3001/posts/byUser/${id}`)
        .then((response1)=>{
            console.log(response1.data);
            setListOfPosts(response1.data)
        })
        toast.success("Welcome to Profile Page")
    },[id])

  return (
    <div className='profilePageContainer'>
    <div className='basicInfo'>
        <h3>Profile Info:{username} </h3>
        {authState.username === username &&
        <button 
        onClick={()=>{navigate('/changePassword')}}
        >Change My Password</button>}
    </div>
    <div className='listOfPost'>
    <div className="App">
      <h3>Posts By User:</h3>
      {listOfPosts.map((value, key) => {
        return (
          <div className='post' key={key}> 
            <div className='title'>{value.title}</div>
            <div className='body'
            onClick={()=>{navigate(`/post/${value.id}`)}} 
            key={key}
            >{value.postText}</div>
            <div className='footer'>
            <div className="username">{value.username}</div>
            <div className="buttons">
              <label >{value.Likes.length}</label>
              </div>
              </div>
          </div>
        );
      })}
    </div>
    </div>
    </div>
  )
}

export default Profile