import React, { useState, useEffect } from 'react';
import PropertyCard from './PropertyCard';
import SeekerCard from './SeekerCard';
import SwipeButtons from './SwipeButtons';
import { useAuth } from '../context/AuthContext';
import { useMatch } from '../context/MatchContext';
import { useFavorite } from '../context/FavoriteContext';
import { api } from '../services/api';
import MatchPopup from './MatchPopup';
import PropertyDetailsModal from './PropertyDetailsModal';

const Home = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [properties, setProperties] = useState([]);
  const [seekers, setSeekers] = useState([]);
  const [ownersById, setOwnersById] = useState({});
  const [currentSeekerIndex, setCurrentSeekerIndex] = useState(0);
  const [showMatchPopup, setShowMatchPopup] = useState(false);
  const [currentMatch, setCurrentMatch] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const { addMatch } = useMatch();
  const { addFavorite } = useFavorite();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentIndex, currentSeekerIndex]);

  useEffect(() => {
    let isMounted = true;

    const loadFeedData = async () => {
      setLoading(true);
      const [propertiesData, seekersData, ownersData] = await Promise.all([
        api.getProperties(),
        api.getSeekers(),
        api.getOwners(),
      ]);

      if (!isMounted) {
        return;
      }

      const ownerMap = ownersData.reduce((acc, owner) => {
        acc[owner.id] = owner;
        return acc;
      }, {});

      setProperties(propertiesData);
      setSeekers(seekersData);
      setOwnersById(ownerMap);
      setCurrentIndex(0);
      setCurrentSeekerIndex(0);
      setLoading(false);
    };

    loadFeedData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Handle property swipe for seekers
  const handlePropertySwipe = (direction) => {
    if (!properties.length) {
      return;
    }

    const property = properties[currentIndex];

    if (direction === 'right') {
      addFavorite(property.id);

      const owner = ownersById[property.ownerId];

      if (owner) {
        const newMatch = addMatch(currentUser, owner, property.id);
        setCurrentMatch(newMatch);
        setShowMatchPopup(true);
      }
    }

    setCurrentIndex(prev => (prev >= properties.length - 1 ? 0 : prev + 1));
    setSelectedProperty(null);
    setSelectedOwner(null);
  };

  // Handle seeker swipe for owners
  const handleSeekerSwipe = (direction) => {
    if (!seekers.length) {
      return;
    }

    const seeker = seekers[currentSeekerIndex];

    if (direction === 'right') {
      const newMatch = addMatch(currentUser, seeker, null);
      setCurrentMatch(newMatch);
      setShowMatchPopup(true);
    }

    setCurrentSeekerIndex(prev => (prev >= seekers.length - 1 ? 0 : prev + 1));
  };

  // Close match popup
  const closeMatchPopup = () => {
    setShowMatchPopup(false);
    setCurrentMatch(null);
  };

  const openPropertyDetails = (property, owner) => {
    setSelectedProperty(property);
    setSelectedOwner(owner || null);
  };

  const closePropertyDetails = () => {
    setSelectedProperty(null);
    setSelectedOwner(null);
  };

  // Seeker View
  if (loading) {
    return <div className="loading">Φόρτωση...</div>;
  }

  if (currentUser?.type === 'seeker') {
    return (
      <div className="home-container">
        {properties.length > 0 && (
          <PropertyCard
            property={properties[currentIndex]}
            owner={ownersById[properties[currentIndex].ownerId]}
            nextProperty={handlePropertySwipe}
            onViewDetails={openPropertyDetails}
          />
        )}

        {showMatchPopup && currentMatch && (
          <MatchPopup match={currentMatch} onClose={closeMatchPopup} />
        )}

        <PropertyDetailsModal
          property={selectedProperty}
          owner={selectedOwner}
          onClose={closePropertyDetails}
          onSwipeLeft={() => handlePropertySwipe('left')}
          onSwipeRight={() => handlePropertySwipe('right')}
        />
      </div>
    );
  }

  // Owner View
  if (currentUser?.type === 'owner') {
    // Filter seekers that match owner's properties
    const matchingSeekers = seekers.filter(seeker => 
      // Add your matching criteria here (e.g., location, budget)
      true
    );

    return (
      <div className="home-container">
        <h2>Καλώς ήρθατε, {currentUser.name}</h2>
        
        <div className="owner-seekers-view">
          {matchingSeekers.length > 0 ? (
            <>
              <SeekerCard 
                seeker={matchingSeekers[currentSeekerIndex]} 
                onSwipe={handleSeekerSwipe} 
              />
              <SwipeButtons onSwipe={handleSeekerSwipe} />
            </>
          ) : (
            <p>Δεν βρέθηκαν ενδιαφερόμενοι που να ταιριάζουν με τις αγγελίες σας</p>
          )}
        </div>
        
        {showMatchPopup && currentMatch && (
          <MatchPopup match={currentMatch} onClose={closeMatchPopup} />
        )}
      </div>
    );
  }

  return <div>Φόρτωση...</div>;
};

export default Home;
