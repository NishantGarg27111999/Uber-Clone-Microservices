import React from 'react'
import {Routes,Route} from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import UserLogin from './pages/UserLogin'
import UserSignup from './pages/UserSignup'
import CaptainLogin from './pages/CaptianLogin'
import CaptainSignup from './pages/CaptainSignup'
import Home from './pages/Home' 
import ProtectedRoute from './pages/ProtectedRoute'
import CaptainHome from './pages/CaptainHome'
import Riding from './pages/Riding'
import CaptainRiding from './pages/CaptainRiding'

function App() {
  

  return (
    <div className='h-screen'>
        <Routes>
          <Route path="/" element={<LandingPage/>}/>
          <Route path='/userLogin' element={<UserLogin/>}/>
          <Route path='/userSignup' element={<UserSignup/>}/>
          <Route path='/captain-login' element={<CaptainLogin/>}/>
          <Route path='/captain-signup' element={<CaptainSignup/>}/>
          <Route path='/home' element={<ProtectedRoute navigateRoute='/userLogin' isCaptain={false}><Home/></ProtectedRoute>  }/>
          <Route path='/captain-home' element={<ProtectedRoute navigateRoute='/captain-login' isCaptain={true}><CaptainHome/></ProtectedRoute>  }/>
          <Route path='/riding' element={<ProtectedRoute navigateRoute='/userLogin' isCaptain={false}><Riding/></ProtectedRoute> }/>
          <Route path='/captain-riding' element={<ProtectedRoute navigateRoute='/captain-ogin' isCaptain={false}><CaptainRiding/></ProtectedRoute> }/>
        
        </Routes>
    </div>
  )
}

export default App
