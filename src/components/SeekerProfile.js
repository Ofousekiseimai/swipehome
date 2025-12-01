import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useFavorite } from '../context/FavoriteContext';
import { api } from '../services/api';

const SeekerProfile = () => {
  const { id } = useParams();
  const { currentUser, logout } = useAuth();
  const { favorites } = useFavorite();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState(null);
  const [favoriteProperties, setFavoriteProperties] = useState([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingFavorites, setLoadingFavorites] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      setLoadingProfile(true);
      const seeker = await api.getSeekerById(id);
      if (isMounted) {
        setProfile(seeker);
        setLoadingProfile(false);
      }
    };

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, [id]);

  useEffect(() => {
    let isMounted = true;

    const loadFavorites = async () => {
      setLoadingFavorites(true);
      const allProperties = await api.getProperties();
      if (isMounted) {
        setFavoriteProperties(
          allProperties.filter(property => favorites.includes(property.id))
        );
        setLoadingFavorites(false);
      }
    };

    loadFavorites();

    return () => {
      isMounted = false;
    };
  }, [favorites]);

  if (loadingProfile) {
    return <div className="loading">Φόρτωση...</div>;
  }

  if (!profile || currentUser.id !== profile.id) {
    return <div>Access Denied</div>;
  }
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="profile-page">
      <h1>Προφίλ Χρήστη</h1>
      
      {/* Tab Navigation */}
      <div className="profile-tabs">
        <button 
          className={activeTab === 'profile' ? 'active' : ''}
          onClick={() => setActiveTab('profile')}
        >
          Προφίλ
        </button>
        <button 
          className={activeTab === 'favorites' ? 'active' : ''}
          onClick={() => setActiveTab('favorites')}
        >
          Αγαπημένα ({favoriteProperties.length})
        </button>
      </div>
      
      {/* Profile Tab Content */}
      {activeTab === 'profile' && (
        <>
          <div className="profile-header">
            <div className="avatar">
              {profile.name.charAt(0).toUpperCase()}
            </div>
            <h2>{profile.name}</h2>
          </div>
          
          <div className="profile-details">
            <h3>Πληροφορίες</h3>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Ηλικία:</strong> {profile.age}</p>
            <p><strong>Επάγγελμα:</strong> {profile.profession}</p>
            <p><strong>Τοποθεσία:</strong> {profile.location}</p>
            
            {profile.hasChildren && (
              <p><strong>Παιδιά:</strong> {profile.childrenCount}</p>
            )}
            
            {profile.hasPets && (
              <p><strong>Κατοικίδια:</strong> {profile.petsType}</p>
            )}
            
            <p><strong>Χόμπι:</strong> {profile.hobbies}</p>
            <p><strong>Ώρες εργασίας:</strong> {profile.workHours}</p>
            <p><strong>Επιπλέον πληροφορίες:</strong> {profile.additionalInfo}</p>
            
            <div className="profile-actions">
              <Link to="/edit-profile" className="edit-profile-btn">
                Επεξεργασία Προφίλ
              </Link>
              <button className="logout-btn" onClick={handleLogout}>
                Αποσύνδεση
              </button>
            </div>
          </div>
        </>
      )}
      
      {/* Favorites Tab Content */}
      {activeTab === 'favorites' && (
        <div className="favorites-container">
          <h2>Αγαπημένες Αγγελίες</h2>
          
          {loadingFavorites ? (
            <div className="loading">Φόρτωση...</div>
          ) : favoriteProperties.length === 0 ? (
            <p>Δεν έχετε αγαπημένες αγγελίες ακόμα</p>
          ) : (
            <div className="favorites-list">
              {favoriteProperties.map(property => (
                <div key={property.id} className="property-detail-card">
                  <div className="property-header">
                    <div className="property-info-basic">
                      <div className="price">{property.price}€</div>
                      <div className="size-area">
                        <span>{property.size} τ.μ.</span>
                        <span> | </span>
                        <span>{property.area}</span>
                      </div>
                      <div className="bed-bath">
                        <span>{property.bedrooms} υπνοδ.</span>
                        <span> | </span>
                        <span>{property.bathrooms} μπάνια</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Property Image */}
                  <img
                    src={property.images[0]}
                    alt="Property"
                    className="property-image"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/images/default-house.webp";
                    }}
                  />
                  
                  {/* Detailed Information */}
                  <div className="property-details">
                    <h3>Περιγραφή</h3>
                    <p>{property.description || 'Δεν υπάρχει περιγραφή'}</p>
                    
                    <h3>Χαρακτηριστικά</h3>
                    <ul>
                      <li>Όροφος: {property.floor}</li>
                      <li>Θέρμανση: {property.heating}</li>
                      <li>Έτος κατασκευής: {property.constructionYear}</li>
                      <li>Ενεργειακό: {property.energyCertificate}</li>
                      <li>Προσανατολισμός: {property.orientation}</li>
                      {property.features && property.features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                    
                    <h3>Τοποθεσία</h3>
                    <p>{property.area}</p>
                    
                    <button 
                      className="contact-btn"
                      onClick={() => {/* Handle contact logic */}}
                    >
                      Επικοινωνία με ιδιοκτήτη
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SeekerProfile;
