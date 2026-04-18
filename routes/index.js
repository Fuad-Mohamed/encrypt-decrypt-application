const express = require('express');
const crypto  = require('crypto');
const router  = express.Router();

const ALGORITHM = 'aes-128-cbc';
const KEY_BYTES = 16;
const IV_BYTES  = 16;

function encrypt(plaintext) {
  const keyBuf = crypto.randomBytes(KEY_BYTES);
  const iv     = crypto.randomBytes(IV_BYTES);
  const cipher = crypto.createCipheriv(ALGORITHM, keyBuf, iv);
  let enc      = cipher.update(plaintext, 'utf8', 'hex');
  enc         += cipher.final('hex');
  return { ciphertext: enc, iv: iv.toString('hex'), key: keyBuf.toString('hex') };
}

function decrypt(ciphertextHex, keyHex, ivHex) {
  const key = Buffer.from(keyHex, 'hex');
  const iv  = Buffer.from(ivHex, 'hex');
  if (key.length !== KEY_BYTES) throw new Error('Key must be exactly 32 hex chars (16 bytes).');
  if (iv.length  !== IV_BYTES)  throw new Error('IV must be exactly 32 hex chars (16 bytes).');
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  let dec        = decipher.update(ciphertextHex, 'hex', 'utf8');
  dec           += decipher.final('utf8');
  return dec;
}

router.get('/', (req, res) => {
  res.render('index', { encryptResult: null, decryptResult: null, encryptError: null, decryptError: null });
});

router.post('/encrypt', (req, res) => {
  const { plaintext } = req.body;
  if (!plaintext || !plaintext.trim()) {
    return res.render('index', { encryptResult: null, decryptResult: null, encryptError: 'Please enter some text to encrypt.', decryptError: null });
  }
  try {
    const result = encrypt(plaintext.trim());
    res.render('index', { encryptResult: result, decryptResult: null, encryptError: null, decryptError: null });
  } catch (err) {
    res.render('index', { encryptResult: null, decryptResult: null, encryptError: err.message, decryptError: null });
  }
});

router.post('/decrypt', (req, res) => {
  const { ciphertext, key, iv } = req.body;
  if (!ciphertext || !key || !iv) {
    return res.render('index', { encryptResult: null, decryptResult: null, encryptError: null, decryptError: 'Ciphertext, Key, and IV are all required.' });
  }
  try {
    const plaintext = decrypt(ciphertext.trim(), key.trim(), iv.trim());
    res.render('index', { encryptResult: null, decryptResult: { plaintext, ciphertext: ciphertext.trim() }, encryptError: null, decryptError: null });
  } catch (err) {
    res.render('index', { encryptResult: null, decryptResult: null, encryptError: null, decryptError: 'Decryption failed — check your key, IV, and ciphertext.' });
  }
});

module.exports = router;
