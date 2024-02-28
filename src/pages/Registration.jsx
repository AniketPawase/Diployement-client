import React from 'react'
import '../css/Registration.css'
import axios from  'axios';
import {Formik, Form, Field,ErrorMessage} from 'formik'
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import {toast} from "react-toastify" 

function Registration() {

    const navigate = useNavigate();

    const initialValues={
        username:"",
        password:"",
    };

    const validationSchema = Yup.object().shape({
        username:Yup.string().min(3).max(15).required(),
        password: Yup.string().min(4).max(20).required() ,
    })

    const onSubmit=(data)=>{
        axios.post("http://localhost:3001/auth",data)
        .then(()=>{
            console.log(data);
            toast.info("Registered SuccesFully")
            toast.success("Go to LOGIN link now")
            navigate('/');
        })
    }

  return (
    <div>
    <Formik 
        initialValues={initialValues}
        onSubmit={onSubmit} 
        validationSchema={validationSchema}
    >
        <Form className='formContainer1'>
        <h2>Register</h2>
            <label htmlFor="username">Username:</label>   
            <Field id="username" type="text" name="username" placeholder="Enter username" />
            <ErrorMessage name='username' component="span" className="error-message" />

            <label htmlFor="password">Password:</label>   
            <Field id="password" type="password" name="password" placeholder="Enter password" />
            <ErrorMessage name='password' component="span" className="error-message" />

            <button type='submit'>Register</button>
        </Form>
    </Formik>
</div>
  )
}

export default Registration