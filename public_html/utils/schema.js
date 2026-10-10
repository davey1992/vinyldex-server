const joi = require('joi');

const schemaEntry = joi.object({
  parentID: joi.number().integer().allow(null)
    .messages({
      'number.base': 'Invalid parentID: expected number(integer) format',
      'number.integer': 'Invalid parentID: expected an integer',
    }),
  userID: joi.number().integer().required()
    .messages({
      'any.required': 'Invalid userID: is a required field',
      'number.base': 'Invalid userID: expected number(integer) format',
      'number.integer': 'Invalid userID: expected an integer',
    }),
  mediaCondition: joi.number().integer().allow(null)
    .messages({
      'number.base': 'Invalid mediaCondition: expected number(integer) format',
      'number.integer': 'Invalid mediaCondition: expected an number',
    }),
  sleeveCondition: joi.number().integer().allow(null)
    .messages({
      'number.base': 'Invalid sleeveCondition: expected number(integer) format',
      'number.integer': 'Invalid sleeveCondition: expected an integer',
    }),
  title: joi.string().max(150).required()
    .messages({
      'any.required': 'Invalid title: field is required',
      'string.max': 'Invalid title: limit of 150 characters',
      'string.base': 'Invalid title: expected string format'
    }),
  artist: joi.string().max(150).allow(null)
    .messages({
      'string.max': 'Invalid artist: limit of 150 characters',
      'string.base': 'Invalid artist: expected string format'
    }),
  location: joi.string().max(150).allow(null)
    .messages({
      'string.max': 'Invalid location: limit of 150 characters',
      'string.base': 'Invalid location: expected string format'
    }),
  itemRef: joi.string().max(150).allow(null)
    .messages({
      'string.base': 'Invalid itemRef: expected string format',
      'string.max': 'Invalid itemRef: limit of 150 characters'
    }),
  personalRating: joi.number().integer().max(10).allow(null)
    .messages({
      'number.base': 'Invalid personalRating: expected number(integer)',
      'number.max': 'Invalid personalRating: rating can not exceed 10'
    }),
  bpm: joi.number().integer().max(9999).allow(null)
    .messages({
      'number.base': 'Invalid bpm: expected number(integer) format',
      'number.integer': 'Invalid bpm: expected an integer',
      'number.max': 'Invalid bpm: number must not exceed 9999'
    }),
  spinSpeed: joi.number().integer().max(999).allow(null)
    .messages({
      'number.base': 'Invalid spinSpeed: expected number(integer) format',
      'number.integer': 'Invalid spinSpeed: expected an integer',
      'number.max': 'Invalid spinSpeed: number must not exceed 999'
    }),
  artWork: joi.string().max(500).allow(null)
    .messages({
      'string.base': 'Invalid artWork: expected string format',
      'string.max': 'Invalid artWork: limit of 500 characters'
    }),
  mediaFormat: joi.number().max(99).allow(null)
    .messages({
      'number.base': 'Invalid mediaFormat: expected number format',
      'number.max': 'Invalid mediaFormat: number cannot exceed 99'
    }),
  camelotCode: joi.string().max(10).allow(null)
    .messages({
      'string.base': 'Invalid camelotCode: expected string format',
      'string.max': 'Invalid camelotCode: limit of 10 characters'
    }),
  internalDuplicate: joi.number().allow(null)
    .messages({
      'number.base': 'Invalid internalDuplicate: expected number format'
    }),
  labelName: joi.string().max(150).allow(null)
    .messages({
      'string.base': 'Invalid labelName: expected string format',
      'string.max': 'Invalid labelName: limit of 150 characters'
    }),
  countryCode: joi.string().max(3).allow(null)
    .messages({
      'string.base': 'Invalid countryCode: expected string format',
      'string.max': 'Invalid countryCode: limit of 3 characters'
    }),
  purchasePrice: joi.number().precision(2).allow(null)
    .messages({
      'number.base': 'Invalid purchasePrice: expected number format',
      'number.precision': 'Invalid purchasePrice: can have up to 2 decimal places'
    }),
  releaseYear: joi.number().integer().allow(null)
    .messages({
      'number.base': 'Invalid releaseYear: expected number(integer) format',
      'number.integer': 'Invalid releaseYear: expected an integer'
    }),
  notes: joi.string().max(500).allow(null)
    .messages({
      'string.base': 'Invalid notes: expected string format',
      'string.max': 'Invalid notes: limit of 500 characters'
    }),
  discogsReleaseID: joi.number().allow(null)
    .messages({
      'number.base': 'Invalid discogsReleaseID: expected number format'
    }),
  catalogNumber: joi.string().max(50).allow(null)
    .messages({
      'string.base': 'Invalid catalogNumber: expected string format',
      'string.max': 'Invalid catalogNumber: limit of 50 characters'
    }),
  properties: joi.object().allow(null).default({})
    .messages({
      'object.base': 'Invalid properties: expected object format'
    })
});

const schemaEntryGenre = joi.object({
  entryID: joi.number().integer().required()
    .messages({
      'any.required': 'Invalid entryID: is a required field',
      'number.base': 'Invalid entryID: expected number format',
      'number.integer': 'Invalid entryID: expected whole number'
    }),
  genreID: joi.number().integer().required()
    .messages({
      'any.required': 'Invalid genreID: is a required field',
      'number.base': 'Invalid genreID: expected number format',
      'number.integer': 'Invalid genreID: expected whole number'
    })
});

const schemaGenre = joi.object({
  parentID: joi.number().integer().allow(null)
    .messages({
      'number.base': 'Invalid parentID: expected number format',
      'number.integer': 'Invalid parentID: expected whole number'
    }),
  genreName: joi.string().max(150).required()
    .messages({
      'any.required': 'Invalid genreName: is a required field',
      'string.base': 'Invalid genreName: expected string format',
      'string.max': 'Invalid genreName: limit of 150 characters'
    }),
  genreDescription: joi.string().max(500).allow(null)
    .messages({
      'string.base': 'Invalid genreDescription: expected string format',
      'string.max': 'Invalid genreDescription: limit of 500 characters'
    })
});

const schemaListEntry = joi.object({
  listID: joi.number().integer().required()
    .messages({
      'any.required': 'Invalid listID: is a required field',
      'number.base': 'Invalid listID: expected number format',
      'number.integer': 'Invalid listID: expected whole number'
    }),
  entryID: joi.number().integer().required()
    .messages({
      'any.required': 'Invalid entryID: is a required field',
      'number.base': 'Invalid entryID: expected number format',
      'number.integer': 'Invalid entryID: expected whole number'
    }),
  positionOrder: joi.number().integer().required()
    .messages({
      'any.required': 'Invalid positionOrder: is a required field',
      'number.base': 'Invalid positionOrder: expected number format',
      'number.integer': 'Invalid positionOrder: expected whole number'
    })
});

const schemaList = joi.object({
  userID: joi.number()
    .messages({
      'number.base': 'Invalid userID: expected number',
      'number.integer': 'Invalid userID: expected whole number',
    }),
  name: joi.string().required().max(150)
    .messages({
      'any.required': 'Invalid name: is a required field',
      'string.base': 'Invalid name: expected string format',
      'string.max': 'Invalid name: limit of 150 characters'
    }),
  description: joi.string().max(500)
    .messages({
      'string.base': 'Invalid description: expected string format',
      'string.max': 'Invalid description: limit of 500 characters'
    }),
  type: joi.number().integer().max(99)
    .messages({
      'number.base': 'Invalid type: expected number format',
      'number.integer': 'Invalid type: expected an integer',
      'number.max': 'Invalid type: number must not exceed 99'
    }),
  isPublic: joi.boolean()
    .messages({
      'boolean.base': 'Invalid isPublic: expected boolean format'
    }),
  state: joi.object().allow(null).default({})
    .messages({
      'object.base': 'Invalid state: expected object format'
    }),
  properties: joi.object().allow(null).default({})
    .messages({
      'object.base': 'Invalid properties: expected object format'
    })
});

const schemaMediaCondition = joi.object({
  condition: joi.string().max(20).required()
    .messages({
      'any.required': 'Invalid condition: is a required field',
      'string.base': 'Invalid condition: expected string format',
      'string.max': 'Invalid condition: limit of 20 characters'
    }),
  description: joi.string().max(500).allow(null)
    .messages({
      'string.base': 'Invalid description: expected string format',
      'string.max': 'Invalid description: limit of 500 characters'
    })
});

const schemaRelationship = joi.object({
  userID: joi.number().integer()
    .messages({
      'number.base': 'User ID expected number',
      'number.integer': 'Release year must be a whole number'
    }),
  targetUserID: joi.number().integer()
    .messages({
      'number.base': 'User ID expected number',
      'number.integer': 'Release year must be a whole number'
    }),
  relationshipTypes: joi.object().allow(null).default({})
    .messages({
      'object.base': 'Properties must be a valid JSON object'
    })
});

const schemaUser = joi.object({
  displayName: joi.string().pattern(/^[a-zA-Z0-9 _-]+$/).trim().max(25).required()
    .messages({
      'string.pattern.base': 'Invalid displayName: contains disallowed characters',
      'string.max': 'Invalid displayName: limit of 25 characters',
      'any.required': 'Invalid displayName: is a required field'
    }),
  email: joi.string().email({ minDomainSegments: 2 }).required()
    .messages({
      'string.email': 'Invalid email: expected a valid email address',
      'any.required': 'Invalid email: is a required field'
    }),
  password: joi.string().pattern(/^(?=.*[a-zA-Z])(?=.*\d)/).min(6).required()
    .messages({
      'string.pattern.base': 'Invalid password: must contain at least one letter and one number',
      'string.min': 'Invalid password: minimum length of 6 characters',
      'any.required': 'Invalid password: is a required field'
    }),
  passwordMatch: joi.string().valid(joi.ref('password')).required()
    .messages({
      'any.only': 'Invalid passwordMatch: passwords do not match',
      'any.required': 'Invalid passwordMatch: is a required field'
    }),
  accountType: joi.number().integer().max(99).required()
    .messages({
      'number.base': 'Invalid accountType: expected number(integer) format',
      'number.integer': 'Invalid accountType: expected an integer',
      'number.max': 'Invalid accountType: number must not exceed 99'
    }),
  visibility: joi.number().integer().max(99).required()
    .messages({
      'number.base': 'Invalid visibility: expected number(integer) format',
      'number.integer': 'Invalid visibility: expected an integer',
      'number.max': 'Invalid visibility: number must not exceed 99'
    }),
  state: joi.object().allow(null).default({})
    .messages({
      'object.base': 'Invalid state: expected object format'
    }),
  properties: joi.object().allow(null).default({})
    .messages({
      'object.base': 'Invalid properties: expected object format'
  })
});

module.exports = {
    schemaEntry,
    schemaEntryGenre,
    schemaGenre,
    schemaListEntry,
    schemaList,
    schemaMediaCondition,
    schemaRelationship,
    schemaUser
};