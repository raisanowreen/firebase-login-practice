import initializeAuthentication from './Firebase/firebase.initialize';
import './App.css';
import { getAuth, signInWithPopup, signOut, GoogleAuthProvider, GithubAuthProvider, FacebookAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail, updateProfile } from "firebase/auth";
import { useState } from 'react';

initializeAuthentication();

const googleProvider = new GoogleAuthProvider();
const gitProvider = new GithubAuthProvider();
const facebookProvider = new FacebookAuthProvider();


function App() {
  const [user, setUser] = useState({});
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLogIn, setisLogIn] = useState(false);
  const [name, setName] = useState('');

  const auth = getAuth();
const handleGoogleSignIn = () =>{
  signInWithPopup(auth, googleProvider)
  .then(result =>{
    const {displayName, email, photoURL} = result.user;
    const logedInUser = {
      name: displayName,
      email: email,
      image: photoURL
    };
    setUser(logedInUser);
  })
}

const handleGitHubSignIn = () =>{
  signInWithPopup(auth, gitProvider)
  .then(result =>{
    const {displayName, email, photoURL} = result.user;
    const logedInUser = {
      name: displayName,
      email: email,
      image: photoURL
    };
    setUser(logedInUser);
  })
}

const handleFacebookSignIn = () =>{
  signInWithPopup(auth, facebookProvider)
  .then(result =>{
    const {displayName, email, photoURL} = result.user;
    const logedInUser = {
      name: displayName,
      email: email,
      image: photoURL
    };
    setUser(logedInUser);
  })
}
const handleNameChange = e =>{
  setName(e.target.value);
}

const handleEmailChange = e =>{
  setEmail(e.target.value);
}


const handlePasswordChange = e =>{
  setPassword(e.target.value);
}

const handleRegistration = e =>{
  e.preventDefault();
console.log(email, password);
if (password.length < 6){
  setError('Password Must be at least 6 character!')
return;
}
if (!/(?=.*[A-Z].*[A-Z])/.test(password)){
  setError(' Ensure string has two uppercase letters!')
  return;
}
isLogIn ? processLogin(email, password) : createNewUser(email, password)
}

const processLogin = (email, password) =>{
  signInWithEmailAndPassword(auth, email, password)
  .then(result =>{
    const user = result.user;
    console.log(user);
    setError('');
  })
  .catch(error =>{
    setError(error.message);
  })
}

const createNewUser = (email, password) =>{

  createUserWithEmailAndPassword(auth, email, password)
.then(result =>{
  const user = result.user;
  console.log(user);
  setError('');
  varifyEmail();
  setUserName();
})
.catch(error =>{
  setError(error.message);
})
}

const toggleLogIn = e =>{
  setisLogIn(e.target.checked);
}

const handleSignOut = () =>{
  signOut(auth)
  .then(() =>{
    setUser({});
  })
}

const setUserName = () =>{
  updateProfile(auth.currentUser, {
    displayName: name
  })
  .then(result =>{
    console.log(result);
  })
}

const varifyEmail = () =>{
  sendEmailVerification(auth.currentUser)
  .then(result =>{
    console.log(result);
  })
}

const handleResetPassword = () =>{
  sendPasswordResetEmail(auth, email)
  .then(result =>{
    console.log(result);
  })
}

  return (
    <div>
     <div>
     <form onSubmit={handleRegistration} className=" w-50 mt-5 ms-5 me-5">
       <h1 className="text-primary pb-2">{isLogIn ? 'Login': 'Register'} Please</h1>
  <div className="mb-3">
  { ! isLogIn &&
    <div className="col-12">
    <label htmlFor="inputAddress" className="form-label">Name</label>
    <input onBlur={handleNameChange} type="text" className="form-control mb-2" id="inputAddress" placeholder="Name" />
  </div>
  }
    <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
    <input onBlur={handleEmailChange} type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" required />
    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
  </div>
  <div className="mb-3">
    <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
    <input onBlur={handlePasswordChange} type="password" className="form-control" id="exampleInputPassword1" required />
  </div>
  <div className="mb-3 form-check">
    <input onChange={toggleLogIn} type="checkbox" className="form-check-input" id="exampleCheck1" />
    <label className="form-check-label" htmlFor="exampleCheck1">Already registered?</label>
  </div>
  <div className="mb-3 form-check text-danger">{error}</div>
  <button type="submit" className="btn btn-primary">{isLogIn ? 'Login' : 'Register'}</button>
  <button onClick={handleResetPassword} type="button" className="btn btn-primary ms-2">Reset Password</button>
</form>




{/* Third party login */}
     </div>
     { !user.name ? !isLogIn &&  
       <div className="mt-5">
       <button onClick={handleGoogleSignIn} type="button" className="btn btn-primary ms-5 me-1">Sign-in with Google</button>
       <button onClick={handleGitHubSignIn} type="button" className="btn btn-primary me-1">Sign-in with Github</button>
       <button onClick={handleFacebookSignIn} type="button" className="btn btn-primary me-1">Sign-in with Facebook</button>
       </div> :
       <button onClick={handleSignOut} type="button" className="btn btn-outline-secondary m-5">Sign out</button>
     }
    
    {
       user.name &&
       <div>
       <h2>Welcome: {user.name}</h2>
       <h3>We know your email is: {user.email}</h3>
       <img src={user.image} alt="" />
       </div>
    }
    </div>
  );
}

export default App;
