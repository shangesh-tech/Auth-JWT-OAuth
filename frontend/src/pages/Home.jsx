import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';



const Home = () => {
  const navigate = useNavigate();

  const isAuth = localStorage.getItem('isAuth') === 'true';
 
  
  return (
    <section className='my-48'>

      <div>
        <h1 className='text-2xl text-red-600 font-semibold font-mono'>Authentication using JWT Token</h1>
        
      </div>
      <div>
        {isAuth ? (
          <p>You are logged in!</p>
        ) : (
          <p>You are not logged in.</p>
        )}
      </div>
    </section>
  );
};

export default Home;
