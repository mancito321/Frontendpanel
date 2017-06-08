var express = require('express');
var router = express.Router();

// ==== MAIN ====

router.get('/', function(req, res) {
  res.render('index.ejs')
});


module.exports = router;
