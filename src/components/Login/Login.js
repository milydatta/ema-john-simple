import React, { useContext, useState } from 'react';
import { UserContext } from '../../App';
import { useHistory, useLocation } from 'react-router';
import { initializeLoginFramework, handleGoogleSignIn, handleSignOut, handleFbSignIn, createUserWithEmailAndPassword, signInWithEmailAndPassword } from './loginManager';



function Login() {
  const [newUser, setNewUser] = useState(false);
  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    password: '',
    picture: '',
  });

  initializeLoginFramework();

  const [loggedInUser, setLoggedInUser] = useContext(UserContext);
  const history = useHistory();
  const location = useLocation();
  let { from } = location.state || { from: { pathname: "/" } };
 
  const googleSignIn = () => {
    handleGoogleSignIn()
    .then(res => {
      handleResponse(res, true);
    })
}

const fbSignIn = () => {
    handleFbSignIn()
    .then(res => {
      handleResponse(res, true);
    })

}

const signOut = () => {
    handleSignOut()
    .then(res => {
        handleResponse(res, false);
    })
}

const handleResponse = (res, redirect) =>{
  setUser(res);
  setLoggedInUser(res);
  if(redirect){
      history.replace(from);
  }
}
  const handleBlur = (event) => {
    let isFieldValid = true;
    if(event.target.name === 'email'){
        isFieldValid = /\S+@\S+\.\S+/.test(event.target.value);
    }
    if(event.target.name === 'password'){
        const isPasswordValid = event.target.value.length > 6;
        const passwordHasNumber = /\d{1}/.test(event.target.value);
        isFieldValid = isPasswordValid && passwordHasNumber;
    }
    if(isFieldValid){
      // [...cart, newItem]
      const newUserInfo = {...user};
      newUserInfo[event.target.name] = event.target.value;
      setUser(newUserInfo);
    }
  }
  const handleSubmit = (event) => {
     if(newUser && user.email && user.password){
     createUserWithEmailAndPassword(user.email, user.password)
      .then(res => {
        handleResponse(res, true);
        //  const  newUserInfo = {...user};
        //  newUserInfo.error = '';
        //  newUserInfo.success = true;
        //   setUser(newUserInfo);
      })
      // .catch(error => {
      //   const  newUserInfo = {...user};
      //   newUserInfo.error = error.message;
      //   newUserInfo.success = false;
      //   setUser(newUserInfo);
      //   // ..
      // });
     }

     if(!newUser && user.email && user.password){
       signInWithEmailAndPassword(user.email, user.password)
        .then(res => {
          handleResponse(res, true);
        //  const  newUserInfo = {...user};
        //  newUserInfo.error = '';
        //  newUserInfo.success = true;
        //  setUser(newUserInfo);
        //  setLoggedInUser(newUserInfo);
        //  history.replace(from);
        })
    //     .catch((error) => {
    //     const  newUserInfo = {...user};
    //     newUserInfo.error = error.message;
    //     newUserInfo.success = false;
    //     setUser(newUserInfo);
    //  });
     }

     event.preventDefault();
  }
  return (
    <div style={{textAlign:'center'}}>
      {
      user.isSignedIn ? <button onClick={handleSignOut} >Sign out</button> :
      <button onClick={googleSignIn} >Sign in</button>
      }
      {
        user.isSignedIn && <div>
        <p>Welcome,{user.name}</p>
        <p>Your email: {user.email}</p>
        </div>
      }

      <h1>Our own Authentication</h1>
      <input type="checkbox" onChange={() => setNewUser(!newUser)} name="newUser" id=""/>
      <label htmlFor ="newUser">New User Sign Up</label>
      <form onSubmit={handleSubmit}>
           {newUser && <input name="name" type="text" onBlur={handleBlur} placeholder="Your name" />}
           <br/>
           <input type="text" name="email" onBlur={handleBlur} placeholder="Your Email address" required/>
           <br/>
           <input type="password" name="password" onBlur={handleBlur} placeholder="Your Password" required/>
           <br/>
           <input type="submit" value="Submit" value={newUser ? 'Sign up' : 'Sign in'}/>
      </form>
      <p style={{color:'red'}}>{user.error}</p>
      {user.success && <p style={{color:'green'}}>User {newUser ? 'created' : 'Logged In'} successfully</p>}
    </div>
  );
}

export default Login;