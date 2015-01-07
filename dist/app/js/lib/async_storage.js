define(["exports"], function (exports) {
  "use strict";

  var DB_NAME = "asyncStorage";
  var DB_VERSION = 1;
  var STORE_NAME = "keyvaluepairs";

  var db = null;

  function withDatabase(operation) {
    if (db) {
      operation();
      return;
    }

    var req = window.indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = function () {
      // First time setup: create an empty object store
      req.result.createObjectStore(STORE_NAME);
    };
    req.onsuccess = function () {
      db = req.result;
      operation();
    };
    req.onerror = function () {
      console.error("asyncStorage: can't open database:", req.error.name);
    };
  }

  function withStore(type, callback, complete) {
    withDatabase(function () {
      var transaction = db.transaction(STORE_NAME, type);
      if (typeof complete === "function") {
        transaction.oncomplete = complete;
      }
      callback(transaction.objectStore(STORE_NAME));
    });
  }

  function getItem(key, callback) {
    var req;
    withStore("readonly", function (store) {
      req = store.get(key);
      req.onerror = function () {
        console.error("Error in asyncStorage.getItem(): ", req.error.name);
      };
    }, function () {
      var value = req.result;
      if (value === undefined) {
        value = null;
      }
      callback(value);
    });
  }

  function setItem(key, value, callback) {
    withStore("readwrite", function (store) {
      var req = store.put(value, key);
      req.onerror = function () {
        console.error("Error in asyncStorage.setItem(): ", req.error.name);
      };
    }, callback);
  }

  function removeItem(key, callback) {
    withStore("readwrite", function (store) {
      var req = store["delete"](key);
      req.onerror = function () {
        console.error("Error in asyncStorage.removeItem(): ", req.error.name);
      };
    }, callback);
  }

  function clear(callback) {
    withStore("readwrite", function (store) {
      var req = store.clear();
      req.onerror = function () {
        console.error("Error in asyncStorage.clear(): ", req.error.name);
      };
    }, callback);
  }

  function length(callback) {
    var req;
    withStore("readonly", function (store) {
      req = store.count();
      req.onerror = function () {
        console.error("Error in asyncStorage.length(): ", req.error.name);
      };
    }, function () {
      callback(req.result);
    });
  }

  function key(n, callback) {
    if (n < 0) {
      callback(null);
      return;
    }

    var req;
    withStore("readonly", function (store) {
      var advanced = false;
      req = store.openCursor();
      req.onsuccess = function () {
        var cursor = req.result;
        if (!cursor) {
          // this means there weren't enough keys
          return;
        }
        if (n === 0 || advanced) {
          // Either 1) we have the first key, return it if that's what they
          // wanted, or 2) we've got the nth key.
          return;
        }

        // Otherwise, ask the cursor to skip ahead n records
        advanced = true;
        cursor.advance(n);
      };
      req.onerror = function () {
        console.error("Error in asyncStorage.key(): ", req.error.name);
      };
    }, function () {
      var cursor = req.result;
      callback(cursor && cursor.key);
    });
  }

  var asyncStorage = {
    getItem: getItem,
    setItem: setItem,
    removeItem: removeItem,
    clear: clear,
    length: length,
    key: key
  };

  exports["default"] = asyncStorage;
});