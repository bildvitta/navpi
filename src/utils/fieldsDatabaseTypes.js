const types = {
  boolean: 'boolean',
  checkbox: 'varchar',
  color: 'varchar',
  date: 'date',
  datetime: 'datetime',
  decimal: 'decimal',
  editor: 'text',
  money: 'decimal',
  number: 'int',
  percent: 'decimal',
  radio: 'varchar',
  select: 'varchar',
  text: 'varchar',
  textarea: 'text',
  time: 'varchar',
  upload: 'varchar',
  email: 'varchar'
}

/**
 * Function that returns a field type based database type.
 * 
 * @param {string} fieldType Field type.
 * @returns {string} Database type.
 */
function getDatabaseTypeByField (fieldType) {
  return types[fieldType]
}

module.exports = {
  types,

  getDatabaseTypeByField
}
