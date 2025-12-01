import React from 'react';
import { useSwipeable } from 'react-swipeable';
import { useFavorite } from '../context/FavoriteContext';

const PropertyCard = ({ property, nextProperty, owner, onViewDetails }) => {
  const { addFavorite, removeFavorite, favorites } = useFavorite();
  const isFavorite = favorites.includes(property.id);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => nextProperty('left'),
    onSwipedRight: () => handleSwipeRight(),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  const handleSwipeRight = () => {
    if (isFavorite) {
      return nextProperty('right');
    }

    addFavorite(property.id);
    nextProperty('right');
  };

  const toggleFavorite = () => {
    if (isFavorite) {
      removeFavorite(property.id);
    } else {
      addFavorite(property.id);
    }
  };

  return (
    <article {...swipeHandlers} className="property-card">
      <div className="property-card__media">
        <img
          src={property.images?.[0] || '/images/default-house.webp'}
          alt={property.title || 'Ακίνητο'}
          onError={(event) => {
            event.currentTarget.src = '/images/default-house.webp';
          }}
        />
        <button
          type="button"
          className={`property-card__favorite ${isFavorite ? 'is-active' : ''}`}
          onClick={toggleFavorite}
          aria-label={isFavorite ? 'Αφαίρεση από αγαπημένα' : 'Προσθήκη στα αγαπημένα'}
        >
          ★
        </button>
      </div>

      <div className="property-card__body">
        <div className="property-card__headline">
          <div>
            <h2>{property.title || property.type}</h2>
            <p className="property-card__location">{property.area}</p>
          </div>
          <span className="property-card__price">
            {property.price ? `${property.price.toLocaleString()} €` : 'Κατόπιν συνεννόησης'}
          </span>
        </div>

        <div className="property-card__specs">
          <span>{property.size ? `${property.size} τ.μ.` : '-'}</span>
          <span>•</span>
          <span>{typeof property.bedrooms === 'number' ? `${property.bedrooms} υπνοδ.` : '— υπνοδ.'}</span>
          <span>•</span>
          <span>{typeof property.bathrooms === 'number' ? `${property.bathrooms} μπάνια` : '— μπάνια'}</span>
        </div>

        <div className="property-card__summary">
          <div className="summary-item">
            <span className="summary-label">Όροφος</span>
            <span className="summary-value">{property.floor || '-'}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Θέρμανση</span>
            <span className="summary-value">{property.heating || '-'}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Ενεργειακό</span>
            <span className="summary-value">{property.energyCertificate || '-'}</span>
          </div>
        </div>

        <div className="property-card__actions">
          <button
            type="button"
            className="ghost-button"
            onClick={() => nextProperty('left')}
          >
            Απόρριψη
          </button>
          <button
            type="button"
            className="primary-button"
            onClick={handleSwipeRight}
          >
            Μου ταιριάζει
          </button>
        </div>

        <button
          type="button"
          className="link-button"
          onClick={() => onViewDetails(property, owner)}
        >
          Δείτε λεπτομέρειες ακινήτου →
        </button>
      </div>
    </article>
  );
};

export default PropertyCard;
