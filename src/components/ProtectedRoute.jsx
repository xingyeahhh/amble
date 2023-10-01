import React from 'react';

import {Link, useNavigate, Navigate} from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';
import { useState } from 'react';

const ProtectedRoute =({children})=> {
    const{user}=UserAuth();
    
    if(!user){
        return <Navigate to='/signin' />;
    }
  return children;
  
};

export default ProtectedRoute;
