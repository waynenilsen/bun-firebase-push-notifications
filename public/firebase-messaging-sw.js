// node_modules/@firebase/util/dist/index.esm2017.js
function getGlobal() {
  if (typeof self !== "undefined") {
    return self;
  }
  if (typeof window !== "undefined") {
    return window;
  }
  if (typeof global !== "undefined") {
    return global;
  }
  throw new Error("Unable to locate global object.");
}
function isIndexedDBAvailable() {
  try {
    return typeof indexedDB === "object";
  } catch (e) {
    return false;
  }
}
function validateIndexedDBOpenable() {
  return new Promise((resolve, reject) => {
    try {
      let preExist = true;
      const DB_CHECK_NAME = "validate-browser-context-for-indexeddb-analytics-module";
      const request = self.indexedDB.open(DB_CHECK_NAME);
      request.onsuccess = () => {
        request.result.close();
        if (!preExist) {
          self.indexedDB.deleteDatabase(DB_CHECK_NAME);
        }
        resolve(true);
      };
      request.onupgradeneeded = () => {
        preExist = false;
      };
      request.onerror = () => {
        var _a;
        reject(((_a = request.error) === null || _a === undefined ? undefined : _a.message) || "");
      };
    } catch (error) {
      reject(error);
    }
  });
}
function replaceTemplate(template, data) {
  return template.replace(PATTERN, (_, key) => {
    const value = data[key];
    return value != null ? String(value) : `<${key}?>`;
  });
}
function deepEqual(a, b) {
  if (a === b) {
    return true;
  }
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  for (const k of aKeys) {
    if (!bKeys.includes(k)) {
      return false;
    }
    const aProp = a[k];
    const bProp = b[k];
    if (isObject(aProp) && isObject(bProp)) {
      if (!deepEqual(aProp, bProp)) {
        return false;
      }
    } else if (aProp !== bProp) {
      return false;
    }
  }
  for (const k of bKeys) {
    if (!aKeys.includes(k)) {
      return false;
    }
  }
  return true;
}
function isObject(thing) {
  return thing !== null && typeof thing === "object";
}
function getModularInstance(service) {
  if (service && service._delegate) {
    return service._delegate;
  } else {
    return service;
  }
}
var stringToByteArray$1 = function(str) {
  const out = [];
  let p = 0;
  for (let i = 0;i < str.length; i++) {
    let c = str.charCodeAt(i);
    if (c < 128) {
      out[p++] = c;
    } else if (c < 2048) {
      out[p++] = c >> 6 | 192;
      out[p++] = c & 63 | 128;
    } else if ((c & 64512) === 55296 && i + 1 < str.length && (str.charCodeAt(i + 1) & 64512) === 56320) {
      c = 65536 + ((c & 1023) << 10) + (str.charCodeAt(++i) & 1023);
      out[p++] = c >> 18 | 240;
      out[p++] = c >> 12 & 63 | 128;
      out[p++] = c >> 6 & 63 | 128;
      out[p++] = c & 63 | 128;
    } else {
      out[p++] = c >> 12 | 224;
      out[p++] = c >> 6 & 63 | 128;
      out[p++] = c & 63 | 128;
    }
  }
  return out;
};
var byteArrayToString = function(bytes) {
  const out = [];
  let pos = 0, c = 0;
  while (pos < bytes.length) {
    const c1 = bytes[pos++];
    if (c1 < 128) {
      out[c++] = String.fromCharCode(c1);
    } else if (c1 > 191 && c1 < 224) {
      const c2 = bytes[pos++];
      out[c++] = String.fromCharCode((c1 & 31) << 6 | c2 & 63);
    } else if (c1 > 239 && c1 < 365) {
      const c2 = bytes[pos++];
      const c3 = bytes[pos++];
      const c4 = bytes[pos++];
      const u = ((c1 & 7) << 18 | (c2 & 63) << 12 | (c3 & 63) << 6 | c4 & 63) - 65536;
      out[c++] = String.fromCharCode(55296 + (u >> 10));
      out[c++] = String.fromCharCode(56320 + (u & 1023));
    } else {
      const c2 = bytes[pos++];
      const c3 = bytes[pos++];
      out[c++] = String.fromCharCode((c1 & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
    }
  }
  return out.join("");
};
var base64 = {
  byteToCharMap_: null,
  charToByteMap_: null,
  byteToCharMapWebSafe_: null,
  charToByteMapWebSafe_: null,
  ENCODED_VALS_BASE: "ABCDEFGHIJKLMNOPQRSTUVWXYZ" + "abcdefghijklmnopqrstuvwxyz" + "0123456789",
  get ENCODED_VALS() {
    return this.ENCODED_VALS_BASE + "+/=";
  },
  get ENCODED_VALS_WEBSAFE() {
    return this.ENCODED_VALS_BASE + "-_.";
  },
  HAS_NATIVE_SUPPORT: typeof atob === "function",
  encodeByteArray(input, webSafe) {
    if (!Array.isArray(input)) {
      throw Error("encodeByteArray takes an array as a parameter");
    }
    this.init_();
    const byteToCharMap = webSafe ? this.byteToCharMapWebSafe_ : this.byteToCharMap_;
    const output = [];
    for (let i = 0;i < input.length; i += 3) {
      const byte1 = input[i];
      const haveByte2 = i + 1 < input.length;
      const byte2 = haveByte2 ? input[i + 1] : 0;
      const haveByte3 = i + 2 < input.length;
      const byte3 = haveByte3 ? input[i + 2] : 0;
      const outByte1 = byte1 >> 2;
      const outByte2 = (byte1 & 3) << 4 | byte2 >> 4;
      let outByte3 = (byte2 & 15) << 2 | byte3 >> 6;
      let outByte4 = byte3 & 63;
      if (!haveByte3) {
        outByte4 = 64;
        if (!haveByte2) {
          outByte3 = 64;
        }
      }
      output.push(byteToCharMap[outByte1], byteToCharMap[outByte2], byteToCharMap[outByte3], byteToCharMap[outByte4]);
    }
    return output.join("");
  },
  encodeString(input, webSafe) {
    if (this.HAS_NATIVE_SUPPORT && !webSafe) {
      return btoa(input);
    }
    return this.encodeByteArray(stringToByteArray$1(input), webSafe);
  },
  decodeString(input, webSafe) {
    if (this.HAS_NATIVE_SUPPORT && !webSafe) {
      return atob(input);
    }
    return byteArrayToString(this.decodeStringToByteArray(input, webSafe));
  },
  decodeStringToByteArray(input, webSafe) {
    this.init_();
    const charToByteMap = webSafe ? this.charToByteMapWebSafe_ : this.charToByteMap_;
    const output = [];
    for (let i = 0;i < input.length; ) {
      const byte1 = charToByteMap[input.charAt(i++)];
      const haveByte2 = i < input.length;
      const byte2 = haveByte2 ? charToByteMap[input.charAt(i)] : 0;
      ++i;
      const haveByte3 = i < input.length;
      const byte3 = haveByte3 ? charToByteMap[input.charAt(i)] : 64;
      ++i;
      const haveByte4 = i < input.length;
      const byte4 = haveByte4 ? charToByteMap[input.charAt(i)] : 64;
      ++i;
      if (byte1 == null || byte2 == null || byte3 == null || byte4 == null) {
        throw new DecodeBase64StringError;
      }
      const outByte1 = byte1 << 2 | byte2 >> 4;
      output.push(outByte1);
      if (byte3 !== 64) {
        const outByte2 = byte2 << 4 & 240 | byte3 >> 2;
        output.push(outByte2);
        if (byte4 !== 64) {
          const outByte3 = byte3 << 6 & 192 | byte4;
          output.push(outByte3);
        }
      }
    }
    return output;
  },
  init_() {
    if (!this.byteToCharMap_) {
      this.byteToCharMap_ = {};
      this.charToByteMap_ = {};
      this.byteToCharMapWebSafe_ = {};
      this.charToByteMapWebSafe_ = {};
      for (let i = 0;i < this.ENCODED_VALS.length; i++) {
        this.byteToCharMap_[i] = this.ENCODED_VALS.charAt(i);
        this.charToByteMap_[this.byteToCharMap_[i]] = i;
        this.byteToCharMapWebSafe_[i] = this.ENCODED_VALS_WEBSAFE.charAt(i);
        this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[i]] = i;
        if (i >= this.ENCODED_VALS_BASE.length) {
          this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(i)] = i;
          this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(i)] = i;
        }
      }
    }
  }
};

class DecodeBase64StringError extends Error {
  constructor() {
    super(...arguments);
    this.name = "DecodeBase64StringError";
  }
}
var base64Encode = function(str) {
  const utf8Bytes = stringToByteArray$1(str);
  return base64.encodeByteArray(utf8Bytes, true);
};
var base64urlEncodeWithoutPadding = function(str) {
  return base64Encode(str).replace(/\./g, "");
};
var base64Decode = function(str) {
  try {
    return base64.decodeString(str, true);
  } catch (e) {
    console.error("base64Decode failed: ", e);
  }
  return null;
};
var getDefaultsFromGlobal = () => getGlobal().__FIREBASE_DEFAULTS__;
var getDefaultsFromEnvVariable = () => {
  if (typeof process === "undefined" || typeof process.env === "undefined") {
    return;
  }
  const defaultsJsonString = process.env.__FIREBASE_DEFAULTS__;
  if (defaultsJsonString) {
    return JSON.parse(defaultsJsonString);
  }
};
var getDefaultsFromCookie = () => {
  if (typeof document === "undefined") {
    return;
  }
  let match;
  try {
    match = document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/);
  } catch (e) {
    return;
  }
  const decoded = match && base64Decode(match[1]);
  return decoded && JSON.parse(decoded);
};
var getDefaults = () => {
  try {
    return getDefaultsFromGlobal() || getDefaultsFromEnvVariable() || getDefaultsFromCookie();
  } catch (e) {
    console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${e}`);
    return;
  }
};
var getDefaultAppConfig = () => {
  var _a;
  return (_a = getDefaults()) === null || _a === undefined ? undefined : _a.config;
};
class Deferred {
  constructor() {
    this.reject = () => {
    };
    this.resolve = () => {
    };
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }
  wrapCallback(callback) {
    return (error, value) => {
      if (error) {
        this.reject(error);
      } else {
        this.resolve(value);
      }
      if (typeof callback === "function") {
        this.promise.catch(() => {
        });
        if (callback.length === 1) {
          callback(error);
        } else {
          callback(error, value);
        }
      }
    };
  }
}
var ERROR_NAME = "FirebaseError";

class FirebaseError extends Error {
  constructor(code, message, customData) {
    super(message);
    this.code = code;
    this.customData = customData;
    this.name = ERROR_NAME;
    Object.setPrototypeOf(this, FirebaseError.prototype);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ErrorFactory.prototype.create);
    }
  }
}

class ErrorFactory {
  constructor(service, serviceName, errors) {
    this.service = service;
    this.serviceName = serviceName;
    this.errors = errors;
  }
  create(code, ...data) {
    const customData = data[0] || {};
    const fullCode = `${this.service}/${code}`;
    const template = this.errors[code];
    const message = template ? replaceTemplate(template, customData) : "Error";
    const fullMessage = `${this.serviceName}: ${message} (${fullCode}).`;
    const error = new FirebaseError(fullCode, fullMessage, customData);
    return error;
  }
}
var PATTERN = /\{\$([^}]+)}/g;
var MAX_VALUE_MILLIS = 4 * 60 * 60 * 1000;

// node_modules/@firebase/component/dist/esm/index.esm2017.js
function normalizeIdentifierForFactory(identifier) {
  return identifier === DEFAULT_ENTRY_NAME ? undefined : identifier;
}
function isComponentEager(component) {
  return component.instantiationMode === "EAGER";
}

class Component {
  constructor(name, instanceFactory, type) {
    this.name = name;
    this.instanceFactory = instanceFactory;
    this.type = type;
    this.multipleInstances = false;
    this.serviceProps = {};
    this.instantiationMode = "LAZY";
    this.onInstanceCreated = null;
  }
  setInstantiationMode(mode) {
    this.instantiationMode = mode;
    return this;
  }
  setMultipleInstances(multipleInstances) {
    this.multipleInstances = multipleInstances;
    return this;
  }
  setServiceProps(props) {
    this.serviceProps = props;
    return this;
  }
  setInstanceCreatedCallback(callback) {
    this.onInstanceCreated = callback;
    return this;
  }
}
var DEFAULT_ENTRY_NAME = "[DEFAULT]";

class Provider {
  constructor(name, container) {
    this.name = name;
    this.container = container;
    this.component = null;
    this.instances = new Map;
    this.instancesDeferred = new Map;
    this.instancesOptions = new Map;
    this.onInitCallbacks = new Map;
  }
  get(identifier) {
    const normalizedIdentifier = this.normalizeInstanceIdentifier(identifier);
    if (!this.instancesDeferred.has(normalizedIdentifier)) {
      const deferred = new Deferred;
      this.instancesDeferred.set(normalizedIdentifier, deferred);
      if (this.isInitialized(normalizedIdentifier) || this.shouldAutoInitialize()) {
        try {
          const instance = this.getOrInitializeService({
            instanceIdentifier: normalizedIdentifier
          });
          if (instance) {
            deferred.resolve(instance);
          }
        } catch (e) {
        }
      }
    }
    return this.instancesDeferred.get(normalizedIdentifier).promise;
  }
  getImmediate(options) {
    var _a;
    const normalizedIdentifier = this.normalizeInstanceIdentifier(options === null || options === undefined ? undefined : options.identifier);
    const optional = (_a = options === null || options === undefined ? undefined : options.optional) !== null && _a !== undefined ? _a : false;
    if (this.isInitialized(normalizedIdentifier) || this.shouldAutoInitialize()) {
      try {
        return this.getOrInitializeService({
          instanceIdentifier: normalizedIdentifier
        });
      } catch (e) {
        if (optional) {
          return null;
        } else {
          throw e;
        }
      }
    } else {
      if (optional) {
        return null;
      } else {
        throw Error(`Service ${this.name} is not available`);
      }
    }
  }
  getComponent() {
    return this.component;
  }
  setComponent(component) {
    if (component.name !== this.name) {
      throw Error(`Mismatching Component ${component.name} for Provider ${this.name}.`);
    }
    if (this.component) {
      throw Error(`Component for ${this.name} has already been provided`);
    }
    this.component = component;
    if (!this.shouldAutoInitialize()) {
      return;
    }
    if (isComponentEager(component)) {
      try {
        this.getOrInitializeService({ instanceIdentifier: DEFAULT_ENTRY_NAME });
      } catch (e) {
      }
    }
    for (const [instanceIdentifier, instanceDeferred] of this.instancesDeferred.entries()) {
      const normalizedIdentifier = this.normalizeInstanceIdentifier(instanceIdentifier);
      try {
        const instance = this.getOrInitializeService({
          instanceIdentifier: normalizedIdentifier
        });
        instanceDeferred.resolve(instance);
      } catch (e) {
      }
    }
  }
  clearInstance(identifier = DEFAULT_ENTRY_NAME) {
    this.instancesDeferred.delete(identifier);
    this.instancesOptions.delete(identifier);
    this.instances.delete(identifier);
  }
  async delete() {
    const services = Array.from(this.instances.values());
    await Promise.all([
      ...services.filter((service) => ("INTERNAL" in service)).map((service) => service.INTERNAL.delete()),
      ...services.filter((service) => ("_delete" in service)).map((service) => service._delete())
    ]);
  }
  isComponentSet() {
    return this.component != null;
  }
  isInitialized(identifier = DEFAULT_ENTRY_NAME) {
    return this.instances.has(identifier);
  }
  getOptions(identifier = DEFAULT_ENTRY_NAME) {
    return this.instancesOptions.get(identifier) || {};
  }
  initialize(opts = {}) {
    const { options = {} } = opts;
    const normalizedIdentifier = this.normalizeInstanceIdentifier(opts.instanceIdentifier);
    if (this.isInitialized(normalizedIdentifier)) {
      throw Error(`${this.name}(${normalizedIdentifier}) has already been initialized`);
    }
    if (!this.isComponentSet()) {
      throw Error(`Component ${this.name} has not been registered yet`);
    }
    const instance = this.getOrInitializeService({
      instanceIdentifier: normalizedIdentifier,
      options
    });
    for (const [instanceIdentifier, instanceDeferred] of this.instancesDeferred.entries()) {
      const normalizedDeferredIdentifier = this.normalizeInstanceIdentifier(instanceIdentifier);
      if (normalizedIdentifier === normalizedDeferredIdentifier) {
        instanceDeferred.resolve(instance);
      }
    }
    return instance;
  }
  onInit(callback, identifier) {
    var _a;
    const normalizedIdentifier = this.normalizeInstanceIdentifier(identifier);
    const existingCallbacks = (_a = this.onInitCallbacks.get(normalizedIdentifier)) !== null && _a !== undefined ? _a : new Set;
    existingCallbacks.add(callback);
    this.onInitCallbacks.set(normalizedIdentifier, existingCallbacks);
    const existingInstance = this.instances.get(normalizedIdentifier);
    if (existingInstance) {
      callback(existingInstance, normalizedIdentifier);
    }
    return () => {
      existingCallbacks.delete(callback);
    };
  }
  invokeOnInitCallbacks(instance, identifier) {
    const callbacks = this.onInitCallbacks.get(identifier);
    if (!callbacks) {
      return;
    }
    for (const callback of callbacks) {
      try {
        callback(instance, identifier);
      } catch (_a) {
      }
    }
  }
  getOrInitializeService({ instanceIdentifier, options = {} }) {
    let instance = this.instances.get(instanceIdentifier);
    if (!instance && this.component) {
      instance = this.component.instanceFactory(this.container, {
        instanceIdentifier: normalizeIdentifierForFactory(instanceIdentifier),
        options
      });
      this.instances.set(instanceIdentifier, instance);
      this.instancesOptions.set(instanceIdentifier, options);
      this.invokeOnInitCallbacks(instance, instanceIdentifier);
      if (this.component.onInstanceCreated) {
        try {
          this.component.onInstanceCreated(this.container, instanceIdentifier, instance);
        } catch (_a) {
        }
      }
    }
    return instance || null;
  }
  normalizeInstanceIdentifier(identifier = DEFAULT_ENTRY_NAME) {
    if (this.component) {
      return this.component.multipleInstances ? identifier : DEFAULT_ENTRY_NAME;
    } else {
      return identifier;
    }
  }
  shouldAutoInitialize() {
    return !!this.component && this.component.instantiationMode !== "EXPLICIT";
  }
}

class ComponentContainer {
  constructor(name) {
    this.name = name;
    this.providers = new Map;
  }
  addComponent(component) {
    const provider = this.getProvider(component.name);
    if (provider.isComponentSet()) {
      throw new Error(`Component ${component.name} has already been registered with ${this.name}`);
    }
    provider.setComponent(component);
  }
  addOrOverwriteComponent(component) {
    const provider = this.getProvider(component.name);
    if (provider.isComponentSet()) {
      this.providers.delete(component.name);
    }
    this.addComponent(component);
  }
  getProvider(name) {
    if (this.providers.has(name)) {
      return this.providers.get(name);
    }
    const provider = new Provider(name, this);
    this.providers.set(name, provider);
    return provider;
  }
  getProviders() {
    return Array.from(this.providers.values());
  }
}

// node_modules/@firebase/logger/dist/esm/index.esm2017.js
var instances = [];
var LogLevel;
(function(LogLevel2) {
  LogLevel2[LogLevel2["DEBUG"] = 0] = "DEBUG";
  LogLevel2[LogLevel2["VERBOSE"] = 1] = "VERBOSE";
  LogLevel2[LogLevel2["INFO"] = 2] = "INFO";
  LogLevel2[LogLevel2["WARN"] = 3] = "WARN";
  LogLevel2[LogLevel2["ERROR"] = 4] = "ERROR";
  LogLevel2[LogLevel2["SILENT"] = 5] = "SILENT";
})(LogLevel || (LogLevel = {}));
var levelStringToEnum = {
  debug: LogLevel.DEBUG,
  verbose: LogLevel.VERBOSE,
  info: LogLevel.INFO,
  warn: LogLevel.WARN,
  error: LogLevel.ERROR,
  silent: LogLevel.SILENT
};
var defaultLogLevel = LogLevel.INFO;
var ConsoleMethod = {
  [LogLevel.DEBUG]: "log",
  [LogLevel.VERBOSE]: "log",
  [LogLevel.INFO]: "info",
  [LogLevel.WARN]: "warn",
  [LogLevel.ERROR]: "error"
};
var defaultLogHandler = (instance, logType, ...args) => {
  if (logType < instance.logLevel) {
    return;
  }
  const now = new Date().toISOString();
  const method = ConsoleMethod[logType];
  if (method) {
    console[method](`[${now}]  ${instance.name}:`, ...args);
  } else {
    throw new Error(`Attempted to log a message with an invalid logType (value: ${logType})`);
  }
};

class Logger {
  constructor(name) {
    this.name = name;
    this._logLevel = defaultLogLevel;
    this._logHandler = defaultLogHandler;
    this._userLogHandler = null;
    instances.push(this);
  }
  get logLevel() {
    return this._logLevel;
  }
  set logLevel(val) {
    if (!(val in LogLevel)) {
      throw new TypeError(`Invalid value "${val}" assigned to \`logLevel\``);
    }
    this._logLevel = val;
  }
  setLogLevel(val) {
    this._logLevel = typeof val === "string" ? levelStringToEnum[val] : val;
  }
  get logHandler() {
    return this._logHandler;
  }
  set logHandler(val) {
    if (typeof val !== "function") {
      throw new TypeError("Value assigned to `logHandler` must be a function");
    }
    this._logHandler = val;
  }
  get userLogHandler() {
    return this._userLogHandler;
  }
  set userLogHandler(val) {
    this._userLogHandler = val;
  }
  debug(...args) {
    this._userLogHandler && this._userLogHandler(this, LogLevel.DEBUG, ...args);
    this._logHandler(this, LogLevel.DEBUG, ...args);
  }
  log(...args) {
    this._userLogHandler && this._userLogHandler(this, LogLevel.VERBOSE, ...args);
    this._logHandler(this, LogLevel.VERBOSE, ...args);
  }
  info(...args) {
    this._userLogHandler && this._userLogHandler(this, LogLevel.INFO, ...args);
    this._logHandler(this, LogLevel.INFO, ...args);
  }
  warn(...args) {
    this._userLogHandler && this._userLogHandler(this, LogLevel.WARN, ...args);
    this._logHandler(this, LogLevel.WARN, ...args);
  }
  error(...args) {
    this._userLogHandler && this._userLogHandler(this, LogLevel.ERROR, ...args);
    this._logHandler(this, LogLevel.ERROR, ...args);
  }
}
// node_modules/idb/build/wrap-idb-value.js
function getIdbProxyableTypes() {
  return idbProxyableTypes || (idbProxyableTypes = [
    IDBDatabase,
    IDBObjectStore,
    IDBIndex,
    IDBCursor,
    IDBTransaction
  ]);
}
function getCursorAdvanceMethods() {
  return cursorAdvanceMethods || (cursorAdvanceMethods = [
    IDBCursor.prototype.advance,
    IDBCursor.prototype.continue,
    IDBCursor.prototype.continuePrimaryKey
  ]);
}
function promisifyRequest(request) {
  const promise = new Promise((resolve, reject) => {
    const unlisten = () => {
      request.removeEventListener("success", success);
      request.removeEventListener("error", error);
    };
    const success = () => {
      resolve(wrap(request.result));
      unlisten();
    };
    const error = () => {
      reject(request.error);
      unlisten();
    };
    request.addEventListener("success", success);
    request.addEventListener("error", error);
  });
  promise.then((value) => {
    if (value instanceof IDBCursor) {
      cursorRequestMap.set(value, request);
    }
  }).catch(() => {
  });
  reverseTransformCache.set(promise, request);
  return promise;
}
function cacheDonePromiseForTransaction(tx) {
  if (transactionDoneMap.has(tx))
    return;
  const done = new Promise((resolve, reject) => {
    const unlisten = () => {
      tx.removeEventListener("complete", complete);
      tx.removeEventListener("error", error);
      tx.removeEventListener("abort", error);
    };
    const complete = () => {
      resolve();
      unlisten();
    };
    const error = () => {
      reject(tx.error || new DOMException("AbortError", "AbortError"));
      unlisten();
    };
    tx.addEventListener("complete", complete);
    tx.addEventListener("error", error);
    tx.addEventListener("abort", error);
  });
  transactionDoneMap.set(tx, done);
}
function replaceTraps(callback) {
  idbProxyTraps = callback(idbProxyTraps);
}
function wrapFunction(func) {
  if (func === IDBDatabase.prototype.transaction && !("objectStoreNames" in IDBTransaction.prototype)) {
    return function(storeNames, ...args) {
      const tx = func.call(unwrap(this), storeNames, ...args);
      transactionStoreNamesMap.set(tx, storeNames.sort ? storeNames.sort() : [storeNames]);
      return wrap(tx);
    };
  }
  if (getCursorAdvanceMethods().includes(func)) {
    return function(...args) {
      func.apply(unwrap(this), args);
      return wrap(cursorRequestMap.get(this));
    };
  }
  return function(...args) {
    return wrap(func.apply(unwrap(this), args));
  };
}
function transformCachableValue(value) {
  if (typeof value === "function")
    return wrapFunction(value);
  if (value instanceof IDBTransaction)
    cacheDonePromiseForTransaction(value);
  if (instanceOfAny(value, getIdbProxyableTypes()))
    return new Proxy(value, idbProxyTraps);
  return value;
}
function wrap(value) {
  if (value instanceof IDBRequest)
    return promisifyRequest(value);
  if (transformCache.has(value))
    return transformCache.get(value);
  const newValue = transformCachableValue(value);
  if (newValue !== value) {
    transformCache.set(value, newValue);
    reverseTransformCache.set(newValue, value);
  }
  return newValue;
}
var instanceOfAny = (object, constructors) => constructors.some((c) => object instanceof c);
var idbProxyableTypes;
var cursorAdvanceMethods;
var cursorRequestMap = new WeakMap;
var transactionDoneMap = new WeakMap;
var transactionStoreNamesMap = new WeakMap;
var transformCache = new WeakMap;
var reverseTransformCache = new WeakMap;
var idbProxyTraps = {
  get(target, prop, receiver) {
    if (target instanceof IDBTransaction) {
      if (prop === "done")
        return transactionDoneMap.get(target);
      if (prop === "objectStoreNames") {
        return target.objectStoreNames || transactionStoreNamesMap.get(target);
      }
      if (prop === "store") {
        return receiver.objectStoreNames[1] ? undefined : receiver.objectStore(receiver.objectStoreNames[0]);
      }
    }
    return wrap(target[prop]);
  },
  set(target, prop, value) {
    target[prop] = value;
    return true;
  },
  has(target, prop) {
    if (target instanceof IDBTransaction && (prop === "done" || prop === "store")) {
      return true;
    }
    return prop in target;
  }
};
var unwrap = (value) => reverseTransformCache.get(value);

// node_modules/idb/build/index.js
function openDB(name, version, { blocked, upgrade, blocking, terminated } = {}) {
  const request = indexedDB.open(name, version);
  const openPromise = wrap(request);
  if (upgrade) {
    request.addEventListener("upgradeneeded", (event) => {
      upgrade(wrap(request.result), event.oldVersion, event.newVersion, wrap(request.transaction), event);
    });
  }
  if (blocked) {
    request.addEventListener("blocked", (event) => blocked(event.oldVersion, event.newVersion, event));
  }
  openPromise.then((db) => {
    if (terminated)
      db.addEventListener("close", () => terminated());
    if (blocking) {
      db.addEventListener("versionchange", (event) => blocking(event.oldVersion, event.newVersion, event));
    }
  }).catch(() => {
  });
  return openPromise;
}
function deleteDB(name, { blocked } = {}) {
  const request = indexedDB.deleteDatabase(name);
  if (blocked) {
    request.addEventListener("blocked", (event) => blocked(event.oldVersion, event));
  }
  return wrap(request).then(() => {
    return;
  });
}
function getMethod(target, prop) {
  if (!(target instanceof IDBDatabase && !(prop in target) && typeof prop === "string")) {
    return;
  }
  if (cachedMethods.get(prop))
    return cachedMethods.get(prop);
  const targetFuncName = prop.replace(/FromIndex$/, "");
  const useIndex = prop !== targetFuncName;
  const isWrite = writeMethods.includes(targetFuncName);
  if (!(targetFuncName in (useIndex ? IDBIndex : IDBObjectStore).prototype) || !(isWrite || readMethods.includes(targetFuncName))) {
    return;
  }
  const method = async function(storeName, ...args) {
    const tx = this.transaction(storeName, isWrite ? "readwrite" : "readonly");
    let target2 = tx.store;
    if (useIndex)
      target2 = target2.index(args.shift());
    return (await Promise.all([
      target2[targetFuncName](...args),
      isWrite && tx.done
    ]))[0];
  };
  cachedMethods.set(prop, method);
  return method;
}
var readMethods = ["get", "getKey", "getAll", "getAllKeys", "count"];
var writeMethods = ["put", "add", "delete", "clear"];
var cachedMethods = new Map;
replaceTraps((oldTraps) => ({
  ...oldTraps,
  get: (target, prop, receiver) => getMethod(target, prop) || oldTraps.get(target, prop, receiver),
  has: (target, prop) => !!getMethod(target, prop) || oldTraps.has(target, prop)
}));

// node_modules/@firebase/app/dist/esm/index.esm2017.js
function isVersionServiceProvider(provider) {
  const component2 = provider.getComponent();
  return (component2 === null || component2 === undefined ? undefined : component2.type) === "VERSION";
}
function _addComponent(app, component2) {
  try {
    app.container.addComponent(component2);
  } catch (e) {
    logger2.debug(`Component ${component2.name} failed to register with FirebaseApp ${app.name}`, e);
  }
}
function _registerComponent(component2) {
  const componentName = component2.name;
  if (_components.has(componentName)) {
    logger2.debug(`There were multiple attempts to register component ${componentName}.`);
    return false;
  }
  _components.set(componentName, component2);
  for (const app of _apps.values()) {
    _addComponent(app, component2);
  }
  for (const serverApp of _serverApps.values()) {
    _addComponent(serverApp, component2);
  }
  return true;
}
function _getProvider(app, name) {
  const heartbeatController = app.container.getProvider("heartbeat").getImmediate({ optional: true });
  if (heartbeatController) {
    heartbeatController.triggerHeartbeat();
  }
  return app.container.getProvider(name);
}
function initializeApp(_options, rawConfig = {}) {
  let options = _options;
  if (typeof rawConfig !== "object") {
    const name2 = rawConfig;
    rawConfig = { name: name2 };
  }
  const config = Object.assign({ name: DEFAULT_ENTRY_NAME2, automaticDataCollectionEnabled: false }, rawConfig);
  const name = config.name;
  if (typeof name !== "string" || !name) {
    throw ERROR_FACTORY.create("bad-app-name", {
      appName: String(name)
    });
  }
  options || (options = getDefaultAppConfig());
  if (!options) {
    throw ERROR_FACTORY.create("no-options");
  }
  const existingApp = _apps.get(name);
  if (existingApp) {
    if (deepEqual(options, existingApp.options) && deepEqual(config, existingApp.config)) {
      return existingApp;
    } else {
      throw ERROR_FACTORY.create("duplicate-app", { appName: name });
    }
  }
  const container = new ComponentContainer(name);
  for (const component2 of _components.values()) {
    container.addComponent(component2);
  }
  const newApp = new FirebaseAppImpl(options, config, container);
  _apps.set(name, newApp);
  return newApp;
}
function getApp(name = DEFAULT_ENTRY_NAME2) {
  const app = _apps.get(name);
  if (!app && name === DEFAULT_ENTRY_NAME2 && getDefaultAppConfig()) {
    return initializeApp();
  }
  if (!app) {
    throw ERROR_FACTORY.create("no-app", { appName: name });
  }
  return app;
}
function registerVersion(libraryKeyOrName, version, variant) {
  var _a;
  let library = (_a = PLATFORM_LOG_STRING[libraryKeyOrName]) !== null && _a !== undefined ? _a : libraryKeyOrName;
  if (variant) {
    library += `-${variant}`;
  }
  const libraryMismatch = library.match(/\s|\//);
  const versionMismatch = version.match(/\s|\//);
  if (libraryMismatch || versionMismatch) {
    const warning = [
      `Unable to register library "${library}" with version "${version}":`
    ];
    if (libraryMismatch) {
      warning.push(`library name "${library}" contains illegal characters (whitespace or "/")`);
    }
    if (libraryMismatch && versionMismatch) {
      warning.push("and");
    }
    if (versionMismatch) {
      warning.push(`version name "${version}" contains illegal characters (whitespace or "/")`);
    }
    logger2.warn(warning.join(" "));
    return;
  }
  _registerComponent(new Component(`${library}-version`, () => ({ library, version }), "VERSION"));
}
function getDbPromise() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade: (db, oldVersion) => {
        switch (oldVersion) {
          case 0:
            try {
              db.createObjectStore(STORE_NAME);
            } catch (e) {
              console.warn(e);
            }
        }
      }
    }).catch((e) => {
      throw ERROR_FACTORY.create("idb-open", {
        originalErrorMessage: e.message
      });
    });
  }
  return dbPromise;
}
async function readHeartbeatsFromIndexedDB(app) {
  try {
    const db = await getDbPromise();
    const tx = db.transaction(STORE_NAME);
    const result = await tx.objectStore(STORE_NAME).get(computeKey(app));
    await tx.done;
    return result;
  } catch (e) {
    if (e instanceof FirebaseError) {
      logger2.warn(e.message);
    } else {
      const idbGetError = ERROR_FACTORY.create("idb-get", {
        originalErrorMessage: e === null || e === undefined ? undefined : e.message
      });
      logger2.warn(idbGetError.message);
    }
  }
}
async function writeHeartbeatsToIndexedDB(app, heartbeatObject) {
  try {
    const db = await getDbPromise();
    const tx = db.transaction(STORE_NAME, "readwrite");
    const objectStore = tx.objectStore(STORE_NAME);
    await objectStore.put(heartbeatObject, computeKey(app));
    await tx.done;
  } catch (e) {
    if (e instanceof FirebaseError) {
      logger2.warn(e.message);
    } else {
      const idbGetError = ERROR_FACTORY.create("idb-set", {
        originalErrorMessage: e === null || e === undefined ? undefined : e.message
      });
      logger2.warn(idbGetError.message);
    }
  }
}
function computeKey(app) {
  return `${app.name}!${app.options.appId}`;
}
function getUTCDateString() {
  const today = new Date;
  return today.toISOString().substring(0, 10);
}
function extractHeartbeatsForHeader(heartbeatsCache, maxSize = MAX_HEADER_BYTES) {
  const heartbeatsToSend = [];
  let unsentEntries = heartbeatsCache.slice();
  for (const singleDateHeartbeat of heartbeatsCache) {
    const heartbeatEntry = heartbeatsToSend.find((hb) => hb.agent === singleDateHeartbeat.agent);
    if (!heartbeatEntry) {
      heartbeatsToSend.push({
        agent: singleDateHeartbeat.agent,
        dates: [singleDateHeartbeat.date]
      });
      if (countBytes(heartbeatsToSend) > maxSize) {
        heartbeatsToSend.pop();
        break;
      }
    } else {
      heartbeatEntry.dates.push(singleDateHeartbeat.date);
      if (countBytes(heartbeatsToSend) > maxSize) {
        heartbeatEntry.dates.pop();
        break;
      }
    }
    unsentEntries = unsentEntries.slice(1);
  }
  return {
    heartbeatsToSend,
    unsentEntries
  };
}
function countBytes(heartbeatsCache) {
  return base64urlEncodeWithoutPadding(JSON.stringify({ version: 2, heartbeats: heartbeatsCache })).length;
}
function registerCoreComponents(variant) {
  _registerComponent(new Component("platform-logger", (container) => new PlatformLoggerServiceImpl(container), "PRIVATE"));
  _registerComponent(new Component("heartbeat", (container) => new HeartbeatServiceImpl(container), "PRIVATE"));
  registerVersion(name$p, version$1, variant);
  registerVersion(name$p, version$1, "esm2017");
  registerVersion("fire-js", "");
}

class PlatformLoggerServiceImpl {
  constructor(container) {
    this.container = container;
  }
  getPlatformInfoString() {
    const providers = this.container.getProviders();
    return providers.map((provider) => {
      if (isVersionServiceProvider(provider)) {
        const service = provider.getImmediate();
        return `${service.library}/${service.version}`;
      } else {
        return null;
      }
    }).filter((logString) => logString).join(" ");
  }
}
var name$p = "@firebase/app";
var version$1 = "0.10.10";
var logger2 = new Logger("@firebase/app");
var name$o = "@firebase/app-compat";
var name$n = "@firebase/analytics-compat";
var name$m = "@firebase/analytics";
var name$l = "@firebase/app-check-compat";
var name$k = "@firebase/app-check";
var name$j = "@firebase/auth";
var name$i = "@firebase/auth-compat";
var name$h = "@firebase/database";
var name$g = "@firebase/database-compat";
var name$f = "@firebase/functions";
var name$e = "@firebase/functions-compat";
var name$d = "@firebase/installations";
var name$c = "@firebase/installations-compat";
var name$b = "@firebase/messaging";
var name$a = "@firebase/messaging-compat";
var name$9 = "@firebase/performance";
var name$8 = "@firebase/performance-compat";
var name$7 = "@firebase/remote-config";
var name$6 = "@firebase/remote-config-compat";
var name$5 = "@firebase/storage";
var name$4 = "@firebase/storage-compat";
var name$3 = "@firebase/firestore";
var name$2 = "@firebase/vertexai-preview";
var name$1 = "@firebase/firestore-compat";
var name = "firebase";
var DEFAULT_ENTRY_NAME2 = "[DEFAULT]";
var PLATFORM_LOG_STRING = {
  [name$p]: "fire-core",
  [name$o]: "fire-core-compat",
  [name$m]: "fire-analytics",
  [name$n]: "fire-analytics-compat",
  [name$k]: "fire-app-check",
  [name$l]: "fire-app-check-compat",
  [name$j]: "fire-auth",
  [name$i]: "fire-auth-compat",
  [name$h]: "fire-rtdb",
  [name$g]: "fire-rtdb-compat",
  [name$f]: "fire-fn",
  [name$e]: "fire-fn-compat",
  [name$d]: "fire-iid",
  [name$c]: "fire-iid-compat",
  [name$b]: "fire-fcm",
  [name$a]: "fire-fcm-compat",
  [name$9]: "fire-perf",
  [name$8]: "fire-perf-compat",
  [name$7]: "fire-rc",
  [name$6]: "fire-rc-compat",
  [name$5]: "fire-gcs",
  [name$4]: "fire-gcs-compat",
  [name$3]: "fire-fst",
  [name$1]: "fire-fst-compat",
  [name$2]: "fire-vertex",
  "fire-js": "fire-js",
  [name]: "fire-js-all"
};
var _apps = new Map;
var _serverApps = new Map;
var _components = new Map;
var ERRORS = {
  ["no-app"]: "No Firebase App '{$appName}' has been created - " + "call initializeApp() first",
  ["bad-app-name"]: "Illegal App name: '{$appName}'",
  ["duplicate-app"]: "Firebase App named '{$appName}' already exists with different options or config",
  ["app-deleted"]: "Firebase App named '{$appName}' already deleted",
  ["server-app-deleted"]: "Firebase Server App has been deleted",
  ["no-options"]: "Need to provide options, when not being deployed to hosting via source.",
  ["invalid-app-argument"]: "firebase.{$appName}() takes either no argument or a " + "Firebase App instance.",
  ["invalid-log-argument"]: "First argument to `onLog` must be null or a function.",
  ["idb-open"]: "Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.",
  ["idb-get"]: "Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.",
  ["idb-set"]: "Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.",
  ["idb-delete"]: "Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.",
  ["finalization-registry-not-supported"]: "FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.",
  ["invalid-server-app-environment"]: "FirebaseServerApp is not for use in browser environments."
};
var ERROR_FACTORY = new ErrorFactory("app", "Firebase", ERRORS);

class FirebaseAppImpl {
  constructor(options, config, container) {
    this._isDeleted = false;
    this._options = Object.assign({}, options);
    this._config = Object.assign({}, config);
    this._name = config.name;
    this._automaticDataCollectionEnabled = config.automaticDataCollectionEnabled;
    this._container = container;
    this.container.addComponent(new Component("app", () => this, "PUBLIC"));
  }
  get automaticDataCollectionEnabled() {
    this.checkDestroyed();
    return this._automaticDataCollectionEnabled;
  }
  set automaticDataCollectionEnabled(val) {
    this.checkDestroyed();
    this._automaticDataCollectionEnabled = val;
  }
  get name() {
    this.checkDestroyed();
    return this._name;
  }
  get options() {
    this.checkDestroyed();
    return this._options;
  }
  get config() {
    this.checkDestroyed();
    return this._config;
  }
  get container() {
    return this._container;
  }
  get isDeleted() {
    return this._isDeleted;
  }
  set isDeleted(val) {
    this._isDeleted = val;
  }
  checkDestroyed() {
    if (this.isDeleted) {
      throw ERROR_FACTORY.create("app-deleted", { appName: this._name });
    }
  }
}
var DB_NAME = "firebase-heartbeat-database";
var DB_VERSION = 1;
var STORE_NAME = "firebase-heartbeat-store";
var dbPromise = null;
var MAX_HEADER_BYTES = 1024;
var STORED_HEARTBEAT_RETENTION_MAX_MILLIS = 30 * 24 * 60 * 60 * 1000;

class HeartbeatServiceImpl {
  constructor(container) {
    this.container = container;
    this._heartbeatsCache = null;
    const app = this.container.getProvider("app").getImmediate();
    this._storage = new HeartbeatStorageImpl(app);
    this._heartbeatsCachePromise = this._storage.read().then((result) => {
      this._heartbeatsCache = result;
      return result;
    });
  }
  async triggerHeartbeat() {
    var _a, _b;
    try {
      const platformLogger = this.container.getProvider("platform-logger").getImmediate();
      const agent = platformLogger.getPlatformInfoString();
      const date = getUTCDateString();
      if (((_a = this._heartbeatsCache) === null || _a === undefined ? undefined : _a.heartbeats) == null) {
        this._heartbeatsCache = await this._heartbeatsCachePromise;
        if (((_b = this._heartbeatsCache) === null || _b === undefined ? undefined : _b.heartbeats) == null) {
          return;
        }
      }
      if (this._heartbeatsCache.lastSentHeartbeatDate === date || this._heartbeatsCache.heartbeats.some((singleDateHeartbeat) => singleDateHeartbeat.date === date)) {
        return;
      } else {
        this._heartbeatsCache.heartbeats.push({ date, agent });
      }
      this._heartbeatsCache.heartbeats = this._heartbeatsCache.heartbeats.filter((singleDateHeartbeat) => {
        const hbTimestamp = new Date(singleDateHeartbeat.date).valueOf();
        const now = Date.now();
        return now - hbTimestamp <= STORED_HEARTBEAT_RETENTION_MAX_MILLIS;
      });
      return this._storage.overwrite(this._heartbeatsCache);
    } catch (e) {
      logger2.warn(e);
    }
  }
  async getHeartbeatsHeader() {
    var _a;
    try {
      if (this._heartbeatsCache === null) {
        await this._heartbeatsCachePromise;
      }
      if (((_a = this._heartbeatsCache) === null || _a === undefined ? undefined : _a.heartbeats) == null || this._heartbeatsCache.heartbeats.length === 0) {
        return "";
      }
      const date = getUTCDateString();
      const { heartbeatsToSend, unsentEntries } = extractHeartbeatsForHeader(this._heartbeatsCache.heartbeats);
      const headerString = base64urlEncodeWithoutPadding(JSON.stringify({ version: 2, heartbeats: heartbeatsToSend }));
      this._heartbeatsCache.lastSentHeartbeatDate = date;
      if (unsentEntries.length > 0) {
        this._heartbeatsCache.heartbeats = unsentEntries;
        await this._storage.overwrite(this._heartbeatsCache);
      } else {
        this._heartbeatsCache.heartbeats = [];
        this._storage.overwrite(this._heartbeatsCache);
      }
      return headerString;
    } catch (e) {
      logger2.warn(e);
      return "";
    }
  }
}

class HeartbeatStorageImpl {
  constructor(app) {
    this.app = app;
    this._canUseIndexedDBPromise = this.runIndexedDBEnvironmentCheck();
  }
  async runIndexedDBEnvironmentCheck() {
    if (!isIndexedDBAvailable()) {
      return false;
    } else {
      return validateIndexedDBOpenable().then(() => true).catch(() => false);
    }
  }
  async read() {
    const canUseIndexedDB = await this._canUseIndexedDBPromise;
    if (!canUseIndexedDB) {
      return { heartbeats: [] };
    } else {
      const idbHeartbeatObject = await readHeartbeatsFromIndexedDB(this.app);
      if (idbHeartbeatObject === null || idbHeartbeatObject === undefined ? undefined : idbHeartbeatObject.heartbeats) {
        return idbHeartbeatObject;
      } else {
        return { heartbeats: [] };
      }
    }
  }
  async overwrite(heartbeatsObject) {
    var _a;
    const canUseIndexedDB = await this._canUseIndexedDBPromise;
    if (!canUseIndexedDB) {
      return;
    } else {
      const existingHeartbeatsObject = await this.read();
      return writeHeartbeatsToIndexedDB(this.app, {
        lastSentHeartbeatDate: (_a = heartbeatsObject.lastSentHeartbeatDate) !== null && _a !== undefined ? _a : existingHeartbeatsObject.lastSentHeartbeatDate,
        heartbeats: heartbeatsObject.heartbeats
      });
    }
  }
  async add(heartbeatsObject) {
    var _a;
    const canUseIndexedDB = await this._canUseIndexedDBPromise;
    if (!canUseIndexedDB) {
      return;
    } else {
      const existingHeartbeatsObject = await this.read();
      return writeHeartbeatsToIndexedDB(this.app, {
        lastSentHeartbeatDate: (_a = heartbeatsObject.lastSentHeartbeatDate) !== null && _a !== undefined ? _a : existingHeartbeatsObject.lastSentHeartbeatDate,
        heartbeats: [
          ...existingHeartbeatsObject.heartbeats,
          ...heartbeatsObject.heartbeats
        ]
      });
    }
  }
}
registerCoreComponents("");

// node_modules/@firebase/installations/dist/esm/index.esm2017.js
function isServerError(error) {
  return error instanceof FirebaseError && error.code.includes("request-failed");
}
function getInstallationsEndpoint({ projectId }) {
  return `${INSTALLATIONS_API_URL}/projects/${projectId}/installations`;
}
function extractAuthTokenInfoFromResponse(response) {
  return {
    token: response.token,
    requestStatus: 2,
    expiresIn: getExpiresInFromResponseExpiresIn(response.expiresIn),
    creationTime: Date.now()
  };
}
async function getErrorFromResponse(requestName, response) {
  const responseJson = await response.json();
  const errorData = responseJson.error;
  return ERROR_FACTORY2.create("request-failed", {
    requestName,
    serverCode: errorData.code,
    serverMessage: errorData.message,
    serverStatus: errorData.status
  });
}
function getHeaders({ apiKey }) {
  return new Headers({
    "Content-Type": "application/json",
    Accept: "application/json",
    "x-goog-api-key": apiKey
  });
}
function getHeadersWithAuth(appConfig, { refreshToken }) {
  const headers = getHeaders(appConfig);
  headers.append("Authorization", getAuthorizationHeader(refreshToken));
  return headers;
}
async function retryIfServerError(fn) {
  const result = await fn();
  if (result.status >= 500 && result.status < 600) {
    return fn();
  }
  return result;
}
function getExpiresInFromResponseExpiresIn(responseExpiresIn) {
  return Number(responseExpiresIn.replace("s", "000"));
}
function getAuthorizationHeader(refreshToken) {
  return `${INTERNAL_AUTH_VERSION} ${refreshToken}`;
}
async function createInstallationRequest({ appConfig, heartbeatServiceProvider }, { fid }) {
  const endpoint = getInstallationsEndpoint(appConfig);
  const headers = getHeaders(appConfig);
  const heartbeatService = heartbeatServiceProvider.getImmediate({
    optional: true
  });
  if (heartbeatService) {
    const heartbeatsHeader = await heartbeatService.getHeartbeatsHeader();
    if (heartbeatsHeader) {
      headers.append("x-firebase-client", heartbeatsHeader);
    }
  }
  const body = {
    fid,
    authVersion: INTERNAL_AUTH_VERSION,
    appId: appConfig.appId,
    sdkVersion: PACKAGE_VERSION
  };
  const request = {
    method: "POST",
    headers,
    body: JSON.stringify(body)
  };
  const response = await retryIfServerError(() => fetch(endpoint, request));
  if (response.ok) {
    const responseValue = await response.json();
    const registeredInstallationEntry = {
      fid: responseValue.fid || fid,
      registrationStatus: 2,
      refreshToken: responseValue.refreshToken,
      authToken: extractAuthTokenInfoFromResponse(responseValue.authToken)
    };
    return registeredInstallationEntry;
  } else {
    throw await getErrorFromResponse("Create Installation", response);
  }
}
function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
function bufferToBase64UrlSafe(array) {
  const b64 = btoa(String.fromCharCode(...array));
  return b64.replace(/\+/g, "-").replace(/\//g, "_");
}
function generateFid() {
  try {
    const fidByteArray = new Uint8Array(17);
    const crypto = self.crypto || self.msCrypto;
    crypto.getRandomValues(fidByteArray);
    fidByteArray[0] = 112 + fidByteArray[0] % 16;
    const fid = encode(fidByteArray);
    return VALID_FID_PATTERN.test(fid) ? fid : INVALID_FID;
  } catch (_a) {
    return INVALID_FID;
  }
}
function encode(fidByteArray) {
  const b64String = bufferToBase64UrlSafe(fidByteArray);
  return b64String.substr(0, 22);
}
function getKey(appConfig) {
  return `${appConfig.appName}!${appConfig.appId}`;
}
function fidChanged(appConfig, fid) {
  const key = getKey(appConfig);
  callFidChangeCallbacks(key, fid);
  broadcastFidChange(key, fid);
}
function callFidChangeCallbacks(key, fid) {
  const callbacks = fidChangeCallbacks.get(key);
  if (!callbacks) {
    return;
  }
  for (const callback of callbacks) {
    callback(fid);
  }
}
function broadcastFidChange(key, fid) {
  const channel = getBroadcastChannel();
  if (channel) {
    channel.postMessage({ key, fid });
  }
  closeBroadcastChannel();
}
function getBroadcastChannel() {
  if (!broadcastChannel && "BroadcastChannel" in self) {
    broadcastChannel = new BroadcastChannel("[Firebase] FID Change");
    broadcastChannel.onmessage = (e) => {
      callFidChangeCallbacks(e.data.key, e.data.fid);
    };
  }
  return broadcastChannel;
}
function closeBroadcastChannel() {
  if (fidChangeCallbacks.size === 0 && broadcastChannel) {
    broadcastChannel.close();
    broadcastChannel = null;
  }
}
function getDbPromise2() {
  if (!dbPromise2) {
    dbPromise2 = openDB(DATABASE_NAME, DATABASE_VERSION, {
      upgrade: (db, oldVersion) => {
        switch (oldVersion) {
          case 0:
            db.createObjectStore(OBJECT_STORE_NAME);
        }
      }
    });
  }
  return dbPromise2;
}
async function set(appConfig, value) {
  const key = getKey(appConfig);
  const db = await getDbPromise2();
  const tx = db.transaction(OBJECT_STORE_NAME, "readwrite");
  const objectStore = tx.objectStore(OBJECT_STORE_NAME);
  const oldValue = await objectStore.get(key);
  await objectStore.put(value, key);
  await tx.done;
  if (!oldValue || oldValue.fid !== value.fid) {
    fidChanged(appConfig, value.fid);
  }
  return value;
}
async function remove(appConfig) {
  const key = getKey(appConfig);
  const db = await getDbPromise2();
  const tx = db.transaction(OBJECT_STORE_NAME, "readwrite");
  await tx.objectStore(OBJECT_STORE_NAME).delete(key);
  await tx.done;
}
async function update(appConfig, updateFn) {
  const key = getKey(appConfig);
  const db = await getDbPromise2();
  const tx = db.transaction(OBJECT_STORE_NAME, "readwrite");
  const store = tx.objectStore(OBJECT_STORE_NAME);
  const oldValue = await store.get(key);
  const newValue = updateFn(oldValue);
  if (newValue === undefined) {
    await store.delete(key);
  } else {
    await store.put(newValue, key);
  }
  await tx.done;
  if (newValue && (!oldValue || oldValue.fid !== newValue.fid)) {
    fidChanged(appConfig, newValue.fid);
  }
  return newValue;
}
async function getInstallationEntry(installations) {
  let registrationPromise;
  const installationEntry = await update(installations.appConfig, (oldEntry) => {
    const installationEntry2 = updateOrCreateInstallationEntry(oldEntry);
    const entryWithPromise = triggerRegistrationIfNecessary(installations, installationEntry2);
    registrationPromise = entryWithPromise.registrationPromise;
    return entryWithPromise.installationEntry;
  });
  if (installationEntry.fid === INVALID_FID) {
    return { installationEntry: await registrationPromise };
  }
  return {
    installationEntry,
    registrationPromise
  };
}
function updateOrCreateInstallationEntry(oldEntry) {
  const entry = oldEntry || {
    fid: generateFid(),
    registrationStatus: 0
  };
  return clearTimedOutRequest(entry);
}
function triggerRegistrationIfNecessary(installations, installationEntry) {
  if (installationEntry.registrationStatus === 0) {
    if (!navigator.onLine) {
      const registrationPromiseWithError = Promise.reject(ERROR_FACTORY2.create("app-offline"));
      return {
        installationEntry,
        registrationPromise: registrationPromiseWithError
      };
    }
    const inProgressEntry = {
      fid: installationEntry.fid,
      registrationStatus: 1,
      registrationTime: Date.now()
    };
    const registrationPromise = registerInstallation(installations, inProgressEntry);
    return { installationEntry: inProgressEntry, registrationPromise };
  } else if (installationEntry.registrationStatus === 1) {
    return {
      installationEntry,
      registrationPromise: waitUntilFidRegistration(installations)
    };
  } else {
    return { installationEntry };
  }
}
async function registerInstallation(installations, installationEntry) {
  try {
    const registeredInstallationEntry = await createInstallationRequest(installations, installationEntry);
    return set(installations.appConfig, registeredInstallationEntry);
  } catch (e) {
    if (isServerError(e) && e.customData.serverCode === 409) {
      await remove(installations.appConfig);
    } else {
      await set(installations.appConfig, {
        fid: installationEntry.fid,
        registrationStatus: 0
      });
    }
    throw e;
  }
}
async function waitUntilFidRegistration(installations) {
  let entry = await updateInstallationRequest(installations.appConfig);
  while (entry.registrationStatus === 1) {
    await sleep(100);
    entry = await updateInstallationRequest(installations.appConfig);
  }
  if (entry.registrationStatus === 0) {
    const { installationEntry, registrationPromise } = await getInstallationEntry(installations);
    if (registrationPromise) {
      return registrationPromise;
    } else {
      return installationEntry;
    }
  }
  return entry;
}
function updateInstallationRequest(appConfig) {
  return update(appConfig, (oldEntry) => {
    if (!oldEntry) {
      throw ERROR_FACTORY2.create("installation-not-found");
    }
    return clearTimedOutRequest(oldEntry);
  });
}
function clearTimedOutRequest(entry) {
  if (hasInstallationRequestTimedOut(entry)) {
    return {
      fid: entry.fid,
      registrationStatus: 0
    };
  }
  return entry;
}
function hasInstallationRequestTimedOut(installationEntry) {
  return installationEntry.registrationStatus === 1 && installationEntry.registrationTime + PENDING_TIMEOUT_MS < Date.now();
}
async function generateAuthTokenRequest({ appConfig, heartbeatServiceProvider }, installationEntry) {
  const endpoint = getGenerateAuthTokenEndpoint(appConfig, installationEntry);
  const headers = getHeadersWithAuth(appConfig, installationEntry);
  const heartbeatService = heartbeatServiceProvider.getImmediate({
    optional: true
  });
  if (heartbeatService) {
    const heartbeatsHeader = await heartbeatService.getHeartbeatsHeader();
    if (heartbeatsHeader) {
      headers.append("x-firebase-client", heartbeatsHeader);
    }
  }
  const body = {
    installation: {
      sdkVersion: PACKAGE_VERSION,
      appId: appConfig.appId
    }
  };
  const request = {
    method: "POST",
    headers,
    body: JSON.stringify(body)
  };
  const response = await retryIfServerError(() => fetch(endpoint, request));
  if (response.ok) {
    const responseValue = await response.json();
    const completedAuthToken = extractAuthTokenInfoFromResponse(responseValue);
    return completedAuthToken;
  } else {
    throw await getErrorFromResponse("Generate Auth Token", response);
  }
}
function getGenerateAuthTokenEndpoint(appConfig, { fid }) {
  return `${getInstallationsEndpoint(appConfig)}/${fid}/authTokens:generate`;
}
async function refreshAuthToken(installations, forceRefresh = false) {
  let tokenPromise;
  const entry = await update(installations.appConfig, (oldEntry) => {
    if (!isEntryRegistered(oldEntry)) {
      throw ERROR_FACTORY2.create("not-registered");
    }
    const oldAuthToken = oldEntry.authToken;
    if (!forceRefresh && isAuthTokenValid(oldAuthToken)) {
      return oldEntry;
    } else if (oldAuthToken.requestStatus === 1) {
      tokenPromise = waitUntilAuthTokenRequest(installations, forceRefresh);
      return oldEntry;
    } else {
      if (!navigator.onLine) {
        throw ERROR_FACTORY2.create("app-offline");
      }
      const inProgressEntry = makeAuthTokenRequestInProgressEntry(oldEntry);
      tokenPromise = fetchAuthTokenFromServer(installations, inProgressEntry);
      return inProgressEntry;
    }
  });
  const authToken = tokenPromise ? await tokenPromise : entry.authToken;
  return authToken;
}
async function waitUntilAuthTokenRequest(installations, forceRefresh) {
  let entry = await updateAuthTokenRequest(installations.appConfig);
  while (entry.authToken.requestStatus === 1) {
    await sleep(100);
    entry = await updateAuthTokenRequest(installations.appConfig);
  }
  const authToken = entry.authToken;
  if (authToken.requestStatus === 0) {
    return refreshAuthToken(installations, forceRefresh);
  } else {
    return authToken;
  }
}
function updateAuthTokenRequest(appConfig) {
  return update(appConfig, (oldEntry) => {
    if (!isEntryRegistered(oldEntry)) {
      throw ERROR_FACTORY2.create("not-registered");
    }
    const oldAuthToken = oldEntry.authToken;
    if (hasAuthTokenRequestTimedOut(oldAuthToken)) {
      return Object.assign(Object.assign({}, oldEntry), { authToken: { requestStatus: 0 } });
    }
    return oldEntry;
  });
}
async function fetchAuthTokenFromServer(installations, installationEntry) {
  try {
    const authToken = await generateAuthTokenRequest(installations, installationEntry);
    const updatedInstallationEntry = Object.assign(Object.assign({}, installationEntry), { authToken });
    await set(installations.appConfig, updatedInstallationEntry);
    return authToken;
  } catch (e) {
    if (isServerError(e) && (e.customData.serverCode === 401 || e.customData.serverCode === 404)) {
      await remove(installations.appConfig);
    } else {
      const updatedInstallationEntry = Object.assign(Object.assign({}, installationEntry), { authToken: { requestStatus: 0 } });
      await set(installations.appConfig, updatedInstallationEntry);
    }
    throw e;
  }
}
function isEntryRegistered(installationEntry) {
  return installationEntry !== undefined && installationEntry.registrationStatus === 2;
}
function isAuthTokenValid(authToken) {
  return authToken.requestStatus === 2 && !isAuthTokenExpired(authToken);
}
function isAuthTokenExpired(authToken) {
  const now = Date.now();
  return now < authToken.creationTime || authToken.creationTime + authToken.expiresIn < now + TOKEN_EXPIRATION_BUFFER;
}
function makeAuthTokenRequestInProgressEntry(oldEntry) {
  const inProgressAuthToken = {
    requestStatus: 1,
    requestTime: Date.now()
  };
  return Object.assign(Object.assign({}, oldEntry), { authToken: inProgressAuthToken });
}
function hasAuthTokenRequestTimedOut(authToken) {
  return authToken.requestStatus === 1 && authToken.requestTime + PENDING_TIMEOUT_MS < Date.now();
}
async function getId(installations) {
  const installationsImpl = installations;
  const { installationEntry, registrationPromise } = await getInstallationEntry(installationsImpl);
  if (registrationPromise) {
    registrationPromise.catch(console.error);
  } else {
    refreshAuthToken(installationsImpl).catch(console.error);
  }
  return installationEntry.fid;
}
async function getToken(installations, forceRefresh = false) {
  const installationsImpl = installations;
  await completeInstallationRegistration(installationsImpl);
  const authToken = await refreshAuthToken(installationsImpl, forceRefresh);
  return authToken.token;
}
async function completeInstallationRegistration(installations) {
  const { registrationPromise } = await getInstallationEntry(installations);
  if (registrationPromise) {
    await registrationPromise;
  }
}
function extractAppConfig(app2) {
  if (!app2 || !app2.options) {
    throw getMissingValueError("App Configuration");
  }
  if (!app2.name) {
    throw getMissingValueError("App Name");
  }
  const configKeys = [
    "projectId",
    "apiKey",
    "appId"
  ];
  for (const keyName of configKeys) {
    if (!app2.options[keyName]) {
      throw getMissingValueError(keyName);
    }
  }
  return {
    appName: app2.name,
    projectId: app2.options.projectId,
    apiKey: app2.options.apiKey,
    appId: app2.options.appId
  };
}
function getMissingValueError(valueName) {
  return ERROR_FACTORY2.create("missing-app-config-values", {
    valueName
  });
}
function registerInstallations() {
  _registerComponent(new Component(INSTALLATIONS_NAME, publicFactory, "PUBLIC"));
  _registerComponent(new Component(INSTALLATIONS_NAME_INTERNAL, internalFactory, "PRIVATE"));
}
var name2 = "@firebase/installations";
var version = "0.6.8";
var PENDING_TIMEOUT_MS = 1e4;
var PACKAGE_VERSION = `w:${version}`;
var INTERNAL_AUTH_VERSION = "FIS_v2";
var INSTALLATIONS_API_URL = "https://firebaseinstallations.googleapis.com/v1";
var TOKEN_EXPIRATION_BUFFER = 60 * 60 * 1000;
var SERVICE = "installations";
var SERVICE_NAME = "Installations";
var ERROR_DESCRIPTION_MAP = {
  ["missing-app-config-values"]: 'Missing App configuration value: "{$valueName}"',
  ["not-registered"]: "Firebase Installation is not registered.",
  ["installation-not-found"]: "Firebase Installation not found.",
  ["request-failed"]: '{$requestName} request failed with error "{$serverCode} {$serverStatus}: {$serverMessage}"',
  ["app-offline"]: "Could not process request. Application offline.",
  ["delete-pending-registration"]: "Can't delete installation while there is a pending registration request."
};
var ERROR_FACTORY2 = new ErrorFactory(SERVICE, SERVICE_NAME, ERROR_DESCRIPTION_MAP);
var VALID_FID_PATTERN = /^[cdef][\w-]{21}$/;
var INVALID_FID = "";
var fidChangeCallbacks = new Map;
var broadcastChannel = null;
var DATABASE_NAME = "firebase-installations-database";
var DATABASE_VERSION = 1;
var OBJECT_STORE_NAME = "firebase-installations-store";
var dbPromise2 = null;
var INSTALLATIONS_NAME = "installations";
var INSTALLATIONS_NAME_INTERNAL = "installations-internal";
var publicFactory = (container) => {
  const app2 = container.getProvider("app").getImmediate();
  const appConfig = extractAppConfig(app2);
  const heartbeatServiceProvider = _getProvider(app2, "heartbeat");
  const installationsImpl = {
    app: app2,
    appConfig,
    heartbeatServiceProvider,
    _delete: () => Promise.resolve()
  };
  return installationsImpl;
};
var internalFactory = (container) => {
  const app2 = container.getProvider("app").getImmediate();
  const installations = _getProvider(app2, INSTALLATIONS_NAME).getImmediate();
  const installationsInternal = {
    getId: () => getId(installations),
    getToken: (forceRefresh) => getToken(installations, forceRefresh)
  };
  return installationsInternal;
};
registerInstallations();
registerVersion(name2, version);
registerVersion(name2, version, "esm2017");

// node_modules/@firebase/messaging/dist/esm/index.sw.esm2017.js
function arrayToBase64(array) {
  const uint8Array = new Uint8Array(array);
  const base64String = btoa(String.fromCharCode(...uint8Array));
  return base64String.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
function base64ToArray(base64String) {
  const padding = "=".repeat((4 - base64String.length % 4) % 4);
  const base642 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");
  const rawData = atob(base642);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0;i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
async function migrateOldDatabase(senderId) {
  if ("databases" in indexedDB) {
    const databases = await indexedDB.databases();
    const dbNames = databases.map((db2) => db2.name);
    if (!dbNames.includes(OLD_DB_NAME)) {
      return null;
    }
  }
  let tokenDetails = null;
  const db = await openDB(OLD_DB_NAME, OLD_DB_VERSION, {
    upgrade: async (db2, oldVersion, newVersion, upgradeTransaction) => {
      var _a;
      if (oldVersion < 2) {
        return;
      }
      if (!db2.objectStoreNames.contains(OLD_OBJECT_STORE_NAME)) {
        return;
      }
      const objectStore = upgradeTransaction.objectStore(OLD_OBJECT_STORE_NAME);
      const value = await objectStore.index("fcmSenderId").get(senderId);
      await objectStore.clear();
      if (!value) {
        return;
      }
      if (oldVersion === 2) {
        const oldDetails = value;
        if (!oldDetails.auth || !oldDetails.p256dh || !oldDetails.endpoint) {
          return;
        }
        tokenDetails = {
          token: oldDetails.fcmToken,
          createTime: (_a = oldDetails.createTime) !== null && _a !== undefined ? _a : Date.now(),
          subscriptionOptions: {
            auth: oldDetails.auth,
            p256dh: oldDetails.p256dh,
            endpoint: oldDetails.endpoint,
            swScope: oldDetails.swScope,
            vapidKey: typeof oldDetails.vapidKey === "string" ? oldDetails.vapidKey : arrayToBase64(oldDetails.vapidKey)
          }
        };
      } else if (oldVersion === 3) {
        const oldDetails = value;
        tokenDetails = {
          token: oldDetails.fcmToken,
          createTime: oldDetails.createTime,
          subscriptionOptions: {
            auth: arrayToBase64(oldDetails.auth),
            p256dh: arrayToBase64(oldDetails.p256dh),
            endpoint: oldDetails.endpoint,
            swScope: oldDetails.swScope,
            vapidKey: arrayToBase64(oldDetails.vapidKey)
          }
        };
      } else if (oldVersion === 4) {
        const oldDetails = value;
        tokenDetails = {
          token: oldDetails.fcmToken,
          createTime: oldDetails.createTime,
          subscriptionOptions: {
            auth: arrayToBase64(oldDetails.auth),
            p256dh: arrayToBase64(oldDetails.p256dh),
            endpoint: oldDetails.endpoint,
            swScope: oldDetails.swScope,
            vapidKey: arrayToBase64(oldDetails.vapidKey)
          }
        };
      }
    }
  });
  db.close();
  await deleteDB(OLD_DB_NAME);
  await deleteDB("fcm_vapid_details_db");
  await deleteDB("undefined");
  return checkTokenDetails(tokenDetails) ? tokenDetails : null;
}
function checkTokenDetails(tokenDetails) {
  if (!tokenDetails || !tokenDetails.subscriptionOptions) {
    return false;
  }
  const { subscriptionOptions } = tokenDetails;
  return typeof tokenDetails.createTime === "number" && tokenDetails.createTime > 0 && typeof tokenDetails.token === "string" && tokenDetails.token.length > 0 && typeof subscriptionOptions.auth === "string" && subscriptionOptions.auth.length > 0 && typeof subscriptionOptions.p256dh === "string" && subscriptionOptions.p256dh.length > 0 && typeof subscriptionOptions.endpoint === "string" && subscriptionOptions.endpoint.length > 0 && typeof subscriptionOptions.swScope === "string" && subscriptionOptions.swScope.length > 0 && typeof subscriptionOptions.vapidKey === "string" && subscriptionOptions.vapidKey.length > 0;
}
function getDbPromise3() {
  if (!dbPromise3) {
    dbPromise3 = openDB(DATABASE_NAME2, DATABASE_VERSION2, {
      upgrade: (upgradeDb, oldVersion) => {
        switch (oldVersion) {
          case 0:
            upgradeDb.createObjectStore(OBJECT_STORE_NAME2);
        }
      }
    });
  }
  return dbPromise3;
}
async function dbGet(firebaseDependencies) {
  const key = getKey2(firebaseDependencies);
  const db = await getDbPromise3();
  const tokenDetails = await db.transaction(OBJECT_STORE_NAME2).objectStore(OBJECT_STORE_NAME2).get(key);
  if (tokenDetails) {
    return tokenDetails;
  } else {
    const oldTokenDetails = await migrateOldDatabase(firebaseDependencies.appConfig.senderId);
    if (oldTokenDetails) {
      await dbSet(firebaseDependencies, oldTokenDetails);
      return oldTokenDetails;
    }
  }
}
async function dbSet(firebaseDependencies, tokenDetails) {
  const key = getKey2(firebaseDependencies);
  const db = await getDbPromise3();
  const tx = db.transaction(OBJECT_STORE_NAME2, "readwrite");
  await tx.objectStore(OBJECT_STORE_NAME2).put(tokenDetails, key);
  await tx.done;
  return tokenDetails;
}
async function dbRemove(firebaseDependencies) {
  const key = getKey2(firebaseDependencies);
  const db = await getDbPromise3();
  const tx = db.transaction(OBJECT_STORE_NAME2, "readwrite");
  await tx.objectStore(OBJECT_STORE_NAME2).delete(key);
  await tx.done;
}
function getKey2({ appConfig }) {
  return appConfig.appId;
}
async function requestGetToken(firebaseDependencies, subscriptionOptions) {
  const headers = await getHeaders2(firebaseDependencies);
  const body = getBody(subscriptionOptions);
  const subscribeOptions = {
    method: "POST",
    headers,
    body: JSON.stringify(body)
  };
  let responseData;
  try {
    const response = await fetch(getEndpoint(firebaseDependencies.appConfig), subscribeOptions);
    responseData = await response.json();
  } catch (err) {
    throw ERROR_FACTORY3.create("token-subscribe-failed", {
      errorInfo: err === null || err === undefined ? undefined : err.toString()
    });
  }
  if (responseData.error) {
    const message = responseData.error.message;
    throw ERROR_FACTORY3.create("token-subscribe-failed", {
      errorInfo: message
    });
  }
  if (!responseData.token) {
    throw ERROR_FACTORY3.create("token-subscribe-no-token");
  }
  return responseData.token;
}
async function requestUpdateToken(firebaseDependencies, tokenDetails) {
  const headers = await getHeaders2(firebaseDependencies);
  const body = getBody(tokenDetails.subscriptionOptions);
  const updateOptions = {
    method: "PATCH",
    headers,
    body: JSON.stringify(body)
  };
  let responseData;
  try {
    const response = await fetch(`${getEndpoint(firebaseDependencies.appConfig)}/${tokenDetails.token}`, updateOptions);
    responseData = await response.json();
  } catch (err) {
    throw ERROR_FACTORY3.create("token-update-failed", {
      errorInfo: err === null || err === undefined ? undefined : err.toString()
    });
  }
  if (responseData.error) {
    const message = responseData.error.message;
    throw ERROR_FACTORY3.create("token-update-failed", {
      errorInfo: message
    });
  }
  if (!responseData.token) {
    throw ERROR_FACTORY3.create("token-update-no-token");
  }
  return responseData.token;
}
async function requestDeleteToken(firebaseDependencies, token) {
  const headers = await getHeaders2(firebaseDependencies);
  const unsubscribeOptions = {
    method: "DELETE",
    headers
  };
  try {
    const response = await fetch(`${getEndpoint(firebaseDependencies.appConfig)}/${token}`, unsubscribeOptions);
    const responseData = await response.json();
    if (responseData.error) {
      const message = responseData.error.message;
      throw ERROR_FACTORY3.create("token-unsubscribe-failed", {
        errorInfo: message
      });
    }
  } catch (err) {
    throw ERROR_FACTORY3.create("token-unsubscribe-failed", {
      errorInfo: err === null || err === undefined ? undefined : err.toString()
    });
  }
}
function getEndpoint({ projectId }) {
  return `${ENDPOINT}/projects/${projectId}/registrations`;
}
async function getHeaders2({ appConfig, installations: installations2 }) {
  const authToken = await installations2.getToken();
  return new Headers({
    "Content-Type": "application/json",
    Accept: "application/json",
    "x-goog-api-key": appConfig.apiKey,
    "x-goog-firebase-installations-auth": `FIS ${authToken}`
  });
}
function getBody({ p256dh, auth, endpoint, vapidKey }) {
  const body = {
    web: {
      endpoint,
      auth,
      p256dh
    }
  };
  if (vapidKey !== DEFAULT_VAPID_KEY) {
    body.web.applicationPubKey = vapidKey;
  }
  return body;
}
async function getTokenInternal(messaging) {
  const pushSubscription = await getPushSubscription(messaging.swRegistration, messaging.vapidKey);
  const subscriptionOptions = {
    vapidKey: messaging.vapidKey,
    swScope: messaging.swRegistration.scope,
    endpoint: pushSubscription.endpoint,
    auth: arrayToBase64(pushSubscription.getKey("auth")),
    p256dh: arrayToBase64(pushSubscription.getKey("p256dh"))
  };
  const tokenDetails = await dbGet(messaging.firebaseDependencies);
  if (!tokenDetails) {
    return getNewToken(messaging.firebaseDependencies, subscriptionOptions);
  } else if (!isTokenValid(tokenDetails.subscriptionOptions, subscriptionOptions)) {
    try {
      await requestDeleteToken(messaging.firebaseDependencies, tokenDetails.token);
    } catch (e) {
      console.warn(e);
    }
    return getNewToken(messaging.firebaseDependencies, subscriptionOptions);
  } else if (Date.now() >= tokenDetails.createTime + TOKEN_EXPIRATION_MS) {
    return updateToken(messaging, {
      token: tokenDetails.token,
      createTime: Date.now(),
      subscriptionOptions
    });
  } else {
    return tokenDetails.token;
  }
}
async function deleteTokenInternal(messaging) {
  const tokenDetails = await dbGet(messaging.firebaseDependencies);
  if (tokenDetails) {
    await requestDeleteToken(messaging.firebaseDependencies, tokenDetails.token);
    await dbRemove(messaging.firebaseDependencies);
  }
  const pushSubscription = await messaging.swRegistration.pushManager.getSubscription();
  if (pushSubscription) {
    return pushSubscription.unsubscribe();
  }
  return true;
}
async function updateToken(messaging, tokenDetails) {
  try {
    const updatedToken = await requestUpdateToken(messaging.firebaseDependencies, tokenDetails);
    const updatedTokenDetails = Object.assign(Object.assign({}, tokenDetails), { token: updatedToken, createTime: Date.now() });
    await dbSet(messaging.firebaseDependencies, updatedTokenDetails);
    return updatedToken;
  } catch (e) {
    throw e;
  }
}
async function getNewToken(firebaseDependencies, subscriptionOptions) {
  const token = await requestGetToken(firebaseDependencies, subscriptionOptions);
  const tokenDetails = {
    token,
    createTime: Date.now(),
    subscriptionOptions
  };
  await dbSet(firebaseDependencies, tokenDetails);
  return tokenDetails.token;
}
async function getPushSubscription(swRegistration, vapidKey) {
  const subscription = await swRegistration.pushManager.getSubscription();
  if (subscription) {
    return subscription;
  }
  return swRegistration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: base64ToArray(vapidKey)
  });
}
function isTokenValid(dbOptions, currentOptions) {
  const isVapidKeyEqual = currentOptions.vapidKey === dbOptions.vapidKey;
  const isEndpointEqual = currentOptions.endpoint === dbOptions.endpoint;
  const isAuthEqual = currentOptions.auth === dbOptions.auth;
  const isP256dhEqual = currentOptions.p256dh === dbOptions.p256dh;
  return isVapidKeyEqual && isEndpointEqual && isAuthEqual && isP256dhEqual;
}
function externalizePayload(internalPayload) {
  const payload = {
    from: internalPayload.from,
    collapseKey: internalPayload.collapse_key,
    messageId: internalPayload.fcmMessageId
  };
  propagateNotificationPayload(payload, internalPayload);
  propagateDataPayload(payload, internalPayload);
  propagateFcmOptions(payload, internalPayload);
  return payload;
}
function propagateNotificationPayload(payload, messagePayloadInternal) {
  if (!messagePayloadInternal.notification) {
    return;
  }
  payload.notification = {};
  const title = messagePayloadInternal.notification.title;
  if (!!title) {
    payload.notification.title = title;
  }
  const body = messagePayloadInternal.notification.body;
  if (!!body) {
    payload.notification.body = body;
  }
  const image = messagePayloadInternal.notification.image;
  if (!!image) {
    payload.notification.image = image;
  }
  const icon = messagePayloadInternal.notification.icon;
  if (!!icon) {
    payload.notification.icon = icon;
  }
}
function propagateDataPayload(payload, messagePayloadInternal) {
  if (!messagePayloadInternal.data) {
    return;
  }
  payload.data = messagePayloadInternal.data;
}
function propagateFcmOptions(payload, messagePayloadInternal) {
  var _a, _b, _c, _d, _e;
  if (!messagePayloadInternal.fcmOptions && !((_a = messagePayloadInternal.notification) === null || _a === undefined ? undefined : _a.click_action)) {
    return;
  }
  payload.fcmOptions = {};
  const link = (_c = (_b = messagePayloadInternal.fcmOptions) === null || _b === undefined ? undefined : _b.link) !== null && _c !== undefined ? _c : (_d = messagePayloadInternal.notification) === null || _d === undefined ? undefined : _d.click_action;
  if (!!link) {
    payload.fcmOptions.link = link;
  }
  const analyticsLabel = (_e = messagePayloadInternal.fcmOptions) === null || _e === undefined ? undefined : _e.analytics_label;
  if (!!analyticsLabel) {
    payload.fcmOptions.analyticsLabel = analyticsLabel;
  }
}
function isConsoleMessage(data) {
  return typeof data === "object" && !!data && CONSOLE_CAMPAIGN_ID in data;
}
function sleep2(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
async function stageLog(messaging, internalPayload) {
  const fcmEvent = createFcmEvent(internalPayload, await messaging.firebaseDependencies.installations.getId());
  createAndEnqueueLogEvent(messaging, fcmEvent, internalPayload.productId);
}
function createFcmEvent(internalPayload, fid) {
  var _a, _b;
  const fcmEvent = {};
  if (!!internalPayload.from) {
    fcmEvent.project_number = internalPayload.from;
  }
  if (!!internalPayload.fcmMessageId) {
    fcmEvent.message_id = internalPayload.fcmMessageId;
  }
  fcmEvent.instance_id = fid;
  if (!!internalPayload.notification) {
    fcmEvent.message_type = MessageType$1.DISPLAY_NOTIFICATION.toString();
  } else {
    fcmEvent.message_type = MessageType$1.DATA_MESSAGE.toString();
  }
  fcmEvent.sdk_platform = SDK_PLATFORM_WEB.toString();
  fcmEvent.package_name = self.origin.replace(/(^\w+:|^)\/\//, "");
  if (!!internalPayload.collapse_key) {
    fcmEvent.collapse_key = internalPayload.collapse_key;
  }
  fcmEvent.event = EVENT_MESSAGE_DELIVERED.toString();
  if (!!((_a = internalPayload.fcmOptions) === null || _a === undefined ? undefined : _a.analytics_label)) {
    fcmEvent.analytics_label = (_b = internalPayload.fcmOptions) === null || _b === undefined ? undefined : _b.analytics_label;
  }
  return fcmEvent;
}
function createAndEnqueueLogEvent(messaging, fcmEvent, productId) {
  const logEvent = {};
  logEvent.event_time_ms = Math.floor(Date.now()).toString();
  logEvent.source_extension_json_proto3 = JSON.stringify(fcmEvent);
  if (!!productId) {
    logEvent.compliance_data = buildComplianceData(productId);
  }
  messaging.logEvents.push(logEvent);
}
function buildComplianceData(productId) {
  const complianceData = {
    privacy_context: {
      prequest: {
        origin_associated_product_id: productId
      }
    }
  };
  return complianceData;
}
function _mergeStrings(s1, s2) {
  const resultArray = [];
  for (let i = 0;i < s1.length; i++) {
    resultArray.push(s1.charAt(i));
    if (i < s2.length) {
      resultArray.push(s2.charAt(i));
    }
  }
  return resultArray.join("");
}
async function onSubChange(event, messaging) {
  var _a, _b;
  const { newSubscription } = event;
  if (!newSubscription) {
    await deleteTokenInternal(messaging);
    return;
  }
  const tokenDetails = await dbGet(messaging.firebaseDependencies);
  await deleteTokenInternal(messaging);
  messaging.vapidKey = (_b = (_a = tokenDetails === null || tokenDetails === undefined ? undefined : tokenDetails.subscriptionOptions) === null || _a === undefined ? undefined : _a.vapidKey) !== null && _b !== undefined ? _b : DEFAULT_VAPID_KEY;
  await getTokenInternal(messaging);
}
async function onPush(event, messaging) {
  const internalPayload = getMessagePayloadInternal(event);
  if (!internalPayload) {
    return;
  }
  if (messaging.deliveryMetricsExportedToBigQueryEnabled) {
    await stageLog(messaging, internalPayload);
  }
  const clientList = await getClientList();
  if (hasVisibleClients(clientList)) {
    return sendMessagePayloadInternalToWindows(clientList, internalPayload);
  }
  if (!!internalPayload.notification) {
    await showNotification(wrapInternalPayload(internalPayload));
  }
  if (!messaging) {
    return;
  }
  if (!!messaging.onBackgroundMessageHandler) {
    const payload = externalizePayload(internalPayload);
    if (typeof messaging.onBackgroundMessageHandler === "function") {
      await messaging.onBackgroundMessageHandler(payload);
    } else {
      messaging.onBackgroundMessageHandler.next(payload);
    }
  }
}
async function onNotificationClick(event) {
  var _a, _b;
  const internalPayload = (_b = (_a = event.notification) === null || _a === undefined ? undefined : _a.data) === null || _b === undefined ? undefined : _b[FCM_MSG];
  if (!internalPayload) {
    return;
  } else if (event.action) {
    return;
  }
  event.stopImmediatePropagation();
  event.notification.close();
  const link = getLink(internalPayload);
  if (!link) {
    return;
  }
  const url = new URL(link, self.location.href);
  const originUrl = new URL(self.location.origin);
  if (url.host !== originUrl.host) {
    return;
  }
  let client = await getWindowClient(url);
  if (!client) {
    client = await self.clients.openWindow(link);
    await sleep2(3000);
  } else {
    client = await client.focus();
  }
  if (!client) {
    return;
  }
  internalPayload.messageType = MessageType.NOTIFICATION_CLICKED;
  internalPayload.isFirebaseMessaging = true;
  return client.postMessage(internalPayload);
}
function wrapInternalPayload(internalPayload) {
  const wrappedInternalPayload = Object.assign({}, internalPayload.notification);
  wrappedInternalPayload.data = {
    [FCM_MSG]: internalPayload
  };
  return wrappedInternalPayload;
}
function getMessagePayloadInternal({ data }) {
  if (!data) {
    return null;
  }
  try {
    return data.json();
  } catch (err) {
    return null;
  }
}
async function getWindowClient(url) {
  const clientList = await getClientList();
  for (const client of clientList) {
    const clientUrl = new URL(client.url, self.location.href);
    if (url.host === clientUrl.host) {
      return client;
    }
  }
  return null;
}
function hasVisibleClients(clientList) {
  return clientList.some((client) => client.visibilityState === "visible" && !client.url.startsWith("chrome-extension://"));
}
function sendMessagePayloadInternalToWindows(clientList, internalPayload) {
  internalPayload.isFirebaseMessaging = true;
  internalPayload.messageType = MessageType.PUSH_RECEIVED;
  for (const client of clientList) {
    client.postMessage(internalPayload);
  }
}
function getClientList() {
  return self.clients.matchAll({
    type: "window",
    includeUncontrolled: true
  });
}
function showNotification(notificationPayloadInternal) {
  var _a;
  const { actions } = notificationPayloadInternal;
  const { maxActions } = Notification;
  if (actions && maxActions && actions.length > maxActions) {
    console.warn(`This browser only supports ${maxActions} actions. The remaining actions will not be displayed.`);
  }
  return self.registration.showNotification((_a = notificationPayloadInternal.title) !== null && _a !== undefined ? _a : "", notificationPayloadInternal);
}
function getLink(payload) {
  var _a, _b, _c;
  const link = (_b = (_a = payload.fcmOptions) === null || _a === undefined ? undefined : _a.link) !== null && _b !== undefined ? _b : (_c = payload.notification) === null || _c === undefined ? undefined : _c.click_action;
  if (link) {
    return link;
  }
  if (isConsoleMessage(payload.data)) {
    return self.location.origin;
  } else {
    return null;
  }
}
function extractAppConfig2(app3) {
  if (!app3 || !app3.options) {
    throw getMissingValueError2("App Configuration Object");
  }
  if (!app3.name) {
    throw getMissingValueError2("App Name");
  }
  const configKeys = [
    "projectId",
    "apiKey",
    "appId",
    "messagingSenderId"
  ];
  const { options } = app3;
  for (const keyName of configKeys) {
    if (!options[keyName]) {
      throw getMissingValueError2(keyName);
    }
  }
  return {
    appName: app3.name,
    projectId: options.projectId,
    apiKey: options.apiKey,
    appId: options.appId,
    senderId: options.messagingSenderId
  };
}
function getMissingValueError2(valueName) {
  return ERROR_FACTORY3.create("missing-app-config-values", {
    valueName
  });
}
function registerMessagingInSw() {
  _registerComponent(new Component("messaging-sw", SwMessagingFactory, "PUBLIC"));
}
async function isSwSupported() {
  return isIndexedDBAvailable() && await validateIndexedDBOpenable() && "PushManager" in self && "Notification" in self && ServiceWorkerRegistration.prototype.hasOwnProperty("showNotification") && PushSubscription.prototype.hasOwnProperty("getKey");
}
function onBackgroundMessage$1(messaging, nextOrObserver) {
  if (self.document !== undefined) {
    throw ERROR_FACTORY3.create("only-available-in-sw");
  }
  messaging.onBackgroundMessageHandler = nextOrObserver;
  return () => {
    messaging.onBackgroundMessageHandler = null;
  };
}
function getMessagingInSw(app3 = getApp()) {
  isSwSupported().then((isSupported) => {
    if (!isSupported) {
      throw ERROR_FACTORY3.create("unsupported-browser");
    }
  }, (_) => {
    throw ERROR_FACTORY3.create("indexed-db-unsupported");
  });
  return _getProvider(getModularInstance(app3), "messaging-sw").getImmediate();
}
function onBackgroundMessage(messaging, nextOrObserver) {
  messaging = getModularInstance(messaging);
  return onBackgroundMessage$1(messaging, nextOrObserver);
}
var DEFAULT_VAPID_KEY = "BDOU99-h67HcA6JeFXHbSNMu7e2yNNu3RzoMj8TM4W88jITfq7ZmPvIM1Iv-4_l2LxQcYwhqby2xGpWwzjfAnG4";
var ENDPOINT = "https://fcmregistrations.googleapis.com/v1";
var FCM_MSG = "FCM_MSG";
var CONSOLE_CAMPAIGN_ID = "google.c.a.c_id";
var SDK_PLATFORM_WEB = 3;
var EVENT_MESSAGE_DELIVERED = 1;
var MessageType$1;
(function(MessageType) {
  MessageType[MessageType["DATA_MESSAGE"] = 1] = "DATA_MESSAGE";
  MessageType[MessageType["DISPLAY_NOTIFICATION"] = 3] = "DISPLAY_NOTIFICATION";
})(MessageType$1 || (MessageType$1 = {}));
var MessageType;
(function(MessageType2) {
  MessageType2["PUSH_RECEIVED"] = "push-received";
  MessageType2["NOTIFICATION_CLICKED"] = "notification-clicked";
})(MessageType || (MessageType = {}));
var OLD_DB_NAME = "fcm_token_details_db";
var OLD_DB_VERSION = 5;
var OLD_OBJECT_STORE_NAME = "fcm_token_object_Store";
var DATABASE_NAME2 = "firebase-messaging-database";
var DATABASE_VERSION2 = 1;
var OBJECT_STORE_NAME2 = "firebase-messaging-store";
var dbPromise3 = null;
var ERROR_MAP = {
  ["missing-app-config-values"]: 'Missing App configuration value: "{$valueName}"',
  ["only-available-in-window"]: "This method is available in a Window context.",
  ["only-available-in-sw"]: "This method is available in a service worker context.",
  ["permission-default"]: "The notification permission was not granted and dismissed instead.",
  ["permission-blocked"]: "The notification permission was not granted and blocked instead.",
  ["unsupported-browser"]: "This browser doesn't support the API's required to use the Firebase SDK.",
  ["indexed-db-unsupported"]: "This browser doesn't support indexedDb.open() (ex. Safari iFrame, Firefox Private Browsing, etc)",
  ["failed-service-worker-registration"]: "We are unable to register the default service worker. {$browserErrorMessage}",
  ["token-subscribe-failed"]: "A problem occurred while subscribing the user to FCM: {$errorInfo}",
  ["token-subscribe-no-token"]: "FCM returned no token when subscribing the user to push.",
  ["token-unsubscribe-failed"]: "A problem occurred while unsubscribing the " + "user from FCM: {$errorInfo}",
  ["token-update-failed"]: "A problem occurred while updating the user from FCM: {$errorInfo}",
  ["token-update-no-token"]: "FCM returned no token when updating the user to push.",
  ["use-sw-after-get-token"]: "The useServiceWorker() method may only be called once and must be " + "called before calling getToken() to ensure your service worker is used.",
  ["invalid-sw-registration"]: "The input to useServiceWorker() must be a ServiceWorkerRegistration.",
  ["invalid-bg-handler"]: "The input to setBackgroundMessageHandler() must be a function.",
  ["invalid-vapid-key"]: "The public VAPID key must be a string.",
  ["use-vapid-key-after-get-token"]: "The usePublicVapidKey() method may only be called once and must be " + "called before calling getToken() to ensure your VAPID key is used."
};
var ERROR_FACTORY3 = new ErrorFactory("messaging", "Messaging", ERROR_MAP);
var TOKEN_EXPIRATION_MS = 7 * 24 * 60 * 60 * 1000;
_mergeStrings("hts/frbslgigp.ogepscmv/ieo/eaylg", "tp:/ieaeogn-agolai.o/1frlglgc/o");
_mergeStrings("AzSCbw63g1R0nCw85jG8", "Iaya3yLKwmgvh7cF0q4");

class MessagingService {
  constructor(app3, installations2, analyticsProvider) {
    this.deliveryMetricsExportedToBigQueryEnabled = false;
    this.onBackgroundMessageHandler = null;
    this.onMessageHandler = null;
    this.logEvents = [];
    this.isLogServiceStarted = false;
    const appConfig = extractAppConfig2(app3);
    this.firebaseDependencies = {
      app: app3,
      appConfig,
      installations: installations2,
      analyticsProvider
    };
  }
  _delete() {
    return Promise.resolve();
  }
}
var SwMessagingFactory = (container) => {
  const messaging = new MessagingService(container.getProvider("app").getImmediate(), container.getProvider("installations-internal").getImmediate(), container.getProvider("analytics-internal"));
  self.addEventListener("push", (e) => {
    e.waitUntil(onPush(e, messaging));
  });
  self.addEventListener("pushsubscriptionchange", (e) => {
    e.waitUntil(onSubChange(e, messaging));
  });
  self.addEventListener("notificationclick", (e) => {
    e.waitUntil(onNotificationClick(e));
  });
  return messaging;
};
registerMessagingInSw();
// node_modules/firebase/app/dist/esm/index.esm.js
var name3 = "firebase";
var version2 = "10.13.1";
registerVersion(name3, version2, "app");

// node_modules/@firebase/messaging/dist/esm/index.esm2017.js
function arrayToBase642(array) {
  const uint8Array = new Uint8Array(array);
  const base64String = btoa(String.fromCharCode(...uint8Array));
  return base64String.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
function base64ToArray2(base64String) {
  const padding = "=".repeat((4 - base64String.length % 4) % 4);
  const base642 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");
  const rawData = atob(base642);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0;i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
async function migrateOldDatabase2(senderId) {
  if ("databases" in indexedDB) {
    const databases = await indexedDB.databases();
    const dbNames = databases.map((db2) => db2.name);
    if (!dbNames.includes(OLD_DB_NAME2)) {
      return null;
    }
  }
  let tokenDetails = null;
  const db = await openDB(OLD_DB_NAME2, OLD_DB_VERSION2, {
    upgrade: async (db2, oldVersion, newVersion, upgradeTransaction) => {
      var _a;
      if (oldVersion < 2) {
        return;
      }
      if (!db2.objectStoreNames.contains(OLD_OBJECT_STORE_NAME2)) {
        return;
      }
      const objectStore = upgradeTransaction.objectStore(OLD_OBJECT_STORE_NAME2);
      const value = await objectStore.index("fcmSenderId").get(senderId);
      await objectStore.clear();
      if (!value) {
        return;
      }
      if (oldVersion === 2) {
        const oldDetails = value;
        if (!oldDetails.auth || !oldDetails.p256dh || !oldDetails.endpoint) {
          return;
        }
        tokenDetails = {
          token: oldDetails.fcmToken,
          createTime: (_a = oldDetails.createTime) !== null && _a !== undefined ? _a : Date.now(),
          subscriptionOptions: {
            auth: oldDetails.auth,
            p256dh: oldDetails.p256dh,
            endpoint: oldDetails.endpoint,
            swScope: oldDetails.swScope,
            vapidKey: typeof oldDetails.vapidKey === "string" ? oldDetails.vapidKey : arrayToBase642(oldDetails.vapidKey)
          }
        };
      } else if (oldVersion === 3) {
        const oldDetails = value;
        tokenDetails = {
          token: oldDetails.fcmToken,
          createTime: oldDetails.createTime,
          subscriptionOptions: {
            auth: arrayToBase642(oldDetails.auth),
            p256dh: arrayToBase642(oldDetails.p256dh),
            endpoint: oldDetails.endpoint,
            swScope: oldDetails.swScope,
            vapidKey: arrayToBase642(oldDetails.vapidKey)
          }
        };
      } else if (oldVersion === 4) {
        const oldDetails = value;
        tokenDetails = {
          token: oldDetails.fcmToken,
          createTime: oldDetails.createTime,
          subscriptionOptions: {
            auth: arrayToBase642(oldDetails.auth),
            p256dh: arrayToBase642(oldDetails.p256dh),
            endpoint: oldDetails.endpoint,
            swScope: oldDetails.swScope,
            vapidKey: arrayToBase642(oldDetails.vapidKey)
          }
        };
      }
    }
  });
  db.close();
  await deleteDB(OLD_DB_NAME2);
  await deleteDB("fcm_vapid_details_db");
  await deleteDB("undefined");
  return checkTokenDetails2(tokenDetails) ? tokenDetails : null;
}
function checkTokenDetails2(tokenDetails) {
  if (!tokenDetails || !tokenDetails.subscriptionOptions) {
    return false;
  }
  const { subscriptionOptions } = tokenDetails;
  return typeof tokenDetails.createTime === "number" && tokenDetails.createTime > 0 && typeof tokenDetails.token === "string" && tokenDetails.token.length > 0 && typeof subscriptionOptions.auth === "string" && subscriptionOptions.auth.length > 0 && typeof subscriptionOptions.p256dh === "string" && subscriptionOptions.p256dh.length > 0 && typeof subscriptionOptions.endpoint === "string" && subscriptionOptions.endpoint.length > 0 && typeof subscriptionOptions.swScope === "string" && subscriptionOptions.swScope.length > 0 && typeof subscriptionOptions.vapidKey === "string" && subscriptionOptions.vapidKey.length > 0;
}
function getDbPromise4() {
  if (!dbPromise4) {
    dbPromise4 = openDB(DATABASE_NAME3, DATABASE_VERSION3, {
      upgrade: (upgradeDb, oldVersion) => {
        switch (oldVersion) {
          case 0:
            upgradeDb.createObjectStore(OBJECT_STORE_NAME3);
        }
      }
    });
  }
  return dbPromise4;
}
async function dbGet2(firebaseDependencies) {
  const key = getKey3(firebaseDependencies);
  const db = await getDbPromise4();
  const tokenDetails = await db.transaction(OBJECT_STORE_NAME3).objectStore(OBJECT_STORE_NAME3).get(key);
  if (tokenDetails) {
    return tokenDetails;
  } else {
    const oldTokenDetails = await migrateOldDatabase2(firebaseDependencies.appConfig.senderId);
    if (oldTokenDetails) {
      await dbSet2(firebaseDependencies, oldTokenDetails);
      return oldTokenDetails;
    }
  }
}
async function dbSet2(firebaseDependencies, tokenDetails) {
  const key = getKey3(firebaseDependencies);
  const db = await getDbPromise4();
  const tx = db.transaction(OBJECT_STORE_NAME3, "readwrite");
  await tx.objectStore(OBJECT_STORE_NAME3).put(tokenDetails, key);
  await tx.done;
  return tokenDetails;
}
function getKey3({ appConfig }) {
  return appConfig.appId;
}
async function requestGetToken2(firebaseDependencies, subscriptionOptions) {
  const headers = await getHeaders3(firebaseDependencies);
  const body = getBody2(subscriptionOptions);
  const subscribeOptions = {
    method: "POST",
    headers,
    body: JSON.stringify(body)
  };
  let responseData;
  try {
    const response = await fetch(getEndpoint2(firebaseDependencies.appConfig), subscribeOptions);
    responseData = await response.json();
  } catch (err) {
    throw ERROR_FACTORY4.create("token-subscribe-failed", {
      errorInfo: err === null || err === undefined ? undefined : err.toString()
    });
  }
  if (responseData.error) {
    const message = responseData.error.message;
    throw ERROR_FACTORY4.create("token-subscribe-failed", {
      errorInfo: message
    });
  }
  if (!responseData.token) {
    throw ERROR_FACTORY4.create("token-subscribe-no-token");
  }
  return responseData.token;
}
async function requestUpdateToken2(firebaseDependencies, tokenDetails) {
  const headers = await getHeaders3(firebaseDependencies);
  const body = getBody2(tokenDetails.subscriptionOptions);
  const updateOptions = {
    method: "PATCH",
    headers,
    body: JSON.stringify(body)
  };
  let responseData;
  try {
    const response = await fetch(`${getEndpoint2(firebaseDependencies.appConfig)}/${tokenDetails.token}`, updateOptions);
    responseData = await response.json();
  } catch (err) {
    throw ERROR_FACTORY4.create("token-update-failed", {
      errorInfo: err === null || err === undefined ? undefined : err.toString()
    });
  }
  if (responseData.error) {
    const message = responseData.error.message;
    throw ERROR_FACTORY4.create("token-update-failed", {
      errorInfo: message
    });
  }
  if (!responseData.token) {
    throw ERROR_FACTORY4.create("token-update-no-token");
  }
  return responseData.token;
}
async function requestDeleteToken2(firebaseDependencies, token) {
  const headers = await getHeaders3(firebaseDependencies);
  const unsubscribeOptions = {
    method: "DELETE",
    headers
  };
  try {
    const response = await fetch(`${getEndpoint2(firebaseDependencies.appConfig)}/${token}`, unsubscribeOptions);
    const responseData = await response.json();
    if (responseData.error) {
      const message = responseData.error.message;
      throw ERROR_FACTORY4.create("token-unsubscribe-failed", {
        errorInfo: message
      });
    }
  } catch (err) {
    throw ERROR_FACTORY4.create("token-unsubscribe-failed", {
      errorInfo: err === null || err === undefined ? undefined : err.toString()
    });
  }
}
function getEndpoint2({ projectId }) {
  return `${ENDPOINT2}/projects/${projectId}/registrations`;
}
async function getHeaders3({ appConfig, installations: installations3 }) {
  const authToken = await installations3.getToken();
  return new Headers({
    "Content-Type": "application/json",
    Accept: "application/json",
    "x-goog-api-key": appConfig.apiKey,
    "x-goog-firebase-installations-auth": `FIS ${authToken}`
  });
}
function getBody2({ p256dh, auth, endpoint, vapidKey }) {
  const body = {
    web: {
      endpoint,
      auth,
      p256dh
    }
  };
  if (vapidKey !== DEFAULT_VAPID_KEY2) {
    body.web.applicationPubKey = vapidKey;
  }
  return body;
}
async function getTokenInternal2(messaging) {
  const pushSubscription = await getPushSubscription2(messaging.swRegistration, messaging.vapidKey);
  const subscriptionOptions = {
    vapidKey: messaging.vapidKey,
    swScope: messaging.swRegistration.scope,
    endpoint: pushSubscription.endpoint,
    auth: arrayToBase642(pushSubscription.getKey("auth")),
    p256dh: arrayToBase642(pushSubscription.getKey("p256dh"))
  };
  const tokenDetails = await dbGet2(messaging.firebaseDependencies);
  if (!tokenDetails) {
    return getNewToken2(messaging.firebaseDependencies, subscriptionOptions);
  } else if (!isTokenValid2(tokenDetails.subscriptionOptions, subscriptionOptions)) {
    try {
      await requestDeleteToken2(messaging.firebaseDependencies, tokenDetails.token);
    } catch (e) {
      console.warn(e);
    }
    return getNewToken2(messaging.firebaseDependencies, subscriptionOptions);
  } else if (Date.now() >= tokenDetails.createTime + TOKEN_EXPIRATION_MS2) {
    return updateToken2(messaging, {
      token: tokenDetails.token,
      createTime: Date.now(),
      subscriptionOptions
    });
  } else {
    return tokenDetails.token;
  }
}
async function updateToken2(messaging, tokenDetails) {
  try {
    const updatedToken = await requestUpdateToken2(messaging.firebaseDependencies, tokenDetails);
    const updatedTokenDetails = Object.assign(Object.assign({}, tokenDetails), { token: updatedToken, createTime: Date.now() });
    await dbSet2(messaging.firebaseDependencies, updatedTokenDetails);
    return updatedToken;
  } catch (e) {
    throw e;
  }
}
async function getNewToken2(firebaseDependencies, subscriptionOptions) {
  const token = await requestGetToken2(firebaseDependencies, subscriptionOptions);
  const tokenDetails = {
    token,
    createTime: Date.now(),
    subscriptionOptions
  };
  await dbSet2(firebaseDependencies, tokenDetails);
  return tokenDetails.token;
}
async function getPushSubscription2(swRegistration, vapidKey) {
  const subscription = await swRegistration.pushManager.getSubscription();
  if (subscription) {
    return subscription;
  }
  return swRegistration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: base64ToArray2(vapidKey)
  });
}
function isTokenValid2(dbOptions, currentOptions) {
  const isVapidKeyEqual = currentOptions.vapidKey === dbOptions.vapidKey;
  const isEndpointEqual = currentOptions.endpoint === dbOptions.endpoint;
  const isAuthEqual = currentOptions.auth === dbOptions.auth;
  const isP256dhEqual = currentOptions.p256dh === dbOptions.p256dh;
  return isVapidKeyEqual && isEndpointEqual && isAuthEqual && isP256dhEqual;
}
function externalizePayload2(internalPayload) {
  const payload = {
    from: internalPayload.from,
    collapseKey: internalPayload.collapse_key,
    messageId: internalPayload.fcmMessageId
  };
  propagateNotificationPayload2(payload, internalPayload);
  propagateDataPayload2(payload, internalPayload);
  propagateFcmOptions2(payload, internalPayload);
  return payload;
}
function propagateNotificationPayload2(payload, messagePayloadInternal) {
  if (!messagePayloadInternal.notification) {
    return;
  }
  payload.notification = {};
  const title = messagePayloadInternal.notification.title;
  if (!!title) {
    payload.notification.title = title;
  }
  const body = messagePayloadInternal.notification.body;
  if (!!body) {
    payload.notification.body = body;
  }
  const image = messagePayloadInternal.notification.image;
  if (!!image) {
    payload.notification.image = image;
  }
  const icon = messagePayloadInternal.notification.icon;
  if (!!icon) {
    payload.notification.icon = icon;
  }
}
function propagateDataPayload2(payload, messagePayloadInternal) {
  if (!messagePayloadInternal.data) {
    return;
  }
  payload.data = messagePayloadInternal.data;
}
function propagateFcmOptions2(payload, messagePayloadInternal) {
  var _a, _b, _c, _d, _e;
  if (!messagePayloadInternal.fcmOptions && !((_a = messagePayloadInternal.notification) === null || _a === undefined ? undefined : _a.click_action)) {
    return;
  }
  payload.fcmOptions = {};
  const link = (_c = (_b = messagePayloadInternal.fcmOptions) === null || _b === undefined ? undefined : _b.link) !== null && _c !== undefined ? _c : (_d = messagePayloadInternal.notification) === null || _d === undefined ? undefined : _d.click_action;
  if (!!link) {
    payload.fcmOptions.link = link;
  }
  const analyticsLabel = (_e = messagePayloadInternal.fcmOptions) === null || _e === undefined ? undefined : _e.analytics_label;
  if (!!analyticsLabel) {
    payload.fcmOptions.analyticsLabel = analyticsLabel;
  }
}
function isConsoleMessage2(data) {
  return typeof data === "object" && !!data && CONSOLE_CAMPAIGN_ID2 in data;
}
function _mergeStrings2(s1, s2) {
  const resultArray = [];
  for (let i = 0;i < s1.length; i++) {
    resultArray.push(s1.charAt(i));
    if (i < s2.length) {
      resultArray.push(s2.charAt(i));
    }
  }
  return resultArray.join("");
}
function extractAppConfig3(app6) {
  if (!app6 || !app6.options) {
    throw getMissingValueError3("App Configuration Object");
  }
  if (!app6.name) {
    throw getMissingValueError3("App Name");
  }
  const configKeys = [
    "projectId",
    "apiKey",
    "appId",
    "messagingSenderId"
  ];
  const { options } = app6;
  for (const keyName of configKeys) {
    if (!options[keyName]) {
      throw getMissingValueError3(keyName);
    }
  }
  return {
    appName: app6.name,
    projectId: options.projectId,
    apiKey: options.apiKey,
    appId: options.appId,
    senderId: options.messagingSenderId
  };
}
function getMissingValueError3(valueName) {
  return ERROR_FACTORY4.create("missing-app-config-values", {
    valueName
  });
}
async function registerDefaultSw(messaging) {
  try {
    messaging.swRegistration = await navigator.serviceWorker.register(DEFAULT_SW_PATH, {
      scope: DEFAULT_SW_SCOPE
    });
    messaging.swRegistration.update().catch(() => {
    });
  } catch (e) {
    throw ERROR_FACTORY4.create("failed-service-worker-registration", {
      browserErrorMessage: e === null || e === undefined ? undefined : e.message
    });
  }
}
async function updateSwReg(messaging, swRegistration) {
  if (!swRegistration && !messaging.swRegistration) {
    await registerDefaultSw(messaging);
  }
  if (!swRegistration && !!messaging.swRegistration) {
    return;
  }
  if (!(swRegistration instanceof ServiceWorkerRegistration)) {
    throw ERROR_FACTORY4.create("invalid-sw-registration");
  }
  messaging.swRegistration = swRegistration;
}
async function updateVapidKey(messaging, vapidKey) {
  if (!!vapidKey) {
    messaging.vapidKey = vapidKey;
  } else if (!messaging.vapidKey) {
    messaging.vapidKey = DEFAULT_VAPID_KEY2;
  }
}
async function getToken$1(messaging, options) {
  if (!navigator) {
    throw ERROR_FACTORY4.create("only-available-in-window");
  }
  if (Notification.permission === "default") {
    await Notification.requestPermission();
  }
  if (Notification.permission !== "granted") {
    throw ERROR_FACTORY4.create("permission-blocked");
  }
  await updateVapidKey(messaging, options === null || options === undefined ? undefined : options.vapidKey);
  await updateSwReg(messaging, options === null || options === undefined ? undefined : options.serviceWorkerRegistration);
  return getTokenInternal2(messaging);
}
async function logToScion(messaging, messageType, data) {
  const eventType = getEventType(messageType);
  const analytics = await messaging.firebaseDependencies.analyticsProvider.get();
  analytics.logEvent(eventType, {
    message_id: data[CONSOLE_CAMPAIGN_ID2],
    message_name: data[CONSOLE_CAMPAIGN_NAME],
    message_time: data[CONSOLE_CAMPAIGN_TIME],
    message_device_time: Math.floor(Date.now() / 1000)
  });
}
function getEventType(messageType) {
  switch (messageType) {
    case MessageType2.NOTIFICATION_CLICKED:
      return "notification_open";
    case MessageType2.PUSH_RECEIVED:
      return "notification_foreground";
    default:
      throw new Error;
  }
}
async function messageEventListener(messaging, event) {
  const internalPayload = event.data;
  if (!internalPayload.isFirebaseMessaging) {
    return;
  }
  if (messaging.onMessageHandler && internalPayload.messageType === MessageType2.PUSH_RECEIVED) {
    if (typeof messaging.onMessageHandler === "function") {
      messaging.onMessageHandler(externalizePayload2(internalPayload));
    } else {
      messaging.onMessageHandler.next(externalizePayload2(internalPayload));
    }
  }
  const dataPayload = internalPayload.data;
  if (isConsoleMessage2(dataPayload) && dataPayload[CONSOLE_CAMPAIGN_ANALYTICS_ENABLED] === "1") {
    await logToScion(messaging, internalPayload.messageType, dataPayload);
  }
}
function registerMessagingInWindow() {
  _registerComponent(new Component("messaging", WindowMessagingFactory, "PUBLIC"));
  _registerComponent(new Component("messaging-internal", WindowMessagingInternalFactory, "PRIVATE"));
  registerVersion(name4, version3);
  registerVersion(name4, version3, "esm2017");
}
var DEFAULT_SW_PATH = "/firebase-messaging-sw.js";
var DEFAULT_SW_SCOPE = "/firebase-cloud-messaging-push-scope";
var DEFAULT_VAPID_KEY2 = "BDOU99-h67HcA6JeFXHbSNMu7e2yNNu3RzoMj8TM4W88jITfq7ZmPvIM1Iv-4_l2LxQcYwhqby2xGpWwzjfAnG4";
var ENDPOINT2 = "https://fcmregistrations.googleapis.com/v1";
var CONSOLE_CAMPAIGN_ID2 = "google.c.a.c_id";
var CONSOLE_CAMPAIGN_NAME = "google.c.a.c_l";
var CONSOLE_CAMPAIGN_TIME = "google.c.a.ts";
var CONSOLE_CAMPAIGN_ANALYTICS_ENABLED = "google.c.a.e";
var MessageType$12;
(function(MessageType2) {
  MessageType2[MessageType2["DATA_MESSAGE"] = 1] = "DATA_MESSAGE";
  MessageType2[MessageType2["DISPLAY_NOTIFICATION"] = 3] = "DISPLAY_NOTIFICATION";
})(MessageType$12 || (MessageType$12 = {}));
var MessageType2;
(function(MessageType3) {
  MessageType3["PUSH_RECEIVED"] = "push-received";
  MessageType3["NOTIFICATION_CLICKED"] = "notification-clicked";
})(MessageType2 || (MessageType2 = {}));
var OLD_DB_NAME2 = "fcm_token_details_db";
var OLD_DB_VERSION2 = 5;
var OLD_OBJECT_STORE_NAME2 = "fcm_token_object_Store";
var DATABASE_NAME3 = "firebase-messaging-database";
var DATABASE_VERSION3 = 1;
var OBJECT_STORE_NAME3 = "firebase-messaging-store";
var dbPromise4 = null;
var ERROR_MAP2 = {
  ["missing-app-config-values"]: 'Missing App configuration value: "{$valueName}"',
  ["only-available-in-window"]: "This method is available in a Window context.",
  ["only-available-in-sw"]: "This method is available in a service worker context.",
  ["permission-default"]: "The notification permission was not granted and dismissed instead.",
  ["permission-blocked"]: "The notification permission was not granted and blocked instead.",
  ["unsupported-browser"]: "This browser doesn't support the API's required to use the Firebase SDK.",
  ["indexed-db-unsupported"]: "This browser doesn't support indexedDb.open() (ex. Safari iFrame, Firefox Private Browsing, etc)",
  ["failed-service-worker-registration"]: "We are unable to register the default service worker. {$browserErrorMessage}",
  ["token-subscribe-failed"]: "A problem occurred while subscribing the user to FCM: {$errorInfo}",
  ["token-subscribe-no-token"]: "FCM returned no token when subscribing the user to push.",
  ["token-unsubscribe-failed"]: "A problem occurred while unsubscribing the " + "user from FCM: {$errorInfo}",
  ["token-update-failed"]: "A problem occurred while updating the user from FCM: {$errorInfo}",
  ["token-update-no-token"]: "FCM returned no token when updating the user to push.",
  ["use-sw-after-get-token"]: "The useServiceWorker() method may only be called once and must be " + "called before calling getToken() to ensure your service worker is used.",
  ["invalid-sw-registration"]: "The input to useServiceWorker() must be a ServiceWorkerRegistration.",
  ["invalid-bg-handler"]: "The input to setBackgroundMessageHandler() must be a function.",
  ["invalid-vapid-key"]: "The public VAPID key must be a string.",
  ["use-vapid-key-after-get-token"]: "The usePublicVapidKey() method may only be called once and must be " + "called before calling getToken() to ensure your VAPID key is used."
};
var ERROR_FACTORY4 = new ErrorFactory("messaging", "Messaging", ERROR_MAP2);
var TOKEN_EXPIRATION_MS2 = 7 * 24 * 60 * 60 * 1000;
_mergeStrings2("hts/frbslgigp.ogepscmv/ieo/eaylg", "tp:/ieaeogn-agolai.o/1frlglgc/o");
_mergeStrings2("AzSCbw63g1R0nCw85jG8", "Iaya3yLKwmgvh7cF0q4");

class MessagingService2 {
  constructor(app6, installations3, analyticsProvider) {
    this.deliveryMetricsExportedToBigQueryEnabled = false;
    this.onBackgroundMessageHandler = null;
    this.onMessageHandler = null;
    this.logEvents = [];
    this.isLogServiceStarted = false;
    const appConfig = extractAppConfig3(app6);
    this.firebaseDependencies = {
      app: app6,
      appConfig,
      installations: installations3,
      analyticsProvider
    };
  }
  _delete() {
    return Promise.resolve();
  }
}
var name4 = "@firebase/messaging";
var version3 = "0.12.10";
var WindowMessagingFactory = (container) => {
  const messaging = new MessagingService2(container.getProvider("app").getImmediate(), container.getProvider("installations-internal").getImmediate(), container.getProvider("analytics-internal"));
  navigator.serviceWorker.addEventListener("message", (e) => messageEventListener(messaging, e));
  return messaging;
};
var WindowMessagingInternalFactory = (container) => {
  const messaging = container.getProvider("messaging").getImmediate();
  const messagingInternal = {
    getToken: (options) => getToken$1(messaging, options)
  };
  return messagingInternal;
};
registerMessagingInWindow();
// firebase.ts
function getFirebaseConfig() {
  return {
    apiKey: "AIzaSyAAvAllqjWyU0Q00HrUFDp7dtzWGMUitoA",
    authDomain: "message-poc-30dd9.firebaseapp.com",
    projectId: "message-poc-30dd9",
    storageBucket: "message-poc-30dd9.appspot.com",
    messagingSenderId: "516073286557",
    appId: "1:516073286557:web:55a03e1ee464a4781d1d74"
  };
}
function getFirebaseApp() {
  if (!app7) {
    app7 = initializeApp(getFirebaseConfig());
  }
  return app7;
}
var app7 = null;

// firebase-messaging-sw.ts
var firebaseApp = getFirebaseApp();
var messaging3 = getMessagingInSw(firebaseApp);
onBackgroundMessage(messaging3, (payload) => {
  console.log("[firebase-messaging-sw.js] Received background message ", payload);
  if (!payload || !payload.data) {
    console.log("No payload received.");
    return;
  }
  const notificationTitle = payload.data.title;
  const notificationOptions = {
    body: payload.data.body,
    icon: payload.data.icon,
    data: { url: payload.data.destinationUrl }
  };
  self.registration.showNotification(notificationTitle, notificationOptions).then(() => console.log("Notification shown.")).catch((error) => console.error("Error showing notification:", error));
});
self.addEventListener("notificationclick", (event) => {
  console.log("[Service Worker] Notification click Received.");
  event.notification.close();
  const url = event.notification.data?.url;
  if (!url) {
    return;
  }
  event.waitUntil(clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
    for (var i = 0;i < windowClients.length; i++) {
      var client = windowClients[i];
      if (client.url === url && "focus" in client) {
        return client.focus();
      }
    }
    if (clients.openWindow) {
      return clients.openWindow(url);
    }
  }));
});

//# debugId=EB841F3F3AEAB18D64756E2164756E21
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vbm9kZV9tb2R1bGVzL0BmaXJlYmFzZS91dGlsL2Rpc3QvaW5kZXguZXNtMjAxNy5qcyIsICIuLi9ub2RlX21vZHVsZXMvQGZpcmViYXNlL2NvbXBvbmVudC9kaXN0L2VzbS9pbmRleC5lc20yMDE3LmpzIiwgIi4uL25vZGVfbW9kdWxlcy9AZmlyZWJhc2UvbG9nZ2VyL2Rpc3QvZXNtL2luZGV4LmVzbTIwMTcuanMiLCAiLi4vbm9kZV9tb2R1bGVzL2lkYi9idWlsZC93cmFwLWlkYi12YWx1ZS5qcyIsICIuLi9ub2RlX21vZHVsZXMvaWRiL2J1aWxkL2luZGV4LmpzIiwgIi4uL25vZGVfbW9kdWxlcy9AZmlyZWJhc2UvYXBwL2Rpc3QvZXNtL2luZGV4LmVzbTIwMTcuanMiLCAiLi4vbm9kZV9tb2R1bGVzL0BmaXJlYmFzZS9pbnN0YWxsYXRpb25zL2Rpc3QvZXNtL2luZGV4LmVzbTIwMTcuanMiLCAiLi4vbm9kZV9tb2R1bGVzL0BmaXJlYmFzZS9tZXNzYWdpbmcvZGlzdC9lc20vaW5kZXguc3cuZXNtMjAxNy5qcyIsICIuLi9ub2RlX21vZHVsZXMvZmlyZWJhc2UvYXBwL2Rpc3QvZXNtL2luZGV4LmVzbS5qcyIsICIuLi9ub2RlX21vZHVsZXMvQGZpcmViYXNlL21lc3NhZ2luZy9kaXN0L2VzbS9pbmRleC5lc20yMDE3LmpzIiwgIi4uL2ZpcmViYXNlLnRzIiwgIi4uL2ZpcmViYXNlLW1lc3NhZ2luZy1zdy50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsKICAgICIvKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMTcgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG4vKipcclxuICogQGZpbGVvdmVydmlldyBGaXJlYmFzZSBjb25zdGFudHMuICBTb21lIG9mIHRoZXNlIChAZGVmaW5lcykgY2FuIGJlIG92ZXJyaWRkZW4gYXQgY29tcGlsZS10aW1lLlxyXG4gKi9cclxuY29uc3QgQ09OU1RBTlRTID0ge1xyXG4gICAgLyoqXHJcbiAgICAgKiBAZGVmaW5lIHtib29sZWFufSBXaGV0aGVyIHRoaXMgaXMgdGhlIGNsaWVudCBOb2RlLmpzIFNESy5cclxuICAgICAqL1xyXG4gICAgTk9ERV9DTElFTlQ6IGZhbHNlLFxyXG4gICAgLyoqXHJcbiAgICAgKiBAZGVmaW5lIHtib29sZWFufSBXaGV0aGVyIHRoaXMgaXMgdGhlIEFkbWluIE5vZGUuanMgU0RLLlxyXG4gICAgICovXHJcbiAgICBOT0RFX0FETUlOOiBmYWxzZSxcclxuICAgIC8qKlxyXG4gICAgICogRmlyZWJhc2UgU0RLIFZlcnNpb25cclxuICAgICAqL1xyXG4gICAgU0RLX1ZFUlNJT046ICcke0pTQ09SRV9WRVJTSU9OfSdcclxufTtcblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDE3IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuLyoqXHJcbiAqIFRocm93cyBhbiBlcnJvciBpZiB0aGUgcHJvdmlkZWQgYXNzZXJ0aW9uIGlzIGZhbHN5XHJcbiAqL1xyXG5jb25zdCBhc3NlcnQgPSBmdW5jdGlvbiAoYXNzZXJ0aW9uLCBtZXNzYWdlKSB7XHJcbiAgICBpZiAoIWFzc2VydGlvbikge1xyXG4gICAgICAgIHRocm93IGFzc2VydGlvbkVycm9yKG1lc3NhZ2UpO1xyXG4gICAgfVxyXG59O1xyXG4vKipcclxuICogUmV0dXJucyBhbiBFcnJvciBvYmplY3Qgc3VpdGFibGUgZm9yIHRocm93aW5nLlxyXG4gKi9cclxuY29uc3QgYXNzZXJ0aW9uRXJyb3IgPSBmdW5jdGlvbiAobWVzc2FnZSkge1xyXG4gICAgcmV0dXJuIG5ldyBFcnJvcignRmlyZWJhc2UgRGF0YWJhc2UgKCcgK1xyXG4gICAgICAgIENPTlNUQU5UUy5TREtfVkVSU0lPTiArXHJcbiAgICAgICAgJykgSU5URVJOQUwgQVNTRVJUIEZBSUxFRDogJyArXHJcbiAgICAgICAgbWVzc2FnZSk7XHJcbn07XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAxNyBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbmNvbnN0IHN0cmluZ1RvQnl0ZUFycmF5JDEgPSBmdW5jdGlvbiAoc3RyKSB7XHJcbiAgICAvLyBUT0RPKHVzZXIpOiBVc2UgbmF0aXZlIGltcGxlbWVudGF0aW9ucyBpZi93aGVuIGF2YWlsYWJsZVxyXG4gICAgY29uc3Qgb3V0ID0gW107XHJcbiAgICBsZXQgcCA9IDA7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN0ci5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGxldCBjID0gc3RyLmNoYXJDb2RlQXQoaSk7XHJcbiAgICAgICAgaWYgKGMgPCAxMjgpIHtcclxuICAgICAgICAgICAgb3V0W3ArK10gPSBjO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChjIDwgMjA0OCkge1xyXG4gICAgICAgICAgICBvdXRbcCsrXSA9IChjID4+IDYpIHwgMTkyO1xyXG4gICAgICAgICAgICBvdXRbcCsrXSA9IChjICYgNjMpIHwgMTI4O1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmICgoYyAmIDB4ZmMwMCkgPT09IDB4ZDgwMCAmJlxyXG4gICAgICAgICAgICBpICsgMSA8IHN0ci5sZW5ndGggJiZcclxuICAgICAgICAgICAgKHN0ci5jaGFyQ29kZUF0KGkgKyAxKSAmIDB4ZmMwMCkgPT09IDB4ZGMwMCkge1xyXG4gICAgICAgICAgICAvLyBTdXJyb2dhdGUgUGFpclxyXG4gICAgICAgICAgICBjID0gMHgxMDAwMCArICgoYyAmIDB4MDNmZikgPDwgMTApICsgKHN0ci5jaGFyQ29kZUF0KCsraSkgJiAweDAzZmYpO1xyXG4gICAgICAgICAgICBvdXRbcCsrXSA9IChjID4+IDE4KSB8IDI0MDtcclxuICAgICAgICAgICAgb3V0W3ArK10gPSAoKGMgPj4gMTIpICYgNjMpIHwgMTI4O1xyXG4gICAgICAgICAgICBvdXRbcCsrXSA9ICgoYyA+PiA2KSAmIDYzKSB8IDEyODtcclxuICAgICAgICAgICAgb3V0W3ArK10gPSAoYyAmIDYzKSB8IDEyODtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIG91dFtwKytdID0gKGMgPj4gMTIpIHwgMjI0O1xyXG4gICAgICAgICAgICBvdXRbcCsrXSA9ICgoYyA+PiA2KSAmIDYzKSB8IDEyODtcclxuICAgICAgICAgICAgb3V0W3ArK10gPSAoYyAmIDYzKSB8IDEyODtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gb3V0O1xyXG59O1xyXG4vKipcclxuICogVHVybnMgYW4gYXJyYXkgb2YgbnVtYmVycyBpbnRvIHRoZSBzdHJpbmcgZ2l2ZW4gYnkgdGhlIGNvbmNhdGVuYXRpb24gb2YgdGhlXHJcbiAqIGNoYXJhY3RlcnMgdG8gd2hpY2ggdGhlIG51bWJlcnMgY29ycmVzcG9uZC5cclxuICogQHBhcmFtIGJ5dGVzIEFycmF5IG9mIG51bWJlcnMgcmVwcmVzZW50aW5nIGNoYXJhY3RlcnMuXHJcbiAqIEByZXR1cm4gU3RyaW5naWZpY2F0aW9uIG9mIHRoZSBhcnJheS5cclxuICovXHJcbmNvbnN0IGJ5dGVBcnJheVRvU3RyaW5nID0gZnVuY3Rpb24gKGJ5dGVzKSB7XHJcbiAgICAvLyBUT0RPKHVzZXIpOiBVc2UgbmF0aXZlIGltcGxlbWVudGF0aW9ucyBpZi93aGVuIGF2YWlsYWJsZVxyXG4gICAgY29uc3Qgb3V0ID0gW107XHJcbiAgICBsZXQgcG9zID0gMCwgYyA9IDA7XHJcbiAgICB3aGlsZSAocG9zIDwgYnl0ZXMubGVuZ3RoKSB7XHJcbiAgICAgICAgY29uc3QgYzEgPSBieXRlc1twb3MrK107XHJcbiAgICAgICAgaWYgKGMxIDwgMTI4KSB7XHJcbiAgICAgICAgICAgIG91dFtjKytdID0gU3RyaW5nLmZyb21DaGFyQ29kZShjMSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGMxID4gMTkxICYmIGMxIDwgMjI0KSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGMyID0gYnl0ZXNbcG9zKytdO1xyXG4gICAgICAgICAgICBvdXRbYysrXSA9IFN0cmluZy5mcm9tQ2hhckNvZGUoKChjMSAmIDMxKSA8PCA2KSB8IChjMiAmIDYzKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGMxID4gMjM5ICYmIGMxIDwgMzY1KSB7XHJcbiAgICAgICAgICAgIC8vIFN1cnJvZ2F0ZSBQYWlyXHJcbiAgICAgICAgICAgIGNvbnN0IGMyID0gYnl0ZXNbcG9zKytdO1xyXG4gICAgICAgICAgICBjb25zdCBjMyA9IGJ5dGVzW3BvcysrXTtcclxuICAgICAgICAgICAgY29uc3QgYzQgPSBieXRlc1twb3MrK107XHJcbiAgICAgICAgICAgIGNvbnN0IHUgPSAoKChjMSAmIDcpIDw8IDE4KSB8ICgoYzIgJiA2MykgPDwgMTIpIHwgKChjMyAmIDYzKSA8PCA2KSB8IChjNCAmIDYzKSkgLVxyXG4gICAgICAgICAgICAgICAgMHgxMDAwMDtcclxuICAgICAgICAgICAgb3V0W2MrK10gPSBTdHJpbmcuZnJvbUNoYXJDb2RlKDB4ZDgwMCArICh1ID4+IDEwKSk7XHJcbiAgICAgICAgICAgIG91dFtjKytdID0gU3RyaW5nLmZyb21DaGFyQ29kZSgweGRjMDAgKyAodSAmIDEwMjMpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGMyID0gYnl0ZXNbcG9zKytdO1xyXG4gICAgICAgICAgICBjb25zdCBjMyA9IGJ5dGVzW3BvcysrXTtcclxuICAgICAgICAgICAgb3V0W2MrK10gPSBTdHJpbmcuZnJvbUNoYXJDb2RlKCgoYzEgJiAxNSkgPDwgMTIpIHwgKChjMiAmIDYzKSA8PCA2KSB8IChjMyAmIDYzKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIG91dC5qb2luKCcnKTtcclxufTtcclxuLy8gV2UgZGVmaW5lIGl0IGFzIGFuIG9iamVjdCBsaXRlcmFsIGluc3RlYWQgb2YgYSBjbGFzcyBiZWNhdXNlIGEgY2xhc3MgY29tcGlsZWQgZG93biB0byBlczUgY2FuJ3RcclxuLy8gYmUgdHJlZXNoYWtlZC4gaHR0cHM6Ly9naXRodWIuY29tL3JvbGx1cC9yb2xsdXAvaXNzdWVzLzE2OTFcclxuLy8gU3RhdGljIGxvb2t1cCBtYXBzLCBsYXppbHkgcG9wdWxhdGVkIGJ5IGluaXRfKClcclxuY29uc3QgYmFzZTY0ID0ge1xyXG4gICAgLyoqXHJcbiAgICAgKiBNYXBzIGJ5dGVzIHRvIGNoYXJhY3RlcnMuXHJcbiAgICAgKi9cclxuICAgIGJ5dGVUb0NoYXJNYXBfOiBudWxsLFxyXG4gICAgLyoqXHJcbiAgICAgKiBNYXBzIGNoYXJhY3RlcnMgdG8gYnl0ZXMuXHJcbiAgICAgKi9cclxuICAgIGNoYXJUb0J5dGVNYXBfOiBudWxsLFxyXG4gICAgLyoqXHJcbiAgICAgKiBNYXBzIGJ5dGVzIHRvIHdlYnNhZmUgY2hhcmFjdGVycy5cclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIGJ5dGVUb0NoYXJNYXBXZWJTYWZlXzogbnVsbCxcclxuICAgIC8qKlxyXG4gICAgICogTWFwcyB3ZWJzYWZlIGNoYXJhY3RlcnMgdG8gYnl0ZXMuXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBjaGFyVG9CeXRlTWFwV2ViU2FmZV86IG51bGwsXHJcbiAgICAvKipcclxuICAgICAqIE91ciBkZWZhdWx0IGFscGhhYmV0LCBzaGFyZWQgYmV0d2VlblxyXG4gICAgICogRU5DT0RFRF9WQUxTIGFuZCBFTkNPREVEX1ZBTFNfV0VCU0FGRVxyXG4gICAgICovXHJcbiAgICBFTkNPREVEX1ZBTFNfQkFTRTogJ0FCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaJyArICdhYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5eicgKyAnMDEyMzQ1Njc4OScsXHJcbiAgICAvKipcclxuICAgICAqIE91ciBkZWZhdWx0IGFscGhhYmV0LiBWYWx1ZSA2NCAoPSkgaXMgc3BlY2lhbDsgaXQgbWVhbnMgXCJub3RoaW5nLlwiXHJcbiAgICAgKi9cclxuICAgIGdldCBFTkNPREVEX1ZBTFMoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuRU5DT0RFRF9WQUxTX0JBU0UgKyAnKy89JztcclxuICAgIH0sXHJcbiAgICAvKipcclxuICAgICAqIE91ciB3ZWJzYWZlIGFscGhhYmV0LlxyXG4gICAgICovXHJcbiAgICBnZXQgRU5DT0RFRF9WQUxTX1dFQlNBRkUoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuRU5DT0RFRF9WQUxTX0JBU0UgKyAnLV8uJztcclxuICAgIH0sXHJcbiAgICAvKipcclxuICAgICAqIFdoZXRoZXIgdGhpcyBicm93c2VyIHN1cHBvcnRzIHRoZSBhdG9iIGFuZCBidG9hIGZ1bmN0aW9ucy4gVGhpcyBleHRlbnNpb25cclxuICAgICAqIHN0YXJ0ZWQgYXQgTW96aWxsYSBidXQgaXMgbm93IGltcGxlbWVudGVkIGJ5IG1hbnkgYnJvd3NlcnMuIFdlIHVzZSB0aGVcclxuICAgICAqIEFTU1VNRV8qIHZhcmlhYmxlcyB0byBhdm9pZCBwdWxsaW5nIGluIHRoZSBmdWxsIHVzZXJhZ2VudCBkZXRlY3Rpb24gbGlicmFyeVxyXG4gICAgICogYnV0IHN0aWxsIGFsbG93aW5nIHRoZSBzdGFuZGFyZCBwZXItYnJvd3NlciBjb21waWxhdGlvbnMuXHJcbiAgICAgKlxyXG4gICAgICovXHJcbiAgICBIQVNfTkFUSVZFX1NVUFBPUlQ6IHR5cGVvZiBhdG9iID09PSAnZnVuY3Rpb24nLFxyXG4gICAgLyoqXHJcbiAgICAgKiBCYXNlNjQtZW5jb2RlIGFuIGFycmF5IG9mIGJ5dGVzLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBpbnB1dCBBbiBhcnJheSBvZiBieXRlcyAobnVtYmVycyB3aXRoXHJcbiAgICAgKiAgICAgdmFsdWUgaW4gWzAsIDI1NV0pIHRvIGVuY29kZS5cclxuICAgICAqIEBwYXJhbSB3ZWJTYWZlIEJvb2xlYW4gaW5kaWNhdGluZyB3ZSBzaG91bGQgdXNlIHRoZVxyXG4gICAgICogICAgIGFsdGVybmF0aXZlIGFscGhhYmV0LlxyXG4gICAgICogQHJldHVybiBUaGUgYmFzZTY0IGVuY29kZWQgc3RyaW5nLlxyXG4gICAgICovXHJcbiAgICBlbmNvZGVCeXRlQXJyYXkoaW5wdXQsIHdlYlNhZmUpIHtcclxuICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkoaW5wdXQpKSB7XHJcbiAgICAgICAgICAgIHRocm93IEVycm9yKCdlbmNvZGVCeXRlQXJyYXkgdGFrZXMgYW4gYXJyYXkgYXMgYSBwYXJhbWV0ZXInKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5pbml0XygpO1xyXG4gICAgICAgIGNvbnN0IGJ5dGVUb0NoYXJNYXAgPSB3ZWJTYWZlXHJcbiAgICAgICAgICAgID8gdGhpcy5ieXRlVG9DaGFyTWFwV2ViU2FmZV9cclxuICAgICAgICAgICAgOiB0aGlzLmJ5dGVUb0NoYXJNYXBfO1xyXG4gICAgICAgIGNvbnN0IG91dHB1dCA9IFtdO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaW5wdXQubGVuZ3RoOyBpICs9IDMpIHtcclxuICAgICAgICAgICAgY29uc3QgYnl0ZTEgPSBpbnB1dFtpXTtcclxuICAgICAgICAgICAgY29uc3QgaGF2ZUJ5dGUyID0gaSArIDEgPCBpbnB1dC5sZW5ndGg7XHJcbiAgICAgICAgICAgIGNvbnN0IGJ5dGUyID0gaGF2ZUJ5dGUyID8gaW5wdXRbaSArIDFdIDogMDtcclxuICAgICAgICAgICAgY29uc3QgaGF2ZUJ5dGUzID0gaSArIDIgPCBpbnB1dC5sZW5ndGg7XHJcbiAgICAgICAgICAgIGNvbnN0IGJ5dGUzID0gaGF2ZUJ5dGUzID8gaW5wdXRbaSArIDJdIDogMDtcclxuICAgICAgICAgICAgY29uc3Qgb3V0Qnl0ZTEgPSBieXRlMSA+PiAyO1xyXG4gICAgICAgICAgICBjb25zdCBvdXRCeXRlMiA9ICgoYnl0ZTEgJiAweDAzKSA8PCA0KSB8IChieXRlMiA+PiA0KTtcclxuICAgICAgICAgICAgbGV0IG91dEJ5dGUzID0gKChieXRlMiAmIDB4MGYpIDw8IDIpIHwgKGJ5dGUzID4+IDYpO1xyXG4gICAgICAgICAgICBsZXQgb3V0Qnl0ZTQgPSBieXRlMyAmIDB4M2Y7XHJcbiAgICAgICAgICAgIGlmICghaGF2ZUJ5dGUzKSB7XHJcbiAgICAgICAgICAgICAgICBvdXRCeXRlNCA9IDY0O1xyXG4gICAgICAgICAgICAgICAgaWYgKCFoYXZlQnl0ZTIpIHtcclxuICAgICAgICAgICAgICAgICAgICBvdXRCeXRlMyA9IDY0O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG91dHB1dC5wdXNoKGJ5dGVUb0NoYXJNYXBbb3V0Qnl0ZTFdLCBieXRlVG9DaGFyTWFwW291dEJ5dGUyXSwgYnl0ZVRvQ2hhck1hcFtvdXRCeXRlM10sIGJ5dGVUb0NoYXJNYXBbb3V0Qnl0ZTRdKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG91dHB1dC5qb2luKCcnKTtcclxuICAgIH0sXHJcbiAgICAvKipcclxuICAgICAqIEJhc2U2NC1lbmNvZGUgYSBzdHJpbmcuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGlucHV0IEEgc3RyaW5nIHRvIGVuY29kZS5cclxuICAgICAqIEBwYXJhbSB3ZWJTYWZlIElmIHRydWUsIHdlIHNob3VsZCB1c2UgdGhlXHJcbiAgICAgKiAgICAgYWx0ZXJuYXRpdmUgYWxwaGFiZXQuXHJcbiAgICAgKiBAcmV0dXJuIFRoZSBiYXNlNjQgZW5jb2RlZCBzdHJpbmcuXHJcbiAgICAgKi9cclxuICAgIGVuY29kZVN0cmluZyhpbnB1dCwgd2ViU2FmZSkge1xyXG4gICAgICAgIC8vIFNob3J0Y3V0IGZvciBNb3ppbGxhIGJyb3dzZXJzIHRoYXQgaW1wbGVtZW50XHJcbiAgICAgICAgLy8gYSBuYXRpdmUgYmFzZTY0IGVuY29kZXIgaW4gdGhlIGZvcm0gb2YgXCJidG9hL2F0b2JcIlxyXG4gICAgICAgIGlmICh0aGlzLkhBU19OQVRJVkVfU1VQUE9SVCAmJiAhd2ViU2FmZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gYnRvYShpbnB1dCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLmVuY29kZUJ5dGVBcnJheShzdHJpbmdUb0J5dGVBcnJheSQxKGlucHV0KSwgd2ViU2FmZSk7XHJcbiAgICB9LFxyXG4gICAgLyoqXHJcbiAgICAgKiBCYXNlNjQtZGVjb2RlIGEgc3RyaW5nLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBpbnB1dCB0byBkZWNvZGUuXHJcbiAgICAgKiBAcGFyYW0gd2ViU2FmZSBUcnVlIGlmIHdlIHNob3VsZCB1c2UgdGhlXHJcbiAgICAgKiAgICAgYWx0ZXJuYXRpdmUgYWxwaGFiZXQuXHJcbiAgICAgKiBAcmV0dXJuIHN0cmluZyByZXByZXNlbnRpbmcgdGhlIGRlY29kZWQgdmFsdWUuXHJcbiAgICAgKi9cclxuICAgIGRlY29kZVN0cmluZyhpbnB1dCwgd2ViU2FmZSkge1xyXG4gICAgICAgIC8vIFNob3J0Y3V0IGZvciBNb3ppbGxhIGJyb3dzZXJzIHRoYXQgaW1wbGVtZW50XHJcbiAgICAgICAgLy8gYSBuYXRpdmUgYmFzZTY0IGVuY29kZXIgaW4gdGhlIGZvcm0gb2YgXCJidG9hL2F0b2JcIlxyXG4gICAgICAgIGlmICh0aGlzLkhBU19OQVRJVkVfU1VQUE9SVCAmJiAhd2ViU2FmZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gYXRvYihpbnB1dCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBieXRlQXJyYXlUb1N0cmluZyh0aGlzLmRlY29kZVN0cmluZ1RvQnl0ZUFycmF5KGlucHV0LCB3ZWJTYWZlKSk7XHJcbiAgICB9LFxyXG4gICAgLyoqXHJcbiAgICAgKiBCYXNlNjQtZGVjb2RlIGEgc3RyaW5nLlxyXG4gICAgICpcclxuICAgICAqIEluIGJhc2UtNjQgZGVjb2RpbmcsIGdyb3VwcyBvZiBmb3VyIGNoYXJhY3RlcnMgYXJlIGNvbnZlcnRlZCBpbnRvIHRocmVlXHJcbiAgICAgKiBieXRlcy4gIElmIHRoZSBlbmNvZGVyIGRpZCBub3QgYXBwbHkgcGFkZGluZywgdGhlIGlucHV0IGxlbmd0aCBtYXkgbm90XHJcbiAgICAgKiBiZSBhIG11bHRpcGxlIG9mIDQuXHJcbiAgICAgKlxyXG4gICAgICogSW4gdGhpcyBjYXNlLCB0aGUgbGFzdCBncm91cCB3aWxsIGhhdmUgZmV3ZXIgdGhhbiA0IGNoYXJhY3RlcnMsIGFuZFxyXG4gICAgICogcGFkZGluZyB3aWxsIGJlIGluZmVycmVkLiAgSWYgdGhlIGdyb3VwIGhhcyBvbmUgb3IgdHdvIGNoYXJhY3RlcnMsIGl0IGRlY29kZXNcclxuICAgICAqIHRvIG9uZSBieXRlLiAgSWYgdGhlIGdyb3VwIGhhcyB0aHJlZSBjaGFyYWN0ZXJzLCBpdCBkZWNvZGVzIHRvIHR3byBieXRlcy5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gaW5wdXQgSW5wdXQgdG8gZGVjb2RlLlxyXG4gICAgICogQHBhcmFtIHdlYlNhZmUgVHJ1ZSBpZiB3ZSBzaG91bGQgdXNlIHRoZSB3ZWItc2FmZSBhbHBoYWJldC5cclxuICAgICAqIEByZXR1cm4gYnl0ZXMgcmVwcmVzZW50aW5nIHRoZSBkZWNvZGVkIHZhbHVlLlxyXG4gICAgICovXHJcbiAgICBkZWNvZGVTdHJpbmdUb0J5dGVBcnJheShpbnB1dCwgd2ViU2FmZSkge1xyXG4gICAgICAgIHRoaXMuaW5pdF8oKTtcclxuICAgICAgICBjb25zdCBjaGFyVG9CeXRlTWFwID0gd2ViU2FmZVxyXG4gICAgICAgICAgICA/IHRoaXMuY2hhclRvQnl0ZU1hcFdlYlNhZmVfXHJcbiAgICAgICAgICAgIDogdGhpcy5jaGFyVG9CeXRlTWFwXztcclxuICAgICAgICBjb25zdCBvdXRwdXQgPSBbXTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGlucHV0Lmxlbmd0aDspIHtcclxuICAgICAgICAgICAgY29uc3QgYnl0ZTEgPSBjaGFyVG9CeXRlTWFwW2lucHV0LmNoYXJBdChpKyspXTtcclxuICAgICAgICAgICAgY29uc3QgaGF2ZUJ5dGUyID0gaSA8IGlucHV0Lmxlbmd0aDtcclxuICAgICAgICAgICAgY29uc3QgYnl0ZTIgPSBoYXZlQnl0ZTIgPyBjaGFyVG9CeXRlTWFwW2lucHV0LmNoYXJBdChpKV0gOiAwO1xyXG4gICAgICAgICAgICArK2k7XHJcbiAgICAgICAgICAgIGNvbnN0IGhhdmVCeXRlMyA9IGkgPCBpbnB1dC5sZW5ndGg7XHJcbiAgICAgICAgICAgIGNvbnN0IGJ5dGUzID0gaGF2ZUJ5dGUzID8gY2hhclRvQnl0ZU1hcFtpbnB1dC5jaGFyQXQoaSldIDogNjQ7XHJcbiAgICAgICAgICAgICsraTtcclxuICAgICAgICAgICAgY29uc3QgaGF2ZUJ5dGU0ID0gaSA8IGlucHV0Lmxlbmd0aDtcclxuICAgICAgICAgICAgY29uc3QgYnl0ZTQgPSBoYXZlQnl0ZTQgPyBjaGFyVG9CeXRlTWFwW2lucHV0LmNoYXJBdChpKV0gOiA2NDtcclxuICAgICAgICAgICAgKytpO1xyXG4gICAgICAgICAgICBpZiAoYnl0ZTEgPT0gbnVsbCB8fCBieXRlMiA9PSBudWxsIHx8IGJ5dGUzID09IG51bGwgfHwgYnl0ZTQgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IERlY29kZUJhc2U2NFN0cmluZ0Vycm9yKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3Qgb3V0Qnl0ZTEgPSAoYnl0ZTEgPDwgMikgfCAoYnl0ZTIgPj4gNCk7XHJcbiAgICAgICAgICAgIG91dHB1dC5wdXNoKG91dEJ5dGUxKTtcclxuICAgICAgICAgICAgaWYgKGJ5dGUzICE9PSA2NCkge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgb3V0Qnl0ZTIgPSAoKGJ5dGUyIDw8IDQpICYgMHhmMCkgfCAoYnl0ZTMgPj4gMik7XHJcbiAgICAgICAgICAgICAgICBvdXRwdXQucHVzaChvdXRCeXRlMik7XHJcbiAgICAgICAgICAgICAgICBpZiAoYnl0ZTQgIT09IDY0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgb3V0Qnl0ZTMgPSAoKGJ5dGUzIDw8IDYpICYgMHhjMCkgfCBieXRlNDtcclxuICAgICAgICAgICAgICAgICAgICBvdXRwdXQucHVzaChvdXRCeXRlMyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG91dHB1dDtcclxuICAgIH0sXHJcbiAgICAvKipcclxuICAgICAqIExhenkgc3RhdGljIGluaXRpYWxpemF0aW9uIGZ1bmN0aW9uLiBDYWxsZWQgYmVmb3JlXHJcbiAgICAgKiBhY2Nlc3NpbmcgYW55IG9mIHRoZSBzdGF0aWMgbWFwIHZhcmlhYmxlcy5cclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIGluaXRfKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5ieXRlVG9DaGFyTWFwXykge1xyXG4gICAgICAgICAgICB0aGlzLmJ5dGVUb0NoYXJNYXBfID0ge307XHJcbiAgICAgICAgICAgIHRoaXMuY2hhclRvQnl0ZU1hcF8gPSB7fTtcclxuICAgICAgICAgICAgdGhpcy5ieXRlVG9DaGFyTWFwV2ViU2FmZV8gPSB7fTtcclxuICAgICAgICAgICAgdGhpcy5jaGFyVG9CeXRlTWFwV2ViU2FmZV8gPSB7fTtcclxuICAgICAgICAgICAgLy8gV2Ugd2FudCBxdWljayBtYXBwaW5ncyBiYWNrIGFuZCBmb3J0aCwgc28gd2UgcHJlY29tcHV0ZSB0d28gbWFwcy5cclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLkVOQ09ERURfVkFMUy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ieXRlVG9DaGFyTWFwX1tpXSA9IHRoaXMuRU5DT0RFRF9WQUxTLmNoYXJBdChpKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2hhclRvQnl0ZU1hcF9bdGhpcy5ieXRlVG9DaGFyTWFwX1tpXV0gPSBpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ieXRlVG9DaGFyTWFwV2ViU2FmZV9baV0gPSB0aGlzLkVOQ09ERURfVkFMU19XRUJTQUZFLmNoYXJBdChpKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2hhclRvQnl0ZU1hcFdlYlNhZmVfW3RoaXMuYnl0ZVRvQ2hhck1hcFdlYlNhZmVfW2ldXSA9IGk7XHJcbiAgICAgICAgICAgICAgICAvLyBCZSBmb3JnaXZpbmcgd2hlbiBkZWNvZGluZyBhbmQgY29ycmVjdGx5IGRlY29kZSBib3RoIGVuY29kaW5ncy5cclxuICAgICAgICAgICAgICAgIGlmIChpID49IHRoaXMuRU5DT0RFRF9WQUxTX0JBU0UubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGFyVG9CeXRlTWFwX1t0aGlzLkVOQ09ERURfVkFMU19XRUJTQUZFLmNoYXJBdChpKV0gPSBpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2hhclRvQnl0ZU1hcFdlYlNhZmVfW3RoaXMuRU5DT0RFRF9WQUxTLmNoYXJBdChpKV0gPSBpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59O1xyXG4vKipcclxuICogQW4gZXJyb3IgZW5jb3VudGVyZWQgd2hpbGUgZGVjb2RpbmcgYmFzZTY0IHN0cmluZy5cclxuICovXHJcbmNsYXNzIERlY29kZUJhc2U2NFN0cmluZ0Vycm9yIGV4dGVuZHMgRXJyb3Ige1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoLi4uYXJndW1lbnRzKTtcclxuICAgICAgICB0aGlzLm5hbWUgPSAnRGVjb2RlQmFzZTY0U3RyaW5nRXJyb3InO1xyXG4gICAgfVxyXG59XHJcbi8qKlxyXG4gKiBVUkwtc2FmZSBiYXNlNjQgZW5jb2RpbmdcclxuICovXHJcbmNvbnN0IGJhc2U2NEVuY29kZSA9IGZ1bmN0aW9uIChzdHIpIHtcclxuICAgIGNvbnN0IHV0ZjhCeXRlcyA9IHN0cmluZ1RvQnl0ZUFycmF5JDEoc3RyKTtcclxuICAgIHJldHVybiBiYXNlNjQuZW5jb2RlQnl0ZUFycmF5KHV0ZjhCeXRlcywgdHJ1ZSk7XHJcbn07XHJcbi8qKlxyXG4gKiBVUkwtc2FmZSBiYXNlNjQgZW5jb2RpbmcgKHdpdGhvdXQgXCIuXCIgcGFkZGluZyBpbiB0aGUgZW5kKS5cclxuICogZS5nLiBVc2VkIGluIEpTT04gV2ViIFRva2VuIChKV1QpIHBhcnRzLlxyXG4gKi9cclxuY29uc3QgYmFzZTY0dXJsRW5jb2RlV2l0aG91dFBhZGRpbmcgPSBmdW5jdGlvbiAoc3RyKSB7XHJcbiAgICAvLyBVc2UgYmFzZTY0dXJsIGVuY29kaW5nIGFuZCByZW1vdmUgcGFkZGluZyBpbiB0aGUgZW5kIChkb3QgY2hhcmFjdGVycykuXHJcbiAgICByZXR1cm4gYmFzZTY0RW5jb2RlKHN0cikucmVwbGFjZSgvXFwuL2csICcnKTtcclxufTtcclxuLyoqXHJcbiAqIFVSTC1zYWZlIGJhc2U2NCBkZWNvZGluZ1xyXG4gKlxyXG4gKiBOT1RFOiBETyBOT1QgdXNlIHRoZSBnbG9iYWwgYXRvYigpIGZ1bmN0aW9uIC0gaXQgZG9lcyBOT1Qgc3VwcG9ydCB0aGVcclxuICogYmFzZTY0VXJsIHZhcmlhbnQgZW5jb2RpbmcuXHJcbiAqXHJcbiAqIEBwYXJhbSBzdHIgVG8gYmUgZGVjb2RlZFxyXG4gKiBAcmV0dXJuIERlY29kZWQgcmVzdWx0LCBpZiBwb3NzaWJsZVxyXG4gKi9cclxuY29uc3QgYmFzZTY0RGVjb2RlID0gZnVuY3Rpb24gKHN0cikge1xyXG4gICAgdHJ5IHtcclxuICAgICAgICByZXR1cm4gYmFzZTY0LmRlY29kZVN0cmluZyhzdHIsIHRydWUpO1xyXG4gICAgfVxyXG4gICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICBjb25zb2xlLmVycm9yKCdiYXNlNjREZWNvZGUgZmFpbGVkOiAnLCBlKTtcclxuICAgIH1cclxuICAgIHJldHVybiBudWxsO1xyXG59O1xuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMTcgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG4vKipcclxuICogRG8gYSBkZWVwLWNvcHkgb2YgYmFzaWMgSmF2YVNjcmlwdCBPYmplY3RzIG9yIEFycmF5cy5cclxuICovXHJcbmZ1bmN0aW9uIGRlZXBDb3B5KHZhbHVlKSB7XHJcbiAgICByZXR1cm4gZGVlcEV4dGVuZCh1bmRlZmluZWQsIHZhbHVlKTtcclxufVxyXG4vKipcclxuICogQ29weSBwcm9wZXJ0aWVzIGZyb20gc291cmNlIHRvIHRhcmdldCAocmVjdXJzaXZlbHkgYWxsb3dzIGV4dGVuc2lvblxyXG4gKiBvZiBPYmplY3RzIGFuZCBBcnJheXMpLiAgU2NhbGFyIHZhbHVlcyBpbiB0aGUgdGFyZ2V0IGFyZSBvdmVyLXdyaXR0ZW4uXHJcbiAqIElmIHRhcmdldCBpcyB1bmRlZmluZWQsIGFuIG9iamVjdCBvZiB0aGUgYXBwcm9wcmlhdGUgdHlwZSB3aWxsIGJlIGNyZWF0ZWRcclxuICogKGFuZCByZXR1cm5lZCkuXHJcbiAqXHJcbiAqIFdlIHJlY3Vyc2l2ZWx5IGNvcHkgYWxsIGNoaWxkIHByb3BlcnRpZXMgb2YgcGxhaW4gT2JqZWN0cyBpbiB0aGUgc291cmNlLSBzb1xyXG4gKiB0aGF0IG5hbWVzcGFjZS0gbGlrZSBkaWN0aW9uYXJpZXMgYXJlIG1lcmdlZC5cclxuICpcclxuICogTm90ZSB0aGF0IHRoZSB0YXJnZXQgY2FuIGJlIGEgZnVuY3Rpb24sIGluIHdoaWNoIGNhc2UgdGhlIHByb3BlcnRpZXMgaW5cclxuICogdGhlIHNvdXJjZSBPYmplY3QgYXJlIGNvcGllZCBvbnRvIGl0IGFzIHN0YXRpYyBwcm9wZXJ0aWVzIG9mIHRoZSBGdW5jdGlvbi5cclxuICpcclxuICogTm90ZTogd2UgZG9uJ3QgbWVyZ2UgX19wcm90b19fIHRvIHByZXZlbnQgcHJvdG90eXBlIHBvbGx1dGlvblxyXG4gKi9cclxuZnVuY3Rpb24gZGVlcEV4dGVuZCh0YXJnZXQsIHNvdXJjZSkge1xyXG4gICAgaWYgKCEoc291cmNlIGluc3RhbmNlb2YgT2JqZWN0KSkge1xyXG4gICAgICAgIHJldHVybiBzb3VyY2U7XHJcbiAgICB9XHJcbiAgICBzd2l0Y2ggKHNvdXJjZS5jb25zdHJ1Y3Rvcikge1xyXG4gICAgICAgIGNhc2UgRGF0ZTpcclxuICAgICAgICAgICAgLy8gVHJlYXQgRGF0ZXMgbGlrZSBzY2FsYXJzOyBpZiB0aGUgdGFyZ2V0IGRhdGUgb2JqZWN0IGhhZCBhbnkgY2hpbGRcclxuICAgICAgICAgICAgLy8gcHJvcGVydGllcyAtIHRoZXkgd2lsbCBiZSBsb3N0IVxyXG4gICAgICAgICAgICBjb25zdCBkYXRlVmFsdWUgPSBzb3VyY2U7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgRGF0ZShkYXRlVmFsdWUuZ2V0VGltZSgpKTtcclxuICAgICAgICBjYXNlIE9iamVjdDpcclxuICAgICAgICAgICAgaWYgKHRhcmdldCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICB0YXJnZXQgPSB7fTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIEFycmF5OlxyXG4gICAgICAgICAgICAvLyBBbHdheXMgY29weSB0aGUgYXJyYXkgc291cmNlIGFuZCBvdmVyd3JpdGUgdGhlIHRhcmdldC5cclxuICAgICAgICAgICAgdGFyZ2V0ID0gW107XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIC8vIE5vdCBhIHBsYWluIE9iamVjdCAtIHRyZWF0IGl0IGFzIGEgc2NhbGFyLlxyXG4gICAgICAgICAgICByZXR1cm4gc291cmNlO1xyXG4gICAgfVxyXG4gICAgZm9yIChjb25zdCBwcm9wIGluIHNvdXJjZSkge1xyXG4gICAgICAgIC8vIHVzZSBpc1ZhbGlkS2V5IHRvIGd1YXJkIGFnYWluc3QgcHJvdG90eXBlIHBvbGx1dGlvbi4gU2VlIGh0dHBzOi8vc255ay5pby92dWxuL1NOWUstSlMtTE9EQVNILTQ1MDIwMlxyXG4gICAgICAgIGlmICghc291cmNlLmhhc093blByb3BlcnR5KHByb3ApIHx8ICFpc1ZhbGlkS2V5KHByb3ApKSB7XHJcbiAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0YXJnZXRbcHJvcF0gPSBkZWVwRXh0ZW5kKHRhcmdldFtwcm9wXSwgc291cmNlW3Byb3BdKTtcclxuICAgIH1cclxuICAgIHJldHVybiB0YXJnZXQ7XHJcbn1cclxuZnVuY3Rpb24gaXNWYWxpZEtleShrZXkpIHtcclxuICAgIHJldHVybiBrZXkgIT09ICdfX3Byb3RvX18nO1xyXG59XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAyMiBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbi8qKlxyXG4gKiBQb2x5ZmlsbCBmb3IgYGdsb2JhbFRoaXNgIG9iamVjdC5cclxuICogQHJldHVybnMgdGhlIGBnbG9iYWxUaGlzYCBvYmplY3QgZm9yIHRoZSBnaXZlbiBlbnZpcm9ubWVudC5cclxuICogQHB1YmxpY1xyXG4gKi9cclxuZnVuY3Rpb24gZ2V0R2xvYmFsKCkge1xyXG4gICAgaWYgKHR5cGVvZiBzZWxmICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgIHJldHVybiBzZWxmO1xyXG4gICAgfVxyXG4gICAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgcmV0dXJuIHdpbmRvdztcclxuICAgIH1cclxuICAgIGlmICh0eXBlb2YgZ2xvYmFsICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgIHJldHVybiBnbG9iYWw7XHJcbiAgICB9XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1VuYWJsZSB0byBsb2NhdGUgZ2xvYmFsIG9iamVjdC4nKTtcclxufVxuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMjIgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG5jb25zdCBnZXREZWZhdWx0c0Zyb21HbG9iYWwgPSAoKSA9PiBnZXRHbG9iYWwoKS5fX0ZJUkVCQVNFX0RFRkFVTFRTX187XHJcbi8qKlxyXG4gKiBBdHRlbXB0IHRvIHJlYWQgZGVmYXVsdHMgZnJvbSBhIEpTT04gc3RyaW5nIHByb3ZpZGVkIHRvXHJcbiAqIHByb2Nlc3MoLillbnYoLilfX0ZJUkVCQVNFX0RFRkFVTFRTX18gb3IgYSBKU09OIGZpbGUgd2hvc2UgcGF0aCBpcyBpblxyXG4gKiBwcm9jZXNzKC4pZW52KC4pX19GSVJFQkFTRV9ERUZBVUxUU19QQVRIX19cclxuICogVGhlIGRvdHMgYXJlIGluIHBhcmVucyBiZWNhdXNlIGNlcnRhaW4gY29tcGlsZXJzIChWaXRlPykgY2Fubm90XHJcbiAqIGhhbmRsZSBzZWVpbmcgdGhhdCB2YXJpYWJsZSBpbiBjb21tZW50cy5cclxuICogU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9maXJlYmFzZS9maXJlYmFzZS1qcy1zZGsvaXNzdWVzLzY4MzhcclxuICovXHJcbmNvbnN0IGdldERlZmF1bHRzRnJvbUVudlZhcmlhYmxlID0gKCkgPT4ge1xyXG4gICAgaWYgKHR5cGVvZiBwcm9jZXNzID09PSAndW5kZWZpbmVkJyB8fCB0eXBlb2YgcHJvY2Vzcy5lbnYgPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgY29uc3QgZGVmYXVsdHNKc29uU3RyaW5nID0gcHJvY2Vzcy5lbnYuX19GSVJFQkFTRV9ERUZBVUxUU19fO1xyXG4gICAgaWYgKGRlZmF1bHRzSnNvblN0cmluZykge1xyXG4gICAgICAgIHJldHVybiBKU09OLnBhcnNlKGRlZmF1bHRzSnNvblN0cmluZyk7XHJcbiAgICB9XHJcbn07XHJcbmNvbnN0IGdldERlZmF1bHRzRnJvbUNvb2tpZSA9ICgpID0+IHtcclxuICAgIGlmICh0eXBlb2YgZG9jdW1lbnQgPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgbGV0IG1hdGNoO1xyXG4gICAgdHJ5IHtcclxuICAgICAgICBtYXRjaCA9IGRvY3VtZW50LmNvb2tpZS5tYXRjaCgvX19GSVJFQkFTRV9ERUZBVUxUU19fPShbXjtdKykvKTtcclxuICAgIH1cclxuICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgLy8gU29tZSBlbnZpcm9ubWVudHMgc3VjaCBhcyBBbmd1bGFyIFVuaXZlcnNhbCBTU1IgaGF2ZSBhXHJcbiAgICAgICAgLy8gYGRvY3VtZW50YCBvYmplY3QgYnV0IGVycm9yIG9uIGFjY2Vzc2luZyBgZG9jdW1lbnQuY29va2llYC5cclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBjb25zdCBkZWNvZGVkID0gbWF0Y2ggJiYgYmFzZTY0RGVjb2RlKG1hdGNoWzFdKTtcclxuICAgIHJldHVybiBkZWNvZGVkICYmIEpTT04ucGFyc2UoZGVjb2RlZCk7XHJcbn07XHJcbi8qKlxyXG4gKiBHZXQgdGhlIF9fRklSRUJBU0VfREVGQVVMVFNfXyBvYmplY3QuIEl0IGNoZWNrcyBpbiBvcmRlcjpcclxuICogKDEpIGlmIHN1Y2ggYW4gb2JqZWN0IGV4aXN0cyBhcyBhIHByb3BlcnR5IG9mIGBnbG9iYWxUaGlzYFxyXG4gKiAoMikgaWYgc3VjaCBhbiBvYmplY3Qgd2FzIHByb3ZpZGVkIG9uIGEgc2hlbGwgZW52aXJvbm1lbnQgdmFyaWFibGVcclxuICogKDMpIGlmIHN1Y2ggYW4gb2JqZWN0IGV4aXN0cyBpbiBhIGNvb2tpZVxyXG4gKiBAcHVibGljXHJcbiAqL1xyXG5jb25zdCBnZXREZWZhdWx0cyA9ICgpID0+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgcmV0dXJuIChnZXREZWZhdWx0c0Zyb21HbG9iYWwoKSB8fFxyXG4gICAgICAgICAgICBnZXREZWZhdWx0c0Zyb21FbnZWYXJpYWJsZSgpIHx8XHJcbiAgICAgICAgICAgIGdldERlZmF1bHRzRnJvbUNvb2tpZSgpKTtcclxuICAgIH1cclxuICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQ2F0Y2gtYWxsIGZvciBiZWluZyB1bmFibGUgdG8gZ2V0IF9fRklSRUJBU0VfREVGQVVMVFNfXyBkdWVcclxuICAgICAgICAgKiB0byBhbnkgZW52aXJvbm1lbnQgY2FzZSB3ZSBoYXZlIG5vdCBhY2NvdW50ZWQgZm9yLiBMb2cgdG9cclxuICAgICAgICAgKiBpbmZvIGluc3RlYWQgb2Ygc3dhbGxvd2luZyBzbyB3ZSBjYW4gZmluZCB0aGVzZSB1bmtub3duIGNhc2VzXHJcbiAgICAgICAgICogYW5kIGFkZCBwYXRocyBmb3IgdGhlbSBpZiBuZWVkZWQuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgY29uc29sZS5pbmZvKGBVbmFibGUgdG8gZ2V0IF9fRklSRUJBU0VfREVGQVVMVFNfXyBkdWUgdG86ICR7ZX1gKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbn07XHJcbi8qKlxyXG4gKiBSZXR1cm5zIGVtdWxhdG9yIGhvc3Qgc3RvcmVkIGluIHRoZSBfX0ZJUkVCQVNFX0RFRkFVTFRTX18gb2JqZWN0XHJcbiAqIGZvciB0aGUgZ2l2ZW4gcHJvZHVjdC5cclxuICogQHJldHVybnMgYSBVUkwgaG9zdCBmb3JtYXR0ZWQgbGlrZSBgMTI3LjAuMC4xOjk5OTlgIG9yIGBbOjoxXTo0MDAwYCBpZiBhdmFpbGFibGVcclxuICogQHB1YmxpY1xyXG4gKi9cclxuY29uc3QgZ2V0RGVmYXVsdEVtdWxhdG9ySG9zdCA9IChwcm9kdWN0TmFtZSkgPT4geyB2YXIgX2EsIF9iOyByZXR1cm4gKF9iID0gKF9hID0gZ2V0RGVmYXVsdHMoKSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmVtdWxhdG9ySG9zdHMpID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYltwcm9kdWN0TmFtZV07IH07XHJcbi8qKlxyXG4gKiBSZXR1cm5zIGVtdWxhdG9yIGhvc3RuYW1lIGFuZCBwb3J0IHN0b3JlZCBpbiB0aGUgX19GSVJFQkFTRV9ERUZBVUxUU19fIG9iamVjdFxyXG4gKiBmb3IgdGhlIGdpdmVuIHByb2R1Y3QuXHJcbiAqIEByZXR1cm5zIGEgcGFpciBvZiBob3N0bmFtZSBhbmQgcG9ydCBsaWtlIGBbXCI6OjFcIiwgNDAwMF1gIGlmIGF2YWlsYWJsZVxyXG4gKiBAcHVibGljXHJcbiAqL1xyXG5jb25zdCBnZXREZWZhdWx0RW11bGF0b3JIb3N0bmFtZUFuZFBvcnQgPSAocHJvZHVjdE5hbWUpID0+IHtcclxuICAgIGNvbnN0IGhvc3QgPSBnZXREZWZhdWx0RW11bGF0b3JIb3N0KHByb2R1Y3ROYW1lKTtcclxuICAgIGlmICghaG9zdCkge1xyXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICB9XHJcbiAgICBjb25zdCBzZXBhcmF0b3JJbmRleCA9IGhvc3QubGFzdEluZGV4T2YoJzonKTsgLy8gRmluZGluZyB0aGUgbGFzdCBzaW5jZSBJUHY2IGFkZHIgYWxzbyBoYXMgY29sb25zLlxyXG4gICAgaWYgKHNlcGFyYXRvckluZGV4IDw9IDAgfHwgc2VwYXJhdG9ySW5kZXggKyAxID09PSBob3N0Lmxlbmd0aCkge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBob3N0ICR7aG9zdH0gd2l0aCBubyBzZXBhcmF0ZSBob3N0bmFtZSBhbmQgcG9ydCFgKTtcclxuICAgIH1cclxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1yZXN0cmljdGVkLWdsb2JhbHNcclxuICAgIGNvbnN0IHBvcnQgPSBwYXJzZUludChob3N0LnN1YnN0cmluZyhzZXBhcmF0b3JJbmRleCArIDEpLCAxMCk7XHJcbiAgICBpZiAoaG9zdFswXSA9PT0gJ1snKSB7XHJcbiAgICAgICAgLy8gQnJhY2tldC1xdW90ZWQgYFtpcHY2YWRkcl06cG9ydGAgPT4gcmV0dXJuIFwiaXB2NmFkZHJcIiAod2l0aG91dCBicmFja2V0cykuXHJcbiAgICAgICAgcmV0dXJuIFtob3N0LnN1YnN0cmluZygxLCBzZXBhcmF0b3JJbmRleCAtIDEpLCBwb3J0XTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHJldHVybiBbaG9zdC5zdWJzdHJpbmcoMCwgc2VwYXJhdG9ySW5kZXgpLCBwb3J0XTtcclxuICAgIH1cclxufTtcclxuLyoqXHJcbiAqIFJldHVybnMgRmlyZWJhc2UgYXBwIGNvbmZpZyBzdG9yZWQgaW4gdGhlIF9fRklSRUJBU0VfREVGQVVMVFNfXyBvYmplY3QuXHJcbiAqIEBwdWJsaWNcclxuICovXHJcbmNvbnN0IGdldERlZmF1bHRBcHBDb25maWcgPSAoKSA9PiB7IHZhciBfYTsgcmV0dXJuIChfYSA9IGdldERlZmF1bHRzKCkpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5jb25maWc7IH07XHJcbi8qKlxyXG4gKiBSZXR1cm5zIGFuIGV4cGVyaW1lbnRhbCBzZXR0aW5nIG9uIHRoZSBfX0ZJUkVCQVNFX0RFRkFVTFRTX18gb2JqZWN0IChwcm9wZXJ0aWVzXHJcbiAqIHByZWZpeGVkIGJ5IFwiX1wiKVxyXG4gKiBAcHVibGljXHJcbiAqL1xyXG5jb25zdCBnZXRFeHBlcmltZW50YWxTZXR0aW5nID0gKG5hbWUpID0+IHsgdmFyIF9hOyByZXR1cm4gKF9hID0gZ2V0RGVmYXVsdHMoKSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hW2BfJHtuYW1lfWBdOyB9O1xuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMTcgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG5jbGFzcyBEZWZlcnJlZCB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLnJlamVjdCA9ICgpID0+IHsgfTtcclxuICAgICAgICB0aGlzLnJlc29sdmUgPSAoKSA9PiB7IH07XHJcbiAgICAgICAgdGhpcy5wcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnJlc29sdmUgPSByZXNvbHZlO1xyXG4gICAgICAgICAgICB0aGlzLnJlamVjdCA9IHJlamVjdDtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogT3VyIEFQSSBpbnRlcm5hbHMgYXJlIG5vdCBwcm9taXNlaWZpZWQgYW5kIGNhbm5vdCBiZWNhdXNlIG91ciBjYWxsYmFjayBBUElzIGhhdmUgc3VidGxlIGV4cGVjdGF0aW9ucyBhcm91bmRcclxuICAgICAqIGludm9raW5nIHByb21pc2VzIGlubGluZSwgd2hpY2ggUHJvbWlzZXMgYXJlIGZvcmJpZGRlbiB0byBkby4gVGhpcyBtZXRob2QgYWNjZXB0cyBhbiBvcHRpb25hbCBub2RlLXN0eWxlIGNhbGxiYWNrXHJcbiAgICAgKiBhbmQgcmV0dXJucyBhIG5vZGUtc3R5bGUgY2FsbGJhY2sgd2hpY2ggd2lsbCByZXNvbHZlIG9yIHJlamVjdCB0aGUgRGVmZXJyZWQncyBwcm9taXNlLlxyXG4gICAgICovXHJcbiAgICB3cmFwQ2FsbGJhY2soY2FsbGJhY2spIHtcclxuICAgICAgICByZXR1cm4gKGVycm9yLCB2YWx1ZSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVqZWN0KGVycm9yKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVzb2x2ZSh2YWx1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICAgICAgLy8gQXR0YWNoaW5nIG5vb3AgaGFuZGxlciBqdXN0IGluIGNhc2UgZGV2ZWxvcGVyIHdhc24ndCBleHBlY3RpbmdcclxuICAgICAgICAgICAgICAgIC8vIHByb21pc2VzXHJcbiAgICAgICAgICAgICAgICB0aGlzLnByb21pc2UuY2F0Y2goKCkgPT4geyB9KTtcclxuICAgICAgICAgICAgICAgIC8vIFNvbWUgb2Ygb3VyIGNhbGxiYWNrcyBkb24ndCBleHBlY3QgYSB2YWx1ZSBhbmQgb3VyIG93biB0ZXN0c1xyXG4gICAgICAgICAgICAgICAgLy8gYXNzZXJ0IHRoYXQgdGhlIHBhcmFtZXRlciBsZW5ndGggaXMgMVxyXG4gICAgICAgICAgICAgICAgaWYgKGNhbGxiYWNrLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVycm9yKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVycm9yLCB2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfVxyXG59XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAyMSBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbmZ1bmN0aW9uIGNyZWF0ZU1vY2tVc2VyVG9rZW4odG9rZW4sIHByb2plY3RJZCkge1xyXG4gICAgaWYgKHRva2VuLnVpZCkge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignVGhlIFwidWlkXCIgZmllbGQgaXMgbm8gbG9uZ2VyIHN1cHBvcnRlZCBieSBtb2NrVXNlclRva2VuLiBQbGVhc2UgdXNlIFwic3ViXCIgaW5zdGVhZCBmb3IgRmlyZWJhc2UgQXV0aCBVc2VyIElELicpO1xyXG4gICAgfVxyXG4gICAgLy8gVW5zZWN1cmVkIEpXVHMgdXNlIFwibm9uZVwiIGFzIHRoZSBhbGdvcml0aG0uXHJcbiAgICBjb25zdCBoZWFkZXIgPSB7XHJcbiAgICAgICAgYWxnOiAnbm9uZScsXHJcbiAgICAgICAgdHlwZTogJ0pXVCdcclxuICAgIH07XHJcbiAgICBjb25zdCBwcm9qZWN0ID0gcHJvamVjdElkIHx8ICdkZW1vLXByb2plY3QnO1xyXG4gICAgY29uc3QgaWF0ID0gdG9rZW4uaWF0IHx8IDA7XHJcbiAgICBjb25zdCBzdWIgPSB0b2tlbi5zdWIgfHwgdG9rZW4udXNlcl9pZDtcclxuICAgIGlmICghc3ViKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibW9ja1VzZXJUb2tlbiBtdXN0IGNvbnRhaW4gJ3N1Yicgb3IgJ3VzZXJfaWQnIGZpZWxkIVwiKTtcclxuICAgIH1cclxuICAgIGNvbnN0IHBheWxvYWQgPSBPYmplY3QuYXNzaWduKHsgXHJcbiAgICAgICAgLy8gU2V0IGFsbCByZXF1aXJlZCBmaWVsZHMgdG8gZGVjZW50IGRlZmF1bHRzXHJcbiAgICAgICAgaXNzOiBgaHR0cHM6Ly9zZWN1cmV0b2tlbi5nb29nbGUuY29tLyR7cHJvamVjdH1gLCBhdWQ6IHByb2plY3QsIGlhdCwgZXhwOiBpYXQgKyAzNjAwLCBhdXRoX3RpbWU6IGlhdCwgc3ViLCB1c2VyX2lkOiBzdWIsIGZpcmViYXNlOiB7XHJcbiAgICAgICAgICAgIHNpZ25faW5fcHJvdmlkZXI6ICdjdXN0b20nLFxyXG4gICAgICAgICAgICBpZGVudGl0aWVzOiB7fVxyXG4gICAgICAgIH0gfSwgdG9rZW4pO1xyXG4gICAgLy8gVW5zZWN1cmVkIEpXVHMgdXNlIHRoZSBlbXB0eSBzdHJpbmcgYXMgYSBzaWduYXR1cmUuXHJcbiAgICBjb25zdCBzaWduYXR1cmUgPSAnJztcclxuICAgIHJldHVybiBbXHJcbiAgICAgICAgYmFzZTY0dXJsRW5jb2RlV2l0aG91dFBhZGRpbmcoSlNPTi5zdHJpbmdpZnkoaGVhZGVyKSksXHJcbiAgICAgICAgYmFzZTY0dXJsRW5jb2RlV2l0aG91dFBhZGRpbmcoSlNPTi5zdHJpbmdpZnkocGF5bG9hZCkpLFxyXG4gICAgICAgIHNpZ25hdHVyZVxyXG4gICAgXS5qb2luKCcuJyk7XHJcbn1cblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDE3IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuLyoqXHJcbiAqIFJldHVybnMgbmF2aWdhdG9yLnVzZXJBZ2VudCBzdHJpbmcgb3IgJycgaWYgaXQncyBub3QgZGVmaW5lZC5cclxuICogQHJldHVybiB1c2VyIGFnZW50IHN0cmluZ1xyXG4gKi9cclxuZnVuY3Rpb24gZ2V0VUEoKSB7XHJcbiAgICBpZiAodHlwZW9mIG5hdmlnYXRvciAhPT0gJ3VuZGVmaW5lZCcgJiZcclxuICAgICAgICB0eXBlb2YgbmF2aWdhdG9yWyd1c2VyQWdlbnQnXSA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICByZXR1cm4gbmF2aWdhdG9yWyd1c2VyQWdlbnQnXTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHJldHVybiAnJztcclxuICAgIH1cclxufVxyXG4vKipcclxuICogRGV0ZWN0IENvcmRvdmEgLyBQaG9uZUdhcCAvIElvbmljIGZyYW1ld29ya3Mgb24gYSBtb2JpbGUgZGV2aWNlLlxyXG4gKlxyXG4gKiBEZWxpYmVyYXRlbHkgZG9lcyBub3QgcmVseSBvbiBjaGVja2luZyBgZmlsZTovL2AgVVJMcyAoYXMgdGhpcyBmYWlscyBQaG9uZUdhcFxyXG4gKiBpbiB0aGUgUmlwcGxlIGVtdWxhdG9yKSBub3IgQ29yZG92YSBgb25EZXZpY2VSZWFkeWAsIHdoaWNoIHdvdWxkIG5vcm1hbGx5XHJcbiAqIHdhaXQgZm9yIGEgY2FsbGJhY2suXHJcbiAqL1xyXG5mdW5jdGlvbiBpc01vYmlsZUNvcmRvdmEoKSB7XHJcbiAgICByZXR1cm4gKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmXHJcbiAgICAgICAgLy8gQHRzLWlnbm9yZSBTZXR0aW5nIHVwIGFuIGJyb2FkbHkgYXBwbGljYWJsZSBpbmRleCBzaWduYXR1cmUgZm9yIFdpbmRvd1xyXG4gICAgICAgIC8vIGp1c3QgdG8gZGVhbCB3aXRoIHRoaXMgY2FzZSB3b3VsZCBwcm9iYWJseSBiZSBhIGJhZCBpZGVhLlxyXG4gICAgICAgICEhKHdpbmRvd1snY29yZG92YSddIHx8IHdpbmRvd1sncGhvbmVnYXAnXSB8fCB3aW5kb3dbJ1Bob25lR2FwJ10pICYmXHJcbiAgICAgICAgL2lvc3xpcGhvbmV8aXBvZHxpcGFkfGFuZHJvaWR8YmxhY2tiZXJyeXxpZW1vYmlsZS9pLnRlc3QoZ2V0VUEoKSkpO1xyXG59XHJcbi8qKlxyXG4gKiBEZXRlY3QgTm9kZS5qcy5cclxuICpcclxuICogQHJldHVybiB0cnVlIGlmIE5vZGUuanMgZW52aXJvbm1lbnQgaXMgZGV0ZWN0ZWQgb3Igc3BlY2lmaWVkLlxyXG4gKi9cclxuLy8gTm9kZSBkZXRlY3Rpb24gbG9naWMgZnJvbTogaHR0cHM6Ly9naXRodWIuY29tL2lsaWFrYW4vZGV0ZWN0LW5vZGUvXHJcbmZ1bmN0aW9uIGlzTm9kZSgpIHtcclxuICAgIHZhciBfYTtcclxuICAgIGNvbnN0IGZvcmNlRW52aXJvbm1lbnQgPSAoX2EgPSBnZXREZWZhdWx0cygpKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuZm9yY2VFbnZpcm9ubWVudDtcclxuICAgIGlmIChmb3JjZUVudmlyb25tZW50ID09PSAnbm9kZScpIHtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKGZvcmNlRW52aXJvbm1lbnQgPT09ICdicm93c2VyJykge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIHRyeSB7XHJcbiAgICAgICAgcmV0dXJuIChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoZ2xvYmFsLnByb2Nlc3MpID09PSAnW29iamVjdCBwcm9jZXNzXScpO1xyXG4gICAgfVxyXG4gICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbn1cclxuLyoqXHJcbiAqIERldGVjdCBCcm93c2VyIEVudmlyb25tZW50XHJcbiAqL1xyXG5mdW5jdGlvbiBpc0Jyb3dzZXIoKSB7XHJcbiAgICByZXR1cm4gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgfHwgaXNXZWJXb3JrZXIoKTtcclxufVxyXG4vKipcclxuICogRGV0ZWN0IFdlYiBXb3JrZXIgY29udGV4dFxyXG4gKi9cclxuZnVuY3Rpb24gaXNXZWJXb3JrZXIoKSB7XHJcbiAgICByZXR1cm4gKHR5cGVvZiBXb3JrZXJHbG9iYWxTY29wZSAhPT0gJ3VuZGVmaW5lZCcgJiZcclxuICAgICAgICB0eXBlb2Ygc2VsZiAhPT0gJ3VuZGVmaW5lZCcgJiZcclxuICAgICAgICBzZWxmIGluc3RhbmNlb2YgV29ya2VyR2xvYmFsU2NvcGUpO1xyXG59XHJcbmZ1bmN0aW9uIGlzQnJvd3NlckV4dGVuc2lvbigpIHtcclxuICAgIGNvbnN0IHJ1bnRpbWUgPSB0eXBlb2YgY2hyb21lID09PSAnb2JqZWN0J1xyXG4gICAgICAgID8gY2hyb21lLnJ1bnRpbWVcclxuICAgICAgICA6IHR5cGVvZiBicm93c2VyID09PSAnb2JqZWN0J1xyXG4gICAgICAgICAgICA/IGJyb3dzZXIucnVudGltZVxyXG4gICAgICAgICAgICA6IHVuZGVmaW5lZDtcclxuICAgIHJldHVybiB0eXBlb2YgcnVudGltZSA9PT0gJ29iamVjdCcgJiYgcnVudGltZS5pZCAhPT0gdW5kZWZpbmVkO1xyXG59XHJcbi8qKlxyXG4gKiBEZXRlY3QgUmVhY3QgTmF0aXZlLlxyXG4gKlxyXG4gKiBAcmV0dXJuIHRydWUgaWYgUmVhY3ROYXRpdmUgZW52aXJvbm1lbnQgaXMgZGV0ZWN0ZWQuXHJcbiAqL1xyXG5mdW5jdGlvbiBpc1JlYWN0TmF0aXZlKCkge1xyXG4gICAgcmV0dXJuICh0eXBlb2YgbmF2aWdhdG9yID09PSAnb2JqZWN0JyAmJiBuYXZpZ2F0b3JbJ3Byb2R1Y3QnXSA9PT0gJ1JlYWN0TmF0aXZlJyk7XHJcbn1cclxuLyoqIERldGVjdHMgRWxlY3Ryb24gYXBwcy4gKi9cclxuZnVuY3Rpb24gaXNFbGVjdHJvbigpIHtcclxuICAgIHJldHVybiBnZXRVQSgpLmluZGV4T2YoJ0VsZWN0cm9uLycpID49IDA7XHJcbn1cclxuLyoqIERldGVjdHMgSW50ZXJuZXQgRXhwbG9yZXIuICovXHJcbmZ1bmN0aW9uIGlzSUUoKSB7XHJcbiAgICBjb25zdCB1YSA9IGdldFVBKCk7XHJcbiAgICByZXR1cm4gdWEuaW5kZXhPZignTVNJRSAnKSA+PSAwIHx8IHVhLmluZGV4T2YoJ1RyaWRlbnQvJykgPj0gMDtcclxufVxyXG4vKiogRGV0ZWN0cyBVbml2ZXJzYWwgV2luZG93cyBQbGF0Zm9ybSBhcHBzLiAqL1xyXG5mdW5jdGlvbiBpc1VXUCgpIHtcclxuICAgIHJldHVybiBnZXRVQSgpLmluZGV4T2YoJ01TQXBwSG9zdC8nKSA+PSAwO1xyXG59XHJcbi8qKlxyXG4gKiBEZXRlY3Qgd2hldGhlciB0aGUgY3VycmVudCBTREsgYnVpbGQgaXMgdGhlIE5vZGUgdmVyc2lvbi5cclxuICpcclxuICogQHJldHVybiB0cnVlIGlmIGl0J3MgdGhlIE5vZGUgU0RLIGJ1aWxkLlxyXG4gKi9cclxuZnVuY3Rpb24gaXNOb2RlU2RrKCkge1xyXG4gICAgcmV0dXJuIENPTlNUQU5UUy5OT0RFX0NMSUVOVCA9PT0gdHJ1ZSB8fCBDT05TVEFOVFMuTk9ERV9BRE1JTiA9PT0gdHJ1ZTtcclxufVxyXG4vKiogUmV0dXJucyB0cnVlIGlmIHdlIGFyZSBydW5uaW5nIGluIFNhZmFyaS4gKi9cclxuZnVuY3Rpb24gaXNTYWZhcmkoKSB7XHJcbiAgICByZXR1cm4gKCFpc05vZGUoKSAmJlxyXG4gICAgICAgICEhbmF2aWdhdG9yLnVzZXJBZ2VudCAmJlxyXG4gICAgICAgIG5hdmlnYXRvci51c2VyQWdlbnQuaW5jbHVkZXMoJ1NhZmFyaScpICYmXHJcbiAgICAgICAgIW5hdmlnYXRvci51c2VyQWdlbnQuaW5jbHVkZXMoJ0Nocm9tZScpKTtcclxufVxyXG4vKipcclxuICogVGhpcyBtZXRob2QgY2hlY2tzIGlmIGluZGV4ZWREQiBpcyBzdXBwb3J0ZWQgYnkgY3VycmVudCBicm93c2VyL3NlcnZpY2Ugd29ya2VyIGNvbnRleHRcclxuICogQHJldHVybiB0cnVlIGlmIGluZGV4ZWREQiBpcyBzdXBwb3J0ZWQgYnkgY3VycmVudCBicm93c2VyL3NlcnZpY2Ugd29ya2VyIGNvbnRleHRcclxuICovXHJcbmZ1bmN0aW9uIGlzSW5kZXhlZERCQXZhaWxhYmxlKCkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgICByZXR1cm4gdHlwZW9mIGluZGV4ZWREQiA9PT0gJ29iamVjdCc7XHJcbiAgICB9XHJcbiAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxufVxyXG4vKipcclxuICogVGhpcyBtZXRob2QgdmFsaWRhdGVzIGJyb3dzZXIvc3cgY29udGV4dCBmb3IgaW5kZXhlZERCIGJ5IG9wZW5pbmcgYSBkdW1teSBpbmRleGVkREIgZGF0YWJhc2UgYW5kIHJlamVjdFxyXG4gKiBpZiBlcnJvcnMgb2NjdXIgZHVyaW5nIHRoZSBkYXRhYmFzZSBvcGVuIG9wZXJhdGlvbi5cclxuICpcclxuICogQHRocm93cyBleGNlcHRpb24gaWYgY3VycmVudCBicm93c2VyL3N3IGNvbnRleHQgY2FuJ3QgcnVuIGlkYi5vcGVuIChleDogU2FmYXJpIGlmcmFtZSwgRmlyZWZveFxyXG4gKiBwcml2YXRlIGJyb3dzaW5nKVxyXG4gKi9cclxuZnVuY3Rpb24gdmFsaWRhdGVJbmRleGVkREJPcGVuYWJsZSgpIHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgbGV0IHByZUV4aXN0ID0gdHJ1ZTtcclxuICAgICAgICAgICAgY29uc3QgREJfQ0hFQ0tfTkFNRSA9ICd2YWxpZGF0ZS1icm93c2VyLWNvbnRleHQtZm9yLWluZGV4ZWRkYi1hbmFseXRpY3MtbW9kdWxlJztcclxuICAgICAgICAgICAgY29uc3QgcmVxdWVzdCA9IHNlbGYuaW5kZXhlZERCLm9wZW4oREJfQ0hFQ0tfTkFNRSk7XHJcbiAgICAgICAgICAgIHJlcXVlc3Qub25zdWNjZXNzID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmVxdWVzdC5yZXN1bHQuY2xvc2UoKTtcclxuICAgICAgICAgICAgICAgIC8vIGRlbGV0ZSBkYXRhYmFzZSBvbmx5IHdoZW4gaXQgZG9lc24ndCBwcmUtZXhpc3RcclxuICAgICAgICAgICAgICAgIGlmICghcHJlRXhpc3QpIHtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLmluZGV4ZWREQi5kZWxldGVEYXRhYmFzZShEQl9DSEVDS19OQU1FKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJlc29sdmUodHJ1ZSk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHJlcXVlc3Qub251cGdyYWRlbmVlZGVkID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcHJlRXhpc3QgPSBmYWxzZTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgcmVxdWVzdC5vbmVycm9yID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdmFyIF9hO1xyXG4gICAgICAgICAgICAgICAgcmVqZWN0KCgoX2EgPSByZXF1ZXN0LmVycm9yKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EubWVzc2FnZSkgfHwgJycpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxufVxyXG4vKipcclxuICpcclxuICogVGhpcyBtZXRob2QgY2hlY2tzIHdoZXRoZXIgY29va2llIGlzIGVuYWJsZWQgd2l0aGluIGN1cnJlbnQgYnJvd3NlclxyXG4gKiBAcmV0dXJuIHRydWUgaWYgY29va2llIGlzIGVuYWJsZWQgd2l0aGluIGN1cnJlbnQgYnJvd3NlclxyXG4gKi9cclxuZnVuY3Rpb24gYXJlQ29va2llc0VuYWJsZWQoKSB7XHJcbiAgICBpZiAodHlwZW9mIG5hdmlnYXRvciA9PT0gJ3VuZGVmaW5lZCcgfHwgIW5hdmlnYXRvci5jb29raWVFbmFibGVkKSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRydWU7XHJcbn1cblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDE3IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuLyoqXHJcbiAqIEBmaWxlb3ZlcnZpZXcgU3RhbmRhcmRpemVkIEZpcmViYXNlIEVycm9yLlxyXG4gKlxyXG4gKiBVc2FnZTpcclxuICpcclxuICogICAvLyBUeXBlc2NyaXB0IHN0cmluZyBsaXRlcmFscyBmb3IgdHlwZS1zYWZlIGNvZGVzXHJcbiAqICAgdHlwZSBFcnIgPVxyXG4gKiAgICAgJ3Vua25vd24nIHxcclxuICogICAgICdvYmplY3Qtbm90LWZvdW5kJ1xyXG4gKiAgICAgO1xyXG4gKlxyXG4gKiAgIC8vIENsb3N1cmUgZW51bSBmb3IgdHlwZS1zYWZlIGVycm9yIGNvZGVzXHJcbiAqICAgLy8gYXQtZW51bSB7c3RyaW5nfVxyXG4gKiAgIHZhciBFcnIgPSB7XHJcbiAqICAgICBVTktOT1dOOiAndW5rbm93bicsXHJcbiAqICAgICBPQkpFQ1RfTk9UX0ZPVU5EOiAnb2JqZWN0LW5vdC1mb3VuZCcsXHJcbiAqICAgfVxyXG4gKlxyXG4gKiAgIGxldCBlcnJvcnM6IE1hcDxFcnIsIHN0cmluZz4gPSB7XHJcbiAqICAgICAnZ2VuZXJpYy1lcnJvcic6IFwiVW5rbm93biBlcnJvclwiLFxyXG4gKiAgICAgJ2ZpbGUtbm90LWZvdW5kJzogXCJDb3VsZCBub3QgZmluZCBmaWxlOiB7JGZpbGV9XCIsXHJcbiAqICAgfTtcclxuICpcclxuICogICAvLyBUeXBlLXNhZmUgZnVuY3Rpb24gLSBtdXN0IHBhc3MgYSB2YWxpZCBlcnJvciBjb2RlIGFzIHBhcmFtLlxyXG4gKiAgIGxldCBlcnJvciA9IG5ldyBFcnJvckZhY3Rvcnk8RXJyPignc2VydmljZScsICdTZXJ2aWNlJywgZXJyb3JzKTtcclxuICpcclxuICogICAuLi5cclxuICogICB0aHJvdyBlcnJvci5jcmVhdGUoRXJyLkdFTkVSSUMpO1xyXG4gKiAgIC4uLlxyXG4gKiAgIHRocm93IGVycm9yLmNyZWF0ZShFcnIuRklMRV9OT1RfRk9VTkQsIHsnZmlsZSc6IGZpbGVOYW1lfSk7XHJcbiAqICAgLi4uXHJcbiAqICAgLy8gU2VydmljZTogQ291bGQgbm90IGZpbGUgZmlsZTogZm9vLnR4dCAoc2VydmljZS9maWxlLW5vdC1mb3VuZCkuXHJcbiAqXHJcbiAqICAgY2F0Y2ggKGUpIHtcclxuICogICAgIGFzc2VydChlLm1lc3NhZ2UgPT09IFwiQ291bGQgbm90IGZpbmQgZmlsZTogZm9vLnR4dC5cIik7XHJcbiAqICAgICBpZiAoKGUgYXMgRmlyZWJhc2VFcnJvcik/LmNvZGUgPT09ICdzZXJ2aWNlL2ZpbGUtbm90LWZvdW5kJykge1xyXG4gKiAgICAgICBjb25zb2xlLmxvZyhcIkNvdWxkIG5vdCByZWFkIGZpbGU6IFwiICsgZVsnZmlsZSddKTtcclxuICogICAgIH1cclxuICogICB9XHJcbiAqL1xyXG5jb25zdCBFUlJPUl9OQU1FID0gJ0ZpcmViYXNlRXJyb3InO1xyXG4vLyBCYXNlZCBvbiBjb2RlIGZyb206XHJcbi8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL0Vycm9yI0N1c3RvbV9FcnJvcl9UeXBlc1xyXG5jbGFzcyBGaXJlYmFzZUVycm9yIGV4dGVuZHMgRXJyb3Ige1xyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAvKiogVGhlIGVycm9yIGNvZGUgZm9yIHRoaXMgZXJyb3IuICovXHJcbiAgICBjb2RlLCBtZXNzYWdlLCBcclxuICAgIC8qKiBDdXN0b20gZGF0YSBmb3IgdGhpcyBlcnJvci4gKi9cclxuICAgIGN1c3RvbURhdGEpIHtcclxuICAgICAgICBzdXBlcihtZXNzYWdlKTtcclxuICAgICAgICB0aGlzLmNvZGUgPSBjb2RlO1xyXG4gICAgICAgIHRoaXMuY3VzdG9tRGF0YSA9IGN1c3RvbURhdGE7XHJcbiAgICAgICAgLyoqIFRoZSBjdXN0b20gbmFtZSBmb3IgYWxsIEZpcmViYXNlRXJyb3JzLiAqL1xyXG4gICAgICAgIHRoaXMubmFtZSA9IEVSUk9SX05BTUU7XHJcbiAgICAgICAgLy8gRml4IEZvciBFUzVcclxuICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vTWljcm9zb2Z0L1R5cGVTY3JpcHQtd2lraS9ibG9iL21hc3Rlci9CcmVha2luZy1DaGFuZ2VzLm1kI2V4dGVuZGluZy1idWlsdC1pbnMtbGlrZS1lcnJvci1hcnJheS1hbmQtbWFwLW1heS1uby1sb25nZXItd29ya1xyXG4gICAgICAgIE9iamVjdC5zZXRQcm90b3R5cGVPZih0aGlzLCBGaXJlYmFzZUVycm9yLnByb3RvdHlwZSk7XHJcbiAgICAgICAgLy8gTWFpbnRhaW5zIHByb3BlciBzdGFjayB0cmFjZSBmb3Igd2hlcmUgb3VyIGVycm9yIHdhcyB0aHJvd24uXHJcbiAgICAgICAgLy8gT25seSBhdmFpbGFibGUgb24gVjguXHJcbiAgICAgICAgaWYgKEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKSB7XHJcbiAgICAgICAgICAgIEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKHRoaXMsIEVycm9yRmFjdG9yeS5wcm90b3R5cGUuY3JlYXRlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuY2xhc3MgRXJyb3JGYWN0b3J5IHtcclxuICAgIGNvbnN0cnVjdG9yKHNlcnZpY2UsIHNlcnZpY2VOYW1lLCBlcnJvcnMpIHtcclxuICAgICAgICB0aGlzLnNlcnZpY2UgPSBzZXJ2aWNlO1xyXG4gICAgICAgIHRoaXMuc2VydmljZU5hbWUgPSBzZXJ2aWNlTmFtZTtcclxuICAgICAgICB0aGlzLmVycm9ycyA9IGVycm9ycztcclxuICAgIH1cclxuICAgIGNyZWF0ZShjb2RlLCAuLi5kYXRhKSB7XHJcbiAgICAgICAgY29uc3QgY3VzdG9tRGF0YSA9IGRhdGFbMF0gfHwge307XHJcbiAgICAgICAgY29uc3QgZnVsbENvZGUgPSBgJHt0aGlzLnNlcnZpY2V9LyR7Y29kZX1gO1xyXG4gICAgICAgIGNvbnN0IHRlbXBsYXRlID0gdGhpcy5lcnJvcnNbY29kZV07XHJcbiAgICAgICAgY29uc3QgbWVzc2FnZSA9IHRlbXBsYXRlID8gcmVwbGFjZVRlbXBsYXRlKHRlbXBsYXRlLCBjdXN0b21EYXRhKSA6ICdFcnJvcic7XHJcbiAgICAgICAgLy8gU2VydmljZSBOYW1lOiBFcnJvciBtZXNzYWdlIChzZXJ2aWNlL2NvZGUpLlxyXG4gICAgICAgIGNvbnN0IGZ1bGxNZXNzYWdlID0gYCR7dGhpcy5zZXJ2aWNlTmFtZX06ICR7bWVzc2FnZX0gKCR7ZnVsbENvZGV9KS5gO1xyXG4gICAgICAgIGNvbnN0IGVycm9yID0gbmV3IEZpcmViYXNlRXJyb3IoZnVsbENvZGUsIGZ1bGxNZXNzYWdlLCBjdXN0b21EYXRhKTtcclxuICAgICAgICByZXR1cm4gZXJyb3I7XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gcmVwbGFjZVRlbXBsYXRlKHRlbXBsYXRlLCBkYXRhKSB7XHJcbiAgICByZXR1cm4gdGVtcGxhdGUucmVwbGFjZShQQVRURVJOLCAoXywga2V5KSA9PiB7XHJcbiAgICAgICAgY29uc3QgdmFsdWUgPSBkYXRhW2tleV07XHJcbiAgICAgICAgcmV0dXJuIHZhbHVlICE9IG51bGwgPyBTdHJpbmcodmFsdWUpIDogYDwke2tleX0/PmA7XHJcbiAgICB9KTtcclxufVxyXG5jb25zdCBQQVRURVJOID0gL1xce1xcJChbXn1dKyl9L2c7XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAxNyBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbi8qKlxyXG4gKiBFdmFsdWF0ZXMgYSBKU09OIHN0cmluZyBpbnRvIGEgamF2YXNjcmlwdCBvYmplY3QuXHJcbiAqXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHIgQSBzdHJpbmcgY29udGFpbmluZyBKU09OLlxyXG4gKiBAcmV0dXJuIHsqfSBUaGUgamF2YXNjcmlwdCBvYmplY3QgcmVwcmVzZW50aW5nIHRoZSBzcGVjaWZpZWQgSlNPTi5cclxuICovXHJcbmZ1bmN0aW9uIGpzb25FdmFsKHN0cikge1xyXG4gICAgcmV0dXJuIEpTT04ucGFyc2Uoc3RyKTtcclxufVxyXG4vKipcclxuICogUmV0dXJucyBKU09OIHJlcHJlc2VudGluZyBhIGphdmFzY3JpcHQgb2JqZWN0LlxyXG4gKiBAcGFyYW0geyp9IGRhdGEgSmF2YXNjcmlwdCBvYmplY3QgdG8gYmUgc3RyaW5naWZpZWQuXHJcbiAqIEByZXR1cm4ge3N0cmluZ30gVGhlIEpTT04gY29udGVudHMgb2YgdGhlIG9iamVjdC5cclxuICovXHJcbmZ1bmN0aW9uIHN0cmluZ2lmeShkYXRhKSB7XHJcbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoZGF0YSk7XHJcbn1cblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDE3IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuLyoqXHJcbiAqIERlY29kZXMgYSBGaXJlYmFzZSBhdXRoLiB0b2tlbiBpbnRvIGNvbnN0aXR1ZW50IHBhcnRzLlxyXG4gKlxyXG4gKiBOb3RlczpcclxuICogLSBNYXkgcmV0dXJuIHdpdGggaW52YWxpZCAvIGluY29tcGxldGUgY2xhaW1zIGlmIHRoZXJlJ3Mgbm8gbmF0aXZlIGJhc2U2NCBkZWNvZGluZyBzdXBwb3J0LlxyXG4gKiAtIERvZXNuJ3QgY2hlY2sgaWYgdGhlIHRva2VuIGlzIGFjdHVhbGx5IHZhbGlkLlxyXG4gKi9cclxuY29uc3QgZGVjb2RlID0gZnVuY3Rpb24gKHRva2VuKSB7XHJcbiAgICBsZXQgaGVhZGVyID0ge30sIGNsYWltcyA9IHt9LCBkYXRhID0ge30sIHNpZ25hdHVyZSA9ICcnO1xyXG4gICAgdHJ5IHtcclxuICAgICAgICBjb25zdCBwYXJ0cyA9IHRva2VuLnNwbGl0KCcuJyk7XHJcbiAgICAgICAgaGVhZGVyID0ganNvbkV2YWwoYmFzZTY0RGVjb2RlKHBhcnRzWzBdKSB8fCAnJyk7XHJcbiAgICAgICAgY2xhaW1zID0ganNvbkV2YWwoYmFzZTY0RGVjb2RlKHBhcnRzWzFdKSB8fCAnJyk7XHJcbiAgICAgICAgc2lnbmF0dXJlID0gcGFydHNbMl07XHJcbiAgICAgICAgZGF0YSA9IGNsYWltc1snZCddIHx8IHt9O1xyXG4gICAgICAgIGRlbGV0ZSBjbGFpbXNbJ2QnXTtcclxuICAgIH1cclxuICAgIGNhdGNoIChlKSB7IH1cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgaGVhZGVyLFxyXG4gICAgICAgIGNsYWltcyxcclxuICAgICAgICBkYXRhLFxyXG4gICAgICAgIHNpZ25hdHVyZVxyXG4gICAgfTtcclxufTtcclxuLyoqXHJcbiAqIERlY29kZXMgYSBGaXJlYmFzZSBhdXRoLiB0b2tlbiBhbmQgY2hlY2tzIHRoZSB2YWxpZGl0eSBvZiBpdHMgdGltZS1iYXNlZCBjbGFpbXMuIFdpbGwgcmV0dXJuIHRydWUgaWYgdGhlXHJcbiAqIHRva2VuIGlzIHdpdGhpbiB0aGUgdGltZSB3aW5kb3cgYXV0aG9yaXplZCBieSB0aGUgJ25iZicgKG5vdC1iZWZvcmUpIGFuZCAnaWF0JyAoaXNzdWVkLWF0KSBjbGFpbXMuXHJcbiAqXHJcbiAqIE5vdGVzOlxyXG4gKiAtIE1heSByZXR1cm4gYSBmYWxzZSBuZWdhdGl2ZSBpZiB0aGVyZSdzIG5vIG5hdGl2ZSBiYXNlNjQgZGVjb2Rpbmcgc3VwcG9ydC5cclxuICogLSBEb2Vzbid0IGNoZWNrIGlmIHRoZSB0b2tlbiBpcyBhY3R1YWxseSB2YWxpZC5cclxuICovXHJcbmNvbnN0IGlzVmFsaWRUaW1lc3RhbXAgPSBmdW5jdGlvbiAodG9rZW4pIHtcclxuICAgIGNvbnN0IGNsYWltcyA9IGRlY29kZSh0b2tlbikuY2xhaW1zO1xyXG4gICAgY29uc3Qgbm93ID0gTWF0aC5mbG9vcihuZXcgRGF0ZSgpLmdldFRpbWUoKSAvIDEwMDApO1xyXG4gICAgbGV0IHZhbGlkU2luY2UgPSAwLCB2YWxpZFVudGlsID0gMDtcclxuICAgIGlmICh0eXBlb2YgY2xhaW1zID09PSAnb2JqZWN0Jykge1xyXG4gICAgICAgIGlmIChjbGFpbXMuaGFzT3duUHJvcGVydHkoJ25iZicpKSB7XHJcbiAgICAgICAgICAgIHZhbGlkU2luY2UgPSBjbGFpbXNbJ25iZiddO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChjbGFpbXMuaGFzT3duUHJvcGVydHkoJ2lhdCcpKSB7XHJcbiAgICAgICAgICAgIHZhbGlkU2luY2UgPSBjbGFpbXNbJ2lhdCddO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoY2xhaW1zLmhhc093blByb3BlcnR5KCdleHAnKSkge1xyXG4gICAgICAgICAgICB2YWxpZFVudGlsID0gY2xhaW1zWydleHAnXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIHRva2VuIHdpbGwgZXhwaXJlIGFmdGVyIDI0aCBieSBkZWZhdWx0XHJcbiAgICAgICAgICAgIHZhbGlkVW50aWwgPSB2YWxpZFNpbmNlICsgODY0MDA7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuICghIW5vdyAmJlxyXG4gICAgICAgICEhdmFsaWRTaW5jZSAmJlxyXG4gICAgICAgICEhdmFsaWRVbnRpbCAmJlxyXG4gICAgICAgIG5vdyA+PSB2YWxpZFNpbmNlICYmXHJcbiAgICAgICAgbm93IDw9IHZhbGlkVW50aWwpO1xyXG59O1xyXG4vKipcclxuICogRGVjb2RlcyBhIEZpcmViYXNlIGF1dGguIHRva2VuIGFuZCByZXR1cm5zIGl0cyBpc3N1ZWQgYXQgdGltZSBpZiB2YWxpZCwgbnVsbCBvdGhlcndpc2UuXHJcbiAqXHJcbiAqIE5vdGVzOlxyXG4gKiAtIE1heSByZXR1cm4gbnVsbCBpZiB0aGVyZSdzIG5vIG5hdGl2ZSBiYXNlNjQgZGVjb2Rpbmcgc3VwcG9ydC5cclxuICogLSBEb2Vzbid0IGNoZWNrIGlmIHRoZSB0b2tlbiBpcyBhY3R1YWxseSB2YWxpZC5cclxuICovXHJcbmNvbnN0IGlzc3VlZEF0VGltZSA9IGZ1bmN0aW9uICh0b2tlbikge1xyXG4gICAgY29uc3QgY2xhaW1zID0gZGVjb2RlKHRva2VuKS5jbGFpbXM7XHJcbiAgICBpZiAodHlwZW9mIGNsYWltcyA9PT0gJ29iamVjdCcgJiYgY2xhaW1zLmhhc093blByb3BlcnR5KCdpYXQnKSkge1xyXG4gICAgICAgIHJldHVybiBjbGFpbXNbJ2lhdCddO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG51bGw7XHJcbn07XHJcbi8qKlxyXG4gKiBEZWNvZGVzIGEgRmlyZWJhc2UgYXV0aC4gdG9rZW4gYW5kIGNoZWNrcyB0aGUgdmFsaWRpdHkgb2YgaXRzIGZvcm1hdC4gRXhwZWN0cyBhIHZhbGlkIGlzc3VlZC1hdCB0aW1lLlxyXG4gKlxyXG4gKiBOb3RlczpcclxuICogLSBNYXkgcmV0dXJuIGEgZmFsc2UgbmVnYXRpdmUgaWYgdGhlcmUncyBubyBuYXRpdmUgYmFzZTY0IGRlY29kaW5nIHN1cHBvcnQuXHJcbiAqIC0gRG9lc24ndCBjaGVjayBpZiB0aGUgdG9rZW4gaXMgYWN0dWFsbHkgdmFsaWQuXHJcbiAqL1xyXG5jb25zdCBpc1ZhbGlkRm9ybWF0ID0gZnVuY3Rpb24gKHRva2VuKSB7XHJcbiAgICBjb25zdCBkZWNvZGVkID0gZGVjb2RlKHRva2VuKSwgY2xhaW1zID0gZGVjb2RlZC5jbGFpbXM7XHJcbiAgICByZXR1cm4gISFjbGFpbXMgJiYgdHlwZW9mIGNsYWltcyA9PT0gJ29iamVjdCcgJiYgY2xhaW1zLmhhc093blByb3BlcnR5KCdpYXQnKTtcclxufTtcclxuLyoqXHJcbiAqIEF0dGVtcHRzIHRvIHBlZXIgaW50byBhbiBhdXRoIHRva2VuIGFuZCBkZXRlcm1pbmUgaWYgaXQncyBhbiBhZG1pbiBhdXRoIHRva2VuIGJ5IGxvb2tpbmcgYXQgdGhlIGNsYWltcyBwb3J0aW9uLlxyXG4gKlxyXG4gKiBOb3RlczpcclxuICogLSBNYXkgcmV0dXJuIGEgZmFsc2UgbmVnYXRpdmUgaWYgdGhlcmUncyBubyBuYXRpdmUgYmFzZTY0IGRlY29kaW5nIHN1cHBvcnQuXHJcbiAqIC0gRG9lc24ndCBjaGVjayBpZiB0aGUgdG9rZW4gaXMgYWN0dWFsbHkgdmFsaWQuXHJcbiAqL1xyXG5jb25zdCBpc0FkbWluID0gZnVuY3Rpb24gKHRva2VuKSB7XHJcbiAgICBjb25zdCBjbGFpbXMgPSBkZWNvZGUodG9rZW4pLmNsYWltcztcclxuICAgIHJldHVybiB0eXBlb2YgY2xhaW1zID09PSAnb2JqZWN0JyAmJiBjbGFpbXNbJ2FkbWluJ10gPT09IHRydWU7XHJcbn07XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAxNyBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbmZ1bmN0aW9uIGNvbnRhaW5zKG9iaiwga2V5KSB7XHJcbiAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KTtcclxufVxyXG5mdW5jdGlvbiBzYWZlR2V0KG9iaiwga2V5KSB7XHJcbiAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KSkge1xyXG4gICAgICAgIHJldHVybiBvYmpba2V5XTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gaXNFbXB0eShvYmopIHtcclxuICAgIGZvciAoY29uc3Qga2V5IGluIG9iaikge1xyXG4gICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxufVxyXG5mdW5jdGlvbiBtYXAob2JqLCBmbiwgY29udGV4dE9iaikge1xyXG4gICAgY29uc3QgcmVzID0ge307XHJcbiAgICBmb3IgKGNvbnN0IGtleSBpbiBvYmopIHtcclxuICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KSkge1xyXG4gICAgICAgICAgICByZXNba2V5XSA9IGZuLmNhbGwoY29udGV4dE9iaiwgb2JqW2tleV0sIGtleSwgb2JqKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzO1xyXG59XHJcbi8qKlxyXG4gKiBEZWVwIGVxdWFsIHR3byBvYmplY3RzLiBTdXBwb3J0IEFycmF5cyBhbmQgT2JqZWN0cy5cclxuICovXHJcbmZ1bmN0aW9uIGRlZXBFcXVhbChhLCBiKSB7XHJcbiAgICBpZiAoYSA9PT0gYikge1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gICAgY29uc3QgYUtleXMgPSBPYmplY3Qua2V5cyhhKTtcclxuICAgIGNvbnN0IGJLZXlzID0gT2JqZWN0LmtleXMoYik7XHJcbiAgICBmb3IgKGNvbnN0IGsgb2YgYUtleXMpIHtcclxuICAgICAgICBpZiAoIWJLZXlzLmluY2x1ZGVzKGspKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgYVByb3AgPSBhW2tdO1xyXG4gICAgICAgIGNvbnN0IGJQcm9wID0gYltrXTtcclxuICAgICAgICBpZiAoaXNPYmplY3QoYVByb3ApICYmIGlzT2JqZWN0KGJQcm9wKSkge1xyXG4gICAgICAgICAgICBpZiAoIWRlZXBFcXVhbChhUHJvcCwgYlByb3ApKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoYVByb3AgIT09IGJQcm9wKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBmb3IgKGNvbnN0IGsgb2YgYktleXMpIHtcclxuICAgICAgICBpZiAoIWFLZXlzLmluY2x1ZGVzKGspKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxufVxyXG5mdW5jdGlvbiBpc09iamVjdCh0aGluZykge1xyXG4gICAgcmV0dXJuIHRoaW5nICE9PSBudWxsICYmIHR5cGVvZiB0aGluZyA9PT0gJ29iamVjdCc7XHJcbn1cblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDIyIEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuLyoqXHJcbiAqIFJlamVjdHMgaWYgdGhlIGdpdmVuIHByb21pc2UgZG9lc24ndCByZXNvbHZlIGluIHRpbWVJbk1TIG1pbGxpc2Vjb25kcy5cclxuICogQGludGVybmFsXHJcbiAqL1xyXG5mdW5jdGlvbiBwcm9taXNlV2l0aFRpbWVvdXQocHJvbWlzZSwgdGltZUluTVMgPSAyMDAwKSB7XHJcbiAgICBjb25zdCBkZWZlcnJlZFByb21pc2UgPSBuZXcgRGVmZXJyZWQoKTtcclxuICAgIHNldFRpbWVvdXQoKCkgPT4gZGVmZXJyZWRQcm9taXNlLnJlamVjdCgndGltZW91dCEnKSwgdGltZUluTVMpO1xyXG4gICAgcHJvbWlzZS50aGVuKGRlZmVycmVkUHJvbWlzZS5yZXNvbHZlLCBkZWZlcnJlZFByb21pc2UucmVqZWN0KTtcclxuICAgIHJldHVybiBkZWZlcnJlZFByb21pc2UucHJvbWlzZTtcclxufVxuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMTcgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG4vKipcclxuICogUmV0dXJucyBhIHF1ZXJ5c3RyaW5nLWZvcm1hdHRlZCBzdHJpbmcgKGUuZy4gJmFyZz12YWwmYXJnMj12YWwyKSBmcm9tIGFcclxuICogcGFyYW1zIG9iamVjdCAoZS5nLiB7YXJnOiAndmFsJywgYXJnMjogJ3ZhbDInfSlcclxuICogTm90ZTogWW91IG11c3QgcHJlcGVuZCBpdCB3aXRoID8gd2hlbiBhZGRpbmcgaXQgdG8gYSBVUkwuXHJcbiAqL1xyXG5mdW5jdGlvbiBxdWVyeXN0cmluZyhxdWVyeXN0cmluZ1BhcmFtcykge1xyXG4gICAgY29uc3QgcGFyYW1zID0gW107XHJcbiAgICBmb3IgKGNvbnN0IFtrZXksIHZhbHVlXSBvZiBPYmplY3QuZW50cmllcyhxdWVyeXN0cmluZ1BhcmFtcykpIHtcclxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcclxuICAgICAgICAgICAgdmFsdWUuZm9yRWFjaChhcnJheVZhbCA9PiB7XHJcbiAgICAgICAgICAgICAgICBwYXJhbXMucHVzaChlbmNvZGVVUklDb21wb25lbnQoa2V5KSArICc9JyArIGVuY29kZVVSSUNvbXBvbmVudChhcnJheVZhbCkpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHBhcmFtcy5wdXNoKGVuY29kZVVSSUNvbXBvbmVudChrZXkpICsgJz0nICsgZW5jb2RlVVJJQ29tcG9uZW50KHZhbHVlKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHBhcmFtcy5sZW5ndGggPyAnJicgKyBwYXJhbXMuam9pbignJicpIDogJyc7XHJcbn1cclxuLyoqXHJcbiAqIERlY29kZXMgYSBxdWVyeXN0cmluZyAoZS5nLiA/YXJnPXZhbCZhcmcyPXZhbDIpIGludG8gYSBwYXJhbXMgb2JqZWN0XHJcbiAqIChlLmcuIHthcmc6ICd2YWwnLCBhcmcyOiAndmFsMid9KVxyXG4gKi9cclxuZnVuY3Rpb24gcXVlcnlzdHJpbmdEZWNvZGUocXVlcnlzdHJpbmcpIHtcclxuICAgIGNvbnN0IG9iaiA9IHt9O1xyXG4gICAgY29uc3QgdG9rZW5zID0gcXVlcnlzdHJpbmcucmVwbGFjZSgvXlxcPy8sICcnKS5zcGxpdCgnJicpO1xyXG4gICAgdG9rZW5zLmZvckVhY2godG9rZW4gPT4ge1xyXG4gICAgICAgIGlmICh0b2tlbikge1xyXG4gICAgICAgICAgICBjb25zdCBba2V5LCB2YWx1ZV0gPSB0b2tlbi5zcGxpdCgnPScpO1xyXG4gICAgICAgICAgICBvYmpbZGVjb2RlVVJJQ29tcG9uZW50KGtleSldID0gZGVjb2RlVVJJQ29tcG9uZW50KHZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuICAgIHJldHVybiBvYmo7XHJcbn1cclxuLyoqXHJcbiAqIEV4dHJhY3QgdGhlIHF1ZXJ5IHN0cmluZyBwYXJ0IG9mIGEgVVJMLCBpbmNsdWRpbmcgdGhlIGxlYWRpbmcgcXVlc3Rpb24gbWFyayAoaWYgcHJlc2VudCkuXHJcbiAqL1xyXG5mdW5jdGlvbiBleHRyYWN0UXVlcnlzdHJpbmcodXJsKSB7XHJcbiAgICBjb25zdCBxdWVyeVN0YXJ0ID0gdXJsLmluZGV4T2YoJz8nKTtcclxuICAgIGlmICghcXVlcnlTdGFydCkge1xyXG4gICAgICAgIHJldHVybiAnJztcclxuICAgIH1cclxuICAgIGNvbnN0IGZyYWdtZW50U3RhcnQgPSB1cmwuaW5kZXhPZignIycsIHF1ZXJ5U3RhcnQpO1xyXG4gICAgcmV0dXJuIHVybC5zdWJzdHJpbmcocXVlcnlTdGFydCwgZnJhZ21lbnRTdGFydCA+IDAgPyBmcmFnbWVudFN0YXJ0IDogdW5kZWZpbmVkKTtcclxufVxuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMTcgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG4vKipcclxuICogQGZpbGVvdmVydmlldyBTSEEtMSBjcnlwdG9ncmFwaGljIGhhc2guXHJcbiAqIFZhcmlhYmxlIG5hbWVzIGZvbGxvdyB0aGUgbm90YXRpb24gaW4gRklQUyBQVUIgMTgwLTM6XHJcbiAqIGh0dHA6Ly9jc3JjLm5pc3QuZ292L3B1YmxpY2F0aW9ucy9maXBzL2ZpcHMxODAtMy9maXBzMTgwLTNfZmluYWwucGRmLlxyXG4gKlxyXG4gKiBVc2FnZTpcclxuICogICB2YXIgc2hhMSA9IG5ldyBzaGExKCk7XHJcbiAqICAgc2hhMS51cGRhdGUoYnl0ZXMpO1xyXG4gKiAgIHZhciBoYXNoID0gc2hhMS5kaWdlc3QoKTtcclxuICpcclxuICogUGVyZm9ybWFuY2U6XHJcbiAqICAgQ2hyb21lIDIzOiAgIH40MDAgTWJpdC9zXHJcbiAqICAgRmlyZWZveCAxNjogIH4yNTAgTWJpdC9zXHJcbiAqXHJcbiAqL1xyXG4vKipcclxuICogU0hBLTEgY3J5cHRvZ3JhcGhpYyBoYXNoIGNvbnN0cnVjdG9yLlxyXG4gKlxyXG4gKiBUaGUgcHJvcGVydGllcyBkZWNsYXJlZCBoZXJlIGFyZSBkaXNjdXNzZWQgaW4gdGhlIGFib3ZlIGFsZ29yaXRobSBkb2N1bWVudC5cclxuICogQGNvbnN0cnVjdG9yXHJcbiAqIEBmaW5hbFxyXG4gKiBAc3RydWN0XHJcbiAqL1xyXG5jbGFzcyBTaGExIHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEhvbGRzIHRoZSBwcmV2aW91cyB2YWx1ZXMgb2YgYWNjdW11bGF0ZWQgdmFyaWFibGVzIGEtZSBpbiB0aGUgY29tcHJlc3NfXHJcbiAgICAgICAgICogZnVuY3Rpb24uXHJcbiAgICAgICAgICogQHByaXZhdGVcclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLmNoYWluXyA9IFtdO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEEgYnVmZmVyIGhvbGRpbmcgdGhlIHBhcnRpYWxseSBjb21wdXRlZCBoYXNoIHJlc3VsdC5cclxuICAgICAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuYnVmXyA9IFtdO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEFuIGFycmF5IG9mIDgwIGJ5dGVzLCBlYWNoIGEgcGFydCBvZiB0aGUgbWVzc2FnZSB0byBiZSBoYXNoZWQuICBSZWZlcnJlZCB0b1xyXG4gICAgICAgICAqIGFzIHRoZSBtZXNzYWdlIHNjaGVkdWxlIGluIHRoZSBkb2NzLlxyXG4gICAgICAgICAqIEBwcml2YXRlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5XXyA9IFtdO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIENvbnRhaW5zIGRhdGEgbmVlZGVkIHRvIHBhZCBtZXNzYWdlcyBsZXNzIHRoYW4gNjQgYnl0ZXMuXHJcbiAgICAgICAgICogQHByaXZhdGVcclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLnBhZF8gPSBbXTtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBAcHJpdmF0ZSB7bnVtYmVyfVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuaW5idWZfID0gMDtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBAcHJpdmF0ZSB7bnVtYmVyfVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMudG90YWxfID0gMDtcclxuICAgICAgICB0aGlzLmJsb2NrU2l6ZSA9IDUxMiAvIDg7XHJcbiAgICAgICAgdGhpcy5wYWRfWzBdID0gMTI4O1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgdGhpcy5ibG9ja1NpemU7ICsraSkge1xyXG4gICAgICAgICAgICB0aGlzLnBhZF9baV0gPSAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnJlc2V0KCk7XHJcbiAgICB9XHJcbiAgICByZXNldCgpIHtcclxuICAgICAgICB0aGlzLmNoYWluX1swXSA9IDB4Njc0NTIzMDE7XHJcbiAgICAgICAgdGhpcy5jaGFpbl9bMV0gPSAweGVmY2RhYjg5O1xyXG4gICAgICAgIHRoaXMuY2hhaW5fWzJdID0gMHg5OGJhZGNmZTtcclxuICAgICAgICB0aGlzLmNoYWluX1szXSA9IDB4MTAzMjU0NzY7XHJcbiAgICAgICAgdGhpcy5jaGFpbl9bNF0gPSAweGMzZDJlMWYwO1xyXG4gICAgICAgIHRoaXMuaW5idWZfID0gMDtcclxuICAgICAgICB0aGlzLnRvdGFsXyA9IDA7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIEludGVybmFsIGNvbXByZXNzIGhlbHBlciBmdW5jdGlvbi5cclxuICAgICAqIEBwYXJhbSBidWYgQmxvY2sgdG8gY29tcHJlc3MuXHJcbiAgICAgKiBAcGFyYW0gb2Zmc2V0IE9mZnNldCBvZiB0aGUgYmxvY2sgaW4gdGhlIGJ1ZmZlci5cclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIGNvbXByZXNzXyhidWYsIG9mZnNldCkge1xyXG4gICAgICAgIGlmICghb2Zmc2V0KSB7XHJcbiAgICAgICAgICAgIG9mZnNldCA9IDA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IFcgPSB0aGlzLldfO1xyXG4gICAgICAgIC8vIGdldCAxNiBiaWcgZW5kaWFuIHdvcmRzXHJcbiAgICAgICAgaWYgKHR5cGVvZiBidWYgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTY7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgLy8gVE9ETyh1c2VyKTogW2J1ZyA4MTQwMTIyXSBSZWNlbnQgdmVyc2lvbnMgb2YgU2FmYXJpIGZvciBNYWMgT1MgYW5kIGlPU1xyXG4gICAgICAgICAgICAgICAgLy8gaGF2ZSBhIGJ1ZyB0aGF0IHR1cm5zIHRoZSBwb3N0LWluY3JlbWVudCArKyBvcGVyYXRvciBpbnRvIHByZS1pbmNyZW1lbnRcclxuICAgICAgICAgICAgICAgIC8vIGR1cmluZyBKSVQgY29tcGlsYXRpb24uICBXZSBoYXZlIGNvZGUgdGhhdCBkZXBlbmRzIGhlYXZpbHkgb24gU0hBLTEgZm9yXHJcbiAgICAgICAgICAgICAgICAvLyBjb3JyZWN0bmVzcyBhbmQgd2hpY2ggaXMgYWZmZWN0ZWQgYnkgdGhpcyBidWcsIHNvIEkndmUgcmVtb3ZlZCBhbGwgdXNlc1xyXG4gICAgICAgICAgICAgICAgLy8gb2YgcG9zdC1pbmNyZW1lbnQgKysgaW4gd2hpY2ggdGhlIHJlc3VsdCB2YWx1ZSBpcyB1c2VkLiAgV2UgY2FuIHJldmVydFxyXG4gICAgICAgICAgICAgICAgLy8gdGhpcyBjaGFuZ2Ugb25jZSB0aGUgU2FmYXJpIGJ1Z1xyXG4gICAgICAgICAgICAgICAgLy8gKGh0dHBzOi8vYnVncy53ZWJraXQub3JnL3Nob3dfYnVnLmNnaT9pZD0xMDkwMzYpIGhhcyBiZWVuIGZpeGVkIGFuZFxyXG4gICAgICAgICAgICAgICAgLy8gbW9zdCBjbGllbnRzIGhhdmUgYmVlbiB1cGRhdGVkLlxyXG4gICAgICAgICAgICAgICAgV1tpXSA9XHJcbiAgICAgICAgICAgICAgICAgICAgKGJ1Zi5jaGFyQ29kZUF0KG9mZnNldCkgPDwgMjQpIHxcclxuICAgICAgICAgICAgICAgICAgICAgICAgKGJ1Zi5jaGFyQ29kZUF0KG9mZnNldCArIDEpIDw8IDE2KSB8XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIChidWYuY2hhckNvZGVBdChvZmZzZXQgKyAyKSA8PCA4KSB8XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1Zi5jaGFyQ29kZUF0KG9mZnNldCArIDMpO1xyXG4gICAgICAgICAgICAgICAgb2Zmc2V0ICs9IDQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTY7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgV1tpXSA9XHJcbiAgICAgICAgICAgICAgICAgICAgKGJ1ZltvZmZzZXRdIDw8IDI0KSB8XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIChidWZbb2Zmc2V0ICsgMV0gPDwgMTYpIHxcclxuICAgICAgICAgICAgICAgICAgICAgICAgKGJ1ZltvZmZzZXQgKyAyXSA8PCA4KSB8XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1ZltvZmZzZXQgKyAzXTtcclxuICAgICAgICAgICAgICAgIG9mZnNldCArPSA0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGV4cGFuZCB0byA4MCB3b3Jkc1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAxNjsgaSA8IDgwOyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3QgdCA9IFdbaSAtIDNdIF4gV1tpIC0gOF0gXiBXW2kgLSAxNF0gXiBXW2kgLSAxNl07XHJcbiAgICAgICAgICAgIFdbaV0gPSAoKHQgPDwgMSkgfCAodCA+Pj4gMzEpKSAmIDB4ZmZmZmZmZmY7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBhID0gdGhpcy5jaGFpbl9bMF07XHJcbiAgICAgICAgbGV0IGIgPSB0aGlzLmNoYWluX1sxXTtcclxuICAgICAgICBsZXQgYyA9IHRoaXMuY2hhaW5fWzJdO1xyXG4gICAgICAgIGxldCBkID0gdGhpcy5jaGFpbl9bM107XHJcbiAgICAgICAgbGV0IGUgPSB0aGlzLmNoYWluX1s0XTtcclxuICAgICAgICBsZXQgZiwgaztcclxuICAgICAgICAvLyBUT0RPKHVzZXIpOiBUcnkgdG8gdW5yb2xsIHRoaXMgbG9vcCB0byBzcGVlZCB1cCB0aGUgY29tcHV0YXRpb24uXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCA4MDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChpIDwgNDApIHtcclxuICAgICAgICAgICAgICAgIGlmIChpIDwgMjApIHtcclxuICAgICAgICAgICAgICAgICAgICBmID0gZCBeIChiICYgKGMgXiBkKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgayA9IDB4NWE4Mjc5OTk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBmID0gYiBeIGMgXiBkO1xyXG4gICAgICAgICAgICAgICAgICAgIGsgPSAweDZlZDllYmExO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKGkgPCA2MCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGYgPSAoYiAmIGMpIHwgKGQgJiAoYiB8IGMpKTtcclxuICAgICAgICAgICAgICAgICAgICBrID0gMHg4ZjFiYmNkYztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGYgPSBiIF4gYyBeIGQ7XHJcbiAgICAgICAgICAgICAgICAgICAgayA9IDB4Y2E2MmMxZDY7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3QgdCA9ICgoKGEgPDwgNSkgfCAoYSA+Pj4gMjcpKSArIGYgKyBlICsgayArIFdbaV0pICYgMHhmZmZmZmZmZjtcclxuICAgICAgICAgICAgZSA9IGQ7XHJcbiAgICAgICAgICAgIGQgPSBjO1xyXG4gICAgICAgICAgICBjID0gKChiIDw8IDMwKSB8IChiID4+PiAyKSkgJiAweGZmZmZmZmZmO1xyXG4gICAgICAgICAgICBiID0gYTtcclxuICAgICAgICAgICAgYSA9IHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuY2hhaW5fWzBdID0gKHRoaXMuY2hhaW5fWzBdICsgYSkgJiAweGZmZmZmZmZmO1xyXG4gICAgICAgIHRoaXMuY2hhaW5fWzFdID0gKHRoaXMuY2hhaW5fWzFdICsgYikgJiAweGZmZmZmZmZmO1xyXG4gICAgICAgIHRoaXMuY2hhaW5fWzJdID0gKHRoaXMuY2hhaW5fWzJdICsgYykgJiAweGZmZmZmZmZmO1xyXG4gICAgICAgIHRoaXMuY2hhaW5fWzNdID0gKHRoaXMuY2hhaW5fWzNdICsgZCkgJiAweGZmZmZmZmZmO1xyXG4gICAgICAgIHRoaXMuY2hhaW5fWzRdID0gKHRoaXMuY2hhaW5fWzRdICsgZSkgJiAweGZmZmZmZmZmO1xyXG4gICAgfVxyXG4gICAgdXBkYXRlKGJ5dGVzLCBsZW5ndGgpIHtcclxuICAgICAgICAvLyBUT0RPKGpvaG5sZW56KTogdGlnaHRlbiB0aGUgZnVuY3Rpb24gc2lnbmF0dXJlIGFuZCByZW1vdmUgdGhpcyBjaGVja1xyXG4gICAgICAgIGlmIChieXRlcyA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGxlbmd0aCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGxlbmd0aCA9IGJ5dGVzLmxlbmd0aDtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgbGVuZ3RoTWludXNCbG9jayA9IGxlbmd0aCAtIHRoaXMuYmxvY2tTaXplO1xyXG4gICAgICAgIGxldCBuID0gMDtcclxuICAgICAgICAvLyBVc2luZyBsb2NhbCBpbnN0ZWFkIG9mIG1lbWJlciB2YXJpYWJsZXMgZ2l2ZXMgfjUlIHNwZWVkdXAgb24gRmlyZWZveCAxNi5cclxuICAgICAgICBjb25zdCBidWYgPSB0aGlzLmJ1Zl87XHJcbiAgICAgICAgbGV0IGluYnVmID0gdGhpcy5pbmJ1Zl87XHJcbiAgICAgICAgLy8gVGhlIG91dGVyIHdoaWxlIGxvb3Agc2hvdWxkIGV4ZWN1dGUgYXQgbW9zdCB0d2ljZS5cclxuICAgICAgICB3aGlsZSAobiA8IGxlbmd0aCkge1xyXG4gICAgICAgICAgICAvLyBXaGVuIHdlIGhhdmUgbm8gZGF0YSBpbiB0aGUgYmxvY2sgdG8gdG9wIHVwLCB3ZSBjYW4gZGlyZWN0bHkgcHJvY2VzcyB0aGVcclxuICAgICAgICAgICAgLy8gaW5wdXQgYnVmZmVyIChhc3N1bWluZyBpdCBjb250YWlucyBzdWZmaWNpZW50IGRhdGEpLiBUaGlzIGdpdmVzIH4yNSVcclxuICAgICAgICAgICAgLy8gc3BlZWR1cCBvbiBDaHJvbWUgMjMgYW5kIH4xNSUgc3BlZWR1cCBvbiBGaXJlZm94IDE2LCBidXQgcmVxdWlyZXMgdGhhdFxyXG4gICAgICAgICAgICAvLyB0aGUgZGF0YSBpcyBwcm92aWRlZCBpbiBsYXJnZSBjaHVua3MgKG9yIGluIG11bHRpcGxlcyBvZiA2NCBieXRlcykuXHJcbiAgICAgICAgICAgIGlmIChpbmJ1ZiA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgd2hpbGUgKG4gPD0gbGVuZ3RoTWludXNCbG9jaykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29tcHJlc3NfKGJ5dGVzLCBuKTtcclxuICAgICAgICAgICAgICAgICAgICBuICs9IHRoaXMuYmxvY2tTaXplO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgYnl0ZXMgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgICAgICB3aGlsZSAobiA8IGxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGJ1ZltpbmJ1Zl0gPSBieXRlcy5jaGFyQ29kZUF0KG4pO1xyXG4gICAgICAgICAgICAgICAgICAgICsraW5idWY7XHJcbiAgICAgICAgICAgICAgICAgICAgKytuO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpbmJ1ZiA9PT0gdGhpcy5ibG9ja1NpemUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb21wcmVzc18oYnVmKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaW5idWYgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBKdW1wIHRvIHRoZSBvdXRlciBsb29wIHNvIHdlIHVzZSB0aGUgZnVsbC1ibG9jayBvcHRpbWl6YXRpb24uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHdoaWxlIChuIDwgbGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYnVmW2luYnVmXSA9IGJ5dGVzW25dO1xyXG4gICAgICAgICAgICAgICAgICAgICsraW5idWY7XHJcbiAgICAgICAgICAgICAgICAgICAgKytuO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpbmJ1ZiA9PT0gdGhpcy5ibG9ja1NpemUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb21wcmVzc18oYnVmKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaW5idWYgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBKdW1wIHRvIHRoZSBvdXRlciBsb29wIHNvIHdlIHVzZSB0aGUgZnVsbC1ibG9jayBvcHRpbWl6YXRpb24uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmluYnVmXyA9IGluYnVmO1xyXG4gICAgICAgIHRoaXMudG90YWxfICs9IGxlbmd0aDtcclxuICAgIH1cclxuICAgIC8qKiBAb3ZlcnJpZGUgKi9cclxuICAgIGRpZ2VzdCgpIHtcclxuICAgICAgICBjb25zdCBkaWdlc3QgPSBbXTtcclxuICAgICAgICBsZXQgdG90YWxCaXRzID0gdGhpcy50b3RhbF8gKiA4O1xyXG4gICAgICAgIC8vIEFkZCBwYWQgMHg4MCAweDAwKi5cclxuICAgICAgICBpZiAodGhpcy5pbmJ1Zl8gPCA1Nikge1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZSh0aGlzLnBhZF8sIDU2IC0gdGhpcy5pbmJ1Zl8pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGUodGhpcy5wYWRfLCB0aGlzLmJsb2NrU2l6ZSAtICh0aGlzLmluYnVmXyAtIDU2KSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIEFkZCAjIGJpdHMuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IHRoaXMuYmxvY2tTaXplIC0gMTsgaSA+PSA1NjsgaS0tKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYnVmX1tpXSA9IHRvdGFsQml0cyAmIDI1NTtcclxuICAgICAgICAgICAgdG90YWxCaXRzIC89IDI1NjsgLy8gRG9uJ3QgdXNlIGJpdC1zaGlmdGluZyBoZXJlIVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmNvbXByZXNzXyh0aGlzLmJ1Zl8pO1xyXG4gICAgICAgIGxldCBuID0gMDtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDU7IGkrKykge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMjQ7IGogPj0gMDsgaiAtPSA4KSB7XHJcbiAgICAgICAgICAgICAgICBkaWdlc3Rbbl0gPSAodGhpcy5jaGFpbl9baV0gPj4gaikgJiAyNTU7XHJcbiAgICAgICAgICAgICAgICArK247XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGRpZ2VzdDtcclxuICAgIH1cclxufVxuXG4vKipcclxuICogSGVscGVyIHRvIG1ha2UgYSBTdWJzY3JpYmUgZnVuY3Rpb24gKGp1c3QgbGlrZSBQcm9taXNlIGhlbHBzIG1ha2UgYVxyXG4gKiBUaGVuYWJsZSkuXHJcbiAqXHJcbiAqIEBwYXJhbSBleGVjdXRvciBGdW5jdGlvbiB3aGljaCBjYW4gbWFrZSBjYWxscyB0byBhIHNpbmdsZSBPYnNlcnZlclxyXG4gKiAgICAgYXMgYSBwcm94eS5cclxuICogQHBhcmFtIG9uTm9PYnNlcnZlcnMgQ2FsbGJhY2sgd2hlbiBjb3VudCBvZiBPYnNlcnZlcnMgZ29lcyB0byB6ZXJvLlxyXG4gKi9cclxuZnVuY3Rpb24gY3JlYXRlU3Vic2NyaWJlKGV4ZWN1dG9yLCBvbk5vT2JzZXJ2ZXJzKSB7XHJcbiAgICBjb25zdCBwcm94eSA9IG5ldyBPYnNlcnZlclByb3h5KGV4ZWN1dG9yLCBvbk5vT2JzZXJ2ZXJzKTtcclxuICAgIHJldHVybiBwcm94eS5zdWJzY3JpYmUuYmluZChwcm94eSk7XHJcbn1cclxuLyoqXHJcbiAqIEltcGxlbWVudCBmYW4tb3V0IGZvciBhbnkgbnVtYmVyIG9mIE9ic2VydmVycyBhdHRhY2hlZCB2aWEgYSBzdWJzY3JpYmVcclxuICogZnVuY3Rpb24uXHJcbiAqL1xyXG5jbGFzcyBPYnNlcnZlclByb3h5IHtcclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIGV4ZWN1dG9yIEZ1bmN0aW9uIHdoaWNoIGNhbiBtYWtlIGNhbGxzIHRvIGEgc2luZ2xlIE9ic2VydmVyXHJcbiAgICAgKiAgICAgYXMgYSBwcm94eS5cclxuICAgICAqIEBwYXJhbSBvbk5vT2JzZXJ2ZXJzIENhbGxiYWNrIHdoZW4gY291bnQgb2YgT2JzZXJ2ZXJzIGdvZXMgdG8gemVyby5cclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IoZXhlY3V0b3IsIG9uTm9PYnNlcnZlcnMpIHtcclxuICAgICAgICB0aGlzLm9ic2VydmVycyA9IFtdO1xyXG4gICAgICAgIHRoaXMudW5zdWJzY3JpYmVzID0gW107XHJcbiAgICAgICAgdGhpcy5vYnNlcnZlckNvdW50ID0gMDtcclxuICAgICAgICAvLyBNaWNyby10YXNrIHNjaGVkdWxpbmcgYnkgY2FsbGluZyB0YXNrLnRoZW4oKS5cclxuICAgICAgICB0aGlzLnRhc2sgPSBQcm9taXNlLnJlc29sdmUoKTtcclxuICAgICAgICB0aGlzLmZpbmFsaXplZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMub25Ob09ic2VydmVycyA9IG9uTm9PYnNlcnZlcnM7XHJcbiAgICAgICAgLy8gQ2FsbCB0aGUgZXhlY3V0b3IgYXN5bmNocm9ub3VzbHkgc28gc3Vic2NyaWJlcnMgdGhhdCBhcmUgY2FsbGVkXHJcbiAgICAgICAgLy8gc3luY2hyb25vdXNseSBhZnRlciB0aGUgY3JlYXRpb24gb2YgdGhlIHN1YnNjcmliZSBmdW5jdGlvblxyXG4gICAgICAgIC8vIGNhbiBzdGlsbCByZWNlaXZlIHRoZSB2ZXJ5IGZpcnN0IHZhbHVlIGdlbmVyYXRlZCBpbiB0aGUgZXhlY3V0b3IuXHJcbiAgICAgICAgdGhpcy50YXNrXHJcbiAgICAgICAgICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgZXhlY3V0b3IodGhpcyk7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAgICAgLmNhdGNoKGUgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmVycm9yKGUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgbmV4dCh2YWx1ZSkge1xyXG4gICAgICAgIHRoaXMuZm9yRWFjaE9ic2VydmVyKChvYnNlcnZlcikgPT4ge1xyXG4gICAgICAgICAgICBvYnNlcnZlci5uZXh0KHZhbHVlKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIGVycm9yKGVycm9yKSB7XHJcbiAgICAgICAgdGhpcy5mb3JFYWNoT2JzZXJ2ZXIoKG9ic2VydmVyKSA9PiB7XHJcbiAgICAgICAgICAgIG9ic2VydmVyLmVycm9yKGVycm9yKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmNsb3NlKGVycm9yKTtcclxuICAgIH1cclxuICAgIGNvbXBsZXRlKCkge1xyXG4gICAgICAgIHRoaXMuZm9yRWFjaE9ic2VydmVyKChvYnNlcnZlcikgPT4ge1xyXG4gICAgICAgICAgICBvYnNlcnZlci5jb21wbGV0ZSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuY2xvc2UoKTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogU3Vic2NyaWJlIGZ1bmN0aW9uIHRoYXQgY2FuIGJlIHVzZWQgdG8gYWRkIGFuIE9ic2VydmVyIHRvIHRoZSBmYW4tb3V0IGxpc3QuXHJcbiAgICAgKlxyXG4gICAgICogLSBXZSByZXF1aXJlIHRoYXQgbm8gZXZlbnQgaXMgc2VudCB0byBhIHN1YnNjcmliZXIgc3ljaHJvbm91c2x5IHRvIHRoZWlyXHJcbiAgICAgKiAgIGNhbGwgdG8gc3Vic2NyaWJlKCkuXHJcbiAgICAgKi9cclxuICAgIHN1YnNjcmliZShuZXh0T3JPYnNlcnZlciwgZXJyb3IsIGNvbXBsZXRlKSB7XHJcbiAgICAgICAgbGV0IG9ic2VydmVyO1xyXG4gICAgICAgIGlmIChuZXh0T3JPYnNlcnZlciA9PT0gdW5kZWZpbmVkICYmXHJcbiAgICAgICAgICAgIGVycm9yID09PSB1bmRlZmluZWQgJiZcclxuICAgICAgICAgICAgY29tcGxldGUgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ01pc3NpbmcgT2JzZXJ2ZXIuJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIEFzc2VtYmxlIGFuIE9ic2VydmVyIG9iamVjdCB3aGVuIHBhc3NlZCBhcyBjYWxsYmFjayBmdW5jdGlvbnMuXHJcbiAgICAgICAgaWYgKGltcGxlbWVudHNBbnlNZXRob2RzKG5leHRPck9ic2VydmVyLCBbXHJcbiAgICAgICAgICAgICduZXh0JyxcclxuICAgICAgICAgICAgJ2Vycm9yJyxcclxuICAgICAgICAgICAgJ2NvbXBsZXRlJ1xyXG4gICAgICAgIF0pKSB7XHJcbiAgICAgICAgICAgIG9ic2VydmVyID0gbmV4dE9yT2JzZXJ2ZXI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBvYnNlcnZlciA9IHtcclxuICAgICAgICAgICAgICAgIG5leHQ6IG5leHRPck9ic2VydmVyLFxyXG4gICAgICAgICAgICAgICAgZXJyb3IsXHJcbiAgICAgICAgICAgICAgICBjb21wbGV0ZVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAob2JzZXJ2ZXIubmV4dCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIG9ic2VydmVyLm5leHQgPSBub29wO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAob2JzZXJ2ZXIuZXJyb3IgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBvYnNlcnZlci5lcnJvciA9IG5vb3A7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChvYnNlcnZlci5jb21wbGV0ZSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIG9ic2VydmVyLmNvbXBsZXRlID0gbm9vcDtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgdW5zdWIgPSB0aGlzLnVuc3Vic2NyaWJlT25lLmJpbmQodGhpcywgdGhpcy5vYnNlcnZlcnMubGVuZ3RoKTtcclxuICAgICAgICAvLyBBdHRlbXB0IHRvIHN1YnNjcmliZSB0byBhIHRlcm1pbmF0ZWQgT2JzZXJ2YWJsZSAtIHdlXHJcbiAgICAgICAgLy8ganVzdCByZXNwb25kIHRvIHRoZSBPYnNlcnZlciB3aXRoIHRoZSBmaW5hbCBlcnJvciBvciBjb21wbGV0ZVxyXG4gICAgICAgIC8vIGV2ZW50LlxyXG4gICAgICAgIGlmICh0aGlzLmZpbmFsaXplZCkge1xyXG4gICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWZsb2F0aW5nLXByb21pc2VzXHJcbiAgICAgICAgICAgIHRoaXMudGFzay50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuZmluYWxFcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvYnNlcnZlci5lcnJvcih0aGlzLmZpbmFsRXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgb2JzZXJ2ZXIuY29tcGxldGUoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIG5vdGhpbmdcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMub2JzZXJ2ZXJzLnB1c2gob2JzZXJ2ZXIpO1xyXG4gICAgICAgIHJldHVybiB1bnN1YjtcclxuICAgIH1cclxuICAgIC8vIFVuc3Vic2NyaWJlIGlzIHN5bmNocm9ub3VzIC0gd2UgZ3VhcmFudGVlIHRoYXQgbm8gZXZlbnRzIGFyZSBzZW50IHRvXHJcbiAgICAvLyBhbnkgdW5zdWJzY3JpYmVkIE9ic2VydmVyLlxyXG4gICAgdW5zdWJzY3JpYmVPbmUoaSkge1xyXG4gICAgICAgIGlmICh0aGlzLm9ic2VydmVycyA9PT0gdW5kZWZpbmVkIHx8IHRoaXMub2JzZXJ2ZXJzW2ldID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBkZWxldGUgdGhpcy5vYnNlcnZlcnNbaV07XHJcbiAgICAgICAgdGhpcy5vYnNlcnZlckNvdW50IC09IDE7XHJcbiAgICAgICAgaWYgKHRoaXMub2JzZXJ2ZXJDb3VudCA9PT0gMCAmJiB0aGlzLm9uTm9PYnNlcnZlcnMgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB0aGlzLm9uTm9PYnNlcnZlcnModGhpcyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZm9yRWFjaE9ic2VydmVyKGZuKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZmluYWxpemVkKSB7XHJcbiAgICAgICAgICAgIC8vIEFscmVhZHkgY2xvc2VkIGJ5IHByZXZpb3VzIGV2ZW50Li4uLmp1c3QgZWF0IHRoZSBhZGRpdGlvbmFsIHZhbHVlcy5cclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBTaW5jZSBzZW5kT25lIGNhbGxzIGFzeW5jaHJvbm91c2x5IC0gdGhlcmUgaXMgbm8gY2hhbmNlIHRoYXRcclxuICAgICAgICAvLyB0aGlzLm9ic2VydmVycyB3aWxsIGJlY29tZSB1bmRlZmluZWQuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLm9ic2VydmVycy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLnNlbmRPbmUoaSwgZm4pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8vIENhbGwgdGhlIE9ic2VydmVyIHZpYSBvbmUgb2YgaXQncyBjYWxsYmFjayBmdW5jdGlvbi4gV2UgYXJlIGNhcmVmdWwgdG9cclxuICAgIC8vIGNvbmZpcm0gdGhhdCB0aGUgb2JzZXJ2ZSBoYXMgbm90IGJlZW4gdW5zdWJzY3JpYmVkIHNpbmNlIHRoaXMgYXN5bmNocm9ub3VzXHJcbiAgICAvLyBmdW5jdGlvbiBoYWQgYmVlbiBxdWV1ZWQuXHJcbiAgICBzZW5kT25lKGksIGZuKSB7XHJcbiAgICAgICAgLy8gRXhlY3V0ZSB0aGUgY2FsbGJhY2sgYXN5bmNocm9ub3VzbHlcclxuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWZsb2F0aW5nLXByb21pc2VzXHJcbiAgICAgICAgdGhpcy50YXNrLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5vYnNlcnZlcnMgIT09IHVuZGVmaW5lZCAmJiB0aGlzLm9ic2VydmVyc1tpXSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZuKHRoaXMub2JzZXJ2ZXJzW2ldKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gSWdub3JlIGV4Y2VwdGlvbnMgcmFpc2VkIGluIE9ic2VydmVycyBvciBtaXNzaW5nIG1ldGhvZHMgb2YgYW5cclxuICAgICAgICAgICAgICAgICAgICAvLyBPYnNlcnZlci5cclxuICAgICAgICAgICAgICAgICAgICAvLyBMb2cgZXJyb3IgdG8gY29uc29sZS4gYi8zMTQwNDgwNlxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCcgJiYgY29uc29sZS5lcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgY2xvc2UoZXJyKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZmluYWxpemVkKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5maW5hbGl6ZWQgPSB0cnVlO1xyXG4gICAgICAgIGlmIChlcnIgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB0aGlzLmZpbmFsRXJyb3IgPSBlcnI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIFByb3h5IGlzIG5vIGxvbmdlciBuZWVkZWQgLSBnYXJiYWdlIGNvbGxlY3QgcmVmZXJlbmNlc1xyXG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZmxvYXRpbmctcHJvbWlzZXNcclxuICAgICAgICB0aGlzLnRhc2sudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMub2JzZXJ2ZXJzID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICB0aGlzLm9uTm9PYnNlcnZlcnMgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuLyoqIFR1cm4gc3luY2hyb25vdXMgZnVuY3Rpb24gaW50byBvbmUgY2FsbGVkIGFzeW5jaHJvbm91c2x5LiAqL1xyXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L2Jhbi10eXBlc1xyXG5mdW5jdGlvbiBhc3luYyhmbiwgb25FcnJvcikge1xyXG4gICAgcmV0dXJuICguLi5hcmdzKSA9PiB7XHJcbiAgICAgICAgUHJvbWlzZS5yZXNvbHZlKHRydWUpXHJcbiAgICAgICAgICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgZm4oLi4uYXJncyk7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAgICAgLmNhdGNoKChlcnJvcikgPT4ge1xyXG4gICAgICAgICAgICBpZiAob25FcnJvcikge1xyXG4gICAgICAgICAgICAgICAgb25FcnJvcihlcnJvcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbn1cclxuLyoqXHJcbiAqIFJldHVybiB0cnVlIGlmIHRoZSBvYmplY3QgcGFzc2VkIGluIGltcGxlbWVudHMgYW55IG9mIHRoZSBuYW1lZCBtZXRob2RzLlxyXG4gKi9cclxuZnVuY3Rpb24gaW1wbGVtZW50c0FueU1ldGhvZHMob2JqLCBtZXRob2RzKSB7XHJcbiAgICBpZiAodHlwZW9mIG9iaiAhPT0gJ29iamVjdCcgfHwgb2JqID09PSBudWxsKSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgZm9yIChjb25zdCBtZXRob2Qgb2YgbWV0aG9kcykge1xyXG4gICAgICAgIGlmIChtZXRob2QgaW4gb2JqICYmIHR5cGVvZiBvYmpbbWV0aG9kXSA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbn1cclxuZnVuY3Rpb24gbm9vcCgpIHtcclxuICAgIC8vIGRvIG5vdGhpbmdcclxufVxuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMTcgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG4vKipcclxuICogQ2hlY2sgdG8gbWFrZSBzdXJlIHRoZSBhcHByb3ByaWF0ZSBudW1iZXIgb2YgYXJndW1lbnRzIGFyZSBwcm92aWRlZCBmb3IgYSBwdWJsaWMgZnVuY3Rpb24uXHJcbiAqIFRocm93cyBhbiBlcnJvciBpZiBpdCBmYWlscy5cclxuICpcclxuICogQHBhcmFtIGZuTmFtZSBUaGUgZnVuY3Rpb24gbmFtZVxyXG4gKiBAcGFyYW0gbWluQ291bnQgVGhlIG1pbmltdW0gbnVtYmVyIG9mIGFyZ3VtZW50cyB0byBhbGxvdyBmb3IgdGhlIGZ1bmN0aW9uIGNhbGxcclxuICogQHBhcmFtIG1heENvdW50IFRoZSBtYXhpbXVtIG51bWJlciBvZiBhcmd1bWVudCB0byBhbGxvdyBmb3IgdGhlIGZ1bmN0aW9uIGNhbGxcclxuICogQHBhcmFtIGFyZ0NvdW50IFRoZSBhY3R1YWwgbnVtYmVyIG9mIGFyZ3VtZW50cyBwcm92aWRlZC5cclxuICovXHJcbmNvbnN0IHZhbGlkYXRlQXJnQ291bnQgPSBmdW5jdGlvbiAoZm5OYW1lLCBtaW5Db3VudCwgbWF4Q291bnQsIGFyZ0NvdW50KSB7XHJcbiAgICBsZXQgYXJnRXJyb3I7XHJcbiAgICBpZiAoYXJnQ291bnQgPCBtaW5Db3VudCkge1xyXG4gICAgICAgIGFyZ0Vycm9yID0gJ2F0IGxlYXN0ICcgKyBtaW5Db3VudDtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKGFyZ0NvdW50ID4gbWF4Q291bnQpIHtcclxuICAgICAgICBhcmdFcnJvciA9IG1heENvdW50ID09PSAwID8gJ25vbmUnIDogJ25vIG1vcmUgdGhhbiAnICsgbWF4Q291bnQ7XHJcbiAgICB9XHJcbiAgICBpZiAoYXJnRXJyb3IpIHtcclxuICAgICAgICBjb25zdCBlcnJvciA9IGZuTmFtZSArXHJcbiAgICAgICAgICAgICcgZmFpbGVkOiBXYXMgY2FsbGVkIHdpdGggJyArXHJcbiAgICAgICAgICAgIGFyZ0NvdW50ICtcclxuICAgICAgICAgICAgKGFyZ0NvdW50ID09PSAxID8gJyBhcmd1bWVudC4nIDogJyBhcmd1bWVudHMuJykgK1xyXG4gICAgICAgICAgICAnIEV4cGVjdHMgJyArXHJcbiAgICAgICAgICAgIGFyZ0Vycm9yICtcclxuICAgICAgICAgICAgJy4nO1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihlcnJvcik7XHJcbiAgICB9XHJcbn07XHJcbi8qKlxyXG4gKiBHZW5lcmF0ZXMgYSBzdHJpbmcgdG8gcHJlZml4IGFuIGVycm9yIG1lc3NhZ2UgYWJvdXQgZmFpbGVkIGFyZ3VtZW50IHZhbGlkYXRpb25cclxuICpcclxuICogQHBhcmFtIGZuTmFtZSBUaGUgZnVuY3Rpb24gbmFtZVxyXG4gKiBAcGFyYW0gYXJnTmFtZSBUaGUgbmFtZSBvZiB0aGUgYXJndW1lbnRcclxuICogQHJldHVybiBUaGUgcHJlZml4IHRvIGFkZCB0byB0aGUgZXJyb3IgdGhyb3duIGZvciB2YWxpZGF0aW9uLlxyXG4gKi9cclxuZnVuY3Rpb24gZXJyb3JQcmVmaXgoZm5OYW1lLCBhcmdOYW1lKSB7XHJcbiAgICByZXR1cm4gYCR7Zm5OYW1lfSBmYWlsZWQ6ICR7YXJnTmFtZX0gYXJndW1lbnQgYDtcclxufVxyXG4vKipcclxuICogQHBhcmFtIGZuTmFtZVxyXG4gKiBAcGFyYW0gYXJndW1lbnROdW1iZXJcclxuICogQHBhcmFtIG5hbWVzcGFjZVxyXG4gKiBAcGFyYW0gb3B0aW9uYWxcclxuICovXHJcbmZ1bmN0aW9uIHZhbGlkYXRlTmFtZXNwYWNlKGZuTmFtZSwgbmFtZXNwYWNlLCBvcHRpb25hbCkge1xyXG4gICAgaWYgKG9wdGlvbmFsICYmICFuYW1lc3BhY2UpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBpZiAodHlwZW9mIG5hbWVzcGFjZSAhPT0gJ3N0cmluZycpIHtcclxuICAgICAgICAvL1RPRE86IEkgc2hvdWxkIGRvIG1vcmUgdmFsaWRhdGlvbiBoZXJlLiBXZSBvbmx5IGFsbG93IGNlcnRhaW4gY2hhcnMgaW4gbmFtZXNwYWNlcy5cclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZXJyb3JQcmVmaXgoZm5OYW1lLCAnbmFtZXNwYWNlJykgKyAnbXVzdCBiZSBhIHZhbGlkIGZpcmViYXNlIG5hbWVzcGFjZS4nKTtcclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiB2YWxpZGF0ZUNhbGxiYWNrKGZuTmFtZSwgYXJndW1lbnROYW1lLCBcclxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9iYW4tdHlwZXNcclxuY2FsbGJhY2ssIG9wdGlvbmFsKSB7XHJcbiAgICBpZiAob3B0aW9uYWwgJiYgIWNhbGxiYWNrKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgaWYgKHR5cGVvZiBjYWxsYmFjayAhPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihlcnJvclByZWZpeChmbk5hbWUsIGFyZ3VtZW50TmFtZSkgKyAnbXVzdCBiZSBhIHZhbGlkIGZ1bmN0aW9uLicpO1xyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIHZhbGlkYXRlQ29udGV4dE9iamVjdChmbk5hbWUsIGFyZ3VtZW50TmFtZSwgY29udGV4dCwgb3B0aW9uYWwpIHtcclxuICAgIGlmIChvcHRpb25hbCAmJiAhY29udGV4dCkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGlmICh0eXBlb2YgY29udGV4dCAhPT0gJ29iamVjdCcgfHwgY29udGV4dCA9PT0gbnVsbCkge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihlcnJvclByZWZpeChmbk5hbWUsIGFyZ3VtZW50TmFtZSkgKyAnbXVzdCBiZSBhIHZhbGlkIGNvbnRleHQgb2JqZWN0LicpO1xyXG4gICAgfVxyXG59XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAxNyBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbi8vIENvZGUgb3JpZ2luYWxseSBjYW1lIGZyb20gZ29vZy5jcnlwdC5zdHJpbmdUb1V0ZjhCeXRlQXJyYXksIGJ1dCBmb3Igc29tZSByZWFzb24gdGhleVxyXG4vLyBhdXRvbWF0aWNhbGx5IHJlcGxhY2VkICdcXHJcXG4nIHdpdGggJ1xcbicsIGFuZCB0aGV5IGRpZG4ndCBoYW5kbGUgc3Vycm9nYXRlIHBhaXJzLFxyXG4vLyBzbyBpdCdzIGJlZW4gbW9kaWZpZWQuXHJcbi8vIE5vdGUgdGhhdCBub3QgYWxsIFVuaWNvZGUgY2hhcmFjdGVycyBhcHBlYXIgYXMgc2luZ2xlIGNoYXJhY3RlcnMgaW4gSmF2YVNjcmlwdCBzdHJpbmdzLlxyXG4vLyBmcm9tQ2hhckNvZGUgcmV0dXJucyB0aGUgVVRGLTE2IGVuY29kaW5nIG9mIGEgY2hhcmFjdGVyIC0gc28gc29tZSBVbmljb2RlIGNoYXJhY3RlcnNcclxuLy8gdXNlIDIgY2hhcmFjdGVycyBpbiBKYXZhc2NyaXB0LiAgQWxsIDQtYnl0ZSBVVEYtOCBjaGFyYWN0ZXJzIGJlZ2luIHdpdGggYSBmaXJzdFxyXG4vLyBjaGFyYWN0ZXIgaW4gdGhlIHJhbmdlIDB4RDgwMCAtIDB4REJGRiAodGhlIGZpcnN0IGNoYXJhY3RlciBvZiBhIHNvLWNhbGxlZCBzdXJyb2dhdGVcclxuLy8gcGFpcikuXHJcbi8vIFNlZSBodHRwOi8vd3d3LmVjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNS4xLyNzZWMtMTUuMS4zXHJcbi8qKlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gc3RyXHJcbiAqIEByZXR1cm4ge0FycmF5fVxyXG4gKi9cclxuY29uc3Qgc3RyaW5nVG9CeXRlQXJyYXkgPSBmdW5jdGlvbiAoc3RyKSB7XHJcbiAgICBjb25zdCBvdXQgPSBbXTtcclxuICAgIGxldCBwID0gMDtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgbGV0IGMgPSBzdHIuY2hhckNvZGVBdChpKTtcclxuICAgICAgICAvLyBJcyB0aGlzIHRoZSBsZWFkIHN1cnJvZ2F0ZSBpbiBhIHN1cnJvZ2F0ZSBwYWlyP1xyXG4gICAgICAgIGlmIChjID49IDB4ZDgwMCAmJiBjIDw9IDB4ZGJmZikge1xyXG4gICAgICAgICAgICBjb25zdCBoaWdoID0gYyAtIDB4ZDgwMDsgLy8gdGhlIGhpZ2ggMTAgYml0cy5cclxuICAgICAgICAgICAgaSsrO1xyXG4gICAgICAgICAgICBhc3NlcnQoaSA8IHN0ci5sZW5ndGgsICdTdXJyb2dhdGUgcGFpciBtaXNzaW5nIHRyYWlsIHN1cnJvZ2F0ZS4nKTtcclxuICAgICAgICAgICAgY29uc3QgbG93ID0gc3RyLmNoYXJDb2RlQXQoaSkgLSAweGRjMDA7IC8vIHRoZSBsb3cgMTAgYml0cy5cclxuICAgICAgICAgICAgYyA9IDB4MTAwMDAgKyAoaGlnaCA8PCAxMCkgKyBsb3c7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChjIDwgMTI4KSB7XHJcbiAgICAgICAgICAgIG91dFtwKytdID0gYztcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoYyA8IDIwNDgpIHtcclxuICAgICAgICAgICAgb3V0W3ArK10gPSAoYyA+PiA2KSB8IDE5MjtcclxuICAgICAgICAgICAgb3V0W3ArK10gPSAoYyAmIDYzKSB8IDEyODtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoYyA8IDY1NTM2KSB7XHJcbiAgICAgICAgICAgIG91dFtwKytdID0gKGMgPj4gMTIpIHwgMjI0O1xyXG4gICAgICAgICAgICBvdXRbcCsrXSA9ICgoYyA+PiA2KSAmIDYzKSB8IDEyODtcclxuICAgICAgICAgICAgb3V0W3ArK10gPSAoYyAmIDYzKSB8IDEyODtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIG91dFtwKytdID0gKGMgPj4gMTgpIHwgMjQwO1xyXG4gICAgICAgICAgICBvdXRbcCsrXSA9ICgoYyA+PiAxMikgJiA2MykgfCAxMjg7XHJcbiAgICAgICAgICAgIG91dFtwKytdID0gKChjID4+IDYpICYgNjMpIHwgMTI4O1xyXG4gICAgICAgICAgICBvdXRbcCsrXSA9IChjICYgNjMpIHwgMTI4O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBvdXQ7XHJcbn07XHJcbi8qKlxyXG4gKiBDYWxjdWxhdGUgbGVuZ3RoIHdpdGhvdXQgYWN0dWFsbHkgY29udmVydGluZzsgdXNlZnVsIGZvciBkb2luZyBjaGVhcGVyIHZhbGlkYXRpb24uXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHJcclxuICogQHJldHVybiB7bnVtYmVyfVxyXG4gKi9cclxuY29uc3Qgc3RyaW5nTGVuZ3RoID0gZnVuY3Rpb24gKHN0cikge1xyXG4gICAgbGV0IHAgPSAwO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBjb25zdCBjID0gc3RyLmNoYXJDb2RlQXQoaSk7XHJcbiAgICAgICAgaWYgKGMgPCAxMjgpIHtcclxuICAgICAgICAgICAgcCsrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChjIDwgMjA0OCkge1xyXG4gICAgICAgICAgICBwICs9IDI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGMgPj0gMHhkODAwICYmIGMgPD0gMHhkYmZmKSB7XHJcbiAgICAgICAgICAgIC8vIExlYWQgc3Vycm9nYXRlIG9mIGEgc3Vycm9nYXRlIHBhaXIuICBUaGUgcGFpciB0b2dldGhlciB3aWxsIHRha2UgNCBieXRlcyB0byByZXByZXNlbnQuXHJcbiAgICAgICAgICAgIHAgKz0gNDtcclxuICAgICAgICAgICAgaSsrOyAvLyBza2lwIHRyYWlsIHN1cnJvZ2F0ZS5cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHAgKz0gMztcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcDtcclxufTtcblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDIyIEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuLyoqXHJcbiAqIENvcGllZCBmcm9tIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8yMTE3NTIzXHJcbiAqIEdlbmVyYXRlcyBhIG5ldyB1dWlkLlxyXG4gKiBAcHVibGljXHJcbiAqL1xyXG5jb25zdCB1dWlkdjQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4gJ3h4eHh4eHh4LXh4eHgtNHh4eC15eHh4LXh4eHh4eHh4eHh4eCcucmVwbGFjZSgvW3h5XS9nLCBjID0+IHtcclxuICAgICAgICBjb25zdCByID0gKE1hdGgucmFuZG9tKCkgKiAxNikgfCAwLCB2ID0gYyA9PT0gJ3gnID8gciA6IChyICYgMHgzKSB8IDB4ODtcclxuICAgICAgICByZXR1cm4gdi50b1N0cmluZygxNik7XHJcbiAgICB9KTtcclxufTtcblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDE5IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuLyoqXHJcbiAqIFRoZSBhbW91bnQgb2YgbWlsbGlzZWNvbmRzIHRvIGV4cG9uZW50aWFsbHkgaW5jcmVhc2UuXHJcbiAqL1xyXG5jb25zdCBERUZBVUxUX0lOVEVSVkFMX01JTExJUyA9IDEwMDA7XHJcbi8qKlxyXG4gKiBUaGUgZmFjdG9yIHRvIGJhY2tvZmYgYnkuXHJcbiAqIFNob3VsZCBiZSBhIG51bWJlciBncmVhdGVyIHRoYW4gMS5cclxuICovXHJcbmNvbnN0IERFRkFVTFRfQkFDS09GRl9GQUNUT1IgPSAyO1xyXG4vKipcclxuICogVGhlIG1heGltdW0gbWlsbGlzZWNvbmRzIHRvIGluY3JlYXNlIHRvLlxyXG4gKlxyXG4gKiA8cD5WaXNpYmxlIGZvciB0ZXN0aW5nXHJcbiAqL1xyXG5jb25zdCBNQVhfVkFMVUVfTUlMTElTID0gNCAqIDYwICogNjAgKiAxMDAwOyAvLyBGb3VyIGhvdXJzLCBsaWtlIGlPUyBhbmQgQW5kcm9pZC5cclxuLyoqXHJcbiAqIFRoZSBwZXJjZW50YWdlIG9mIGJhY2tvZmYgdGltZSB0byByYW5kb21pemUgYnkuXHJcbiAqIFNlZVxyXG4gKiBodHRwOi8vZ28vc2FmZS1jbGllbnQtYmVoYXZpb3Ijc3RlcC0xLWRldGVybWluZS10aGUtYXBwcm9wcmlhdGUtcmV0cnktaW50ZXJ2YWwtdG8taGFuZGxlLXNwaWtlLXRyYWZmaWNcclxuICogZm9yIGNvbnRleHQuXHJcbiAqXHJcbiAqIDxwPlZpc2libGUgZm9yIHRlc3RpbmdcclxuICovXHJcbmNvbnN0IFJBTkRPTV9GQUNUT1IgPSAwLjU7XHJcbi8qKlxyXG4gKiBCYXNlZCBvbiB0aGUgYmFja29mZiBtZXRob2QgZnJvbVxyXG4gKiBodHRwczovL2dpdGh1Yi5jb20vZ29vZ2xlL2Nsb3N1cmUtbGlicmFyeS9ibG9iL21hc3Rlci9jbG9zdXJlL2dvb2cvbWF0aC9leHBvbmVudGlhbGJhY2tvZmYuanMuXHJcbiAqIEV4dHJhY3RlZCBoZXJlIHNvIHdlIGRvbid0IG5lZWQgdG8gcGFzcyBtZXRhZGF0YSBhbmQgYSBzdGF0ZWZ1bCBFeHBvbmVudGlhbEJhY2tvZmYgb2JqZWN0IGFyb3VuZC5cclxuICovXHJcbmZ1bmN0aW9uIGNhbGN1bGF0ZUJhY2tvZmZNaWxsaXMoYmFja29mZkNvdW50LCBpbnRlcnZhbE1pbGxpcyA9IERFRkFVTFRfSU5URVJWQUxfTUlMTElTLCBiYWNrb2ZmRmFjdG9yID0gREVGQVVMVF9CQUNLT0ZGX0ZBQ1RPUikge1xyXG4gICAgLy8gQ2FsY3VsYXRlcyBhbiBleHBvbmVudGlhbGx5IGluY3JlYXNpbmcgdmFsdWUuXHJcbiAgICAvLyBEZXZpYXRpb246IGNhbGN1bGF0ZXMgdmFsdWUgZnJvbSBjb3VudCBhbmQgYSBjb25zdGFudCBpbnRlcnZhbCwgc28gd2Ugb25seSBuZWVkIHRvIHNhdmUgdmFsdWVcclxuICAgIC8vIGFuZCBjb3VudCB0byByZXN0b3JlIHN0YXRlLlxyXG4gICAgY29uc3QgY3VyckJhc2VWYWx1ZSA9IGludGVydmFsTWlsbGlzICogTWF0aC5wb3coYmFja29mZkZhY3RvciwgYmFja29mZkNvdW50KTtcclxuICAgIC8vIEEgcmFuZG9tIFwiZnV6elwiIHRvIGF2b2lkIHdhdmVzIG9mIHJldHJpZXMuXHJcbiAgICAvLyBEZXZpYXRpb246IHJhbmRvbUZhY3RvciBpcyByZXF1aXJlZC5cclxuICAgIGNvbnN0IHJhbmRvbVdhaXQgPSBNYXRoLnJvdW5kKFxyXG4gICAgLy8gQSBmcmFjdGlvbiBvZiB0aGUgYmFja29mZiB2YWx1ZSB0byBhZGQvc3VidHJhY3QuXHJcbiAgICAvLyBEZXZpYXRpb246IGNoYW5nZXMgbXVsdGlwbGljYXRpb24gb3JkZXIgdG8gaW1wcm92ZSByZWFkYWJpbGl0eS5cclxuICAgIFJBTkRPTV9GQUNUT1IgKlxyXG4gICAgICAgIGN1cnJCYXNlVmFsdWUgKlxyXG4gICAgICAgIC8vIEEgcmFuZG9tIGZsb2F0IChyb3VuZGVkIHRvIGludCBieSBNYXRoLnJvdW5kIGFib3ZlKSBpbiB0aGUgcmFuZ2UgWy0xLCAxXS4gRGV0ZXJtaW5lc1xyXG4gICAgICAgIC8vIGlmIHdlIGFkZCBvciBzdWJ0cmFjdC5cclxuICAgICAgICAoTWF0aC5yYW5kb20oKSAtIDAuNSkgKlxyXG4gICAgICAgIDIpO1xyXG4gICAgLy8gTGltaXRzIGJhY2tvZmYgdG8gbWF4IHRvIGF2b2lkIGVmZmVjdGl2ZWx5IHBlcm1hbmVudCBiYWNrb2ZmLlxyXG4gICAgcmV0dXJuIE1hdGgubWluKE1BWF9WQUxVRV9NSUxMSVMsIGN1cnJCYXNlVmFsdWUgKyByYW5kb21XYWl0KTtcclxufVxuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMjAgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG4vKipcclxuICogUHJvdmlkZSBFbmdsaXNoIG9yZGluYWwgbGV0dGVycyBhZnRlciBhIG51bWJlclxyXG4gKi9cclxuZnVuY3Rpb24gb3JkaW5hbChpKSB7XHJcbiAgICBpZiAoIU51bWJlci5pc0Zpbml0ZShpKSkge1xyXG4gICAgICAgIHJldHVybiBgJHtpfWA7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gaSArIGluZGljYXRvcihpKTtcclxufVxyXG5mdW5jdGlvbiBpbmRpY2F0b3IoaSkge1xyXG4gICAgaSA9IE1hdGguYWJzKGkpO1xyXG4gICAgY29uc3QgY2VudCA9IGkgJSAxMDA7XHJcbiAgICBpZiAoY2VudCA+PSAxMCAmJiBjZW50IDw9IDIwKSB7XHJcbiAgICAgICAgcmV0dXJuICd0aCc7XHJcbiAgICB9XHJcbiAgICBjb25zdCBkZWMgPSBpICUgMTA7XHJcbiAgICBpZiAoZGVjID09PSAxKSB7XHJcbiAgICAgICAgcmV0dXJuICdzdCc7XHJcbiAgICB9XHJcbiAgICBpZiAoZGVjID09PSAyKSB7XHJcbiAgICAgICAgcmV0dXJuICduZCc7XHJcbiAgICB9XHJcbiAgICBpZiAoZGVjID09PSAzKSB7XHJcbiAgICAgICAgcmV0dXJuICdyZCc7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gJ3RoJztcclxufVxuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMjEgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRNb2R1bGFySW5zdGFuY2Uoc2VydmljZSkge1xyXG4gICAgaWYgKHNlcnZpY2UgJiYgc2VydmljZS5fZGVsZWdhdGUpIHtcclxuICAgICAgICByZXR1cm4gc2VydmljZS5fZGVsZWdhdGU7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICByZXR1cm4gc2VydmljZTtcclxuICAgIH1cclxufVxuXG5leHBvcnQgeyBDT05TVEFOVFMsIERlY29kZUJhc2U2NFN0cmluZ0Vycm9yLCBEZWZlcnJlZCwgRXJyb3JGYWN0b3J5LCBGaXJlYmFzZUVycm9yLCBNQVhfVkFMVUVfTUlMTElTLCBSQU5ET01fRkFDVE9SLCBTaGExLCBhcmVDb29raWVzRW5hYmxlZCwgYXNzZXJ0LCBhc3NlcnRpb25FcnJvciwgYXN5bmMsIGJhc2U2NCwgYmFzZTY0RGVjb2RlLCBiYXNlNjRFbmNvZGUsIGJhc2U2NHVybEVuY29kZVdpdGhvdXRQYWRkaW5nLCBjYWxjdWxhdGVCYWNrb2ZmTWlsbGlzLCBjb250YWlucywgY3JlYXRlTW9ja1VzZXJUb2tlbiwgY3JlYXRlU3Vic2NyaWJlLCBkZWNvZGUsIGRlZXBDb3B5LCBkZWVwRXF1YWwsIGRlZXBFeHRlbmQsIGVycm9yUHJlZml4LCBleHRyYWN0UXVlcnlzdHJpbmcsIGdldERlZmF1bHRBcHBDb25maWcsIGdldERlZmF1bHRFbXVsYXRvckhvc3QsIGdldERlZmF1bHRFbXVsYXRvckhvc3RuYW1lQW5kUG9ydCwgZ2V0RGVmYXVsdHMsIGdldEV4cGVyaW1lbnRhbFNldHRpbmcsIGdldEdsb2JhbCwgZ2V0TW9kdWxhckluc3RhbmNlLCBnZXRVQSwgaXNBZG1pbiwgaXNCcm93c2VyLCBpc0Jyb3dzZXJFeHRlbnNpb24sIGlzRWxlY3Ryb24sIGlzRW1wdHksIGlzSUUsIGlzSW5kZXhlZERCQXZhaWxhYmxlLCBpc01vYmlsZUNvcmRvdmEsIGlzTm9kZSwgaXNOb2RlU2RrLCBpc1JlYWN0TmF0aXZlLCBpc1NhZmFyaSwgaXNVV1AsIGlzVmFsaWRGb3JtYXQsIGlzVmFsaWRUaW1lc3RhbXAsIGlzV2ViV29ya2VyLCBpc3N1ZWRBdFRpbWUsIGpzb25FdmFsLCBtYXAsIG9yZGluYWwsIHByb21pc2VXaXRoVGltZW91dCwgcXVlcnlzdHJpbmcsIHF1ZXJ5c3RyaW5nRGVjb2RlLCBzYWZlR2V0LCBzdHJpbmdMZW5ndGgsIHN0cmluZ1RvQnl0ZUFycmF5LCBzdHJpbmdpZnksIHV1aWR2NCwgdmFsaWRhdGVBcmdDb3VudCwgdmFsaWRhdGVDYWxsYmFjaywgdmFsaWRhdGVDb250ZXh0T2JqZWN0LCB2YWxpZGF0ZUluZGV4ZWREQk9wZW5hYmxlLCB2YWxpZGF0ZU5hbWVzcGFjZSB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguZXNtMjAxNy5qcy5tYXBcbiIsCiAgICAiaW1wb3J0IHsgRGVmZXJyZWQgfSBmcm9tICdAZmlyZWJhc2UvdXRpbCc7XG5cbi8qKlxyXG4gKiBDb21wb25lbnQgZm9yIHNlcnZpY2UgbmFtZSBULCBlLmcuIGBhdXRoYCwgYGF1dGgtaW50ZXJuYWxgXHJcbiAqL1xyXG5jbGFzcyBDb21wb25lbnQge1xyXG4gICAgLyoqXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIG5hbWUgVGhlIHB1YmxpYyBzZXJ2aWNlIG5hbWUsIGUuZy4gYXBwLCBhdXRoLCBmaXJlc3RvcmUsIGRhdGFiYXNlXHJcbiAgICAgKiBAcGFyYW0gaW5zdGFuY2VGYWN0b3J5IFNlcnZpY2UgZmFjdG9yeSByZXNwb25zaWJsZSBmb3IgY3JlYXRpbmcgdGhlIHB1YmxpYyBpbnRlcmZhY2VcclxuICAgICAqIEBwYXJhbSB0eXBlIHdoZXRoZXIgdGhlIHNlcnZpY2UgcHJvdmlkZWQgYnkgdGhlIGNvbXBvbmVudCBpcyBwdWJsaWMgb3IgcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcihuYW1lLCBpbnN0YW5jZUZhY3RvcnksIHR5cGUpIHtcclxuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xyXG4gICAgICAgIHRoaXMuaW5zdGFuY2VGYWN0b3J5ID0gaW5zdGFuY2VGYWN0b3J5O1xyXG4gICAgICAgIHRoaXMudHlwZSA9IHR5cGU7XHJcbiAgICAgICAgdGhpcy5tdWx0aXBsZUluc3RhbmNlcyA9IGZhbHNlO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFByb3BlcnRpZXMgdG8gYmUgYWRkZWQgdG8gdGhlIHNlcnZpY2UgbmFtZXNwYWNlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5zZXJ2aWNlUHJvcHMgPSB7fTtcclxuICAgICAgICB0aGlzLmluc3RhbnRpYXRpb25Nb2RlID0gXCJMQVpZXCIgLyogSW5zdGFudGlhdGlvbk1vZGUuTEFaWSAqLztcclxuICAgICAgICB0aGlzLm9uSW5zdGFuY2VDcmVhdGVkID0gbnVsbDtcclxuICAgIH1cclxuICAgIHNldEluc3RhbnRpYXRpb25Nb2RlKG1vZGUpIHtcclxuICAgICAgICB0aGlzLmluc3RhbnRpYXRpb25Nb2RlID0gbW9kZTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIHNldE11bHRpcGxlSW5zdGFuY2VzKG11bHRpcGxlSW5zdGFuY2VzKSB7XHJcbiAgICAgICAgdGhpcy5tdWx0aXBsZUluc3RhbmNlcyA9IG11bHRpcGxlSW5zdGFuY2VzO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgc2V0U2VydmljZVByb3BzKHByb3BzKSB7XHJcbiAgICAgICAgdGhpcy5zZXJ2aWNlUHJvcHMgPSBwcm9wcztcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIHNldEluc3RhbmNlQ3JlYXRlZENhbGxiYWNrKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgdGhpcy5vbkluc3RhbmNlQ3JlYXRlZCA9IGNhbGxiYWNrO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG59XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAxOSBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbmNvbnN0IERFRkFVTFRfRU5UUllfTkFNRSA9ICdbREVGQVVMVF0nO1xuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMTkgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG4vKipcclxuICogUHJvdmlkZXIgZm9yIGluc3RhbmNlIGZvciBzZXJ2aWNlIG5hbWUgVCwgZS5nLiAnYXV0aCcsICdhdXRoLWludGVybmFsJ1xyXG4gKiBOYW1lU2VydmljZU1hcHBpbmdbVF0gaXMgYW4gYWxpYXMgZm9yIHRoZSB0eXBlIG9mIHRoZSBpbnN0YW5jZVxyXG4gKi9cclxuY2xhc3MgUHJvdmlkZXIge1xyXG4gICAgY29uc3RydWN0b3IobmFtZSwgY29udGFpbmVyKSB7XHJcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lciA9IGNvbnRhaW5lcjtcclxuICAgICAgICB0aGlzLmNvbXBvbmVudCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5pbnN0YW5jZXMgPSBuZXcgTWFwKCk7XHJcbiAgICAgICAgdGhpcy5pbnN0YW5jZXNEZWZlcnJlZCA9IG5ldyBNYXAoKTtcclxuICAgICAgICB0aGlzLmluc3RhbmNlc09wdGlvbnMgPSBuZXcgTWFwKCk7XHJcbiAgICAgICAgdGhpcy5vbkluaXRDYWxsYmFja3MgPSBuZXcgTWFwKCk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSBpZGVudGlmaWVyIEEgcHJvdmlkZXIgY2FuIHByb3ZpZGUgbXVsaXRwbGUgaW5zdGFuY2VzIG9mIGEgc2VydmljZVxyXG4gICAgICogaWYgdGhpcy5jb21wb25lbnQubXVsdGlwbGVJbnN0YW5jZXMgaXMgdHJ1ZS5cclxuICAgICAqL1xyXG4gICAgZ2V0KGlkZW50aWZpZXIpIHtcclxuICAgICAgICAvLyBpZiBtdWx0aXBsZUluc3RhbmNlcyBpcyBub3Qgc3VwcG9ydGVkLCB1c2UgdGhlIGRlZmF1bHQgbmFtZVxyXG4gICAgICAgIGNvbnN0IG5vcm1hbGl6ZWRJZGVudGlmaWVyID0gdGhpcy5ub3JtYWxpemVJbnN0YW5jZUlkZW50aWZpZXIoaWRlbnRpZmllcik7XHJcbiAgICAgICAgaWYgKCF0aGlzLmluc3RhbmNlc0RlZmVycmVkLmhhcyhub3JtYWxpemVkSWRlbnRpZmllcikpIHtcclxuICAgICAgICAgICAgY29uc3QgZGVmZXJyZWQgPSBuZXcgRGVmZXJyZWQoKTtcclxuICAgICAgICAgICAgdGhpcy5pbnN0YW5jZXNEZWZlcnJlZC5zZXQobm9ybWFsaXplZElkZW50aWZpZXIsIGRlZmVycmVkKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaXNJbml0aWFsaXplZChub3JtYWxpemVkSWRlbnRpZmllcikgfHxcclxuICAgICAgICAgICAgICAgIHRoaXMuc2hvdWxkQXV0b0luaXRpYWxpemUoKSkge1xyXG4gICAgICAgICAgICAgICAgLy8gaW5pdGlhbGl6ZSB0aGUgc2VydmljZSBpZiBpdCBjYW4gYmUgYXV0by1pbml0aWFsaXplZFxyXG4gICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBpbnN0YW5jZSA9IHRoaXMuZ2V0T3JJbml0aWFsaXplU2VydmljZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGluc3RhbmNlSWRlbnRpZmllcjogbm9ybWFsaXplZElkZW50aWZpZXJcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaW5zdGFuY2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShpbnN0YW5jZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyB3aGVuIHRoZSBpbnN0YW5jZSBmYWN0b3J5IHRocm93cyBhbiBleGNlcHRpb24gZHVyaW5nIGdldCgpLCBpdCBzaG91bGQgbm90IGNhdXNlXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gYSBmYXRhbCBlcnJvci4gV2UganVzdCByZXR1cm4gdGhlIHVucmVzb2x2ZWQgcHJvbWlzZSBpbiB0aGlzIGNhc2UuXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5zdGFuY2VzRGVmZXJyZWQuZ2V0KG5vcm1hbGl6ZWRJZGVudGlmaWVyKS5wcm9taXNlO1xyXG4gICAgfVxyXG4gICAgZ2V0SW1tZWRpYXRlKG9wdGlvbnMpIHtcclxuICAgICAgICB2YXIgX2E7XHJcbiAgICAgICAgLy8gaWYgbXVsdGlwbGVJbnN0YW5jZXMgaXMgbm90IHN1cHBvcnRlZCwgdXNlIHRoZSBkZWZhdWx0IG5hbWVcclxuICAgICAgICBjb25zdCBub3JtYWxpemVkSWRlbnRpZmllciA9IHRoaXMubm9ybWFsaXplSW5zdGFuY2VJZGVudGlmaWVyKG9wdGlvbnMgPT09IG51bGwgfHwgb3B0aW9ucyA9PT0gdm9pZCAwID8gdm9pZCAwIDogb3B0aW9ucy5pZGVudGlmaWVyKTtcclxuICAgICAgICBjb25zdCBvcHRpb25hbCA9IChfYSA9IG9wdGlvbnMgPT09IG51bGwgfHwgb3B0aW9ucyA9PT0gdm9pZCAwID8gdm9pZCAwIDogb3B0aW9ucy5vcHRpb25hbCkgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogZmFsc2U7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNJbml0aWFsaXplZChub3JtYWxpemVkSWRlbnRpZmllcikgfHxcclxuICAgICAgICAgICAgdGhpcy5zaG91bGRBdXRvSW5pdGlhbGl6ZSgpKSB7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRPckluaXRpYWxpemVTZXJ2aWNlKHtcclxuICAgICAgICAgICAgICAgICAgICBpbnN0YW5jZUlkZW50aWZpZXI6IG5vcm1hbGl6ZWRJZGVudGlmaWVyXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKG9wdGlvbmFsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAvLyBJbiBjYXNlIGEgY29tcG9uZW50IGlzIG5vdCBpbml0aWFsaXplZCBhbmQgc2hvdWxkL2NhbiBub3QgYmUgYXV0by1pbml0aWFsaXplZCBhdCB0aGUgbW9tZW50LCByZXR1cm4gbnVsbCBpZiB0aGUgb3B0aW9uYWwgZmxhZyBpcyBzZXQsIG9yIHRocm93XHJcbiAgICAgICAgICAgIGlmIChvcHRpb25hbCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBFcnJvcihgU2VydmljZSAke3RoaXMubmFtZX0gaXMgbm90IGF2YWlsYWJsZWApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZ2V0Q29tcG9uZW50KCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbXBvbmVudDtcclxuICAgIH1cclxuICAgIHNldENvbXBvbmVudChjb21wb25lbnQpIHtcclxuICAgICAgICBpZiAoY29tcG9uZW50Lm5hbWUgIT09IHRoaXMubmFtZSkge1xyXG4gICAgICAgICAgICB0aHJvdyBFcnJvcihgTWlzbWF0Y2hpbmcgQ29tcG9uZW50ICR7Y29tcG9uZW50Lm5hbWV9IGZvciBQcm92aWRlciAke3RoaXMubmFtZX0uYCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLmNvbXBvbmVudCkge1xyXG4gICAgICAgICAgICB0aHJvdyBFcnJvcihgQ29tcG9uZW50IGZvciAke3RoaXMubmFtZX0gaGFzIGFscmVhZHkgYmVlbiBwcm92aWRlZGApO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmNvbXBvbmVudCA9IGNvbXBvbmVudDtcclxuICAgICAgICAvLyByZXR1cm4gZWFybHkgd2l0aG91dCBhdHRlbXB0aW5nIHRvIGluaXRpYWxpemUgdGhlIGNvbXBvbmVudCBpZiB0aGUgY29tcG9uZW50IHJlcXVpcmVzIGV4cGxpY2l0IGluaXRpYWxpemF0aW9uIChjYWxsaW5nIGBQcm92aWRlci5pbml0aWFsaXplKClgKVxyXG4gICAgICAgIGlmICghdGhpcy5zaG91bGRBdXRvSW5pdGlhbGl6ZSgpKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gaWYgdGhlIHNlcnZpY2UgaXMgZWFnZXIsIGluaXRpYWxpemUgdGhlIGRlZmF1bHQgaW5zdGFuY2VcclxuICAgICAgICBpZiAoaXNDb21wb25lbnRFYWdlcihjb21wb25lbnQpKSB7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdldE9ySW5pdGlhbGl6ZVNlcnZpY2UoeyBpbnN0YW5jZUlkZW50aWZpZXI6IERFRkFVTFRfRU5UUllfTkFNRSB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgLy8gd2hlbiB0aGUgaW5zdGFuY2UgZmFjdG9yeSBmb3IgYW4gZWFnZXIgQ29tcG9uZW50IHRocm93cyBhbiBleGNlcHRpb24gZHVyaW5nIHRoZSBlYWdlclxyXG4gICAgICAgICAgICAgICAgLy8gaW5pdGlhbGl6YXRpb24sIGl0IHNob3VsZCBub3QgY2F1c2UgYSBmYXRhbCBlcnJvci5cclxuICAgICAgICAgICAgICAgIC8vIFRPRE86IEludmVzdGlnYXRlIGlmIHdlIG5lZWQgdG8gbWFrZSBpdCBjb25maWd1cmFibGUsIGJlY2F1c2Ugc29tZSBjb21wb25lbnQgbWF5IHdhbnQgdG8gY2F1c2VcclxuICAgICAgICAgICAgICAgIC8vIGEgZmF0YWwgZXJyb3IgaW4gdGhpcyBjYXNlP1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIENyZWF0ZSBzZXJ2aWNlIGluc3RhbmNlcyBmb3IgdGhlIHBlbmRpbmcgcHJvbWlzZXMgYW5kIHJlc29sdmUgdGhlbVxyXG4gICAgICAgIC8vIE5PVEU6IGlmIHRoaXMubXVsdGlwbGVJbnN0YW5jZXMgaXMgZmFsc2UsIG9ubHkgdGhlIGRlZmF1bHQgaW5zdGFuY2Ugd2lsbCBiZSBjcmVhdGVkXHJcbiAgICAgICAgLy8gYW5kIGFsbCBwcm9taXNlcyB3aXRoIHJlc29sdmUgd2l0aCBpdCByZWdhcmRsZXNzIG9mIHRoZSBpZGVudGlmaWVyLlxyXG4gICAgICAgIGZvciAoY29uc3QgW2luc3RhbmNlSWRlbnRpZmllciwgaW5zdGFuY2VEZWZlcnJlZF0gb2YgdGhpcy5pbnN0YW5jZXNEZWZlcnJlZC5lbnRyaWVzKCkpIHtcclxuICAgICAgICAgICAgY29uc3Qgbm9ybWFsaXplZElkZW50aWZpZXIgPSB0aGlzLm5vcm1hbGl6ZUluc3RhbmNlSWRlbnRpZmllcihpbnN0YW5jZUlkZW50aWZpZXIpO1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgLy8gYGdldE9ySW5pdGlhbGl6ZVNlcnZpY2UoKWAgc2hvdWxkIGFsd2F5cyByZXR1cm4gYSB2YWxpZCBpbnN0YW5jZSBzaW5jZSBhIGNvbXBvbmVudCBpcyBndWFyYW50ZWVkLiB1c2UgISB0byBtYWtlIHR5cGVzY3JpcHQgaGFwcHkuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBpbnN0YW5jZSA9IHRoaXMuZ2V0T3JJbml0aWFsaXplU2VydmljZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5zdGFuY2VJZGVudGlmaWVyOiBub3JtYWxpemVkSWRlbnRpZmllclxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBpbnN0YW5jZURlZmVycmVkLnJlc29sdmUoaW5zdGFuY2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICAvLyB3aGVuIHRoZSBpbnN0YW5jZSBmYWN0b3J5IHRocm93cyBhbiBleGNlcHRpb24sIGl0IHNob3VsZCBub3QgY2F1c2VcclxuICAgICAgICAgICAgICAgIC8vIGEgZmF0YWwgZXJyb3IuIFdlIGp1c3QgbGVhdmUgdGhlIHByb21pc2UgdW5yZXNvbHZlZC5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGNsZWFySW5zdGFuY2UoaWRlbnRpZmllciA9IERFRkFVTFRfRU5UUllfTkFNRSkge1xyXG4gICAgICAgIHRoaXMuaW5zdGFuY2VzRGVmZXJyZWQuZGVsZXRlKGlkZW50aWZpZXIpO1xyXG4gICAgICAgIHRoaXMuaW5zdGFuY2VzT3B0aW9ucy5kZWxldGUoaWRlbnRpZmllcik7XHJcbiAgICAgICAgdGhpcy5pbnN0YW5jZXMuZGVsZXRlKGlkZW50aWZpZXIpO1xyXG4gICAgfVxyXG4gICAgLy8gYXBwLmRlbGV0ZSgpIHdpbGwgY2FsbCB0aGlzIG1ldGhvZCBvbiBldmVyeSBwcm92aWRlciB0byBkZWxldGUgdGhlIHNlcnZpY2VzXHJcbiAgICAvLyBUT0RPOiBzaG91bGQgd2UgbWFyayB0aGUgcHJvdmlkZXIgYXMgZGVsZXRlZD9cclxuICAgIGFzeW5jIGRlbGV0ZSgpIHtcclxuICAgICAgICBjb25zdCBzZXJ2aWNlcyA9IEFycmF5LmZyb20odGhpcy5pbnN0YW5jZXMudmFsdWVzKCkpO1xyXG4gICAgICAgIGF3YWl0IFByb21pc2UuYWxsKFtcclxuICAgICAgICAgICAgLi4uc2VydmljZXNcclxuICAgICAgICAgICAgICAgIC5maWx0ZXIoc2VydmljZSA9PiAnSU5URVJOQUwnIGluIHNlcnZpY2UpIC8vIGxlZ2FjeSBzZXJ2aWNlc1xyXG4gICAgICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnlcclxuICAgICAgICAgICAgICAgIC5tYXAoc2VydmljZSA9PiBzZXJ2aWNlLklOVEVSTkFMLmRlbGV0ZSgpKSxcclxuICAgICAgICAgICAgLi4uc2VydmljZXNcclxuICAgICAgICAgICAgICAgIC5maWx0ZXIoc2VydmljZSA9PiAnX2RlbGV0ZScgaW4gc2VydmljZSkgLy8gbW9kdWxhcml6ZWQgc2VydmljZXNcclxuICAgICAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55XHJcbiAgICAgICAgICAgICAgICAubWFwKHNlcnZpY2UgPT4gc2VydmljZS5fZGVsZXRlKCkpXHJcbiAgICAgICAgXSk7XHJcbiAgICB9XHJcbiAgICBpc0NvbXBvbmVudFNldCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jb21wb25lbnQgIT0gbnVsbDtcclxuICAgIH1cclxuICAgIGlzSW5pdGlhbGl6ZWQoaWRlbnRpZmllciA9IERFRkFVTFRfRU5UUllfTkFNRSkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmluc3RhbmNlcy5oYXMoaWRlbnRpZmllcik7XHJcbiAgICB9XHJcbiAgICBnZXRPcHRpb25zKGlkZW50aWZpZXIgPSBERUZBVUxUX0VOVFJZX05BTUUpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5pbnN0YW5jZXNPcHRpb25zLmdldChpZGVudGlmaWVyKSB8fCB7fTtcclxuICAgIH1cclxuICAgIGluaXRpYWxpemUob3B0cyA9IHt9KSB7XHJcbiAgICAgICAgY29uc3QgeyBvcHRpb25zID0ge30gfSA9IG9wdHM7XHJcbiAgICAgICAgY29uc3Qgbm9ybWFsaXplZElkZW50aWZpZXIgPSB0aGlzLm5vcm1hbGl6ZUluc3RhbmNlSWRlbnRpZmllcihvcHRzLmluc3RhbmNlSWRlbnRpZmllcik7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNJbml0aWFsaXplZChub3JtYWxpemVkSWRlbnRpZmllcikpIHtcclxuICAgICAgICAgICAgdGhyb3cgRXJyb3IoYCR7dGhpcy5uYW1lfSgke25vcm1hbGl6ZWRJZGVudGlmaWVyfSkgaGFzIGFscmVhZHkgYmVlbiBpbml0aWFsaXplZGApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIXRoaXMuaXNDb21wb25lbnRTZXQoKSkge1xyXG4gICAgICAgICAgICB0aHJvdyBFcnJvcihgQ29tcG9uZW50ICR7dGhpcy5uYW1lfSBoYXMgbm90IGJlZW4gcmVnaXN0ZXJlZCB5ZXRgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgaW5zdGFuY2UgPSB0aGlzLmdldE9ySW5pdGlhbGl6ZVNlcnZpY2Uoe1xyXG4gICAgICAgICAgICBpbnN0YW5jZUlkZW50aWZpZXI6IG5vcm1hbGl6ZWRJZGVudGlmaWVyLFxyXG4gICAgICAgICAgICBvcHRpb25zXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgLy8gcmVzb2x2ZSBhbnkgcGVuZGluZyBwcm9taXNlIHdhaXRpbmcgZm9yIHRoZSBzZXJ2aWNlIGluc3RhbmNlXHJcbiAgICAgICAgZm9yIChjb25zdCBbaW5zdGFuY2VJZGVudGlmaWVyLCBpbnN0YW5jZURlZmVycmVkXSBvZiB0aGlzLmluc3RhbmNlc0RlZmVycmVkLmVudHJpZXMoKSkge1xyXG4gICAgICAgICAgICBjb25zdCBub3JtYWxpemVkRGVmZXJyZWRJZGVudGlmaWVyID0gdGhpcy5ub3JtYWxpemVJbnN0YW5jZUlkZW50aWZpZXIoaW5zdGFuY2VJZGVudGlmaWVyKTtcclxuICAgICAgICAgICAgaWYgKG5vcm1hbGl6ZWRJZGVudGlmaWVyID09PSBub3JtYWxpemVkRGVmZXJyZWRJZGVudGlmaWVyKSB7XHJcbiAgICAgICAgICAgICAgICBpbnN0YW5jZURlZmVycmVkLnJlc29sdmUoaW5zdGFuY2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBpbnN0YW5jZTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBjYWxsYmFjayAtIGEgZnVuY3Rpb24gdGhhdCB3aWxsIGJlIGludm9rZWQgIGFmdGVyIHRoZSBwcm92aWRlciBoYXMgYmVlbiBpbml0aWFsaXplZCBieSBjYWxsaW5nIHByb3ZpZGVyLmluaXRpYWxpemUoKS5cclxuICAgICAqIFRoZSBmdW5jdGlvbiBpcyBpbnZva2VkIFNZTkNIUk9OT1VTTFksIHNvIGl0IHNob3VsZCBub3QgZXhlY3V0ZSBhbnkgbG9uZ3J1bm5pbmcgdGFza3MgaW4gb3JkZXIgdG8gbm90IGJsb2NrIHRoZSBwcm9ncmFtLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBpZGVudGlmaWVyIEFuIG9wdGlvbmFsIGluc3RhbmNlIGlkZW50aWZpZXJcclxuICAgICAqIEByZXR1cm5zIGEgZnVuY3Rpb24gdG8gdW5yZWdpc3RlciB0aGUgY2FsbGJhY2tcclxuICAgICAqL1xyXG4gICAgb25Jbml0KGNhbGxiYWNrLCBpZGVudGlmaWVyKSB7XHJcbiAgICAgICAgdmFyIF9hO1xyXG4gICAgICAgIGNvbnN0IG5vcm1hbGl6ZWRJZGVudGlmaWVyID0gdGhpcy5ub3JtYWxpemVJbnN0YW5jZUlkZW50aWZpZXIoaWRlbnRpZmllcik7XHJcbiAgICAgICAgY29uc3QgZXhpc3RpbmdDYWxsYmFja3MgPSAoX2EgPSB0aGlzLm9uSW5pdENhbGxiYWNrcy5nZXQobm9ybWFsaXplZElkZW50aWZpZXIpKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiBuZXcgU2V0KCk7XHJcbiAgICAgICAgZXhpc3RpbmdDYWxsYmFja3MuYWRkKGNhbGxiYWNrKTtcclxuICAgICAgICB0aGlzLm9uSW5pdENhbGxiYWNrcy5zZXQobm9ybWFsaXplZElkZW50aWZpZXIsIGV4aXN0aW5nQ2FsbGJhY2tzKTtcclxuICAgICAgICBjb25zdCBleGlzdGluZ0luc3RhbmNlID0gdGhpcy5pbnN0YW5jZXMuZ2V0KG5vcm1hbGl6ZWRJZGVudGlmaWVyKTtcclxuICAgICAgICBpZiAoZXhpc3RpbmdJbnN0YW5jZSkge1xyXG4gICAgICAgICAgICBjYWxsYmFjayhleGlzdGluZ0luc3RhbmNlLCBub3JtYWxpemVkSWRlbnRpZmllcik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiAoKSA9PiB7XHJcbiAgICAgICAgICAgIGV4aXN0aW5nQ2FsbGJhY2tzLmRlbGV0ZShjYWxsYmFjayk7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogSW52b2tlIG9uSW5pdCBjYWxsYmFja3Mgc3luY2hyb25vdXNseVxyXG4gICAgICogQHBhcmFtIGluc3RhbmNlIHRoZSBzZXJ2aWNlIGluc3RhbmNlYFxyXG4gICAgICovXHJcbiAgICBpbnZva2VPbkluaXRDYWxsYmFja3MoaW5zdGFuY2UsIGlkZW50aWZpZXIpIHtcclxuICAgICAgICBjb25zdCBjYWxsYmFja3MgPSB0aGlzLm9uSW5pdENhbGxiYWNrcy5nZXQoaWRlbnRpZmllcik7XHJcbiAgICAgICAgaWYgKCFjYWxsYmFja3MpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKGNvbnN0IGNhbGxiYWNrIG9mIGNhbGxiYWNrcykge1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2soaW5zdGFuY2UsIGlkZW50aWZpZXIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhdGNoIChfYSkge1xyXG4gICAgICAgICAgICAgICAgLy8gaWdub3JlIGVycm9ycyBpbiB0aGUgb25Jbml0IGNhbGxiYWNrXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBnZXRPckluaXRpYWxpemVTZXJ2aWNlKHsgaW5zdGFuY2VJZGVudGlmaWVyLCBvcHRpb25zID0ge30gfSkge1xyXG4gICAgICAgIGxldCBpbnN0YW5jZSA9IHRoaXMuaW5zdGFuY2VzLmdldChpbnN0YW5jZUlkZW50aWZpZXIpO1xyXG4gICAgICAgIGlmICghaW5zdGFuY2UgJiYgdGhpcy5jb21wb25lbnQpIHtcclxuICAgICAgICAgICAgaW5zdGFuY2UgPSB0aGlzLmNvbXBvbmVudC5pbnN0YW5jZUZhY3RvcnkodGhpcy5jb250YWluZXIsIHtcclxuICAgICAgICAgICAgICAgIGluc3RhbmNlSWRlbnRpZmllcjogbm9ybWFsaXplSWRlbnRpZmllckZvckZhY3RvcnkoaW5zdGFuY2VJZGVudGlmaWVyKSxcclxuICAgICAgICAgICAgICAgIG9wdGlvbnNcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHRoaXMuaW5zdGFuY2VzLnNldChpbnN0YW5jZUlkZW50aWZpZXIsIGluc3RhbmNlKTtcclxuICAgICAgICAgICAgdGhpcy5pbnN0YW5jZXNPcHRpb25zLnNldChpbnN0YW5jZUlkZW50aWZpZXIsIG9wdGlvbnMpO1xyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogSW52b2tlIG9uSW5pdCBsaXN0ZW5lcnMuXHJcbiAgICAgICAgICAgICAqIE5vdGUgdGhpcy5jb21wb25lbnQub25JbnN0YW5jZUNyZWF0ZWQgaXMgZGlmZmVyZW50LCB3aGljaCBpcyB1c2VkIGJ5IHRoZSBjb21wb25lbnQgY3JlYXRvcixcclxuICAgICAgICAgICAgICogd2hpbGUgb25Jbml0IGxpc3RlbmVycyBhcmUgcmVnaXN0ZXJlZCBieSBjb25zdW1lcnMgb2YgdGhlIHByb3ZpZGVyLlxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgdGhpcy5pbnZva2VPbkluaXRDYWxsYmFja3MoaW5zdGFuY2UsIGluc3RhbmNlSWRlbnRpZmllcik7XHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBPcmRlciBpcyBpbXBvcnRhbnRcclxuICAgICAgICAgICAgICogb25JbnN0YW5jZUNyZWF0ZWQoKSBzaG91bGQgYmUgY2FsbGVkIGFmdGVyIHRoaXMuaW5zdGFuY2VzLnNldChpbnN0YW5jZUlkZW50aWZpZXIsIGluc3RhbmNlKTsgd2hpY2hcclxuICAgICAgICAgICAgICogbWFrZXMgYGlzSW5pdGlhbGl6ZWQoKWAgcmV0dXJuIHRydWUuXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jb21wb25lbnQub25JbnN0YW5jZUNyZWF0ZWQpIHtcclxuICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb21wb25lbnQub25JbnN0YW5jZUNyZWF0ZWQodGhpcy5jb250YWluZXIsIGluc3RhbmNlSWRlbnRpZmllciwgaW5zdGFuY2UpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY2F0Y2ggKF9hKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gaWdub3JlIGVycm9ycyBpbiB0aGUgb25JbnN0YW5jZUNyZWF0ZWRDYWxsYmFja1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBpbnN0YW5jZSB8fCBudWxsO1xyXG4gICAgfVxyXG4gICAgbm9ybWFsaXplSW5zdGFuY2VJZGVudGlmaWVyKGlkZW50aWZpZXIgPSBERUZBVUxUX0VOVFJZX05BTUUpIHtcclxuICAgICAgICBpZiAodGhpcy5jb21wb25lbnQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29tcG9uZW50Lm11bHRpcGxlSW5zdGFuY2VzID8gaWRlbnRpZmllciA6IERFRkFVTFRfRU5UUllfTkFNRTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBpZGVudGlmaWVyOyAvLyBhc3N1bWUgbXVsdGlwbGUgaW5zdGFuY2VzIGFyZSBzdXBwb3J0ZWQgYmVmb3JlIHRoZSBjb21wb25lbnQgaXMgcHJvdmlkZWQuXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgc2hvdWxkQXV0b0luaXRpYWxpemUoKSB7XHJcbiAgICAgICAgcmV0dXJuICghIXRoaXMuY29tcG9uZW50ICYmXHJcbiAgICAgICAgICAgIHRoaXMuY29tcG9uZW50Lmluc3RhbnRpYXRpb25Nb2RlICE9PSBcIkVYUExJQ0lUXCIgLyogSW5zdGFudGlhdGlvbk1vZGUuRVhQTElDSVQgKi8pO1xyXG4gICAgfVxyXG59XHJcbi8vIHVuZGVmaW5lZCBzaG91bGQgYmUgcGFzc2VkIHRvIHRoZSBzZXJ2aWNlIGZhY3RvcnkgZm9yIHRoZSBkZWZhdWx0IGluc3RhbmNlXHJcbmZ1bmN0aW9uIG5vcm1hbGl6ZUlkZW50aWZpZXJGb3JGYWN0b3J5KGlkZW50aWZpZXIpIHtcclxuICAgIHJldHVybiBpZGVudGlmaWVyID09PSBERUZBVUxUX0VOVFJZX05BTUUgPyB1bmRlZmluZWQgOiBpZGVudGlmaWVyO1xyXG59XHJcbmZ1bmN0aW9uIGlzQ29tcG9uZW50RWFnZXIoY29tcG9uZW50KSB7XHJcbiAgICByZXR1cm4gY29tcG9uZW50Lmluc3RhbnRpYXRpb25Nb2RlID09PSBcIkVBR0VSXCIgLyogSW5zdGFudGlhdGlvbk1vZGUuRUFHRVIgKi87XHJcbn1cblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDE5IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuLyoqXHJcbiAqIENvbXBvbmVudENvbnRhaW5lciB0aGF0IHByb3ZpZGVzIFByb3ZpZGVycyBmb3Igc2VydmljZSBuYW1lIFQsIGUuZy4gYGF1dGhgLCBgYXV0aC1pbnRlcm5hbGBcclxuICovXHJcbmNsYXNzIENvbXBvbmVudENvbnRhaW5lciB7XHJcbiAgICBjb25zdHJ1Y3RvcihuYW1lKSB7XHJcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcclxuICAgICAgICB0aGlzLnByb3ZpZGVycyA9IG5ldyBNYXAoKTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBjb21wb25lbnQgQ29tcG9uZW50IGJlaW5nIGFkZGVkXHJcbiAgICAgKiBAcGFyYW0gb3ZlcndyaXRlIFdoZW4gYSBjb21wb25lbnQgd2l0aCB0aGUgc2FtZSBuYW1lIGhhcyBhbHJlYWR5IGJlZW4gcmVnaXN0ZXJlZCxcclxuICAgICAqIGlmIG92ZXJ3cml0ZSBpcyB0cnVlOiBvdmVyd3JpdGUgdGhlIGV4aXN0aW5nIGNvbXBvbmVudCB3aXRoIHRoZSBuZXcgY29tcG9uZW50IGFuZCBjcmVhdGUgYSBuZXdcclxuICAgICAqIHByb3ZpZGVyIHdpdGggdGhlIG5ldyBjb21wb25lbnQuIEl0IGNhbiBiZSB1c2VmdWwgaW4gdGVzdHMgd2hlcmUgeW91IHdhbnQgdG8gdXNlIGRpZmZlcmVudCBtb2Nrc1xyXG4gICAgICogZm9yIGRpZmZlcmVudCB0ZXN0cy5cclxuICAgICAqIGlmIG92ZXJ3cml0ZSBpcyBmYWxzZTogdGhyb3cgYW4gZXhjZXB0aW9uXHJcbiAgICAgKi9cclxuICAgIGFkZENvbXBvbmVudChjb21wb25lbnQpIHtcclxuICAgICAgICBjb25zdCBwcm92aWRlciA9IHRoaXMuZ2V0UHJvdmlkZXIoY29tcG9uZW50Lm5hbWUpO1xyXG4gICAgICAgIGlmIChwcm92aWRlci5pc0NvbXBvbmVudFNldCgpKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgQ29tcG9uZW50ICR7Y29tcG9uZW50Lm5hbWV9IGhhcyBhbHJlYWR5IGJlZW4gcmVnaXN0ZXJlZCB3aXRoICR7dGhpcy5uYW1lfWApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm92aWRlci5zZXRDb21wb25lbnQoY29tcG9uZW50KTtcclxuICAgIH1cclxuICAgIGFkZE9yT3ZlcndyaXRlQ29tcG9uZW50KGNvbXBvbmVudCkge1xyXG4gICAgICAgIGNvbnN0IHByb3ZpZGVyID0gdGhpcy5nZXRQcm92aWRlcihjb21wb25lbnQubmFtZSk7XHJcbiAgICAgICAgaWYgKHByb3ZpZGVyLmlzQ29tcG9uZW50U2V0KCkpIHtcclxuICAgICAgICAgICAgLy8gZGVsZXRlIHRoZSBleGlzdGluZyBwcm92aWRlciBmcm9tIHRoZSBjb250YWluZXIsIHNvIHdlIGNhbiByZWdpc3RlciB0aGUgbmV3IGNvbXBvbmVudFxyXG4gICAgICAgICAgICB0aGlzLnByb3ZpZGVycy5kZWxldGUoY29tcG9uZW50Lm5hbWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmFkZENvbXBvbmVudChjb21wb25lbnQpO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBnZXRQcm92aWRlciBwcm92aWRlcyBhIHR5cGUgc2FmZSBpbnRlcmZhY2Ugd2hlcmUgaXQgY2FuIG9ubHkgYmUgY2FsbGVkIHdpdGggYSBmaWVsZCBuYW1lXHJcbiAgICAgKiBwcmVzZW50IGluIE5hbWVTZXJ2aWNlTWFwcGluZyBpbnRlcmZhY2UuXHJcbiAgICAgKlxyXG4gICAgICogRmlyZWJhc2UgU0RLcyBwcm92aWRpbmcgc2VydmljZXMgc2hvdWxkIGV4dGVuZCBOYW1lU2VydmljZU1hcHBpbmcgaW50ZXJmYWNlIHRvIHJlZ2lzdGVyXHJcbiAgICAgKiB0aGVtc2VsdmVzLlxyXG4gICAgICovXHJcbiAgICBnZXRQcm92aWRlcihuYW1lKSB7XHJcbiAgICAgICAgaWYgKHRoaXMucHJvdmlkZXJzLmhhcyhuYW1lKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wcm92aWRlcnMuZ2V0KG5hbWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBjcmVhdGUgYSBQcm92aWRlciBmb3IgYSBzZXJ2aWNlIHRoYXQgaGFzbid0IHJlZ2lzdGVyZWQgd2l0aCBGaXJlYmFzZVxyXG4gICAgICAgIGNvbnN0IHByb3ZpZGVyID0gbmV3IFByb3ZpZGVyKG5hbWUsIHRoaXMpO1xyXG4gICAgICAgIHRoaXMucHJvdmlkZXJzLnNldChuYW1lLCBwcm92aWRlcik7XHJcbiAgICAgICAgcmV0dXJuIHByb3ZpZGVyO1xyXG4gICAgfVxyXG4gICAgZ2V0UHJvdmlkZXJzKCkge1xyXG4gICAgICAgIHJldHVybiBBcnJheS5mcm9tKHRoaXMucHJvdmlkZXJzLnZhbHVlcygpKTtcclxuICAgIH1cclxufVxuXG5leHBvcnQgeyBDb21wb25lbnQsIENvbXBvbmVudENvbnRhaW5lciwgUHJvdmlkZXIgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4LmVzbTIwMTcuanMubWFwXG4iLAogICAgIi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAxNyBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbi8qKlxyXG4gKiBBIGNvbnRhaW5lciBmb3IgYWxsIG9mIHRoZSBMb2dnZXIgaW5zdGFuY2VzXHJcbiAqL1xyXG5jb25zdCBpbnN0YW5jZXMgPSBbXTtcclxuLyoqXHJcbiAqIFRoZSBKUyBTREsgc3VwcG9ydHMgNSBsb2cgbGV2ZWxzIGFuZCBhbHNvIGFsbG93cyBhIHVzZXIgdGhlIGFiaWxpdHkgdG9cclxuICogc2lsZW5jZSB0aGUgbG9ncyBhbHRvZ2V0aGVyLlxyXG4gKlxyXG4gKiBUaGUgb3JkZXIgaXMgYSBmb2xsb3dzOlxyXG4gKiBERUJVRyA8IFZFUkJPU0UgPCBJTkZPIDwgV0FSTiA8IEVSUk9SXHJcbiAqXHJcbiAqIEFsbCBvZiB0aGUgbG9nIHR5cGVzIGFib3ZlIHRoZSBjdXJyZW50IGxvZyBsZXZlbCB3aWxsIGJlIGNhcHR1cmVkIChpLmUuIGlmXHJcbiAqIHlvdSBzZXQgdGhlIGxvZyBsZXZlbCB0byBgSU5GT2AsIGVycm9ycyB3aWxsIHN0aWxsIGJlIGxvZ2dlZCwgYnV0IGBERUJVR2AgYW5kXHJcbiAqIGBWRVJCT1NFYCBsb2dzIHdpbGwgbm90KVxyXG4gKi9cclxudmFyIExvZ0xldmVsO1xyXG4oZnVuY3Rpb24gKExvZ0xldmVsKSB7XHJcbiAgICBMb2dMZXZlbFtMb2dMZXZlbFtcIkRFQlVHXCJdID0gMF0gPSBcIkRFQlVHXCI7XHJcbiAgICBMb2dMZXZlbFtMb2dMZXZlbFtcIlZFUkJPU0VcIl0gPSAxXSA9IFwiVkVSQk9TRVwiO1xyXG4gICAgTG9nTGV2ZWxbTG9nTGV2ZWxbXCJJTkZPXCJdID0gMl0gPSBcIklORk9cIjtcclxuICAgIExvZ0xldmVsW0xvZ0xldmVsW1wiV0FSTlwiXSA9IDNdID0gXCJXQVJOXCI7XHJcbiAgICBMb2dMZXZlbFtMb2dMZXZlbFtcIkVSUk9SXCJdID0gNF0gPSBcIkVSUk9SXCI7XHJcbiAgICBMb2dMZXZlbFtMb2dMZXZlbFtcIlNJTEVOVFwiXSA9IDVdID0gXCJTSUxFTlRcIjtcclxufSkoTG9nTGV2ZWwgfHwgKExvZ0xldmVsID0ge30pKTtcclxuY29uc3QgbGV2ZWxTdHJpbmdUb0VudW0gPSB7XHJcbiAgICAnZGVidWcnOiBMb2dMZXZlbC5ERUJVRyxcclxuICAgICd2ZXJib3NlJzogTG9nTGV2ZWwuVkVSQk9TRSxcclxuICAgICdpbmZvJzogTG9nTGV2ZWwuSU5GTyxcclxuICAgICd3YXJuJzogTG9nTGV2ZWwuV0FSTixcclxuICAgICdlcnJvcic6IExvZ0xldmVsLkVSUk9SLFxyXG4gICAgJ3NpbGVudCc6IExvZ0xldmVsLlNJTEVOVFxyXG59O1xyXG4vKipcclxuICogVGhlIGRlZmF1bHQgbG9nIGxldmVsXHJcbiAqL1xyXG5jb25zdCBkZWZhdWx0TG9nTGV2ZWwgPSBMb2dMZXZlbC5JTkZPO1xyXG4vKipcclxuICogQnkgZGVmYXVsdCwgYGNvbnNvbGUuZGVidWdgIGlzIG5vdCBkaXNwbGF5ZWQgaW4gdGhlIGRldmVsb3BlciBjb25zb2xlIChpblxyXG4gKiBjaHJvbWUpLiBUbyBhdm9pZCBmb3JjaW5nIHVzZXJzIHRvIGhhdmUgdG8gb3B0LWluIHRvIHRoZXNlIGxvZ3MgdHdpY2VcclxuICogKGkuZS4gb25jZSBmb3IgZmlyZWJhc2UsIGFuZCBvbmNlIGluIHRoZSBjb25zb2xlKSwgd2UgYXJlIHNlbmRpbmcgYERFQlVHYFxyXG4gKiBsb2dzIHRvIHRoZSBgY29uc29sZS5sb2dgIGZ1bmN0aW9uLlxyXG4gKi9cclxuY29uc3QgQ29uc29sZU1ldGhvZCA9IHtcclxuICAgIFtMb2dMZXZlbC5ERUJVR106ICdsb2cnLFxyXG4gICAgW0xvZ0xldmVsLlZFUkJPU0VdOiAnbG9nJyxcclxuICAgIFtMb2dMZXZlbC5JTkZPXTogJ2luZm8nLFxyXG4gICAgW0xvZ0xldmVsLldBUk5dOiAnd2FybicsXHJcbiAgICBbTG9nTGV2ZWwuRVJST1JdOiAnZXJyb3InXHJcbn07XHJcbi8qKlxyXG4gKiBUaGUgZGVmYXVsdCBsb2cgaGFuZGxlciB3aWxsIGZvcndhcmQgREVCVUcsIFZFUkJPU0UsIElORk8sIFdBUk4sIGFuZCBFUlJPUlxyXG4gKiBtZXNzYWdlcyBvbiB0byB0aGVpciBjb3JyZXNwb25kaW5nIGNvbnNvbGUgY291bnRlcnBhcnRzIChpZiB0aGUgbG9nIG1ldGhvZFxyXG4gKiBpcyBzdXBwb3J0ZWQgYnkgdGhlIGN1cnJlbnQgbG9nIGxldmVsKVxyXG4gKi9cclxuY29uc3QgZGVmYXVsdExvZ0hhbmRsZXIgPSAoaW5zdGFuY2UsIGxvZ1R5cGUsIC4uLmFyZ3MpID0+IHtcclxuICAgIGlmIChsb2dUeXBlIDwgaW5zdGFuY2UubG9nTGV2ZWwpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBjb25zdCBub3cgPSBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCk7XHJcbiAgICBjb25zdCBtZXRob2QgPSBDb25zb2xlTWV0aG9kW2xvZ1R5cGVdO1xyXG4gICAgaWYgKG1ldGhvZCkge1xyXG4gICAgICAgIGNvbnNvbGVbbWV0aG9kXShgWyR7bm93fV0gICR7aW5zdGFuY2UubmFtZX06YCwgLi4uYXJncyk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEF0dGVtcHRlZCB0byBsb2cgYSBtZXNzYWdlIHdpdGggYW4gaW52YWxpZCBsb2dUeXBlICh2YWx1ZTogJHtsb2dUeXBlfSlgKTtcclxuICAgIH1cclxufTtcclxuY2xhc3MgTG9nZ2VyIHtcclxuICAgIC8qKlxyXG4gICAgICogR2l2ZXMgeW91IGFuIGluc3RhbmNlIG9mIGEgTG9nZ2VyIHRvIGNhcHR1cmUgbWVzc2FnZXMgYWNjb3JkaW5nIHRvXHJcbiAgICAgKiBGaXJlYmFzZSdzIGxvZ2dpbmcgc2NoZW1lLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBuYW1lIFRoZSBuYW1lIHRoYXQgdGhlIGxvZ3Mgd2lsbCBiZSBhc3NvY2lhdGVkIHdpdGhcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IobmFtZSkge1xyXG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogVGhlIGxvZyBsZXZlbCBvZiB0aGUgZ2l2ZW4gTG9nZ2VyIGluc3RhbmNlLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuX2xvZ0xldmVsID0gZGVmYXVsdExvZ0xldmVsO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFRoZSBtYWluIChpbnRlcm5hbCkgbG9nIGhhbmRsZXIgZm9yIHRoZSBMb2dnZXIgaW5zdGFuY2UuXHJcbiAgICAgICAgICogQ2FuIGJlIHNldCB0byBhIG5ldyBmdW5jdGlvbiBpbiBpbnRlcm5hbCBwYWNrYWdlIGNvZGUgYnV0IG5vdCBieSB1c2VyLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuX2xvZ0hhbmRsZXIgPSBkZWZhdWx0TG9nSGFuZGxlcjtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBUaGUgb3B0aW9uYWwsIGFkZGl0aW9uYWwsIHVzZXItZGVmaW5lZCBsb2cgaGFuZGxlciBmb3IgdGhlIExvZ2dlciBpbnN0YW5jZS5cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLl91c2VyTG9nSGFuZGxlciA9IG51bGw7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQ2FwdHVyZSB0aGUgY3VycmVudCBpbnN0YW5jZSBmb3IgbGF0ZXIgdXNlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgaW5zdGFuY2VzLnB1c2godGhpcyk7XHJcbiAgICB9XHJcbiAgICBnZXQgbG9nTGV2ZWwoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xvZ0xldmVsO1xyXG4gICAgfVxyXG4gICAgc2V0IGxvZ0xldmVsKHZhbCkge1xyXG4gICAgICAgIGlmICghKHZhbCBpbiBMb2dMZXZlbCkpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihgSW52YWxpZCB2YWx1ZSBcIiR7dmFsfVwiIGFzc2lnbmVkIHRvIFxcYGxvZ0xldmVsXFxgYCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX2xvZ0xldmVsID0gdmFsO1xyXG4gICAgfVxyXG4gICAgLy8gV29ya2Fyb3VuZCBmb3Igc2V0dGVyL2dldHRlciBoYXZpbmcgdG8gYmUgdGhlIHNhbWUgdHlwZS5cclxuICAgIHNldExvZ0xldmVsKHZhbCkge1xyXG4gICAgICAgIHRoaXMuX2xvZ0xldmVsID0gdHlwZW9mIHZhbCA9PT0gJ3N0cmluZycgPyBsZXZlbFN0cmluZ1RvRW51bVt2YWxdIDogdmFsO1xyXG4gICAgfVxyXG4gICAgZ2V0IGxvZ0hhbmRsZXIoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xvZ0hhbmRsZXI7XHJcbiAgICB9XHJcbiAgICBzZXQgbG9nSGFuZGxlcih2YWwpIHtcclxuICAgICAgICBpZiAodHlwZW9mIHZhbCAhPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdWYWx1ZSBhc3NpZ25lZCB0byBgbG9nSGFuZGxlcmAgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX2xvZ0hhbmRsZXIgPSB2YWw7XHJcbiAgICB9XHJcbiAgICBnZXQgdXNlckxvZ0hhbmRsZXIoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3VzZXJMb2dIYW5kbGVyO1xyXG4gICAgfVxyXG4gICAgc2V0IHVzZXJMb2dIYW5kbGVyKHZhbCkge1xyXG4gICAgICAgIHRoaXMuX3VzZXJMb2dIYW5kbGVyID0gdmFsO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBUaGUgZnVuY3Rpb25zIGJlbG93IGFyZSBhbGwgYmFzZWQgb24gdGhlIGBjb25zb2xlYCBpbnRlcmZhY2VcclxuICAgICAqL1xyXG4gICAgZGVidWcoLi4uYXJncykge1xyXG4gICAgICAgIHRoaXMuX3VzZXJMb2dIYW5kbGVyICYmIHRoaXMuX3VzZXJMb2dIYW5kbGVyKHRoaXMsIExvZ0xldmVsLkRFQlVHLCAuLi5hcmdzKTtcclxuICAgICAgICB0aGlzLl9sb2dIYW5kbGVyKHRoaXMsIExvZ0xldmVsLkRFQlVHLCAuLi5hcmdzKTtcclxuICAgIH1cclxuICAgIGxvZyguLi5hcmdzKSB7XHJcbiAgICAgICAgdGhpcy5fdXNlckxvZ0hhbmRsZXIgJiZcclxuICAgICAgICAgICAgdGhpcy5fdXNlckxvZ0hhbmRsZXIodGhpcywgTG9nTGV2ZWwuVkVSQk9TRSwgLi4uYXJncyk7XHJcbiAgICAgICAgdGhpcy5fbG9nSGFuZGxlcih0aGlzLCBMb2dMZXZlbC5WRVJCT1NFLCAuLi5hcmdzKTtcclxuICAgIH1cclxuICAgIGluZm8oLi4uYXJncykge1xyXG4gICAgICAgIHRoaXMuX3VzZXJMb2dIYW5kbGVyICYmIHRoaXMuX3VzZXJMb2dIYW5kbGVyKHRoaXMsIExvZ0xldmVsLklORk8sIC4uLmFyZ3MpO1xyXG4gICAgICAgIHRoaXMuX2xvZ0hhbmRsZXIodGhpcywgTG9nTGV2ZWwuSU5GTywgLi4uYXJncyk7XHJcbiAgICB9XHJcbiAgICB3YXJuKC4uLmFyZ3MpIHtcclxuICAgICAgICB0aGlzLl91c2VyTG9nSGFuZGxlciAmJiB0aGlzLl91c2VyTG9nSGFuZGxlcih0aGlzLCBMb2dMZXZlbC5XQVJOLCAuLi5hcmdzKTtcclxuICAgICAgICB0aGlzLl9sb2dIYW5kbGVyKHRoaXMsIExvZ0xldmVsLldBUk4sIC4uLmFyZ3MpO1xyXG4gICAgfVxyXG4gICAgZXJyb3IoLi4uYXJncykge1xyXG4gICAgICAgIHRoaXMuX3VzZXJMb2dIYW5kbGVyICYmIHRoaXMuX3VzZXJMb2dIYW5kbGVyKHRoaXMsIExvZ0xldmVsLkVSUk9SLCAuLi5hcmdzKTtcclxuICAgICAgICB0aGlzLl9sb2dIYW5kbGVyKHRoaXMsIExvZ0xldmVsLkVSUk9SLCAuLi5hcmdzKTtcclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiBzZXRMb2dMZXZlbChsZXZlbCkge1xyXG4gICAgaW5zdGFuY2VzLmZvckVhY2goaW5zdCA9PiB7XHJcbiAgICAgICAgaW5zdC5zZXRMb2dMZXZlbChsZXZlbCk7XHJcbiAgICB9KTtcclxufVxyXG5mdW5jdGlvbiBzZXRVc2VyTG9nSGFuZGxlcihsb2dDYWxsYmFjaywgb3B0aW9ucykge1xyXG4gICAgZm9yIChjb25zdCBpbnN0YW5jZSBvZiBpbnN0YW5jZXMpIHtcclxuICAgICAgICBsZXQgY3VzdG9tTG9nTGV2ZWwgPSBudWxsO1xyXG4gICAgICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMubGV2ZWwpIHtcclxuICAgICAgICAgICAgY3VzdG9tTG9nTGV2ZWwgPSBsZXZlbFN0cmluZ1RvRW51bVtvcHRpb25zLmxldmVsXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGxvZ0NhbGxiYWNrID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgIGluc3RhbmNlLnVzZXJMb2dIYW5kbGVyID0gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGluc3RhbmNlLnVzZXJMb2dIYW5kbGVyID0gKGluc3RhbmNlLCBsZXZlbCwgLi4uYXJncykgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbWVzc2FnZSA9IGFyZ3NcclxuICAgICAgICAgICAgICAgICAgICAubWFwKGFyZyA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFyZyA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICh0eXBlb2YgYXJnID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYXJnO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICh0eXBlb2YgYXJnID09PSAnbnVtYmVyJyB8fCB0eXBlb2YgYXJnID09PSAnYm9vbGVhbicpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFyZy50b1N0cmluZygpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChhcmcgaW5zdGFuY2VvZiBFcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYXJnLm1lc3NhZ2U7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGFyZyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgY2F0Y2ggKGlnbm9yZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKGFyZyA9PiBhcmcpXHJcbiAgICAgICAgICAgICAgICAgICAgLmpvaW4oJyAnKTtcclxuICAgICAgICAgICAgICAgIGlmIChsZXZlbCA+PSAoY3VzdG9tTG9nTGV2ZWwgIT09IG51bGwgJiYgY3VzdG9tTG9nTGV2ZWwgIT09IHZvaWQgMCA/IGN1c3RvbUxvZ0xldmVsIDogaW5zdGFuY2UubG9nTGV2ZWwpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbG9nQ2FsbGJhY2soe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXZlbDogTG9nTGV2ZWxbbGV2ZWxdLnRvTG93ZXJDYXNlKCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZ3MsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IGluc3RhbmNlLm5hbWVcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cblxuZXhwb3J0IHsgTG9nTGV2ZWwsIExvZ2dlciwgc2V0TG9nTGV2ZWwsIHNldFVzZXJMb2dIYW5kbGVyIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5lc20yMDE3LmpzLm1hcFxuIiwKICAgICJjb25zdCBpbnN0YW5jZU9mQW55ID0gKG9iamVjdCwgY29uc3RydWN0b3JzKSA9PiBjb25zdHJ1Y3RvcnMuc29tZSgoYykgPT4gb2JqZWN0IGluc3RhbmNlb2YgYyk7XG5cbmxldCBpZGJQcm94eWFibGVUeXBlcztcbmxldCBjdXJzb3JBZHZhbmNlTWV0aG9kcztcbi8vIFRoaXMgaXMgYSBmdW5jdGlvbiB0byBwcmV2ZW50IGl0IHRocm93aW5nIHVwIGluIG5vZGUgZW52aXJvbm1lbnRzLlxuZnVuY3Rpb24gZ2V0SWRiUHJveHlhYmxlVHlwZXMoKSB7XG4gICAgcmV0dXJuIChpZGJQcm94eWFibGVUeXBlcyB8fFxuICAgICAgICAoaWRiUHJveHlhYmxlVHlwZXMgPSBbXG4gICAgICAgICAgICBJREJEYXRhYmFzZSxcbiAgICAgICAgICAgIElEQk9iamVjdFN0b3JlLFxuICAgICAgICAgICAgSURCSW5kZXgsXG4gICAgICAgICAgICBJREJDdXJzb3IsXG4gICAgICAgICAgICBJREJUcmFuc2FjdGlvbixcbiAgICAgICAgXSkpO1xufVxuLy8gVGhpcyBpcyBhIGZ1bmN0aW9uIHRvIHByZXZlbnQgaXQgdGhyb3dpbmcgdXAgaW4gbm9kZSBlbnZpcm9ubWVudHMuXG5mdW5jdGlvbiBnZXRDdXJzb3JBZHZhbmNlTWV0aG9kcygpIHtcbiAgICByZXR1cm4gKGN1cnNvckFkdmFuY2VNZXRob2RzIHx8XG4gICAgICAgIChjdXJzb3JBZHZhbmNlTWV0aG9kcyA9IFtcbiAgICAgICAgICAgIElEQkN1cnNvci5wcm90b3R5cGUuYWR2YW5jZSxcbiAgICAgICAgICAgIElEQkN1cnNvci5wcm90b3R5cGUuY29udGludWUsXG4gICAgICAgICAgICBJREJDdXJzb3IucHJvdG90eXBlLmNvbnRpbnVlUHJpbWFyeUtleSxcbiAgICAgICAgXSkpO1xufVxuY29uc3QgY3Vyc29yUmVxdWVzdE1hcCA9IG5ldyBXZWFrTWFwKCk7XG5jb25zdCB0cmFuc2FjdGlvbkRvbmVNYXAgPSBuZXcgV2Vha01hcCgpO1xuY29uc3QgdHJhbnNhY3Rpb25TdG9yZU5hbWVzTWFwID0gbmV3IFdlYWtNYXAoKTtcbmNvbnN0IHRyYW5zZm9ybUNhY2hlID0gbmV3IFdlYWtNYXAoKTtcbmNvbnN0IHJldmVyc2VUcmFuc2Zvcm1DYWNoZSA9IG5ldyBXZWFrTWFwKCk7XG5mdW5jdGlvbiBwcm9taXNpZnlSZXF1ZXN0KHJlcXVlc3QpIHtcbiAgICBjb25zdCBwcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBjb25zdCB1bmxpc3RlbiA9ICgpID0+IHtcbiAgICAgICAgICAgIHJlcXVlc3QucmVtb3ZlRXZlbnRMaXN0ZW5lcignc3VjY2VzcycsIHN1Y2Nlc3MpO1xuICAgICAgICAgICAgcmVxdWVzdC5yZW1vdmVFdmVudExpc3RlbmVyKCdlcnJvcicsIGVycm9yKTtcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3Qgc3VjY2VzcyA9ICgpID0+IHtcbiAgICAgICAgICAgIHJlc29sdmUod3JhcChyZXF1ZXN0LnJlc3VsdCkpO1xuICAgICAgICAgICAgdW5saXN0ZW4oKTtcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgZXJyb3IgPSAoKSA9PiB7XG4gICAgICAgICAgICByZWplY3QocmVxdWVzdC5lcnJvcik7XG4gICAgICAgICAgICB1bmxpc3RlbigpO1xuICAgICAgICB9O1xuICAgICAgICByZXF1ZXN0LmFkZEV2ZW50TGlzdGVuZXIoJ3N1Y2Nlc3MnLCBzdWNjZXNzKTtcbiAgICAgICAgcmVxdWVzdC5hZGRFdmVudExpc3RlbmVyKCdlcnJvcicsIGVycm9yKTtcbiAgICB9KTtcbiAgICBwcm9taXNlXG4gICAgICAgIC50aGVuKCh2YWx1ZSkgPT4ge1xuICAgICAgICAvLyBTaW5jZSBjdXJzb3JpbmcgcmV1c2VzIHRoZSBJREJSZXF1ZXN0ICgqc2lnaCopLCB3ZSBjYWNoZSBpdCBmb3IgbGF0ZXIgcmV0cmlldmFsXG4gICAgICAgIC8vIChzZWUgd3JhcEZ1bmN0aW9uKS5cbiAgICAgICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgSURCQ3Vyc29yKSB7XG4gICAgICAgICAgICBjdXJzb3JSZXF1ZXN0TWFwLnNldCh2YWx1ZSwgcmVxdWVzdCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gQ2F0Y2hpbmcgdG8gYXZvaWQgXCJVbmNhdWdodCBQcm9taXNlIGV4Y2VwdGlvbnNcIlxuICAgIH0pXG4gICAgICAgIC5jYXRjaCgoKSA9PiB7IH0pO1xuICAgIC8vIFRoaXMgbWFwcGluZyBleGlzdHMgaW4gcmV2ZXJzZVRyYW5zZm9ybUNhY2hlIGJ1dCBkb2Vzbid0IGRvZXNuJ3QgZXhpc3QgaW4gdHJhbnNmb3JtQ2FjaGUuIFRoaXNcbiAgICAvLyBpcyBiZWNhdXNlIHdlIGNyZWF0ZSBtYW55IHByb21pc2VzIGZyb20gYSBzaW5nbGUgSURCUmVxdWVzdC5cbiAgICByZXZlcnNlVHJhbnNmb3JtQ2FjaGUuc2V0KHByb21pc2UsIHJlcXVlc3QpO1xuICAgIHJldHVybiBwcm9taXNlO1xufVxuZnVuY3Rpb24gY2FjaGVEb25lUHJvbWlzZUZvclRyYW5zYWN0aW9uKHR4KSB7XG4gICAgLy8gRWFybHkgYmFpbCBpZiB3ZSd2ZSBhbHJlYWR5IGNyZWF0ZWQgYSBkb25lIHByb21pc2UgZm9yIHRoaXMgdHJhbnNhY3Rpb24uXG4gICAgaWYgKHRyYW5zYWN0aW9uRG9uZU1hcC5oYXModHgpKVxuICAgICAgICByZXR1cm47XG4gICAgY29uc3QgZG9uZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgY29uc3QgdW5saXN0ZW4gPSAoKSA9PiB7XG4gICAgICAgICAgICB0eC5yZW1vdmVFdmVudExpc3RlbmVyKCdjb21wbGV0ZScsIGNvbXBsZXRlKTtcbiAgICAgICAgICAgIHR4LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgZXJyb3IpO1xuICAgICAgICAgICAgdHgucmVtb3ZlRXZlbnRMaXN0ZW5lcignYWJvcnQnLCBlcnJvcik7XG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IGNvbXBsZXRlID0gKCkgPT4ge1xuICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgdW5saXN0ZW4oKTtcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgZXJyb3IgPSAoKSA9PiB7XG4gICAgICAgICAgICByZWplY3QodHguZXJyb3IgfHwgbmV3IERPTUV4Y2VwdGlvbignQWJvcnRFcnJvcicsICdBYm9ydEVycm9yJykpO1xuICAgICAgICAgICAgdW5saXN0ZW4oKTtcbiAgICAgICAgfTtcbiAgICAgICAgdHguYWRkRXZlbnRMaXN0ZW5lcignY29tcGxldGUnLCBjb21wbGV0ZSk7XG4gICAgICAgIHR4LmFkZEV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgZXJyb3IpO1xuICAgICAgICB0eC5hZGRFdmVudExpc3RlbmVyKCdhYm9ydCcsIGVycm9yKTtcbiAgICB9KTtcbiAgICAvLyBDYWNoZSBpdCBmb3IgbGF0ZXIgcmV0cmlldmFsLlxuICAgIHRyYW5zYWN0aW9uRG9uZU1hcC5zZXQodHgsIGRvbmUpO1xufVxubGV0IGlkYlByb3h5VHJhcHMgPSB7XG4gICAgZ2V0KHRhcmdldCwgcHJvcCwgcmVjZWl2ZXIpIHtcbiAgICAgICAgaWYgKHRhcmdldCBpbnN0YW5jZW9mIElEQlRyYW5zYWN0aW9uKSB7XG4gICAgICAgICAgICAvLyBTcGVjaWFsIGhhbmRsaW5nIGZvciB0cmFuc2FjdGlvbi5kb25lLlxuICAgICAgICAgICAgaWYgKHByb3AgPT09ICdkb25lJylcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJhbnNhY3Rpb25Eb25lTWFwLmdldCh0YXJnZXQpO1xuICAgICAgICAgICAgLy8gUG9seWZpbGwgZm9yIG9iamVjdFN0b3JlTmFtZXMgYmVjYXVzZSBvZiBFZGdlLlxuICAgICAgICAgICAgaWYgKHByb3AgPT09ICdvYmplY3RTdG9yZU5hbWVzJykge1xuICAgICAgICAgICAgICAgIHJldHVybiB0YXJnZXQub2JqZWN0U3RvcmVOYW1lcyB8fCB0cmFuc2FjdGlvblN0b3JlTmFtZXNNYXAuZ2V0KHRhcmdldCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBNYWtlIHR4LnN0b3JlIHJldHVybiB0aGUgb25seSBzdG9yZSBpbiB0aGUgdHJhbnNhY3Rpb24sIG9yIHVuZGVmaW5lZCBpZiB0aGVyZSBhcmUgbWFueS5cbiAgICAgICAgICAgIGlmIChwcm9wID09PSAnc3RvcmUnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlY2VpdmVyLm9iamVjdFN0b3JlTmFtZXNbMV1cbiAgICAgICAgICAgICAgICAgICAgPyB1bmRlZmluZWRcbiAgICAgICAgICAgICAgICAgICAgOiByZWNlaXZlci5vYmplY3RTdG9yZShyZWNlaXZlci5vYmplY3RTdG9yZU5hbWVzWzBdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBFbHNlIHRyYW5zZm9ybSB3aGF0ZXZlciB3ZSBnZXQgYmFjay5cbiAgICAgICAgcmV0dXJuIHdyYXAodGFyZ2V0W3Byb3BdKTtcbiAgICB9LFxuICAgIHNldCh0YXJnZXQsIHByb3AsIHZhbHVlKSB7XG4gICAgICAgIHRhcmdldFtwcm9wXSA9IHZhbHVlO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuICAgIGhhcyh0YXJnZXQsIHByb3ApIHtcbiAgICAgICAgaWYgKHRhcmdldCBpbnN0YW5jZW9mIElEQlRyYW5zYWN0aW9uICYmXG4gICAgICAgICAgICAocHJvcCA9PT0gJ2RvbmUnIHx8IHByb3AgPT09ICdzdG9yZScpKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcHJvcCBpbiB0YXJnZXQ7XG4gICAgfSxcbn07XG5mdW5jdGlvbiByZXBsYWNlVHJhcHMoY2FsbGJhY2spIHtcbiAgICBpZGJQcm94eVRyYXBzID0gY2FsbGJhY2soaWRiUHJveHlUcmFwcyk7XG59XG5mdW5jdGlvbiB3cmFwRnVuY3Rpb24oZnVuYykge1xuICAgIC8vIER1ZSB0byBleHBlY3RlZCBvYmplY3QgZXF1YWxpdHkgKHdoaWNoIGlzIGVuZm9yY2VkIGJ5IHRoZSBjYWNoaW5nIGluIGB3cmFwYCksIHdlXG4gICAgLy8gb25seSBjcmVhdGUgb25lIG5ldyBmdW5jIHBlciBmdW5jLlxuICAgIC8vIEVkZ2UgZG9lc24ndCBzdXBwb3J0IG9iamVjdFN0b3JlTmFtZXMgKGJvb28pLCBzbyB3ZSBwb2x5ZmlsbCBpdCBoZXJlLlxuICAgIGlmIChmdW5jID09PSBJREJEYXRhYmFzZS5wcm90b3R5cGUudHJhbnNhY3Rpb24gJiZcbiAgICAgICAgISgnb2JqZWN0U3RvcmVOYW1lcycgaW4gSURCVHJhbnNhY3Rpb24ucHJvdG90eXBlKSkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKHN0b3JlTmFtZXMsIC4uLmFyZ3MpIHtcbiAgICAgICAgICAgIGNvbnN0IHR4ID0gZnVuYy5jYWxsKHVud3JhcCh0aGlzKSwgc3RvcmVOYW1lcywgLi4uYXJncyk7XG4gICAgICAgICAgICB0cmFuc2FjdGlvblN0b3JlTmFtZXNNYXAuc2V0KHR4LCBzdG9yZU5hbWVzLnNvcnQgPyBzdG9yZU5hbWVzLnNvcnQoKSA6IFtzdG9yZU5hbWVzXSk7XG4gICAgICAgICAgICByZXR1cm4gd3JhcCh0eCk7XG4gICAgICAgIH07XG4gICAgfVxuICAgIC8vIEN1cnNvciBtZXRob2RzIGFyZSBzcGVjaWFsLCBhcyB0aGUgYmVoYXZpb3VyIGlzIGEgbGl0dGxlIG1vcmUgZGlmZmVyZW50IHRvIHN0YW5kYXJkIElEQi4gSW5cbiAgICAvLyBJREIsIHlvdSBhZHZhbmNlIHRoZSBjdXJzb3IgYW5kIHdhaXQgZm9yIGEgbmV3ICdzdWNjZXNzJyBvbiB0aGUgSURCUmVxdWVzdCB0aGF0IGdhdmUgeW91IHRoZVxuICAgIC8vIGN1cnNvci4gSXQncyBraW5kYSBsaWtlIGEgcHJvbWlzZSB0aGF0IGNhbiByZXNvbHZlIHdpdGggbWFueSB2YWx1ZXMuIFRoYXQgZG9lc24ndCBtYWtlIHNlbnNlXG4gICAgLy8gd2l0aCByZWFsIHByb21pc2VzLCBzbyBlYWNoIGFkdmFuY2UgbWV0aG9kcyByZXR1cm5zIGEgbmV3IHByb21pc2UgZm9yIHRoZSBjdXJzb3Igb2JqZWN0LCBvclxuICAgIC8vIHVuZGVmaW5lZCBpZiB0aGUgZW5kIG9mIHRoZSBjdXJzb3IgaGFzIGJlZW4gcmVhY2hlZC5cbiAgICBpZiAoZ2V0Q3Vyc29yQWR2YW5jZU1ldGhvZHMoKS5pbmNsdWRlcyhmdW5jKSkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKC4uLmFyZ3MpIHtcbiAgICAgICAgICAgIC8vIENhbGxpbmcgdGhlIG9yaWdpbmFsIGZ1bmN0aW9uIHdpdGggdGhlIHByb3h5IGFzICd0aGlzJyBjYXVzZXMgSUxMRUdBTCBJTlZPQ0FUSU9OLCBzbyB3ZSB1c2VcbiAgICAgICAgICAgIC8vIHRoZSBvcmlnaW5hbCBvYmplY3QuXG4gICAgICAgICAgICBmdW5jLmFwcGx5KHVud3JhcCh0aGlzKSwgYXJncyk7XG4gICAgICAgICAgICByZXR1cm4gd3JhcChjdXJzb3JSZXF1ZXN0TWFwLmdldCh0aGlzKSk7XG4gICAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiBmdW5jdGlvbiAoLi4uYXJncykge1xuICAgICAgICAvLyBDYWxsaW5nIHRoZSBvcmlnaW5hbCBmdW5jdGlvbiB3aXRoIHRoZSBwcm94eSBhcyAndGhpcycgY2F1c2VzIElMTEVHQUwgSU5WT0NBVElPTiwgc28gd2UgdXNlXG4gICAgICAgIC8vIHRoZSBvcmlnaW5hbCBvYmplY3QuXG4gICAgICAgIHJldHVybiB3cmFwKGZ1bmMuYXBwbHkodW53cmFwKHRoaXMpLCBhcmdzKSk7XG4gICAgfTtcbn1cbmZ1bmN0aW9uIHRyYW5zZm9ybUNhY2hhYmxlVmFsdWUodmFsdWUpIHtcbiAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nKVxuICAgICAgICByZXR1cm4gd3JhcEZ1bmN0aW9uKHZhbHVlKTtcbiAgICAvLyBUaGlzIGRvZXNuJ3QgcmV0dXJuLCBpdCBqdXN0IGNyZWF0ZXMgYSAnZG9uZScgcHJvbWlzZSBmb3IgdGhlIHRyYW5zYWN0aW9uLFxuICAgIC8vIHdoaWNoIGlzIGxhdGVyIHJldHVybmVkIGZvciB0cmFuc2FjdGlvbi5kb25lIChzZWUgaWRiT2JqZWN0SGFuZGxlcikuXG4gICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgSURCVHJhbnNhY3Rpb24pXG4gICAgICAgIGNhY2hlRG9uZVByb21pc2VGb3JUcmFuc2FjdGlvbih2YWx1ZSk7XG4gICAgaWYgKGluc3RhbmNlT2ZBbnkodmFsdWUsIGdldElkYlByb3h5YWJsZVR5cGVzKCkpKVxuICAgICAgICByZXR1cm4gbmV3IFByb3h5KHZhbHVlLCBpZGJQcm94eVRyYXBzKTtcbiAgICAvLyBSZXR1cm4gdGhlIHNhbWUgdmFsdWUgYmFjayBpZiB3ZSdyZSBub3QgZ29pbmcgdG8gdHJhbnNmb3JtIGl0LlxuICAgIHJldHVybiB2YWx1ZTtcbn1cbmZ1bmN0aW9uIHdyYXAodmFsdWUpIHtcbiAgICAvLyBXZSBzb21ldGltZXMgZ2VuZXJhdGUgbXVsdGlwbGUgcHJvbWlzZXMgZnJvbSBhIHNpbmdsZSBJREJSZXF1ZXN0IChlZyB3aGVuIGN1cnNvcmluZyksIGJlY2F1c2VcbiAgICAvLyBJREIgaXMgd2VpcmQgYW5kIGEgc2luZ2xlIElEQlJlcXVlc3QgY2FuIHlpZWxkIG1hbnkgcmVzcG9uc2VzLCBzbyB0aGVzZSBjYW4ndCBiZSBjYWNoZWQuXG4gICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgSURCUmVxdWVzdClcbiAgICAgICAgcmV0dXJuIHByb21pc2lmeVJlcXVlc3QodmFsdWUpO1xuICAgIC8vIElmIHdlJ3ZlIGFscmVhZHkgdHJhbnNmb3JtZWQgdGhpcyB2YWx1ZSBiZWZvcmUsIHJldXNlIHRoZSB0cmFuc2Zvcm1lZCB2YWx1ZS5cbiAgICAvLyBUaGlzIGlzIGZhc3RlciwgYnV0IGl0IGFsc28gcHJvdmlkZXMgb2JqZWN0IGVxdWFsaXR5LlxuICAgIGlmICh0cmFuc2Zvcm1DYWNoZS5oYXModmFsdWUpKVxuICAgICAgICByZXR1cm4gdHJhbnNmb3JtQ2FjaGUuZ2V0KHZhbHVlKTtcbiAgICBjb25zdCBuZXdWYWx1ZSA9IHRyYW5zZm9ybUNhY2hhYmxlVmFsdWUodmFsdWUpO1xuICAgIC8vIE5vdCBhbGwgdHlwZXMgYXJlIHRyYW5zZm9ybWVkLlxuICAgIC8vIFRoZXNlIG1heSBiZSBwcmltaXRpdmUgdHlwZXMsIHNvIHRoZXkgY2FuJ3QgYmUgV2Vha01hcCBrZXlzLlxuICAgIGlmIChuZXdWYWx1ZSAhPT0gdmFsdWUpIHtcbiAgICAgICAgdHJhbnNmb3JtQ2FjaGUuc2V0KHZhbHVlLCBuZXdWYWx1ZSk7XG4gICAgICAgIHJldmVyc2VUcmFuc2Zvcm1DYWNoZS5zZXQobmV3VmFsdWUsIHZhbHVlKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ld1ZhbHVlO1xufVxuY29uc3QgdW53cmFwID0gKHZhbHVlKSA9PiByZXZlcnNlVHJhbnNmb3JtQ2FjaGUuZ2V0KHZhbHVlKTtcblxuZXhwb3J0IHsgcmV2ZXJzZVRyYW5zZm9ybUNhY2hlIGFzIGEsIGluc3RhbmNlT2ZBbnkgYXMgaSwgcmVwbGFjZVRyYXBzIGFzIHIsIHVud3JhcCBhcyB1LCB3cmFwIGFzIHcgfTtcbiIsCiAgICAiaW1wb3J0IHsgdyBhcyB3cmFwLCByIGFzIHJlcGxhY2VUcmFwcyB9IGZyb20gJy4vd3JhcC1pZGItdmFsdWUuanMnO1xuZXhwb3J0IHsgdSBhcyB1bndyYXAsIHcgYXMgd3JhcCB9IGZyb20gJy4vd3JhcC1pZGItdmFsdWUuanMnO1xuXG4vKipcbiAqIE9wZW4gYSBkYXRhYmFzZS5cbiAqXG4gKiBAcGFyYW0gbmFtZSBOYW1lIG9mIHRoZSBkYXRhYmFzZS5cbiAqIEBwYXJhbSB2ZXJzaW9uIFNjaGVtYSB2ZXJzaW9uLlxuICogQHBhcmFtIGNhbGxiYWNrcyBBZGRpdGlvbmFsIGNhbGxiYWNrcy5cbiAqL1xuZnVuY3Rpb24gb3BlbkRCKG5hbWUsIHZlcnNpb24sIHsgYmxvY2tlZCwgdXBncmFkZSwgYmxvY2tpbmcsIHRlcm1pbmF0ZWQgfSA9IHt9KSB7XG4gICAgY29uc3QgcmVxdWVzdCA9IGluZGV4ZWREQi5vcGVuKG5hbWUsIHZlcnNpb24pO1xuICAgIGNvbnN0IG9wZW5Qcm9taXNlID0gd3JhcChyZXF1ZXN0KTtcbiAgICBpZiAodXBncmFkZSkge1xuICAgICAgICByZXF1ZXN0LmFkZEV2ZW50TGlzdGVuZXIoJ3VwZ3JhZGVuZWVkZWQnLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIHVwZ3JhZGUod3JhcChyZXF1ZXN0LnJlc3VsdCksIGV2ZW50Lm9sZFZlcnNpb24sIGV2ZW50Lm5ld1ZlcnNpb24sIHdyYXAocmVxdWVzdC50cmFuc2FjdGlvbiksIGV2ZW50KTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGlmIChibG9ja2VkKSB7XG4gICAgICAgIHJlcXVlc3QuYWRkRXZlbnRMaXN0ZW5lcignYmxvY2tlZCcsIChldmVudCkgPT4gYmxvY2tlZChcbiAgICAgICAgLy8gQ2FzdGluZyBkdWUgdG8gaHR0cHM6Ly9naXRodWIuY29tL21pY3Jvc29mdC9UeXBlU2NyaXB0LURPTS1saWItZ2VuZXJhdG9yL3B1bGwvMTQwNVxuICAgICAgICBldmVudC5vbGRWZXJzaW9uLCBldmVudC5uZXdWZXJzaW9uLCBldmVudCkpO1xuICAgIH1cbiAgICBvcGVuUHJvbWlzZVxuICAgICAgICAudGhlbigoZGIpID0+IHtcbiAgICAgICAgaWYgKHRlcm1pbmF0ZWQpXG4gICAgICAgICAgICBkYi5hZGRFdmVudExpc3RlbmVyKCdjbG9zZScsICgpID0+IHRlcm1pbmF0ZWQoKSk7XG4gICAgICAgIGlmIChibG9ja2luZykge1xuICAgICAgICAgICAgZGIuYWRkRXZlbnRMaXN0ZW5lcigndmVyc2lvbmNoYW5nZScsIChldmVudCkgPT4gYmxvY2tpbmcoZXZlbnQub2xkVmVyc2lvbiwgZXZlbnQubmV3VmVyc2lvbiwgZXZlbnQpKTtcbiAgICAgICAgfVxuICAgIH0pXG4gICAgICAgIC5jYXRjaCgoKSA9PiB7IH0pO1xuICAgIHJldHVybiBvcGVuUHJvbWlzZTtcbn1cbi8qKlxuICogRGVsZXRlIGEgZGF0YWJhc2UuXG4gKlxuICogQHBhcmFtIG5hbWUgTmFtZSBvZiB0aGUgZGF0YWJhc2UuXG4gKi9cbmZ1bmN0aW9uIGRlbGV0ZURCKG5hbWUsIHsgYmxvY2tlZCB9ID0ge30pIHtcbiAgICBjb25zdCByZXF1ZXN0ID0gaW5kZXhlZERCLmRlbGV0ZURhdGFiYXNlKG5hbWUpO1xuICAgIGlmIChibG9ja2VkKSB7XG4gICAgICAgIHJlcXVlc3QuYWRkRXZlbnRMaXN0ZW5lcignYmxvY2tlZCcsIChldmVudCkgPT4gYmxvY2tlZChcbiAgICAgICAgLy8gQ2FzdGluZyBkdWUgdG8gaHR0cHM6Ly9naXRodWIuY29tL21pY3Jvc29mdC9UeXBlU2NyaXB0LURPTS1saWItZ2VuZXJhdG9yL3B1bGwvMTQwNVxuICAgICAgICBldmVudC5vbGRWZXJzaW9uLCBldmVudCkpO1xuICAgIH1cbiAgICByZXR1cm4gd3JhcChyZXF1ZXN0KS50aGVuKCgpID0+IHVuZGVmaW5lZCk7XG59XG5cbmNvbnN0IHJlYWRNZXRob2RzID0gWydnZXQnLCAnZ2V0S2V5JywgJ2dldEFsbCcsICdnZXRBbGxLZXlzJywgJ2NvdW50J107XG5jb25zdCB3cml0ZU1ldGhvZHMgPSBbJ3B1dCcsICdhZGQnLCAnZGVsZXRlJywgJ2NsZWFyJ107XG5jb25zdCBjYWNoZWRNZXRob2RzID0gbmV3IE1hcCgpO1xuZnVuY3Rpb24gZ2V0TWV0aG9kKHRhcmdldCwgcHJvcCkge1xuICAgIGlmICghKHRhcmdldCBpbnN0YW5jZW9mIElEQkRhdGFiYXNlICYmXG4gICAgICAgICEocHJvcCBpbiB0YXJnZXQpICYmXG4gICAgICAgIHR5cGVvZiBwcm9wID09PSAnc3RyaW5nJykpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoY2FjaGVkTWV0aG9kcy5nZXQocHJvcCkpXG4gICAgICAgIHJldHVybiBjYWNoZWRNZXRob2RzLmdldChwcm9wKTtcbiAgICBjb25zdCB0YXJnZXRGdW5jTmFtZSA9IHByb3AucmVwbGFjZSgvRnJvbUluZGV4JC8sICcnKTtcbiAgICBjb25zdCB1c2VJbmRleCA9IHByb3AgIT09IHRhcmdldEZ1bmNOYW1lO1xuICAgIGNvbnN0IGlzV3JpdGUgPSB3cml0ZU1ldGhvZHMuaW5jbHVkZXModGFyZ2V0RnVuY05hbWUpO1xuICAgIGlmIChcbiAgICAvLyBCYWlsIGlmIHRoZSB0YXJnZXQgZG9lc24ndCBleGlzdCBvbiB0aGUgdGFyZ2V0LiBFZywgZ2V0QWxsIGlzbid0IGluIEVkZ2UuXG4gICAgISh0YXJnZXRGdW5jTmFtZSBpbiAodXNlSW5kZXggPyBJREJJbmRleCA6IElEQk9iamVjdFN0b3JlKS5wcm90b3R5cGUpIHx8XG4gICAgICAgICEoaXNXcml0ZSB8fCByZWFkTWV0aG9kcy5pbmNsdWRlcyh0YXJnZXRGdW5jTmFtZSkpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgbWV0aG9kID0gYXN5bmMgZnVuY3Rpb24gKHN0b3JlTmFtZSwgLi4uYXJncykge1xuICAgICAgICAvLyBpc1dyaXRlID8gJ3JlYWR3cml0ZScgOiB1bmRlZmluZWQgZ3ppcHBzIGJldHRlciwgYnV0IGZhaWxzIGluIEVkZ2UgOihcbiAgICAgICAgY29uc3QgdHggPSB0aGlzLnRyYW5zYWN0aW9uKHN0b3JlTmFtZSwgaXNXcml0ZSA/ICdyZWFkd3JpdGUnIDogJ3JlYWRvbmx5Jyk7XG4gICAgICAgIGxldCB0YXJnZXQgPSB0eC5zdG9yZTtcbiAgICAgICAgaWYgKHVzZUluZGV4KVxuICAgICAgICAgICAgdGFyZ2V0ID0gdGFyZ2V0LmluZGV4KGFyZ3Muc2hpZnQoKSk7XG4gICAgICAgIC8vIE11c3QgcmVqZWN0IGlmIG9wIHJlamVjdHMuXG4gICAgICAgIC8vIElmIGl0J3MgYSB3cml0ZSBvcGVyYXRpb24sIG11c3QgcmVqZWN0IGlmIHR4LmRvbmUgcmVqZWN0cy5cbiAgICAgICAgLy8gTXVzdCByZWplY3Qgd2l0aCBvcCByZWplY3Rpb24gZmlyc3QuXG4gICAgICAgIC8vIE11c3QgcmVzb2x2ZSB3aXRoIG9wIHZhbHVlLlxuICAgICAgICAvLyBNdXN0IGhhbmRsZSBib3RoIHByb21pc2VzIChubyB1bmhhbmRsZWQgcmVqZWN0aW9ucylcbiAgICAgICAgcmV0dXJuIChhd2FpdCBQcm9taXNlLmFsbChbXG4gICAgICAgICAgICB0YXJnZXRbdGFyZ2V0RnVuY05hbWVdKC4uLmFyZ3MpLFxuICAgICAgICAgICAgaXNXcml0ZSAmJiB0eC5kb25lLFxuICAgICAgICBdKSlbMF07XG4gICAgfTtcbiAgICBjYWNoZWRNZXRob2RzLnNldChwcm9wLCBtZXRob2QpO1xuICAgIHJldHVybiBtZXRob2Q7XG59XG5yZXBsYWNlVHJhcHMoKG9sZFRyYXBzKSA9PiAoe1xuICAgIC4uLm9sZFRyYXBzLFxuICAgIGdldDogKHRhcmdldCwgcHJvcCwgcmVjZWl2ZXIpID0+IGdldE1ldGhvZCh0YXJnZXQsIHByb3ApIHx8IG9sZFRyYXBzLmdldCh0YXJnZXQsIHByb3AsIHJlY2VpdmVyKSxcbiAgICBoYXM6ICh0YXJnZXQsIHByb3ApID0+ICEhZ2V0TWV0aG9kKHRhcmdldCwgcHJvcCkgfHwgb2xkVHJhcHMuaGFzKHRhcmdldCwgcHJvcCksXG59KSk7XG5cbmV4cG9ydCB7IGRlbGV0ZURCLCBvcGVuREIgfTtcbiIsCiAgICAiaW1wb3J0IHsgQ29tcG9uZW50LCBDb21wb25lbnRDb250YWluZXIgfSBmcm9tICdAZmlyZWJhc2UvY29tcG9uZW50JztcbmltcG9ydCB7IExvZ2dlciwgc2V0VXNlckxvZ0hhbmRsZXIsIHNldExvZ0xldmVsIGFzIHNldExvZ0xldmVsJDEgfSBmcm9tICdAZmlyZWJhc2UvbG9nZ2VyJztcbmltcG9ydCB7IEVycm9yRmFjdG9yeSwgZ2V0RGVmYXVsdEFwcENvbmZpZywgZGVlcEVxdWFsLCBpc0Jyb3dzZXIsIGlzV2ViV29ya2VyLCBGaXJlYmFzZUVycm9yLCBiYXNlNjR1cmxFbmNvZGVXaXRob3V0UGFkZGluZywgaXNJbmRleGVkREJBdmFpbGFibGUsIHZhbGlkYXRlSW5kZXhlZERCT3BlbmFibGUgfSBmcm9tICdAZmlyZWJhc2UvdXRpbCc7XG5leHBvcnQgeyBGaXJlYmFzZUVycm9yIH0gZnJvbSAnQGZpcmViYXNlL3V0aWwnO1xuaW1wb3J0IHsgb3BlbkRCIH0gZnJvbSAnaWRiJztcblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDE5IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuY2xhc3MgUGxhdGZvcm1Mb2dnZXJTZXJ2aWNlSW1wbCB7XHJcbiAgICBjb25zdHJ1Y3Rvcihjb250YWluZXIpIHtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lciA9IGNvbnRhaW5lcjtcclxuICAgIH1cclxuICAgIC8vIEluIGluaXRpYWwgaW1wbGVtZW50YXRpb24sIHRoaXMgd2lsbCBiZSBjYWxsZWQgYnkgaW5zdGFsbGF0aW9ucyBvblxyXG4gICAgLy8gYXV0aCB0b2tlbiByZWZyZXNoLCBhbmQgaW5zdGFsbGF0aW9ucyB3aWxsIHNlbmQgdGhpcyBzdHJpbmcuXHJcbiAgICBnZXRQbGF0Zm9ybUluZm9TdHJpbmcoKSB7XHJcbiAgICAgICAgY29uc3QgcHJvdmlkZXJzID0gdGhpcy5jb250YWluZXIuZ2V0UHJvdmlkZXJzKCk7XHJcbiAgICAgICAgLy8gTG9vcCB0aHJvdWdoIHByb3ZpZGVycyBhbmQgZ2V0IGxpYnJhcnkvdmVyc2lvbiBwYWlycyBmcm9tIGFueSB0aGF0IGFyZVxyXG4gICAgICAgIC8vIHZlcnNpb24gY29tcG9uZW50cy5cclxuICAgICAgICByZXR1cm4gcHJvdmlkZXJzXHJcbiAgICAgICAgICAgIC5tYXAocHJvdmlkZXIgPT4ge1xyXG4gICAgICAgICAgICBpZiAoaXNWZXJzaW9uU2VydmljZVByb3ZpZGVyKHByb3ZpZGVyKSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgc2VydmljZSA9IHByb3ZpZGVyLmdldEltbWVkaWF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGAke3NlcnZpY2UubGlicmFyeX0vJHtzZXJ2aWNlLnZlcnNpb259YDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgICAgICAgICAgLmZpbHRlcihsb2dTdHJpbmcgPT4gbG9nU3RyaW5nKVxyXG4gICAgICAgICAgICAuam9pbignICcpO1xyXG4gICAgfVxyXG59XHJcbi8qKlxyXG4gKlxyXG4gKiBAcGFyYW0gcHJvdmlkZXIgY2hlY2sgaWYgdGhpcyBwcm92aWRlciBwcm92aWRlcyBhIFZlcnNpb25TZXJ2aWNlXHJcbiAqXHJcbiAqIE5PVEU6IFVzaW5nIFByb3ZpZGVyPCdhcHAtdmVyc2lvbic+IGlzIGEgaGFjayB0byBpbmRpY2F0ZSB0aGF0IHRoZSBwcm92aWRlclxyXG4gKiBwcm92aWRlcyBWZXJzaW9uU2VydmljZS4gVGhlIHByb3ZpZGVyIGlzIG5vdCBuZWNlc3NhcmlseSBhICdhcHAtdmVyc2lvbidcclxuICogcHJvdmlkZXIuXHJcbiAqL1xyXG5mdW5jdGlvbiBpc1ZlcnNpb25TZXJ2aWNlUHJvdmlkZXIocHJvdmlkZXIpIHtcclxuICAgIGNvbnN0IGNvbXBvbmVudCA9IHByb3ZpZGVyLmdldENvbXBvbmVudCgpO1xyXG4gICAgcmV0dXJuIChjb21wb25lbnQgPT09IG51bGwgfHwgY29tcG9uZW50ID09PSB2b2lkIDAgPyB2b2lkIDAgOiBjb21wb25lbnQudHlwZSkgPT09IFwiVkVSU0lPTlwiIC8qIENvbXBvbmVudFR5cGUuVkVSU0lPTiAqLztcclxufVxuXG5jb25zdCBuYW1lJHAgPSBcIkBmaXJlYmFzZS9hcHBcIjtcbmNvbnN0IHZlcnNpb24kMSA9IFwiMC4xMC4xMFwiO1xuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMTkgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG5jb25zdCBsb2dnZXIgPSBuZXcgTG9nZ2VyKCdAZmlyZWJhc2UvYXBwJyk7XG5cbmNvbnN0IG5hbWUkbyA9IFwiQGZpcmViYXNlL2FwcC1jb21wYXRcIjtcblxuY29uc3QgbmFtZSRuID0gXCJAZmlyZWJhc2UvYW5hbHl0aWNzLWNvbXBhdFwiO1xuXG5jb25zdCBuYW1lJG0gPSBcIkBmaXJlYmFzZS9hbmFseXRpY3NcIjtcblxuY29uc3QgbmFtZSRsID0gXCJAZmlyZWJhc2UvYXBwLWNoZWNrLWNvbXBhdFwiO1xuXG5jb25zdCBuYW1lJGsgPSBcIkBmaXJlYmFzZS9hcHAtY2hlY2tcIjtcblxuY29uc3QgbmFtZSRqID0gXCJAZmlyZWJhc2UvYXV0aFwiO1xuXG5jb25zdCBuYW1lJGkgPSBcIkBmaXJlYmFzZS9hdXRoLWNvbXBhdFwiO1xuXG5jb25zdCBuYW1lJGggPSBcIkBmaXJlYmFzZS9kYXRhYmFzZVwiO1xuXG5jb25zdCBuYW1lJGcgPSBcIkBmaXJlYmFzZS9kYXRhYmFzZS1jb21wYXRcIjtcblxuY29uc3QgbmFtZSRmID0gXCJAZmlyZWJhc2UvZnVuY3Rpb25zXCI7XG5cbmNvbnN0IG5hbWUkZSA9IFwiQGZpcmViYXNlL2Z1bmN0aW9ucy1jb21wYXRcIjtcblxuY29uc3QgbmFtZSRkID0gXCJAZmlyZWJhc2UvaW5zdGFsbGF0aW9uc1wiO1xuXG5jb25zdCBuYW1lJGMgPSBcIkBmaXJlYmFzZS9pbnN0YWxsYXRpb25zLWNvbXBhdFwiO1xuXG5jb25zdCBuYW1lJGIgPSBcIkBmaXJlYmFzZS9tZXNzYWdpbmdcIjtcblxuY29uc3QgbmFtZSRhID0gXCJAZmlyZWJhc2UvbWVzc2FnaW5nLWNvbXBhdFwiO1xuXG5jb25zdCBuYW1lJDkgPSBcIkBmaXJlYmFzZS9wZXJmb3JtYW5jZVwiO1xuXG5jb25zdCBuYW1lJDggPSBcIkBmaXJlYmFzZS9wZXJmb3JtYW5jZS1jb21wYXRcIjtcblxuY29uc3QgbmFtZSQ3ID0gXCJAZmlyZWJhc2UvcmVtb3RlLWNvbmZpZ1wiO1xuXG5jb25zdCBuYW1lJDYgPSBcIkBmaXJlYmFzZS9yZW1vdGUtY29uZmlnLWNvbXBhdFwiO1xuXG5jb25zdCBuYW1lJDUgPSBcIkBmaXJlYmFzZS9zdG9yYWdlXCI7XG5cbmNvbnN0IG5hbWUkNCA9IFwiQGZpcmViYXNlL3N0b3JhZ2UtY29tcGF0XCI7XG5cbmNvbnN0IG5hbWUkMyA9IFwiQGZpcmViYXNlL2ZpcmVzdG9yZVwiO1xuXG5jb25zdCBuYW1lJDIgPSBcIkBmaXJlYmFzZS92ZXJ0ZXhhaS1wcmV2aWV3XCI7XG5cbmNvbnN0IG5hbWUkMSA9IFwiQGZpcmViYXNlL2ZpcmVzdG9yZS1jb21wYXRcIjtcblxuY29uc3QgbmFtZSA9IFwiZmlyZWJhc2VcIjtcbmNvbnN0IHZlcnNpb24gPSBcIjEwLjEzLjFcIjtcblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDE5IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuLyoqXHJcbiAqIFRoZSBkZWZhdWx0IGFwcCBuYW1lXHJcbiAqXHJcbiAqIEBpbnRlcm5hbFxyXG4gKi9cclxuY29uc3QgREVGQVVMVF9FTlRSWV9OQU1FID0gJ1tERUZBVUxUXSc7XHJcbmNvbnN0IFBMQVRGT1JNX0xPR19TVFJJTkcgPSB7XHJcbiAgICBbbmFtZSRwXTogJ2ZpcmUtY29yZScsXHJcbiAgICBbbmFtZSRvXTogJ2ZpcmUtY29yZS1jb21wYXQnLFxyXG4gICAgW25hbWUkbV06ICdmaXJlLWFuYWx5dGljcycsXHJcbiAgICBbbmFtZSRuXTogJ2ZpcmUtYW5hbHl0aWNzLWNvbXBhdCcsXHJcbiAgICBbbmFtZSRrXTogJ2ZpcmUtYXBwLWNoZWNrJyxcclxuICAgIFtuYW1lJGxdOiAnZmlyZS1hcHAtY2hlY2stY29tcGF0JyxcclxuICAgIFtuYW1lJGpdOiAnZmlyZS1hdXRoJyxcclxuICAgIFtuYW1lJGldOiAnZmlyZS1hdXRoLWNvbXBhdCcsXHJcbiAgICBbbmFtZSRoXTogJ2ZpcmUtcnRkYicsXHJcbiAgICBbbmFtZSRnXTogJ2ZpcmUtcnRkYi1jb21wYXQnLFxyXG4gICAgW25hbWUkZl06ICdmaXJlLWZuJyxcclxuICAgIFtuYW1lJGVdOiAnZmlyZS1mbi1jb21wYXQnLFxyXG4gICAgW25hbWUkZF06ICdmaXJlLWlpZCcsXHJcbiAgICBbbmFtZSRjXTogJ2ZpcmUtaWlkLWNvbXBhdCcsXHJcbiAgICBbbmFtZSRiXTogJ2ZpcmUtZmNtJyxcclxuICAgIFtuYW1lJGFdOiAnZmlyZS1mY20tY29tcGF0JyxcclxuICAgIFtuYW1lJDldOiAnZmlyZS1wZXJmJyxcclxuICAgIFtuYW1lJDhdOiAnZmlyZS1wZXJmLWNvbXBhdCcsXHJcbiAgICBbbmFtZSQ3XTogJ2ZpcmUtcmMnLFxyXG4gICAgW25hbWUkNl06ICdmaXJlLXJjLWNvbXBhdCcsXHJcbiAgICBbbmFtZSQ1XTogJ2ZpcmUtZ2NzJyxcclxuICAgIFtuYW1lJDRdOiAnZmlyZS1nY3MtY29tcGF0JyxcclxuICAgIFtuYW1lJDNdOiAnZmlyZS1mc3QnLFxyXG4gICAgW25hbWUkMV06ICdmaXJlLWZzdC1jb21wYXQnLFxyXG4gICAgW25hbWUkMl06ICdmaXJlLXZlcnRleCcsXHJcbiAgICAnZmlyZS1qcyc6ICdmaXJlLWpzJyxcclxuICAgIFtuYW1lXTogJ2ZpcmUtanMtYWxsJ1xyXG59O1xuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMTkgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG4vKipcclxuICogQGludGVybmFsXHJcbiAqL1xyXG5jb25zdCBfYXBwcyA9IG5ldyBNYXAoKTtcclxuLyoqXHJcbiAqIEBpbnRlcm5hbFxyXG4gKi9cclxuY29uc3QgX3NlcnZlckFwcHMgPSBuZXcgTWFwKCk7XHJcbi8qKlxyXG4gKiBSZWdpc3RlcmVkIGNvbXBvbmVudHMuXHJcbiAqXHJcbiAqIEBpbnRlcm5hbFxyXG4gKi9cclxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnlcclxuY29uc3QgX2NvbXBvbmVudHMgPSBuZXcgTWFwKCk7XHJcbi8qKlxyXG4gKiBAcGFyYW0gY29tcG9uZW50IC0gdGhlIGNvbXBvbmVudCBiZWluZyBhZGRlZCB0byB0aGlzIGFwcCdzIGNvbnRhaW5lclxyXG4gKlxyXG4gKiBAaW50ZXJuYWxcclxuICovXHJcbmZ1bmN0aW9uIF9hZGRDb21wb25lbnQoYXBwLCBjb21wb25lbnQpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgYXBwLmNvbnRhaW5lci5hZGRDb21wb25lbnQoY29tcG9uZW50KTtcclxuICAgIH1cclxuICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgbG9nZ2VyLmRlYnVnKGBDb21wb25lbnQgJHtjb21wb25lbnQubmFtZX0gZmFpbGVkIHRvIHJlZ2lzdGVyIHdpdGggRmlyZWJhc2VBcHAgJHthcHAubmFtZX1gLCBlKTtcclxuICAgIH1cclxufVxyXG4vKipcclxuICpcclxuICogQGludGVybmFsXHJcbiAqL1xyXG5mdW5jdGlvbiBfYWRkT3JPdmVyd3JpdGVDb21wb25lbnQoYXBwLCBjb21wb25lbnQpIHtcclxuICAgIGFwcC5jb250YWluZXIuYWRkT3JPdmVyd3JpdGVDb21wb25lbnQoY29tcG9uZW50KTtcclxufVxyXG4vKipcclxuICpcclxuICogQHBhcmFtIGNvbXBvbmVudCAtIHRoZSBjb21wb25lbnQgdG8gcmVnaXN0ZXJcclxuICogQHJldHVybnMgd2hldGhlciBvciBub3QgdGhlIGNvbXBvbmVudCBpcyByZWdpc3RlcmVkIHN1Y2Nlc3NmdWxseVxyXG4gKlxyXG4gKiBAaW50ZXJuYWxcclxuICovXHJcbmZ1bmN0aW9uIF9yZWdpc3RlckNvbXBvbmVudChjb21wb25lbnQpIHtcclxuICAgIGNvbnN0IGNvbXBvbmVudE5hbWUgPSBjb21wb25lbnQubmFtZTtcclxuICAgIGlmIChfY29tcG9uZW50cy5oYXMoY29tcG9uZW50TmFtZSkpIHtcclxuICAgICAgICBsb2dnZXIuZGVidWcoYFRoZXJlIHdlcmUgbXVsdGlwbGUgYXR0ZW1wdHMgdG8gcmVnaXN0ZXIgY29tcG9uZW50ICR7Y29tcG9uZW50TmFtZX0uYCk7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgX2NvbXBvbmVudHMuc2V0KGNvbXBvbmVudE5hbWUsIGNvbXBvbmVudCk7XHJcbiAgICAvLyBhZGQgdGhlIGNvbXBvbmVudCB0byBleGlzdGluZyBhcHAgaW5zdGFuY2VzXHJcbiAgICBmb3IgKGNvbnN0IGFwcCBvZiBfYXBwcy52YWx1ZXMoKSkge1xyXG4gICAgICAgIF9hZGRDb21wb25lbnQoYXBwLCBjb21wb25lbnQpO1xyXG4gICAgfVxyXG4gICAgZm9yIChjb25zdCBzZXJ2ZXJBcHAgb2YgX3NlcnZlckFwcHMudmFsdWVzKCkpIHtcclxuICAgICAgICBfYWRkQ29tcG9uZW50KHNlcnZlckFwcCwgY29tcG9uZW50KTtcclxuICAgIH1cclxuICAgIHJldHVybiB0cnVlO1xyXG59XHJcbi8qKlxyXG4gKlxyXG4gKiBAcGFyYW0gYXBwIC0gRmlyZWJhc2VBcHAgaW5zdGFuY2VcclxuICogQHBhcmFtIG5hbWUgLSBzZXJ2aWNlIG5hbWVcclxuICpcclxuICogQHJldHVybnMgdGhlIHByb3ZpZGVyIGZvciB0aGUgc2VydmljZSB3aXRoIHRoZSBtYXRjaGluZyBuYW1lXHJcbiAqXHJcbiAqIEBpbnRlcm5hbFxyXG4gKi9cclxuZnVuY3Rpb24gX2dldFByb3ZpZGVyKGFwcCwgbmFtZSkge1xyXG4gICAgY29uc3QgaGVhcnRiZWF0Q29udHJvbGxlciA9IGFwcC5jb250YWluZXJcclxuICAgICAgICAuZ2V0UHJvdmlkZXIoJ2hlYXJ0YmVhdCcpXHJcbiAgICAgICAgLmdldEltbWVkaWF0ZSh7IG9wdGlvbmFsOiB0cnVlIH0pO1xyXG4gICAgaWYgKGhlYXJ0YmVhdENvbnRyb2xsZXIpIHtcclxuICAgICAgICB2b2lkIGhlYXJ0YmVhdENvbnRyb2xsZXIudHJpZ2dlckhlYXJ0YmVhdCgpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGFwcC5jb250YWluZXIuZ2V0UHJvdmlkZXIobmFtZSk7XHJcbn1cclxuLyoqXHJcbiAqXHJcbiAqIEBwYXJhbSBhcHAgLSBGaXJlYmFzZUFwcCBpbnN0YW5jZVxyXG4gKiBAcGFyYW0gbmFtZSAtIHNlcnZpY2UgbmFtZVxyXG4gKiBAcGFyYW0gaW5zdGFuY2VJZGVudGlmaWVyIC0gc2VydmljZSBpbnN0YW5jZSBpZGVudGlmaWVyIGluIGNhc2UgdGhlIHNlcnZpY2Ugc3VwcG9ydHMgbXVsdGlwbGUgaW5zdGFuY2VzXHJcbiAqXHJcbiAqIEBpbnRlcm5hbFxyXG4gKi9cclxuZnVuY3Rpb24gX3JlbW92ZVNlcnZpY2VJbnN0YW5jZShhcHAsIG5hbWUsIGluc3RhbmNlSWRlbnRpZmllciA9IERFRkFVTFRfRU5UUllfTkFNRSkge1xyXG4gICAgX2dldFByb3ZpZGVyKGFwcCwgbmFtZSkuY2xlYXJJbnN0YW5jZShpbnN0YW5jZUlkZW50aWZpZXIpO1xyXG59XHJcbi8qKlxyXG4gKlxyXG4gKiBAcGFyYW0gb2JqIC0gYW4gb2JqZWN0IG9mIHR5cGUgRmlyZWJhc2VBcHAgb3IgRmlyZWJhc2VPcHRpb25zLlxyXG4gKlxyXG4gKiBAcmV0dXJucyB0cnVlIGlmIHRoZSBwcm92aWRlIG9iamVjdCBpcyBvZiB0eXBlIEZpcmViYXNlQXBwLlxyXG4gKlxyXG4gKiBAaW50ZXJuYWxcclxuICovXHJcbmZ1bmN0aW9uIF9pc0ZpcmViYXNlQXBwKG9iaikge1xyXG4gICAgcmV0dXJuIG9iai5vcHRpb25zICE9PSB1bmRlZmluZWQ7XHJcbn1cclxuLyoqXHJcbiAqXHJcbiAqIEBwYXJhbSBvYmogLSBhbiBvYmplY3Qgb2YgdHlwZSBGaXJlYmFzZUFwcC5cclxuICpcclxuICogQHJldHVybnMgdHJ1ZSBpZiB0aGUgcHJvdmlkZWQgb2JqZWN0IGlzIG9mIHR5cGUgRmlyZWJhc2VTZXJ2ZXJBcHBJbXBsLlxyXG4gKlxyXG4gKiBAaW50ZXJuYWxcclxuICovXHJcbmZ1bmN0aW9uIF9pc0ZpcmViYXNlU2VydmVyQXBwKG9iaikge1xyXG4gICAgcmV0dXJuIG9iai5zZXR0aW5ncyAhPT0gdW5kZWZpbmVkO1xyXG59XHJcbi8qKlxyXG4gKiBUZXN0IG9ubHlcclxuICpcclxuICogQGludGVybmFsXHJcbiAqL1xyXG5mdW5jdGlvbiBfY2xlYXJDb21wb25lbnRzKCkge1xyXG4gICAgX2NvbXBvbmVudHMuY2xlYXIoKTtcclxufVxuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMTkgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG5jb25zdCBFUlJPUlMgPSB7XHJcbiAgICBbXCJuby1hcHBcIiAvKiBBcHBFcnJvci5OT19BUFAgKi9dOiBcIk5vIEZpcmViYXNlIEFwcCAneyRhcHBOYW1lfScgaGFzIGJlZW4gY3JlYXRlZCAtIFwiICtcclxuICAgICAgICAnY2FsbCBpbml0aWFsaXplQXBwKCkgZmlyc3QnLFxyXG4gICAgW1wiYmFkLWFwcC1uYW1lXCIgLyogQXBwRXJyb3IuQkFEX0FQUF9OQU1FICovXTogXCJJbGxlZ2FsIEFwcCBuYW1lOiAneyRhcHBOYW1lfSdcIixcclxuICAgIFtcImR1cGxpY2F0ZS1hcHBcIiAvKiBBcHBFcnJvci5EVVBMSUNBVEVfQVBQICovXTogXCJGaXJlYmFzZSBBcHAgbmFtZWQgJ3skYXBwTmFtZX0nIGFscmVhZHkgZXhpc3RzIHdpdGggZGlmZmVyZW50IG9wdGlvbnMgb3IgY29uZmlnXCIsXHJcbiAgICBbXCJhcHAtZGVsZXRlZFwiIC8qIEFwcEVycm9yLkFQUF9ERUxFVEVEICovXTogXCJGaXJlYmFzZSBBcHAgbmFtZWQgJ3skYXBwTmFtZX0nIGFscmVhZHkgZGVsZXRlZFwiLFxyXG4gICAgW1wic2VydmVyLWFwcC1kZWxldGVkXCIgLyogQXBwRXJyb3IuU0VSVkVSX0FQUF9ERUxFVEVEICovXTogJ0ZpcmViYXNlIFNlcnZlciBBcHAgaGFzIGJlZW4gZGVsZXRlZCcsXHJcbiAgICBbXCJuby1vcHRpb25zXCIgLyogQXBwRXJyb3IuTk9fT1BUSU9OUyAqL106ICdOZWVkIHRvIHByb3ZpZGUgb3B0aW9ucywgd2hlbiBub3QgYmVpbmcgZGVwbG95ZWQgdG8gaG9zdGluZyB2aWEgc291cmNlLicsXHJcbiAgICBbXCJpbnZhbGlkLWFwcC1hcmd1bWVudFwiIC8qIEFwcEVycm9yLklOVkFMSURfQVBQX0FSR1VNRU5UICovXTogJ2ZpcmViYXNlLnskYXBwTmFtZX0oKSB0YWtlcyBlaXRoZXIgbm8gYXJndW1lbnQgb3IgYSAnICtcclxuICAgICAgICAnRmlyZWJhc2UgQXBwIGluc3RhbmNlLicsXHJcbiAgICBbXCJpbnZhbGlkLWxvZy1hcmd1bWVudFwiIC8qIEFwcEVycm9yLklOVkFMSURfTE9HX0FSR1VNRU5UICovXTogJ0ZpcnN0IGFyZ3VtZW50IHRvIGBvbkxvZ2AgbXVzdCBiZSBudWxsIG9yIGEgZnVuY3Rpb24uJyxcclxuICAgIFtcImlkYi1vcGVuXCIgLyogQXBwRXJyb3IuSURCX09QRU4gKi9dOiAnRXJyb3IgdGhyb3duIHdoZW4gb3BlbmluZyBJbmRleGVkREIuIE9yaWdpbmFsIGVycm9yOiB7JG9yaWdpbmFsRXJyb3JNZXNzYWdlfS4nLFxyXG4gICAgW1wiaWRiLWdldFwiIC8qIEFwcEVycm9yLklEQl9HRVQgKi9dOiAnRXJyb3IgdGhyb3duIHdoZW4gcmVhZGluZyBmcm9tIEluZGV4ZWREQi4gT3JpZ2luYWwgZXJyb3I6IHskb3JpZ2luYWxFcnJvck1lc3NhZ2V9LicsXHJcbiAgICBbXCJpZGItc2V0XCIgLyogQXBwRXJyb3IuSURCX1dSSVRFICovXTogJ0Vycm9yIHRocm93biB3aGVuIHdyaXRpbmcgdG8gSW5kZXhlZERCLiBPcmlnaW5hbCBlcnJvcjogeyRvcmlnaW5hbEVycm9yTWVzc2FnZX0uJyxcclxuICAgIFtcImlkYi1kZWxldGVcIiAvKiBBcHBFcnJvci5JREJfREVMRVRFICovXTogJ0Vycm9yIHRocm93biB3aGVuIGRlbGV0aW5nIGZyb20gSW5kZXhlZERCLiBPcmlnaW5hbCBlcnJvcjogeyRvcmlnaW5hbEVycm9yTWVzc2FnZX0uJyxcclxuICAgIFtcImZpbmFsaXphdGlvbi1yZWdpc3RyeS1ub3Qtc3VwcG9ydGVkXCIgLyogQXBwRXJyb3IuRklOQUxJWkFUSU9OX1JFR0lTVFJZX05PVF9TVVBQT1JURUQgKi9dOiAnRmlyZWJhc2VTZXJ2ZXJBcHAgZGVsZXRlT25EZXJlZiBmaWVsZCBkZWZpbmVkIGJ1dCB0aGUgSlMgcnVudGltZSBkb2VzIG5vdCBzdXBwb3J0IEZpbmFsaXphdGlvblJlZ2lzdHJ5LicsXHJcbiAgICBbXCJpbnZhbGlkLXNlcnZlci1hcHAtZW52aXJvbm1lbnRcIiAvKiBBcHBFcnJvci5JTlZBTElEX1NFUlZFUl9BUFBfRU5WSVJPTk1FTlQgKi9dOiAnRmlyZWJhc2VTZXJ2ZXJBcHAgaXMgbm90IGZvciB1c2UgaW4gYnJvd3NlciBlbnZpcm9ubWVudHMuJ1xyXG59O1xyXG5jb25zdCBFUlJPUl9GQUNUT1JZID0gbmV3IEVycm9yRmFjdG9yeSgnYXBwJywgJ0ZpcmViYXNlJywgRVJST1JTKTtcblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDE5IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuY2xhc3MgRmlyZWJhc2VBcHBJbXBsIHtcclxuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMsIGNvbmZpZywgY29udGFpbmVyKSB7XHJcbiAgICAgICAgdGhpcy5faXNEZWxldGVkID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5fb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe30sIG9wdGlvbnMpO1xyXG4gICAgICAgIHRoaXMuX2NvbmZpZyA9IE9iamVjdC5hc3NpZ24oe30sIGNvbmZpZyk7XHJcbiAgICAgICAgdGhpcy5fbmFtZSA9IGNvbmZpZy5uYW1lO1xyXG4gICAgICAgIHRoaXMuX2F1dG9tYXRpY0RhdGFDb2xsZWN0aW9uRW5hYmxlZCA9XHJcbiAgICAgICAgICAgIGNvbmZpZy5hdXRvbWF0aWNEYXRhQ29sbGVjdGlvbkVuYWJsZWQ7XHJcbiAgICAgICAgdGhpcy5fY29udGFpbmVyID0gY29udGFpbmVyO1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyLmFkZENvbXBvbmVudChuZXcgQ29tcG9uZW50KCdhcHAnLCAoKSA9PiB0aGlzLCBcIlBVQkxJQ1wiIC8qIENvbXBvbmVudFR5cGUuUFVCTElDICovKSk7XHJcbiAgICB9XHJcbiAgICBnZXQgYXV0b21hdGljRGF0YUNvbGxlY3Rpb25FbmFibGVkKCkge1xyXG4gICAgICAgIHRoaXMuY2hlY2tEZXN0cm95ZWQoKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5fYXV0b21hdGljRGF0YUNvbGxlY3Rpb25FbmFibGVkO1xyXG4gICAgfVxyXG4gICAgc2V0IGF1dG9tYXRpY0RhdGFDb2xsZWN0aW9uRW5hYmxlZCh2YWwpIHtcclxuICAgICAgICB0aGlzLmNoZWNrRGVzdHJveWVkKCk7XHJcbiAgICAgICAgdGhpcy5fYXV0b21hdGljRGF0YUNvbGxlY3Rpb25FbmFibGVkID0gdmFsO1xyXG4gICAgfVxyXG4gICAgZ2V0IG5hbWUoKSB7XHJcbiAgICAgICAgdGhpcy5jaGVja0Rlc3Ryb3llZCgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9uYW1lO1xyXG4gICAgfVxyXG4gICAgZ2V0IG9wdGlvbnMoKSB7XHJcbiAgICAgICAgdGhpcy5jaGVja0Rlc3Ryb3llZCgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9vcHRpb25zO1xyXG4gICAgfVxyXG4gICAgZ2V0IGNvbmZpZygpIHtcclxuICAgICAgICB0aGlzLmNoZWNrRGVzdHJveWVkKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbmZpZztcclxuICAgIH1cclxuICAgIGdldCBjb250YWluZXIoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbnRhaW5lcjtcclxuICAgIH1cclxuICAgIGdldCBpc0RlbGV0ZWQoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2lzRGVsZXRlZDtcclxuICAgIH1cclxuICAgIHNldCBpc0RlbGV0ZWQodmFsKSB7XHJcbiAgICAgICAgdGhpcy5faXNEZWxldGVkID0gdmFsO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBUaGlzIGZ1bmN0aW9uIHdpbGwgdGhyb3cgYW4gRXJyb3IgaWYgdGhlIEFwcCBoYXMgYWxyZWFkeSBiZWVuIGRlbGV0ZWQgLVxyXG4gICAgICogdXNlIGJlZm9yZSBwZXJmb3JtaW5nIEFQSSBhY3Rpb25zIG9uIHRoZSBBcHAuXHJcbiAgICAgKi9cclxuICAgIGNoZWNrRGVzdHJveWVkKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmlzRGVsZXRlZCkge1xyXG4gICAgICAgICAgICB0aHJvdyBFUlJPUl9GQUNUT1JZLmNyZWF0ZShcImFwcC1kZWxldGVkXCIgLyogQXBwRXJyb3IuQVBQX0RFTEVURUQgKi8sIHsgYXBwTmFtZTogdGhpcy5fbmFtZSB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDIzIEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuY2xhc3MgRmlyZWJhc2VTZXJ2ZXJBcHBJbXBsIGV4dGVuZHMgRmlyZWJhc2VBcHBJbXBsIHtcclxuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMsIHNlcnZlckNvbmZpZywgbmFtZSwgY29udGFpbmVyKSB7XHJcbiAgICAgICAgLy8gQnVpbGQgY29uZmlndXJhdGlvbiBwYXJhbWV0ZXJzIGZvciB0aGUgRmlyZWJhc2VBcHBJbXBsIGJhc2UgY2xhc3MuXHJcbiAgICAgICAgY29uc3QgYXV0b21hdGljRGF0YUNvbGxlY3Rpb25FbmFibGVkID0gc2VydmVyQ29uZmlnLmF1dG9tYXRpY0RhdGFDb2xsZWN0aW9uRW5hYmxlZCAhPT0gdW5kZWZpbmVkXHJcbiAgICAgICAgICAgID8gc2VydmVyQ29uZmlnLmF1dG9tYXRpY0RhdGFDb2xsZWN0aW9uRW5hYmxlZFxyXG4gICAgICAgICAgICA6IGZhbHNlO1xyXG4gICAgICAgIC8vIENyZWF0ZSB0aGUgRmlyZWJhc2VBcHBTZXR0aW5ncyBvYmplY3QgZm9yIHRoZSBGaXJlYmFzZUFwcEltcCBjb25zdHJ1Y3Rvci5cclxuICAgICAgICBjb25zdCBjb25maWcgPSB7XHJcbiAgICAgICAgICAgIG5hbWUsXHJcbiAgICAgICAgICAgIGF1dG9tYXRpY0RhdGFDb2xsZWN0aW9uRW5hYmxlZFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgaWYgKG9wdGlvbnMuYXBpS2V5ICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgLy8gQ29uc3RydWN0IHRoZSBwYXJlbnQgRmlyZWJhc2VBcHBJbXAgb2JqZWN0LlxyXG4gICAgICAgICAgICBzdXBlcihvcHRpb25zLCBjb25maWcsIGNvbnRhaW5lcik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zdCBhcHBJbXBsID0gb3B0aW9ucztcclxuICAgICAgICAgICAgc3VwZXIoYXBwSW1wbC5vcHRpb25zLCBjb25maWcsIGNvbnRhaW5lcik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIE5vdyBjb25zdHJ1Y3QgdGhlIGRhdGEgZm9yIHRoZSBGaXJlYmFzZVNlcnZlckFwcEltcGwuXHJcbiAgICAgICAgdGhpcy5fc2VydmVyQ29uZmlnID0gT2JqZWN0LmFzc2lnbih7IGF1dG9tYXRpY0RhdGFDb2xsZWN0aW9uRW5hYmxlZCB9LCBzZXJ2ZXJDb25maWcpO1xyXG4gICAgICAgIHRoaXMuX2ZpbmFsaXphdGlvblJlZ2lzdHJ5ID0gbnVsbDtcclxuICAgICAgICBpZiAodHlwZW9mIEZpbmFsaXphdGlvblJlZ2lzdHJ5ICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICB0aGlzLl9maW5hbGl6YXRpb25SZWdpc3RyeSA9IG5ldyBGaW5hbGl6YXRpb25SZWdpc3RyeSgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmF1dG9tYXRpY0NsZWFudXAoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX3JlZkNvdW50ID0gMDtcclxuICAgICAgICB0aGlzLmluY1JlZkNvdW50KHRoaXMuX3NlcnZlckNvbmZpZy5yZWxlYXNlT25EZXJlZik7XHJcbiAgICAgICAgLy8gRG8gbm90IHJldGFpbiBhIGhhcmQgcmVmZXJlbmNlIHRvIHRoZSBkcmVmIG9iamVjdCwgb3RoZXJ3aXNlIHRoZSBGaW5hbGl6YXRpb25SZWdpc3RyeVxyXG4gICAgICAgIC8vIHdpbGwgbmV2ZXIgdHJpZ2dlci5cclxuICAgICAgICB0aGlzLl9zZXJ2ZXJDb25maWcucmVsZWFzZU9uRGVyZWYgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgc2VydmVyQ29uZmlnLnJlbGVhc2VPbkRlcmVmID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIHJlZ2lzdGVyVmVyc2lvbihuYW1lJHAsIHZlcnNpb24kMSwgJ3NlcnZlcmFwcCcpO1xyXG4gICAgfVxyXG4gICAgdG9KU09OKCkge1xyXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICB9XHJcbiAgICBnZXQgcmVmQ291bnQoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3JlZkNvdW50O1xyXG4gICAgfVxyXG4gICAgLy8gSW5jcmVtZW50IHRoZSByZWZlcmVuY2UgY291bnQgb2YgdGhpcyBzZXJ2ZXIgYXBwLiBJZiBhbiBvYmplY3QgaXMgcHJvdmlkZWQsIHJlZ2lzdGVyIGl0XHJcbiAgICAvLyB3aXRoIHRoZSBmaW5hbGl6YXRpb24gcmVnaXN0cnkuXHJcbiAgICBpbmNSZWZDb3VudChvYmopIHtcclxuICAgICAgICBpZiAodGhpcy5pc0RlbGV0ZWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9yZWZDb3VudCsrO1xyXG4gICAgICAgIGlmIChvYmogIT09IHVuZGVmaW5lZCAmJiB0aGlzLl9maW5hbGl6YXRpb25SZWdpc3RyeSAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLl9maW5hbGl6YXRpb25SZWdpc3RyeS5yZWdpc3RlcihvYmosIHRoaXMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8vIERlY3JlbWVudCB0aGUgcmVmZXJlbmNlIGNvdW50LlxyXG4gICAgZGVjUmVmQ291bnQoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNEZWxldGVkKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gLS10aGlzLl9yZWZDb3VudDtcclxuICAgIH1cclxuICAgIC8vIEludm9rZWQgYnkgdGhlIEZpbmFsaXphdGlvblJlZ2lzdHJ5IGNhbGxiYWNrIHRvIG5vdGUgdGhhdCB0aGlzIGFwcCBzaG91bGQgZ28gdGhyb3VnaCBpdHNcclxuICAgIC8vIHJlZmVyZW5jZSBjb3VudHMgYW5kIGRlbGV0ZSBpdHNlbGYgaWYgbm8gcmVmZXJlbmNlIGNvdW50IHJlbWFpbi4gVGhlIGNvb3JkaW5hdGluZyBsb2dpYyB0aGF0XHJcbiAgICAvLyBoYW5kbGVzIHRoaXMgaXMgaW4gZGVsZXRlQXBwKC4uLikuXHJcbiAgICBhdXRvbWF0aWNDbGVhbnVwKCkge1xyXG4gICAgICAgIHZvaWQgZGVsZXRlQXBwKHRoaXMpO1xyXG4gICAgfVxyXG4gICAgZ2V0IHNldHRpbmdzKCkge1xyXG4gICAgICAgIHRoaXMuY2hlY2tEZXN0cm95ZWQoKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc2VydmVyQ29uZmlnO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBUaGlzIGZ1bmN0aW9uIHdpbGwgdGhyb3cgYW4gRXJyb3IgaWYgdGhlIEFwcCBoYXMgYWxyZWFkeSBiZWVuIGRlbGV0ZWQgLVxyXG4gICAgICogdXNlIGJlZm9yZSBwZXJmb3JtaW5nIEFQSSBhY3Rpb25zIG9uIHRoZSBBcHAuXHJcbiAgICAgKi9cclxuICAgIGNoZWNrRGVzdHJveWVkKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmlzRGVsZXRlZCkge1xyXG4gICAgICAgICAgICB0aHJvdyBFUlJPUl9GQUNUT1JZLmNyZWF0ZShcInNlcnZlci1hcHAtZGVsZXRlZFwiIC8qIEFwcEVycm9yLlNFUlZFUl9BUFBfREVMRVRFRCAqLyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAxOSBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbi8qKlxyXG4gKiBUaGUgY3VycmVudCBTREsgdmVyc2lvbi5cclxuICpcclxuICogQHB1YmxpY1xyXG4gKi9cclxuY29uc3QgU0RLX1ZFUlNJT04gPSB2ZXJzaW9uO1xyXG5mdW5jdGlvbiBpbml0aWFsaXplQXBwKF9vcHRpb25zLCByYXdDb25maWcgPSB7fSkge1xyXG4gICAgbGV0IG9wdGlvbnMgPSBfb3B0aW9ucztcclxuICAgIGlmICh0eXBlb2YgcmF3Q29uZmlnICE9PSAnb2JqZWN0Jykge1xyXG4gICAgICAgIGNvbnN0IG5hbWUgPSByYXdDb25maWc7XHJcbiAgICAgICAgcmF3Q29uZmlnID0geyBuYW1lIH07XHJcbiAgICB9XHJcbiAgICBjb25zdCBjb25maWcgPSBPYmplY3QuYXNzaWduKHsgbmFtZTogREVGQVVMVF9FTlRSWV9OQU1FLCBhdXRvbWF0aWNEYXRhQ29sbGVjdGlvbkVuYWJsZWQ6IGZhbHNlIH0sIHJhd0NvbmZpZyk7XHJcbiAgICBjb25zdCBuYW1lID0gY29uZmlnLm5hbWU7XHJcbiAgICBpZiAodHlwZW9mIG5hbWUgIT09ICdzdHJpbmcnIHx8ICFuYW1lKSB7XHJcbiAgICAgICAgdGhyb3cgRVJST1JfRkFDVE9SWS5jcmVhdGUoXCJiYWQtYXBwLW5hbWVcIiAvKiBBcHBFcnJvci5CQURfQVBQX05BTUUgKi8sIHtcclxuICAgICAgICAgICAgYXBwTmFtZTogU3RyaW5nKG5hbWUpXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBvcHRpb25zIHx8IChvcHRpb25zID0gZ2V0RGVmYXVsdEFwcENvbmZpZygpKTtcclxuICAgIGlmICghb3B0aW9ucykge1xyXG4gICAgICAgIHRocm93IEVSUk9SX0ZBQ1RPUlkuY3JlYXRlKFwibm8tb3B0aW9uc1wiIC8qIEFwcEVycm9yLk5PX09QVElPTlMgKi8pO1xyXG4gICAgfVxyXG4gICAgY29uc3QgZXhpc3RpbmdBcHAgPSBfYXBwcy5nZXQobmFtZSk7XHJcbiAgICBpZiAoZXhpc3RpbmdBcHApIHtcclxuICAgICAgICAvLyByZXR1cm4gdGhlIGV4aXN0aW5nIGFwcCBpZiBvcHRpb25zIGFuZCBjb25maWcgZGVlcCBlcXVhbCB0aGUgb25lcyBpbiB0aGUgZXhpc3RpbmcgYXBwLlxyXG4gICAgICAgIGlmIChkZWVwRXF1YWwob3B0aW9ucywgZXhpc3RpbmdBcHAub3B0aW9ucykgJiZcclxuICAgICAgICAgICAgZGVlcEVxdWFsKGNvbmZpZywgZXhpc3RpbmdBcHAuY29uZmlnKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZXhpc3RpbmdBcHA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aHJvdyBFUlJPUl9GQUNUT1JZLmNyZWF0ZShcImR1cGxpY2F0ZS1hcHBcIiAvKiBBcHBFcnJvci5EVVBMSUNBVEVfQVBQICovLCB7IGFwcE5hbWU6IG5hbWUgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgY29uc3QgY29udGFpbmVyID0gbmV3IENvbXBvbmVudENvbnRhaW5lcihuYW1lKTtcclxuICAgIGZvciAoY29uc3QgY29tcG9uZW50IG9mIF9jb21wb25lbnRzLnZhbHVlcygpKSB7XHJcbiAgICAgICAgY29udGFpbmVyLmFkZENvbXBvbmVudChjb21wb25lbnQpO1xyXG4gICAgfVxyXG4gICAgY29uc3QgbmV3QXBwID0gbmV3IEZpcmViYXNlQXBwSW1wbChvcHRpb25zLCBjb25maWcsIGNvbnRhaW5lcik7XHJcbiAgICBfYXBwcy5zZXQobmFtZSwgbmV3QXBwKTtcclxuICAgIHJldHVybiBuZXdBcHA7XHJcbn1cclxuZnVuY3Rpb24gaW5pdGlhbGl6ZVNlcnZlckFwcChfb3B0aW9ucywgX3NlcnZlckFwcENvbmZpZykge1xyXG4gICAgaWYgKGlzQnJvd3NlcigpICYmICFpc1dlYldvcmtlcigpKSB7XHJcbiAgICAgICAgLy8gRmlyZWJhc2VTZXJ2ZXJBcHAgaXNuJ3QgZGVzaWduZWQgdG8gYmUgcnVuIGluIGJyb3dzZXJzLlxyXG4gICAgICAgIHRocm93IEVSUk9SX0ZBQ1RPUlkuY3JlYXRlKFwiaW52YWxpZC1zZXJ2ZXItYXBwLWVudmlyb25tZW50XCIgLyogQXBwRXJyb3IuSU5WQUxJRF9TRVJWRVJfQVBQX0VOVklST05NRU5UICovKTtcclxuICAgIH1cclxuICAgIGlmIChfc2VydmVyQXBwQ29uZmlnLmF1dG9tYXRpY0RhdGFDb2xsZWN0aW9uRW5hYmxlZCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgX3NlcnZlckFwcENvbmZpZy5hdXRvbWF0aWNEYXRhQ29sbGVjdGlvbkVuYWJsZWQgPSBmYWxzZTtcclxuICAgIH1cclxuICAgIGxldCBhcHBPcHRpb25zO1xyXG4gICAgaWYgKF9pc0ZpcmViYXNlQXBwKF9vcHRpb25zKSkge1xyXG4gICAgICAgIGFwcE9wdGlvbnMgPSBfb3B0aW9ucy5vcHRpb25zO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgYXBwT3B0aW9ucyA9IF9vcHRpb25zO1xyXG4gICAgfVxyXG4gICAgLy8gQnVpbGQgYW4gYXBwIG5hbWUgYmFzZWQgb24gYSBoYXNoIG9mIHRoZSBjb25maWd1cmF0aW9uIG9wdGlvbnMuXHJcbiAgICBjb25zdCBuYW1lT2JqID0gT2JqZWN0LmFzc2lnbihPYmplY3QuYXNzaWduKHt9LCBfc2VydmVyQXBwQ29uZmlnKSwgYXBwT3B0aW9ucyk7XHJcbiAgICAvLyBIb3dldmVyLCBEbyBub3QgbWFuZ2xlIHRoZSBuYW1lIGJhc2VkIG9uIHJlbGVhc2VPbkRlcmVmLCBzaW5jZSBpdCB3aWxsIHZhcnkgYmV0d2VlbiB0aGVcclxuICAgIC8vIGNvbnN0cnVjdGlvbiBvZiBGaXJlYmFzZVNlcnZlckFwcCBpbnN0YW5jZXMuIEZvciBleGFtcGxlLCBpZiB0aGUgb2JqZWN0IGlzIHRoZSByZXF1ZXN0IGhlYWRlcnMuXHJcbiAgICBpZiAobmFtZU9iai5yZWxlYXNlT25EZXJlZiAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgZGVsZXRlIG5hbWVPYmoucmVsZWFzZU9uRGVyZWY7XHJcbiAgICB9XHJcbiAgICBjb25zdCBoYXNoQ29kZSA9IChzKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIFsuLi5zXS5yZWR1Y2UoKGhhc2gsIGMpID0+IChNYXRoLmltdWwoMzEsIGhhc2gpICsgYy5jaGFyQ29kZUF0KDApKSB8IDAsIDApO1xyXG4gICAgfTtcclxuICAgIGlmIChfc2VydmVyQXBwQ29uZmlnLnJlbGVhc2VPbkRlcmVmICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICBpZiAodHlwZW9mIEZpbmFsaXphdGlvblJlZ2lzdHJ5ID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICB0aHJvdyBFUlJPUl9GQUNUT1JZLmNyZWF0ZShcImZpbmFsaXphdGlvbi1yZWdpc3RyeS1ub3Qtc3VwcG9ydGVkXCIgLyogQXBwRXJyb3IuRklOQUxJWkFUSU9OX1JFR0lTVFJZX05PVF9TVVBQT1JURUQgKi8sIHt9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBjb25zdCBuYW1lU3RyaW5nID0gJycgKyBoYXNoQ29kZShKU09OLnN0cmluZ2lmeShuYW1lT2JqKSk7XHJcbiAgICBjb25zdCBleGlzdGluZ0FwcCA9IF9zZXJ2ZXJBcHBzLmdldChuYW1lU3RyaW5nKTtcclxuICAgIGlmIChleGlzdGluZ0FwcCkge1xyXG4gICAgICAgIGV4aXN0aW5nQXBwLmluY1JlZkNvdW50KF9zZXJ2ZXJBcHBDb25maWcucmVsZWFzZU9uRGVyZWYpO1xyXG4gICAgICAgIHJldHVybiBleGlzdGluZ0FwcDtcclxuICAgIH1cclxuICAgIGNvbnN0IGNvbnRhaW5lciA9IG5ldyBDb21wb25lbnRDb250YWluZXIobmFtZVN0cmluZyk7XHJcbiAgICBmb3IgKGNvbnN0IGNvbXBvbmVudCBvZiBfY29tcG9uZW50cy52YWx1ZXMoKSkge1xyXG4gICAgICAgIGNvbnRhaW5lci5hZGRDb21wb25lbnQoY29tcG9uZW50KTtcclxuICAgIH1cclxuICAgIGNvbnN0IG5ld0FwcCA9IG5ldyBGaXJlYmFzZVNlcnZlckFwcEltcGwoYXBwT3B0aW9ucywgX3NlcnZlckFwcENvbmZpZywgbmFtZVN0cmluZywgY29udGFpbmVyKTtcclxuICAgIF9zZXJ2ZXJBcHBzLnNldChuYW1lU3RyaW5nLCBuZXdBcHApO1xyXG4gICAgcmV0dXJuIG5ld0FwcDtcclxufVxyXG4vKipcclxuICogUmV0cmlldmVzIGEge0BsaW5rIEBmaXJlYmFzZS9hcHAjRmlyZWJhc2VBcHB9IGluc3RhbmNlLlxyXG4gKlxyXG4gKiBXaGVuIGNhbGxlZCB3aXRoIG5vIGFyZ3VtZW50cywgdGhlIGRlZmF1bHQgYXBwIGlzIHJldHVybmVkLiBXaGVuIGFuIGFwcCBuYW1lXHJcbiAqIGlzIHByb3ZpZGVkLCB0aGUgYXBwIGNvcnJlc3BvbmRpbmcgdG8gdGhhdCBuYW1lIGlzIHJldHVybmVkLlxyXG4gKlxyXG4gKiBBbiBleGNlcHRpb24gaXMgdGhyb3duIGlmIHRoZSBhcHAgYmVpbmcgcmV0cmlldmVkIGhhcyBub3QgeWV0IGJlZW5cclxuICogaW5pdGlhbGl6ZWQuXHJcbiAqXHJcbiAqIEBleGFtcGxlXHJcbiAqIGBgYGphdmFzY3JpcHRcclxuICogLy8gUmV0dXJuIHRoZSBkZWZhdWx0IGFwcFxyXG4gKiBjb25zdCBhcHAgPSBnZXRBcHAoKTtcclxuICogYGBgXHJcbiAqXHJcbiAqIEBleGFtcGxlXHJcbiAqIGBgYGphdmFzY3JpcHRcclxuICogLy8gUmV0dXJuIGEgbmFtZWQgYXBwXHJcbiAqIGNvbnN0IG90aGVyQXBwID0gZ2V0QXBwKFwib3RoZXJBcHBcIik7XHJcbiAqIGBgYFxyXG4gKlxyXG4gKiBAcGFyYW0gbmFtZSAtIE9wdGlvbmFsIG5hbWUgb2YgdGhlIGFwcCB0byByZXR1cm4uIElmIG5vIG5hbWUgaXNcclxuICogICBwcm92aWRlZCwgdGhlIGRlZmF1bHQgaXMgYFwiW0RFRkFVTFRdXCJgLlxyXG4gKlxyXG4gKiBAcmV0dXJucyBUaGUgYXBwIGNvcnJlc3BvbmRpbmcgdG8gdGhlIHByb3ZpZGVkIGFwcCBuYW1lLlxyXG4gKiAgIElmIG5vIGFwcCBuYW1lIGlzIHByb3ZpZGVkLCB0aGUgZGVmYXVsdCBhcHAgaXMgcmV0dXJuZWQuXHJcbiAqXHJcbiAqIEBwdWJsaWNcclxuICovXHJcbmZ1bmN0aW9uIGdldEFwcChuYW1lID0gREVGQVVMVF9FTlRSWV9OQU1FKSB7XHJcbiAgICBjb25zdCBhcHAgPSBfYXBwcy5nZXQobmFtZSk7XHJcbiAgICBpZiAoIWFwcCAmJiBuYW1lID09PSBERUZBVUxUX0VOVFJZX05BTUUgJiYgZ2V0RGVmYXVsdEFwcENvbmZpZygpKSB7XHJcbiAgICAgICAgcmV0dXJuIGluaXRpYWxpemVBcHAoKTtcclxuICAgIH1cclxuICAgIGlmICghYXBwKSB7XHJcbiAgICAgICAgdGhyb3cgRVJST1JfRkFDVE9SWS5jcmVhdGUoXCJuby1hcHBcIiAvKiBBcHBFcnJvci5OT19BUFAgKi8sIHsgYXBwTmFtZTogbmFtZSB9KTtcclxuICAgIH1cclxuICAgIHJldHVybiBhcHA7XHJcbn1cclxuLyoqXHJcbiAqIEEgKHJlYWQtb25seSkgYXJyYXkgb2YgYWxsIGluaXRpYWxpemVkIGFwcHMuXHJcbiAqIEBwdWJsaWNcclxuICovXHJcbmZ1bmN0aW9uIGdldEFwcHMoKSB7XHJcbiAgICByZXR1cm4gQXJyYXkuZnJvbShfYXBwcy52YWx1ZXMoKSk7XHJcbn1cclxuLyoqXHJcbiAqIFJlbmRlcnMgdGhpcyBhcHAgdW51c2FibGUgYW5kIGZyZWVzIHRoZSByZXNvdXJjZXMgb2YgYWxsIGFzc29jaWF0ZWRcclxuICogc2VydmljZXMuXHJcbiAqXHJcbiAqIEBleGFtcGxlXHJcbiAqIGBgYGphdmFzY3JpcHRcclxuICogZGVsZXRlQXBwKGFwcClcclxuICogICAudGhlbihmdW5jdGlvbigpIHtcclxuICogICAgIGNvbnNvbGUubG9nKFwiQXBwIGRlbGV0ZWQgc3VjY2Vzc2Z1bGx5XCIpO1xyXG4gKiAgIH0pXHJcbiAqICAgLmNhdGNoKGZ1bmN0aW9uKGVycm9yKSB7XHJcbiAqICAgICBjb25zb2xlLmxvZyhcIkVycm9yIGRlbGV0aW5nIGFwcDpcIiwgZXJyb3IpO1xyXG4gKiAgIH0pO1xyXG4gKiBgYGBcclxuICpcclxuICogQHB1YmxpY1xyXG4gKi9cclxuYXN5bmMgZnVuY3Rpb24gZGVsZXRlQXBwKGFwcCkge1xyXG4gICAgbGV0IGNsZWFudXBQcm92aWRlcnMgPSBmYWxzZTtcclxuICAgIGNvbnN0IG5hbWUgPSBhcHAubmFtZTtcclxuICAgIGlmIChfYXBwcy5oYXMobmFtZSkpIHtcclxuICAgICAgICBjbGVhbnVwUHJvdmlkZXJzID0gdHJ1ZTtcclxuICAgICAgICBfYXBwcy5kZWxldGUobmFtZSk7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChfc2VydmVyQXBwcy5oYXMobmFtZSkpIHtcclxuICAgICAgICBjb25zdCBmaXJlYmFzZVNlcnZlckFwcCA9IGFwcDtcclxuICAgICAgICBpZiAoZmlyZWJhc2VTZXJ2ZXJBcHAuZGVjUmVmQ291bnQoKSA8PSAwKSB7XHJcbiAgICAgICAgICAgIF9zZXJ2ZXJBcHBzLmRlbGV0ZShuYW1lKTtcclxuICAgICAgICAgICAgY2xlYW51cFByb3ZpZGVycyA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgaWYgKGNsZWFudXBQcm92aWRlcnMpIHtcclxuICAgICAgICBhd2FpdCBQcm9taXNlLmFsbChhcHAuY29udGFpbmVyXHJcbiAgICAgICAgICAgIC5nZXRQcm92aWRlcnMoKVxyXG4gICAgICAgICAgICAubWFwKHByb3ZpZGVyID0+IHByb3ZpZGVyLmRlbGV0ZSgpKSk7XHJcbiAgICAgICAgYXBwLmlzRGVsZXRlZCA9IHRydWU7XHJcbiAgICB9XHJcbn1cclxuLyoqXHJcbiAqIFJlZ2lzdGVycyBhIGxpYnJhcnkncyBuYW1lIGFuZCB2ZXJzaW9uIGZvciBwbGF0Zm9ybSBsb2dnaW5nIHB1cnBvc2VzLlxyXG4gKiBAcGFyYW0gbGlicmFyeSAtIE5hbWUgb2YgMXAgb3IgM3AgbGlicmFyeSAoZS5nLiBmaXJlc3RvcmUsIGFuZ3VsYXJmaXJlKVxyXG4gKiBAcGFyYW0gdmVyc2lvbiAtIEN1cnJlbnQgdmVyc2lvbiBvZiB0aGF0IGxpYnJhcnkuXHJcbiAqIEBwYXJhbSB2YXJpYW50IC0gQnVuZGxlIHZhcmlhbnQsIGUuZy4sIG5vZGUsIHJuLCBldGMuXHJcbiAqXHJcbiAqIEBwdWJsaWNcclxuICovXHJcbmZ1bmN0aW9uIHJlZ2lzdGVyVmVyc2lvbihsaWJyYXJ5S2V5T3JOYW1lLCB2ZXJzaW9uLCB2YXJpYW50KSB7XHJcbiAgICB2YXIgX2E7XHJcbiAgICAvLyBUT0RPOiBXZSBjYW4gdXNlIHRoaXMgY2hlY2sgdG8gd2hpdGVsaXN0IHN0cmluZ3Mgd2hlbi9pZiB3ZSBzZXQgdXBcclxuICAgIC8vIGEgZ29vZCB3aGl0ZWxpc3Qgc3lzdGVtLlxyXG4gICAgbGV0IGxpYnJhcnkgPSAoX2EgPSBQTEFURk9STV9MT0dfU1RSSU5HW2xpYnJhcnlLZXlPck5hbWVdKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiBsaWJyYXJ5S2V5T3JOYW1lO1xyXG4gICAgaWYgKHZhcmlhbnQpIHtcclxuICAgICAgICBsaWJyYXJ5ICs9IGAtJHt2YXJpYW50fWA7XHJcbiAgICB9XHJcbiAgICBjb25zdCBsaWJyYXJ5TWlzbWF0Y2ggPSBsaWJyYXJ5Lm1hdGNoKC9cXHN8XFwvLyk7XHJcbiAgICBjb25zdCB2ZXJzaW9uTWlzbWF0Y2ggPSB2ZXJzaW9uLm1hdGNoKC9cXHN8XFwvLyk7XHJcbiAgICBpZiAobGlicmFyeU1pc21hdGNoIHx8IHZlcnNpb25NaXNtYXRjaCkge1xyXG4gICAgICAgIGNvbnN0IHdhcm5pbmcgPSBbXHJcbiAgICAgICAgICAgIGBVbmFibGUgdG8gcmVnaXN0ZXIgbGlicmFyeSBcIiR7bGlicmFyeX1cIiB3aXRoIHZlcnNpb24gXCIke3ZlcnNpb259XCI6YFxyXG4gICAgICAgIF07XHJcbiAgICAgICAgaWYgKGxpYnJhcnlNaXNtYXRjaCkge1xyXG4gICAgICAgICAgICB3YXJuaW5nLnB1c2goYGxpYnJhcnkgbmFtZSBcIiR7bGlicmFyeX1cIiBjb250YWlucyBpbGxlZ2FsIGNoYXJhY3RlcnMgKHdoaXRlc3BhY2Ugb3IgXCIvXCIpYCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChsaWJyYXJ5TWlzbWF0Y2ggJiYgdmVyc2lvbk1pc21hdGNoKSB7XHJcbiAgICAgICAgICAgIHdhcm5pbmcucHVzaCgnYW5kJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh2ZXJzaW9uTWlzbWF0Y2gpIHtcclxuICAgICAgICAgICAgd2FybmluZy5wdXNoKGB2ZXJzaW9uIG5hbWUgXCIke3ZlcnNpb259XCIgY29udGFpbnMgaWxsZWdhbCBjaGFyYWN0ZXJzICh3aGl0ZXNwYWNlIG9yIFwiL1wiKWApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsb2dnZXIud2Fybih3YXJuaW5nLmpvaW4oJyAnKSk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgX3JlZ2lzdGVyQ29tcG9uZW50KG5ldyBDb21wb25lbnQoYCR7bGlicmFyeX0tdmVyc2lvbmAsICgpID0+ICh7IGxpYnJhcnksIHZlcnNpb24gfSksIFwiVkVSU0lPTlwiIC8qIENvbXBvbmVudFR5cGUuVkVSU0lPTiAqLykpO1xyXG59XHJcbi8qKlxyXG4gKiBTZXRzIGxvZyBoYW5kbGVyIGZvciBhbGwgRmlyZWJhc2UgU0RLcy5cclxuICogQHBhcmFtIGxvZ0NhbGxiYWNrIC0gQW4gb3B0aW9uYWwgY3VzdG9tIGxvZyBoYW5kbGVyIHRoYXQgZXhlY3V0ZXMgdXNlciBjb2RlIHdoZW5ldmVyXHJcbiAqIHRoZSBGaXJlYmFzZSBTREsgbWFrZXMgYSBsb2dnaW5nIGNhbGwuXHJcbiAqXHJcbiAqIEBwdWJsaWNcclxuICovXHJcbmZ1bmN0aW9uIG9uTG9nKGxvZ0NhbGxiYWNrLCBvcHRpb25zKSB7XHJcbiAgICBpZiAobG9nQ2FsbGJhY2sgIT09IG51bGwgJiYgdHlwZW9mIGxvZ0NhbGxiYWNrICE9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgdGhyb3cgRVJST1JfRkFDVE9SWS5jcmVhdGUoXCJpbnZhbGlkLWxvZy1hcmd1bWVudFwiIC8qIEFwcEVycm9yLklOVkFMSURfTE9HX0FSR1VNRU5UICovKTtcclxuICAgIH1cclxuICAgIHNldFVzZXJMb2dIYW5kbGVyKGxvZ0NhbGxiYWNrLCBvcHRpb25zKTtcclxufVxyXG4vKipcclxuICogU2V0cyBsb2cgbGV2ZWwgZm9yIGFsbCBGaXJlYmFzZSBTREtzLlxyXG4gKlxyXG4gKiBBbGwgb2YgdGhlIGxvZyB0eXBlcyBhYm92ZSB0aGUgY3VycmVudCBsb2cgbGV2ZWwgYXJlIGNhcHR1cmVkIChpLmUuIGlmXHJcbiAqIHlvdSBzZXQgdGhlIGxvZyBsZXZlbCB0byBgaW5mb2AsIGVycm9ycyBhcmUgbG9nZ2VkLCBidXQgYGRlYnVnYCBhbmRcclxuICogYHZlcmJvc2VgIGxvZ3MgYXJlIG5vdCkuXHJcbiAqXHJcbiAqIEBwdWJsaWNcclxuICovXHJcbmZ1bmN0aW9uIHNldExvZ0xldmVsKGxvZ0xldmVsKSB7XHJcbiAgICBzZXRMb2dMZXZlbCQxKGxvZ0xldmVsKTtcclxufVxuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMjEgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG5jb25zdCBEQl9OQU1FID0gJ2ZpcmViYXNlLWhlYXJ0YmVhdC1kYXRhYmFzZSc7XHJcbmNvbnN0IERCX1ZFUlNJT04gPSAxO1xyXG5jb25zdCBTVE9SRV9OQU1FID0gJ2ZpcmViYXNlLWhlYXJ0YmVhdC1zdG9yZSc7XHJcbmxldCBkYlByb21pc2UgPSBudWxsO1xyXG5mdW5jdGlvbiBnZXREYlByb21pc2UoKSB7XHJcbiAgICBpZiAoIWRiUHJvbWlzZSkge1xyXG4gICAgICAgIGRiUHJvbWlzZSA9IG9wZW5EQihEQl9OQU1FLCBEQl9WRVJTSU9OLCB7XHJcbiAgICAgICAgICAgIHVwZ3JhZGU6IChkYiwgb2xkVmVyc2lvbikgPT4ge1xyXG4gICAgICAgICAgICAgICAgLy8gV2UgZG9uJ3QgdXNlICdicmVhaycgaW4gdGhpcyBzd2l0Y2ggc3RhdGVtZW50LCB0aGUgZmFsbC10aHJvdWdoXHJcbiAgICAgICAgICAgICAgICAvLyBiZWhhdmlvciBpcyB3aGF0IHdlIHdhbnQsIGJlY2F1c2UgaWYgdGhlcmUgYXJlIG11bHRpcGxlIHZlcnNpb25zIGJldHdlZW5cclxuICAgICAgICAgICAgICAgIC8vIHRoZSBvbGQgdmVyc2lvbiBhbmQgdGhlIGN1cnJlbnQgdmVyc2lvbiwgd2Ugd2FudCBBTEwgdGhlIG1pZ3JhdGlvbnNcclxuICAgICAgICAgICAgICAgIC8vIHRoYXQgY29ycmVzcG9uZCB0byB0aG9zZSB2ZXJzaW9ucyB0byBydW4sIG5vdCBvbmx5IHRoZSBsYXN0IG9uZS5cclxuICAgICAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBkZWZhdWx0LWNhc2VcclxuICAgICAgICAgICAgICAgIHN3aXRjaCAob2xkVmVyc2lvbikge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRiLmNyZWF0ZU9iamVjdFN0b3JlKFNUT1JFX05BTUUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBTYWZhcmkvaU9TIGJyb3dzZXJzIHRocm93IG9jY2FzaW9uYWwgZXhjZXB0aW9ucyBvblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZGIuY3JlYXRlT2JqZWN0U3RvcmUoKSB0aGF0IG1heSBiZSBhIGJ1Zy4gQXZvaWQgYmxvY2tpbmdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRoZSByZXN0IG9mIHRoZSBhcHAgZnVuY3Rpb25hbGl0eS5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSkuY2F0Y2goZSA9PiB7XHJcbiAgICAgICAgICAgIHRocm93IEVSUk9SX0ZBQ1RPUlkuY3JlYXRlKFwiaWRiLW9wZW5cIiAvKiBBcHBFcnJvci5JREJfT1BFTiAqLywge1xyXG4gICAgICAgICAgICAgICAgb3JpZ2luYWxFcnJvck1lc3NhZ2U6IGUubWVzc2FnZVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIHJldHVybiBkYlByb21pc2U7XHJcbn1cclxuYXN5bmMgZnVuY3Rpb24gcmVhZEhlYXJ0YmVhdHNGcm9tSW5kZXhlZERCKGFwcCkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgICBjb25zdCBkYiA9IGF3YWl0IGdldERiUHJvbWlzZSgpO1xyXG4gICAgICAgIGNvbnN0IHR4ID0gZGIudHJhbnNhY3Rpb24oU1RPUkVfTkFNRSk7XHJcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgdHgub2JqZWN0U3RvcmUoU1RPUkVfTkFNRSkuZ2V0KGNvbXB1dGVLZXkoYXBwKSk7XHJcbiAgICAgICAgLy8gV2UgYWxyZWFkeSBoYXZlIHRoZSB2YWx1ZSBidXQgdHguZG9uZSBjYW4gdGhyb3csXHJcbiAgICAgICAgLy8gc28gd2UgbmVlZCB0byBhd2FpdCBpdCBoZXJlIHRvIGNhdGNoIGVycm9yc1xyXG4gICAgICAgIGF3YWl0IHR4LmRvbmU7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgaWYgKGUgaW5zdGFuY2VvZiBGaXJlYmFzZUVycm9yKSB7XHJcbiAgICAgICAgICAgIGxvZ2dlci53YXJuKGUubWVzc2FnZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zdCBpZGJHZXRFcnJvciA9IEVSUk9SX0ZBQ1RPUlkuY3JlYXRlKFwiaWRiLWdldFwiIC8qIEFwcEVycm9yLklEQl9HRVQgKi8sIHtcclxuICAgICAgICAgICAgICAgIG9yaWdpbmFsRXJyb3JNZXNzYWdlOiBlID09PSBudWxsIHx8IGUgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGUubWVzc2FnZVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgbG9nZ2VyLndhcm4oaWRiR2V0RXJyb3IubWVzc2FnZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbmFzeW5jIGZ1bmN0aW9uIHdyaXRlSGVhcnRiZWF0c1RvSW5kZXhlZERCKGFwcCwgaGVhcnRiZWF0T2JqZWN0KSB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IGRiID0gYXdhaXQgZ2V0RGJQcm9taXNlKCk7XHJcbiAgICAgICAgY29uc3QgdHggPSBkYi50cmFuc2FjdGlvbihTVE9SRV9OQU1FLCAncmVhZHdyaXRlJyk7XHJcbiAgICAgICAgY29uc3Qgb2JqZWN0U3RvcmUgPSB0eC5vYmplY3RTdG9yZShTVE9SRV9OQU1FKTtcclxuICAgICAgICBhd2FpdCBvYmplY3RTdG9yZS5wdXQoaGVhcnRiZWF0T2JqZWN0LCBjb21wdXRlS2V5KGFwcCkpO1xyXG4gICAgICAgIGF3YWl0IHR4LmRvbmU7XHJcbiAgICB9XHJcbiAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgIGlmIChlIGluc3RhbmNlb2YgRmlyZWJhc2VFcnJvcikge1xyXG4gICAgICAgICAgICBsb2dnZXIud2FybihlLm1lc3NhZ2UpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgY29uc3QgaWRiR2V0RXJyb3IgPSBFUlJPUl9GQUNUT1JZLmNyZWF0ZShcImlkYi1zZXRcIiAvKiBBcHBFcnJvci5JREJfV1JJVEUgKi8sIHtcclxuICAgICAgICAgICAgICAgIG9yaWdpbmFsRXJyb3JNZXNzYWdlOiBlID09PSBudWxsIHx8IGUgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGUubWVzc2FnZVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgbG9nZ2VyLndhcm4oaWRiR2V0RXJyb3IubWVzc2FnZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIGNvbXB1dGVLZXkoYXBwKSB7XHJcbiAgICByZXR1cm4gYCR7YXBwLm5hbWV9ISR7YXBwLm9wdGlvbnMuYXBwSWR9YDtcclxufVxuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMjEgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG5jb25zdCBNQVhfSEVBREVSX0JZVEVTID0gMTAyNDtcclxuLy8gMzAgZGF5c1xyXG5jb25zdCBTVE9SRURfSEVBUlRCRUFUX1JFVEVOVElPTl9NQVhfTUlMTElTID0gMzAgKiAyNCAqIDYwICogNjAgKiAxMDAwO1xyXG5jbGFzcyBIZWFydGJlYXRTZXJ2aWNlSW1wbCB7XHJcbiAgICBjb25zdHJ1Y3Rvcihjb250YWluZXIpIHtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lciA9IGNvbnRhaW5lcjtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBJbi1tZW1vcnkgY2FjaGUgZm9yIGhlYXJ0YmVhdHMsIHVzZWQgYnkgZ2V0SGVhcnRiZWF0c0hlYWRlcigpIHRvIGdlbmVyYXRlXHJcbiAgICAgICAgICogdGhlIGhlYWRlciBzdHJpbmcuXHJcbiAgICAgICAgICogU3RvcmVzIG9uZSByZWNvcmQgcGVyIGRhdGUuIFRoaXMgd2lsbCBiZSBjb25zb2xpZGF0ZWQgaW50byB0aGUgc3RhbmRhcmRcclxuICAgICAgICAgKiBmb3JtYXQgb2Ygb25lIHJlY29yZCBwZXIgdXNlciBhZ2VudCBzdHJpbmcgYmVmb3JlIGJlaW5nIHNlbnQgYXMgYSBoZWFkZXIuXHJcbiAgICAgICAgICogUG9wdWxhdGVkIGZyb20gaW5kZXhlZERCIHdoZW4gdGhlIGNvbnRyb2xsZXIgaXMgaW5zdGFudGlhdGVkIGFuZCBzaG91bGRcclxuICAgICAgICAgKiBiZSBrZXB0IGluIHN5bmMgd2l0aCBpbmRleGVkREIuXHJcbiAgICAgICAgICogTGVhdmUgcHVibGljIGZvciBlYXNpZXIgdGVzdGluZy5cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLl9oZWFydGJlYXRzQ2FjaGUgPSBudWxsO1xyXG4gICAgICAgIGNvbnN0IGFwcCA9IHRoaXMuY29udGFpbmVyLmdldFByb3ZpZGVyKCdhcHAnKS5nZXRJbW1lZGlhdGUoKTtcclxuICAgICAgICB0aGlzLl9zdG9yYWdlID0gbmV3IEhlYXJ0YmVhdFN0b3JhZ2VJbXBsKGFwcCk7XHJcbiAgICAgICAgdGhpcy5faGVhcnRiZWF0c0NhY2hlUHJvbWlzZSA9IHRoaXMuX3N0b3JhZ2UucmVhZCgpLnRoZW4ocmVzdWx0ID0+IHtcclxuICAgICAgICAgICAgdGhpcy5faGVhcnRiZWF0c0NhY2hlID0gcmVzdWx0O1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBDYWxsZWQgdG8gcmVwb3J0IGEgaGVhcnRiZWF0LiBUaGUgZnVuY3Rpb24gd2lsbCBnZW5lcmF0ZVxyXG4gICAgICogYSBIZWFydGJlYXRzQnlVc2VyQWdlbnQgb2JqZWN0LCB1cGRhdGUgaGVhcnRiZWF0c0NhY2hlLCBhbmQgcGVyc2lzdCBpdFxyXG4gICAgICogdG8gSW5kZXhlZERCLlxyXG4gICAgICogTm90ZSB0aGF0IHdlIG9ubHkgc3RvcmUgb25lIGhlYXJ0YmVhdCBwZXIgZGF5LiBTbyBpZiBhIGhlYXJ0YmVhdCBmb3IgdG9kYXkgaXNcclxuICAgICAqIGFscmVhZHkgbG9nZ2VkLCBzdWJzZXF1ZW50IGNhbGxzIHRvIHRoaXMgZnVuY3Rpb24gaW4gdGhlIHNhbWUgZGF5IHdpbGwgYmUgaWdub3JlZC5cclxuICAgICAqL1xyXG4gICAgYXN5bmMgdHJpZ2dlckhlYXJ0YmVhdCgpIHtcclxuICAgICAgICB2YXIgX2EsIF9iO1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHBsYXRmb3JtTG9nZ2VyID0gdGhpcy5jb250YWluZXJcclxuICAgICAgICAgICAgICAgIC5nZXRQcm92aWRlcigncGxhdGZvcm0tbG9nZ2VyJylcclxuICAgICAgICAgICAgICAgIC5nZXRJbW1lZGlhdGUoKTtcclxuICAgICAgICAgICAgLy8gVGhpcyBpcyB0aGUgXCJGaXJlYmFzZSB1c2VyIGFnZW50XCIgc3RyaW5nIGZyb20gdGhlIHBsYXRmb3JtIGxvZ2dlclxyXG4gICAgICAgICAgICAvLyBzZXJ2aWNlLCBub3QgdGhlIGJyb3dzZXIgdXNlciBhZ2VudC5cclxuICAgICAgICAgICAgY29uc3QgYWdlbnQgPSBwbGF0Zm9ybUxvZ2dlci5nZXRQbGF0Zm9ybUluZm9TdHJpbmcoKTtcclxuICAgICAgICAgICAgY29uc3QgZGF0ZSA9IGdldFVUQ0RhdGVTdHJpbmcoKTtcclxuICAgICAgICAgICAgaWYgKCgoX2EgPSB0aGlzLl9oZWFydGJlYXRzQ2FjaGUpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5oZWFydGJlYXRzKSA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9oZWFydGJlYXRzQ2FjaGUgPSBhd2FpdCB0aGlzLl9oZWFydGJlYXRzQ2FjaGVQcm9taXNlO1xyXG4gICAgICAgICAgICAgICAgLy8gSWYgd2UgZmFpbGVkIHRvIGNvbnN0cnVjdCBhIGhlYXJ0YmVhdHMgY2FjaGUsIHRoZW4gcmV0dXJuIGltbWVkaWF0ZWx5LlxyXG4gICAgICAgICAgICAgICAgaWYgKCgoX2IgPSB0aGlzLl9oZWFydGJlYXRzQ2FjaGUpID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYi5oZWFydGJlYXRzKSA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIERvIG5vdCBzdG9yZSBhIGhlYXJ0YmVhdCBpZiBvbmUgaXMgYWxyZWFkeSBzdG9yZWQgZm9yIHRoaXMgZGF5XHJcbiAgICAgICAgICAgIC8vIG9yIGlmIGEgaGVhZGVyIGhhcyBhbHJlYWR5IGJlZW4gc2VudCB0b2RheS5cclxuICAgICAgICAgICAgaWYgKHRoaXMuX2hlYXJ0YmVhdHNDYWNoZS5sYXN0U2VudEhlYXJ0YmVhdERhdGUgPT09IGRhdGUgfHxcclxuICAgICAgICAgICAgICAgIHRoaXMuX2hlYXJ0YmVhdHNDYWNoZS5oZWFydGJlYXRzLnNvbWUoc2luZ2xlRGF0ZUhlYXJ0YmVhdCA9PiBzaW5nbGVEYXRlSGVhcnRiZWF0LmRhdGUgPT09IGRhdGUpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvLyBUaGVyZSBpcyBubyBlbnRyeSBmb3IgdGhpcyBkYXRlLiBDcmVhdGUgb25lLlxyXG4gICAgICAgICAgICAgICAgdGhpcy5faGVhcnRiZWF0c0NhY2hlLmhlYXJ0YmVhdHMucHVzaCh7IGRhdGUsIGFnZW50IH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIFJlbW92ZSBlbnRyaWVzIG9sZGVyIHRoYW4gMzAgZGF5cy5cclxuICAgICAgICAgICAgdGhpcy5faGVhcnRiZWF0c0NhY2hlLmhlYXJ0YmVhdHMgPVxyXG4gICAgICAgICAgICAgICAgdGhpcy5faGVhcnRiZWF0c0NhY2hlLmhlYXJ0YmVhdHMuZmlsdGVyKHNpbmdsZURhdGVIZWFydGJlYXQgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGhiVGltZXN0YW1wID0gbmV3IERhdGUoc2luZ2xlRGF0ZUhlYXJ0YmVhdC5kYXRlKS52YWx1ZU9mKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgbm93ID0gRGF0ZS5ub3coKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbm93IC0gaGJUaW1lc3RhbXAgPD0gU1RPUkVEX0hFQVJUQkVBVF9SRVRFTlRJT05fTUFYX01JTExJUztcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc3RvcmFnZS5vdmVyd3JpdGUodGhpcy5faGVhcnRiZWF0c0NhY2hlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgbG9nZ2VyLndhcm4oZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGEgYmFzZTY0IGVuY29kZWQgc3RyaW5nIHdoaWNoIGNhbiBiZSBhdHRhY2hlZCB0byB0aGUgaGVhcnRiZWF0LXNwZWNpZmljIGhlYWRlciBkaXJlY3RseS5cclxuICAgICAqIEl0IGFsc28gY2xlYXJzIGFsbCBoZWFydGJlYXRzIGZyb20gbWVtb3J5IGFzIHdlbGwgYXMgaW4gSW5kZXhlZERCLlxyXG4gICAgICpcclxuICAgICAqIE5PVEU6IENvbnN1bWluZyBwcm9kdWN0IFNES3Mgc2hvdWxkIG5vdCBzZW5kIHRoZSBoZWFkZXIgaWYgdGhpcyBtZXRob2RcclxuICAgICAqIHJldHVybnMgYW4gZW1wdHkgc3RyaW5nLlxyXG4gICAgICovXHJcbiAgICBhc3luYyBnZXRIZWFydGJlYXRzSGVhZGVyKCkge1xyXG4gICAgICAgIHZhciBfYTtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5faGVhcnRiZWF0c0NhY2hlID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLl9oZWFydGJlYXRzQ2FjaGVQcm9taXNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIElmIGl0J3Mgc3RpbGwgbnVsbCBvciB0aGUgYXJyYXkgaXMgZW1wdHksIHRoZXJlIGlzIG5vIGRhdGEgdG8gc2VuZC5cclxuICAgICAgICAgICAgaWYgKCgoX2EgPSB0aGlzLl9oZWFydGJlYXRzQ2FjaGUpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5oZWFydGJlYXRzKSA9PSBudWxsIHx8XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9oZWFydGJlYXRzQ2FjaGUuaGVhcnRiZWF0cy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAnJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdCBkYXRlID0gZ2V0VVRDRGF0ZVN0cmluZygpO1xyXG4gICAgICAgICAgICAvLyBFeHRyYWN0IGFzIG1hbnkgaGVhcnRiZWF0cyBmcm9tIHRoZSBjYWNoZSBhcyB3aWxsIGZpdCB1bmRlciB0aGUgc2l6ZSBsaW1pdC5cclxuICAgICAgICAgICAgY29uc3QgeyBoZWFydGJlYXRzVG9TZW5kLCB1bnNlbnRFbnRyaWVzIH0gPSBleHRyYWN0SGVhcnRiZWF0c0ZvckhlYWRlcih0aGlzLl9oZWFydGJlYXRzQ2FjaGUuaGVhcnRiZWF0cyk7XHJcbiAgICAgICAgICAgIGNvbnN0IGhlYWRlclN0cmluZyA9IGJhc2U2NHVybEVuY29kZVdpdGhvdXRQYWRkaW5nKEpTT04uc3RyaW5naWZ5KHsgdmVyc2lvbjogMiwgaGVhcnRiZWF0czogaGVhcnRiZWF0c1RvU2VuZCB9KSk7XHJcbiAgICAgICAgICAgIC8vIFN0b3JlIGxhc3Qgc2VudCBkYXRlIHRvIHByZXZlbnQgYW5vdGhlciBiZWluZyBsb2dnZWQvc2VudCBmb3IgdGhlIHNhbWUgZGF5LlxyXG4gICAgICAgICAgICB0aGlzLl9oZWFydGJlYXRzQ2FjaGUubGFzdFNlbnRIZWFydGJlYXREYXRlID0gZGF0ZTtcclxuICAgICAgICAgICAgaWYgKHVuc2VudEVudHJpZXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgLy8gU3RvcmUgYW55IHVuc2VudCBlbnRyaWVzIGlmIHRoZXkgZXhpc3QuXHJcbiAgICAgICAgICAgICAgICB0aGlzLl9oZWFydGJlYXRzQ2FjaGUuaGVhcnRiZWF0cyA9IHVuc2VudEVudHJpZXM7XHJcbiAgICAgICAgICAgICAgICAvLyBUaGlzIHNlZW1zIG1vcmUgbGlrZWx5IHRoYW4gZW1wdHlpbmcgdGhlIGFycmF5IChiZWxvdykgdG8gbGVhZCB0byBzb21lIG9kZCBzdGF0ZVxyXG4gICAgICAgICAgICAgICAgLy8gc2luY2UgdGhlIGNhY2hlIGlzbid0IGVtcHR5IGFuZCB0aGlzIHdpbGwgYmUgY2FsbGVkIGFnYWluIG9uIHRoZSBuZXh0IHJlcXVlc3QsXHJcbiAgICAgICAgICAgICAgICAvLyBhbmQgaXMgcHJvYmFibHkgc2FmZXN0IGlmIHdlIGF3YWl0IGl0LlxyXG4gICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5fc3RvcmFnZS5vdmVyd3JpdGUodGhpcy5faGVhcnRiZWF0c0NhY2hlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2hlYXJ0YmVhdHNDYWNoZS5oZWFydGJlYXRzID0gW107XHJcbiAgICAgICAgICAgICAgICAvLyBEbyBub3Qgd2FpdCBmb3IgdGhpcywgdG8gcmVkdWNlIGxhdGVuY3kuXHJcbiAgICAgICAgICAgICAgICB2b2lkIHRoaXMuX3N0b3JhZ2Uub3ZlcndyaXRlKHRoaXMuX2hlYXJ0YmVhdHNDYWNoZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGhlYWRlclN0cmluZztcclxuICAgICAgICB9XHJcbiAgICAgICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgbG9nZ2VyLndhcm4oZSk7XHJcbiAgICAgICAgICAgIHJldHVybiAnJztcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gZ2V0VVRDRGF0ZVN0cmluZygpIHtcclxuICAgIGNvbnN0IHRvZGF5ID0gbmV3IERhdGUoKTtcclxuICAgIC8vIFJldHVybnMgZGF0ZSBmb3JtYXQgJ1lZWVktTU0tREQnXHJcbiAgICByZXR1cm4gdG9kYXkudG9JU09TdHJpbmcoKS5zdWJzdHJpbmcoMCwgMTApO1xyXG59XHJcbmZ1bmN0aW9uIGV4dHJhY3RIZWFydGJlYXRzRm9ySGVhZGVyKGhlYXJ0YmVhdHNDYWNoZSwgbWF4U2l6ZSA9IE1BWF9IRUFERVJfQllURVMpIHtcclxuICAgIC8vIEhlYXJ0YmVhdHMgZ3JvdXBlZCBieSB1c2VyIGFnZW50IGluIHRoZSBzdGFuZGFyZCBmb3JtYXQgdG8gYmUgc2VudCBpblxyXG4gICAgLy8gdGhlIGhlYWRlci5cclxuICAgIGNvbnN0IGhlYXJ0YmVhdHNUb1NlbmQgPSBbXTtcclxuICAgIC8vIFNpbmdsZSBkYXRlIGZvcm1hdCBoZWFydGJlYXRzIHRoYXQgYXJlIG5vdCBzZW50LlxyXG4gICAgbGV0IHVuc2VudEVudHJpZXMgPSBoZWFydGJlYXRzQ2FjaGUuc2xpY2UoKTtcclxuICAgIGZvciAoY29uc3Qgc2luZ2xlRGF0ZUhlYXJ0YmVhdCBvZiBoZWFydGJlYXRzQ2FjaGUpIHtcclxuICAgICAgICAvLyBMb29rIGZvciBhbiBleGlzdGluZyBlbnRyeSB3aXRoIHRoZSBzYW1lIHVzZXIgYWdlbnQuXHJcbiAgICAgICAgY29uc3QgaGVhcnRiZWF0RW50cnkgPSBoZWFydGJlYXRzVG9TZW5kLmZpbmQoaGIgPT4gaGIuYWdlbnQgPT09IHNpbmdsZURhdGVIZWFydGJlYXQuYWdlbnQpO1xyXG4gICAgICAgIGlmICghaGVhcnRiZWF0RW50cnkpIHtcclxuICAgICAgICAgICAgLy8gSWYgbm8gZW50cnkgZm9yIHRoaXMgdXNlciBhZ2VudCBleGlzdHMsIGNyZWF0ZSBvbmUuXHJcbiAgICAgICAgICAgIGhlYXJ0YmVhdHNUb1NlbmQucHVzaCh7XHJcbiAgICAgICAgICAgICAgICBhZ2VudDogc2luZ2xlRGF0ZUhlYXJ0YmVhdC5hZ2VudCxcclxuICAgICAgICAgICAgICAgIGRhdGVzOiBbc2luZ2xlRGF0ZUhlYXJ0YmVhdC5kYXRlXVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgaWYgKGNvdW50Qnl0ZXMoaGVhcnRiZWF0c1RvU2VuZCkgPiBtYXhTaXplKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBJZiB0aGUgaGVhZGVyIHdvdWxkIGV4Y2VlZCBtYXggc2l6ZSwgcmVtb3ZlIHRoZSBhZGRlZCBoZWFydGJlYXRcclxuICAgICAgICAgICAgICAgIC8vIGVudHJ5IGFuZCBzdG9wIGFkZGluZyB0byB0aGUgaGVhZGVyLlxyXG4gICAgICAgICAgICAgICAgaGVhcnRiZWF0c1RvU2VuZC5wb3AoKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBoZWFydGJlYXRFbnRyeS5kYXRlcy5wdXNoKHNpbmdsZURhdGVIZWFydGJlYXQuZGF0ZSk7XHJcbiAgICAgICAgICAgIC8vIElmIHRoZSBoZWFkZXIgd291bGQgZXhjZWVkIG1heCBzaXplLCByZW1vdmUgdGhlIGFkZGVkIGRhdGVcclxuICAgICAgICAgICAgLy8gYW5kIHN0b3AgYWRkaW5nIHRvIHRoZSBoZWFkZXIuXHJcbiAgICAgICAgICAgIGlmIChjb3VudEJ5dGVzKGhlYXJ0YmVhdHNUb1NlbmQpID4gbWF4U2l6ZSkge1xyXG4gICAgICAgICAgICAgICAgaGVhcnRiZWF0RW50cnkuZGF0ZXMucG9wKCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBQb3AgdW5zZW50IGVudHJ5IGZyb20gcXVldWUuIChTa2lwcGVkIGlmIGFkZGluZyB0aGUgZW50cnkgZXhjZWVkZWRcclxuICAgICAgICAvLyBxdW90YSBhbmQgdGhlIGxvb3AgYnJlYWtzIGVhcmx5LilcclxuICAgICAgICB1bnNlbnRFbnRyaWVzID0gdW5zZW50RW50cmllcy5zbGljZSgxKTtcclxuICAgIH1cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgaGVhcnRiZWF0c1RvU2VuZCxcclxuICAgICAgICB1bnNlbnRFbnRyaWVzXHJcbiAgICB9O1xyXG59XHJcbmNsYXNzIEhlYXJ0YmVhdFN0b3JhZ2VJbXBsIHtcclxuICAgIGNvbnN0cnVjdG9yKGFwcCkge1xyXG4gICAgICAgIHRoaXMuYXBwID0gYXBwO1xyXG4gICAgICAgIHRoaXMuX2NhblVzZUluZGV4ZWREQlByb21pc2UgPSB0aGlzLnJ1bkluZGV4ZWREQkVudmlyb25tZW50Q2hlY2soKTtcclxuICAgIH1cclxuICAgIGFzeW5jIHJ1bkluZGV4ZWREQkVudmlyb25tZW50Q2hlY2soKSB7XHJcbiAgICAgICAgaWYgKCFpc0luZGV4ZWREQkF2YWlsYWJsZSgpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiB2YWxpZGF0ZUluZGV4ZWREQk9wZW5hYmxlKClcclxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHRydWUpXHJcbiAgICAgICAgICAgICAgICAuY2F0Y2goKCkgPT4gZmFsc2UpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogUmVhZCBhbGwgaGVhcnRiZWF0cy5cclxuICAgICAqL1xyXG4gICAgYXN5bmMgcmVhZCgpIHtcclxuICAgICAgICBjb25zdCBjYW5Vc2VJbmRleGVkREIgPSBhd2FpdCB0aGlzLl9jYW5Vc2VJbmRleGVkREJQcm9taXNlO1xyXG4gICAgICAgIGlmICghY2FuVXNlSW5kZXhlZERCKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7IGhlYXJ0YmVhdHM6IFtdIH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zdCBpZGJIZWFydGJlYXRPYmplY3QgPSBhd2FpdCByZWFkSGVhcnRiZWF0c0Zyb21JbmRleGVkREIodGhpcy5hcHApO1xyXG4gICAgICAgICAgICBpZiAoaWRiSGVhcnRiZWF0T2JqZWN0ID09PSBudWxsIHx8IGlkYkhlYXJ0YmVhdE9iamVjdCA9PT0gdm9pZCAwID8gdm9pZCAwIDogaWRiSGVhcnRiZWF0T2JqZWN0LmhlYXJ0YmVhdHMpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBpZGJIZWFydGJlYXRPYmplY3Q7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4geyBoZWFydGJlYXRzOiBbXSB9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy8gb3ZlcndyaXRlIHRoZSBzdG9yYWdlIHdpdGggdGhlIHByb3ZpZGVkIGhlYXJ0YmVhdHNcclxuICAgIGFzeW5jIG92ZXJ3cml0ZShoZWFydGJlYXRzT2JqZWN0KSB7XHJcbiAgICAgICAgdmFyIF9hO1xyXG4gICAgICAgIGNvbnN0IGNhblVzZUluZGV4ZWREQiA9IGF3YWl0IHRoaXMuX2NhblVzZUluZGV4ZWREQlByb21pc2U7XHJcbiAgICAgICAgaWYgKCFjYW5Vc2VJbmRleGVkREIpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgY29uc3QgZXhpc3RpbmdIZWFydGJlYXRzT2JqZWN0ID0gYXdhaXQgdGhpcy5yZWFkKCk7XHJcbiAgICAgICAgICAgIHJldHVybiB3cml0ZUhlYXJ0YmVhdHNUb0luZGV4ZWREQih0aGlzLmFwcCwge1xyXG4gICAgICAgICAgICAgICAgbGFzdFNlbnRIZWFydGJlYXREYXRlOiAoX2EgPSBoZWFydGJlYXRzT2JqZWN0Lmxhc3RTZW50SGVhcnRiZWF0RGF0ZSkgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogZXhpc3RpbmdIZWFydGJlYXRzT2JqZWN0Lmxhc3RTZW50SGVhcnRiZWF0RGF0ZSxcclxuICAgICAgICAgICAgICAgIGhlYXJ0YmVhdHM6IGhlYXJ0YmVhdHNPYmplY3QuaGVhcnRiZWF0c1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvLyBhZGQgaGVhcnRiZWF0c1xyXG4gICAgYXN5bmMgYWRkKGhlYXJ0YmVhdHNPYmplY3QpIHtcclxuICAgICAgICB2YXIgX2E7XHJcbiAgICAgICAgY29uc3QgY2FuVXNlSW5kZXhlZERCID0gYXdhaXQgdGhpcy5fY2FuVXNlSW5kZXhlZERCUHJvbWlzZTtcclxuICAgICAgICBpZiAoIWNhblVzZUluZGV4ZWREQikge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zdCBleGlzdGluZ0hlYXJ0YmVhdHNPYmplY3QgPSBhd2FpdCB0aGlzLnJlYWQoKTtcclxuICAgICAgICAgICAgcmV0dXJuIHdyaXRlSGVhcnRiZWF0c1RvSW5kZXhlZERCKHRoaXMuYXBwLCB7XHJcbiAgICAgICAgICAgICAgICBsYXN0U2VudEhlYXJ0YmVhdERhdGU6IChfYSA9IGhlYXJ0YmVhdHNPYmplY3QubGFzdFNlbnRIZWFydGJlYXREYXRlKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiBleGlzdGluZ0hlYXJ0YmVhdHNPYmplY3QubGFzdFNlbnRIZWFydGJlYXREYXRlLFxyXG4gICAgICAgICAgICAgICAgaGVhcnRiZWF0czogW1xyXG4gICAgICAgICAgICAgICAgICAgIC4uLmV4aXN0aW5nSGVhcnRiZWF0c09iamVjdC5oZWFydGJlYXRzLFxyXG4gICAgICAgICAgICAgICAgICAgIC4uLmhlYXJ0YmVhdHNPYmplY3QuaGVhcnRiZWF0c1xyXG4gICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuLyoqXHJcbiAqIENhbGN1bGF0ZSBieXRlcyBvZiBhIEhlYXJ0YmVhdHNCeVVzZXJBZ2VudCBhcnJheSBhZnRlciBiZWluZyB3cmFwcGVkXHJcbiAqIGluIGEgcGxhdGZvcm0gbG9nZ2luZyBoZWFkZXIgSlNPTiBvYmplY3QsIHN0cmluZ2lmaWVkLCBhbmQgY29udmVydGVkXHJcbiAqIHRvIGJhc2UgNjQuXHJcbiAqL1xyXG5mdW5jdGlvbiBjb3VudEJ5dGVzKGhlYXJ0YmVhdHNDYWNoZSkge1xyXG4gICAgLy8gYmFzZTY0IGhhcyBhIHJlc3RyaWN0ZWQgc2V0IG9mIGNoYXJhY3RlcnMsIGFsbCBvZiB3aGljaCBzaG91bGQgYmUgMSBieXRlLlxyXG4gICAgcmV0dXJuIGJhc2U2NHVybEVuY29kZVdpdGhvdXRQYWRkaW5nKFxyXG4gICAgLy8gaGVhcnRiZWF0c0NhY2hlIHdyYXBwZXIgcHJvcGVydGllc1xyXG4gICAgSlNPTi5zdHJpbmdpZnkoeyB2ZXJzaW9uOiAyLCBoZWFydGJlYXRzOiBoZWFydGJlYXRzQ2FjaGUgfSkpLmxlbmd0aDtcclxufVxuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMTkgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG5mdW5jdGlvbiByZWdpc3RlckNvcmVDb21wb25lbnRzKHZhcmlhbnQpIHtcclxuICAgIF9yZWdpc3RlckNvbXBvbmVudChuZXcgQ29tcG9uZW50KCdwbGF0Zm9ybS1sb2dnZXInLCBjb250YWluZXIgPT4gbmV3IFBsYXRmb3JtTG9nZ2VyU2VydmljZUltcGwoY29udGFpbmVyKSwgXCJQUklWQVRFXCIgLyogQ29tcG9uZW50VHlwZS5QUklWQVRFICovKSk7XHJcbiAgICBfcmVnaXN0ZXJDb21wb25lbnQobmV3IENvbXBvbmVudCgnaGVhcnRiZWF0JywgY29udGFpbmVyID0+IG5ldyBIZWFydGJlYXRTZXJ2aWNlSW1wbChjb250YWluZXIpLCBcIlBSSVZBVEVcIiAvKiBDb21wb25lbnRUeXBlLlBSSVZBVEUgKi8pKTtcclxuICAgIC8vIFJlZ2lzdGVyIGBhcHBgIHBhY2thZ2UuXHJcbiAgICByZWdpc3RlclZlcnNpb24obmFtZSRwLCB2ZXJzaW9uJDEsIHZhcmlhbnQpO1xyXG4gICAgLy8gQlVJTERfVEFSR0VUIHdpbGwgYmUgcmVwbGFjZWQgYnkgdmFsdWVzIGxpa2UgZXNtNSwgZXNtMjAxNywgY2pzNSwgZXRjIGR1cmluZyB0aGUgY29tcGlsYXRpb25cclxuICAgIHJlZ2lzdGVyVmVyc2lvbihuYW1lJHAsIHZlcnNpb24kMSwgJ2VzbTIwMTcnKTtcclxuICAgIC8vIFJlZ2lzdGVyIHBsYXRmb3JtIFNESyBpZGVudGlmaWVyIChubyB2ZXJzaW9uKS5cclxuICAgIHJlZ2lzdGVyVmVyc2lvbignZmlyZS1qcycsICcnKTtcclxufVxuXG4vKipcclxuICogRmlyZWJhc2UgQXBwXHJcbiAqXHJcbiAqIEByZW1hcmtzIFRoaXMgcGFja2FnZSBjb29yZGluYXRlcyB0aGUgY29tbXVuaWNhdGlvbiBiZXR3ZWVuIHRoZSBkaWZmZXJlbnQgRmlyZWJhc2UgY29tcG9uZW50c1xyXG4gKiBAcGFja2FnZURvY3VtZW50YXRpb25cclxuICovXHJcbnJlZ2lzdGVyQ29yZUNvbXBvbmVudHMoJycpO1xuXG5leHBvcnQgeyBTREtfVkVSU0lPTiwgREVGQVVMVF9FTlRSWV9OQU1FIGFzIF9ERUZBVUxUX0VOVFJZX05BTUUsIF9hZGRDb21wb25lbnQsIF9hZGRPck92ZXJ3cml0ZUNvbXBvbmVudCwgX2FwcHMsIF9jbGVhckNvbXBvbmVudHMsIF9jb21wb25lbnRzLCBfZ2V0UHJvdmlkZXIsIF9pc0ZpcmViYXNlQXBwLCBfaXNGaXJlYmFzZVNlcnZlckFwcCwgX3JlZ2lzdGVyQ29tcG9uZW50LCBfcmVtb3ZlU2VydmljZUluc3RhbmNlLCBfc2VydmVyQXBwcywgZGVsZXRlQXBwLCBnZXRBcHAsIGdldEFwcHMsIGluaXRpYWxpemVBcHAsIGluaXRpYWxpemVTZXJ2ZXJBcHAsIG9uTG9nLCByZWdpc3RlclZlcnNpb24sIHNldExvZ0xldmVsIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5lc20yMDE3LmpzLm1hcFxuIiwKICAgICJpbXBvcnQgeyBfZ2V0UHJvdmlkZXIsIGdldEFwcCwgX3JlZ2lzdGVyQ29tcG9uZW50LCByZWdpc3RlclZlcnNpb24gfSBmcm9tICdAZmlyZWJhc2UvYXBwJztcbmltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJ0BmaXJlYmFzZS9jb21wb25lbnQnO1xuaW1wb3J0IHsgRXJyb3JGYWN0b3J5LCBGaXJlYmFzZUVycm9yIH0gZnJvbSAnQGZpcmViYXNlL3V0aWwnO1xuaW1wb3J0IHsgb3BlbkRCIH0gZnJvbSAnaWRiJztcblxuY29uc3QgbmFtZSA9IFwiQGZpcmViYXNlL2luc3RhbGxhdGlvbnNcIjtcbmNvbnN0IHZlcnNpb24gPSBcIjAuNi44XCI7XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAxOSBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbmNvbnN0IFBFTkRJTkdfVElNRU9VVF9NUyA9IDEwMDAwO1xyXG5jb25zdCBQQUNLQUdFX1ZFUlNJT04gPSBgdzoke3ZlcnNpb259YDtcclxuY29uc3QgSU5URVJOQUxfQVVUSF9WRVJTSU9OID0gJ0ZJU192Mic7XHJcbmNvbnN0IElOU1RBTExBVElPTlNfQVBJX1VSTCA9ICdodHRwczovL2ZpcmViYXNlaW5zdGFsbGF0aW9ucy5nb29nbGVhcGlzLmNvbS92MSc7XHJcbmNvbnN0IFRPS0VOX0VYUElSQVRJT05fQlVGRkVSID0gNjAgKiA2MCAqIDEwMDA7IC8vIE9uZSBob3VyXHJcbmNvbnN0IFNFUlZJQ0UgPSAnaW5zdGFsbGF0aW9ucyc7XHJcbmNvbnN0IFNFUlZJQ0VfTkFNRSA9ICdJbnN0YWxsYXRpb25zJztcblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDE5IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuY29uc3QgRVJST1JfREVTQ1JJUFRJT05fTUFQID0ge1xyXG4gICAgW1wibWlzc2luZy1hcHAtY29uZmlnLXZhbHVlc1wiIC8qIEVycm9yQ29kZS5NSVNTSU5HX0FQUF9DT05GSUdfVkFMVUVTICovXTogJ01pc3NpbmcgQXBwIGNvbmZpZ3VyYXRpb24gdmFsdWU6IFwieyR2YWx1ZU5hbWV9XCInLFxyXG4gICAgW1wibm90LXJlZ2lzdGVyZWRcIiAvKiBFcnJvckNvZGUuTk9UX1JFR0lTVEVSRUQgKi9dOiAnRmlyZWJhc2UgSW5zdGFsbGF0aW9uIGlzIG5vdCByZWdpc3RlcmVkLicsXHJcbiAgICBbXCJpbnN0YWxsYXRpb24tbm90LWZvdW5kXCIgLyogRXJyb3JDb2RlLklOU1RBTExBVElPTl9OT1RfRk9VTkQgKi9dOiAnRmlyZWJhc2UgSW5zdGFsbGF0aW9uIG5vdCBmb3VuZC4nLFxyXG4gICAgW1wicmVxdWVzdC1mYWlsZWRcIiAvKiBFcnJvckNvZGUuUkVRVUVTVF9GQUlMRUQgKi9dOiAneyRyZXF1ZXN0TmFtZX0gcmVxdWVzdCBmYWlsZWQgd2l0aCBlcnJvciBcInskc2VydmVyQ29kZX0geyRzZXJ2ZXJTdGF0dXN9OiB7JHNlcnZlck1lc3NhZ2V9XCInLFxyXG4gICAgW1wiYXBwLW9mZmxpbmVcIiAvKiBFcnJvckNvZGUuQVBQX09GRkxJTkUgKi9dOiAnQ291bGQgbm90IHByb2Nlc3MgcmVxdWVzdC4gQXBwbGljYXRpb24gb2ZmbGluZS4nLFxyXG4gICAgW1wiZGVsZXRlLXBlbmRpbmctcmVnaXN0cmF0aW9uXCIgLyogRXJyb3JDb2RlLkRFTEVURV9QRU5ESU5HX1JFR0lTVFJBVElPTiAqL106IFwiQ2FuJ3QgZGVsZXRlIGluc3RhbGxhdGlvbiB3aGlsZSB0aGVyZSBpcyBhIHBlbmRpbmcgcmVnaXN0cmF0aW9uIHJlcXVlc3QuXCJcclxufTtcclxuY29uc3QgRVJST1JfRkFDVE9SWSA9IG5ldyBFcnJvckZhY3RvcnkoU0VSVklDRSwgU0VSVklDRV9OQU1FLCBFUlJPUl9ERVNDUklQVElPTl9NQVApO1xyXG4vKiogUmV0dXJucyB0cnVlIGlmIGVycm9yIGlzIGEgRmlyZWJhc2VFcnJvciB0aGF0IGlzIGJhc2VkIG9uIGFuIGVycm9yIGZyb20gdGhlIHNlcnZlci4gKi9cclxuZnVuY3Rpb24gaXNTZXJ2ZXJFcnJvcihlcnJvcikge1xyXG4gICAgcmV0dXJuIChlcnJvciBpbnN0YW5jZW9mIEZpcmViYXNlRXJyb3IgJiZcclxuICAgICAgICBlcnJvci5jb2RlLmluY2x1ZGVzKFwicmVxdWVzdC1mYWlsZWRcIiAvKiBFcnJvckNvZGUuUkVRVUVTVF9GQUlMRUQgKi8pKTtcclxufVxuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMTkgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRJbnN0YWxsYXRpb25zRW5kcG9pbnQoeyBwcm9qZWN0SWQgfSkge1xyXG4gICAgcmV0dXJuIGAke0lOU1RBTExBVElPTlNfQVBJX1VSTH0vcHJvamVjdHMvJHtwcm9qZWN0SWR9L2luc3RhbGxhdGlvbnNgO1xyXG59XHJcbmZ1bmN0aW9uIGV4dHJhY3RBdXRoVG9rZW5JbmZvRnJvbVJlc3BvbnNlKHJlc3BvbnNlKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHRva2VuOiByZXNwb25zZS50b2tlbixcclxuICAgICAgICByZXF1ZXN0U3RhdHVzOiAyIC8qIFJlcXVlc3RTdGF0dXMuQ09NUExFVEVEICovLFxyXG4gICAgICAgIGV4cGlyZXNJbjogZ2V0RXhwaXJlc0luRnJvbVJlc3BvbnNlRXhwaXJlc0luKHJlc3BvbnNlLmV4cGlyZXNJbiksXHJcbiAgICAgICAgY3JlYXRpb25UaW1lOiBEYXRlLm5vdygpXHJcbiAgICB9O1xyXG59XHJcbmFzeW5jIGZ1bmN0aW9uIGdldEVycm9yRnJvbVJlc3BvbnNlKHJlcXVlc3ROYW1lLCByZXNwb25zZSkge1xyXG4gICAgY29uc3QgcmVzcG9uc2VKc29uID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG4gICAgY29uc3QgZXJyb3JEYXRhID0gcmVzcG9uc2VKc29uLmVycm9yO1xyXG4gICAgcmV0dXJuIEVSUk9SX0ZBQ1RPUlkuY3JlYXRlKFwicmVxdWVzdC1mYWlsZWRcIiAvKiBFcnJvckNvZGUuUkVRVUVTVF9GQUlMRUQgKi8sIHtcclxuICAgICAgICByZXF1ZXN0TmFtZSxcclxuICAgICAgICBzZXJ2ZXJDb2RlOiBlcnJvckRhdGEuY29kZSxcclxuICAgICAgICBzZXJ2ZXJNZXNzYWdlOiBlcnJvckRhdGEubWVzc2FnZSxcclxuICAgICAgICBzZXJ2ZXJTdGF0dXM6IGVycm9yRGF0YS5zdGF0dXNcclxuICAgIH0pO1xyXG59XHJcbmZ1bmN0aW9uIGdldEhlYWRlcnMoeyBhcGlLZXkgfSkge1xyXG4gICAgcmV0dXJuIG5ldyBIZWFkZXJzKHtcclxuICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxyXG4gICAgICAgIEFjY2VwdDogJ2FwcGxpY2F0aW9uL2pzb24nLFxyXG4gICAgICAgICd4LWdvb2ctYXBpLWtleSc6IGFwaUtleVxyXG4gICAgfSk7XHJcbn1cclxuZnVuY3Rpb24gZ2V0SGVhZGVyc1dpdGhBdXRoKGFwcENvbmZpZywgeyByZWZyZXNoVG9rZW4gfSkge1xyXG4gICAgY29uc3QgaGVhZGVycyA9IGdldEhlYWRlcnMoYXBwQ29uZmlnKTtcclxuICAgIGhlYWRlcnMuYXBwZW5kKCdBdXRob3JpemF0aW9uJywgZ2V0QXV0aG9yaXphdGlvbkhlYWRlcihyZWZyZXNoVG9rZW4pKTtcclxuICAgIHJldHVybiBoZWFkZXJzO1xyXG59XHJcbi8qKlxyXG4gKiBDYWxscyB0aGUgcGFzc2VkIGluIGZldGNoIHdyYXBwZXIgYW5kIHJldHVybnMgdGhlIHJlc3BvbnNlLlxyXG4gKiBJZiB0aGUgcmV0dXJuZWQgcmVzcG9uc2UgaGFzIGEgc3RhdHVzIG9mIDV4eCwgcmUtcnVucyB0aGUgZnVuY3Rpb24gb25jZSBhbmRcclxuICogcmV0dXJucyB0aGUgcmVzcG9uc2UuXHJcbiAqL1xyXG5hc3luYyBmdW5jdGlvbiByZXRyeUlmU2VydmVyRXJyb3IoZm4pIHtcclxuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGZuKCk7XHJcbiAgICBpZiAocmVzdWx0LnN0YXR1cyA+PSA1MDAgJiYgcmVzdWx0LnN0YXR1cyA8IDYwMCkge1xyXG4gICAgICAgIC8vIEludGVybmFsIFNlcnZlciBFcnJvci4gUmV0cnkgcmVxdWVzdC5cclxuICAgICAgICByZXR1cm4gZm4oKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn1cclxuZnVuY3Rpb24gZ2V0RXhwaXJlc0luRnJvbVJlc3BvbnNlRXhwaXJlc0luKHJlc3BvbnNlRXhwaXJlc0luKSB7XHJcbiAgICAvLyBUaGlzIHdvcmtzIGJlY2F1c2UgdGhlIHNlcnZlciB3aWxsIG5ldmVyIHJlc3BvbmQgd2l0aCBmcmFjdGlvbnMgb2YgYSBzZWNvbmQuXHJcbiAgICByZXR1cm4gTnVtYmVyKHJlc3BvbnNlRXhwaXJlc0luLnJlcGxhY2UoJ3MnLCAnMDAwJykpO1xyXG59XHJcbmZ1bmN0aW9uIGdldEF1dGhvcml6YXRpb25IZWFkZXIocmVmcmVzaFRva2VuKSB7XHJcbiAgICByZXR1cm4gYCR7SU5URVJOQUxfQVVUSF9WRVJTSU9OfSAke3JlZnJlc2hUb2tlbn1gO1xyXG59XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAxOSBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbmFzeW5jIGZ1bmN0aW9uIGNyZWF0ZUluc3RhbGxhdGlvblJlcXVlc3QoeyBhcHBDb25maWcsIGhlYXJ0YmVhdFNlcnZpY2VQcm92aWRlciB9LCB7IGZpZCB9KSB7XHJcbiAgICBjb25zdCBlbmRwb2ludCA9IGdldEluc3RhbGxhdGlvbnNFbmRwb2ludChhcHBDb25maWcpO1xyXG4gICAgY29uc3QgaGVhZGVycyA9IGdldEhlYWRlcnMoYXBwQ29uZmlnKTtcclxuICAgIC8vIElmIGhlYXJ0YmVhdCBzZXJ2aWNlIGV4aXN0cywgYWRkIHRoZSBoZWFydGJlYXQgc3RyaW5nIHRvIHRoZSBoZWFkZXIuXHJcbiAgICBjb25zdCBoZWFydGJlYXRTZXJ2aWNlID0gaGVhcnRiZWF0U2VydmljZVByb3ZpZGVyLmdldEltbWVkaWF0ZSh7XHJcbiAgICAgICAgb3B0aW9uYWw6IHRydWVcclxuICAgIH0pO1xyXG4gICAgaWYgKGhlYXJ0YmVhdFNlcnZpY2UpIHtcclxuICAgICAgICBjb25zdCBoZWFydGJlYXRzSGVhZGVyID0gYXdhaXQgaGVhcnRiZWF0U2VydmljZS5nZXRIZWFydGJlYXRzSGVhZGVyKCk7XHJcbiAgICAgICAgaWYgKGhlYXJ0YmVhdHNIZWFkZXIpIHtcclxuICAgICAgICAgICAgaGVhZGVycy5hcHBlbmQoJ3gtZmlyZWJhc2UtY2xpZW50JywgaGVhcnRiZWF0c0hlYWRlcik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgY29uc3QgYm9keSA9IHtcclxuICAgICAgICBmaWQsXHJcbiAgICAgICAgYXV0aFZlcnNpb246IElOVEVSTkFMX0FVVEhfVkVSU0lPTixcclxuICAgICAgICBhcHBJZDogYXBwQ29uZmlnLmFwcElkLFxyXG4gICAgICAgIHNka1ZlcnNpb246IFBBQ0tBR0VfVkVSU0lPTlxyXG4gICAgfTtcclxuICAgIGNvbnN0IHJlcXVlc3QgPSB7XHJcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICAgICAgaGVhZGVycyxcclxuICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShib2R5KVxyXG4gICAgfTtcclxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgcmV0cnlJZlNlcnZlckVycm9yKCgpID0+IGZldGNoKGVuZHBvaW50LCByZXF1ZXN0KSk7XHJcbiAgICBpZiAocmVzcG9uc2Uub2spIHtcclxuICAgICAgICBjb25zdCByZXNwb25zZVZhbHVlID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG4gICAgICAgIGNvbnN0IHJlZ2lzdGVyZWRJbnN0YWxsYXRpb25FbnRyeSA9IHtcclxuICAgICAgICAgICAgZmlkOiByZXNwb25zZVZhbHVlLmZpZCB8fCBmaWQsXHJcbiAgICAgICAgICAgIHJlZ2lzdHJhdGlvblN0YXR1czogMiAvKiBSZXF1ZXN0U3RhdHVzLkNPTVBMRVRFRCAqLyxcclxuICAgICAgICAgICAgcmVmcmVzaFRva2VuOiByZXNwb25zZVZhbHVlLnJlZnJlc2hUb2tlbixcclxuICAgICAgICAgICAgYXV0aFRva2VuOiBleHRyYWN0QXV0aFRva2VuSW5mb0Zyb21SZXNwb25zZShyZXNwb25zZVZhbHVlLmF1dGhUb2tlbilcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiByZWdpc3RlcmVkSW5zdGFsbGF0aW9uRW50cnk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICB0aHJvdyBhd2FpdCBnZXRFcnJvckZyb21SZXNwb25zZSgnQ3JlYXRlIEluc3RhbGxhdGlvbicsIHJlc3BvbnNlKTtcclxuICAgIH1cclxufVxuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMTkgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG4vKiogUmV0dXJucyBhIHByb21pc2UgdGhhdCByZXNvbHZlcyBhZnRlciBnaXZlbiB0aW1lIHBhc3Nlcy4gKi9cclxuZnVuY3Rpb24gc2xlZXAobXMpIHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcclxuICAgICAgICBzZXRUaW1lb3V0KHJlc29sdmUsIG1zKTtcclxuICAgIH0pO1xyXG59XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAxOSBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbmZ1bmN0aW9uIGJ1ZmZlclRvQmFzZTY0VXJsU2FmZShhcnJheSkge1xyXG4gICAgY29uc3QgYjY0ID0gYnRvYShTdHJpbmcuZnJvbUNoYXJDb2RlKC4uLmFycmF5KSk7XHJcbiAgICByZXR1cm4gYjY0LnJlcGxhY2UoL1xcKy9nLCAnLScpLnJlcGxhY2UoL1xcLy9nLCAnXycpO1xyXG59XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAxOSBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbmNvbnN0IFZBTElEX0ZJRF9QQVRURVJOID0gL15bY2RlZl1bXFx3LV17MjF9JC87XHJcbmNvbnN0IElOVkFMSURfRklEID0gJyc7XHJcbi8qKlxyXG4gKiBHZW5lcmF0ZXMgYSBuZXcgRklEIHVzaW5nIHJhbmRvbSB2YWx1ZXMgZnJvbSBXZWIgQ3J5cHRvIEFQSS5cclxuICogUmV0dXJucyBhbiBlbXB0eSBzdHJpbmcgaWYgRklEIGdlbmVyYXRpb24gZmFpbHMgZm9yIGFueSByZWFzb24uXHJcbiAqL1xyXG5mdW5jdGlvbiBnZW5lcmF0ZUZpZCgpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgLy8gQSB2YWxpZCBGSUQgaGFzIGV4YWN0bHkgMjIgYmFzZTY0IGNoYXJhY3RlcnMsIHdoaWNoIGlzIDEzMiBiaXRzLCBvciAxNi41XHJcbiAgICAgICAgLy8gYnl0ZXMuIG91ciBpbXBsZW1lbnRhdGlvbiBnZW5lcmF0ZXMgYSAxNyBieXRlIGFycmF5IGluc3RlYWQuXHJcbiAgICAgICAgY29uc3QgZmlkQnl0ZUFycmF5ID0gbmV3IFVpbnQ4QXJyYXkoMTcpO1xyXG4gICAgICAgIGNvbnN0IGNyeXB0byA9IHNlbGYuY3J5cHRvIHx8IHNlbGYubXNDcnlwdG87XHJcbiAgICAgICAgY3J5cHRvLmdldFJhbmRvbVZhbHVlcyhmaWRCeXRlQXJyYXkpO1xyXG4gICAgICAgIC8vIFJlcGxhY2UgdGhlIGZpcnN0IDQgcmFuZG9tIGJpdHMgd2l0aCB0aGUgY29uc3RhbnQgRklEIGhlYWRlciBvZiAwYjAxMTEuXHJcbiAgICAgICAgZmlkQnl0ZUFycmF5WzBdID0gMGIwMTExMDAwMCArIChmaWRCeXRlQXJyYXlbMF0gJSAwYjAwMDEwMDAwKTtcclxuICAgICAgICBjb25zdCBmaWQgPSBlbmNvZGUoZmlkQnl0ZUFycmF5KTtcclxuICAgICAgICByZXR1cm4gVkFMSURfRklEX1BBVFRFUk4udGVzdChmaWQpID8gZmlkIDogSU5WQUxJRF9GSUQ7XHJcbiAgICB9XHJcbiAgICBjYXRjaCAoX2EpIHtcclxuICAgICAgICAvLyBGSUQgZ2VuZXJhdGlvbiBlcnJvcmVkXHJcbiAgICAgICAgcmV0dXJuIElOVkFMSURfRklEO1xyXG4gICAgfVxyXG59XHJcbi8qKiBDb252ZXJ0cyBhIEZJRCBVaW50OEFycmF5IHRvIGEgYmFzZTY0IHN0cmluZyByZXByZXNlbnRhdGlvbi4gKi9cclxuZnVuY3Rpb24gZW5jb2RlKGZpZEJ5dGVBcnJheSkge1xyXG4gICAgY29uc3QgYjY0U3RyaW5nID0gYnVmZmVyVG9CYXNlNjRVcmxTYWZlKGZpZEJ5dGVBcnJheSk7XHJcbiAgICAvLyBSZW1vdmUgdGhlIDIzcmQgY2hhcmFjdGVyIHRoYXQgd2FzIGFkZGVkIGJlY2F1c2Ugb2YgdGhlIGV4dHJhIDQgYml0cyBhdCB0aGVcclxuICAgIC8vIGVuZCBvZiBvdXIgMTcgYnl0ZSBhcnJheSwgYW5kIHRoZSAnPScgcGFkZGluZy5cclxuICAgIHJldHVybiBiNjRTdHJpbmcuc3Vic3RyKDAsIDIyKTtcclxufVxuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMTkgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG4vKiogUmV0dXJucyBhIHN0cmluZyBrZXkgdGhhdCBjYW4gYmUgdXNlZCB0byBpZGVudGlmeSB0aGUgYXBwLiAqL1xyXG5mdW5jdGlvbiBnZXRLZXkoYXBwQ29uZmlnKSB7XHJcbiAgICByZXR1cm4gYCR7YXBwQ29uZmlnLmFwcE5hbWV9ISR7YXBwQ29uZmlnLmFwcElkfWA7XHJcbn1cblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDE5IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuY29uc3QgZmlkQ2hhbmdlQ2FsbGJhY2tzID0gbmV3IE1hcCgpO1xyXG4vKipcclxuICogQ2FsbHMgdGhlIG9uSWRDaGFuZ2UgY2FsbGJhY2tzIHdpdGggdGhlIG5ldyBGSUQgdmFsdWUsIGFuZCBicm9hZGNhc3RzIHRoZVxyXG4gKiBjaGFuZ2UgdG8gb3RoZXIgdGFicy5cclxuICovXHJcbmZ1bmN0aW9uIGZpZENoYW5nZWQoYXBwQ29uZmlnLCBmaWQpIHtcclxuICAgIGNvbnN0IGtleSA9IGdldEtleShhcHBDb25maWcpO1xyXG4gICAgY2FsbEZpZENoYW5nZUNhbGxiYWNrcyhrZXksIGZpZCk7XHJcbiAgICBicm9hZGNhc3RGaWRDaGFuZ2Uoa2V5LCBmaWQpO1xyXG59XHJcbmZ1bmN0aW9uIGFkZENhbGxiYWNrKGFwcENvbmZpZywgY2FsbGJhY2spIHtcclxuICAgIC8vIE9wZW4gdGhlIGJyb2FkY2FzdCBjaGFubmVsIGlmIGl0J3Mgbm90IGFscmVhZHkgb3BlbixcclxuICAgIC8vIHRvIGJlIGFibGUgdG8gbGlzdGVuIHRvIGNoYW5nZSBldmVudHMgZnJvbSBvdGhlciB0YWJzLlxyXG4gICAgZ2V0QnJvYWRjYXN0Q2hhbm5lbCgpO1xyXG4gICAgY29uc3Qga2V5ID0gZ2V0S2V5KGFwcENvbmZpZyk7XHJcbiAgICBsZXQgY2FsbGJhY2tTZXQgPSBmaWRDaGFuZ2VDYWxsYmFja3MuZ2V0KGtleSk7XHJcbiAgICBpZiAoIWNhbGxiYWNrU2V0KSB7XHJcbiAgICAgICAgY2FsbGJhY2tTZXQgPSBuZXcgU2V0KCk7XHJcbiAgICAgICAgZmlkQ2hhbmdlQ2FsbGJhY2tzLnNldChrZXksIGNhbGxiYWNrU2V0KTtcclxuICAgIH1cclxuICAgIGNhbGxiYWNrU2V0LmFkZChjYWxsYmFjayk7XHJcbn1cclxuZnVuY3Rpb24gcmVtb3ZlQ2FsbGJhY2soYXBwQ29uZmlnLCBjYWxsYmFjaykge1xyXG4gICAgY29uc3Qga2V5ID0gZ2V0S2V5KGFwcENvbmZpZyk7XHJcbiAgICBjb25zdCBjYWxsYmFja1NldCA9IGZpZENoYW5nZUNhbGxiYWNrcy5nZXQoa2V5KTtcclxuICAgIGlmICghY2FsbGJhY2tTZXQpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBjYWxsYmFja1NldC5kZWxldGUoY2FsbGJhY2spO1xyXG4gICAgaWYgKGNhbGxiYWNrU2V0LnNpemUgPT09IDApIHtcclxuICAgICAgICBmaWRDaGFuZ2VDYWxsYmFja3MuZGVsZXRlKGtleSk7XHJcbiAgICB9XHJcbiAgICAvLyBDbG9zZSBicm9hZGNhc3QgY2hhbm5lbCBpZiB0aGVyZSBhcmUgbm8gbW9yZSBjYWxsYmFja3MuXHJcbiAgICBjbG9zZUJyb2FkY2FzdENoYW5uZWwoKTtcclxufVxyXG5mdW5jdGlvbiBjYWxsRmlkQ2hhbmdlQ2FsbGJhY2tzKGtleSwgZmlkKSB7XHJcbiAgICBjb25zdCBjYWxsYmFja3MgPSBmaWRDaGFuZ2VDYWxsYmFja3MuZ2V0KGtleSk7XHJcbiAgICBpZiAoIWNhbGxiYWNrcykge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGZvciAoY29uc3QgY2FsbGJhY2sgb2YgY2FsbGJhY2tzKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZmlkKTtcclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiBicm9hZGNhc3RGaWRDaGFuZ2Uoa2V5LCBmaWQpIHtcclxuICAgIGNvbnN0IGNoYW5uZWwgPSBnZXRCcm9hZGNhc3RDaGFubmVsKCk7XHJcbiAgICBpZiAoY2hhbm5lbCkge1xyXG4gICAgICAgIGNoYW5uZWwucG9zdE1lc3NhZ2UoeyBrZXksIGZpZCB9KTtcclxuICAgIH1cclxuICAgIGNsb3NlQnJvYWRjYXN0Q2hhbm5lbCgpO1xyXG59XHJcbmxldCBicm9hZGNhc3RDaGFubmVsID0gbnVsbDtcclxuLyoqIE9wZW5zIGFuZCByZXR1cm5zIGEgQnJvYWRjYXN0Q2hhbm5lbCBpZiBpdCBpcyBzdXBwb3J0ZWQgYnkgdGhlIGJyb3dzZXIuICovXHJcbmZ1bmN0aW9uIGdldEJyb2FkY2FzdENoYW5uZWwoKSB7XHJcbiAgICBpZiAoIWJyb2FkY2FzdENoYW5uZWwgJiYgJ0Jyb2FkY2FzdENoYW5uZWwnIGluIHNlbGYpIHtcclxuICAgICAgICBicm9hZGNhc3RDaGFubmVsID0gbmV3IEJyb2FkY2FzdENoYW5uZWwoJ1tGaXJlYmFzZV0gRklEIENoYW5nZScpO1xyXG4gICAgICAgIGJyb2FkY2FzdENoYW5uZWwub25tZXNzYWdlID0gZSA9PiB7XHJcbiAgICAgICAgICAgIGNhbGxGaWRDaGFuZ2VDYWxsYmFja3MoZS5kYXRhLmtleSwgZS5kYXRhLmZpZCk7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuICAgIHJldHVybiBicm9hZGNhc3RDaGFubmVsO1xyXG59XHJcbmZ1bmN0aW9uIGNsb3NlQnJvYWRjYXN0Q2hhbm5lbCgpIHtcclxuICAgIGlmIChmaWRDaGFuZ2VDYWxsYmFja3Muc2l6ZSA9PT0gMCAmJiBicm9hZGNhc3RDaGFubmVsKSB7XHJcbiAgICAgICAgYnJvYWRjYXN0Q2hhbm5lbC5jbG9zZSgpO1xyXG4gICAgICAgIGJyb2FkY2FzdENoYW5uZWwgPSBudWxsO1xyXG4gICAgfVxyXG59XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAxOSBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbmNvbnN0IERBVEFCQVNFX05BTUUgPSAnZmlyZWJhc2UtaW5zdGFsbGF0aW9ucy1kYXRhYmFzZSc7XHJcbmNvbnN0IERBVEFCQVNFX1ZFUlNJT04gPSAxO1xyXG5jb25zdCBPQkpFQ1RfU1RPUkVfTkFNRSA9ICdmaXJlYmFzZS1pbnN0YWxsYXRpb25zLXN0b3JlJztcclxubGV0IGRiUHJvbWlzZSA9IG51bGw7XHJcbmZ1bmN0aW9uIGdldERiUHJvbWlzZSgpIHtcclxuICAgIGlmICghZGJQcm9taXNlKSB7XHJcbiAgICAgICAgZGJQcm9taXNlID0gb3BlbkRCKERBVEFCQVNFX05BTUUsIERBVEFCQVNFX1ZFUlNJT04sIHtcclxuICAgICAgICAgICAgdXBncmFkZTogKGRiLCBvbGRWZXJzaW9uKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAvLyBXZSBkb24ndCB1c2UgJ2JyZWFrJyBpbiB0aGlzIHN3aXRjaCBzdGF0ZW1lbnQsIHRoZSBmYWxsLXRocm91Z2hcclxuICAgICAgICAgICAgICAgIC8vIGJlaGF2aW9yIGlzIHdoYXQgd2Ugd2FudCwgYmVjYXVzZSBpZiB0aGVyZSBhcmUgbXVsdGlwbGUgdmVyc2lvbnMgYmV0d2VlblxyXG4gICAgICAgICAgICAgICAgLy8gdGhlIG9sZCB2ZXJzaW9uIGFuZCB0aGUgY3VycmVudCB2ZXJzaW9uLCB3ZSB3YW50IEFMTCB0aGUgbWlncmF0aW9uc1xyXG4gICAgICAgICAgICAgICAgLy8gdGhhdCBjb3JyZXNwb25kIHRvIHRob3NlIHZlcnNpb25zIHRvIHJ1biwgbm90IG9ubHkgdGhlIGxhc3Qgb25lLlxyXG4gICAgICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGRlZmF1bHQtY2FzZVxyXG4gICAgICAgICAgICAgICAgc3dpdGNoIChvbGRWZXJzaW9uKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAwOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYi5jcmVhdGVPYmplY3RTdG9yZShPQkpFQ1RfU1RPUkVfTkFNRSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIHJldHVybiBkYlByb21pc2U7XHJcbn1cclxuLyoqIEFzc2lnbnMgb3Igb3ZlcndyaXRlcyB0aGUgcmVjb3JkIGZvciB0aGUgZ2l2ZW4ga2V5IHdpdGggdGhlIGdpdmVuIHZhbHVlLiAqL1xyXG5hc3luYyBmdW5jdGlvbiBzZXQoYXBwQ29uZmlnLCB2YWx1ZSkge1xyXG4gICAgY29uc3Qga2V5ID0gZ2V0S2V5KGFwcENvbmZpZyk7XHJcbiAgICBjb25zdCBkYiA9IGF3YWl0IGdldERiUHJvbWlzZSgpO1xyXG4gICAgY29uc3QgdHggPSBkYi50cmFuc2FjdGlvbihPQkpFQ1RfU1RPUkVfTkFNRSwgJ3JlYWR3cml0ZScpO1xyXG4gICAgY29uc3Qgb2JqZWN0U3RvcmUgPSB0eC5vYmplY3RTdG9yZShPQkpFQ1RfU1RPUkVfTkFNRSk7XHJcbiAgICBjb25zdCBvbGRWYWx1ZSA9IChhd2FpdCBvYmplY3RTdG9yZS5nZXQoa2V5KSk7XHJcbiAgICBhd2FpdCBvYmplY3RTdG9yZS5wdXQodmFsdWUsIGtleSk7XHJcbiAgICBhd2FpdCB0eC5kb25lO1xyXG4gICAgaWYgKCFvbGRWYWx1ZSB8fCBvbGRWYWx1ZS5maWQgIT09IHZhbHVlLmZpZCkge1xyXG4gICAgICAgIGZpZENoYW5nZWQoYXBwQ29uZmlnLCB2YWx1ZS5maWQpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHZhbHVlO1xyXG59XHJcbi8qKiBSZW1vdmVzIHJlY29yZChzKSBmcm9tIHRoZSBvYmplY3RTdG9yZSB0aGF0IG1hdGNoIHRoZSBnaXZlbiBrZXkuICovXHJcbmFzeW5jIGZ1bmN0aW9uIHJlbW92ZShhcHBDb25maWcpIHtcclxuICAgIGNvbnN0IGtleSA9IGdldEtleShhcHBDb25maWcpO1xyXG4gICAgY29uc3QgZGIgPSBhd2FpdCBnZXREYlByb21pc2UoKTtcclxuICAgIGNvbnN0IHR4ID0gZGIudHJhbnNhY3Rpb24oT0JKRUNUX1NUT1JFX05BTUUsICdyZWFkd3JpdGUnKTtcclxuICAgIGF3YWl0IHR4Lm9iamVjdFN0b3JlKE9CSkVDVF9TVE9SRV9OQU1FKS5kZWxldGUoa2V5KTtcclxuICAgIGF3YWl0IHR4LmRvbmU7XHJcbn1cclxuLyoqXHJcbiAqIEF0b21pY2FsbHkgdXBkYXRlcyBhIHJlY29yZCB3aXRoIHRoZSByZXN1bHQgb2YgdXBkYXRlRm4sIHdoaWNoIGdldHNcclxuICogY2FsbGVkIHdpdGggdGhlIGN1cnJlbnQgdmFsdWUuIElmIG5ld1ZhbHVlIGlzIHVuZGVmaW5lZCwgdGhlIHJlY29yZCBpc1xyXG4gKiBkZWxldGVkIGluc3RlYWQuXHJcbiAqIEByZXR1cm4gVXBkYXRlZCB2YWx1ZVxyXG4gKi9cclxuYXN5bmMgZnVuY3Rpb24gdXBkYXRlKGFwcENvbmZpZywgdXBkYXRlRm4pIHtcclxuICAgIGNvbnN0IGtleSA9IGdldEtleShhcHBDb25maWcpO1xyXG4gICAgY29uc3QgZGIgPSBhd2FpdCBnZXREYlByb21pc2UoKTtcclxuICAgIGNvbnN0IHR4ID0gZGIudHJhbnNhY3Rpb24oT0JKRUNUX1NUT1JFX05BTUUsICdyZWFkd3JpdGUnKTtcclxuICAgIGNvbnN0IHN0b3JlID0gdHgub2JqZWN0U3RvcmUoT0JKRUNUX1NUT1JFX05BTUUpO1xyXG4gICAgY29uc3Qgb2xkVmFsdWUgPSAoYXdhaXQgc3RvcmUuZ2V0KGtleSkpO1xyXG4gICAgY29uc3QgbmV3VmFsdWUgPSB1cGRhdGVGbihvbGRWYWx1ZSk7XHJcbiAgICBpZiAobmV3VmFsdWUgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIGF3YWl0IHN0b3JlLmRlbGV0ZShrZXkpO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgYXdhaXQgc3RvcmUucHV0KG5ld1ZhbHVlLCBrZXkpO1xyXG4gICAgfVxyXG4gICAgYXdhaXQgdHguZG9uZTtcclxuICAgIGlmIChuZXdWYWx1ZSAmJiAoIW9sZFZhbHVlIHx8IG9sZFZhbHVlLmZpZCAhPT0gbmV3VmFsdWUuZmlkKSkge1xyXG4gICAgICAgIGZpZENoYW5nZWQoYXBwQ29uZmlnLCBuZXdWYWx1ZS5maWQpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG5ld1ZhbHVlO1xyXG59XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAxOSBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbi8qKlxyXG4gKiBVcGRhdGVzIGFuZCByZXR1cm5zIHRoZSBJbnN0YWxsYXRpb25FbnRyeSBmcm9tIHRoZSBkYXRhYmFzZS5cclxuICogQWxzbyB0cmlnZ2VycyBhIHJlZ2lzdHJhdGlvbiByZXF1ZXN0IGlmIGl0IGlzIG5lY2Vzc2FyeSBhbmQgcG9zc2libGUuXHJcbiAqL1xyXG5hc3luYyBmdW5jdGlvbiBnZXRJbnN0YWxsYXRpb25FbnRyeShpbnN0YWxsYXRpb25zKSB7XHJcbiAgICBsZXQgcmVnaXN0cmF0aW9uUHJvbWlzZTtcclxuICAgIGNvbnN0IGluc3RhbGxhdGlvbkVudHJ5ID0gYXdhaXQgdXBkYXRlKGluc3RhbGxhdGlvbnMuYXBwQ29uZmlnLCBvbGRFbnRyeSA9PiB7XHJcbiAgICAgICAgY29uc3QgaW5zdGFsbGF0aW9uRW50cnkgPSB1cGRhdGVPckNyZWF0ZUluc3RhbGxhdGlvbkVudHJ5KG9sZEVudHJ5KTtcclxuICAgICAgICBjb25zdCBlbnRyeVdpdGhQcm9taXNlID0gdHJpZ2dlclJlZ2lzdHJhdGlvbklmTmVjZXNzYXJ5KGluc3RhbGxhdGlvbnMsIGluc3RhbGxhdGlvbkVudHJ5KTtcclxuICAgICAgICByZWdpc3RyYXRpb25Qcm9taXNlID0gZW50cnlXaXRoUHJvbWlzZS5yZWdpc3RyYXRpb25Qcm9taXNlO1xyXG4gICAgICAgIHJldHVybiBlbnRyeVdpdGhQcm9taXNlLmluc3RhbGxhdGlvbkVudHJ5O1xyXG4gICAgfSk7XHJcbiAgICBpZiAoaW5zdGFsbGF0aW9uRW50cnkuZmlkID09PSBJTlZBTElEX0ZJRCkge1xyXG4gICAgICAgIC8vIEZJRCBnZW5lcmF0aW9uIGZhaWxlZC4gV2FpdGluZyBmb3IgdGhlIEZJRCBmcm9tIHRoZSBzZXJ2ZXIuXHJcbiAgICAgICAgcmV0dXJuIHsgaW5zdGFsbGF0aW9uRW50cnk6IGF3YWl0IHJlZ2lzdHJhdGlvblByb21pc2UgfTtcclxuICAgIH1cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgaW5zdGFsbGF0aW9uRW50cnksXHJcbiAgICAgICAgcmVnaXN0cmF0aW9uUHJvbWlzZVxyXG4gICAgfTtcclxufVxyXG4vKipcclxuICogQ3JlYXRlcyBhIG5ldyBJbnN0YWxsYXRpb24gRW50cnkgaWYgb25lIGRvZXMgbm90IGV4aXN0LlxyXG4gKiBBbHNvIGNsZWFycyB0aW1lZCBvdXQgcGVuZGluZyByZXF1ZXN0cy5cclxuICovXHJcbmZ1bmN0aW9uIHVwZGF0ZU9yQ3JlYXRlSW5zdGFsbGF0aW9uRW50cnkob2xkRW50cnkpIHtcclxuICAgIGNvbnN0IGVudHJ5ID0gb2xkRW50cnkgfHwge1xyXG4gICAgICAgIGZpZDogZ2VuZXJhdGVGaWQoKSxcclxuICAgICAgICByZWdpc3RyYXRpb25TdGF0dXM6IDAgLyogUmVxdWVzdFN0YXR1cy5OT1RfU1RBUlRFRCAqL1xyXG4gICAgfTtcclxuICAgIHJldHVybiBjbGVhclRpbWVkT3V0UmVxdWVzdChlbnRyeSk7XHJcbn1cclxuLyoqXHJcbiAqIElmIHRoZSBGaXJlYmFzZSBJbnN0YWxsYXRpb24gaXMgbm90IHJlZ2lzdGVyZWQgeWV0LCB0aGlzIHdpbGwgdHJpZ2dlciB0aGVcclxuICogcmVnaXN0cmF0aW9uIGFuZCByZXR1cm4gYW4gSW5Qcm9ncmVzc0luc3RhbGxhdGlvbkVudHJ5LlxyXG4gKlxyXG4gKiBJZiByZWdpc3RyYXRpb25Qcm9taXNlIGRvZXMgbm90IGV4aXN0LCB0aGUgaW5zdGFsbGF0aW9uRW50cnkgaXMgZ3VhcmFudGVlZFxyXG4gKiB0byBiZSByZWdpc3RlcmVkLlxyXG4gKi9cclxuZnVuY3Rpb24gdHJpZ2dlclJlZ2lzdHJhdGlvbklmTmVjZXNzYXJ5KGluc3RhbGxhdGlvbnMsIGluc3RhbGxhdGlvbkVudHJ5KSB7XHJcbiAgICBpZiAoaW5zdGFsbGF0aW9uRW50cnkucmVnaXN0cmF0aW9uU3RhdHVzID09PSAwIC8qIFJlcXVlc3RTdGF0dXMuTk9UX1NUQVJURUQgKi8pIHtcclxuICAgICAgICBpZiAoIW5hdmlnYXRvci5vbkxpbmUpIHtcclxuICAgICAgICAgICAgLy8gUmVnaXN0cmF0aW9uIHJlcXVpcmVkIGJ1dCBhcHAgaXMgb2ZmbGluZS5cclxuICAgICAgICAgICAgY29uc3QgcmVnaXN0cmF0aW9uUHJvbWlzZVdpdGhFcnJvciA9IFByb21pc2UucmVqZWN0KEVSUk9SX0ZBQ1RPUlkuY3JlYXRlKFwiYXBwLW9mZmxpbmVcIiAvKiBFcnJvckNvZGUuQVBQX09GRkxJTkUgKi8pKTtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIGluc3RhbGxhdGlvbkVudHJ5LFxyXG4gICAgICAgICAgICAgICAgcmVnaXN0cmF0aW9uUHJvbWlzZTogcmVnaXN0cmF0aW9uUHJvbWlzZVdpdGhFcnJvclxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBUcnkgcmVnaXN0ZXJpbmcuIENoYW5nZSBzdGF0dXMgdG8gSU5fUFJPR1JFU1MuXHJcbiAgICAgICAgY29uc3QgaW5Qcm9ncmVzc0VudHJ5ID0ge1xyXG4gICAgICAgICAgICBmaWQ6IGluc3RhbGxhdGlvbkVudHJ5LmZpZCxcclxuICAgICAgICAgICAgcmVnaXN0cmF0aW9uU3RhdHVzOiAxIC8qIFJlcXVlc3RTdGF0dXMuSU5fUFJPR1JFU1MgKi8sXHJcbiAgICAgICAgICAgIHJlZ2lzdHJhdGlvblRpbWU6IERhdGUubm93KClcclxuICAgICAgICB9O1xyXG4gICAgICAgIGNvbnN0IHJlZ2lzdHJhdGlvblByb21pc2UgPSByZWdpc3Rlckluc3RhbGxhdGlvbihpbnN0YWxsYXRpb25zLCBpblByb2dyZXNzRW50cnkpO1xyXG4gICAgICAgIHJldHVybiB7IGluc3RhbGxhdGlvbkVudHJ5OiBpblByb2dyZXNzRW50cnksIHJlZ2lzdHJhdGlvblByb21pc2UgfTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKGluc3RhbGxhdGlvbkVudHJ5LnJlZ2lzdHJhdGlvblN0YXR1cyA9PT0gMSAvKiBSZXF1ZXN0U3RhdHVzLklOX1BST0dSRVNTICovKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgaW5zdGFsbGF0aW9uRW50cnksXHJcbiAgICAgICAgICAgIHJlZ2lzdHJhdGlvblByb21pc2U6IHdhaXRVbnRpbEZpZFJlZ2lzdHJhdGlvbihpbnN0YWxsYXRpb25zKVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICByZXR1cm4geyBpbnN0YWxsYXRpb25FbnRyeSB9O1xyXG4gICAgfVxyXG59XHJcbi8qKiBUaGlzIHdpbGwgYmUgZXhlY3V0ZWQgb25seSBvbmNlIGZvciBlYWNoIG5ldyBGaXJlYmFzZSBJbnN0YWxsYXRpb24uICovXHJcbmFzeW5jIGZ1bmN0aW9uIHJlZ2lzdGVySW5zdGFsbGF0aW9uKGluc3RhbGxhdGlvbnMsIGluc3RhbGxhdGlvbkVudHJ5KSB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IHJlZ2lzdGVyZWRJbnN0YWxsYXRpb25FbnRyeSA9IGF3YWl0IGNyZWF0ZUluc3RhbGxhdGlvblJlcXVlc3QoaW5zdGFsbGF0aW9ucywgaW5zdGFsbGF0aW9uRW50cnkpO1xyXG4gICAgICAgIHJldHVybiBzZXQoaW5zdGFsbGF0aW9ucy5hcHBDb25maWcsIHJlZ2lzdGVyZWRJbnN0YWxsYXRpb25FbnRyeSk7XHJcbiAgICB9XHJcbiAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgIGlmIChpc1NlcnZlckVycm9yKGUpICYmIGUuY3VzdG9tRGF0YS5zZXJ2ZXJDb2RlID09PSA0MDkpIHtcclxuICAgICAgICAgICAgLy8gU2VydmVyIHJldHVybmVkIGEgXCJGSUQgY2FuIG5vdCBiZSB1c2VkXCIgZXJyb3IuXHJcbiAgICAgICAgICAgIC8vIEdlbmVyYXRlIGEgbmV3IElEIG5leHQgdGltZS5cclxuICAgICAgICAgICAgYXdhaXQgcmVtb3ZlKGluc3RhbGxhdGlvbnMuYXBwQ29uZmlnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIFJlZ2lzdHJhdGlvbiBmYWlsZWQuIFNldCBGSUQgYXMgbm90IHJlZ2lzdGVyZWQuXHJcbiAgICAgICAgICAgIGF3YWl0IHNldChpbnN0YWxsYXRpb25zLmFwcENvbmZpZywge1xyXG4gICAgICAgICAgICAgICAgZmlkOiBpbnN0YWxsYXRpb25FbnRyeS5maWQsXHJcbiAgICAgICAgICAgICAgICByZWdpc3RyYXRpb25TdGF0dXM6IDAgLyogUmVxdWVzdFN0YXR1cy5OT1RfU1RBUlRFRCAqL1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhyb3cgZTtcclxuICAgIH1cclxufVxyXG4vKiogQ2FsbCBpZiBGSUQgcmVnaXN0cmF0aW9uIGlzIHBlbmRpbmcgaW4gYW5vdGhlciByZXF1ZXN0LiAqL1xyXG5hc3luYyBmdW5jdGlvbiB3YWl0VW50aWxGaWRSZWdpc3RyYXRpb24oaW5zdGFsbGF0aW9ucykge1xyXG4gICAgLy8gVW5mb3J0dW5hdGVseSwgdGhlcmUgaXMgbm8gd2F5IG9mIHJlbGlhYmx5IG9ic2VydmluZyB3aGVuIGEgdmFsdWUgaW5cclxuICAgIC8vIEluZGV4ZWREQiBjaGFuZ2VzICh5ZXQsIHNlZSBodHRwczovL2dpdGh1Yi5jb20vV0lDRy9pbmRleGVkLWRiLW9ic2VydmVycyksXHJcbiAgICAvLyBzbyB3ZSBuZWVkIHRvIHBvbGwuXHJcbiAgICBsZXQgZW50cnkgPSBhd2FpdCB1cGRhdGVJbnN0YWxsYXRpb25SZXF1ZXN0KGluc3RhbGxhdGlvbnMuYXBwQ29uZmlnKTtcclxuICAgIHdoaWxlIChlbnRyeS5yZWdpc3RyYXRpb25TdGF0dXMgPT09IDEgLyogUmVxdWVzdFN0YXR1cy5JTl9QUk9HUkVTUyAqLykge1xyXG4gICAgICAgIC8vIGNyZWF0ZUluc3RhbGxhdGlvbiByZXF1ZXN0IHN0aWxsIGluIHByb2dyZXNzLlxyXG4gICAgICAgIGF3YWl0IHNsZWVwKDEwMCk7XHJcbiAgICAgICAgZW50cnkgPSBhd2FpdCB1cGRhdGVJbnN0YWxsYXRpb25SZXF1ZXN0KGluc3RhbGxhdGlvbnMuYXBwQ29uZmlnKTtcclxuICAgIH1cclxuICAgIGlmIChlbnRyeS5yZWdpc3RyYXRpb25TdGF0dXMgPT09IDAgLyogUmVxdWVzdFN0YXR1cy5OT1RfU1RBUlRFRCAqLykge1xyXG4gICAgICAgIC8vIFRoZSByZXF1ZXN0IHRpbWVkIG91dCBvciBmYWlsZWQgaW4gYSBkaWZmZXJlbnQgY2FsbC4gVHJ5IGFnYWluLlxyXG4gICAgICAgIGNvbnN0IHsgaW5zdGFsbGF0aW9uRW50cnksIHJlZ2lzdHJhdGlvblByb21pc2UgfSA9IGF3YWl0IGdldEluc3RhbGxhdGlvbkVudHJ5KGluc3RhbGxhdGlvbnMpO1xyXG4gICAgICAgIGlmIChyZWdpc3RyYXRpb25Qcm9taXNlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiByZWdpc3RyYXRpb25Qcm9taXNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgLy8gaWYgdGhlcmUgaXMgbm8gcmVnaXN0cmF0aW9uUHJvbWlzZSwgZW50cnkgaXMgcmVnaXN0ZXJlZC5cclxuICAgICAgICAgICAgcmV0dXJuIGluc3RhbGxhdGlvbkVudHJ5O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBlbnRyeTtcclxufVxyXG4vKipcclxuICogQ2FsbGVkIG9ubHkgaWYgdGhlcmUgaXMgYSBDcmVhdGVJbnN0YWxsYXRpb24gcmVxdWVzdCBpbiBwcm9ncmVzcy5cclxuICpcclxuICogVXBkYXRlcyB0aGUgSW5zdGFsbGF0aW9uRW50cnkgaW4gdGhlIERCIGJhc2VkIG9uIHRoZSBzdGF0dXMgb2YgdGhlXHJcbiAqIENyZWF0ZUluc3RhbGxhdGlvbiByZXF1ZXN0LlxyXG4gKlxyXG4gKiBSZXR1cm5zIHRoZSB1cGRhdGVkIEluc3RhbGxhdGlvbkVudHJ5LlxyXG4gKi9cclxuZnVuY3Rpb24gdXBkYXRlSW5zdGFsbGF0aW9uUmVxdWVzdChhcHBDb25maWcpIHtcclxuICAgIHJldHVybiB1cGRhdGUoYXBwQ29uZmlnLCBvbGRFbnRyeSA9PiB7XHJcbiAgICAgICAgaWYgKCFvbGRFbnRyeSkge1xyXG4gICAgICAgICAgICB0aHJvdyBFUlJPUl9GQUNUT1JZLmNyZWF0ZShcImluc3RhbGxhdGlvbi1ub3QtZm91bmRcIiAvKiBFcnJvckNvZGUuSU5TVEFMTEFUSU9OX05PVF9GT1VORCAqLyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBjbGVhclRpbWVkT3V0UmVxdWVzdChvbGRFbnRyeSk7XHJcbiAgICB9KTtcclxufVxyXG5mdW5jdGlvbiBjbGVhclRpbWVkT3V0UmVxdWVzdChlbnRyeSkge1xyXG4gICAgaWYgKGhhc0luc3RhbGxhdGlvblJlcXVlc3RUaW1lZE91dChlbnRyeSkpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBmaWQ6IGVudHJ5LmZpZCxcclxuICAgICAgICAgICAgcmVnaXN0cmF0aW9uU3RhdHVzOiAwIC8qIFJlcXVlc3RTdGF0dXMuTk9UX1NUQVJURUQgKi9cclxuICAgICAgICB9O1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGVudHJ5O1xyXG59XHJcbmZ1bmN0aW9uIGhhc0luc3RhbGxhdGlvblJlcXVlc3RUaW1lZE91dChpbnN0YWxsYXRpb25FbnRyeSkge1xyXG4gICAgcmV0dXJuIChpbnN0YWxsYXRpb25FbnRyeS5yZWdpc3RyYXRpb25TdGF0dXMgPT09IDEgLyogUmVxdWVzdFN0YXR1cy5JTl9QUk9HUkVTUyAqLyAmJlxyXG4gICAgICAgIGluc3RhbGxhdGlvbkVudHJ5LnJlZ2lzdHJhdGlvblRpbWUgKyBQRU5ESU5HX1RJTUVPVVRfTVMgPCBEYXRlLm5vdygpKTtcclxufVxuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMTkgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG5hc3luYyBmdW5jdGlvbiBnZW5lcmF0ZUF1dGhUb2tlblJlcXVlc3QoeyBhcHBDb25maWcsIGhlYXJ0YmVhdFNlcnZpY2VQcm92aWRlciB9LCBpbnN0YWxsYXRpb25FbnRyeSkge1xyXG4gICAgY29uc3QgZW5kcG9pbnQgPSBnZXRHZW5lcmF0ZUF1dGhUb2tlbkVuZHBvaW50KGFwcENvbmZpZywgaW5zdGFsbGF0aW9uRW50cnkpO1xyXG4gICAgY29uc3QgaGVhZGVycyA9IGdldEhlYWRlcnNXaXRoQXV0aChhcHBDb25maWcsIGluc3RhbGxhdGlvbkVudHJ5KTtcclxuICAgIC8vIElmIGhlYXJ0YmVhdCBzZXJ2aWNlIGV4aXN0cywgYWRkIHRoZSBoZWFydGJlYXQgc3RyaW5nIHRvIHRoZSBoZWFkZXIuXHJcbiAgICBjb25zdCBoZWFydGJlYXRTZXJ2aWNlID0gaGVhcnRiZWF0U2VydmljZVByb3ZpZGVyLmdldEltbWVkaWF0ZSh7XHJcbiAgICAgICAgb3B0aW9uYWw6IHRydWVcclxuICAgIH0pO1xyXG4gICAgaWYgKGhlYXJ0YmVhdFNlcnZpY2UpIHtcclxuICAgICAgICBjb25zdCBoZWFydGJlYXRzSGVhZGVyID0gYXdhaXQgaGVhcnRiZWF0U2VydmljZS5nZXRIZWFydGJlYXRzSGVhZGVyKCk7XHJcbiAgICAgICAgaWYgKGhlYXJ0YmVhdHNIZWFkZXIpIHtcclxuICAgICAgICAgICAgaGVhZGVycy5hcHBlbmQoJ3gtZmlyZWJhc2UtY2xpZW50JywgaGVhcnRiZWF0c0hlYWRlcik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgY29uc3QgYm9keSA9IHtcclxuICAgICAgICBpbnN0YWxsYXRpb246IHtcclxuICAgICAgICAgICAgc2RrVmVyc2lvbjogUEFDS0FHRV9WRVJTSU9OLFxyXG4gICAgICAgICAgICBhcHBJZDogYXBwQ29uZmlnLmFwcElkXHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIGNvbnN0IHJlcXVlc3QgPSB7XHJcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICAgICAgaGVhZGVycyxcclxuICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShib2R5KVxyXG4gICAgfTtcclxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgcmV0cnlJZlNlcnZlckVycm9yKCgpID0+IGZldGNoKGVuZHBvaW50LCByZXF1ZXN0KSk7XHJcbiAgICBpZiAocmVzcG9uc2Uub2spIHtcclxuICAgICAgICBjb25zdCByZXNwb25zZVZhbHVlID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG4gICAgICAgIGNvbnN0IGNvbXBsZXRlZEF1dGhUb2tlbiA9IGV4dHJhY3RBdXRoVG9rZW5JbmZvRnJvbVJlc3BvbnNlKHJlc3BvbnNlVmFsdWUpO1xyXG4gICAgICAgIHJldHVybiBjb21wbGV0ZWRBdXRoVG9rZW47XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICB0aHJvdyBhd2FpdCBnZXRFcnJvckZyb21SZXNwb25zZSgnR2VuZXJhdGUgQXV0aCBUb2tlbicsIHJlc3BvbnNlKTtcclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiBnZXRHZW5lcmF0ZUF1dGhUb2tlbkVuZHBvaW50KGFwcENvbmZpZywgeyBmaWQgfSkge1xyXG4gICAgcmV0dXJuIGAke2dldEluc3RhbGxhdGlvbnNFbmRwb2ludChhcHBDb25maWcpfS8ke2ZpZH0vYXV0aFRva2VuczpnZW5lcmF0ZWA7XHJcbn1cblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDE5IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuLyoqXHJcbiAqIFJldHVybnMgYSB2YWxpZCBhdXRoZW50aWNhdGlvbiB0b2tlbiBmb3IgdGhlIGluc3RhbGxhdGlvbi4gR2VuZXJhdGVzIGEgbmV3XHJcbiAqIHRva2VuIGlmIG9uZSBkb2Vzbid0IGV4aXN0LCBpcyBleHBpcmVkIG9yIGFib3V0IHRvIGV4cGlyZS5cclxuICpcclxuICogU2hvdWxkIG9ubHkgYmUgY2FsbGVkIGlmIHRoZSBGaXJlYmFzZSBJbnN0YWxsYXRpb24gaXMgcmVnaXN0ZXJlZC5cclxuICovXHJcbmFzeW5jIGZ1bmN0aW9uIHJlZnJlc2hBdXRoVG9rZW4oaW5zdGFsbGF0aW9ucywgZm9yY2VSZWZyZXNoID0gZmFsc2UpIHtcclxuICAgIGxldCB0b2tlblByb21pc2U7XHJcbiAgICBjb25zdCBlbnRyeSA9IGF3YWl0IHVwZGF0ZShpbnN0YWxsYXRpb25zLmFwcENvbmZpZywgb2xkRW50cnkgPT4ge1xyXG4gICAgICAgIGlmICghaXNFbnRyeVJlZ2lzdGVyZWQob2xkRW50cnkpKSB7XHJcbiAgICAgICAgICAgIHRocm93IEVSUk9SX0ZBQ1RPUlkuY3JlYXRlKFwibm90LXJlZ2lzdGVyZWRcIiAvKiBFcnJvckNvZGUuTk9UX1JFR0lTVEVSRUQgKi8pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBvbGRBdXRoVG9rZW4gPSBvbGRFbnRyeS5hdXRoVG9rZW47XHJcbiAgICAgICAgaWYgKCFmb3JjZVJlZnJlc2ggJiYgaXNBdXRoVG9rZW5WYWxpZChvbGRBdXRoVG9rZW4pKSB7XHJcbiAgICAgICAgICAgIC8vIFRoZXJlIGlzIGEgdmFsaWQgdG9rZW4gaW4gdGhlIERCLlxyXG4gICAgICAgICAgICByZXR1cm4gb2xkRW50cnk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKG9sZEF1dGhUb2tlbi5yZXF1ZXN0U3RhdHVzID09PSAxIC8qIFJlcXVlc3RTdGF0dXMuSU5fUFJPR1JFU1MgKi8pIHtcclxuICAgICAgICAgICAgLy8gVGhlcmUgYWxyZWFkeSBpcyBhIHRva2VuIHJlcXVlc3QgaW4gcHJvZ3Jlc3MuXHJcbiAgICAgICAgICAgIHRva2VuUHJvbWlzZSA9IHdhaXRVbnRpbEF1dGhUb2tlblJlcXVlc3QoaW5zdGFsbGF0aW9ucywgZm9yY2VSZWZyZXNoKTtcclxuICAgICAgICAgICAgcmV0dXJuIG9sZEVudHJ5O1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgLy8gTm8gdG9rZW4gb3IgdG9rZW4gZXhwaXJlZC5cclxuICAgICAgICAgICAgaWYgKCFuYXZpZ2F0b3Iub25MaW5lKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBFUlJPUl9GQUNUT1JZLmNyZWF0ZShcImFwcC1vZmZsaW5lXCIgLyogRXJyb3JDb2RlLkFQUF9PRkZMSU5FICovKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdCBpblByb2dyZXNzRW50cnkgPSBtYWtlQXV0aFRva2VuUmVxdWVzdEluUHJvZ3Jlc3NFbnRyeShvbGRFbnRyeSk7XHJcbiAgICAgICAgICAgIHRva2VuUHJvbWlzZSA9IGZldGNoQXV0aFRva2VuRnJvbVNlcnZlcihpbnN0YWxsYXRpb25zLCBpblByb2dyZXNzRW50cnkpO1xyXG4gICAgICAgICAgICByZXR1cm4gaW5Qcm9ncmVzc0VudHJ5O1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgY29uc3QgYXV0aFRva2VuID0gdG9rZW5Qcm9taXNlXHJcbiAgICAgICAgPyBhd2FpdCB0b2tlblByb21pc2VcclxuICAgICAgICA6IGVudHJ5LmF1dGhUb2tlbjtcclxuICAgIHJldHVybiBhdXRoVG9rZW47XHJcbn1cclxuLyoqXHJcbiAqIENhbGwgb25seSBpZiBGSUQgaXMgcmVnaXN0ZXJlZCBhbmQgQXV0aCBUb2tlbiByZXF1ZXN0IGlzIGluIHByb2dyZXNzLlxyXG4gKlxyXG4gKiBXYWl0cyB1bnRpbCB0aGUgY3VycmVudCBwZW5kaW5nIHJlcXVlc3QgZmluaXNoZXMuIElmIHRoZSByZXF1ZXN0IHRpbWVzIG91dCxcclxuICogdHJpZXMgb25jZSBpbiB0aGlzIHRocmVhZCBhcyB3ZWxsLlxyXG4gKi9cclxuYXN5bmMgZnVuY3Rpb24gd2FpdFVudGlsQXV0aFRva2VuUmVxdWVzdChpbnN0YWxsYXRpb25zLCBmb3JjZVJlZnJlc2gpIHtcclxuICAgIC8vIFVuZm9ydHVuYXRlbHksIHRoZXJlIGlzIG5vIHdheSBvZiByZWxpYWJseSBvYnNlcnZpbmcgd2hlbiBhIHZhbHVlIGluXHJcbiAgICAvLyBJbmRleGVkREIgY2hhbmdlcyAoeWV0LCBzZWUgaHR0cHM6Ly9naXRodWIuY29tL1dJQ0cvaW5kZXhlZC1kYi1vYnNlcnZlcnMpLFxyXG4gICAgLy8gc28gd2UgbmVlZCB0byBwb2xsLlxyXG4gICAgbGV0IGVudHJ5ID0gYXdhaXQgdXBkYXRlQXV0aFRva2VuUmVxdWVzdChpbnN0YWxsYXRpb25zLmFwcENvbmZpZyk7XHJcbiAgICB3aGlsZSAoZW50cnkuYXV0aFRva2VuLnJlcXVlc3RTdGF0dXMgPT09IDEgLyogUmVxdWVzdFN0YXR1cy5JTl9QUk9HUkVTUyAqLykge1xyXG4gICAgICAgIC8vIGdlbmVyYXRlQXV0aFRva2VuIHN0aWxsIGluIHByb2dyZXNzLlxyXG4gICAgICAgIGF3YWl0IHNsZWVwKDEwMCk7XHJcbiAgICAgICAgZW50cnkgPSBhd2FpdCB1cGRhdGVBdXRoVG9rZW5SZXF1ZXN0KGluc3RhbGxhdGlvbnMuYXBwQ29uZmlnKTtcclxuICAgIH1cclxuICAgIGNvbnN0IGF1dGhUb2tlbiA9IGVudHJ5LmF1dGhUb2tlbjtcclxuICAgIGlmIChhdXRoVG9rZW4ucmVxdWVzdFN0YXR1cyA9PT0gMCAvKiBSZXF1ZXN0U3RhdHVzLk5PVF9TVEFSVEVEICovKSB7XHJcbiAgICAgICAgLy8gVGhlIHJlcXVlc3QgdGltZWQgb3V0IG9yIGZhaWxlZCBpbiBhIGRpZmZlcmVudCBjYWxsLiBUcnkgYWdhaW4uXHJcbiAgICAgICAgcmV0dXJuIHJlZnJlc2hBdXRoVG9rZW4oaW5zdGFsbGF0aW9ucywgZm9yY2VSZWZyZXNoKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHJldHVybiBhdXRoVG9rZW47XHJcbiAgICB9XHJcbn1cclxuLyoqXHJcbiAqIENhbGxlZCBvbmx5IGlmIHRoZXJlIGlzIGEgR2VuZXJhdGVBdXRoVG9rZW4gcmVxdWVzdCBpbiBwcm9ncmVzcy5cclxuICpcclxuICogVXBkYXRlcyB0aGUgSW5zdGFsbGF0aW9uRW50cnkgaW4gdGhlIERCIGJhc2VkIG9uIHRoZSBzdGF0dXMgb2YgdGhlXHJcbiAqIEdlbmVyYXRlQXV0aFRva2VuIHJlcXVlc3QuXHJcbiAqXHJcbiAqIFJldHVybnMgdGhlIHVwZGF0ZWQgSW5zdGFsbGF0aW9uRW50cnkuXHJcbiAqL1xyXG5mdW5jdGlvbiB1cGRhdGVBdXRoVG9rZW5SZXF1ZXN0KGFwcENvbmZpZykge1xyXG4gICAgcmV0dXJuIHVwZGF0ZShhcHBDb25maWcsIG9sZEVudHJ5ID0+IHtcclxuICAgICAgICBpZiAoIWlzRW50cnlSZWdpc3RlcmVkKG9sZEVudHJ5KSkge1xyXG4gICAgICAgICAgICB0aHJvdyBFUlJPUl9GQUNUT1JZLmNyZWF0ZShcIm5vdC1yZWdpc3RlcmVkXCIgLyogRXJyb3JDb2RlLk5PVF9SRUdJU1RFUkVEICovKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3Qgb2xkQXV0aFRva2VuID0gb2xkRW50cnkuYXV0aFRva2VuO1xyXG4gICAgICAgIGlmIChoYXNBdXRoVG9rZW5SZXF1ZXN0VGltZWRPdXQob2xkQXV0aFRva2VuKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihPYmplY3QuYXNzaWduKHt9LCBvbGRFbnRyeSksIHsgYXV0aFRva2VuOiB7IHJlcXVlc3RTdGF0dXM6IDAgLyogUmVxdWVzdFN0YXR1cy5OT1RfU1RBUlRFRCAqLyB9IH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gb2xkRW50cnk7XHJcbiAgICB9KTtcclxufVxyXG5hc3luYyBmdW5jdGlvbiBmZXRjaEF1dGhUb2tlbkZyb21TZXJ2ZXIoaW5zdGFsbGF0aW9ucywgaW5zdGFsbGF0aW9uRW50cnkpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgYXV0aFRva2VuID0gYXdhaXQgZ2VuZXJhdGVBdXRoVG9rZW5SZXF1ZXN0KGluc3RhbGxhdGlvbnMsIGluc3RhbGxhdGlvbkVudHJ5KTtcclxuICAgICAgICBjb25zdCB1cGRhdGVkSW5zdGFsbGF0aW9uRW50cnkgPSBPYmplY3QuYXNzaWduKE9iamVjdC5hc3NpZ24oe30sIGluc3RhbGxhdGlvbkVudHJ5KSwgeyBhdXRoVG9rZW4gfSk7XHJcbiAgICAgICAgYXdhaXQgc2V0KGluc3RhbGxhdGlvbnMuYXBwQ29uZmlnLCB1cGRhdGVkSW5zdGFsbGF0aW9uRW50cnkpO1xyXG4gICAgICAgIHJldHVybiBhdXRoVG9rZW47XHJcbiAgICB9XHJcbiAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgIGlmIChpc1NlcnZlckVycm9yKGUpICYmXHJcbiAgICAgICAgICAgIChlLmN1c3RvbURhdGEuc2VydmVyQ29kZSA9PT0gNDAxIHx8IGUuY3VzdG9tRGF0YS5zZXJ2ZXJDb2RlID09PSA0MDQpKSB7XHJcbiAgICAgICAgICAgIC8vIFNlcnZlciByZXR1cm5lZCBhIFwiRklEIG5vdCBmb3VuZFwiIG9yIGEgXCJJbnZhbGlkIGF1dGhlbnRpY2F0aW9uXCIgZXJyb3IuXHJcbiAgICAgICAgICAgIC8vIEdlbmVyYXRlIGEgbmV3IElEIG5leHQgdGltZS5cclxuICAgICAgICAgICAgYXdhaXQgcmVtb3ZlKGluc3RhbGxhdGlvbnMuYXBwQ29uZmlnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHVwZGF0ZWRJbnN0YWxsYXRpb25FbnRyeSA9IE9iamVjdC5hc3NpZ24oT2JqZWN0LmFzc2lnbih7fSwgaW5zdGFsbGF0aW9uRW50cnkpLCB7IGF1dGhUb2tlbjogeyByZXF1ZXN0U3RhdHVzOiAwIC8qIFJlcXVlc3RTdGF0dXMuTk9UX1NUQVJURUQgKi8gfSB9KTtcclxuICAgICAgICAgICAgYXdhaXQgc2V0KGluc3RhbGxhdGlvbnMuYXBwQ29uZmlnLCB1cGRhdGVkSW5zdGFsbGF0aW9uRW50cnkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aHJvdyBlO1xyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIGlzRW50cnlSZWdpc3RlcmVkKGluc3RhbGxhdGlvbkVudHJ5KSB7XHJcbiAgICByZXR1cm4gKGluc3RhbGxhdGlvbkVudHJ5ICE9PSB1bmRlZmluZWQgJiZcclxuICAgICAgICBpbnN0YWxsYXRpb25FbnRyeS5yZWdpc3RyYXRpb25TdGF0dXMgPT09IDIgLyogUmVxdWVzdFN0YXR1cy5DT01QTEVURUQgKi8pO1xyXG59XHJcbmZ1bmN0aW9uIGlzQXV0aFRva2VuVmFsaWQoYXV0aFRva2VuKSB7XHJcbiAgICByZXR1cm4gKGF1dGhUb2tlbi5yZXF1ZXN0U3RhdHVzID09PSAyIC8qIFJlcXVlc3RTdGF0dXMuQ09NUExFVEVEICovICYmXHJcbiAgICAgICAgIWlzQXV0aFRva2VuRXhwaXJlZChhdXRoVG9rZW4pKTtcclxufVxyXG5mdW5jdGlvbiBpc0F1dGhUb2tlbkV4cGlyZWQoYXV0aFRva2VuKSB7XHJcbiAgICBjb25zdCBub3cgPSBEYXRlLm5vdygpO1xyXG4gICAgcmV0dXJuIChub3cgPCBhdXRoVG9rZW4uY3JlYXRpb25UaW1lIHx8XHJcbiAgICAgICAgYXV0aFRva2VuLmNyZWF0aW9uVGltZSArIGF1dGhUb2tlbi5leHBpcmVzSW4gPCBub3cgKyBUT0tFTl9FWFBJUkFUSU9OX0JVRkZFUik7XHJcbn1cclxuLyoqIFJldHVybnMgYW4gdXBkYXRlZCBJbnN0YWxsYXRpb25FbnRyeSB3aXRoIGFuIEluUHJvZ3Jlc3NBdXRoVG9rZW4uICovXHJcbmZ1bmN0aW9uIG1ha2VBdXRoVG9rZW5SZXF1ZXN0SW5Qcm9ncmVzc0VudHJ5KG9sZEVudHJ5KSB7XHJcbiAgICBjb25zdCBpblByb2dyZXNzQXV0aFRva2VuID0ge1xyXG4gICAgICAgIHJlcXVlc3RTdGF0dXM6IDEgLyogUmVxdWVzdFN0YXR1cy5JTl9QUk9HUkVTUyAqLyxcclxuICAgICAgICByZXF1ZXN0VGltZTogRGF0ZS5ub3coKVxyXG4gICAgfTtcclxuICAgIHJldHVybiBPYmplY3QuYXNzaWduKE9iamVjdC5hc3NpZ24oe30sIG9sZEVudHJ5KSwgeyBhdXRoVG9rZW46IGluUHJvZ3Jlc3NBdXRoVG9rZW4gfSk7XHJcbn1cclxuZnVuY3Rpb24gaGFzQXV0aFRva2VuUmVxdWVzdFRpbWVkT3V0KGF1dGhUb2tlbikge1xyXG4gICAgcmV0dXJuIChhdXRoVG9rZW4ucmVxdWVzdFN0YXR1cyA9PT0gMSAvKiBSZXF1ZXN0U3RhdHVzLklOX1BST0dSRVNTICovICYmXHJcbiAgICAgICAgYXV0aFRva2VuLnJlcXVlc3RUaW1lICsgUEVORElOR19USU1FT1VUX01TIDwgRGF0ZS5ub3coKSk7XHJcbn1cblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDE5IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuLyoqXHJcbiAqIENyZWF0ZXMgYSBGaXJlYmFzZSBJbnN0YWxsYXRpb24gaWYgdGhlcmUgaXNuJ3Qgb25lIGZvciB0aGUgYXBwIGFuZFxyXG4gKiByZXR1cm5zIHRoZSBJbnN0YWxsYXRpb24gSUQuXHJcbiAqIEBwYXJhbSBpbnN0YWxsYXRpb25zIC0gVGhlIGBJbnN0YWxsYXRpb25zYCBpbnN0YW5jZS5cclxuICpcclxuICogQHB1YmxpY1xyXG4gKi9cclxuYXN5bmMgZnVuY3Rpb24gZ2V0SWQoaW5zdGFsbGF0aW9ucykge1xyXG4gICAgY29uc3QgaW5zdGFsbGF0aW9uc0ltcGwgPSBpbnN0YWxsYXRpb25zO1xyXG4gICAgY29uc3QgeyBpbnN0YWxsYXRpb25FbnRyeSwgcmVnaXN0cmF0aW9uUHJvbWlzZSB9ID0gYXdhaXQgZ2V0SW5zdGFsbGF0aW9uRW50cnkoaW5zdGFsbGF0aW9uc0ltcGwpO1xyXG4gICAgaWYgKHJlZ2lzdHJhdGlvblByb21pc2UpIHtcclxuICAgICAgICByZWdpc3RyYXRpb25Qcm9taXNlLmNhdGNoKGNvbnNvbGUuZXJyb3IpO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgLy8gSWYgdGhlIGluc3RhbGxhdGlvbiBpcyBhbHJlYWR5IHJlZ2lzdGVyZWQsIHVwZGF0ZSB0aGUgYXV0aGVudGljYXRpb25cclxuICAgICAgICAvLyB0b2tlbiBpZiBuZWVkZWQuXHJcbiAgICAgICAgcmVmcmVzaEF1dGhUb2tlbihpbnN0YWxsYXRpb25zSW1wbCkuY2F0Y2goY29uc29sZS5lcnJvcik7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gaW5zdGFsbGF0aW9uRW50cnkuZmlkO1xyXG59XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAxOSBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbi8qKlxyXG4gKiBSZXR1cm5zIGEgRmlyZWJhc2UgSW5zdGFsbGF0aW9ucyBhdXRoIHRva2VuLCBpZGVudGlmeWluZyB0aGUgY3VycmVudFxyXG4gKiBGaXJlYmFzZSBJbnN0YWxsYXRpb24uXHJcbiAqIEBwYXJhbSBpbnN0YWxsYXRpb25zIC0gVGhlIGBJbnN0YWxsYXRpb25zYCBpbnN0YW5jZS5cclxuICogQHBhcmFtIGZvcmNlUmVmcmVzaCAtIEZvcmNlIHJlZnJlc2ggcmVnYXJkbGVzcyBvZiB0b2tlbiBleHBpcmF0aW9uLlxyXG4gKlxyXG4gKiBAcHVibGljXHJcbiAqL1xyXG5hc3luYyBmdW5jdGlvbiBnZXRUb2tlbihpbnN0YWxsYXRpb25zLCBmb3JjZVJlZnJlc2ggPSBmYWxzZSkge1xyXG4gICAgY29uc3QgaW5zdGFsbGF0aW9uc0ltcGwgPSBpbnN0YWxsYXRpb25zO1xyXG4gICAgYXdhaXQgY29tcGxldGVJbnN0YWxsYXRpb25SZWdpc3RyYXRpb24oaW5zdGFsbGF0aW9uc0ltcGwpO1xyXG4gICAgLy8gQXQgdGhpcyBwb2ludCB3ZSBlaXRoZXIgaGF2ZSBhIFJlZ2lzdGVyZWQgSW5zdGFsbGF0aW9uIGluIHRoZSBEQiwgb3Igd2UndmVcclxuICAgIC8vIGFscmVhZHkgdGhyb3duIGFuIGVycm9yLlxyXG4gICAgY29uc3QgYXV0aFRva2VuID0gYXdhaXQgcmVmcmVzaEF1dGhUb2tlbihpbnN0YWxsYXRpb25zSW1wbCwgZm9yY2VSZWZyZXNoKTtcclxuICAgIHJldHVybiBhdXRoVG9rZW4udG9rZW47XHJcbn1cclxuYXN5bmMgZnVuY3Rpb24gY29tcGxldGVJbnN0YWxsYXRpb25SZWdpc3RyYXRpb24oaW5zdGFsbGF0aW9ucykge1xyXG4gICAgY29uc3QgeyByZWdpc3RyYXRpb25Qcm9taXNlIH0gPSBhd2FpdCBnZXRJbnN0YWxsYXRpb25FbnRyeShpbnN0YWxsYXRpb25zKTtcclxuICAgIGlmIChyZWdpc3RyYXRpb25Qcm9taXNlKSB7XHJcbiAgICAgICAgLy8gQSBjcmVhdGVJbnN0YWxsYXRpb24gcmVxdWVzdCBpcyBpbiBwcm9ncmVzcy4gV2FpdCB1bnRpbCBpdCBmaW5pc2hlcy5cclxuICAgICAgICBhd2FpdCByZWdpc3RyYXRpb25Qcm9taXNlO1xyXG4gICAgfVxyXG59XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAxOSBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbmFzeW5jIGZ1bmN0aW9uIGRlbGV0ZUluc3RhbGxhdGlvblJlcXVlc3QoYXBwQ29uZmlnLCBpbnN0YWxsYXRpb25FbnRyeSkge1xyXG4gICAgY29uc3QgZW5kcG9pbnQgPSBnZXREZWxldGVFbmRwb2ludChhcHBDb25maWcsIGluc3RhbGxhdGlvbkVudHJ5KTtcclxuICAgIGNvbnN0IGhlYWRlcnMgPSBnZXRIZWFkZXJzV2l0aEF1dGgoYXBwQ29uZmlnLCBpbnN0YWxsYXRpb25FbnRyeSk7XHJcbiAgICBjb25zdCByZXF1ZXN0ID0ge1xyXG4gICAgICAgIG1ldGhvZDogJ0RFTEVURScsXHJcbiAgICAgICAgaGVhZGVyc1xyXG4gICAgfTtcclxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgcmV0cnlJZlNlcnZlckVycm9yKCgpID0+IGZldGNoKGVuZHBvaW50LCByZXF1ZXN0KSk7XHJcbiAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XHJcbiAgICAgICAgdGhyb3cgYXdhaXQgZ2V0RXJyb3JGcm9tUmVzcG9uc2UoJ0RlbGV0ZSBJbnN0YWxsYXRpb24nLCByZXNwb25zZSk7XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gZ2V0RGVsZXRlRW5kcG9pbnQoYXBwQ29uZmlnLCB7IGZpZCB9KSB7XHJcbiAgICByZXR1cm4gYCR7Z2V0SW5zdGFsbGF0aW9uc0VuZHBvaW50KGFwcENvbmZpZyl9LyR7ZmlkfWA7XHJcbn1cblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDE5IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuLyoqXHJcbiAqIERlbGV0ZXMgdGhlIEZpcmViYXNlIEluc3RhbGxhdGlvbiBhbmQgYWxsIGFzc29jaWF0ZWQgZGF0YS5cclxuICogQHBhcmFtIGluc3RhbGxhdGlvbnMgLSBUaGUgYEluc3RhbGxhdGlvbnNgIGluc3RhbmNlLlxyXG4gKlxyXG4gKiBAcHVibGljXHJcbiAqL1xyXG5hc3luYyBmdW5jdGlvbiBkZWxldGVJbnN0YWxsYXRpb25zKGluc3RhbGxhdGlvbnMpIHtcclxuICAgIGNvbnN0IHsgYXBwQ29uZmlnIH0gPSBpbnN0YWxsYXRpb25zO1xyXG4gICAgY29uc3QgZW50cnkgPSBhd2FpdCB1cGRhdGUoYXBwQ29uZmlnLCBvbGRFbnRyeSA9PiB7XHJcbiAgICAgICAgaWYgKG9sZEVudHJ5ICYmIG9sZEVudHJ5LnJlZ2lzdHJhdGlvblN0YXR1cyA9PT0gMCAvKiBSZXF1ZXN0U3RhdHVzLk5PVF9TVEFSVEVEICovKSB7XHJcbiAgICAgICAgICAgIC8vIERlbGV0ZSB0aGUgdW5yZWdpc3RlcmVkIGVudHJ5IHdpdGhvdXQgc2VuZGluZyBhIGRlbGV0ZUluc3RhbGxhdGlvbiByZXF1ZXN0LlxyXG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gb2xkRW50cnk7XHJcbiAgICB9KTtcclxuICAgIGlmIChlbnRyeSkge1xyXG4gICAgICAgIGlmIChlbnRyeS5yZWdpc3RyYXRpb25TdGF0dXMgPT09IDEgLyogUmVxdWVzdFN0YXR1cy5JTl9QUk9HUkVTUyAqLykge1xyXG4gICAgICAgICAgICAvLyBDYW4ndCBkZWxldGUgd2hpbGUgdHJ5aW5nIHRvIHJlZ2lzdGVyLlxyXG4gICAgICAgICAgICB0aHJvdyBFUlJPUl9GQUNUT1JZLmNyZWF0ZShcImRlbGV0ZS1wZW5kaW5nLXJlZ2lzdHJhdGlvblwiIC8qIEVycm9yQ29kZS5ERUxFVEVfUEVORElOR19SRUdJU1RSQVRJT04gKi8pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChlbnRyeS5yZWdpc3RyYXRpb25TdGF0dXMgPT09IDIgLyogUmVxdWVzdFN0YXR1cy5DT01QTEVURUQgKi8pIHtcclxuICAgICAgICAgICAgaWYgKCFuYXZpZ2F0b3Iub25MaW5lKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBFUlJPUl9GQUNUT1JZLmNyZWF0ZShcImFwcC1vZmZsaW5lXCIgLyogRXJyb3JDb2RlLkFQUF9PRkZMSU5FICovKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGF3YWl0IGRlbGV0ZUluc3RhbGxhdGlvblJlcXVlc3QoYXBwQ29uZmlnLCBlbnRyeSk7XHJcbiAgICAgICAgICAgICAgICBhd2FpdCByZW1vdmUoYXBwQ29uZmlnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMTkgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG4vKipcclxuICogU2V0cyBhIG5ldyBjYWxsYmFjayB0aGF0IHdpbGwgZ2V0IGNhbGxlZCB3aGVuIEluc3RhbGxhdGlvbiBJRCBjaGFuZ2VzLlxyXG4gKiBSZXR1cm5zIGFuIHVuc3Vic2NyaWJlIGZ1bmN0aW9uIHRoYXQgd2lsbCByZW1vdmUgdGhlIGNhbGxiYWNrIHdoZW4gY2FsbGVkLlxyXG4gKiBAcGFyYW0gaW5zdGFsbGF0aW9ucyAtIFRoZSBgSW5zdGFsbGF0aW9uc2AgaW5zdGFuY2UuXHJcbiAqIEBwYXJhbSBjYWxsYmFjayAtIFRoZSBjYWxsYmFjayBmdW5jdGlvbiB0aGF0IGlzIGludm9rZWQgd2hlbiBGSUQgY2hhbmdlcy5cclxuICogQHJldHVybnMgQSBmdW5jdGlvbiB0aGF0IGNhbiBiZSBjYWxsZWQgdG8gdW5zdWJzY3JpYmUuXHJcbiAqXHJcbiAqIEBwdWJsaWNcclxuICovXHJcbmZ1bmN0aW9uIG9uSWRDaGFuZ2UoaW5zdGFsbGF0aW9ucywgY2FsbGJhY2spIHtcclxuICAgIGNvbnN0IHsgYXBwQ29uZmlnIH0gPSBpbnN0YWxsYXRpb25zO1xyXG4gICAgYWRkQ2FsbGJhY2soYXBwQ29uZmlnLCBjYWxsYmFjayk7XHJcbiAgICByZXR1cm4gKCkgPT4ge1xyXG4gICAgICAgIHJlbW92ZUNhbGxiYWNrKGFwcENvbmZpZywgY2FsbGJhY2spO1xyXG4gICAgfTtcclxufVxuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMjAgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG4vKipcclxuICogUmV0dXJucyBhbiBpbnN0YW5jZSBvZiB7QGxpbmsgSW5zdGFsbGF0aW9uc30gYXNzb2NpYXRlZCB3aXRoIHRoZSBnaXZlblxyXG4gKiB7QGxpbmsgQGZpcmViYXNlL2FwcCNGaXJlYmFzZUFwcH0gaW5zdGFuY2UuXHJcbiAqIEBwYXJhbSBhcHAgLSBUaGUge0BsaW5rIEBmaXJlYmFzZS9hcHAjRmlyZWJhc2VBcHB9IGluc3RhbmNlLlxyXG4gKlxyXG4gKiBAcHVibGljXHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRJbnN0YWxsYXRpb25zKGFwcCA9IGdldEFwcCgpKSB7XHJcbiAgICBjb25zdCBpbnN0YWxsYXRpb25zSW1wbCA9IF9nZXRQcm92aWRlcihhcHAsICdpbnN0YWxsYXRpb25zJykuZ2V0SW1tZWRpYXRlKCk7XHJcbiAgICByZXR1cm4gaW5zdGFsbGF0aW9uc0ltcGw7XHJcbn1cblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDE5IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuZnVuY3Rpb24gZXh0cmFjdEFwcENvbmZpZyhhcHApIHtcclxuICAgIGlmICghYXBwIHx8ICFhcHAub3B0aW9ucykge1xyXG4gICAgICAgIHRocm93IGdldE1pc3NpbmdWYWx1ZUVycm9yKCdBcHAgQ29uZmlndXJhdGlvbicpO1xyXG4gICAgfVxyXG4gICAgaWYgKCFhcHAubmFtZSkge1xyXG4gICAgICAgIHRocm93IGdldE1pc3NpbmdWYWx1ZUVycm9yKCdBcHAgTmFtZScpO1xyXG4gICAgfVxyXG4gICAgLy8gUmVxdWlyZWQgYXBwIGNvbmZpZyBrZXlzXHJcbiAgICBjb25zdCBjb25maWdLZXlzID0gW1xyXG4gICAgICAgICdwcm9qZWN0SWQnLFxyXG4gICAgICAgICdhcGlLZXknLFxyXG4gICAgICAgICdhcHBJZCdcclxuICAgIF07XHJcbiAgICBmb3IgKGNvbnN0IGtleU5hbWUgb2YgY29uZmlnS2V5cykge1xyXG4gICAgICAgIGlmICghYXBwLm9wdGlvbnNba2V5TmFtZV0pIHtcclxuICAgICAgICAgICAgdGhyb3cgZ2V0TWlzc2luZ1ZhbHVlRXJyb3Ioa2V5TmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBhcHBOYW1lOiBhcHAubmFtZSxcclxuICAgICAgICBwcm9qZWN0SWQ6IGFwcC5vcHRpb25zLnByb2plY3RJZCxcclxuICAgICAgICBhcGlLZXk6IGFwcC5vcHRpb25zLmFwaUtleSxcclxuICAgICAgICBhcHBJZDogYXBwLm9wdGlvbnMuYXBwSWRcclxuICAgIH07XHJcbn1cclxuZnVuY3Rpb24gZ2V0TWlzc2luZ1ZhbHVlRXJyb3IodmFsdWVOYW1lKSB7XHJcbiAgICByZXR1cm4gRVJST1JfRkFDVE9SWS5jcmVhdGUoXCJtaXNzaW5nLWFwcC1jb25maWctdmFsdWVzXCIgLyogRXJyb3JDb2RlLk1JU1NJTkdfQVBQX0NPTkZJR19WQUxVRVMgKi8sIHtcclxuICAgICAgICB2YWx1ZU5hbWVcclxuICAgIH0pO1xyXG59XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAyMCBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbmNvbnN0IElOU1RBTExBVElPTlNfTkFNRSA9ICdpbnN0YWxsYXRpb25zJztcclxuY29uc3QgSU5TVEFMTEFUSU9OU19OQU1FX0lOVEVSTkFMID0gJ2luc3RhbGxhdGlvbnMtaW50ZXJuYWwnO1xyXG5jb25zdCBwdWJsaWNGYWN0b3J5ID0gKGNvbnRhaW5lcikgPT4ge1xyXG4gICAgY29uc3QgYXBwID0gY29udGFpbmVyLmdldFByb3ZpZGVyKCdhcHAnKS5nZXRJbW1lZGlhdGUoKTtcclxuICAgIC8vIFRocm93cyBpZiBhcHAgaXNuJ3QgY29uZmlndXJlZCBwcm9wZXJseS5cclxuICAgIGNvbnN0IGFwcENvbmZpZyA9IGV4dHJhY3RBcHBDb25maWcoYXBwKTtcclxuICAgIGNvbnN0IGhlYXJ0YmVhdFNlcnZpY2VQcm92aWRlciA9IF9nZXRQcm92aWRlcihhcHAsICdoZWFydGJlYXQnKTtcclxuICAgIGNvbnN0IGluc3RhbGxhdGlvbnNJbXBsID0ge1xyXG4gICAgICAgIGFwcCxcclxuICAgICAgICBhcHBDb25maWcsXHJcbiAgICAgICAgaGVhcnRiZWF0U2VydmljZVByb3ZpZGVyLFxyXG4gICAgICAgIF9kZWxldGU6ICgpID0+IFByb21pc2UucmVzb2x2ZSgpXHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIGluc3RhbGxhdGlvbnNJbXBsO1xyXG59O1xyXG5jb25zdCBpbnRlcm5hbEZhY3RvcnkgPSAoY29udGFpbmVyKSA9PiB7XHJcbiAgICBjb25zdCBhcHAgPSBjb250YWluZXIuZ2V0UHJvdmlkZXIoJ2FwcCcpLmdldEltbWVkaWF0ZSgpO1xyXG4gICAgLy8gSW50ZXJuYWwgRklTIGluc3RhbmNlIHJlbGllcyBvbiBwdWJsaWMgRklTIGluc3RhbmNlLlxyXG4gICAgY29uc3QgaW5zdGFsbGF0aW9ucyA9IF9nZXRQcm92aWRlcihhcHAsIElOU1RBTExBVElPTlNfTkFNRSkuZ2V0SW1tZWRpYXRlKCk7XHJcbiAgICBjb25zdCBpbnN0YWxsYXRpb25zSW50ZXJuYWwgPSB7XHJcbiAgICAgICAgZ2V0SWQ6ICgpID0+IGdldElkKGluc3RhbGxhdGlvbnMpLFxyXG4gICAgICAgIGdldFRva2VuOiAoZm9yY2VSZWZyZXNoKSA9PiBnZXRUb2tlbihpbnN0YWxsYXRpb25zLCBmb3JjZVJlZnJlc2gpXHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIGluc3RhbGxhdGlvbnNJbnRlcm5hbDtcclxufTtcclxuZnVuY3Rpb24gcmVnaXN0ZXJJbnN0YWxsYXRpb25zKCkge1xyXG4gICAgX3JlZ2lzdGVyQ29tcG9uZW50KG5ldyBDb21wb25lbnQoSU5TVEFMTEFUSU9OU19OQU1FLCBwdWJsaWNGYWN0b3J5LCBcIlBVQkxJQ1wiIC8qIENvbXBvbmVudFR5cGUuUFVCTElDICovKSk7XHJcbiAgICBfcmVnaXN0ZXJDb21wb25lbnQobmV3IENvbXBvbmVudChJTlNUQUxMQVRJT05TX05BTUVfSU5URVJOQUwsIGludGVybmFsRmFjdG9yeSwgXCJQUklWQVRFXCIgLyogQ29tcG9uZW50VHlwZS5QUklWQVRFICovKSk7XHJcbn1cblxuLyoqXHJcbiAqIFRoZSBGaXJlYmFzZSBJbnN0YWxsYXRpb25zIFdlYiBTREsuXHJcbiAqIFRoaXMgU0RLIGRvZXMgbm90IHdvcmsgaW4gYSBOb2RlLmpzIGVudmlyb25tZW50LlxyXG4gKlxyXG4gKiBAcGFja2FnZURvY3VtZW50YXRpb25cclxuICovXHJcbnJlZ2lzdGVySW5zdGFsbGF0aW9ucygpO1xyXG5yZWdpc3RlclZlcnNpb24obmFtZSwgdmVyc2lvbik7XHJcbi8vIEJVSUxEX1RBUkdFVCB3aWxsIGJlIHJlcGxhY2VkIGJ5IHZhbHVlcyBsaWtlIGVzbTUsIGVzbTIwMTcsIGNqczUsIGV0YyBkdXJpbmcgdGhlIGNvbXBpbGF0aW9uXHJcbnJlZ2lzdGVyVmVyc2lvbihuYW1lLCB2ZXJzaW9uLCAnZXNtMjAxNycpO1xuXG5leHBvcnQgeyBkZWxldGVJbnN0YWxsYXRpb25zLCBnZXRJZCwgZ2V0SW5zdGFsbGF0aW9ucywgZ2V0VG9rZW4sIG9uSWRDaGFuZ2UgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4LmVzbTIwMTcuanMubWFwXG4iLAogICAgImltcG9ydCAnQGZpcmViYXNlL2luc3RhbGxhdGlvbnMnO1xuaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSAnQGZpcmViYXNlL2NvbXBvbmVudCc7XG5pbXBvcnQgeyBvcGVuREIsIGRlbGV0ZURCIH0gZnJvbSAnaWRiJztcbmltcG9ydCB7IEVycm9yRmFjdG9yeSwgaXNJbmRleGVkREJBdmFpbGFibGUsIHZhbGlkYXRlSW5kZXhlZERCT3BlbmFibGUsIGdldE1vZHVsYXJJbnN0YW5jZSB9IGZyb20gJ0BmaXJlYmFzZS91dGlsJztcbmltcG9ydCB7IF9yZWdpc3RlckNvbXBvbmVudCwgX2dldFByb3ZpZGVyLCBnZXRBcHAgfSBmcm9tICdAZmlyZWJhc2UvYXBwJztcblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDE5IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuY29uc3QgREVGQVVMVF9WQVBJRF9LRVkgPSAnQkRPVTk5LWg2N0hjQTZKZUZYSGJTTk11N2UyeU5OdTNSem9NajhUTTRXODhqSVRmcTdabVB2SU0xSXYtNF9sMkx4UWNZd2hxYnkyeEdwV3d6amZBbkc0JztcclxuY29uc3QgRU5EUE9JTlQgPSAnaHR0cHM6Ly9mY21yZWdpc3RyYXRpb25zLmdvb2dsZWFwaXMuY29tL3YxJztcclxuLyoqIEtleSBvZiBGQ00gUGF5bG9hZCBpbiBOb3RpZmljYXRpb24ncyBkYXRhIGZpZWxkLiAqL1xyXG5jb25zdCBGQ01fTVNHID0gJ0ZDTV9NU0cnO1xyXG5jb25zdCBDT05TT0xFX0NBTVBBSUdOX0lEID0gJ2dvb2dsZS5jLmEuY19pZCc7XHJcbi8vIERlZmluZWQgYXMgaW4gcHJvdG8vbWVzc2FnaW5nX2V2ZW50LnByb3RvLiBOZWdsZWN0aW5nIGZpZWxkcyB0aGF0IGFyZSBzdXBwb3J0ZWQuXHJcbmNvbnN0IFNES19QTEFURk9STV9XRUIgPSAzO1xyXG5jb25zdCBFVkVOVF9NRVNTQUdFX0RFTElWRVJFRCA9IDE7XHJcbnZhciBNZXNzYWdlVHlwZSQxO1xyXG4oZnVuY3Rpb24gKE1lc3NhZ2VUeXBlKSB7XHJcbiAgICBNZXNzYWdlVHlwZVtNZXNzYWdlVHlwZVtcIkRBVEFfTUVTU0FHRVwiXSA9IDFdID0gXCJEQVRBX01FU1NBR0VcIjtcclxuICAgIE1lc3NhZ2VUeXBlW01lc3NhZ2VUeXBlW1wiRElTUExBWV9OT1RJRklDQVRJT05cIl0gPSAzXSA9IFwiRElTUExBWV9OT1RJRklDQVRJT05cIjtcclxufSkoTWVzc2FnZVR5cGUkMSB8fCAoTWVzc2FnZVR5cGUkMSA9IHt9KSk7XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAxOCBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7IHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0XHJcbiAqIGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS4gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlXHJcbiAqIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUywgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzXHJcbiAqIG9yIGltcGxpZWQuIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmQgbGltaXRhdGlvbnMgdW5kZXJcclxuICogdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG52YXIgTWVzc2FnZVR5cGU7XHJcbihmdW5jdGlvbiAoTWVzc2FnZVR5cGUpIHtcclxuICAgIE1lc3NhZ2VUeXBlW1wiUFVTSF9SRUNFSVZFRFwiXSA9IFwicHVzaC1yZWNlaXZlZFwiO1xyXG4gICAgTWVzc2FnZVR5cGVbXCJOT1RJRklDQVRJT05fQ0xJQ0tFRFwiXSA9IFwibm90aWZpY2F0aW9uLWNsaWNrZWRcIjtcclxufSkoTWVzc2FnZVR5cGUgfHwgKE1lc3NhZ2VUeXBlID0ge30pKTtcblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDE3IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuZnVuY3Rpb24gYXJyYXlUb0Jhc2U2NChhcnJheSkge1xyXG4gICAgY29uc3QgdWludDhBcnJheSA9IG5ldyBVaW50OEFycmF5KGFycmF5KTtcclxuICAgIGNvbnN0IGJhc2U2NFN0cmluZyA9IGJ0b2EoU3RyaW5nLmZyb21DaGFyQ29kZSguLi51aW50OEFycmF5KSk7XHJcbiAgICByZXR1cm4gYmFzZTY0U3RyaW5nLnJlcGxhY2UoLz0vZywgJycpLnJlcGxhY2UoL1xcKy9nLCAnLScpLnJlcGxhY2UoL1xcLy9nLCAnXycpO1xyXG59XHJcbmZ1bmN0aW9uIGJhc2U2NFRvQXJyYXkoYmFzZTY0U3RyaW5nKSB7XHJcbiAgICBjb25zdCBwYWRkaW5nID0gJz0nLnJlcGVhdCgoNCAtIChiYXNlNjRTdHJpbmcubGVuZ3RoICUgNCkpICUgNCk7XHJcbiAgICBjb25zdCBiYXNlNjQgPSAoYmFzZTY0U3RyaW5nICsgcGFkZGluZylcclxuICAgICAgICAucmVwbGFjZSgvXFwtL2csICcrJylcclxuICAgICAgICAucmVwbGFjZSgvXy9nLCAnLycpO1xyXG4gICAgY29uc3QgcmF3RGF0YSA9IGF0b2IoYmFzZTY0KTtcclxuICAgIGNvbnN0IG91dHB1dEFycmF5ID0gbmV3IFVpbnQ4QXJyYXkocmF3RGF0YS5sZW5ndGgpO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCByYXdEYXRhLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgb3V0cHV0QXJyYXlbaV0gPSByYXdEYXRhLmNoYXJDb2RlQXQoaSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gb3V0cHV0QXJyYXk7XHJcbn1cblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDE5IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuY29uc3QgT0xEX0RCX05BTUUgPSAnZmNtX3Rva2VuX2RldGFpbHNfZGInO1xyXG4vKipcclxuICogVGhlIGxhc3QgREIgdmVyc2lvbiBvZiAnZmNtX3Rva2VuX2RldGFpbHNfZGInIHdhcyA0LiBUaGlzIGlzIG9uZSBoaWdoZXIsIHNvIHRoYXQgdGhlIHVwZ3JhZGVcclxuICogY2FsbGJhY2sgaXMgY2FsbGVkIGZvciBhbGwgdmVyc2lvbnMgb2YgdGhlIG9sZCBEQi5cclxuICovXHJcbmNvbnN0IE9MRF9EQl9WRVJTSU9OID0gNTtcclxuY29uc3QgT0xEX09CSkVDVF9TVE9SRV9OQU1FID0gJ2ZjbV90b2tlbl9vYmplY3RfU3RvcmUnO1xyXG5hc3luYyBmdW5jdGlvbiBtaWdyYXRlT2xkRGF0YWJhc2Uoc2VuZGVySWQpIHtcclxuICAgIGlmICgnZGF0YWJhc2VzJyBpbiBpbmRleGVkREIpIHtcclxuICAgICAgICAvLyBpbmRleGVkRGIuZGF0YWJhc2VzKCkgaXMgYW4gSW5kZXhlZERCIHYzIEFQSSBhbmQgZG9lcyBub3QgZXhpc3QgaW4gYWxsIGJyb3dzZXJzLiBUT0RPOiBSZW1vdmVcclxuICAgICAgICAvLyB0eXBlY2FzdCB3aGVuIGl0IGxhbmRzIGluIFRTIHR5cGVzLlxyXG4gICAgICAgIGNvbnN0IGRhdGFiYXNlcyA9IGF3YWl0IGluZGV4ZWREQi5kYXRhYmFzZXMoKTtcclxuICAgICAgICBjb25zdCBkYk5hbWVzID0gZGF0YWJhc2VzLm1hcChkYiA9PiBkYi5uYW1lKTtcclxuICAgICAgICBpZiAoIWRiTmFtZXMuaW5jbHVkZXMoT0xEX0RCX05BTUUpKSB7XHJcbiAgICAgICAgICAgIC8vIG9sZCBEQiBkaWRuJ3QgZXhpc3QsIG5vIG5lZWQgdG8gb3Blbi5cclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgbGV0IHRva2VuRGV0YWlscyA9IG51bGw7XHJcbiAgICBjb25zdCBkYiA9IGF3YWl0IG9wZW5EQihPTERfREJfTkFNRSwgT0xEX0RCX1ZFUlNJT04sIHtcclxuICAgICAgICB1cGdyYWRlOiBhc3luYyAoZGIsIG9sZFZlcnNpb24sIG5ld1ZlcnNpb24sIHVwZ3JhZGVUcmFuc2FjdGlvbikgPT4ge1xyXG4gICAgICAgICAgICB2YXIgX2E7XHJcbiAgICAgICAgICAgIGlmIChvbGRWZXJzaW9uIDwgMikge1xyXG4gICAgICAgICAgICAgICAgLy8gRGF0YWJhc2UgdG9vIG9sZCwgc2tpcCBtaWdyYXRpb24uXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKCFkYi5vYmplY3RTdG9yZU5hbWVzLmNvbnRhaW5zKE9MRF9PQkpFQ1RfU1RPUkVfTkFNRSkpIHtcclxuICAgICAgICAgICAgICAgIC8vIERhdGFiYXNlIGRpZCBub3QgZXhpc3QuIE5vdGhpbmcgdG8gZG8uXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3Qgb2JqZWN0U3RvcmUgPSB1cGdyYWRlVHJhbnNhY3Rpb24ub2JqZWN0U3RvcmUoT0xEX09CSkVDVF9TVE9SRV9OQU1FKTtcclxuICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBhd2FpdCBvYmplY3RTdG9yZS5pbmRleCgnZmNtU2VuZGVySWQnKS5nZXQoc2VuZGVySWQpO1xyXG4gICAgICAgICAgICBhd2FpdCBvYmplY3RTdG9yZS5jbGVhcigpO1xyXG4gICAgICAgICAgICBpZiAoIXZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBObyBlbnRyeSBpbiB0aGUgZGF0YWJhc2UsIG5vdGhpbmcgdG8gbWlncmF0ZS5cclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAob2xkVmVyc2lvbiA9PT0gMikge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgb2xkRGV0YWlscyA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFvbGREZXRhaWxzLmF1dGggfHwgIW9sZERldGFpbHMucDI1NmRoIHx8ICFvbGREZXRhaWxzLmVuZHBvaW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdG9rZW5EZXRhaWxzID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRva2VuOiBvbGREZXRhaWxzLmZjbVRva2VuLFxyXG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZVRpbWU6IChfYSA9IG9sZERldGFpbHMuY3JlYXRlVGltZSkgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogRGF0ZS5ub3coKSxcclxuICAgICAgICAgICAgICAgICAgICBzdWJzY3JpcHRpb25PcHRpb25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGF1dGg6IG9sZERldGFpbHMuYXV0aCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcDI1NmRoOiBvbGREZXRhaWxzLnAyNTZkaCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZW5kcG9pbnQ6IG9sZERldGFpbHMuZW5kcG9pbnQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN3U2NvcGU6IG9sZERldGFpbHMuc3dTY29wZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFwaWRLZXk6IHR5cGVvZiBvbGREZXRhaWxzLnZhcGlkS2V5ID09PSAnc3RyaW5nJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBvbGREZXRhaWxzLnZhcGlkS2V5XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IGFycmF5VG9CYXNlNjQob2xkRGV0YWlscy52YXBpZEtleSlcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKG9sZFZlcnNpb24gPT09IDMpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG9sZERldGFpbHMgPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgIHRva2VuRGV0YWlscyA9IHtcclxuICAgICAgICAgICAgICAgICAgICB0b2tlbjogb2xkRGV0YWlscy5mY21Ub2tlbixcclxuICAgICAgICAgICAgICAgICAgICBjcmVhdGVUaW1lOiBvbGREZXRhaWxzLmNyZWF0ZVRpbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgc3Vic2NyaXB0aW9uT3B0aW9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhdXRoOiBhcnJheVRvQmFzZTY0KG9sZERldGFpbHMuYXV0aCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHAyNTZkaDogYXJyYXlUb0Jhc2U2NChvbGREZXRhaWxzLnAyNTZkaCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVuZHBvaW50OiBvbGREZXRhaWxzLmVuZHBvaW50LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzd1Njb3BlOiBvbGREZXRhaWxzLnN3U2NvcGUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhcGlkS2V5OiBhcnJheVRvQmFzZTY0KG9sZERldGFpbHMudmFwaWRLZXkpXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChvbGRWZXJzaW9uID09PSA0KSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBvbGREZXRhaWxzID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICB0b2tlbkRldGFpbHMgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdG9rZW46IG9sZERldGFpbHMuZmNtVG9rZW4sXHJcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlVGltZTogb2xkRGV0YWlscy5jcmVhdGVUaW1lLFxyXG4gICAgICAgICAgICAgICAgICAgIHN1YnNjcmlwdGlvbk9wdGlvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXV0aDogYXJyYXlUb0Jhc2U2NChvbGREZXRhaWxzLmF1dGgpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwMjU2ZGg6IGFycmF5VG9CYXNlNjQob2xkRGV0YWlscy5wMjU2ZGgpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbmRwb2ludDogb2xkRGV0YWlscy5lbmRwb2ludCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3dTY29wZTogb2xkRGV0YWlscy5zd1Njb3BlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXBpZEtleTogYXJyYXlUb0Jhc2U2NChvbGREZXRhaWxzLnZhcGlkS2V5KVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuICAgIGRiLmNsb3NlKCk7XHJcbiAgICAvLyBEZWxldGUgYWxsIG9sZCBkYXRhYmFzZXMuXHJcbiAgICBhd2FpdCBkZWxldGVEQihPTERfREJfTkFNRSk7XHJcbiAgICBhd2FpdCBkZWxldGVEQignZmNtX3ZhcGlkX2RldGFpbHNfZGInKTtcclxuICAgIGF3YWl0IGRlbGV0ZURCKCd1bmRlZmluZWQnKTtcclxuICAgIHJldHVybiBjaGVja1Rva2VuRGV0YWlscyh0b2tlbkRldGFpbHMpID8gdG9rZW5EZXRhaWxzIDogbnVsbDtcclxufVxyXG5mdW5jdGlvbiBjaGVja1Rva2VuRGV0YWlscyh0b2tlbkRldGFpbHMpIHtcclxuICAgIGlmICghdG9rZW5EZXRhaWxzIHx8ICF0b2tlbkRldGFpbHMuc3Vic2NyaXB0aW9uT3B0aW9ucykge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIGNvbnN0IHsgc3Vic2NyaXB0aW9uT3B0aW9ucyB9ID0gdG9rZW5EZXRhaWxzO1xyXG4gICAgcmV0dXJuICh0eXBlb2YgdG9rZW5EZXRhaWxzLmNyZWF0ZVRpbWUgPT09ICdudW1iZXInICYmXHJcbiAgICAgICAgdG9rZW5EZXRhaWxzLmNyZWF0ZVRpbWUgPiAwICYmXHJcbiAgICAgICAgdHlwZW9mIHRva2VuRGV0YWlscy50b2tlbiA9PT0gJ3N0cmluZycgJiZcclxuICAgICAgICB0b2tlbkRldGFpbHMudG9rZW4ubGVuZ3RoID4gMCAmJlxyXG4gICAgICAgIHR5cGVvZiBzdWJzY3JpcHRpb25PcHRpb25zLmF1dGggPT09ICdzdHJpbmcnICYmXHJcbiAgICAgICAgc3Vic2NyaXB0aW9uT3B0aW9ucy5hdXRoLmxlbmd0aCA+IDAgJiZcclxuICAgICAgICB0eXBlb2Ygc3Vic2NyaXB0aW9uT3B0aW9ucy5wMjU2ZGggPT09ICdzdHJpbmcnICYmXHJcbiAgICAgICAgc3Vic2NyaXB0aW9uT3B0aW9ucy5wMjU2ZGgubGVuZ3RoID4gMCAmJlxyXG4gICAgICAgIHR5cGVvZiBzdWJzY3JpcHRpb25PcHRpb25zLmVuZHBvaW50ID09PSAnc3RyaW5nJyAmJlxyXG4gICAgICAgIHN1YnNjcmlwdGlvbk9wdGlvbnMuZW5kcG9pbnQubGVuZ3RoID4gMCAmJlxyXG4gICAgICAgIHR5cGVvZiBzdWJzY3JpcHRpb25PcHRpb25zLnN3U2NvcGUgPT09ICdzdHJpbmcnICYmXHJcbiAgICAgICAgc3Vic2NyaXB0aW9uT3B0aW9ucy5zd1Njb3BlLmxlbmd0aCA+IDAgJiZcclxuICAgICAgICB0eXBlb2Ygc3Vic2NyaXB0aW9uT3B0aW9ucy52YXBpZEtleSA9PT0gJ3N0cmluZycgJiZcclxuICAgICAgICBzdWJzY3JpcHRpb25PcHRpb25zLnZhcGlkS2V5Lmxlbmd0aCA+IDApO1xyXG59XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAxOSBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbi8vIEV4cG9ydGVkIGZvciB0ZXN0cy5cclxuY29uc3QgREFUQUJBU0VfTkFNRSA9ICdmaXJlYmFzZS1tZXNzYWdpbmctZGF0YWJhc2UnO1xyXG5jb25zdCBEQVRBQkFTRV9WRVJTSU9OID0gMTtcclxuY29uc3QgT0JKRUNUX1NUT1JFX05BTUUgPSAnZmlyZWJhc2UtbWVzc2FnaW5nLXN0b3JlJztcclxubGV0IGRiUHJvbWlzZSA9IG51bGw7XHJcbmZ1bmN0aW9uIGdldERiUHJvbWlzZSgpIHtcclxuICAgIGlmICghZGJQcm9taXNlKSB7XHJcbiAgICAgICAgZGJQcm9taXNlID0gb3BlbkRCKERBVEFCQVNFX05BTUUsIERBVEFCQVNFX1ZFUlNJT04sIHtcclxuICAgICAgICAgICAgdXBncmFkZTogKHVwZ3JhZGVEYiwgb2xkVmVyc2lvbikgPT4ge1xyXG4gICAgICAgICAgICAgICAgLy8gV2UgZG9uJ3QgdXNlICdicmVhaycgaW4gdGhpcyBzd2l0Y2ggc3RhdGVtZW50LCB0aGUgZmFsbC10aHJvdWdoIGJlaGF2aW9yIGlzIHdoYXQgd2Ugd2FudCxcclxuICAgICAgICAgICAgICAgIC8vIGJlY2F1c2UgaWYgdGhlcmUgYXJlIG11bHRpcGxlIHZlcnNpb25zIGJldHdlZW4gdGhlIG9sZCB2ZXJzaW9uIGFuZCB0aGUgY3VycmVudCB2ZXJzaW9uLCB3ZVxyXG4gICAgICAgICAgICAgICAgLy8gd2FudCBBTEwgdGhlIG1pZ3JhdGlvbnMgdGhhdCBjb3JyZXNwb25kIHRvIHRob3NlIHZlcnNpb25zIHRvIHJ1biwgbm90IG9ubHkgdGhlIGxhc3Qgb25lLlxyXG4gICAgICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGRlZmF1bHQtY2FzZVxyXG4gICAgICAgICAgICAgICAgc3dpdGNoIChvbGRWZXJzaW9uKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAwOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB1cGdyYWRlRGIuY3JlYXRlT2JqZWN0U3RvcmUoT0JKRUNUX1NUT1JFX05BTUUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZGJQcm9taXNlO1xyXG59XHJcbi8qKiBHZXRzIHJlY29yZChzKSBmcm9tIHRoZSBvYmplY3RTdG9yZSB0aGF0IG1hdGNoIHRoZSBnaXZlbiBrZXkuICovXHJcbmFzeW5jIGZ1bmN0aW9uIGRiR2V0KGZpcmViYXNlRGVwZW5kZW5jaWVzKSB7XHJcbiAgICBjb25zdCBrZXkgPSBnZXRLZXkoZmlyZWJhc2VEZXBlbmRlbmNpZXMpO1xyXG4gICAgY29uc3QgZGIgPSBhd2FpdCBnZXREYlByb21pc2UoKTtcclxuICAgIGNvbnN0IHRva2VuRGV0YWlscyA9IChhd2FpdCBkYlxyXG4gICAgICAgIC50cmFuc2FjdGlvbihPQkpFQ1RfU1RPUkVfTkFNRSlcclxuICAgICAgICAub2JqZWN0U3RvcmUoT0JKRUNUX1NUT1JFX05BTUUpXHJcbiAgICAgICAgLmdldChrZXkpKTtcclxuICAgIGlmICh0b2tlbkRldGFpbHMpIHtcclxuICAgICAgICByZXR1cm4gdG9rZW5EZXRhaWxzO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgLy8gQ2hlY2sgaWYgdGhlcmUgaXMgYSB0b2tlbkRldGFpbHMgb2JqZWN0IGluIHRoZSBvbGQgREIuXHJcbiAgICAgICAgY29uc3Qgb2xkVG9rZW5EZXRhaWxzID0gYXdhaXQgbWlncmF0ZU9sZERhdGFiYXNlKGZpcmViYXNlRGVwZW5kZW5jaWVzLmFwcENvbmZpZy5zZW5kZXJJZCk7XHJcbiAgICAgICAgaWYgKG9sZFRva2VuRGV0YWlscykge1xyXG4gICAgICAgICAgICBhd2FpdCBkYlNldChmaXJlYmFzZURlcGVuZGVuY2llcywgb2xkVG9rZW5EZXRhaWxzKTtcclxuICAgICAgICAgICAgcmV0dXJuIG9sZFRva2VuRGV0YWlscztcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuLyoqIEFzc2lnbnMgb3Igb3ZlcndyaXRlcyB0aGUgcmVjb3JkIGZvciB0aGUgZ2l2ZW4ga2V5IHdpdGggdGhlIGdpdmVuIHZhbHVlLiAqL1xyXG5hc3luYyBmdW5jdGlvbiBkYlNldChmaXJlYmFzZURlcGVuZGVuY2llcywgdG9rZW5EZXRhaWxzKSB7XHJcbiAgICBjb25zdCBrZXkgPSBnZXRLZXkoZmlyZWJhc2VEZXBlbmRlbmNpZXMpO1xyXG4gICAgY29uc3QgZGIgPSBhd2FpdCBnZXREYlByb21pc2UoKTtcclxuICAgIGNvbnN0IHR4ID0gZGIudHJhbnNhY3Rpb24oT0JKRUNUX1NUT1JFX05BTUUsICdyZWFkd3JpdGUnKTtcclxuICAgIGF3YWl0IHR4Lm9iamVjdFN0b3JlKE9CSkVDVF9TVE9SRV9OQU1FKS5wdXQodG9rZW5EZXRhaWxzLCBrZXkpO1xyXG4gICAgYXdhaXQgdHguZG9uZTtcclxuICAgIHJldHVybiB0b2tlbkRldGFpbHM7XHJcbn1cclxuLyoqIFJlbW92ZXMgcmVjb3JkKHMpIGZyb20gdGhlIG9iamVjdFN0b3JlIHRoYXQgbWF0Y2ggdGhlIGdpdmVuIGtleS4gKi9cclxuYXN5bmMgZnVuY3Rpb24gZGJSZW1vdmUoZmlyZWJhc2VEZXBlbmRlbmNpZXMpIHtcclxuICAgIGNvbnN0IGtleSA9IGdldEtleShmaXJlYmFzZURlcGVuZGVuY2llcyk7XHJcbiAgICBjb25zdCBkYiA9IGF3YWl0IGdldERiUHJvbWlzZSgpO1xyXG4gICAgY29uc3QgdHggPSBkYi50cmFuc2FjdGlvbihPQkpFQ1RfU1RPUkVfTkFNRSwgJ3JlYWR3cml0ZScpO1xyXG4gICAgYXdhaXQgdHgub2JqZWN0U3RvcmUoT0JKRUNUX1NUT1JFX05BTUUpLmRlbGV0ZShrZXkpO1xyXG4gICAgYXdhaXQgdHguZG9uZTtcclxufVxyXG5mdW5jdGlvbiBnZXRLZXkoeyBhcHBDb25maWcgfSkge1xyXG4gICAgcmV0dXJuIGFwcENvbmZpZy5hcHBJZDtcclxufVxuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMTcgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG5jb25zdCBFUlJPUl9NQVAgPSB7XHJcbiAgICBbXCJtaXNzaW5nLWFwcC1jb25maWctdmFsdWVzXCIgLyogRXJyb3JDb2RlLk1JU1NJTkdfQVBQX0NPTkZJR19WQUxVRVMgKi9dOiAnTWlzc2luZyBBcHAgY29uZmlndXJhdGlvbiB2YWx1ZTogXCJ7JHZhbHVlTmFtZX1cIicsXHJcbiAgICBbXCJvbmx5LWF2YWlsYWJsZS1pbi13aW5kb3dcIiAvKiBFcnJvckNvZGUuQVZBSUxBQkxFX0lOX1dJTkRPVyAqL106ICdUaGlzIG1ldGhvZCBpcyBhdmFpbGFibGUgaW4gYSBXaW5kb3cgY29udGV4dC4nLFxyXG4gICAgW1wib25seS1hdmFpbGFibGUtaW4tc3dcIiAvKiBFcnJvckNvZGUuQVZBSUxBQkxFX0lOX1NXICovXTogJ1RoaXMgbWV0aG9kIGlzIGF2YWlsYWJsZSBpbiBhIHNlcnZpY2Ugd29ya2VyIGNvbnRleHQuJyxcclxuICAgIFtcInBlcm1pc3Npb24tZGVmYXVsdFwiIC8qIEVycm9yQ29kZS5QRVJNSVNTSU9OX0RFRkFVTFQgKi9dOiAnVGhlIG5vdGlmaWNhdGlvbiBwZXJtaXNzaW9uIHdhcyBub3QgZ3JhbnRlZCBhbmQgZGlzbWlzc2VkIGluc3RlYWQuJyxcclxuICAgIFtcInBlcm1pc3Npb24tYmxvY2tlZFwiIC8qIEVycm9yQ29kZS5QRVJNSVNTSU9OX0JMT0NLRUQgKi9dOiAnVGhlIG5vdGlmaWNhdGlvbiBwZXJtaXNzaW9uIHdhcyBub3QgZ3JhbnRlZCBhbmQgYmxvY2tlZCBpbnN0ZWFkLicsXHJcbiAgICBbXCJ1bnN1cHBvcnRlZC1icm93c2VyXCIgLyogRXJyb3JDb2RlLlVOU1VQUE9SVEVEX0JST1dTRVIgKi9dOiBcIlRoaXMgYnJvd3NlciBkb2Vzbid0IHN1cHBvcnQgdGhlIEFQSSdzIHJlcXVpcmVkIHRvIHVzZSB0aGUgRmlyZWJhc2UgU0RLLlwiLFxyXG4gICAgW1wiaW5kZXhlZC1kYi11bnN1cHBvcnRlZFwiIC8qIEVycm9yQ29kZS5JTkRFWEVEX0RCX1VOU1VQUE9SVEVEICovXTogXCJUaGlzIGJyb3dzZXIgZG9lc24ndCBzdXBwb3J0IGluZGV4ZWREYi5vcGVuKCkgKGV4LiBTYWZhcmkgaUZyYW1lLCBGaXJlZm94IFByaXZhdGUgQnJvd3NpbmcsIGV0YylcIixcclxuICAgIFtcImZhaWxlZC1zZXJ2aWNlLXdvcmtlci1yZWdpc3RyYXRpb25cIiAvKiBFcnJvckNvZGUuRkFJTEVEX0RFRkFVTFRfUkVHSVNUUkFUSU9OICovXTogJ1dlIGFyZSB1bmFibGUgdG8gcmVnaXN0ZXIgdGhlIGRlZmF1bHQgc2VydmljZSB3b3JrZXIuIHskYnJvd3NlckVycm9yTWVzc2FnZX0nLFxyXG4gICAgW1widG9rZW4tc3Vic2NyaWJlLWZhaWxlZFwiIC8qIEVycm9yQ29kZS5UT0tFTl9TVUJTQ1JJQkVfRkFJTEVEICovXTogJ0EgcHJvYmxlbSBvY2N1cnJlZCB3aGlsZSBzdWJzY3JpYmluZyB0aGUgdXNlciB0byBGQ006IHskZXJyb3JJbmZvfScsXHJcbiAgICBbXCJ0b2tlbi1zdWJzY3JpYmUtbm8tdG9rZW5cIiAvKiBFcnJvckNvZGUuVE9LRU5fU1VCU0NSSUJFX05PX1RPS0VOICovXTogJ0ZDTSByZXR1cm5lZCBubyB0b2tlbiB3aGVuIHN1YnNjcmliaW5nIHRoZSB1c2VyIHRvIHB1c2guJyxcclxuICAgIFtcInRva2VuLXVuc3Vic2NyaWJlLWZhaWxlZFwiIC8qIEVycm9yQ29kZS5UT0tFTl9VTlNVQlNDUklCRV9GQUlMRUQgKi9dOiAnQSBwcm9ibGVtIG9jY3VycmVkIHdoaWxlIHVuc3Vic2NyaWJpbmcgdGhlICcgK1xyXG4gICAgICAgICd1c2VyIGZyb20gRkNNOiB7JGVycm9ySW5mb30nLFxyXG4gICAgW1widG9rZW4tdXBkYXRlLWZhaWxlZFwiIC8qIEVycm9yQ29kZS5UT0tFTl9VUERBVEVfRkFJTEVEICovXTogJ0EgcHJvYmxlbSBvY2N1cnJlZCB3aGlsZSB1cGRhdGluZyB0aGUgdXNlciBmcm9tIEZDTTogeyRlcnJvckluZm99JyxcclxuICAgIFtcInRva2VuLXVwZGF0ZS1uby10b2tlblwiIC8qIEVycm9yQ29kZS5UT0tFTl9VUERBVEVfTk9fVE9LRU4gKi9dOiAnRkNNIHJldHVybmVkIG5vIHRva2VuIHdoZW4gdXBkYXRpbmcgdGhlIHVzZXIgdG8gcHVzaC4nLFxyXG4gICAgW1widXNlLXN3LWFmdGVyLWdldC10b2tlblwiIC8qIEVycm9yQ29kZS5VU0VfU1dfQUZURVJfR0VUX1RPS0VOICovXTogJ1RoZSB1c2VTZXJ2aWNlV29ya2VyKCkgbWV0aG9kIG1heSBvbmx5IGJlIGNhbGxlZCBvbmNlIGFuZCBtdXN0IGJlICcgK1xyXG4gICAgICAgICdjYWxsZWQgYmVmb3JlIGNhbGxpbmcgZ2V0VG9rZW4oKSB0byBlbnN1cmUgeW91ciBzZXJ2aWNlIHdvcmtlciBpcyB1c2VkLicsXHJcbiAgICBbXCJpbnZhbGlkLXN3LXJlZ2lzdHJhdGlvblwiIC8qIEVycm9yQ29kZS5JTlZBTElEX1NXX1JFR0lTVFJBVElPTiAqL106ICdUaGUgaW5wdXQgdG8gdXNlU2VydmljZVdvcmtlcigpIG11c3QgYmUgYSBTZXJ2aWNlV29ya2VyUmVnaXN0cmF0aW9uLicsXHJcbiAgICBbXCJpbnZhbGlkLWJnLWhhbmRsZXJcIiAvKiBFcnJvckNvZGUuSU5WQUxJRF9CR19IQU5ETEVSICovXTogJ1RoZSBpbnB1dCB0byBzZXRCYWNrZ3JvdW5kTWVzc2FnZUhhbmRsZXIoKSBtdXN0IGJlIGEgZnVuY3Rpb24uJyxcclxuICAgIFtcImludmFsaWQtdmFwaWQta2V5XCIgLyogRXJyb3JDb2RlLklOVkFMSURfVkFQSURfS0VZICovXTogJ1RoZSBwdWJsaWMgVkFQSUQga2V5IG11c3QgYmUgYSBzdHJpbmcuJyxcclxuICAgIFtcInVzZS12YXBpZC1rZXktYWZ0ZXItZ2V0LXRva2VuXCIgLyogRXJyb3JDb2RlLlVTRV9WQVBJRF9LRVlfQUZURVJfR0VUX1RPS0VOICovXTogJ1RoZSB1c2VQdWJsaWNWYXBpZEtleSgpIG1ldGhvZCBtYXkgb25seSBiZSBjYWxsZWQgb25jZSBhbmQgbXVzdCBiZSAnICtcclxuICAgICAgICAnY2FsbGVkIGJlZm9yZSBjYWxsaW5nIGdldFRva2VuKCkgdG8gZW5zdXJlIHlvdXIgVkFQSUQga2V5IGlzIHVzZWQuJ1xyXG59O1xyXG5jb25zdCBFUlJPUl9GQUNUT1JZID0gbmV3IEVycm9yRmFjdG9yeSgnbWVzc2FnaW5nJywgJ01lc3NhZ2luZycsIEVSUk9SX01BUCk7XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAxOSBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbmFzeW5jIGZ1bmN0aW9uIHJlcXVlc3RHZXRUb2tlbihmaXJlYmFzZURlcGVuZGVuY2llcywgc3Vic2NyaXB0aW9uT3B0aW9ucykge1xyXG4gICAgY29uc3QgaGVhZGVycyA9IGF3YWl0IGdldEhlYWRlcnMoZmlyZWJhc2VEZXBlbmRlbmNpZXMpO1xyXG4gICAgY29uc3QgYm9keSA9IGdldEJvZHkoc3Vic2NyaXB0aW9uT3B0aW9ucyk7XHJcbiAgICBjb25zdCBzdWJzY3JpYmVPcHRpb25zID0ge1xyXG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICAgIGhlYWRlcnMsXHJcbiAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoYm9keSlcclxuICAgIH07XHJcbiAgICBsZXQgcmVzcG9uc2VEYXRhO1xyXG4gICAgdHJ5IHtcclxuICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGdldEVuZHBvaW50KGZpcmViYXNlRGVwZW5kZW5jaWVzLmFwcENvbmZpZyksIHN1YnNjcmliZU9wdGlvbnMpO1xyXG4gICAgICAgIHJlc3BvbnNlRGF0YSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuICAgIH1cclxuICAgIGNhdGNoIChlcnIpIHtcclxuICAgICAgICB0aHJvdyBFUlJPUl9GQUNUT1JZLmNyZWF0ZShcInRva2VuLXN1YnNjcmliZS1mYWlsZWRcIiAvKiBFcnJvckNvZGUuVE9LRU5fU1VCU0NSSUJFX0ZBSUxFRCAqLywge1xyXG4gICAgICAgICAgICBlcnJvckluZm86IGVyciA9PT0gbnVsbCB8fCBlcnIgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGVyci50b1N0cmluZygpXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBpZiAocmVzcG9uc2VEYXRhLmVycm9yKSB7XHJcbiAgICAgICAgY29uc3QgbWVzc2FnZSA9IHJlc3BvbnNlRGF0YS5lcnJvci5tZXNzYWdlO1xyXG4gICAgICAgIHRocm93IEVSUk9SX0ZBQ1RPUlkuY3JlYXRlKFwidG9rZW4tc3Vic2NyaWJlLWZhaWxlZFwiIC8qIEVycm9yQ29kZS5UT0tFTl9TVUJTQ1JJQkVfRkFJTEVEICovLCB7XHJcbiAgICAgICAgICAgIGVycm9ySW5mbzogbWVzc2FnZVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgaWYgKCFyZXNwb25zZURhdGEudG9rZW4pIHtcclxuICAgICAgICB0aHJvdyBFUlJPUl9GQUNUT1JZLmNyZWF0ZShcInRva2VuLXN1YnNjcmliZS1uby10b2tlblwiIC8qIEVycm9yQ29kZS5UT0tFTl9TVUJTQ1JJQkVfTk9fVE9LRU4gKi8pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3BvbnNlRGF0YS50b2tlbjtcclxufVxyXG5hc3luYyBmdW5jdGlvbiByZXF1ZXN0VXBkYXRlVG9rZW4oZmlyZWJhc2VEZXBlbmRlbmNpZXMsIHRva2VuRGV0YWlscykge1xyXG4gICAgY29uc3QgaGVhZGVycyA9IGF3YWl0IGdldEhlYWRlcnMoZmlyZWJhc2VEZXBlbmRlbmNpZXMpO1xyXG4gICAgY29uc3QgYm9keSA9IGdldEJvZHkodG9rZW5EZXRhaWxzLnN1YnNjcmlwdGlvbk9wdGlvbnMpO1xyXG4gICAgY29uc3QgdXBkYXRlT3B0aW9ucyA9IHtcclxuICAgICAgICBtZXRob2Q6ICdQQVRDSCcsXHJcbiAgICAgICAgaGVhZGVycyxcclxuICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShib2R5KVxyXG4gICAgfTtcclxuICAgIGxldCByZXNwb25zZURhdGE7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYCR7Z2V0RW5kcG9pbnQoZmlyZWJhc2VEZXBlbmRlbmNpZXMuYXBwQ29uZmlnKX0vJHt0b2tlbkRldGFpbHMudG9rZW59YCwgdXBkYXRlT3B0aW9ucyk7XHJcbiAgICAgICAgcmVzcG9uc2VEYXRhID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG4gICAgfVxyXG4gICAgY2F0Y2ggKGVycikge1xyXG4gICAgICAgIHRocm93IEVSUk9SX0ZBQ1RPUlkuY3JlYXRlKFwidG9rZW4tdXBkYXRlLWZhaWxlZFwiIC8qIEVycm9yQ29kZS5UT0tFTl9VUERBVEVfRkFJTEVEICovLCB7XHJcbiAgICAgICAgICAgIGVycm9ySW5mbzogZXJyID09PSBudWxsIHx8IGVyciA9PT0gdm9pZCAwID8gdm9pZCAwIDogZXJyLnRvU3RyaW5nKClcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIGlmIChyZXNwb25zZURhdGEuZXJyb3IpIHtcclxuICAgICAgICBjb25zdCBtZXNzYWdlID0gcmVzcG9uc2VEYXRhLmVycm9yLm1lc3NhZ2U7XHJcbiAgICAgICAgdGhyb3cgRVJST1JfRkFDVE9SWS5jcmVhdGUoXCJ0b2tlbi11cGRhdGUtZmFpbGVkXCIgLyogRXJyb3JDb2RlLlRPS0VOX1VQREFURV9GQUlMRUQgKi8sIHtcclxuICAgICAgICAgICAgZXJyb3JJbmZvOiBtZXNzYWdlXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBpZiAoIXJlc3BvbnNlRGF0YS50b2tlbikge1xyXG4gICAgICAgIHRocm93IEVSUk9SX0ZBQ1RPUlkuY3JlYXRlKFwidG9rZW4tdXBkYXRlLW5vLXRva2VuXCIgLyogRXJyb3JDb2RlLlRPS0VOX1VQREFURV9OT19UT0tFTiAqLyk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzcG9uc2VEYXRhLnRva2VuO1xyXG59XHJcbmFzeW5jIGZ1bmN0aW9uIHJlcXVlc3REZWxldGVUb2tlbihmaXJlYmFzZURlcGVuZGVuY2llcywgdG9rZW4pIHtcclxuICAgIGNvbnN0IGhlYWRlcnMgPSBhd2FpdCBnZXRIZWFkZXJzKGZpcmViYXNlRGVwZW5kZW5jaWVzKTtcclxuICAgIGNvbnN0IHVuc3Vic2NyaWJlT3B0aW9ucyA9IHtcclxuICAgICAgICBtZXRob2Q6ICdERUxFVEUnLFxyXG4gICAgICAgIGhlYWRlcnNcclxuICAgIH07XHJcbiAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYCR7Z2V0RW5kcG9pbnQoZmlyZWJhc2VEZXBlbmRlbmNpZXMuYXBwQ29uZmlnKX0vJHt0b2tlbn1gLCB1bnN1YnNjcmliZU9wdGlvbnMpO1xyXG4gICAgICAgIGNvbnN0IHJlc3BvbnNlRGF0YSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuICAgICAgICBpZiAocmVzcG9uc2VEYXRhLmVycm9yKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG1lc3NhZ2UgPSByZXNwb25zZURhdGEuZXJyb3IubWVzc2FnZTtcclxuICAgICAgICAgICAgdGhyb3cgRVJST1JfRkFDVE9SWS5jcmVhdGUoXCJ0b2tlbi11bnN1YnNjcmliZS1mYWlsZWRcIiAvKiBFcnJvckNvZGUuVE9LRU5fVU5TVUJTQ1JJQkVfRkFJTEVEICovLCB7XHJcbiAgICAgICAgICAgICAgICBlcnJvckluZm86IG1lc3NhZ2VcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgY2F0Y2ggKGVycikge1xyXG4gICAgICAgIHRocm93IEVSUk9SX0ZBQ1RPUlkuY3JlYXRlKFwidG9rZW4tdW5zdWJzY3JpYmUtZmFpbGVkXCIgLyogRXJyb3JDb2RlLlRPS0VOX1VOU1VCU0NSSUJFX0ZBSUxFRCAqLywge1xyXG4gICAgICAgICAgICBlcnJvckluZm86IGVyciA9PT0gbnVsbCB8fCBlcnIgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGVyci50b1N0cmluZygpXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gZ2V0RW5kcG9pbnQoeyBwcm9qZWN0SWQgfSkge1xyXG4gICAgcmV0dXJuIGAke0VORFBPSU5UfS9wcm9qZWN0cy8ke3Byb2plY3RJZH0vcmVnaXN0cmF0aW9uc2A7XHJcbn1cclxuYXN5bmMgZnVuY3Rpb24gZ2V0SGVhZGVycyh7IGFwcENvbmZpZywgaW5zdGFsbGF0aW9ucyB9KSB7XHJcbiAgICBjb25zdCBhdXRoVG9rZW4gPSBhd2FpdCBpbnN0YWxsYXRpb25zLmdldFRva2VuKCk7XHJcbiAgICByZXR1cm4gbmV3IEhlYWRlcnMoe1xyXG4gICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsXHJcbiAgICAgICAgQWNjZXB0OiAnYXBwbGljYXRpb24vanNvbicsXHJcbiAgICAgICAgJ3gtZ29vZy1hcGkta2V5JzogYXBwQ29uZmlnLmFwaUtleSxcclxuICAgICAgICAneC1nb29nLWZpcmViYXNlLWluc3RhbGxhdGlvbnMtYXV0aCc6IGBGSVMgJHthdXRoVG9rZW59YFxyXG4gICAgfSk7XHJcbn1cclxuZnVuY3Rpb24gZ2V0Qm9keSh7IHAyNTZkaCwgYXV0aCwgZW5kcG9pbnQsIHZhcGlkS2V5IH0pIHtcclxuICAgIGNvbnN0IGJvZHkgPSB7XHJcbiAgICAgICAgd2ViOiB7XHJcbiAgICAgICAgICAgIGVuZHBvaW50LFxyXG4gICAgICAgICAgICBhdXRoLFxyXG4gICAgICAgICAgICBwMjU2ZGhcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgaWYgKHZhcGlkS2V5ICE9PSBERUZBVUxUX1ZBUElEX0tFWSkge1xyXG4gICAgICAgIGJvZHkud2ViLmFwcGxpY2F0aW9uUHViS2V5ID0gdmFwaWRLZXk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYm9keTtcclxufVxuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMTkgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG4vLyBVcGRhdGVSZWdpc3RyYXRpb24gd2lsbCBiZSBjYWxsZWQgb25jZSBldmVyeSB3ZWVrLlxyXG5jb25zdCBUT0tFTl9FWFBJUkFUSU9OX01TID0gNyAqIDI0ICogNjAgKiA2MCAqIDEwMDA7IC8vIDcgZGF5c1xyXG5hc3luYyBmdW5jdGlvbiBnZXRUb2tlbkludGVybmFsKG1lc3NhZ2luZykge1xyXG4gICAgY29uc3QgcHVzaFN1YnNjcmlwdGlvbiA9IGF3YWl0IGdldFB1c2hTdWJzY3JpcHRpb24obWVzc2FnaW5nLnN3UmVnaXN0cmF0aW9uLCBtZXNzYWdpbmcudmFwaWRLZXkpO1xyXG4gICAgY29uc3Qgc3Vic2NyaXB0aW9uT3B0aW9ucyA9IHtcclxuICAgICAgICB2YXBpZEtleTogbWVzc2FnaW5nLnZhcGlkS2V5LFxyXG4gICAgICAgIHN3U2NvcGU6IG1lc3NhZ2luZy5zd1JlZ2lzdHJhdGlvbi5zY29wZSxcclxuICAgICAgICBlbmRwb2ludDogcHVzaFN1YnNjcmlwdGlvbi5lbmRwb2ludCxcclxuICAgICAgICBhdXRoOiBhcnJheVRvQmFzZTY0KHB1c2hTdWJzY3JpcHRpb24uZ2V0S2V5KCdhdXRoJykpLFxyXG4gICAgICAgIHAyNTZkaDogYXJyYXlUb0Jhc2U2NChwdXNoU3Vic2NyaXB0aW9uLmdldEtleSgncDI1NmRoJykpXHJcbiAgICB9O1xyXG4gICAgY29uc3QgdG9rZW5EZXRhaWxzID0gYXdhaXQgZGJHZXQobWVzc2FnaW5nLmZpcmViYXNlRGVwZW5kZW5jaWVzKTtcclxuICAgIGlmICghdG9rZW5EZXRhaWxzKSB7XHJcbiAgICAgICAgLy8gTm8gdG9rZW4sIGdldCBhIG5ldyBvbmUuXHJcbiAgICAgICAgcmV0dXJuIGdldE5ld1Rva2VuKG1lc3NhZ2luZy5maXJlYmFzZURlcGVuZGVuY2llcywgc3Vic2NyaXB0aW9uT3B0aW9ucyk7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmICghaXNUb2tlblZhbGlkKHRva2VuRGV0YWlscy5zdWJzY3JpcHRpb25PcHRpb25zLCBzdWJzY3JpcHRpb25PcHRpb25zKSkge1xyXG4gICAgICAgIC8vIEludmFsaWQgdG9rZW4sIGdldCBhIG5ldyBvbmUuXHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgYXdhaXQgcmVxdWVzdERlbGV0ZVRva2VuKG1lc3NhZ2luZy5maXJlYmFzZURlcGVuZGVuY2llcywgdG9rZW5EZXRhaWxzLnRva2VuKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgLy8gU3VwcHJlc3MgZXJyb3JzIGJlY2F1c2Ugb2YgIzIzNjRcclxuICAgICAgICAgICAgY29uc29sZS53YXJuKGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZ2V0TmV3VG9rZW4obWVzc2FnaW5nLmZpcmViYXNlRGVwZW5kZW5jaWVzLCBzdWJzY3JpcHRpb25PcHRpb25zKTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKERhdGUubm93KCkgPj0gdG9rZW5EZXRhaWxzLmNyZWF0ZVRpbWUgKyBUT0tFTl9FWFBJUkFUSU9OX01TKSB7XHJcbiAgICAgICAgLy8gV2Vla2x5IHRva2VuIHJlZnJlc2hcclxuICAgICAgICByZXR1cm4gdXBkYXRlVG9rZW4obWVzc2FnaW5nLCB7XHJcbiAgICAgICAgICAgIHRva2VuOiB0b2tlbkRldGFpbHMudG9rZW4sXHJcbiAgICAgICAgICAgIGNyZWF0ZVRpbWU6IERhdGUubm93KCksXHJcbiAgICAgICAgICAgIHN1YnNjcmlwdGlvbk9wdGlvbnNcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIC8vIFZhbGlkIHRva2VuLCBub3RoaW5nIHRvIGRvLlxyXG4gICAgICAgIHJldHVybiB0b2tlbkRldGFpbHMudG9rZW47XHJcbiAgICB9XHJcbn1cclxuLyoqXHJcbiAqIFRoaXMgbWV0aG9kIGRlbGV0ZXMgdGhlIHRva2VuIGZyb20gdGhlIGRhdGFiYXNlLCB1bnN1YnNjcmliZXMgdGhlIHRva2VuIGZyb20gRkNNLCBhbmQgdW5yZWdpc3RlcnNcclxuICogdGhlIHB1c2ggc3Vic2NyaXB0aW9uIGlmIGl0IGV4aXN0cy5cclxuICovXHJcbmFzeW5jIGZ1bmN0aW9uIGRlbGV0ZVRva2VuSW50ZXJuYWwobWVzc2FnaW5nKSB7XHJcbiAgICBjb25zdCB0b2tlbkRldGFpbHMgPSBhd2FpdCBkYkdldChtZXNzYWdpbmcuZmlyZWJhc2VEZXBlbmRlbmNpZXMpO1xyXG4gICAgaWYgKHRva2VuRGV0YWlscykge1xyXG4gICAgICAgIGF3YWl0IHJlcXVlc3REZWxldGVUb2tlbihtZXNzYWdpbmcuZmlyZWJhc2VEZXBlbmRlbmNpZXMsIHRva2VuRGV0YWlscy50b2tlbik7XHJcbiAgICAgICAgYXdhaXQgZGJSZW1vdmUobWVzc2FnaW5nLmZpcmViYXNlRGVwZW5kZW5jaWVzKTtcclxuICAgIH1cclxuICAgIC8vIFVuc3Vic2NyaWJlIGZyb20gdGhlIHB1c2ggc3Vic2NyaXB0aW9uLlxyXG4gICAgY29uc3QgcHVzaFN1YnNjcmlwdGlvbiA9IGF3YWl0IG1lc3NhZ2luZy5zd1JlZ2lzdHJhdGlvbi5wdXNoTWFuYWdlci5nZXRTdWJzY3JpcHRpb24oKTtcclxuICAgIGlmIChwdXNoU3Vic2NyaXB0aW9uKSB7XHJcbiAgICAgICAgcmV0dXJuIHB1c2hTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcclxuICAgIH1cclxuICAgIC8vIElmIHRoZXJlJ3Mgbm8gU1csIGNvbnNpZGVyIGl0IGEgc3VjY2Vzcy5cclxuICAgIHJldHVybiB0cnVlO1xyXG59XHJcbmFzeW5jIGZ1bmN0aW9uIHVwZGF0ZVRva2VuKG1lc3NhZ2luZywgdG9rZW5EZXRhaWxzKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IHVwZGF0ZWRUb2tlbiA9IGF3YWl0IHJlcXVlc3RVcGRhdGVUb2tlbihtZXNzYWdpbmcuZmlyZWJhc2VEZXBlbmRlbmNpZXMsIHRva2VuRGV0YWlscyk7XHJcbiAgICAgICAgY29uc3QgdXBkYXRlZFRva2VuRGV0YWlscyA9IE9iamVjdC5hc3NpZ24oT2JqZWN0LmFzc2lnbih7fSwgdG9rZW5EZXRhaWxzKSwgeyB0b2tlbjogdXBkYXRlZFRva2VuLCBjcmVhdGVUaW1lOiBEYXRlLm5vdygpIH0pO1xyXG4gICAgICAgIGF3YWl0IGRiU2V0KG1lc3NhZ2luZy5maXJlYmFzZURlcGVuZGVuY2llcywgdXBkYXRlZFRva2VuRGV0YWlscyk7XHJcbiAgICAgICAgcmV0dXJuIHVwZGF0ZWRUb2tlbjtcclxuICAgIH1cclxuICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgdGhyb3cgZTtcclxuICAgIH1cclxufVxyXG5hc3luYyBmdW5jdGlvbiBnZXROZXdUb2tlbihmaXJlYmFzZURlcGVuZGVuY2llcywgc3Vic2NyaXB0aW9uT3B0aW9ucykge1xyXG4gICAgY29uc3QgdG9rZW4gPSBhd2FpdCByZXF1ZXN0R2V0VG9rZW4oZmlyZWJhc2VEZXBlbmRlbmNpZXMsIHN1YnNjcmlwdGlvbk9wdGlvbnMpO1xyXG4gICAgY29uc3QgdG9rZW5EZXRhaWxzID0ge1xyXG4gICAgICAgIHRva2VuLFxyXG4gICAgICAgIGNyZWF0ZVRpbWU6IERhdGUubm93KCksXHJcbiAgICAgICAgc3Vic2NyaXB0aW9uT3B0aW9uc1xyXG4gICAgfTtcclxuICAgIGF3YWl0IGRiU2V0KGZpcmViYXNlRGVwZW5kZW5jaWVzLCB0b2tlbkRldGFpbHMpO1xyXG4gICAgcmV0dXJuIHRva2VuRGV0YWlscy50b2tlbjtcclxufVxyXG4vKipcclxuICogR2V0cyBhIFB1c2hTdWJzY3JpcHRpb24gZm9yIHRoZSBjdXJyZW50IHVzZXIuXHJcbiAqL1xyXG5hc3luYyBmdW5jdGlvbiBnZXRQdXNoU3Vic2NyaXB0aW9uKHN3UmVnaXN0cmF0aW9uLCB2YXBpZEtleSkge1xyXG4gICAgY29uc3Qgc3Vic2NyaXB0aW9uID0gYXdhaXQgc3dSZWdpc3RyYXRpb24ucHVzaE1hbmFnZXIuZ2V0U3Vic2NyaXB0aW9uKCk7XHJcbiAgICBpZiAoc3Vic2NyaXB0aW9uKSB7XHJcbiAgICAgICAgcmV0dXJuIHN1YnNjcmlwdGlvbjtcclxuICAgIH1cclxuICAgIHJldHVybiBzd1JlZ2lzdHJhdGlvbi5wdXNoTWFuYWdlci5zdWJzY3JpYmUoe1xyXG4gICAgICAgIHVzZXJWaXNpYmxlT25seTogdHJ1ZSxcclxuICAgICAgICAvLyBDaHJvbWUgPD0gNzUgZG9lc24ndCBzdXBwb3J0IGJhc2U2NC1lbmNvZGVkIFZBUElEIGtleS4gRm9yIGJhY2t3YXJkIGNvbXBhdGliaWxpdHksIFZBUElEIGtleVxyXG4gICAgICAgIC8vIHN1Ym1pdHRlZCB0byBwdXNoTWFuYWdlciNzdWJzY3JpYmUgbXVzdCBiZSBvZiB0eXBlIFVpbnQ4QXJyYXkuXHJcbiAgICAgICAgYXBwbGljYXRpb25TZXJ2ZXJLZXk6IGJhc2U2NFRvQXJyYXkodmFwaWRLZXkpXHJcbiAgICB9KTtcclxufVxyXG4vKipcclxuICogQ2hlY2tzIGlmIHRoZSBzYXZlZCB0b2tlbkRldGFpbHMgb2JqZWN0IG1hdGNoZXMgdGhlIGNvbmZpZ3VyYXRpb24gcHJvdmlkZWQuXHJcbiAqL1xyXG5mdW5jdGlvbiBpc1Rva2VuVmFsaWQoZGJPcHRpb25zLCBjdXJyZW50T3B0aW9ucykge1xyXG4gICAgY29uc3QgaXNWYXBpZEtleUVxdWFsID0gY3VycmVudE9wdGlvbnMudmFwaWRLZXkgPT09IGRiT3B0aW9ucy52YXBpZEtleTtcclxuICAgIGNvbnN0IGlzRW5kcG9pbnRFcXVhbCA9IGN1cnJlbnRPcHRpb25zLmVuZHBvaW50ID09PSBkYk9wdGlvbnMuZW5kcG9pbnQ7XHJcbiAgICBjb25zdCBpc0F1dGhFcXVhbCA9IGN1cnJlbnRPcHRpb25zLmF1dGggPT09IGRiT3B0aW9ucy5hdXRoO1xyXG4gICAgY29uc3QgaXNQMjU2ZGhFcXVhbCA9IGN1cnJlbnRPcHRpb25zLnAyNTZkaCA9PT0gZGJPcHRpb25zLnAyNTZkaDtcclxuICAgIHJldHVybiBpc1ZhcGlkS2V5RXF1YWwgJiYgaXNFbmRwb2ludEVxdWFsICYmIGlzQXV0aEVxdWFsICYmIGlzUDI1NmRoRXF1YWw7XHJcbn1cblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDIwIEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuZnVuY3Rpb24gZXh0ZXJuYWxpemVQYXlsb2FkKGludGVybmFsUGF5bG9hZCkge1xyXG4gICAgY29uc3QgcGF5bG9hZCA9IHtcclxuICAgICAgICBmcm9tOiBpbnRlcm5hbFBheWxvYWQuZnJvbSxcclxuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgY2FtZWxjYXNlXHJcbiAgICAgICAgY29sbGFwc2VLZXk6IGludGVybmFsUGF5bG9hZC5jb2xsYXBzZV9rZXksXHJcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGNhbWVsY2FzZVxyXG4gICAgICAgIG1lc3NhZ2VJZDogaW50ZXJuYWxQYXlsb2FkLmZjbU1lc3NhZ2VJZFxyXG4gICAgfTtcclxuICAgIHByb3BhZ2F0ZU5vdGlmaWNhdGlvblBheWxvYWQocGF5bG9hZCwgaW50ZXJuYWxQYXlsb2FkKTtcclxuICAgIHByb3BhZ2F0ZURhdGFQYXlsb2FkKHBheWxvYWQsIGludGVybmFsUGF5bG9hZCk7XHJcbiAgICBwcm9wYWdhdGVGY21PcHRpb25zKHBheWxvYWQsIGludGVybmFsUGF5bG9hZCk7XHJcbiAgICByZXR1cm4gcGF5bG9hZDtcclxufVxyXG5mdW5jdGlvbiBwcm9wYWdhdGVOb3RpZmljYXRpb25QYXlsb2FkKHBheWxvYWQsIG1lc3NhZ2VQYXlsb2FkSW50ZXJuYWwpIHtcclxuICAgIGlmICghbWVzc2FnZVBheWxvYWRJbnRlcm5hbC5ub3RpZmljYXRpb24pIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBwYXlsb2FkLm5vdGlmaWNhdGlvbiA9IHt9O1xyXG4gICAgY29uc3QgdGl0bGUgPSBtZXNzYWdlUGF5bG9hZEludGVybmFsLm5vdGlmaWNhdGlvbi50aXRsZTtcclxuICAgIGlmICghIXRpdGxlKSB7XHJcbiAgICAgICAgcGF5bG9hZC5ub3RpZmljYXRpb24udGl0bGUgPSB0aXRsZTtcclxuICAgIH1cclxuICAgIGNvbnN0IGJvZHkgPSBtZXNzYWdlUGF5bG9hZEludGVybmFsLm5vdGlmaWNhdGlvbi5ib2R5O1xyXG4gICAgaWYgKCEhYm9keSkge1xyXG4gICAgICAgIHBheWxvYWQubm90aWZpY2F0aW9uLmJvZHkgPSBib2R5O1xyXG4gICAgfVxyXG4gICAgY29uc3QgaW1hZ2UgPSBtZXNzYWdlUGF5bG9hZEludGVybmFsLm5vdGlmaWNhdGlvbi5pbWFnZTtcclxuICAgIGlmICghIWltYWdlKSB7XHJcbiAgICAgICAgcGF5bG9hZC5ub3RpZmljYXRpb24uaW1hZ2UgPSBpbWFnZTtcclxuICAgIH1cclxuICAgIGNvbnN0IGljb24gPSBtZXNzYWdlUGF5bG9hZEludGVybmFsLm5vdGlmaWNhdGlvbi5pY29uO1xyXG4gICAgaWYgKCEhaWNvbikge1xyXG4gICAgICAgIHBheWxvYWQubm90aWZpY2F0aW9uLmljb24gPSBpY29uO1xyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIHByb3BhZ2F0ZURhdGFQYXlsb2FkKHBheWxvYWQsIG1lc3NhZ2VQYXlsb2FkSW50ZXJuYWwpIHtcclxuICAgIGlmICghbWVzc2FnZVBheWxvYWRJbnRlcm5hbC5kYXRhKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgcGF5bG9hZC5kYXRhID0gbWVzc2FnZVBheWxvYWRJbnRlcm5hbC5kYXRhO1xyXG59XHJcbmZ1bmN0aW9uIHByb3BhZ2F0ZUZjbU9wdGlvbnMocGF5bG9hZCwgbWVzc2FnZVBheWxvYWRJbnRlcm5hbCkge1xyXG4gICAgdmFyIF9hLCBfYiwgX2MsIF9kLCBfZTtcclxuICAgIC8vIGZjbU9wdGlvbnMubGluayB2YWx1ZSBpcyB3cml0dGVuIGludG8gbm90aWZpY2F0aW9uLmNsaWNrX2FjdGlvbi4gc2VlIG1vcmUgaW4gYi8yMzIwNzIxMTFcclxuICAgIGlmICghbWVzc2FnZVBheWxvYWRJbnRlcm5hbC5mY21PcHRpb25zICYmXHJcbiAgICAgICAgISgoX2EgPSBtZXNzYWdlUGF5bG9hZEludGVybmFsLm5vdGlmaWNhdGlvbikgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmNsaWNrX2FjdGlvbikpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBwYXlsb2FkLmZjbU9wdGlvbnMgPSB7fTtcclxuICAgIGNvbnN0IGxpbmsgPSAoX2MgPSAoX2IgPSBtZXNzYWdlUGF5bG9hZEludGVybmFsLmZjbU9wdGlvbnMpID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYi5saW5rKSAhPT0gbnVsbCAmJiBfYyAhPT0gdm9pZCAwID8gX2MgOiAoX2QgPSBtZXNzYWdlUGF5bG9hZEludGVybmFsLm5vdGlmaWNhdGlvbikgPT09IG51bGwgfHwgX2QgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9kLmNsaWNrX2FjdGlvbjtcclxuICAgIGlmICghIWxpbmspIHtcclxuICAgICAgICBwYXlsb2FkLmZjbU9wdGlvbnMubGluayA9IGxpbms7XHJcbiAgICB9XHJcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgY2FtZWxjYXNlXHJcbiAgICBjb25zdCBhbmFseXRpY3NMYWJlbCA9IChfZSA9IG1lc3NhZ2VQYXlsb2FkSW50ZXJuYWwuZmNtT3B0aW9ucykgPT09IG51bGwgfHwgX2UgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9lLmFuYWx5dGljc19sYWJlbDtcclxuICAgIGlmICghIWFuYWx5dGljc0xhYmVsKSB7XHJcbiAgICAgICAgcGF5bG9hZC5mY21PcHRpb25zLmFuYWx5dGljc0xhYmVsID0gYW5hbHl0aWNzTGFiZWw7XHJcbiAgICB9XHJcbn1cblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDE5IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuZnVuY3Rpb24gaXNDb25zb2xlTWVzc2FnZShkYXRhKSB7XHJcbiAgICAvLyBUaGlzIG1lc3NhZ2UgaGFzIGEgY2FtcGFpZ24gSUQsIG1lYW5pbmcgaXQgd2FzIHNlbnQgdXNpbmcgdGhlIEZpcmViYXNlIENvbnNvbGUuXHJcbiAgICByZXR1cm4gdHlwZW9mIGRhdGEgPT09ICdvYmplY3QnICYmICEhZGF0YSAmJiBDT05TT0xFX0NBTVBBSUdOX0lEIGluIGRhdGE7XHJcbn1cblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDE5IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuLyoqIFJldHVybnMgYSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgYWZ0ZXIgZ2l2ZW4gdGltZSBwYXNzZXMuICovXHJcbmZ1bmN0aW9uIHNsZWVwKG1zKSB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XHJcbiAgICAgICAgc2V0VGltZW91dChyZXNvbHZlLCBtcyk7XHJcbiAgICB9KTtcclxufVxuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMTkgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG5fbWVyZ2VTdHJpbmdzKCdodHMvZnJic2xnaWdwLm9nZXBzY212L2llby9lYXlsZycsICd0cDovaWVhZW9nbi1hZ29sYWkuby8xZnJsZ2xnYy9vJyk7XHJcbl9tZXJnZVN0cmluZ3MoJ0F6U0NidzYzZzFSMG5Ddzg1akc4JywgJ0lheWEzeUxLd21ndmg3Y0YwcTQnKTtcclxuYXN5bmMgZnVuY3Rpb24gc3RhZ2VMb2cobWVzc2FnaW5nLCBpbnRlcm5hbFBheWxvYWQpIHtcclxuICAgIGNvbnN0IGZjbUV2ZW50ID0gY3JlYXRlRmNtRXZlbnQoaW50ZXJuYWxQYXlsb2FkLCBhd2FpdCBtZXNzYWdpbmcuZmlyZWJhc2VEZXBlbmRlbmNpZXMuaW5zdGFsbGF0aW9ucy5nZXRJZCgpKTtcclxuICAgIGNyZWF0ZUFuZEVucXVldWVMb2dFdmVudChtZXNzYWdpbmcsIGZjbUV2ZW50LCBpbnRlcm5hbFBheWxvYWQucHJvZHVjdElkKTtcclxufVxyXG5mdW5jdGlvbiBjcmVhdGVGY21FdmVudChpbnRlcm5hbFBheWxvYWQsIGZpZCkge1xyXG4gICAgdmFyIF9hLCBfYjtcclxuICAgIGNvbnN0IGZjbUV2ZW50ID0ge307XHJcbiAgICAvKiBlc2xpbnQtZGlzYWJsZSBjYW1lbGNhc2UgKi9cclxuICAgIC8vIHNvbWUgZmllbGRzIHNob3VsZCBhbHdheXMgYmUgbm9uLW51bGwuIFN0aWxsIGNoZWNrIHRvIGVuc3VyZS5cclxuICAgIGlmICghIWludGVybmFsUGF5bG9hZC5mcm9tKSB7XHJcbiAgICAgICAgZmNtRXZlbnQucHJvamVjdF9udW1iZXIgPSBpbnRlcm5hbFBheWxvYWQuZnJvbTtcclxuICAgIH1cclxuICAgIGlmICghIWludGVybmFsUGF5bG9hZC5mY21NZXNzYWdlSWQpIHtcclxuICAgICAgICBmY21FdmVudC5tZXNzYWdlX2lkID0gaW50ZXJuYWxQYXlsb2FkLmZjbU1lc3NhZ2VJZDtcclxuICAgIH1cclxuICAgIGZjbUV2ZW50Lmluc3RhbmNlX2lkID0gZmlkO1xyXG4gICAgaWYgKCEhaW50ZXJuYWxQYXlsb2FkLm5vdGlmaWNhdGlvbikge1xyXG4gICAgICAgIGZjbUV2ZW50Lm1lc3NhZ2VfdHlwZSA9IE1lc3NhZ2VUeXBlJDEuRElTUExBWV9OT1RJRklDQVRJT04udG9TdHJpbmcoKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGZjbUV2ZW50Lm1lc3NhZ2VfdHlwZSA9IE1lc3NhZ2VUeXBlJDEuREFUQV9NRVNTQUdFLnRvU3RyaW5nKCk7XHJcbiAgICB9XHJcbiAgICBmY21FdmVudC5zZGtfcGxhdGZvcm0gPSBTREtfUExBVEZPUk1fV0VCLnRvU3RyaW5nKCk7XHJcbiAgICBmY21FdmVudC5wYWNrYWdlX25hbWUgPSBzZWxmLm9yaWdpbi5yZXBsYWNlKC8oXlxcdys6fF4pXFwvXFwvLywgJycpO1xyXG4gICAgaWYgKCEhaW50ZXJuYWxQYXlsb2FkLmNvbGxhcHNlX2tleSkge1xyXG4gICAgICAgIGZjbUV2ZW50LmNvbGxhcHNlX2tleSA9IGludGVybmFsUGF5bG9hZC5jb2xsYXBzZV9rZXk7XHJcbiAgICB9XHJcbiAgICBmY21FdmVudC5ldmVudCA9IEVWRU5UX01FU1NBR0VfREVMSVZFUkVELnRvU3RyaW5nKCk7XHJcbiAgICBpZiAoISEoKF9hID0gaW50ZXJuYWxQYXlsb2FkLmZjbU9wdGlvbnMpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5hbmFseXRpY3NfbGFiZWwpKSB7XHJcbiAgICAgICAgZmNtRXZlbnQuYW5hbHl0aWNzX2xhYmVsID0gKF9iID0gaW50ZXJuYWxQYXlsb2FkLmZjbU9wdGlvbnMpID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYi5hbmFseXRpY3NfbGFiZWw7XHJcbiAgICB9XHJcbiAgICAvKiBlc2xpbnQtZW5hYmxlIGNhbWVsY2FzZSAqL1xyXG4gICAgcmV0dXJuIGZjbUV2ZW50O1xyXG59XHJcbmZ1bmN0aW9uIGNyZWF0ZUFuZEVucXVldWVMb2dFdmVudChtZXNzYWdpbmcsIGZjbUV2ZW50LCBwcm9kdWN0SWQpIHtcclxuICAgIGNvbnN0IGxvZ0V2ZW50ID0ge307XHJcbiAgICAvKiBlc2xpbnQtZGlzYWJsZSBjYW1lbGNhc2UgKi9cclxuICAgIGxvZ0V2ZW50LmV2ZW50X3RpbWVfbXMgPSBNYXRoLmZsb29yKERhdGUubm93KCkpLnRvU3RyaW5nKCk7XHJcbiAgICBsb2dFdmVudC5zb3VyY2VfZXh0ZW5zaW9uX2pzb25fcHJvdG8zID0gSlNPTi5zdHJpbmdpZnkoZmNtRXZlbnQpO1xyXG4gICAgaWYgKCEhcHJvZHVjdElkKSB7XHJcbiAgICAgICAgbG9nRXZlbnQuY29tcGxpYW5jZV9kYXRhID0gYnVpbGRDb21wbGlhbmNlRGF0YShwcm9kdWN0SWQpO1xyXG4gICAgfVxyXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGNhbWVsY2FzZVxyXG4gICAgbWVzc2FnaW5nLmxvZ0V2ZW50cy5wdXNoKGxvZ0V2ZW50KTtcclxufVxyXG5mdW5jdGlvbiBidWlsZENvbXBsaWFuY2VEYXRhKHByb2R1Y3RJZCkge1xyXG4gICAgY29uc3QgY29tcGxpYW5jZURhdGEgPSB7XHJcbiAgICAgICAgcHJpdmFjeV9jb250ZXh0OiB7XHJcbiAgICAgICAgICAgIHByZXF1ZXN0OiB7XHJcbiAgICAgICAgICAgICAgICBvcmlnaW5fYXNzb2NpYXRlZF9wcm9kdWN0X2lkOiBwcm9kdWN0SWRcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICByZXR1cm4gY29tcGxpYW5jZURhdGE7XHJcbn1cclxuZnVuY3Rpb24gX21lcmdlU3RyaW5ncyhzMSwgczIpIHtcclxuICAgIGNvbnN0IHJlc3VsdEFycmF5ID0gW107XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHMxLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgcmVzdWx0QXJyYXkucHVzaChzMS5jaGFyQXQoaSkpO1xyXG4gICAgICAgIGlmIChpIDwgczIubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHJlc3VsdEFycmF5LnB1c2goczIuY2hhckF0KGkpKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0QXJyYXkuam9pbignJyk7XHJcbn1cblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDE3IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuYXN5bmMgZnVuY3Rpb24gb25TdWJDaGFuZ2UoZXZlbnQsIG1lc3NhZ2luZykge1xyXG4gICAgdmFyIF9hLCBfYjtcclxuICAgIGNvbnN0IHsgbmV3U3Vic2NyaXB0aW9uIH0gPSBldmVudDtcclxuICAgIGlmICghbmV3U3Vic2NyaXB0aW9uKSB7XHJcbiAgICAgICAgLy8gU3Vic2NyaXB0aW9uIHJldm9rZWQsIGRlbGV0ZSB0b2tlblxyXG4gICAgICAgIGF3YWl0IGRlbGV0ZVRva2VuSW50ZXJuYWwobWVzc2FnaW5nKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBjb25zdCB0b2tlbkRldGFpbHMgPSBhd2FpdCBkYkdldChtZXNzYWdpbmcuZmlyZWJhc2VEZXBlbmRlbmNpZXMpO1xyXG4gICAgYXdhaXQgZGVsZXRlVG9rZW5JbnRlcm5hbChtZXNzYWdpbmcpO1xyXG4gICAgbWVzc2FnaW5nLnZhcGlkS2V5ID1cclxuICAgICAgICAoX2IgPSAoX2EgPSB0b2tlbkRldGFpbHMgPT09IG51bGwgfHwgdG9rZW5EZXRhaWxzID09PSB2b2lkIDAgPyB2b2lkIDAgOiB0b2tlbkRldGFpbHMuc3Vic2NyaXB0aW9uT3B0aW9ucykgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLnZhcGlkS2V5KSAhPT0gbnVsbCAmJiBfYiAhPT0gdm9pZCAwID8gX2IgOiBERUZBVUxUX1ZBUElEX0tFWTtcclxuICAgIGF3YWl0IGdldFRva2VuSW50ZXJuYWwobWVzc2FnaW5nKTtcclxufVxyXG5hc3luYyBmdW5jdGlvbiBvblB1c2goZXZlbnQsIG1lc3NhZ2luZykge1xyXG4gICAgY29uc3QgaW50ZXJuYWxQYXlsb2FkID0gZ2V0TWVzc2FnZVBheWxvYWRJbnRlcm5hbChldmVudCk7XHJcbiAgICBpZiAoIWludGVybmFsUGF5bG9hZCkge1xyXG4gICAgICAgIC8vIEZhaWxlZCB0byBnZXQgcGFyc2VkIE1lc3NhZ2VQYXlsb2FkIGZyb20gdGhlIFB1c2hFdmVudC4gU2tpcCBoYW5kbGluZyB0aGUgcHVzaC5cclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICAvLyBsb2cgdG8gRmlyZWxvZyB3aXRoIHVzZXIgY29uc2VudFxyXG4gICAgaWYgKG1lc3NhZ2luZy5kZWxpdmVyeU1ldHJpY3NFeHBvcnRlZFRvQmlnUXVlcnlFbmFibGVkKSB7XHJcbiAgICAgICAgYXdhaXQgc3RhZ2VMb2cobWVzc2FnaW5nLCBpbnRlcm5hbFBheWxvYWQpO1xyXG4gICAgfVxyXG4gICAgLy8gZm9yZWdyb3VuZCBoYW5kbGluZzogZXZlbnR1YWxseSBwYXNzZWQgdG8gb25NZXNzYWdlIGhvb2tcclxuICAgIGNvbnN0IGNsaWVudExpc3QgPSBhd2FpdCBnZXRDbGllbnRMaXN0KCk7XHJcbiAgICBpZiAoaGFzVmlzaWJsZUNsaWVudHMoY2xpZW50TGlzdCkpIHtcclxuICAgICAgICByZXR1cm4gc2VuZE1lc3NhZ2VQYXlsb2FkSW50ZXJuYWxUb1dpbmRvd3MoY2xpZW50TGlzdCwgaW50ZXJuYWxQYXlsb2FkKTtcclxuICAgIH1cclxuICAgIC8vIGJhY2tncm91bmQgaGFuZGxpbmc6IGRpc3BsYXkgaWYgcG9zc2libGUgYW5kIHBhc3MgdG8gb25CYWNrZ3JvdW5kTWVzc2FnZSBob29rXHJcbiAgICBpZiAoISFpbnRlcm5hbFBheWxvYWQubm90aWZpY2F0aW9uKSB7XHJcbiAgICAgICAgYXdhaXQgc2hvd05vdGlmaWNhdGlvbih3cmFwSW50ZXJuYWxQYXlsb2FkKGludGVybmFsUGF5bG9hZCkpO1xyXG4gICAgfVxyXG4gICAgaWYgKCFtZXNzYWdpbmcpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBpZiAoISFtZXNzYWdpbmcub25CYWNrZ3JvdW5kTWVzc2FnZUhhbmRsZXIpIHtcclxuICAgICAgICBjb25zdCBwYXlsb2FkID0gZXh0ZXJuYWxpemVQYXlsb2FkKGludGVybmFsUGF5bG9hZCk7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBtZXNzYWdpbmcub25CYWNrZ3JvdW5kTWVzc2FnZUhhbmRsZXIgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgYXdhaXQgbWVzc2FnaW5nLm9uQmFja2dyb3VuZE1lc3NhZ2VIYW5kbGVyKHBheWxvYWQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgbWVzc2FnaW5nLm9uQmFja2dyb3VuZE1lc3NhZ2VIYW5kbGVyLm5leHQocGF5bG9hZCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbmFzeW5jIGZ1bmN0aW9uIG9uTm90aWZpY2F0aW9uQ2xpY2soZXZlbnQpIHtcclxuICAgIHZhciBfYSwgX2I7XHJcbiAgICBjb25zdCBpbnRlcm5hbFBheWxvYWQgPSAoX2IgPSAoX2EgPSBldmVudC5ub3RpZmljYXRpb24pID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5kYXRhKSA9PT0gbnVsbCB8fCBfYiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2JbRkNNX01TR107XHJcbiAgICBpZiAoIWludGVybmFsUGF5bG9hZCkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKGV2ZW50LmFjdGlvbikge1xyXG4gICAgICAgIC8vIFVzZXIgY2xpY2tlZCBvbiBhbiBhY3Rpb24gYnV0dG9uLiBUaGlzIHdpbGwgYWxsb3cgZGV2ZWxvcGVycyB0byBhY3Qgb24gYWN0aW9uIGJ1dHRvbiBjbGlja3NcclxuICAgICAgICAvLyBieSB1c2luZyBhIGN1c3RvbSBvbk5vdGlmaWNhdGlvbkNsaWNrIGxpc3RlbmVyIHRoYXQgdGhleSBkZWZpbmUuXHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgLy8gUHJldmVudCBvdGhlciBsaXN0ZW5lcnMgZnJvbSByZWNlaXZpbmcgdGhlIGV2ZW50XHJcbiAgICBldmVudC5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcclxuICAgIGV2ZW50Lm5vdGlmaWNhdGlvbi5jbG9zZSgpO1xyXG4gICAgLy8gTm90ZSBjbGlja2luZyBvbiBhIG5vdGlmaWNhdGlvbiB3aXRoIG5vIGxpbmsgc2V0IHdpbGwgZm9jdXMgdGhlIENocm9tZSdzIGN1cnJlbnQgdGFiLlxyXG4gICAgY29uc3QgbGluayA9IGdldExpbmsoaW50ZXJuYWxQYXlsb2FkKTtcclxuICAgIGlmICghbGluaykge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIC8vIEZNIHNob3VsZCBvbmx5IG9wZW4vZm9jdXMgbGlua3MgZnJvbSBhcHAncyBvcmlnaW4uXHJcbiAgICBjb25zdCB1cmwgPSBuZXcgVVJMKGxpbmssIHNlbGYubG9jYXRpb24uaHJlZik7XHJcbiAgICBjb25zdCBvcmlnaW5VcmwgPSBuZXcgVVJMKHNlbGYubG9jYXRpb24ub3JpZ2luKTtcclxuICAgIGlmICh1cmwuaG9zdCAhPT0gb3JpZ2luVXJsLmhvc3QpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBsZXQgY2xpZW50ID0gYXdhaXQgZ2V0V2luZG93Q2xpZW50KHVybCk7XHJcbiAgICBpZiAoIWNsaWVudCkge1xyXG4gICAgICAgIGNsaWVudCA9IGF3YWl0IHNlbGYuY2xpZW50cy5vcGVuV2luZG93KGxpbmspO1xyXG4gICAgICAgIC8vIFdhaXQgdGhyZWUgc2Vjb25kcyBmb3IgdGhlIGNsaWVudCB0byBpbml0aWFsaXplIGFuZCBzZXQgdXAgdGhlIG1lc3NhZ2UgaGFuZGxlciBzbyB0aGF0IGl0XHJcbiAgICAgICAgLy8gY2FuIHJlY2VpdmUgdGhlIG1lc3NhZ2UuXHJcbiAgICAgICAgYXdhaXQgc2xlZXAoMzAwMCk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBjbGllbnQgPSBhd2FpdCBjbGllbnQuZm9jdXMoKTtcclxuICAgIH1cclxuICAgIGlmICghY2xpZW50KSB7XHJcbiAgICAgICAgLy8gV2luZG93IENsaWVudCB3aWxsIG5vdCBiZSByZXR1cm5lZCBpZiBpdCdzIGZvciBhIHRoaXJkIHBhcnR5IG9yaWdpbi5cclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBpbnRlcm5hbFBheWxvYWQubWVzc2FnZVR5cGUgPSBNZXNzYWdlVHlwZS5OT1RJRklDQVRJT05fQ0xJQ0tFRDtcclxuICAgIGludGVybmFsUGF5bG9hZC5pc0ZpcmViYXNlTWVzc2FnaW5nID0gdHJ1ZTtcclxuICAgIHJldHVybiBjbGllbnQucG9zdE1lc3NhZ2UoaW50ZXJuYWxQYXlsb2FkKTtcclxufVxyXG5mdW5jdGlvbiB3cmFwSW50ZXJuYWxQYXlsb2FkKGludGVybmFsUGF5bG9hZCkge1xyXG4gICAgY29uc3Qgd3JhcHBlZEludGVybmFsUGF5bG9hZCA9IE9iamVjdC5hc3NpZ24oe30sIGludGVybmFsUGF5bG9hZC5ub3RpZmljYXRpb24pO1xyXG4gICAgLy8gUHV0IHRoZSBtZXNzYWdlIHBheWxvYWQgdW5kZXIgRkNNX01TRyBuYW1lIHNvIHdlIGNhbiBpZGVudGlmeSB0aGUgbm90aWZpY2F0aW9uIGFzIGJlaW5nIGFuIEZDTVxyXG4gICAgLy8gbm90aWZpY2F0aW9uIHZzIGEgbm90aWZpY2F0aW9uIGZyb20gc29tZXdoZXJlIGVsc2UgKGkuZS4gbm9ybWFsIHdlYiBwdXNoIG9yIGRldmVsb3BlciBnZW5lcmF0ZWRcclxuICAgIC8vIG5vdGlmaWNhdGlvbikuXHJcbiAgICB3cmFwcGVkSW50ZXJuYWxQYXlsb2FkLmRhdGEgPSB7XHJcbiAgICAgICAgW0ZDTV9NU0ddOiBpbnRlcm5hbFBheWxvYWRcclxuICAgIH07XHJcbiAgICByZXR1cm4gd3JhcHBlZEludGVybmFsUGF5bG9hZDtcclxufVxyXG5mdW5jdGlvbiBnZXRNZXNzYWdlUGF5bG9hZEludGVybmFsKHsgZGF0YSB9KSB7XHJcbiAgICBpZiAoIWRhdGEpIHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICAgIHRyeSB7XHJcbiAgICAgICAgcmV0dXJuIGRhdGEuanNvbigpO1xyXG4gICAgfVxyXG4gICAgY2F0Y2ggKGVycikge1xyXG4gICAgICAgIC8vIE5vdCBKU09OIHNvIG5vdCBhbiBGQ00gbWVzc2FnZS5cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxufVxyXG4vKipcclxuICogQHBhcmFtIHVybCBUaGUgVVJMIHRvIGxvb2sgZm9yIHdoZW4gZm9jdXNpbmcgYSBjbGllbnQuXHJcbiAqIEByZXR1cm4gUmV0dXJucyBhbiBleGlzdGluZyB3aW5kb3cgY2xpZW50IG9yIGEgbmV3bHkgb3BlbmVkIFdpbmRvd0NsaWVudC5cclxuICovXHJcbmFzeW5jIGZ1bmN0aW9uIGdldFdpbmRvd0NsaWVudCh1cmwpIHtcclxuICAgIGNvbnN0IGNsaWVudExpc3QgPSBhd2FpdCBnZXRDbGllbnRMaXN0KCk7XHJcbiAgICBmb3IgKGNvbnN0IGNsaWVudCBvZiBjbGllbnRMaXN0KSB7XHJcbiAgICAgICAgY29uc3QgY2xpZW50VXJsID0gbmV3IFVSTChjbGllbnQudXJsLCBzZWxmLmxvY2F0aW9uLmhyZWYpO1xyXG4gICAgICAgIGlmICh1cmwuaG9zdCA9PT0gY2xpZW50VXJsLmhvc3QpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGNsaWVudDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbnVsbDtcclxufVxyXG4vKipcclxuICogQHJldHVybnMgSWYgdGhlcmUgaXMgY3VycmVudGx5IGEgdmlzaWJsZSBXaW5kb3dDbGllbnQsIHRoaXMgbWV0aG9kIHdpbGwgcmVzb2x2ZSB0byB0cnVlLFxyXG4gKiBvdGhlcndpc2UgZmFsc2UuXHJcbiAqL1xyXG5mdW5jdGlvbiBoYXNWaXNpYmxlQ2xpZW50cyhjbGllbnRMaXN0KSB7XHJcbiAgICByZXR1cm4gY2xpZW50TGlzdC5zb21lKGNsaWVudCA9PiBjbGllbnQudmlzaWJpbGl0eVN0YXRlID09PSAndmlzaWJsZScgJiZcclxuICAgICAgICAvLyBJZ25vcmUgY2hyb21lLWV4dGVuc2lvbiBjbGllbnRzIGFzIHRoYXQgbWF0Y2hlcyB0aGUgYmFja2dyb3VuZCBwYWdlcyBvZiBleHRlbnNpb25zLCB3aGljaFxyXG4gICAgICAgIC8vIGFyZSBhbHdheXMgY29uc2lkZXJlZCB2aXNpYmxlIGZvciBzb21lIHJlYXNvbi5cclxuICAgICAgICAhY2xpZW50LnVybC5zdGFydHNXaXRoKCdjaHJvbWUtZXh0ZW5zaW9uOi8vJykpO1xyXG59XHJcbmZ1bmN0aW9uIHNlbmRNZXNzYWdlUGF5bG9hZEludGVybmFsVG9XaW5kb3dzKGNsaWVudExpc3QsIGludGVybmFsUGF5bG9hZCkge1xyXG4gICAgaW50ZXJuYWxQYXlsb2FkLmlzRmlyZWJhc2VNZXNzYWdpbmcgPSB0cnVlO1xyXG4gICAgaW50ZXJuYWxQYXlsb2FkLm1lc3NhZ2VUeXBlID0gTWVzc2FnZVR5cGUuUFVTSF9SRUNFSVZFRDtcclxuICAgIGZvciAoY29uc3QgY2xpZW50IG9mIGNsaWVudExpc3QpIHtcclxuICAgICAgICBjbGllbnQucG9zdE1lc3NhZ2UoaW50ZXJuYWxQYXlsb2FkKTtcclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiBnZXRDbGllbnRMaXN0KCkge1xyXG4gICAgcmV0dXJuIHNlbGYuY2xpZW50cy5tYXRjaEFsbCh7XHJcbiAgICAgICAgdHlwZTogJ3dpbmRvdycsXHJcbiAgICAgICAgaW5jbHVkZVVuY29udHJvbGxlZDogdHJ1ZVxyXG4gICAgICAgIC8vIFRTIGRvZXNuJ3Qga25vdyB0aGF0IFwidHlwZTogJ3dpbmRvdydcIiBtZWFucyBpdCdsbCByZXR1cm4gV2luZG93Q2xpZW50W11cclxuICAgIH0pO1xyXG59XHJcbmZ1bmN0aW9uIHNob3dOb3RpZmljYXRpb24obm90aWZpY2F0aW9uUGF5bG9hZEludGVybmFsKSB7XHJcbiAgICB2YXIgX2E7XHJcbiAgICAvLyBOb3RlOiBGaXJlZm94IGRvZXMgbm90IHN1cHBvcnQgdGhlIG1heEFjdGlvbnMgcHJvcGVydHkuXHJcbiAgICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvbm90aWZpY2F0aW9uL21heEFjdGlvbnNcclxuICAgIGNvbnN0IHsgYWN0aW9ucyB9ID0gbm90aWZpY2F0aW9uUGF5bG9hZEludGVybmFsO1xyXG4gICAgY29uc3QgeyBtYXhBY3Rpb25zIH0gPSBOb3RpZmljYXRpb247XHJcbiAgICBpZiAoYWN0aW9ucyAmJiBtYXhBY3Rpb25zICYmIGFjdGlvbnMubGVuZ3RoID4gbWF4QWN0aW9ucykge1xyXG4gICAgICAgIGNvbnNvbGUud2FybihgVGhpcyBicm93c2VyIG9ubHkgc3VwcG9ydHMgJHttYXhBY3Rpb25zfSBhY3Rpb25zLiBUaGUgcmVtYWluaW5nIGFjdGlvbnMgd2lsbCBub3QgYmUgZGlzcGxheWVkLmApO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHNlbGYucmVnaXN0cmF0aW9uLnNob3dOb3RpZmljYXRpb24oXHJcbiAgICAvKiB0aXRsZT0gKi8gKF9hID0gbm90aWZpY2F0aW9uUGF5bG9hZEludGVybmFsLnRpdGxlKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiAnJywgbm90aWZpY2F0aW9uUGF5bG9hZEludGVybmFsKTtcclxufVxyXG5mdW5jdGlvbiBnZXRMaW5rKHBheWxvYWQpIHtcclxuICAgIHZhciBfYSwgX2IsIF9jO1xyXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGNhbWVsY2FzZVxyXG4gICAgY29uc3QgbGluayA9IChfYiA9IChfYSA9IHBheWxvYWQuZmNtT3B0aW9ucykgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmxpbmspICE9PSBudWxsICYmIF9iICE9PSB2b2lkIDAgPyBfYiA6IChfYyA9IHBheWxvYWQubm90aWZpY2F0aW9uKSA9PT0gbnVsbCB8fCBfYyA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2MuY2xpY2tfYWN0aW9uO1xyXG4gICAgaWYgKGxpbmspIHtcclxuICAgICAgICByZXR1cm4gbGluaztcclxuICAgIH1cclxuICAgIGlmIChpc0NvbnNvbGVNZXNzYWdlKHBheWxvYWQuZGF0YSkpIHtcclxuICAgICAgICAvLyBOb3RpZmljYXRpb24gY3JlYXRlZCBpbiB0aGUgRmlyZWJhc2UgQ29uc29sZS4gUmVkaXJlY3QgdG8gb3JpZ2luLlxyXG4gICAgICAgIHJldHVybiBzZWxmLmxvY2F0aW9uLm9yaWdpbjtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG59XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAxOSBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbmZ1bmN0aW9uIGV4dHJhY3RBcHBDb25maWcoYXBwKSB7XHJcbiAgICBpZiAoIWFwcCB8fCAhYXBwLm9wdGlvbnMpIHtcclxuICAgICAgICB0aHJvdyBnZXRNaXNzaW5nVmFsdWVFcnJvcignQXBwIENvbmZpZ3VyYXRpb24gT2JqZWN0Jyk7XHJcbiAgICB9XHJcbiAgICBpZiAoIWFwcC5uYW1lKSB7XHJcbiAgICAgICAgdGhyb3cgZ2V0TWlzc2luZ1ZhbHVlRXJyb3IoJ0FwcCBOYW1lJyk7XHJcbiAgICB9XHJcbiAgICAvLyBSZXF1aXJlZCBhcHAgY29uZmlnIGtleXNcclxuICAgIGNvbnN0IGNvbmZpZ0tleXMgPSBbXHJcbiAgICAgICAgJ3Byb2plY3RJZCcsXHJcbiAgICAgICAgJ2FwaUtleScsXHJcbiAgICAgICAgJ2FwcElkJyxcclxuICAgICAgICAnbWVzc2FnaW5nU2VuZGVySWQnXHJcbiAgICBdO1xyXG4gICAgY29uc3QgeyBvcHRpb25zIH0gPSBhcHA7XHJcbiAgICBmb3IgKGNvbnN0IGtleU5hbWUgb2YgY29uZmlnS2V5cykge1xyXG4gICAgICAgIGlmICghb3B0aW9uc1trZXlOYW1lXSkge1xyXG4gICAgICAgICAgICB0aHJvdyBnZXRNaXNzaW5nVmFsdWVFcnJvcihrZXlOYW1lKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGFwcE5hbWU6IGFwcC5uYW1lLFxyXG4gICAgICAgIHByb2plY3RJZDogb3B0aW9ucy5wcm9qZWN0SWQsXHJcbiAgICAgICAgYXBpS2V5OiBvcHRpb25zLmFwaUtleSxcclxuICAgICAgICBhcHBJZDogb3B0aW9ucy5hcHBJZCxcclxuICAgICAgICBzZW5kZXJJZDogb3B0aW9ucy5tZXNzYWdpbmdTZW5kZXJJZFxyXG4gICAgfTtcclxufVxyXG5mdW5jdGlvbiBnZXRNaXNzaW5nVmFsdWVFcnJvcih2YWx1ZU5hbWUpIHtcclxuICAgIHJldHVybiBFUlJPUl9GQUNUT1JZLmNyZWF0ZShcIm1pc3NpbmctYXBwLWNvbmZpZy12YWx1ZXNcIiAvKiBFcnJvckNvZGUuTUlTU0lOR19BUFBfQ09ORklHX1ZBTFVFUyAqLywge1xyXG4gICAgICAgIHZhbHVlTmFtZVxyXG4gICAgfSk7XHJcbn1cblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDIwIEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuY2xhc3MgTWVzc2FnaW5nU2VydmljZSB7XHJcbiAgICBjb25zdHJ1Y3RvcihhcHAsIGluc3RhbGxhdGlvbnMsIGFuYWx5dGljc1Byb3ZpZGVyKSB7XHJcbiAgICAgICAgLy8gbG9nZ2luZyBpcyBvbmx5IGRvbmUgd2l0aCBlbmQgdXNlciBjb25zZW50LiBEZWZhdWx0IHRvIGZhbHNlLlxyXG4gICAgICAgIHRoaXMuZGVsaXZlcnlNZXRyaWNzRXhwb3J0ZWRUb0JpZ1F1ZXJ5RW5hYmxlZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMub25CYWNrZ3JvdW5kTWVzc2FnZUhhbmRsZXIgPSBudWxsO1xyXG4gICAgICAgIHRoaXMub25NZXNzYWdlSGFuZGxlciA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5sb2dFdmVudHMgPSBbXTtcclxuICAgICAgICB0aGlzLmlzTG9nU2VydmljZVN0YXJ0ZWQgPSBmYWxzZTtcclxuICAgICAgICBjb25zdCBhcHBDb25maWcgPSBleHRyYWN0QXBwQ29uZmlnKGFwcCk7XHJcbiAgICAgICAgdGhpcy5maXJlYmFzZURlcGVuZGVuY2llcyA9IHtcclxuICAgICAgICAgICAgYXBwLFxyXG4gICAgICAgICAgICBhcHBDb25maWcsXHJcbiAgICAgICAgICAgIGluc3RhbGxhdGlvbnMsXHJcbiAgICAgICAgICAgIGFuYWx5dGljc1Byb3ZpZGVyXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuICAgIF9kZWxldGUoKSB7XHJcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xyXG4gICAgfVxyXG59XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAyMCBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbmNvbnN0IFN3TWVzc2FnaW5nRmFjdG9yeSA9IChjb250YWluZXIpID0+IHtcclxuICAgIGNvbnN0IG1lc3NhZ2luZyA9IG5ldyBNZXNzYWdpbmdTZXJ2aWNlKGNvbnRhaW5lci5nZXRQcm92aWRlcignYXBwJykuZ2V0SW1tZWRpYXRlKCksIGNvbnRhaW5lci5nZXRQcm92aWRlcignaW5zdGFsbGF0aW9ucy1pbnRlcm5hbCcpLmdldEltbWVkaWF0ZSgpLCBjb250YWluZXIuZ2V0UHJvdmlkZXIoJ2FuYWx5dGljcy1pbnRlcm5hbCcpKTtcclxuICAgIHNlbGYuYWRkRXZlbnRMaXN0ZW5lcigncHVzaCcsIGUgPT4ge1xyXG4gICAgICAgIGUud2FpdFVudGlsKG9uUHVzaChlLCBtZXNzYWdpbmcpKTtcclxuICAgIH0pO1xyXG4gICAgc2VsZi5hZGRFdmVudExpc3RlbmVyKCdwdXNoc3Vic2NyaXB0aW9uY2hhbmdlJywgZSA9PiB7XHJcbiAgICAgICAgZS53YWl0VW50aWwob25TdWJDaGFuZ2UoZSwgbWVzc2FnaW5nKSk7XHJcbiAgICB9KTtcclxuICAgIHNlbGYuYWRkRXZlbnRMaXN0ZW5lcignbm90aWZpY2F0aW9uY2xpY2snLCBlID0+IHtcclxuICAgICAgICBlLndhaXRVbnRpbChvbk5vdGlmaWNhdGlvbkNsaWNrKGUpKTtcclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIG1lc3NhZ2luZztcclxufTtcclxuLyoqXHJcbiAqIFRoZSBtZXNzYWdpbmcgaW5zdGFuY2UgcmVnaXN0ZXJlZCBpbiBzdyBpcyBuYW1lZCBkaWZmZXJlbnRseSB0aGFuIHRoYXQgb2YgaW4gY2xpZW50LiBUaGlzIGlzXHJcbiAqIGJlY2F1c2UgYm90aCBgcmVnaXN0ZXJNZXNzYWdpbmdJbldpbmRvd2AgYW5kIGByZWdpc3Rlck1lc3NhZ2luZ0luU3dgIHdvdWxkIGJlIGNhbGxlZCBpblxyXG4gKiBgbWVzc2FnaW5nLWNvbXBhdGAgYW5kIGNvbXBvbmVudCB3aXRoIHRoZSBzYW1lIG5hbWUgY2FuIG9ubHkgYmUgcmVnaXN0ZXJlZCBvbmNlLlxyXG4gKi9cclxuZnVuY3Rpb24gcmVnaXN0ZXJNZXNzYWdpbmdJblN3KCkge1xyXG4gICAgX3JlZ2lzdGVyQ29tcG9uZW50KG5ldyBDb21wb25lbnQoJ21lc3NhZ2luZy1zdycsIFN3TWVzc2FnaW5nRmFjdG9yeSwgXCJQVUJMSUNcIiAvKiBDb21wb25lbnRUeXBlLlBVQkxJQyAqLykpO1xyXG59XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAyMCBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbi8qKlxyXG4gKiBDaGVja3Mgd2hldGhlciBhbGwgcmVxdWlyZWQgQVBJcyBleGlzdCB3aXRoaW4gU1cgQ29udGV4dFxyXG4gKiBAcmV0dXJucyBhIFByb21pc2UgdGhhdCByZXNvbHZlcyB0byBhIGJvb2xlYW4uXHJcbiAqXHJcbiAqIEBwdWJsaWNcclxuICovXHJcbmFzeW5jIGZ1bmN0aW9uIGlzU3dTdXBwb3J0ZWQoKSB7XHJcbiAgICAvLyBmaXJlYmFzZS1qcy1zZGsvaXNzdWVzLzIzOTMgcmV2ZWFscyB0aGF0IGlkYiNvcGVuIGluIFNhZmFyaSBpZnJhbWUgYW5kIEZpcmVmb3ggcHJpdmF0ZSBicm93c2luZ1xyXG4gICAgLy8gbWlnaHQgYmUgcHJvaGliaXRlZCB0byBydW4uIEluIHRoZXNlIGNvbnRleHRzLCBhbiBlcnJvciB3b3VsZCBiZSB0aHJvd24gZHVyaW5nIHRoZSBtZXNzYWdpbmdcclxuICAgIC8vIGluc3RhbnRpYXRpbmcgcGhhc2UsIGluZm9ybWluZyB0aGUgZGV2ZWxvcGVycyB0byBpbXBvcnQvY2FsbCBpc1N1cHBvcnRlZCBmb3Igc3BlY2lhbCBoYW5kbGluZy5cclxuICAgIHJldHVybiAoaXNJbmRleGVkREJBdmFpbGFibGUoKSAmJlxyXG4gICAgICAgIChhd2FpdCB2YWxpZGF0ZUluZGV4ZWREQk9wZW5hYmxlKCkpICYmXHJcbiAgICAgICAgJ1B1c2hNYW5hZ2VyJyBpbiBzZWxmICYmXHJcbiAgICAgICAgJ05vdGlmaWNhdGlvbicgaW4gc2VsZiAmJlxyXG4gICAgICAgIFNlcnZpY2VXb3JrZXJSZWdpc3RyYXRpb24ucHJvdG90eXBlLmhhc093blByb3BlcnR5KCdzaG93Tm90aWZpY2F0aW9uJykgJiZcclxuICAgICAgICBQdXNoU3Vic2NyaXB0aW9uLnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eSgnZ2V0S2V5JykpO1xyXG59XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAyMCBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbmZ1bmN0aW9uIG9uQmFja2dyb3VuZE1lc3NhZ2UkMShtZXNzYWdpbmcsIG5leHRPck9ic2VydmVyKSB7XHJcbiAgICBpZiAoc2VsZi5kb2N1bWVudCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgdGhyb3cgRVJST1JfRkFDVE9SWS5jcmVhdGUoXCJvbmx5LWF2YWlsYWJsZS1pbi1zd1wiIC8qIEVycm9yQ29kZS5BVkFJTEFCTEVfSU5fU1cgKi8pO1xyXG4gICAgfVxyXG4gICAgbWVzc2FnaW5nLm9uQmFja2dyb3VuZE1lc3NhZ2VIYW5kbGVyID0gbmV4dE9yT2JzZXJ2ZXI7XHJcbiAgICByZXR1cm4gKCkgPT4ge1xyXG4gICAgICAgIG1lc3NhZ2luZy5vbkJhY2tncm91bmRNZXNzYWdlSGFuZGxlciA9IG51bGw7XHJcbiAgICB9O1xyXG59XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAyMCBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbmZ1bmN0aW9uIF9zZXREZWxpdmVyeU1ldHJpY3NFeHBvcnRlZFRvQmlnUXVlcnlFbmFibGVkKG1lc3NhZ2luZywgZW5hYmxlKSB7XHJcbiAgICBtZXNzYWdpbmcuZGVsaXZlcnlNZXRyaWNzRXhwb3J0ZWRUb0JpZ1F1ZXJ5RW5hYmxlZCA9XHJcbiAgICAgICAgZW5hYmxlO1xyXG59XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAxNyBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbi8qKlxyXG4gKiBSZXRyaWV2ZXMgYSBGaXJlYmFzZSBDbG91ZCBNZXNzYWdpbmcgaW5zdGFuY2UuXHJcbiAqXHJcbiAqIEByZXR1cm5zIFRoZSBGaXJlYmFzZSBDbG91ZCBNZXNzYWdpbmcgaW5zdGFuY2UgYXNzb2NpYXRlZCB3aXRoIHRoZSBwcm92aWRlZCBmaXJlYmFzZSBhcHAuXHJcbiAqXHJcbiAqIEBwdWJsaWNcclxuICovXHJcbmZ1bmN0aW9uIGdldE1lc3NhZ2luZ0luU3coYXBwID0gZ2V0QXBwKCkpIHtcclxuICAgIC8vIENvbnNjaW91cyBkZWNpc2lvbiB0byBtYWtlIHRoaXMgYXN5bmMgY2hlY2sgbm9uLWJsb2NraW5nIGR1cmluZyB0aGUgbWVzc2FnaW5nIGluc3RhbmNlXHJcbiAgICAvLyBpbml0aWFsaXphdGlvbiBwaGFzZSBmb3IgcGVyZm9ybWFuY2UgY29uc2lkZXJhdGlvbi4gQW4gZXJyb3Igd291bGQgYmUgdGhyb3duIGxhdHRlciBmb3JcclxuICAgIC8vIGRldmVsb3BlcidzIGluZm9ybWF0aW9uLiBEZXZlbG9wZXJzIGNhbiB0aGVuIGNob29zZSB0byBpbXBvcnQgYW5kIGNhbGwgYGlzU3VwcG9ydGVkYCBmb3JcclxuICAgIC8vIHNwZWNpYWwgaGFuZGxpbmcuXHJcbiAgICBpc1N3U3VwcG9ydGVkKCkudGhlbihpc1N1cHBvcnRlZCA9PiB7XHJcbiAgICAgICAgLy8gSWYgYGlzU3dTdXBwb3J0ZWQoKWAgcmVzb2x2ZWQsIGJ1dCByZXR1cm5lZCBmYWxzZS5cclxuICAgICAgICBpZiAoIWlzU3VwcG9ydGVkKSB7XHJcbiAgICAgICAgICAgIHRocm93IEVSUk9SX0ZBQ1RPUlkuY3JlYXRlKFwidW5zdXBwb3J0ZWQtYnJvd3NlclwiIC8qIEVycm9yQ29kZS5VTlNVUFBPUlRFRF9CUk9XU0VSICovKTtcclxuICAgICAgICB9XHJcbiAgICB9LCBfID0+IHtcclxuICAgICAgICAvLyBJZiBgaXNTd1N1cHBvcnRlZCgpYCByZWplY3RlZC5cclxuICAgICAgICB0aHJvdyBFUlJPUl9GQUNUT1JZLmNyZWF0ZShcImluZGV4ZWQtZGItdW5zdXBwb3J0ZWRcIiAvKiBFcnJvckNvZGUuSU5ERVhFRF9EQl9VTlNVUFBPUlRFRCAqLyk7XHJcbiAgICB9KTtcclxuICAgIHJldHVybiBfZ2V0UHJvdmlkZXIoZ2V0TW9kdWxhckluc3RhbmNlKGFwcCksICdtZXNzYWdpbmctc3cnKS5nZXRJbW1lZGlhdGUoKTtcclxufVxyXG4vKipcclxuICogQ2FsbGVkIHdoZW4gYSBtZXNzYWdlIGlzIHJlY2VpdmVkIHdoaWxlIHRoZSBhcHAgaXMgaW4gdGhlIGJhY2tncm91bmQuIEFuIGFwcCBpcyBjb25zaWRlcmVkIHRvIGJlXHJcbiAqIGluIHRoZSBiYWNrZ3JvdW5kIGlmIG5vIGFjdGl2ZSB3aW5kb3cgaXMgZGlzcGxheWVkLlxyXG4gKlxyXG4gKiBAcGFyYW0gbWVzc2FnaW5nIC0gVGhlIHtAbGluayBNZXNzYWdpbmd9IGluc3RhbmNlLlxyXG4gKiBAcGFyYW0gbmV4dE9yT2JzZXJ2ZXIgLSBUaGlzIGZ1bmN0aW9uLCBvciBvYnNlcnZlciBvYmplY3Qgd2l0aCBgbmV4dGAgZGVmaW5lZCwgaXMgY2FsbGVkIHdoZW4gYVxyXG4gKiBtZXNzYWdlIGlzIHJlY2VpdmVkIGFuZCB0aGUgYXBwIGlzIGN1cnJlbnRseSBpbiB0aGUgYmFja2dyb3VuZC5cclxuICpcclxuICogQHJldHVybnMgVG8gc3RvcCBsaXN0ZW5pbmcgZm9yIG1lc3NhZ2VzIGV4ZWN1dGUgdGhpcyByZXR1cm5lZCBmdW5jdGlvblxyXG4gKlxyXG4gKiBAcHVibGljXHJcbiAqL1xyXG5mdW5jdGlvbiBvbkJhY2tncm91bmRNZXNzYWdlKG1lc3NhZ2luZywgbmV4dE9yT2JzZXJ2ZXIpIHtcclxuICAgIG1lc3NhZ2luZyA9IGdldE1vZHVsYXJJbnN0YW5jZShtZXNzYWdpbmcpO1xyXG4gICAgcmV0dXJuIG9uQmFja2dyb3VuZE1lc3NhZ2UkMShtZXNzYWdpbmcsIG5leHRPck9ic2VydmVyKTtcclxufVxyXG4vKipcclxuICogRW5hYmxlcyBvciBkaXNhYmxlcyBGaXJlYmFzZSBDbG91ZCBNZXNzYWdpbmcgbWVzc2FnZSBkZWxpdmVyeSBtZXRyaWNzIGV4cG9ydCB0byBCaWdRdWVyeS4gQnlcclxuICogZGVmYXVsdCwgbWVzc2FnZSBkZWxpdmVyeSBtZXRyaWNzIGFyZSBub3QgZXhwb3J0ZWQgdG8gQmlnUXVlcnkuIFVzZSB0aGlzIG1ldGhvZCB0byBlbmFibGUgb3JcclxuICogZGlzYWJsZSB0aGUgZXhwb3J0IGF0IHJ1bnRpbWUuXHJcbiAqXHJcbiAqIEBwYXJhbSBtZXNzYWdpbmcgLSBUaGUgYEZpcmViYXNlTWVzc2FnaW5nYCBpbnN0YW5jZS5cclxuICogQHBhcmFtIGVuYWJsZSAtIFdoZXRoZXIgRmlyZWJhc2UgQ2xvdWQgTWVzc2FnaW5nIHNob3VsZCBleHBvcnQgbWVzc2FnZSBkZWxpdmVyeSBtZXRyaWNzIHRvXHJcbiAqIEJpZ1F1ZXJ5LlxyXG4gKlxyXG4gKiBAcHVibGljXHJcbiAqL1xyXG5mdW5jdGlvbiBleHBlcmltZW50YWxTZXREZWxpdmVyeU1ldHJpY3NFeHBvcnRlZFRvQmlnUXVlcnlFbmFibGVkKG1lc3NhZ2luZywgZW5hYmxlKSB7XHJcbiAgICBtZXNzYWdpbmcgPSBnZXRNb2R1bGFySW5zdGFuY2UobWVzc2FnaW5nKTtcclxuICAgIHJldHVybiBfc2V0RGVsaXZlcnlNZXRyaWNzRXhwb3J0ZWRUb0JpZ1F1ZXJ5RW5hYmxlZChtZXNzYWdpbmcsIGVuYWJsZSk7XHJcbn1cblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDE3IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxucmVnaXN0ZXJNZXNzYWdpbmdJblN3KCk7XG5cbmV4cG9ydCB7IGV4cGVyaW1lbnRhbFNldERlbGl2ZXJ5TWV0cmljc0V4cG9ydGVkVG9CaWdRdWVyeUVuYWJsZWQsIGdldE1lc3NhZ2luZ0luU3cgYXMgZ2V0TWVzc2FnaW5nLCBpc1N3U3VwcG9ydGVkIGFzIGlzU3VwcG9ydGVkLCBvbkJhY2tncm91bmRNZXNzYWdlIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5zdy5lc20yMDE3LmpzLm1hcFxuIiwKICAgICJpbXBvcnQgeyByZWdpc3RlclZlcnNpb24gfSBmcm9tICdAZmlyZWJhc2UvYXBwJztcbmV4cG9ydCAqIGZyb20gJ0BmaXJlYmFzZS9hcHAnO1xuXG52YXIgbmFtZSA9IFwiZmlyZWJhc2VcIjtcbnZhciB2ZXJzaW9uID0gXCIxMC4xMy4xXCI7XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAyMCBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbnJlZ2lzdGVyVmVyc2lvbihuYW1lLCB2ZXJzaW9uLCAnYXBwJyk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5lc20uanMubWFwXG4iLAogICAgImltcG9ydCAnQGZpcmViYXNlL2luc3RhbGxhdGlvbnMnO1xuaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSAnQGZpcmViYXNlL2NvbXBvbmVudCc7XG5pbXBvcnQgeyBvcGVuREIsIGRlbGV0ZURCIH0gZnJvbSAnaWRiJztcbmltcG9ydCB7IEVycm9yRmFjdG9yeSwgdmFsaWRhdGVJbmRleGVkREJPcGVuYWJsZSwgaXNJbmRleGVkREJBdmFpbGFibGUsIGFyZUNvb2tpZXNFbmFibGVkLCBnZXRNb2R1bGFySW5zdGFuY2UgfSBmcm9tICdAZmlyZWJhc2UvdXRpbCc7XG5pbXBvcnQgeyBfcmVnaXN0ZXJDb21wb25lbnQsIHJlZ2lzdGVyVmVyc2lvbiwgX2dldFByb3ZpZGVyLCBnZXRBcHAgfSBmcm9tICdAZmlyZWJhc2UvYXBwJztcblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDE5IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuY29uc3QgREVGQVVMVF9TV19QQVRIID0gJy9maXJlYmFzZS1tZXNzYWdpbmctc3cuanMnO1xyXG5jb25zdCBERUZBVUxUX1NXX1NDT1BFID0gJy9maXJlYmFzZS1jbG91ZC1tZXNzYWdpbmctcHVzaC1zY29wZSc7XHJcbmNvbnN0IERFRkFVTFRfVkFQSURfS0VZID0gJ0JET1U5OS1oNjdIY0E2SmVGWEhiU05NdTdlMnlOTnUzUnpvTWo4VE00Vzg4aklUZnE3Wm1QdklNMUl2LTRfbDJMeFFjWXdocWJ5MnhHcFd3empmQW5HNCc7XHJcbmNvbnN0IEVORFBPSU5UID0gJ2h0dHBzOi8vZmNtcmVnaXN0cmF0aW9ucy5nb29nbGVhcGlzLmNvbS92MSc7XHJcbmNvbnN0IENPTlNPTEVfQ0FNUEFJR05fSUQgPSAnZ29vZ2xlLmMuYS5jX2lkJztcclxuY29uc3QgQ09OU09MRV9DQU1QQUlHTl9OQU1FID0gJ2dvb2dsZS5jLmEuY19sJztcclxuY29uc3QgQ09OU09MRV9DQU1QQUlHTl9USU1FID0gJ2dvb2dsZS5jLmEudHMnO1xyXG4vKiogU2V0IHRvICcxJyBpZiBBbmFseXRpY3MgaXMgZW5hYmxlZCBmb3IgdGhlIGNhbXBhaWduICovXHJcbmNvbnN0IENPTlNPTEVfQ0FNUEFJR05fQU5BTFlUSUNTX0VOQUJMRUQgPSAnZ29vZ2xlLmMuYS5lJztcclxudmFyIE1lc3NhZ2VUeXBlJDE7XHJcbihmdW5jdGlvbiAoTWVzc2FnZVR5cGUpIHtcclxuICAgIE1lc3NhZ2VUeXBlW01lc3NhZ2VUeXBlW1wiREFUQV9NRVNTQUdFXCJdID0gMV0gPSBcIkRBVEFfTUVTU0FHRVwiO1xyXG4gICAgTWVzc2FnZVR5cGVbTWVzc2FnZVR5cGVbXCJESVNQTEFZX05PVElGSUNBVElPTlwiXSA9IDNdID0gXCJESVNQTEFZX05PVElGSUNBVElPTlwiO1xyXG59KShNZXNzYWdlVHlwZSQxIHx8IChNZXNzYWdlVHlwZSQxID0ge30pKTtcblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDE4IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHRcclxuICogaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmUgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2VcclxuICogaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3NcclxuICogb3IgaW1wbGllZC4gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZCBsaW1pdGF0aW9ucyB1bmRlclxyXG4gKiB0aGUgTGljZW5zZS5cclxuICovXHJcbnZhciBNZXNzYWdlVHlwZTtcclxuKGZ1bmN0aW9uIChNZXNzYWdlVHlwZSkge1xyXG4gICAgTWVzc2FnZVR5cGVbXCJQVVNIX1JFQ0VJVkVEXCJdID0gXCJwdXNoLXJlY2VpdmVkXCI7XHJcbiAgICBNZXNzYWdlVHlwZVtcIk5PVElGSUNBVElPTl9DTElDS0VEXCJdID0gXCJub3RpZmljYXRpb24tY2xpY2tlZFwiO1xyXG59KShNZXNzYWdlVHlwZSB8fCAoTWVzc2FnZVR5cGUgPSB7fSkpO1xuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMTcgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG5mdW5jdGlvbiBhcnJheVRvQmFzZTY0KGFycmF5KSB7XHJcbiAgICBjb25zdCB1aW50OEFycmF5ID0gbmV3IFVpbnQ4QXJyYXkoYXJyYXkpO1xyXG4gICAgY29uc3QgYmFzZTY0U3RyaW5nID0gYnRvYShTdHJpbmcuZnJvbUNoYXJDb2RlKC4uLnVpbnQ4QXJyYXkpKTtcclxuICAgIHJldHVybiBiYXNlNjRTdHJpbmcucmVwbGFjZSgvPS9nLCAnJykucmVwbGFjZSgvXFwrL2csICctJykucmVwbGFjZSgvXFwvL2csICdfJyk7XHJcbn1cclxuZnVuY3Rpb24gYmFzZTY0VG9BcnJheShiYXNlNjRTdHJpbmcpIHtcclxuICAgIGNvbnN0IHBhZGRpbmcgPSAnPScucmVwZWF0KCg0IC0gKGJhc2U2NFN0cmluZy5sZW5ndGggJSA0KSkgJSA0KTtcclxuICAgIGNvbnN0IGJhc2U2NCA9IChiYXNlNjRTdHJpbmcgKyBwYWRkaW5nKVxyXG4gICAgICAgIC5yZXBsYWNlKC9cXC0vZywgJysnKVxyXG4gICAgICAgIC5yZXBsYWNlKC9fL2csICcvJyk7XHJcbiAgICBjb25zdCByYXdEYXRhID0gYXRvYihiYXNlNjQpO1xyXG4gICAgY29uc3Qgb3V0cHV0QXJyYXkgPSBuZXcgVWludDhBcnJheShyYXdEYXRhLmxlbmd0aCk7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJhd0RhdGEubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICBvdXRwdXRBcnJheVtpXSA9IHJhd0RhdGEuY2hhckNvZGVBdChpKTtcclxuICAgIH1cclxuICAgIHJldHVybiBvdXRwdXRBcnJheTtcclxufVxuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMTkgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG5jb25zdCBPTERfREJfTkFNRSA9ICdmY21fdG9rZW5fZGV0YWlsc19kYic7XHJcbi8qKlxyXG4gKiBUaGUgbGFzdCBEQiB2ZXJzaW9uIG9mICdmY21fdG9rZW5fZGV0YWlsc19kYicgd2FzIDQuIFRoaXMgaXMgb25lIGhpZ2hlciwgc28gdGhhdCB0aGUgdXBncmFkZVxyXG4gKiBjYWxsYmFjayBpcyBjYWxsZWQgZm9yIGFsbCB2ZXJzaW9ucyBvZiB0aGUgb2xkIERCLlxyXG4gKi9cclxuY29uc3QgT0xEX0RCX1ZFUlNJT04gPSA1O1xyXG5jb25zdCBPTERfT0JKRUNUX1NUT1JFX05BTUUgPSAnZmNtX3Rva2VuX29iamVjdF9TdG9yZSc7XHJcbmFzeW5jIGZ1bmN0aW9uIG1pZ3JhdGVPbGREYXRhYmFzZShzZW5kZXJJZCkge1xyXG4gICAgaWYgKCdkYXRhYmFzZXMnIGluIGluZGV4ZWREQikge1xyXG4gICAgICAgIC8vIGluZGV4ZWREYi5kYXRhYmFzZXMoKSBpcyBhbiBJbmRleGVkREIgdjMgQVBJIGFuZCBkb2VzIG5vdCBleGlzdCBpbiBhbGwgYnJvd3NlcnMuIFRPRE86IFJlbW92ZVxyXG4gICAgICAgIC8vIHR5cGVjYXN0IHdoZW4gaXQgbGFuZHMgaW4gVFMgdHlwZXMuXHJcbiAgICAgICAgY29uc3QgZGF0YWJhc2VzID0gYXdhaXQgaW5kZXhlZERCLmRhdGFiYXNlcygpO1xyXG4gICAgICAgIGNvbnN0IGRiTmFtZXMgPSBkYXRhYmFzZXMubWFwKGRiID0+IGRiLm5hbWUpO1xyXG4gICAgICAgIGlmICghZGJOYW1lcy5pbmNsdWRlcyhPTERfREJfTkFNRSkpIHtcclxuICAgICAgICAgICAgLy8gb2xkIERCIGRpZG4ndCBleGlzdCwgbm8gbmVlZCB0byBvcGVuLlxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBsZXQgdG9rZW5EZXRhaWxzID0gbnVsbDtcclxuICAgIGNvbnN0IGRiID0gYXdhaXQgb3BlbkRCKE9MRF9EQl9OQU1FLCBPTERfREJfVkVSU0lPTiwge1xyXG4gICAgICAgIHVwZ3JhZGU6IGFzeW5jIChkYiwgb2xkVmVyc2lvbiwgbmV3VmVyc2lvbiwgdXBncmFkZVRyYW5zYWN0aW9uKSA9PiB7XHJcbiAgICAgICAgICAgIHZhciBfYTtcclxuICAgICAgICAgICAgaWYgKG9sZFZlcnNpb24gPCAyKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBEYXRhYmFzZSB0b28gb2xkLCBza2lwIG1pZ3JhdGlvbi5cclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoIWRiLm9iamVjdFN0b3JlTmFtZXMuY29udGFpbnMoT0xEX09CSkVDVF9TVE9SRV9OQU1FKSkge1xyXG4gICAgICAgICAgICAgICAgLy8gRGF0YWJhc2UgZGlkIG5vdCBleGlzdC4gTm90aGluZyB0byBkby5cclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdCBvYmplY3RTdG9yZSA9IHVwZ3JhZGVUcmFuc2FjdGlvbi5vYmplY3RTdG9yZShPTERfT0JKRUNUX1NUT1JFX05BTUUpO1xyXG4gICAgICAgICAgICBjb25zdCB2YWx1ZSA9IGF3YWl0IG9iamVjdFN0b3JlLmluZGV4KCdmY21TZW5kZXJJZCcpLmdldChzZW5kZXJJZCk7XHJcbiAgICAgICAgICAgIGF3YWl0IG9iamVjdFN0b3JlLmNsZWFyKCk7XHJcbiAgICAgICAgICAgIGlmICghdmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIC8vIE5vIGVudHJ5IGluIHRoZSBkYXRhYmFzZSwgbm90aGluZyB0byBtaWdyYXRlLlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChvbGRWZXJzaW9uID09PSAyKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBvbGREZXRhaWxzID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICBpZiAoIW9sZERldGFpbHMuYXV0aCB8fCAhb2xkRGV0YWlscy5wMjU2ZGggfHwgIW9sZERldGFpbHMuZW5kcG9pbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0b2tlbkRldGFpbHMgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdG9rZW46IG9sZERldGFpbHMuZmNtVG9rZW4sXHJcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlVGltZTogKF9hID0gb2xkRGV0YWlscy5jcmVhdGVUaW1lKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiBEYXRlLm5vdygpLFxyXG4gICAgICAgICAgICAgICAgICAgIHN1YnNjcmlwdGlvbk9wdGlvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXV0aDogb2xkRGV0YWlscy5hdXRoLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwMjU2ZGg6IG9sZERldGFpbHMucDI1NmRoLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbmRwb2ludDogb2xkRGV0YWlscy5lbmRwb2ludCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3dTY29wZTogb2xkRGV0YWlscy5zd1Njb3BlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXBpZEtleTogdHlwZW9mIG9sZERldGFpbHMudmFwaWRLZXkgPT09ICdzdHJpbmcnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IG9sZERldGFpbHMudmFwaWRLZXlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogYXJyYXlUb0Jhc2U2NChvbGREZXRhaWxzLnZhcGlkS2V5KVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAob2xkVmVyc2lvbiA9PT0gMykge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgb2xkRGV0YWlscyA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgdG9rZW5EZXRhaWxzID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRva2VuOiBvbGREZXRhaWxzLmZjbVRva2VuLFxyXG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZVRpbWU6IG9sZERldGFpbHMuY3JlYXRlVGltZSxcclxuICAgICAgICAgICAgICAgICAgICBzdWJzY3JpcHRpb25PcHRpb25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGF1dGg6IGFycmF5VG9CYXNlNjQob2xkRGV0YWlscy5hdXRoKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcDI1NmRoOiBhcnJheVRvQmFzZTY0KG9sZERldGFpbHMucDI1NmRoKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZW5kcG9pbnQ6IG9sZERldGFpbHMuZW5kcG9pbnQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN3U2NvcGU6IG9sZERldGFpbHMuc3dTY29wZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFwaWRLZXk6IGFycmF5VG9CYXNlNjQob2xkRGV0YWlscy52YXBpZEtleSlcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKG9sZFZlcnNpb24gPT09IDQpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG9sZERldGFpbHMgPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgIHRva2VuRGV0YWlscyA9IHtcclxuICAgICAgICAgICAgICAgICAgICB0b2tlbjogb2xkRGV0YWlscy5mY21Ub2tlbixcclxuICAgICAgICAgICAgICAgICAgICBjcmVhdGVUaW1lOiBvbGREZXRhaWxzLmNyZWF0ZVRpbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgc3Vic2NyaXB0aW9uT3B0aW9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhdXRoOiBhcnJheVRvQmFzZTY0KG9sZERldGFpbHMuYXV0aCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHAyNTZkaDogYXJyYXlUb0Jhc2U2NChvbGREZXRhaWxzLnAyNTZkaCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVuZHBvaW50OiBvbGREZXRhaWxzLmVuZHBvaW50LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzd1Njb3BlOiBvbGREZXRhaWxzLnN3U2NvcGUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhcGlkS2V5OiBhcnJheVRvQmFzZTY0KG9sZERldGFpbHMudmFwaWRLZXkpXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgZGIuY2xvc2UoKTtcclxuICAgIC8vIERlbGV0ZSBhbGwgb2xkIGRhdGFiYXNlcy5cclxuICAgIGF3YWl0IGRlbGV0ZURCKE9MRF9EQl9OQU1FKTtcclxuICAgIGF3YWl0IGRlbGV0ZURCKCdmY21fdmFwaWRfZGV0YWlsc19kYicpO1xyXG4gICAgYXdhaXQgZGVsZXRlREIoJ3VuZGVmaW5lZCcpO1xyXG4gICAgcmV0dXJuIGNoZWNrVG9rZW5EZXRhaWxzKHRva2VuRGV0YWlscykgPyB0b2tlbkRldGFpbHMgOiBudWxsO1xyXG59XHJcbmZ1bmN0aW9uIGNoZWNrVG9rZW5EZXRhaWxzKHRva2VuRGV0YWlscykge1xyXG4gICAgaWYgKCF0b2tlbkRldGFpbHMgfHwgIXRva2VuRGV0YWlscy5zdWJzY3JpcHRpb25PcHRpb25zKSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgY29uc3QgeyBzdWJzY3JpcHRpb25PcHRpb25zIH0gPSB0b2tlbkRldGFpbHM7XHJcbiAgICByZXR1cm4gKHR5cGVvZiB0b2tlbkRldGFpbHMuY3JlYXRlVGltZSA9PT0gJ251bWJlcicgJiZcclxuICAgICAgICB0b2tlbkRldGFpbHMuY3JlYXRlVGltZSA+IDAgJiZcclxuICAgICAgICB0eXBlb2YgdG9rZW5EZXRhaWxzLnRva2VuID09PSAnc3RyaW5nJyAmJlxyXG4gICAgICAgIHRva2VuRGV0YWlscy50b2tlbi5sZW5ndGggPiAwICYmXHJcbiAgICAgICAgdHlwZW9mIHN1YnNjcmlwdGlvbk9wdGlvbnMuYXV0aCA9PT0gJ3N0cmluZycgJiZcclxuICAgICAgICBzdWJzY3JpcHRpb25PcHRpb25zLmF1dGgubGVuZ3RoID4gMCAmJlxyXG4gICAgICAgIHR5cGVvZiBzdWJzY3JpcHRpb25PcHRpb25zLnAyNTZkaCA9PT0gJ3N0cmluZycgJiZcclxuICAgICAgICBzdWJzY3JpcHRpb25PcHRpb25zLnAyNTZkaC5sZW5ndGggPiAwICYmXHJcbiAgICAgICAgdHlwZW9mIHN1YnNjcmlwdGlvbk9wdGlvbnMuZW5kcG9pbnQgPT09ICdzdHJpbmcnICYmXHJcbiAgICAgICAgc3Vic2NyaXB0aW9uT3B0aW9ucy5lbmRwb2ludC5sZW5ndGggPiAwICYmXHJcbiAgICAgICAgdHlwZW9mIHN1YnNjcmlwdGlvbk9wdGlvbnMuc3dTY29wZSA9PT0gJ3N0cmluZycgJiZcclxuICAgICAgICBzdWJzY3JpcHRpb25PcHRpb25zLnN3U2NvcGUubGVuZ3RoID4gMCAmJlxyXG4gICAgICAgIHR5cGVvZiBzdWJzY3JpcHRpb25PcHRpb25zLnZhcGlkS2V5ID09PSAnc3RyaW5nJyAmJlxyXG4gICAgICAgIHN1YnNjcmlwdGlvbk9wdGlvbnMudmFwaWRLZXkubGVuZ3RoID4gMCk7XHJcbn1cblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDE5IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuLy8gRXhwb3J0ZWQgZm9yIHRlc3RzLlxyXG5jb25zdCBEQVRBQkFTRV9OQU1FID0gJ2ZpcmViYXNlLW1lc3NhZ2luZy1kYXRhYmFzZSc7XHJcbmNvbnN0IERBVEFCQVNFX1ZFUlNJT04gPSAxO1xyXG5jb25zdCBPQkpFQ1RfU1RPUkVfTkFNRSA9ICdmaXJlYmFzZS1tZXNzYWdpbmctc3RvcmUnO1xyXG5sZXQgZGJQcm9taXNlID0gbnVsbDtcclxuZnVuY3Rpb24gZ2V0RGJQcm9taXNlKCkge1xyXG4gICAgaWYgKCFkYlByb21pc2UpIHtcclxuICAgICAgICBkYlByb21pc2UgPSBvcGVuREIoREFUQUJBU0VfTkFNRSwgREFUQUJBU0VfVkVSU0lPTiwge1xyXG4gICAgICAgICAgICB1cGdyYWRlOiAodXBncmFkZURiLCBvbGRWZXJzaW9uKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAvLyBXZSBkb24ndCB1c2UgJ2JyZWFrJyBpbiB0aGlzIHN3aXRjaCBzdGF0ZW1lbnQsIHRoZSBmYWxsLXRocm91Z2ggYmVoYXZpb3IgaXMgd2hhdCB3ZSB3YW50LFxyXG4gICAgICAgICAgICAgICAgLy8gYmVjYXVzZSBpZiB0aGVyZSBhcmUgbXVsdGlwbGUgdmVyc2lvbnMgYmV0d2VlbiB0aGUgb2xkIHZlcnNpb24gYW5kIHRoZSBjdXJyZW50IHZlcnNpb24sIHdlXHJcbiAgICAgICAgICAgICAgICAvLyB3YW50IEFMTCB0aGUgbWlncmF0aW9ucyB0aGF0IGNvcnJlc3BvbmQgdG8gdGhvc2UgdmVyc2lvbnMgdG8gcnVuLCBub3Qgb25seSB0aGUgbGFzdCBvbmUuXHJcbiAgICAgICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZGVmYXVsdC1jYXNlXHJcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKG9sZFZlcnNpb24pIHtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIDA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHVwZ3JhZGVEYi5jcmVhdGVPYmplY3RTdG9yZShPQkpFQ1RfU1RPUkVfTkFNRSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIHJldHVybiBkYlByb21pc2U7XHJcbn1cclxuLyoqIEdldHMgcmVjb3JkKHMpIGZyb20gdGhlIG9iamVjdFN0b3JlIHRoYXQgbWF0Y2ggdGhlIGdpdmVuIGtleS4gKi9cclxuYXN5bmMgZnVuY3Rpb24gZGJHZXQoZmlyZWJhc2VEZXBlbmRlbmNpZXMpIHtcclxuICAgIGNvbnN0IGtleSA9IGdldEtleShmaXJlYmFzZURlcGVuZGVuY2llcyk7XHJcbiAgICBjb25zdCBkYiA9IGF3YWl0IGdldERiUHJvbWlzZSgpO1xyXG4gICAgY29uc3QgdG9rZW5EZXRhaWxzID0gKGF3YWl0IGRiXHJcbiAgICAgICAgLnRyYW5zYWN0aW9uKE9CSkVDVF9TVE9SRV9OQU1FKVxyXG4gICAgICAgIC5vYmplY3RTdG9yZShPQkpFQ1RfU1RPUkVfTkFNRSlcclxuICAgICAgICAuZ2V0KGtleSkpO1xyXG4gICAgaWYgKHRva2VuRGV0YWlscykge1xyXG4gICAgICAgIHJldHVybiB0b2tlbkRldGFpbHM7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICAvLyBDaGVjayBpZiB0aGVyZSBpcyBhIHRva2VuRGV0YWlscyBvYmplY3QgaW4gdGhlIG9sZCBEQi5cclxuICAgICAgICBjb25zdCBvbGRUb2tlbkRldGFpbHMgPSBhd2FpdCBtaWdyYXRlT2xkRGF0YWJhc2UoZmlyZWJhc2VEZXBlbmRlbmNpZXMuYXBwQ29uZmlnLnNlbmRlcklkKTtcclxuICAgICAgICBpZiAob2xkVG9rZW5EZXRhaWxzKSB7XHJcbiAgICAgICAgICAgIGF3YWl0IGRiU2V0KGZpcmViYXNlRGVwZW5kZW5jaWVzLCBvbGRUb2tlbkRldGFpbHMpO1xyXG4gICAgICAgICAgICByZXR1cm4gb2xkVG9rZW5EZXRhaWxzO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4vKiogQXNzaWducyBvciBvdmVyd3JpdGVzIHRoZSByZWNvcmQgZm9yIHRoZSBnaXZlbiBrZXkgd2l0aCB0aGUgZ2l2ZW4gdmFsdWUuICovXHJcbmFzeW5jIGZ1bmN0aW9uIGRiU2V0KGZpcmViYXNlRGVwZW5kZW5jaWVzLCB0b2tlbkRldGFpbHMpIHtcclxuICAgIGNvbnN0IGtleSA9IGdldEtleShmaXJlYmFzZURlcGVuZGVuY2llcyk7XHJcbiAgICBjb25zdCBkYiA9IGF3YWl0IGdldERiUHJvbWlzZSgpO1xyXG4gICAgY29uc3QgdHggPSBkYi50cmFuc2FjdGlvbihPQkpFQ1RfU1RPUkVfTkFNRSwgJ3JlYWR3cml0ZScpO1xyXG4gICAgYXdhaXQgdHgub2JqZWN0U3RvcmUoT0JKRUNUX1NUT1JFX05BTUUpLnB1dCh0b2tlbkRldGFpbHMsIGtleSk7XHJcbiAgICBhd2FpdCB0eC5kb25lO1xyXG4gICAgcmV0dXJuIHRva2VuRGV0YWlscztcclxufVxyXG4vKiogUmVtb3ZlcyByZWNvcmQocykgZnJvbSB0aGUgb2JqZWN0U3RvcmUgdGhhdCBtYXRjaCB0aGUgZ2l2ZW4ga2V5LiAqL1xyXG5hc3luYyBmdW5jdGlvbiBkYlJlbW92ZShmaXJlYmFzZURlcGVuZGVuY2llcykge1xyXG4gICAgY29uc3Qga2V5ID0gZ2V0S2V5KGZpcmViYXNlRGVwZW5kZW5jaWVzKTtcclxuICAgIGNvbnN0IGRiID0gYXdhaXQgZ2V0RGJQcm9taXNlKCk7XHJcbiAgICBjb25zdCB0eCA9IGRiLnRyYW5zYWN0aW9uKE9CSkVDVF9TVE9SRV9OQU1FLCAncmVhZHdyaXRlJyk7XHJcbiAgICBhd2FpdCB0eC5vYmplY3RTdG9yZShPQkpFQ1RfU1RPUkVfTkFNRSkuZGVsZXRlKGtleSk7XHJcbiAgICBhd2FpdCB0eC5kb25lO1xyXG59XHJcbmZ1bmN0aW9uIGdldEtleSh7IGFwcENvbmZpZyB9KSB7XHJcbiAgICByZXR1cm4gYXBwQ29uZmlnLmFwcElkO1xyXG59XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAxNyBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbmNvbnN0IEVSUk9SX01BUCA9IHtcclxuICAgIFtcIm1pc3NpbmctYXBwLWNvbmZpZy12YWx1ZXNcIiAvKiBFcnJvckNvZGUuTUlTU0lOR19BUFBfQ09ORklHX1ZBTFVFUyAqL106ICdNaXNzaW5nIEFwcCBjb25maWd1cmF0aW9uIHZhbHVlOiBcInskdmFsdWVOYW1lfVwiJyxcclxuICAgIFtcIm9ubHktYXZhaWxhYmxlLWluLXdpbmRvd1wiIC8qIEVycm9yQ29kZS5BVkFJTEFCTEVfSU5fV0lORE9XICovXTogJ1RoaXMgbWV0aG9kIGlzIGF2YWlsYWJsZSBpbiBhIFdpbmRvdyBjb250ZXh0LicsXHJcbiAgICBbXCJvbmx5LWF2YWlsYWJsZS1pbi1zd1wiIC8qIEVycm9yQ29kZS5BVkFJTEFCTEVfSU5fU1cgKi9dOiAnVGhpcyBtZXRob2QgaXMgYXZhaWxhYmxlIGluIGEgc2VydmljZSB3b3JrZXIgY29udGV4dC4nLFxyXG4gICAgW1wicGVybWlzc2lvbi1kZWZhdWx0XCIgLyogRXJyb3JDb2RlLlBFUk1JU1NJT05fREVGQVVMVCAqL106ICdUaGUgbm90aWZpY2F0aW9uIHBlcm1pc3Npb24gd2FzIG5vdCBncmFudGVkIGFuZCBkaXNtaXNzZWQgaW5zdGVhZC4nLFxyXG4gICAgW1wicGVybWlzc2lvbi1ibG9ja2VkXCIgLyogRXJyb3JDb2RlLlBFUk1JU1NJT05fQkxPQ0tFRCAqL106ICdUaGUgbm90aWZpY2F0aW9uIHBlcm1pc3Npb24gd2FzIG5vdCBncmFudGVkIGFuZCBibG9ja2VkIGluc3RlYWQuJyxcclxuICAgIFtcInVuc3VwcG9ydGVkLWJyb3dzZXJcIiAvKiBFcnJvckNvZGUuVU5TVVBQT1JURURfQlJPV1NFUiAqL106IFwiVGhpcyBicm93c2VyIGRvZXNuJ3Qgc3VwcG9ydCB0aGUgQVBJJ3MgcmVxdWlyZWQgdG8gdXNlIHRoZSBGaXJlYmFzZSBTREsuXCIsXHJcbiAgICBbXCJpbmRleGVkLWRiLXVuc3VwcG9ydGVkXCIgLyogRXJyb3JDb2RlLklOREVYRURfREJfVU5TVVBQT1JURUQgKi9dOiBcIlRoaXMgYnJvd3NlciBkb2Vzbid0IHN1cHBvcnQgaW5kZXhlZERiLm9wZW4oKSAoZXguIFNhZmFyaSBpRnJhbWUsIEZpcmVmb3ggUHJpdmF0ZSBCcm93c2luZywgZXRjKVwiLFxyXG4gICAgW1wiZmFpbGVkLXNlcnZpY2Utd29ya2VyLXJlZ2lzdHJhdGlvblwiIC8qIEVycm9yQ29kZS5GQUlMRURfREVGQVVMVF9SRUdJU1RSQVRJT04gKi9dOiAnV2UgYXJlIHVuYWJsZSB0byByZWdpc3RlciB0aGUgZGVmYXVsdCBzZXJ2aWNlIHdvcmtlci4geyRicm93c2VyRXJyb3JNZXNzYWdlfScsXHJcbiAgICBbXCJ0b2tlbi1zdWJzY3JpYmUtZmFpbGVkXCIgLyogRXJyb3JDb2RlLlRPS0VOX1NVQlNDUklCRV9GQUlMRUQgKi9dOiAnQSBwcm9ibGVtIG9jY3VycmVkIHdoaWxlIHN1YnNjcmliaW5nIHRoZSB1c2VyIHRvIEZDTTogeyRlcnJvckluZm99JyxcclxuICAgIFtcInRva2VuLXN1YnNjcmliZS1uby10b2tlblwiIC8qIEVycm9yQ29kZS5UT0tFTl9TVUJTQ1JJQkVfTk9fVE9LRU4gKi9dOiAnRkNNIHJldHVybmVkIG5vIHRva2VuIHdoZW4gc3Vic2NyaWJpbmcgdGhlIHVzZXIgdG8gcHVzaC4nLFxyXG4gICAgW1widG9rZW4tdW5zdWJzY3JpYmUtZmFpbGVkXCIgLyogRXJyb3JDb2RlLlRPS0VOX1VOU1VCU0NSSUJFX0ZBSUxFRCAqL106ICdBIHByb2JsZW0gb2NjdXJyZWQgd2hpbGUgdW5zdWJzY3JpYmluZyB0aGUgJyArXHJcbiAgICAgICAgJ3VzZXIgZnJvbSBGQ006IHskZXJyb3JJbmZvfScsXHJcbiAgICBbXCJ0b2tlbi11cGRhdGUtZmFpbGVkXCIgLyogRXJyb3JDb2RlLlRPS0VOX1VQREFURV9GQUlMRUQgKi9dOiAnQSBwcm9ibGVtIG9jY3VycmVkIHdoaWxlIHVwZGF0aW5nIHRoZSB1c2VyIGZyb20gRkNNOiB7JGVycm9ySW5mb30nLFxyXG4gICAgW1widG9rZW4tdXBkYXRlLW5vLXRva2VuXCIgLyogRXJyb3JDb2RlLlRPS0VOX1VQREFURV9OT19UT0tFTiAqL106ICdGQ00gcmV0dXJuZWQgbm8gdG9rZW4gd2hlbiB1cGRhdGluZyB0aGUgdXNlciB0byBwdXNoLicsXHJcbiAgICBbXCJ1c2Utc3ctYWZ0ZXItZ2V0LXRva2VuXCIgLyogRXJyb3JDb2RlLlVTRV9TV19BRlRFUl9HRVRfVE9LRU4gKi9dOiAnVGhlIHVzZVNlcnZpY2VXb3JrZXIoKSBtZXRob2QgbWF5IG9ubHkgYmUgY2FsbGVkIG9uY2UgYW5kIG11c3QgYmUgJyArXHJcbiAgICAgICAgJ2NhbGxlZCBiZWZvcmUgY2FsbGluZyBnZXRUb2tlbigpIHRvIGVuc3VyZSB5b3VyIHNlcnZpY2Ugd29ya2VyIGlzIHVzZWQuJyxcclxuICAgIFtcImludmFsaWQtc3ctcmVnaXN0cmF0aW9uXCIgLyogRXJyb3JDb2RlLklOVkFMSURfU1dfUkVHSVNUUkFUSU9OICovXTogJ1RoZSBpbnB1dCB0byB1c2VTZXJ2aWNlV29ya2VyKCkgbXVzdCBiZSBhIFNlcnZpY2VXb3JrZXJSZWdpc3RyYXRpb24uJyxcclxuICAgIFtcImludmFsaWQtYmctaGFuZGxlclwiIC8qIEVycm9yQ29kZS5JTlZBTElEX0JHX0hBTkRMRVIgKi9dOiAnVGhlIGlucHV0IHRvIHNldEJhY2tncm91bmRNZXNzYWdlSGFuZGxlcigpIG11c3QgYmUgYSBmdW5jdGlvbi4nLFxyXG4gICAgW1wiaW52YWxpZC12YXBpZC1rZXlcIiAvKiBFcnJvckNvZGUuSU5WQUxJRF9WQVBJRF9LRVkgKi9dOiAnVGhlIHB1YmxpYyBWQVBJRCBrZXkgbXVzdCBiZSBhIHN0cmluZy4nLFxyXG4gICAgW1widXNlLXZhcGlkLWtleS1hZnRlci1nZXQtdG9rZW5cIiAvKiBFcnJvckNvZGUuVVNFX1ZBUElEX0tFWV9BRlRFUl9HRVRfVE9LRU4gKi9dOiAnVGhlIHVzZVB1YmxpY1ZhcGlkS2V5KCkgbWV0aG9kIG1heSBvbmx5IGJlIGNhbGxlZCBvbmNlIGFuZCBtdXN0IGJlICcgK1xyXG4gICAgICAgICdjYWxsZWQgYmVmb3JlIGNhbGxpbmcgZ2V0VG9rZW4oKSB0byBlbnN1cmUgeW91ciBWQVBJRCBrZXkgaXMgdXNlZC4nXHJcbn07XHJcbmNvbnN0IEVSUk9SX0ZBQ1RPUlkgPSBuZXcgRXJyb3JGYWN0b3J5KCdtZXNzYWdpbmcnLCAnTWVzc2FnaW5nJywgRVJST1JfTUFQKTtcblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDE5IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuYXN5bmMgZnVuY3Rpb24gcmVxdWVzdEdldFRva2VuKGZpcmViYXNlRGVwZW5kZW5jaWVzLCBzdWJzY3JpcHRpb25PcHRpb25zKSB7XHJcbiAgICBjb25zdCBoZWFkZXJzID0gYXdhaXQgZ2V0SGVhZGVycyhmaXJlYmFzZURlcGVuZGVuY2llcyk7XHJcbiAgICBjb25zdCBib2R5ID0gZ2V0Qm9keShzdWJzY3JpcHRpb25PcHRpb25zKTtcclxuICAgIGNvbnN0IHN1YnNjcmliZU9wdGlvbnMgPSB7XHJcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICAgICAgaGVhZGVycyxcclxuICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShib2R5KVxyXG4gICAgfTtcclxuICAgIGxldCByZXNwb25zZURhdGE7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goZ2V0RW5kcG9pbnQoZmlyZWJhc2VEZXBlbmRlbmNpZXMuYXBwQ29uZmlnKSwgc3Vic2NyaWJlT3B0aW9ucyk7XHJcbiAgICAgICAgcmVzcG9uc2VEYXRhID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG4gICAgfVxyXG4gICAgY2F0Y2ggKGVycikge1xyXG4gICAgICAgIHRocm93IEVSUk9SX0ZBQ1RPUlkuY3JlYXRlKFwidG9rZW4tc3Vic2NyaWJlLWZhaWxlZFwiIC8qIEVycm9yQ29kZS5UT0tFTl9TVUJTQ1JJQkVfRkFJTEVEICovLCB7XHJcbiAgICAgICAgICAgIGVycm9ySW5mbzogZXJyID09PSBudWxsIHx8IGVyciA9PT0gdm9pZCAwID8gdm9pZCAwIDogZXJyLnRvU3RyaW5nKClcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIGlmIChyZXNwb25zZURhdGEuZXJyb3IpIHtcclxuICAgICAgICBjb25zdCBtZXNzYWdlID0gcmVzcG9uc2VEYXRhLmVycm9yLm1lc3NhZ2U7XHJcbiAgICAgICAgdGhyb3cgRVJST1JfRkFDVE9SWS5jcmVhdGUoXCJ0b2tlbi1zdWJzY3JpYmUtZmFpbGVkXCIgLyogRXJyb3JDb2RlLlRPS0VOX1NVQlNDUklCRV9GQUlMRUQgKi8sIHtcclxuICAgICAgICAgICAgZXJyb3JJbmZvOiBtZXNzYWdlXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBpZiAoIXJlc3BvbnNlRGF0YS50b2tlbikge1xyXG4gICAgICAgIHRocm93IEVSUk9SX0ZBQ1RPUlkuY3JlYXRlKFwidG9rZW4tc3Vic2NyaWJlLW5vLXRva2VuXCIgLyogRXJyb3JDb2RlLlRPS0VOX1NVQlNDUklCRV9OT19UT0tFTiAqLyk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzcG9uc2VEYXRhLnRva2VuO1xyXG59XHJcbmFzeW5jIGZ1bmN0aW9uIHJlcXVlc3RVcGRhdGVUb2tlbihmaXJlYmFzZURlcGVuZGVuY2llcywgdG9rZW5EZXRhaWxzKSB7XHJcbiAgICBjb25zdCBoZWFkZXJzID0gYXdhaXQgZ2V0SGVhZGVycyhmaXJlYmFzZURlcGVuZGVuY2llcyk7XHJcbiAgICBjb25zdCBib2R5ID0gZ2V0Qm9keSh0b2tlbkRldGFpbHMuc3Vic2NyaXB0aW9uT3B0aW9ucyk7XHJcbiAgICBjb25zdCB1cGRhdGVPcHRpb25zID0ge1xyXG4gICAgICAgIG1ldGhvZDogJ1BBVENIJyxcclxuICAgICAgICBoZWFkZXJzLFxyXG4gICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KGJvZHkpXHJcbiAgICB9O1xyXG4gICAgbGV0IHJlc3BvbnNlRGF0YTtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgJHtnZXRFbmRwb2ludChmaXJlYmFzZURlcGVuZGVuY2llcy5hcHBDb25maWcpfS8ke3Rva2VuRGV0YWlscy50b2tlbn1gLCB1cGRhdGVPcHRpb25zKTtcclxuICAgICAgICByZXNwb25zZURhdGEgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XHJcbiAgICB9XHJcbiAgICBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgdGhyb3cgRVJST1JfRkFDVE9SWS5jcmVhdGUoXCJ0b2tlbi11cGRhdGUtZmFpbGVkXCIgLyogRXJyb3JDb2RlLlRPS0VOX1VQREFURV9GQUlMRUQgKi8sIHtcclxuICAgICAgICAgICAgZXJyb3JJbmZvOiBlcnIgPT09IG51bGwgfHwgZXJyID09PSB2b2lkIDAgPyB2b2lkIDAgOiBlcnIudG9TdHJpbmcoKVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgaWYgKHJlc3BvbnNlRGF0YS5lcnJvcikge1xyXG4gICAgICAgIGNvbnN0IG1lc3NhZ2UgPSByZXNwb25zZURhdGEuZXJyb3IubWVzc2FnZTtcclxuICAgICAgICB0aHJvdyBFUlJPUl9GQUNUT1JZLmNyZWF0ZShcInRva2VuLXVwZGF0ZS1mYWlsZWRcIiAvKiBFcnJvckNvZGUuVE9LRU5fVVBEQVRFX0ZBSUxFRCAqLywge1xyXG4gICAgICAgICAgICBlcnJvckluZm86IG1lc3NhZ2VcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIGlmICghcmVzcG9uc2VEYXRhLnRva2VuKSB7XHJcbiAgICAgICAgdGhyb3cgRVJST1JfRkFDVE9SWS5jcmVhdGUoXCJ0b2tlbi11cGRhdGUtbm8tdG9rZW5cIiAvKiBFcnJvckNvZGUuVE9LRU5fVVBEQVRFX05PX1RPS0VOICovKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXNwb25zZURhdGEudG9rZW47XHJcbn1cclxuYXN5bmMgZnVuY3Rpb24gcmVxdWVzdERlbGV0ZVRva2VuKGZpcmViYXNlRGVwZW5kZW5jaWVzLCB0b2tlbikge1xyXG4gICAgY29uc3QgaGVhZGVycyA9IGF3YWl0IGdldEhlYWRlcnMoZmlyZWJhc2VEZXBlbmRlbmNpZXMpO1xyXG4gICAgY29uc3QgdW5zdWJzY3JpYmVPcHRpb25zID0ge1xyXG4gICAgICAgIG1ldGhvZDogJ0RFTEVURScsXHJcbiAgICAgICAgaGVhZGVyc1xyXG4gICAgfTtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgJHtnZXRFbmRwb2ludChmaXJlYmFzZURlcGVuZGVuY2llcy5hcHBDb25maWcpfS8ke3Rva2VufWAsIHVuc3Vic2NyaWJlT3B0aW9ucyk7XHJcbiAgICAgICAgY29uc3QgcmVzcG9uc2VEYXRhID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG4gICAgICAgIGlmIChyZXNwb25zZURhdGEuZXJyb3IpIHtcclxuICAgICAgICAgICAgY29uc3QgbWVzc2FnZSA9IHJlc3BvbnNlRGF0YS5lcnJvci5tZXNzYWdlO1xyXG4gICAgICAgICAgICB0aHJvdyBFUlJPUl9GQUNUT1JZLmNyZWF0ZShcInRva2VuLXVuc3Vic2NyaWJlLWZhaWxlZFwiIC8qIEVycm9yQ29kZS5UT0tFTl9VTlNVQlNDUklCRV9GQUlMRUQgKi8sIHtcclxuICAgICAgICAgICAgICAgIGVycm9ySW5mbzogbWVzc2FnZVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgdGhyb3cgRVJST1JfRkFDVE9SWS5jcmVhdGUoXCJ0b2tlbi11bnN1YnNjcmliZS1mYWlsZWRcIiAvKiBFcnJvckNvZGUuVE9LRU5fVU5TVUJTQ1JJQkVfRkFJTEVEICovLCB7XHJcbiAgICAgICAgICAgIGVycm9ySW5mbzogZXJyID09PSBudWxsIHx8IGVyciA9PT0gdm9pZCAwID8gdm9pZCAwIDogZXJyLnRvU3RyaW5nKClcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiBnZXRFbmRwb2ludCh7IHByb2plY3RJZCB9KSB7XHJcbiAgICByZXR1cm4gYCR7RU5EUE9JTlR9L3Byb2plY3RzLyR7cHJvamVjdElkfS9yZWdpc3RyYXRpb25zYDtcclxufVxyXG5hc3luYyBmdW5jdGlvbiBnZXRIZWFkZXJzKHsgYXBwQ29uZmlnLCBpbnN0YWxsYXRpb25zIH0pIHtcclxuICAgIGNvbnN0IGF1dGhUb2tlbiA9IGF3YWl0IGluc3RhbGxhdGlvbnMuZ2V0VG9rZW4oKTtcclxuICAgIHJldHVybiBuZXcgSGVhZGVycyh7XHJcbiAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcclxuICAgICAgICBBY2NlcHQ6ICdhcHBsaWNhdGlvbi9qc29uJyxcclxuICAgICAgICAneC1nb29nLWFwaS1rZXknOiBhcHBDb25maWcuYXBpS2V5LFxyXG4gICAgICAgICd4LWdvb2ctZmlyZWJhc2UtaW5zdGFsbGF0aW9ucy1hdXRoJzogYEZJUyAke2F1dGhUb2tlbn1gXHJcbiAgICB9KTtcclxufVxyXG5mdW5jdGlvbiBnZXRCb2R5KHsgcDI1NmRoLCBhdXRoLCBlbmRwb2ludCwgdmFwaWRLZXkgfSkge1xyXG4gICAgY29uc3QgYm9keSA9IHtcclxuICAgICAgICB3ZWI6IHtcclxuICAgICAgICAgICAgZW5kcG9pbnQsXHJcbiAgICAgICAgICAgIGF1dGgsXHJcbiAgICAgICAgICAgIHAyNTZkaFxyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBpZiAodmFwaWRLZXkgIT09IERFRkFVTFRfVkFQSURfS0VZKSB7XHJcbiAgICAgICAgYm9keS53ZWIuYXBwbGljYXRpb25QdWJLZXkgPSB2YXBpZEtleTtcclxuICAgIH1cclxuICAgIHJldHVybiBib2R5O1xyXG59XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAxOSBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbi8vIFVwZGF0ZVJlZ2lzdHJhdGlvbiB3aWxsIGJlIGNhbGxlZCBvbmNlIGV2ZXJ5IHdlZWsuXHJcbmNvbnN0IFRPS0VOX0VYUElSQVRJT05fTVMgPSA3ICogMjQgKiA2MCAqIDYwICogMTAwMDsgLy8gNyBkYXlzXHJcbmFzeW5jIGZ1bmN0aW9uIGdldFRva2VuSW50ZXJuYWwobWVzc2FnaW5nKSB7XHJcbiAgICBjb25zdCBwdXNoU3Vic2NyaXB0aW9uID0gYXdhaXQgZ2V0UHVzaFN1YnNjcmlwdGlvbihtZXNzYWdpbmcuc3dSZWdpc3RyYXRpb24sIG1lc3NhZ2luZy52YXBpZEtleSk7XHJcbiAgICBjb25zdCBzdWJzY3JpcHRpb25PcHRpb25zID0ge1xyXG4gICAgICAgIHZhcGlkS2V5OiBtZXNzYWdpbmcudmFwaWRLZXksXHJcbiAgICAgICAgc3dTY29wZTogbWVzc2FnaW5nLnN3UmVnaXN0cmF0aW9uLnNjb3BlLFxyXG4gICAgICAgIGVuZHBvaW50OiBwdXNoU3Vic2NyaXB0aW9uLmVuZHBvaW50LFxyXG4gICAgICAgIGF1dGg6IGFycmF5VG9CYXNlNjQocHVzaFN1YnNjcmlwdGlvbi5nZXRLZXkoJ2F1dGgnKSksXHJcbiAgICAgICAgcDI1NmRoOiBhcnJheVRvQmFzZTY0KHB1c2hTdWJzY3JpcHRpb24uZ2V0S2V5KCdwMjU2ZGgnKSlcclxuICAgIH07XHJcbiAgICBjb25zdCB0b2tlbkRldGFpbHMgPSBhd2FpdCBkYkdldChtZXNzYWdpbmcuZmlyZWJhc2VEZXBlbmRlbmNpZXMpO1xyXG4gICAgaWYgKCF0b2tlbkRldGFpbHMpIHtcclxuICAgICAgICAvLyBObyB0b2tlbiwgZ2V0IGEgbmV3IG9uZS5cclxuICAgICAgICByZXR1cm4gZ2V0TmV3VG9rZW4obWVzc2FnaW5nLmZpcmViYXNlRGVwZW5kZW5jaWVzLCBzdWJzY3JpcHRpb25PcHRpb25zKTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKCFpc1Rva2VuVmFsaWQodG9rZW5EZXRhaWxzLnN1YnNjcmlwdGlvbk9wdGlvbnMsIHN1YnNjcmlwdGlvbk9wdGlvbnMpKSB7XHJcbiAgICAgICAgLy8gSW52YWxpZCB0b2tlbiwgZ2V0IGEgbmV3IG9uZS5cclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBhd2FpdCByZXF1ZXN0RGVsZXRlVG9rZW4obWVzc2FnaW5nLmZpcmViYXNlRGVwZW5kZW5jaWVzLCB0b2tlbkRldGFpbHMudG9rZW4pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAvLyBTdXBwcmVzcyBlcnJvcnMgYmVjYXVzZSBvZiAjMjM2NFxyXG4gICAgICAgICAgICBjb25zb2xlLndhcm4oZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBnZXROZXdUb2tlbihtZXNzYWdpbmcuZmlyZWJhc2VEZXBlbmRlbmNpZXMsIHN1YnNjcmlwdGlvbk9wdGlvbnMpO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoRGF0ZS5ub3coKSA+PSB0b2tlbkRldGFpbHMuY3JlYXRlVGltZSArIFRPS0VOX0VYUElSQVRJT05fTVMpIHtcclxuICAgICAgICAvLyBXZWVrbHkgdG9rZW4gcmVmcmVzaFxyXG4gICAgICAgIHJldHVybiB1cGRhdGVUb2tlbihtZXNzYWdpbmcsIHtcclxuICAgICAgICAgICAgdG9rZW46IHRva2VuRGV0YWlscy50b2tlbixcclxuICAgICAgICAgICAgY3JlYXRlVGltZTogRGF0ZS5ub3coKSxcclxuICAgICAgICAgICAgc3Vic2NyaXB0aW9uT3B0aW9uc1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgLy8gVmFsaWQgdG9rZW4sIG5vdGhpbmcgdG8gZG8uXHJcbiAgICAgICAgcmV0dXJuIHRva2VuRGV0YWlscy50b2tlbjtcclxuICAgIH1cclxufVxyXG4vKipcclxuICogVGhpcyBtZXRob2QgZGVsZXRlcyB0aGUgdG9rZW4gZnJvbSB0aGUgZGF0YWJhc2UsIHVuc3Vic2NyaWJlcyB0aGUgdG9rZW4gZnJvbSBGQ00sIGFuZCB1bnJlZ2lzdGVyc1xyXG4gKiB0aGUgcHVzaCBzdWJzY3JpcHRpb24gaWYgaXQgZXhpc3RzLlxyXG4gKi9cclxuYXN5bmMgZnVuY3Rpb24gZGVsZXRlVG9rZW5JbnRlcm5hbChtZXNzYWdpbmcpIHtcclxuICAgIGNvbnN0IHRva2VuRGV0YWlscyA9IGF3YWl0IGRiR2V0KG1lc3NhZ2luZy5maXJlYmFzZURlcGVuZGVuY2llcyk7XHJcbiAgICBpZiAodG9rZW5EZXRhaWxzKSB7XHJcbiAgICAgICAgYXdhaXQgcmVxdWVzdERlbGV0ZVRva2VuKG1lc3NhZ2luZy5maXJlYmFzZURlcGVuZGVuY2llcywgdG9rZW5EZXRhaWxzLnRva2VuKTtcclxuICAgICAgICBhd2FpdCBkYlJlbW92ZShtZXNzYWdpbmcuZmlyZWJhc2VEZXBlbmRlbmNpZXMpO1xyXG4gICAgfVxyXG4gICAgLy8gVW5zdWJzY3JpYmUgZnJvbSB0aGUgcHVzaCBzdWJzY3JpcHRpb24uXHJcbiAgICBjb25zdCBwdXNoU3Vic2NyaXB0aW9uID0gYXdhaXQgbWVzc2FnaW5nLnN3UmVnaXN0cmF0aW9uLnB1c2hNYW5hZ2VyLmdldFN1YnNjcmlwdGlvbigpO1xyXG4gICAgaWYgKHB1c2hTdWJzY3JpcHRpb24pIHtcclxuICAgICAgICByZXR1cm4gcHVzaFN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xyXG4gICAgfVxyXG4gICAgLy8gSWYgdGhlcmUncyBubyBTVywgY29uc2lkZXIgaXQgYSBzdWNjZXNzLlxyXG4gICAgcmV0dXJuIHRydWU7XHJcbn1cclxuYXN5bmMgZnVuY3Rpb24gdXBkYXRlVG9rZW4obWVzc2FnaW5nLCB0b2tlbkRldGFpbHMpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgdXBkYXRlZFRva2VuID0gYXdhaXQgcmVxdWVzdFVwZGF0ZVRva2VuKG1lc3NhZ2luZy5maXJlYmFzZURlcGVuZGVuY2llcywgdG9rZW5EZXRhaWxzKTtcclxuICAgICAgICBjb25zdCB1cGRhdGVkVG9rZW5EZXRhaWxzID0gT2JqZWN0LmFzc2lnbihPYmplY3QuYXNzaWduKHt9LCB0b2tlbkRldGFpbHMpLCB7IHRva2VuOiB1cGRhdGVkVG9rZW4sIGNyZWF0ZVRpbWU6IERhdGUubm93KCkgfSk7XHJcbiAgICAgICAgYXdhaXQgZGJTZXQobWVzc2FnaW5nLmZpcmViYXNlRGVwZW5kZW5jaWVzLCB1cGRhdGVkVG9rZW5EZXRhaWxzKTtcclxuICAgICAgICByZXR1cm4gdXBkYXRlZFRva2VuO1xyXG4gICAgfVxyXG4gICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICB0aHJvdyBlO1xyXG4gICAgfVxyXG59XHJcbmFzeW5jIGZ1bmN0aW9uIGdldE5ld1Rva2VuKGZpcmViYXNlRGVwZW5kZW5jaWVzLCBzdWJzY3JpcHRpb25PcHRpb25zKSB7XHJcbiAgICBjb25zdCB0b2tlbiA9IGF3YWl0IHJlcXVlc3RHZXRUb2tlbihmaXJlYmFzZURlcGVuZGVuY2llcywgc3Vic2NyaXB0aW9uT3B0aW9ucyk7XHJcbiAgICBjb25zdCB0b2tlbkRldGFpbHMgPSB7XHJcbiAgICAgICAgdG9rZW4sXHJcbiAgICAgICAgY3JlYXRlVGltZTogRGF0ZS5ub3coKSxcclxuICAgICAgICBzdWJzY3JpcHRpb25PcHRpb25zXHJcbiAgICB9O1xyXG4gICAgYXdhaXQgZGJTZXQoZmlyZWJhc2VEZXBlbmRlbmNpZXMsIHRva2VuRGV0YWlscyk7XHJcbiAgICByZXR1cm4gdG9rZW5EZXRhaWxzLnRva2VuO1xyXG59XHJcbi8qKlxyXG4gKiBHZXRzIGEgUHVzaFN1YnNjcmlwdGlvbiBmb3IgdGhlIGN1cnJlbnQgdXNlci5cclxuICovXHJcbmFzeW5jIGZ1bmN0aW9uIGdldFB1c2hTdWJzY3JpcHRpb24oc3dSZWdpc3RyYXRpb24sIHZhcGlkS2V5KSB7XHJcbiAgICBjb25zdCBzdWJzY3JpcHRpb24gPSBhd2FpdCBzd1JlZ2lzdHJhdGlvbi5wdXNoTWFuYWdlci5nZXRTdWJzY3JpcHRpb24oKTtcclxuICAgIGlmIChzdWJzY3JpcHRpb24pIHtcclxuICAgICAgICByZXR1cm4gc3Vic2NyaXB0aW9uO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHN3UmVnaXN0cmF0aW9uLnB1c2hNYW5hZ2VyLnN1YnNjcmliZSh7XHJcbiAgICAgICAgdXNlclZpc2libGVPbmx5OiB0cnVlLFxyXG4gICAgICAgIC8vIENocm9tZSA8PSA3NSBkb2Vzbid0IHN1cHBvcnQgYmFzZTY0LWVuY29kZWQgVkFQSUQga2V5LiBGb3IgYmFja3dhcmQgY29tcGF0aWJpbGl0eSwgVkFQSUQga2V5XHJcbiAgICAgICAgLy8gc3VibWl0dGVkIHRvIHB1c2hNYW5hZ2VyI3N1YnNjcmliZSBtdXN0IGJlIG9mIHR5cGUgVWludDhBcnJheS5cclxuICAgICAgICBhcHBsaWNhdGlvblNlcnZlcktleTogYmFzZTY0VG9BcnJheSh2YXBpZEtleSlcclxuICAgIH0pO1xyXG59XHJcbi8qKlxyXG4gKiBDaGVja3MgaWYgdGhlIHNhdmVkIHRva2VuRGV0YWlscyBvYmplY3QgbWF0Y2hlcyB0aGUgY29uZmlndXJhdGlvbiBwcm92aWRlZC5cclxuICovXHJcbmZ1bmN0aW9uIGlzVG9rZW5WYWxpZChkYk9wdGlvbnMsIGN1cnJlbnRPcHRpb25zKSB7XHJcbiAgICBjb25zdCBpc1ZhcGlkS2V5RXF1YWwgPSBjdXJyZW50T3B0aW9ucy52YXBpZEtleSA9PT0gZGJPcHRpb25zLnZhcGlkS2V5O1xyXG4gICAgY29uc3QgaXNFbmRwb2ludEVxdWFsID0gY3VycmVudE9wdGlvbnMuZW5kcG9pbnQgPT09IGRiT3B0aW9ucy5lbmRwb2ludDtcclxuICAgIGNvbnN0IGlzQXV0aEVxdWFsID0gY3VycmVudE9wdGlvbnMuYXV0aCA9PT0gZGJPcHRpb25zLmF1dGg7XHJcbiAgICBjb25zdCBpc1AyNTZkaEVxdWFsID0gY3VycmVudE9wdGlvbnMucDI1NmRoID09PSBkYk9wdGlvbnMucDI1NmRoO1xyXG4gICAgcmV0dXJuIGlzVmFwaWRLZXlFcXVhbCAmJiBpc0VuZHBvaW50RXF1YWwgJiYgaXNBdXRoRXF1YWwgJiYgaXNQMjU2ZGhFcXVhbDtcclxufVxuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMjAgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG5mdW5jdGlvbiBleHRlcm5hbGl6ZVBheWxvYWQoaW50ZXJuYWxQYXlsb2FkKSB7XHJcbiAgICBjb25zdCBwYXlsb2FkID0ge1xyXG4gICAgICAgIGZyb206IGludGVybmFsUGF5bG9hZC5mcm9tLFxyXG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBjYW1lbGNhc2VcclxuICAgICAgICBjb2xsYXBzZUtleTogaW50ZXJuYWxQYXlsb2FkLmNvbGxhcHNlX2tleSxcclxuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgY2FtZWxjYXNlXHJcbiAgICAgICAgbWVzc2FnZUlkOiBpbnRlcm5hbFBheWxvYWQuZmNtTWVzc2FnZUlkXHJcbiAgICB9O1xyXG4gICAgcHJvcGFnYXRlTm90aWZpY2F0aW9uUGF5bG9hZChwYXlsb2FkLCBpbnRlcm5hbFBheWxvYWQpO1xyXG4gICAgcHJvcGFnYXRlRGF0YVBheWxvYWQocGF5bG9hZCwgaW50ZXJuYWxQYXlsb2FkKTtcclxuICAgIHByb3BhZ2F0ZUZjbU9wdGlvbnMocGF5bG9hZCwgaW50ZXJuYWxQYXlsb2FkKTtcclxuICAgIHJldHVybiBwYXlsb2FkO1xyXG59XHJcbmZ1bmN0aW9uIHByb3BhZ2F0ZU5vdGlmaWNhdGlvblBheWxvYWQocGF5bG9hZCwgbWVzc2FnZVBheWxvYWRJbnRlcm5hbCkge1xyXG4gICAgaWYgKCFtZXNzYWdlUGF5bG9hZEludGVybmFsLm5vdGlmaWNhdGlvbikge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIHBheWxvYWQubm90aWZpY2F0aW9uID0ge307XHJcbiAgICBjb25zdCB0aXRsZSA9IG1lc3NhZ2VQYXlsb2FkSW50ZXJuYWwubm90aWZpY2F0aW9uLnRpdGxlO1xyXG4gICAgaWYgKCEhdGl0bGUpIHtcclxuICAgICAgICBwYXlsb2FkLm5vdGlmaWNhdGlvbi50aXRsZSA9IHRpdGxlO1xyXG4gICAgfVxyXG4gICAgY29uc3QgYm9keSA9IG1lc3NhZ2VQYXlsb2FkSW50ZXJuYWwubm90aWZpY2F0aW9uLmJvZHk7XHJcbiAgICBpZiAoISFib2R5KSB7XHJcbiAgICAgICAgcGF5bG9hZC5ub3RpZmljYXRpb24uYm9keSA9IGJvZHk7XHJcbiAgICB9XHJcbiAgICBjb25zdCBpbWFnZSA9IG1lc3NhZ2VQYXlsb2FkSW50ZXJuYWwubm90aWZpY2F0aW9uLmltYWdlO1xyXG4gICAgaWYgKCEhaW1hZ2UpIHtcclxuICAgICAgICBwYXlsb2FkLm5vdGlmaWNhdGlvbi5pbWFnZSA9IGltYWdlO1xyXG4gICAgfVxyXG4gICAgY29uc3QgaWNvbiA9IG1lc3NhZ2VQYXlsb2FkSW50ZXJuYWwubm90aWZpY2F0aW9uLmljb247XHJcbiAgICBpZiAoISFpY29uKSB7XHJcbiAgICAgICAgcGF5bG9hZC5ub3RpZmljYXRpb24uaWNvbiA9IGljb247XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gcHJvcGFnYXRlRGF0YVBheWxvYWQocGF5bG9hZCwgbWVzc2FnZVBheWxvYWRJbnRlcm5hbCkge1xyXG4gICAgaWYgKCFtZXNzYWdlUGF5bG9hZEludGVybmFsLmRhdGEpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBwYXlsb2FkLmRhdGEgPSBtZXNzYWdlUGF5bG9hZEludGVybmFsLmRhdGE7XHJcbn1cclxuZnVuY3Rpb24gcHJvcGFnYXRlRmNtT3B0aW9ucyhwYXlsb2FkLCBtZXNzYWdlUGF5bG9hZEludGVybmFsKSB7XHJcbiAgICB2YXIgX2EsIF9iLCBfYywgX2QsIF9lO1xyXG4gICAgLy8gZmNtT3B0aW9ucy5saW5rIHZhbHVlIGlzIHdyaXR0ZW4gaW50byBub3RpZmljYXRpb24uY2xpY2tfYWN0aW9uLiBzZWUgbW9yZSBpbiBiLzIzMjA3MjExMVxyXG4gICAgaWYgKCFtZXNzYWdlUGF5bG9hZEludGVybmFsLmZjbU9wdGlvbnMgJiZcclxuICAgICAgICAhKChfYSA9IG1lc3NhZ2VQYXlsb2FkSW50ZXJuYWwubm90aWZpY2F0aW9uKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuY2xpY2tfYWN0aW9uKSkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIHBheWxvYWQuZmNtT3B0aW9ucyA9IHt9O1xyXG4gICAgY29uc3QgbGluayA9IChfYyA9IChfYiA9IG1lc3NhZ2VQYXlsb2FkSW50ZXJuYWwuZmNtT3B0aW9ucykgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLmxpbmspICE9PSBudWxsICYmIF9jICE9PSB2b2lkIDAgPyBfYyA6IChfZCA9IG1lc3NhZ2VQYXlsb2FkSW50ZXJuYWwubm90aWZpY2F0aW9uKSA9PT0gbnVsbCB8fCBfZCA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2QuY2xpY2tfYWN0aW9uO1xyXG4gICAgaWYgKCEhbGluaykge1xyXG4gICAgICAgIHBheWxvYWQuZmNtT3B0aW9ucy5saW5rID0gbGluaztcclxuICAgIH1cclxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBjYW1lbGNhc2VcclxuICAgIGNvbnN0IGFuYWx5dGljc0xhYmVsID0gKF9lID0gbWVzc2FnZVBheWxvYWRJbnRlcm5hbC5mY21PcHRpb25zKSA9PT0gbnVsbCB8fCBfZSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2UuYW5hbHl0aWNzX2xhYmVsO1xyXG4gICAgaWYgKCEhYW5hbHl0aWNzTGFiZWwpIHtcclxuICAgICAgICBwYXlsb2FkLmZjbU9wdGlvbnMuYW5hbHl0aWNzTGFiZWwgPSBhbmFseXRpY3NMYWJlbDtcclxuICAgIH1cclxufVxuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMTkgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG5mdW5jdGlvbiBpc0NvbnNvbGVNZXNzYWdlKGRhdGEpIHtcclxuICAgIC8vIFRoaXMgbWVzc2FnZSBoYXMgYSBjYW1wYWlnbiBJRCwgbWVhbmluZyBpdCB3YXMgc2VudCB1c2luZyB0aGUgRmlyZWJhc2UgQ29uc29sZS5cclxuICAgIHJldHVybiB0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcgJiYgISFkYXRhICYmIENPTlNPTEVfQ0FNUEFJR05fSUQgaW4gZGF0YTtcclxufVxuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMTkgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG5fbWVyZ2VTdHJpbmdzKCdodHMvZnJic2xnaWdwLm9nZXBzY212L2llby9lYXlsZycsICd0cDovaWVhZW9nbi1hZ29sYWkuby8xZnJsZ2xnYy9vJyk7XHJcbl9tZXJnZVN0cmluZ3MoJ0F6U0NidzYzZzFSMG5Ddzg1akc4JywgJ0lheWEzeUxLd21ndmg3Y0YwcTQnKTtcclxuZnVuY3Rpb24gX21lcmdlU3RyaW5ncyhzMSwgczIpIHtcclxuICAgIGNvbnN0IHJlc3VsdEFycmF5ID0gW107XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHMxLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgcmVzdWx0QXJyYXkucHVzaChzMS5jaGFyQXQoaSkpO1xyXG4gICAgICAgIGlmIChpIDwgczIubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHJlc3VsdEFycmF5LnB1c2goczIuY2hhckF0KGkpKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0QXJyYXkuam9pbignJyk7XHJcbn1cblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDE5IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuZnVuY3Rpb24gZXh0cmFjdEFwcENvbmZpZyhhcHApIHtcclxuICAgIGlmICghYXBwIHx8ICFhcHAub3B0aW9ucykge1xyXG4gICAgICAgIHRocm93IGdldE1pc3NpbmdWYWx1ZUVycm9yKCdBcHAgQ29uZmlndXJhdGlvbiBPYmplY3QnKTtcclxuICAgIH1cclxuICAgIGlmICghYXBwLm5hbWUpIHtcclxuICAgICAgICB0aHJvdyBnZXRNaXNzaW5nVmFsdWVFcnJvcignQXBwIE5hbWUnKTtcclxuICAgIH1cclxuICAgIC8vIFJlcXVpcmVkIGFwcCBjb25maWcga2V5c1xyXG4gICAgY29uc3QgY29uZmlnS2V5cyA9IFtcclxuICAgICAgICAncHJvamVjdElkJyxcclxuICAgICAgICAnYXBpS2V5JyxcclxuICAgICAgICAnYXBwSWQnLFxyXG4gICAgICAgICdtZXNzYWdpbmdTZW5kZXJJZCdcclxuICAgIF07XHJcbiAgICBjb25zdCB7IG9wdGlvbnMgfSA9IGFwcDtcclxuICAgIGZvciAoY29uc3Qga2V5TmFtZSBvZiBjb25maWdLZXlzKSB7XHJcbiAgICAgICAgaWYgKCFvcHRpb25zW2tleU5hbWVdKSB7XHJcbiAgICAgICAgICAgIHRocm93IGdldE1pc3NpbmdWYWx1ZUVycm9yKGtleU5hbWUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgYXBwTmFtZTogYXBwLm5hbWUsXHJcbiAgICAgICAgcHJvamVjdElkOiBvcHRpb25zLnByb2plY3RJZCxcclxuICAgICAgICBhcGlLZXk6IG9wdGlvbnMuYXBpS2V5LFxyXG4gICAgICAgIGFwcElkOiBvcHRpb25zLmFwcElkLFxyXG4gICAgICAgIHNlbmRlcklkOiBvcHRpb25zLm1lc3NhZ2luZ1NlbmRlcklkXHJcbiAgICB9O1xyXG59XHJcbmZ1bmN0aW9uIGdldE1pc3NpbmdWYWx1ZUVycm9yKHZhbHVlTmFtZSkge1xyXG4gICAgcmV0dXJuIEVSUk9SX0ZBQ1RPUlkuY3JlYXRlKFwibWlzc2luZy1hcHAtY29uZmlnLXZhbHVlc1wiIC8qIEVycm9yQ29kZS5NSVNTSU5HX0FQUF9DT05GSUdfVkFMVUVTICovLCB7XHJcbiAgICAgICAgdmFsdWVOYW1lXHJcbiAgICB9KTtcclxufVxuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMjAgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG5jbGFzcyBNZXNzYWdpbmdTZXJ2aWNlIHtcclxuICAgIGNvbnN0cnVjdG9yKGFwcCwgaW5zdGFsbGF0aW9ucywgYW5hbHl0aWNzUHJvdmlkZXIpIHtcclxuICAgICAgICAvLyBsb2dnaW5nIGlzIG9ubHkgZG9uZSB3aXRoIGVuZCB1c2VyIGNvbnNlbnQuIERlZmF1bHQgdG8gZmFsc2UuXHJcbiAgICAgICAgdGhpcy5kZWxpdmVyeU1ldHJpY3NFeHBvcnRlZFRvQmlnUXVlcnlFbmFibGVkID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5vbkJhY2tncm91bmRNZXNzYWdlSGFuZGxlciA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5vbk1lc3NhZ2VIYW5kbGVyID0gbnVsbDtcclxuICAgICAgICB0aGlzLmxvZ0V2ZW50cyA9IFtdO1xyXG4gICAgICAgIHRoaXMuaXNMb2dTZXJ2aWNlU3RhcnRlZCA9IGZhbHNlO1xyXG4gICAgICAgIGNvbnN0IGFwcENvbmZpZyA9IGV4dHJhY3RBcHBDb25maWcoYXBwKTtcclxuICAgICAgICB0aGlzLmZpcmViYXNlRGVwZW5kZW5jaWVzID0ge1xyXG4gICAgICAgICAgICBhcHAsXHJcbiAgICAgICAgICAgIGFwcENvbmZpZyxcclxuICAgICAgICAgICAgaW5zdGFsbGF0aW9ucyxcclxuICAgICAgICAgICAgYW5hbHl0aWNzUHJvdmlkZXJcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG4gICAgX2RlbGV0ZSgpIHtcclxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XHJcbiAgICB9XHJcbn1cblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDIwIEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuYXN5bmMgZnVuY3Rpb24gcmVnaXN0ZXJEZWZhdWx0U3cobWVzc2FnaW5nKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIG1lc3NhZ2luZy5zd1JlZ2lzdHJhdGlvbiA9IGF3YWl0IG5hdmlnYXRvci5zZXJ2aWNlV29ya2VyLnJlZ2lzdGVyKERFRkFVTFRfU1dfUEFUSCwge1xyXG4gICAgICAgICAgICBzY29wZTogREVGQVVMVF9TV19TQ09QRVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIC8vIFRoZSB0aW1pbmcgd2hlbiBicm93c2VyIHVwZGF0ZXMgc3cgd2hlbiBzdyBoYXMgYW4gdXBkYXRlIGlzIHVucmVsaWFibGUgZnJvbSBleHBlcmltZW50LiBJdFxyXG4gICAgICAgIC8vIGxlYWRzIHRvIHZlcnNpb24gY29uZmxpY3Qgd2hlbiB0aGUgU0RLIHVwZ3JhZGVzIHRvIGEgbmV3ZXIgdmVyc2lvbiBpbiB0aGUgbWFpbiBwYWdlLCBidXQgc3dcclxuICAgICAgICAvLyBpcyBzdHVjayB3aXRoIHRoZSBvbGQgdmVyc2lvbi4gRm9yIGV4YW1wbGUsXHJcbiAgICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2ZpcmViYXNlL2ZpcmViYXNlLWpzLXNkay9pc3N1ZXMvMjU5MCBUaGUgZm9sbG93aW5nIGxpbmUgcmVsaWFibHkgdXBkYXRlc1xyXG4gICAgICAgIC8vIHN3IGlmIHRoZXJlIHdhcyBhbiB1cGRhdGUuXHJcbiAgICAgICAgbWVzc2FnaW5nLnN3UmVnaXN0cmF0aW9uLnVwZGF0ZSgpLmNhdGNoKCgpID0+IHtcclxuICAgICAgICAgICAgLyogaXQgaXMgbm9uIGJsb2NraW5nIGFuZCB3ZSBkb24ndCBjYXJlIGlmIGl0IGZhaWxlZCAqL1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICB0aHJvdyBFUlJPUl9GQUNUT1JZLmNyZWF0ZShcImZhaWxlZC1zZXJ2aWNlLXdvcmtlci1yZWdpc3RyYXRpb25cIiAvKiBFcnJvckNvZGUuRkFJTEVEX0RFRkFVTFRfUkVHSVNUUkFUSU9OICovLCB7XHJcbiAgICAgICAgICAgIGJyb3dzZXJFcnJvck1lc3NhZ2U6IGUgPT09IG51bGwgfHwgZSA9PT0gdm9pZCAwID8gdm9pZCAwIDogZS5tZXNzYWdlXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDIwIEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuYXN5bmMgZnVuY3Rpb24gdXBkYXRlU3dSZWcobWVzc2FnaW5nLCBzd1JlZ2lzdHJhdGlvbikge1xyXG4gICAgaWYgKCFzd1JlZ2lzdHJhdGlvbiAmJiAhbWVzc2FnaW5nLnN3UmVnaXN0cmF0aW9uKSB7XHJcbiAgICAgICAgYXdhaXQgcmVnaXN0ZXJEZWZhdWx0U3cobWVzc2FnaW5nKTtcclxuICAgIH1cclxuICAgIGlmICghc3dSZWdpc3RyYXRpb24gJiYgISFtZXNzYWdpbmcuc3dSZWdpc3RyYXRpb24pIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBpZiAoIShzd1JlZ2lzdHJhdGlvbiBpbnN0YW5jZW9mIFNlcnZpY2VXb3JrZXJSZWdpc3RyYXRpb24pKSB7XHJcbiAgICAgICAgdGhyb3cgRVJST1JfRkFDVE9SWS5jcmVhdGUoXCJpbnZhbGlkLXN3LXJlZ2lzdHJhdGlvblwiIC8qIEVycm9yQ29kZS5JTlZBTElEX1NXX1JFR0lTVFJBVElPTiAqLyk7XHJcbiAgICB9XHJcbiAgICBtZXNzYWdpbmcuc3dSZWdpc3RyYXRpb24gPSBzd1JlZ2lzdHJhdGlvbjtcclxufVxuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMjAgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG5hc3luYyBmdW5jdGlvbiB1cGRhdGVWYXBpZEtleShtZXNzYWdpbmcsIHZhcGlkS2V5KSB7XHJcbiAgICBpZiAoISF2YXBpZEtleSkge1xyXG4gICAgICAgIG1lc3NhZ2luZy52YXBpZEtleSA9IHZhcGlkS2V5O1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoIW1lc3NhZ2luZy52YXBpZEtleSkge1xyXG4gICAgICAgIG1lc3NhZ2luZy52YXBpZEtleSA9IERFRkFVTFRfVkFQSURfS0VZO1xyXG4gICAgfVxyXG59XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAyMCBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbmFzeW5jIGZ1bmN0aW9uIGdldFRva2VuJDEobWVzc2FnaW5nLCBvcHRpb25zKSB7XHJcbiAgICBpZiAoIW5hdmlnYXRvcikge1xyXG4gICAgICAgIHRocm93IEVSUk9SX0ZBQ1RPUlkuY3JlYXRlKFwib25seS1hdmFpbGFibGUtaW4td2luZG93XCIgLyogRXJyb3JDb2RlLkFWQUlMQUJMRV9JTl9XSU5ET1cgKi8pO1xyXG4gICAgfVxyXG4gICAgaWYgKE5vdGlmaWNhdGlvbi5wZXJtaXNzaW9uID09PSAnZGVmYXVsdCcpIHtcclxuICAgICAgICBhd2FpdCBOb3RpZmljYXRpb24ucmVxdWVzdFBlcm1pc3Npb24oKTtcclxuICAgIH1cclxuICAgIGlmIChOb3RpZmljYXRpb24ucGVybWlzc2lvbiAhPT0gJ2dyYW50ZWQnKSB7XHJcbiAgICAgICAgdGhyb3cgRVJST1JfRkFDVE9SWS5jcmVhdGUoXCJwZXJtaXNzaW9uLWJsb2NrZWRcIiAvKiBFcnJvckNvZGUuUEVSTUlTU0lPTl9CTE9DS0VEICovKTtcclxuICAgIH1cclxuICAgIGF3YWl0IHVwZGF0ZVZhcGlkS2V5KG1lc3NhZ2luZywgb3B0aW9ucyA9PT0gbnVsbCB8fCBvcHRpb25zID09PSB2b2lkIDAgPyB2b2lkIDAgOiBvcHRpb25zLnZhcGlkS2V5KTtcclxuICAgIGF3YWl0IHVwZGF0ZVN3UmVnKG1lc3NhZ2luZywgb3B0aW9ucyA9PT0gbnVsbCB8fCBvcHRpb25zID09PSB2b2lkIDAgPyB2b2lkIDAgOiBvcHRpb25zLnNlcnZpY2VXb3JrZXJSZWdpc3RyYXRpb24pO1xyXG4gICAgcmV0dXJuIGdldFRva2VuSW50ZXJuYWwobWVzc2FnaW5nKTtcclxufVxuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMTkgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG5hc3luYyBmdW5jdGlvbiBsb2dUb1NjaW9uKG1lc3NhZ2luZywgbWVzc2FnZVR5cGUsIGRhdGEpIHtcclxuICAgIGNvbnN0IGV2ZW50VHlwZSA9IGdldEV2ZW50VHlwZShtZXNzYWdlVHlwZSk7XHJcbiAgICBjb25zdCBhbmFseXRpY3MgPSBhd2FpdCBtZXNzYWdpbmcuZmlyZWJhc2VEZXBlbmRlbmNpZXMuYW5hbHl0aWNzUHJvdmlkZXIuZ2V0KCk7XHJcbiAgICBhbmFseXRpY3MubG9nRXZlbnQoZXZlbnRUeXBlLCB7XHJcbiAgICAgICAgLyogZXNsaW50LWRpc2FibGUgY2FtZWxjYXNlICovXHJcbiAgICAgICAgbWVzc2FnZV9pZDogZGF0YVtDT05TT0xFX0NBTVBBSUdOX0lEXSxcclxuICAgICAgICBtZXNzYWdlX25hbWU6IGRhdGFbQ09OU09MRV9DQU1QQUlHTl9OQU1FXSxcclxuICAgICAgICBtZXNzYWdlX3RpbWU6IGRhdGFbQ09OU09MRV9DQU1QQUlHTl9USU1FXSxcclxuICAgICAgICBtZXNzYWdlX2RldmljZV90aW1lOiBNYXRoLmZsb29yKERhdGUubm93KCkgLyAxMDAwKVxyXG4gICAgICAgIC8qIGVzbGludC1lbmFibGUgY2FtZWxjYXNlICovXHJcbiAgICB9KTtcclxufVxyXG5mdW5jdGlvbiBnZXRFdmVudFR5cGUobWVzc2FnZVR5cGUpIHtcclxuICAgIHN3aXRjaCAobWVzc2FnZVR5cGUpIHtcclxuICAgICAgICBjYXNlIE1lc3NhZ2VUeXBlLk5PVElGSUNBVElPTl9DTElDS0VEOlxyXG4gICAgICAgICAgICByZXR1cm4gJ25vdGlmaWNhdGlvbl9vcGVuJztcclxuICAgICAgICBjYXNlIE1lc3NhZ2VUeXBlLlBVU0hfUkVDRUlWRUQ6XHJcbiAgICAgICAgICAgIHJldHVybiAnbm90aWZpY2F0aW9uX2ZvcmVncm91bmQnO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcigpO1xyXG4gICAgfVxyXG59XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAxNyBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbmFzeW5jIGZ1bmN0aW9uIG1lc3NhZ2VFdmVudExpc3RlbmVyKG1lc3NhZ2luZywgZXZlbnQpIHtcclxuICAgIGNvbnN0IGludGVybmFsUGF5bG9hZCA9IGV2ZW50LmRhdGE7XHJcbiAgICBpZiAoIWludGVybmFsUGF5bG9hZC5pc0ZpcmViYXNlTWVzc2FnaW5nKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgaWYgKG1lc3NhZ2luZy5vbk1lc3NhZ2VIYW5kbGVyICYmXHJcbiAgICAgICAgaW50ZXJuYWxQYXlsb2FkLm1lc3NhZ2VUeXBlID09PSBNZXNzYWdlVHlwZS5QVVNIX1JFQ0VJVkVEKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBtZXNzYWdpbmcub25NZXNzYWdlSGFuZGxlciA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICBtZXNzYWdpbmcub25NZXNzYWdlSGFuZGxlcihleHRlcm5hbGl6ZVBheWxvYWQoaW50ZXJuYWxQYXlsb2FkKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBtZXNzYWdpbmcub25NZXNzYWdlSGFuZGxlci5uZXh0KGV4dGVybmFsaXplUGF5bG9hZChpbnRlcm5hbFBheWxvYWQpKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvLyBMb2cgdG8gU2Npb24gaWYgYXBwbGljYWJsZVxyXG4gICAgY29uc3QgZGF0YVBheWxvYWQgPSBpbnRlcm5hbFBheWxvYWQuZGF0YTtcclxuICAgIGlmIChpc0NvbnNvbGVNZXNzYWdlKGRhdGFQYXlsb2FkKSAmJlxyXG4gICAgICAgIGRhdGFQYXlsb2FkW0NPTlNPTEVfQ0FNUEFJR05fQU5BTFlUSUNTX0VOQUJMRURdID09PSAnMScpIHtcclxuICAgICAgICBhd2FpdCBsb2dUb1NjaW9uKG1lc3NhZ2luZywgaW50ZXJuYWxQYXlsb2FkLm1lc3NhZ2VUeXBlLCBkYXRhUGF5bG9hZCk7XHJcbiAgICB9XHJcbn1cblxuY29uc3QgbmFtZSA9IFwiQGZpcmViYXNlL21lc3NhZ2luZ1wiO1xuY29uc3QgdmVyc2lvbiA9IFwiMC4xMi4xMFwiO1xuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMjAgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG5jb25zdCBXaW5kb3dNZXNzYWdpbmdGYWN0b3J5ID0gKGNvbnRhaW5lcikgPT4ge1xyXG4gICAgY29uc3QgbWVzc2FnaW5nID0gbmV3IE1lc3NhZ2luZ1NlcnZpY2UoY29udGFpbmVyLmdldFByb3ZpZGVyKCdhcHAnKS5nZXRJbW1lZGlhdGUoKSwgY29udGFpbmVyLmdldFByb3ZpZGVyKCdpbnN0YWxsYXRpb25zLWludGVybmFsJykuZ2V0SW1tZWRpYXRlKCksIGNvbnRhaW5lci5nZXRQcm92aWRlcignYW5hbHl0aWNzLWludGVybmFsJykpO1xyXG4gICAgbmF2aWdhdG9yLnNlcnZpY2VXb3JrZXIuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIGUgPT4gbWVzc2FnZUV2ZW50TGlzdGVuZXIobWVzc2FnaW5nLCBlKSk7XHJcbiAgICByZXR1cm4gbWVzc2FnaW5nO1xyXG59O1xyXG5jb25zdCBXaW5kb3dNZXNzYWdpbmdJbnRlcm5hbEZhY3RvcnkgPSAoY29udGFpbmVyKSA9PiB7XHJcbiAgICBjb25zdCBtZXNzYWdpbmcgPSBjb250YWluZXJcclxuICAgICAgICAuZ2V0UHJvdmlkZXIoJ21lc3NhZ2luZycpXHJcbiAgICAgICAgLmdldEltbWVkaWF0ZSgpO1xyXG4gICAgY29uc3QgbWVzc2FnaW5nSW50ZXJuYWwgPSB7XHJcbiAgICAgICAgZ2V0VG9rZW46IChvcHRpb25zKSA9PiBnZXRUb2tlbiQxKG1lc3NhZ2luZywgb3B0aW9ucylcclxuICAgIH07XHJcbiAgICByZXR1cm4gbWVzc2FnaW5nSW50ZXJuYWw7XHJcbn07XHJcbmZ1bmN0aW9uIHJlZ2lzdGVyTWVzc2FnaW5nSW5XaW5kb3coKSB7XHJcbiAgICBfcmVnaXN0ZXJDb21wb25lbnQobmV3IENvbXBvbmVudCgnbWVzc2FnaW5nJywgV2luZG93TWVzc2FnaW5nRmFjdG9yeSwgXCJQVUJMSUNcIiAvKiBDb21wb25lbnRUeXBlLlBVQkxJQyAqLykpO1xyXG4gICAgX3JlZ2lzdGVyQ29tcG9uZW50KG5ldyBDb21wb25lbnQoJ21lc3NhZ2luZy1pbnRlcm5hbCcsIFdpbmRvd01lc3NhZ2luZ0ludGVybmFsRmFjdG9yeSwgXCJQUklWQVRFXCIgLyogQ29tcG9uZW50VHlwZS5QUklWQVRFICovKSk7XHJcbiAgICByZWdpc3RlclZlcnNpb24obmFtZSwgdmVyc2lvbik7XHJcbiAgICAvLyBCVUlMRF9UQVJHRVQgd2lsbCBiZSByZXBsYWNlZCBieSB2YWx1ZXMgbGlrZSBlc201LCBlc20yMDE3LCBjanM1LCBldGMgZHVyaW5nIHRoZSBjb21waWxhdGlvblxyXG4gICAgcmVnaXN0ZXJWZXJzaW9uKG5hbWUsIHZlcnNpb24sICdlc20yMDE3Jyk7XHJcbn1cblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDIwIEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuLyoqXHJcbiAqIENoZWNrcyBpZiBhbGwgcmVxdWlyZWQgQVBJcyBleGlzdCBpbiB0aGUgYnJvd3Nlci5cclxuICogQHJldHVybnMgYSBQcm9taXNlIHRoYXQgcmVzb2x2ZXMgdG8gYSBib29sZWFuLlxyXG4gKlxyXG4gKiBAcHVibGljXHJcbiAqL1xyXG5hc3luYyBmdW5jdGlvbiBpc1dpbmRvd1N1cHBvcnRlZCgpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgLy8gVGhpcyB0aHJvd3MgaWYgb3BlbigpIGlzIHVuc3VwcG9ydGVkLCBzbyBhZGRpbmcgaXQgdG8gdGhlIGNvbmRpdGlvbmFsXHJcbiAgICAgICAgLy8gc3RhdGVtZW50IGJlbG93IGNhbiBjYXVzZSBhbiB1bmNhdWdodCBlcnJvci5cclxuICAgICAgICBhd2FpdCB2YWxpZGF0ZUluZGV4ZWREQk9wZW5hYmxlKCk7XHJcbiAgICB9XHJcbiAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIC8vIGZpcmViYXNlLWpzLXNkay9pc3N1ZXMvMjM5MyByZXZlYWxzIHRoYXQgaWRiI29wZW4gaW4gU2FmYXJpIGlmcmFtZSBhbmQgRmlyZWZveCBwcml2YXRlIGJyb3dzaW5nXHJcbiAgICAvLyBtaWdodCBiZSBwcm9oaWJpdGVkIHRvIHJ1bi4gSW4gdGhlc2UgY29udGV4dHMsIGFuIGVycm9yIHdvdWxkIGJlIHRocm93biBkdXJpbmcgdGhlIG1lc3NhZ2luZ1xyXG4gICAgLy8gaW5zdGFudGlhdGluZyBwaGFzZSwgaW5mb3JtaW5nIHRoZSBkZXZlbG9wZXJzIHRvIGltcG9ydC9jYWxsIGlzU3VwcG9ydGVkIGZvciBzcGVjaWFsIGhhbmRsaW5nLlxyXG4gICAgcmV0dXJuICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJlxyXG4gICAgICAgIGlzSW5kZXhlZERCQXZhaWxhYmxlKCkgJiZcclxuICAgICAgICBhcmVDb29raWVzRW5hYmxlZCgpICYmXHJcbiAgICAgICAgJ3NlcnZpY2VXb3JrZXInIGluIG5hdmlnYXRvciAmJlxyXG4gICAgICAgICdQdXNoTWFuYWdlcicgaW4gd2luZG93ICYmXHJcbiAgICAgICAgJ05vdGlmaWNhdGlvbicgaW4gd2luZG93ICYmXHJcbiAgICAgICAgJ2ZldGNoJyBpbiB3aW5kb3cgJiZcclxuICAgICAgICBTZXJ2aWNlV29ya2VyUmVnaXN0cmF0aW9uLnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eSgnc2hvd05vdGlmaWNhdGlvbicpICYmXHJcbiAgICAgICAgUHVzaFN1YnNjcmlwdGlvbi5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkoJ2dldEtleScpKTtcclxufVxuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMjAgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG5hc3luYyBmdW5jdGlvbiBkZWxldGVUb2tlbiQxKG1lc3NhZ2luZykge1xyXG4gICAgaWYgKCFuYXZpZ2F0b3IpIHtcclxuICAgICAgICB0aHJvdyBFUlJPUl9GQUNUT1JZLmNyZWF0ZShcIm9ubHktYXZhaWxhYmxlLWluLXdpbmRvd1wiIC8qIEVycm9yQ29kZS5BVkFJTEFCTEVfSU5fV0lORE9XICovKTtcclxuICAgIH1cclxuICAgIGlmICghbWVzc2FnaW5nLnN3UmVnaXN0cmF0aW9uKSB7XHJcbiAgICAgICAgYXdhaXQgcmVnaXN0ZXJEZWZhdWx0U3cobWVzc2FnaW5nKTtcclxuICAgIH1cclxuICAgIHJldHVybiBkZWxldGVUb2tlbkludGVybmFsKG1lc3NhZ2luZyk7XHJcbn1cblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDIwIEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuZnVuY3Rpb24gb25NZXNzYWdlJDEobWVzc2FnaW5nLCBuZXh0T3JPYnNlcnZlcikge1xyXG4gICAgaWYgKCFuYXZpZ2F0b3IpIHtcclxuICAgICAgICB0aHJvdyBFUlJPUl9GQUNUT1JZLmNyZWF0ZShcIm9ubHktYXZhaWxhYmxlLWluLXdpbmRvd1wiIC8qIEVycm9yQ29kZS5BVkFJTEFCTEVfSU5fV0lORE9XICovKTtcclxuICAgIH1cclxuICAgIG1lc3NhZ2luZy5vbk1lc3NhZ2VIYW5kbGVyID0gbmV4dE9yT2JzZXJ2ZXI7XHJcbiAgICByZXR1cm4gKCkgPT4ge1xyXG4gICAgICAgIG1lc3NhZ2luZy5vbk1lc3NhZ2VIYW5kbGVyID0gbnVsbDtcclxuICAgIH07XHJcbn1cblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDE3IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuLyoqXHJcbiAqIFJldHJpZXZlcyBhIEZpcmViYXNlIENsb3VkIE1lc3NhZ2luZyBpbnN0YW5jZS5cclxuICpcclxuICogQHJldHVybnMgVGhlIEZpcmViYXNlIENsb3VkIE1lc3NhZ2luZyBpbnN0YW5jZSBhc3NvY2lhdGVkIHdpdGggdGhlIHByb3ZpZGVkIGZpcmViYXNlIGFwcC5cclxuICpcclxuICogQHB1YmxpY1xyXG4gKi9cclxuZnVuY3Rpb24gZ2V0TWVzc2FnaW5nSW5XaW5kb3coYXBwID0gZ2V0QXBwKCkpIHtcclxuICAgIC8vIENvbnNjaW91cyBkZWNpc2lvbiB0byBtYWtlIHRoaXMgYXN5bmMgY2hlY2sgbm9uLWJsb2NraW5nIGR1cmluZyB0aGUgbWVzc2FnaW5nIGluc3RhbmNlXHJcbiAgICAvLyBpbml0aWFsaXphdGlvbiBwaGFzZSBmb3IgcGVyZm9ybWFuY2UgY29uc2lkZXJhdGlvbi4gQW4gZXJyb3Igd291bGQgYmUgdGhyb3duIGxhdHRlciBmb3JcclxuICAgIC8vIGRldmVsb3BlcidzIGluZm9ybWF0aW9uLiBEZXZlbG9wZXJzIGNhbiB0aGVuIGNob29zZSB0byBpbXBvcnQgYW5kIGNhbGwgYGlzU3VwcG9ydGVkYCBmb3JcclxuICAgIC8vIHNwZWNpYWwgaGFuZGxpbmcuXHJcbiAgICBpc1dpbmRvd1N1cHBvcnRlZCgpLnRoZW4oaXNTdXBwb3J0ZWQgPT4ge1xyXG4gICAgICAgIC8vIElmIGBpc1dpbmRvd1N1cHBvcnRlZCgpYCByZXNvbHZlZCwgYnV0IHJldHVybmVkIGZhbHNlLlxyXG4gICAgICAgIGlmICghaXNTdXBwb3J0ZWQpIHtcclxuICAgICAgICAgICAgdGhyb3cgRVJST1JfRkFDVE9SWS5jcmVhdGUoXCJ1bnN1cHBvcnRlZC1icm93c2VyXCIgLyogRXJyb3JDb2RlLlVOU1VQUE9SVEVEX0JST1dTRVIgKi8pO1xyXG4gICAgICAgIH1cclxuICAgIH0sIF8gPT4ge1xyXG4gICAgICAgIC8vIElmIGBpc1dpbmRvd1N1cHBvcnRlZCgpYCByZWplY3RlZC5cclxuICAgICAgICB0aHJvdyBFUlJPUl9GQUNUT1JZLmNyZWF0ZShcImluZGV4ZWQtZGItdW5zdXBwb3J0ZWRcIiAvKiBFcnJvckNvZGUuSU5ERVhFRF9EQl9VTlNVUFBPUlRFRCAqLyk7XHJcbiAgICB9KTtcclxuICAgIHJldHVybiBfZ2V0UHJvdmlkZXIoZ2V0TW9kdWxhckluc3RhbmNlKGFwcCksICdtZXNzYWdpbmcnKS5nZXRJbW1lZGlhdGUoKTtcclxufVxyXG4vKipcclxuICogU3Vic2NyaWJlcyB0aGUge0BsaW5rIE1lc3NhZ2luZ30gaW5zdGFuY2UgdG8gcHVzaCBub3RpZmljYXRpb25zLiBSZXR1cm5zIGEgRmlyZWJhc2UgQ2xvdWRcclxuICogTWVzc2FnaW5nIHJlZ2lzdHJhdGlvbiB0b2tlbiB0aGF0IGNhbiBiZSB1c2VkIHRvIHNlbmQgcHVzaCBtZXNzYWdlcyB0byB0aGF0IHtAbGluayBNZXNzYWdpbmd9XHJcbiAqIGluc3RhbmNlLlxyXG4gKlxyXG4gKiBJZiBub3RpZmljYXRpb24gcGVybWlzc2lvbiBpc24ndCBhbHJlYWR5IGdyYW50ZWQsIHRoaXMgbWV0aG9kIGFza3MgdGhlIHVzZXIgZm9yIHBlcm1pc3Npb24uIFRoZVxyXG4gKiByZXR1cm5lZCBwcm9taXNlIHJlamVjdHMgaWYgdGhlIHVzZXIgZG9lcyBub3QgYWxsb3cgdGhlIGFwcCB0byBzaG93IG5vdGlmaWNhdGlvbnMuXHJcbiAqXHJcbiAqIEBwYXJhbSBtZXNzYWdpbmcgLSBUaGUge0BsaW5rIE1lc3NhZ2luZ30gaW5zdGFuY2UuXHJcbiAqIEBwYXJhbSBvcHRpb25zIC0gUHJvdmlkZXMgYW4gb3B0aW9uYWwgdmFwaWQga2V5IGFuZCBhbiBvcHRpb25hbCBzZXJ2aWNlIHdvcmtlciByZWdpc3RyYXRpb24uXHJcbiAqXHJcbiAqIEByZXR1cm5zIFRoZSBwcm9taXNlIHJlc29sdmVzIHdpdGggYW4gRkNNIHJlZ2lzdHJhdGlvbiB0b2tlbi5cclxuICpcclxuICogQHB1YmxpY1xyXG4gKi9cclxuYXN5bmMgZnVuY3Rpb24gZ2V0VG9rZW4obWVzc2FnaW5nLCBvcHRpb25zKSB7XHJcbiAgICBtZXNzYWdpbmcgPSBnZXRNb2R1bGFySW5zdGFuY2UobWVzc2FnaW5nKTtcclxuICAgIHJldHVybiBnZXRUb2tlbiQxKG1lc3NhZ2luZywgb3B0aW9ucyk7XHJcbn1cclxuLyoqXHJcbiAqIERlbGV0ZXMgdGhlIHJlZ2lzdHJhdGlvbiB0b2tlbiBhc3NvY2lhdGVkIHdpdGggdGhpcyB7QGxpbmsgTWVzc2FnaW5nfSBpbnN0YW5jZSBhbmQgdW5zdWJzY3JpYmVzXHJcbiAqIHRoZSB7QGxpbmsgTWVzc2FnaW5nfSBpbnN0YW5jZSBmcm9tIHRoZSBwdXNoIHN1YnNjcmlwdGlvbi5cclxuICpcclxuICogQHBhcmFtIG1lc3NhZ2luZyAtIFRoZSB7QGxpbmsgTWVzc2FnaW5nfSBpbnN0YW5jZS5cclxuICpcclxuICogQHJldHVybnMgVGhlIHByb21pc2UgcmVzb2x2ZXMgd2hlbiB0aGUgdG9rZW4gaGFzIGJlZW4gc3VjY2Vzc2Z1bGx5IGRlbGV0ZWQuXHJcbiAqXHJcbiAqIEBwdWJsaWNcclxuICovXHJcbmZ1bmN0aW9uIGRlbGV0ZVRva2VuKG1lc3NhZ2luZykge1xyXG4gICAgbWVzc2FnaW5nID0gZ2V0TW9kdWxhckluc3RhbmNlKG1lc3NhZ2luZyk7XHJcbiAgICByZXR1cm4gZGVsZXRlVG9rZW4kMShtZXNzYWdpbmcpO1xyXG59XHJcbi8qKlxyXG4gKiBXaGVuIGEgcHVzaCBtZXNzYWdlIGlzIHJlY2VpdmVkIGFuZCB0aGUgdXNlciBpcyBjdXJyZW50bHkgb24gYSBwYWdlIGZvciB5b3VyIG9yaWdpbiwgdGhlXHJcbiAqIG1lc3NhZ2UgaXMgcGFzc2VkIHRvIHRoZSBwYWdlIGFuZCBhbiBgb25NZXNzYWdlKClgIGV2ZW50IGlzIGRpc3BhdGNoZWQgd2l0aCB0aGUgcGF5bG9hZCBvZlxyXG4gKiB0aGUgcHVzaCBtZXNzYWdlLlxyXG4gKlxyXG4gKlxyXG4gKiBAcGFyYW0gbWVzc2FnaW5nIC0gVGhlIHtAbGluayBNZXNzYWdpbmd9IGluc3RhbmNlLlxyXG4gKiBAcGFyYW0gbmV4dE9yT2JzZXJ2ZXIgLSBUaGlzIGZ1bmN0aW9uLCBvciBvYnNlcnZlciBvYmplY3Qgd2l0aCBgbmV4dGAgZGVmaW5lZCxcclxuICogICAgIGlzIGNhbGxlZCB3aGVuIGEgbWVzc2FnZSBpcyByZWNlaXZlZCBhbmQgdGhlIHVzZXIgaXMgY3VycmVudGx5IHZpZXdpbmcgeW91ciBwYWdlLlxyXG4gKiBAcmV0dXJucyBUbyBzdG9wIGxpc3RlbmluZyBmb3IgbWVzc2FnZXMgZXhlY3V0ZSB0aGlzIHJldHVybmVkIGZ1bmN0aW9uLlxyXG4gKlxyXG4gKiBAcHVibGljXHJcbiAqL1xyXG5mdW5jdGlvbiBvbk1lc3NhZ2UobWVzc2FnaW5nLCBuZXh0T3JPYnNlcnZlcikge1xyXG4gICAgbWVzc2FnaW5nID0gZ2V0TW9kdWxhckluc3RhbmNlKG1lc3NhZ2luZyk7XHJcbiAgICByZXR1cm4gb25NZXNzYWdlJDEobWVzc2FnaW5nLCBuZXh0T3JPYnNlcnZlcik7XHJcbn1cblxuLyoqXHJcbiAqIFRoZSBGaXJlYmFzZSBDbG91ZCBNZXNzYWdpbmcgV2ViIFNESy5cclxuICogVGhpcyBTREsgZG9lcyBub3Qgd29yayBpbiBhIE5vZGUuanMgZW52aXJvbm1lbnQuXHJcbiAqXHJcbiAqIEBwYWNrYWdlRG9jdW1lbnRhdGlvblxyXG4gKi9cclxucmVnaXN0ZXJNZXNzYWdpbmdJbldpbmRvdygpO1xuXG5leHBvcnQgeyBkZWxldGVUb2tlbiwgZ2V0TWVzc2FnaW5nSW5XaW5kb3cgYXMgZ2V0TWVzc2FnaW5nLCBnZXRUb2tlbiwgaXNXaW5kb3dTdXBwb3J0ZWQgYXMgaXNTdXBwb3J0ZWQsIG9uTWVzc2FnZSB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguZXNtMjAxNy5qcy5tYXBcbiIsCiAgICAiaW1wb3J0IHsgaW5pdGlhbGl6ZUFwcCB9IGZyb20gXCJmaXJlYmFzZS9hcHBcIjtcbmltcG9ydCB0eXBlIHsgRmlyZWJhc2VBcHAgfSBmcm9tIFwiQGZpcmViYXNlL2FwcFwiO1xuaW1wb3J0IHsgZ2V0TWVzc2FnaW5nIH0gZnJvbSBcImZpcmViYXNlL21lc3NhZ2luZ1wiO1xuaW1wb3J0IHR5cGUgeyBNZXNzYWdpbmcgfSBmcm9tIFwiQGZpcmViYXNlL21lc3NhZ2luZ1wiO1xuXG5sZXQgYXBwOiBGaXJlYmFzZUFwcCB8IG51bGwgPSBudWxsO1xubGV0IG1lc3NhZ2luZzogTWVzc2FnaW5nIHwgbnVsbCA9IG51bGw7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRGaXJlYmFzZUNvbmZpZygpIHtcbiAgcmV0dXJuIHtcbiAgICBhcGlLZXk6IHByb2Nlc3MuZW52LkZJUkVCQVNFX0FQSV9LRVksXG4gICAgYXV0aERvbWFpbjogcHJvY2Vzcy5lbnYuRklSRUJBU0VfQVVUSF9ET01BSU4sXG4gICAgcHJvamVjdElkOiBwcm9jZXNzLmVudi5GSVJFQkFTRV9QUk9KRUNUX0lELFxuICAgIHN0b3JhZ2VCdWNrZXQ6IHByb2Nlc3MuZW52LkZJUkVCQVNFX1NUT1JBR0VfQlVDS0VULFxuICAgIG1lc3NhZ2luZ1NlbmRlcklkOiBwcm9jZXNzLmVudi5GSVJFQkFTRV9NRVNTQUdJTkdfU0VOREVSX0lELFxuICAgIGFwcElkOiBwcm9jZXNzLmVudi5GSVJFQkFTRV9BUFBfSUQsXG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRGaXJlYmFzZUFwcCgpOiBGaXJlYmFzZUFwcCB7XG4gIGlmICghYXBwKSB7XG4gICAgYXBwID0gaW5pdGlhbGl6ZUFwcChnZXRGaXJlYmFzZUNvbmZpZygpKTtcbiAgfVxuICByZXR1cm4gYXBwO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0QXBwTWVzc2FnaW5nKGFwcDogRmlyZWJhc2VBcHApIHtcbiAgaWYgKCFtZXNzYWdpbmcpIHtcbiAgICBtZXNzYWdpbmcgPSBnZXRNZXNzYWdpbmcoYXBwKTtcbiAgfVxuICByZXR1cm4gbWVzc2FnaW5nO1xufVxuIiwKICAgICJpbXBvcnQgeyBnZXRNZXNzYWdpbmcsIG9uQmFja2dyb3VuZE1lc3NhZ2UgfSBmcm9tIFwiZmlyZWJhc2UvbWVzc2FnaW5nL3N3XCI7XG5pbXBvcnQgeyBnZXRGaXJlYmFzZUFwcCB9IGZyb20gXCIuL2ZpcmViYXNlLnRzXCI7XG5cbmRlY2xhcmUgdmFyIHNlbGY6IFNlcnZpY2VXb3JrZXJHbG9iYWxTY29wZTtcbmRlY2xhcmUgdmFyIGNsaWVudHM6IENsaWVudHM7XG5cbmNvbnN0IGZpcmViYXNlQXBwID0gZ2V0RmlyZWJhc2VBcHAoKTtcbmNvbnN0IG1lc3NhZ2luZyA9IGdldE1lc3NhZ2luZyhmaXJlYmFzZUFwcCk7XG5cbm9uQmFja2dyb3VuZE1lc3NhZ2UobWVzc2FnaW5nLCAocGF5bG9hZCkgPT4ge1xuICBjb25zb2xlLmxvZyhcbiAgICBcIltmaXJlYmFzZS1tZXNzYWdpbmctc3cuanNdIFJlY2VpdmVkIGJhY2tncm91bmQgbWVzc2FnZSBcIixcbiAgICBwYXlsb2FkLFxuICApO1xuXG4gIGlmICghcGF5bG9hZCB8fCAhcGF5bG9hZC5kYXRhKSB7XG4gICAgY29uc29sZS5sb2coXCJObyBwYXlsb2FkIHJlY2VpdmVkLlwiKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCBub3RpZmljYXRpb25UaXRsZSA9IHBheWxvYWQuZGF0YS50aXRsZTtcbiAgY29uc3Qgbm90aWZpY2F0aW9uT3B0aW9uczogTm90aWZpY2F0aW9uT3B0aW9ucyA9IHtcbiAgICBib2R5OiBwYXlsb2FkLmRhdGEuYm9keSxcbiAgICBpY29uOiBwYXlsb2FkLmRhdGEuaWNvbixcbiAgICBkYXRhOiB7IHVybDogcGF5bG9hZC5kYXRhLmRlc3RpbmF0aW9uVXJsIH0sIC8vIFN0b3JlIFVSTCBpbiBub3RpZmljYXRpb24gZGF0YVxuICB9O1xuXG4gIHNlbGYucmVnaXN0cmF0aW9uXG4gICAgLnNob3dOb3RpZmljYXRpb24obm90aWZpY2F0aW9uVGl0bGUsIG5vdGlmaWNhdGlvbk9wdGlvbnMpXG4gICAgLnRoZW4oKCkgPT4gY29uc29sZS5sb2coXCJOb3RpZmljYXRpb24gc2hvd24uXCIpKVxuICAgIC5jYXRjaCgoZXJyb3IpID0+IGNvbnNvbGUuZXJyb3IoXCJFcnJvciBzaG93aW5nIG5vdGlmaWNhdGlvbjpcIiwgZXJyb3IpKTtcbn0pO1xuXG5zZWxmLmFkZEV2ZW50TGlzdGVuZXIoXCJub3RpZmljYXRpb25jbGlja1wiLCAoZXZlbnQ6IE5vdGlmaWNhdGlvbkV2ZW50KSA9PiB7XG4gIGNvbnNvbGUubG9nKFwiW1NlcnZpY2UgV29ya2VyXSBOb3RpZmljYXRpb24gY2xpY2sgUmVjZWl2ZWQuXCIpO1xuXG4gIGV2ZW50Lm5vdGlmaWNhdGlvbi5jbG9zZSgpO1xuXG4gIGNvbnN0IHVybCA9IGV2ZW50Lm5vdGlmaWNhdGlvbi5kYXRhPy51cmw7XG4gIGlmICghdXJsKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgZXZlbnQud2FpdFVudGlsKFxuICAgIGNsaWVudHNcbiAgICAgIC5tYXRjaEFsbCh7IHR5cGU6IFwid2luZG93XCIsIGluY2x1ZGVVbmNvbnRyb2xsZWQ6IHRydWUgfSlcbiAgICAgIC50aGVuKCh3aW5kb3dDbGllbnRzKSA9PiB7XG4gICAgICAgIC8vIENoZWNrIGlmIHRoZXJlIGlzIGFscmVhZHkgYSB3aW5kb3cvdGFiIG9wZW4gd2l0aCB0aGUgdGFyZ2V0IFVSTFxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHdpbmRvd0NsaWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICB2YXIgY2xpZW50ID0gd2luZG93Q2xpZW50c1tpXTtcbiAgICAgICAgICBpZiAoY2xpZW50LnVybCA9PT0gdXJsICYmIFwiZm9jdXNcIiBpbiBjbGllbnQpIHtcbiAgICAgICAgICAgIHJldHVybiBjbGllbnQuZm9jdXMoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gSWYgbm8gd2luZG93L3RhYiBpcyBhbHJlYWR5IG9wZW4sIG9wZW4gYSBuZXcgb25lXG4gICAgICAgIGlmIChjbGllbnRzLm9wZW5XaW5kb3cpIHtcbiAgICAgICAgICByZXR1cm4gY2xpZW50cy5vcGVuV2luZG93KHVybCk7XG4gICAgICAgIH1cbiAgICAgIH0pLFxuICApO1xufSk7XG4iCiAgXSwKICAibWFwcGluZ3MiOiAiO0FBK2RBLFNBQVMsU0FBUyxHQUFHO0FBQ2pCLGFBQVcsU0FBUyxhQUFhO0FBQzdCLFdBQU87QUFBQSxFQUNYO0FBQ0EsYUFBVyxXQUFXLGFBQWE7QUFDL0IsV0FBTztBQUFBLEVBQ1g7QUFDQSxhQUFXLFdBQVcsYUFBYTtBQUMvQixXQUFPO0FBQUEsRUFDWDtBQUNBLFFBQU0sSUFBSSxNQUFNLGlDQUFpQztBQUFBO0FBNlZyRCxTQUFTLG9CQUFvQixHQUFHO0FBQzVCLE1BQUk7QUFDQSxrQkFBYyxjQUFjO0FBQUEsV0FFekIsR0FBUDtB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
