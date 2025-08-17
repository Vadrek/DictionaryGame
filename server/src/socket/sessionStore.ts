import cron from 'node-cron';

class SessionStore {
  public sessions: Map<string, any>;

  constructor() {
    this.sessions = new Map();
    cron.schedule('0 0 * * *', () => {
      console.log('cleaning all sessions every day at midnight');
      this.cleanAllSessions();
    });
  }

  findSession(id) {
    return this.sessions.get(id);
  }

  saveSession(id, session) {
    this.sessions.set(id, session);
  }

  findAllSessions() {
    return [...this.sessions.values()];
  }

  restartGameSession() {
    for (const [key, value] of this.sessions.entries()) {
      this.sessions.set(key, {
        ...value,
        definitionIdWritten: '',
        definitionIdChosen: '',
      });
    }
  }

  cleanAllSessions() {
    this.sessions.clear();
  }
}

export const sessionStore = new SessionStore();
