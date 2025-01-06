// src/App.js

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import SignUp from "./components/Signup";
import Main from "./components/Main";
import Contacts from './components/Contacts';
// import ErrorBoundary from "./components/ErrorBoundary";
// import Footer from "./components/Footer";
import Header from "./components/Header";
// import ContactUs from "./components/Contacts-us";

const App = () => {
  return (
    <Router>
      
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/main" element={<Main />} />
          <Route path="/contact-us" element={<Contacts/>}/>
          {/* <Route path="/main" element={<Homepage/>}/> */}
        </Routes>
        
    
    </Router>
  );
};

export default App;
