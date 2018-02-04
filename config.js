module.exports = {
  DATABASE_URL: process.env.DATABASE_URL,
  TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || 'mongodb://admin:admin@ds223578.mlab.com:23578/production-test',
  PORT: process.env.PORT,
  SECRET: process.env.SECRET
}
