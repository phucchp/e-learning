'use strict';
const { faker } = require('@faker-js/faker');

const generateRandomPaymentDetail = (existingPairs) => {
  let paymentId, courseId;
  do {
    paymentId = faker.number.int({ min: 1, max: 500 });
    courseId = faker.number.int({ min: 1, max: 100 });
  } while (existingPairs.has(`${paymentId}-${courseId}`));

  existingPairs.add(`${paymentId}-${courseId}`);

  return {
    payment_id: paymentId,
    course_id: courseId,
    price: faker.number.float({ min: 0, max: 300 }),
    discount: faker.number.int({ min: 0, max: 50 }),
    created_at: new Date(),
    updated_at: new Date(),
  };
};

const generateUniquePaymentDetails = () => {
  const existingPairs = new Set();
  return [...Array(1500)].map(() => generateRandomPaymentDetail(existingPairs));
};

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const paymentDetails = generateUniquePaymentDetails();
    await queryInterface.bulkInsert('payment_details', paymentDetails, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('payment_details', null, {});
  }
};

// 'use strict';
// const { faker } = require('@faker-js/faker');

// const generateUniquePaymentDetails = () => {
//   const paymentIds = Array.from({ length: 1000 }, (_, index) => index + 1);
//   const courseIds = Array.from({ length: 100 }, (_, index) => index + 1);

//   // Generate all possible combinations of payment_id and course_id
//   const allCombinations = paymentIds.flatMap(paymentId =>
//     courseIds.map(courseId => ({ payment_id: paymentId, course_id: courseId }))
//   );

//   // Shuffle the combinations randomly
//   for (let i = allCombinations.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [allCombinations[i], allCombinations[j]] = [allCombinations[j], allCombinations[i]];
//   }

//   // Take the first 1500 combinations
//   const selectedCombinations = allCombinations.slice(0, 1500);

//   // Assign other random values to each combination
//   const paymentDetails = selectedCombinations.map(combination => ({
//     ...combination,
//     price: faker.number.float({ min: 0, max: 300 }),
//     discount: faker.number.int({ min: 0, max: 50 }),
//     created_at: new Date(),
//     updated_at: new Date(),
//   }));

//   return paymentDetails;
// };

// /** @type {import('sequelize-cli').Migration} */
// module.exports = {
//   async up(queryInterface, Sequelize) {
//     const paymentDetails = generateUniquePaymentDetails();
//     await queryInterface.bulkInsert('payment_details', paymentDetails, {});
//   },

//   async down(queryInterface, Sequelize) {
//     await queryInterface.bulkDelete('payment_details', null, {});
//   }
// };
