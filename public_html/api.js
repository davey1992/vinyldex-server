const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const express = require('express'); //EXPRESS
const bcrypt = require ('bcrypt'); //HASHING
const joi = require ('joi'); //VALIDATOR

const app = express();
app.use(express.json({ limit: '75kb' }));

const PORT = process.env.PORT || 5000;
const pool = require('./config/db');


const DEBUG = process.env.NODE_ENV === 'dev';
function log(message) {
  if (DEBUG) {
    console.log(message);
  }
}

//CHANGE VARIABLE NAME

app.get('/', (req, res) => {
  res.send('VinDex API is live!');
});

const returnAddJSON = (req, grammar, groupErrors) => {
  const reqBody = Array.isArray(req.body) ? req.body : [req.body];

  if (groupErrors.length == reqBody.length) {
    const statusMessage = 'No ' + grammar + ' were added';
    log(statusMessage);
    log(groupErrors);
    
    return {
      status: 400,
      data: {
          success: false,
          type: 'database_error',
          message: statusMessage,
          errors: groupErrors
      }
    };
  }
  else if (groupErrors.length > 0){
    const statusMessage = 'Added some ' + grammar + ' in database! See errors';
    log(statusMessage);
    log(groupErrors);
    
    return {
      status: 400,
      data: {
          success: false,
          type: 'database_error',
          message: statusMessage,
          errors: groupErrors
      }
    };
  }
  else {
    const statusMessage = grammar + ' created in database! No errors';
    log(statusMessage);
    
    return {
      status: 201,
      data: {
          success: true,
          type: 'success',
          message: statusMessage
      }
    };
  }
}

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
app.post('/add/list-entry', async (req, res) => {
  const reqBody = Array.isArray(req.body) ? req.body : [req.body];
  const grammar = reqBody.length == 1 ? 'List Entry' : 'List Entries';
  
  let cleanedListEntries = [];
  let groupErrors = [];

  // VALIDATE FIRST WITHOUT THIS VALIDATEASYNC WILL FAIL ON ALL OF THEM WHICH IS NOT WHAT WE WANT
  // INITIAL DATA VALIDATION
  for (const value of reqBody) {
    try {
      const tempListEntry = await schemaListEntry.validateAsync(value, {stripUnknown: true});
      cleanedListEntries.push(tempListEntry);
    } 
    catch (err) {
      groupErrors.push(err.details[0].message + " - " + value.listID);
    }
  }

  if (cleanedListEntries.length == 0) {
    log('No ' + grammar + ' have been added');
    log(groupErrors);

    return res.status(400).json({
      success:false,
      type: 'database_error',
      message: 'No ' + grammar + ' have been added',
      error: groupErrors
    });
  }

  for (const cleanedListEntry of cleanedListEntries) {
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
        log(`Entry List: Created - ${cleanedListEntry.listID}`);
      } 
      catch (err) {
        //FORIGN KEY VALIDATION ISSUES
        if (err.code === '23503') {
          let errorMessage = 'Invalid primary key constraint';
      
          switch (err.constraint) {
            case 'fk_list_id':
              errorMessage = `Invalid listID: (${cleanedListEntry.listID}) list does not exist`;
              groupErrors.push(`Invalid listID: (${cleanedListEntry.listID}) list does not exist`);
            break;
            case 'fk_entry_id':
              errorMessage = `Invalid entryID: (${cleanedListEntry.entryID}) does not exist`;
              groupErrors.push(`Invalid entryID: (${cleanedListEntry.entryID}) does not exist`);
            break;
            default: 
              console.error('Unexpected database error:', err);
          }
        }
        else {
          console.error('Unexpected database error:', err);
        }
      }
    }

    const sendUser = returnAddJSON(req, grammar, groupErrors);
    return res.status(sendUser.status).json(
      sendUser.data
    );
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
app.post('/add/entry-genre', async (req, res) => {
  let cleanedEntryGenre;
  try {
    cleanedEntryGenre = await schemaEntryGenre.validateAsync({
      entryID: req.body.entryID,
      genreID: req.body.genreID
    }, {stripUnknown: true});
  } 
  
  catch (err) {
    log(err);
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
      $1,
      $2
    )
    RETURNING id;
  `;
  const values = [
    cleanedEntryGenre.entryID,
    cleanedEntryGenre.genreID
  ];

  try {
    const result = await pool.query(query, values);
    log("Entry Genre: Created - ");
  } 
  catch (err) {
    //FORIGN KEY VALIDATION ISSUES
    if (err.code === '23503') {
      let errorMessage = 'Invalid foreign key constraint';
   
      switch (err.constraint) {
        case 'fk_entry_id':
          errorMessage = 'Invalid entryID: entry does not exist';
        break;
        case 'fk_genre_id':
          errorMessage = 'Invalid genreID: genre does not exist';
        break;
      }

      log(errorMessage);
      return res.status(400).json({ 
        type: 'database_error',
        error: errorMessage
      });
    }

    console.error('Database insert error:', err);
    return res.status(400).json({
      success:false,
      type: 'database_error',
      error: 'Internal database configuration error'
    });
  }
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
app.post('/add/genre', async (req, res) => {
  
  const reqBody = Array.isArray(req.body) ? req.body : [req.body];
  const grammar = reqBody.length == 1 ? 'Genre' : 'Genres';

  let cleanedGenres = [];
  let groupErrors = [];
  // VALIDATE FIRST WITHOUT THIS VALIDATEASYNC WILL FAIL ON ALL OF THEM WHICH IS NOT WHAT WE WANT
  // INITIAL DATA VALIDATION
  for (const value of reqBody) {
    try {
      const tempGenres = await schemaGenre.validateAsync(value, {stripUnknown: true});
      cleanedGenres.push(tempGenres);
    } 
    catch (err) {
      groupErrors.push(err.details[0].message + " - " + value.genreName);
    }
  }
  
  if (cleanedGenres.length == 0) {
    log('No ' + grammar + ' have been added');
    log(groupErrors);

    return res.status(400).json({
      success:false,
      type: 'database_error',
      message: 'No ' + grammar + ' have been added',
      error: groupErrors
    });
  }

  for (const cleanedGenre of cleanedGenres) {
      const query = `
      INSERT INTO genres (
        parent_id,
        genre_name,
        genre_description
      )
      VALUES (
        $1,
        $2,
        $3
      )
      RETURNING id;
    `;
    
    const values = [
      cleanedGenre.parentID,
      cleanedGenre.genreName,
      cleanedGenre.genreDescription
    ];

    try {
      const result = await pool.query(query, values);
      log("Genre: Created - " + cleanedGenre.genreName);
      return res.status(201).json({ 
        success: true,
        message: 'Genre ' + cleanedGenre.genreName + ' created in database!', 
        data: result.rows[0]
      });
    } 
    
    catch (err) {
      if (err.code === '23505') {
        if (err.constraint === 'unique_genre_name') {
          log(`Invalid genreName: (${cleanedGenre.genreName}) already exists`);
          groupErrors.push(`Invalid genreName: (${cleanedGenre.genreName}) already exists`);
        }
        else {
          console.error('Database insert error:', err);
        }
      }
      else if (err.code === '23503') {
        if (err.constraint === 'fk_genre_parent_id') {
          log(`Invalid parentID: (${cleanedGenre.parentID}) parent genre does not exist`);
          groupErrors.push(`Invalid parentID: (${cleanedGenre.parentID}) parent genre does not exist`);
        }
        else {
          console.error('Database insert error:', err);
        }
      }
      else {
         console.error('Database insert error:', err);
      }
    }
  }

  const sendUser = returnAddJSON(req, grammar, groupErrors);
  return res.status(sendUser.status).json(
    sendUser.data
  );

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
app.post('/add/list', async (req, res) => {
  let cleanedList;

  try {
    cleanedList = await schemaList.validateAsync({
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

    log(err);
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

  log(values);

  try {
    const result = await pool.query(query, values);
    log("List: Created - " + cleanedList.name);
    return res.status(201).json({ 
      success: true,
      message: 'Entry created in database!', 
      data: result.rows[0]
    });
  } 
  catch (err) {

    //UNIQUE ISSUE
    if (err.code === '23505') {
      if (err.constraint === 'unique_user_list_name') {
        console.error('Database insert error:', 'There already is a list called this perhaps calling this something else');
        return res.status(409).json({
          success:false,
          type: 'database_error',
          error: 'Invalid userID, listName: Duplicate list name for this user'
        });
      }
    }
  
    if (err.code === '23503') {
      if (err.constraint === 'fk_user_id') {
        console.error('Invalid userID: user does not exist');
        return res.status(400).json({
          success:false,
          type: 'database_error',
          error: 'Invalid userID: user does not exist'
        });
      }
    }
    console.error('Database insert error:', err);
    return res.status(400).json({
      success:false,
      type: 'database_error',
      error: 'Internal database configuration error'
    });
  }
});

const schemaMediaCondition = joi.object({
  condition: joi.string().max(20)
    .messages({
      'string.base': 'Invalid condition: expected string format',
      'string.max': 'Invalid condition: limit of 20 characters'
    }),
  description:joi.string().max(500)
    .messages({
      'string.base': 'Invalid description: expected string format',
      'string.max': 'Invalid description: limit of 500 characters'
    })
});
app.post('/add/media-condition', async (req, res) => {

  const reqBody = Array.isArray(req.body) ? req.body : [req.body];
  const grammar = reqBody.length == 1 ? 'Media Condition' : 'Media Conditions';

  let cleanMediaConditions = [];
  let groupErrors = [];
  // VALIDATE FIRST WITHOUT THIS VALIDATEASYNC WILL FAIL ON ALL OF THEM WHICH IS NOT WHAT WE WANT
  // INITIAL DATA VALIDATION
  for (const value of reqBody) {
    try {
      const tempMediaCondition = await schemaMediaCondition.validateAsync(value, {stripUnknown: true});
      cleanMediaConditions.push(tempMediaCondition);
    } 
    catch (err) {
      groupErrors.push(err.details[0].message + " - " + value.title);
    }
  }

  if (cleanMediaConditions.length == 0) {
    log('No ' + grammar + ' have been added');
    log(groupErrors);

    return res.status(400).json({
      success:false,
      type: 'database_error',
      message: 'No ' + grammar + ' have been added',
      error: groupErrors
    });
  }

  for (const cleanMediaCondition of cleanMediaConditions) {
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
      log("Entry: Created - " + cleanMediaCondition.condition);
    } 
    catch (err) {
      if (err.code === '23505') {
        if (err.constraint === 'unique_media_condition') {
          log('Invalid mediaCondition: already exists');
          groupErrors.push(`Invalid mediaCondition: (${cleanMediaCondition.condition}) already exists`);
        }
      }
      else {
        console.error('Database insert error:', err);
      }
    }
  }

  const sendUser = returnAddJSON(req, grammar, groupErrors);
  return res.status(sendUser.status).json(
    sendUser.data
  );

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
app.post('/add/relationship', async (req, res) => {
  let cleanRelationship;

  try {
    cleanRelationship = await schemaRelationship.validateAsync({
      userID: req.body.userID,
      targetUserID: req.body.targetUserID,
      relationshipTypes: req.body.relationshipTypes,
    });
  }

  catch (err) {
    log(err);
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
    log("Relationship: Created - " + cleanRelationship.userID + ' - ' + cleanRelationship.targetUserID);
    return res.status(201).json({ 
      success: true,
      message: 'Entry created in database!', 
      data: result.rows[0]
    });
  } 
  catch (err) {
    //UNIQUE ISSUE
    if (err.code === '23503') {
      if(err.constraint === 'fk_relationship_user_id') {
        console.error('Database insert error:', 'User ID Does not exist');
        return res.status(400).json({
          success:false,
          type: 'database_error',
          error: 'User ID Does not exist'
        });
      }
      if (err.constraint === 'fk_relationship_user_target_id') {
        console.error('Database insert error:', 'Target User ID Does not exist');
        return res.status(400).json({
          success:false,
          type: 'database_error',
          error: 'Target User ID Does not exist'
        });
      }
    }

    if (err.code === '23505') {
      if (err.constraint === 'unique_user_target') {
        console.error('Database insert error:', 'Invalid userTarget: already assigned');
        return res.status(409).json({
          success:false,
          type: 'database_error',
          error: 'Invalid userTarget: already assigned'
        });
      }
    }

    console.error('Database insert error:', err);
    return res.status(400).json({
      success:false,
      type: 'database_error',
      error: 'Internal database configuration error'
    });
  }
});

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
app.post('/add/entry', async (req, res) => {
  //VALIDATION
  //MAKE SURE USER IS LOGGED IN
  //MAKE SURE JSON DATA IS VALIDATED

  const reqBody = Array.isArray(req.body) ? req.body : [req.body];
  const grammar = reqBody.length == 1 ? 'Entry' : 'Entries';

  let cleanedEntries = [];
  let groupErrors = [];

  // VALIDATE FIRST WITHOUT THIS VALIDATEASYNC WILL FAIL ON ALL OF THEM WHICH IS NOT WHAT WE WANT
  // INITIAL DATA VALIDATION
  for (const value of reqBody) {
    try {
      const tempEntry = await schemaEntry.validateAsync(value, {stripUnknown: true});
      cleanedEntries.push(tempEntry);
    } 
    catch (err) {
      groupErrors.push(err.details[0].message + " - " + value.title);
    }
  }

  if (cleanedEntries.length == 0) {
    log('No ' + grammar + ' have been added');
    log(groupErrors);

    return res.status(400).json({
      success:false,
      type: 'database_error',
      message: 'No ' + grammar + ' have been added',
      error: groupErrors
    });
  }

  for (const cleanedEntry of cleanedEntries) {

    const query = `
      INSERT INTO entries (
        user_id,
        parent_id,
        title, 
        artist,
        location,
        item_ref, 
        media_condition,
        sleeve_condition,
        personal_rating,
        bpm, 
        spin_speed,
        art_work,
        media_format,
        camelot_code, 
        internal_duplicate, 
        label_name, 
        country_code, 
        purchase_price,
        release_year,
        notes, 
        discogs_release_id,
        catalog_number,
        properties
      )
      VALUES (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        $7,
        $8,
        $9,
        $10, 
        $11,
        $12,
        $13,
        $14,
        $15,
        $16,
        $17,
        $18,
        $19,
        $20, 
        $21,
        $22,
        $23
      )
      RETURNING id;
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
      log("Entry: Created - " + cleanedEntry.title);
    } 
    catch (err) {
   
      //FORIGN KEY VALIDATION ISSUES
      if (err.code === '23503') {
        
        let errorMessage = 'Invalid primary key constraint';
    
        switch (err.constraint) {
          case 'fk_entry_user':
            groupErrors.push(`Invalid userID: (${cleanedEntry.userID}) does not exist`);
          break;
          case 'fk_entry_hierarchy':
            groupErrors.push(`Invalid parentID: (${cleanedEntry.parentID}) does not exist`);
          break;
          case 'fk_media_condition':
            groupErrors.push(`Invalid mediaCondition: (${cleanedEntry.mediaCondition}) does not exist`);
          break;
          case 'fk_sleeve_condition':
            groupErrors.push(`Invalid sleeveCondition: (${cleanedEntry.sleeveCondition}) does not exist`);
          break;
          case 'fk_user_id':
            groupErrors.push(`Invalid userID: (${cleanedEntry.userID}) does not exist`);
          break;
          case 'fk_media_format':
            groupErrors.push(`Invalid mediaFormat: (${cleanedEntry.mediaFormat}) does not exist`);
          break;
          default:
            log(err);
        }
      }
      else {
        console.error('Unexpected database error:', err);
        return res.status(400).json({
          success:false,
          type: 'database_error',
          error: 'Internal database configuration error'
        });
      }
    }
  }

  const sendUser = returnAddJSON(req, grammar, groupErrors);
  return res.status(sendUser.status).json(
    sendUser.data
  );
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
app.post('/add/user', async (req, res) => {

  if (!process.env.VINDEX_PEPPER) {
    throw new Error('Environment is not properly setup.');
  }

  const pepper = process.env.VINDEX_PEPPER;
  const reqBody = Array.isArray(req.body) ? req.body : [req.body];
  const grammar = reqBody.length == 1 ? 'User' : 'Users';
  
  let hashedPassword;
  let cleanedUsers = [];
  let groupErrors = [];

  //VALIDATE FIRST WITHOUT THIS VALIDATEASYNC WILL FAIL ON ALL OF THEM WHICH IS NOT WHAT WE WANT
  //INITIAL DATA VALIDATION
  for (const value of reqBody) {
    try {
      const tempUser = await schemaUser.validateAsync(value, {stripUnknown: true});
      cleanedUsers.push(tempUser);
    } 
    catch (err) {
      groupErrors.push(err.details[0].message + " - " + value.displayName);
    }
  }
  
  if (cleanedUsers.length == 0) {
    log('No users have been added');
    log(groupErrors);

    return res.status(400).json({
      success:false,
      type: 'database_error',
      message: 'No users have been added',
      error: groupErrors
    });
  }

  //ATTEPT TO ADD PASSED USERS TO DB
  for (const cleanedUser of cleanedUsers) {
    hashedPassword = await bcrypt.hash(pepper + cleanedUser.password, 10);
  
    const query = `
      INSERT INTO users (
        display_name,
        email,
        password,
        account_type,
        visibility,
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
      log("User: Created - " + cleanedUser.displayName);
    } 
    catch (err) {
      //DUPLICATE CONSTRAINTS
      if (err.code === '23505') {
        if (err.constraint === 'unique_display_name') {
          groupErrors.push(`Invalid displayName: (${cleanedUser.displayName}) already exists`);
        }
        else {
          groupErrors.push(`${cleanedUser.email}' already exists`);
        }
      }
      else {
        console.error('Unexpected database error:', err);
      }
    }
  }

  const sendUser = returnAddJSON(req, grammar, groupErrors);
  return res.status(sendUser.status).json(
    sendUser.data
  );

});



app.listen(5000, () => {
  log('Server running on port 5000');
});

//TEST SHIZZLE
const post_tests = require ('./post_tests');
app.use('/', post_tests);