'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // 定義哪些餐廳屬於哪位用戶
    const userRestaurantAssociations = [
      { name: 'Sababa 沙巴巴中東美食', userId: 1 },
      { name: '梅子鰻蒲燒專賣店', userId: 1 },
      { name: 'ZIGA ZIGA', userId: 1 },
      { name: '艾朋牛排餐酒館', userId: 2 },
      { name: 'Gusto Pizza', userId: 2 },
      { name: 'WXYZ Bar', userId: 2 },
    ];

    for (const association of userRestaurantAssociations) {
      await queryInterface.bulkUpdate('Restaurants',
        { userId: association.userId },
        { name: association.name }
      );
    }
  },

  async down (queryInterface, Sequelize) {
    // 移除所有餐廳的userId
    await queryInterface.bulkUpdate('Restaurants',
      { userId: null },
      {}
    )
  }
};

