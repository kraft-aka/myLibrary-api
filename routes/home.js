const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
  res.status(200).send({ msg: 'Welcome to Homepage of a My Library API' });
})

module.exports = router;