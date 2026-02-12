import alasql from 'alasql';
import { Listing, User } from '../types';

// Initialize the SQL Database
export const initDB = async (): Promise<void> => {
  console.log("Initializing SQL Database Engine...");
  
  // 1. Define Schema (SQL)
  // We use standard SQL syntax to define our tables
  alasql(`
    CREATE TABLE IF NOT EXISTS users (
      email STRING PRIMARY KEY, 
      passwordHash STRING, 
      name STRING
    )
  `);
  
  alasql(`
    CREATE TABLE IF NOT EXISTS listings (
      id STRING PRIMARY KEY, 
      title STRING, 
      price NUMBER, 
      location STRING, 
      date STRING, 
      imageUrl STRING, 
      category STRING, 
      description STRING, 
      sellerName STRING, 
      isPro BOOLEAN
    )
  `);

  // 2. Load Data (Persistence simulation)
  // Since we are in a browser, we load the "database file" from localStorage
  try {
      const storedUsers = localStorage.getItem('lbc_sql_users');
      if (storedUsers) {
        const users = JSON.parse(storedUsers);
        if (Array.isArray(users) && users.length > 0) {
            // Bulk insert using SQL
            alasql('INSERT INTO users SELECT * FROM ?', [users]);
        }
      }

      const storedListings = localStorage.getItem('lbc_sql_listings');
      if (storedListings) {
        const listings = JSON.parse(storedListings);
        if (Array.isArray(listings) && listings.length > 0) {
            alasql('INSERT INTO listings SELECT * FROM ?', [listings]);
        }
      }
  } catch (e) {
      console.error("Error loading SQL dump", e);
  }
};

// Helper to persist the database state
const persistDB = () => {
    // Select all data using SQL
    const users = alasql('SELECT * FROM users');
    const listings = alasql('SELECT * FROM listings');
    
    // Save to disk (localStorage)
    localStorage.setItem('lbc_sql_users', JSON.stringify(users));
    localStorage.setItem('lbc_sql_listings', JSON.stringify(listings));
};

export const saveListingToDB = async (listing: Listing): Promise<void> => {
  // SQL Insert
  // We use SELECT * FROM ? to safely map the object properties to columns
  alasql('INSERT INTO listings SELECT * FROM ?', [[listing]]);
  persistDB();
};

export const getListingsFromDB = async (): Promise<Listing[]> => {
  // SQL Select
  const results = alasql('SELECT * FROM listings');
  // Return reversed to show newest first
  return results.reverse();
};

export const saveUserToDB = async (user: User): Promise<void> => {
  // SQL Insert
  alasql('INSERT INTO users SELECT * FROM ?', [[user]]);
  persistDB();
};

export const getUserFromDB = async (email: string): Promise<User | undefined> => {
  // SQL Select with WHERE clause
  const results = alasql('SELECT * FROM users WHERE email = ?', [email]);
  return results.length > 0 ? results[0] : undefined;
};

// Debug helper to run raw SQL from console if needed
(window as any).runSQL = (query: string) => {
    return alasql(query);
};
