'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('languages', [
      { language_name: 'English', created_at: new Date(), updated_at: new Date() },
      { language_name: 'Spanish', created_at: new Date(), updated_at: new Date() },
      { language_name: 'Mandarin Chinese', created_at: new Date(), updated_at: new Date() },
      { language_name: 'Hindi', created_at: new Date(), updated_at: new Date() },
      { language_name: 'Arabic', created_at: new Date(), updated_at: new Date() },
      { language_name: 'Portuguese', created_at: new Date(), updated_at: new Date() },
      { language_name: 'Bengali', created_at: new Date(), updated_at: new Date() },
      { language_name: 'Russian', created_at: new Date(), updated_at: new Date() },
      { language_name: 'Japanese', created_at: new Date(), updated_at: new Date() },
      { language_name: 'Punjabi', created_at: new Date(), updated_at: new Date() },
      { language_name: 'German', created_at: new Date(), updated_at: new Date() },
      { language_name: 'Javanese', created_at: new Date(), updated_at: new Date() },
      { language_name: 'Wu Chinese', created_at: new Date(), updated_at: new Date() },
      { language_name: 'Telugu', created_at: new Date(), updated_at: new Date() },
      { language_name: 'Vietnamese', created_at: new Date(), updated_at: new Date() },
      { language_name: 'Marathi', created_at: new Date(), updated_at: new Date() },
      { language_name: 'French', created_at: new Date(), updated_at: new Date() },
      { language_name: 'Korean', created_at: new Date(), updated_at: new Date() },
      { language_name: 'Tamil', created_at: new Date(), updated_at: new Date() },
      { language_name: 'Urdu', created_at: new Date(), updated_at: new Date() },
      // Add more language entries as needed
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('languages', null, {});
  }
};
