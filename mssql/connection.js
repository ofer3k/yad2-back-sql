const sql = require('mssql')
let pool;
const sqlConfig = {
  user: `${process.env.MS_USERNAME}`,
  password: `${process.env.MS_PASSWORD}`,
  database: `${process.env.MS_DATABASE}`,
  server: `${process.env.MS_SERVER}`,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  },
  options: {
    encrypt: true, // for azure
    trustServerCertificate: true // change to true for local dev / self-signed certs
  }
}
const connectToSQL = async () => {
  try {
   pool = await sql.connect(sqlConfig)
   console.log(`connected to MSsql1232`)
  } catch (err) {
   console.log(err)
  }
 }
 connectToSQL()

 const sqlQueryPromise = (q) => {
  return new Promise((resolve, reject) => {
    const request = new sql.Request();
    request.query(q, function (err, recordset) {
      if (err) reject(err);
      resolve(recordset);
    });
  });
};
module.exports = {sqlQueryPromise};