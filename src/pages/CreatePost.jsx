import React, { useContext } from 'react'
import '../css/CreatePost.css'
import axios from  'axios';
import {Formik, Form, Field,ErrorMessage} from 'formik'
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import {AuthContext} from '../helpers/authContext'
import { useEffect } from 'react';
import {toast} from "react-toastify" 

function CreatePost() {
    const navigate = useNavigate();
    const {authState} = useContext(AuthContext);

    useEffect(()=>{
        if(! localStorage.getItem("accessToken")){
            navigate('/login')
        }
    },[authState.status,navigate])

    const initialValues={
        title:"",
        postText:"",
    };

    const validationSchema = Yup.object().shape({
        title:Yup.string().required(),
        postText: Yup.string().required() ,
    })

    const onSubmit =(data)=>{
        axios.post('http://localhost:3001/posts',data,{
            headers:{
                accessToken: localStorage.getItem("accessToken")
            }
        })
        .then((response)=>{
            console.log(response.data);
            toast.success("Your Post has been Created")
            navigate('/');
            });                                         
    }

  return (
<div className='createPostPage'>
    <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
    >
        <Form className='formContainer3'>
            <label htmlFor="title">Title:</label>
            <ErrorMessage name='title'  component="span" className="error-message" />
            <Field id="title" name="title" type="text" placeholder="Enter title" />

            <label htmlFor="postText">Post:</label>
            <ErrorMessage name='postText' component="span" className="error-message" />
            <Field id="postText" name="postText" type="text" placeholder="Enter post text" />

            <button type='submit' className="create-button">Create Post</button>
        </Form>
    </Formik>
</div>
  )
}

export default CreatePost