// utils/errors.js
const BAD_REQUEST = 400; // Geçersiz veri / geçersiz ObjectId
const NOT_FOUND = 404; // Kayıt yok / olmayan route
const INTERNAL_SERVER_ERROR = 500; // Varsayılan (beklenmeyen) hata

module.exports = {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
};
