import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';


export const PrivateRoute = ({children, user}) => {
    return user ? children : <Navigate to='/login'></Navigate>;
}

export default PrivateRoute;
