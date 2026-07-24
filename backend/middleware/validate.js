const Joi = require("joi");

const createMemberSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  age: Joi.number().integer().min(0).max(150).allow(null).optional(),
  gender: Joi.string().trim().lowercase().valid("male", "female", "other").required(),
  parent_id: Joi.number().integer().positive().allow(null).optional(),
  notes: Joi.string().allow(null, "").optional().strip()
}).unknown(false);

const updateMemberSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).optional(),
  age: Joi.number().integer().min(0).max(150).allow(null).optional(),
  gender: Joi.string().trim().lowercase().valid("male", "female", "other").optional(),
  parent_id: Joi.number().integer().positive().allow(null).optional(),
  notes: Joi.string().allow(null, "").optional().strip()
}).min(1).unknown(false);

const memberIdSchema = Joi.object({
  id: Joi.number().integer().positive().required()
});

const validate = (schema) => (req, res, next) => {
  const isParams = schema === memberIdSchema;
  const target = isParams ? req.params : req.body;
  const { value, error } = schema.validate(target || {}, {
    abortEarly: false,
    allowUnknown: false
  });

  if (error) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: error.details.map((detail) => detail.message)
    });
  }

  if (isParams) {
    req.params = value;
  } else {
    req.body = value;
  }
  next();
};

module.exports = {
  validate,
  createMemberSchema,
  updateMemberSchema,
  memberIdSchema
};
