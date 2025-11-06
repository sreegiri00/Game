const rolePrefixMap = {
  superadmin: 'ADM',
  admin: 'ADM',
  vendor: 'VEN',
  user: 'USE'
};

function generateUserId(role = 'user') {
  const prefix = rolePrefixMap[role.toLowerCase()] || 'USE';
  const year = new Date().getFullYear().toString().slice(-2); // e.g. "25"
  const random = Math.floor(100000 + Math.random() * 900000); // random 6-digit number
  return `${prefix}${year}${random}`;
}

module.exports = { generateUserId };
