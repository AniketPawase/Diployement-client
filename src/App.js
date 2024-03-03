import './css/App.css';
import { BrowserRouter as Router, Routes, Route, Link ,useNavigate} from 'react-router-dom';
import Home from './pages/Home';
import CreatePost from './pages/CreatePost';
import Post from './pages/Post';
import Login from './pages/Login';
import Registration from './pages/Registration';
import { AuthContext } from './helpers/authContext';
import { useState, useEffect } from 'react';
import axios from 'axios';
import PageNotFound from './pages/PageNotFound';
import Profile from './pages/Profile';
import ChangePassword from './pages/ChangePassword';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {toast} from "react-toastify" 


function App() {
  const navigate = useNavigate();
  const [authState, setAuthState] = useState({
    username: "",
    id: 0,
    status: false
  });

  useEffect(() => {
    axios.get("https://deployement-server.vercel.app/auth/auth", {
      headers: {
        accessToken: localStorage.getItem("accessToken"),
      }
    })
      .then((response) => {
        if (response.data.error) {
          setAuthState({ ...authState, status: false });
        } else {
          setAuthState({
            username: response.data.username,
            id: response.data.id,
            status: true
          });
        }
      })
  }, [authState]);

  // Logout
  const logout = () => {
    localStorage.removeItem("accessToken");
    setAuthState({ username: "", id: 0, status: false });
    toast.error("Sorry to see U Go.Vist Again :)")
    navigate("/login");
  }

  return (
    <>
      <div className="App">
        <AuthContext.Provider value={{ authState, setAuthState }}>
          <Router>
            <div className='navbar'>
              <div className='links'>
                {!authState.status ? (
                  <>
                    {/* Visible when not logged in */}
                  </>
                ) : (
                  <>
                    <Link to={'/'} className="nav-link">Home Page</Link>
                    <Link to={'/createPost'} className="nav-link">Create A Post</Link>
                  </>
                )}
              </div>
              <div className='loggedInContainer'>
                {authState.status && (
                  <>
                    <h3>{authState.username}</h3>
                    <button onClick={logout} className="logout-button">Logout</button>
                  </>
                )}
              </div>
            </div>
            <Routes>
              <Route path='/' element={<Home/>} />
              <Route path='/createPost' element={<CreatePost/>} />
              <Route path='/post/:id' element={<Post/>} />
              <Route path='/login' element={<Login/>} />
              <Route path='/registration' element={<Registration/>} />
              <Route path='/profile/:id' element={<Profile/>} />
              <Route path='/changePassword' element={<ChangePassword/>} />
              <Route path='*' element={<PageNotFound/>} />
            </Routes>
          </Router>
        </AuthContext.Provider>
      </div>
      <ToastContainer/>
    </>
  );
}

export default App;
