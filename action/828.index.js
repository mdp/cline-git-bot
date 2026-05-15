export const id = 828;
export const ids = [828];
export const modules = {

/***/ 99828:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  LangfuseSpanProcessor: () => (/* binding */ LangfuseSpanProcessor)
});

// EXTERNAL MODULE: ./node_modules/.pnpm/@opentelemetry+api@1.9.1/node_modules/@opentelemetry/api/build/src/index.js
var src = __webpack_require__(47910);
;// CONCATENATED MODULE: ./node_modules/.pnpm/@langfuse+core@4.6.1_@opentelemetry+api@1.9.1/node_modules/@langfuse/core/dist/index.mjs
var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/utils.ts
function getEnv(key) {
  if (typeof process !== "undefined" && process.env[key]) {
    return process.env[key];
  } else if (typeof globalThis !== "undefined") {
    return globalThis[key];
  }
  return;
}
function generateUUID(globalThis2) {
  let d = (/* @__PURE__ */ new Date()).getTime();
  let d2 = globalThis2 && globalThis2.performance && globalThis2.performance.now && globalThis2.performance.now() * 1e3 || 0;
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    let r = Math.random() * 16;
    if (d > 0) {
      r = (d + r) % 16 | 0;
      d = Math.floor(d / 16);
    } else {
      r = (d2 + r) % 16 | 0;
      d2 = Math.floor(d2 / 16);
    }
    return (c === "x" ? r : r & 3 | 8).toString(16);
  });
}
function safeSetTimeout(fn, timeout) {
  const t = setTimeout(fn, timeout);
  if (t == null ? void 0 : t.unref) {
    t == null ? void 0 : t.unref();
  }
  return t;
}
function base64ToBytes(base64) {
  const binString = atob(base64);
  return Uint8Array.from(binString, (m) => m.codePointAt(0));
}
function bytesToBase64(bytes) {
  const binString = Array.from(bytes, (byte) => String.fromCharCode(byte)).join(
    ""
  );
  return btoa(binString);
}
function base64Encode(input) {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(input, "utf8").toString("base64");
  }
  const bytes = new TextEncoder().encode(input);
  return bytesToBase64(bytes);
}
function base64Decode(input) {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(input, "base64").toString("utf8");
  }
  const bytes = base64ToBytes(input);
  return new TextDecoder().decode(bytes);
}
async function createExperimentId() {
  const randomBytes = new Uint8Array(8);
  crypto.getRandomValues(randomBytes);
  return Array.from(randomBytes).map((b) => b.toString(16).padStart(2, "0")).join("");
}
async function createExperimentItemId(input) {
  const serialized = serializeValue(input);
  const data = new TextEncoder().encode(serialized);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return hashHex.slice(0, 16);
}
function serializeValue(value) {
  if (value === void 0 || value === null) return void 0;
  if (typeof value === "string") return value;
  return JSON.stringify(value);
}

// src/logger/index.ts
var LogLevel = /* @__PURE__ */ ((LogLevel2) => {
  LogLevel2[LogLevel2["ERROR"] = 3] = "ERROR";
  LogLevel2[LogLevel2["WARN"] = 2] = "WARN";
  LogLevel2[LogLevel2["INFO"] = 1] = "INFO";
  LogLevel2[LogLevel2["DEBUG"] = 0] = "DEBUG";
  return LogLevel2;
})(LogLevel || {});
function parseLogLevelFromEnv() {
  if (typeof process === "object" && "env" in process) {
    const envValue = getEnv("LANGFUSE_LOG_LEVEL");
    const value = (envValue != null ? envValue : "").toUpperCase();
    switch (value) {
      case "ERROR":
        return 3 /* ERROR */;
      case "WARN":
        return 2 /* WARN */;
      case "INFO":
        return 1 /* INFO */;
      case "DEBUG":
        return 0 /* DEBUG */;
      default:
        return void 0;
    }
  }
  return void 0;
}
var Logger = class {
  /**
   * Creates a new Logger instance.
   *
   * @param config - Configuration options for the logger
   */
  constructor(config = { level: 1 /* INFO */ }) {
    this.config = {
      enableTimestamp: true,
      ...config
    };
  }
  /**
   * Determines if a message should be logged based on the current log level.
   *
   * @param level - The log level to check
   * @returns True if the message should be logged, false otherwise
   */
  shouldLog(level) {
    return level >= this.config.level;
  }
  /**
   * Formats a log message with timestamp, prefix, and log level.
   *
   * @param level - The log level string
   * @param message - The message to format
   * @returns The formatted message string
   */
  formatMessage(level, message) {
    const timestamp = this.config.enableTimestamp ? (/* @__PURE__ */ new Date()).toISOString() : "";
    const prefix = this.config.prefix || "[Langfuse SDK]";
    const parts = [timestamp, prefix, `[${level}]`, message].filter(Boolean);
    return parts.join(" ");
  }
  /**
   * Logs an error message.
   *
   * @param message - The error message to log
   * @param args - Additional arguments to pass to console.error
   */
  error(message, ...args) {
    if (this.shouldLog(3 /* ERROR */)) {
      console.error(this.formatMessage("ERROR", message), ...args);
    }
  }
  /**
   * Logs a warning message.
   *
   * @param message - The warning message to log
   * @param args - Additional arguments to pass to console.warn
   */
  warn(message, ...args) {
    if (this.shouldLog(2 /* WARN */)) {
      console.warn(this.formatMessage("WARN", message), ...args);
    }
  }
  /**
   * Logs an informational message.
   *
   * @param message - The info message to log
   * @param args - Additional arguments to pass to console.info
   */
  info(message, ...args) {
    if (this.shouldLog(1 /* INFO */)) {
      console.info(this.formatMessage("INFO", message), ...args);
    }
  }
  /**
   * Logs a debug message.
   *
   * @param message - The debug message to log
   * @param args - Additional arguments to pass to console.debug
   */
  debug(message, ...args) {
    if (this.shouldLog(0 /* DEBUG */)) {
      console.debug(this.formatMessage("DEBUG", message), ...args);
    }
  }
  /**
   * Sets the minimum log level.
   *
   * @param level - The new log level
   */
  setLevel(level) {
    this.config.level = level;
  }
  /**
   * Gets the current log level.
   *
   * @returns The current log level
   */
  getLevel() {
    return this.config.level;
  }
  /**
   * Checks if a given log level is enabled.
   * Use this to guard expensive operations (like JSON.stringify) before debug logging.
   *
   * @param level - The log level to check
   * @returns True if the level is enabled, false otherwise
   *
   * @example
   * ```typescript
   * if (logger.isLevelEnabled(LogLevel.DEBUG)) {
   *   logger.debug('Expensive data:', JSON.stringify(largeObject));
   * }
   * ```
   */
  isLevelEnabled(level) {
    return this.shouldLog(level);
  }
};
var _a;
var _LoggerSingleton = class _LoggerSingleton {
  /**
   * Gets the singleton logger instance, creating it if it doesn't exist.
   *
   * @returns The singleton logger instance
   */
  static getInstance() {
    if (!_LoggerSingleton.instance) {
      _LoggerSingleton.instance = new Logger(_LoggerSingleton.defaultConfig);
    }
    return _LoggerSingleton.instance;
  }
  /**
   * Configures the global logger with new settings.
   * This will replace the existing logger instance.
   *
   * @param config - The new logger configuration
   */
  static configure(config) {
    _LoggerSingleton.defaultConfig = config;
    _LoggerSingleton.instance = new Logger(config);
  }
  /**
   * Resets the singleton logger instance and configuration.
   * Useful for testing or reinitializing the logger.
   */
  static reset() {
    _LoggerSingleton.instance = null;
    _LoggerSingleton.defaultConfig = { level: 1 /* INFO */ };
  }
};
_LoggerSingleton.instance = null;
_LoggerSingleton.defaultConfig = {
  level: (_a = parseLogLevelFromEnv()) != null ? _a : 1 /* INFO */
};
var LoggerSingleton = _LoggerSingleton;
var createLogger = (config) => {
  return new Logger(config);
};
var getGlobalLogger = () => {
  return LoggerSingleton.getInstance();
};
var configureGlobalLogger = (config) => {
  LoggerSingleton.configure(config);
};
var resetGlobalLogger = () => {
  LoggerSingleton.reset();
};

// package.json
var package_default = {
  name: "@langfuse/core",
  version: "4.6.0",
  description: "Core functions and utilities for Langfuse packages",
  type: "module",
  sideEffects: false,
  main: "./dist/index.cjs",
  module: "./dist/index.mjs",
  types: "./dist/index.d.ts",
  exports: {
    ".": {
      types: "./dist/index.d.ts",
      import: "./dist/index.mjs",
      require: "./dist/index.cjs"
    }
  },
  scripts: {
    build: "tsup",
    test: "vitest run",
    "test:watch": "vitest",
    format: 'prettier --write "src/**/*.ts"',
    "format:check": 'prettier --check "src/**/*.ts"',
    clean: "rm -rf dist"
  },
  author: "Langfuse",
  license: "MIT",
  repository: {
    type: "git",
    url: "https://github.com/langfuse/langfuse-js.git",
    directory: "packages/core"
  },
  files: [
    "dist"
  ],
  peerDependencies: {
    "@opentelemetry/api": "^1.9.0"
  },
  devDependencies: {
    "@types/node": "^24.1.0"
  }
};

// src/constants.ts
var LANGFUSE_TRACER_NAME = "langfuse-sdk";
var LANGFUSE_SDK_VERSION = package_default.version;
var LANGFUSE_SDK_NAME = "javascript";
var LANGFUSE_SDK_EXPERIMENT_ENVIRONMENT = "sdk-experiment";
var LangfuseOtelSpanAttributes = /* @__PURE__ */ ((LangfuseOtelSpanAttributes2) => {
  LangfuseOtelSpanAttributes2["TRACE_NAME"] = "langfuse.trace.name";
  LangfuseOtelSpanAttributes2["TRACE_USER_ID"] = "user.id";
  LangfuseOtelSpanAttributes2["TRACE_SESSION_ID"] = "session.id";
  LangfuseOtelSpanAttributes2["TRACE_TAGS"] = "langfuse.trace.tags";
  LangfuseOtelSpanAttributes2["TRACE_PUBLIC"] = "langfuse.trace.public";
  LangfuseOtelSpanAttributes2["TRACE_METADATA"] = "langfuse.trace.metadata";
  LangfuseOtelSpanAttributes2["TRACE_INPUT"] = "langfuse.trace.input";
  LangfuseOtelSpanAttributes2["TRACE_OUTPUT"] = "langfuse.trace.output";
  LangfuseOtelSpanAttributes2["OBSERVATION_TYPE"] = "langfuse.observation.type";
  LangfuseOtelSpanAttributes2["OBSERVATION_METADATA"] = "langfuse.observation.metadata";
  LangfuseOtelSpanAttributes2["OBSERVATION_LEVEL"] = "langfuse.observation.level";
  LangfuseOtelSpanAttributes2["OBSERVATION_STATUS_MESSAGE"] = "langfuse.observation.status_message";
  LangfuseOtelSpanAttributes2["OBSERVATION_INPUT"] = "langfuse.observation.input";
  LangfuseOtelSpanAttributes2["OBSERVATION_OUTPUT"] = "langfuse.observation.output";
  LangfuseOtelSpanAttributes2["OBSERVATION_COMPLETION_START_TIME"] = "langfuse.observation.completion_start_time";
  LangfuseOtelSpanAttributes2["OBSERVATION_MODEL"] = "langfuse.observation.model.name";
  LangfuseOtelSpanAttributes2["OBSERVATION_MODEL_PARAMETERS"] = "langfuse.observation.model.parameters";
  LangfuseOtelSpanAttributes2["OBSERVATION_USAGE_DETAILS"] = "langfuse.observation.usage_details";
  LangfuseOtelSpanAttributes2["OBSERVATION_COST_DETAILS"] = "langfuse.observation.cost_details";
  LangfuseOtelSpanAttributes2["OBSERVATION_PROMPT_NAME"] = "langfuse.observation.prompt.name";
  LangfuseOtelSpanAttributes2["OBSERVATION_PROMPT_VERSION"] = "langfuse.observation.prompt.version";
  LangfuseOtelSpanAttributes2["ENVIRONMENT"] = "langfuse.environment";
  LangfuseOtelSpanAttributes2["RELEASE"] = "langfuse.release";
  LangfuseOtelSpanAttributes2["VERSION"] = "langfuse.version";
  LangfuseOtelSpanAttributes2["AS_ROOT"] = "langfuse.internal.as_root";
  LangfuseOtelSpanAttributes2["EXPERIMENT_ID"] = "langfuse.experiment.id";
  LangfuseOtelSpanAttributes2["EXPERIMENT_NAME"] = "langfuse.experiment.name";
  LangfuseOtelSpanAttributes2["EXPERIMENT_DESCRIPTION"] = "langfuse.experiment.description";
  LangfuseOtelSpanAttributes2["EXPERIMENT_METADATA"] = "langfuse.experiment.metadata";
  LangfuseOtelSpanAttributes2["EXPERIMENT_DATASET_ID"] = "langfuse.experiment.dataset.id";
  LangfuseOtelSpanAttributes2["EXPERIMENT_ITEM_ID"] = "langfuse.experiment.item.id";
  LangfuseOtelSpanAttributes2["EXPERIMENT_ITEM_EXPECTED_OUTPUT"] = "langfuse.experiment.item.expected_output";
  LangfuseOtelSpanAttributes2["EXPERIMENT_ITEM_METADATA"] = "langfuse.experiment.item.metadata";
  LangfuseOtelSpanAttributes2["EXPERIMENT_ITEM_ROOT_OBSERVATION_ID"] = "langfuse.experiment.item.root_observation_id";
  LangfuseOtelSpanAttributes2["TRACE_COMPAT_USER_ID"] = "langfuse.user.id";
  LangfuseOtelSpanAttributes2["TRACE_COMPAT_SESSION_ID"] = "langfuse.session.id";
  return LangfuseOtelSpanAttributes2;
})(LangfuseOtelSpanAttributes || {});

// src/api/api/resources/annotationQueues/index.ts
var annotationQueues_exports = {};
__export(annotationQueues_exports, {
  AnnotationQueueObjectType: () => AnnotationQueueObjectType,
  AnnotationQueueStatus: () => AnnotationQueueStatus
});

// src/api/api/resources/annotationQueues/types/AnnotationQueueStatus.ts
var AnnotationQueueStatus = {
  Pending: "PENDING",
  Completed: "COMPLETED"
};

// src/api/api/resources/annotationQueues/types/AnnotationQueueObjectType.ts
var AnnotationQueueObjectType = {
  Trace: "TRACE",
  Observation: "OBSERVATION",
  Session: "SESSION"
};

// src/api/api/resources/blobStorageIntegrations/index.ts
var blobStorageIntegrations_exports = {};
__export(blobStorageIntegrations_exports, {
  BlobStorageExportFrequency: () => BlobStorageExportFrequency,
  BlobStorageExportMode: () => BlobStorageExportMode,
  BlobStorageIntegrationFileType: () => BlobStorageIntegrationFileType,
  BlobStorageIntegrationType: () => BlobStorageIntegrationType
});

// src/api/api/resources/blobStorageIntegrations/types/BlobStorageIntegrationType.ts
var BlobStorageIntegrationType = {
  S3: "S3",
  S3Compatible: "S3_COMPATIBLE",
  AzureBlobStorage: "AZURE_BLOB_STORAGE"
};

// src/api/api/resources/blobStorageIntegrations/types/BlobStorageIntegrationFileType.ts
var BlobStorageIntegrationFileType = {
  Json: "JSON",
  Csv: "CSV",
  Jsonl: "JSONL"
};

// src/api/api/resources/blobStorageIntegrations/types/BlobStorageExportMode.ts
var BlobStorageExportMode = {
  FullHistory: "FULL_HISTORY",
  FromToday: "FROM_TODAY",
  FromCustomDate: "FROM_CUSTOM_DATE"
};

// src/api/api/resources/blobStorageIntegrations/types/BlobStorageExportFrequency.ts
var BlobStorageExportFrequency = {
  Hourly: "hourly",
  Daily: "daily",
  Weekly: "weekly"
};

// src/api/api/resources/comments/index.ts
var comments_exports = {};

// src/api/api/resources/commons/index.ts
var commons_exports = {};
__export(commons_exports, {
  AccessDeniedError: () => AccessDeniedError,
  CommentObjectType: () => CommentObjectType,
  DatasetStatus: () => DatasetStatus,
  Error: () => Error2,
  MethodNotAllowedError: () => MethodNotAllowedError,
  ModelUsageUnit: () => ModelUsageUnit,
  NotFoundError: () => NotFoundError,
  ObservationLevel: () => ObservationLevel,
  PricingTierOperator: () => PricingTierOperator,
  ScoreConfigDataType: () => ScoreConfigDataType,
  ScoreDataType: () => ScoreDataType,
  ScoreSource: () => ScoreSource,
  UnauthorizedError: () => UnauthorizedError
});

// src/api/api/resources/commons/types/PricingTierOperator.ts
var PricingTierOperator = {
  Gt: "gt",
  Gte: "gte",
  Lt: "lt",
  Lte: "lte",
  Eq: "eq",
  Neq: "neq"
};

// src/api/api/resources/commons/types/ModelUsageUnit.ts
var ModelUsageUnit = {
  Characters: "CHARACTERS",
  Tokens: "TOKENS",
  Milliseconds: "MILLISECONDS",
  Seconds: "SECONDS",
  Images: "IMAGES",
  Requests: "REQUESTS"
};

// src/api/api/resources/commons/types/ObservationLevel.ts
var ObservationLevel = {
  Debug: "DEBUG",
  Default: "DEFAULT",
  Warning: "WARNING",
  Error: "ERROR"
};

// src/api/api/resources/commons/types/CommentObjectType.ts
var CommentObjectType = {
  Trace: "TRACE",
  Observation: "OBSERVATION",
  Session: "SESSION",
  Prompt: "PROMPT"
};

// src/api/api/resources/commons/types/DatasetStatus.ts
var DatasetStatus = {
  Active: "ACTIVE",
  Archived: "ARCHIVED"
};

// src/api/api/resources/commons/types/ScoreSource.ts
var ScoreSource = {
  Annotation: "ANNOTATION",
  Api: "API",
  Eval: "EVAL"
};

// src/api/api/resources/commons/types/ScoreConfigDataType.ts
var ScoreConfigDataType = {
  Numeric: "NUMERIC",
  Boolean: "BOOLEAN",
  Categorical: "CATEGORICAL"
};

// src/api/api/resources/commons/types/ScoreDataType.ts
var ScoreDataType = {
  Numeric: "NUMERIC",
  Boolean: "BOOLEAN",
  Categorical: "CATEGORICAL",
  Correction: "CORRECTION"
};

// src/api/core/json.ts
var toJson = (value, replacer, space) => {
  return JSON.stringify(value, replacer, space);
};
function fromJson(text, reviver) {
  return JSON.parse(text, reviver);
}

// src/api/errors/LangfuseAPIError.ts
var LangfuseAPIError = class _LangfuseAPIError extends Error {
  constructor({
    message,
    statusCode,
    body,
    rawResponse
  }) {
    super(buildMessage({ message, statusCode, body }));
    Object.setPrototypeOf(this, _LangfuseAPIError.prototype);
    this.statusCode = statusCode;
    this.body = body;
    this.rawResponse = rawResponse;
  }
};
function buildMessage({
  message,
  statusCode,
  body
}) {
  let lines = [];
  if (message != null) {
    lines.push(message);
  }
  if (statusCode != null) {
    lines.push(`Status code: ${statusCode.toString()}`);
  }
  if (body != null) {
    lines.push(`Body: ${toJson(body, void 0, 2)}`);
  }
  return lines.join("\n");
}

// src/api/errors/LangfuseAPITimeoutError.ts
var LangfuseAPITimeoutError = class _LangfuseAPITimeoutError extends Error {
  constructor(message) {
    super(message);
    Object.setPrototypeOf(this, _LangfuseAPITimeoutError.prototype);
  }
};

// src/api/api/resources/commons/errors/Error.ts
var Error2 = class _Error extends LangfuseAPIError {
  constructor(body, rawResponse) {
    super({
      message: "Error",
      statusCode: 400,
      body,
      rawResponse
    });
    Object.setPrototypeOf(this, _Error.prototype);
  }
};

// src/api/api/resources/commons/errors/UnauthorizedError.ts
var UnauthorizedError = class _UnauthorizedError extends LangfuseAPIError {
  constructor(body, rawResponse) {
    super({
      message: "UnauthorizedError",
      statusCode: 401,
      body,
      rawResponse
    });
    Object.setPrototypeOf(this, _UnauthorizedError.prototype);
  }
};

// src/api/api/resources/commons/errors/AccessDeniedError.ts
var AccessDeniedError = class _AccessDeniedError extends LangfuseAPIError {
  constructor(body, rawResponse) {
    super({
      message: "AccessDeniedError",
      statusCode: 403,
      body,
      rawResponse
    });
    Object.setPrototypeOf(this, _AccessDeniedError.prototype);
  }
};

// src/api/api/resources/commons/errors/NotFoundError.ts
var NotFoundError = class _NotFoundError extends LangfuseAPIError {
  constructor(body, rawResponse) {
    super({
      message: "NotFoundError",
      statusCode: 404,
      body,
      rawResponse
    });
    Object.setPrototypeOf(this, _NotFoundError.prototype);
  }
};

// src/api/api/resources/commons/errors/MethodNotAllowedError.ts
var MethodNotAllowedError = class _MethodNotAllowedError extends LangfuseAPIError {
  constructor(body, rawResponse) {
    super({
      message: "MethodNotAllowedError",
      statusCode: 405,
      body,
      rawResponse
    });
    Object.setPrototypeOf(this, _MethodNotAllowedError.prototype);
  }
};

// src/api/api/resources/datasetItems/index.ts
var datasetItems_exports = {};

// src/api/api/resources/datasetRunItems/index.ts
var datasetRunItems_exports = {};

// src/api/api/resources/datasets/index.ts
var datasets_exports = {};

// src/api/api/resources/health/index.ts
var health_exports = {};
__export(health_exports, {
  ServiceUnavailableError: () => ServiceUnavailableError
});

// src/api/api/resources/health/errors/ServiceUnavailableError.ts
var ServiceUnavailableError = class _ServiceUnavailableError extends LangfuseAPIError {
  constructor(rawResponse) {
    super({
      message: "ServiceUnavailableError",
      statusCode: 503,
      rawResponse
    });
    Object.setPrototypeOf(this, _ServiceUnavailableError.prototype);
  }
};

// src/api/api/resources/ingestion/index.ts
var ingestion_exports = {};
__export(ingestion_exports, {
  ObservationType: () => ObservationType
});

// src/api/api/resources/ingestion/types/ObservationType.ts
var ObservationType = {
  Span: "SPAN",
  Generation: "GENERATION",
  Event: "EVENT",
  Agent: "AGENT",
  Tool: "TOOL",
  Chain: "CHAIN",
  Retriever: "RETRIEVER",
  Evaluator: "EVALUATOR",
  Embedding: "EMBEDDING",
  Guardrail: "GUARDRAIL"
};

// src/api/api/resources/llmConnections/index.ts
var llmConnections_exports = {};
__export(llmConnections_exports, {
  LlmAdapter: () => LlmAdapter
});

// src/api/api/resources/llmConnections/types/LlmAdapter.ts
var LlmAdapter = {
  Anthropic: "anthropic",
  OpenAi: "openai",
  Azure: "azure",
  Bedrock: "bedrock",
  GoogleVertexAi: "google-vertex-ai",
  GoogleAiStudio: "google-ai-studio"
};

// src/api/api/resources/media/index.ts
var media_exports = {};
__export(media_exports, {
  MediaContentType: () => MediaContentType
});

// src/api/api/resources/media/types/MediaContentType.ts
var MediaContentType = {
  ImagePng: "image/png",
  ImageJpeg: "image/jpeg",
  ImageJpg: "image/jpg",
  ImageWebp: "image/webp",
  ImageGif: "image/gif",
  ImageSvgXml: "image/svg+xml",
  ImageTiff: "image/tiff",
  ImageBmp: "image/bmp",
  ImageAvif: "image/avif",
  ImageHeic: "image/heic",
  AudioMpeg: "audio/mpeg",
  AudioMp3: "audio/mp3",
  AudioWav: "audio/wav",
  AudioOgg: "audio/ogg",
  AudioOga: "audio/oga",
  AudioAac: "audio/aac",
  AudioMp4: "audio/mp4",
  AudioFlac: "audio/flac",
  AudioOpus: "audio/opus",
  AudioWebm: "audio/webm",
  VideoMp4: "video/mp4",
  VideoWebm: "video/webm",
  VideoOgg: "video/ogg",
  VideoMpeg: "video/mpeg",
  VideoQuicktime: "video/quicktime",
  VideoXMsvideo: "video/x-msvideo",
  VideoXMatroska: "video/x-matroska",
  TextPlain: "text/plain",
  TextHtml: "text/html",
  TextCss: "text/css",
  TextCsv: "text/csv",
  TextMarkdown: "text/markdown",
  TextXPython: "text/x-python",
  ApplicationJavascript: "application/javascript",
  TextXTypescript: "text/x-typescript",
  ApplicationXYaml: "application/x-yaml",
  ApplicationPdf: "application/pdf",
  ApplicationMsword: "application/msword",
  ApplicationMsExcel: "application/vnd.ms-excel",
  ApplicationOpenxmlSpreadsheet: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ApplicationZip: "application/zip",
  ApplicationJson: "application/json",
  ApplicationXml: "application/xml",
  ApplicationOctetStream: "application/octet-stream",
  ApplicationOpenxmlWord: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ApplicationOpenxmlPresentation: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ApplicationRtf: "application/rtf",
  ApplicationXNdjson: "application/x-ndjson",
  ApplicationParquet: "application/vnd.apache.parquet",
  ApplicationGzip: "application/gzip",
  ApplicationXTar: "application/x-tar",
  ApplicationX7ZCompressed: "application/x-7z-compressed"
};

// src/api/api/resources/metricsV2/index.ts
var metricsV2_exports = {};

// src/api/api/resources/metrics/index.ts
var metrics_exports = {};

// src/api/api/resources/models/index.ts
var models_exports = {};

// src/api/api/resources/observationsV2/index.ts
var observationsV2_exports = {};

// src/api/api/resources/observations/index.ts
var observations_exports = {};

// src/api/api/resources/opentelemetry/index.ts
var opentelemetry_exports = {};

// src/api/api/resources/organizations/index.ts
var organizations_exports = {};
__export(organizations_exports, {
  MembershipRole: () => MembershipRole
});

// src/api/api/resources/organizations/types/MembershipRole.ts
var MembershipRole = {
  Owner: "OWNER",
  Admin: "ADMIN",
  Member: "MEMBER",
  Viewer: "VIEWER"
};

// src/api/api/resources/projects/index.ts
var projects_exports = {};

// src/api/api/resources/prompts/index.ts
var prompts_exports = {};
__export(prompts_exports, {
  PromptType: () => PromptType
});

// src/api/api/resources/prompts/types/PromptType.ts
var PromptType = {
  Chat: "chat",
  Text: "text"
};

// src/api/api/resources/scim/index.ts
var scim_exports = {};

// src/api/api/resources/scoreConfigs/index.ts
var scoreConfigs_exports = {};

// src/api/api/resources/scoreV2/index.ts
var scoreV2_exports = {};

// src/api/api/resources/score/index.ts
var score_exports = {};

// src/api/api/resources/sessions/index.ts
var sessions_exports = {};

// src/api/api/resources/trace/index.ts
var trace_exports = {};

// src/api/api/resources/utils/index.ts
var utils_exports = {};
__export(utils_exports, {
  pagination: () => pagination_exports
});

// src/api/api/resources/utils/resources/pagination/index.ts
var pagination_exports = {};

// src/api/api/resources/promptVersion/index.ts
var promptVersion_exports = {};

// src/api/core/headers.ts
function mergeHeaders(...headersArray) {
  const result = {};
  for (const [key, value] of headersArray.filter((headers) => headers != null).flatMap((headers) => Object.entries(headers))) {
    if (value != null) {
      result[key] = value;
    } else if (key in result) {
      delete result[key];
    }
  }
  return result;
}
function mergeOnlyDefinedHeaders(...headersArray) {
  const result = {};
  for (const [key, value] of headersArray.filter((headers) => headers != null).flatMap((headers) => Object.entries(headers))) {
    if (value != null) {
      result[key] = value;
    }
  }
  return result;
}

// src/api/core/url/qs.ts
var defaultQsOptions = {
  arrayFormat: "indices",
  encode: true
};
function encodeValue(value, shouldEncode) {
  if (value === void 0) {
    return "";
  }
  if (value === null) {
    return "";
  }
  const stringValue = String(value);
  return shouldEncode ? encodeURIComponent(stringValue) : stringValue;
}
function stringifyObject(obj, prefix = "", options) {
  const parts = [];
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}[${key}]` : key;
    if (value === void 0) {
      continue;
    }
    if (Array.isArray(value)) {
      if (value.length === 0) {
        continue;
      }
      for (let i = 0; i < value.length; i++) {
        const item = value[i];
        if (item === void 0) {
          continue;
        }
        if (typeof item === "object" && !Array.isArray(item) && item !== null) {
          const arrayKey = options.arrayFormat === "indices" ? `${fullKey}[${i}]` : fullKey;
          parts.push(
            ...stringifyObject(
              item,
              arrayKey,
              options
            )
          );
        } else {
          const arrayKey = options.arrayFormat === "indices" ? `${fullKey}[${i}]` : fullKey;
          const encodedKey = options.encode ? encodeURIComponent(arrayKey) : arrayKey;
          parts.push(`${encodedKey}=${encodeValue(item, options.encode)}`);
        }
      }
    } else if (typeof value === "object" && value !== null) {
      if (Object.keys(value).length === 0) {
        continue;
      }
      parts.push(
        ...stringifyObject(value, fullKey, options)
      );
    } else {
      const encodedKey = options.encode ? encodeURIComponent(fullKey) : fullKey;
      parts.push(`${encodedKey}=${encodeValue(value, options.encode)}`);
    }
  }
  return parts;
}
function toQueryString(obj, options) {
  if (obj == null || typeof obj !== "object") {
    return "";
  }
  const parts = stringifyObject(obj, "", {
    ...defaultQsOptions,
    ...options
  });
  return parts.join("&");
}

// src/api/core/fetcher/createRequestUrl.ts
function createRequestUrl(baseUrl, queryParameters) {
  const queryString = toQueryString(queryParameters, { arrayFormat: "repeat" });
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}

// src/api/core/fetcher/BinaryResponse.ts
function getBinaryResponse(response) {
  const binaryResponse = {
    get bodyUsed() {
      return response.bodyUsed;
    },
    stream: () => response.body,
    arrayBuffer: response.arrayBuffer.bind(response),
    blob: response.blob.bind(response)
  };
  if ("bytes" in response && typeof response.bytes === "function") {
    binaryResponse.bytes = response.bytes.bind(response);
  }
  return binaryResponse;
}

// src/api/core/fetcher/ResponseWithBody.ts
function isResponseWithBody(response) {
  return response.body != null;
}

// src/api/core/fetcher/getResponseBody.ts
async function getResponseBody(response, responseType) {
  if (!isResponseWithBody(response)) {
    return void 0;
  }
  switch (responseType) {
    case "binary-response":
      return getBinaryResponse(response);
    case "blob":
      return await response.blob();
    case "arrayBuffer":
      return await response.arrayBuffer();
    case "sse":
      return response.body;
    case "streaming":
      return response.body;
    case "text":
      return await response.text();
  }
  const text = await response.text();
  if (text.length > 0) {
    try {
      let responseBody = fromJson(text);
      return responseBody;
    } catch (err) {
      return {
        ok: false,
        error: {
          reason: "non-json",
          statusCode: response.status,
          rawBody: text
        }
      };
    }
  }
  return void 0;
}

// src/api/core/fetcher/getErrorResponseBody.ts
async function getErrorResponseBody(response) {
  var _a2, _b, _c;
  let contentType = (_a2 = response.headers.get("Content-Type")) == null ? void 0 : _a2.toLowerCase();
  if (contentType == null || contentType.length === 0) {
    return getResponseBody(response);
  }
  if (contentType.indexOf(";") !== -1) {
    contentType = (_c = (_b = contentType.split(";")[0]) == null ? void 0 : _b.trim()) != null ? _c : "";
  }
  switch (contentType) {
    case "application/hal+json":
    case "application/json":
    case "application/ld+json":
    case "application/problem+json":
    case "application/vnd.api+json":
    case "text/json":
      const text = await response.text();
      return text.length > 0 ? fromJson(text) : void 0;
    default:
      if (contentType.startsWith("application/vnd.") && contentType.endsWith("+json")) {
        const text2 = await response.text();
        return text2.length > 0 ? fromJson(text2) : void 0;
      }
      return await response.text();
  }
}

// src/api/core/fetcher/getFetchFn.ts
async function getFetchFn() {
  return fetch;
}

// src/api/core/fetcher/getRequestBody.ts
async function getRequestBody({
  body,
  type
}) {
  if (type.includes("json")) {
    return toJson(body);
  } else {
    return body;
  }
}

// src/api/core/fetcher/signals.ts
var TIMEOUT = "timeout";
function getTimeoutSignal(timeoutMs) {
  const controller = new AbortController();
  const abortId = setTimeout(() => controller.abort(TIMEOUT), timeoutMs);
  return { signal: controller.signal, abortId };
}
function anySignal(...args) {
  const signals = args.length === 1 && Array.isArray(args[0]) ? args[0] : args;
  const controller = new AbortController();
  for (const signal of signals) {
    if (signal.aborted) {
      controller.abort(signal == null ? void 0 : signal.reason);
      break;
    }
    signal.addEventListener(
      "abort",
      () => controller.abort(signal == null ? void 0 : signal.reason),
      {
        signal: controller.signal
      }
    );
  }
  return controller.signal;
}

// src/api/core/fetcher/makeRequest.ts
var makeRequest = async (fetchFn, url, method, headers, requestBody, timeoutMs, abortSignal, withCredentials, duplex) => {
  const signals = [];
  let timeoutAbortId = void 0;
  if (timeoutMs != null) {
    const { signal, abortId } = getTimeoutSignal(timeoutMs);
    timeoutAbortId = abortId;
    signals.push(signal);
  }
  if (abortSignal != null) {
    signals.push(abortSignal);
  }
  let newSignals = anySignal(signals);
  const response = await fetchFn(url, {
    method,
    headers,
    body: requestBody,
    signal: newSignals,
    credentials: withCredentials ? "include" : void 0,
    // @ts-ignore
    duplex
  });
  if (timeoutAbortId != null) {
    clearTimeout(timeoutAbortId);
  }
  return response;
};

// src/api/core/fetcher/Headers.ts
var Headers;
if (typeof globalThis.Headers !== "undefined") {
  Headers = globalThis.Headers;
} else {
  Headers = class Headers2 {
    constructor(init) {
      this.headers = /* @__PURE__ */ new Map();
      if (init) {
        if (init instanceof Headers2) {
          init.forEach((value, key) => this.append(key, value));
        } else if (Array.isArray(init)) {
          for (const [key, value] of init) {
            if (typeof key === "string" && typeof value === "string") {
              this.append(key, value);
            } else {
              throw new TypeError(
                "Each header entry must be a [string, string] tuple"
              );
            }
          }
        } else {
          for (const [key, value] of Object.entries(init)) {
            if (typeof value === "string") {
              this.append(key, value);
            } else {
              throw new TypeError("Header values must be strings");
            }
          }
        }
      }
    }
    append(name, value) {
      const key = name.toLowerCase();
      const existing = this.headers.get(key) || [];
      this.headers.set(key, [...existing, value]);
    }
    delete(name) {
      const key = name.toLowerCase();
      this.headers.delete(key);
    }
    get(name) {
      const key = name.toLowerCase();
      const values = this.headers.get(key);
      return values ? values.join(", ") : null;
    }
    has(name) {
      const key = name.toLowerCase();
      return this.headers.has(key);
    }
    set(name, value) {
      const key = name.toLowerCase();
      this.headers.set(key, [value]);
    }
    forEach(callbackfn, thisArg) {
      const boundCallback = thisArg ? callbackfn.bind(thisArg) : callbackfn;
      this.headers.forEach(
        (values, key) => boundCallback(values.join(", "), key, this)
      );
    }
    getSetCookie() {
      return this.headers.get("set-cookie") || [];
    }
    *entries() {
      for (const [key, values] of this.headers.entries()) {
        yield [key, values.join(", ")];
      }
    }
    *keys() {
      yield* this.headers.keys();
    }
    *values() {
      for (const values of this.headers.values()) {
        yield values.join(", ");
      }
    }
    [Symbol.iterator]() {
      return this.entries();
    }
  };
}

// src/api/core/fetcher/RawResponse.ts
var abortRawResponse = {
  headers: new Headers(),
  redirected: false,
  status: 499,
  statusText: "Client Closed Request",
  type: "error",
  url: ""
};
var unknownRawResponse = {
  headers: new Headers(),
  redirected: false,
  status: 0,
  statusText: "Unknown Error",
  type: "error",
  url: ""
};
function toRawResponse(response) {
  return {
    headers: response.headers,
    redirected: response.redirected,
    status: response.status,
    statusText: response.statusText,
    type: response.type,
    url: response.url
  };
}

// src/api/core/fetcher/requestWithRetries.ts
var INITIAL_RETRY_DELAY = 1e3;
var MAX_RETRY_DELAY = 6e4;
var DEFAULT_MAX_RETRIES = 2;
var JITTER_FACTOR = 0.2;
function addPositiveJitter(delay) {
  const jitterMultiplier = 1 + Math.random() * JITTER_FACTOR;
  return delay * jitterMultiplier;
}
function addSymmetricJitter(delay) {
  const jitterMultiplier = 1 + (Math.random() - 0.5) * JITTER_FACTOR;
  return delay * jitterMultiplier;
}
function getRetryDelayFromHeaders(response, retryAttempt) {
  const retryAfter = response.headers.get("Retry-After");
  if (retryAfter) {
    const retryAfterSeconds = parseInt(retryAfter, 10);
    if (!isNaN(retryAfterSeconds) && retryAfterSeconds > 0) {
      return Math.min(retryAfterSeconds * 1e3, MAX_RETRY_DELAY);
    }
    const retryAfterDate = new Date(retryAfter);
    if (!isNaN(retryAfterDate.getTime())) {
      const delay = retryAfterDate.getTime() - Date.now();
      if (delay > 0) {
        return Math.min(Math.max(delay, 0), MAX_RETRY_DELAY);
      }
    }
  }
  const rateLimitReset = response.headers.get("X-RateLimit-Reset");
  if (rateLimitReset) {
    const resetTime = parseInt(rateLimitReset, 10);
    if (!isNaN(resetTime)) {
      const delay = resetTime * 1e3 - Date.now();
      if (delay > 0) {
        return addPositiveJitter(Math.min(delay, MAX_RETRY_DELAY));
      }
    }
  }
  return addSymmetricJitter(
    Math.min(INITIAL_RETRY_DELAY * Math.pow(2, retryAttempt), MAX_RETRY_DELAY)
  );
}
async function requestWithRetries(requestFn, maxRetries = DEFAULT_MAX_RETRIES) {
  let response = await requestFn();
  for (let i = 0; i < maxRetries; ++i) {
    if ([408, 429].includes(response.status) || response.status >= 500) {
      const delay = getRetryDelayFromHeaders(response, i);
      await new Promise((resolve) => setTimeout(resolve, delay));
      response = await requestFn();
    } else {
      break;
    }
  }
  return response;
}

// src/api/core/fetcher/Supplier.ts
var Supplier = {
  get: async (supplier) => {
    if (typeof supplier === "function") {
      return supplier();
    } else {
      return supplier;
    }
  }
};

// src/api/core/fetcher/Fetcher.ts
async function getHeaders(args) {
  const newHeaders = {};
  if (args.body !== void 0 && args.contentType != null) {
    newHeaders["Content-Type"] = args.contentType;
  }
  if (args.headers == null) {
    return newHeaders;
  }
  for (const [key, value] of Object.entries(args.headers)) {
    const result = await Supplier.get(value);
    if (typeof result === "string") {
      newHeaders[key] = result;
      continue;
    }
    if (result == null) {
      continue;
    }
    newHeaders[key] = `${result}`;
  }
  return newHeaders;
}
async function fetcherImpl(args) {
  const url = createRequestUrl(args.url, args.queryParameters);
  const requestBody = await getRequestBody({
    body: args.body,
    type: args.requestType === "json" ? "json" : "other"
  });
  const fetchFn = await getFetchFn();
  try {
    const response = await requestWithRetries(
      async () => makeRequest(
        fetchFn,
        url,
        args.method,
        await getHeaders(args),
        requestBody,
        args.timeoutMs,
        args.abortSignal,
        args.withCredentials,
        args.duplex
      ),
      args.maxRetries
    );
    if (response.status >= 200 && response.status < 400) {
      return {
        ok: true,
        body: await getResponseBody(response, args.responseType),
        headers: response.headers,
        rawResponse: toRawResponse(response)
      };
    } else {
      return {
        ok: false,
        error: {
          reason: "status-code",
          statusCode: response.status,
          body: await getErrorResponseBody(response)
        },
        rawResponse: toRawResponse(response)
      };
    }
  } catch (error) {
    if (args.abortSignal != null && args.abortSignal.aborted) {
      return {
        ok: false,
        error: {
          reason: "unknown",
          errorMessage: "The user aborted a request"
        },
        rawResponse: abortRawResponse
      };
    } else if (error instanceof Error && error.name === "AbortError") {
      return {
        ok: false,
        error: {
          reason: "timeout"
        },
        rawResponse: abortRawResponse
      };
    } else if (error instanceof Error) {
      return {
        ok: false,
        error: {
          reason: "unknown",
          errorMessage: error.message
        },
        rawResponse: unknownRawResponse
      };
    }
    return {
      ok: false,
      error: {
        reason: "unknown",
        errorMessage: toJson(error)
      },
      rawResponse: unknownRawResponse
    };
  }
}
var fetcher = fetcherImpl;

// src/api/core/fetcher/HttpResponsePromise.ts
var HttpResponsePromise = class _HttpResponsePromise extends Promise {
  constructor(promise) {
    super((resolve) => {
      resolve(void 0);
    });
    this.innerPromise = promise;
  }
  /**
   * Creates an `HttpResponsePromise` from a function that returns a promise.
   *
   * @param fn - A function that returns a promise resolving to a `WithRawResponse` object.
   * @param args - Arguments to pass to the function.
   * @returns An `HttpResponsePromise` instance.
   */
  static fromFunction(fn, ...args) {
    return new _HttpResponsePromise(fn(...args));
  }
  /**
   * Creates a function that returns an `HttpResponsePromise` from a function that returns a promise.
   *
   * @param fn - A function that returns a promise resolving to a `WithRawResponse` object.
   * @returns A function that returns an `HttpResponsePromise` instance.
   */
  static interceptFunction(fn) {
    return (...args) => {
      return _HttpResponsePromise.fromPromise(fn(...args));
    };
  }
  /**
   * Creates an `HttpResponsePromise` from an existing promise.
   *
   * @param promise - A promise resolving to a `WithRawResponse` object.
   * @returns An `HttpResponsePromise` instance.
   */
  static fromPromise(promise) {
    return new _HttpResponsePromise(promise);
  }
  /**
   * Creates an `HttpResponsePromise` from an executor function.
   *
   * @param executor - A function that takes resolve and reject callbacks to create a promise.
   * @returns An `HttpResponsePromise` instance.
   */
  static fromExecutor(executor) {
    const promise = new Promise(executor);
    return new _HttpResponsePromise(promise);
  }
  /**
   * Creates an `HttpResponsePromise` from a resolved result.
   *
   * @param result - A `WithRawResponse` object to resolve immediately.
   * @returns An `HttpResponsePromise` instance.
   */
  static fromResult(result) {
    const promise = Promise.resolve(result);
    return new _HttpResponsePromise(promise);
  }
  unwrap() {
    if (!this.unwrappedPromise) {
      this.unwrappedPromise = this.innerPromise.then(({ data }) => data);
    }
    return this.unwrappedPromise;
  }
  /** @inheritdoc */
  then(onfulfilled, onrejected) {
    return this.unwrap().then(onfulfilled, onrejected);
  }
  /** @inheritdoc */
  catch(onrejected) {
    return this.unwrap().catch(onrejected);
  }
  /** @inheritdoc */
  finally(onfinally) {
    return this.unwrap().finally(onfinally);
  }
  /**
   * Retrieves the data and raw response.
   *
   * @returns A promise resolving to a `WithRawResponse` object.
   */
  async withRawResponse() {
    return await this.innerPromise;
  }
};

// src/api/core/url/index.ts
var url_exports = {};
__export(url_exports, {
  join: () => join,
  toQueryString: () => toQueryString
});

// src/api/core/url/join.ts
function join(base, ...segments) {
  if (!base) {
    return "";
  }
  if (segments.length === 0) {
    return base;
  }
  if (base.includes("://")) {
    let url;
    try {
      url = new URL(base);
    } catch {
      return joinPath(base, ...segments);
    }
    const lastSegment = segments[segments.length - 1];
    const shouldPreserveTrailingSlash = lastSegment && lastSegment.endsWith("/");
    for (const segment of segments) {
      const cleanSegment = trimSlashes(segment);
      if (cleanSegment) {
        url.pathname = joinPathSegments(url.pathname, cleanSegment);
      }
    }
    if (shouldPreserveTrailingSlash && !url.pathname.endsWith("/")) {
      url.pathname += "/";
    }
    return url.toString();
  }
  return joinPath(base, ...segments);
}
function joinPath(base, ...segments) {
  if (segments.length === 0) {
    return base;
  }
  let result = base;
  const lastSegment = segments[segments.length - 1];
  const shouldPreserveTrailingSlash = lastSegment && lastSegment.endsWith("/");
  for (const segment of segments) {
    const cleanSegment = trimSlashes(segment);
    if (cleanSegment) {
      result = joinPathSegments(result, cleanSegment);
    }
  }
  if (shouldPreserveTrailingSlash && !result.endsWith("/")) {
    result += "/";
  }
  return result;
}
function joinPathSegments(left, right) {
  if (left.endsWith("/")) {
    return left + right;
  }
  return left + "/" + right;
}
function trimSlashes(str) {
  if (!str) return str;
  let start = 0;
  let end = str.length;
  if (str.startsWith("/")) start = 1;
  if (str.endsWith("/")) end = str.length - 1;
  return start === 0 && end === str.length ? str : str.slice(start, end);
}

// src/api/core/base64.ts
function base64ToBytes2(base64) {
  const binString = atob(base64);
  return Uint8Array.from(binString, (m) => m.codePointAt(0));
}
function bytesToBase642(bytes) {
  const binString = String.fromCodePoint(...bytes);
  return btoa(binString);
}
function base64Encode2(input) {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(input, "utf8").toString("base64");
  }
  const bytes = new TextEncoder().encode(input);
  return bytesToBase642(bytes);
}
function base64Decode2(input) {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(input, "base64").toString("utf8");
  }
  const bytes = base64ToBytes2(input);
  return new TextDecoder().decode(bytes);
}

// src/api/core/auth/BasicAuth.ts
var BASIC_AUTH_HEADER_PREFIX = /^Basic /i;
var BasicAuth = {
  toAuthorizationHeader: (basicAuth) => {
    if (basicAuth == null) {
      return void 0;
    }
    const token = base64Encode2(`${basicAuth.username}:${basicAuth.password}`);
    return `Basic ${token}`;
  },
  fromAuthorizationHeader: (header) => {
    const credentials = header.replace(BASIC_AUTH_HEADER_PREFIX, "");
    const decoded = base64Decode2(credentials);
    const [username, password] = decoded.split(":", 2);
    if (username == null || password == null) {
      throw new Error("Invalid basic auth");
    }
    return {
      username,
      password
    };
  }
};

// src/api/api/resources/annotationQueues/client/Client.ts
var AnnotationQueues = class {
  constructor(_options) {
    this._options = _options;
  }
  /**
   * Get all annotation queues
   *
   * @param {LangfuseAPI.GetAnnotationQueuesRequest} request
   * @param {AnnotationQueues.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link LangfuseAPI.Error}
   * @throws {@link LangfuseAPI.UnauthorizedError}
   * @throws {@link LangfuseAPI.AccessDeniedError}
   * @throws {@link LangfuseAPI.MethodNotAllowedError}
   * @throws {@link LangfuseAPI.NotFoundError}
   *
   * @example
   *     await client.annotationQueues.listQueues()
   */
  listQueues(request = {}, requestOptions) {
    return HttpResponsePromise.fromPromise(
      this.__listQueues(request, requestOptions)
    );
  }
  async __listQueues(request = {}, requestOptions) {
    var _a2, _b, _c, _d, _e, _f, _g, _h;
    const { page, limit } = request;
    const _queryParams = {};
    if (page != null) {
      _queryParams["page"] = page.toString();
    }
    if (limit != null) {
      _queryParams["limit"] = limit.toString();
    }
    let _headers = mergeHeaders(
      (_a2 = this._options) == null ? void 0 : _a2.headers,
      mergeOnlyDefinedHeaders({
        Authorization: await this._getAuthorizationHeader(),
        "X-Langfuse-Sdk-Name": (_c = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkName) != null ? _c : (_b = this._options) == null ? void 0 : _b.xLangfuseSdkName,
        "X-Langfuse-Sdk-Version": (_e = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkVersion) != null ? _e : (_d = this._options) == null ? void 0 : _d.xLangfuseSdkVersion,
        "X-Langfuse-Public-Key": (_g = requestOptions == null ? void 0 : requestOptions.xLangfusePublicKey) != null ? _g : (_f = this._options) == null ? void 0 : _f.xLangfusePublicKey
      }),
      requestOptions == null ? void 0 : requestOptions.headers
    );
    const _response = await fetcher({
      url: url_exports.join(
        (_h = await Supplier.get(this._options.baseUrl)) != null ? _h : await Supplier.get(this._options.environment),
        "/api/public/annotation-queues"
      ),
      method: "GET",
      headers: _headers,
      queryParameters: { ..._queryParams, ...requestOptions == null ? void 0 : requestOptions.queryParams },
      timeoutMs: (requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
      maxRetries: requestOptions == null ? void 0 : requestOptions.maxRetries,
      abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal
    });
    if (_response.ok) {
      return {
        data: _response.body,
        rawResponse: _response.rawResponse
      };
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 400:
          throw new Error2(
            _response.error.body,
            _response.rawResponse
          );
        case 401:
          throw new UnauthorizedError(
            _response.error.body,
            _response.rawResponse
          );
        case 403:
          throw new AccessDeniedError(
            _response.error.body,
            _response.rawResponse
          );
        case 405:
          throw new MethodNotAllowedError(
            _response.error.body,
            _response.rawResponse
          );
        case 404:
          throw new NotFoundError(
            _response.error.body,
            _response.rawResponse
          );
        default:
          throw new LangfuseAPIError({
            statusCode: _response.error.statusCode,
            body: _response.error.body,
            rawResponse: _response.rawResponse
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new LangfuseAPIError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody,
          rawResponse: _response.rawResponse
        });
      case "timeout":
        throw new LangfuseAPITimeoutError(
          "Timeout exceeded when calling GET /api/public/annotation-queues."
        );
      case "unknown":
        throw new LangfuseAPIError({
          message: _response.error.errorMessage,
          rawResponse: _response.rawResponse
        });
    }
  }
  /**
   * Create an annotation queue
   *
   * @param {LangfuseAPI.CreateAnnotationQueueRequest} request
   * @param {AnnotationQueues.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link LangfuseAPI.Error}
   * @throws {@link LangfuseAPI.UnauthorizedError}
   * @throws {@link LangfuseAPI.AccessDeniedError}
   * @throws {@link LangfuseAPI.MethodNotAllowedError}
   * @throws {@link LangfuseAPI.NotFoundError}
   *
   * @example
   *     await client.annotationQueues.createQueue({
   *         name: "name",
   *         description: undefined,
   *         scoreConfigIds: ["scoreConfigIds", "scoreConfigIds"]
   *     })
   */
  createQueue(request, requestOptions) {
    return HttpResponsePromise.fromPromise(
      this.__createQueue(request, requestOptions)
    );
  }
  async __createQueue(request, requestOptions) {
    var _a2, _b, _c, _d, _e, _f, _g, _h;
    let _headers = mergeHeaders(
      (_a2 = this._options) == null ? void 0 : _a2.headers,
      mergeOnlyDefinedHeaders({
        Authorization: await this._getAuthorizationHeader(),
        "X-Langfuse-Sdk-Name": (_c = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkName) != null ? _c : (_b = this._options) == null ? void 0 : _b.xLangfuseSdkName,
        "X-Langfuse-Sdk-Version": (_e = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkVersion) != null ? _e : (_d = this._options) == null ? void 0 : _d.xLangfuseSdkVersion,
        "X-Langfuse-Public-Key": (_g = requestOptions == null ? void 0 : requestOptions.xLangfusePublicKey) != null ? _g : (_f = this._options) == null ? void 0 : _f.xLangfusePublicKey
      }),
      requestOptions == null ? void 0 : requestOptions.headers
    );
    const _response = await fetcher({
      url: url_exports.join(
        (_h = await Supplier.get(this._options.baseUrl)) != null ? _h : await Supplier.get(this._options.environment),
        "/api/public/annotation-queues"
      ),
      method: "POST",
      headers: _headers,
      contentType: "application/json",
      queryParameters: requestOptions == null ? void 0 : requestOptions.queryParams,
      requestType: "json",
      body: request,
      timeoutMs: (requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
      maxRetries: requestOptions == null ? void 0 : requestOptions.maxRetries,
      abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal
    });
    if (_response.ok) {
      return {
        data: _response.body,
        rawResponse: _response.rawResponse
      };
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 400:
          throw new Error2(
            _response.error.body,
            _response.rawResponse
          );
        case 401:
          throw new UnauthorizedError(
            _response.error.body,
            _response.rawResponse
          );
        case 403:
          throw new AccessDeniedError(
            _response.error.body,
            _response.rawResponse
          );
        case 405:
          throw new MethodNotAllowedError(
            _response.error.body,
            _response.rawResponse
          );
        case 404:
          throw new NotFoundError(
            _response.error.body,
            _response.rawResponse
          );
        default:
          throw new LangfuseAPIError({
            statusCode: _response.error.statusCode,
            body: _response.error.body,
            rawResponse: _response.rawResponse
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new LangfuseAPIError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody,
          rawResponse: _response.rawResponse
        });
      case "timeout":
        throw new LangfuseAPITimeoutError(
          "Timeout exceeded when calling POST /api/public/annotation-queues."
        );
      case "unknown":
        throw new LangfuseAPIError({
          message: _response.error.errorMessage,
          rawResponse: _response.rawResponse
        });
    }
  }
  /**
   * Get an annotation queue by ID
   *
   * @param {string} queueId - The unique identifier of the annotation queue
   * @param {AnnotationQueues.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link LangfuseAPI.Error}
   * @throws {@link LangfuseAPI.UnauthorizedError}
   * @throws {@link LangfuseAPI.AccessDeniedError}
   * @throws {@link LangfuseAPI.MethodNotAllowedError}
   * @throws {@link LangfuseAPI.NotFoundError}
   *
   * @example
   *     await client.annotationQueues.getQueue("queueId")
   */
  getQueue(queueId, requestOptions) {
    return HttpResponsePromise.fromPromise(
      this.__getQueue(queueId, requestOptions)
    );
  }
  async __getQueue(queueId, requestOptions) {
    var _a2, _b, _c, _d, _e, _f, _g, _h;
    let _headers = mergeHeaders(
      (_a2 = this._options) == null ? void 0 : _a2.headers,
      mergeOnlyDefinedHeaders({
        Authorization: await this._getAuthorizationHeader(),
        "X-Langfuse-Sdk-Name": (_c = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkName) != null ? _c : (_b = this._options) == null ? void 0 : _b.xLangfuseSdkName,
        "X-Langfuse-Sdk-Version": (_e = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkVersion) != null ? _e : (_d = this._options) == null ? void 0 : _d.xLangfuseSdkVersion,
        "X-Langfuse-Public-Key": (_g = requestOptions == null ? void 0 : requestOptions.xLangfusePublicKey) != null ? _g : (_f = this._options) == null ? void 0 : _f.xLangfusePublicKey
      }),
      requestOptions == null ? void 0 : requestOptions.headers
    );
    const _response = await fetcher({
      url: url_exports.join(
        (_h = await Supplier.get(this._options.baseUrl)) != null ? _h : await Supplier.get(this._options.environment),
        `/api/public/annotation-queues/${encodeURIComponent(queueId)}`
      ),
      method: "GET",
      headers: _headers,
      queryParameters: requestOptions == null ? void 0 : requestOptions.queryParams,
      timeoutMs: (requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
      maxRetries: requestOptions == null ? void 0 : requestOptions.maxRetries,
      abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal
    });
    if (_response.ok) {
      return {
        data: _response.body,
        rawResponse: _response.rawResponse
      };
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 400:
          throw new Error2(
            _response.error.body,
            _response.rawResponse
          );
        case 401:
          throw new UnauthorizedError(
            _response.error.body,
            _response.rawResponse
          );
        case 403:
          throw new AccessDeniedError(
            _response.error.body,
            _response.rawResponse
          );
        case 405:
          throw new MethodNotAllowedError(
            _response.error.body,
            _response.rawResponse
          );
        case 404:
          throw new NotFoundError(
            _response.error.body,
            _response.rawResponse
          );
        default:
          throw new LangfuseAPIError({
            statusCode: _response.error.statusCode,
            body: _response.error.body,
            rawResponse: _response.rawResponse
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new LangfuseAPIError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody,
          rawResponse: _response.rawResponse
        });
      case "timeout":
        throw new LangfuseAPITimeoutError(
          "Timeout exceeded when calling GET /api/public/annotation-queues/{queueId}."
        );
      case "unknown":
        throw new LangfuseAPIError({
          message: _response.error.errorMessage,
          rawResponse: _response.rawResponse
        });
    }
  }
  /**
   * Get items for a specific annotation queue
   *
   * @param {string} queueId - The unique identifier of the annotation queue
   * @param {LangfuseAPI.GetAnnotationQueueItemsRequest} request
   * @param {AnnotationQueues.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link LangfuseAPI.Error}
   * @throws {@link LangfuseAPI.UnauthorizedError}
   * @throws {@link LangfuseAPI.AccessDeniedError}
   * @throws {@link LangfuseAPI.MethodNotAllowedError}
   * @throws {@link LangfuseAPI.NotFoundError}
   *
   * @example
   *     await client.annotationQueues.listQueueItems("queueId")
   */
  listQueueItems(queueId, request = {}, requestOptions) {
    return HttpResponsePromise.fromPromise(
      this.__listQueueItems(queueId, request, requestOptions)
    );
  }
  async __listQueueItems(queueId, request = {}, requestOptions) {
    var _a2, _b, _c, _d, _e, _f, _g, _h;
    const { status, page, limit } = request;
    const _queryParams = {};
    if (status != null) {
      _queryParams["status"] = status;
    }
    if (page != null) {
      _queryParams["page"] = page.toString();
    }
    if (limit != null) {
      _queryParams["limit"] = limit.toString();
    }
    let _headers = mergeHeaders(
      (_a2 = this._options) == null ? void 0 : _a2.headers,
      mergeOnlyDefinedHeaders({
        Authorization: await this._getAuthorizationHeader(),
        "X-Langfuse-Sdk-Name": (_c = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkName) != null ? _c : (_b = this._options) == null ? void 0 : _b.xLangfuseSdkName,
        "X-Langfuse-Sdk-Version": (_e = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkVersion) != null ? _e : (_d = this._options) == null ? void 0 : _d.xLangfuseSdkVersion,
        "X-Langfuse-Public-Key": (_g = requestOptions == null ? void 0 : requestOptions.xLangfusePublicKey) != null ? _g : (_f = this._options) == null ? void 0 : _f.xLangfusePublicKey
      }),
      requestOptions == null ? void 0 : requestOptions.headers
    );
    const _response = await fetcher({
      url: url_exports.join(
        (_h = await Supplier.get(this._options.baseUrl)) != null ? _h : await Supplier.get(this._options.environment),
        `/api/public/annotation-queues/${encodeURIComponent(queueId)}/items`
      ),
      method: "GET",
      headers: _headers,
      queryParameters: { ..._queryParams, ...requestOptions == null ? void 0 : requestOptions.queryParams },
      timeoutMs: (requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
      maxRetries: requestOptions == null ? void 0 : requestOptions.maxRetries,
      abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal
    });
    if (_response.ok) {
      return {
        data: _response.body,
        rawResponse: _response.rawResponse
      };
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 400:
          throw new Error2(
            _response.error.body,
            _response.rawResponse
          );
        case 401:
          throw new UnauthorizedError(
            _response.error.body,
            _response.rawResponse
          );
        case 403:
          throw new AccessDeniedError(
            _response.error.body,
            _response.rawResponse
          );
        case 405:
          throw new MethodNotAllowedError(
            _response.error.body,
            _response.rawResponse
          );
        case 404:
          throw new NotFoundError(
            _response.error.body,
            _response.rawResponse
          );
        default:
          throw new LangfuseAPIError({
            statusCode: _response.error.statusCode,
            body: _response.error.body,
            rawResponse: _response.rawResponse
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new LangfuseAPIError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody,
          rawResponse: _response.rawResponse
        });
      case "timeout":
        throw new LangfuseAPITimeoutError(
          "Timeout exceeded when calling GET /api/public/annotation-queues/{queueId}/items."
        );
      case "unknown":
        throw new LangfuseAPIError({
          message: _response.error.errorMessage,
          rawResponse: _response.rawResponse
        });
    }
  }
  /**
   * Get a specific item from an annotation queue
   *
   * @param {string} queueId - The unique identifier of the annotation queue
   * @param {string} itemId - The unique identifier of the annotation queue item
   * @param {AnnotationQueues.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link LangfuseAPI.Error}
   * @throws {@link LangfuseAPI.UnauthorizedError}
   * @throws {@link LangfuseAPI.AccessDeniedError}
   * @throws {@link LangfuseAPI.MethodNotAllowedError}
   * @throws {@link LangfuseAPI.NotFoundError}
   *
   * @example
   *     await client.annotationQueues.getQueueItem("queueId", "itemId")
   */
  getQueueItem(queueId, itemId, requestOptions) {
    return HttpResponsePromise.fromPromise(
      this.__getQueueItem(queueId, itemId, requestOptions)
    );
  }
  async __getQueueItem(queueId, itemId, requestOptions) {
    var _a2, _b, _c, _d, _e, _f, _g, _h;
    let _headers = mergeHeaders(
      (_a2 = this._options) == null ? void 0 : _a2.headers,
      mergeOnlyDefinedHeaders({
        Authorization: await this._getAuthorizationHeader(),
        "X-Langfuse-Sdk-Name": (_c = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkName) != null ? _c : (_b = this._options) == null ? void 0 : _b.xLangfuseSdkName,
        "X-Langfuse-Sdk-Version": (_e = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkVersion) != null ? _e : (_d = this._options) == null ? void 0 : _d.xLangfuseSdkVersion,
        "X-Langfuse-Public-Key": (_g = requestOptions == null ? void 0 : requestOptions.xLangfusePublicKey) != null ? _g : (_f = this._options) == null ? void 0 : _f.xLangfusePublicKey
      }),
      requestOptions == null ? void 0 : requestOptions.headers
    );
    const _response = await fetcher({
      url: url_exports.join(
        (_h = await Supplier.get(this._options.baseUrl)) != null ? _h : await Supplier.get(this._options.environment),
        `/api/public/annotation-queues/${encodeURIComponent(queueId)}/items/${encodeURIComponent(itemId)}`
      ),
      method: "GET",
      headers: _headers,
      queryParameters: requestOptions == null ? void 0 : requestOptions.queryParams,
      timeoutMs: (requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
      maxRetries: requestOptions == null ? void 0 : requestOptions.maxRetries,
      abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal
    });
    if (_response.ok) {
      return {
        data: _response.body,
        rawResponse: _response.rawResponse
      };
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 400:
          throw new Error2(
            _response.error.body,
            _response.rawResponse
          );
        case 401:
          throw new UnauthorizedError(
            _response.error.body,
            _response.rawResponse
          );
        case 403:
          throw new AccessDeniedError(
            _response.error.body,
            _response.rawResponse
          );
        case 405:
          throw new MethodNotAllowedError(
            _response.error.body,
            _response.rawResponse
          );
        case 404:
          throw new NotFoundError(
            _response.error.body,
            _response.rawResponse
          );
        default:
          throw new LangfuseAPIError({
            statusCode: _response.error.statusCode,
            body: _response.error.body,
            rawResponse: _response.rawResponse
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new LangfuseAPIError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody,
          rawResponse: _response.rawResponse
        });
      case "timeout":
        throw new LangfuseAPITimeoutError(
          "Timeout exceeded when calling GET /api/public/annotation-queues/{queueId}/items/{itemId}."
        );
      case "unknown":
        throw new LangfuseAPIError({
          message: _response.error.errorMessage,
          rawResponse: _response.rawResponse
        });
    }
  }
  /**
   * Add an item to an annotation queue
   *
   * @param {string} queueId - The unique identifier of the annotation queue
   * @param {LangfuseAPI.CreateAnnotationQueueItemRequest} request
   * @param {AnnotationQueues.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link LangfuseAPI.Error}
   * @throws {@link LangfuseAPI.UnauthorizedError}
   * @throws {@link LangfuseAPI.AccessDeniedError}
   * @throws {@link LangfuseAPI.MethodNotAllowedError}
   * @throws {@link LangfuseAPI.NotFoundError}
   *
   * @example
   *     await client.annotationQueues.createQueueItem("queueId", {
   *         objectId: "objectId",
   *         objectType: "TRACE",
   *         status: undefined
   *     })
   */
  createQueueItem(queueId, request, requestOptions) {
    return HttpResponsePromise.fromPromise(
      this.__createQueueItem(queueId, request, requestOptions)
    );
  }
  async __createQueueItem(queueId, request, requestOptions) {
    var _a2, _b, _c, _d, _e, _f, _g, _h;
    let _headers = mergeHeaders(
      (_a2 = this._options) == null ? void 0 : _a2.headers,
      mergeOnlyDefinedHeaders({
        Authorization: await this._getAuthorizationHeader(),
        "X-Langfuse-Sdk-Name": (_c = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkName) != null ? _c : (_b = this._options) == null ? void 0 : _b.xLangfuseSdkName,
        "X-Langfuse-Sdk-Version": (_e = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkVersion) != null ? _e : (_d = this._options) == null ? void 0 : _d.xLangfuseSdkVersion,
        "X-Langfuse-Public-Key": (_g = requestOptions == null ? void 0 : requestOptions.xLangfusePublicKey) != null ? _g : (_f = this._options) == null ? void 0 : _f.xLangfusePublicKey
      }),
      requestOptions == null ? void 0 : requestOptions.headers
    );
    const _response = await fetcher({
      url: url_exports.join(
        (_h = await Supplier.get(this._options.baseUrl)) != null ? _h : await Supplier.get(this._options.environment),
        `/api/public/annotation-queues/${encodeURIComponent(queueId)}/items`
      ),
      method: "POST",
      headers: _headers,
      contentType: "application/json",
      queryParameters: requestOptions == null ? void 0 : requestOptions.queryParams,
      requestType: "json",
      body: request,
      timeoutMs: (requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
      maxRetries: requestOptions == null ? void 0 : requestOptions.maxRetries,
      abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal
    });
    if (_response.ok) {
      return {
        data: _response.body,
        rawResponse: _response.rawResponse
      };
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 400:
          throw new Error2(
            _response.error.body,
            _response.rawResponse
          );
        case 401:
          throw new UnauthorizedError(
            _response.error.body,
            _response.rawResponse
          );
        case 403:
          throw new AccessDeniedError(
            _response.error.body,
            _response.rawResponse
          );
        case 405:
          throw new MethodNotAllowedError(
            _response.error.body,
            _response.rawResponse
          );
        case 404:
          throw new NotFoundError(
            _response.error.body,
            _response.rawResponse
          );
        default:
          throw new LangfuseAPIError({
            statusCode: _response.error.statusCode,
            body: _response.error.body,
            rawResponse: _response.rawResponse
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new LangfuseAPIError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody,
          rawResponse: _response.rawResponse
        });
      case "timeout":
        throw new LangfuseAPITimeoutError(
          "Timeout exceeded when calling POST /api/public/annotation-queues/{queueId}/items."
        );
      case "unknown":
        throw new LangfuseAPIError({
          message: _response.error.errorMessage,
          rawResponse: _response.rawResponse
        });
    }
  }
  /**
   * Update an annotation queue item
   *
   * @param {string} queueId - The unique identifier of the annotation queue
   * @param {string} itemId - The unique identifier of the annotation queue item
   * @param {LangfuseAPI.UpdateAnnotationQueueItemRequest} request
   * @param {AnnotationQueues.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link LangfuseAPI.Error}
   * @throws {@link LangfuseAPI.UnauthorizedError}
   * @throws {@link LangfuseAPI.AccessDeniedError}
   * @throws {@link LangfuseAPI.MethodNotAllowedError}
   * @throws {@link LangfuseAPI.NotFoundError}
   *
   * @example
   *     await client.annotationQueues.updateQueueItem("queueId", "itemId", {
   *         status: undefined
   *     })
   */
  updateQueueItem(queueId, itemId, request, requestOptions) {
    return HttpResponsePromise.fromPromise(
      this.__updateQueueItem(queueId, itemId, request, requestOptions)
    );
  }
  async __updateQueueItem(queueId, itemId, request, requestOptions) {
    var _a2, _b, _c, _d, _e, _f, _g, _h;
    let _headers = mergeHeaders(
      (_a2 = this._options) == null ? void 0 : _a2.headers,
      mergeOnlyDefinedHeaders({
        Authorization: await this._getAuthorizationHeader(),
        "X-Langfuse-Sdk-Name": (_c = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkName) != null ? _c : (_b = this._options) == null ? void 0 : _b.xLangfuseSdkName,
        "X-Langfuse-Sdk-Version": (_e = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkVersion) != null ? _e : (_d = this._options) == null ? void 0 : _d.xLangfuseSdkVersion,
        "X-Langfuse-Public-Key": (_g = requestOptions == null ? void 0 : requestOptions.xLangfusePublicKey) != null ? _g : (_f = this._options) == null ? void 0 : _f.xLangfusePublicKey
      }),
      requestOptions == null ? void 0 : requestOptions.headers
    );
    const _response = await fetcher({
      url: url_exports.join(
        (_h = await Supplier.get(this._options.baseUrl)) != null ? _h : await Supplier.get(this._options.environment),
        `/api/public/annotation-queues/${encodeURIComponent(queueId)}/items/${encodeURIComponent(itemId)}`
      ),
      method: "PATCH",
      headers: _headers,
      contentType: "application/json",
      queryParameters: requestOptions == null ? void 0 : requestOptions.queryParams,
      requestType: "json",
      body: request,
      timeoutMs: (requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
      maxRetries: requestOptions == null ? void 0 : requestOptions.maxRetries,
      abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal
    });
    if (_response.ok) {
      return {
        data: _response.body,
        rawResponse: _response.rawResponse
      };
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 400:
          throw new Error2(
            _response.error.body,
            _response.rawResponse
          );
        case 401:
          throw new UnauthorizedError(
            _response.error.body,
            _response.rawResponse
          );
        case 403:
          throw new AccessDeniedError(
            _response.error.body,
            _response.rawResponse
          );
        case 405:
          throw new MethodNotAllowedError(
            _response.error.body,
            _response.rawResponse
          );
        case 404:
          throw new NotFoundError(
            _response.error.body,
            _response.rawResponse
          );
        default:
          throw new LangfuseAPIError({
            statusCode: _response.error.statusCode,
            body: _response.error.body,
            rawResponse: _response.rawResponse
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new LangfuseAPIError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody,
          rawResponse: _response.rawResponse
        });
      case "timeout":
        throw new LangfuseAPITimeoutError(
          "Timeout exceeded when calling PATCH /api/public/annotation-queues/{queueId}/items/{itemId}."
        );
      case "unknown":
        throw new LangfuseAPIError({
          message: _response.error.errorMessage,
          rawResponse: _response.rawResponse
        });
    }
  }
  /**
   * Remove an item from an annotation queue
   *
   * @param {string} queueId - The unique identifier of the annotation queue
   * @param {string} itemId - The unique identifier of the annotation queue item
   * @param {AnnotationQueues.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link LangfuseAPI.Error}
   * @throws {@link LangfuseAPI.UnauthorizedError}
   * @throws {@link LangfuseAPI.AccessDeniedError}
   * @throws {@link LangfuseAPI.MethodNotAllowedError}
   * @throws {@link LangfuseAPI.NotFoundError}
   *
   * @example
   *     await client.annotationQueues.deleteQueueItem("queueId", "itemId")
   */
  deleteQueueItem(queueId, itemId, requestOptions) {
    return HttpResponsePromise.fromPromise(
      this.__deleteQueueItem(queueId, itemId, requestOptions)
    );
  }
  async __deleteQueueItem(queueId, itemId, requestOptions) {
    var _a2, _b, _c, _d, _e, _f, _g, _h;
    let _headers = mergeHeaders(
      (_a2 = this._options) == null ? void 0 : _a2.headers,
      mergeOnlyDefinedHeaders({
        Authorization: await this._getAuthorizationHeader(),
        "X-Langfuse-Sdk-Name": (_c = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkName) != null ? _c : (_b = this._options) == null ? void 0 : _b.xLangfuseSdkName,
        "X-Langfuse-Sdk-Version": (_e = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkVersion) != null ? _e : (_d = this._options) == null ? void 0 : _d.xLangfuseSdkVersion,
        "X-Langfuse-Public-Key": (_g = requestOptions == null ? void 0 : requestOptions.xLangfusePublicKey) != null ? _g : (_f = this._options) == null ? void 0 : _f.xLangfusePublicKey
      }),
      requestOptions == null ? void 0 : requestOptions.headers
    );
    const _response = await fetcher({
      url: url_exports.join(
        (_h = await Supplier.get(this._options.baseUrl)) != null ? _h : await Supplier.get(this._options.environment),
        `/api/public/annotation-queues/${encodeURIComponent(queueId)}/items/${encodeURIComponent(itemId)}`
      ),
      method: "DELETE",
      headers: _headers,
      queryParameters: requestOptions == null ? void 0 : requestOptions.queryParams,
      timeoutMs: (requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
      maxRetries: requestOptions == null ? void 0 : requestOptions.maxRetries,
      abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal
    });
    if (_response.ok) {
      return {
        data: _response.body,
        rawResponse: _response.rawResponse
      };
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 400:
          throw new Error2(
            _response.error.body,
            _response.rawResponse
          );
        case 401:
          throw new UnauthorizedError(
            _response.error.body,
            _response.rawResponse
          );
        case 403:
          throw new AccessDeniedError(
            _response.error.body,
            _response.rawResponse
          );
        case 405:
          throw new MethodNotAllowedError(
            _response.error.body,
            _response.rawResponse
          );
        case 404:
          throw new NotFoundError(
            _response.error.body,
            _response.rawResponse
          );
        default:
          throw new LangfuseAPIError({
            statusCode: _response.error.statusCode,
            body: _response.error.body,
            rawResponse: _response.rawResponse
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new LangfuseAPIError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody,
          rawResponse: _response.rawResponse
        });
      case "timeout":
        throw new LangfuseAPITimeoutError(
          "Timeout exceeded when calling DELETE /api/public/annotation-queues/{queueId}/items/{itemId}."
        );
      case "unknown":
        throw new LangfuseAPIError({
          message: _response.error.errorMessage,
          rawResponse: _response.rawResponse
        });
    }
  }
  /**
   * Create an assignment for a user to an annotation queue
   *
   * @param {string} queueId - The unique identifier of the annotation queue
   * @param {LangfuseAPI.AnnotationQueueAssignmentRequest} request
   * @param {AnnotationQueues.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link LangfuseAPI.Error}
   * @throws {@link LangfuseAPI.UnauthorizedError}
   * @throws {@link LangfuseAPI.AccessDeniedError}
   * @throws {@link LangfuseAPI.MethodNotAllowedError}
   * @throws {@link LangfuseAPI.NotFoundError}
   *
   * @example
   *     await client.annotationQueues.createQueueAssignment("queueId", {
   *         userId: "userId"
   *     })
   */
  createQueueAssignment(queueId, request, requestOptions) {
    return HttpResponsePromise.fromPromise(
      this.__createQueueAssignment(queueId, request, requestOptions)
    );
  }
  async __createQueueAssignment(queueId, request, requestOptions) {
    var _a2, _b, _c, _d, _e, _f, _g, _h;
    let _headers = mergeHeaders(
      (_a2 = this._options) == null ? void 0 : _a2.headers,
      mergeOnlyDefinedHeaders({
        Authorization: await this._getAuthorizationHeader(),
        "X-Langfuse-Sdk-Name": (_c = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkName) != null ? _c : (_b = this._options) == null ? void 0 : _b.xLangfuseSdkName,
        "X-Langfuse-Sdk-Version": (_e = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkVersion) != null ? _e : (_d = this._options) == null ? void 0 : _d.xLangfuseSdkVersion,
        "X-Langfuse-Public-Key": (_g = requestOptions == null ? void 0 : requestOptions.xLangfusePublicKey) != null ? _g : (_f = this._options) == null ? void 0 : _f.xLangfusePublicKey
      }),
      requestOptions == null ? void 0 : requestOptions.headers
    );
    const _response = await fetcher({
      url: url_exports.join(
        (_h = await Supplier.get(this._options.baseUrl)) != null ? _h : await Supplier.get(this._options.environment),
        `/api/public/annotation-queues/${encodeURIComponent(queueId)}/assignments`
      ),
      method: "POST",
      headers: _headers,
      contentType: "application/json",
      queryParameters: requestOptions == null ? void 0 : requestOptions.queryParams,
      requestType: "json",
      body: request,
      timeoutMs: (requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
      maxRetries: requestOptions == null ? void 0 : requestOptions.maxRetries,
      abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal
    });
    if (_response.ok) {
      return {
        data: _response.body,
        rawResponse: _response.rawResponse
      };
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 400:
          throw new Error2(
            _response.error.body,
            _response.rawResponse
          );
        case 401:
          throw new UnauthorizedError(
            _response.error.body,
            _response.rawResponse
          );
        case 403:
          throw new AccessDeniedError(
            _response.error.body,
            _response.rawResponse
          );
        case 405:
          throw new MethodNotAllowedError(
            _response.error.body,
            _response.rawResponse
          );
        case 404:
          throw new NotFoundError(
            _response.error.body,
            _response.rawResponse
          );
        default:
          throw new LangfuseAPIError({
            statusCode: _response.error.statusCode,
            body: _response.error.body,
            rawResponse: _response.rawResponse
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new LangfuseAPIError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody,
          rawResponse: _response.rawResponse
        });
      case "timeout":
        throw new LangfuseAPITimeoutError(
          "Timeout exceeded when calling POST /api/public/annotation-queues/{queueId}/assignments."
        );
      case "unknown":
        throw new LangfuseAPIError({
          message: _response.error.errorMessage,
          rawResponse: _response.rawResponse
        });
    }
  }
  /**
   * Delete an assignment for a user to an annotation queue
   *
   * @param {string} queueId - The unique identifier of the annotation queue
   * @param {LangfuseAPI.AnnotationQueueAssignmentRequest} request
   * @param {AnnotationQueues.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link LangfuseAPI.Error}
   * @throws {@link LangfuseAPI.UnauthorizedError}
   * @throws {@link LangfuseAPI.AccessDeniedError}
   * @throws {@link LangfuseAPI.MethodNotAllowedError}
   * @throws {@link LangfuseAPI.NotFoundError}
   *
   * @example
   *     await client.annotationQueues.deleteQueueAssignment("queueId", {
   *         userId: "userId"
   *     })
   */
  deleteQueueAssignment(queueId, request, requestOptions) {
    return HttpResponsePromise.fromPromise(
      this.__deleteQueueAssignment(queueId, request, requestOptions)
    );
  }
  async __deleteQueueAssignment(queueId, request, requestOptions) {
    var _a2, _b, _c, _d, _e, _f, _g, _h;
    let _headers = mergeHeaders(
      (_a2 = this._options) == null ? void 0 : _a2.headers,
      mergeOnlyDefinedHeaders({
        Authorization: await this._getAuthorizationHeader(),
        "X-Langfuse-Sdk-Name": (_c = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkName) != null ? _c : (_b = this._options) == null ? void 0 : _b.xLangfuseSdkName,
        "X-Langfuse-Sdk-Version": (_e = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkVersion) != null ? _e : (_d = this._options) == null ? void 0 : _d.xLangfuseSdkVersion,
        "X-Langfuse-Public-Key": (_g = requestOptions == null ? void 0 : requestOptions.xLangfusePublicKey) != null ? _g : (_f = this._options) == null ? void 0 : _f.xLangfusePublicKey
      }),
      requestOptions == null ? void 0 : requestOptions.headers
    );
    const _response = await fetcher({
      url: url_exports.join(
        (_h = await Supplier.get(this._options.baseUrl)) != null ? _h : await Supplier.get(this._options.environment),
        `/api/public/annotation-queues/${encodeURIComponent(queueId)}/assignments`
      ),
      method: "DELETE",
      headers: _headers,
      contentType: "application/json",
      queryParameters: requestOptions == null ? void 0 : requestOptions.queryParams,
      requestType: "json",
      body: request,
      timeoutMs: (requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
      maxRetries: requestOptions == null ? void 0 : requestOptions.maxRetries,
      abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal
    });
    if (_response.ok) {
      return {
        data: _response.body,
        rawResponse: _response.rawResponse
      };
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 400:
          throw new Error2(
            _response.error.body,
            _response.rawResponse
          );
        case 401:
          throw new UnauthorizedError(
            _response.error.body,
            _response.rawResponse
          );
        case 403:
          throw new AccessDeniedError(
            _response.error.body,
            _response.rawResponse
          );
        case 405:
          throw new MethodNotAllowedError(
            _response.error.body,
            _response.rawResponse
          );
        case 404:
          throw new NotFoundError(
            _response.error.body,
            _response.rawResponse
          );
        default:
          throw new LangfuseAPIError({
            statusCode: _response.error.statusCode,
            body: _response.error.body,
            rawResponse: _response.rawResponse
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new LangfuseAPIError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody,
          rawResponse: _response.rawResponse
        });
      case "timeout":
        throw new LangfuseAPITimeoutError(
          "Timeout exceeded when calling DELETE /api/public/annotation-queues/{queueId}/assignments."
        );
      case "unknown":
        throw new LangfuseAPIError({
          message: _response.error.errorMessage,
          rawResponse: _response.rawResponse
        });
    }
  }
  async _getAuthorizationHeader() {
    const username = await Supplier.get(this._options.username);
    const password = await Supplier.get(this._options.password);
    if (username != null && password != null) {
      return BasicAuth.toAuthorizationHeader({
        username,
        password
      });
    }
    return void 0;
  }
};

// src/api/api/resources/blobStorageIntegrations/client/Client.ts
var BlobStorageIntegrations = class {
  constructor(_options) {
    this._options = _options;
  }
  /**
   * Get all blob storage integrations for the organization (requires organization-scoped API key)
   *
   * @param {BlobStorageIntegrations.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link LangfuseAPI.Error}
   * @throws {@link LangfuseAPI.UnauthorizedError}
   * @throws {@link LangfuseAPI.AccessDeniedError}
   * @throws {@link LangfuseAPI.MethodNotAllowedError}
   * @throws {@link LangfuseAPI.NotFoundError}
   *
   * @example
   *     await client.blobStorageIntegrations.getBlobStorageIntegrations()
   */
  getBlobStorageIntegrations(requestOptions) {
    return HttpResponsePromise.fromPromise(
      this.__getBlobStorageIntegrations(requestOptions)
    );
  }
  async __getBlobStorageIntegrations(requestOptions) {
    var _a2, _b, _c, _d, _e, _f, _g, _h;
    let _headers = mergeHeaders(
      (_a2 = this._options) == null ? void 0 : _a2.headers,
      mergeOnlyDefinedHeaders({
        Authorization: await this._getAuthorizationHeader(),
        "X-Langfuse-Sdk-Name": (_c = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkName) != null ? _c : (_b = this._options) == null ? void 0 : _b.xLangfuseSdkName,
        "X-Langfuse-Sdk-Version": (_e = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkVersion) != null ? _e : (_d = this._options) == null ? void 0 : _d.xLangfuseSdkVersion,
        "X-Langfuse-Public-Key": (_g = requestOptions == null ? void 0 : requestOptions.xLangfusePublicKey) != null ? _g : (_f = this._options) == null ? void 0 : _f.xLangfusePublicKey
      }),
      requestOptions == null ? void 0 : requestOptions.headers
    );
    const _response = await fetcher({
      url: url_exports.join(
        (_h = await Supplier.get(this._options.baseUrl)) != null ? _h : await Supplier.get(this._options.environment),
        "/api/public/integrations/blob-storage"
      ),
      method: "GET",
      headers: _headers,
      queryParameters: requestOptions == null ? void 0 : requestOptions.queryParams,
      timeoutMs: (requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
      maxRetries: requestOptions == null ? void 0 : requestOptions.maxRetries,
      abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal
    });
    if (_response.ok) {
      return {
        data: _response.body,
        rawResponse: _response.rawResponse
      };
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 400:
          throw new Error2(
            _response.error.body,
            _response.rawResponse
          );
        case 401:
          throw new UnauthorizedError(
            _response.error.body,
            _response.rawResponse
          );
        case 403:
          throw new AccessDeniedError(
            _response.error.body,
            _response.rawResponse
          );
        case 405:
          throw new MethodNotAllowedError(
            _response.error.body,
            _response.rawResponse
          );
        case 404:
          throw new NotFoundError(
            _response.error.body,
            _response.rawResponse
          );
        default:
          throw new LangfuseAPIError({
            statusCode: _response.error.statusCode,
            body: _response.error.body,
            rawResponse: _response.rawResponse
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new LangfuseAPIError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody,
          rawResponse: _response.rawResponse
        });
      case "timeout":
        throw new LangfuseAPITimeoutError(
          "Timeout exceeded when calling GET /api/public/integrations/blob-storage."
        );
      case "unknown":
        throw new LangfuseAPIError({
          message: _response.error.errorMessage,
          rawResponse: _response.rawResponse
        });
    }
  }
  /**
   * Create or update a blob storage integration for a specific project (requires organization-scoped API key). The configuration is validated by performing a test upload to the bucket.
   *
   * @param {LangfuseAPI.CreateBlobStorageIntegrationRequest} request
   * @param {BlobStorageIntegrations.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link LangfuseAPI.Error}
   * @throws {@link LangfuseAPI.UnauthorizedError}
   * @throws {@link LangfuseAPI.AccessDeniedError}
   * @throws {@link LangfuseAPI.MethodNotAllowedError}
   * @throws {@link LangfuseAPI.NotFoundError}
   *
   * @example
   *     await client.blobStorageIntegrations.upsertBlobStorageIntegration({
   *         projectId: "projectId",
   *         type: "S3",
   *         bucketName: "bucketName",
   *         endpoint: undefined,
   *         region: "region",
   *         accessKeyId: undefined,
   *         secretAccessKey: undefined,
   *         prefix: undefined,
   *         exportFrequency: "hourly",
   *         enabled: true,
   *         forcePathStyle: true,
   *         fileType: "JSON",
   *         exportMode: "FULL_HISTORY",
   *         exportStartDate: undefined
   *     })
   */
  upsertBlobStorageIntegration(request, requestOptions) {
    return HttpResponsePromise.fromPromise(
      this.__upsertBlobStorageIntegration(request, requestOptions)
    );
  }
  async __upsertBlobStorageIntegration(request, requestOptions) {
    var _a2, _b, _c, _d, _e, _f, _g, _h;
    let _headers = mergeHeaders(
      (_a2 = this._options) == null ? void 0 : _a2.headers,
      mergeOnlyDefinedHeaders({
        Authorization: await this._getAuthorizationHeader(),
        "X-Langfuse-Sdk-Name": (_c = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkName) != null ? _c : (_b = this._options) == null ? void 0 : _b.xLangfuseSdkName,
        "X-Langfuse-Sdk-Version": (_e = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkVersion) != null ? _e : (_d = this._options) == null ? void 0 : _d.xLangfuseSdkVersion,
        "X-Langfuse-Public-Key": (_g = requestOptions == null ? void 0 : requestOptions.xLangfusePublicKey) != null ? _g : (_f = this._options) == null ? void 0 : _f.xLangfusePublicKey
      }),
      requestOptions == null ? void 0 : requestOptions.headers
    );
    const _response = await fetcher({
      url: url_exports.join(
        (_h = await Supplier.get(this._options.baseUrl)) != null ? _h : await Supplier.get(this._options.environment),
        "/api/public/integrations/blob-storage"
      ),
      method: "PUT",
      headers: _headers,
      contentType: "application/json",
      queryParameters: requestOptions == null ? void 0 : requestOptions.queryParams,
      requestType: "json",
      body: request,
      timeoutMs: (requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
      maxRetries: requestOptions == null ? void 0 : requestOptions.maxRetries,
      abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal
    });
    if (_response.ok) {
      return {
        data: _response.body,
        rawResponse: _response.rawResponse
      };
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 400:
          throw new Error2(
            _response.error.body,
            _response.rawResponse
          );
        case 401:
          throw new UnauthorizedError(
            _response.error.body,
            _response.rawResponse
          );
        case 403:
          throw new AccessDeniedError(
            _response.error.body,
            _response.rawResponse
          );
        case 405:
          throw new MethodNotAllowedError(
            _response.error.body,
            _response.rawResponse
          );
        case 404:
          throw new NotFoundError(
            _response.error.body,
            _response.rawResponse
          );
        default:
          throw new LangfuseAPIError({
            statusCode: _response.error.statusCode,
            body: _response.error.body,
            rawResponse: _response.rawResponse
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new LangfuseAPIError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody,
          rawResponse: _response.rawResponse
        });
      case "timeout":
        throw new LangfuseAPITimeoutError(
          "Timeout exceeded when calling PUT /api/public/integrations/blob-storage."
        );
      case "unknown":
        throw new LangfuseAPIError({
          message: _response.error.errorMessage,
          rawResponse: _response.rawResponse
        });
    }
  }
  /**
   * Delete a blob storage integration by ID (requires organization-scoped API key)
   *
   * @param {string} id
   * @param {BlobStorageIntegrations.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link LangfuseAPI.Error}
   * @throws {@link LangfuseAPI.UnauthorizedError}
   * @throws {@link LangfuseAPI.AccessDeniedError}
   * @throws {@link LangfuseAPI.MethodNotAllowedError}
   * @throws {@link LangfuseAPI.NotFoundError}
   *
   * @example
   *     await client.blobStorageIntegrations.deleteBlobStorageIntegration("id")
   */
  deleteBlobStorageIntegration(id, requestOptions) {
    return HttpResponsePromise.fromPromise(
      this.__deleteBlobStorageIntegration(id, requestOptions)
    );
  }
  async __deleteBlobStorageIntegration(id, requestOptions) {
    var _a2, _b, _c, _d, _e, _f, _g, _h;
    let _headers = mergeHeaders(
      (_a2 = this._options) == null ? void 0 : _a2.headers,
      mergeOnlyDefinedHeaders({
        Authorization: await this._getAuthorizationHeader(),
        "X-Langfuse-Sdk-Name": (_c = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkName) != null ? _c : (_b = this._options) == null ? void 0 : _b.xLangfuseSdkName,
        "X-Langfuse-Sdk-Version": (_e = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkVersion) != null ? _e : (_d = this._options) == null ? void 0 : _d.xLangfuseSdkVersion,
        "X-Langfuse-Public-Key": (_g = requestOptions == null ? void 0 : requestOptions.xLangfusePublicKey) != null ? _g : (_f = this._options) == null ? void 0 : _f.xLangfusePublicKey
      }),
      requestOptions == null ? void 0 : requestOptions.headers
    );
    const _response = await fetcher({
      url: url_exports.join(
        (_h = await Supplier.get(this._options.baseUrl)) != null ? _h : await Supplier.get(this._options.environment),
        `/api/public/integrations/blob-storage/${encodeURIComponent(id)}`
      ),
      method: "DELETE",
      headers: _headers,
      queryParameters: requestOptions == null ? void 0 : requestOptions.queryParams,
      timeoutMs: (requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
      maxRetries: requestOptions == null ? void 0 : requestOptions.maxRetries,
      abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal
    });
    if (_response.ok) {
      return {
        data: _response.body,
        rawResponse: _response.rawResponse
      };
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 400:
          throw new Error2(
            _response.error.body,
            _response.rawResponse
          );
        case 401:
          throw new UnauthorizedError(
            _response.error.body,
            _response.rawResponse
          );
        case 403:
          throw new AccessDeniedError(
            _response.error.body,
            _response.rawResponse
          );
        case 405:
          throw new MethodNotAllowedError(
            _response.error.body,
            _response.rawResponse
          );
        case 404:
          throw new NotFoundError(
            _response.error.body,
            _response.rawResponse
          );
        default:
          throw new LangfuseAPIError({
            statusCode: _response.error.statusCode,
            body: _response.error.body,
            rawResponse: _response.rawResponse
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new LangfuseAPIError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody,
          rawResponse: _response.rawResponse
        });
      case "timeout":
        throw new LangfuseAPITimeoutError(
          "Timeout exceeded when calling DELETE /api/public/integrations/blob-storage/{id}."
        );
      case "unknown":
        throw new LangfuseAPIError({
          message: _response.error.errorMessage,
          rawResponse: _response.rawResponse
        });
    }
  }
  async _getAuthorizationHeader() {
    const username = await Supplier.get(this._options.username);
    const password = await Supplier.get(this._options.password);
    if (username != null && password != null) {
      return BasicAuth.toAuthorizationHeader({
        username,
        password
      });
    }
    return void 0;
  }
};

// src/api/api/resources/comments/client/Client.ts
var Comments = class {
  constructor(_options) {
    this._options = _options;
  }
  /**
   * Create a comment. Comments may be attached to different object types (trace, observation, session, prompt).
   *
   * @param {LangfuseAPI.CreateCommentRequest} request
   * @param {Comments.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link LangfuseAPI.Error}
   * @throws {@link LangfuseAPI.UnauthorizedError}
   * @throws {@link LangfuseAPI.AccessDeniedError}
   * @throws {@link LangfuseAPI.MethodNotAllowedError}
   * @throws {@link LangfuseAPI.NotFoundError}
   *
   * @example
   *     await client.comments.create({
   *         projectId: "projectId",
   *         objectType: "objectType",
   *         objectId: "objectId",
   *         content: "content",
   *         authorUserId: undefined
   *     })
   */
  create(request, requestOptions) {
    return HttpResponsePromise.fromPromise(
      this.__create(request, requestOptions)
    );
  }
  async __create(request, requestOptions) {
    var _a2, _b, _c, _d, _e, _f, _g, _h;
    let _headers = mergeHeaders(
      (_a2 = this._options) == null ? void 0 : _a2.headers,
      mergeOnlyDefinedHeaders({
        Authorization: await this._getAuthorizationHeader(),
        "X-Langfuse-Sdk-Name": (_c = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkName) != null ? _c : (_b = this._options) == null ? void 0 : _b.xLangfuseSdkName,
        "X-Langfuse-Sdk-Version": (_e = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkVersion) != null ? _e : (_d = this._options) == null ? void 0 : _d.xLangfuseSdkVersion,
        "X-Langfuse-Public-Key": (_g = requestOptions == null ? void 0 : requestOptions.xLangfusePublicKey) != null ? _g : (_f = this._options) == null ? void 0 : _f.xLangfusePublicKey
      }),
      requestOptions == null ? void 0 : requestOptions.headers
    );
    const _response = await fetcher({
      url: url_exports.join(
        (_h = await Supplier.get(this._options.baseUrl)) != null ? _h : await Supplier.get(this._options.environment),
        "/api/public/comments"
      ),
      method: "POST",
      headers: _headers,
      contentType: "application/json",
      queryParameters: requestOptions == null ? void 0 : requestOptions.queryParams,
      requestType: "json",
      body: request,
      timeoutMs: (requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
      maxRetries: requestOptions == null ? void 0 : requestOptions.maxRetries,
      abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal
    });
    if (_response.ok) {
      return {
        data: _response.body,
        rawResponse: _response.rawResponse
      };
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 400:
          throw new Error2(
            _response.error.body,
            _response.rawResponse
          );
        case 401:
          throw new UnauthorizedError(
            _response.error.body,
            _response.rawResponse
          );
        case 403:
          throw new AccessDeniedError(
            _response.error.body,
            _response.rawResponse
          );
        case 405:
          throw new MethodNotAllowedError(
            _response.error.body,
            _response.rawResponse
          );
        case 404:
          throw new NotFoundError(
            _response.error.body,
            _response.rawResponse
          );
        default:
          throw new LangfuseAPIError({
            statusCode: _response.error.statusCode,
            body: _response.error.body,
            rawResponse: _response.rawResponse
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new LangfuseAPIError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody,
          rawResponse: _response.rawResponse
        });
      case "timeout":
        throw new LangfuseAPITimeoutError(
          "Timeout exceeded when calling POST /api/public/comments."
        );
      case "unknown":
        throw new LangfuseAPIError({
          message: _response.error.errorMessage,
          rawResponse: _response.rawResponse
        });
    }
  }
  /**
   * Get all comments
   *
   * @param {LangfuseAPI.GetCommentsRequest} request
   * @param {Comments.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link LangfuseAPI.Error}
   * @throws {@link LangfuseAPI.UnauthorizedError}
   * @throws {@link LangfuseAPI.AccessDeniedError}
   * @throws {@link LangfuseAPI.MethodNotAllowedError}
   * @throws {@link LangfuseAPI.NotFoundError}
   *
   * @example
   *     await client.comments.get()
   */
  get(request = {}, requestOptions) {
    return HttpResponsePromise.fromPromise(
      this.__get(request, requestOptions)
    );
  }
  async __get(request = {}, requestOptions) {
    var _a2, _b, _c, _d, _e, _f, _g, _h;
    const { page, limit, objectType, objectId, authorUserId } = request;
    const _queryParams = {};
    if (page != null) {
      _queryParams["page"] = page.toString();
    }
    if (limit != null) {
      _queryParams["limit"] = limit.toString();
    }
    if (objectType != null) {
      _queryParams["objectType"] = objectType;
    }
    if (objectId != null) {
      _queryParams["objectId"] = objectId;
    }
    if (authorUserId != null) {
      _queryParams["authorUserId"] = authorUserId;
    }
    let _headers = mergeHeaders(
      (_a2 = this._options) == null ? void 0 : _a2.headers,
      mergeOnlyDefinedHeaders({
        Authorization: await this._getAuthorizationHeader(),
        "X-Langfuse-Sdk-Name": (_c = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkName) != null ? _c : (_b = this._options) == null ? void 0 : _b.xLangfuseSdkName,
        "X-Langfuse-Sdk-Version": (_e = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkVersion) != null ? _e : (_d = this._options) == null ? void 0 : _d.xLangfuseSdkVersion,
        "X-Langfuse-Public-Key": (_g = requestOptions == null ? void 0 : requestOptions.xLangfusePublicKey) != null ? _g : (_f = this._options) == null ? void 0 : _f.xLangfusePublicKey
      }),
      requestOptions == null ? void 0 : requestOptions.headers
    );
    const _response = await fetcher({
      url: url_exports.join(
        (_h = await Supplier.get(this._options.baseUrl)) != null ? _h : await Supplier.get(this._options.environment),
        "/api/public/comments"
      ),
      method: "GET",
      headers: _headers,
      queryParameters: { ..._queryParams, ...requestOptions == null ? void 0 : requestOptions.queryParams },
      timeoutMs: (requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
      maxRetries: requestOptions == null ? void 0 : requestOptions.maxRetries,
      abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal
    });
    if (_response.ok) {
      return {
        data: _response.body,
        rawResponse: _response.rawResponse
      };
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 400:
          throw new Error2(
            _response.error.body,
            _response.rawResponse
          );
        case 401:
          throw new UnauthorizedError(
            _response.error.body,
            _response.rawResponse
          );
        case 403:
          throw new AccessDeniedError(
            _response.error.body,
            _response.rawResponse
          );
        case 405:
          throw new MethodNotAllowedError(
            _response.error.body,
            _response.rawResponse
          );
        case 404:
          throw new NotFoundError(
            _response.error.body,
            _response.rawResponse
          );
        default:
          throw new LangfuseAPIError({
            statusCode: _response.error.statusCode,
            body: _response.error.body,
            rawResponse: _response.rawResponse
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new LangfuseAPIError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody,
          rawResponse: _response.rawResponse
        });
      case "timeout":
        throw new LangfuseAPITimeoutError(
          "Timeout exceeded when calling GET /api/public/comments."
        );
      case "unknown":
        throw new LangfuseAPIError({
          message: _response.error.errorMessage,
          rawResponse: _response.rawResponse
        });
    }
  }
  /**
   * Get a comment by id
   *
   * @param {string} commentId - The unique langfuse identifier of a comment
   * @param {Comments.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link LangfuseAPI.Error}
   * @throws {@link LangfuseAPI.UnauthorizedError}
   * @throws {@link LangfuseAPI.AccessDeniedError}
   * @throws {@link LangfuseAPI.MethodNotAllowedError}
   * @throws {@link LangfuseAPI.NotFoundError}
   *
   * @example
   *     await client.comments.getById("commentId")
   */
  getById(commentId, requestOptions) {
    return HttpResponsePromise.fromPromise(
      this.__getById(commentId, requestOptions)
    );
  }
  async __getById(commentId, requestOptions) {
    var _a2, _b, _c, _d, _e, _f, _g, _h;
    let _headers = mergeHeaders(
      (_a2 = this._options) == null ? void 0 : _a2.headers,
      mergeOnlyDefinedHeaders({
        Authorization: await this._getAuthorizationHeader(),
        "X-Langfuse-Sdk-Name": (_c = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkName) != null ? _c : (_b = this._options) == null ? void 0 : _b.xLangfuseSdkName,
        "X-Langfuse-Sdk-Version": (_e = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkVersion) != null ? _e : (_d = this._options) == null ? void 0 : _d.xLangfuseSdkVersion,
        "X-Langfuse-Public-Key": (_g = requestOptions == null ? void 0 : requestOptions.xLangfusePublicKey) != null ? _g : (_f = this._options) == null ? void 0 : _f.xLangfusePublicKey
      }),
      requestOptions == null ? void 0 : requestOptions.headers
    );
    const _response = await fetcher({
      url: url_exports.join(
        (_h = await Supplier.get(this._options.baseUrl)) != null ? _h : await Supplier.get(this._options.environment),
        `/api/public/comments/${encodeURIComponent(commentId)}`
      ),
      method: "GET",
      headers: _headers,
      queryParameters: requestOptions == null ? void 0 : requestOptions.queryParams,
      timeoutMs: (requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
      maxRetries: requestOptions == null ? void 0 : requestOptions.maxRetries,
      abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal
    });
    if (_response.ok) {
      return {
        data: _response.body,
        rawResponse: _response.rawResponse
      };
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 400:
          throw new Error2(
            _response.error.body,
            _response.rawResponse
          );
        case 401:
          throw new UnauthorizedError(
            _response.error.body,
            _response.rawResponse
          );
        case 403:
          throw new AccessDeniedError(
            _response.error.body,
            _response.rawResponse
          );
        case 405:
          throw new MethodNotAllowedError(
            _response.error.body,
            _response.rawResponse
          );
        case 404:
          throw new NotFoundError(
            _response.error.body,
            _response.rawResponse
          );
        default:
          throw new LangfuseAPIError({
            statusCode: _response.error.statusCode,
            body: _response.error.body,
            rawResponse: _response.rawResponse
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new LangfuseAPIError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody,
          rawResponse: _response.rawResponse
        });
      case "timeout":
        throw new LangfuseAPITimeoutError(
          "Timeout exceeded when calling GET /api/public/comments/{commentId}."
        );
      case "unknown":
        throw new LangfuseAPIError({
          message: _response.error.errorMessage,
          rawResponse: _response.rawResponse
        });
    }
  }
  async _getAuthorizationHeader() {
    const username = await Supplier.get(this._options.username);
    const password = await Supplier.get(this._options.password);
    if (username != null && password != null) {
      return BasicAuth.toAuthorizationHeader({
        username,
        password
      });
    }
    return void 0;
  }
};

// src/api/api/resources/datasetItems/client/Client.ts
var DatasetItems = class {
  constructor(_options) {
    this._options = _options;
  }
  /**
   * Create a dataset item
   *
   * @param {LangfuseAPI.CreateDatasetItemRequest} request
   * @param {DatasetItems.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link LangfuseAPI.Error}
   * @throws {@link LangfuseAPI.UnauthorizedError}
   * @throws {@link LangfuseAPI.AccessDeniedError}
   * @throws {@link LangfuseAPI.MethodNotAllowedError}
   * @throws {@link LangfuseAPI.NotFoundError}
   *
   * @example
   *     await client.datasetItems.create({
   *         datasetName: "datasetName",
   *         input: undefined,
   *         expectedOutput: undefined,
   *         metadata: undefined,
   *         sourceTraceId: undefined,
   *         sourceObservationId: undefined,
   *         id: undefined,
   *         status: undefined
   *     })
   */
  create(request, requestOptions) {
    return HttpResponsePromise.fromPromise(
      this.__create(request, requestOptions)
    );
  }
  async __create(request, requestOptions) {
    var _a2, _b, _c, _d, _e, _f, _g, _h;
    let _headers = mergeHeaders(
      (_a2 = this._options) == null ? void 0 : _a2.headers,
      mergeOnlyDefinedHeaders({
        Authorization: await this._getAuthorizationHeader(),
        "X-Langfuse-Sdk-Name": (_c = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkName) != null ? _c : (_b = this._options) == null ? void 0 : _b.xLangfuseSdkName,
        "X-Langfuse-Sdk-Version": (_e = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkVersion) != null ? _e : (_d = this._options) == null ? void 0 : _d.xLangfuseSdkVersion,
        "X-Langfuse-Public-Key": (_g = requestOptions == null ? void 0 : requestOptions.xLangfusePublicKey) != null ? _g : (_f = this._options) == null ? void 0 : _f.xLangfusePublicKey
      }),
      requestOptions == null ? void 0 : requestOptions.headers
    );
    const _response = await fetcher({
      url: url_exports.join(
        (_h = await Supplier.get(this._options.baseUrl)) != null ? _h : await Supplier.get(this._options.environment),
        "/api/public/dataset-items"
      ),
      method: "POST",
      headers: _headers,
      contentType: "application/json",
      queryParameters: requestOptions == null ? void 0 : requestOptions.queryParams,
      requestType: "json",
      body: request,
      timeoutMs: (requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
      maxRetries: requestOptions == null ? void 0 : requestOptions.maxRetries,
      abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal
    });
    if (_response.ok) {
      return {
        data: _response.body,
        rawResponse: _response.rawResponse
      };
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 400:
          throw new Error2(
            _response.error.body,
            _response.rawResponse
          );
        case 401:
          throw new UnauthorizedError(
            _response.error.body,
            _response.rawResponse
          );
        case 403:
          throw new AccessDeniedError(
            _response.error.body,
            _response.rawResponse
          );
        case 405:
          throw new MethodNotAllowedError(
            _response.error.body,
            _response.rawResponse
          );
        case 404:
          throw new NotFoundError(
            _response.error.body,
            _response.rawResponse
          );
        default:
          throw new LangfuseAPIError({
            statusCode: _response.error.statusCode,
            body: _response.error.body,
            rawResponse: _response.rawResponse
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new LangfuseAPIError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody,
          rawResponse: _response.rawResponse
        });
      case "timeout":
        throw new LangfuseAPITimeoutError(
          "Timeout exceeded when calling POST /api/public/dataset-items."
        );
      case "unknown":
        throw new LangfuseAPIError({
          message: _response.error.errorMessage,
          rawResponse: _response.rawResponse
        });
    }
  }
  /**
   * Get a dataset item
   *
   * @param {string} id
   * @param {DatasetItems.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link LangfuseAPI.Error}
   * @throws {@link LangfuseAPI.UnauthorizedError}
   * @throws {@link LangfuseAPI.AccessDeniedError}
   * @throws {@link LangfuseAPI.MethodNotAllowedError}
   * @throws {@link LangfuseAPI.NotFoundError}
   *
   * @example
   *     await client.datasetItems.get("id")
   */
  get(id, requestOptions) {
    return HttpResponsePromise.fromPromise(this.__get(id, requestOptions));
  }
  async __get(id, requestOptions) {
    var _a2, _b, _c, _d, _e, _f, _g, _h;
    let _headers = mergeHeaders(
      (_a2 = this._options) == null ? void 0 : _a2.headers,
      mergeOnlyDefinedHeaders({
        Authorization: await this._getAuthorizationHeader(),
        "X-Langfuse-Sdk-Name": (_c = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkName) != null ? _c : (_b = this._options) == null ? void 0 : _b.xLangfuseSdkName,
        "X-Langfuse-Sdk-Version": (_e = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkVersion) != null ? _e : (_d = this._options) == null ? void 0 : _d.xLangfuseSdkVersion,
        "X-Langfuse-Public-Key": (_g = requestOptions == null ? void 0 : requestOptions.xLangfusePublicKey) != null ? _g : (_f = this._options) == null ? void 0 : _f.xLangfusePublicKey
      }),
      requestOptions == null ? void 0 : requestOptions.headers
    );
    const _response = await fetcher({
      url: url_exports.join(
        (_h = await Supplier.get(this._options.baseUrl)) != null ? _h : await Supplier.get(this._options.environment),
        `/api/public/dataset-items/${encodeURIComponent(id)}`
      ),
      method: "GET",
      headers: _headers,
      queryParameters: requestOptions == null ? void 0 : requestOptions.queryParams,
      timeoutMs: (requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
      maxRetries: requestOptions == null ? void 0 : requestOptions.maxRetries,
      abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal
    });
    if (_response.ok) {
      return {
        data: _response.body,
        rawResponse: _response.rawResponse
      };
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 400:
          throw new Error2(
            _response.error.body,
            _response.rawResponse
          );
        case 401:
          throw new UnauthorizedError(
            _response.error.body,
            _response.rawResponse
          );
        case 403:
          throw new AccessDeniedError(
            _response.error.body,
            _response.rawResponse
          );
        case 405:
          throw new MethodNotAllowedError(
            _response.error.body,
            _response.rawResponse
          );
        case 404:
          throw new NotFoundError(
            _response.error.body,
            _response.rawResponse
          );
        default:
          throw new LangfuseAPIError({
            statusCode: _response.error.statusCode,
            body: _response.error.body,
            rawResponse: _response.rawResponse
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new LangfuseAPIError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody,
          rawResponse: _response.rawResponse
        });
      case "timeout":
        throw new LangfuseAPITimeoutError(
          "Timeout exceeded when calling GET /api/public/dataset-items/{id}."
        );
      case "unknown":
        throw new LangfuseAPIError({
          message: _response.error.errorMessage,
          rawResponse: _response.rawResponse
        });
    }
  }
  /**
   * Get dataset items. Optionally specify a version to get the items as they existed at that point in time.
   * Note: If version parameter is provided, datasetName must also be provided.
   *
   * @param {LangfuseAPI.GetDatasetItemsRequest} request
   * @param {DatasetItems.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link LangfuseAPI.Error}
   * @throws {@link LangfuseAPI.UnauthorizedError}
   * @throws {@link LangfuseAPI.AccessDeniedError}
   * @throws {@link LangfuseAPI.MethodNotAllowedError}
   * @throws {@link LangfuseAPI.NotFoundError}
   *
   * @example
   *     await client.datasetItems.list()
   */
  list(request = {}, requestOptions) {
    return HttpResponsePromise.fromPromise(
      this.__list(request, requestOptions)
    );
  }
  async __list(request = {}, requestOptions) {
    var _a2, _b, _c, _d, _e, _f, _g, _h;
    const {
      datasetName,
      sourceTraceId,
      sourceObservationId,
      version,
      page,
      limit
    } = request;
    const _queryParams = {};
    if (datasetName != null) {
      _queryParams["datasetName"] = datasetName;
    }
    if (sourceTraceId != null) {
      _queryParams["sourceTraceId"] = sourceTraceId;
    }
    if (sourceObservationId != null) {
      _queryParams["sourceObservationId"] = sourceObservationId;
    }
    if (version != null) {
      _queryParams["version"] = version;
    }
    if (page != null) {
      _queryParams["page"] = page.toString();
    }
    if (limit != null) {
      _queryParams["limit"] = limit.toString();
    }
    let _headers = mergeHeaders(
      (_a2 = this._options) == null ? void 0 : _a2.headers,
      mergeOnlyDefinedHeaders({
        Authorization: await this._getAuthorizationHeader(),
        "X-Langfuse-Sdk-Name": (_c = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkName) != null ? _c : (_b = this._options) == null ? void 0 : _b.xLangfuseSdkName,
        "X-Langfuse-Sdk-Version": (_e = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkVersion) != null ? _e : (_d = this._options) == null ? void 0 : _d.xLangfuseSdkVersion,
        "X-Langfuse-Public-Key": (_g = requestOptions == null ? void 0 : requestOptions.xLangfusePublicKey) != null ? _g : (_f = this._options) == null ? void 0 : _f.xLangfusePublicKey
      }),
      requestOptions == null ? void 0 : requestOptions.headers
    );
    const _response = await fetcher({
      url: url_exports.join(
        (_h = await Supplier.get(this._options.baseUrl)) != null ? _h : await Supplier.get(this._options.environment),
        "/api/public/dataset-items"
      ),
      method: "GET",
      headers: _headers,
      queryParameters: { ..._queryParams, ...requestOptions == null ? void 0 : requestOptions.queryParams },
      timeoutMs: (requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
      maxRetries: requestOptions == null ? void 0 : requestOptions.maxRetries,
      abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal
    });
    if (_response.ok) {
      return {
        data: _response.body,
        rawResponse: _response.rawResponse
      };
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 400:
          throw new Error2(
            _response.error.body,
            _response.rawResponse
          );
        case 401:
          throw new UnauthorizedError(
            _response.error.body,
            _response.rawResponse
          );
        case 403:
          throw new AccessDeniedError(
            _response.error.body,
            _response.rawResponse
          );
        case 405:
          throw new MethodNotAllowedError(
            _response.error.body,
            _response.rawResponse
          );
        case 404:
          throw new NotFoundError(
            _response.error.body,
            _response.rawResponse
          );
        default:
          throw new LangfuseAPIError({
            statusCode: _response.error.statusCode,
            body: _response.error.body,
            rawResponse: _response.rawResponse
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new LangfuseAPIError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody,
          rawResponse: _response.rawResponse
        });
      case "timeout":
        throw new LangfuseAPITimeoutError(
          "Timeout exceeded when calling GET /api/public/dataset-items."
        );
      case "unknown":
        throw new LangfuseAPIError({
          message: _response.error.errorMessage,
          rawResponse: _response.rawResponse
        });
    }
  }
  /**
   * Delete a dataset item and all its run items. This action is irreversible.
   *
   * @param {string} id
   * @param {DatasetItems.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link LangfuseAPI.Error}
   * @throws {@link LangfuseAPI.UnauthorizedError}
   * @throws {@link LangfuseAPI.AccessDeniedError}
   * @throws {@link LangfuseAPI.MethodNotAllowedError}
   * @throws {@link LangfuseAPI.NotFoundError}
   *
   * @example
   *     await client.datasetItems.delete("id")
   */
  delete(id, requestOptions) {
    return HttpResponsePromise.fromPromise(
      this.__delete(id, requestOptions)
    );
  }
  async __delete(id, requestOptions) {
    var _a2, _b, _c, _d, _e, _f, _g, _h;
    let _headers = mergeHeaders(
      (_a2 = this._options) == null ? void 0 : _a2.headers,
      mergeOnlyDefinedHeaders({
        Authorization: await this._getAuthorizationHeader(),
        "X-Langfuse-Sdk-Name": (_c = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkName) != null ? _c : (_b = this._options) == null ? void 0 : _b.xLangfuseSdkName,
        "X-Langfuse-Sdk-Version": (_e = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkVersion) != null ? _e : (_d = this._options) == null ? void 0 : _d.xLangfuseSdkVersion,
        "X-Langfuse-Public-Key": (_g = requestOptions == null ? void 0 : requestOptions.xLangfusePublicKey) != null ? _g : (_f = this._options) == null ? void 0 : _f.xLangfusePublicKey
      }),
      requestOptions == null ? void 0 : requestOptions.headers
    );
    const _response = await fetcher({
      url: url_exports.join(
        (_h = await Supplier.get(this._options.baseUrl)) != null ? _h : await Supplier.get(this._options.environment),
        `/api/public/dataset-items/${encodeURIComponent(id)}`
      ),
      method: "DELETE",
      headers: _headers,
      queryParameters: requestOptions == null ? void 0 : requestOptions.queryParams,
      timeoutMs: (requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
      maxRetries: requestOptions == null ? void 0 : requestOptions.maxRetries,
      abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal
    });
    if (_response.ok) {
      return {
        data: _response.body,
        rawResponse: _response.rawResponse
      };
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 400:
          throw new Error2(
            _response.error.body,
            _response.rawResponse
          );
        case 401:
          throw new UnauthorizedError(
            _response.error.body,
            _response.rawResponse
          );
        case 403:
          throw new AccessDeniedError(
            _response.error.body,
            _response.rawResponse
          );
        case 405:
          throw new MethodNotAllowedError(
            _response.error.body,
            _response.rawResponse
          );
        case 404:
          throw new NotFoundError(
            _response.error.body,
            _response.rawResponse
          );
        default:
          throw new LangfuseAPIError({
            statusCode: _response.error.statusCode,
            body: _response.error.body,
            rawResponse: _response.rawResponse
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new LangfuseAPIError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody,
          rawResponse: _response.rawResponse
        });
      case "timeout":
        throw new LangfuseAPITimeoutError(
          "Timeout exceeded when calling DELETE /api/public/dataset-items/{id}."
        );
      case "unknown":
        throw new LangfuseAPIError({
          message: _response.error.errorMessage,
          rawResponse: _response.rawResponse
        });
    }
  }
  async _getAuthorizationHeader() {
    const username = await Supplier.get(this._options.username);
    const password = await Supplier.get(this._options.password);
    if (username != null && password != null) {
      return BasicAuth.toAuthorizationHeader({
        username,
        password
      });
    }
    return void 0;
  }
};

// src/api/api/resources/datasetRunItems/client/Client.ts
var DatasetRunItems = class {
  constructor(_options) {
    this._options = _options;
  }
  /**
   * Create a dataset run item
   *
   * @param {LangfuseAPI.CreateDatasetRunItemRequest} request
   * @param {DatasetRunItems.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link LangfuseAPI.Error}
   * @throws {@link LangfuseAPI.UnauthorizedError}
   * @throws {@link LangfuseAPI.AccessDeniedError}
   * @throws {@link LangfuseAPI.MethodNotAllowedError}
   * @throws {@link LangfuseAPI.NotFoundError}
   *
   * @example
   *     await client.datasetRunItems.create({
   *         runName: "runName",
   *         runDescription: undefined,
   *         metadata: undefined,
   *         datasetItemId: "datasetItemId",
   *         observationId: undefined,
   *         traceId: undefined,
   *         datasetVersion: undefined
   *     })
   */
  create(request, requestOptions) {
    return HttpResponsePromise.fromPromise(
      this.__create(request, requestOptions)
    );
  }
  async __create(request, requestOptions) {
    var _a2, _b, _c, _d, _e, _f, _g, _h;
    let _headers = mergeHeaders(
      (_a2 = this._options) == null ? void 0 : _a2.headers,
      mergeOnlyDefinedHeaders({
        Authorization: await this._getAuthorizationHeader(),
        "X-Langfuse-Sdk-Name": (_c = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkName) != null ? _c : (_b = this._options) == null ? void 0 : _b.xLangfuseSdkName,
        "X-Langfuse-Sdk-Version": (_e = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkVersion) != null ? _e : (_d = this._options) == null ? void 0 : _d.xLangfuseSdkVersion,
        "X-Langfuse-Public-Key": (_g = requestOptions == null ? void 0 : requestOptions.xLangfusePublicKey) != null ? _g : (_f = this._options) == null ? void 0 : _f.xLangfusePublicKey
      }),
      requestOptions == null ? void 0 : requestOptions.headers
    );
    const _response = await fetcher({
      url: url_exports.join(
        (_h = await Supplier.get(this._options.baseUrl)) != null ? _h : await Supplier.get(this._options.environment),
        "/api/public/dataset-run-items"
      ),
      method: "POST",
      headers: _headers,
      contentType: "application/json",
      queryParameters: requestOptions == null ? void 0 : requestOptions.queryParams,
      requestType: "json",
      body: request,
      timeoutMs: (requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
      maxRetries: requestOptions == null ? void 0 : requestOptions.maxRetries,
      abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal
    });
    if (_response.ok) {
      return {
        data: _response.body,
        rawResponse: _response.rawResponse
      };
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 400:
          throw new Error2(
            _response.error.body,
            _response.rawResponse
          );
        case 401:
          throw new UnauthorizedError(
            _response.error.body,
            _response.rawResponse
          );
        case 403:
          throw new AccessDeniedError(
            _response.error.body,
            _response.rawResponse
          );
        case 405:
          throw new MethodNotAllowedError(
            _response.error.body,
            _response.rawResponse
          );
        case 404:
          throw new NotFoundError(
            _response.error.body,
            _response.rawResponse
          );
        default:
          throw new LangfuseAPIError({
            statusCode: _response.error.statusCode,
            body: _response.error.body,
            rawResponse: _response.rawResponse
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new LangfuseAPIError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody,
          rawResponse: _response.rawResponse
        });
      case "timeout":
        throw new LangfuseAPITimeoutError(
          "Timeout exceeded when calling POST /api/public/dataset-run-items."
        );
      case "unknown":
        throw new LangfuseAPIError({
          message: _response.error.errorMessage,
          rawResponse: _response.rawResponse
        });
    }
  }
  /**
   * List dataset run items
   *
   * @param {LangfuseAPI.ListDatasetRunItemsRequest} request
   * @param {DatasetRunItems.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link LangfuseAPI.Error}
   * @throws {@link LangfuseAPI.UnauthorizedError}
   * @throws {@link LangfuseAPI.AccessDeniedError}
   * @throws {@link LangfuseAPI.MethodNotAllowedError}
   * @throws {@link LangfuseAPI.NotFoundError}
   *
   * @example
   *     await client.datasetRunItems.list({
   *         datasetId: "datasetId",
   *         runName: "runName"
   *     })
   */
  list(request, requestOptions) {
    return HttpResponsePromise.fromPromise(
      this.__list(request, requestOptions)
    );
  }
  async __list(request, requestOptions) {
    var _a2, _b, _c, _d, _e, _f, _g, _h;
    const { datasetId, runName, page, limit } = request;
    const _queryParams = {};
    _queryParams["datasetId"] = datasetId;
    _queryParams["runName"] = runName;
    if (page != null) {
      _queryParams["page"] = page.toString();
    }
    if (limit != null) {
      _queryParams["limit"] = limit.toString();
    }
    let _headers = mergeHeaders(
      (_a2 = this._options) == null ? void 0 : _a2.headers,
      mergeOnlyDefinedHeaders({
        Authorization: await this._getAuthorizationHeader(),
        "X-Langfuse-Sdk-Name": (_c = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkName) != null ? _c : (_b = this._options) == null ? void 0 : _b.xLangfuseSdkName,
        "X-Langfuse-Sdk-Version": (_e = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkVersion) != null ? _e : (_d = this._options) == null ? void 0 : _d.xLangfuseSdkVersion,
        "X-Langfuse-Public-Key": (_g = requestOptions == null ? void 0 : requestOptions.xLangfusePublicKey) != null ? _g : (_f = this._options) == null ? void 0 : _f.xLangfusePublicKey
      }),
      requestOptions == null ? void 0 : requestOptions.headers
    );
    const _response = await fetcher({
      url: url_exports.join(
        (_h = await Supplier.get(this._options.baseUrl)) != null ? _h : await Supplier.get(this._options.environment),
        "/api/public/dataset-run-items"
      ),
      method: "GET",
      headers: _headers,
      queryParameters: { ..._queryParams, ...requestOptions == null ? void 0 : requestOptions.queryParams },
      timeoutMs: (requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
      maxRetries: requestOptions == null ? void 0 : requestOptions.maxRetries,
      abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal
    });
    if (_response.ok) {
      return {
        data: _response.body,
        rawResponse: _response.rawResponse
      };
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 400:
          throw new Error2(
            _response.error.body,
            _response.rawResponse
          );
        case 401:
          throw new UnauthorizedError(
            _response.error.body,
            _response.rawResponse
          );
        case 403:
          throw new AccessDeniedError(
            _response.error.body,
            _response.rawResponse
          );
        case 405:
          throw new MethodNotAllowedError(
            _response.error.body,
            _response.rawResponse
          );
        case 404:
          throw new NotFoundError(
            _response.error.body,
            _response.rawResponse
          );
        default:
          throw new LangfuseAPIError({
            statusCode: _response.error.statusCode,
            body: _response.error.body,
            rawResponse: _response.rawResponse
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new LangfuseAPIError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody,
          rawResponse: _response.rawResponse
        });
      case "timeout":
        throw new LangfuseAPITimeoutError(
          "Timeout exceeded when calling GET /api/public/dataset-run-items."
        );
      case "unknown":
        throw new LangfuseAPIError({
          message: _response.error.errorMessage,
          rawResponse: _response.rawResponse
        });
    }
  }
  async _getAuthorizationHeader() {
    const username = await Supplier.get(this._options.username);
    const password = await Supplier.get(this._options.password);
    if (username != null && password != null) {
      return BasicAuth.toAuthorizationHeader({
        username,
        password
      });
    }
    return void 0;
  }
};

// src/api/api/resources/datasets/client/Client.ts
var Datasets = class {
  constructor(_options) {
    this._options = _options;
  }
  /**
   * Get all datasets
   *
   * @param {LangfuseAPI.GetDatasetsRequest} request
   * @param {Datasets.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link LangfuseAPI.Error}
   * @throws {@link LangfuseAPI.UnauthorizedError}
   * @throws {@link LangfuseAPI.AccessDeniedError}
   * @throws {@link LangfuseAPI.MethodNotAllowedError}
   * @throws {@link LangfuseAPI.NotFoundError}
   *
   * @example
   *     await client.datasets.list()
   */
  list(request = {}, requestOptions) {
    return HttpResponsePromise.fromPromise(
      this.__list(request, requestOptions)
    );
  }
  async __list(request = {}, requestOptions) {
    var _a2, _b, _c, _d, _e, _f, _g, _h;
    const { page, limit } = request;
    const _queryParams = {};
    if (page != null) {
      _queryParams["page"] = page.toString();
    }
    if (limit != null) {
      _queryParams["limit"] = limit.toString();
    }
    let _headers = mergeHeaders(
      (_a2 = this._options) == null ? void 0 : _a2.headers,
      mergeOnlyDefinedHeaders({
        Authorization: await this._getAuthorizationHeader(),
        "X-Langfuse-Sdk-Name": (_c = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkName) != null ? _c : (_b = this._options) == null ? void 0 : _b.xLangfuseSdkName,
        "X-Langfuse-Sdk-Version": (_e = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkVersion) != null ? _e : (_d = this._options) == null ? void 0 : _d.xLangfuseSdkVersion,
        "X-Langfuse-Public-Key": (_g = requestOptions == null ? void 0 : requestOptions.xLangfusePublicKey) != null ? _g : (_f = this._options) == null ? void 0 : _f.xLangfusePublicKey
      }),
      requestOptions == null ? void 0 : requestOptions.headers
    );
    const _response = await fetcher({
      url: url_exports.join(
        (_h = await Supplier.get(this._options.baseUrl)) != null ? _h : await Supplier.get(this._options.environment),
        "/api/public/v2/datasets"
      ),
      method: "GET",
      headers: _headers,
      queryParameters: { ..._queryParams, ...requestOptions == null ? void 0 : requestOptions.queryParams },
      timeoutMs: (requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
      maxRetries: requestOptions == null ? void 0 : requestOptions.maxRetries,
      abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal
    });
    if (_response.ok) {
      return {
        data: _response.body,
        rawResponse: _response.rawResponse
      };
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 400:
          throw new Error2(
            _response.error.body,
            _response.rawResponse
          );
        case 401:
          throw new UnauthorizedError(
            _response.error.body,
            _response.rawResponse
          );
        case 403:
          throw new AccessDeniedError(
            _response.error.body,
            _response.rawResponse
          );
        case 405:
          throw new MethodNotAllowedError(
            _response.error.body,
            _response.rawResponse
          );
        case 404:
          throw new NotFoundError(
            _response.error.body,
            _response.rawResponse
          );
        default:
          throw new LangfuseAPIError({
            statusCode: _response.error.statusCode,
            body: _response.error.body,
            rawResponse: _response.rawResponse
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new LangfuseAPIError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody,
          rawResponse: _response.rawResponse
        });
      case "timeout":
        throw new LangfuseAPITimeoutError(
          "Timeout exceeded when calling GET /api/public/v2/datasets."
        );
      case "unknown":
        throw new LangfuseAPIError({
          message: _response.error.errorMessage,
          rawResponse: _response.rawResponse
        });
    }
  }
  /**
   * Get a dataset
   *
   * @param {string} datasetName
   * @param {Datasets.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link LangfuseAPI.Error}
   * @throws {@link LangfuseAPI.UnauthorizedError}
   * @throws {@link LangfuseAPI.AccessDeniedError}
   * @throws {@link LangfuseAPI.MethodNotAllowedError}
   * @throws {@link LangfuseAPI.NotFoundError}
   *
   * @example
   *     await client.datasets.get("datasetName")
   */
  get(datasetName, requestOptions) {
    return HttpResponsePromise.fromPromise(
      this.__get(datasetName, requestOptions)
    );
  }
  async __get(datasetName, requestOptions) {
    var _a2, _b, _c, _d, _e, _f, _g, _h;
    let _headers = mergeHeaders(
      (_a2 = this._options) == null ? void 0 : _a2.headers,
      mergeOnlyDefinedHeaders({
        Authorization: await this._getAuthorizationHeader(),
        "X-Langfuse-Sdk-Name": (_c = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkName) != null ? _c : (_b = this._options) == null ? void 0 : _b.xLangfuseSdkName,
        "X-Langfuse-Sdk-Version": (_e = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkVersion) != null ? _e : (_d = this._options) == null ? void 0 : _d.xLangfuseSdkVersion,
        "X-Langfuse-Public-Key": (_g = requestOptions == null ? void 0 : requestOptions.xLangfusePublicKey) != null ? _g : (_f = this._options) == null ? void 0 : _f.xLangfusePublicKey
      }),
      requestOptions == null ? void 0 : requestOptions.headers
    );
    const _response = await fetcher({
      url: url_exports.join(
        (_h = await Supplier.get(this._options.baseUrl)) != null ? _h : await Supplier.get(this._options.environment),
        `/api/public/v2/datasets/${encodeURIComponent(datasetName)}`
      ),
      method: "GET",
      headers: _headers,
      queryParameters: requestOptions == null ? void 0 : requestOptions.queryParams,
      timeoutMs: (requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
      maxRetries: requestOptions == null ? void 0 : requestOptions.maxRetries,
      abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal
    });
    if (_response.ok) {
      return {
        data: _response.body,
        rawResponse: _response.rawResponse
      };
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 400:
          throw new Error2(
            _response.error.body,
            _response.rawResponse
          );
        case 401:
          throw new UnauthorizedError(
            _response.error.body,
            _response.rawResponse
          );
        case 403:
          throw new AccessDeniedError(
            _response.error.body,
            _response.rawResponse
          );
        case 405:
          throw new MethodNotAllowedError(
            _response.error.body,
            _response.rawResponse
          );
        case 404:
          throw new NotFoundError(
            _response.error.body,
            _response.rawResponse
          );
        default:
          throw new LangfuseAPIError({
            statusCode: _response.error.statusCode,
            body: _response.error.body,
            rawResponse: _response.rawResponse
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new LangfuseAPIError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody,
          rawResponse: _response.rawResponse
        });
      case "timeout":
        throw new LangfuseAPITimeoutError(
          "Timeout exceeded when calling GET /api/public/v2/datasets/{datasetName}."
        );
      case "unknown":
        throw new LangfuseAPIError({
          message: _response.error.errorMessage,
          rawResponse: _response.rawResponse
        });
    }
  }
  /**
   * Create a dataset
   *
   * @param {LangfuseAPI.CreateDatasetRequest} request
   * @param {Datasets.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link LangfuseAPI.Error}
   * @throws {@link LangfuseAPI.UnauthorizedError}
   * @throws {@link LangfuseAPI.AccessDeniedError}
   * @throws {@link LangfuseAPI.MethodNotAllowedError}
   * @throws {@link LangfuseAPI.NotFoundError}
   *
   * @example
   *     await client.datasets.create({
   *         name: "name",
   *         description: undefined,
   *         metadata: undefined,
   *         inputSchema: undefined,
   *         expectedOutputSchema: undefined
   *     })
   */
  create(request, requestOptions) {
    return HttpResponsePromise.fromPromise(
      this.__create(request, requestOptions)
    );
  }
  async __create(request, requestOptions) {
    var _a2, _b, _c, _d, _e, _f, _g, _h;
    let _headers = mergeHeaders(
      (_a2 = this._options) == null ? void 0 : _a2.headers,
      mergeOnlyDefinedHeaders({
        Authorization: await this._getAuthorizationHeader(),
        "X-Langfuse-Sdk-Name": (_c = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkName) != null ? _c : (_b = this._options) == null ? void 0 : _b.xLangfuseSdkName,
        "X-Langfuse-Sdk-Version": (_e = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkVersion) != null ? _e : (_d = this._options) == null ? void 0 : _d.xLangfuseSdkVersion,
        "X-Langfuse-Public-Key": (_g = requestOptions == null ? void 0 : requestOptions.xLangfusePublicKey) != null ? _g : (_f = this._options) == null ? void 0 : _f.xLangfusePublicKey
      }),
      requestOptions == null ? void 0 : requestOptions.headers
    );
    const _response = await fetcher({
      url: url_exports.join(
        (_h = await Supplier.get(this._options.baseUrl)) != null ? _h : await Supplier.get(this._options.environment),
        "/api/public/v2/datasets"
      ),
      method: "POST",
      headers: _headers,
      contentType: "application/json",
      queryParameters: requestOptions == null ? void 0 : requestOptions.queryParams,
      requestType: "json",
      body: request,
      timeoutMs: (requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
      maxRetries: requestOptions == null ? void 0 : requestOptions.maxRetries,
      abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal
    });
    if (_response.ok) {
      return {
        data: _response.body,
        rawResponse: _response.rawResponse
      };
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 400:
          throw new Error2(
            _response.error.body,
            _response.rawResponse
          );
        case 401:
          throw new UnauthorizedError(
            _response.error.body,
            _response.rawResponse
          );
        case 403:
          throw new AccessDeniedError(
            _response.error.body,
            _response.rawResponse
          );
        case 405:
          throw new MethodNotAllowedError(
            _response.error.body,
            _response.rawResponse
          );
        case 404:
          throw new NotFoundError(
            _response.error.body,
            _response.rawResponse
          );
        default:
          throw new LangfuseAPIError({
            statusCode: _response.error.statusCode,
            body: _response.error.body,
            rawResponse: _response.rawResponse
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new LangfuseAPIError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody,
          rawResponse: _response.rawResponse
        });
      case "timeout":
        throw new LangfuseAPITimeoutError(
          "Timeout exceeded when calling POST /api/public/v2/datasets."
        );
      case "unknown":
        throw new LangfuseAPIError({
          message: _response.error.errorMessage,
          rawResponse: _response.rawResponse
        });
    }
  }
  /**
   * Get a dataset run and its items
   *
   * @param {string} datasetName
   * @param {string} runName
   * @param {Datasets.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link LangfuseAPI.Error}
   * @throws {@link LangfuseAPI.UnauthorizedError}
   * @throws {@link LangfuseAPI.AccessDeniedError}
   * @throws {@link LangfuseAPI.MethodNotAllowedError}
   * @throws {@link LangfuseAPI.NotFoundError}
   *
   * @example
   *     await client.datasets.getRun("datasetName", "runName")
   */
  getRun(datasetName, runName, requestOptions) {
    return HttpResponsePromise.fromPromise(
      this.__getRun(datasetName, runName, requestOptions)
    );
  }
  async __getRun(datasetName, runName, requestOptions) {
    var _a2, _b, _c, _d, _e, _f, _g, _h;
    let _headers = mergeHeaders(
      (_a2 = this._options) == null ? void 0 : _a2.headers,
      mergeOnlyDefinedHeaders({
        Authorization: await this._getAuthorizationHeader(),
        "X-Langfuse-Sdk-Name": (_c = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkName) != null ? _c : (_b = this._options) == null ? void 0 : _b.xLangfuseSdkName,
        "X-Langfuse-Sdk-Version": (_e = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkVersion) != null ? _e : (_d = this._options) == null ? void 0 : _d.xLangfuseSdkVersion,
        "X-Langfuse-Public-Key": (_g = requestOptions == null ? void 0 : requestOptions.xLangfusePublicKey) != null ? _g : (_f = this._options) == null ? void 0 : _f.xLangfusePublicKey
      }),
      requestOptions == null ? void 0 : requestOptions.headers
    );
    const _response = await fetcher({
      url: url_exports.join(
        (_h = await Supplier.get(this._options.baseUrl)) != null ? _h : await Supplier.get(this._options.environment),
        `/api/public/datasets/${encodeURIComponent(datasetName)}/runs/${encodeURIComponent(runName)}`
      ),
      method: "GET",
      headers: _headers,
      queryParameters: requestOptions == null ? void 0 : requestOptions.queryParams,
      timeoutMs: (requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
      maxRetries: requestOptions == null ? void 0 : requestOptions.maxRetries,
      abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal
    });
    if (_response.ok) {
      return {
        data: _response.body,
        rawResponse: _response.rawResponse
      };
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 400:
          throw new Error2(
            _response.error.body,
            _response.rawResponse
          );
        case 401:
          throw new UnauthorizedError(
            _response.error.body,
            _response.rawResponse
          );
        case 403:
          throw new AccessDeniedError(
            _response.error.body,
            _response.rawResponse
          );
        case 405:
          throw new MethodNotAllowedError(
            _response.error.body,
            _response.rawResponse
          );
        case 404:
          throw new NotFoundError(
            _response.error.body,
            _response.rawResponse
          );
        default:
          throw new LangfuseAPIError({
            statusCode: _response.error.statusCode,
            body: _response.error.body,
            rawResponse: _response.rawResponse
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new LangfuseAPIError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody,
          rawResponse: _response.rawResponse
        });
      case "timeout":
        throw new LangfuseAPITimeoutError(
          "Timeout exceeded when calling GET /api/public/datasets/{datasetName}/runs/{runName}."
        );
      case "unknown":
        throw new LangfuseAPIError({
          message: _response.error.errorMessage,
          rawResponse: _response.rawResponse
        });
    }
  }
  /**
   * Delete a dataset run and all its run items. This action is irreversible.
   *
   * @param {string} datasetName
   * @param {string} runName
   * @param {Datasets.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link LangfuseAPI.Error}
   * @throws {@link LangfuseAPI.UnauthorizedError}
   * @throws {@link LangfuseAPI.AccessDeniedError}
   * @throws {@link LangfuseAPI.MethodNotAllowedError}
   * @throws {@link LangfuseAPI.NotFoundError}
   *
   * @example
   *     await client.datasets.deleteRun("datasetName", "runName")
   */
  deleteRun(datasetName, runName, requestOptions) {
    return HttpResponsePromise.fromPromise(
      this.__deleteRun(datasetName, runName, requestOptions)
    );
  }
  async __deleteRun(datasetName, runName, requestOptions) {
    var _a2, _b, _c, _d, _e, _f, _g, _h;
    let _headers = mergeHeaders(
      (_a2 = this._options) == null ? void 0 : _a2.headers,
      mergeOnlyDefinedHeaders({
        Authorization: await this._getAuthorizationHeader(),
        "X-Langfuse-Sdk-Name": (_c = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkName) != null ? _c : (_b = this._options) == null ? void 0 : _b.xLangfuseSdkName,
        "X-Langfuse-Sdk-Version": (_e = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkVersion) != null ? _e : (_d = this._options) == null ? void 0 : _d.xLangfuseSdkVersion,
        "X-Langfuse-Public-Key": (_g = requestOptions == null ? void 0 : requestOptions.xLangfusePublicKey) != null ? _g : (_f = this._options) == null ? void 0 : _f.xLangfusePublicKey
      }),
      requestOptions == null ? void 0 : requestOptions.headers
    );
    const _response = await fetcher({
      url: url_exports.join(
        (_h = await Supplier.get(this._options.baseUrl)) != null ? _h : await Supplier.get(this._options.environment),
        `/api/public/datasets/${encodeURIComponent(datasetName)}/runs/${encodeURIComponent(runName)}`
      ),
      method: "DELETE",
      headers: _headers,
      queryParameters: requestOptions == null ? void 0 : requestOptions.queryParams,
      timeoutMs: (requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
      maxRetries: requestOptions == null ? void 0 : requestOptions.maxRetries,
      abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal
    });
    if (_response.ok) {
      return {
        data: _response.body,
        rawResponse: _response.rawResponse
      };
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 400:
          throw new Error2(
            _response.error.body,
            _response.rawResponse
          );
        case 401:
          throw new UnauthorizedError(
            _response.error.body,
            _response.rawResponse
          );
        case 403:
          throw new AccessDeniedError(
            _response.error.body,
            _response.rawResponse
          );
        case 405:
          throw new MethodNotAllowedError(
            _response.error.body,
            _response.rawResponse
          );
        case 404:
          throw new NotFoundError(
            _response.error.body,
            _response.rawResponse
          );
        default:
          throw new LangfuseAPIError({
            statusCode: _response.error.statusCode,
            body: _response.error.body,
            rawResponse: _response.rawResponse
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new LangfuseAPIError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody,
          rawResponse: _response.rawResponse
        });
      case "timeout":
        throw new LangfuseAPITimeoutError(
          "Timeout exceeded when calling DELETE /api/public/datasets/{datasetName}/runs/{runName}."
        );
      case "unknown":
        throw new LangfuseAPIError({
          message: _response.error.errorMessage,
          rawResponse: _response.rawResponse
        });
    }
  }
  /**
   * Get dataset runs
   *
   * @param {string} datasetName
   * @param {LangfuseAPI.GetDatasetRunsRequest} request
   * @param {Datasets.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link LangfuseAPI.Error}
   * @throws {@link LangfuseAPI.UnauthorizedError}
   * @throws {@link LangfuseAPI.AccessDeniedError}
   * @throws {@link LangfuseAPI.MethodNotAllowedError}
   * @throws {@link LangfuseAPI.NotFoundError}
   *
   * @example
   *     await client.datasets.getRuns("datasetName")
   */
  getRuns(datasetName, request = {}, requestOptions) {
    return HttpResponsePromise.fromPromise(
      this.__getRuns(datasetName, request, requestOptions)
    );
  }
  async __getRuns(datasetName, request = {}, requestOptions) {
    var _a2, _b, _c, _d, _e, _f, _g, _h;
    const { page, limit } = request;
    const _queryParams = {};
    if (page != null) {
      _queryParams["page"] = page.toString();
    }
    if (limit != null) {
      _queryParams["limit"] = limit.toString();
    }
    let _headers = mergeHeaders(
      (_a2 = this._options) == null ? void 0 : _a2.headers,
      mergeOnlyDefinedHeaders({
        Authorization: await this._getAuthorizationHeader(),
        "X-Langfuse-Sdk-Name": (_c = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkName) != null ? _c : (_b = this._options) == null ? void 0 : _b.xLangfuseSdkName,
        "X-Langfuse-Sdk-Version": (_e = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkVersion) != null ? _e : (_d = this._options) == null ? void 0 : _d.xLangfuseSdkVersion,
        "X-Langfuse-Public-Key": (_g = requestOptions == null ? void 0 : requestOptions.xLangfusePublicKey) != null ? _g : (_f = this._options) == null ? void 0 : _f.xLangfusePublicKey
      }),
      requestOptions == null ? void 0 : requestOptions.headers
    );
    const _response = await fetcher({
      url: url_exports.join(
        (_h = await Supplier.get(this._options.baseUrl)) != null ? _h : await Supplier.get(this._options.environment),
        `/api/public/datasets/${encodeURIComponent(datasetName)}/runs`
      ),
      method: "GET",
      headers: _headers,
      queryParameters: { ..._queryParams, ...requestOptions == null ? void 0 : requestOptions.queryParams },
      timeoutMs: (requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
      maxRetries: requestOptions == null ? void 0 : requestOptions.maxRetries,
      abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal
    });
    if (_response.ok) {
      return {
        data: _response.body,
        rawResponse: _response.rawResponse
      };
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 400:
          throw new Error2(
            _response.error.body,
            _response.rawResponse
          );
        case 401:
          throw new UnauthorizedError(
            _response.error.body,
            _response.rawResponse
          );
        case 403:
          throw new AccessDeniedError(
            _response.error.body,
            _response.rawResponse
          );
        case 405:
          throw new MethodNotAllowedError(
            _response.error.body,
            _response.rawResponse
          );
        case 404:
          throw new NotFoundError(
            _response.error.body,
            _response.rawResponse
          );
        default:
          throw new LangfuseAPIError({
            statusCode: _response.error.statusCode,
            body: _response.error.body,
            rawResponse: _response.rawResponse
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new LangfuseAPIError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody,
          rawResponse: _response.rawResponse
        });
      case "timeout":
        throw new LangfuseAPITimeoutError(
          "Timeout exceeded when calling GET /api/public/datasets/{datasetName}/runs."
        );
      case "unknown":
        throw new LangfuseAPIError({
          message: _response.error.errorMessage,
          rawResponse: _response.rawResponse
        });
    }
  }
  async _getAuthorizationHeader() {
    const username = await Supplier.get(this._options.username);
    const password = await Supplier.get(this._options.password);
    if (username != null && password != null) {
      return BasicAuth.toAuthorizationHeader({
        username,
        password
      });
    }
    return void 0;
  }
};

// src/api/api/resources/health/client/Client.ts
var Health = class {
  constructor(_options) {
    this._options = _options;
  }
  /**
   * Check health of API and database
   *
   * @param {Health.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link LangfuseAPI.ServiceUnavailableError}
   * @throws {@link LangfuseAPI.Error}
   * @throws {@link LangfuseAPI.UnauthorizedError}
   * @throws {@link LangfuseAPI.AccessDeniedError}
   * @throws {@link LangfuseAPI.MethodNotAllowedError}
   * @throws {@link LangfuseAPI.NotFoundError}
   *
   * @example
   *     await client.health.health()
   */
  health(requestOptions) {
    return HttpResponsePromise.fromPromise(this.__health(requestOptions));
  }
  async __health(requestOptions) {
    var _a2, _b, _c, _d, _e, _f, _g, _h;
    let _headers = mergeHeaders(
      (_a2 = this._options) == null ? void 0 : _a2.headers,
      mergeOnlyDefinedHeaders({
        Authorization: await this._getAuthorizationHeader(),
        "X-Langfuse-Sdk-Name": (_c = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkName) != null ? _c : (_b = this._options) == null ? void 0 : _b.xLangfuseSdkName,
        "X-Langfuse-Sdk-Version": (_e = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkVersion) != null ? _e : (_d = this._options) == null ? void 0 : _d.xLangfuseSdkVersion,
        "X-Langfuse-Public-Key": (_g = requestOptions == null ? void 0 : requestOptions.xLangfusePublicKey) != null ? _g : (_f = this._options) == null ? void 0 : _f.xLangfusePublicKey
      }),
      requestOptions == null ? void 0 : requestOptions.headers
    );
    const _response = await fetcher({
      url: url_exports.join(
        (_h = await Supplier.get(this._options.baseUrl)) != null ? _h : await Supplier.get(this._options.environment),
        "/api/public/health"
      ),
      method: "GET",
      headers: _headers,
      queryParameters: requestOptions == null ? void 0 : requestOptions.queryParams,
      timeoutMs: (requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
      maxRetries: requestOptions == null ? void 0 : requestOptions.maxRetries,
      abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal
    });
    if (_response.ok) {
      return {
        data: _response.body,
        rawResponse: _response.rawResponse
      };
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 503:
          throw new ServiceUnavailableError(_response.rawResponse);
        case 400:
          throw new Error2(
            _response.error.body,
            _response.rawResponse
          );
        case 401:
          throw new UnauthorizedError(
            _response.error.body,
            _response.rawResponse
          );
        case 403:
          throw new AccessDeniedError(
            _response.error.body,
            _response.rawResponse
          );
        case 405:
          throw new MethodNotAllowedError(
            _response.error.body,
            _response.rawResponse
          );
        case 404:
          throw new NotFoundError(
            _response.error.body,
            _response.rawResponse
          );
        default:
          throw new LangfuseAPIError({
            statusCode: _response.error.statusCode,
            body: _response.error.body,
            rawResponse: _response.rawResponse
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new LangfuseAPIError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody,
          rawResponse: _response.rawResponse
        });
      case "timeout":
        throw new LangfuseAPITimeoutError(
          "Timeout exceeded when calling GET /api/public/health."
        );
      case "unknown":
        throw new LangfuseAPIError({
          message: _response.error.errorMessage,
          rawResponse: _response.rawResponse
        });
    }
  }
  async _getAuthorizationHeader() {
    const username = await Supplier.get(this._options.username);
    const password = await Supplier.get(this._options.password);
    if (username != null && password != null) {
      return BasicAuth.toAuthorizationHeader({
        username,
        password
      });
    }
    return void 0;
  }
};

// src/api/api/resources/ingestion/client/Client.ts
var Ingestion = class {
  constructor(_options) {
    this._options = _options;
  }
  /**
   * **Legacy endpoint for batch ingestion for Langfuse Observability.**
   *
   * -> Please use the OpenTelemetry endpoint (`/api/public/otel/v1/traces`). Learn more: https://langfuse.com/integrations/native/opentelemetry
   *
   * Within each batch, there can be multiple events.
   * Each event has a type, an id, a timestamp, metadata and a body.
   * Internally, we refer to this as the "event envelope" as it tells us something about the event but not the trace.
   * We use the event id within this envelope to deduplicate messages to avoid processing the same event twice, i.e. the event id should be unique per request.
   * The event.body.id is the ID of the actual trace and will be used for updates and will be visible within the Langfuse App.
   * I.e. if you want to update a trace, you'd use the same body id, but separate event IDs.
   *
   * Notes:
   * - Introduction to data model: https://langfuse.com/docs/observability/data-model
   * - Batch sizes are limited to 3.5 MB in total. You need to adjust the number of events per batch accordingly.
   * - The API does not return a 4xx status code for input errors. Instead, it responds with a 207 status code, which includes a list of the encountered errors.
   *
   * @param {LangfuseAPI.IngestionRequest} request
   * @param {Ingestion.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link LangfuseAPI.Error}
   * @throws {@link LangfuseAPI.UnauthorizedError}
   * @throws {@link LangfuseAPI.AccessDeniedError}
   * @throws {@link LangfuseAPI.MethodNotAllowedError}
   * @throws {@link LangfuseAPI.NotFoundError}
   *
   * @example
   *     await client.ingestion.batch({
   *         batch: [{
   *                 type: "trace-create",
   *                 id: "abcdef-1234-5678-90ab",
   *                 timestamp: "2022-01-01T00:00:00.000Z",
   *                 body: {
   *                     id: "abcdef-1234-5678-90ab",
   *                     timestamp: "2022-01-01T00:00:00.000Z",
   *                     environment: "production",
   *                     name: "My Trace",
   *                     userId: "1234-5678-90ab-cdef",
   *                     input: "My input",
   *                     output: "My output",
   *                     sessionId: "1234-5678-90ab-cdef",
   *                     release: "1.0.0",
   *                     version: "1.0.0",
   *                     metadata: "My metadata",
   *                     tags: ["tag1", "tag2"],
   *                     "public": true
   *                 }
   *             }]
   *     })
   *
   * @example
   *     await client.ingestion.batch({
   *         batch: [{
   *                 type: "span-create",
   *                 id: "abcdef-1234-5678-90ab",
   *                 timestamp: "2022-01-01T00:00:00.000Z",
   *                 body: {
   *                     id: "abcdef-1234-5678-90ab",
   *                     traceId: "1234-5678-90ab-cdef",
   *                     startTime: "2022-01-01T00:00:00.000Z",
   *                     environment: "test"
   *                 }
   *             }]
   *     })
   *
   * @example
   *     await client.ingestion.batch({
   *         batch: [{
   *                 type: "score-create",
   *                 id: "abcdef-1234-5678-90ab",
   *                 timestamp: "2022-01-01T00:00:00.000Z",
   *                 body: {
   *                     id: "abcdef-1234-5678-90ab",
   *                     traceId: "1234-5678-90ab-cdef",
   *                     name: "My Score",
   *                     value: 0.9,
   *                     environment: "default"
   *                 }
   *             }]
   *     })
   */
  batch(request, requestOptions) {
    return HttpResponsePromise.fromPromise(
      this.__batch(request, requestOptions)
    );
  }
  async __batch(request, requestOptions) {
    var _a2, _b, _c, _d, _e, _f, _g, _h;
    let _headers = mergeHeaders(
      (_a2 = this._options) == null ? void 0 : _a2.headers,
      mergeOnlyDefinedHeaders({
        Authorization: await this._getAuthorizationHeader(),
        "X-Langfuse-Sdk-Name": (_c = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkName) != null ? _c : (_b = this._options) == null ? void 0 : _b.xLangfuseSdkName,
        "X-Langfuse-Sdk-Version": (_e = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkVersion) != null ? _e : (_d = this._options) == null ? void 0 : _d.xLangfuseSdkVersion,
        "X-Langfuse-Public-Key": (_g = requestOptions == null ? void 0 : requestOptions.xLangfusePublicKey) != null ? _g : (_f = this._options) == null ? void 0 : _f.xLangfusePublicKey
      }),
      requestOptions == null ? void 0 : requestOptions.headers
    );
    const _response = await fetcher({
      url: url_exports.join(
        (_h = await Supplier.get(this._options.baseUrl)) != null ? _h : await Supplier.get(this._options.environment),
        "/api/public/ingestion"
      ),
      method: "POST",
      headers: _headers,
      contentType: "application/json",
      queryParameters: requestOptions == null ? void 0 : requestOptions.queryParams,
      requestType: "json",
      body: request,
      timeoutMs: (requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
      maxRetries: requestOptions == null ? void 0 : requestOptions.maxRetries,
      abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal
    });
    if (_response.ok) {
      return {
        data: _response.body,
        rawResponse: _response.rawResponse
      };
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 400:
          throw new Error2(
            _response.error.body,
            _response.rawResponse
          );
        case 401:
          throw new UnauthorizedError(
            _response.error.body,
            _response.rawResponse
          );
        case 403:
          throw new AccessDeniedError(
            _response.error.body,
            _response.rawResponse
          );
        case 405:
          throw new MethodNotAllowedError(
            _response.error.body,
            _response.rawResponse
          );
        case 404:
          throw new NotFoundError(
            _response.error.body,
            _response.rawResponse
          );
        default:
          throw new LangfuseAPIError({
            statusCode: _response.error.statusCode,
            body: _response.error.body,
            rawResponse: _response.rawResponse
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new LangfuseAPIError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody,
          rawResponse: _response.rawResponse
        });
      case "timeout":
        throw new LangfuseAPITimeoutError(
          "Timeout exceeded when calling POST /api/public/ingestion."
        );
      case "unknown":
        throw new LangfuseAPIError({
          message: _response.error.errorMessage,
          rawResponse: _response.rawResponse
        });
    }
  }
  async _getAuthorizationHeader() {
    const username = await Supplier.get(this._options.username);
    const password = await Supplier.get(this._options.password);
    if (username != null && password != null) {
      return BasicAuth.toAuthorizationHeader({
        username,
        password
      });
    }
    return void 0;
  }
};

// src/api/api/resources/llmConnections/client/Client.ts
var LlmConnections = class {
  constructor(_options) {
    this._options = _options;
  }
  /**
   * Get all LLM connections in a project
   *
   * @param {LangfuseAPI.GetLlmConnectionsRequest} request
   * @param {LlmConnections.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link LangfuseAPI.Error}
   * @throws {@link LangfuseAPI.UnauthorizedError}
   * @throws {@link LangfuseAPI.AccessDeniedError}
   * @throws {@link LangfuseAPI.MethodNotAllowedError}
   * @throws {@link LangfuseAPI.NotFoundError}
   *
   * @example
   *     await client.llmConnections.list()
   */
  list(request = {}, requestOptions) {
    return HttpResponsePromise.fromPromise(
      this.__list(request, requestOptions)
    );
  }
  async __list(request = {}, requestOptions) {
    var _a2, _b, _c, _d, _e, _f, _g, _h;
    const { page, limit } = request;
    const _queryParams = {};
    if (page != null) {
      _queryParams["page"] = page.toString();
    }
    if (limit != null) {
      _queryParams["limit"] = limit.toString();
    }
    let _headers = mergeHeaders(
      (_a2 = this._options) == null ? void 0 : _a2.headers,
      mergeOnlyDefinedHeaders({
        Authorization: await this._getAuthorizationHeader(),
        "X-Langfuse-Sdk-Name": (_c = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkName) != null ? _c : (_b = this._options) == null ? void 0 : _b.xLangfuseSdkName,
        "X-Langfuse-Sdk-Version": (_e = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkVersion) != null ? _e : (_d = this._options) == null ? void 0 : _d.xLangfuseSdkVersion,
        "X-Langfuse-Public-Key": (_g = requestOptions == null ? void 0 : requestOptions.xLangfusePublicKey) != null ? _g : (_f = this._options) == null ? void 0 : _f.xLangfusePublicKey
      }),
      requestOptions == null ? void 0 : requestOptions.headers
    );
    const _response = await fetcher({
      url: url_exports.join(
        (_h = await Supplier.get(this._options.baseUrl)) != null ? _h : await Supplier.get(this._options.environment),
        "/api/public/llm-connections"
      ),
      method: "GET",
      headers: _headers,
      queryParameters: { ..._queryParams, ...requestOptions == null ? void 0 : requestOptions.queryParams },
      timeoutMs: (requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
      maxRetries: requestOptions == null ? void 0 : requestOptions.maxRetries,
      abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal
    });
    if (_response.ok) {
      return {
        data: _response.body,
        rawResponse: _response.rawResponse
      };
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 400:
          throw new Error2(
            _response.error.body,
            _response.rawResponse
          );
        case 401:
          throw new UnauthorizedError(
            _response.error.body,
            _response.rawResponse
          );
        case 403:
          throw new AccessDeniedError(
            _response.error.body,
            _response.rawResponse
          );
        case 405:
          throw new MethodNotAllowedError(
            _response.error.body,
            _response.rawResponse
          );
        case 404:
          throw new NotFoundError(
            _response.error.body,
            _response.rawResponse
          );
        default:
          throw new LangfuseAPIError({
            statusCode: _response.error.statusCode,
            body: _response.error.body,
            rawResponse: _response.rawResponse
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new LangfuseAPIError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody,
          rawResponse: _response.rawResponse
        });
      case "timeout":
        throw new LangfuseAPITimeoutError(
          "Timeout exceeded when calling GET /api/public/llm-connections."
        );
      case "unknown":
        throw new LangfuseAPIError({
          message: _response.error.errorMessage,
          rawResponse: _response.rawResponse
        });
    }
  }
  /**
   * Create or update an LLM connection. The connection is upserted on provider.
   *
   * @param {LangfuseAPI.UpsertLlmConnectionRequest} request
   * @param {LlmConnections.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link LangfuseAPI.Error}
   * @throws {@link LangfuseAPI.UnauthorizedError}
   * @throws {@link LangfuseAPI.AccessDeniedError}
   * @throws {@link LangfuseAPI.MethodNotAllowedError}
   * @throws {@link LangfuseAPI.NotFoundError}
   *
   * @example
   *     await client.llmConnections.upsert({
   *         provider: "provider",
   *         adapter: "anthropic",
   *         secretKey: "secretKey",
   *         baseURL: undefined,
   *         customModels: undefined,
   *         withDefaultModels: undefined,
   *         extraHeaders: undefined,
   *         config: undefined
   *     })
   */
  upsert(request, requestOptions) {
    return HttpResponsePromise.fromPromise(
      this.__upsert(request, requestOptions)
    );
  }
  async __upsert(request, requestOptions) {
    var _a2, _b, _c, _d, _e, _f, _g, _h;
    let _headers = mergeHeaders(
      (_a2 = this._options) == null ? void 0 : _a2.headers,
      mergeOnlyDefinedHeaders({
        Authorization: await this._getAuthorizationHeader(),
        "X-Langfuse-Sdk-Name": (_c = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkName) != null ? _c : (_b = this._options) == null ? void 0 : _b.xLangfuseSdkName,
        "X-Langfuse-Sdk-Version": (_e = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkVersion) != null ? _e : (_d = this._options) == null ? void 0 : _d.xLangfuseSdkVersion,
        "X-Langfuse-Public-Key": (_g = requestOptions == null ? void 0 : requestOptions.xLangfusePublicKey) != null ? _g : (_f = this._options) == null ? void 0 : _f.xLangfusePublicKey
      }),
      requestOptions == null ? void 0 : requestOptions.headers
    );
    const _response = await fetcher({
      url: url_exports.join(
        (_h = await Supplier.get(this._options.baseUrl)) != null ? _h : await Supplier.get(this._options.environment),
        "/api/public/llm-connections"
      ),
      method: "PUT",
      headers: _headers,
      contentType: "application/json",
      queryParameters: requestOptions == null ? void 0 : requestOptions.queryParams,
      requestType: "json",
      body: request,
      timeoutMs: (requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
      maxRetries: requestOptions == null ? void 0 : requestOptions.maxRetries,
      abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal
    });
    if (_response.ok) {
      return {
        data: _response.body,
        rawResponse: _response.rawResponse
      };
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 400:
          throw new Error2(
            _response.error.body,
            _response.rawResponse
          );
        case 401:
          throw new UnauthorizedError(
            _response.error.body,
            _response.rawResponse
          );
        case 403:
          throw new AccessDeniedError(
            _response.error.body,
            _response.rawResponse
          );
        case 405:
          throw new MethodNotAllowedError(
            _response.error.body,
            _response.rawResponse
          );
        case 404:
          throw new NotFoundError(
            _response.error.body,
            _response.rawResponse
          );
        default:
          throw new LangfuseAPIError({
            statusCode: _response.error.statusCode,
            body: _response.error.body,
            rawResponse: _response.rawResponse
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new LangfuseAPIError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody,
          rawResponse: _response.rawResponse
        });
      case "timeout":
        throw new LangfuseAPITimeoutError(
          "Timeout exceeded when calling PUT /api/public/llm-connections."
        );
      case "unknown":
        throw new LangfuseAPIError({
          message: _response.error.errorMessage,
          rawResponse: _response.rawResponse
        });
    }
  }
  async _getAuthorizationHeader() {
    const username = await Supplier.get(this._options.username);
    const password = await Supplier.get(this._options.password);
    if (username != null && password != null) {
      return BasicAuth.toAuthorizationHeader({
        username,
        password
      });
    }
    return void 0;
  }
};

// src/api/api/resources/media/client/Client.ts
var Media = class {
  constructor(_options) {
    this._options = _options;
  }
  /**
   * Get a media record
   *
   * @param {string} mediaId - The unique langfuse identifier of a media record
   * @param {Media.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link LangfuseAPI.Error}
   * @throws {@link LangfuseAPI.UnauthorizedError}
   * @throws {@link LangfuseAPI.AccessDeniedError}
   * @throws {@link LangfuseAPI.MethodNotAllowedError}
   * @throws {@link LangfuseAPI.NotFoundError}
   *
   * @example
   *     await client.media.get("mediaId")
   */
  get(mediaId, requestOptions) {
    return HttpResponsePromise.fromPromise(
      this.__get(mediaId, requestOptions)
    );
  }
  async __get(mediaId, requestOptions) {
    var _a2, _b, _c, _d, _e, _f, _g, _h;
    let _headers = mergeHeaders(
      (_a2 = this._options) == null ? void 0 : _a2.headers,
      mergeOnlyDefinedHeaders({
        Authorization: await this._getAuthorizationHeader(),
        "X-Langfuse-Sdk-Name": (_c = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkName) != null ? _c : (_b = this._options) == null ? void 0 : _b.xLangfuseSdkName,
        "X-Langfuse-Sdk-Version": (_e = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkVersion) != null ? _e : (_d = this._options) == null ? void 0 : _d.xLangfuseSdkVersion,
        "X-Langfuse-Public-Key": (_g = requestOptions == null ? void 0 : requestOptions.xLangfusePublicKey) != null ? _g : (_f = this._options) == null ? void 0 : _f.xLangfusePublicKey
      }),
      requestOptions == null ? void 0 : requestOptions.headers
    );
    const _response = await fetcher({
      url: url_exports.join(
        (_h = await Supplier.get(this._options.baseUrl)) != null ? _h : await Supplier.get(this._options.environment),
        `/api/public/media/${encodeURIComponent(mediaId)}`
      ),
      method: "GET",
      headers: _headers,
      queryParameters: requestOptions == null ? void 0 : requestOptions.queryParams,
      timeoutMs: (requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
      maxRetries: requestOptions == null ? void 0 : requestOptions.maxRetries,
      abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal
    });
    if (_response.ok) {
      return {
        data: _response.body,
        rawResponse: _response.rawResponse
      };
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 400:
          throw new Error2(
            _response.error.body,
            _response.rawResponse
          );
        case 401:
          throw new UnauthorizedError(
            _response.error.body,
            _response.rawResponse
          );
        case 403:
          throw new AccessDeniedError(
            _response.error.body,
            _response.rawResponse
          );
        case 405:
          throw new MethodNotAllowedError(
            _response.error.body,
            _response.rawResponse
          );
        case 404:
          throw new NotFoundError(
            _response.error.body,
            _response.rawResponse
          );
        default:
          throw new LangfuseAPIError({
            statusCode: _response.error.statusCode,
            body: _response.error.body,
            rawResponse: _response.rawResponse
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new LangfuseAPIError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody,
          rawResponse: _response.rawResponse
        });
      case "timeout":
        throw new LangfuseAPITimeoutError(
          "Timeout exceeded when calling GET /api/public/media/{mediaId}."
        );
      case "unknown":
        throw new LangfuseAPIError({
          message: _response.error.errorMessage,
          rawResponse: _response.rawResponse
        });
    }
  }
  /**
   * Patch a media record
   *
   * @param {string} mediaId - The unique langfuse identifier of a media record
   * @param {LangfuseAPI.PatchMediaBody} request
   * @param {Media.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link LangfuseAPI.Error}
   * @throws {@link LangfuseAPI.UnauthorizedError}
   * @throws {@link LangfuseAPI.AccessDeniedError}
   * @throws {@link LangfuseAPI.MethodNotAllowedError}
   * @throws {@link LangfuseAPI.NotFoundError}
   *
   * @example
   *     await client.media.patch("mediaId", {
   *         uploadedAt: "2024-01-15T09:30:00Z",
   *         uploadHttpStatus: 1,
   *         uploadHttpError: undefined,
   *         uploadTimeMs: undefined
   *     })
   */
  patch(mediaId, request, requestOptions) {
    return HttpResponsePromise.fromPromise(
      this.__patch(mediaId, request, requestOptions)
    );
  }
  async __patch(mediaId, request, requestOptions) {
    var _a2, _b, _c, _d, _e, _f, _g, _h;
    let _headers = mergeHeaders(
      (_a2 = this._options) == null ? void 0 : _a2.headers,
      mergeOnlyDefinedHeaders({
        Authorization: await this._getAuthorizationHeader(),
        "X-Langfuse-Sdk-Name": (_c = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkName) != null ? _c : (_b = this._options) == null ? void 0 : _b.xLangfuseSdkName,
        "X-Langfuse-Sdk-Version": (_e = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkVersion) != null ? _e : (_d = this._options) == null ? void 0 : _d.xLangfuseSdkVersion,
        "X-Langfuse-Public-Key": (_g = requestOptions == null ? void 0 : requestOptions.xLangfusePublicKey) != null ? _g : (_f = this._options) == null ? void 0 : _f.xLangfusePublicKey
      }),
      requestOptions == null ? void 0 : requestOptions.headers
    );
    const _response = await fetcher({
      url: url_exports.join(
        (_h = await Supplier.get(this._options.baseUrl)) != null ? _h : await Supplier.get(this._options.environment),
        `/api/public/media/${encodeURIComponent(mediaId)}`
      ),
      method: "PATCH",
      headers: _headers,
      contentType: "application/json",
      queryParameters: requestOptions == null ? void 0 : requestOptions.queryParams,
      requestType: "json",
      body: request,
      timeoutMs: (requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
      maxRetries: requestOptions == null ? void 0 : requestOptions.maxRetries,
      abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal
    });
    if (_response.ok) {
      return { data: void 0, rawResponse: _response.rawResponse };
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 400:
          throw new Error2(
            _response.error.body,
            _response.rawResponse
          );
        case 401:
          throw new UnauthorizedError(
            _response.error.body,
            _response.rawResponse
          );
        case 403:
          throw new AccessDeniedError(
            _response.error.body,
            _response.rawResponse
          );
        case 405:
          throw new MethodNotAllowedError(
            _response.error.body,
            _response.rawResponse
          );
        case 404:
          throw new NotFoundError(
            _response.error.body,
            _response.rawResponse
          );
        default:
          throw new LangfuseAPIError({
            statusCode: _response.error.statusCode,
            body: _response.error.body,
            rawResponse: _response.rawResponse
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new LangfuseAPIError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody,
          rawResponse: _response.rawResponse
        });
      case "timeout":
        throw new LangfuseAPITimeoutError(
          "Timeout exceeded when calling PATCH /api/public/media/{mediaId}."
        );
      case "unknown":
        throw new LangfuseAPIError({
          message: _response.error.errorMessage,
          rawResponse: _response.rawResponse
        });
    }
  }
  /**
   * Get a presigned upload URL for a media record
   *
   * @param {LangfuseAPI.GetMediaUploadUrlRequest} request
   * @param {Media.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link LangfuseAPI.Error}
   * @throws {@link LangfuseAPI.UnauthorizedError}
   * @throws {@link LangfuseAPI.AccessDeniedError}
   * @throws {@link LangfuseAPI.MethodNotAllowedError}
   * @throws {@link LangfuseAPI.NotFoundError}
   *
   * @example
   *     await client.media.getUploadUrl({
   *         traceId: "traceId",
   *         observationId: undefined,
   *         contentType: "image/png",
   *         contentLength: 1,
   *         sha256Hash: "sha256Hash",
   *         field: "field"
   *     })
   */
  getUploadUrl(request, requestOptions) {
    return HttpResponsePromise.fromPromise(
      this.__getUploadUrl(request, requestOptions)
    );
  }
  async __getUploadUrl(request, requestOptions) {
    var _a2, _b, _c, _d, _e, _f, _g, _h;
    let _headers = mergeHeaders(
      (_a2 = this._options) == null ? void 0 : _a2.headers,
      mergeOnlyDefinedHeaders({
        Authorization: await this._getAuthorizationHeader(),
        "X-Langfuse-Sdk-Name": (_c = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkName) != null ? _c : (_b = this._options) == null ? void 0 : _b.xLangfuseSdkName,
        "X-Langfuse-Sdk-Version": (_e = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkVersion) != null ? _e : (_d = this._options) == null ? void 0 : _d.xLangfuseSdkVersion,
        "X-Langfuse-Public-Key": (_g = requestOptions == null ? void 0 : requestOptions.xLangfusePublicKey) != null ? _g : (_f = this._options) == null ? void 0 : _f.xLangfusePublicKey
      }),
      requestOptions == null ? void 0 : requestOptions.headers
    );
    const _response = await fetcher({
      url: url_exports.join(
        (_h = await Supplier.get(this._options.baseUrl)) != null ? _h : await Supplier.get(this._options.environment),
        "/api/public/media"
      ),
      method: "POST",
      headers: _headers,
      contentType: "application/json",
      queryParameters: requestOptions == null ? void 0 : requestOptions.queryParams,
      requestType: "json",
      body: request,
      timeoutMs: (requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
      maxRetries: requestOptions == null ? void 0 : requestOptions.maxRetries,
      abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal
    });
    if (_response.ok) {
      return {
        data: _response.body,
        rawResponse: _response.rawResponse
      };
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 400:
          throw new Error2(
            _response.error.body,
            _response.rawResponse
          );
        case 401:
          throw new UnauthorizedError(
            _response.error.body,
            _response.rawResponse
          );
        case 403:
          throw new AccessDeniedError(
            _response.error.body,
            _response.rawResponse
          );
        case 405:
          throw new MethodNotAllowedError(
            _response.error.body,
            _response.rawResponse
          );
        case 404:
          throw new NotFoundError(
            _response.error.body,
            _response.rawResponse
          );
        default:
          throw new LangfuseAPIError({
            statusCode: _response.error.statusCode,
            body: _response.error.body,
            rawResponse: _response.rawResponse
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new LangfuseAPIError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody,
          rawResponse: _response.rawResponse
        });
      case "timeout":
        throw new LangfuseAPITimeoutError(
          "Timeout exceeded when calling POST /api/public/media."
        );
      case "unknown":
        throw new LangfuseAPIError({
          message: _response.error.errorMessage,
          rawResponse: _response.rawResponse
        });
    }
  }
  async _getAuthorizationHeader() {
    const username = await Supplier.get(this._options.username);
    const password = await Supplier.get(this._options.password);
    if (username != null && password != null) {
      return BasicAuth.toAuthorizationHeader({
        username,
        password
      });
    }
    return void 0;
  }
};

// src/api/api/resources/metricsV2/client/Client.ts
var MetricsV2 = class {
  constructor(_options) {
    this._options = _options;
  }
  /**
   * Get metrics from the Langfuse project using a query object. V2 endpoint with optimized performance.
   *
   * ## V2 Differences
   * - Supports `observations`, `scores-numeric`, and `scores-categorical` views only (traces view not supported)
   * - Direct access to tags and release fields on observations
   * - Backwards-compatible: traceName, traceRelease, traceVersion dimensions are still available on observations view
   * - High cardinality dimensions are not supported and will return a 400 error (see below)
   *
   * For more details, see the [Metrics API documentation](https://langfuse.com/docs/metrics/features/metrics-api).
   *
   * ## Available Views
   *
   * ### observations
   * Query observation-level data (spans, generations, events).
   *
   * **Dimensions:**
   * - `environment` - Deployment environment (e.g., production, staging)
   * - `type` - Type of observation (SPAN, GENERATION, EVENT)
   * - `name` - Name of the observation
   * - `level` - Logging level of the observation
   * - `version` - Version of the observation
   * - `tags` - User-defined tags
   * - `release` - Release version
   * - `traceName` - Name of the parent trace (backwards-compatible)
   * - `traceRelease` - Release version of the parent trace (backwards-compatible, maps to release)
   * - `traceVersion` - Version of the parent trace (backwards-compatible, maps to version)
   * - `providedModelName` - Name of the model used
   * - `promptName` - Name of the prompt used
   * - `promptVersion` - Version of the prompt used
   * - `startTimeMonth` - Month of start_time in YYYY-MM format
   *
   * **Measures:**
   * - `count` - Total number of observations
   * - `latency` - Observation latency (milliseconds)
   * - `streamingLatency` - Generation latency from completion start to end (milliseconds)
   * - `inputTokens` - Sum of input tokens consumed
   * - `outputTokens` - Sum of output tokens produced
   * - `totalTokens` - Sum of all tokens consumed
   * - `outputTokensPerSecond` - Output tokens per second
   * - `tokensPerSecond` - Total tokens per second
   * - `inputCost` - Input cost (USD)
   * - `outputCost` - Output cost (USD)
   * - `totalCost` - Total cost (USD)
   * - `timeToFirstToken` - Time to first token (milliseconds)
   * - `countScores` - Number of scores attached to the observation
   *
   * ### scores-numeric
   * Query numeric and boolean score data.
   *
   * **Dimensions:**
   * - `environment` - Deployment environment
   * - `name` - Name of the score (e.g., accuracy, toxicity)
   * - `source` - Origin of the score (API, ANNOTATION, EVAL)
   * - `dataType` - Data type (NUMERIC, BOOLEAN)
   * - `configId` - Identifier of the score config
   * - `timestampMonth` - Month in YYYY-MM format
   * - `timestampDay` - Day in YYYY-MM-DD format
   * - `value` - Numeric value of the score
   * - `traceName` - Name of the parent trace
   * - `tags` - Tags
   * - `traceRelease` - Release version
   * - `traceVersion` - Version
   * - `observationName` - Name of the associated observation
   * - `observationModelName` - Model name of the associated observation
   * - `observationPromptName` - Prompt name of the associated observation
   * - `observationPromptVersion` - Prompt version of the associated observation
   *
   * **Measures:**
   * - `count` - Total number of scores
   * - `value` - Score value (for aggregations)
   *
   * ### scores-categorical
   * Query categorical score data. Same dimensions as scores-numeric except uses `stringValue` instead of `value`.
   *
   * **Measures:**
   * - `count` - Total number of scores
   *
   * ## High Cardinality Dimensions
   * The following dimensions cannot be used as grouping dimensions in v2 metrics API as they can cause performance issues.
   * Use them in filters instead.
   *
   * **observations view:**
   * - `id` - Use traceId filter to narrow down results
   * - `traceId` - Use traceId filter instead
   * - `userId` - Use userId filter instead
   * - `sessionId` - Use sessionId filter instead
   * - `parentObservationId` - Use parentObservationId filter instead
   *
   * **scores-numeric / scores-categorical views:**
   * - `id` - Use specific filters to narrow down results
   * - `traceId` - Use traceId filter instead
   * - `userId` - Use userId filter instead
   * - `sessionId` - Use sessionId filter instead
   * - `observationId` - Use observationId filter instead
   *
   * ## Aggregations
   * Available aggregation functions: `sum`, `avg`, `count`, `max`, `min`, `p50`, `p75`, `p90`, `p95`, `p99`, `histogram`
   *
   * ## Time Granularities
   * Available granularities for timeDimension: `auto`, `minute`, `hour`, `day`, `week`, `month`
   * - `auto` bins the data into approximately 50 buckets based on the time range
   *
   * @param {LangfuseAPI.GetMetricsV2Request} request
   * @param {MetricsV2.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link LangfuseAPI.Error}
   * @throws {@link LangfuseAPI.UnauthorizedError}
   * @throws {@link LangfuseAPI.AccessDeniedError}
   * @throws {@link LangfuseAPI.MethodNotAllowedError}
   * @throws {@link LangfuseAPI.NotFoundError}
   *
   * @example
   *     await client.metricsV2.metrics({
   *         query: "query"
   *     })
   */
  metrics(request, requestOptions) {
    return HttpResponsePromise.fromPromise(
      this.__metrics(request, requestOptions)
    );
  }
  async __metrics(request, requestOptions) {
    var _a2, _b, _c, _d, _e, _f, _g, _h;
    const { query } = request;
    const _queryParams = {};
    _queryParams["query"] = query;
    let _headers = mergeHeaders(
      (_a2 = this._options) == null ? void 0 : _a2.headers,
      mergeOnlyDefinedHeaders({
        Authorization: await this._getAuthorizationHeader(),
        "X-Langfuse-Sdk-Name": (_c = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkName) != null ? _c : (_b = this._options) == null ? void 0 : _b.xLangfuseSdkName,
        "X-Langfuse-Sdk-Version": (_e = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkVersion) != null ? _e : (_d = this._options) == null ? void 0 : _d.xLangfuseSdkVersion,
        "X-Langfuse-Public-Key": (_g = requestOptions == null ? void 0 : requestOptions.xLangfusePublicKey) != null ? _g : (_f = this._options) == null ? void 0 : _f.xLangfusePublicKey
      }),
      requestOptions == null ? void 0 : requestOptions.headers
    );
    const _response = await fetcher({
      url: url_exports.join(
        (_h = await Supplier.get(this._options.baseUrl)) != null ? _h : await Supplier.get(this._options.environment),
        "/api/public/v2/metrics"
      ),
      method: "GET",
      headers: _headers,
      queryParameters: { ..._queryParams, ...requestOptions == null ? void 0 : requestOptions.queryParams },
      timeoutMs: (requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
      maxRetries: requestOptions == null ? void 0 : requestOptions.maxRetries,
      abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal
    });
    if (_response.ok) {
      return {
        data: _response.body,
        rawResponse: _response.rawResponse
      };
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 400:
          throw new Error2(
            _response.error.body,
            _response.rawResponse
          );
        case 401:
          throw new UnauthorizedError(
            _response.error.body,
            _response.rawResponse
          );
        case 403:
          throw new AccessDeniedError(
            _response.error.body,
            _response.rawResponse
          );
        case 405:
          throw new MethodNotAllowedError(
            _response.error.body,
            _response.rawResponse
          );
        case 404:
          throw new NotFoundError(
            _response.error.body,
            _response.rawResponse
          );
        default:
          throw new LangfuseAPIError({
            statusCode: _response.error.statusCode,
            body: _response.error.body,
            rawResponse: _response.rawResponse
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new LangfuseAPIError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody,
          rawResponse: _response.rawResponse
        });
      case "timeout":
        throw new LangfuseAPITimeoutError(
          "Timeout exceeded when calling GET /api/public/v2/metrics."
        );
      case "unknown":
        throw new LangfuseAPIError({
          message: _response.error.errorMessage,
          rawResponse: _response.rawResponse
        });
    }
  }
  async _getAuthorizationHeader() {
    const username = await Supplier.get(this._options.username);
    const password = await Supplier.get(this._options.password);
    if (username != null && password != null) {
      return BasicAuth.toAuthorizationHeader({
        username,
        password
      });
    }
    return void 0;
  }
};

// src/api/api/resources/metrics/client/Client.ts
var Metrics = class {
  constructor(_options) {
    this._options = _options;
  }
  /**
   * Get metrics from the Langfuse project using a query object.
   *
   * Consider using the [v2 metrics endpoint](/api-reference#tag/metricsv2/GET/api/public/v2/metrics) for better performance.
   *
   * For more details, see the [Metrics API documentation](https://langfuse.com/docs/metrics/features/metrics-api).
   *
   * @param {LangfuseAPI.GetMetricsRequest} request
   * @param {Metrics.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link LangfuseAPI.Error}
   * @throws {@link LangfuseAPI.UnauthorizedError}
   * @throws {@link LangfuseAPI.AccessDeniedError}
   * @throws {@link LangfuseAPI.MethodNotAllowedError}
   * @throws {@link LangfuseAPI.NotFoundError}
   *
   * @example
   *     await client.metrics.metrics({
   *         query: "query"
   *     })
   */
  metrics(request, requestOptions) {
    return HttpResponsePromise.fromPromise(
      this.__metrics(request, requestOptions)
    );
  }
  async __metrics(request, requestOptions) {
    var _a2, _b, _c, _d, _e, _f, _g, _h;
    const { query } = request;
    const _queryParams = {};
    _queryParams["query"] = query;
    let _headers = mergeHeaders(
      (_a2 = this._options) == null ? void 0 : _a2.headers,
      mergeOnlyDefinedHeaders({
        Authorization: await this._getAuthorizationHeader(),
        "X-Langfuse-Sdk-Name": (_c = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkName) != null ? _c : (_b = this._options) == null ? void 0 : _b.xLangfuseSdkName,
        "X-Langfuse-Sdk-Version": (_e = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkVersion) != null ? _e : (_d = this._options) == null ? void 0 : _d.xLangfuseSdkVersion,
        "X-Langfuse-Public-Key": (_g = requestOptions == null ? void 0 : requestOptions.xLangfusePublicKey) != null ? _g : (_f = this._options) == null ? void 0 : _f.xLangfusePublicKey
      }),
      requestOptions == null ? void 0 : requestOptions.headers
    );
    const _response = await fetcher({
      url: url_exports.join(
        (_h = await Supplier.get(this._options.baseUrl)) != null ? _h : await Supplier.get(this._options.environment),
        "/api/public/metrics"
      ),
      method: "GET",
      headers: _headers,
      queryParameters: { ..._queryParams, ...requestOptions == null ? void 0 : requestOptions.queryParams },
      timeoutMs: (requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
      maxRetries: requestOptions == null ? void 0 : requestOptions.maxRetries,
      abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal
    });
    if (_response.ok) {
      return {
        data: _response.body,
        rawResponse: _response.rawResponse
      };
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 400:
          throw new Error2(
            _response.error.body,
            _response.rawResponse
          );
        case 401:
          throw new UnauthorizedError(
            _response.error.body,
            _response.rawResponse
          );
        case 403:
          throw new AccessDeniedError(
            _response.error.body,
            _response.rawResponse
          );
        case 405:
          throw new MethodNotAllowedError(
            _response.error.body,
            _response.rawResponse
          );
        case 404:
          throw new NotFoundError(
            _response.error.body,
            _response.rawResponse
          );
        default:
          throw new LangfuseAPIError({
            statusCode: _response.error.statusCode,
            body: _response.error.body,
            rawResponse: _response.rawResponse
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new LangfuseAPIError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody,
          rawResponse: _response.rawResponse
        });
      case "timeout":
        throw new LangfuseAPITimeoutError(
          "Timeout exceeded when calling GET /api/public/metrics."
        );
      case "unknown":
        throw new LangfuseAPIError({
          message: _response.error.errorMessage,
          rawResponse: _response.rawResponse
        });
    }
  }
  async _getAuthorizationHeader() {
    const username = await Supplier.get(this._options.username);
    const password = await Supplier.get(this._options.password);
    if (username != null && password != null) {
      return BasicAuth.toAuthorizationHeader({
        username,
        password
      });
    }
    return void 0;
  }
};

// src/api/api/resources/models/client/Client.ts
var Models = class {
  constructor(_options) {
    this._options = _options;
  }
  /**
   * Create a model
   *
   * @param {LangfuseAPI.CreateModelRequest} request
   * @param {Models.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link LangfuseAPI.Error}
   * @throws {@link LangfuseAPI.UnauthorizedError}
   * @throws {@link LangfuseAPI.AccessDeniedError}
   * @throws {@link LangfuseAPI.MethodNotAllowedError}
   * @throws {@link LangfuseAPI.NotFoundError}
   *
   * @example
   *     await client.models.create({
   *         modelName: "modelName",
   *         matchPattern: "matchPattern",
   *         startDate: undefined,
   *         unit: undefined,
   *         inputPrice: undefined,
   *         outputPrice: undefined,
   *         totalPrice: undefined,
   *         pricingTiers: undefined,
   *         tokenizerId: undefined,
   *         tokenizerConfig: undefined
   *     })
   */
  create(request, requestOptions) {
    return HttpResponsePromise.fromPromise(
      this.__create(request, requestOptions)
    );
  }
  async __create(request, requestOptions) {
    var _a2, _b, _c, _d, _e, _f, _g, _h;
    let _headers = mergeHeaders(
      (_a2 = this._options) == null ? void 0 : _a2.headers,
      mergeOnlyDefinedHeaders({
        Authorization: await this._getAuthorizationHeader(),
        "X-Langfuse-Sdk-Name": (_c = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkName) != null ? _c : (_b = this._options) == null ? void 0 : _b.xLangfuseSdkName,
        "X-Langfuse-Sdk-Version": (_e = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkVersion) != null ? _e : (_d = this._options) == null ? void 0 : _d.xLangfuseSdkVersion,
        "X-Langfuse-Public-Key": (_g = requestOptions == null ? void 0 : requestOptions.xLangfusePublicKey) != null ? _g : (_f = this._options) == null ? void 0 : _f.xLangfusePublicKey
      }),
      requestOptions == null ? void 0 : requestOptions.headers
    );
    const _response = await fetcher({
      url: url_exports.join(
        (_h = await Supplier.get(this._options.baseUrl)) != null ? _h : await Supplier.get(this._options.environment),
        "/api/public/models"
      ),
      method: "POST",
      headers: _headers,
      contentType: "application/json",
      queryParameters: requestOptions == null ? void 0 : requestOptions.queryParams,
      requestType: "json",
      body: request,
      timeoutMs: (requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
      maxRetries: requestOptions == null ? void 0 : requestOptions.maxRetries,
      abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal
    });
    if (_response.ok) {
      return {
        data: _response.body,
        rawResponse: _response.rawResponse
      };
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 400:
          throw new Error2(
            _response.error.body,
            _response.rawResponse
          );
        case 401:
          throw new UnauthorizedError(
            _response.error.body,
            _response.rawResponse
          );
        case 403:
          throw new AccessDeniedError(
            _response.error.body,
            _response.rawResponse
          );
        case 405:
          throw new MethodNotAllowedError(
            _response.error.body,
            _response.rawResponse
          );
        case 404:
          throw new NotFoundError(
            _response.error.body,
            _response.rawResponse
          );
        default:
          throw new LangfuseAPIError({
            statusCode: _response.error.statusCode,
            body: _response.error.body,
            rawResponse: _response.rawResponse
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new LangfuseAPIError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody,
          rawResponse: _response.rawResponse
        });
      case "timeout":
        throw new LangfuseAPITimeoutError(
          "Timeout exceeded when calling POST /api/public/models."
        );
      case "unknown":
        throw new LangfuseAPIError({
          message: _response.error.errorMessage,
          rawResponse: _response.rawResponse
        });
    }
  }
  /**
   * Get all models
   *
   * @param {LangfuseAPI.GetModelsRequest} request
   * @param {Models.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link LangfuseAPI.Error}
   * @throws {@link LangfuseAPI.UnauthorizedError}
   * @throws {@link LangfuseAPI.AccessDeniedError}
   * @throws {@link LangfuseAPI.MethodNotAllowedError}
   * @throws {@link LangfuseAPI.NotFoundError}
   *
   * @example
   *     await client.models.list()
   */
  list(request = {}, requestOptions) {
    return HttpResponsePromise.fromPromise(
      this.__list(request, requestOptions)
    );
  }
  async __list(request = {}, requestOptions) {
    var _a2, _b, _c, _d, _e, _f, _g, _h;
    const { page, limit } = request;
    const _queryParams = {};
    if (page != null) {
      _queryParams["page"] = page.toString();
    }
    if (limit != null) {
      _queryParams["limit"] = limit.toString();
    }
    let _headers = mergeHeaders(
      (_a2 = this._options) == null ? void 0 : _a2.headers,
      mergeOnlyDefinedHeaders({
        Authorization: await this._getAuthorizationHeader(),
        "X-Langfuse-Sdk-Name": (_c = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkName) != null ? _c : (_b = this._options) == null ? void 0 : _b.xLangfuseSdkName,
        "X-Langfuse-Sdk-Version": (_e = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkVersion) != null ? _e : (_d = this._options) == null ? void 0 : _d.xLangfuseSdkVersion,
        "X-Langfuse-Public-Key": (_g = requestOptions == null ? void 0 : requestOptions.xLangfusePublicKey) != null ? _g : (_f = this._options) == null ? void 0 : _f.xLangfusePublicKey
      }),
      requestOptions == null ? void 0 : requestOptions.headers
    );
    const _response = await fetcher({
      url: url_exports.join(
        (_h = await Supplier.get(this._options.baseUrl)) != null ? _h : await Supplier.get(this._options.environment),
        "/api/public/models"
      ),
      method: "GET",
      headers: _headers,
      queryParameters: { ..._queryParams, ...requestOptions == null ? void 0 : requestOptions.queryParams },
      timeoutMs: (requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
      maxRetries: requestOptions == null ? void 0 : requestOptions.maxRetries,
      abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal
    });
    if (_response.ok) {
      return {
        data: _response.body,
        rawResponse: _response.rawResponse
      };
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 400:
          throw new Error2(
            _response.error.body,
            _response.rawResponse
          );
        case 401:
          throw new UnauthorizedError(
            _response.error.body,
            _response.rawResponse
          );
        case 403:
          throw new AccessDeniedError(
            _response.error.body,
            _response.rawResponse
          );
        case 405:
          throw new MethodNotAllowedError(
            _response.error.body,
            _response.rawResponse
          );
        case 404:
          throw new NotFoundError(
            _response.error.body,
            _response.rawResponse
          );
        default:
          throw new LangfuseAPIError({
            statusCode: _response.error.statusCode,
            body: _response.error.body,
            rawResponse: _response.rawResponse
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new LangfuseAPIError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody,
          rawResponse: _response.rawResponse
        });
      case "timeout":
        throw new LangfuseAPITimeoutError(
          "Timeout exceeded when calling GET /api/public/models."
        );
      case "unknown":
        throw new LangfuseAPIError({
          message: _response.error.errorMessage,
          rawResponse: _response.rawResponse
        });
    }
  }
  /**
   * Get a model
   *
   * @param {string} id
   * @param {Models.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link LangfuseAPI.Error}
   * @throws {@link LangfuseAPI.UnauthorizedError}
   * @throws {@link LangfuseAPI.AccessDeniedError}
   * @throws {@link LangfuseAPI.MethodNotAllowedError}
   * @throws {@link LangfuseAPI.NotFoundError}
   *
   * @example
   *     await client.models.get("id")
   */
  get(id, requestOptions) {
    return HttpResponsePromise.fromPromise(this.__get(id, requestOptions));
  }
  async __get(id, requestOptions) {
    var _a2, _b, _c, _d, _e, _f, _g, _h;
    let _headers = mergeHeaders(
      (_a2 = this._options) == null ? void 0 : _a2.headers,
      mergeOnlyDefinedHeaders({
        Authorization: await this._getAuthorizationHeader(),
        "X-Langfuse-Sdk-Name": (_c = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkName) != null ? _c : (_b = this._options) == null ? void 0 : _b.xLangfuseSdkName,
        "X-Langfuse-Sdk-Version": (_e = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkVersion) != null ? _e : (_d = this._options) == null ? void 0 : _d.xLangfuseSdkVersion,
        "X-Langfuse-Public-Key": (_g = requestOptions == null ? void 0 : requestOptions.xLangfusePublicKey) != null ? _g : (_f = this._options) == null ? void 0 : _f.xLangfusePublicKey
      }),
      requestOptions == null ? void 0 : requestOptions.headers
    );
    const _response = await fetcher({
      url: url_exports.join(
        (_h = await Supplier.get(this._options.baseUrl)) != null ? _h : await Supplier.get(this._options.environment),
        `/api/public/models/${encodeURIComponent(id)}`
      ),
      method: "GET",
      headers: _headers,
      queryParameters: requestOptions == null ? void 0 : requestOptions.queryParams,
      timeoutMs: (requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
      maxRetries: requestOptions == null ? void 0 : requestOptions.maxRetries,
      abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal
    });
    if (_response.ok) {
      return {
        data: _response.body,
        rawResponse: _response.rawResponse
      };
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 400:
          throw new Error2(
            _response.error.body,
            _response.rawResponse
          );
        case 401:
          throw new UnauthorizedError(
            _response.error.body,
            _response.rawResponse
          );
        case 403:
          throw new AccessDeniedError(
            _response.error.body,
            _response.rawResponse
          );
        case 405:
          throw new MethodNotAllowedError(
            _response.error.body,
            _response.rawResponse
          );
        case 404:
          throw new NotFoundError(
            _response.error.body,
            _response.rawResponse
          );
        default:
          throw new LangfuseAPIError({
            statusCode: _response.error.statusCode,
            body: _response.error.body,
            rawResponse: _response.rawResponse
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new LangfuseAPIError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody,
          rawResponse: _response.rawResponse
        });
      case "timeout":
        throw new LangfuseAPITimeoutError(
          "Timeout exceeded when calling GET /api/public/models/{id}."
        );
      case "unknown":
        throw new LangfuseAPIError({
          message: _response.error.errorMessage,
          rawResponse: _response.rawResponse
        });
    }
  }
  /**
   * Delete a model. Cannot delete models managed by Langfuse. You can create your own definition with the same modelName to override the definition though.
   *
   * @param {string} id
   * @param {Models.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link LangfuseAPI.Error}
   * @throws {@link LangfuseAPI.UnauthorizedError}
   * @throws {@link LangfuseAPI.AccessDeniedError}
   * @throws {@link LangfuseAPI.MethodNotAllowedError}
   * @throws {@link LangfuseAPI.NotFoundError}
   *
   * @example
   *     await client.models.delete("id")
   */
  delete(id, requestOptions) {
    return HttpResponsePromise.fromPromise(
      this.__delete(id, requestOptions)
    );
  }
  async __delete(id, requestOptions) {
    var _a2, _b, _c, _d, _e, _f, _g, _h;
    let _headers = mergeHeaders(
      (_a2 = this._options) == null ? void 0 : _a2.headers,
      mergeOnlyDefinedHeaders({
        Authorization: await this._getAuthorizationHeader(),
        "X-Langfuse-Sdk-Name": (_c = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkName) != null ? _c : (_b = this._options) == null ? void 0 : _b.xLangfuseSdkName,
        "X-Langfuse-Sdk-Version": (_e = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkVersion) != null ? _e : (_d = this._options) == null ? void 0 : _d.xLangfuseSdkVersion,
        "X-Langfuse-Public-Key": (_g = requestOptions == null ? void 0 : requestOptions.xLangfusePublicKey) != null ? _g : (_f = this._options) == null ? void 0 : _f.xLangfusePublicKey
      }),
      requestOptions == null ? void 0 : requestOptions.headers
    );
    const _response = await fetcher({
      url: url_exports.join(
        (_h = await Supplier.get(this._options.baseUrl)) != null ? _h : await Supplier.get(this._options.environment),
        `/api/public/models/${encodeURIComponent(id)}`
      ),
      method: "DELETE",
      headers: _headers,
      queryParameters: requestOptions == null ? void 0 : requestOptions.queryParams,
      timeoutMs: (requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
      maxRetries: requestOptions == null ? void 0 : requestOptions.maxRetries,
      abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal
    });
    if (_response.ok) {
      return { data: void 0, rawResponse: _response.rawResponse };
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 400:
          throw new Error2(
            _response.error.body,
            _response.rawResponse
          );
        case 401:
          throw new UnauthorizedError(
            _response.error.body,
            _response.rawResponse
          );
        case 403:
          throw new AccessDeniedError(
            _response.error.body,
            _response.rawResponse
          );
        case 405:
          throw new MethodNotAllowedError(
            _response.error.body,
            _response.rawResponse
          );
        case 404:
          throw new NotFoundError(
            _response.error.body,
            _response.rawResponse
          );
        default:
          throw new LangfuseAPIError({
            statusCode: _response.error.statusCode,
            body: _response.error.body,
            rawResponse: _response.rawResponse
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new LangfuseAPIError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody,
          rawResponse: _response.rawResponse
        });
      case "timeout":
        throw new LangfuseAPITimeoutError(
          "Timeout exceeded when calling DELETE /api/public/models/{id}."
        );
      case "unknown":
        throw new LangfuseAPIError({
          message: _response.error.errorMessage,
          rawResponse: _response.rawResponse
        });
    }
  }
  async _getAuthorizationHeader() {
    const username = await Supplier.get(this._options.username);
    const password = await Supplier.get(this._options.password);
    if (username != null && password != null) {
      return BasicAuth.toAuthorizationHeader({
        username,
        password
      });
    }
    return void 0;
  }
};

// src/api/api/resources/observationsV2/client/Client.ts
var ObservationsV2 = class {
  constructor(_options) {
    this._options = _options;
  }
  /**
   * Get a list of observations with cursor-based pagination and flexible field selection.
   *
   * ## Cursor-based Pagination
   * This endpoint uses cursor-based pagination for efficient traversal of large datasets.
   * The cursor is returned in the response metadata and should be passed in subsequent requests
   * to retrieve the next page of results.
   *
   * ## Field Selection
   * Use the `fields` parameter to control which observation fields are returned:
   * - `core` - Always included: id, traceId, startTime, endTime, projectId, parentObservationId, type
   * - `basic` - name, level, statusMessage, version, environment, bookmarked, public, userId, sessionId
   * - `time` - completionStartTime, createdAt, updatedAt
   * - `io` - input, output
   * - `metadata` - metadata (truncated to 200 chars by default, use `expandMetadata` to get full values)
   * - `model` - providedModelName, internalModelId, modelParameters
   * - `usage` - usageDetails, costDetails, totalCost
   * - `prompt` - promptId, promptName, promptVersion
   * - `metrics` - latency, timeToFirstToken
   *
   * If not specified, `core` and `basic` field groups are returned.
   *
   * ## Filters
   * Multiple filtering options are available via query parameters or the structured `filter` parameter.
   * When using the `filter` parameter, it takes precedence over individual query parameter filters.
   *
   * @param {LangfuseAPI.GetObservationsV2Request} request
   * @param {ObservationsV2.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link LangfuseAPI.Error}
   * @throws {@link LangfuseAPI.UnauthorizedError}
   * @throws {@link LangfuseAPI.AccessDeniedError}
   * @throws {@link LangfuseAPI.MethodNotAllowedError}
   * @throws {@link LangfuseAPI.NotFoundError}
   *
   * @example
   *     await client.observationsV2.getMany()
   */
  getMany(request = {}, requestOptions) {
    return HttpResponsePromise.fromPromise(
      this.__getMany(request, requestOptions)
    );
  }
  async __getMany(request = {}, requestOptions) {
    var _a2, _b, _c, _d, _e, _f, _g, _h;
    const {
      fields,
      expandMetadata,
      limit,
      cursor,
      parseIoAsJson,
      name,
      userId,
      type: type_,
      traceId,
      level,
      parentObservationId,
      environment,
      fromStartTime,
      toStartTime,
      version,
      filter
    } = request;
    const _queryParams = {};
    if (fields != null) {
      _queryParams["fields"] = fields;
    }
    if (expandMetadata != null) {
      _queryParams["expandMetadata"] = expandMetadata;
    }
    if (limit != null) {
      _queryParams["limit"] = limit.toString();
    }
    if (cursor != null) {
      _queryParams["cursor"] = cursor;
    }
    if (parseIoAsJson != null) {
      _queryParams["parseIoAsJson"] = parseIoAsJson.toString();
    }
    if (name != null) {
      _queryParams["name"] = name;
    }
    if (userId != null) {
      _queryParams["userId"] = userId;
    }
    if (type_ != null) {
      _queryParams["type"] = type_;
    }
    if (traceId != null) {
      _queryParams["traceId"] = traceId;
    }
    if (level != null) {
      _queryParams["level"] = level;
    }
    if (parentObservationId != null) {
      _queryParams["parentObservationId"] = parentObservationId;
    }
    if (environment != null) {
      if (Array.isArray(environment)) {
        _queryParams["environment"] = environment.map((item) => item);
      } else {
        _queryParams["environment"] = environment;
      }
    }
    if (fromStartTime != null) {
      _queryParams["fromStartTime"] = fromStartTime;
    }
    if (toStartTime != null) {
      _queryParams["toStartTime"] = toStartTime;
    }
    if (version != null) {
      _queryParams["version"] = version;
    }
    if (filter != null) {
      _queryParams["filter"] = filter;
    }
    let _headers = mergeHeaders(
      (_a2 = this._options) == null ? void 0 : _a2.headers,
      mergeOnlyDefinedHeaders({
        Authorization: await this._getAuthorizationHeader(),
        "X-Langfuse-Sdk-Name": (_c = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkName) != null ? _c : (_b = this._options) == null ? void 0 : _b.xLangfuseSdkName,
        "X-Langfuse-Sdk-Version": (_e = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkVersion) != null ? _e : (_d = this._options) == null ? void 0 : _d.xLangfuseSdkVersion,
        "X-Langfuse-Public-Key": (_g = requestOptions == null ? void 0 : requestOptions.xLangfusePublicKey) != null ? _g : (_f = this._options) == null ? void 0 : _f.xLangfusePublicKey
      }),
      requestOptions == null ? void 0 : requestOptions.headers
    );
    const _response = await fetcher({
      url: url_exports.join(
        (_h = await Supplier.get(this._options.baseUrl)) != null ? _h : await Supplier.get(this._options.environment),
        "/api/public/v2/observations"
      ),
      method: "GET",
      headers: _headers,
      queryParameters: { ..._queryParams, ...requestOptions == null ? void 0 : requestOptions.queryParams },
      timeoutMs: (requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
      maxRetries: requestOptions == null ? void 0 : requestOptions.maxRetries,
      abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal
    });
    if (_response.ok) {
      return {
        data: _response.body,
        rawResponse: _response.rawResponse
      };
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 400:
          throw new Error2(
            _response.error.body,
            _response.rawResponse
          );
        case 401:
          throw new UnauthorizedError(
            _response.error.body,
            _response.rawResponse
          );
        case 403:
          throw new AccessDeniedError(
            _response.error.body,
            _response.rawResponse
          );
        case 405:
          throw new MethodNotAllowedError(
            _response.error.body,
            _response.rawResponse
          );
        case 404:
          throw new NotFoundError(
            _response.error.body,
            _response.rawResponse
          );
        default:
          throw new LangfuseAPIError({
            statusCode: _response.error.statusCode,
            body: _response.error.body,
            rawResponse: _response.rawResponse
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new LangfuseAPIError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody,
          rawResponse: _response.rawResponse
        });
      case "timeout":
        throw new LangfuseAPITimeoutError(
          "Timeout exceeded when calling GET /api/public/v2/observations."
        );
      case "unknown":
        throw new LangfuseAPIError({
          message: _response.error.errorMessage,
          rawResponse: _response.rawResponse
        });
    }
  }
  async _getAuthorizationHeader() {
    const username = await Supplier.get(this._options.username);
    const password = await Supplier.get(this._options.password);
    if (username != null && password != null) {
      return BasicAuth.toAuthorizationHeader({
        username,
        password
      });
    }
    return void 0;
  }
};

// src/api/api/resources/observations/client/Client.ts
var Observations = class {
  constructor(_options) {
    this._options = _options;
  }
  /**
   * Get a observation
   *
   * @param {string} observationId - The unique langfuse identifier of an observation, can be an event, span or generation
   * @param {Observations.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link LangfuseAPI.Error}
   * @throws {@link LangfuseAPI.UnauthorizedError}
   * @throws {@link LangfuseAPI.AccessDeniedError}
   * @throws {@link LangfuseAPI.MethodNotAllowedError}
   * @throws {@link LangfuseAPI.NotFoundError}
   *
   * @example
   *     await client.observations.get("observationId")
   */
  get(observationId, requestOptions) {
    return HttpResponsePromise.fromPromise(
      this.__get(observationId, requestOptions)
    );
  }
  async __get(observationId, requestOptions) {
    var _a2, _b, _c, _d, _e, _f, _g, _h;
    let _headers = mergeHeaders(
      (_a2 = this._options) == null ? void 0 : _a2.headers,
      mergeOnlyDefinedHeaders({
        Authorization: await this._getAuthorizationHeader(),
        "X-Langfuse-Sdk-Name": (_c = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkName) != null ? _c : (_b = this._options) == null ? void 0 : _b.xLangfuseSdkName,
        "X-Langfuse-Sdk-Version": (_e = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkVersion) != null ? _e : (_d = this._options) == null ? void 0 : _d.xLangfuseSdkVersion,
        "X-Langfuse-Public-Key": (_g = requestOptions == null ? void 0 : requestOptions.xLangfusePublicKey) != null ? _g : (_f = this._options) == null ? void 0 : _f.xLangfusePublicKey
      }),
      requestOptions == null ? void 0 : requestOptions.headers
    );
    const _response = await fetcher({
      url: url_exports.join(
        (_h = await Supplier.get(this._options.baseUrl)) != null ? _h : await Supplier.get(this._options.environment),
        `/api/public/observations/${encodeURIComponent(observationId)}`
      ),
      method: "GET",
      headers: _headers,
      queryParameters: requestOptions == null ? void 0 : requestOptions.queryParams,
      timeoutMs: (requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
      maxRetries: requestOptions == null ? void 0 : requestOptions.maxRetries,
      abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal
    });
    if (_response.ok) {
      return {
        data: _response.body,
        rawResponse: _response.rawResponse
      };
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 400:
          throw new Error2(
            _response.error.body,
            _response.rawResponse
          );
        case 401:
          throw new UnauthorizedError(
            _response.error.body,
            _response.rawResponse
          );
        case 403:
          throw new AccessDeniedError(
            _response.error.body,
            _response.rawResponse
          );
        case 405:
          throw new MethodNotAllowedError(
            _response.error.body,
            _response.rawResponse
          );
        case 404:
          throw new NotFoundError(
            _response.error.body,
            _response.rawResponse
          );
        default:
          throw new LangfuseAPIError({
            statusCode: _response.error.statusCode,
            body: _response.error.body,
            rawResponse: _response.rawResponse
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new LangfuseAPIError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody,
          rawResponse: _response.rawResponse
        });
      case "timeout":
        throw new LangfuseAPITimeoutError(
          "Timeout exceeded when calling GET /api/public/observations/{observationId}."
        );
      case "unknown":
        throw new LangfuseAPIError({
          message: _response.error.errorMessage,
          rawResponse: _response.rawResponse
        });
    }
  }
  /**
   * Get a list of observations.
   *
   * Consider using the [v2 observations endpoint](/api-reference#tag/observationsv2/GET/api/public/v2/observations) for cursor-based pagination and field selection.
   *
   * @param {LangfuseAPI.GetObservationsRequest} request
   * @param {Observations.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link LangfuseAPI.Error}
   * @throws {@link LangfuseAPI.UnauthorizedError}
   * @throws {@link LangfuseAPI.AccessDeniedError}
   * @throws {@link LangfuseAPI.MethodNotAllowedError}
   * @throws {@link LangfuseAPI.NotFoundError}
   *
   * @example
   *     await client.observations.getMany()
   */
  getMany(request = {}, requestOptions) {
    return HttpResponsePromise.fromPromise(
      this.__getMany(request, requestOptions)
    );
  }
  async __getMany(request = {}, requestOptions) {
    var _a2, _b, _c, _d, _e, _f, _g, _h;
    const {
      page,
      limit,
      name,
      userId,
      type: type_,
      traceId,
      level,
      parentObservationId,
      environment,
      fromStartTime,
      toStartTime,
      version,
      filter
    } = request;
    const _queryParams = {};
    if (page != null) {
      _queryParams["page"] = page.toString();
    }
    if (limit != null) {
      _queryParams["limit"] = limit.toString();
    }
    if (name != null) {
      _queryParams["name"] = name;
    }
    if (userId != null) {
      _queryParams["userId"] = userId;
    }
    if (type_ != null) {
      _queryParams["type"] = type_;
    }
    if (traceId != null) {
      _queryParams["traceId"] = traceId;
    }
    if (level != null) {
      _queryParams["level"] = level;
    }
    if (parentObservationId != null) {
      _queryParams["parentObservationId"] = parentObservationId;
    }
    if (environment != null) {
      if (Array.isArray(environment)) {
        _queryParams["environment"] = environment.map((item) => item);
      } else {
        _queryParams["environment"] = environment;
      }
    }
    if (fromStartTime != null) {
      _queryParams["fromStartTime"] = fromStartTime;
    }
    if (toStartTime != null) {
      _queryParams["toStartTime"] = toStartTime;
    }
    if (version != null) {
      _queryParams["version"] = version;
    }
    if (filter != null) {
      _queryParams["filter"] = filter;
    }
    let _headers = mergeHeaders(
      (_a2 = this._options) == null ? void 0 : _a2.headers,
      mergeOnlyDefinedHeaders({
        Authorization: await this._getAuthorizationHeader(),
        "X-Langfuse-Sdk-Name": (_c = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkName) != null ? _c : (_b = this._options) == null ? void 0 : _b.xLangfuseSdkName,
        "X-Langfuse-Sdk-Version": (_e = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkVersion) != null ? _e : (_d = this._options) == null ? void 0 : _d.xLangfuseSdkVersion,
        "X-Langfuse-Public-Key": (_g = requestOptions == null ? void 0 : requestOptions.xLangfusePublicKey) != null ? _g : (_f = this._options) == null ? void 0 : _f.xLangfusePublicKey
      }),
      requestOptions == null ? void 0 : requestOptions.headers
    );
    const _response = await fetcher({
      url: url_exports.join(
        (_h = await Supplier.get(this._options.baseUrl)) != null ? _h : await Supplier.get(this._options.environment),
        "/api/public/observations"
      ),
      method: "GET",
      headers: _headers,
      queryParameters: { ..._queryParams, ...requestOptions == null ? void 0 : requestOptions.queryParams },
      timeoutMs: (requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
      maxRetries: requestOptions == null ? void 0 : requestOptions.maxRetries,
      abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal
    });
    if (_response.ok) {
      return {
        data: _response.body,
        rawResponse: _response.rawResponse
      };
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 400:
          throw new Error2(
            _response.error.body,
            _response.rawResponse
          );
        case 401:
          throw new UnauthorizedError(
            _response.error.body,
            _response.rawResponse
          );
        case 403:
          throw new AccessDeniedError(
            _response.error.body,
            _response.rawResponse
          );
        case 405:
          throw new MethodNotAllowedError(
            _response.error.body,
            _response.rawResponse
          );
        case 404:
          throw new NotFoundError(
            _response.error.body,
            _response.rawResponse
          );
        default:
          throw new LangfuseAPIError({
            statusCode: _response.error.statusCode,
            body: _response.error.body,
            rawResponse: _response.rawResponse
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new LangfuseAPIError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody,
          rawResponse: _response.rawResponse
        });
      case "timeout":
        throw new LangfuseAPITimeoutError(
          "Timeout exceeded when calling GET /api/public/observations."
        );
      case "unknown":
        throw new LangfuseAPIError({
          message: _response.error.errorMessage,
          rawResponse: _response.rawResponse
        });
    }
  }
  async _getAuthorizationHeader() {
    const username = await Supplier.get(this._options.username);
    const password = await Supplier.get(this._options.password);
    if (username != null && password != null) {
      return BasicAuth.toAuthorizationHeader({
        username,
        password
      });
    }
    return void 0;
  }
};

// src/api/api/resources/opentelemetry/client/Client.ts
var Opentelemetry = class {
  constructor(_options) {
    this._options = _options;
  }
  /**
   * **OpenTelemetry Traces Ingestion Endpoint**
   *
   * This endpoint implements the OTLP/HTTP specification for trace ingestion, providing native OpenTelemetry integration for Langfuse Observability.
   *
   * **Supported Formats:**
   * - Binary Protobuf: `Content-Type: application/x-protobuf`
   * - JSON Protobuf: `Content-Type: application/json`
   * - Supports gzip compression via `Content-Encoding: gzip` header
   *
   * **Specification Compliance:**
   * - Conforms to [OTLP/HTTP Trace Export](https://opentelemetry.io/docs/specs/otlp/#otlphttp)
   * - Implements `ExportTraceServiceRequest` message format
   *
   * **Documentation:**
   * - Integration guide: https://langfuse.com/integrations/native/opentelemetry
   * - Data model: https://langfuse.com/docs/observability/data-model
   *
   * @param {LangfuseAPI.OtelTraceRequest} request
   * @param {Opentelemetry.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link LangfuseAPI.Error}
   * @throws {@link LangfuseAPI.UnauthorizedError}
   * @throws {@link LangfuseAPI.AccessDeniedError}
   * @throws {@link LangfuseAPI.MethodNotAllowedError}
   * @throws {@link LangfuseAPI.NotFoundError}
   *
   * @example
   *     await client.opentelemetry.exportTraces({
   *         resourceSpans: [{
   *                 resource: {
   *                     attributes: [{
   *                             key: "service.name",
   *                             value: {
   *                                 stringValue: "my-service"
   *                             }
   *                         }, {
   *                             key: "service.version",
   *                             value: {
   *                                 stringValue: "1.0.0"
   *                             }
   *                         }]
   *                 },
   *                 scopeSpans: [{
   *                         scope: {
   *                             name: "langfuse-sdk",
   *                             version: "2.60.3"
   *                         },
   *                         spans: [{
   *                                 traceId: "0123456789abcdef0123456789abcdef",
   *                                 spanId: "0123456789abcdef",
   *                                 name: "my-operation",
   *                                 kind: 1,
   *                                 startTimeUnixNano: "1747872000000000000",
   *                                 endTimeUnixNano: "1747872001000000000",
   *                                 attributes: [{
   *                                         key: "langfuse.observation.type",
   *                                         value: {
   *                                             stringValue: "generation"
   *                                         }
   *                                     }],
   *                                 status: {}
   *                             }]
   *                     }]
   *             }]
   *     })
   */
  exportTraces(request, requestOptions) {
    return HttpResponsePromise.fromPromise(
      this.__exportTraces(request, requestOptions)
    );
  }
  async __exportTraces(request, requestOptions) {
    var _a2, _b, _c, _d, _e, _f, _g, _h;
    let _headers = mergeHeaders(
      (_a2 = this._options) == null ? void 0 : _a2.headers,
      mergeOnlyDefinedHeaders({
        Authorization: await this._getAuthorizationHeader(),
        "X-Langfuse-Sdk-Name": (_c = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkName) != null ? _c : (_b = this._options) == null ? void 0 : _b.xLangfuseSdkName,
        "X-Langfuse-Sdk-Version": (_e = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkVersion) != null ? _e : (_d = this._options) == null ? void 0 : _d.xLangfuseSdkVersion,
        "X-Langfuse-Public-Key": (_g = requestOptions == null ? void 0 : requestOptions.xLangfusePublicKey) != null ? _g : (_f = this._options) == null ? void 0 : _f.xLangfusePublicKey
      }),
      requestOptions == null ? void 0 : requestOptions.headers
    );
    const _response = await fetcher({
      url: url_exports.join(
        (_h = await Supplier.get(this._options.baseUrl)) != null ? _h : await Supplier.get(this._options.environment),
        "/api/public/otel/v1/traces"
      ),
      method: "POST",
      headers: _headers,
      contentType: "application/json",
      queryParameters: requestOptions == null ? void 0 : requestOptions.queryParams,
      requestType: "json",
      body: request,
      timeoutMs: (requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
      maxRetries: requestOptions == null ? void 0 : requestOptions.maxRetries,
      abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal
    });
    if (_response.ok) {
      return {
        data: _response.body,
        rawResponse: _response.rawResponse
      };
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 400:
          throw new Error2(
            _response.error.body,
            _response.rawResponse
          );
        case 401:
          throw new UnauthorizedError(
            _response.error.body,
            _response.rawResponse
          );
        case 403:
          throw new AccessDeniedError(
            _response.error.body,
            _response.rawResponse
          );
        case 405:
          throw new MethodNotAllowedError(
            _response.error.body,
            _response.rawResponse
          );
        case 404:
          throw new NotFoundError(
            _response.error.body,
            _response.rawResponse
          );
        default:
          throw new LangfuseAPIError({
            statusCode: _response.error.statusCode,
            body: _response.error.body,
            rawResponse: _response.rawResponse
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new LangfuseAPIError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody,
          rawResponse: _response.rawResponse
        });
      case "timeout":
        throw new LangfuseAPITimeoutError(
          "Timeout exceeded when calling POST /api/public/otel/v1/traces."
        );
      case "unknown":
        throw new LangfuseAPIError({
          message: _response.error.errorMessage,
          rawResponse: _response.rawResponse
        });
    }
  }
  async _getAuthorizationHeader() {
    const username = await Supplier.get(this._options.username);
    const password = await Supplier.get(this._options.password);
    if (username != null && password != null) {
      return BasicAuth.toAuthorizationHeader({
        username,
        password
      });
    }
    return void 0;
  }
};

// src/api/api/resources/organizations/client/Client.ts
var Organizations = class {
  constructor(_options) {
    this._options = _options;
  }
  /**
   * Get all memberships for the organization associated with the API key (requires organization-scoped API key)
   *
   * @param {Organizations.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link LangfuseAPI.Error}
   * @throws {@link LangfuseAPI.UnauthorizedError}
   * @throws {@link LangfuseAPI.AccessDeniedError}
   * @throws {@link LangfuseAPI.MethodNotAllowedError}
   * @throws {@link LangfuseAPI.NotFoundError}
   *
   * @example
   *     await client.organizations.getOrganizationMemberships()
   */
  getOrganizationMemberships(requestOptions) {
    return HttpResponsePromise.fromPromise(
      this.__getOrganizationMemberships(requestOptions)
    );
  }
  async __getOrganizationMemberships(requestOptions) {
    var _a2, _b, _c, _d, _e, _f, _g, _h;
    let _headers = mergeHeaders(
      (_a2 = this._options) == null ? void 0 : _a2.headers,
      mergeOnlyDefinedHeaders({
        Authorization: await this._getAuthorizationHeader(),
        "X-Langfuse-Sdk-Name": (_c = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkName) != null ? _c : (_b = this._options) == null ? void 0 : _b.xLangfuseSdkName,
        "X-Langfuse-Sdk-Version": (_e = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkVersion) != null ? _e : (_d = this._options) == null ? void 0 : _d.xLangfuseSdkVersion,
        "X-Langfuse-Public-Key": (_g = requestOptions == null ? void 0 : requestOptions.xLangfusePublicKey) != null ? _g : (_f = this._options) == null ? void 0 : _f.xLangfusePublicKey
      }),
      requestOptions == null ? void 0 : requestOptions.headers
    );
    const _response = await fetcher({
      url: url_exports.join(
        (_h = await Supplier.get(this._options.baseUrl)) != null ? _h : await Supplier.get(this._options.environment),
        "/api/public/organizations/memberships"
      ),
      method: "GET",
      headers: _headers,
      queryParameters: requestOptions == null ? void 0 : requestOptions.queryParams,
      timeoutMs: (requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
      maxRetries: requestOptions == null ? void 0 : requestOptions.maxRetries,
      abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal
    });
    if (_response.ok) {
      return {
        data: _response.body,
        rawResponse: _response.rawResponse
      };
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 400:
          throw new Error2(
            _response.error.body,
            _response.rawResponse
          );
        case 401:
          throw new UnauthorizedError(
            _response.error.body,
            _response.rawResponse
          );
        case 403:
          throw new AccessDeniedError(
            _response.error.body,
            _response.rawResponse
          );
        case 405:
          throw new MethodNotAllowedError(
            _response.error.body,
            _response.rawResponse
          );
        case 404:
          throw new NotFoundError(
            _response.error.body,
            _response.rawResponse
          );
        default:
          throw new LangfuseAPIError({
            statusCode: _response.error.statusCode,
            body: _response.error.body,
            rawResponse: _response.rawResponse
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new LangfuseAPIError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody,
          rawResponse: _response.rawResponse
        });
      case "timeout":
        throw new LangfuseAPITimeoutError(
          "Timeout exceeded when calling GET /api/public/organizations/memberships."
        );
      case "unknown":
        throw new LangfuseAPIError({
          message: _response.error.errorMessage,
          rawResponse: _response.rawResponse
        });
    }
  }
  /**
   * Create or update a membership for the organization associated with the API key (requires organization-scoped API key)
   *
   * @param {LangfuseAPI.MembershipRequest} request
   * @param {Organizations.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link LangfuseAPI.Error}
   * @throws {@link LangfuseAPI.UnauthorizedError}
   * @throws {@link LangfuseAPI.AccessDeniedError}
   * @throws {@link LangfuseAPI.MethodNotAllowedError}
   * @throws {@link LangfuseAPI.NotFoundError}
   *
   * @example
   *     await client.organizations.updateOrganizationMembership({
   *         userId: "userId",
   *         role: "OWNER"
   *     })
   */
  updateOrganizationMembership(request, requestOptions) {
    return HttpResponsePromise.fromPromise(
      this.__updateOrganizationMembership(request, requestOptions)
    );
  }
  async __updateOrganizationMembership(request, requestOptions) {
    var _a2, _b, _c, _d, _e, _f, _g, _h;
    let _headers = mergeHeaders(
      (_a2 = this._options) == null ? void 0 : _a2.headers,
      mergeOnlyDefinedHeaders({
        Authorization: await this._getAuthorizationHeader(),
        "X-Langfuse-Sdk-Name": (_c = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkName) != null ? _c : (_b = this._options) == null ? void 0 : _b.xLangfuseSdkName,
        "X-Langfuse-Sdk-Version": (_e = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkVersion) != null ? _e : (_d = this._options) == null ? void 0 : _d.xLangfuseSdkVersion,
        "X-Langfuse-Public-Key": (_g = requestOptions == null ? void 0 : requestOptions.xLangfusePublicKey) != null ? _g : (_f = this._options) == null ? void 0 : _f.xLangfusePublicKey
      }),
      requestOptions == null ? void 0 : requestOptions.headers
    );
    const _response = await fetcher({
      url: url_exports.join(
        (_h = await Supplier.get(this._options.baseUrl)) != null ? _h : await Supplier.get(this._options.environment),
        "/api/public/organizations/memberships"
      ),
      method: "PUT",
      headers: _headers,
      contentType: "application/json",
      queryParameters: requestOptions == null ? void 0 : requestOptions.queryParams,
      requestType: "json",
      body: request,
      timeoutMs: (requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
      maxRetries: requestOptions == null ? void 0 : requestOptions.maxRetries,
      abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal
    });
    if (_response.ok) {
      return {
        data: _response.body,
        rawResponse: _response.rawResponse
      };
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 400:
          throw new Error2(
            _response.error.body,
            _response.rawResponse
          );
        case 401:
          throw new UnauthorizedError(
            _response.error.body,
            _response.rawResponse
          );
        case 403:
          throw new AccessDeniedError(
            _response.error.body,
            _response.rawResponse
          );
        case 405:
          throw new MethodNotAllowedError(
            _response.error.body,
            _response.rawResponse
          );
        case 404:
          throw new NotFoundError(
            _response.error.body,
            _response.rawResponse
          );
        default:
          throw new LangfuseAPIError({
            statusCode: _response.error.statusCode,
            body: _response.error.body,
            rawResponse: _response.rawResponse
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new LangfuseAPIError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody,
          rawResponse: _response.rawResponse
        });
      case "timeout":
        throw new LangfuseAPITimeoutError(
          "Timeout exceeded when calling PUT /api/public/organizations/memberships."
        );
      case "unknown":
        throw new LangfuseAPIError({
          message: _response.error.errorMessage,
          rawResponse: _response.rawResponse
        });
    }
  }
  /**
   * Delete a membership from the organization associated with the API key (requires organization-scoped API key)
   *
   * @param {LangfuseAPI.DeleteMembershipRequest} request
   * @param {Organizations.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link LangfuseAPI.Error}
   * @throws {@link LangfuseAPI.UnauthorizedError}
   * @throws {@link LangfuseAPI.AccessDeniedError}
   * @throws {@link LangfuseAPI.MethodNotAllowedError}
   * @throws {@link LangfuseAPI.NotFoundError}
   *
   * @example
   *     await client.organizations.deleteOrganizationMembership({
   *         userId: "userId"
   *     })
   */
  deleteOrganizationMembership(request, requestOptions) {
    return HttpResponsePromise.fromPromise(
      this.__deleteOrganizationMembership(request, requestOptions)
    );
  }
  async __deleteOrganizationMembership(request, requestOptions) {
    var _a2, _b, _c, _d, _e, _f, _g, _h;
    let _headers = mergeHeaders(
      (_a2 = this._options) == null ? void 0 : _a2.headers,
      mergeOnlyDefinedHeaders({
        Authorization: await this._getAuthorizationHeader(),
        "X-Langfuse-Sdk-Name": (_c = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkName) != null ? _c : (_b = this._options) == null ? void 0 : _b.xLangfuseSdkName,
        "X-Langfuse-Sdk-Version": (_e = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkVersion) != null ? _e : (_d = this._options) == null ? void 0 : _d.xLangfuseSdkVersion,
        "X-Langfuse-Public-Key": (_g = requestOptions == null ? void 0 : requestOptions.xLangfusePublicKey) != null ? _g : (_f = this._options) == null ? void 0 : _f.xLangfusePublicKey
      }),
      requestOptions == null ? void 0 : requestOptions.headers
    );
    const _response = await fetcher({
      url: url_exports.join(
        (_h = await Supplier.get(this._options.baseUrl)) != null ? _h : await Supplier.get(this._options.environment),
        "/api/public/organizations/memberships"
      ),
      method: "DELETE",
      headers: _headers,
      contentType: "application/json",
      queryParameters: requestOptions == null ? void 0 : requestOptions.queryParams,
      requestType: "json",
      body: request,
      timeoutMs: (requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
      maxRetries: requestOptions == null ? void 0 : requestOptions.maxRetries,
      abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal
    });
    if (_response.ok) {
      return {
        data: _response.body,
        rawResponse: _response.rawResponse
      };
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 400:
          throw new Error2(
            _response.error.body,
            _response.rawResponse
          );
        case 401:
          throw new UnauthorizedError(
            _response.error.body,
            _response.rawResponse
          );
        case 403:
          throw new AccessDeniedError(
            _response.error.body,
            _response.rawResponse
          );
        case 405:
          throw new MethodNotAllowedError(
            _response.error.body,
            _response.rawResponse
          );
        case 404:
          throw new NotFoundError(
            _response.error.body,
            _response.rawResponse
          );
        default:
          throw new LangfuseAPIError({
            statusCode: _response.error.statusCode,
            body: _response.error.body,
            rawResponse: _response.rawResponse
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new LangfuseAPIError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody,
          rawResponse: _response.rawResponse
        });
      case "timeout":
        throw new LangfuseAPITimeoutError(
          "Timeout exceeded when calling DELETE /api/public/organizations/memberships."
        );
      case "unknown":
        throw new LangfuseAPIError({
          message: _response.error.errorMessage,
          rawResponse: _response.rawResponse
        });
    }
  }
  /**
   * Get all memberships for a specific project (requires organization-scoped API key)
   *
   * @param {string} projectId
   * @param {Organizations.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link LangfuseAPI.Error}
   * @throws {@link LangfuseAPI.UnauthorizedError}
   * @throws {@link LangfuseAPI.AccessDeniedError}
   * @throws {@link LangfuseAPI.MethodNotAllowedError}
   * @throws {@link LangfuseAPI.NotFoundError}
   *
   * @example
   *     await client.organizations.getProjectMemberships("projectId")
   */
  getProjectMemberships(projectId, requestOptions) {
    return HttpResponsePromise.fromPromise(
      this.__getProjectMemberships(projectId, requestOptions)
    );
  }
  async __getProjectMemberships(projectId, requestOptions) {
    var _a2, _b, _c, _d, _e, _f, _g, _h;
    let _headers = mergeHeaders(
      (_a2 = this._options) == null ? void 0 : _a2.headers,
      mergeOnlyDefinedHeaders({
        Authorization: await this._getAuthorizationHeader(),
        "X-Langfuse-Sdk-Name": (_c = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkName) != null ? _c : (_b = this._options) == null ? void 0 : _b.xLangfuseSdkName,
        "X-Langfuse-Sdk-Version": (_e = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkVersion) != null ? _e : (_d = this._options) == null ? void 0 : _d.xLangfuseSdkVersion,
        "X-Langfuse-Public-Key": (_g = requestOptions == null ? void 0 : requestOptions.xLangfusePublicKey) != null ? _g : (_f = this._options) == null ? void 0 : _f.xLangfusePublicKey
      }),
      requestOptions == null ? void 0 : requestOptions.headers
    );
    const _response = await fetcher({
      url: url_exports.join(
        (_h = await Supplier.get(this._options.baseUrl)) != null ? _h : await Supplier.get(this._options.environment),
        `/api/public/projects/${encodeURIComponent(projectId)}/memberships`
      ),
      method: "GET",
      headers: _headers,
      queryParameters: requestOptions == null ? void 0 : requestOptions.queryParams,
      timeoutMs: (requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
      maxRetries: requestOptions == null ? void 0 : requestOptions.maxRetries,
      abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal
    });
    if (_response.ok) {
      return {
        data: _response.body,
        rawResponse: _response.rawResponse
      };
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 400:
          throw new Error2(
            _response.error.body,
            _response.rawResponse
          );
        case 401:
          throw new UnauthorizedError(
            _response.error.body,
            _response.rawResponse
          );
        case 403:
          throw new AccessDeniedError(
            _response.error.body,
            _response.rawResponse
          );
        case 405:
          throw new MethodNotAllowedError(
            _response.error.body,
            _response.rawResponse
          );
        case 404:
          throw new NotFoundError(
            _response.error.body,
            _response.rawResponse
          );
        default:
          throw new LangfuseAPIError({
            statusCode: _response.error.statusCode,
            body: _response.error.body,
            rawResponse: _response.rawResponse
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new LangfuseAPIError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody,
          rawResponse: _response.rawResponse
        });
      case "timeout":
        throw new LangfuseAPITimeoutError(
          "Timeout exceeded when calling GET /api/public/projects/{projectId}/memberships."
        );
      case "unknown":
        throw new LangfuseAPIError({
          message: _response.error.errorMessage,
          rawResponse: _response.rawResponse
        });
    }
  }
  /**
   * Create or update a membership for a specific project (requires organization-scoped API key). The user must already be a member of the organization.
   *
   * @param {string} projectId
   * @param {LangfuseAPI.MembershipRequest} request
   * @param {Organizations.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link LangfuseAPI.Error}
   * @throws {@link LangfuseAPI.UnauthorizedError}
   * @throws {@link LangfuseAPI.AccessDeniedError}
   * @throws {@link LangfuseAPI.MethodNotAllowedError}
   * @throws {@link LangfuseAPI.NotFoundError}
   *
   * @example
   *     await client.organizations.updateProjectMembership("projectId", {
   *         userId: "userId",
   *         role: "OWNER"
   *     })
   */
  updateProjectMembership(projectId, request, requestOptions) {
    return HttpResponsePromise.fromPromise(
      this.__updateProjectMembership(projectId, request, requestOptions)
    );
  }
  async __updateProjectMembership(projectId, request, requestOptions) {
    var _a2, _b, _c, _d, _e, _f, _g, _h;
    let _headers = mergeHeaders(
      (_a2 = this._options) == null ? void 0 : _a2.headers,
      mergeOnlyDefinedHeaders({
        Authorization: await this._getAuthorizationHeader(),
        "X-Langfuse-Sdk-Name": (_c = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkName) != null ? _c : (_b = this._options) == null ? void 0 : _b.xLangfuseSdkName,
        "X-Langfuse-Sdk-Version": (_e = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkVersion) != null ? _e : (_d = this._options) == null ? void 0 : _d.xLangfuseSdkVersion,
        "X-Langfuse-Public-Key": (_g = requestOptions == null ? void 0 : requestOptions.xLangfusePublicKey) != null ? _g : (_f = this._options) == null ? void 0 : _f.xLangfusePublicKey
      }),
      requestOptions == null ? void 0 : requestOptions.headers
    );
    const _response = await fetcher({
      url: url_exports.join(
        (_h = await Supplier.get(this._options.baseUrl)) != null ? _h : await Supplier.get(this._options.environment),
        `/api/public/projects/${encodeURIComponent(projectId)}/memberships`
      ),
      method: "PUT",
      headers: _headers,
      contentType: "application/json",
      queryParameters: requestOptions == null ? void 0 : requestOptions.queryParams,
      requestType: "json",
      body: request,
      timeoutMs: (requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
      maxRetries: requestOptions == null ? void 0 : requestOptions.maxRetries,
      abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal
    });
    if (_response.ok) {
      return {
        data: _response.body,
        rawResponse: _response.rawResponse
      };
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 400:
          throw new Error2(
            _response.error.body,
            _response.rawResponse
          );
        case 401:
          throw new UnauthorizedError(
            _response.error.body,
            _response.rawResponse
          );
        case 403:
          throw new AccessDeniedError(
            _response.error.body,
            _response.rawResponse
          );
        case 405:
          throw new MethodNotAllowedError(
            _response.error.body,
            _response.rawResponse
          );
        case 404:
          throw new NotFoundError(
            _response.error.body,
            _response.rawResponse
          );
        default:
          throw new LangfuseAPIError({
            statusCode: _response.error.statusCode,
            body: _response.error.body,
            rawResponse: _response.rawResponse
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new LangfuseAPIError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody,
          rawResponse: _response.rawResponse
        });
      case "timeout":
        throw new LangfuseAPITimeoutError(
          "Timeout exceeded when calling PUT /api/public/projects/{projectId}/memberships."
        );
      case "unknown":
        throw new LangfuseAPIError({
          message: _response.error.errorMessage,
          rawResponse: _response.rawResponse
        });
    }
  }
  /**
   * Delete a membership from a specific project (requires organization-scoped API key). The user must be a member of the organization.
   *
   * @param {string} projectId
   * @param {LangfuseAPI.DeleteMembershipRequest} request
   * @param {Organizations.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link LangfuseAPI.Error}
   * @throws {@link LangfuseAPI.UnauthorizedError}
   * @throws {@link LangfuseAPI.AccessDeniedError}
   * @throws {@link LangfuseAPI.MethodNotAllowedError}
   * @throws {@link LangfuseAPI.NotFoundError}
   *
   * @example
   *     await client.organizations.deleteProjectMembership("projectId", {
   *         userId: "userId"
   *     })
   */
  deleteProjectMembership(projectId, request, requestOptions) {
    return HttpResponsePromise.fromPromise(
      this.__deleteProjectMembership(projectId, request, requestOptions)
    );
  }
  async __deleteProjectMembership(projectId, request, requestOptions) {
    var _a2, _b, _c, _d, _e, _f, _g, _h;
    let _headers = mergeHeaders(
      (_a2 = this._options) == null ? void 0 : _a2.headers,
      mergeOnlyDefinedHeaders({
        Authorization: await this._getAuthorizationHeader(),
        "X-Langfuse-Sdk-Name": (_c = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkName) != null ? _c : (_b = this._options) == null ? void 0 : _b.xLangfuseSdkName,
        "X-Langfuse-Sdk-Version": (_e = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkVersion) != null ? _e : (_d = this._options) == null ? void 0 : _d.xLangfuseSdkVersion,
        "X-Langfuse-Public-Key": (_g = requestOptions == null ? void 0 : requestOptions.xLangfusePublicKey) != null ? _g : (_f = this._options) == null ? void 0 : _f.xLangfusePublicKey
      }),
      requestOptions == null ? void 0 : requestOptions.headers
    );
    const _response = await fetcher({
      url: url_exports.join(
        (_h = await Supplier.get(this._options.baseUrl)) != null ? _h : await Supplier.get(this._options.environment),
        `/api/public/projects/${encodeURIComponent(projectId)}/memberships`
      ),
      method: "DELETE",
      headers: _headers,
      contentType: "application/json",
      queryParameters: requestOptions == null ? void 0 : requestOptions.queryParams,
      requestType: "json",
      body: request,
      timeoutMs: (requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
      maxRetries: requestOptions == null ? void 0 : requestOptions.maxRetries,
      abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal
    });
    if (_response.ok) {
      return {
        data: _response.body,
        rawResponse: _response.rawResponse
      };
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 400:
          throw new Error2(
            _response.error.body,
            _response.rawResponse
          );
        case 401:
          throw new UnauthorizedError(
            _response.error.body,
            _response.rawResponse
          );
        case 403:
          throw new AccessDeniedError(
            _response.error.body,
            _response.rawResponse
          );
        case 405:
          throw new MethodNotAllowedError(
            _response.error.body,
            _response.rawResponse
          );
        case 404:
          throw new NotFoundError(
            _response.error.body,
            _response.rawResponse
          );
        default:
          throw new LangfuseAPIError({
            statusCode: _response.error.statusCode,
            body: _response.error.body,
            rawResponse: _response.rawResponse
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new LangfuseAPIError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody,
          rawResponse: _response.rawResponse
        });
      case "timeout":
        throw new LangfuseAPITimeoutError(
          "Timeout exceeded when calling DELETE /api/public/projects/{projectId}/memberships."
        );
      case "unknown":
        throw new LangfuseAPIError({
          message: _response.error.errorMessage,
          rawResponse: _response.rawResponse
        });
    }
  }
  /**
   * Get all projects for the organization associated with the API key (requires organization-scoped API key)
   *
   * @param {Organizations.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link LangfuseAPI.Error}
   * @throws {@link LangfuseAPI.UnauthorizedError}
   * @throws {@link LangfuseAPI.AccessDeniedError}
   * @throws {@link LangfuseAPI.MethodNotAllowedError}
   * @throws {@link LangfuseAPI.NotFoundError}
   *
   * @example
   *     await client.organizations.getOrganizationProjects()
   */
  getOrganizationProjects(requestOptions) {
    return HttpResponsePromise.fromPromise(
      this.__getOrganizationProjects(requestOptions)
    );
  }
  async __getOrganizationProjects(requestOptions) {
    var _a2, _b, _c, _d, _e, _f, _g, _h;
    let _headers = mergeHeaders(
      (_a2 = this._options) == null ? void 0 : _a2.headers,
      mergeOnlyDefinedHeaders({
        Authorization: await this._getAuthorizationHeader(),
        "X-Langfuse-Sdk-Name": (_c = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkName) != null ? _c : (_b = this._options) == null ? void 0 : _b.xLangfuseSdkName,
        "X-Langfuse-Sdk-Version": (_e = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkVersion) != null ? _e : (_d = this._options) == null ? void 0 : _d.xLangfuseSdkVersion,
        "X-Langfuse-Public-Key": (_g = requestOptions == null ? void 0 : requestOptions.xLangfusePublicKey) != null ? _g : (_f = this._options) == null ? void 0 : _f.xLangfusePublicKey
      }),
      requestOptions == null ? void 0 : requestOptions.headers
    );
    const _response = await fetcher({
      url: url_exports.join(
        (_h = await Supplier.get(this._options.baseUrl)) != null ? _h : await Supplier.get(this._options.environment),
        "/api/public/organizations/projects"
      ),
      method: "GET",
      headers: _headers,
      queryParameters: requestOptions == null ? void 0 : requestOptions.queryParams,
      timeoutMs: (requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
      maxRetries: requestOptions == null ? void 0 : requestOptions.maxRetries,
      abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal
    });
    if (_response.ok) {
      return {
        data: _response.body,
        rawResponse: _response.rawResponse
      };
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 400:
          throw new Error2(
            _response.error.body,
            _response.rawResponse
          );
        case 401:
          throw new UnauthorizedError(
            _response.error.body,
            _response.rawResponse
          );
        case 403:
          throw new AccessDeniedError(
            _response.error.body,
            _response.rawResponse
          );
        case 405:
          throw new MethodNotAllowedError(
            _response.error.body,
            _response.rawResponse
          );
        case 404:
          throw new NotFoundError(
            _response.error.body,
            _response.rawResponse
          );
        default:
          throw new LangfuseAPIError({
            statusCode: _response.error.statusCode,
            body: _response.error.body,
            rawResponse: _response.rawResponse
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new LangfuseAPIError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody,
          rawResponse: _response.rawResponse
        });
      case "timeout":
        throw new LangfuseAPITimeoutError(
          "Timeout exceeded when calling GET /api/public/organizations/projects."
        );
      case "unknown":
        throw new LangfuseAPIError({
          message: _response.error.errorMessage,
          rawResponse: _response.rawResponse
        });
    }
  }
  /**
   * Get all API keys for the organization associated with the API key (requires organization-scoped API key)
   *
   * @param {Organizations.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link LangfuseAPI.Error}
   * @throws {@link LangfuseAPI.UnauthorizedError}
   * @throws {@link LangfuseAPI.AccessDeniedError}
   * @throws {@link LangfuseAPI.MethodNotAllowedError}
   * @throws {@link LangfuseAPI.NotFoundError}
   *
   * @example
   *     await client.organizations.getOrganizationApiKeys()
   */
  getOrganizationApiKeys(requestOptions) {
    return HttpResponsePromise.fromPromise(
      this.__getOrganizationApiKeys(requestOptions)
    );
  }
  async __getOrganizationApiKeys(requestOptions) {
    var _a2, _b, _c, _d, _e, _f, _g, _h;
    let _headers = mergeHeaders(
      (_a2 = this._options) == null ? void 0 : _a2.headers,
      mergeOnlyDefinedHeaders({
        Authorization: await this._getAuthorizationHeader(),
        "X-Langfuse-Sdk-Name": (_c = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkName) != null ? _c : (_b = this._options) == null ? void 0 : _b.xLangfuseSdkName,
        "X-Langfuse-Sdk-Version": (_e = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkVersion) != null ? _e : (_d = this._options) == null ? void 0 : _d.xLangfuseSdkVersion,
        "X-Langfuse-Public-Key": (_g = requestOptions == null ? void 0 : requestOptions.xLangfusePublicKey) != null ? _g : (_f = this._options) == null ? void 0 : _f.xLangfusePublicKey
      }),
      requestOptions == null ? void 0 : requestOptions.headers
    );
    const _response = await fetcher({
      url: url_exports.join(
        (_h = await Supplier.get(this._options.baseUrl)) != null ? _h : await Supplier.get(this._options.environment),
        "/api/public/organizations/apiKeys"
      ),
      method: "GET",
      headers: _headers,
      queryParameters: requestOptions == null ? void 0 : requestOptions.queryParams,
      timeoutMs: (requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
      maxRetries: requestOptions == null ? void 0 : requestOptions.maxRetries,
      abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal
    });
    if (_response.ok) {
      return {
        data: _response.body,
        rawResponse: _response.rawResponse
      };
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 400:
          throw new Error2(
            _response.error.body,
            _response.rawResponse
          );
        case 401:
          throw new UnauthorizedError(
            _response.error.body,
            _response.rawResponse
          );
        case 403:
          throw new AccessDeniedError(
            _response.error.body,
            _response.rawResponse
          );
        case 405:
          throw new MethodNotAllowedError(
            _response.error.body,
            _response.rawResponse
          );
        case 404:
          throw new NotFoundError(
            _response.error.body,
            _response.rawResponse
          );
        default:
          throw new LangfuseAPIError({
            statusCode: _response.error.statusCode,
            body: _response.error.body,
            rawResponse: _response.rawResponse
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new LangfuseAPIError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody,
          rawResponse: _response.rawResponse
        });
      case "timeout":
        throw new LangfuseAPITimeoutError(
          "Timeout exceeded when calling GET /api/public/organizations/apiKeys."
        );
      case "unknown":
        throw new LangfuseAPIError({
          message: _response.error.errorMessage,
          rawResponse: _response.rawResponse
        });
    }
  }
  async _getAuthorizationHeader() {
    const username = await Supplier.get(this._options.username);
    const password = await Supplier.get(this._options.password);
    if (username != null && password != null) {
      return BasicAuth.toAuthorizationHeader({
        username,
        password
      });
    }
    return void 0;
  }
};

// src/api/api/resources/projects/client/Client.ts
var Projects = class {
  constructor(_options) {
    this._options = _options;
  }
  /**
   * Get Project associated with API key (requires project-scoped API key). You can use GET /api/public/organizations/projects to get all projects with an organization-scoped key.
   *
   * @param {Projects.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link LangfuseAPI.Error}
   * @throws {@link LangfuseAPI.UnauthorizedError}
   * @throws {@link LangfuseAPI.AccessDeniedError}
   * @throws {@link LangfuseAPI.MethodNotAllowedError}
   * @throws {@link LangfuseAPI.NotFoundError}
   *
   * @example
   *     await client.projects.get()
   */
  get(requestOptions) {
    return HttpResponsePromise.fromPromise(this.__get(requestOptions));
  }
  async __get(requestOptions) {
    var _a2, _b, _c, _d, _e, _f, _g, _h;
    let _headers = mergeHeaders(
      (_a2 = this._options) == null ? void 0 : _a2.headers,
      mergeOnlyDefinedHeaders({
        Authorization: await this._getAuthorizationHeader(),
        "X-Langfuse-Sdk-Name": (_c = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkName) != null ? _c : (_b = this._options) == null ? void 0 : _b.xLangfuseSdkName,
        "X-Langfuse-Sdk-Version": (_e = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkVersion) != null ? _e : (_d = this._options) == null ? void 0 : _d.xLangfuseSdkVersion,
        "X-Langfuse-Public-Key": (_g = requestOptions == null ? void 0 : requestOptions.xLangfusePublicKey) != null ? _g : (_f = this._options) == null ? void 0 : _f.xLangfusePublicKey
      }),
      requestOptions == null ? void 0 : requestOptions.headers
    );
    const _response = await fetcher({
      url: url_exports.join(
        (_h = await Supplier.get(this._options.baseUrl)) != null ? _h : await Supplier.get(this._options.environment),
        "/api/public/projects"
      ),
      method: "GET",
      headers: _headers,
      queryParameters: requestOptions == null ? void 0 : requestOptions.queryParams,
      timeoutMs: (requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
      maxRetries: requestOptions == null ? void 0 : requestOptions.maxRetries,
      abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal
    });
    if (_response.ok) {
      return {
        data: _response.body,
        rawResponse: _response.rawResponse
      };
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 400:
          throw new Error2(
            _response.error.body,
            _response.rawResponse
          );
        case 401:
          throw new UnauthorizedError(
            _response.error.body,
            _response.rawResponse
          );
        case 403:
          throw new AccessDeniedError(
            _response.error.body,
            _response.rawResponse
          );
        case 405:
          throw new MethodNotAllowedError(
            _response.error.body,
            _response.rawResponse
          );
        case 404:
          throw new NotFoundError(
            _response.error.body,
            _response.rawResponse
          );
        default:
          throw new LangfuseAPIError({
            statusCode: _response.error.statusCode,
            body: _response.error.body,
            rawResponse: _response.rawResponse
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new LangfuseAPIError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody,
          rawResponse: _response.rawResponse
        });
      case "timeout":
        throw new LangfuseAPITimeoutError(
          "Timeout exceeded when calling GET /api/public/projects."
        );
      case "unknown":
        throw new LangfuseAPIError({
          message: _response.error.errorMessage,
          rawResponse: _response.rawResponse
        });
    }
  }
  /**
   * Create a new project (requires organization-scoped API key)
   *
   * @param {LangfuseAPI.CreateProjectRequest} request
   * @param {Projects.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link LangfuseAPI.Error}
   * @throws {@link LangfuseAPI.UnauthorizedError}
   * @throws {@link LangfuseAPI.AccessDeniedError}
   * @throws {@link LangfuseAPI.MethodNotAllowedError}
   * @throws {@link LangfuseAPI.NotFoundError}
   *
   * @example
   *     await client.projects.create({
   *         name: "name",
   *         metadata: undefined,
   *         retention: 1
   *     })
   */
  create(request, requestOptions) {
    return HttpResponsePromise.fromPromise(
      this.__create(request, requestOptions)
    );
  }
  async __create(request, requestOptions) {
    var _a2, _b, _c, _d, _e, _f, _g, _h;
    let _headers = mergeHeaders(
      (_a2 = this._options) == null ? void 0 : _a2.headers,
      mergeOnlyDefinedHeaders({
        Authorization: await this._getAuthorizationHeader(),
        "X-Langfuse-Sdk-Name": (_c = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkName) != null ? _c : (_b = this._options) == null ? void 0 : _b.xLangfuseSdkName,
        "X-Langfuse-Sdk-Version": (_e = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkVersion) != null ? _e : (_d = this._options) == null ? void 0 : _d.xLangfuseSdkVersion,
        "X-Langfuse-Public-Key": (_g = requestOptions == null ? void 0 : requestOptions.xLangfusePublicKey) != null ? _g : (_f = this._options) == null ? void 0 : _f.xLangfusePublicKey
      }),
      requestOptions == null ? void 0 : requestOptions.headers
    );
    const _response = await fetcher({
      url: url_exports.join(
        (_h = await Supplier.get(this._options.baseUrl)) != null ? _h : await Supplier.get(this._options.environment),
        "/api/public/projects"
      ),
      method: "POST",
      headers: _headers,
      contentType: "application/json",
      queryParameters: requestOptions == null ? void 0 : requestOptions.queryParams,
      requestType: "json",
      body: request,
      timeoutMs: (requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
      maxRetries: requestOptions == null ? void 0 : requestOptions.maxRetries,
      abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal
    });
    if (_response.ok) {
      return {
        data: _response.body,
        rawResponse: _response.rawResponse
      };
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 400:
          throw new Error2(
            _response.error.body,
            _response.rawResponse
          );
        case 401:
          throw new UnauthorizedError(
            _response.error.body,
            _response.rawResponse
          );
        case 403:
          throw new AccessDeniedError(
            _response.error.body,
            _response.rawResponse
          );
        case 405:
          throw new MethodNotAllowedError(
            _response.error.body,
            _response.rawResponse
          );
        case 404:
          throw new NotFoundError(
            _response.error.body,
            _response.rawResponse
          );
        default:
          throw new LangfuseAPIError({
            statusCode: _response.error.statusCode,
            body: _response.error.body,
            rawResponse: _response.rawResponse
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new LangfuseAPIError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody,
          rawResponse: _response.rawResponse
        });
      case "timeout":
        throw new LangfuseAPITimeoutError(
          "Timeout exceeded when calling POST /api/public/projects."
        );
      case "unknown":
        throw new LangfuseAPIError({
          message: _response.error.errorMessage,
          rawResponse: _response.rawResponse
        });
    }
  }
  /**
   * Update a project by ID (requires organization-scoped API key).
   *
   * @param {string} projectId
   * @param {LangfuseAPI.UpdateProjectRequest} request
   * @param {Projects.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link LangfuseAPI.Error}
   * @throws {@link LangfuseAPI.UnauthorizedError}
   * @throws {@link LangfuseAPI.AccessDeniedError}
   * @throws {@link LangfuseAPI.MethodNotAllowedError}
   * @throws {@link LangfuseAPI.NotFoundError}
   *
   * @example
   *     await client.projects.update("projectId", {
   *         name: "name",
   *         metadata: undefined,
   *         retention: undefined
   *     })
   */
  update(projectId, request, requestOptions) {
    return HttpResponsePromise.fromPromise(
      this.__update(projectId, request, requestOptions)
    );
  }
  async __update(projectId, request, requestOptions) {
    var _a2, _b, _c, _d, _e, _f, _g, _h;
    let _headers = mergeHeaders(
      (_a2 = this._options) == null ? void 0 : _a2.headers,
      mergeOnlyDefinedHeaders({
        Authorization: await this._getAuthorizationHeader(),
        "X-Langfuse-Sdk-Name": (_c = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkName) != null ? _c : (_b = this._options) == null ? void 0 : _b.xLangfuseSdkName,
        "X-Langfuse-Sdk-Version": (_e = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkVersion) != null ? _e : (_d = this._options) == null ? void 0 : _d.xLangfuseSdkVersion,
        "X-Langfuse-Public-Key": (_g = requestOptions == null ? void 0 : requestOptions.xLangfusePublicKey) != null ? _g : (_f = this._options) == null ? void 0 : _f.xLangfusePublicKey
      }),
      requestOptions == null ? void 0 : requestOptions.headers
    );
    const _response = await fetcher({
      url: url_exports.join(
        (_h = await Supplier.get(this._options.baseUrl)) != null ? _h : await Supplier.get(this._options.environment),
        `/api/public/projects/${encodeURIComponent(projectId)}`
      ),
      method: "PUT",
      headers: _headers,
      contentType: "application/json",
      queryParameters: requestOptions == null ? void 0 : requestOptions.queryParams,
      requestType: "json",
      body: request,
      timeoutMs: (requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
      maxRetries: requestOptions == null ? void 0 : requestOptions.maxRetries,
      abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal
    });
    if (_response.ok) {
      return {
        data: _response.body,
        rawResponse: _response.rawResponse
      };
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 400:
          throw new Error2(
            _response.error.body,
            _response.rawResponse
          );
        case 401:
          throw new UnauthorizedError(
            _response.error.body,
            _response.rawResponse
          );
        case 403:
          throw new AccessDeniedError(
            _response.error.body,
            _response.rawResponse
          );
        case 405:
          throw new MethodNotAllowedError(
            _response.error.body,
            _response.rawResponse
          );
        case 404:
          throw new NotFoundError(
            _response.error.body,
            _response.rawResponse
          );
        default:
          throw new LangfuseAPIError({
            statusCode: _response.error.statusCode,
            body: _response.error.body,
            rawResponse: _response.rawResponse
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new LangfuseAPIError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody,
          rawResponse: _response.rawResponse
        });
      case "timeout":
        throw new LangfuseAPITimeoutError(
          "Timeout exceeded when calling PUT /api/public/projects/{projectId}."
        );
      case "unknown":
        throw new LangfuseAPIError({
          message: _response.error.errorMessage,
          rawResponse: _response.rawResponse
        });
    }
  }
  /**
   * Delete a project by ID (requires organization-scoped API key). Project deletion is processed asynchronously.
   *
   * @param {string} projectId
   * @param {Projects.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link LangfuseAPI.Error}
   * @throws {@link LangfuseAPI.UnauthorizedError}
   * @throws {@link LangfuseAPI.AccessDeniedError}
   * @throws {@link LangfuseAPI.MethodNotAllowedError}
   * @throws {@link LangfuseAPI.NotFoundError}
   *
   * @example
   *     await client.projects.delete("projectId")
   */
  delete(projectId, requestOptions) {
    return HttpResponsePromise.fromPromise(
      this.__delete(projectId, requestOptions)
    );
  }
  async __delete(projectId, requestOptions) {
    var _a2, _b, _c, _d, _e, _f, _g, _h;
    let _headers = mergeHeaders(
      (_a2 = this._options) == null ? void 0 : _a2.headers,
      mergeOnlyDefinedHeaders({
        Authorization: await this._getAuthorizationHeader(),
        "X-Langfuse-Sdk-Name": (_c = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkName) != null ? _c : (_b = this._options) == null ? void 0 : _b.xLangfuseSdkName,
        "X-Langfuse-Sdk-Version": (_e = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkVersion) != null ? _e : (_d = this._options) == null ? void 0 : _d.xLangfuseSdkVersion,
        "X-Langfuse-Public-Key": (_g = requestOptions == null ? void 0 : requestOptions.xLangfusePublicKey) != null ? _g : (_f = this._options) == null ? void 0 : _f.xLangfusePublicKey
      }),
      requestOptions == null ? void 0 : requestOptions.headers
    );
    const _response = await fetcher({
      url: url_exports.join(
        (_h = await Supplier.get(this._options.baseUrl)) != null ? _h : await Supplier.get(this._options.environment),
        `/api/public/projects/${encodeURIComponent(projectId)}`
      ),
      method: "DELETE",
      headers: _headers,
      queryParameters: requestOptions == null ? void 0 : requestOptions.queryParams,
      timeoutMs: (requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
      maxRetries: requestOptions == null ? void 0 : requestOptions.maxRetries,
      abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal
    });
    if (_response.ok) {
      return {
        data: _response.body,
        rawResponse: _response.rawResponse
      };
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 400:
          throw new Error2(
            _response.error.body,
            _response.rawResponse
          );
        case 401:
          throw new UnauthorizedError(
            _response.error.body,
            _response.rawResponse
          );
        case 403:
          throw new AccessDeniedError(
            _response.error.body,
            _response.rawResponse
          );
        case 405:
          throw new MethodNotAllowedError(
            _response.error.body,
            _response.rawResponse
          );
        case 404:
          throw new NotFoundError(
            _response.error.body,
            _response.rawResponse
          );
        default:
          throw new LangfuseAPIError({
            statusCode: _response.error.statusCode,
            body: _response.error.body,
            rawResponse: _response.rawResponse
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new LangfuseAPIError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody,
          rawResponse: _response.rawResponse
        });
      case "timeout":
        throw new LangfuseAPITimeoutError(
          "Timeout exceeded when calling DELETE /api/public/projects/{projectId}."
        );
      case "unknown":
        throw new LangfuseAPIError({
          message: _response.error.errorMessage,
          rawResponse: _response.rawResponse
        });
    }
  }
  /**
   * Get all API keys for a project (requires organization-scoped API key)
   *
   * @param {string} projectId
   * @param {Projects.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link LangfuseAPI.Error}
   * @throws {@link LangfuseAPI.UnauthorizedError}
   * @throws {@link LangfuseAPI.AccessDeniedError}
   * @throws {@link LangfuseAPI.MethodNotAllowedError}
   * @throws {@link LangfuseAPI.NotFoundError}
   *
   * @example
   *     await client.projects.getApiKeys("projectId")
   */
  getApiKeys(projectId, requestOptions) {
    return HttpResponsePromise.fromPromise(
      this.__getApiKeys(projectId, requestOptions)
    );
  }
  async __getApiKeys(projectId, requestOptions) {
    var _a2, _b, _c, _d, _e, _f, _g, _h;
    let _headers = mergeHeaders(
      (_a2 = this._options) == null ? void 0 : _a2.headers,
      mergeOnlyDefinedHeaders({
        Authorization: await this._getAuthorizationHeader(),
        "X-Langfuse-Sdk-Name": (_c = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkName) != null ? _c : (_b = this._options) == null ? void 0 : _b.xLangfuseSdkName,
        "X-Langfuse-Sdk-Version": (_e = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkVersion) != null ? _e : (_d = this._options) == null ? void 0 : _d.xLangfuseSdkVersion,
        "X-Langfuse-Public-Key": (_g = requestOptions == null ? void 0 : requestOptions.xLangfusePublicKey) != null ? _g : (_f = this._options) == null ? void 0 : _f.xLangfusePublicKey
      }),
      requestOptions == null ? void 0 : requestOptions.headers
    );
    const _response = await fetcher({
      url: url_exports.join(
        (_h = await Supplier.get(this._options.baseUrl)) != null ? _h : await Supplier.get(this._options.environment),
        `/api/public/projects/${encodeURIComponent(projectId)}/apiKeys`
      ),
      method: "GET",
      headers: _headers,
      queryParameters: requestOptions == null ? void 0 : requestOptions.queryParams,
      timeoutMs: (requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
      maxRetries: requestOptions == null ? void 0 : requestOptions.maxRetries,
      abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal
    });
    if (_response.ok) {
      return {
        data: _response.body,
        rawResponse: _response.rawResponse
      };
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 400:
          throw new Error2(
            _response.error.body,
            _response.rawResponse
          );
        case 401:
          throw new UnauthorizedError(
            _response.error.body,
            _response.rawResponse
          );
        case 403:
          throw new AccessDeniedError(
            _response.error.body,
            _response.rawResponse
          );
        case 405:
          throw new MethodNotAllowedError(
            _response.error.body,
            _response.rawResponse
          );
        case 404:
          throw new NotFoundError(
            _response.error.body,
            _response.rawResponse
          );
        default:
          throw new LangfuseAPIError({
            statusCode: _response.error.statusCode,
            body: _response.error.body,
            rawResponse: _response.rawResponse
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new LangfuseAPIError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody,
          rawResponse: _response.rawResponse
        });
      case "timeout":
        throw new LangfuseAPITimeoutError(
          "Timeout exceeded when calling GET /api/public/projects/{projectId}/apiKeys."
        );
      case "unknown":
        throw new LangfuseAPIError({
          message: _response.error.errorMessage,
          rawResponse: _response.rawResponse
        });
    }
  }
  /**
   * Create a new API key for a project (requires organization-scoped API key)
   *
   * @param {string} projectId
   * @param {LangfuseAPI.CreateApiKeyRequest} request
   * @param {Projects.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link LangfuseAPI.Error}
   * @throws {@link LangfuseAPI.UnauthorizedError}
   * @throws {@link LangfuseAPI.AccessDeniedError}
   * @throws {@link LangfuseAPI.MethodNotAllowedError}
   * @throws {@link LangfuseAPI.NotFoundError}
   *
   * @example
   *     await client.projects.createApiKey("projectId", {
   *         note: undefined,
   *         publicKey: undefined,
   *         secretKey: undefined
   *     })
   */
  createApiKey(projectId, request = {}, requestOptions) {
    return HttpResponsePromise.fromPromise(
      this.__createApiKey(projectId, request, requestOptions)
    );
  }
  async __createApiKey(projectId, request = {}, requestOptions) {
    var _a2, _b, _c, _d, _e, _f, _g, _h;
    let _headers = mergeHeaders(
      (_a2 = this._options) == null ? void 0 : _a2.headers,
      mergeOnlyDefinedHeaders({
        Authorization: await this._getAuthorizationHeader(),
        "X-Langfuse-Sdk-Name": (_c = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkName) != null ? _c : (_b = this._options) == null ? void 0 : _b.xLangfuseSdkName,
        "X-Langfuse-Sdk-Version": (_e = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkVersion) != null ? _e : (_d = this._options) == null ? void 0 : _d.xLangfuseSdkVersion,
        "X-Langfuse-Public-Key": (_g = requestOptions == null ? void 0 : requestOptions.xLangfusePublicKey) != null ? _g : (_f = this._options) == null ? void 0 : _f.xLangfusePublicKey
      }),
      requestOptions == null ? void 0 : requestOptions.headers
    );
    const _response = await fetcher({
      url: url_exports.join(
        (_h = await Supplier.get(this._options.baseUrl)) != null ? _h : await Supplier.get(this._options.environment),
        `/api/public/projects/${encodeURIComponent(projectId)}/apiKeys`
      ),
      method: "POST",
      headers: _headers,
      contentType: "application/json",
      queryParameters: requestOptions == null ? void 0 : requestOptions.queryParams,
      requestType: "json",
      body: request,
      timeoutMs: (requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
      maxRetries: requestOptions == null ? void 0 : requestOptions.maxRetries,
      abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal
    });
    if (_response.ok) {
      return {
        data: _response.body,
        rawResponse: _response.rawResponse
      };
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 400:
          throw new Error2(
            _response.error.body,
            _response.rawResponse
          );
        case 401:
          throw new UnauthorizedError(
            _response.error.body,
            _response.rawResponse
          );
        case 403:
          throw new AccessDeniedError(
            _response.error.body,
            _response.rawResponse
          );
        case 405:
          throw new MethodNotAllowedError(
            _response.error.body,
            _response.rawResponse
          );
        case 404:
          throw new NotFoundError(
            _response.error.body,
            _response.rawResponse
          );
        default:
          throw new LangfuseAPIError({
            statusCode: _response.error.statusCode,
            body: _response.error.body,
            rawResponse: _response.rawResponse
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new LangfuseAPIError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody,
          rawResponse: _response.rawResponse
        });
      case "timeout":
        throw new LangfuseAPITimeoutError(
          "Timeout exceeded when calling POST /api/public/projects/{projectId}/apiKeys."
        );
      case "unknown":
        throw new LangfuseAPIError({
          message: _response.error.errorMessage,
          rawResponse: _response.rawResponse
        });
    }
  }
  /**
   * Delete an API key for a project (requires organization-scoped API key)
   *
   * @param {string} projectId
   * @param {string} apiKeyId
   * @param {Projects.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link LangfuseAPI.Error}
   * @throws {@link LangfuseAPI.UnauthorizedError}
   * @throws {@link LangfuseAPI.AccessDeniedError}
   * @throws {@link LangfuseAPI.MethodNotAllowedError}
   * @throws {@link LangfuseAPI.NotFoundError}
   *
   * @example
   *     await client.projects.deleteApiKey("projectId", "apiKeyId")
   */
  deleteApiKey(projectId, apiKeyId, requestOptions) {
    return HttpResponsePromise.fromPromise(
      this.__deleteApiKey(projectId, apiKeyId, requestOptions)
    );
  }
  async __deleteApiKey(projectId, apiKeyId, requestOptions) {
    var _a2, _b, _c, _d, _e, _f, _g, _h;
    let _headers = mergeHeaders(
      (_a2 = this._options) == null ? void 0 : _a2.headers,
      mergeOnlyDefinedHeaders({
        Authorization: await this._getAuthorizationHeader(),
        "X-Langfuse-Sdk-Name": (_c = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkName) != null ? _c : (_b = this._options) == null ? void 0 : _b.xLangfuseSdkName,
        "X-Langfuse-Sdk-Version": (_e = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkVersion) != null ? _e : (_d = this._options) == null ? void 0 : _d.xLangfuseSdkVersion,
        "X-Langfuse-Public-Key": (_g = requestOptions == null ? void 0 : requestOptions.xLangfusePublicKey) != null ? _g : (_f = this._options) == null ? void 0 : _f.xLangfusePublicKey
      }),
      requestOptions == null ? void 0 : requestOptions.headers
    );
    const _response = await fetcher({
      url: url_exports.join(
        (_h = await Supplier.get(this._options.baseUrl)) != null ? _h : await Supplier.get(this._options.environment),
        `/api/public/projects/${encodeURIComponent(projectId)}/apiKeys/${encodeURIComponent(apiKeyId)}`
      ),
      method: "DELETE",
      headers: _headers,
      queryParameters: requestOptions == null ? void 0 : requestOptions.queryParams,
      timeoutMs: (requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
      maxRetries: requestOptions == null ? void 0 : requestOptions.maxRetries,
      abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal
    });
    if (_response.ok) {
      return {
        data: _response.body,
        rawResponse: _response.rawResponse
      };
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 400:
          throw new Error2(
            _response.error.body,
            _response.rawResponse
          );
        case 401:
          throw new UnauthorizedError(
            _response.error.body,
            _response.rawResponse
          );
        case 403:
          throw new AccessDeniedError(
            _response.error.body,
            _response.rawResponse
          );
        case 405:
          throw new MethodNotAllowedError(
            _response.error.body,
            _response.rawResponse
          );
        case 404:
          throw new NotFoundError(
            _response.error.body,
            _response.rawResponse
          );
        default:
          throw new LangfuseAPIError({
            statusCode: _response.error.statusCode,
            body: _response.error.body,
            rawResponse: _response.rawResponse
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new LangfuseAPIError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody,
          rawResponse: _response.rawResponse
        });
      case "timeout":
        throw new LangfuseAPITimeoutError(
          "Timeout exceeded when calling DELETE /api/public/projects/{projectId}/apiKeys/{apiKeyId}."
        );
      case "unknown":
        throw new LangfuseAPIError({
          message: _response.error.errorMessage,
          rawResponse: _response.rawResponse
        });
    }
  }
  async _getAuthorizationHeader() {
    const username = await Supplier.get(this._options.username);
    const password = await Supplier.get(this._options.password);
    if (username != null && password != null) {
      return BasicAuth.toAuthorizationHeader({
        username,
        password
      });
    }
    return void 0;
  }
};

// src/api/api/resources/promptVersion/client/Client.ts
var PromptVersion = class {
  constructor(_options) {
    this._options = _options;
  }
  /**
   * Update labels for a specific prompt version
   *
   * @param {string} name - The name of the prompt. If the prompt is in a folder (e.g., "folder/subfolder/prompt-name"),
   *                        the folder path must be URL encoded.
   * @param {number} version - Version of the prompt to update
   * @param {LangfuseAPI.UpdatePromptRequest} request
   * @param {PromptVersion.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link LangfuseAPI.Error}
   * @throws {@link LangfuseAPI.UnauthorizedError}
   * @throws {@link LangfuseAPI.AccessDeniedError}
   * @throws {@link LangfuseAPI.MethodNotAllowedError}
   * @throws {@link LangfuseAPI.NotFoundError}
   *
   * @example
   *     await client.promptVersion.update("name", 1, {
   *         newLabels: ["newLabels", "newLabels"]
   *     })
   */
  update(name, version, request, requestOptions) {
    return HttpResponsePromise.fromPromise(
      this.__update(name, version, request, requestOptions)
    );
  }
  async __update(name, version, request, requestOptions) {
    var _a2, _b, _c, _d, _e, _f, _g, _h;
    let _headers = mergeHeaders(
      (_a2 = this._options) == null ? void 0 : _a2.headers,
      mergeOnlyDefinedHeaders({
        Authorization: await this._getAuthorizationHeader(),
        "X-Langfuse-Sdk-Name": (_c = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkName) != null ? _c : (_b = this._options) == null ? void 0 : _b.xLangfuseSdkName,
        "X-Langfuse-Sdk-Version": (_e = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkVersion) != null ? _e : (_d = this._options) == null ? void 0 : _d.xLangfuseSdkVersion,
        "X-Langfuse-Public-Key": (_g = requestOptions == null ? void 0 : requestOptions.xLangfusePublicKey) != null ? _g : (_f = this._options) == null ? void 0 : _f.xLangfusePublicKey
      }),
      requestOptions == null ? void 0 : requestOptions.headers
    );
    const _response = await fetcher({
      url: url_exports.join(
        (_h = await Supplier.get(this._options.baseUrl)) != null ? _h : await Supplier.get(this._options.environment),
        `/api/public/v2/prompts/${encodeURIComponent(name)}/versions/${encodeURIComponent(version)}`
      ),
      method: "PATCH",
      headers: _headers,
      contentType: "application/json",
      queryParameters: requestOptions == null ? void 0 : requestOptions.queryParams,
      requestType: "json",
      body: request,
      timeoutMs: (requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
      maxRetries: requestOptions == null ? void 0 : requestOptions.maxRetries,
      abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal
    });
    if (_response.ok) {
      return {
        data: _response.body,
        rawResponse: _response.rawResponse
      };
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 400:
          throw new Error2(
            _response.error.body,
            _response.rawResponse
          );
        case 401:
          throw new UnauthorizedError(
            _response.error.body,
            _response.rawResponse
          );
        case 403:
          throw new AccessDeniedError(
            _response.error.body,
            _response.rawResponse
          );
        case 405:
          throw new MethodNotAllowedError(
            _response.error.body,
            _response.rawResponse
          );
        case 404:
          throw new NotFoundError(
            _response.error.body,
            _response.rawResponse
          );
        default:
          throw new LangfuseAPIError({
            statusCode: _response.error.statusCode,
            body: _response.error.body,
            rawResponse: _response.rawResponse
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new LangfuseAPIError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody,
          rawResponse: _response.rawResponse
        });
      case "timeout":
        throw new LangfuseAPITimeoutError(
          "Timeout exceeded when calling PATCH /api/public/v2/prompts/{name}/versions/{version}."
        );
      case "unknown":
        throw new LangfuseAPIError({
          message: _response.error.errorMessage,
          rawResponse: _response.rawResponse
        });
    }
  }
  async _getAuthorizationHeader() {
    const username = await Supplier.get(this._options.username);
    const password = await Supplier.get(this._options.password);
    if (username != null && password != null) {
      return BasicAuth.toAuthorizationHeader({
        username,
        password
      });
    }
    return void 0;
  }
};

// src/api/api/resources/prompts/client/Client.ts
var Prompts = class {
  constructor(_options) {
    this._options = _options;
  }
  /**
   * Get a prompt
   *
   * @param {string} promptName - The name of the prompt. If the prompt is in a folder (e.g., "folder/subfolder/prompt-name"),
   *                              the folder path must be URL encoded.
   * @param {LangfuseAPI.GetPromptRequest} request
   * @param {Prompts.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link LangfuseAPI.Error}
   * @throws {@link LangfuseAPI.UnauthorizedError}
   * @throws {@link LangfuseAPI.AccessDeniedError}
   * @throws {@link LangfuseAPI.MethodNotAllowedError}
   * @throws {@link LangfuseAPI.NotFoundError}
   *
   * @example
   *     await client.prompts.get("promptName")
   */
  get(promptName, request = {}, requestOptions) {
    return HttpResponsePromise.fromPromise(
      this.__get(promptName, request, requestOptions)
    );
  }
  async __get(promptName, request = {}, requestOptions) {
    var _a2, _b, _c, _d, _e, _f, _g, _h;
    const { version, label } = request;
    const _queryParams = {};
    if (version != null) {
      _queryParams["version"] = version.toString();
    }
    if (label != null) {
      _queryParams["label"] = label;
    }
    let _headers = mergeHeaders(
      (_a2 = this._options) == null ? void 0 : _a2.headers,
      mergeOnlyDefinedHeaders({
        Authorization: await this._getAuthorizationHeader(),
        "X-Langfuse-Sdk-Name": (_c = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkName) != null ? _c : (_b = this._options) == null ? void 0 : _b.xLangfuseSdkName,
        "X-Langfuse-Sdk-Version": (_e = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkVersion) != null ? _e : (_d = this._options) == null ? void 0 : _d.xLangfuseSdkVersion,
        "X-Langfuse-Public-Key": (_g = requestOptions == null ? void 0 : requestOptions.xLangfusePublicKey) != null ? _g : (_f = this._options) == null ? void 0 : _f.xLangfusePublicKey
      }),
      requestOptions == null ? void 0 : requestOptions.headers
    );
    const _response = await fetcher({
      url: url_exports.join(
        (_h = await Supplier.get(this._options.baseUrl)) != null ? _h : await Supplier.get(this._options.environment),
        `/api/public/v2/prompts/${encodeURIComponent(promptName)}`
      ),
      method: "GET",
      headers: _headers,
      queryParameters: { ..._queryParams, ...requestOptions == null ? void 0 : requestOptions.queryParams },
      timeoutMs: (requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
      maxRetries: requestOptions == null ? void 0 : requestOptions.maxRetries,
      abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal
    });
    if (_response.ok) {
      return {
        data: _response.body,
        rawResponse: _response.rawResponse
      };
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 400:
          throw new Error2(
            _response.error.body,
            _response.rawResponse
          );
        case 401:
          throw new UnauthorizedError(
            _response.error.body,
            _response.rawResponse
          );
        case 403:
          throw new AccessDeniedError(
            _response.error.body,
            _response.rawResponse
          );
        case 405:
          throw new MethodNotAllowedError(
            _response.error.body,
            _response.rawResponse
          );
        case 404:
          throw new NotFoundError(
            _response.error.body,
            _response.rawResponse
          );
        default:
          throw new LangfuseAPIError({
            statusCode: _response.error.statusCode,
            body: _response.error.body,
            rawResponse: _response.rawResponse
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new LangfuseAPIError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody,
          rawResponse: _response.rawResponse
        });
      case "timeout":
        throw new LangfuseAPITimeoutError(
          "Timeout exceeded when calling GET /api/public/v2/prompts/{promptName}."
        );
      case "unknown":
        throw new LangfuseAPIError({
          message: _response.error.errorMessage,
          rawResponse: _response.rawResponse
        });
    }
  }
  /**
   * Get a list of prompt names with versions and labels
   *
   * @param {LangfuseAPI.ListPromptsMetaRequest} request
   * @param {Prompts.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link LangfuseAPI.Error}
   * @throws {@link LangfuseAPI.UnauthorizedError}
   * @throws {@link LangfuseAPI.AccessDeniedError}
   * @throws {@link LangfuseAPI.MethodNotAllowedError}
   * @throws {@link LangfuseAPI.NotFoundError}
   *
   * @example
   *     await client.prompts.list()
   */
  list(request = {}, requestOptions) {
    return HttpResponsePromise.fromPromise(
      this.__list(request, requestOptions)
    );
  }
  async __list(request = {}, requestOptions) {
    var _a2, _b, _c, _d, _e, _f, _g, _h;
    const { name, label, tag, page, limit, fromUpdatedAt, toUpdatedAt } = request;
    const _queryParams = {};
    if (name != null) {
      _queryParams["name"] = name;
    }
    if (label != null) {
      _queryParams["label"] = label;
    }
    if (tag != null) {
      _queryParams["tag"] = tag;
    }
    if (page != null) {
      _queryParams["page"] = page.toString();
    }
    if (limit != null) {
      _queryParams["limit"] = limit.toString();
    }
    if (fromUpdatedAt != null) {
      _queryParams["fromUpdatedAt"] = fromUpdatedAt;
    }
    if (toUpdatedAt != null) {
      _queryParams["toUpdatedAt"] = toUpdatedAt;
    }
    let _headers = mergeHeaders(
      (_a2 = this._options) == null ? void 0 : _a2.headers,
      mergeOnlyDefinedHeaders({
        Authorization: await this._getAuthorizationHeader(),
        "X-Langfuse-Sdk-Name": (_c = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkName) != null ? _c : (_b = this._options) == null ? void 0 : _b.xLangfuseSdkName,
        "X-Langfuse-Sdk-Version": (_e = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkVersion) != null ? _e : (_d = this._options) == null ? void 0 : _d.xLangfuseSdkVersion,
        "X-Langfuse-Public-Key": (_g = requestOptions == null ? void 0 : requestOptions.xLangfusePublicKey) != null ? _g : (_f = this._options) == null ? void 0 : _f.xLangfusePublicKey
      }),
      requestOptions == null ? void 0 : requestOptions.headers
    );
    const _response = await fetcher({
      url: url_exports.join(
        (_h = await Supplier.get(this._options.baseUrl)) != null ? _h : await Supplier.get(this._options.environment),
        "/api/public/v2/prompts"
      ),
      method: "GET",
      headers: _headers,
      queryParameters: { ..._queryParams, ...requestOptions == null ? void 0 : requestOptions.queryParams },
      timeoutMs: (requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
      maxRetries: requestOptions == null ? void 0 : requestOptions.maxRetries,
      abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal
    });
    if (_response.ok) {
      return {
        data: _response.body,
        rawResponse: _response.rawResponse
      };
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 400:
          throw new Error2(
            _response.error.body,
            _response.rawResponse
          );
        case 401:
          throw new UnauthorizedError(
            _response.error.body,
            _response.rawResponse
          );
        case 403:
          throw new AccessDeniedError(
            _response.error.body,
            _response.rawResponse
          );
        case 405:
          throw new MethodNotAllowedError(
            _response.error.body,
            _response.rawResponse
          );
        case 404:
          throw new NotFoundError(
            _response.error.body,
            _response.rawResponse
          );
        default:
          throw new LangfuseAPIError({
            statusCode: _response.error.statusCode,
            body: _response.error.body,
            rawResponse: _response.rawResponse
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new LangfuseAPIError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody,
          rawResponse: _response.rawResponse
        });
      case "timeout":
        throw new LangfuseAPITimeoutError(
          "Timeout exceeded when calling GET /api/public/v2/prompts."
        );
      case "unknown":
        throw new LangfuseAPIError({
          message: _response.error.errorMessage,
          rawResponse: _response.rawResponse
        });
    }
  }
  /**
   * Create a new version for the prompt with the given `name`
   *
   * @param {LangfuseAPI.CreatePromptRequest} request
   * @param {Prompts.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link LangfuseAPI.Error}
   * @throws {@link LangfuseAPI.UnauthorizedError}
   * @throws {@link LangfuseAPI.AccessDeniedError}
   * @throws {@link LangfuseAPI.MethodNotAllowedError}
   * @throws {@link LangfuseAPI.NotFoundError}
   *
   * @example
   *     await client.prompts.create({
   *         type: "chat",
   *         name: "name",
   *         prompt: [{
   *                 type: "chatmessage",
   *                 role: "role",
   *                 content: "content"
   *             }, {
   *                 type: "chatmessage",
   *                 role: "role",
   *                 content: "content"
   *             }],
   *         config: undefined,
   *         labels: undefined,
   *         tags: undefined,
   *         commitMessage: undefined
   *     })
   */
  create(request, requestOptions) {
    return HttpResponsePromise.fromPromise(
      this.__create(request, requestOptions)
    );
  }
  async __create(request, requestOptions) {
    var _a2, _b, _c, _d, _e, _f, _g, _h;
    let _headers = mergeHeaders(
      (_a2 = this._options) == null ? void 0 : _a2.headers,
      mergeOnlyDefinedHeaders({
        Authorization: await this._getAuthorizationHeader(),
        "X-Langfuse-Sdk-Name": (_c = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkName) != null ? _c : (_b = this._options) == null ? void 0 : _b.xLangfuseSdkName,
        "X-Langfuse-Sdk-Version": (_e = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkVersion) != null ? _e : (_d = this._options) == null ? void 0 : _d.xLangfuseSdkVersion,
        "X-Langfuse-Public-Key": (_g = requestOptions == null ? void 0 : requestOptions.xLangfusePublicKey) != null ? _g : (_f = this._options) == null ? void 0 : _f.xLangfusePublicKey
      }),
      requestOptions == null ? void 0 : requestOptions.headers
    );
    const _response = await fetcher({
      url: url_exports.join(
        (_h = await Supplier.get(this._options.baseUrl)) != null ? _h : await Supplier.get(this._options.environment),
        "/api/public/v2/prompts"
      ),
      method: "POST",
      headers: _headers,
      contentType: "application/json",
      queryParameters: requestOptions == null ? void 0 : requestOptions.queryParams,
      requestType: "json",
      body: request,
      timeoutMs: (requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
      maxRetries: requestOptions == null ? void 0 : requestOptions.maxRetries,
      abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal
    });
    if (_response.ok) {
      return {
        data: _response.body,
        rawResponse: _response.rawResponse
      };
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 400:
          throw new Error2(
            _response.error.body,
            _response.rawResponse
          );
        case 401:
          throw new UnauthorizedError(
            _response.error.body,
            _response.rawResponse
          );
        case 403:
          throw new AccessDeniedError(
            _response.error.body,
            _response.rawResponse
          );
        case 405:
          throw new MethodNotAllowedError(
            _response.error.body,
            _response.rawResponse
          );
        case 404:
          throw new NotFoundError(
            _response.error.body,
            _response.rawResponse
          );
        default:
          throw new LangfuseAPIError({
            statusCode: _response.error.statusCode,
            body: _response.error.body,
            rawResponse: _response.rawResponse
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new LangfuseAPIError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody,
          rawResponse: _response.rawResponse
        });
      case "timeout":
        throw new LangfuseAPITimeoutError(
          "Timeout exceeded when calling POST /api/public/v2/prompts."
        );
      case "unknown":
        throw new LangfuseAPIError({
          message: _response.error.errorMessage,
          rawResponse: _response.rawResponse
        });
    }
  }
  /**
   * Delete prompt versions. If neither version nor label is specified, all versions of the prompt are deleted.
   *
   * @param {string} promptName - The name of the prompt
   * @param {LangfuseAPI.DeletePromptRequest} request
   * @param {Prompts.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link LangfuseAPI.Error}
   * @throws {@link LangfuseAPI.UnauthorizedError}
   * @throws {@link LangfuseAPI.AccessDeniedError}
   * @throws {@link LangfuseAPI.MethodNotAllowedError}
   * @throws {@link LangfuseAPI.NotFoundError}
   *
   * @example
   *     await client.prompts.delete("promptName")
   */
  delete(promptName, request = {}, requestOptions) {
    return HttpResponsePromise.fromPromise(
      this.__delete(promptName, request, requestOptions)
    );
  }
  async __delete(promptName, request = {}, requestOptions) {
    var _a2, _b, _c, _d, _e, _f, _g, _h;
    const { label, version } = request;
    const _queryParams = {};
    if (label != null) {
      _queryParams["label"] = label;
    }
    if (version != null) {
      _queryParams["version"] = version.toString();
    }
    let _headers = mergeHeaders(
      (_a2 = this._options) == null ? void 0 : _a2.headers,
      mergeOnlyDefinedHeaders({
        Authorization: await this._getAuthorizationHeader(),
        "X-Langfuse-Sdk-Name": (_c = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkName) != null ? _c : (_b = this._options) == null ? void 0 : _b.xLangfuseSdkName,
        "X-Langfuse-Sdk-Version": (_e = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkVersion) != null ? _e : (_d = this._options) == null ? void 0 : _d.xLangfuseSdkVersion,
        "X-Langfuse-Public-Key": (_g = requestOptions == null ? void 0 : requestOptions.xLangfusePublicKey) != null ? _g : (_f = this._options) == null ? void 0 : _f.xLangfusePublicKey
      }),
      requestOptions == null ? void 0 : requestOptions.headers
    );
    const _response = await fetcher({
      url: url_exports.join(
        (_h = await Supplier.get(this._options.baseUrl)) != null ? _h : await Supplier.get(this._options.environment),
        `/api/public/v2/prompts/${encodeURIComponent(promptName)}`
      ),
      method: "DELETE",
      headers: _headers,
      queryParameters: { ..._queryParams, ...requestOptions == null ? void 0 : requestOptions.queryParams },
      timeoutMs: (requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
      maxRetries: requestOptions == null ? void 0 : requestOptions.maxRetries,
      abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal
    });
    if (_response.ok) {
      return { data: void 0, rawResponse: _response.rawResponse };
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 400:
          throw new Error2(
            _response.error.body,
            _response.rawResponse
          );
        case 401:
          throw new UnauthorizedError(
            _response.error.body,
            _response.rawResponse
          );
        case 403:
          throw new AccessDeniedError(
            _response.error.body,
            _response.rawResponse
          );
        case 405:
          throw new MethodNotAllowedError(
            _response.error.body,
            _response.rawResponse
          );
        case 404:
          throw new NotFoundError(
            _response.error.body,
            _response.rawResponse
          );
        default:
          throw new LangfuseAPIError({
            statusCode: _response.error.statusCode,
            body: _response.error.body,
            rawResponse: _response.rawResponse
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new LangfuseAPIError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody,
          rawResponse: _response.rawResponse
        });
      case "timeout":
        throw new LangfuseAPITimeoutError(
          "Timeout exceeded when calling DELETE /api/public/v2/prompts/{promptName}."
        );
      case "unknown":
        throw new LangfuseAPIError({
          message: _response.error.errorMessage,
          rawResponse: _response.rawResponse
        });
    }
  }
  async _getAuthorizationHeader() {
    const username = await Supplier.get(this._options.username);
    const password = await Supplier.get(this._options.password);
    if (username != null && password != null) {
      return BasicAuth.toAuthorizationHeader({
        username,
        password
      });
    }
    return void 0;
  }
};

// src/api/api/resources/scim/client/Client.ts
var Scim = class {
  constructor(_options) {
    this._options = _options;
  }
  /**
   * Get SCIM Service Provider Configuration (requires organization-scoped API key)
   *
   * @param {Scim.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link LangfuseAPI.Error}
   * @throws {@link LangfuseAPI.UnauthorizedError}
   * @throws {@link LangfuseAPI.AccessDeniedError}
   * @throws {@link LangfuseAPI.MethodNotAllowedError}
   * @throws {@link LangfuseAPI.NotFoundError}
   *
   * @example
   *     await client.scim.getServiceProviderConfig()
   */
  getServiceProviderConfig(requestOptions) {
    return HttpResponsePromise.fromPromise(
      this.__getServiceProviderConfig(requestOptions)
    );
  }
  async __getServiceProviderConfig(requestOptions) {
    var _a2, _b, _c, _d, _e, _f, _g, _h;
    let _headers = mergeHeaders(
      (_a2 = this._options) == null ? void 0 : _a2.headers,
      mergeOnlyDefinedHeaders({
        Authorization: await this._getAuthorizationHeader(),
        "X-Langfuse-Sdk-Name": (_c = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkName) != null ? _c : (_b = this._options) == null ? void 0 : _b.xLangfuseSdkName,
        "X-Langfuse-Sdk-Version": (_e = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkVersion) != null ? _e : (_d = this._options) == null ? void 0 : _d.xLangfuseSdkVersion,
        "X-Langfuse-Public-Key": (_g = requestOptions == null ? void 0 : requestOptions.xLangfusePublicKey) != null ? _g : (_f = this._options) == null ? void 0 : _f.xLangfusePublicKey
      }),
      requestOptions == null ? void 0 : requestOptions.headers
    );
    const _response = await fetcher({
      url: url_exports.join(
        (_h = await Supplier.get(this._options.baseUrl)) != null ? _h : await Supplier.get(this._options.environment),
        "/api/public/scim/ServiceProviderConfig"
      ),
      method: "GET",
      headers: _headers,
      queryParameters: requestOptions == null ? void 0 : requestOptions.queryParams,
      timeoutMs: (requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
      maxRetries: requestOptions == null ? void 0 : requestOptions.maxRetries,
      abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal
    });
    if (_response.ok) {
      return {
        data: _response.body,
        rawResponse: _response.rawResponse
      };
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 400:
          throw new Error2(
            _response.error.body,
            _response.rawResponse
          );
        case 401:
          throw new UnauthorizedError(
            _response.error.body,
            _response.rawResponse
          );
        case 403:
          throw new AccessDeniedError(
            _response.error.body,
            _response.rawResponse
          );
        case 405:
          throw new MethodNotAllowedError(
            _response.error.body,
            _response.rawResponse
          );
        case 404:
          throw new NotFoundError(
            _response.error.body,
            _response.rawResponse
          );
        default:
          throw new LangfuseAPIError({
            statusCode: _response.error.statusCode,
            body: _response.error.body,
            rawResponse: _response.rawResponse
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new LangfuseAPIError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody,
          rawResponse: _response.rawResponse
        });
      case "timeout":
        throw new LangfuseAPITimeoutError(
          "Timeout exceeded when calling GET /api/public/scim/ServiceProviderConfig."
        );
      case "unknown":
        throw new LangfuseAPIError({
          message: _response.error.errorMessage,
          rawResponse: _response.rawResponse
        });
    }
  }
  /**
   * Get SCIM Resource Types (requires organization-scoped API key)
   *
   * @param {Scim.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link LangfuseAPI.Error}
   * @throws {@link LangfuseAPI.UnauthorizedError}
   * @throws {@link LangfuseAPI.AccessDeniedError}
   * @throws {@link LangfuseAPI.MethodNotAllowedError}
   * @throws {@link LangfuseAPI.NotFoundError}
   *
   * @example
   *     await client.scim.getResourceTypes()
   */
  getResourceTypes(requestOptions) {
    return HttpResponsePromise.fromPromise(
      this.__getResourceTypes(requestOptions)
    );
  }
  async __getResourceTypes(requestOptions) {
    var _a2, _b, _c, _d, _e, _f, _g, _h;
    let _headers = mergeHeaders(
      (_a2 = this._options) == null ? void 0 : _a2.headers,
      mergeOnlyDefinedHeaders({
        Authorization: await this._getAuthorizationHeader(),
        "X-Langfuse-Sdk-Name": (_c = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkName) != null ? _c : (_b = this._options) == null ? void 0 : _b.xLangfuseSdkName,
        "X-Langfuse-Sdk-Version": (_e = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkVersion) != null ? _e : (_d = this._options) == null ? void 0 : _d.xLangfuseSdkVersion,
        "X-Langfuse-Public-Key": (_g = requestOptions == null ? void 0 : requestOptions.xLangfusePublicKey) != null ? _g : (_f = this._options) == null ? void 0 : _f.xLangfusePublicKey
      }),
      requestOptions == null ? void 0 : requestOptions.headers
    );
    const _response = await fetcher({
      url: url_exports.join(
        (_h = await Supplier.get(this._options.baseUrl)) != null ? _h : await Supplier.get(this._options.environment),
        "/api/public/scim/ResourceTypes"
      ),
      method: "GET",
      headers: _headers,
      queryParameters: requestOptions == null ? void 0 : requestOptions.queryParams,
      timeoutMs: (requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
      maxRetries: requestOptions == null ? void 0 : requestOptions.maxRetries,
      abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal
    });
    if (_response.ok) {
      return {
        data: _response.body,
        rawResponse: _response.rawResponse
      };
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 400:
          throw new Error2(
            _response.error.body,
            _response.rawResponse
          );
        case 401:
          throw new UnauthorizedError(
            _response.error.body,
            _response.rawResponse
          );
        case 403:
          throw new AccessDeniedError(
            _response.error.body,
            _response.rawResponse
          );
        case 405:
          throw new MethodNotAllowedError(
            _response.error.body,
            _response.rawResponse
          );
        case 404:
          throw new NotFoundError(
            _response.error.body,
            _response.rawResponse
          );
        default:
          throw new LangfuseAPIError({
            statusCode: _response.error.statusCode,
            body: _response.error.body,
            rawResponse: _response.rawResponse
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new LangfuseAPIError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody,
          rawResponse: _response.rawResponse
        });
      case "timeout":
        throw new LangfuseAPITimeoutError(
          "Timeout exceeded when calling GET /api/public/scim/ResourceTypes."
        );
      case "unknown":
        throw new LangfuseAPIError({
          message: _response.error.errorMessage,
          rawResponse: _response.rawResponse
        });
    }
  }
  /**
   * Get SCIM Schemas (requires organization-scoped API key)
   *
   * @param {Scim.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link LangfuseAPI.Error}
   * @throws {@link LangfuseAPI.UnauthorizedError}
   * @throws {@link LangfuseAPI.AccessDeniedError}
   * @throws {@link LangfuseAPI.MethodNotAllowedError}
   * @throws {@link LangfuseAPI.NotFoundError}
   *
   * @example
   *     await client.scim.getSchemas()
   */
  getSchemas(requestOptions) {
    return HttpResponsePromise.fromPromise(
      this.__getSchemas(requestOptions)
    );
  }
  async __getSchemas(requestOptions) {
    var _a2, _b, _c, _d, _e, _f, _g, _h;
    let _headers = mergeHeaders(
      (_a2 = this._options) == null ? void 0 : _a2.headers,
      mergeOnlyDefinedHeaders({
        Authorization: await this._getAuthorizationHeader(),
        "X-Langfuse-Sdk-Name": (_c = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkName) != null ? _c : (_b = this._options) == null ? void 0 : _b.xLangfuseSdkName,
        "X-Langfuse-Sdk-Version": (_e = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkVersion) != null ? _e : (_d = this._options) == null ? void 0 : _d.xLangfuseSdkVersion,
        "X-Langfuse-Public-Key": (_g = requestOptions == null ? void 0 : requestOptions.xLangfusePublicKey) != null ? _g : (_f = this._options) == null ? void 0 : _f.xLangfusePublicKey
      }),
      requestOptions == null ? void 0 : requestOptions.headers
    );
    const _response = await fetcher({
      url: url_exports.join(
        (_h = await Supplier.get(this._options.baseUrl)) != null ? _h : await Supplier.get(this._options.environment),
        "/api/public/scim/Schemas"
      ),
      method: "GET",
      headers: _headers,
      queryParameters: requestOptions == null ? void 0 : requestOptions.queryParams,
      timeoutMs: (requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
      maxRetries: requestOptions == null ? void 0 : requestOptions.maxRetries,
      abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal
    });
    if (_response.ok) {
      return {
        data: _response.body,
        rawResponse: _response.rawResponse
      };
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 400:
          throw new Error2(
            _response.error.body,
            _response.rawResponse
          );
        case 401:
          throw new UnauthorizedError(
            _response.error.body,
            _response.rawResponse
          );
        case 403:
          throw new AccessDeniedError(
            _response.error.body,
            _response.rawResponse
          );
        case 405:
          throw new MethodNotAllowedError(
            _response.error.body,
            _response.rawResponse
          );
        case 404:
          throw new NotFoundError(
            _response.error.body,
            _response.rawResponse
          );
        default:
          throw new LangfuseAPIError({
            statusCode: _response.error.statusCode,
            body: _response.error.body,
            rawResponse: _response.rawResponse
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new LangfuseAPIError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody,
          rawResponse: _response.rawResponse
        });
      case "timeout":
        throw new LangfuseAPITimeoutError(
          "Timeout exceeded when calling GET /api/public/scim/Schemas."
        );
      case "unknown":
        throw new LangfuseAPIError({
          message: _response.error.errorMessage,
          rawResponse: _response.rawResponse
        });
    }
  }
  /**
   * List users in the organization (requires organization-scoped API key)
   *
   * @param {LangfuseAPI.ListUsersRequest} request
   * @param {Scim.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link LangfuseAPI.Error}
   * @throws {@link LangfuseAPI.UnauthorizedError}
   * @throws {@link LangfuseAPI.AccessDeniedError}
   * @throws {@link LangfuseAPI.MethodNotAllowedError}
   * @throws {@link LangfuseAPI.NotFoundError}
   *
   * @example
   *     await client.scim.listUsers()
   */
  listUsers(request = {}, requestOptions) {
    return HttpResponsePromise.fromPromise(
      this.__listUsers(request, requestOptions)
    );
  }
  async __listUsers(request = {}, requestOptions) {
    var _a2, _b, _c, _d, _e, _f, _g, _h;
    const { filter, startIndex, count } = request;
    const _queryParams = {};
    if (filter != null) {
      _queryParams["filter"] = filter;
    }
    if (startIndex != null) {
      _queryParams["startIndex"] = startIndex.toString();
    }
    if (count != null) {
      _queryParams["count"] = count.toString();
    }
    let _headers = mergeHeaders(
      (_a2 = this._options) == null ? void 0 : _a2.headers,
      mergeOnlyDefinedHeaders({
        Authorization: await this._getAuthorizationHeader(),
        "X-Langfuse-Sdk-Name": (_c = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkName) != null ? _c : (_b = this._options) == null ? void 0 : _b.xLangfuseSdkName,
        "X-Langfuse-Sdk-Version": (_e = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkVersion) != null ? _e : (_d = this._options) == null ? void 0 : _d.xLangfuseSdkVersion,
        "X-Langfuse-Public-Key": (_g = requestOptions == null ? void 0 : requestOptions.xLangfusePublicKey) != null ? _g : (_f = this._options) == null ? void 0 : _f.xLangfusePublicKey
      }),
      requestOptions == null ? void 0 : requestOptions.headers
    );
    const _response = await fetcher({
      url: url_exports.join(
        (_h = await Supplier.get(this._options.baseUrl)) != null ? _h : await Supplier.get(this._options.environment),
        "/api/public/scim/Users"
      ),
      method: "GET",
      headers: _headers,
      queryParameters: { ..._queryParams, ...requestOptions == null ? void 0 : requestOptions.queryParams },
      timeoutMs: (requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
      maxRetries: requestOptions == null ? void 0 : requestOptions.maxRetries,
      abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal
    });
    if (_response.ok) {
      return {
        data: _response.body,
        rawResponse: _response.rawResponse
      };
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 400:
          throw new Error2(
            _response.error.body,
            _response.rawResponse
          );
        case 401:
          throw new UnauthorizedError(
            _response.error.body,
            _response.rawResponse
          );
        case 403:
          throw new AccessDeniedError(
            _response.error.body,
            _response.rawResponse
          );
        case 405:
          throw new MethodNotAllowedError(
            _response.error.body,
            _response.rawResponse
          );
        case 404:
          throw new NotFoundError(
            _response.error.body,
            _response.rawResponse
          );
        default:
          throw new LangfuseAPIError({
            statusCode: _response.error.statusCode,
            body: _response.error.body,
            rawResponse: _response.rawResponse
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new LangfuseAPIError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody,
          rawResponse: _response.rawResponse
        });
      case "timeout":
        throw new LangfuseAPITimeoutError(
          "Timeout exceeded when calling GET /api/public/scim/Users."
        );
      case "unknown":
        throw new LangfuseAPIError({
          message: _response.error.errorMessage,
          rawResponse: _response.rawResponse
        });
    }
  }
  /**
   * Create a new user in the organization (requires organization-scoped API key)
   *
   * @param {LangfuseAPI.CreateUserRequest} request
   * @param {Scim.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link LangfuseAPI.Error}
   * @throws {@link LangfuseAPI.UnauthorizedError}
   * @throws {@link LangfuseAPI.AccessDeniedError}
   * @throws {@link LangfuseAPI.MethodNotAllowedError}
   * @throws {@link LangfuseAPI.NotFoundError}
   *
   * @example
   *     await client.scim.createUser({
   *         userName: "userName",
   *         name: {
   *             formatted: undefined
   *         },
   *         emails: undefined,
   *         active: undefined,
   *         password: undefined
   *     })
   */
  createUser(request, requestOptions) {
    return HttpResponsePromise.fromPromise(
      this.__createUser(request, requestOptions)
    );
  }
  async __createUser(request, requestOptions) {
    var _a2, _b, _c, _d, _e, _f, _g, _h;
    let _headers = mergeHeaders(
      (_a2 = this._options) == null ? void 0 : _a2.headers,
      mergeOnlyDefinedHeaders({
        Authorization: await this._getAuthorizationHeader(),
        "X-Langfuse-Sdk-Name": (_c = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkName) != null ? _c : (_b = this._options) == null ? void 0 : _b.xLangfuseSdkName,
        "X-Langfuse-Sdk-Version": (_e = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkVersion) != null ? _e : (_d = this._options) == null ? void 0 : _d.xLangfuseSdkVersion,
        "X-Langfuse-Public-Key": (_g = requestOptions == null ? void 0 : requestOptions.xLangfusePublicKey) != null ? _g : (_f = this._options) == null ? void 0 : _f.xLangfusePublicKey
      }),
      requestOptions == null ? void 0 : requestOptions.headers
    );
    const _response = await fetcher({
      url: url_exports.join(
        (_h = await Supplier.get(this._options.baseUrl)) != null ? _h : await Supplier.get(this._options.environment),
        "/api/public/scim/Users"
      ),
      method: "POST",
      headers: _headers,
      contentType: "application/json",
      queryParameters: requestOptions == null ? void 0 : requestOptions.queryParams,
      requestType: "json",
      body: request,
      timeoutMs: (requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
      maxRetries: requestOptions == null ? void 0 : requestOptions.maxRetries,
      abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal
    });
    if (_response.ok) {
      return {
        data: _response.body,
        rawResponse: _response.rawResponse
      };
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 400:
          throw new Error2(
            _response.error.body,
            _response.rawResponse
          );
        case 401:
          throw new UnauthorizedError(
            _response.error.body,
            _response.rawResponse
          );
        case 403:
          throw new AccessDeniedError(
            _response.error.body,
            _response.rawResponse
          );
        case 405:
          throw new MethodNotAllowedError(
            _response.error.body,
            _response.rawResponse
          );
        case 404:
          throw new NotFoundError(
            _response.error.body,
            _response.rawResponse
          );
        default:
          throw new LangfuseAPIError({
            statusCode: _response.error.statusCode,
            body: _response.error.body,
            rawResponse: _response.rawResponse
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new LangfuseAPIError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody,
          rawResponse: _response.rawResponse
        });
      case "timeout":
        throw new LangfuseAPITimeoutError(
          "Timeout exceeded when calling POST /api/public/scim/Users."
        );
      case "unknown":
        throw new LangfuseAPIError({
          message: _response.error.errorMessage,
          rawResponse: _response.rawResponse
        });
    }
  }
  /**
   * Get a specific user by ID (requires organization-scoped API key)
   *
   * @param {string} userId
   * @param {Scim.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link LangfuseAPI.Error}
   * @throws {@link LangfuseAPI.UnauthorizedError}
   * @throws {@link LangfuseAPI.AccessDeniedError}
   * @throws {@link LangfuseAPI.MethodNotAllowedError}
   * @throws {@link LangfuseAPI.NotFoundError}
   *
   * @example
   *     await client.scim.getUser("userId")
   */
  getUser(userId, requestOptions) {
    return HttpResponsePromise.fromPromise(
      this.__getUser(userId, requestOptions)
    );
  }
  async __getUser(userId, requestOptions) {
    var _a2, _b, _c, _d, _e, _f, _g, _h;
    let _headers = mergeHeaders(
      (_a2 = this._options) == null ? void 0 : _a2.headers,
      mergeOnlyDefinedHeaders({
        Authorization: await this._getAuthorizationHeader(),
        "X-Langfuse-Sdk-Name": (_c = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkName) != null ? _c : (_b = this._options) == null ? void 0 : _b.xLangfuseSdkName,
        "X-Langfuse-Sdk-Version": (_e = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkVersion) != null ? _e : (_d = this._options) == null ? void 0 : _d.xLangfuseSdkVersion,
        "X-Langfuse-Public-Key": (_g = requestOptions == null ? void 0 : requestOptions.xLangfusePublicKey) != null ? _g : (_f = this._options) == null ? void 0 : _f.xLangfusePublicKey
      }),
      requestOptions == null ? void 0 : requestOptions.headers
    );
    const _response = await fetcher({
      url: url_exports.join(
        (_h = await Supplier.get(this._options.baseUrl)) != null ? _h : await Supplier.get(this._options.environment),
        `/api/public/scim/Users/${encodeURIComponent(userId)}`
      ),
      method: "GET",
      headers: _headers,
      queryParameters: requestOptions == null ? void 0 : requestOptions.queryParams,
      timeoutMs: (requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
      maxRetries: requestOptions == null ? void 0 : requestOptions.maxRetries,
      abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal
    });
    if (_response.ok) {
      return {
        data: _response.body,
        rawResponse: _response.rawResponse
      };
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 400:
          throw new Error2(
            _response.error.body,
            _response.rawResponse
          );
        case 401:
          throw new UnauthorizedError(
            _response.error.body,
            _response.rawResponse
          );
        case 403:
          throw new AccessDeniedError(
            _response.error.body,
            _response.rawResponse
          );
        case 405:
          throw new MethodNotAllowedError(
            _response.error.body,
            _response.rawResponse
          );
        case 404:
          throw new NotFoundError(
            _response.error.body,
            _response.rawResponse
          );
        default:
          throw new LangfuseAPIError({
            statusCode: _response.error.statusCode,
            body: _response.error.body,
            rawResponse: _response.rawResponse
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new LangfuseAPIError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody,
          rawResponse: _response.rawResponse
        });
      case "timeout":
        throw new LangfuseAPITimeoutError(
          "Timeout exceeded when calling GET /api/public/scim/Users/{userId}."
        );
      case "unknown":
        throw new LangfuseAPIError({
          message: _response.error.errorMessage,
          rawResponse: _response.rawResponse
        });
    }
  }
  /**
   * Remove a user from the organization (requires organization-scoped API key). Note that this only removes the user from the organization but does not delete the user entity itself.
   *
   * @param {string} userId
   * @param {Scim.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link LangfuseAPI.Error}
   * @throws {@link LangfuseAPI.UnauthorizedError}
   * @throws {@link LangfuseAPI.AccessDeniedError}
   * @throws {@link LangfuseAPI.MethodNotAllowedError}
   * @throws {@link LangfuseAPI.NotFoundError}
   *
   * @example
   *     await client.scim.deleteUser("userId")
   */
  deleteUser(userId, requestOptions) {
    return HttpResponsePromise.fromPromise(
      this.__deleteUser(userId, requestOptions)
    );
  }
  async __deleteUser(userId, requestOptions) {
    var _a2, _b, _c, _d, _e, _f, _g, _h;
    let _headers = mergeHeaders(
      (_a2 = this._options) == null ? void 0 : _a2.headers,
      mergeOnlyDefinedHeaders({
        Authorization: await this._getAuthorizationHeader(),
        "X-Langfuse-Sdk-Name": (_c = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkName) != null ? _c : (_b = this._options) == null ? void 0 : _b.xLangfuseSdkName,
        "X-Langfuse-Sdk-Version": (_e = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkVersion) != null ? _e : (_d = this._options) == null ? void 0 : _d.xLangfuseSdkVersion,
        "X-Langfuse-Public-Key": (_g = requestOptions == null ? void 0 : requestOptions.xLangfusePublicKey) != null ? _g : (_f = this._options) == null ? void 0 : _f.xLangfusePublicKey
      }),
      requestOptions == null ? void 0 : requestOptions.headers
    );
    const _response = await fetcher({
      url: url_exports.join(
        (_h = await Supplier.get(this._options.baseUrl)) != null ? _h : await Supplier.get(this._options.environment),
        `/api/public/scim/Users/${encodeURIComponent(userId)}`
      ),
      method: "DELETE",
      headers: _headers,
      queryParameters: requestOptions == null ? void 0 : requestOptions.queryParams,
      timeoutMs: (requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
      maxRetries: requestOptions == null ? void 0 : requestOptions.maxRetries,
      abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal
    });
    if (_response.ok) {
      return {
        data: _response.body,
        rawResponse: _response.rawResponse
      };
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 400:
          throw new Error2(
            _response.error.body,
            _response.rawResponse
          );
        case 401:
          throw new UnauthorizedError(
            _response.error.body,
            _response.rawResponse
          );
        case 403:
          throw new AccessDeniedError(
            _response.error.body,
            _response.rawResponse
          );
        case 405:
          throw new MethodNotAllowedError(
            _response.error.body,
            _response.rawResponse
          );
        case 404:
          throw new NotFoundError(
            _response.error.body,
            _response.rawResponse
          );
        default:
          throw new LangfuseAPIError({
            statusCode: _response.error.statusCode,
            body: _response.error.body,
            rawResponse: _response.rawResponse
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new LangfuseAPIError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody,
          rawResponse: _response.rawResponse
        });
      case "timeout":
        throw new LangfuseAPITimeoutError(
          "Timeout exceeded when calling DELETE /api/public/scim/Users/{userId}."
        );
      case "unknown":
        throw new LangfuseAPIError({
          message: _response.error.errorMessage,
          rawResponse: _response.rawResponse
        });
    }
  }
  async _getAuthorizationHeader() {
    const username = await Supplier.get(this._options.username);
    const password = await Supplier.get(this._options.password);
    if (username != null && password != null) {
      return BasicAuth.toAuthorizationHeader({
        username,
        password
      });
    }
    return void 0;
  }
};

// src/api/api/resources/scoreConfigs/client/Client.ts
var ScoreConfigs = class {
  constructor(_options) {
    this._options = _options;
  }
  /**
   * Create a score configuration (config). Score configs are used to define the structure of scores
   *
   * @param {LangfuseAPI.CreateScoreConfigRequest} request
   * @param {ScoreConfigs.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link LangfuseAPI.Error}
   * @throws {@link LangfuseAPI.UnauthorizedError}
   * @throws {@link LangfuseAPI.AccessDeniedError}
   * @throws {@link LangfuseAPI.MethodNotAllowedError}
   * @throws {@link LangfuseAPI.NotFoundError}
   *
   * @example
   *     await client.scoreConfigs.create({
   *         name: "name",
   *         dataType: "NUMERIC",
   *         categories: undefined,
   *         minValue: undefined,
   *         maxValue: undefined,
   *         description: undefined
   *     })
   */
  create(request, requestOptions) {
    return HttpResponsePromise.fromPromise(
      this.__create(request, requestOptions)
    );
  }
  async __create(request, requestOptions) {
    var _a2, _b, _c, _d, _e, _f, _g, _h;
    let _headers = mergeHeaders(
      (_a2 = this._options) == null ? void 0 : _a2.headers,
      mergeOnlyDefinedHeaders({
        Authorization: await this._getAuthorizationHeader(),
        "X-Langfuse-Sdk-Name": (_c = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkName) != null ? _c : (_b = this._options) == null ? void 0 : _b.xLangfuseSdkName,
        "X-Langfuse-Sdk-Version": (_e = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkVersion) != null ? _e : (_d = this._options) == null ? void 0 : _d.xLangfuseSdkVersion,
        "X-Langfuse-Public-Key": (_g = requestOptions == null ? void 0 : requestOptions.xLangfusePublicKey) != null ? _g : (_f = this._options) == null ? void 0 : _f.xLangfusePublicKey
      }),
      requestOptions == null ? void 0 : requestOptions.headers
    );
    const _response = await fetcher({
      url: url_exports.join(
        (_h = await Supplier.get(this._options.baseUrl)) != null ? _h : await Supplier.get(this._options.environment),
        "/api/public/score-configs"
      ),
      method: "POST",
      headers: _headers,
      contentType: "application/json",
      queryParameters: requestOptions == null ? void 0 : requestOptions.queryParams,
      requestType: "json",
      body: request,
      timeoutMs: (requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
      maxRetries: requestOptions == null ? void 0 : requestOptions.maxRetries,
      abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal
    });
    if (_response.ok) {
      return {
        data: _response.body,
        rawResponse: _response.rawResponse
      };
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 400:
          throw new Error2(
            _response.error.body,
            _response.rawResponse
          );
        case 401:
          throw new UnauthorizedError(
            _response.error.body,
            _response.rawResponse
          );
        case 403:
          throw new AccessDeniedError(
            _response.error.body,
            _response.rawResponse
          );
        case 405:
          throw new MethodNotAllowedError(
            _response.error.body,
            _response.rawResponse
          );
        case 404:
          throw new NotFoundError(
            _response.error.body,
            _response.rawResponse
          );
        default:
          throw new LangfuseAPIError({
            statusCode: _response.error.statusCode,
            body: _response.error.body,
            rawResponse: _response.rawResponse
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new LangfuseAPIError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody,
          rawResponse: _response.rawResponse
        });
      case "timeout":
        throw new LangfuseAPITimeoutError(
          "Timeout exceeded when calling POST /api/public/score-configs."
        );
      case "unknown":
        throw new LangfuseAPIError({
          message: _response.error.errorMessage,
          rawResponse: _response.rawResponse
        });
    }
  }
  /**
   * Get all score configs
   *
   * @param {LangfuseAPI.GetScoreConfigsRequest} request
   * @param {ScoreConfigs.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link LangfuseAPI.Error}
   * @throws {@link LangfuseAPI.UnauthorizedError}
   * @throws {@link LangfuseAPI.AccessDeniedError}
   * @throws {@link LangfuseAPI.MethodNotAllowedError}
   * @throws {@link LangfuseAPI.NotFoundError}
   *
   * @example
   *     await client.scoreConfigs.get()
   */
  get(request = {}, requestOptions) {
    return HttpResponsePromise.fromPromise(
      this.__get(request, requestOptions)
    );
  }
  async __get(request = {}, requestOptions) {
    var _a2, _b, _c, _d, _e, _f, _g, _h;
    const { page, limit } = request;
    const _queryParams = {};
    if (page != null) {
      _queryParams["page"] = page.toString();
    }
    if (limit != null) {
      _queryParams["limit"] = limit.toString();
    }
    let _headers = mergeHeaders(
      (_a2 = this._options) == null ? void 0 : _a2.headers,
      mergeOnlyDefinedHeaders({
        Authorization: await this._getAuthorizationHeader(),
        "X-Langfuse-Sdk-Name": (_c = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkName) != null ? _c : (_b = this._options) == null ? void 0 : _b.xLangfuseSdkName,
        "X-Langfuse-Sdk-Version": (_e = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkVersion) != null ? _e : (_d = this._options) == null ? void 0 : _d.xLangfuseSdkVersion,
        "X-Langfuse-Public-Key": (_g = requestOptions == null ? void 0 : requestOptions.xLangfusePublicKey) != null ? _g : (_f = this._options) == null ? void 0 : _f.xLangfusePublicKey
      }),
      requestOptions == null ? void 0 : requestOptions.headers
    );
    const _response = await fetcher({
      url: url_exports.join(
        (_h = await Supplier.get(this._options.baseUrl)) != null ? _h : await Supplier.get(this._options.environment),
        "/api/public/score-configs"
      ),
      method: "GET",
      headers: _headers,
      queryParameters: { ..._queryParams, ...requestOptions == null ? void 0 : requestOptions.queryParams },
      timeoutMs: (requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
      maxRetries: requestOptions == null ? void 0 : requestOptions.maxRetries,
      abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal
    });
    if (_response.ok) {
      return {
        data: _response.body,
        rawResponse: _response.rawResponse
      };
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 400:
          throw new Error2(
            _response.error.body,
            _response.rawResponse
          );
        case 401:
          throw new UnauthorizedError(
            _response.error.body,
            _response.rawResponse
          );
        case 403:
          throw new AccessDeniedError(
            _response.error.body,
            _response.rawResponse
          );
        case 405:
          throw new MethodNotAllowedError(
            _response.error.body,
            _response.rawResponse
          );
        case 404:
          throw new NotFoundError(
            _response.error.body,
            _response.rawResponse
          );
        default:
          throw new LangfuseAPIError({
            statusCode: _response.error.statusCode,
            body: _response.error.body,
            rawResponse: _response.rawResponse
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new LangfuseAPIError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody,
          rawResponse: _response.rawResponse
        });
      case "timeout":
        throw new LangfuseAPITimeoutError(
          "Timeout exceeded when calling GET /api/public/score-configs."
        );
      case "unknown":
        throw new LangfuseAPIError({
          message: _response.error.errorMessage,
          rawResponse: _response.rawResponse
        });
    }
  }
  /**
   * Get a score config
   *
   * @param {string} configId - The unique langfuse identifier of a score config
   * @param {ScoreConfigs.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link LangfuseAPI.Error}
   * @throws {@link LangfuseAPI.UnauthorizedError}
   * @throws {@link LangfuseAPI.AccessDeniedError}
   * @throws {@link LangfuseAPI.MethodNotAllowedError}
   * @throws {@link LangfuseAPI.NotFoundError}
   *
   * @example
   *     await client.scoreConfigs.getById("configId")
   */
  getById(configId, requestOptions) {
    return HttpResponsePromise.fromPromise(
      this.__getById(configId, requestOptions)
    );
  }
  async __getById(configId, requestOptions) {
    var _a2, _b, _c, _d, _e, _f, _g, _h;
    let _headers = mergeHeaders(
      (_a2 = this._options) == null ? void 0 : _a2.headers,
      mergeOnlyDefinedHeaders({
        Authorization: await this._getAuthorizationHeader(),
        "X-Langfuse-Sdk-Name": (_c = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkName) != null ? _c : (_b = this._options) == null ? void 0 : _b.xLangfuseSdkName,
        "X-Langfuse-Sdk-Version": (_e = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkVersion) != null ? _e : (_d = this._options) == null ? void 0 : _d.xLangfuseSdkVersion,
        "X-Langfuse-Public-Key": (_g = requestOptions == null ? void 0 : requestOptions.xLangfusePublicKey) != null ? _g : (_f = this._options) == null ? void 0 : _f.xLangfusePublicKey
      }),
      requestOptions == null ? void 0 : requestOptions.headers
    );
    const _response = await fetcher({
      url: url_exports.join(
        (_h = await Supplier.get(this._options.baseUrl)) != null ? _h : await Supplier.get(this._options.environment),
        `/api/public/score-configs/${encodeURIComponent(configId)}`
      ),
      method: "GET",
      headers: _headers,
      queryParameters: requestOptions == null ? void 0 : requestOptions.queryParams,
      timeoutMs: (requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
      maxRetries: requestOptions == null ? void 0 : requestOptions.maxRetries,
      abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal
    });
    if (_response.ok) {
      return {
        data: _response.body,
        rawResponse: _response.rawResponse
      };
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 400:
          throw new Error2(
            _response.error.body,
            _response.rawResponse
          );
        case 401:
          throw new UnauthorizedError(
            _response.error.body,
            _response.rawResponse
          );
        case 403:
          throw new AccessDeniedError(
            _response.error.body,
            _response.rawResponse
          );
        case 405:
          throw new MethodNotAllowedError(
            _response.error.body,
            _response.rawResponse
          );
        case 404:
          throw new NotFoundError(
            _response.error.body,
            _response.rawResponse
          );
        default:
          throw new LangfuseAPIError({
            statusCode: _response.error.statusCode,
            body: _response.error.body,
            rawResponse: _response.rawResponse
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new LangfuseAPIError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody,
          rawResponse: _response.rawResponse
        });
      case "timeout":
        throw new LangfuseAPITimeoutError(
          "Timeout exceeded when calling GET /api/public/score-configs/{configId}."
        );
      case "unknown":
        throw new LangfuseAPIError({
          message: _response.error.errorMessage,
          rawResponse: _response.rawResponse
        });
    }
  }
  /**
   * Update a score config
   *
   * @param {string} configId - The unique langfuse identifier of a score config
   * @param {LangfuseAPI.UpdateScoreConfigRequest} request
   * @param {ScoreConfigs.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link LangfuseAPI.Error}
   * @throws {@link LangfuseAPI.UnauthorizedError}
   * @throws {@link LangfuseAPI.AccessDeniedError}
   * @throws {@link LangfuseAPI.MethodNotAllowedError}
   * @throws {@link LangfuseAPI.NotFoundError}
   *
   * @example
   *     await client.scoreConfigs.update("configId", {
   *         isArchived: undefined,
   *         name: undefined,
   *         categories: undefined,
   *         minValue: undefined,
   *         maxValue: undefined,
   *         description: undefined
   *     })
   */
  update(configId, request, requestOptions) {
    return HttpResponsePromise.fromPromise(
      this.__update(configId, request, requestOptions)
    );
  }
  async __update(configId, request, requestOptions) {
    var _a2, _b, _c, _d, _e, _f, _g, _h;
    let _headers = mergeHeaders(
      (_a2 = this._options) == null ? void 0 : _a2.headers,
      mergeOnlyDefinedHeaders({
        Authorization: await this._getAuthorizationHeader(),
        "X-Langfuse-Sdk-Name": (_c = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkName) != null ? _c : (_b = this._options) == null ? void 0 : _b.xLangfuseSdkName,
        "X-Langfuse-Sdk-Version": (_e = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkVersion) != null ? _e : (_d = this._options) == null ? void 0 : _d.xLangfuseSdkVersion,
        "X-Langfuse-Public-Key": (_g = requestOptions == null ? void 0 : requestOptions.xLangfusePublicKey) != null ? _g : (_f = this._options) == null ? void 0 : _f.xLangfusePublicKey
      }),
      requestOptions == null ? void 0 : requestOptions.headers
    );
    const _response = await fetcher({
      url: url_exports.join(
        (_h = await Supplier.get(this._options.baseUrl)) != null ? _h : await Supplier.get(this._options.environment),
        `/api/public/score-configs/${encodeURIComponent(configId)}`
      ),
      method: "PATCH",
      headers: _headers,
      contentType: "application/json",
      queryParameters: requestOptions == null ? void 0 : requestOptions.queryParams,
      requestType: "json",
      body: request,
      timeoutMs: (requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
      maxRetries: requestOptions == null ? void 0 : requestOptions.maxRetries,
      abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal
    });
    if (_response.ok) {
      return {
        data: _response.body,
        rawResponse: _response.rawResponse
      };
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 400:
          throw new Error2(
            _response.error.body,
            _response.rawResponse
          );
        case 401:
          throw new UnauthorizedError(
            _response.error.body,
            _response.rawResponse
          );
        case 403:
          throw new AccessDeniedError(
            _response.error.body,
            _response.rawResponse
          );
        case 405:
          throw new MethodNotAllowedError(
            _response.error.body,
            _response.rawResponse
          );
        case 404:
          throw new NotFoundError(
            _response.error.body,
            _response.rawResponse
          );
        default:
          throw new LangfuseAPIError({
            statusCode: _response.error.statusCode,
            body: _response.error.body,
            rawResponse: _response.rawResponse
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new LangfuseAPIError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody,
          rawResponse: _response.rawResponse
        });
      case "timeout":
        throw new LangfuseAPITimeoutError(
          "Timeout exceeded when calling PATCH /api/public/score-configs/{configId}."
        );
      case "unknown":
        throw new LangfuseAPIError({
          message: _response.error.errorMessage,
          rawResponse: _response.rawResponse
        });
    }
  }
  async _getAuthorizationHeader() {
    const username = await Supplier.get(this._options.username);
    const password = await Supplier.get(this._options.password);
    if (username != null && password != null) {
      return BasicAuth.toAuthorizationHeader({
        username,
        password
      });
    }
    return void 0;
  }
};

// src/api/api/resources/scoreV2/client/Client.ts
var ScoreV2 = class {
  constructor(_options) {
    this._options = _options;
  }
  /**
   * Get a list of scores (supports both trace and session scores)
   *
   * @param {LangfuseAPI.GetScoresRequest} request
   * @param {ScoreV2.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link LangfuseAPI.Error}
   * @throws {@link LangfuseAPI.UnauthorizedError}
   * @throws {@link LangfuseAPI.AccessDeniedError}
   * @throws {@link LangfuseAPI.MethodNotAllowedError}
   * @throws {@link LangfuseAPI.NotFoundError}
   *
   * @example
   *     await client.scoreV2.get()
   */
  get(request = {}, requestOptions) {
    return HttpResponsePromise.fromPromise(
      this.__get(request, requestOptions)
    );
  }
  async __get(request = {}, requestOptions) {
    var _a2, _b, _c, _d, _e, _f, _g, _h;
    const {
      page,
      limit,
      userId,
      name,
      fromTimestamp,
      toTimestamp,
      environment,
      source,
      operator,
      value,
      scoreIds,
      configId,
      sessionId,
      datasetRunId,
      traceId,
      observationId,
      queueId,
      dataType,
      traceTags,
      fields
    } = request;
    const _queryParams = {};
    if (page != null) {
      _queryParams["page"] = page.toString();
    }
    if (limit != null) {
      _queryParams["limit"] = limit.toString();
    }
    if (userId != null) {
      _queryParams["userId"] = userId;
    }
    if (name != null) {
      _queryParams["name"] = name;
    }
    if (fromTimestamp != null) {
      _queryParams["fromTimestamp"] = fromTimestamp;
    }
    if (toTimestamp != null) {
      _queryParams["toTimestamp"] = toTimestamp;
    }
    if (environment != null) {
      if (Array.isArray(environment)) {
        _queryParams["environment"] = environment.map((item) => item);
      } else {
        _queryParams["environment"] = environment;
      }
    }
    if (source != null) {
      _queryParams["source"] = source;
    }
    if (operator != null) {
      _queryParams["operator"] = operator;
    }
    if (value != null) {
      _queryParams["value"] = value.toString();
    }
    if (scoreIds != null) {
      _queryParams["scoreIds"] = scoreIds;
    }
    if (configId != null) {
      _queryParams["configId"] = configId;
    }
    if (sessionId != null) {
      _queryParams["sessionId"] = sessionId;
    }
    if (datasetRunId != null) {
      _queryParams["datasetRunId"] = datasetRunId;
    }
    if (traceId != null) {
      _queryParams["traceId"] = traceId;
    }
    if (observationId != null) {
      _queryParams["observationId"] = observationId;
    }
    if (queueId != null) {
      _queryParams["queueId"] = queueId;
    }
    if (dataType != null) {
      _queryParams["dataType"] = dataType;
    }
    if (traceTags != null) {
      if (Array.isArray(traceTags)) {
        _queryParams["traceTags"] = traceTags.map((item) => item);
      } else {
        _queryParams["traceTags"] = traceTags;
      }
    }
    if (fields != null) {
      _queryParams["fields"] = fields;
    }
    let _headers = mergeHeaders(
      (_a2 = this._options) == null ? void 0 : _a2.headers,
      mergeOnlyDefinedHeaders({
        Authorization: await this._getAuthorizationHeader(),
        "X-Langfuse-Sdk-Name": (_c = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkName) != null ? _c : (_b = this._options) == null ? void 0 : _b.xLangfuseSdkName,
        "X-Langfuse-Sdk-Version": (_e = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkVersion) != null ? _e : (_d = this._options) == null ? void 0 : _d.xLangfuseSdkVersion,
        "X-Langfuse-Public-Key": (_g = requestOptions == null ? void 0 : requestOptions.xLangfusePublicKey) != null ? _g : (_f = this._options) == null ? void 0 : _f.xLangfusePublicKey
      }),
      requestOptions == null ? void 0 : requestOptions.headers
    );
    const _response = await fetcher({
      url: url_exports.join(
        (_h = await Supplier.get(this._options.baseUrl)) != null ? _h : await Supplier.get(this._options.environment),
        "/api/public/v2/scores"
      ),
      method: "GET",
      headers: _headers,
      queryParameters: { ..._queryParams, ...requestOptions == null ? void 0 : requestOptions.queryParams },
      timeoutMs: (requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
      maxRetries: requestOptions == null ? void 0 : requestOptions.maxRetries,
      abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal
    });
    if (_response.ok) {
      return {
        data: _response.body,
        rawResponse: _response.rawResponse
      };
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 400:
          throw new Error2(
            _response.error.body,
            _response.rawResponse
          );
        case 401:
          throw new UnauthorizedError(
            _response.error.body,
            _response.rawResponse
          );
        case 403:
          throw new AccessDeniedError(
            _response.error.body,
            _response.rawResponse
          );
        case 405:
          throw new MethodNotAllowedError(
            _response.error.body,
            _response.rawResponse
          );
        case 404:
          throw new NotFoundError(
            _response.error.body,
            _response.rawResponse
          );
        default:
          throw new LangfuseAPIError({
            statusCode: _response.error.statusCode,
            body: _response.error.body,
            rawResponse: _response.rawResponse
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new LangfuseAPIError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody,
          rawResponse: _response.rawResponse
        });
      case "timeout":
        throw new LangfuseAPITimeoutError(
          "Timeout exceeded when calling GET /api/public/v2/scores."
        );
      case "unknown":
        throw new LangfuseAPIError({
          message: _response.error.errorMessage,
          rawResponse: _response.rawResponse
        });
    }
  }
  /**
   * Get a score (supports both trace and session scores)
   *
   * @param {string} scoreId - The unique langfuse identifier of a score
   * @param {ScoreV2.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link LangfuseAPI.Error}
   * @throws {@link LangfuseAPI.UnauthorizedError}
   * @throws {@link LangfuseAPI.AccessDeniedError}
   * @throws {@link LangfuseAPI.MethodNotAllowedError}
   * @throws {@link LangfuseAPI.NotFoundError}
   *
   * @example
   *     await client.scoreV2.getById("scoreId")
   */
  getById(scoreId, requestOptions) {
    return HttpResponsePromise.fromPromise(
      this.__getById(scoreId, requestOptions)
    );
  }
  async __getById(scoreId, requestOptions) {
    var _a2, _b, _c, _d, _e, _f, _g, _h;
    let _headers = mergeHeaders(
      (_a2 = this._options) == null ? void 0 : _a2.headers,
      mergeOnlyDefinedHeaders({
        Authorization: await this._getAuthorizationHeader(),
        "X-Langfuse-Sdk-Name": (_c = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkName) != null ? _c : (_b = this._options) == null ? void 0 : _b.xLangfuseSdkName,
        "X-Langfuse-Sdk-Version": (_e = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkVersion) != null ? _e : (_d = this._options) == null ? void 0 : _d.xLangfuseSdkVersion,
        "X-Langfuse-Public-Key": (_g = requestOptions == null ? void 0 : requestOptions.xLangfusePublicKey) != null ? _g : (_f = this._options) == null ? void 0 : _f.xLangfusePublicKey
      }),
      requestOptions == null ? void 0 : requestOptions.headers
    );
    const _response = await fetcher({
      url: url_exports.join(
        (_h = await Supplier.get(this._options.baseUrl)) != null ? _h : await Supplier.get(this._options.environment),
        `/api/public/v2/scores/${encodeURIComponent(scoreId)}`
      ),
      method: "GET",
      headers: _headers,
      queryParameters: requestOptions == null ? void 0 : requestOptions.queryParams,
      timeoutMs: (requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
      maxRetries: requestOptions == null ? void 0 : requestOptions.maxRetries,
      abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal
    });
    if (_response.ok) {
      return {
        data: _response.body,
        rawResponse: _response.rawResponse
      };
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 400:
          throw new Error2(
            _response.error.body,
            _response.rawResponse
          );
        case 401:
          throw new UnauthorizedError(
            _response.error.body,
            _response.rawResponse
          );
        case 403:
          throw new AccessDeniedError(
            _response.error.body,
            _response.rawResponse
          );
        case 405:
          throw new MethodNotAllowedError(
            _response.error.body,
            _response.rawResponse
          );
        case 404:
          throw new NotFoundError(
            _response.error.body,
            _response.rawResponse
          );
        default:
          throw new LangfuseAPIError({
            statusCode: _response.error.statusCode,
            body: _response.error.body,
            rawResponse: _response.rawResponse
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new LangfuseAPIError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody,
          rawResponse: _response.rawResponse
        });
      case "timeout":
        throw new LangfuseAPITimeoutError(
          "Timeout exceeded when calling GET /api/public/v2/scores/{scoreId}."
        );
      case "unknown":
        throw new LangfuseAPIError({
          message: _response.error.errorMessage,
          rawResponse: _response.rawResponse
        });
    }
  }
  async _getAuthorizationHeader() {
    const username = await Supplier.get(this._options.username);
    const password = await Supplier.get(this._options.password);
    if (username != null && password != null) {
      return BasicAuth.toAuthorizationHeader({
        username,
        password
      });
    }
    return void 0;
  }
};

// src/api/api/resources/score/client/Client.ts
var Score = class {
  constructor(_options) {
    this._options = _options;
  }
  /**
   * Create a score (supports both trace and session scores)
   *
   * @param {LangfuseAPI.CreateScoreRequest} request
   * @param {Score.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link LangfuseAPI.Error}
   * @throws {@link LangfuseAPI.UnauthorizedError}
   * @throws {@link LangfuseAPI.AccessDeniedError}
   * @throws {@link LangfuseAPI.MethodNotAllowedError}
   * @throws {@link LangfuseAPI.NotFoundError}
   *
   * @example
   *     await client.score.create({
   *         id: undefined,
   *         traceId: undefined,
   *         sessionId: undefined,
   *         observationId: undefined,
   *         datasetRunId: undefined,
   *         name: "name",
   *         value: 1.1,
   *         comment: undefined,
   *         metadata: undefined,
   *         environment: undefined,
   *         queueId: undefined,
   *         dataType: undefined,
   *         configId: undefined
   *     })
   */
  create(request, requestOptions) {
    return HttpResponsePromise.fromPromise(
      this.__create(request, requestOptions)
    );
  }
  async __create(request, requestOptions) {
    var _a2, _b, _c, _d, _e, _f, _g, _h;
    let _headers = mergeHeaders(
      (_a2 = this._options) == null ? void 0 : _a2.headers,
      mergeOnlyDefinedHeaders({
        Authorization: await this._getAuthorizationHeader(),
        "X-Langfuse-Sdk-Name": (_c = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkName) != null ? _c : (_b = this._options) == null ? void 0 : _b.xLangfuseSdkName,
        "X-Langfuse-Sdk-Version": (_e = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkVersion) != null ? _e : (_d = this._options) == null ? void 0 : _d.xLangfuseSdkVersion,
        "X-Langfuse-Public-Key": (_g = requestOptions == null ? void 0 : requestOptions.xLangfusePublicKey) != null ? _g : (_f = this._options) == null ? void 0 : _f.xLangfusePublicKey
      }),
      requestOptions == null ? void 0 : requestOptions.headers
    );
    const _response = await fetcher({
      url: url_exports.join(
        (_h = await Supplier.get(this._options.baseUrl)) != null ? _h : await Supplier.get(this._options.environment),
        "/api/public/scores"
      ),
      method: "POST",
      headers: _headers,
      contentType: "application/json",
      queryParameters: requestOptions == null ? void 0 : requestOptions.queryParams,
      requestType: "json",
      body: request,
      timeoutMs: (requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
      maxRetries: requestOptions == null ? void 0 : requestOptions.maxRetries,
      abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal
    });
    if (_response.ok) {
      return {
        data: _response.body,
        rawResponse: _response.rawResponse
      };
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 400:
          throw new Error2(
            _response.error.body,
            _response.rawResponse
          );
        case 401:
          throw new UnauthorizedError(
            _response.error.body,
            _response.rawResponse
          );
        case 403:
          throw new AccessDeniedError(
            _response.error.body,
            _response.rawResponse
          );
        case 405:
          throw new MethodNotAllowedError(
            _response.error.body,
            _response.rawResponse
          );
        case 404:
          throw new NotFoundError(
            _response.error.body,
            _response.rawResponse
          );
        default:
          throw new LangfuseAPIError({
            statusCode: _response.error.statusCode,
            body: _response.error.body,
            rawResponse: _response.rawResponse
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new LangfuseAPIError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody,
          rawResponse: _response.rawResponse
        });
      case "timeout":
        throw new LangfuseAPITimeoutError(
          "Timeout exceeded when calling POST /api/public/scores."
        );
      case "unknown":
        throw new LangfuseAPIError({
          message: _response.error.errorMessage,
          rawResponse: _response.rawResponse
        });
    }
  }
  /**
   * Delete a score (supports both trace and session scores)
   *
   * @param {string} scoreId - The unique langfuse identifier of a score
   * @param {Score.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link LangfuseAPI.Error}
   * @throws {@link LangfuseAPI.UnauthorizedError}
   * @throws {@link LangfuseAPI.AccessDeniedError}
   * @throws {@link LangfuseAPI.MethodNotAllowedError}
   * @throws {@link LangfuseAPI.NotFoundError}
   *
   * @example
   *     await client.score.delete("scoreId")
   */
  delete(scoreId, requestOptions) {
    return HttpResponsePromise.fromPromise(
      this.__delete(scoreId, requestOptions)
    );
  }
  async __delete(scoreId, requestOptions) {
    var _a2, _b, _c, _d, _e, _f, _g, _h;
    let _headers = mergeHeaders(
      (_a2 = this._options) == null ? void 0 : _a2.headers,
      mergeOnlyDefinedHeaders({
        Authorization: await this._getAuthorizationHeader(),
        "X-Langfuse-Sdk-Name": (_c = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkName) != null ? _c : (_b = this._options) == null ? void 0 : _b.xLangfuseSdkName,
        "X-Langfuse-Sdk-Version": (_e = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkVersion) != null ? _e : (_d = this._options) == null ? void 0 : _d.xLangfuseSdkVersion,
        "X-Langfuse-Public-Key": (_g = requestOptions == null ? void 0 : requestOptions.xLangfusePublicKey) != null ? _g : (_f = this._options) == null ? void 0 : _f.xLangfusePublicKey
      }),
      requestOptions == null ? void 0 : requestOptions.headers
    );
    const _response = await fetcher({
      url: url_exports.join(
        (_h = await Supplier.get(this._options.baseUrl)) != null ? _h : await Supplier.get(this._options.environment),
        `/api/public/scores/${encodeURIComponent(scoreId)}`
      ),
      method: "DELETE",
      headers: _headers,
      queryParameters: requestOptions == null ? void 0 : requestOptions.queryParams,
      timeoutMs: (requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
      maxRetries: requestOptions == null ? void 0 : requestOptions.maxRetries,
      abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal
    });
    if (_response.ok) {
      return { data: void 0, rawResponse: _response.rawResponse };
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 400:
          throw new Error2(
            _response.error.body,
            _response.rawResponse
          );
        case 401:
          throw new UnauthorizedError(
            _response.error.body,
            _response.rawResponse
          );
        case 403:
          throw new AccessDeniedError(
            _response.error.body,
            _response.rawResponse
          );
        case 405:
          throw new MethodNotAllowedError(
            _response.error.body,
            _response.rawResponse
          );
        case 404:
          throw new NotFoundError(
            _response.error.body,
            _response.rawResponse
          );
        default:
          throw new LangfuseAPIError({
            statusCode: _response.error.statusCode,
            body: _response.error.body,
            rawResponse: _response.rawResponse
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new LangfuseAPIError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody,
          rawResponse: _response.rawResponse
        });
      case "timeout":
        throw new LangfuseAPITimeoutError(
          "Timeout exceeded when calling DELETE /api/public/scores/{scoreId}."
        );
      case "unknown":
        throw new LangfuseAPIError({
          message: _response.error.errorMessage,
          rawResponse: _response.rawResponse
        });
    }
  }
  async _getAuthorizationHeader() {
    const username = await Supplier.get(this._options.username);
    const password = await Supplier.get(this._options.password);
    if (username != null && password != null) {
      return BasicAuth.toAuthorizationHeader({
        username,
        password
      });
    }
    return void 0;
  }
};

// src/api/api/resources/sessions/client/Client.ts
var Sessions = class {
  constructor(_options) {
    this._options = _options;
  }
  /**
   * Get sessions
   *
   * @param {LangfuseAPI.GetSessionsRequest} request
   * @param {Sessions.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link LangfuseAPI.Error}
   * @throws {@link LangfuseAPI.UnauthorizedError}
   * @throws {@link LangfuseAPI.AccessDeniedError}
   * @throws {@link LangfuseAPI.MethodNotAllowedError}
   * @throws {@link LangfuseAPI.NotFoundError}
   *
   * @example
   *     await client.sessions.list()
   */
  list(request = {}, requestOptions) {
    return HttpResponsePromise.fromPromise(
      this.__list(request, requestOptions)
    );
  }
  async __list(request = {}, requestOptions) {
    var _a2, _b, _c, _d, _e, _f, _g, _h;
    const { page, limit, fromTimestamp, toTimestamp, environment } = request;
    const _queryParams = {};
    if (page != null) {
      _queryParams["page"] = page.toString();
    }
    if (limit != null) {
      _queryParams["limit"] = limit.toString();
    }
    if (fromTimestamp != null) {
      _queryParams["fromTimestamp"] = fromTimestamp;
    }
    if (toTimestamp != null) {
      _queryParams["toTimestamp"] = toTimestamp;
    }
    if (environment != null) {
      if (Array.isArray(environment)) {
        _queryParams["environment"] = environment.map((item) => item);
      } else {
        _queryParams["environment"] = environment;
      }
    }
    let _headers = mergeHeaders(
      (_a2 = this._options) == null ? void 0 : _a2.headers,
      mergeOnlyDefinedHeaders({
        Authorization: await this._getAuthorizationHeader(),
        "X-Langfuse-Sdk-Name": (_c = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkName) != null ? _c : (_b = this._options) == null ? void 0 : _b.xLangfuseSdkName,
        "X-Langfuse-Sdk-Version": (_e = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkVersion) != null ? _e : (_d = this._options) == null ? void 0 : _d.xLangfuseSdkVersion,
        "X-Langfuse-Public-Key": (_g = requestOptions == null ? void 0 : requestOptions.xLangfusePublicKey) != null ? _g : (_f = this._options) == null ? void 0 : _f.xLangfusePublicKey
      }),
      requestOptions == null ? void 0 : requestOptions.headers
    );
    const _response = await fetcher({
      url: url_exports.join(
        (_h = await Supplier.get(this._options.baseUrl)) != null ? _h : await Supplier.get(this._options.environment),
        "/api/public/sessions"
      ),
      method: "GET",
      headers: _headers,
      queryParameters: { ..._queryParams, ...requestOptions == null ? void 0 : requestOptions.queryParams },
      timeoutMs: (requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
      maxRetries: requestOptions == null ? void 0 : requestOptions.maxRetries,
      abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal
    });
    if (_response.ok) {
      return {
        data: _response.body,
        rawResponse: _response.rawResponse
      };
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 400:
          throw new Error2(
            _response.error.body,
            _response.rawResponse
          );
        case 401:
          throw new UnauthorizedError(
            _response.error.body,
            _response.rawResponse
          );
        case 403:
          throw new AccessDeniedError(
            _response.error.body,
            _response.rawResponse
          );
        case 405:
          throw new MethodNotAllowedError(
            _response.error.body,
            _response.rawResponse
          );
        case 404:
          throw new NotFoundError(
            _response.error.body,
            _response.rawResponse
          );
        default:
          throw new LangfuseAPIError({
            statusCode: _response.error.statusCode,
            body: _response.error.body,
            rawResponse: _response.rawResponse
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new LangfuseAPIError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody,
          rawResponse: _response.rawResponse
        });
      case "timeout":
        throw new LangfuseAPITimeoutError(
          "Timeout exceeded when calling GET /api/public/sessions."
        );
      case "unknown":
        throw new LangfuseAPIError({
          message: _response.error.errorMessage,
          rawResponse: _response.rawResponse
        });
    }
  }
  /**
   * Get a session. Please note that `traces` on this endpoint are not paginated, if you plan to fetch large sessions, consider `GET /api/public/traces?sessionId=<sessionId>`
   *
   * @param {string} sessionId - The unique id of a session
   * @param {Sessions.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link LangfuseAPI.Error}
   * @throws {@link LangfuseAPI.UnauthorizedError}
   * @throws {@link LangfuseAPI.AccessDeniedError}
   * @throws {@link LangfuseAPI.MethodNotAllowedError}
   * @throws {@link LangfuseAPI.NotFoundError}
   *
   * @example
   *     await client.sessions.get("sessionId")
   */
  get(sessionId, requestOptions) {
    return HttpResponsePromise.fromPromise(
      this.__get(sessionId, requestOptions)
    );
  }
  async __get(sessionId, requestOptions) {
    var _a2, _b, _c, _d, _e, _f, _g, _h;
    let _headers = mergeHeaders(
      (_a2 = this._options) == null ? void 0 : _a2.headers,
      mergeOnlyDefinedHeaders({
        Authorization: await this._getAuthorizationHeader(),
        "X-Langfuse-Sdk-Name": (_c = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkName) != null ? _c : (_b = this._options) == null ? void 0 : _b.xLangfuseSdkName,
        "X-Langfuse-Sdk-Version": (_e = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkVersion) != null ? _e : (_d = this._options) == null ? void 0 : _d.xLangfuseSdkVersion,
        "X-Langfuse-Public-Key": (_g = requestOptions == null ? void 0 : requestOptions.xLangfusePublicKey) != null ? _g : (_f = this._options) == null ? void 0 : _f.xLangfusePublicKey
      }),
      requestOptions == null ? void 0 : requestOptions.headers
    );
    const _response = await fetcher({
      url: url_exports.join(
        (_h = await Supplier.get(this._options.baseUrl)) != null ? _h : await Supplier.get(this._options.environment),
        `/api/public/sessions/${encodeURIComponent(sessionId)}`
      ),
      method: "GET",
      headers: _headers,
      queryParameters: requestOptions == null ? void 0 : requestOptions.queryParams,
      timeoutMs: (requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
      maxRetries: requestOptions == null ? void 0 : requestOptions.maxRetries,
      abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal
    });
    if (_response.ok) {
      return {
        data: _response.body,
        rawResponse: _response.rawResponse
      };
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 400:
          throw new Error2(
            _response.error.body,
            _response.rawResponse
          );
        case 401:
          throw new UnauthorizedError(
            _response.error.body,
            _response.rawResponse
          );
        case 403:
          throw new AccessDeniedError(
            _response.error.body,
            _response.rawResponse
          );
        case 405:
          throw new MethodNotAllowedError(
            _response.error.body,
            _response.rawResponse
          );
        case 404:
          throw new NotFoundError(
            _response.error.body,
            _response.rawResponse
          );
        default:
          throw new LangfuseAPIError({
            statusCode: _response.error.statusCode,
            body: _response.error.body,
            rawResponse: _response.rawResponse
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new LangfuseAPIError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody,
          rawResponse: _response.rawResponse
        });
      case "timeout":
        throw new LangfuseAPITimeoutError(
          "Timeout exceeded when calling GET /api/public/sessions/{sessionId}."
        );
      case "unknown":
        throw new LangfuseAPIError({
          message: _response.error.errorMessage,
          rawResponse: _response.rawResponse
        });
    }
  }
  async _getAuthorizationHeader() {
    const username = await Supplier.get(this._options.username);
    const password = await Supplier.get(this._options.password);
    if (username != null && password != null) {
      return BasicAuth.toAuthorizationHeader({
        username,
        password
      });
    }
    return void 0;
  }
};

// src/api/api/resources/trace/client/Client.ts
var Trace = class {
  constructor(_options) {
    this._options = _options;
  }
  /**
   * Get a specific trace
   *
   * @param {string} traceId - The unique langfuse identifier of a trace
   * @param {Trace.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link LangfuseAPI.Error}
   * @throws {@link LangfuseAPI.UnauthorizedError}
   * @throws {@link LangfuseAPI.AccessDeniedError}
   * @throws {@link LangfuseAPI.MethodNotAllowedError}
   * @throws {@link LangfuseAPI.NotFoundError}
   *
   * @example
   *     await client.trace.get("traceId")
   */
  get(traceId, requestOptions) {
    return HttpResponsePromise.fromPromise(
      this.__get(traceId, requestOptions)
    );
  }
  async __get(traceId, requestOptions) {
    var _a2, _b, _c, _d, _e, _f, _g, _h;
    let _headers = mergeHeaders(
      (_a2 = this._options) == null ? void 0 : _a2.headers,
      mergeOnlyDefinedHeaders({
        Authorization: await this._getAuthorizationHeader(),
        "X-Langfuse-Sdk-Name": (_c = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkName) != null ? _c : (_b = this._options) == null ? void 0 : _b.xLangfuseSdkName,
        "X-Langfuse-Sdk-Version": (_e = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkVersion) != null ? _e : (_d = this._options) == null ? void 0 : _d.xLangfuseSdkVersion,
        "X-Langfuse-Public-Key": (_g = requestOptions == null ? void 0 : requestOptions.xLangfusePublicKey) != null ? _g : (_f = this._options) == null ? void 0 : _f.xLangfusePublicKey
      }),
      requestOptions == null ? void 0 : requestOptions.headers
    );
    const _response = await fetcher({
      url: url_exports.join(
        (_h = await Supplier.get(this._options.baseUrl)) != null ? _h : await Supplier.get(this._options.environment),
        `/api/public/traces/${encodeURIComponent(traceId)}`
      ),
      method: "GET",
      headers: _headers,
      queryParameters: requestOptions == null ? void 0 : requestOptions.queryParams,
      timeoutMs: (requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
      maxRetries: requestOptions == null ? void 0 : requestOptions.maxRetries,
      abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal
    });
    if (_response.ok) {
      return {
        data: _response.body,
        rawResponse: _response.rawResponse
      };
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 400:
          throw new Error2(
            _response.error.body,
            _response.rawResponse
          );
        case 401:
          throw new UnauthorizedError(
            _response.error.body,
            _response.rawResponse
          );
        case 403:
          throw new AccessDeniedError(
            _response.error.body,
            _response.rawResponse
          );
        case 405:
          throw new MethodNotAllowedError(
            _response.error.body,
            _response.rawResponse
          );
        case 404:
          throw new NotFoundError(
            _response.error.body,
            _response.rawResponse
          );
        default:
          throw new LangfuseAPIError({
            statusCode: _response.error.statusCode,
            body: _response.error.body,
            rawResponse: _response.rawResponse
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new LangfuseAPIError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody,
          rawResponse: _response.rawResponse
        });
      case "timeout":
        throw new LangfuseAPITimeoutError(
          "Timeout exceeded when calling GET /api/public/traces/{traceId}."
        );
      case "unknown":
        throw new LangfuseAPIError({
          message: _response.error.errorMessage,
          rawResponse: _response.rawResponse
        });
    }
  }
  /**
   * Delete a specific trace
   *
   * @param {string} traceId - The unique langfuse identifier of the trace to delete
   * @param {Trace.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link LangfuseAPI.Error}
   * @throws {@link LangfuseAPI.UnauthorizedError}
   * @throws {@link LangfuseAPI.AccessDeniedError}
   * @throws {@link LangfuseAPI.MethodNotAllowedError}
   * @throws {@link LangfuseAPI.NotFoundError}
   *
   * @example
   *     await client.trace.delete("traceId")
   */
  delete(traceId, requestOptions) {
    return HttpResponsePromise.fromPromise(
      this.__delete(traceId, requestOptions)
    );
  }
  async __delete(traceId, requestOptions) {
    var _a2, _b, _c, _d, _e, _f, _g, _h;
    let _headers = mergeHeaders(
      (_a2 = this._options) == null ? void 0 : _a2.headers,
      mergeOnlyDefinedHeaders({
        Authorization: await this._getAuthorizationHeader(),
        "X-Langfuse-Sdk-Name": (_c = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkName) != null ? _c : (_b = this._options) == null ? void 0 : _b.xLangfuseSdkName,
        "X-Langfuse-Sdk-Version": (_e = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkVersion) != null ? _e : (_d = this._options) == null ? void 0 : _d.xLangfuseSdkVersion,
        "X-Langfuse-Public-Key": (_g = requestOptions == null ? void 0 : requestOptions.xLangfusePublicKey) != null ? _g : (_f = this._options) == null ? void 0 : _f.xLangfusePublicKey
      }),
      requestOptions == null ? void 0 : requestOptions.headers
    );
    const _response = await fetcher({
      url: url_exports.join(
        (_h = await Supplier.get(this._options.baseUrl)) != null ? _h : await Supplier.get(this._options.environment),
        `/api/public/traces/${encodeURIComponent(traceId)}`
      ),
      method: "DELETE",
      headers: _headers,
      queryParameters: requestOptions == null ? void 0 : requestOptions.queryParams,
      timeoutMs: (requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
      maxRetries: requestOptions == null ? void 0 : requestOptions.maxRetries,
      abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal
    });
    if (_response.ok) {
      return {
        data: _response.body,
        rawResponse: _response.rawResponse
      };
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 400:
          throw new Error2(
            _response.error.body,
            _response.rawResponse
          );
        case 401:
          throw new UnauthorizedError(
            _response.error.body,
            _response.rawResponse
          );
        case 403:
          throw new AccessDeniedError(
            _response.error.body,
            _response.rawResponse
          );
        case 405:
          throw new MethodNotAllowedError(
            _response.error.body,
            _response.rawResponse
          );
        case 404:
          throw new NotFoundError(
            _response.error.body,
            _response.rawResponse
          );
        default:
          throw new LangfuseAPIError({
            statusCode: _response.error.statusCode,
            body: _response.error.body,
            rawResponse: _response.rawResponse
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new LangfuseAPIError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody,
          rawResponse: _response.rawResponse
        });
      case "timeout":
        throw new LangfuseAPITimeoutError(
          "Timeout exceeded when calling DELETE /api/public/traces/{traceId}."
        );
      case "unknown":
        throw new LangfuseAPIError({
          message: _response.error.errorMessage,
          rawResponse: _response.rawResponse
        });
    }
  }
  /**
   * Get list of traces
   *
   * @param {LangfuseAPI.GetTracesRequest} request
   * @param {Trace.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link LangfuseAPI.Error}
   * @throws {@link LangfuseAPI.UnauthorizedError}
   * @throws {@link LangfuseAPI.AccessDeniedError}
   * @throws {@link LangfuseAPI.MethodNotAllowedError}
   * @throws {@link LangfuseAPI.NotFoundError}
   *
   * @example
   *     await client.trace.list()
   */
  list(request = {}, requestOptions) {
    return HttpResponsePromise.fromPromise(
      this.__list(request, requestOptions)
    );
  }
  async __list(request = {}, requestOptions) {
    var _a2, _b, _c, _d, _e, _f, _g, _h;
    const {
      page,
      limit,
      userId,
      name,
      sessionId,
      fromTimestamp,
      toTimestamp,
      orderBy,
      tags,
      version,
      release,
      environment,
      fields,
      filter
    } = request;
    const _queryParams = {};
    if (page != null) {
      _queryParams["page"] = page.toString();
    }
    if (limit != null) {
      _queryParams["limit"] = limit.toString();
    }
    if (userId != null) {
      _queryParams["userId"] = userId;
    }
    if (name != null) {
      _queryParams["name"] = name;
    }
    if (sessionId != null) {
      _queryParams["sessionId"] = sessionId;
    }
    if (fromTimestamp != null) {
      _queryParams["fromTimestamp"] = fromTimestamp;
    }
    if (toTimestamp != null) {
      _queryParams["toTimestamp"] = toTimestamp;
    }
    if (orderBy != null) {
      _queryParams["orderBy"] = orderBy;
    }
    if (tags != null) {
      if (Array.isArray(tags)) {
        _queryParams["tags"] = tags.map((item) => item);
      } else {
        _queryParams["tags"] = tags;
      }
    }
    if (version != null) {
      _queryParams["version"] = version;
    }
    if (release != null) {
      _queryParams["release"] = release;
    }
    if (environment != null) {
      if (Array.isArray(environment)) {
        _queryParams["environment"] = environment.map((item) => item);
      } else {
        _queryParams["environment"] = environment;
      }
    }
    if (fields != null) {
      _queryParams["fields"] = fields;
    }
    if (filter != null) {
      _queryParams["filter"] = filter;
    }
    let _headers = mergeHeaders(
      (_a2 = this._options) == null ? void 0 : _a2.headers,
      mergeOnlyDefinedHeaders({
        Authorization: await this._getAuthorizationHeader(),
        "X-Langfuse-Sdk-Name": (_c = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkName) != null ? _c : (_b = this._options) == null ? void 0 : _b.xLangfuseSdkName,
        "X-Langfuse-Sdk-Version": (_e = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkVersion) != null ? _e : (_d = this._options) == null ? void 0 : _d.xLangfuseSdkVersion,
        "X-Langfuse-Public-Key": (_g = requestOptions == null ? void 0 : requestOptions.xLangfusePublicKey) != null ? _g : (_f = this._options) == null ? void 0 : _f.xLangfusePublicKey
      }),
      requestOptions == null ? void 0 : requestOptions.headers
    );
    const _response = await fetcher({
      url: url_exports.join(
        (_h = await Supplier.get(this._options.baseUrl)) != null ? _h : await Supplier.get(this._options.environment),
        "/api/public/traces"
      ),
      method: "GET",
      headers: _headers,
      queryParameters: { ..._queryParams, ...requestOptions == null ? void 0 : requestOptions.queryParams },
      timeoutMs: (requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
      maxRetries: requestOptions == null ? void 0 : requestOptions.maxRetries,
      abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal
    });
    if (_response.ok) {
      return {
        data: _response.body,
        rawResponse: _response.rawResponse
      };
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 400:
          throw new Error2(
            _response.error.body,
            _response.rawResponse
          );
        case 401:
          throw new UnauthorizedError(
            _response.error.body,
            _response.rawResponse
          );
        case 403:
          throw new AccessDeniedError(
            _response.error.body,
            _response.rawResponse
          );
        case 405:
          throw new MethodNotAllowedError(
            _response.error.body,
            _response.rawResponse
          );
        case 404:
          throw new NotFoundError(
            _response.error.body,
            _response.rawResponse
          );
        default:
          throw new LangfuseAPIError({
            statusCode: _response.error.statusCode,
            body: _response.error.body,
            rawResponse: _response.rawResponse
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new LangfuseAPIError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody,
          rawResponse: _response.rawResponse
        });
      case "timeout":
        throw new LangfuseAPITimeoutError(
          "Timeout exceeded when calling GET /api/public/traces."
        );
      case "unknown":
        throw new LangfuseAPIError({
          message: _response.error.errorMessage,
          rawResponse: _response.rawResponse
        });
    }
  }
  /**
   * Delete multiple traces
   *
   * @param {LangfuseAPI.DeleteTracesRequest} request
   * @param {Trace.RequestOptions} requestOptions - Request-specific configuration.
   *
   * @throws {@link LangfuseAPI.Error}
   * @throws {@link LangfuseAPI.UnauthorizedError}
   * @throws {@link LangfuseAPI.AccessDeniedError}
   * @throws {@link LangfuseAPI.MethodNotAllowedError}
   * @throws {@link LangfuseAPI.NotFoundError}
   *
   * @example
   *     await client.trace.deleteMultiple({
   *         traceIds: ["traceIds", "traceIds"]
   *     })
   */
  deleteMultiple(request, requestOptions) {
    return HttpResponsePromise.fromPromise(
      this.__deleteMultiple(request, requestOptions)
    );
  }
  async __deleteMultiple(request, requestOptions) {
    var _a2, _b, _c, _d, _e, _f, _g, _h;
    let _headers = mergeHeaders(
      (_a2 = this._options) == null ? void 0 : _a2.headers,
      mergeOnlyDefinedHeaders({
        Authorization: await this._getAuthorizationHeader(),
        "X-Langfuse-Sdk-Name": (_c = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkName) != null ? _c : (_b = this._options) == null ? void 0 : _b.xLangfuseSdkName,
        "X-Langfuse-Sdk-Version": (_e = requestOptions == null ? void 0 : requestOptions.xLangfuseSdkVersion) != null ? _e : (_d = this._options) == null ? void 0 : _d.xLangfuseSdkVersion,
        "X-Langfuse-Public-Key": (_g = requestOptions == null ? void 0 : requestOptions.xLangfusePublicKey) != null ? _g : (_f = this._options) == null ? void 0 : _f.xLangfusePublicKey
      }),
      requestOptions == null ? void 0 : requestOptions.headers
    );
    const _response = await fetcher({
      url: url_exports.join(
        (_h = await Supplier.get(this._options.baseUrl)) != null ? _h : await Supplier.get(this._options.environment),
        "/api/public/traces"
      ),
      method: "DELETE",
      headers: _headers,
      contentType: "application/json",
      queryParameters: requestOptions == null ? void 0 : requestOptions.queryParams,
      requestType: "json",
      body: request,
      timeoutMs: (requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1e3 : 6e4,
      maxRetries: requestOptions == null ? void 0 : requestOptions.maxRetries,
      abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal
    });
    if (_response.ok) {
      return {
        data: _response.body,
        rawResponse: _response.rawResponse
      };
    }
    if (_response.error.reason === "status-code") {
      switch (_response.error.statusCode) {
        case 400:
          throw new Error2(
            _response.error.body,
            _response.rawResponse
          );
        case 401:
          throw new UnauthorizedError(
            _response.error.body,
            _response.rawResponse
          );
        case 403:
          throw new AccessDeniedError(
            _response.error.body,
            _response.rawResponse
          );
        case 405:
          throw new MethodNotAllowedError(
            _response.error.body,
            _response.rawResponse
          );
        case 404:
          throw new NotFoundError(
            _response.error.body,
            _response.rawResponse
          );
        default:
          throw new LangfuseAPIError({
            statusCode: _response.error.statusCode,
            body: _response.error.body,
            rawResponse: _response.rawResponse
          });
      }
    }
    switch (_response.error.reason) {
      case "non-json":
        throw new LangfuseAPIError({
          statusCode: _response.error.statusCode,
          body: _response.error.rawBody,
          rawResponse: _response.rawResponse
        });
      case "timeout":
        throw new LangfuseAPITimeoutError(
          "Timeout exceeded when calling DELETE /api/public/traces."
        );
      case "unknown":
        throw new LangfuseAPIError({
          message: _response.error.errorMessage,
          rawResponse: _response.rawResponse
        });
    }
  }
  async _getAuthorizationHeader() {
    const username = await Supplier.get(this._options.username);
    const password = await Supplier.get(this._options.password);
    if (username != null && password != null) {
      return BasicAuth.toAuthorizationHeader({
        username,
        password
      });
    }
    return void 0;
  }
};

// src/api/Client.ts
var LangfuseAPIClient = class {
  constructor(_options) {
    this._options = {
      ..._options,
      headers: mergeHeaders(
        {
          "X-Langfuse-Sdk-Name": _options == null ? void 0 : _options.xLangfuseSdkName,
          "X-Langfuse-Sdk-Version": _options == null ? void 0 : _options.xLangfuseSdkVersion,
          "X-Langfuse-Public-Key": _options == null ? void 0 : _options.xLangfusePublicKey
        },
        _options == null ? void 0 : _options.headers
      )
    };
  }
  get annotationQueues() {
    var _a2;
    return (_a2 = this._annotationQueues) != null ? _a2 : this._annotationQueues = new AnnotationQueues(this._options);
  }
  get blobStorageIntegrations() {
    var _a2;
    return (_a2 = this._blobStorageIntegrations) != null ? _a2 : this._blobStorageIntegrations = new BlobStorageIntegrations(
      this._options
    );
  }
  get comments() {
    var _a2;
    return (_a2 = this._comments) != null ? _a2 : this._comments = new Comments(this._options);
  }
  get datasetItems() {
    var _a2;
    return (_a2 = this._datasetItems) != null ? _a2 : this._datasetItems = new DatasetItems(this._options);
  }
  get datasetRunItems() {
    var _a2;
    return (_a2 = this._datasetRunItems) != null ? _a2 : this._datasetRunItems = new DatasetRunItems(this._options);
  }
  get datasets() {
    var _a2;
    return (_a2 = this._datasets) != null ? _a2 : this._datasets = new Datasets(this._options);
  }
  get health() {
    var _a2;
    return (_a2 = this._health) != null ? _a2 : this._health = new Health(this._options);
  }
  get ingestion() {
    var _a2;
    return (_a2 = this._ingestion) != null ? _a2 : this._ingestion = new Ingestion(this._options);
  }
  get llmConnections() {
    var _a2;
    return (_a2 = this._llmConnections) != null ? _a2 : this._llmConnections = new LlmConnections(this._options);
  }
  get media() {
    var _a2;
    return (_a2 = this._media) != null ? _a2 : this._media = new Media(this._options);
  }
  get metricsV2() {
    var _a2;
    return (_a2 = this._metricsV2) != null ? _a2 : this._metricsV2 = new MetricsV2(this._options);
  }
  get metrics() {
    var _a2;
    return (_a2 = this._metrics) != null ? _a2 : this._metrics = new Metrics(this._options);
  }
  get models() {
    var _a2;
    return (_a2 = this._models) != null ? _a2 : this._models = new Models(this._options);
  }
  get observationsV2() {
    var _a2;
    return (_a2 = this._observationsV2) != null ? _a2 : this._observationsV2 = new ObservationsV2(this._options);
  }
  get observations() {
    var _a2;
    return (_a2 = this._observations) != null ? _a2 : this._observations = new Observations(this._options);
  }
  get opentelemetry() {
    var _a2;
    return (_a2 = this._opentelemetry) != null ? _a2 : this._opentelemetry = new Opentelemetry(this._options);
  }
  get organizations() {
    var _a2;
    return (_a2 = this._organizations) != null ? _a2 : this._organizations = new Organizations(this._options);
  }
  get projects() {
    var _a2;
    return (_a2 = this._projects) != null ? _a2 : this._projects = new Projects(this._options);
  }
  get promptVersion() {
    var _a2;
    return (_a2 = this._promptVersion) != null ? _a2 : this._promptVersion = new PromptVersion(this._options);
  }
  get prompts() {
    var _a2;
    return (_a2 = this._prompts) != null ? _a2 : this._prompts = new Prompts(this._options);
  }
  get scim() {
    var _a2;
    return (_a2 = this._scim) != null ? _a2 : this._scim = new Scim(this._options);
  }
  get scoreConfigs() {
    var _a2;
    return (_a2 = this._scoreConfigs) != null ? _a2 : this._scoreConfigs = new ScoreConfigs(this._options);
  }
  get scoreV2() {
    var _a2;
    return (_a2 = this._scoreV2) != null ? _a2 : this._scoreV2 = new ScoreV2(this._options);
  }
  get score() {
    var _a2;
    return (_a2 = this._score) != null ? _a2 : this._score = new Score(this._options);
  }
  get sessions() {
    var _a2;
    return (_a2 = this._sessions) != null ? _a2 : this._sessions = new Sessions(this._options);
  }
  get trace() {
    var _a2;
    return (_a2 = this._trace) != null ? _a2 : this._trace = new Trace(this._options);
  }
};

// src/media.ts
var LangfuseMedia = class {
  /**
   * Creates a new LangfuseMedia instance.
   *
   * @param params - Media parameters specifying the source and content
   *
   * @example
   * ```typescript
   * // Create from base64 data URI
   * const media = new LangfuseMedia({
   *   source: "base64_data_uri",
   *   base64DataUri: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ..."
   * });
   * ```
   */
  constructor(params) {
    const { source } = params;
    this._source = source;
    if (source === "base64_data_uri") {
      const [contentBytesParsed, contentTypeParsed] = this.parseBase64DataUri(
        params.base64DataUri
      );
      this._contentBytes = contentBytesParsed;
      this._contentType = contentTypeParsed;
    } else {
      this._contentBytes = params.contentBytes;
      this._contentType = params.contentType;
    }
  }
  /**
   * Parses a base64 data URI to extract content bytes and type.
   *
   * @param data - The base64 data URI string
   * @returns Tuple of [contentBytes, contentType] or [undefined, undefined] on error
   * @private
   */
  parseBase64DataUri(data) {
    try {
      if (!data || typeof data !== "string") {
        throw new Error("Data URI is not a string");
      }
      if (!data.startsWith("data:")) {
        throw new Error("Data URI does not start with 'data:'");
      }
      const [header, actualData] = data.slice(5).split(",", 2);
      if (!header || !actualData) {
        throw new Error("Invalid URI");
      }
      const headerParts = header.split(";");
      if (!headerParts.includes("base64")) {
        throw new Error("Data is not base64 encoded");
      }
      const contentType = headerParts[0];
      if (!contentType) {
        throw new Error("Content type is empty");
      }
      return [base64ToBytes(actualData), contentType];
    } catch (error) {
      getGlobalLogger().error("Error parsing base64 data URI", error);
      return [void 0, void 0];
    }
  }
  /**
   * Gets a unique identifier for this media based on its content hash.
   *
   * The ID is derived from the first 22 characters of the URL-safe base64-encoded
   * SHA-256 hash of the content.
   *
   * @returns The unique media ID, or null if hash generation failed
   *
   * @example
   * ```typescript
   * const media = new LangfuseMedia({...});
   * console.log(media.id); // "A1B2C3D4E5F6G7H8I9J0K1"
   * ```
   */
  async getId() {
    const contentSha256Hash = await this.getSha256Hash();
    if (!contentSha256Hash) return null;
    const urlSafeContentHash = contentSha256Hash.replaceAll("+", "-").replaceAll("/", "_");
    return urlSafeContentHash.slice(0, 22);
  }
  /**
   * Gets the length of the media content in bytes.
   *
   * @returns The content length in bytes, or undefined if no content is available
   */
  get contentLength() {
    var _a2;
    return (_a2 = this._contentBytes) == null ? void 0 : _a2.length;
  }
  /**
   * Gets the SHA-256 hash of the media content.
   *
   * The hash is used for content integrity verification and generating unique media IDs.
   * Returns undefined if crypto is not available or hash generation fails.
   *
   * @returns The base64-encoded SHA-256 hash, or undefined if unavailable
   */
  async getSha256Hash() {
    if (!this._contentBytes) {
      return void 0;
    }
    try {
      const hash = await crypto.subtle.digest("SHA-256", this._contentBytes);
      return bytesToBase64(new Uint8Array(hash));
    } catch (error) {
      getGlobalLogger().warn(
        "[Langfuse] Failed to generate SHA-256 hash for media content:",
        error
      );
      return void 0;
    }
  }
  /**
   * Gets the media reference tag for embedding in trace data.
   *
   * The tag format is: `@@@langfuseMedia:type=<contentType>|id=<mediaId>|source=<source>@@@`
   * This tag can be embedded in trace attributes and will be replaced with actual
   * media content when the trace is viewed in Langfuse.
   *
   * @returns The media reference tag, or null if required data is missing
   *
   * @example
   * ```typescript
   * const media = new LangfuseMedia({...});
   * console.log(media.tag);
   * // "@@@langfuseMedia:type=image/png|id=A1B2C3D4E5F6G7H8I9J0K1|source=base64_data_uri@@@"
   * ```
   */
  async getTag() {
    const id = await this.getId();
    if (!this._contentType || !this._source || !id) return null;
    return `@@@langfuseMedia:type=${this._contentType}|id=${id}|source=${this._source}@@@`;
  }
  /**
   * Gets the media content as a base64 data URI.
   *
   * @returns The complete data URI string, or null if no content is available
   *
   * @example
   * ```typescript
   * const media = new LangfuseMedia({...});
   * console.log(media.base64DataUri);
   * // "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAB..."
   * ```
   */
  get base64DataUri() {
    if (!this._contentBytes) return null;
    return `data:${this._contentType};base64,${bytesToBase64(this._contentBytes)}`;
  }
  /**
   * Serializes the media to JSON (returns the base64 data URI).
   *
   * @returns The base64 data URI, or null if no content is available
   */
  toJSON() {
    return this.base64DataUri;
  }
};

// src/propagation.ts

var experimentKeys = [
  "experimentId",
  "experimentName",
  "experimentMetadata",
  "experimentDatasetId",
  "experimentItemId",
  "experimentItemMetadata",
  "experimentItemRootObservationId"
];
var LangfuseOtelContextKeys = {
  userId: (0,src.createContextKey)("langfuse_user_id"),
  sessionId: (0,src.createContextKey)("langfuse_session_id"),
  metadata: (0,src.createContextKey)("langfuse_metadata"),
  version: (0,src.createContextKey)("langfuse_version"),
  tags: (0,src.createContextKey)("langfuse_tags"),
  traceName: (0,src.createContextKey)("langfuse_trace_name"),
  // Experiments
  experimentId: (0,src.createContextKey)("langfuse_experiment_id"),
  experimentName: (0,src.createContextKey)("langfuse_experiment_name"),
  experimentMetadata: (0,src.createContextKey)("langfuse_experiment_metadata"),
  experimentDatasetId: (0,src.createContextKey)("langfuse_experiment_dataset_id"),
  experimentItemId: (0,src.createContextKey)("langfuse_experiment_item_id"),
  experimentItemMetadata: (0,src.createContextKey)("langfuse_experiment_item_metadata"),
  experimentItemRootObservationId: (0,src.createContextKey)(
    "langfuse_experiment_item_root_observation_id"
  )
};
var LANGFUSE_BAGGAGE_PREFIX = "langfuse_";
var LANGFUSE_BAGGAGE_TAGS_SEPARATOR = ",";
function propagateAttributes(params, fn) {
  var _a2;
  let context = otelContextApi.active();
  const span = otelTraceApi.getActiveSpan();
  const asBaggage = (_a2 = params.asBaggage) != null ? _a2 : false;
  const {
    userId,
    sessionId,
    metadata,
    version,
    tags,
    traceName,
    _internalExperiment
  } = params;
  if (userId) {
    if (isValidPropagatedString({ value: userId, attributeName: "userId" })) {
      context = setPropagatedAttribute({
        key: "userId",
        value: userId,
        context,
        span,
        asBaggage
      });
    }
  }
  if (sessionId) {
    if (isValidPropagatedString({
      value: sessionId,
      attributeName: "sessionId"
    })) {
      context = setPropagatedAttribute({
        key: "sessionId",
        value: sessionId,
        context,
        span,
        asBaggage
      });
    }
  }
  if (version) {
    if (isValidPropagatedString({
      value: version,
      attributeName: "version"
    })) {
      context = setPropagatedAttribute({
        key: "version",
        value: version,
        context,
        span,
        asBaggage
      });
    }
  }
  if (traceName) {
    if (isValidPropagatedString({
      value: traceName,
      attributeName: "traceName"
    })) {
      context = setPropagatedAttribute({
        key: "traceName",
        value: traceName,
        context,
        span,
        asBaggage
      });
    }
  }
  if (tags && tags.length > 0) {
    const validTags = tags.filter(
      (tag) => isValidPropagatedString({
        value: tag,
        attributeName: "tag"
      })
    );
    if (validTags.length > 0) {
      context = setPropagatedAttribute({
        key: "tags",
        value: validTags,
        context,
        span,
        asBaggage
      });
    }
  }
  if (metadata) {
    const validatedMetadata = {};
    for (const [key, value] of Object.entries(metadata)) {
      if (isValidPropagatedString({
        value,
        attributeName: `metadata.${key}`
      })) {
        validatedMetadata[key] = value;
      }
    }
    if (Object.keys(validatedMetadata).length > 0) {
      context = setPropagatedAttribute({
        key: "metadata",
        value: validatedMetadata,
        context,
        span,
        asBaggage
      });
    }
  }
  if (_internalExperiment) {
    for (const [key, value] of Object.entries(_internalExperiment)) {
      if (value !== void 0) {
        context = setPropagatedAttribute({
          key,
          value,
          context,
          span,
          asBaggage
        });
      }
    }
  }
  return otelContextApi.with(context, fn);
}
function getPropagatedAttributesFromContext(context) {
  const propagatedAttributes = {};
  const baggage = src.propagation.getBaggage(context);
  if (baggage) {
    baggage.getAllEntries().forEach(([baggageKey, baggageEntry]) => {
      if (baggageKey.startsWith(LANGFUSE_BAGGAGE_PREFIX)) {
        const spanKey = getSpanKeyFromBaggageKey(baggageKey);
        if (spanKey) {
          const isMergedTags = baggageKey == getBaggageKeyForPropagatedKey("tags");
          propagatedAttributes[spanKey] = isMergedTags ? baggageEntry.value.split(LANGFUSE_BAGGAGE_TAGS_SEPARATOR) : baggageEntry.value;
        }
      }
    });
  }
  const userId = context.getValue(LangfuseOtelContextKeys["userId"]);
  if (userId && typeof userId === "string") {
    const spanKey = getSpanKeyForPropagatedKey("userId");
    propagatedAttributes[spanKey] = userId;
  }
  const sessionId = context.getValue(LangfuseOtelContextKeys["sessionId"]);
  if (sessionId && typeof sessionId === "string") {
    const spanKey = getSpanKeyForPropagatedKey("sessionId");
    propagatedAttributes[spanKey] = sessionId;
  }
  const version = context.getValue(LangfuseOtelContextKeys["version"]);
  if (version && typeof version === "string") {
    const spanKey = getSpanKeyForPropagatedKey("version");
    propagatedAttributes[spanKey] = version;
  }
  const traceName = context.getValue(LangfuseOtelContextKeys["traceName"]);
  if (traceName && typeof traceName === "string") {
    const spanKey = getSpanKeyForPropagatedKey("traceName");
    propagatedAttributes[spanKey] = traceName;
  }
  const tags = context.getValue(LangfuseOtelContextKeys["tags"]);
  if (tags && Array.isArray(tags)) {
    const spanKey = getSpanKeyForPropagatedKey("tags");
    propagatedAttributes[spanKey] = tags;
  }
  const metadata = context.getValue(LangfuseOtelContextKeys["metadata"]);
  if (metadata && typeof metadata === "object" && metadata !== null) {
    for (const [k, v] of Object.entries(metadata)) {
      const spanKey = `${"langfuse.trace.metadata" /* TRACE_METADATA */}.${k}`;
      propagatedAttributes[spanKey] = String(v);
    }
  }
  for (const key of experimentKeys) {
    const contextKey = LangfuseOtelContextKeys[key];
    const value = context.getValue(contextKey);
    if (value && typeof value === "string") {
      const spanKey = getSpanKeyForPropagatedKey(key);
      propagatedAttributes[spanKey] = value;
    }
  }
  if (propagatedAttributes[getSpanKeyForPropagatedKey("experimentItemRootObservationId")]) {
    propagatedAttributes["langfuse.environment" /* ENVIRONMENT */] = LANGFUSE_SDK_EXPERIMENT_ENVIRONMENT;
  }
  return propagatedAttributes;
}
function setPropagatedAttribute(params) {
  const { key, value, span, asBaggage } = params;
  let context = params.context;
  let mergedMetadata = key === "metadata" ? getContextMergedMetadata(context, value) : {};
  let mergedTags = key === "tags" ? getContextMergedTags(context, value) : [];
  const contextKey = getContextKeyForPropagatedKey(key);
  if (key === "metadata") {
    context = context.setValue(contextKey, mergedMetadata);
  } else if (key === "tags") {
    context = context.setValue(contextKey, mergedTags);
  } else {
    context = context.setValue(contextKey, value);
  }
  if (span && span.isRecording()) {
    if (key === "metadata") {
      for (const [k, v] of Object.entries(mergedMetadata)) {
        span.setAttribute(
          `${"langfuse.trace.metadata" /* TRACE_METADATA */}.${k}`,
          v
        );
      }
    } else if (key === "tags") {
      const spanKey = getSpanKeyForPropagatedKey(key);
      span.setAttribute(spanKey, mergedTags);
    } else {
      const spanKey = getSpanKeyForPropagatedKey(key);
      span.setAttribute(spanKey, value);
    }
  }
  if (asBaggage) {
    const baggageKey = getBaggageKeyForPropagatedKey(key);
    let baggage = propagation.getBaggage(context) || propagation.createBaggage();
    if (key === "metadata") {
      for (const [k, v] of Object.entries(mergedMetadata)) {
        baggage = baggage.setEntry(`${baggageKey}_${k}`, { value: v });
      }
    } else if (key === "tags") {
      baggage = baggage.setEntry(baggageKey, {
        value: mergedTags.join(LANGFUSE_BAGGAGE_TAGS_SEPARATOR)
      });
    } else {
      baggage = baggage.setEntry(baggageKey, { value });
    }
    context = propagation.setBaggage(context, baggage);
  }
  return context;
}
function getContextMergedTags(context, newTags) {
  const existingTags = context.getValue(LangfuseOtelContextKeys["tags"]);
  if (existingTags && Array.isArray(existingTags)) {
    return [.../* @__PURE__ */ new Set([...existingTags, ...newTags])];
  } else {
    return newTags;
  }
}
function getContextMergedMetadata(context, newMetadata) {
  const existingMetadata = context.getValue(
    LangfuseOtelContextKeys["metadata"]
  );
  if (existingMetadata && typeof existingMetadata === "object" && existingMetadata !== null && !Array.isArray(existingMetadata)) {
    return { ...existingMetadata, ...newMetadata };
  } else {
    return newMetadata;
  }
}
function isValidPropagatedString(params) {
  const logger = getGlobalLogger();
  const { value, attributeName } = params;
  if (typeof value !== "string") {
    logger.warn(
      `Propagated attribute '${attributeName}' must be a string. Dropping value.`
    );
    return false;
  }
  if (value.length > 200) {
    logger.warn(
      `Propagated attribute '${attributeName}' value is over 200 characters (${value.length} chars). Dropping value.`
    );
    return false;
  }
  return true;
}
function getContextKeyForPropagatedKey(key) {
  return LangfuseOtelContextKeys[key];
}
function getSpanKeyForPropagatedKey(key) {
  switch (key) {
    case "userId":
      return "user.id" /* TRACE_USER_ID */;
    case "sessionId":
      return "session.id" /* TRACE_SESSION_ID */;
    case "version":
      return "langfuse.version" /* VERSION */;
    case "traceName":
      return "langfuse.trace.name" /* TRACE_NAME */;
    case "metadata":
      return "langfuse.trace.metadata" /* TRACE_METADATA */;
    case "tags":
      return "langfuse.trace.tags" /* TRACE_TAGS */;
    case "experimentId":
      return "langfuse.experiment.id" /* EXPERIMENT_ID */;
    case "experimentName":
      return "langfuse.experiment.name" /* EXPERIMENT_NAME */;
    case "experimentMetadata":
      return "langfuse.experiment.metadata" /* EXPERIMENT_METADATA */;
    case "experimentDatasetId":
      return "langfuse.experiment.dataset.id" /* EXPERIMENT_DATASET_ID */;
    case "experimentItemId":
      return "langfuse.experiment.item.id" /* EXPERIMENT_ITEM_ID */;
    case "experimentItemMetadata":
      return "langfuse.experiment.item.metadata" /* EXPERIMENT_ITEM_METADATA */;
    case "experimentItemRootObservationId":
      return "langfuse.experiment.item.root_observation_id" /* EXPERIMENT_ITEM_ROOT_OBSERVATION_ID */;
    default: {
      const fallback = key;
      throw Error("Unhandled propagated key", fallback);
    }
  }
}
function getBaggageKeyForPropagatedKey(key) {
  switch (key) {
    case "userId":
      return `${LANGFUSE_BAGGAGE_PREFIX}user_id`;
    case "sessionId":
      return `${LANGFUSE_BAGGAGE_PREFIX}session_id`;
    case "version":
      return `${LANGFUSE_BAGGAGE_PREFIX}version`;
    case "traceName":
      return `${LANGFUSE_BAGGAGE_PREFIX}trace_name`;
    case "metadata":
      return `${LANGFUSE_BAGGAGE_PREFIX}metadata`;
    case "tags":
      return `${LANGFUSE_BAGGAGE_PREFIX}tags`;
    case "experimentId":
      return `${LANGFUSE_BAGGAGE_PREFIX}experiment_id`;
    case "experimentName":
      return `${LANGFUSE_BAGGAGE_PREFIX}experiment_name`;
    case "experimentMetadata":
      return `${LANGFUSE_BAGGAGE_PREFIX}experiment_metadata`;
    case "experimentDatasetId":
      return `${LANGFUSE_BAGGAGE_PREFIX}experiment_dataset_id`;
    case "experimentItemId":
      return `${LANGFUSE_BAGGAGE_PREFIX}experiment_item_id`;
    case "experimentItemMetadata":
      return `${LANGFUSE_BAGGAGE_PREFIX}experiment_item_metadata`;
    case "experimentItemRootObservationId":
      return `${LANGFUSE_BAGGAGE_PREFIX}experiment_item_root_observation_id`;
    default: {
      const fallback = key;
      throw Error("Unhandled propagated key", fallback);
    }
  }
}
function getSpanKeyFromBaggageKey(baggageKey) {
  if (!baggageKey.startsWith(LANGFUSE_BAGGAGE_PREFIX)) return;
  const suffix = baggageKey.slice(LANGFUSE_BAGGAGE_PREFIX.length);
  if (suffix.startsWith("metadata_")) {
    const metadataKey = suffix.slice("metadata_".length);
    return `${"langfuse.trace.metadata" /* TRACE_METADATA */}.${metadataKey}`;
  }
  switch (suffix) {
    case "user_id":
      return getSpanKeyForPropagatedKey("userId");
    case "session_id":
      return getSpanKeyForPropagatedKey("sessionId");
    case "version":
      return getSpanKeyForPropagatedKey("version");
    case "trace_name":
      return getSpanKeyForPropagatedKey("traceName");
    case "tags":
      return getSpanKeyForPropagatedKey("tags");
    case "experiment_id":
      return getSpanKeyForPropagatedKey("experimentId");
    case "experiment_name":
      return getSpanKeyForPropagatedKey("experimentName");
    case "experiment_metadata":
      return getSpanKeyForPropagatedKey("experimentMetadata");
    case "experiment_dataset_id":
      return getSpanKeyForPropagatedKey("experimentDatasetId");
    case "experiment_item_id":
      return getSpanKeyForPropagatedKey("experimentItemId");
    case "experiment_item_metadata":
      return getSpanKeyForPropagatedKey("experimentItemMetadata");
    case "experiment_item_root_observation_id":
      return getSpanKeyForPropagatedKey("experimentItemRootObservationId");
  }
}

//# sourceMappingURL=index.mjs.map
// EXTERNAL MODULE: ./node_modules/.pnpm/@opentelemetry+core@2.7.1_@opentelemetry+api@1.9.1/node_modules/@opentelemetry/core/build/src/index.js
var build_src = __webpack_require__(57285);
// EXTERNAL MODULE: ./node_modules/.pnpm/@opentelemetry+exporter-trace-otlp-http@0.214.0_@opentelemetry+api@1.9.1/node_modules/@opentelemetry/exporter-trace-otlp-http/build/src/index.js
var exporter_trace_otlp_http_build_src = __webpack_require__(47574);
// EXTERNAL MODULE: ./node_modules/.pnpm/@opentelemetry+sdk-trace-base@2.7.1_@opentelemetry+api@1.9.1/node_modules/@opentelemetry/sdk-trace-base/build/src/index.js
var sdk_trace_base_build_src = __webpack_require__(17953);
;// CONCATENATED MODULE: ./node_modules/.pnpm/@langfuse+otel@4.6.1_@opentelemetry+api@1.9.1_@opentelemetry+core@2.7.1_@opentelemetry+_44397b1810bced9113f59479de29e7f7/node_modules/@langfuse/otel/dist/index.mjs
// src/span-processor.ts





// src/MediaService.ts

var MediaService = class {
  constructor(params) {
    this.pendingMediaUploads = /* @__PURE__ */ new Set();
    this.apiClient = params.apiClient;
  }
  get logger() {
    return getGlobalLogger();
  }
  async flush() {
    await Promise.all(Array.from(this.pendingMediaUploads));
  }
  async process(span) {
    var _a;
    const mediaAttributes = [
      LangfuseOtelSpanAttributes.OBSERVATION_INPUT,
      LangfuseOtelSpanAttributes.TRACE_INPUT,
      LangfuseOtelSpanAttributes.OBSERVATION_OUTPUT,
      LangfuseOtelSpanAttributes.TRACE_OUTPUT,
      LangfuseOtelSpanAttributes.OBSERVATION_METADATA,
      LangfuseOtelSpanAttributes.TRACE_METADATA
    ];
    for (const mediaAttribute of mediaAttributes) {
      const mediaRelevantAttributeKeys = Object.keys(span.attributes).filter(
        (attributeName) => attributeName.startsWith(mediaAttribute)
      );
      for (const key of mediaRelevantAttributeKeys) {
        const value = span.attributes[key];
        if (typeof value !== "string") {
          this.logger.warn(
            `Span attribute ${mediaAttribute} is not a stringified object. Skipping media handling.`
          );
          continue;
        }
        let mediaReplacedValue = value;
        const regex = /data:[^;]+;base64,[A-Za-z0-9+/]+=*/g;
        const foundMedia = [...new Set((_a = value.match(regex)) != null ? _a : [])];
        if (foundMedia.length === 0) continue;
        for (const mediaDataUri of foundMedia) {
          const media = new LangfuseMedia({
            base64DataUri: mediaDataUri,
            source: "base64_data_uri"
          });
          const langfuseMediaTag = await media.getTag();
          if (!langfuseMediaTag) {
            this.logger.warn(
              "Failed to create Langfuse media tag. Skipping media item."
            );
            continue;
          }
          this.scheduleUpload({
            span,
            media,
            field: mediaAttribute.includes("input") ? "input" : mediaAttribute.includes("output") ? "output" : "metadata"
            // todo: make more robust
          });
          mediaReplacedValue = mediaReplacedValue.replaceAll(
            mediaDataUri,
            langfuseMediaTag
          );
        }
        span.attributes[key] = mediaReplacedValue;
      }
    }
    if (span.instrumentationScope.name === "ai") {
      const aiSDKMediaAttributes = ["ai.prompt.messages", "ai.prompt"];
      for (const mediaAttribute of aiSDKMediaAttributes) {
        const value = span.attributes[mediaAttribute];
        if (!value || typeof value !== "string") {
          continue;
        }
        let mediaReplacedValue = value;
        try {
          const parsed = JSON.parse(value);
          if (Array.isArray(parsed)) {
            for (const message of parsed) {
              if (Array.isArray(message["content"])) {
                const contentParts = message["content"];
                for (const part of contentParts) {
                  if (part["type"] === "file") {
                    let base64Content = null;
                    if (part["data"] != null && part["mediaType"] != null) {
                      base64Content = part["data"];
                    }
                    if (part["image"] != null && part["mediaType"] != null && !part["image"].startsWith("http")) {
                      base64Content = part["image"];
                    }
                    if (!base64Content) continue;
                    const media = new LangfuseMedia({
                      contentType: part["mediaType"],
                      contentBytes: base64ToBytes(base64Content),
                      source: "bytes"
                    });
                    const langfuseMediaTag = await media.getTag();
                    if (!langfuseMediaTag) {
                      this.logger.warn(
                        "Failed to create Langfuse media tag. Skipping media item."
                      );
                      continue;
                    }
                    this.scheduleUpload({
                      span,
                      media,
                      field: "input"
                    });
                    mediaReplacedValue = mediaReplacedValue.replaceAll(
                      base64Content,
                      langfuseMediaTag
                    );
                  }
                }
              }
            }
          }
          span.attributes[mediaAttribute] = mediaReplacedValue;
        } catch (err) {
          this.logger.warn(
            `Failed to handle media for AI SDK attribute ${mediaAttribute} for span ${span.spanContext().spanId}`,
            err
          );
        }
      }
    }
  }
  scheduleUpload(params) {
    const { span, field, media } = params;
    const uploadPromise = this.handleUpload({
      media,
      traceId: span.spanContext().traceId,
      observationId: span.spanContext().spanId,
      field
    }).catch((err) => {
      this.logger.error("Media upload failed with error: ", err);
    });
    this.pendingMediaUploads.add(uploadPromise);
    uploadPromise.finally(() => {
      this.pendingMediaUploads.delete(uploadPromise);
    });
  }
  async handleUpload({
    media,
    traceId,
    observationId,
    field
  }) {
    try {
      const contentSha256Hash = await media.getSha256Hash();
      if (!media.contentLength || !media._contentType || !contentSha256Hash || !media._contentBytes) {
        return;
      }
      const { uploadUrl, mediaId } = await this.apiClient.media.getUploadUrl({
        contentLength: media.contentLength,
        traceId,
        observationId,
        field,
        contentType: media._contentType,
        sha256Hash: contentSha256Hash
      });
      if (!uploadUrl) {
        this.logger.debug(
          `Media status: Media with ID ${mediaId} already uploaded. Skipping duplicate upload.`
        );
        return;
      }
      const clientSideMediaId = await media.getId();
      if (clientSideMediaId !== mediaId) {
        this.logger.error(
          `Media integrity error: Media ID mismatch between SDK (${clientSideMediaId}) and Server (${mediaId}). Upload cancelled. Please check media ID generation logic.`
        );
        return;
      }
      this.logger.debug(`Uploading media ${mediaId}...`);
      const startTime = Date.now();
      const uploadResponse = await this.uploadWithBackoff({
        uploadUrl,
        contentBytes: media._contentBytes,
        contentType: media._contentType,
        contentSha256Hash,
        maxRetries: 3,
        baseDelay: 1e3
      });
      if (!uploadResponse) {
        throw Error("Media upload process failed");
      }
      await this.apiClient.media.patch(mediaId, {
        uploadedAt: (/* @__PURE__ */ new Date()).toISOString(),
        uploadHttpStatus: uploadResponse.status,
        uploadHttpError: await uploadResponse.text(),
        uploadTimeMs: Date.now() - startTime
      });
      this.logger.debug(`Media upload status reported for ${mediaId}`);
    } catch (err) {
      this.logger.error(`Error processing media item: ${err}`);
    }
  }
  async uploadWithBackoff(params) {
    const {
      uploadUrl,
      contentType,
      contentSha256Hash,
      contentBytes,
      maxRetries,
      baseDelay
    } = params;
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        let parsedHostname;
        try {
          parsedHostname = new URL(uploadUrl).hostname;
        } catch {
          parsedHostname = "";
        }
        const isSelfHostedGcsBucket = parsedHostname === "storage.googleapis.com" || parsedHostname.endsWith(".storage.googleapis.com");
        const headers = isSelfHostedGcsBucket ? { "Content-Type": contentType } : {
          "Content-Type": contentType,
          "x-amz-checksum-sha256": contentSha256Hash,
          "x-ms-blob-type": "BlockBlob"
        };
        const uploadResponse = await fetch(uploadUrl, {
          method: "PUT",
          body: contentBytes,
          headers
        });
        if (attempt < maxRetries && uploadResponse.status !== 200 && uploadResponse.status !== 201) {
          throw new Error(`Upload failed with status ${uploadResponse.status}`);
        }
        return uploadResponse;
      } catch (e) {
        if (attempt === maxRetries) {
          throw e;
        }
        const delay = baseDelay * Math.pow(2, attempt);
        const jitter = Math.random() * 1e3;
        await new Promise((resolve) => setTimeout(resolve, delay + jitter));
      }
    }
  }
};

// src/span-processor.ts
var LangfuseSpanProcessor = class {
  /**
   * Creates a new LangfuseSpanProcessor instance.
   *
   * @param params - Configuration parameters for the processor
   *
   * @example
   * ```typescript
   * const processor = new LangfuseSpanProcessor({
   *   publicKey: 'pk_...',
   *   secretKey: 'sk_...',
   *   environment: 'staging',
   *   flushAt: 10,
   *   flushInterval: 2,
   *   mask: ({ data }) => {
   *     // Custom masking logic
   *     return typeof data === 'string'
   *       ? data.replace(/secret_\w+/g, 'secret_***')
   *       : data;
   *   },
   *   shouldExportSpan: ({ otelSpan }) => {
   *     // Only export spans from specific services
   *     return otelSpan.name.startsWith('my-service');
   *   }
   * });
   * ```
   */
  constructor(params) {
    this.pendingEndedSpans = /* @__PURE__ */ new Set();
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l;
    const logger = getGlobalLogger();
    const publicKey = (_a = params == null ? void 0 : params.publicKey) != null ? _a : getEnv("LANGFUSE_PUBLIC_KEY");
    const secretKey = (_b = params == null ? void 0 : params.secretKey) != null ? _b : getEnv("LANGFUSE_SECRET_KEY");
    const baseUrl = (_e = (_d = (_c = params == null ? void 0 : params.baseUrl) != null ? _c : getEnv("LANGFUSE_BASE_URL")) != null ? _d : getEnv("LANGFUSE_BASEURL")) != null ? _e : (
      // legacy v2
      "https://cloud.langfuse.com"
    );
    if (!(params == null ? void 0 : params.exporter) && !publicKey) {
      logger.warn(
        "No exporter configured and no public key provided in constructor or as LANGFUSE_PUBLIC_KEY env var. Span exports will fail."
      );
    }
    if (!(params == null ? void 0 : params.exporter) && !secretKey) {
      logger.warn(
        "No exporter configured and no secret key provided in constructor or as LANGFUSE_SECRET_KEY env var. Span exports will fail."
      );
    }
    const flushAt = (_f = params == null ? void 0 : params.flushAt) != null ? _f : getEnv("LANGFUSE_FLUSH_AT");
    const flushIntervalSeconds = (_g = params == null ? void 0 : params.flushInterval) != null ? _g : getEnv("LANGFUSE_FLUSH_INTERVAL");
    const authHeaderValue = base64Encode(`${publicKey}:${secretKey}`);
    const timeoutSeconds = (_i = params == null ? void 0 : params.timeout) != null ? _i : Number((_h = getEnv("LANGFUSE_TIMEOUT")) != null ? _h : 5);
    const exporter = (_j = params == null ? void 0 : params.exporter) != null ? _j : new exporter_trace_otlp_http_build_src/* OTLPTraceExporter */.Q({
      url: `${baseUrl}/api/public/otel/v1/traces`,
      headers: {
        Authorization: `Basic ${authHeaderValue}`,
        x_langfuse_sdk_name: "javascript",
        x_langfuse_sdk_version: LANGFUSE_SDK_VERSION,
        x_langfuse_public_key: publicKey != null ? publicKey : "<missing>",
        ...params == null ? void 0 : params.additionalHeaders
      },
      timeoutMillis: timeoutSeconds * 1e3
    });
    this.processor = (params == null ? void 0 : params.exportMode) === "immediate" ? new sdk_trace_base_build_src.SimpleSpanProcessor(exporter) : new sdk_trace_base_build_src.BatchSpanProcessor(exporter, {
      maxExportBatchSize: flushAt ? Number(flushAt) : void 0,
      scheduledDelayMillis: flushIntervalSeconds ? Number(flushIntervalSeconds) * 1e3 : void 0
    });
    this.publicKey = publicKey;
    this.baseUrl = baseUrl;
    this.environment = (_k = params == null ? void 0 : params.environment) != null ? _k : getEnv("LANGFUSE_TRACING_ENVIRONMENT");
    this.release = (_l = params == null ? void 0 : params.release) != null ? _l : getEnv("LANGFUSE_RELEASE");
    this.mask = params == null ? void 0 : params.mask;
    this.shouldExportSpan = params == null ? void 0 : params.shouldExportSpan;
    this.apiClient = new LangfuseAPIClient({
      baseUrl: this.baseUrl,
      username: this.publicKey,
      password: secretKey,
      xLangfusePublicKey: this.publicKey,
      xLangfuseSdkVersion: LANGFUSE_SDK_VERSION,
      xLangfuseSdkName: "javascript",
      environment: "",
      // noop as baseUrl is set
      headers: params == null ? void 0 : params.additionalHeaders
    });
    this.mediaService = new MediaService({ apiClient: this.apiClient });
    logger.debug("Initialized LangfuseSpanProcessor with params:", {
      publicKey,
      baseUrl,
      environment: this.environment,
      release: this.release,
      timeoutSeconds,
      flushAt,
      flushIntervalSeconds
    });
  }
  get logger() {
    return getGlobalLogger();
  }
  /**
   * Called when a span is started. Adds environment, release, and propagated attributes to the span.
   *
   * @param span - The span that was started
   * @param parentContext - The parent context
   *
   * @override
   */
  onStart(span, parentContext) {
    span.setAttributes({
      [LangfuseOtelSpanAttributes.ENVIRONMENT]: this.environment,
      [LangfuseOtelSpanAttributes.RELEASE]: this.release,
      ...getPropagatedAttributesFromContext(parentContext)
    });
    return this.processor.onStart(span, parentContext);
  }
  /**
   * Called when a span ends. Processes the span for export to Langfuse.
   *
   * This method:
   * 1. Checks if the span should be exported using the shouldExportSpan function
   * 2. Applies data masking to sensitive attributes
   * 3. Handles media content extraction and upload
   * 4. Logs span details in debug mode
   * 5. Passes the span to the parent processor for export
   *
   * @param span - The span that ended
   *
   * @override
   */
  onEnd(span) {
    const processEndedSpanPromise = this.processEndedSpan(span).catch((err) => {
      this.logger.error(err);
    });
    this.pendingEndedSpans.add(processEndedSpanPromise);
    void processEndedSpanPromise.finally(
      () => this.pendingEndedSpans.delete(processEndedSpanPromise)
    );
  }
  async flush() {
    await Promise.all(Array.from(this.pendingEndedSpans));
    await this.mediaService.flush();
  }
  /**
   * Forces an immediate flush of all pending spans and media uploads.
   *
   * @returns Promise that resolves when all pending operations are complete
   *
   * @override
   */
  async forceFlush() {
    await this.flush();
    return this.processor.forceFlush();
  }
  /**
   * Gracefully shuts down the processor, ensuring all pending operations are completed.
   *
   * @returns Promise that resolves when shutdown is complete
   *
   * @override
   */
  async shutdown() {
    await this.flush();
    return this.processor.shutdown();
  }
  async processEndedSpan(span) {
    var _a, _b;
    if (this.shouldExportSpan) {
      try {
        if (this.shouldExportSpan({ otelSpan: span }) === false) return;
      } catch (err) {
        this.logger.error(
          "ShouldExportSpan failed with error. Excluding span. Error: ",
          err
        );
        return;
      }
    }
    this.applyMaskInPlace(span);
    await this.mediaService.process(span);
    if (this.logger.isLevelEnabled(LogLevel.DEBUG)) {
      this.logger.debug(
        `Processed span:
${JSON.stringify(
          {
            name: span.name,
            traceId: span.spanContext().traceId,
            spanId: span.spanContext().spanId,
            parentSpanId: (_b = (_a = span.parentSpanContext) == null ? void 0 : _a.spanId) != null ? _b : null,
            attributes: span.attributes,
            startTime: new Date((0,build_src.hrTimeToMilliseconds)(span.startTime)),
            endTime: new Date((0,build_src.hrTimeToMilliseconds)(span.endTime)),
            durationMs: (0,build_src.hrTimeToMilliseconds)(span.duration),
            kind: span.kind,
            status: span.status,
            resource: span.resource.attributes,
            instrumentationScope: span.instrumentationScope
          },
          null,
          2
        )}`
      );
    }
    this.processor.onEnd(span);
  }
  applyMaskInPlace(span) {
    const maskCandidates = [
      LangfuseOtelSpanAttributes.OBSERVATION_INPUT,
      LangfuseOtelSpanAttributes.TRACE_INPUT,
      LangfuseOtelSpanAttributes.OBSERVATION_OUTPUT,
      LangfuseOtelSpanAttributes.TRACE_OUTPUT,
      LangfuseOtelSpanAttributes.OBSERVATION_METADATA,
      LangfuseOtelSpanAttributes.TRACE_METADATA
    ];
    for (const maskCandidate of maskCandidates) {
      if (maskCandidate in span.attributes) {
        span.attributes[maskCandidate] = this.applyMask(
          span.attributes[maskCandidate]
        );
      }
    }
  }
  applyMask(data) {
    if (!this.mask) return data;
    try {
      return this.mask({ data });
    } catch (err) {
      this.logger.warn(
        `Applying mask function failed due to error, fully masking property. Error: ${err}`
      );
      return "<fully masked due to failed mask function>";
    }
  }
};

//# sourceMappingURL=index.mjs.map

/***/ })

};
