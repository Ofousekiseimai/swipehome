# SwipeHome

Εφαρμογή τύπου «Tinder για ακίνητα» σε React. Οι χρήστες εγγράφονται/συνδέονται ως ενοικιαστές (seekers) ή ιδιοκτήτες (owners), κάνουν swipe σε ακίνητα ή προφίλ ενδιαφερόμενων, δημιουργούν matches και συνομιλούν μέσω ενσωματωμένου chat. Τα δεδομένα είναι mock/in-memory και αποθηκεύονται σε `localStorage`.

## Τι προσφέρει
- **Feed με swipe**: Οι ενοικιαστές βλέπουν κάρτες ακινήτων, οι ιδιοκτήτες κάρτες ενδιαφερομένων (`src/components/Home.js`).
- **Matches & ειδοποιήσεις**: Κάθε “right swipe” δημιουργεί match, εμφανίζει popup και δημιουργεί ειδοποίηση (`src/context/MatchContext.js`).
- **Chat ανά match**: Πραγματικό chat per match με σήμανση ειδοποιήσεων ως αναγνωσμένων (`src/components/ChatScreen.js`).
- **Προφίλ & αγαπημένα**: Διακριτές σελίδες προφίλ για seekers/owners και λίστα αγαπημένων ακινήτων για seekers (`src/components/SeekerProfile.js`, `src/components/OwnerProfile.js`).
- **Mock backend**: In-memory API client που σπέρνει δεδομένα από `src/data/dummyData.js` σε `localStorage` (`src/services/api/mockClient.js`).

## Προαπαιτούμενα
- Node.js 18+ και npm

## Τοπική εκτέλεση (development)
```bash
npm install
npm start
```
- Ανοίγει στο http://localhost:3000.
- Τα mock δεδομένα (χρήστες/ακίνητα) σπέρνονται αυτόματα στο `localStorage`.

## Χρήσιμα δοκιμαστικά credentials
- Seeker: `admin@example.com` / `admin`
- Owner: `dimitris@example.com` / `123`

## Mock reset
- Το mock API σπέρνει δεδομένα σε `localStorage` και πλέον ελέγχει “έκδοση” (`2025-02-08-50props`). Όταν αυτή αλλάζει, τα mocks ξαναγράφονται αυτόματα (properties, owners, seekers, matches, messages, notifications). Δεν χρειάζεται χειροκίνητο καθάρισμα.

## Άλλα scripts
- `npm test` – jest/react-testing-library watcher
- `npm run build` – παραγωγικό build στο `build/`
