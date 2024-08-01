import React, { useState } from 'react';
import './Login.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGooglePlusG, faFacebookF, faGithub, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';
import GoogleLoginButton from './GoogleLoginButton';

const Login = ({ onSuccess, onFailure, onGoogleSuccess, onGoogleFailure }) => {
  const [isActive, setIsActive] = useState(false);

  const handleToggle = () => {
    setIsActive(!isActive);
  };



  const handleSignup = (e) => {
    e.preventDefault();
    console.log('Signup form submitted');
  };


  return (
    <div className={`container ${isActive ? 'active' : ''}`} id="container">
      <div className="form-container sign-up">
        <form onSubmit={handleSignup}>
          <h1>Create Account</h1>
          <div className="social-icons">
            <div className="icon"><GoogleLoginButton
                onSuccess={onGoogleSuccess}
                onFailure={onGoogleFailure}
            ><FontAwesomeIcon icon={faGooglePlusG}/></GoogleLoginButton></div>
          </div>
          {/* <span className='spanner'>or use your email for registration</span> */}
          <span className='spanner'><b>Please Sign Up Using Google<br/>Login System Coming Soon!</b></span>
          <input type="text" placeholder="Name" />
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />
          <button type="submit">Sign Up</button>
        </form>
      </div>
      <div className="form-container sign-in">
        <form>
          <h1 className='header' >Welcome Back! Sign In</h1>
          <div className="social-icons">
            <div className="icon"><GoogleLoginButton
                onSuccess={onGoogleSuccess}
                onFailure={onGoogleFailure}
            ><FontAwesomeIcon icon={faGooglePlusG}/></GoogleLoginButton></div>
            {/* <a href="#" className="icon"><FontAwesomeIcon icon={faGooglePlusG} /></a>
            <a href="#" className="icon-unavailable"><FontAwesomeIcon icon={faFacebookF} /></a>
            <a href="#" className="icon-unavailable"><FontAwesomeIcon icon={faGithub} /></a>
            <a href="#" className="icon-unavailable"><FontAwesomeIcon icon={faLinkedinIn} /></a> */}
          </div>
          <span className='spanner'><b>Please Sign In Using Google <br/> Login System Coming Soon!</b></span>
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />
          {/* <a href="#">Forgot Your Password?</a> */}
          <button type="submit">Sign in</button>
        </form>
      </div>
      <div className="toggle-container">
        <div className="toggle">
          <div className="toggle-panel toggle-left">
            <h1>Welcome Back!</h1>
            <p>Thanks for coming back! <br/>Sign in with your details to use the site.</p>
            <button className="hidden" id="login" onClick={handleToggle}>Sign In</button>
          </div>
          <div className="toggle-panel toggle-right">
            <h1>New Here?</h1>
            <p>Welcome to the Application Tracker, an application to help you keep track of job applications</p>
            <button className="hidden" id="register" onClick={handleToggle}>Sign Up</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
