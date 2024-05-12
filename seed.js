const { sequelize } = require('./models/index'); // Make sure to adjust this path
const { User } = require('./models'); // Importing the User model

async function seedUsers() {
  try {
    await sequelize.sync(); // Ensure your models are synced with the database

    const users = [
      {
        Username: 'Oskar   ',
        Email: 'john.doe@example.com',
        FirstName: 'John',
        LastName: 'Doe',
        Password: 'Password123',
        Role: 'teacher',
        ProfilePictureURL: 'http://example.com/path/to/picture.jpg'
      },
      {
        Username: 'Sebastian',
        Email: 'jane.doe@example.com',
        FirstName: 'Jane',
        LastName: 'Doe',
        Password: 'Password123',
        Role: 'student',
        ProfilePictureURL: 'http://example.com/path/to/picture.jpg'
      }
    ];

    for (let userData of users) {
      const userExists = await User.findOne({ where: { Email: userData.Email } });
      if (!userExists) {
        await User.create(userData);
        console.log(`User ${userData.Username} created successfully.`);
      } else {
        console.log(`User ${userData.Username} already exists.`);
      }
    }
  } catch (error) {
    console.error('Error seeding users:', error);
  }
}

seedUsers().then(() => {
  console.log('Seeding complete.');
  sequelize.close(); // Close the connection after seeding
}).catch(err => {
  console.error('Failed to seed users:', err);
  sequelize.close();
});