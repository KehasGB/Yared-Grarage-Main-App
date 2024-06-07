let mysql = require("mysql2/promise");

let dbConfig = {
	connectionLimit: 10,
	// socketPath: process.env.DB_SOCKET_PATH,
	password: process.env.DB_PASS,
	user: process.env.DB_USER,
	host: process.env.DB_HOST,
	database: process.env.DB_NAME,
	
};
let pool = mysql.createPool(dbConfig);
async function query(sql, params) {
	let [rows, fields] = await pool.execute(sql, params);
	return rows;
}
module.exports = { query };
