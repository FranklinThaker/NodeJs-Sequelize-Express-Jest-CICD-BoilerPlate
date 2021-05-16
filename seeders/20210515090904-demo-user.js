const crypto = require('crypto');
const uuid = require('uuid');

module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert('Users', [
    {
      id: uuid.v4(),
      name: 'Franklin Thaker',
      email: 'franklin873@live.com',
      role: 'user',
      password: crypto.createHash('md5').update('TesingPassword').digest('hex'),
      status: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ], {}),

  down: (queryInterface) => queryInterface.bulkDelete('Users', null, {}),
};
