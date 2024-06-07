let express = require("express");

require("dotenv").config();
let sanitize = require("sanitize");
let cors = require("cors");
let corsOptions = {
	origin: [process.env.FRONTEND_URL, process.env.FRONTEND_URL2],
	optionsSuccessStatus: 200,
};
let port = process.env.PORT;
let router = require("./routes");
let app = express();
app.use(cors(corsOptions));
app.use(express.json());
app.use(sanitize.middleware);
app.use(router);

// Listen with SSL
// const https = require("https");
// const fs = require("fs");

// const options = {
// 	  key: fs.readFileSync("/etc/letsencrypt/live/kebegarage.com/privkey.pem"),
// 	  cert: fs.readFileSync("/etc/letsencrypt/live/kebegarage.com/fullchain.pem"),
// };

// const server = https.createServer(options, app);

// server.listen(port, () => {
// 	  console.log(`Server running on port: ${port}`);
// 	  });

// for local test without SSL
 app.listen(port, () => {
	 console.log(`Server running on port: ${port}`);
 });
module.exports = app;
