import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get current directory in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  try {
    let serviceAccount: admin.ServiceAccount;

    // Try to use environment variables first (for production)
    if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
      serviceAccount = {
        type: 'service_account',
        project_id: process.env.FIREBASE_PROJECT_ID,
        private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID || '',
        private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
        client_id: process.env.FIREBASE_CLIENT_ID || '',
        auth_uri: process.env.FIREBASE_AUTH_URI || 'https://accounts.google.com/o/oauth2/auth',
        token_uri: process.env.FIREBASE_TOKEN_URI || 'https://oauth2.googleapis.com/token',
        auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL || 'https://www.googleapis.com/oauth2/v1/certs',
        client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL || '',
      } as any as admin.ServiceAccount;
    } else {
      // Fall back to JSON file
      // In production (compiled), this will look in dist/config/serviceAccountKey.json
      // In development, this will look in src/config/serviceAccountKey.json
      const isProduction = process.env.NODE_ENV === 'production' || __dirname.includes('dist');
      let jsonPath: string;
      
      if (isProduction) {
        // In production, __dirname is dist/config, so serviceAccountKey.json is in the same directory
        jsonPath = join(__dirname, 'serviceAccountKey.json');
      } else {
        // In development, __dirname is src/config, so serviceAccountKey.json is in the same directory
        jsonPath = join(__dirname, 'serviceAccountKey.json');
      }
      
      const serviceAccountData = JSON.parse(readFileSync(jsonPath, 'utf8'));
      serviceAccount = serviceAccountData as admin.ServiceAccount;
    }

    // Extract project ID (can be project_id or projectId depending on source)
    const projectId = (serviceAccount as any).project_id || (serviceAccount as any).projectId || process.env.FIREBASE_PROJECT_ID;
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: projectId,
    });
    console.log('✅ Firebase Admin SDK initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing Firebase Admin SDK:', error);
    throw error;
  }
}

// Export Firebase Admin instance
export const db = admin.firestore();
export const auth: admin.auth.Auth = admin.auth();
export default admin;

