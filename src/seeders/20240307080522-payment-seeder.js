'use strict';
const { faker } = require('@faker-js/faker');
const crypto = require('crypto');

const usedIds = new Set(); // Set để lưu trữ các ID đã sử dụng

function generateUniqueId() {
    let uniqueId;
    do {
        const timestamp = Date.now() % 100000; // Sử dụng 5 chữ số cuối của timestamp hiện tại
        const randomPart = Math.floor(Math.random() * 10000); // Tạo số ngẫu nhiên gồm 4 chữ số
        uniqueId = parseInt(`${timestamp}${randomPart}`, 10); // Kết hợp và chuyển đổi thành số nguyên
    } while (usedIds.has(uniqueId)); // Kiểm tra xem ID đã được sử dụng chưa

    usedIds.add(uniqueId); // Thêm ID vào danh sách đã sử dụng
    return uniqueId;
}


const generateRandomPayment = () => ({
  user_id: faker.number.int({ min: 1, max: 20 }),
  price: parseFloat(faker.number.float({ min: 0, max: 1000 }).toFixed(2)),
  transaction_id: generateUniqueId(),
  status: 'Completed',
  payment_method: 'Paypal',
  order_infor: faker.lorem.sentences(1),
  is_payment: faker.datatype.boolean(),
  created_at: new Date(),
  updated_at: new Date(),
});
const payments = [...Array(500)].map(() => generateRandomPayment());

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('payments', payments, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('payments', null, {});
  }
};
