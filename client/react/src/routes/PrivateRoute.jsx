import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getUserID } from '../firebase';

const PrivateRoute = () => {

    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const fetchUserID = async () => {
        try {
            const userID = await getUserID();
            setCurrentUser(userID);
        } catch (error) {
            // Handle error if getUserID fails
            console.error('Error fetching user ID:', error);
        }
        };

    fetchUserID();
  }, []);

    // If authorized, return an outlet that will render child elements
    // If not, return element that will navigate to login page
    return currentUser ? <Outlet /> : <Navigate to="/login" />;
}

export default PrivateRoute;