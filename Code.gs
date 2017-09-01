//234567890123456789012345678901234567890123456789012345678901234567890123456789

// JShint: TODO

// Test sheet for Assert Library:
//
// MN2v6JNucOc0S385I-FMvAB8_L47d2MW6

/*
 * Copyright (C) 2014 Andrew Roberts
 * 
 * This program is free software: you can redistribute it and/or modify it under
 * the terms of the GNU General Public License as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option) any later 
 * version.
 * 
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License along with 
 * this program. If not, see http://www.gnu.org/licenses/.
 */

var HANDLE_ERROR = Assert.HandleError.DISPLAY 
var SEND_ERROR_EMAIL = false
var ADMIN_EMAIL_ADDRESS = 'andrewr1969@gmail.com'
var SCRIPT_NAME = 'Assert test sheet'
var SCRIPT_VERSION = 'v13'

// Logging
// -------

var LOG_LEVEL = Log.Level.ALL
var LOG_DISPLAY_FUNCTION_NAMES = Log.DisplayFunctionNames.YES

function onOpen() {

  SpreadsheetApp
    .getUi()
    .createMenu('Test Assert library')
    .addItem('Run tests...' , 'test_assert_gs')
    .addItem('Clear log sheet...', 'clearLogSheet')
    .addToUi();
}

function clearLogSheet() {

  Log.clear();
}

// Example of using the Assert library
// -----------------------------------
//
// Create a eventHandler_() function to hold high-level activities
// relevant to all: logging, exception handling, etc. And from within
// here you can call Assert.handleError().

var EVENT_HANDLERS = {

//                         Initial actions  Name                         onError Message                        Main Functionality
//                         ---------------  ----                         ---------------                        ------------------

  eventFooHandler:         [function() {},  'eventFooHandler()',         'Failed to call eventHandler()',       eventFooHandler_],
}

// function ()                     {eventHandler_(EVENT_HANDLERS.)}

function eventFooHandler(event) {return eventHandler_(EVENT_HANDLERS.eventFooHandler, event)}

function eventFooHandler_() {

  throw new Error('throwing error in eventFooHandler_()');
  
} // eventFooHandler_()

/**
 * All external function calls should call this to ensure standard 
 * processing - logging, errors, etc - is always done.
 *
 * @param {array} config:
 *   [0] {function} prefunction
 *   [1] {string} eventName
 *   [2] {string} onErrorMessage
 *   [3] {function} mainFunction
 * @parma {object} arg The argument passed to the top-level event handler
 */

function eventHandler_(config, arg) {

  try {

    config[0]()

    Log.init({
      level: LOG_LEVEL, 
      sheetId: SpreadsheetApp.getActive().getId(),
      displayFunctionNames: LOG_DISPLAY_FUNCTION_NAMES,
    })
    
    Log.info('Handling ' + config[1])
    
    Assert.init({
      handleError: HANDLE_ERROR, 
      sendErrorEmail: SEND_ERROR_EMAIL, 
      emailAddress: ADMIN_EMAIL_ADDRESS,
      scriptName: SCRIPT_NAME,
      scriptVersion: SCRIPT_VERSION,
    })
      
    return config[3](arg)
    
  } catch (error) {

    Assert.handleError(error, config[2], Log)
    return error.message
  }
  
} // eventHandler_()

// Test functions
// --------------

function test_assert_gs() {

  var functionName = 'test_assert_gs()';
  
  Log.init({
    level: Log.Level.ALL, 
    displayFunctionNames: Log.DisplayFunctionNames.NO});
    
  Log.info('TESTS START');
  
  // assert()
  // =========
  
  Assert.init({handleError: Assert.HandleError.THROW});

  // Test
  // ----

  try {
    
    Assert.assert();
    
  } catch (error) {
  
    if (error.name === 'Error') {
      
      Log.info('TEST PASSED. ' + error.message);
      
    } else {
    
      throw new Error(functionName, 'TEST FAILED - 1st arg not boolean.');
    }
  }
  
  // Test
  // ----

  try {
    
    Assert.assert(true, 1);
    
  } catch (error) {
  
    if (error.name === 'Error') {
      
      Log.info('TEST PASSED. ' + error.message);
      
    } else {
    
      throw new Error(functionName, 'TEST FAILED - 2nd arg not a string.');
    }
  }

  // Test
  // ----

  try {
    
    Assert.assert(true, 'string 1', 1);
    
  } catch (error) {
  
    if (error.name === 'Error') {
      
      Log.info('TEST PASSED. ' + error.message);
      
    } else {
    
      throw new Error(functionName, 'TEST FAILED - 3rd arg not a string.');
    }
  }

  try {
    
    Assert.assert(false, functionName, 'string 2');
    
  } catch (error) {
  
    if (error.name === 'Error') {
      
      Log.info('TEST PASSED. ' + error.message);
      
    } else {
    
      throw new Error(functionName, 'TEST FAILED - Assertion failed.');
    }
  }

  // Test
  // ----

  Assert.init({handleError: Assert.HandleError.DISPLAY});

  try {

    Assert.assert(
      false, 
      functionName, 
      'Display this in a dialog');
  
  } catch (error) {
  
    Assert.handleError(error, 'Testing handleError()', Log);
  }
  
  Assert.init(Assert.HandleError.THROW);  

  try {

    Assert.assert(
      false, 
      functionName, 
      'throw this error');
  
  } catch (error) {
  
    try {
    
      Assert.handleError(error, 'Testing handleError()', Log);
    
    } catch (error) {
    
      Log.info('TEST PASSED: Caught thrown error');
    }
  }
  
  // handleExternalFunctionCall_()
  // =============================
  
  var testFunctionName = 'testFunctionName';
  
  // handleExternalFunctionCall_(functionName, userMessage, functionCall)  
  
/* TODO - Need to redo these tests as handleError() is now hidden.

  // Test
  // ----

  handleExternalFunctionCall_();

  try {
  
    throw new Error('TEST PASSED');
    
  } catch (error) {
    
    try {
    
      handleError(error);
      
    } catch (e2) {
    
      Log.info(e2.message); 
    }
  }

  // Test
  // ----

  try {
    
    handleError(new Error('Test'), 1);
    
  } catch (error) {
  
    if (error.name === 'TypeError') {
      
      Log.info('TEST PASSED.');
      
    } else {
    
      throw new Error(functionName, 'TEST FAILED.');
    }
  }

  // Test
  // ----

  try {
  
    throw new Error('TEST ');
    
  } catch (error) {
    
    try {
    
      handleError(error, 'PASSED');
      
    } catch (error2) {
    
      Log.info(error2.message); 
      
    }
  }

*/

  Log.info('!!!!! ALL TESTS PASSED !!!!');

} // test_assert_gs()

function test_init() {

  var a = null;
  var b = null;

//  Logger.log(typeof b);

  Assert.init({
    handleError: HANDLE_ERROR, 
    sendErrorEmail: SEND_ERROR_EMAIL, 
    emailAddress: ADMIN_EMAIL_ADDRESS,
    scriptName: SCRIPT_NAME,
    scriptVersion: SCRIPT_VERSION,
  })

//  PropertiesService.getUserProperties().deleteProperty('key');
//  Logger.log(PropertiesService.getUserProperties().getProperties());
//  Logger.log(PropertiesService.getDocumentProperties().getProperties());
//  Logger.log(PropertiesService.getScriptProperties().getProperties());  
}  

function test_eventFooHandler() {

  var a = eventFooHandler()
  Log.info('eventFooHandler() returned: ' + a)
  return a
}
