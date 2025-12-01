import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

function LoginSignup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [userType, setUserType] = useState(null);
  const [step, setStep] = useState(1); // 1 = login, 2 = user type, 3 = signup
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [authMode, setAuthMode] = useState('user'); // user | admin
  const navigate = useNavigate();
  const { currentUser, login, error: authError } = useAuth();

  // Redirect if user is logged in
  useEffect(() => {
    if (currentUser) {
      if (currentUser.type === 'admin') {
        navigate('/admin');
      } else {
        navigate('/home');
      }
    }
    setLoading(false);
  }, [currentUser, navigate]);

  useEffect(() => {
    if (authError) {
      setError(authError);
    }
  }, [authError]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    const allowedTypes = authMode === 'admin' ? ['admin'] : ['seeker', 'owner'];
    const user = await login(email, password, allowedTypes);

    if (user) {
      navigate(user.type === 'admin' ? '/admin' : '/home');
    } else if (authMode === 'admin') {
      setError('Δεν βρέθηκε λογαριασμός διαχειριστή με αυτά τα στοιχεία');
    } else {
      setError('Λάθος email ή κωδικός πρόσβασης');
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    if (!userType) {
      setError('Επιλέξτε τύπο χρήστη');
      return;
    }

    try {
      const payload = {
        name,
        email,
        password,
        type: userType,
        createdAt: new Date().toISOString(),
        profileCompleted: false,
        ...(userType === 'seeker'
          ? {
              age: null,
              profession: '',
              location: '',
              hasChildren: false,
              hasPets: false,
              petsType: '',
              hobbies: '',
              workHours: '',
              additionalInfo: '',
              desiredSize: null,
              maxBudget: null,
              preferredLocation: '',
            }
          : {
              phone: '',
              bio: '',
            }),
      };

      await api.createUser(payload);
      await login(email, password, ['seeker', 'owner']);
      navigate('/home');
    } catch (signupError) {
      setError(signupError.message || 'Αποτυχία εγγραφής');
    }
  };

  if (loading) {
    return <div className="loading">Φόρτωση...</div>;
  }

  let cardContent = null;

  if (step === 1) {
    cardContent = (
      <>
        <h2>{authMode === 'admin' ? 'Σύνδεση Διαχειριστή' : 'Σύνδεση'}</h2>

        <div className="auth-mode-toggle">
          <button
            className={authMode === 'user' ? 'active' : ''}
            onClick={() => setAuthMode('user')}
            type="button"
          >
            Χρήστες
          </button>
          <button
            className={authMode === 'admin' ? 'active' : ''}
            onClick={() => {
              setAuthMode('admin');
              setStep(1);
            }}
            type="button"
          >
            Admin
          </button>
        </div>

        {error && <p className="error">{error}</p>}

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Κωδικός πρόσβασης"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Σύνδεση</button>
        </form>

        {authMode === 'user' && (
          <div className="signup-prompt">
            <p>Δεν έχετε λογαριασμό;</p>
            <button onClick={() => setStep(2)}>Εγγραφή</button>
          </div>
        )}
      </>
    );
  } else if (step === 2) {
    cardContent = (
      <>
        <h2>Επιλέξτε τον τύπο χρήστη</h2>
        <div className="user-type-selection">
          <button
            className="user-type-btn"
            onClick={() => {
              setUserType('seeker');
              setStep(3);
            }}
          >
            <div className="icon">🏠</div>
            <h3>Ψάχνω Σπίτι</h3>
            <p>Είμαι ενδιαφερόμενος για ενοικίαση ή αγορά ακινήτου</p>
          </button>

          <button
            className="user-type-btn"
            onClick={() => {
              setUserType('owner');
              setStep(3);
            }}
          >
            <div className="icon">🔑</div>
            <h3>Ενοικιάζω Σπίτι</h3>
            <p>Έχω ακίνητο προς ενοικίαση ή πώληση</p>
          </button>
        </div>

        <button className="back-button" onClick={() => setStep(1)}>
          Πίσω
        </button>
      </>
    );
  } else if (step === 3) {
    cardContent = (
      <>
        <h2>Εγγραφή ως {userType === 'seeker' ? 'Ψάχνω Σπίτι' : 'Ενοικιάζω Σπίτι'}</h2>

        {error && <p className="error">{error}</p>}

        <form onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="Όνομα"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Κωδικός πρόσβασης"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Δημιουργία Λογαριασμού</button>
        </form>

        <button className="back-button" onClick={() => setStep(2)}>
          Πίσω
        </button>
      </>
    );
  }

  return (
    <div className="auth-shell">
      <div className="auth-card login-container">
        {cardContent}
      </div>
    </div>
  );
}

export default LoginSignup;
