'use strict';
const { faker } = require('@faker-js/faker');

const generateRandomPayment = () => ({
  user_id: faker.number.int({ min: 1, max: 20 }),
  price: faker.number.float({ min: 0, max: 1000 }),
  transaction_id: faker.string.uuid(),
  status: 'Completed',
  payment_method: 'Paypal',
  order_infor: faker.lorem.sentences(1),
  is_payment: faker.datatype.boolean(),
  created_at: new Date(),
  updated_at: new Date(),
});
const payments = [...Array(1000)].map(() => generateRandomPayment());

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('payments', payments, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('payments', null, {});
  }
};
