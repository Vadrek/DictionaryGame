class SessionStore {
  public sessions: Map<string, any>;

  constructor() {
    this.sessions = new Map();
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
        definitionIdWritten: "",
        definitionIdChosen: "",
      });
    }
  }
}

export const sessionStore = new SessionStore();
