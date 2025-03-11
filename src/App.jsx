import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Signin from './pages/signin'
import Signup from './pages/signup'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from './pages/mainPage'

function App() {

  return (
    <div className="bg-[#1f1d1d] w-full h-full">
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path='/mainPage' element={<MainPage />} />
      </Routes>
    </div>
  );
}

export default App
