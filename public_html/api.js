const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const express = require('express'); //EXPRESS
const router = express.Router(); //EXPRESS
const bcrypt = require ('bcrypt'); //HASHING
const joi = require ('joi'); //VALIDATOR

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;
const pool = require('./config/db');


//ERROR 409 DUPLICATES
//500 DATABASE ERROR
//CHANGE VARIABLE NAME
//SPACING FORMATTING
//ADD MESSAGES

app.get('/', (req, res) => {
  res.send('VinDex API is live!');
});

app.post('/add/list-entry', async (req, res) => {
   let cleanedListEntry;

  const listEntrySchema = joi.object({
    listID : joi.number().required(),
    entryID : joi.number().required(),
    positionOrder : joi.number().required()
  });

  try {
    cleanedListEntry = await listEntrySchema.validateAsync({
      listID: req.body.listID,
      entryID: req.body.entryID,
      positionOrder: req.body.positionOrder
    }, {stripUnknown: true});
  } 
  
  catch (err) {
    console.log(err);
    return res.status(400).json({
      success:false,
      type: 'database_error',
      error: err.details[0].message
    });
  }

  const query = `
    INSERT INTO list_entries (
      list_id,
      entry_id,
      position_order
    )
    VALUES (
      $1,
      $2,
      $3
    )
    RETURNING id;
  `;
  const values = [
    cleanedListEntry.listID,
    cleanedListEntry.entryID,
    cleanedListEntry.positionOrder
  ];

  try {
    const result = await pool.query(query, values);
    console.log("Entry List: Created - ");
    return res.status(201).json({ 
      success: true,
      message: 'List Entry created in database!', 
      data: result.rows[0]
    });
  } 
  catch (err) {
    //FORIGN KEY VALIDATION ISSUES
    if (err.code === '23503') {
      console.log(":)");
      let errorMessage = 'Invalid primary key constraint';
   
      switch (err.constraint) {
        case 'fk_list_id':
          errorMessage = 'List ID Does Not Exist';
        break;
        case 'fk_entry_id':
          errorMessage = 'Entry ID Does Not Exist';
        break;
      }

      console.log(errorMessage);
      return res.status(400).json({ 
        type: 'database_error',
        error: errorMessage
      });
    }

    console.error('Database insert error:', err);
    return res.status(500).json({
      success:false,
      type: 'database_error',
      error: 'Internal database configuration error.'
    });
  }
});
app.post('/add/entry-genre', async (req, res) => {

  let cleanedEntryGenre;

  const entryGenreSchema = joi.object({
    entryID : joi.number().required(),
    genreID : joi.number().required()
  });

  try {
    cleanedEntryGenre = await entryGenreSchema.validateAsync({
      entryID: req.body.entryID,
      genreID: req.body.genreID
    }, {stripUnknown: true});
  } 
  
  catch (err) {
    console.log(err);
    return res.status(400).json({
      success:false,
      type: 'database_error',
      error: err.details[0].message
    });
  }

  const query = `
    INSERT INTO entry_genres (
      entry_id,
      genre_id
    )
    VALUES (
      $1, $2
    )
    RETURNING id;
  `;
  const values = [
    cleanedEntryGenre.entryID,
    cleanedEntryGenre.genreID
  ];

  try {
    const result = await pool.query(query, values);
    console.log("Entry Genre: Created - ");
    return res.status(201).json({ 
      success: true,
      message: 'Entry created in database!', 
      data: result.rows[0]
    });
  } 
  catch (err) {
    //FORIGN KEY VALIDATION ISSUES
    if (err.code === '23503') {
      console.log(":)");
      let errorMessage = 'Invalid primary key constraint';
   
      switch (err.constraint) {
        case 'fk_entry_id':
          errorMessage = 'Selected entry does not exist.';
        break;
        case 'fk_genre_id':
          errorMessage = 'Selected genre does not exist.';
        break;
      }

      console.log(errorMessage);
      return res.status(400).json({ 
        type: 'database_error',
        error: errorMessage
      });
    }

    console.error('Database insert error:', err);
    return res.status(500).json({
      success:false,
      type: 'database_error',
      error: 'Internal database configuration error.'
    });
  }
});

app.post('/add/genre', async (req, res) => {
  let cleaneGenre;
  
  const genreSchema = joi.object({
    parentID: joi.number().allow(null),
    genreName: joi.string().required(),
    genreDescription: joi.string()
  });

  try{
    cleaneGenre = await genreSchema.validateAsync({
      parentID: req.body.parentID,
      genreName: req.body.genreName,
      genreDescription: req.body.genreDescription
    });
  }
  catch (err) {
    console.log(err);
    return res.status(400).json({
      success:false,
      type: 'database_error',
      error: err.details[0].message
    });
  }

  const query = `
    INSERT INTO genres (
      parent_id, genre_name, genre_description
    )
    VALUES (
      $1, $2, $3
    )
    RETURNING id;
  `;
  
  const values = [
    cleaneGenre.parentID,
    cleaneGenre.genreName,
    cleaneGenre.genreDescription
  ];

  try {
    const result = await pool.query(query, values);
    console.log("Genre: Created - " + cleaneGenre.genreName);
    return res.status(201).json({ 
      success: true,
      message: 'Genre ' + cleaneGenre.genreName + ' created in database!', 
      data: result.rows[0]
    });
  } 
  
  catch (err) {
    if (err.code === '23503') {
      if (err.constraint == 'fk_genre_parent_id') {
        console.log('Parent genre does not exist');
        return res.status(400).json({
          success:false,
          error_type:'database_error',
          message: 'Parent genre does not exist'
        });
      }
    }
    
    console.log(err);
    return res.status(400).json({
      success:false,
      error_type:'database_error',
      message: 'Something went wrong'
    });
  }
});


















app.post('/add/list', async (req, res) => {
  let cleanedList;

  const listSchema = joi.object({
    userID: joi.number(),
    name: joi.string().max(150),
    description: joi.string().max(500),
    type: joi.number().max(99),
    isPublic: joi.boolean(),
    state: joi.object().allow(null).default({}),
    properties: joi.object().allow(null).default({})
  });

  try {
    cleanedList = await listSchema.validateAsync({
      userID: req.body.userID,
      name: req.body.name.trim().replaceAll(/\s+/g, ' '),
      description: req.body.description,
      type: req.body.type,
      isPublic: req.body.isPublic,
      state: req.body.state,
      properties: req.body.properties
    });
  }
  catch (err) {

    console.log(err);
    return res.status(400).json({
      success:false,
      type: 'database_error',
      error: err.details[0].message
    });
  }

  const query = `
    INSERT INTO lists (
      user_id,
      name, 
      description, 
      type,
      is_public,
      state,
      properties
    )
    VALUES (
      $1,
      $2,
      $3,
      $4,
      $5,
      $6,
      $7
    )
    RETURNING id;
  `;
  
  const values = [
    cleanedList.userID,
    cleanedList.name,
    cleanedList.description,
    cleanedList.type,
    cleanedList.isPublic,
    cleanedList.state,
    cleanedList.properties
  ];

  console.log(values);

  try {
    const result = await pool.query(query, values);
    console.log("List: Created - " + cleanedList.name);
    return res.status(201).json({ 
      success: true,
      message: 'Entry created in database!', 
      data: result.rows[0]
    });
  } 
  catch (err) {

    //UNIQUE ISSUE
    if (err.code == 23505) {
      if (err.constraint == 'unique_user_list_name') {
        console.error('Database insert error:', 'There already is a list called this perhaps calling this something else');
        return res.status(500).json({
          success:false,
          type: 'database_error',
          error: 'There already is another List called this for this user perhaps calling this something else.'
        });
      }
    }
  
    if (err.code == 23503) {
      if (err.constraint == 'fk_user_id') {
        console.error('Database insert error:', 'User does not exist');
        return res.status(500).json({
          success:false,
          type: 'database_error',
          error: 'User does not exist'
        });
      }
    }
    console.error('Database insert error:', err);
    return res.status(500).json({
      success:false,
      type: 'database_error',
      error: 'Internal database configuration error.'
    });
  }
});

app.post('/add/media-condition', async (req, res) => {
  let cleanMediaCondition;
  const mediaConditionSchema = joi.object({
    condition: joi.string().max(20),
    description:joi.string().max(500)
  });

  try{
    cleanMediaCondition = await mediaConditionSchema.validateAsync({
      condition: req.body.condition,
      description: req.body.description
    });
  }
  catch(err) {
    return res.status(400).json({
      success:false,
      type: 'database_error',
      error: err.details[0].message
    });
  }

  const query = `
    INSERT INTO media_conditions (
      condition,
      description
    )
    VALUES (
      $1,
      $2
    )
    RETURNING id;
  `;
  
  const values = [
    cleanMediaCondition.condition,
    cleanMediaCondition.description,
  ];

  try {
    const result = await pool.query(query, values);
    console.log("Entry: Created - " + cleanMediaCondition.condition);
    return res.status(201).json({ 
      success: true,
      message: 'Media Condition created in database!', 
      data: result.rows[0]
    });
  } 
  catch (err) {
    if (err.code === '23505') {
      if (err.constraint == 'unique_media_condition') {
        console.error('Media condition already exists');
        return res.status(500).json({
          success:false,
          type: 'database_error',
          error: 'Media Condition already exists'
        });
      }
    }

    console.error('Database insert error:', err);
    return res.status(500).json({
      success:false,
      type: 'database_error',
      error: 'Internal database configuration error.'
    });
  }
});

app.post('/add/relationship', async (req, res) => {
  let cleanRelationship;
  const relationshipSchema = joi.object({
    userID: joi.number().integer(),
    targetUserID: joi.number().integer(),
    relationshipTypes: joi.object().allow(null).default({})
  });

  try {
    cleanRelationship = await relationshipSchema.validateAsync({
      userID: req.body.userID,
      targetUserID: req.body.targetUserID,
      relationshipTypes: req.body.relationshipTypes,
    });
  }

  catch (err) {
    console.log(err);
    return res.status(400).json({
      success:false,
      type: 'database_error',
      error: err.details[0].message
    });
  }

  const query = `
    INSERT INTO relationships (
      user_id,
      target_user_id, 
      relationship_types
    )
    VALUES (
      $1,
      $2,
      $3
    )
    RETURNING id;
  `;
  
  const values = [
    cleanRelationship.userID,
    cleanRelationship.targetUserID,
    cleanRelationship.relationshipTypes
  ];

  try {
    const result = await pool.query(query, values);
    console.log("Relationship: Created - " + cleanRelationship.userID + ' - ' + cleanRelationship.targetUserID);
    return res.status(201).json({ 
      success: true,
      message: 'Entry created in database!', 
      data: result.rows[0]
    });
  } 
  catch (err) {
    //UNIQUE ISSUE
    if (err.code == 23503) {
      if(err.constraint == 'fk_relationship_user_id') {
        console.error('Database insert error:', 'User ID Does not exist');
        return res.status(500).json({
          success:false,
          type: 'database_error',
          error: 'User ID Does not exist'
        });
      }
      if(err.constraint == 'fk_relationship_user_target_id') {
        console.error('Database insert error:', 'Target User ID Does not exist');
        return res.status(500).json({
          success:false,
          type: 'database_error',
          error: 'Target User ID Does not exist'
        });
      }
    }
    if (err.code == 23505) {
      if (err.constraint == 'unique_user_target') {
        console.error('Database insert error:', 'User already has a relationship set');
        return res.status(500).json({
          success:false,
          type: 'database_error',
          error: 'User already has a relationship set'
        });
      }
    }

    console.error('Database insert error:', err);
    return res.status(500).json({
      success:false,
      type: 'database_error',
      error: 'Internal database configuration error.'
    });
  }
});

app.post('/add/entry', async (req, res) => {
  //VALIDATION
  //MAKE SURE USER IS LOGGED IN
  //MAKE SURE JSON DATA IS VALIDATED
  let cleanedEntry;
  const entrySchema = joi.object({
    parentID: joi.number().allow(null),
    userID: joi.number().required()
      .messages({
        'any.required': 'User ID is required.',
        'number.base': 'User ID must be a number.'
      }),
    mediaCondition: joi.number().allow(null)
      .messages({
        'number.base': 'Media condition must be a number.'
      }),
    sleeveCondition: joi.number().allow(null)
      .messages({
        'number.base': 'Sleeve condition must be a number.'
      }),
    title: joi.string().max(150).required()
      .messages({
        'any.required': 'Title is required.',
        'string.max': 'Title cannot exceed 150 characters.',
        'string.base': 'Title must be a string.'
      }),
    artist: joi.string().max(150).allow(null)
      .messages({
        'string.max': 'Artist name cannot exceed 150 characters.',
        'string.base': 'Artist must be a string.'
      }),
    location: joi.string().max(150).allow(null)
      .messages({
        'string.max': 'Location cannot exceed 150 characters.',
        'string.base': 'Location must be a string.'
      }),
    itemRef: joi.string().max(150).allow(null)
      .messages({
        'string.max': 'Item reference cannot exceed 150 characters.',
        'string.base': 'Item reference must be a string.'
      }),
    personalRating: joi.number().max(10).allow(null)
      .messages({
        'number.base': 'Personal rating must be a number.',
        'number.max': 'Personal rating cannot be greater than 10.'
      }),
    bpm: joi.number().max(9999).allow(null)
      .messages({
        'number.base': 'BPM must be a number.',
        'number.max': 'BPM cannot exceed 9999.'
      }),
    spinSpeed: joi.string().max(10).allow(null)
      .messages({
        'string.max': 'Spin speed cannot exceed 10 characters.',
        'string.base': 'Spin speed must be a string.'
      }),
    artWork: joi.string().max(500).allow(null)
      .messages({
        'string.max': 'Artwork reference cannot exceed 500 characters.',
        'string.base': 'Artwork must be a string.'
      }),
    mediaFormat: joi.number().max(99).allow(null)
      .messages({
        'number.base': 'Media format must be a number.',
        'number.max': 'Media format cannot be greater than 99.'
      }),
    camelotCode: joi.string().max(10).allow(null)
      .messages({
        'string.max': 'Camelot code cannot exceed 10 characters.',
        'string.base': 'Camelot code must be a string.'
      }),
    internalDuplicate: joi.number().allow(null)
      .messages({
        'number.base': 'Internal duplicate must be a number.'
      }),
    labelName: joi.string().max(150).allow(null)
      .messages({
        'string.max': 'Label name cannot exceed 150 characters.',
        'string.base': 'Label name must be a string.'
      }),
    countryCode: joi.string().max(3).allow(null)
      .messages({
        'string.max': 'Country code cannot exceed 3 characters.',
        'string.base': 'Country code must be a string.'
      }),
    purchasePrice: joi.number().precision(2).allow(null)
      .messages({
        'number.base': 'Purchase price must be a number.',
        'number.precision': 'Purchase price can have up to 2 decimal places.'
      }),
    releaseYear: joi.number().integer().allow(null)
      .messages({
        'number.base': 'Release year must be a number.',
        'number.integer': 'Release year must be a whole number.'
      }),
    notes: joi.string().max(500).allow(null)
      .messages({
        'string.max': 'Notes cannot exceed 500 characters.',
        'string.base': 'Notes must be a string.'
      }),
    discogsReleaseID: joi.number().allow(null)
      .messages({
        'number.base': 'Discogs Release ID must be a number.'
      }),
    catalogNumber: joi.string().max(50).allow(null)
      .messages({
        'string.max': 'Catalog number cannot exceed 50 characters.',
        'string.base': 'Catalog number must be a string.'
      }),
    properties: joi.object().allow(null).default({})
      .messages({
        'object.base': 'Properties must be a valid JSON object.'
      })
  });

  try {
    cleanedEntry = await entrySchema.validateAsync({
      parentID: req.body.parentID,
      userID: req.body.userID,
      mediaCondition: req.body.mediaCondition,
      sleeveCondition: req.body.sleeveCondition,
      title: req.body.title,
      artist: req.body.artist,
      locaton: req.body.locaton,
      itemRef: req.body.itemRef,
      personalRating: req.body.personalRating,
      bpm: req.body.bpm,
      spinSpeed: req.body.spinSpeed,
      artWork: req.body.artWork,
      mediaFormat: req.body.mediaFormat,
      camelotCode: req.body.camelotCode,
      internalDuplicate: req.body.internalDuplicate,
      labelName: req.body.labelName,
      countryCode: req.body.countryCode,
      purchasePrice: req.body.purchasePrice,
      releaseYear: req.body.releaseYear,
      notes: req.body.notes,
      discogsReleaseID: req.body.discogsReleaseID,
      catalogNumber: req.body.catalogNumber,
      properties: req.body.properties
    }, {stripUnknown: true});
  } 
  catch (err) {
    console.log(err);
    return res.status(400).json({
      success:false,
      type: 'database_error',
      error: err.details[0].message
    });
  }

  //ADD TO DATABASE
  const query = `
    INSERT INTO entries (
      user_id, parent_id, title, artist, location, item_ref, 
      media_condition, sleeve_condition, personal_rating, bpm, 
      spin_speed, art_work, media_format, camelot_code, 
      internal_duplicate, label_name, country_code, 
      purchase_price, release_year, notes, 
      discogs_release_id, catalog_number, properties
    )
    VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 
      $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, 
      $21, $22, $23
    )
    RETURNING id, title, artist;
  `;
  
  const values = [
    cleanedEntry.userID,
    cleanedEntry.parentID,
    cleanedEntry.title,
    cleanedEntry.artist,
    cleanedEntry.location,
    cleanedEntry.itemRef,
    cleanedEntry.mediaCondition,
    cleanedEntry.sleeveCondition,
    cleanedEntry.personalRating,
    cleanedEntry.bpm,
    cleanedEntry.spinSpeed,
    cleanedEntry.artWork,
    cleanedEntry.mediaFormat,
    cleanedEntry.camelotCode,
    cleanedEntry.internalDuplicate,
    cleanedEntry.labelName,
    cleanedEntry.countryCode,
    cleanedEntry.purchasePrice,
    cleanedEntry.releaseYear,
    cleanedEntry.notes,
    cleanedEntry.discogsReleaseID,
    cleanedEntry.catalogNumber,
    cleanedEntry.properties
  ];

  try {
    const result = await pool.query(query, values);
    console.log("Entry: Created - " + cleanedEntry.title);
    return res.status(201).json({ 
      success: true,
      message: 'Entry created in database!', 
      data: result.rows[0]
    });
  } 
  catch (err) {
    //FORIGN KEY VALIDATION ISSUES
    if (err.code === '23503') {
      let errorMessage = 'Invalid primary key constraint';
   
      switch (err.constraint) {
        case 'fk_media_condition':
          errorMessage = 'Selected media_condition does not exist.';
        break;
        case 'fk_sleeve_condition':
          errorMessage = 'Selected sleeve_condition does not exist.';
        break;
        case 'fk_user_id':
          errorMessage = 'Provided user ID does not exist.';
        break;
        case 'fk_media_format':
          errorMessage = 'Selected media format does not exist.';
        break;
      }

      console.log(errorMessage);
      return res.status(400).json({ 
        type: 'database_error',
        error: errorMessage
      });
    }

    console.error('Database insert error:', err);
    return res.status(500).json({
      success:false,
      type: 'database_error',
      error: 'Internal database configuration error.'
    });
  }

});

app.post('/add/user', async (req, res) => {
  // VALIDATION
  let hashedPassword;
  let cleanedUser;
  const userSchema = joi.object({
    displayName: joi.string().pattern(/^[a-zA-Z0-9 _-]+$/).trim().max(25).required()
      .messages({
        'string.pattern.base': 'Display name can only contain letters, numbers, spaces, underscores, and hyphens.',
        'string.max': 'Display name cannot exceed 25 characters.',
        'any.required': 'Display Name is required.'
      }),
    email: joi.string().email({ minDomainSegments: 2 }).required()
      .messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required.'
      }),
    password: joi.string().pattern(/^(?=.*[a-zA-Z])(?=.*\d)/).min(6).required()
      .messages({
        'string.pattern.base':'Password too weak!' ,
        'string.min': 'Password too weak!',
        'any.required': 'Password is required.'
      }),
    passwordMatch: joi.string().valid(joi.ref('password')).required()
      .messages({
        'any.only': 'Passwords must match',
        'any.required': 'Passwords must match.'
      }),
    accountType: joi.number().integer().max(99).required()
      .messages({
        'number.base': 'Account type must be a number',
        'number.integer': 'Account type must be a number',
        'number.max': 'Account type can not be greater than 99'
      }),
    visibility: joi.number().integer().max(99).required()
      .messages({
        'number.base': 'Visibility must be a number',
        'number.integer': 'Visibility must be a number',
        'number.max': 'Visibility can not be greater than 99'
      }),
    state: joi.any().allow(null).default(null),
    properties: joi.object().allow(null).default({})
  });

  try {
    cleanedUser = await userSchema.validateAsync({
      displayName: req.body.displayName,
      email: req.body.email,
      password: req.body.password,
      passwordMatch: req.body.passwordMatch,
      accountType: req.body.accountType,
      visibility: req.body.visibility,
      state: req.body.state,
      properties: req.body.properties
    }, {stripUnknown: true});
  } 
  catch (err) {
    console.log(err.details[0].message);
    return res.status(400).json({
      success:false,
      type: 'database_error',
      error: err.details[0].message
    });
  }
 
  try {
    if (!process.env.VINDEX_PEPPER) {
      throw new Error('Environment is not properly setup.');
    }

    const pepper = process.env.VINDEX_PEPPER;
    hashedPassword = await bcrypt.hash(pepper + cleanedUser.password, 10);
  }
  catch (err){
    console.error('Configuration error: Please check that env.VINDEX_PEPPER is included in ENV.', err);

    return res.status(500).json({
      success:false,
      type: 'configuration_error',
      error: 'Internal server configuration error.'
    });
  }
 
  const query = `
    INSERT INTO users (display_name, email, password, account_type, visibility, state, properties)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING id, display_name, email;
  `;
  
  const values = [
    cleanedUser.displayName,
    cleanedUser.email,
    hashedPassword,
    cleanedUser.accountType,
    cleanedUser.visibility,
    cleanedUser.state,
    cleanedUser.properties
  ];

  try {
    const result = await pool.query(query, values);
    console.log("User: Created - " + cleanedUser.displayName);
    return res.status(201).json({ 
      success: true,
      message: 'User created in database!', 
      data: result.rows[0]
    });
  } 
  catch (err) {
 
    //DUPLICATE CONSTRAINTS
    if (err.code === '23505') {
      if (err.constraint == 'unique_display_name') {
        console.log('Database Error: User Display Name (' + cleanedUser.displayName + ') already exists');
        return res.status(409).json({
          success: false,
          type: 'database_error',
          error: 'User Display Name (' + cleanedUser.displayName + ') already exist.'
        });
      }

      else {
        console.log('Database Error: User Display Email (' + cleanedUser.email + ') already exists');
        return res.status(409).json({
          success: false,
          type: 'database_error',
          error: 'User Email (' + cleanedUser.email + ') already exist.'
        });
      }
    }

    console.error('Database insert error:', err);
    return res.status(500).json({
      success:false,
      type: 'database_error',
      error: 'Internal database configuration error.'
    });
  }
});

app.listen(5000, () => {
  console.log('Server running on port 5000');
});

//TEST SHIZZLE
const post_tests = require ('./post_tests');
app.use('/', post_tests);