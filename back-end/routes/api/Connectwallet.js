var express = require("express");
var router = express.Router();

const tgMiddleware = require("../../middlewares/tg");
var Connectwallet = require("../../controllers/Connectwallet");

router.post("/connect", tgMiddleware.tgauth_required, Connectwallet.connect);

module.exports = router;