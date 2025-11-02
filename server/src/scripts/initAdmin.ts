import { db } from '../config/db.js';
import bcrypt from 'bcryptjs';

const initAdmin = async () => {
  try {
    const username = 'admin';
    const password = 'admin';
    
    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Check if admin user already exists
    const adminRef = db.collection('users').where('username', '==', username);
    const snapshot = await adminRef.get();
    
    if (!snapshot.empty) {
      console.log('⚠️  Admin user already exists in Firestore');
      return;
    }
    
    // Create admin user document
    const adminUser = {
      username: username,
      password: hashedPassword,
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    await db.collection('users').add(adminUser);
    console.log('✅ Admin user created successfully in Firestore');
    console.log(`   Username: ${username}`);
    console.log(`   Password: ${password} (hashed)`);
    console.log(`   Role: admin`);
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    throw error;
  }
};

// Run the initialization
initAdmin()
  .then(() => {
    console.log('✅ Admin initialization complete');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Admin initialization failed:', error);
    process.exit(1);
  });

export default initAdmin;

