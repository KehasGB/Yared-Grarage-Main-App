
const installService = require('../services/install.service');
async function install(req, res,next) {

let installMessage = await installService.install();
// const installMessage = await installService.install();

if (installMessage.status === 200) {
res.status(200).json({
message: installMessage
});
} else{
res.status(500).json({
message: installMessage
});
}
}
module.exports = {install};