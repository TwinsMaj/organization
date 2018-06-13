module.exports = {
  approot: process.env.NODE_PATH,
  
  db: {
    url: '',
    database: process.env.DB_DATABASE,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    dialect: process.env.DB_DIALECT
  }
};