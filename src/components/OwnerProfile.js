import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

const OwnerProfile = () => {
  const { id } = useParams();
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState(null);
  const [ownerProperties, setOwnerProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadOwner = async () => {
      setLoading(true);
      const [ownerData, propertyData] = await Promise.all([
        api.getOwnerById(id),
        api.getProperties(),
      ]);

      if (isMounted) {
        setProfile(ownerData);
        setOwnerProperties(
          propertyData.filter(property => property.ownerId === parseInt(id, 10))
        );
        setLoading(false);
      }
    };

    loadOwner();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
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
      <h1>Προφίλ Ιδιοκτήτη</h1>
      <div className="profile-header">
        <div className="avatar">
          {profile.name.charAt(0).toUpperCase()}
        </div>
        <h2>{profile.name}</h2>
      </div>
      
      <div className="profile-details">
        <h3>Οι Ιδιοκτησίες Μου</h3>
        
        <Link to="/list-property" className="list-property-btn">
          + Καταχώρηση Νέας Ιδιοκτησίας
        </Link>
        
        <div className="owner-properties">
          {ownerProperties.length > 0 ? (
            <div className="properties-grid">
              {ownerProperties.map(property => (
                <div key={property.id} className="property-item">
                  <img 
                    src={property.images[0]} 
                    alt={property.title}
                    className="property-thumbnail"
                    onError={(e) => {
                      e.target.onerror = null; 
                      e.target.src = "/images/default-house.webp";
                    }}
                  />
                  <div className="property-info">
                    <h4>{property.title}</h4>
                    <p>{property.area}</p>
                    <p>{property.price}€/μήνα</p>
                    <p>{property.bedrooms} υπνοδ., {property.bathrooms} μπάνια</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>Δεν έχετε καταχωρήσει ακίνητα ακόμα</p>
          )}
        </div>
        
        <div className="profile-actions">
          <button className="logout-btn" onClick={handleLogout}>
            Αποσύνδεση
          </button>
        </div>
      </div>
    </div>
  );
};

export default OwnerProfile;
