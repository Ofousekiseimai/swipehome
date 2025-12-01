import React from 'react';
import { useSwipeable } from 'react-swipeable';
import { useFavorite } from '../context/FavoriteContext';

const PropertyDetailsModal = ({
  property,
  owner,
  onClose,
  onSwipeLeft,
  onSwipeRight,
}) => {
  const { favorites, addFavorite, removeFavorite } = useFavorite();
  const isFavorite = property ? favorites.includes(property.id) : false;

  const handleFavoriteToggle = () => {
    if (!property) {
      return;
    }

    if (isFavorite) {
      removeFavorite(property.id);
    } else {
      addFavorite(property.id);
    }
  };

  const handleSwipe = (direction) => {
    if (direction === 'left' && onSwipeLeft) {
      onSwipeLeft();
    } else if (direction === 'right' && onSwipeRight) {
      onSwipeRight();
    }
    if (direction === 'left' || direction === 'right') {
      onClose?.();
    }
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => handleSwipe('left'),
    onSwipedRight: () => handleSwipe('right'),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  if (!property) {
    return null;
  }

  const infoItems = [
    { label: 'Τιμή', value: property.price ? `${property.price.toLocaleString()} €/μήνα` : '-' },
    { label: 'Εμβαδόν', value: property.size ? `${property.size} τ.μ.` : '-' },
    {
      label: 'Υπνοδωμάτια',
      value: typeof property.bedrooms === 'number' ? property.bedrooms : '-',
    },
    {
      label: 'Μπάνια',
      value: typeof property.bathrooms === 'number' ? property.bathrooms : '-',
    },
    { label: 'Όροφος', value: property.floor || '-' },
    {
      label: 'Έτος κατασκευής',
      value: property.constructionYear || '-',
    },
    {
      label: 'Ενεργειακό',
      value: property.energyCertificate || '-',
    },
  ];

  const highlights = [
    { label: 'Περιοχή', value: property.area },
    { label: 'Προσανατολισμός', value: property.orientation },
    { label: 'Θέρμανση', value: property.heating },
    { label: 'Ασφάλεια', value: property.security },
  ].filter(item => Boolean(item.value));

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div {...swipeHandlers} className="property-details-modal">
        <button
          type="button"
          className="modal-close"
          aria-label="Κλείσιμο λεπτομερειών"
          onClick={onClose}
        >
          ×
        </button>

        <div className="modal-gallery">
          {(property.images || []).length > 0 ? (
            <div className="modal-gallery-track">
              {property.images.map((src, index) => (
                <img
                  key={`${property.id}-image-${index}`}
                  src={src}
                  alt={property.title || `Φωτογραφία ${index + 1}`}
                  onError={(event) => {
                    event.currentTarget.src = '/images/default-house.webp';
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="modal-gallery-placeholder">Δεν υπάρχουν διαθέσιμες φωτογραφίες</div>
          )}
        </div>

        <div className="modal-content">
          <header className="modal-header">
            <div>
              <p className="modal-location">{property.area}</p>
              <h2>{property.title || property.type}</h2>
            </div>
            <div className="modal-price">
              {property.price ? `${property.price.toLocaleString()} €` : 'Κατόπιν συνεννόησης'}
            </div>
          </header>

          <div className="modal-actions-top">
            <button
              type="button"
              className={`property-card__favorite ${isFavorite ? 'is-active' : ''}`}
              onClick={handleFavoriteToggle}
              aria-label={isFavorite ? 'Αφαίρεση από αγαπημένα' : 'Προσθήκη στα αγαπημένα'}
            >
              ★ Αγαπημένο
            </button>
          </div>

          <section className="modal-section modal-grid">
            {infoItems.map(item => (
              <div key={item.label} className="modal-grid-item">
                <span className="modal-grid-label">{item.label}</span>
                <span className="modal-grid-value">{item.value}</span>
              </div>
            ))}
          </section>

          {highlights.length > 0 && (
            <section className="modal-section">
              <h3>Βασικά Χαρακτηριστικά</h3>
              <ul className="modal-chip-list">
                {highlights.map(item => (
                  <li key={item.label}>
                    <span className="chip-label">{item.label}</span>
                    <span className="chip-value">{item.value}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {(property.features?.length || 0) > 0 && (
            <section className="modal-section">
              <h3>Παροχές</h3>
              <ul className="modal-tag-list">
                {property.features.map(feature => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            </section>
          )}

          {property.description && (
            <section className="modal-section">
              <h3>Περιγραφή</h3>
              <p className="modal-description">{property.description}</p>
            </section>
          )}

          {owner && (
            <section className="modal-section">
              <h3>Ιδιοκτήτης</h3>
              <div className="modal-owner">
                <div className="owner-avatar" aria-hidden="true">
                  {owner.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="owner-name">{owner.name}</p>
                  {owner.phone && <p className="owner-phone">Τηλέφωνο: {owner.phone}</p>}
                  {owner.bio && <p className="owner-bio">{owner.bio}</p>}
                </div>
              </div>
            </section>
          )}

          <div className="modal-actions">
            <button
              type="button"
              className="ghost-button"
              onClick={() => handleSwipe('left')}
            >
              Απόρριψη
            </button>
            <button
              type="button"
              className="primary-button"
              onClick={() => handleSwipe('right')}
            >
              Μου ταιριάζει
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailsModal;
