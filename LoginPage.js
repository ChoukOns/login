import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Link, json, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faHome, faLanguage } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './LoginForm.css';
import logo from './logo.png';
import { useTranslation } from 'react-i18next';

const LoginPage = () => {
  const { t, i18n } = useTranslation('login');
  const navigate = useNavigate();
  const footerRef = useRef();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState(null);
  const [languageDropdownVisible, setLanguageDropdownVisible] = useState(false);

  const handleNavItemClick = (item) => {
    setActiveNavItem(item);
    setLanguageDropdownVisible(false);

    if (item === 'home') {
      navigate('/');
    } else if (item === 'language') {
      toggleLanguageDropdown();
    }
  };

  const ChangeEn = () => {
    i18n.changeLanguage("en");
  };

  const ChangeFr = () => {
    i18n.changeLanguage("fr");
  };

  const ChangeAr = () => {
    i18n.changeLanguage("ar");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post('http://localhost:3001/api/login', {
        email: email,
        mdp: password,
      });
  
      console.log('Response:', response.data); // Ajout du console.log
  
      const { mytoken, role, user, etat } = response.data;
  
      if (etat === 'inactif') { // Assurez-vous que 'inactif' correspond à la valeur réelle dans votre base de données
        toast.warning('Votre compte est inactif');
        return; // Exit the function to prevent further execution
      }
  
      sessionStorage.setItem('token', mytoken);
      sessionStorage.setItem('user', JSON.stringify(user));
  
      redirectBasedOnRole(role);
    } catch (error) {
      console.error('Error during login:', error);
  
      if (error.response && error.response.status === 403) {
        toast.warning('Votre compte est inactif');
      } else if (error.response && error.response.status === 404) {
        toast.error('Email or password invalid');
      } else {
        toast.error('Erreur lors de la connexion');
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const redirectBasedOnRole = (role) => {
    switch (role) {
      case 'admin':
        navigate('/admin');
        break;
      case 'instructeur':
        navigate('/application');
        break;
      case 'apprenant':
        navigate('/apprenant');
        break;
      default:
        navigate('/');
        break;
    }
  };

  const toggleLanguageDropdown = () => {
    setLanguageDropdownVisible(!languageDropdownVisible);
  };

  return (
    <div className="login-container">
      <ToastContainer />

      <div className="navbar">
        <div className="left-links">
          <h4 className="titre">Intellego</h4> &nbsp; &nbsp; &nbsp;
          <div
            className={`nav-item ${activeNavItem === 'home' ? 'active' : ''}`}
            onClick={() => handleNavItemClick('home')}
          >
            <FontAwesomeIcon icon={faHome} /> {t('accueil')}
          </div>
        </div>

        <div className="right-links">
          <div
            className={`nav-item ${activeNavItem === 'language' ? 'active' : ''}`}
            onClick={() => handleNavItemClick('language')}
          >
            <FontAwesomeIcon icon={faLanguage} /> {t('langue')}
            {languageDropdownVisible && (
              <div className="language-dropdown">
                <ul>
                  <li onClick={ChangeEn}>{t('anglais')}</li>
                  <li onClick={ChangeFr}>{t('francais')}</li>
                  <li onClick={ChangeAr}>{t('arabe')}</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
      <br /><b />
      <div className="login-form-container">
        <h1>{t('bienvenue')}</h1>
        <br />
        <form onSubmit={handleSubmit}>
          <label>
            {t('email')}:
            <input
              type="email"
              name="email"
              required
              placeholder={t('entrer_votre_adresse_mail')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label>
            {t('mot_de_passe')}:
            <div className="password-input-container">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                required
                placeholder={t('entrer_votre_mot_de_passe')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="password-input"
              />
              <FontAwesomeIcon
                icon={showPassword ? faEyeSlash : faEye}
                className="eye-icon"
                onClick={togglePasswordVisibility}
              />
            </div>
          </label>
          <div className="forgot-password">
            <Link to="/reset-password" className="forgot-password-link">
              {t('mot_de_passe_oublie')}
            </Link>
          </div>
          <br />
          <button type="submit">{t('valider')}</button>
        </form>
        <img src={logo} alt="Intellego Logo" className="logo" />
      </div>
    </div>
  );
};

export default LoginPage;

