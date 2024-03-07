'use strict';
const { faker } = require('@faker-js/faker');

const generateRandomPaymentDetail = () => ({
  payment_id: faker.number.int({ min: 1, max: 1000 }),
  course_id: faker.number.int({ min: 1, max: 100 }),
  price: faker.number.float({ min: 0, max: 300 }),
  discount: faker.number.int({ min: 0, max: 50 }),
  created_at: new Date(),
  updated_at: new Date(),
});
const paymentDetails = [...Array(1500)].map(() => generateRandomPaymentDetail());

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('payment_details', paymentDetails, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('payment_details', null, {});
  }
};
