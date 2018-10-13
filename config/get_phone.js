const phoneReg = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/gm;
module.exports = phone => {
  var found = phone.match(phoneReg);
  return found;
};
