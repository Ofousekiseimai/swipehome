import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { seekers, owners } from '../data/dummyData';


const CreateProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const userId = parseInt(id);
  
  // Find the user
  const user = [...seekers, ...owners].find(u => u.id === userId);
  const isSeeker = user?.type === 'seeker';
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    age: user?.age || '',
    profession: user?.profession || '',
    location: user?.location || '',
    hasChildren: user?.hasChildren || false,
    hasPets: user?.hasPets || false,
    petsType: user?.petsType || '',
    hobbies: user?.hobbies || '',
    workHours: user?.workHours || '',
    additionalInfo: user?.additionalInfo || '',
    bio: user?.bio || ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Update user data
    const userIndex = isSeeker 
      ? seekers.findIndex(s => s.id === userId)
      : owners.findIndex(o => o.id === userId);
    
    if (userIndex !== -1) {
      const updatedUser = {
        ...(isSeeker ? seekers[userIndex] : owners[userIndex]),
        ...formData
      };
      
      if (isSeeker) {
        seekers[userIndex] = updatedUser;
      } else {
        owners[userIndex] = updatedUser;
      }
    }
    
    // Redirect to home
    navigate('/home');
  };

  return (
    <div className="create-profile-container">
      <div className="profile-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          &#8592;
        </button>
        <h1>Ολοκληρώστε το προφίλ σας</h1>
        <div className="header-spacer"></div>
      </div>
      
      <form onSubmit={handleSubmit} className="profile-form">
        <div className="form-section">
          <h2>Βασικές Πληροφορίες</h2>
          
          <div className="input-group">
            <label>Όνομα</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="input-group">
            <label>Τηλέφωνο</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
        </div>
        
        {isSeeker ? (
          <div className="form-section">
            <h2>Πληροφορίες για το σπίτι που ψάχνετε</h2>
            
            <div className="input-group">
              <label>Ηλικία</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
              />
            </div>
            
            <div className="input-group">
              <label>Επάγγελμα</label>
              <input
                type="text"
                name="profession"
                value={formData.profession}
                onChange={handleChange}
              />
            </div>
            
            <div className="input-group">
              <label>Τοποθεσία προτίμησης</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
              />
            </div>
            
            <div className="checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="hasChildren"
                  checked={formData.hasChildren}
                  onChange={handleChange}
                />
                <span className="checkmark"></span>
                Έχω παιδιά
              </label>
            </div>
            
            <div className="checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="hasPets"
                  checked={formData.hasPets}
                  onChange={handleChange}
                />
                <span className="checkmark"></span>
                Έχω κατοικίδια
              </label>
            </div>
            
            {formData.hasPets && (
              <div className="input-group">
                <label>Τύπος κατοικίδιων</label>
                <input
                  type="text"
                  name="petsType"
                  value={formData.petsType}
                  onChange={handleChange}
                  placeholder="Π.χ. σκύλος, γάτα"
                />
              </div>
            )}
            
            <div className="input-group">
              <label>Χόμπι</label>
              <textarea
                name="hobbies"
                value={formData.hobbies}
                onChange={handleChange}
                placeholder="Π.χ. βόλτες, διάβασμα, ταξίδια"
                rows="3"
              />
            </div>
            
            <div className="input-group">
              <label>Ώρες εργασίας</label>
              <input
                type="text"
                name="workHours"
                value={formData.workHours}
                onChange={handleChange}
                placeholder="Π.χ. 9:00-17:00"
              />
            </div>
            
            <div className="input-group">
              <label>Επιπλέον πληροφορίες</label>
              <textarea
                name="additionalInfo"
                value={formData.additionalInfo}
                onChange={handleChange}
                placeholder="Οτιδήποτε άλλο θέλετε να μας πείτε"
                rows="3"
              />
            </div>
          </div>
        ) : (
          <div className="form-section">
            <h2>Πληροφορίες Ιδιοκτήτη</h2>
            
            <div className="input-group">
              <label>Περιγραφή</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Περιγράψτε τον εαυτό σας και την εμπειρία σας"
                rows="4"
              />
            </div>
          </div>
        )}
        
        <button type="submit" className="submit-btn">
          Αποθήκευση Προφίλ
        </button>
      </form>
    </div>
  );
};

export default CreateProfile;