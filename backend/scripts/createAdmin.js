// Script để tạo admin user
// Chạy: node scripts/createAdmin.js YOUR_USER_UID

const { db } = require('../config/firebase');

async function createAdmin(userId) {
  if (!userId) {
    console.error('❌ Vui lòng cung cấp userId');
    console.log('Cách dùng: node scripts/createAdmin.js YOUR_USER_UID');
    console.log('\nĐể lấy userId:');
    console.log('1. Đăng ký/đăng nhập vào app');
    console.log('2. Mở Console browser (F12)');
    console.log('3. Gõ: localStorage');
    console.log('4. Tìm key có chứa "firebase:authUser"');
    console.log('5. Copy giá trị "uid"');
    process.exit(1);
  }

  try {
    console.log(`🔧 Setting admin role for user: ${userId}`);

    await db.collection('users').doc(userId).set({
      role: 'admin',
      createdAt: new Date().toISOString()
    }, { merge: true });

    console.log('✅ Admin role set successfully!');
    console.log('🎉 User is now an admin. Please refresh the app.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    process.exit(1);
  }
}

const userId = process.argv[2];
createAdmin(userId);