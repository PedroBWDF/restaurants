'use strict';

const userData = require('../public/jsons/user.json').results //取得餐廳原始靜態資料
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    //把初始json檔資料展開，再一一放入createdAt和updatedAt屬性
    await queryInterface.bulkInsert('Users', userData.map(user => ({ ...user, createdAt: new Date(), updatedAt: new Date() })))
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
