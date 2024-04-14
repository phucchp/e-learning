'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('languages', [
      { language_name: 'English', code: 'en', created_at: new Date(), updated_at: new Date() },
      { language_name: 'Spanish', code: 'es', created_at: new Date(), updated_at: new Date() },
      { language_name: 'Chinese', code: 'zh', created_at: new Date(), updated_at: new Date() },
      { language_name: 'Hindi', code: 'hi', created_at: new Date(), updated_at:  new Date() },
      { language_name: 'Arabic', code: 'ar', created_at: new Date(), updated_at: new Date() },
      { language_name: 'Portuguese', code: 'pt', created_at: new Date(), updated_at: new Date() },
      { language_name: 'Bengali', code: 'bn', created_at: new Date(), updated_at: new Date() },
      { language_name: 'Russian', code: 'ru', created_at: new Date(), updated_at: new Date() },
      { language_name: 'Japanese', code: 'ja', created_at: new Date(), updated_at: new Date() },
      { language_name: 'Punjabi', code: 'pa', created_at: new Date(), updated_at: new Date() },
      { language_name: 'German', code: 'de', created_at: new Date(), updated_at: new Date() },
      { language_name: 'Javanese', code: 'jv', created_at: new Date(), updated_at: new Date() },
      { language_name: 'Wu Chinese', code: 'wuu', created_at: new Date(), updated_at: new Date() },
      { language_name: 'Telugu', code: 'te', created_at: new Date(), updated_at: new Date() },
      { language_name: 'Vietnamese', code: 'vi', created_at: new Date(), updated_at: new Date() },
      { language_name: 'Marathi', code: 'mr', created_at: new Date(), updated_at: new Date() },
      { language_name: 'French', code: 'fr', created_at: new Date(), updated_at: new Date() },
      { language_name: 'Korean', code: 'ko', created_at: new Date(), updated_at: new Date() },
      { language_name: 'Tamil', code: 'ta', created_at: new Date(), updated_at: new Date() },
      { language_name: 'Urdu', code: 'ur', created_at: new Date(), updated_at: new Date() },
      // Add more language entries here
      { language_name: 'Italian', code: 'it', created_at: new Date(), updated_at: new Date() },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('languages', null, {});
  }
};
