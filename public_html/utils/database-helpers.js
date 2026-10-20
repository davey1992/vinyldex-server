const pool = require('../config/db');

const path = require('path');
const joi = require('joi');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const DEBUG = process.env.NODE_ENV === 'dev';

const {log} = require('./helpers');

const acceptedOperators = ["=","!=","<",">","LIKE"];

const sanitizeColumns = (chosenColumns, schema) => {

 
  if (
    chosenColumns === undefined ||
    !Array.isArray(chosenColumns) || 
    chosenColumns.length === 0
  ) {
    return "*";
  }

  const columnString = chosenColumns.join(',');

  if (!/^[a-z0-9_,]+$/.test(columnString)) {
    throw new Error('Security violation: Invalid column characters detected.');
  }

  const keys = Object.keys(schema.describe().keys);
  for (const column of chosenColumns) {
    if(keys.includes(column) === false) {
        throw new Error('Security violation: Invalid column');
    }
  }

  return columnString;
}
const validatedEntries = async(json, schema) => {
  const reqBody = Array.isArray(json) ? json : [json];
  const entries = [];
  const errors = [];

  for (const value of reqBody) {
    try {
      const tempEntry = await schema.validateAsync(value, {stripUnknown: true});
      entries.push(tempEntry);
    } 
    catch (err) {
      errors.push(err.details[0].message + " - " + value.title);
    }
  }

  return {
    entries,
    errors
  }
}
const validatedQuerySearch = (searchJSON) => {
  const values = [];
  let counter = 0;
  let searchColumns = "";

  if (!Array.isArray(searchJSON)) {
    console.log('Error Type');
    return {}
  }

  for (const item of searchJSON) {
    item.operator = item.operator.toUpperCase();
    let caseSensitiveString = `${item.field}`;
    let valueString = "";
    let queryOperator = "=";
  
    valueString = item.value;

    if (item.caseSensitive) {
        if (typeof item.value === "string") {
          caseSensitiveString = `LOWER(${item.field})`;
          valueString = item.value.toLowerCase();
        }
    }

    if (item.operator === "LIKE") {
      valueString = `%${valueString}%`;
    }

    if (acceptedOperators.includes(item.operator)) {
      counter++;
      values.push(valueString);

      queryOperator = item.operator;
      searchColumns += ` AND ${caseSensitiveString} ${queryOperator} $${counter}`;
      
    }
  }
  return {searchColumns, values}
}
const validatedSearchJSON = async (json, schema) => {
  // DESIGNED TO CLEAN THE JSON AS ALL OF THIS MAY NOT BE APPLIED
  if (!json || (typeof json === 'object' && Object.keys(json).length === 0)) {
    return [];
  }
  let search = [];
  let entry;
  let error;

  for (let jsonItem of json) {
    if (!jsonItem || !jsonItem.field) {
      continue;
    }
    let tempBuilder = {}; 
    tempBuilder[jsonItem.field] = jsonItem.value;

    try {
      entry = await schema.validateAsync(tempBuilder, { stripUnknown: true });
      
      const fieldKey = Object.keys(entry)[0];

      if (search !== undefined) {
        search.push({
          field: fieldKey,
          value: entry[fieldKey],
          operator: jsonItem.operator ?? '=',
          caseSensitive: jsonItem.caseSensitive ?? true
        });
      }
    } 
    catch (err) {
      error = err.details[0].message;
    }
  }
  
  return search;
};

const basicReadTemplate = async(req, res, schemaFunction, tableName, allowEmptySearch = false) => {

    if (!req.body.search) {
      if (allowEmptySearch === false) {
        log(`Search object must exist for ${tableName}`);
        return res.status(400).json({ 
            success: false, 
            type: 'invalid_type', 
            message: 'Search must be an object' 
        });
      }
    }

    try {
        const chosenColumns = sanitizeColumns(req.body.columns, schemaFunction());
        const searchJSON = await validatedSearchJSON(req.body.search, schemaFunction(true));
        const querySearch = validatedQuerySearch(searchJSON);
        
        const query = `SELECT ${chosenColumns} FROM ${tableName} WHERE true ${querySearch.searchColumns}`;
        const result = await pool.query(query, querySearch.values);
        

        console.log(query);
        return { 
            success: true, 
            data: result.rows 
        };
    } 
    catch (err) {
        log(`[Security/Validation Warning]: ${err.message}`);
        return { 
            success: false, 
            type: 'json_error', 
            message: 'Incorrect JSON Supplied' 
        };
    }
}

module.exports = {
    basicReadTemplate,
    sanitizeColumns,
    validatedEntries,
    validatedQuerySearch,
    validatedSearchJSON
};