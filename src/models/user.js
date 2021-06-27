const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcryptjs');

const UserSchema = new Schema({
  email: {type: String, required: true},
  password: {type: String, required: true},
  firstname: {type: String, required: false},
  lastname: {type: String, required: false},
  orders: {type: [String], required: false, default: undefined}
});

UserSchema.methods.encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

UserSchema.methods.validatePassword = function (password) {
  return bcrypt.compare(password, this.password);
}

module.exports = mongoose.model('User', UserSchema);
