var express = require("express");
var router = express.Router();

const tgMiddleware = require("../../middlewares/tg");
var earn = require("../../controllers/Earn");

router.post("/upscore", tgMiddleware.tgauth_required, earn.upscore);

module.exports = router;