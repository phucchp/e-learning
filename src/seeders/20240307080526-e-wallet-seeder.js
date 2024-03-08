'use strict';
const { faker } = require('@faker-js/faker');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('e_wallets',[
        {
            userId:1,
            type: 'Paypal',
            email: 'elearning-user-1@gmail.com',
        },
        {
            userId:2,
            type: 'Paypal',
            email: 'elearning-user-2@gmail.com',
        },
        {
            userId:3,
            type: 'Paypal',
            email: 'elearning-user-3@gmail.com',
        },
        {
            userId:4,
            type: 'Paypal',
            email: 'elearning-user-4@gmail.com',
        },
        {
            userId:5,
            type: 'Paypal',
            email: 'elearning-user-5@gmail.com',
        },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('e_wallets', null, {});
  }
};
