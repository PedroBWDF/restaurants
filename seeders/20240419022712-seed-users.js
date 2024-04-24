'use strict';

const bcrypt = require('bcryptjs');
//取得user原始靜態資料(密碼hash之後這段沒使用到)
const userData = require('../data/jsons/user.json').results
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    const hash = await bcrypt.hash('12345678', 10)

    await queryInterface.bulkInsert('Users', [
      {
        id: 1,
        name: 'user1',
        email: 'user1@example.com',
        password: hash,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        name: 'user2',
        email: 'user2@example.com',
        password: hash,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ])

    // //把初始json檔資料展開，再一一放入createdAt和updatedAt屬性
    // await queryInterface.bulkInsert('Users', userData.map(user => ({ ...user, createdAt: new Date(), updatedAt: new Date() })))
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Users', null)
  }
};
