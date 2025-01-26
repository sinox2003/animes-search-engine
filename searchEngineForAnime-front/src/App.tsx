import './App.css'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import PrivateRoute from './guards/PrivateRoute.tsx';
import VerificationForm from "./components/register/VerificationForm.tsx";
import HomePage from './pages/HomePage.tsx';
import Profile from './pages/Profile.tsx';
import Header from './components/Header.tsx';
import Footer from './components/Footer.tsx';
import {SearchPage} from "./pages/SearchPage.tsx";
import NotFound from "./pages/NotFound.tsx";

function App() {

  return (
    <div>

    <BrowserRouter>
	    <Header />
      <Routes>
	      <Route path="/verify" element={<VerificationForm />} />
	      {/*<Route path="/reset-password" element={<PrivateRoute><ResetPasswordForm /></PrivateRoute>} />*/}
	      <Route path="/" element={<HomePage />} />
	      <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
	      <Route path='/search' element={<SearchPage/>} />
	      <Route path='*' element={<NotFound/>} />
      </Routes>
    </BrowserRouter>
    <Footer />
    </div>
  )
}

export default App
