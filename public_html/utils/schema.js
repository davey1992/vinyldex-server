const joi = require('joi');

const schemaEntry = (allowNull = false) => {

  const modifier = (field) => allowNull ? field.optional().allow(null) : field.required();

  return joi.object({
    parent_id: joi.number().integer().min(0).allow(null)
      .messages({
        'number.base': 'Invalid parent_id: expected number(integer) format',
        'number.integer': 'Invalid parent_id: expected an integer',
        'number.min': 'Invalid parent_id: must be a positive number'
      }),
    user_id: modifier(joi.number().integer())
      .messages({
        'any.required': 'Invalid user_id: is a required field',
        'number.base': 'Invalid user_id: expected number(integer) format',
        'number.integer': 'Invalid user_id: expected an integer',
      }),
    media_condition: joi.number().integer().min(0).allow(null)
      .messages({
        'number.base': 'Invalid media_condition: expected number(integer) format',
        'number.integer': 'Invalid media_condition: expected an integer',
        'number.min': 'Invalid media_condition: must be a positive number'
      }),
    sleeve_condition: joi.number().integer().min(0).allow(null)
      .messages({
        'number.base': 'Invalid sleeve_condition: expected number(integer) format',
        'number.integer': 'Invalid sleeve_condition: expected an integer',
        'number.min': 'Invalid sleeve_condition: must be a positive number'
      }),
    title:  modifier(joi.string().max(150))
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
    item_ref: joi.string().max(150).allow(null)
      .messages({
        'string.base': 'Invalid item_ref: expected string format',
        'string.max': 'Invalid item_ref: limit of 150 characters'
      }),
    personal_rating: joi.number().integer().min(0).max(10).allow(null)
      .messages({
        'number.base': 'Invalid personal_rating: expected number(integer)',
        'number.integer': 'Invalid personal_rating: expected an integer',
        'number.min': 'Invalid personal_rating: rating cannot be negative',
        'number.max': 'Invalid personal_rating: rating can not exceed 10'
      }),
    bpm: joi.number().integer().min(0).max(9999).allow(null)
      .messages({
        'number.base': 'Invalid bpm: expected number(integer) format',
        'number.integer': 'Invalid bpm: expected an integer',
        'number.min': 'Invalid bpm: bpm cannot be negative',
        'number.max': 'Invalid bpm: number must not exceed 9999'
      }),
    spin_speed: joi.number().integer().min(0).max(999).allow(null)
      .messages({
        'number.base': 'Invalid spin_speed: expected number(integer) format',
        'number.integer': 'Invalid spin_speed: expected an integer',
        'number.min': 'Invalid spin_speed: spin speed cannot be negative',
        'number.max': 'Invalid spin_speed: number must not exceed 999'
      }),
    art_work: joi.string().max(500).allow(null)
      .messages({
        'string.base': 'Invalid art_work: expected string format',
        'string.max': 'Invalid art_work: limit of 500 characters'
      }),
    media_format: joi.number().integer().min(0).max(99).allow(null)
      .messages({
        'number.base': 'Invalid media_format: expected number format',
        'number.integer': 'Invalid media_format: expected an integer',
        'number.max': 'Invalid media_format: number cannot exceed 99'
      }),
    camelot_code: joi.string().max(10).allow(null)
      .messages({
        'string.base': 'Invalid camelot_code: expected string format',
        'string.max': 'Invalid camelot_code: limit of 10 characters'
      }),
    internal_duplicate: joi.number().integer().min(0).allow(null)
      .messages({
        'number.base': 'Invalid internal_duplicate: expected number format',
        'number.integer': 'Invalid internal_duplicate: expected an integer'
      }),
    label_name: joi.string().max(150).allow(null)
      .messages({
        'string.base': 'Invalid label_name: expected string format',
        'string.max': 'Invalid label_name: limit of 150 characters'
      }),
    country_code: joi.string().max(3).allow(null)
      .messages({
        'string.base': 'Invalid country_code: expected string format',
        'string.max': 'Invalid country_code: limit of 3 characters'
      }),
    purchase_price: joi.number().min(0).precision(2).allow(null)
      .messages({
        'number.base': 'Invalid purchase_price: expected number format',
        'number.min': 'Invalid purchase_price: price cannot be negative',
        'number.precision': 'Invalid purchase_price: can have up to 2 decimal places'
      }),
    release_year: joi.number().integer().min(1900).max(2100).allow(null)
      .messages({
        'number.base': 'Invalid release_year: expected number(integer) format',
        'number.integer': 'Invalid release_year: expected an integer',
        'number.min': 'Invalid release_year: year must be 1900 or later',
        'number.max': 'Invalid release_year: year cannot exceed 2100'
      }),
    notes: joi.string().max(500).allow(null)
      .messages({
        'string.base': 'Invalid notes: expected string format',
        'string.max': 'Invalid notes: limit of 500 characters'
      }),
    discogs_release_id: joi.number().integer().min(0).allow(null)
      .messages({
        'number.base': 'Invalid discogs_release_id: expected number format',
        'number.integer': 'Invalid discogs_release_id: expected an integer'
      }),
    catalog_number: joi.string().max(50).allow(null)
      .messages({
        'string.base': 'Invalid catalog_number: expected string format',
        'string.max': 'Invalid catalog_number: limit of 50 characters'
      }),
    properties: joi.object().allow(null)
      .messages({
        'object.base': 'Invalid properties: expected object format'
      })
  })
};

const schemaEntryGenre = (allowNull = false) => {
  const modifier = (field) => allowNull ? field.optional().allow(null) : field.required();

  return joi.object({
    entry_id: modifier(joi.number().integer()
      .messages({
        'any.required': 'Invalid entry_id: is a required field',
        'number.base': 'Invalid entry_id: expected number format',
        'number.integer': 'Invalid entry_id: expected whole number'
      })
    ),
    genre_id: modifier(joi.number().integer()
      .messages({
        'any.required': 'Invalid genre_id: is a required field',
        'number.base': 'Invalid genre_id: expected number format',
        'number.integer': 'Invalid genre_id: expected whole number'
      })
    )
  });
}

const schemaGenre = (allowNull = false) => {
  const modifier = (field) => allowNull ? field.optional().allow(null) : field.required();
  return joi.object({
    parent_id: joi.number().integer().allow(null)
      .messages({
        'number.base': 'Invalid parent_id: expected number format',
        'number.integer': 'Invalid parent_id: expected whole number'
      }),
    genre_name: modifier(joi.string().max(150)
      .messages({
        'any.required': 'Invalid genre_name: is a required field',
        'string.base': 'Invalid genre_name: expected string format',
        'string.max': 'Invalid genre_name: limit of 150 characters'
      })
    ),
    genre_description: joi.string().max(500).allow(null)
      .messages({
        'string.base': 'Invalid genre_description: expected string format',
        'string.max': 'Invalid genre_description: limit of 500 characters'
      })
  });
}

const schemaListEntry = (allowNull = false) => {
  const modifier = (field) => allowNull ? field.optional().allow(null) : field.required();
  
  return joi.object({
    list_id: modifier(joi.number().integer()
      .messages({
        'any.required': 'Invalid list_id: is a required field',
        'number.base': 'Invalid list_id: expected number format',
        'number.integer': 'Invalid list_id: expected whole number'
      })
    ),
    entry_id: modifier(joi.number().integer()
      .messages({
        'any.required': 'Invalid entry_id: is a required field',
        'number.base': 'Invalid entry_id: expected number format',
        'number.integer': 'Invalid entry_id: expected whole number'
      })
    ),
    position_order: modifier(joi.number().integer()
      .messages({
        'any.required': 'Invalid position_order: is a required field',
        'number.base': 'Invalid position_order: expected number format',
        'number.integer': 'Invalid position_order: expected whole number'
      })
    )
  });
}
const schemaList = (allowNull = false) => {

  // const modifier = (field) => allowNull ? field.optional().allow(null) : field.required();
  return joi.object({
    user_id: joi.number().integer()
      .messages({
        'number.base': 'Invalid user_id: expected number',
        'number.integer': 'Invalid user_id: expected whole number',
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
    is_public: joi.boolean()
      .messages({
        'boolean.base': 'Invalid is_public: expected boolean format'
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
}

const schemaMediaCondition = (allowNull = false) => {
  const modifier = (field) => allowNull ? field.optional().allow(null) : field.required();
  return joi.object({
    condition: modifier(joi.string().max(20)
      .messages({
        'any.required': 'Invalid condition: is a required field',
        'string.base': 'Invalid condition: expected string format',
        'string.max': 'Invalid condition: limit of 20 characters'
      })
    ),
    description: modifier(joi.string().max(500).allow(null)
      .messages({
        'string.base': 'Invalid description: expected string format',
        'string.max': 'Invalid description: limit of 500 characters'
      })
    )
  });
}

const schemaRelationship = (allowNull = false) => {
  return joi.object({
    user_id: joi.number().integer()
      .messages({
        'number.base': 'Invalid user_id: expected number format',
        'number.integer': 'Invalid user_id: expected an integer'
      }),
    target_user_id: joi.number().integer()
      .messages({
        'number.base': 'Invalid target_user_id: expected number format',
        'number.integer': 'Invalid target_user_id: expected an integer'
      }),
    relationship_types: joi.object().allow(null).default({})
      .messages({
        'object.base': 'Invalid relationship_types: expected object format'
      })
  });
}
const schemaUser = (allowNull = false) => {
  const modifier = (field) => allowNull ? field.optional().allow(null) : field.required();
  return joi.object({
    display_name: modifier(joi.string().pattern(/^[a-zA-Z0-9 _-]+$/).trim().max(25)
      .messages({
        'string.pattern.base': 'Invalid display_name: contains disallowed characters',
        'string.max': 'Invalid display_name: limit of 25 characters',
        'any.required': 'Invalid display_name: is a required field'
      })
    ),
    email: modifier(joi.string().email({ minDomainSegments: 2 })
      .messages({
        'string.email': 'Invalid email: expected a valid email address',
        'any.required': 'Invalid email: is a required field'
      })
    ),
    password: modifier(joi.string().pattern(/^(?=.*[a-zA-Z])(?=.*\d)/).min(6)
      .messages({
        'string.pattern.base': 'Invalid password: must contain at least one letter and one number',
        'string.min': 'Invalid password: minimum length of 6 characters',
        'any.required': 'Invalid password: is a required field'
      })
    ),
    password_match: (joi.string().valid(joi.ref('password'))
      .messages({
        'any.only': 'Invalid password_match: passwords do not match',
        'any.required': 'Invalid password_match: is a required field'
      })
    ),
    account_type: joi.number().integer().max(99).required()
      .messages({
        'number.base': 'Invalid account_type: expected number(integer) format',
        'number.integer': 'Invalid account_type: expected an integer',
        'number.max': 'Invalid account_type: number must not exceed 99'
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
}

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