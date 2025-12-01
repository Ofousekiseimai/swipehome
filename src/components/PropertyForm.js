import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PropertyForm = () => {
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState(0);
  const [propertyType, setPropertyType] = useState('');
  const { currentUser } = useAuth();
  
  const [formData, setFormData] = useState({
    ownerId: currentUser.id,
    type: '',
    price: '',
    area: '',
    size: '',
    plotSize: '',
    constructionYear: '',
    completionYear: '',
    energyCertificate: '',
    zoneType: '',
    street: '',
    country: 'Greece',
    region: '',
    prefecture: '',
    areaName: '',
    neighborhood: '',
    postalCode: '',
    floor: '',
    bedrooms: '',
    bathrooms: '',
    kitchens: '',
    livingRooms: '',
    balconies: '',
    storage: '',
    internalStairs: '',
    pool: false,
    garden: false,
    attic: false,
    loftSize: '',
    fireplaces: '',
    windows: '',
    frames: '',
    floors: '',
    security: [],
    heatingType: '',
    heatingMedium: '',
    heatingFeatures: [],
    condition: '',
    view: '',
    orientation: '',
    features: [],
    buildingFloors: '',
    totalLevels: '',
    totalFloors: '',
    emergencyExit: '',
    basementLevels: '',
    basementSize: '',
    shopWindow: '',
    groundFloorSize: '',
    loftSizeCommercial: '',
    commercialFeatures: [],
    plotDimensions: '',
    frontage: '',
    depth: '',
    plotNumber: '',
    buildingCoefficient: '',
    coverageFactor: '',
    maxHeight: '',
    existingStructure: '',
    remainingBuilding: '',
    landUse: '',
    urbanPlan: '',
    landCharacteristics: [],
    comments: ''
  });

  const propertyTypes = [
    'Διαμέρισμα', 'Studio', 'Γκαρσονιέρα', 'Μεζονέτα', 'Μονοκατοικία', 
    'Βίλα', 'Bungalow', 'Πολυκατοικία', 'Κτίριο', 'Οικιστικό συγκρότημα',
    'Πλωτό Σπίτι', 'Duplex', 'Ημιανεξάρτητη', 'Επαγγελματικό', 'Οικόπεδο/Γη'
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      if (checked) {
        setFormData(prev => ({
          ...prev,
          [name]: [...prev[name], value]
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [name]: prev[name].filter(item => item !== value)
        }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Property submitted:', formData);
    alert('Property listed successfully!');
    navigate('/home');
  };

  // Get dynamic sections based on property type
  const getSections = () => {
    const baseSections = [
      { title: "Βασικά", content: renderBasicInfo },
      { title: "Τοποθεσία", content: renderLocation },
      { title: "Δομή", content: renderStructure },
      { title: "Χαρακτηριστικά", content: renderFeatures },
      { title: "Ολοκλήρωση", content: renderFinal }
    ];

    if (propertyType === 'Οικόπεδο/Γη') {
      baseSections.splice(3, 0, { title: "Οικόπεδο", content: renderPlotInfo });
    }
    
    if (propertyType === 'Επαγγελματικό') {
      baseSections.splice(3, 0, { title: "Επαγγελματικό", content: renderCommercialInfo });
    }

    return baseSections;
  };

  // Reset to first step when property type changes
  useEffect(() => {
    setCurrentSection(0);
  }, [propertyType]);

  const renderBasicInfo = () => (
    <div className="form-section">
      <h2>Βασικά Στοιχεία</h2>
      <label>
        Τύπος Ακινήτου:
        <select 
          name="type" 
          value={formData.type} 
          onChange={(e) => {
            setPropertyType(e.target.value);
            handleChange(e);
          }}
          required
        >
          <option value="">Επιλέξτε τύπο</option>
          {propertyTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </label>
      
      <label>
        Τιμή (€):
        <input 
          type="number" 
          name="price" 
          value={formData.price} 
          onChange={handleChange} 
          required 
        />
      </label>
      
      <label>
        Εμβαδόν (τ.μ.):
        <input 
          type="number" 
          name="size" 
          value={formData.size} 
          onChange={handleChange} 
          required 
        />
      </label>
      
      {propertyType === 'Οικόπεδο/Γη' && (
        <label>
          Εμβαδόν οικοπέδου (τ.μ.):
          <input 
            type="number" 
            name="plotSize" 
            value={formData.plotSize} 
            onChange={handleChange} 
          />
        </label>
      )}
      
      <label>
        Έτος κατασκευής:
        <input 
          type="number" 
          name="constructionYear" 
          value={formData.constructionYear} 
          onChange={handleChange} 
        />
      </label>
      
      <label>
        Ζώνη/Είδος:
        <select name="zoneType" value={formData.zoneType} onChange={handleChange}>
          <option value="">Επιλέξτε</option>
          <option value="Οικιστική">Οικιστική</option>
          <option value="Αγροτική">Αγροτική</option>
          <option value="Εμπορική">Εμπορική</option>
          <option value="Βιομηχανική">Βιομηχανική</option>
          <option value="Ανάπλασης">Ανάπλασης</option>
          <option value="Βιοτεχνική">Βιοτεχνική</option>
          <option value="Τουριστική">Τουριστική</option>
          <option value="Χοντρεμπορίου">Χοντρεμπορίου</option>
          <option value="Αχαρακτήριστη">Αχαρακτήριστη</option>
          <option value="Κόκκινη">Κόκκινη</option>
          <option value="Μικτή χρήση">Μικτή χρήση</option>
          <option value="Δασική">Δασική</option>
          <option value="Προστασίας">Προστασίας</option>
        </select>
      </label>
    </div>
  );

  const renderLocation = () => (
    <div className="form-section">
      <h2>Τοποθεσία</h2>
      <label>
        Οδός:
        <input 
          type="text" 
          name="street" 
          value={formData.street} 
          onChange={handleChange} 
          required 
        />
      </label>
      
      <label>
        Περιοχή:
        <input 
          type="text" 
          name="areaName" 
          value={formData.areaName} 
          onChange={handleChange} 
          required 
        />
      </label>
      
      <label>
        Γειτονιά/Υποπεριοχή:
        <input 
          type="text" 
          name="neighborhood" 
          value={formData.neighborhood} 
          onChange={handleChange} 
        />
      </label>
      
      <label>
        Ταχυδρομικός Κώδικας:
        <input 
          type="text" 
          name="postalCode" 
          value={formData.postalCode} 
          onChange={handleChange} 
        />
      </label>
    </div>
  );

  const renderStructure = () => (
    <div className="form-section">
      <h2>Δομή Ακινήτου</h2>
      {propertyType !== 'Οικόπεδο/Γη' && (
        <>
          <label>
            Όροφος:
            <select name="floor" value={formData.floor} onChange={handleChange}>
              <option value="">Επιλέξτε</option>
              <option value="2ο Υπόγειο">2ο Υπόγειο</option>
              <option value="Υπόγειο">Υπόγειο</option>
              <option value="Ημιυπόγειο">Ημιυπόγειο</option>
              <option value="Ισόγειο">Ισόγειο</option>
              <option value="Υπερυψωμένο Ισόγειο">Υπερυψωμένο Ισόγειο</option>
              <option value="Ημιόροφος">Ημιόροφος</option>
              <option value="1ος">1ος</option>
              <option value="2ος">2ος</option>
              <option value="3ος">3ος</option>
              <option value="4ος">4ος</option>
              <option value="5ος">5ος</option>
              <option value="6ος">6ος</option>
              <option value="7ος">7ος</option>
              <option value="8ος">8ος</option>
              <option value="10ος">10ος</option>
              <option value="11ος">11ος</option>
              <option value="12ος">12ος</option>
              <option value="13ος">13ος</option>
              <option value="14ος">14ος</option>
              <option value="15ος">15ος</option>
              <option value="16ος">16ος</option>
              <option value="17ος">17ος</option>
              <option value="18ος">18ος</option>
              <option value="19ος">19ος</option>
              <option value="20ος">20ος</option>
            </select>
          </label>
          
          <label>
            Υπνοδωμάτια:
            <input 
              type="number" 
              name="bedrooms" 
              value={formData.bedrooms} 
              onChange={handleChange} 
            />
          </label>
          
          <label>
            Μπάνια (WC):
            <input 
              type="number" 
              name="bathrooms" 
              value={formData.bathrooms} 
              onChange={handleChange} 
            />
          </label>
        </>
      )}
      
      {propertyType === 'Επαγγελματικό' && (
        <>
          <label>
            Όροφοι ανωδομής:
            <input 
              type="number" 
              name="buildingFloors" 
              value={formData.buildingFloors} 
              onChange={handleChange} 
            />
          </label>
          
          <label>
            Σύνολο επιπέδων:
            <input 
              type="number" 
              name="totalLevels" 
              value={formData.totalLevels} 
              onChange={handleChange} 
            />
          </label>
        </>
      )}
    </div>
  );

  const renderFeatures = () => (
    <div className="form-section">
      <h2>Χαρακτηριστικά</h2>
      <label>
        Θέρμανση:
        <select name="heatingType" value={formData.heatingType} onChange={handleChange}>
          <option value="">Επιλέξτε τύπο</option>
          <option value="Ατομική">Ατομική</option>
          <option value="Αυτόνομη">Αυτόνομη</option>
          <option value="Κεντρική">Κεντρική</option>
          <option value="Χωρίς">Χωρίς</option>
        </select>
      </label>
      
      <div>
        <p>Ασφάλεια:</p>
        <label>
          <input 
            type="checkbox" 
            name="security" 
            value="Πόρτα Ασφαλείας" 
            onChange={handleChange} 
          /> Πόρτα Ασφαλείας
        </label>
        <label>
          <input 
            type="checkbox" 
            name="security" 
            value="Θυροτηλεόραση" 
            onChange={handleChange} 
          /> Θυροτηλεόραση
        </label>
        <label>
          <input 
            type="checkbox" 
            name="security" 
            value="Συναγερμός" 
            onChange={handleChange} 
          /> Συναγερμός
        </label>
        <label>
          <input 
            type="checkbox" 
            name="security" 
            value="Κάμερες Ασφαλείας" 
            onChange={handleChange} 
          /> Κάμερες Ασφαλείας
        </label>
        <label>
          <input 
            type="checkbox" 
            name="security" 
            value="Συστημα Πυροσβεσης" 
            onChange={handleChange} 
          /> Συστημα Πυροσβεσης
        </label>
        <label>
          <input 
            type="checkbox" 
            name="security" 
            value="Πυροσβεστήρες" 
            onChange={handleChange} 
          /> Πυροσβεστήρες
        </label>
        <label>
          <input 
            type="checkbox" 
            name="security" 
            value="Ανιχνευτής Καπνού" 
            onChange={handleChange} 
          /> Ανιχνευτής Καπνού
        </label>
      </div>
    </div>
  );

  const renderPlotInfo = () => (
    <div className="form-section">
      <h2>Στοιχεία Οικοπέδου</h2>
      <label>
        Διαστάσεις οικοπέδου:
        <input 
          type="text" 
          name="plotDimensions" 
          value={formData.plotDimensions} 
          onChange={handleChange} 
        />
      </label>
      
      <label>
        Πρόσοψη (m):
        <input 
          type="number" 
          name="frontage" 
          value={formData.frontage} 
          onChange={handleChange} 
        />
      </label>
      
      <label>
        Συντελεστής δόμησης:
        <input 
          type="number" 
          name="buildingCoefficient" 
          value={formData.buildingCoefficient} 
          onChange={handleChange} 
        />
      </label>
    </div>
  );

  const renderCommercialInfo = () => (
    <div className="form-section">
      <h2>Επαγγελματικά Χαρακτηριστικά</h2>
      <label>
        Βιτρίνα (m):
        <input 
          type="number" 
          name="shopWindow" 
          value={formData.shopWindow} 
          onChange={handleChange} 
        />
      </label>
      
      <label>
        Ισόγειο (τ.μ.):
        <input 
          type="number" 
          name="groundFloorSize" 
          value={formData.groundFloorSize} 
          onChange={handleChange} 
        />
      </label>
      
      <div>
        <p>Εγκαταστάσεις:</p>
        <label>
          <input 
            type="checkbox" 
            name="commercialFeatures" 
            value="Ανελκυστήρας Φορτίων" 
            onChange={handleChange} 
          /> Ανελκυστήρας Φορτίων
        </label>
        <label>
          <input 
            type="checkbox" 
            name="commercialFeatures" 
            value="Δομημένη Καλωδίωση" 
            onChange={handleChange} 
          /> Δομημένη Καλωδίωση
        </label>
        <label>
          <input 
            type="checkbox" 
            name="commercialFeatures" 
            value="Rack" 
            onChange={handleChange} 
          /> Rack
        </label>
        <label>
          <input 
            type="checkbox" 
            name="commercialFeatures" 
            value="Patch Panels" 
            onChange={handleChange} 
          /> Patch Panels
        </label>
        <label>
          <input 
            type="checkbox" 
            name="commercialFeatures" 
            value="Ράμπα Εκφόρτωσης" 
            onChange={handleChange} 
          /> Ράμπα Εκφόρτωσης
        </label>
        <label>
          <input 
            type="checkbox" 
            name="commercialFeatures" 
            value="Ψευδοροφή" 
            onChange={handleChange} 
          /> Ψευδοροφή
        </label>
      </div>
    </div>
  );

  const renderFinal = () => (
    <div className="form-section">
      <h2>Τελική Επιβεβαίωση</h2>
      <label>
        Έξτρα Σχόλια/Περιγραφή:
        <textarea 
          name="comments" 
          value={formData.comments} 
          onChange={handleChange} 
          rows="4"
        />
      </label>
      
      <div className="summary">
        <h3>Σύνοψη Ακινήτου</h3>
        <p><strong>Τύπος:</strong> {formData.type}</p>
        <p><strong>Τιμή:</strong> {formData.price} €</p>
        <p><strong>Τοποθεσία:</strong> {formData.street}, {formData.areaName}</p>
        <p><strong>Εμβαδόν:</strong> {formData.size} τ.μ.</p>
      </div>
    </div>
  );

  const sections = getSections();

  return (
    <div className="property-form mobile-form">
      <div className="mobile-header">
        <button 
          className="nav-button"
          onClick={() => currentSection > 0 && setCurrentSection(currentSection - 1)}
          disabled={currentSection === 0}
        >
          &lt;
        </button>
        
        <div className="step-info">
          <h2>{sections[currentSection].title}</h2>
          <div className="step-counter">{currentSection + 1}/{sections.length}</div>
        </div>
        
        <button 
          className="nav-button"
          onClick={() => currentSection < sections.length - 1 && setCurrentSection(currentSection + 1)}
          disabled={currentSection === sections.length - 1}
        >
          &gt;
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-content">
          {sections[currentSection].content()}
        </div>
        
        <div className="mobile-buttons">
          {currentSection < sections.length - 1 ? (
            <button 
              type="button" 
              className="full-width-btn"
              onClick={() => setCurrentSection(currentSection + 1)}
            >
              Συνέχεια
            </button>
          ) : (
            <button type="submit" className="full-width-btn submit-btn">
              Υποβολή
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default PropertyForm;