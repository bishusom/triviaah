export interface GuestSession {
  isGuest: boolean;
  id: string;
  created_at: string;
  username?: string;
}

export class GuestSessionManager {
  private guestId: string;
  private storageKey = 'triviaah_guest_id';
  private createdAtKey = 'triviaah_guest_created_at';
  private usernameKey = 'triviaah_guest_username';

  constructor() {
    this.guestId = this.getOrCreateGuestId();
  }

  private getOrCreateGuestId(): string {
    if (typeof window === 'undefined') return '';

    let guestId = localStorage.getItem(this.storageKey);
    if (!guestId) {
      guestId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem(this.storageKey, guestId);
      localStorage.setItem(this.createdAtKey, new Date().toISOString());
    }
    return guestId;
  }

  getSession(): GuestSession {
    const createdAt = typeof window !== 'undefined' 
      ? localStorage.getItem(this.createdAtKey) || new Date().toISOString()
      : new Date().toISOString();
    
    const username = typeof window !== 'undefined'
      ? localStorage.getItem(this.usernameKey) || `Guest${this.guestId.slice(-4)}`
      : `Guest${this.guestId.slice(-4)}`;

    return {
      isGuest: true,
      id: this.guestId,
      created_at: createdAt,
      username
    };
  }

  setUsername(username: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.usernameKey, username);
    }
  }

  clear(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.storageKey);
      localStorage.removeItem(this.createdAtKey);
      localStorage.removeItem(this.usernameKey);
    }
  }

  migrateToUser(userId: string): void {
    // Optional: Migrate guest data to user account
    console.log(`Migrating guest session ${this.guestId} to user ${userId}`);
    this.clear();
  }
}