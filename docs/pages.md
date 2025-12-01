# SwipeHome Page Reference

| Route | Component | Περιγραφή | Κύρια δεδομένα |
| --- | --- | --- | --- |
| `/` | `LoginSignup` | Οθόνη onboarding με ροές σύνδεσης και εγγραφής (επιλογή ρόλου, δημιουργία λογαριασμού). | Auth API (`api.login`, `api.createUser`). |
| `/home` | `Home` | Κεντρική εμπειρία swipe. Οι `seekers` βλέπουν κάρτες ακινήτων, οι `owners` βλέπουν πιθανούς ενοικιαστές. | Listings (`api.getProperties`), Users (`api.getSeekers`, `api.getOwners`), Matches context. |
| `/list-property` | `PropertyForm` | Πολυβηματική φόρμα για ανάρτηση/ενημέρωση ακινήτου. | Μελλοντικά `api.createProperty`/`api.updateProperty` (σήμερα μόνο client-console). |
| `/profile/:id` | `SeekerProfile` / `OwnerProfile` (dynamic) | Προσωπικά dashboards ανά ρόλο: προτιμήσεις, αγαπημένα και listings. | Users (`api.getSeekerById`, `api.getOwnerById`), Listings (`api.getProperties`), Favorites context. |
| `/notifications` | `Notifications` | Κεντρική λίστα ειδοποιήσεων με δυνατότητα μαζικού mark-as-read. | Notifications store (`MatchContext`, `api.getNotifications`). |
| `/edit-profile` | `ProfileForm` | Επεξεργασία προφίλ χρήστη (placeholder UI). | Προβλέπει session user state. |
| `/create-profile/:id` | `CreateProfile` | Οδηγός αρχικοποίησης προφίλ μετά την εγγραφή. | Local form state, συνεδρία χρήστη. |
| `/chat/:matchId` | `ChatScreen` | Realtime συνομιλία για κάθε match, με αυτόματη σήμανση ειδοποιήσεων. | Matches/messages (`MatchContext`, `api.getMessages`, `api.appendMessage`). |

## Συμπληρωματικά Components
- `Header`: Πλοήγηση, ένδειξη ειδοποιήσεων, είσοδος στο προφίλ.
- `PropertyDetailsModal`: Popup λεπτομερειών ακινήτου που ενεργοποιείται από το `/home` για seekers.
- `MatchPopup`: Εμφανίζεται όταν δύο πλευρές κάνουν αμοιβαίο swipe.

Χρήσιμο κατά την εξέλιξη: ενημέρωσε το αρχείο όταν προστεθούν νέες σελίδες ή όταν οριστικά APIs αντικαταστήσουν τα mock endpoints.
