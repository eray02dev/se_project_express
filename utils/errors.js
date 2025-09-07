// utils/errors.js
const BAD_REQUEST = 400; // Geçersiz veri / geçersiz ObjectId
const UNAUTHORIZED = 401; // Login / token hatası
const FORBIDDEN = 403; // Yetkisiz işlem (başkasının item'ını silme)
const NOT_FOUND = 404; // Kayıt yok / olmayan route
const CONFLICT = 409; // Duplicate email
const INTERNAL_SERVER_ERROR = 500; // Varsayılan (beklenmeyen) hata

module.exports = {
  BAD_REQUEST,
  UNAUTHORIZED,
  FORBIDDEN,
  NOT_FOUND,
  CONFLICT,
  INTERNAL_SERVER_ERROR,
};
