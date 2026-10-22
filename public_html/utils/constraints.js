const pool = require('../config/db');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const DEBUG = process.env.NODE_ENV === 'dev';
const {log} = require('../utils/helpers');

const constraintsEntry = (err, values = {}) => {
    const groupErrors = [];
    if (err.code === '23503') {
        switch (err.constraint) {
            case 'fk_entry_user':
                groupErrors.push(`Invalid user_id: (${values.user_id}) does not exist`);
            break;
            case 'fk_entry_hierarchy':
                groupErrors.push(`Invalid parent_id: (${values.parent_id}) does not exist`);
            break;
            case 'fk_media_condition':
                groupErrors.push(`Invalid media_condition: (${values.media_condition}) does not exist`);
            break;
            case 'fk_sleeve_condition':
                groupErrors.push(`Invalid sleeve_condition: (${values.sleeve_condition}) does not exist`);
            break;
            case 'fk_user_id':
                groupErrors.push(`Invalid user_id: (${values.user_id}) does not exist`);
            break;
            case 'fk_media_format':
                groupErrors.push(`Invalid media_format: (${values.media_format}) does not exist`);
            break;
            default:
            console.error('Database insert error:', err);
        }
    }
    else {
        console.error('Unexpected database error:', err);
    }
    return groupErrors;
}
const constraintsEntryGenre = (err, values = {}) => {
    const groupErrors = [];
    if (err.code === '23503') {    
        switch (err.constraint) {
            case 'fk_entry_id':
                log(`Invalid entry_id: (${values.entry_id})  does not exist`);
                groupErrors.push(`Invalid entry_id: (${values.entry_id})  does not exist`);
            break;
            case 'fk_genre_id':
                log(`Invalid genre_id: (${values.genre_id}) does not exist`);
                groupErrors.push(`Invalid genre_id: (${values.genre_id}) does not exist`);
            break;
            default:
                console.error('Database insert error:', err);
        }
    }
    else if (err.code === '23505') {
        if (err.constraint === 'unique_entry_id_genre_id') {
            log(`Invalid entry_genre (entry_id:${values.entry_id}, genre_id:${values.genre_id}) already exists`);
            groupErrors.push(`Invalid entry_genre (entry_id:${values.entry_id}, genre_id:${values.genre_id}) already exists`);
        }
    }
    else {
        console.error('Database insert error:', err);
    }
    
    return groupErrors;
}

const constraintsGenre = (err, values = {}) => {
    const groupErrors = [];
    if (err.code === '23503') {
        if (err.constraint === 'fk_genre_parent_id') {
          log(`Invalid parent_id: (${values.parent_id}) parent genre does not exist`);
          groupErrors.push(`Invalid parent_id: (${values.parent_id}) parent genre does not exist`);
        }
        else {
          console.error('Database insert error:', err);
        }
      }
      else if (err.code === '23505') {
        if (err.constraint === 'unique_genre_name') {
          log(`Invalid genre_name: (${values.genre_name}) already exists`);
          groupErrors.push(`Invalid genre_name: (${values.genre_name}) already exists`);
        }
        else {
          console.error('Database insert error:', err);
        }
      }
      else {
         console.error('Database insert error:', err);
      }
    
    return groupErrors;
}

const constraintsListEntry = (err, values = {}) => {
    const groupErrors = [];
    if (err.code === '23503') {
        let errorMessage = 'Invalid primary key constraint';
    
        switch (err.constraint) {
        case 'fk_list_id':
            errorMessage = `Invalid list_id: (${values.list_id}) list does not exist`;
            groupErrors.push(`Invalid list_id: (${values.list_id}) list does not exist`);
        break;
        case 'fk_entry_id':
            errorMessage = `Invalid entry_id: (${values.entry_id}) does not exist`;
            groupErrors.push(`Invalid entry_id: (${values.entry_id}) does not exist`);
        break;
        default: 
            console.error('Unexpected database error:', err);
        }
    }
    else if (err.code === '23505') {
        if(err.constraint === 'unique_list_id_entry_id') {
            log(`Invalid list_id: (${values.list_id}) entry_id: (${values.entry_id}) already exists`);
            groupErrors.push(`Invalid list_id: (${values.list_id}) entry_id: (${values.entry_id}) already exists`);
        }
        else {
            console.error('Unexpected database error:', err);
        }
    }
    else {
        console.error('Unexpected database error:', err);
    }
    
    return groupErrors;
}


const constraintsList = (err, values = {}) => {
    const groupErrors = [];
    if (err.code === '23503') {
        if (err.constraint === 'fk_user_id') {
          log(`Invalid user_id: ${values.user_id} does not exist`);
          groupErrors.push(`Invalid user_id: ${values.user_id} does not exist`);
        } else {
          console.error('Unexpected database error:', err);
        }
      }
      else if (err.code === '23505') {
        if (err.constraint === 'unique_user_list_name') {
          log(`Invalid user_id (${values.user_id}) , name (${values.name}): Duplicate list name for this user`);
          groupErrors.push(`Invalid user_id (${values.user_id}) , name (${values.name}): Duplicate list name for this user`);
        } else {
          console.error('Unexpected database error:', err);
        }
      }
      else {
        console.error('Unexpected database error:', err);
      }
    
    return groupErrors;
}

const constraintsMediaCondition = (err, values = {}) => {
    const groupErrors = [];
    if (err.code === '23505') {
        if (err.constraint === 'unique_media_condition') {
            log('Invalid media_condition: already exists');
            groupErrors.push(`Invalid media_condition: (${values.condition}) already exists`);
        }
    }
    else {
        console.error('Database insert error:', err);
    }
    return groupErrors;
}

const constraintsRelationship = (err, values = {}) => {
    const groupErrors = [];
    if (err.code === '23503') {
        switch (err.constraint) {
            case 'fk_relationship_user_id':
                log(`Invalid user_id: ${values.user_id} does not exist`);
                groupErrors.push(`Invalid user_id: ${values.user_id} does not exist`);
            break;
            case 'fk_relationship_user_target_id':
                log(`Invalid target_user_id: ${values.target_user_id} does not exist`);
                groupErrors.push(`Invalid target_user_id: ${values.target_user_id} does not exist`);
            break;
            default:
                console.error('Database insert error:', err);
        }
    }
    else if (err.code === '23505') {
        if (err.constraint === 'unique_user_target') {
            log(`Invalid userTarget: already assigned (${values.user_id} -> ${values.target_user_id})`);
            groupErrors.push(`Invalid userTarget: already assigned for user_id ${values.user_id}`);
        }
        else {
            console.error('Database insert error:', err);
        }
    } 
    else {
        console.error('Database insert error:', err);
    }
    return groupErrors;
}

const constraintsUser = (err, values = {}) => {
    const groupErrors = [];
    if (err.code === '23505') {
        if (err.constraint === 'unique_display_name') {
            log(`Invalid display_name: (${values.display_name}) already exists`);
            groupErrors.push(`Invalid display_name: (${values.display_name}) already exists`);
        }
        else if (err.constraint === 'unique_email') {
            log(`Invalid email: (${values.email}) already exists`);
            groupErrors.push(`Invalid email: (${values.email}) already exists`);
        }
        else {
            console.error('Unexpected database error:', err);
        }
    }
    else {
        console.error('Unexpected database error:', err);
    }
    return groupErrors;
}




module.exports = {
    constraintsEntry,
    constraintsEntryGenre,
    constraintsGenre,
    constraintsListEntry,
    constraintsList,
    constraintsMediaCondition,
    constraintsRelationship,
    constraintsUser
};