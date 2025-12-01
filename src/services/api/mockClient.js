/*
 * Lightweight in-memory/mock API client.
 * Simulates async network calls while the backend is under development.
 */
import { owners, seekers, properties, admins } from '../../data/dummyData';

const STORAGE_KEYS = {
  properties: 'swipehome.mock.properties',
  matches: 'swipehome.mock.matches',
  messages: 'swipehome.mock.messages',
  notifications: 'swipehome.mock.notifications',
  seekers: 'swipehome.mock.seekers',
  owners: 'swipehome.mock.owners',
  admins: 'swipehome.mock.admins',
  version: 'swipehome.mock.version',
};

// Bump this string whenever dummyData changes, to force re-seed.
const DATA_VERSION = '2025-02-08-50props-v4-admins';

const readStore = (key, fallback) => {
  if (typeof window === 'undefined') {
    return fallback;
  }

  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    console.warn('Failed to read mock storage', error);
    return fallback;
  }
};

const writeStore = (key, value) => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn('Failed to persist mock storage', error);
  }
};

const ensureSeeded = () => {
  const currentVersion = readStore(STORAGE_KEYS.version, null);
  const needsReseed = currentVersion !== DATA_VERSION;

  if (needsReseed) {
    // Overwrite everything so new dummyData is always used.
    writeStore(STORAGE_KEYS.properties, properties);
    writeStore(STORAGE_KEYS.matches, []);
    writeStore(STORAGE_KEYS.messages, {});
    writeStore(STORAGE_KEYS.notifications, []);
    writeStore(STORAGE_KEYS.version, DATA_VERSION);
  }

  ensureUsersSeeded(needsReseed);
};

const ensureUsersSeeded = (force = false) => {
  const seededSeekers = readStore(STORAGE_KEYS.seekers, null);
  const seededOwners = readStore(STORAGE_KEYS.owners, null);
  const seededAdmins = readStore(STORAGE_KEYS.admins, null);

  if (force || !seededSeekers) {
    writeStore(STORAGE_KEYS.seekers, seekers);
  }

  if (force || !seededOwners) {
    writeStore(STORAGE_KEYS.owners, owners);
  }

  if (force || !seededAdmins) {
    writeStore(STORAGE_KEYS.admins, admins);
  }
};

const wait = (ms = 250) => new Promise(resolve => setTimeout(resolve, ms));

const createId = () => Date.now();

export const mockClient = {
  async login({ email, password }) {
    await wait();
    ensureUsersSeeded();

    const storedOwners = readStore(STORAGE_KEYS.owners, owners);
    const storedSeekers = readStore(STORAGE_KEYS.seekers, seekers);
    const storedAdmins = readStore(STORAGE_KEYS.admins, admins);
    const allUsers = [...storedOwners, ...storedSeekers, ...storedAdmins];
    const match = allUsers.find(user => user.email === email && user.password === password);

    if (!match) {
      throw new Error('Invalid credentials');
    }

    const { password: _password, ...safeUser } = match;
    return safeUser;
  },

  async getProperties() {
    ensureSeeded();
    await wait();
    return readStore(STORAGE_KEYS.properties, properties);
  },

  async getPropertyById(propertyId) {
    const list = await this.getProperties();
    return list.find(item => item.id === Number(propertyId)) || null;
  },

  async createProperty(payload) {
    ensureSeeded();
    await wait();

    const list = readStore(STORAGE_KEYS.properties, properties);
    const newProperty = {
      id: createId(),
      images: [],
      features: [],
      ...payload,
    };

    writeStore(STORAGE_KEYS.properties, [newProperty, ...list]);
    return newProperty;
  },

  async updateProperty(propertyId, updates) {
    ensureSeeded();
    await wait();

    const list = readStore(STORAGE_KEYS.properties, properties);
    const next = list.map(item =>
      item.id === Number(propertyId) ? { ...item, ...updates } : item
    );

    writeStore(STORAGE_KEYS.properties, next);

    return next.find(item => item.id === Number(propertyId)) || null;
  },

  async getOwners() {
    await wait();
    ensureUsersSeeded();
    return readStore(STORAGE_KEYS.owners, owners);
  },

  async getOwnerById(ownerId) {
    await wait();
    ensureUsersSeeded();
    return readStore(STORAGE_KEYS.owners, owners).find(owner => owner.id === Number(ownerId)) || null;
  },

  async getSeekers() {
    await wait();
    ensureUsersSeeded();
    return readStore(STORAGE_KEYS.seekers, seekers);
  },

  async getSeekerById(seekerId) {
    await wait();
    ensureUsersSeeded();
    return readStore(STORAGE_KEYS.seekers, seekers).find(seeker => seeker.id === Number(seekerId)) || null;
  },

  async getAdmins() {
    await wait();
    ensureUsersSeeded();
    return readStore(STORAGE_KEYS.admins, admins);
  },

  async getAdminById(adminId) {
    await wait();
    ensureUsersSeeded();
    return readStore(STORAGE_KEYS.admins, admins).find(admin => admin.id === Number(adminId)) || null;
  },

  async createUser(payload) {
    await wait();
    ensureUsersSeeded();

    if (payload.type === 'admin') {
      throw new Error('Δεν υποστηρίζεται δημιουργία διαχειριστή από το UI');
    }

    const targetKey = payload.type === 'owner' ? STORAGE_KEYS.owners : STORAGE_KEYS.seekers;
    const baseData = payload.type === 'owner' ? owners : seekers;
    const currentList = readStore(targetKey, baseData);
    const emailExists = currentList.some(user => user.email === payload.email);

    if (emailExists) {
      throw new Error('Το email χρησιμοποιείται ήδη');
    }

    const newUser = {
      id: createId(),
      ...payload,
    };

    writeStore(targetKey, [newUser, ...currentList]);
    return newUser;
  },

  async getMatches() {
    await wait();
    return readStore(STORAGE_KEYS.matches, []);
  },

  async createMatch(payload) {
    await wait();
    const matches = readStore(STORAGE_KEYS.matches, []);
    const match = { id: createId(), createdAt: new Date().toISOString(), ...payload };
    writeStore(STORAGE_KEYS.matches, [match, ...matches]);
    return match;
  },

  async getMessages(matchId) {
    await wait();
    const store = readStore(STORAGE_KEYS.messages, {});
    return store[matchId] || [];
  },

  async appendMessage(matchId, message) {
    await wait();
    const store = readStore(STORAGE_KEYS.messages, {});
    const nextMessage = {
      id: createId(),
      sentAt: new Date().toISOString(),
      ...message,
    };

    const nextStore = {
      ...store,
      [matchId]: [...(store[matchId] || []), nextMessage],
    };

    writeStore(STORAGE_KEYS.messages, nextStore);
    return nextMessage;
  },

  async getNotifications(userId = null) {
    await wait();
    const notifications = readStore(STORAGE_KEYS.notifications, []);
    if (!userId) {
      return notifications;
    }
    return notifications.filter(notification => notification.userId === userId);
  },

  async appendNotification(payload) {
    await wait();
    const notifications = readStore(STORAGE_KEYS.notifications, []);
    const notification = {
      id: createId(),
      createdAt: new Date().toISOString(),
      read: false,
      ...payload,
    };

    writeStore(STORAGE_KEYS.notifications, [notification, ...notifications]);
    return notification;
  },

  async markNotificationRead(notificationId) {
    await wait();
    const notifications = readStore(STORAGE_KEYS.notifications, []);
    const next = notifications.map(notification =>
      notification.id === notificationId
        ? { ...notification, read: true, readAt: new Date().toISOString() }
        : notification
    );

    writeStore(STORAGE_KEYS.notifications, next);
    return next.find(notification => notification.id === notificationId) || null;
  },
};
