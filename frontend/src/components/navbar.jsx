"use client"

import { useEffect, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Menu, X, Utensils, ChevronDown, User, LogOut } from "lucide-react"
import "./navbar.css"

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [user, setUser] = useState(null)
  const location = useLocation()
  const navigate = useNavigate()
  const isHomePage = location.pathname === "/"

  // Check for logged in user on component mount and route changes
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'))
    setUser(userData)
  }, [location])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  // Close mobile menu when changing routes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    setUser(null)
    navigate('/login')
  }

  return (
    <header
      className={`navbar ${isScrolled ? "scrolled" : ""} ${!isHomePage ? "not-home" : ""} ${
        isMobileMenuOpen ? "menu-open" : ""
      }`}
    >
      <div className="navbar-wave">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 60" preserveAspectRatio="none">
          <path
            fill="currentColor"
            d="M0,0L40,5.3C80,11,160,21,240,26.7C320,32,400,32,480,26.7C560,21,640,11,720,16C800,21,880,43,960,48C1040,53,1120,43,1200,32C1280,21,1360,11,1400,5.3L1440,0L1440,60L1400,60C1360,60,1280,60,1200,60C1120,60,1040,60,960,60C880,60,800,60,720,60C640,60,560,60,480,60C400,60,320,60,240,60C160,60,80,60,40,60L0,60Z"
          ></path>
        </svg>
      </div>
      <nav className="nav-container">
        <div className="logo">
          <Link to="/" className="logo-link">
            <Utensils className="logo-icon" />
            <span className="logo-text">Nutrack</span>
          </Link>
        </div>

        <button className="mobile-menu-toggle" onClick={toggleMobileMenu} aria-label="Toggle menu">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className={`nav-content ${isMobileMenuOpen ? "open" : ""}`}>
          <ul className="nav-links">
            <li className={location.pathname === "/" ? "active" : ""}>
              <Link to="/">Home</Link>
            </li>
            <li className={location.pathname.includes("/recipe") ? "active" : ""}>
              <Link to="/recipe">Recipes</Link>
            </li>
            <li className={location.pathname === "/about" ? "active" : ""}>
              <Link to="/about">About</Link>
            </li>
            
          </ul>

          <div className="nav-auth">
            {user ? (
              <div className="user-profile">
                <div className="user-info">
                  <User size={18} className="user-icon" />
                  <span className="user-name">{user.firstName}</span>
                </div>
                <button onClick={handleLogout} className="logout-btn">
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="login-btn">
                  Log in
                </Link>
                <Link to="/signup" className="signup-btn">
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Navbar