let conn = require("../config/db.config");
let fs = require('fs');
async function install() {
  let queryfile = __dirname + '/sql/initial-query.sql';
  // console.log(queryfile);
  let queries = [];
  let finalMessage = {};
  let templine = '';
  const lines = await fs.readFileSync(queryfile,'utf-8').split('\n');
// const fileContent = fs.readFileSync(queryfile, 'utf-8');
// const lines = fileContent.split('\n');

  let executed = await new Promise((resolve, reject) => {
    lines.forEach((line) => {
      if (line.trim().startsWith('--') || line.trim() === '') {
        return;
      }
      templine += line;
      if (line.trim().endsWith(';')) {
        let sqlQuery = templine.trim();
        queries.push(sqlQuery);
        templine = '';
      }
    });
    resolve("Queries are added to the list");
  });
  for (let i = 0; i < queries.length; i++) {
    try {
      let result = await conn.query(queries[i]);
      console.log("Table created");
    } catch (err) {
      finalMessage.message = "Not all tables are created";
      console.log(finalMessage.message);
    }
  }
  if (!finalMessage.message) {
    finalMessage.message = "All tables are created";
    finalMessage.status = 200;
  } else {
    finalMessage.status = 500;
  }
  return finalMessage;
}
module.exports = { install };
