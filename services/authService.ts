import { User } from '../types';
import { getUserFromDB, saveUserToDB } from './db';

// Simple "hash" for demo purposes - DO NOT USE IN PRODUCTION
const simpleHash = (pwd: string) => btoa(pwd);

export const loginUser = async (email: string, password: string): Promise<User> => {
  const user = await getUserFromDB(email);
  if (!user) {
    throw new Error("Utilisateur non trouvé");
  }
  if (user.passwordHash !== simpleHash(password)) {
    throw new Error("Mot de passe incorrect");
  }
  return user;
};

export const registerUser = async (email: string, password: string, name: string): Promise<User> => {
  const existingUser = await getUserFromDB(email);
  if (existingUser) {
    throw new Error("Cet email est déjà utilisé");
  }

  const newUser: User = {
    email,
    passwordHash: simpleHash(password),
    name
  };

  await saveUserToDB(newUser);
  return newUser;
};
