import React, { useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';

const AdminDashboard = () => {
  const [properties, setProperties] = useState([]);
  const [owners, setOwners] = useState([]);
  const [seekers, setSeekers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        const [
          propertyList,
          ownerList,
          seekerList,
          matchList,
          notificationList,
        ] = await Promise.all([
          api.getProperties(),
          api.getOwners(),
          api.getSeekers(),
          api.getMatches(),
          api.getNotifications(),
        ]);

        if (!isMounted) {
          return;
        }

        setProperties(propertyList);
        setOwners(ownerList);
        setSeekers(seekerList);
        setMatches(matchList);
        setNotifications(notificationList);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  const sortedProperties = useMemo(
    () => [...properties].sort((a, b) => Number(b.id) - Number(a.id)),
    [properties]
  );

  const sortedUsers = useMemo(
    () =>
      [...owners, ...seekers].sort((a, b) => Number(b.id) - Number(a.id)),
    [owners, seekers]
  );

  const averagePrice = useMemo(() => {
    if (!properties.length) {
      return null;
    }
    const total = properties.reduce((sum, property) => sum + Number(property.price || 0), 0);
    return Math.round(total / properties.length);
  }, [properties]);

  const unreadNotifications = useMemo(
    () => notifications.filter(notification => !notification.read).length,
    [notifications]
  );

  const ownersById = useMemo(
    () =>
      owners.reduce((acc, owner) => {
        acc[owner.id] = owner;
        return acc;
      }, {}),
    [owners]
  );

  if (loading) {
    return <div className="loading">Φόρτωση στοιχείων διαχειριστή...</div>;
  }

  return (
    <div className="admin-dashboard">
      <section className="admin-stats">
        {[
          { label: 'Σύνολο Αγγελιών', value: properties.length },
          { label: 'Ιδιοκτήτες', value: owners.length },
          { label: 'Ενδιαφερόμενοι', value: seekers.length },
          { label: 'Matches', value: matches.length },
          { label: 'Μέση Τιμή Ενοικίου', value: averagePrice ? `${averagePrice}€` : '—' },
          { label: 'Μη αναγνωσμένες ειδοποιήσεις', value: unreadNotifications },
        ].map(stat => (
          <div key={stat.label} className="admin-stat-card">
            <div className="stat-label">{stat.label}</div>
            <div className="stat-value">{stat.value}</div>
          </div>
        ))}
      </section>

      <section className="admin-grid">
        <div className="admin-card admin-card--wide">
          <div className="admin-card__header">
            <div>
              <h3>Όλες οι Αγγελίες</h3>
              <p>Σύνολο {properties.length} καταχωρήσεις από ιδιοκτήτες</p>
            </div>
          </div>
          <div className="admin-table admin-table--scroll">
            <div className="admin-table__head admin-table__head--properties">
              <span>Τίτλος</span>
              <span>Περιοχή</span>
              <span>Τιμή</span>
              <span>Ιδιοκτήτης</span>
            </div>
            {sortedProperties.map(property => (
              <div key={property.id} className="admin-table__row admin-table__row--properties">
                <div className="strong">{property.title}</div>
                <div>{property.area}</div>
                <div className="pill">{property.price}€</div>
                <div>{ownersById[property.ownerId]?.name || `#${property.ownerId}`}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="admin-card">
          <div className="admin-card__header">
            <div>
              <h3>Χρήστες</h3>
              <p>Όλοι οι ιδιοκτήτες και οι ενδιαφερόμενοι</p>
            </div>
          </div>
          <div className="admin-table admin-table--scroll">
            <div className="admin-table__head admin-table__head--users">
              <span>Όνομα</span>
              <span>Τύπος</span>
              <span>Επικοινωνία</span>
            </div>
            {sortedUsers.map(user => (
              <div key={user.id} className="admin-table__row admin-table__row--users">
                <div className="strong">{user.name}</div>
                <div className={`badge badge--${user.type}`}>
                  {user.type === 'owner' ? 'Ιδιοκτήτης' : 'Ενδιαφερόμενος'}
                </div>
                <div>
                  <div className="muted">{user.email}</div>
                  {user.phone && <div className="muted">+30 {user.phone}</div>}
                  {user.location && <div className="muted">{user.location}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="admin-card">
          <div className="admin-card__header">
            <div>
              <h3>Πρόσφατη Δραστηριότητα</h3>
              <p>Ειδοποιήσεις και matches του συστήματος</p>
            </div>
          </div>
          <div className="activity-list">
            {notifications.slice(0, 8).map(notification => (
              <div key={notification.id} className="activity-item">
                <div className="activity-title">{notification.message}</div>
                <div className="activity-meta">
                  <span>Χρήστης: {notification.userId}</span>
                  <span>Κατάσταση: {notification.read ? 'Αναγνωσμένο' : 'Νέο'}</span>
                </div>
              </div>
            ))}

            {matches.slice(0, 8).map(match => (
              <div key={match.id} className="activity-item activity-item--match">
                <div className="activity-title">Match #{match.id}</div>
                <div className="activity-meta">
                  <span>{match.users?.map(user => user.name).join(' & ')}</span>
                  {match.propertyId && <span>Αγγελία: {match.propertyId}</span>}
                </div>
              </div>
            ))}

            {!notifications.length && !matches.length && (
              <div className="muted">Δεν υπάρχουν ακόμη δραστηριότητες</div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
