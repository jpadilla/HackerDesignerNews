/**
 * `Audit` Plugin for Mongoose.
 *
 * @param {mongoose.Schema} schema -
 * @param {Object} options - some options
 * @api public
 */
function auditPlugin(schema, options) {

  // Add the fields to the schema
  schema.add({
    createdAt: {
      type: Date,
      'default': Date.now
    },
    updatedAt: {
      type: Date,
      'default': Date.now
    }
  });

  // Define the pre save hook
  schema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
  });

  // Create an index on all the paths
  schema.path('createdAt').index(true);
  schema.path('updatedAt').index(true);
}

/**
 * Expose `Audit` Plugin Library.
 */
module.exports = auditPlugin;