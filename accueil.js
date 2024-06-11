import React, { useState, useRef ,useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import './accueil.css';
import { Navbar, Nav, Container } from 'react-bootstrap';
import axios from 'axios';
import sciencemat from './sciencemat.PNG';
import langue from './langue.PNG';
import computer from './computer.PNG';
import art from './art.PNG';
import social from './social.PNG';
import economic from './economic.PNG';
import langpsycho from './psycho.PNG';
import cuisine from './cuisine.PNG';
import maquillage from './maquillage.PNG';

import { useTranslation } from 'react-i18next';
import i18n from '../utils/i18n.js';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { faUser,faEye,  faBook, faQuestionCircle, faShoppingCart, faDownload, faArrowAltCircleUp  } from '@fortawesome/free-solid-svg-icons';
import SidebarSection from './SidebarSection';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faInfoCircle, faSignInAlt, faUserPlus, faLanguage, faEnvelope } from '@fortawesome/free-solid-svg-icons';

const Accueil = () => {
    const { t, i18n } = useTranslation('translation');
    const navigate = useNavigate();
    const footerRef = useRef();
    const [currentPage, setCurrentPage] = useState('catalogue');
    const [courses, setCourses] = useState([]);
    const [courseComments, setCourseComments] = useState([]);
    const [comments, setComments] = useState({});
    const handleCommentChange = (event, courseId) => {
        const { value } = event.target;
        setComments(prevState => ({
          ...prevState,
          [courseId]: value
        }));
      };

      const handleCommentSubmit = async (courseId, apprenantId) => {
        try {
          // Récupérer le commentaire du cours spécifié
          const commentValue = comments[courseId];
      
          // Effectuer une requête API pour ajouter le commentaire au cours
          await axios.post(`http://localhost:3001/api/${courseId}/commentaires`, { 
            commentaire: commentValue,
            apprenantId: apprenantId // Inclure l'ID de l'apprenant actuellement connecté
          });
      
          // Mettre à jour localement les commentaires avec le nouveau commentaire ajouté
          setCourseComments(prevComments => ({
            ...prevComments,
            [courseId]: [
              ...(prevComments[courseId] || []), // Ajouter les commentaires précédents s'ils existent
              { commentaire: commentValue } // Ajouter le nouveau commentaire
            ]
          }));
      
          // Réinitialiser le champ de commentaire après la soumission réussie
          setComments(prevState => ({
            ...prevState,
            [courseId]: ''
          }));
      
          // Afficher un message de succès
          toast.success('Commentaire soumis avec succès!');
        } catch (error) {
          // Gérer les erreurs
          console.error('Erreur lors de la soumission du commentaire :', error);
          // Afficher un message d'erreur
          toast.error('Erreur lors de la soumission du commentaire');
        }
    };
    

    const categories = [
        { id: 1, name: t('sciences_math'), image: sciencemat },
        { id: 2, name: t('langues'), image: langue },
        { id: 3, name: t('informatique_technologie'), image: computer },
        { id: 4, name: t('arts_culture'), image: art },
        { id: 5, name: t('developpement_personnel'), image: social },
        { id: 6, name: t('affaires_economie'), image: economic },
        { id: 7, name: t('sciences_sociales'), image: langpsycho },
        { id: 8, name: t('cuisine'), image: cuisine },
        { id: 9, name: t('maquillage'), image: maquillage }
      ];
    
    const sections = [
        { title: t('sciences_math'), items: ['Mathématiques de base', 'Algèbre', 'Géométrie', 'Statistiques et probabilités', 'Physique', 'Chimie', 'Biologie'] },
        { title: t('langues'), items: ['Anglais', 'Français', 'Espagnol', 'Allemand'] },
        { title: t('informatique_technologie'), items: ['Programmation', 'Développement web', 'Bases de données', 'Sécurité informatique'] },
        { title: t('arts_culture'), items: ['Musique', 'Peinture et dessin', 'Photographie', 'Littérature', 'Cinéma et réalisation'] },
        { title: t('developpement_personnel'), items: ['Gestion du temps', 'Communication efficace', 'Leadership', 'Santé mentale et bien-être'] },
        { title: t('affaires_economie'), items: ['Économie', 'Finance personnelle', 'Marketing', 'Entrepreneuriat'] },
        { title: t('sciences_sociales'), items: ['Psychologie', 'Sociologie', 'Anthropologie'] },
    ];

    const languages = ['English', 'Français', 'عربى'];
    const [activeNavItem, setActiveNavItem] = useState(null);
    const [languageDropdownVisible, setLanguageDropdownVisible] = useState(false);
    const [registrationDropdownVisible, setRegistrationDropdownVisible] = useState(false);
    const [selectedRegistrationType, setSelectedRegistrationType] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const handleCategoryClick = async (category) => {
        setSelectedCategory(category);
        setCurrentPage('categoryDetail');
      
        try {
          const response = await axios.get(`http://localhost:3001/api/getcours?domaine=${category.name}`);
          const filteredCourses = response.data.filter(course => course.domaine === category.name);
          setCourses(filteredCourses);
        } catch (error) {
          console.error("Erreur lors de la récupération des cours :", error);
          // Gérer les erreurs de manière appropriée
        }
      };
      

    const handleNavItemClick = (item) => {
        setActiveNavItem(item);
        setLanguageDropdownVisible(false);

        if (item === 'login') {
            navigate('/login');
        } else if (item === 'inscrire') {
            setRegistrationDropdownVisible(!registrationDropdownVisible);
            navigate('/inscription');
        } else if (item === 'contact') {
            footerRef.current.scrollIntoView({ behavior: 'smooth' });
        } else if (item === 'start') {
            navigate('/application');
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


    const handleRegistrationTypeClick = (type) => {
        setSelectedRegistrationType(type);
        setRegistrationDropdownVisible(false);
        navigate(`/inscrire/${type.toLowerCase()}`);
    };

    const toggleLanguageDropdown = () => {
        setLanguageDropdownVisible(!languageDropdownVisible);
    };

    const handleStartButtonClick = () => {
        handleNavItemClick('start');
    };
    useEffect(() => {
        const fetchCommentsForCourses = async () => {
          const commentsMap = {};
          for (const course of courses) {
            try {
              const response = await axios.get(`http://localhost:3001/api/${course._id}/GETcommentaires`);
              commentsMap[course._id] = response.data.commentaires;
            } catch (error) {
              console.error(`Erreur lors de la récupération des commentaires pour le cours ${course._id}:`, error);
              commentsMap[course._id] = [];
            }
          }
          
          setCourseComments(commentsMap);
        };
    
        fetchCommentsForCourses();
      }, [courses]);
    
    
    return (
        <div className="accueil-container">
            <div className="main-content">
                <div className="navbar">
                    <div className="left-links">
                        <h4 className="titre">Intellego</h4> &nbsp; &nbsp; &nbsp;
                        <div
                            className={`nav-item ${activeNavItem === 'home' ? 'active' : ''}`}
                            onClick={() => handleNavItemClick('home')}
                        >
                            <FontAwesomeIcon icon={faHome} /> {t('accueil')}
                        </div>
                        <div
                            className={`nav-item ${activeNavItem === 'contact' ? 'active' : ''}`}
                            onClick={() => handleNavItemClick('contact')}
                        >
                            <FontAwesomeIcon icon={faEnvelope} /> {t('contact')}
                        </div>
                    </div>
                    <div className="right-links">
                        <div
                            className={`nav-item ${activeNavItem === 'login' ? 'active' : ''}`}
                            onClick={() => handleNavItemClick('login')}
                        >
                            <FontAwesomeIcon icon={faSignInAlt} /> {t('login')}
                        </div>
                        <div
                            className={`nav-item ${activeNavItem === 'inscrire' ? 'active' : ''}`}
                            onClick={() => handleNavItemClick('inscrire')}
                        >
                            <FontAwesomeIcon icon={faUserPlus} /> {t('inscription')}
                            {registrationDropdownVisible &&
                                <div className="registration-dropdown">
                                    <ul>
                                        <li onClick={() => handleRegistrationTypeClick('Etudiant')}>{t('etudiant')}</li>
                                        <li onClick={() => handleRegistrationTypeClick('Enseignant')}>{t('enseignant')}</li>
                                    </ul>
                                </div>
                            }
                        </div>
                        <div
                            className={`nav-item ${activeNavItem === 'language' ? 'active' : ''}`}
                            onClick={() => {
                                handleNavItemClick('language');
                                toggleLanguageDropdown();
                            }}
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
                <div className="dashboard-content">
                    <br />
                    <center className="taille"><b>{t('bienvenue')}</b></center>
                    <br /> <br /><br /><br />

                    {/* Insérez la partie catalogue ici */}
                    {currentPage === 'catalogue' && (
                        <div>
                            <h1 className="taille"><center>{t('catalogue')}</center></h1> <br /><br />
                            <div className="grid-container">
                                {categories.map((category) => (
                                    <div className="grid-item" key={category.id} onClick={() => handleCategoryClick(category)}>
                                        <br />
                                        <h3><b>{category.name}</b></h3>
                                        <img src={category.image} alt={category.name} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Insérez la partie détail de catégorie ici */}
                    {currentPage === 'categoryDetail' && (
                        <div>
                            <h1 className="taille"><center>{selectedCategory.name}</center></h1>
                            <br /><br />
                            <div className="grid-container">
                                {courses.map((course) => (
                                    <div className="grid-item" key={course._id}>
                                        <h2><p>{course.titre}</p></h2>
                                    
                                        <p><b>Prix:</b> {course.prix}</p>
                                        <p><b>Langue:</b> {course.langue}</p>

                                          
                                        <h3>Commentaires:</h3><br/>
                                        <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
                                           
                                            {/* Vérifiez si la liste des commentaires est définie et n'est pas vide */}
                                            {courseComments[course._id] && Object.keys(courseComments[course._id]).length !== 0 ? (
                                                // Utilisez Object.values pour obtenir un tableau de commentaires
                                                Object.values(courseComments[course._id]).map((comment, index) => (
                                                    <div key={index}>
                                                        {/* Afficher chaque commentaire */}
                                                        <p><b>User : </b> {comment?.commentaire}</p>
                                                    </div>
                                                ))
                                            ) : (
                                                <p>Pas de commentaires disponibles</p>
                                            )}
                                        </div>

                                        <br />
                                        
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <br /> <br />
                <div className="footer" ref={footerRef}>
                    <address>
                        <p><b>{t('contactez_nous')} :</b></p>
                        <p><b>{t('email')} :</b> contact@Intellego.com</p>
                        <p><b>{t('telephone')} :</b>  ** *** ***</p>
                    </address>
                </div>
            </div>
        </div>
    );
};

export default Accueil;