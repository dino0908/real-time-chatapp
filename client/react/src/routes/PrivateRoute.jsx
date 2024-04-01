import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getUserID } from '../firebase';

const PrivateRoute = () => {
    const [authenticated, setAuthenticated] = useState(null);

    useEffect(() => {
        const checkAuthentication = async () => {
            try {
                const userID = await getUserID();
                // Set authenticated to true if user is authenticated
                setAuthenticated(!!userID); // Convert userID to a boolean
            } catch (error) {
                // Handle error if getUserID fails
                console.error('Error fetching user ID:', error);
                setAuthenticated(false); // Set authenticated to false
            }
        };

        checkAuthentication();
    }, []);

    // If authenticated, render child elements
    // If not authenticated, redirect to the login page
    return authenticated === null ? null : authenticated ? <Outlet /> : <Navigate to="/login" />;
}

export default PrivateRoute;
