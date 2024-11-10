const validateChannelData = require('./channel');
const validateUpdateChannelData = require('./update-channel');
const validateDeleteChannelData = require('./delete-channel');
const {channelSchema,channelUpdateSchema,deleteChannelSchema} = require('../../utilities/validator');

const channelData = validateChannelData(validateDataForChannel);
const updateChannelData = validateUpdateChannelData(validateDataForUpdateChannel);
const deleteChannelData = validateDeleteChannelData(validateDataForDeleteChannel);

const Joi = require('joi');

async function validateDataForChannel(data) {
    try {
        await channelSchema.validateAsync(data);
    } catch (error) {
        throw error;
    }
}

async function validateDataForUpdateChannel(data){
      try{
        await channelUpdateSchema.validateAsync(data) 
      }
      catch(error){
        throw error;
    }
     
}

async function validateDataForDeleteChannel(data){
    try{
         await deleteChannelSchema.validateAsync(data) 
    }
    catch(error){
        throw error;
    }
}

module.exports = {
    channelData,
    updateChannelData,
    deleteChannelData
}