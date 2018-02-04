module.exports = {
  DATABASE_URL: process.env.DATABASE_URL || 'mongodb://admin:admin@ds123258.mlab.com:23258/production-journal',
  TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || 'mongodb://admin:admin@ds223578.mlab.com:23578/production-test',
  PORT: process.env.PORT || 8080,
  SECRET: process.env.SECRET || 'this'
}
