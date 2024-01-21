<h1 align='center'>Real-Time Chat App</h1>

A real-time chat application that allows users to engage in chats with other registered users. The app is built with React and Chakra UI for the frontend, a Node.js server for the backend using Socket.io for real-time communication, and Firebase for authentication and Firestore for database storage.

## Features

- **User Authentication:**
  - Users can register and log in to their accounts securely through Firebase Authentication.
  - Each user has a unique username tied to their email, which is used for chatting.

- **Real-Time Communication:**
  - The backend Node.js server utilizes Socket.io to enable real-time communication between users.
  - Messages are sent and received instantly, providing a seamless chat experience.

- **User-to-User Chats:**
  - Users can start one-on-one chats by searching for registered usernames.
  - Multiple ongoing chats are supported, with each chat being strictly one-on-one.

- **Database Persistence:**
  - Chat messages are persisted in the Firestore database, ensuring message history is retained.

## Technologies Used

- **Frontend:**
  - React: A JavaScript library for building user interfaces.
  - Chakra UI: A modern component library for React that helps build accessible and consistent UIs.

- **Backend:**
  - Node.js: A JavaScript runtime for server-side development.
  - Socket.io: A library for real-time web applications, enabling bidirectional communication between clients and the server.

- **Authentication and Database:**
  - Firebase: Provides user authentication through Firebase Auth and stores chat messages in Firestore.

## How to Use

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/your-username/realtime-chat-app.git
   cd realtime-chat-app
   
2. **Install dependencies:**
   ```bash
   cd realtime-chat-app/client/react
   npm i
   cd realtime-chat-app/server
   npm i

3. **Firebase:**
   - Visit the Firebase Console and sign in with your Google account.
   - Enable the "Email/Password" sign-in method.
   - Note down Firebase configuration

4. **Configuration:**
   - Create a .env file in client/react with configuration details.
   ```bash
   VITE_REACT_APP_FIREBASE_API_KEY=
   VITE_REACT_APP_FIREBASE_AUTH_DOMAIN=
   VITE_REACT_APP_FIREBASE_PROJECT_ID=
   VITE_REACT_APP_FIREBASE_STORAGE_BUCKET=
   VITE_REACT_APP_FIREBASE_MESSAGING_SENDER_ID=
   VITE_REACT_APP_FIREBASE_APP_ID=

5. **Run the Application:**
   ```bash
   cd realtime-chat-app/client/react
   npm run dev
   cd realtime-chat-app/server
   node index.js
  - Access the app at http://localhost:{port} in your web browser.

## Future Enhancements
**Room chat:**
- Consider implementing room-based chat functionality for group conversations.

