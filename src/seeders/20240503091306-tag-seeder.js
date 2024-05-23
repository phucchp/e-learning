'use strict';

const tags = [
  { tag_id: 'android', name: 'android', created_at: new Date(), updated_at: new Date() },
  { tag_id: 'applicants', name: 'applicants' , created_at: new Date(), updated_at: new Date()},
  { tag_id: 'aws', name: 'aws' , created_at: new Date(), updated_at: new Date()},
  { tag_id: 'business', name: 'business' , created_at: new Date(), updated_at: new Date()},
  { tag_id: 'coding', name: 'coding' , created_at: new Date(), updated_at: new Date()},
  { tag_id: 'data-science', name: 'data-science' , created_at: new Date(), updated_at: new Date()},
  { tag_id: 'design', name: 'design' , created_at: new Date(), updated_at: new Date()},
  { tag_id: 'development', name: 'development' , created_at: new Date(), updated_at: new Date()},
  { tag_id: 'html', name: 'html' , created_at: new Date(), updated_at: new Date()},
  { tag_id: 'css', name: 'css' , created_at: new Date(), updated_at: new Date()},
  { tag_id: 'css3', name: 'css3' , created_at: new Date(), updated_at: new Date()},
  { tag_id: 'node', name: 'node' , created_at: new Date(), updated_at: new Date()},
  { tag_id: 'programming', name: 'programming' , created_at: new Date(), updated_at: new Date()},
  { tag_id: 'mysql', name: 'mysql' , created_at: new Date(), updated_at: new Date()},
  { tag_id: 'seo', name: 'seo' , created_at: new Date(), updated_at: new Date()},
  { tag_id: 'ai', name: 'ai' , created_at: new Date(), updated_at: new Date()},
  { tag_id: 'bootcamp', name: 'bootcamp' , created_at: new Date(), updated_at: new Date()},
  { tag_id: 'bootstrap', name: 'bootstrap' , created_at: new Date(), updated_at: new Date()},
  { tag_id: 'firebase', name: 'firebase' , created_at: new Date(), updated_at: new Date()},
  { tag_id: 'framework', name: 'framework' , created_at: new Date(), updated_at: new Date()},
  { tag_id: 'html5', name: 'html5' , created_at: new Date(), updated_at: new Date()},
  { tag_id: 'java', name: 'java' , created_at: new Date(), updated_at: new Date()},
  { tag_id: 'javascript', name: 'javascript' , created_at: new Date(), updated_at: new Date()},
  { tag_id: 'machine-learning', name: 'machine learning' , created_at: new Date(), updated_at: new Date()},
  { tag_id: 'postgresql', name: 'postgresql' , created_at: new Date(), updated_at: new Date()},
  { tag_id: 'mongoDB', name: 'mongoDB' , created_at: new Date(), updated_at: new Date()},
  { tag_id: 'nodejs', name: 'nodejs' , created_at: new Date(), updated_at: new Date()},
  { tag_id: 'php', name: 'php' , created_at: new Date(), updated_at: new Date()},
  { tag_id: 'redux', name: 'redux' , created_at: new Date(), updated_at: new Date()},
  { tag_id: 'unity', name: 'unity' , created_at: new Date(), updated_at: new Date()},
  { tag_id: 'web-applications', name: 'web applications' , created_at: new Date(), updated_at: new Date()},
  { tag_id: 'web-apps', name: 'web apps' , created_at: new Date(), updated_at: new Date()},
  { tag_id: 'website', name: 'website' , created_at: new Date(), updated_at: new Date()},
  { tag_id: 'developer', name: 'developer' , created_at: new Date(), updated_at: new Date()},
  { tag_id: 'wordpress', name: 'wordpress' , created_at: new Date(), updated_at: new Date()},
];


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('tags', tags, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('tags', null, {});
  }
};
