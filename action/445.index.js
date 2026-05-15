export const id = 445;
export const ids = [445];
export const modules = {

/***/ 27445:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createOpencode: () => (/* binding */ createOpencode)
/* harmony export */ });
/* unused harmony exports OpencodeClientManager, OpencodeLanguageModel, OpencodeModels, STRUCTURED_OUTPUT_TOOL, convertEventToStreamParts, convertToOpencodeMessages, createAPICallError, createAuthenticationError, createClientManager, createClientManagerFromSettings, createContextLogger, createFinishParts, createStreamStartPart, createStreamState, createTimeoutError, defaultLogger, extractErrorMessage, extractTextFromParts, getLogger, hasToolCalls, isAbortError, isAuthenticationError, isEventForSession, isOutputLengthError, isSessionComplete, isTimeoutError, isValidSessionId, logUnsupportedCallOptions, logUnsupportedFeature, logUnsupportedParameter, mapErrorToFinishReasonFromUnknown, mapOpencodeFinishReason, mergeSettings, opencode, silentLogger, validateModelId, validateProviderSettings, validateSettings, wrapError */
/* harmony import */ var _ai_sdk_provider__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(16616);
/* harmony import */ var zod__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(24647);



// src/opencode-provider.ts

// src/convert-to-opencode-messages.ts
function convertToOpencodeMessages(prompt, options) {
  const parts = [];
  const warnings = [];
  let systemPrompt;
  const logger = options?.logger;
  for (const message of prompt) {
    switch (message.role) {
      case "system":
        if (systemPrompt) {
          systemPrompt += "\n\n" + message.content;
        } else {
          systemPrompt = message.content;
        }
        break;
      case "user":
        for (const part of message.content) {
          const converted = convertUserPart(part, warnings, logger);
          if (converted) {
            parts.push(converted);
          }
        }
        break;
      case "assistant": {
        const assistantParts = convertAssistantContent(
          message.content,
          warnings,
          logger
        );
        parts.push(...assistantParts);
        break;
      }
      case "tool": {
        const toolResultParts = convertToolResults(
          message.content,
          warnings,
          logger,
          options?.includeToolApprovalResponsesAsContext ?? false
        );
        parts.push(...toolResultParts);
        break;
      }
    }
  }
  if (options?.mode?.type === "object-json") {
    const jsonInstruction = createJsonModeInstruction(options.mode.schema);
    parts.push({
      type: "text",
      text: jsonInstruction
    });
  }
  return { parts, systemPrompt, warnings };
}
function convertUserPart(part, warnings, logger) {
  switch (part.type) {
    case "text":
      return {
        type: "text",
        text: part.text
      };
    case "file":
      return convertFilePart(part, warnings, logger);
    default: {
      const unknownPart = part;
      const warning = `Unknown user message part type: ${unknownPart.type}`;
      warnings.push(warning);
      if (logger) {
        logger.warn(warning);
      }
      return null;
    }
  }
}
function convertFilePart(part, warnings, logger) {
  const { data, mediaType, filename } = part;
  if (typeof data === "string") {
    if (data.startsWith("data:")) {
      return {
        type: "file",
        mime: mediaType,
        filename,
        url: data
      };
    }
    if (data.startsWith("http://") || data.startsWith("https://")) {
      const warning2 = `Remote URLs are not supported for file input: ${data.substring(0, 50)}...`;
      warnings.push(warning2);
      if (logger) {
        logger.warn(warning2);
      }
      return null;
    }
    return {
      type: "file",
      mime: mediaType,
      filename,
      url: `data:${mediaType};base64,${normalizeBase64(data)}`
    };
  }
  if (data instanceof Uint8Array) {
    const base64 = uint8ArrayToBase64(data);
    return {
      type: "file",
      mime: mediaType,
      filename,
      url: `data:${mediaType};base64,${base64}`
    };
  }
  if (data instanceof URL) {
    const urlString = data.toString();
    if (urlString.startsWith("data:")) {
      return {
        type: "file",
        mime: mediaType,
        filename,
        url: urlString
      };
    }
    const warning2 = `Remote URLs are not supported for file input: ${urlString.substring(0, 50)}...`;
    warnings.push(warning2);
    if (logger) {
      logger.warn(warning2);
    }
    return null;
  }
  const warning = `Unsupported file data type: ${typeof data}`;
  warnings.push(warning);
  if (logger) {
    logger.warn(warning);
  }
  return null;
}
function convertAssistantContent(content, warnings, logger) {
  const parts = [];
  for (const part of content) {
    switch (part.type) {
      case "text":
        parts.push({
          type: "text",
          text: `[Assistant]: ${part.text}`,
          synthetic: true
        });
        break;
      case "reasoning":
        parts.push({
          type: "text",
          text: `[Reasoning]: ${part.text}`,
          synthetic: true
        });
        break;
      case "tool-call":
        parts.push({
          type: "text",
          text: `[Tool Call: ${part.toolName}]: ${JSON.stringify(part.input)}`,
          synthetic: true
        });
        break;
      case "tool-result": {
        const resultText = formatToolResult(part);
        parts.push({
          type: "text",
          text: `[Tool Result: ${part.toolName}]: ${resultText}`,
          synthetic: true
        });
        break;
      }
      case "file": {
        const warning = "File parts in assistant messages are not yet supported";
        warnings.push(warning);
        if (logger) {
          logger.warn(warning);
        }
        break;
      }
    }
  }
  return parts;
}
function convertToolResults(content, warnings, logger, includeToolApprovalResponsesAsContext = false) {
  const parts = [];
  const warning = "Tool results in prompts are included as context only. OpenCode executes tools server-side and cannot use client-provided results.";
  const hasToolResult = content.some((part) => part.type === "tool-result");
  if (hasToolResult && !warnings.includes(warning)) {
    warnings.push(warning);
    if (logger) {
      logger.warn(warning);
    }
  }
  for (const part of content) {
    if (part.type === "tool-result") {
      const resultText = formatToolResult(part);
      parts.push({
        type: "text",
        text: `[Tool Result: ${part.toolName}]: ${resultText}`,
        synthetic: true
      });
      continue;
    }
    if (part.type === "tool-approval-response" && includeToolApprovalResponsesAsContext) {
      const reasonText = part.reason ? ` (${part.reason})` : "";
      parts.push({
        type: "text",
        text: `[Tool Approval: ${part.approvalId}]: ${part.approved ? "approved" : "denied"}${reasonText}`,
        synthetic: true
      });
      continue;
    }
  }
  return parts;
}
function formatToolResult(part) {
  const output = part.output;
  switch (output.type) {
    case "text":
      return output.value;
    case "json":
      return JSON.stringify(output.value, null, 2);
    case "error-text":
      return `Error: ${output.value}`;
    case "error-json":
      return `Error: ${JSON.stringify(output.value)}`;
    case "content":
      return output.value.map((item) => {
        if (item.type === "text") {
          return item.text;
        }
        if (item.type === "file-data") {
          return `[File: ${item.mediaType}]`;
        }
        if (item.type === "file-url") {
          return `[File URL: ${item.url}]`;
        }
        if (item.type === "file-id") {
          return "[File ID]";
        }
        if (item.type === "image-data") {
          return `[Image: ${item.mediaType}]`;
        }
        if (item.type === "image-url") {
          return `[Image URL: ${item.url}]`;
        }
        if (item.type === "image-file-id") {
          return "[Image File ID]";
        }
        return "[Content]";
      }).join("\n");
    case "execution-denied":
      return output.reason ? `Execution denied: ${output.reason}` : "Execution denied";
    default:
      return JSON.stringify(output);
  }
}
function createJsonModeInstruction(schema) {
  let instruction = "IMPORTANT: You must respond with valid JSON only. Do not include any text before or after the JSON. Do not include markdown code blocks.";
  if (schema) {
    instruction += "\n\nThe JSON must conform to this schema:\n" + JSON.stringify(schema, null, 2);
  }
  return instruction;
}
function normalizeBase64(base64) {
  return base64.replace(/\s/g, "");
}
function uint8ArrayToBase64(data) {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(data).toString("base64");
  }
  let binary = "";
  for (let i = 0; i < data.length; i++) {
    binary += String.fromCharCode(data[i]);
  }
  return btoa(binary);
}
function extractTextFromParts(parts) {
  return parts.filter((part) => part.type === "text").map((part) => part.text).join("\n");
}

// src/opencode-part-utils.ts
function safeStringifyToolInput(input, onError) {
  try {
    return JSON.stringify(input) ?? "{}";
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    onError?.(message);
    return "{}";
  }
}
function parseDataUrl(dataUrl) {
  if (!dataUrl.startsWith("data:")) {
    return null;
  }
  const commaIndex = dataUrl.indexOf(",");
  if (commaIndex === -1) {
    return null;
  }
  const header = dataUrl.slice("data:".length, commaIndex);
  const payload = dataUrl.slice(commaIndex + 1);
  const headerTokens = header.split(";");
  const mediaTypeToken = headerTokens[0]?.trim();
  const mediaType = mediaTypeToken && mediaTypeToken.length > 0 ? mediaTypeToken : "application/octet-stream";
  const isBase64 = headerTokens.slice(1).some((token) => token.trim().toLowerCase() === "base64");
  if (isBase64) {
    return {
      mediaType,
      data: payload.replace(/\s+/g, "")
    };
  }
  let decodedPayload;
  try {
    decodedPayload = decodeURIComponent(payload);
  } catch {
    return null;
  }
  return {
    mediaType,
    data: Buffer.from(decodedPayload, "utf8").toString("base64")
  };
}
function planFilePartConversion(part) {
  if (!part.url || !part.mime) {
    return { error: "missing-metadata" };
  }
  const sourceMetadata = part.source;
  let primary;
  let hasDocumentSource = false;
  if (part.url.startsWith("data:")) {
    const parsed = parseDataUrl(part.url);
    if (!parsed) {
      return { error: "invalid-data-url" };
    }
    primary = {
      type: "file",
      mediaType: parsed.mediaType,
      data: parsed.data
    };
  } else if (part.url.startsWith("http://") || part.url.startsWith("https://")) {
    primary = {
      type: "source-url",
      id: part.id ?? part.url,
      url: part.url,
      ...part.filename ? { title: part.filename } : {}
    };
  } else {
    const filename = part.filename ?? part.url.split("/").pop() ?? "file";
    primary = {
      type: "source-document",
      id: part.id ?? part.url,
      mediaType: part.mime,
      title: filename,
      ...filename ? { filename } : {}
    };
    hasDocumentSource = true;
  }
  let secondaryDocumentSource;
  if (part.source && !hasDocumentSource) {
    const sourceType = part.source.type;
    if (sourceType === "file" || sourceType === "symbol" || sourceType === "resource") {
      const title = typeof part.source.path === "string" ? part.source.path : typeof part.source.uri === "string" ? part.source.uri : "source";
      secondaryDocumentSource = {
        id: `${part.id ?? "source"}-source`,
        mediaType: part.mime,
        title,
        ...typeof part.source.path === "string" ? { filename: part.source.path } : {}
      };
    }
  }
  return {
    plan: {
      sourceMetadata,
      primary,
      ...secondaryDocumentSource ? { secondaryDocumentSource } : {}
    }
  };
}

// src/convert-from-opencode-events.ts
var STRUCTURED_OUTPUT_TOOL = "StructuredOutput";
function createStreamState() {
  return {
    textPartId: void 0,
    textStarted: false,
    reasoningPartId: void 0,
    reasoningStarted: false,
    toolStates: /* @__PURE__ */ new Map(),
    usage: {
      inputTokens: 0,
      outputTokens: 0,
      reasoningTokens: 0,
      cachedInputTokens: 0,
      cachedWriteTokens: 0,
      totalCost: 0
    },
    lastTextContent: "",
    lastReasoningContent: "",
    messageRoles: /* @__PURE__ */ new Map(),
    permissionRequests: /* @__PURE__ */ new Set(),
    questionRequests: /* @__PURE__ */ new Set()
  };
}
function isEventForSession(event, sessionId) {
  if ("properties" in event && typeof event.properties === "object" && event.properties !== null) {
    const props = event.properties;
    if ("part" in props && typeof props.part === "object" && props.part !== null) {
      const part = props.part;
      return part.sessionID === sessionId;
    }
    if ("info" in props && typeof props.info === "object" && props.info !== null) {
      const info = props.info;
      return info.sessionID === sessionId;
    }
    if ("sessionID" in props) {
      return props.sessionID === sessionId;
    }
  }
  return false;
}
function isSessionComplete(event, sessionId) {
  if (event.type === "session.status") {
    const statusEvent = event;
    return statusEvent.properties.sessionID === sessionId && statusEvent.properties.status.type === "idle";
  }
  if (event.type === "session.idle") {
    const idleEvent = event;
    return idleEvent.properties.sessionID === sessionId;
  }
  return false;
}
function convertEventToStreamParts(event, state, logger) {
  const parts = [];
  switch (event.type) {
    case "message.part.updated": {
      const partEvent = event;
      const partParts = handlePartUpdated(partEvent, state, logger);
      parts.push(...partParts);
      break;
    }
    case "message.part.delta": {
      const deltaEvent = event;
      const deltaParts = handlePartDelta(deltaEvent, state);
      parts.push(...deltaParts);
      break;
    }
    case "message.updated": {
      const messageEvent = event;
      const info = messageEvent.properties.info;
      state.messageRoles.set(info.id, info.role);
      break;
    }
    case "permission.asked": {
      const permissionEvent = event;
      const requestId = permissionEvent.properties.id;
      if (!state.permissionRequests.has(requestId)) {
        state.permissionRequests.add(requestId);
        parts.push({
          type: "tool-approval-request",
          approvalId: requestId,
          toolCallId: permissionEvent.properties.tool?.callID ?? requestId,
          providerMetadata: {
            opencode: {
              sessionId: permissionEvent.properties.sessionID,
              permission: permissionEvent.properties.permission,
              patterns: permissionEvent.properties.patterns
            }
          }
        });
      }
      break;
    }
    case "question.asked": {
      const questionEvent = event;
      const questionId = questionEvent.properties.id;
      if (!state.questionRequests.has(questionId)) {
        state.questionRequests.add(questionId);
        const warning = "OpenCode question.asked events are not yet mapped to AI SDK responses. The provider cannot answer interactive questions automatically.";
        if (logger) {
          logger.warn(warning);
        }
        parts.push({
          type: "error",
          error: new Error(
            `${warning} Question ID: ${questionId}. If this blocks generation, answer/reject the question in OpenCode directly.`
          )
        });
      }
      break;
    }
    case "session.status":
    case "session.idle":
    case "session.diff":
    case "question.replied":
    case "question.rejected":
    case "project.updated":
    case "server.instance.disposed":
    case "global.disposed":
    case "worktree.ready":
    case "worktree.failed":
    case "mcp.tools.changed":
      break;
    default:
      if (logger && logger.debug) {
        logger.debug(`Unknown event type: ${event.type}`);
      }
  }
  return parts;
}
function handlePartUpdated(event, state, logger) {
  const { part, delta } = event.properties;
  const parts = [];
  const messageRole = state.messageRoles.get(part.messageID);
  if (messageRole === "user") {
    return parts;
  }
  switch (part.type) {
    case "text": {
      const textPart = part;
      if (textPart.synthetic || textPart.ignored) {
        break;
      }
      parts.push(...handleTextPart(textPart, delta, state));
      break;
    }
    case "reasoning": {
      const reasoningPart = part;
      parts.push(...handleReasoningPart(reasoningPart, delta, state));
      break;
    }
    case "tool": {
      const toolPart = part;
      parts.push(...handleToolPart(toolPart, state, logger));
      break;
    }
    case "step-finish": {
      const stepPart = part;
      handleStepFinishPart(stepPart, state);
      break;
    }
    case "step-start":
    case "subtask":
    case "snapshot":
    case "patch":
    case "agent":
    case "retry":
    case "compaction":
      break;
    case "file": {
      const filePart = part;
      parts.push(...handleFilePart(filePart));
      break;
    }
    default:
      if (logger && logger.debug) {
        logger.debug(`Unknown part type: ${part.type}`);
      }
  }
  return parts;
}
function handlePartDelta(event, state) {
  const parts = [];
  const { partID, messageID, field, delta } = event.properties;
  if (!delta) return parts;
  const messageRole = state.messageRoles.get(messageID);
  if (messageRole === "user") {
    return parts;
  }
  const isReasoning = field === "reasoning" || state.reasoningPartId === partID;
  if (isReasoning) {
    if (!state.reasoningStarted || state.reasoningPartId !== partID) {
      if (state.reasoningStarted && state.reasoningPartId && state.reasoningPartId !== partID) {
        parts.push({ type: "reasoning-end", id: state.reasoningPartId });
      }
      parts.push({ type: "reasoning-start", id: partID });
      state.reasoningStarted = true;
      state.reasoningPartId = partID;
      state.lastReasoningContent = "";
    }
    parts.push({ type: "reasoning-delta", id: partID, delta });
    state.lastReasoningContent += delta;
  } else {
    if (!state.textStarted || state.textPartId !== partID) {
      if (state.textStarted && state.textPartId && state.textPartId !== partID) {
        parts.push({ type: "text-end", id: state.textPartId });
      }
      parts.push({ type: "text-start", id: partID });
      state.textStarted = true;
      state.textPartId = partID;
      state.lastTextContent = "";
    }
    parts.push({ type: "text-delta", id: partID, delta });
    state.lastTextContent += delta;
  }
  return parts;
}
function handleTextPart(part, delta, state) {
  const parts = [];
  const partId = part.id;
  if (!state.textStarted || state.textPartId !== partId) {
    if (state.textStarted && state.textPartId && state.textPartId !== partId) {
      parts.push({ type: "text-end", id: state.textPartId });
    }
    parts.push({ type: "text-start", id: partId });
    state.textStarted = true;
    state.textPartId = partId;
    state.lastTextContent = "";
  }
  if (delta) {
    parts.push({ type: "text-delta", id: partId, delta });
    state.lastTextContent += delta;
  } else if (part.text && part.text !== state.lastTextContent) {
    const newDelta = part.text.slice(state.lastTextContent.length);
    if (newDelta) {
      parts.push({ type: "text-delta", id: partId, delta: newDelta });
      state.lastTextContent = part.text;
    }
  }
  return parts;
}
function handleReasoningPart(part, delta, state) {
  const parts = [];
  const partId = part.id;
  if (!state.reasoningStarted || state.reasoningPartId !== partId) {
    if (state.reasoningStarted && state.reasoningPartId && state.reasoningPartId !== partId) {
      parts.push({ type: "reasoning-end", id: state.reasoningPartId });
    }
    parts.push({ type: "reasoning-start", id: partId });
    state.reasoningStarted = true;
    state.reasoningPartId = partId;
    state.lastReasoningContent = "";
  }
  if (delta) {
    parts.push({ type: "reasoning-delta", id: partId, delta });
    state.lastReasoningContent += delta;
  } else if (part.text && part.text !== state.lastReasoningContent) {
    const newDelta = part.text.slice(state.lastReasoningContent.length);
    if (newDelta) {
      parts.push({ type: "reasoning-delta", id: partId, delta: newDelta });
      state.lastReasoningContent = part.text;
    }
  }
  return parts;
}
function handleToolPart(part, state, logger) {
  const parts = [];
  const { callID, tool, state: toolState } = part;
  if (tool === STRUCTURED_OUTPUT_TOOL) {
    return handleStructuredOutputToolPart(callID, toolState, state, logger);
  }
  let streamState = state.toolStates.get(callID);
  if (!streamState) {
    streamState = {
      callId: callID,
      toolName: tool,
      inputStarted: false,
      inputClosed: false,
      callEmitted: false,
      resultEmitted: false,
      emittedAttachmentIds: /* @__PURE__ */ new Set()
    };
    state.toolStates.set(callID, streamState);
  }
  switch (toolState.status) {
    case "pending":
      if (!streamState.inputStarted) {
        parts.push({
          type: "tool-input-start",
          id: callID,
          toolName: tool,
          providerExecuted: true,
          dynamic: true
        });
        streamState.inputStarted = true;
      }
      break;
    case "running": {
      if (!streamState.inputStarted) {
        parts.push({
          type: "tool-input-start",
          id: callID,
          toolName: tool,
          providerExecuted: true,
          dynamic: true,
          ...toolState.title ? { title: toolState.title } : {}
        });
        streamState.inputStarted = true;
      }
      const inputStr = safeStringifyToolInput(toolState.input, (message) => {
        if (logger) {
          logger.warn(
            `Failed to serialize tool input for ${callID}: ${message}`
          );
        }
      });
      if (!streamState.lastInput) {
        if (inputStr) {
          parts.push({
            type: "tool-input-delta",
            id: callID,
            delta: inputStr
          });
        }
      } else if (inputStr.startsWith(streamState.lastInput)) {
        const inputDelta = inputStr.slice(streamState.lastInput.length);
        if (inputDelta) {
          parts.push({
            type: "tool-input-delta",
            id: callID,
            delta: inputDelta
          });
        }
      } else if (inputStr) {
        parts.push({
          type: "tool-input-delta",
          id: callID,
          delta: inputStr
        });
      }
      streamState.lastInput = inputStr;
      break;
    }
    case "completed":
      if (!streamState.inputClosed) {
        if (!streamState.inputStarted) {
          parts.push({
            type: "tool-input-start",
            id: callID,
            toolName: tool,
            providerExecuted: true,
            dynamic: true
          });
          streamState.inputStarted = true;
        }
        parts.push({ type: "tool-input-end", id: callID });
        streamState.inputClosed = true;
      }
      if (!streamState.callEmitted) {
        parts.push({
          type: "tool-call",
          toolCallId: callID,
          toolName: tool,
          input: safeStringifyToolInput(toolState.input, (message) => {
            if (logger) {
              logger.warn(
                `Failed to serialize tool input for ${callID}: ${message}`
              );
            }
          }),
          providerExecuted: true,
          dynamic: true
        });
        streamState.callEmitted = true;
      }
      if (!streamState.resultEmitted) {
        parts.push({
          type: "tool-result",
          toolCallId: callID,
          toolName: tool,
          result: toolState.output ?? "",
          isError: false,
          dynamic: true
        });
        streamState.resultEmitted = true;
      }
      if (Array.isArray(toolState.attachments)) {
        for (const attachment of toolState.attachments) {
          const attachmentId = attachment.id ?? `${attachment.url}|${attachment.mime}|${attachment.filename ?? ""}`;
          if (streamState.emittedAttachmentIds.has(attachmentId)) {
            continue;
          }
          parts.push(...handleFilePart(attachment));
          streamState.emittedAttachmentIds.add(attachmentId);
        }
      }
      break;
    case "error":
      if (!streamState.inputClosed) {
        if (!streamState.inputStarted) {
          parts.push({
            type: "tool-input-start",
            id: callID,
            toolName: tool,
            providerExecuted: true,
            dynamic: true
          });
          streamState.inputStarted = true;
        }
        parts.push({ type: "tool-input-end", id: callID });
        streamState.inputClosed = true;
      }
      if (!streamState.callEmitted) {
        parts.push({
          type: "tool-call",
          toolCallId: callID,
          toolName: tool,
          input: safeStringifyToolInput(toolState.input, (message) => {
            if (logger) {
              logger.warn(
                `Failed to serialize tool input for ${callID}: ${message}`
              );
            }
          }),
          providerExecuted: true,
          dynamic: true
        });
        streamState.callEmitted = true;
      }
      if (!streamState.resultEmitted) {
        parts.push({
          type: "tool-result",
          toolCallId: callID,
          toolName: tool,
          result: toolState.error ?? "Unknown error",
          isError: true,
          dynamic: true
        });
        streamState.resultEmitted = true;
        if (logger) {
          logger.warn(`Tool ${tool} failed: ${toolState.error}`);
        }
      }
      break;
  }
  return parts;
}
function handleStructuredOutputToolPart(callID, toolState, state, logger) {
  const parts = [];
  const textId = `structured-output-${callID}`;
  let streamState = state.toolStates.get(callID);
  if (!streamState) {
    streamState = {
      callId: callID,
      toolName: STRUCTURED_OUTPUT_TOOL,
      inputStarted: false,
      inputClosed: false,
      callEmitted: false,
      resultEmitted: false,
      emittedAttachmentIds: /* @__PURE__ */ new Set()
    };
    state.toolStates.set(callID, streamState);
  }
  const emitTextDelta = (status, input) => {
    const inputStr = safeStringifyToolInput(input, (message) => {
      if (logger) {
        logger.warn(
          `Failed to serialize StructuredOutput input for ${callID}: ${message}`
        );
      }
    });
    if (logger) {
      logger.debug?.(
        `[StructuredOutput stream] callID=${callID} status=${status} raw input=${JSON.stringify(input)} serialized=${inputStr} lastInput=${streamState.lastInput ?? "(none)"}`
      );
    }
    if (inputStr === "{}" && status !== "completed") {
      return;
    }
    if (!state.textStarted || state.textPartId !== textId) {
      if (state.textStarted && state.textPartId && state.textPartId !== textId) {
        parts.push({ type: "text-end", id: state.textPartId });
      }
      parts.push({ type: "text-start", id: textId });
      state.textStarted = true;
      state.textPartId = textId;
      state.lastTextContent = "";
    }
    if (!streamState.lastInput) {
      if (inputStr) {
        parts.push({ type: "text-delta", id: textId, delta: inputStr });
      }
    } else if (inputStr.startsWith(streamState.lastInput)) {
      const delta = inputStr.slice(streamState.lastInput.length);
      if (delta) {
        parts.push({ type: "text-delta", id: textId, delta });
      }
    } else if (inputStr) {
      if (logger) {
        logger.debug?.(
          `[StructuredOutput stream] callID=${callID} non-prefix change detected, emitting full input. prev=${streamState.lastInput} new=${inputStr}`
        );
      }
      parts.push({ type: "text-delta", id: textId, delta: inputStr });
    }
    streamState.lastInput = inputStr;
    state.lastTextContent = inputStr;
  };
  switch (toolState.status) {
    case "pending":
      emitTextDelta("pending", toolState.input);
      break;
    case "running":
      emitTextDelta("running", toolState.input);
      break;
    case "completed":
      emitTextDelta("completed", toolState.input);
      if (state.textStarted && state.textPartId === textId) {
        parts.push({ type: "text-end", id: textId });
        state.textStarted = false;
        state.textPartId = void 0;
      }
      break;
    case "error":
      if (state.textStarted && state.textPartId === textId) {
        parts.push({ type: "text-end", id: textId });
        state.textStarted = false;
        state.textPartId = void 0;
      }
      break;
  }
  return parts;
}
function handleStepFinishPart(part, state) {
  state.usage.inputTokens += part.tokens.input;
  state.usage.outputTokens += part.tokens.output;
  state.usage.reasoningTokens += part.tokens.reasoning;
  state.usage.cachedInputTokens += part.tokens.cache.read;
  state.usage.cachedWriteTokens += part.tokens.cache.write;
  state.usage.totalCost += part.cost;
}
function handleFilePart(part) {
  const parts = [];
  const { plan } = planFilePartConversion(part);
  if (!plan) {
    return parts;
  }
  if (plan.primary.type === "file") {
    parts.push({
      type: "file",
      mediaType: plan.primary.mediaType,
      data: plan.primary.data,
      ...plan.sourceMetadata ? {
        providerMetadata: {
          opencode: {
            source: plan.sourceMetadata
          }
        }
      } : {}
    });
  } else if (plan.primary.type === "source-url") {
    parts.push({
      type: "source",
      sourceType: "url",
      id: plan.primary.id,
      url: plan.primary.url,
      ...plan.primary.title ? { title: plan.primary.title } : {}
    });
  } else {
    parts.push({
      type: "source",
      sourceType: "document",
      id: plan.primary.id,
      mediaType: plan.primary.mediaType,
      title: plan.primary.title,
      ...plan.primary.filename ? { filename: plan.primary.filename } : {},
      ...plan.sourceMetadata ? {
        providerMetadata: {
          opencode: {
            source: plan.sourceMetadata
          }
        }
      } : {}
    });
  }
  if (plan.secondaryDocumentSource) {
    parts.push({
      type: "source",
      sourceType: "document",
      id: plan.secondaryDocumentSource.id,
      mediaType: plan.secondaryDocumentSource.mediaType,
      title: plan.secondaryDocumentSource.title,
      ...plan.secondaryDocumentSource.filename ? { filename: plan.secondaryDocumentSource.filename } : {},
      ...plan.sourceMetadata ? {
        providerMetadata: {
          opencode: {
            source: plan.sourceMetadata
          }
        }
      } : {}
    });
  }
  return parts;
}
function createFinishParts(state, finishReason, sessionId, messageId) {
  const parts = [];
  const inputTokensTotal = state.usage.inputTokens + state.usage.cachedInputTokens + state.usage.cachedWriteTokens;
  const usage = {
    inputTokens: {
      total: inputTokensTotal,
      noCache: state.usage.inputTokens,
      cacheRead: state.usage.cachedInputTokens,
      cacheWrite: state.usage.cachedWriteTokens
    },
    outputTokens: {
      total: state.usage.outputTokens,
      text: void 0,
      reasoning: state.usage.reasoningTokens
    },
    raw: {
      input_tokens: state.usage.inputTokens,
      output_tokens: state.usage.outputTokens,
      reasoning_tokens: state.usage.reasoningTokens,
      cache_read_input_tokens: state.usage.cachedInputTokens,
      cache_write_input_tokens: state.usage.cachedWriteTokens,
      total_cost: state.usage.totalCost
    }
  };
  if (state.textStarted && state.textPartId) {
    parts.push({ type: "text-end", id: state.textPartId });
  }
  if (state.reasoningStarted && state.reasoningPartId) {
    parts.push({ type: "reasoning-end", id: state.reasoningPartId });
  }
  parts.push({
    type: "finish",
    usage,
    finishReason,
    providerMetadata: {
      opencode: {
        sessionId,
        ...messageId ? { messageId } : {},
        cost: state.usage.totalCost
      }
    }
  });
  return parts;
}
function createStreamStartPart(warnings) {
  const callWarnings = warnings.map((warning) => ({
    type: "other",
    message: warning
  }));
  return {
    type: "stream-start",
    warnings: callWarnings
  };
}
function isAuthenticationError(error) {
  if (!error || typeof error !== "object") {
    return false;
  }
  const err = error;
  if (typeof err.name === "string" && err.name === "ProviderAuthError") {
    return true;
  }
  if (typeof err.statusCode === "number" && (err.statusCode === 401 || err.statusCode === 403)) {
    return true;
  }
  if (typeof err.message === "string") {
    const message = err.message.toLowerCase();
    return message.includes("unauthorized") || message.includes("authentication") || message.includes("api key") || message.includes("invalid key") || message.includes("auth failed");
  }
  return false;
}
function isTimeoutError(error) {
  if (!error || typeof error !== "object") {
    return false;
  }
  const err = error;
  if (typeof err.name === "string") {
    const name = err.name.toLowerCase();
    if (name.includes("timeout")) {
      return true;
    }
  }
  if (typeof err.code === "string") {
    const code = err.code.toUpperCase();
    if (code === "ETIMEDOUT" || code === "ESOCKETTIMEDOUT") {
      return true;
    }
  }
  if (typeof err.message === "string") {
    const message = err.message.toLowerCase();
    return message.includes("timeout") || message.includes("timed out");
  }
  return false;
}
function isAbortError(error) {
  if (!error || typeof error !== "object") {
    return false;
  }
  const err = error;
  if (typeof err.name === "string" && err.name === "AbortError") {
    return true;
  }
  if (typeof err.code === "string" && err.code.toUpperCase() === "ABORT_ERR") {
    return true;
  }
  if (typeof err.name === "string" && err.name === "MessageAbortedError") {
    return true;
  }
  return false;
}
function isOutputLengthError(error) {
  if (!error || typeof error !== "object") {
    return false;
  }
  const err = error;
  if (typeof err.name === "string" && err.name === "MessageOutputLengthError") {
    return true;
  }
  if (typeof err.name === "string" && err.name === "ContextOverflowError") {
    return true;
  }
  if (typeof err.message === "string") {
    const message = err.message.toLowerCase();
    return message.includes("output length") || message.includes("max tokens") || message.includes("token limit");
  }
  return false;
}
function createAuthenticationError(error) {
  const message = extractErrorMessage(error);
  const providerInfo = extractProviderInfo(error);
  return new _ai_sdk_provider__WEBPACK_IMPORTED_MODULE_0__/* .LoadAPIKeyError */ .Kq({
    message: providerInfo ? `OpenCode authentication error (${providerInfo}): ${message}` : `OpenCode authentication error: ${message}`
  });
}
function createAPICallError(error, metadata) {
  const message = extractErrorMessage(error);
  const statusCode = extractStatusCode(error);
  const isRetryable = metadata?.isRetryable ?? isRetryableError(error);
  return new _ai_sdk_provider__WEBPACK_IMPORTED_MODULE_0__/* .APICallError */ .hL({
    message,
    url: "opencode://session",
    requestBodyValues: {},
    statusCode,
    isRetryable,
    data: {
      errorType: metadata?.errorType ?? extractErrorType(error),
      sessionId: metadata?.sessionId,
      messageId: metadata?.messageId
    }
  });
}
function createTimeoutError(timeoutMs, operation) {
  const operationDesc = operation ? ` during ${operation}` : "";
  return new _ai_sdk_provider__WEBPACK_IMPORTED_MODULE_0__/* .APICallError */ .hL({
    message: `OpenCode request timed out after ${timeoutMs}ms${operationDesc}`,
    url: "opencode://session",
    requestBodyValues: {},
    isRetryable: true
  });
}
function extractErrorMessage(error) {
  if (!error) {
    return "Unknown error";
  }
  if (typeof error === "string") {
    return error;
  }
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "object") {
    const err = error;
    if (typeof err.message === "string") {
      return err.message;
    }
    if (typeof err.error === "string") {
      return err.error;
    }
    if (typeof err.data === "object" && err.data !== null) {
      const data = err.data;
      if (typeof data.message === "string") {
        return data.message;
      }
    }
  }
  return "Unknown error";
}
function extractStatusCode(error) {
  if (!error || typeof error !== "object") {
    return void 0;
  }
  const err = error;
  if (typeof err.statusCode === "number") {
    return err.statusCode;
  }
  if (typeof err.status === "number") {
    return err.status;
  }
  return void 0;
}
function extractErrorType(error) {
  if (!error || typeof error !== "object") {
    return void 0;
  }
  const err = error;
  if (typeof err.name === "string") {
    return err.name;
  }
  if (typeof err.type === "string") {
    return err.type;
  }
  return void 0;
}
function extractProviderInfo(error) {
  if (!error || typeof error !== "object") {
    return void 0;
  }
  const err = error;
  if (typeof err.data === "object" && err.data !== null) {
    const data = err.data;
    if (typeof data.providerID === "string") {
      return data.providerID;
    }
  }
  return void 0;
}
function isRetryableError(error) {
  if (isAbortError(error)) {
    return false;
  }
  if (isTimeoutError(error)) {
    return true;
  }
  if (isAuthenticationError(error)) {
    return false;
  }
  const statusCode = extractStatusCode(error);
  if (statusCode !== void 0) {
    if (statusCode >= 500 && statusCode < 600) {
      return true;
    }
    if (statusCode === 429) {
      return true;
    }
    if (statusCode >= 400 && statusCode < 500) {
      return false;
    }
  }
  return false;
}
function wrapError(error, metadata) {
  if (isAuthenticationError(error)) {
    return createAuthenticationError(error);
  }
  if (isTimeoutError(error)) {
    const timeoutMs = metadata?.timeoutMs ?? extractTimeoutMs(error) ?? DEFAULT_REQUEST_TIMEOUT_MS;
    return createTimeoutError(timeoutMs, "request");
  }
  return createAPICallError(error, metadata);
}
var DEFAULT_REQUEST_TIMEOUT_MS = 5e3;
function extractTimeoutMs(error) {
  if (!error || typeof error !== "object") {
    return void 0;
  }
  const err = error;
  const maybeTimeout = typeof err.timeoutMs === "number" ? err.timeoutMs : typeof err.timeout === "number" ? err.timeout : void 0;
  if (maybeTimeout === void 0 || !Number.isFinite(maybeTimeout)) {
    return void 0;
  }
  return maybeTimeout > 0 ? maybeTimeout : void 0;
}

// src/map-opencode-finish-reason.ts
function mapOpencodeFinishReason(message) {
  if (!message) {
    return { unified: "other", raw: void 0 };
  }
  if (message.error) {
    return mapErrorToFinishReason(message.error);
  }
  if (message.finish) {
    return mapFinishToReason(message.finish);
  }
  return { unified: "stop", raw: void 0 };
}
function mapErrorToFinishReason(error) {
  const { name } = error;
  switch (name) {
    case "MessageAbortedError":
      return { unified: "stop", raw: name };
    case "MessageOutputLengthError":
      return { unified: "length", raw: name };
    case "ContextOverflowError":
      return { unified: "length", raw: name };
    case "StructuredOutputError":
      return { unified: "error", raw: name };
    case "ProviderAuthError":
    case "APIError":
    case "UnknownError":
      return { unified: "error", raw: name };
    default:
      return { unified: "error", raw: name };
  }
}
function mapFinishToReason(finish) {
  const normalizedFinish = finish.toLowerCase();
  if (normalizedFinish === "end_turn" || normalizedFinish === "stop" || normalizedFinish === "end") {
    return { unified: "stop", raw: finish };
  }
  if (normalizedFinish === "max_tokens" || normalizedFinish === "length") {
    return { unified: "length", raw: finish };
  }
  if (normalizedFinish === "tool_use" || normalizedFinish === "tool_calls") {
    return { unified: "tool-calls", raw: finish };
  }
  if (normalizedFinish === "content_filter" || normalizedFinish === "safety") {
    return { unified: "content-filter", raw: finish };
  }
  if (normalizedFinish === "error") {
    return { unified: "error", raw: finish };
  }
  return { unified: "other", raw: finish };
}
function mapErrorToFinishReasonFromUnknown(error) {
  if (isAbortError(error)) {
    return { unified: "stop", raw: "abort" };
  }
  if (isOutputLengthError(error)) {
    return { unified: "length", raw: "output-length" };
  }
  return { unified: "error", raw: "error" };
}
function hasToolCalls(parts) {
  return parts.some((part) => part.type === "tool");
}

// src/logger.ts
var defaultLogger = {
  warn: (message) => {
    console.warn(`[opencode-provider] ${message}`);
  },
  error: (message) => {
    console.error(`[opencode-provider] ${message}`);
  },
  debug: (message) => {
    console.debug(`[opencode-provider] ${message}`);
  }
};
var silentLogger = {
  warn: () => {
  },
  error: () => {
  },
  debug: () => {
  }
};
function getLogger(logger, verbose) {
  if (logger === false) {
    return silentLogger;
  }
  if (logger) {
    if (verbose && !logger.debug) {
      return {
        ...logger,
        debug: (message) => logger.warn(`[DEBUG] ${message}`)
      };
    }
    return logger;
  }
  if (!verbose) {
    return {
      ...defaultLogger,
      debug: () => {
      }
    };
  }
  return defaultLogger;
}
function createContextLogger(baseLogger, context) {
  return {
    warn: (message) => baseLogger.warn(`[${context}] ${message}`),
    error: (message) => baseLogger.error(`[${context}] ${message}`),
    debug: baseLogger.debug ? (message) => baseLogger.debug(`[${context}] ${message}`) : void 0
  };
}
function logUnsupportedFeature(logger, feature, details) {
  const message = details ? `Unsupported feature: ${feature} - ${details}` : `Unsupported feature: ${feature}`;
  logger.warn(message);
}
function logUnsupportedParameter(logger, parameter, value) {
  if (value !== void 0) {
    logger.warn(
      `Parameter '${parameter}' is not supported by OpenCode (value: ${JSON.stringify(value)})`
    );
  } else {
    logger.warn(`Parameter '${parameter}' is not supported by OpenCode`);
  }
}
function logUnsupportedCallOptions(logger, options) {
  const warnings = [];
  const unsupportedParams = [
    { name: "temperature", value: options.temperature },
    { name: "topP", value: options.topP },
    { name: "topK", value: options.topK },
    { name: "frequencyPenalty", value: options.frequencyPenalty },
    { name: "presencePenalty", value: options.presencePenalty },
    { name: "stopSequences", value: options.stopSequences },
    { name: "seed", value: options.seed },
    { name: "maxTokens", value: options.maxTokens }
  ];
  for (const param of unsupportedParams) {
    if (param.value !== void 0) {
      const warning = `Parameter '${param.name}' is not supported by OpenCode`;
      logger.warn(warning);
      warnings.push(warning);
    }
  }
  return warnings;
}
var loggerSchema = zod__WEBPACK_IMPORTED_MODULE_1__.object({
  warn: zod__WEBPACK_IMPORTED_MODULE_1__.any().refine((val) => typeof val === "function", {
    message: "warn must be a function"
  }),
  error: zod__WEBPACK_IMPORTED_MODULE_1__.any().refine((val) => typeof val === "function", {
    message: "error must be a function"
  }),
  debug: zod__WEBPACK_IMPORTED_MODULE_1__.any().refine((val) => val === void 0 || typeof val === "function", {
    message: "debug must be a function"
  }).optional()
});
var permissionRuleSchema = zod__WEBPACK_IMPORTED_MODULE_1__.object({
  permission: zod__WEBPACK_IMPORTED_MODULE_1__.string(),
  pattern: zod__WEBPACK_IMPORTED_MODULE_1__.string(),
  action: zod__WEBPACK_IMPORTED_MODULE_1__["enum"](["allow", "deny", "ask"])
});
var opcodeSettingsSchema = zod__WEBPACK_IMPORTED_MODULE_1__.object({
  sessionId: zod__WEBPACK_IMPORTED_MODULE_1__.string().optional(),
  createNewSession: zod__WEBPACK_IMPORTED_MODULE_1__.boolean().optional(),
  sessionTitle: zod__WEBPACK_IMPORTED_MODULE_1__.string().optional(),
  agent: zod__WEBPACK_IMPORTED_MODULE_1__.string().optional(),
  systemPrompt: zod__WEBPACK_IMPORTED_MODULE_1__.string().optional(),
  tools: zod__WEBPACK_IMPORTED_MODULE_1__.record(zod__WEBPACK_IMPORTED_MODULE_1__.string(), zod__WEBPACK_IMPORTED_MODULE_1__.boolean()).optional(),
  permission: zod__WEBPACK_IMPORTED_MODULE_1__.array(permissionRuleSchema).optional(),
  variant: zod__WEBPACK_IMPORTED_MODULE_1__.string().optional(),
  cwd: zod__WEBPACK_IMPORTED_MODULE_1__.string().optional(),
  directory: zod__WEBPACK_IMPORTED_MODULE_1__.string().optional(),
  outputFormatRetryCount: zod__WEBPACK_IMPORTED_MODULE_1__.number().int().nonnegative().optional(),
  logger: zod__WEBPACK_IMPORTED_MODULE_1__.union([loggerSchema, zod__WEBPACK_IMPORTED_MODULE_1__.literal(false)]).optional(),
  verbose: zod__WEBPACK_IMPORTED_MODULE_1__.boolean().optional()
});
var opcodeProviderSettingsSchema = zod__WEBPACK_IMPORTED_MODULE_1__.object({
  hostname: zod__WEBPACK_IMPORTED_MODULE_1__.string().optional(),
  port: zod__WEBPACK_IMPORTED_MODULE_1__.number().int().positive().optional(),
  baseUrl: zod__WEBPACK_IMPORTED_MODULE_1__.string().url().optional(),
  autoStartServer: zod__WEBPACK_IMPORTED_MODULE_1__.boolean().optional(),
  serverTimeout: zod__WEBPACK_IMPORTED_MODULE_1__.number().int().positive().optional(),
  clientOptions: zod__WEBPACK_IMPORTED_MODULE_1__.record(zod__WEBPACK_IMPORTED_MODULE_1__.string(), zod__WEBPACK_IMPORTED_MODULE_1__.unknown()).optional(),
  client: zod__WEBPACK_IMPORTED_MODULE_1__.object({}).passthrough().optional(),
  clientManager: zod__WEBPACK_IMPORTED_MODULE_1__.object({}).passthrough().optional(),
  defaultSettings: opcodeSettingsSchema.optional()
});
function validateSettings(settings, logger) {
  const warnings = [];
  if (!settings) {
    return { value: {}, warnings };
  }
  const result = opcodeSettingsSchema.safeParse(settings);
  if (!result.success) {
    const issues = result.error.issues.map(
      (issue) => `${issue.path.join(".")}: ${issue.message}`
    );
    warnings.push(`Settings validation warnings: ${issues.join("; ")}`);
  }
  if (settings.sessionId && !isValidSessionId(settings.sessionId)) {
    warnings.push(`Invalid session ID format: ${settings.sessionId}`);
  }
  if (settings.outputFormatRetryCount !== void 0 && settings.outputFormatRetryCount > 10) {
    warnings.push(
      `outputFormatRetryCount ${settings.outputFormatRetryCount} is high; consider a value between 0 and 5`
    );
  }
  if (logger && warnings.length > 0) {
    for (const warning of warnings) {
      logger.warn(warning);
    }
  }
  return { value: settings, warnings };
}
function validateProviderSettings(settings, logger) {
  const warnings = [];
  if (!settings) {
    return { value: {}, warnings };
  }
  const result = opcodeProviderSettingsSchema.safeParse(settings);
  if (!result.success) {
    const issues = result.error.issues.map(
      (issue) => `${issue.path.join(".")}: ${issue.message}`
    );
    warnings.push(
      `Provider settings validation warnings: ${issues.join("; ")}`
    );
  }
  if (settings.port !== void 0 && (settings.port < 1 || settings.port > 65535)) {
    warnings.push(`Port ${settings.port} is outside valid range (1-65535)`);
  }
  if (settings.serverTimeout !== void 0 && settings.serverTimeout < 1e3) {
    warnings.push(
      `Server timeout ${settings.serverTimeout}ms is very short, consider at least 5000ms`
    );
  }
  if (settings.clientManager && settings.client) {
    warnings.push(
      "Both clientManager and client were provided; clientManager will be used and client will be ignored."
    );
  }
  if (settings.client && settings.clientOptions) {
    warnings.push(
      "Both client and clientOptions were provided; clientOptions will be ignored because client takes precedence"
    );
  }
  if (settings.clientOptions) {
    const options = settings.clientOptions;
    if (options.baseUrl !== void 0) {
      warnings.push(
        "clientOptions.baseUrl is ignored; use provider baseUrl or hostname/port instead"
      );
    }
    if (options.directory !== void 0) {
      warnings.push(
        "clientOptions.directory is ignored; use defaultSettings.directory or per-model directory instead"
      );
    }
  }
  if (logger && warnings.length > 0) {
    for (const warning of warnings) {
      logger.warn(warning);
    }
  }
  return { value: settings, warnings };
}
function validateModelId(modelId, logger) {
  if (!modelId || typeof modelId !== "string" || modelId.trim().length === 0) {
    if (logger) {
      logger.error("Model ID is required and must be a non-empty string");
    }
    return null;
  }
  const trimmedId = modelId.trim();
  if (trimmedId.includes("/")) {
    const parts = trimmedId.split("/");
    if (parts.length === 2 && parts[0] && parts[1]) {
      return {
        providerID: parts[0],
        modelID: parts[1]
      };
    }
    if (logger) {
      logger.warn(
        `Model ID "${modelId}" contains multiple slashes, using first segment as provider`
      );
    }
    const firstPart = parts[0];
    const restParts = parts.slice(1).join("/");
    return {
      providerID: firstPart || "default",
      modelID: restParts || trimmedId
    };
  }
  return {
    providerID: "",
    modelID: trimmedId
  };
}
function isValidSessionId(sessionId) {
  if (!sessionId || typeof sessionId !== "string") {
    return false;
  }
  const validPattern = /^[a-zA-Z0-9_-]+$/;
  return validPattern.test(sessionId) && sessionId.length > 0 && sessionId.length <= 128;
}
function mergeSettings(defaults, overrides) {
  if (!defaults && !overrides) {
    return {};
  }
  if (!defaults) {
    return { ...overrides };
  }
  if (!overrides) {
    return { ...defaults };
  }
  return {
    ...defaults,
    ...overrides,
    // Merge tools object if both exist
    tools: defaults.tools || overrides.tools ? { ...defaults.tools, ...overrides.tools } : void 0,
    permission: overrides.permission ?? defaults.permission
  };
}

// src/opencode-language-model.ts
function convertUsage(usage) {
  const inputTokensTotal = usage.inputTokens + usage.cachedInputTokens + usage.cachedWriteTokens;
  return {
    inputTokens: {
      total: inputTokensTotal,
      noCache: usage.inputTokens,
      cacheRead: usage.cachedInputTokens,
      cacheWrite: usage.cachedWriteTokens
    },
    outputTokens: {
      total: usage.outputTokens,
      text: void 0,
      reasoning: usage.reasoningTokens
    },
    raw: {
      input_tokens: usage.inputTokens,
      output_tokens: usage.outputTokens,
      reasoning_tokens: usage.reasoningTokens,
      cache_read_input_tokens: usage.cachedInputTokens,
      cache_write_input_tokens: usage.cachedWriteTokens,
      total_cost: usage.totalCost
    }
  };
}
function getMessageIDFromProviderOptions(options) {
  const messageID = options.providerOptions?.opencode?.messageID;
  if (messageID == null) {
    return void 0;
  }
  if (typeof messageID !== "string") {
    throw new _ai_sdk_provider__WEBPACK_IMPORTED_MODULE_0__/* .InvalidArgumentError */ .Di({
      argument: "providerOptions.opencode.messageID",
      message: "providerOptions.opencode.messageID must be a string"
    });
  }
  if (!messageID.startsWith("msg_")) {
    throw new _ai_sdk_provider__WEBPACK_IMPORTED_MODULE_0__/* .InvalidArgumentError */ .Di({
      argument: "providerOptions.opencode.messageID",
      message: "providerOptions.opencode.messageID must start with 'msg_'"
    });
  }
  return messageID;
}
function extractToolApprovalResponses(prompt) {
  const responses = [];
  for (const message of prompt) {
    if (message.role !== "tool") {
      continue;
    }
    for (const part of message.content) {
      if (part.type !== "tool-approval-response") {
        continue;
      }
      const response = part;
      responses.push({
        approvalId: response.approvalId,
        approved: response.approved,
        reason: response.reason
      });
    }
  }
  return responses;
}
var OpencodeLanguageModel = class {
  specificationVersion = "v3";
  modelId;
  provider = "opencode";
  /**
   * OpenCode doesn't support URL-based file inputs.
   * All files must be base64 encoded.
   */
  supportedUrls = {};
  settings;
  logger;
  clientManager;
  sessionId;
  sessionInitPromise = null;
  repliedApprovalIdsBySession = /* @__PURE__ */ new Map();
  parsedModelId;
  constructor(options) {
    this.modelId = options.modelId;
    this.settings = options.settings;
    this.clientManager = options.clientManager;
    this.logger = getLogger(options.settings.logger, options.settings.verbose);
    const parsed = validateModelId(this.modelId, this.logger);
    if (!parsed) {
      throw new Error(`Invalid model ID: ${this.modelId}`);
    }
    this.parsedModelId = parsed;
    validateSettings(this.settings, this.logger);
    if (this.settings.sessionId) {
      this.sessionId = this.settings.sessionId;
    }
  }
  /**
   * Non-streaming generation.
   */
  async doGenerate(options) {
    const warnings = [];
    const unsupportedWarnings = logUnsupportedCallOptions(this.logger, {
      temperature: options.temperature,
      topP: options.topP,
      topK: options.topK,
      frequencyPenalty: options.frequencyPenalty,
      presencePenalty: options.presencePenalty,
      stopSequences: options.stopSequences,
      seed: options.seed,
      maxTokens: options.maxOutputTokens
    });
    for (const warning of unsupportedWarnings) {
      warnings.push({ type: "other", message: warning });
    }
    if (options.tools && options.tools.length > 0) {
      const toolWarning = "Custom tool definitions are ignored. OpenCode executes tools server-side.";
      this.logger.warn(toolWarning);
      warnings.push({ type: "other", message: toolWarning });
    }
    const approvalResponses = extractToolApprovalResponses(options.prompt);
    const {
      parts,
      systemPrompt,
      warnings: conversionWarnings
    } = convertToOpencodeMessages(options.prompt, {
      logger: this.logger,
      // Structured output is enforced via requestBody.format (json_schema).
      // Avoid duplicating schema instructions as user-visible prompt text.
      mode: { type: "regular" },
      includeToolApprovalResponsesAsContext: false
    });
    for (const warning of conversionWarnings) {
      warnings.push({ type: "other", message: warning });
    }
    const messageID = getMessageIDFromProviderOptions(options);
    try {
      if (options.abortSignal?.aborted) {
        const error = new Error("Request aborted");
        error.name = "AbortError";
        throw error;
      }
      const sessionId = await this.getOrCreateSession();
      const client = await this.clientManager.getClient();
      if (approvalResponses.length > 0) {
        const approvalWarnings = await this.replyToPendingApprovals(
          client,
          sessionId,
          approvalResponses
        );
        for (const warning of approvalWarnings) {
          warnings.push({ type: "other", message: warning });
        }
      }
      const requestBody = this.buildPromptRequestBody(
        sessionId,
        parts,
        systemPrompt,
        options,
        messageID
      );
      const result = await client.session.prompt(requestBody);
      const data = result.data;
      if (!data) {
        throw new Error("No response data from OpenCode");
      }
      const responseData = data;
      this.logger.debug?.(
        `[doGenerate] raw parts from OpenCode: ${JSON.stringify(responseData.parts?.map((p) => ({ type: p.type, ...p.type === "text" ? { text: p.text?.slice(0, 200) } : {}, ...p.type === "tool" ? { tool: p.tool, callID: p.callID, status: p.state?.status, input: p.state?.input } : {} })))}`
      );
      const content = this.extractContentFromParts(responseData.parts ?? []);
      this.logger.debug?.(
        `[doGenerate] extracted content: ${JSON.stringify(content.map((c) => ({ type: c.type, ...c.type === "text" ? { text: c.text?.slice(0, 200) } : {}, ...c.type === "tool-call" ? { toolName: c.toolName } : {} })))}`
      );
      const usage = this.extractUsageFromParts(responseData.parts ?? []);
      const finishReason = mapOpencodeFinishReason(responseData.info);
      return {
        content,
        finishReason,
        usage: convertUsage(usage),
        providerMetadata: {
          opencode: {
            sessionId,
            messageId: responseData.info?.id,
            cost: usage.totalCost
          }
        },
        request: { body: requestBody },
        warnings
      };
    } catch (error) {
      if (isAbortError(error)) {
        throw error;
      }
      throw wrapError(error, {
        sessionId: this.sessionId
      });
    }
  }
  /**
   * Streaming generation.
   */
  async doStream(options) {
    const warnings = [];
    const unsupportedWarnings = logUnsupportedCallOptions(this.logger, {
      temperature: options.temperature,
      topP: options.topP,
      topK: options.topK,
      frequencyPenalty: options.frequencyPenalty,
      presencePenalty: options.presencePenalty,
      stopSequences: options.stopSequences,
      seed: options.seed,
      maxTokens: options.maxOutputTokens
    });
    warnings.push(...unsupportedWarnings);
    if (options.tools && options.tools.length > 0) {
      const toolWarning = "Custom tool definitions are ignored. OpenCode executes tools server-side.";
      this.logger.warn(toolWarning);
      warnings.push(toolWarning);
    }
    const approvalResponses = extractToolApprovalResponses(options.prompt);
    const {
      parts,
      systemPrompt,
      warnings: conversionWarnings
    } = convertToOpencodeMessages(options.prompt, {
      logger: this.logger,
      // Structured output is enforced via requestBody.format (json_schema).
      // Avoid duplicating schema instructions as user-visible prompt text.
      mode: { type: "regular" },
      includeToolApprovalResponsesAsContext: false
    });
    warnings.push(...conversionWarnings);
    const messageID = getMessageIDFromProviderOptions(options);
    const sessionId = await this.getOrCreateSession();
    const client = await this.clientManager.getClient();
    const requestBody = this.buildPromptRequestBody(
      sessionId,
      parts,
      systemPrompt,
      options,
      messageID
    );
    const directory = this.getRequestDirectory();
    const logger = this.logger;
    const stream = new ReadableStream({
      start: async (controller) => {
        const streamWarnings = [...warnings];
        let streamStartEmitted = false;
        try {
          const eventsResult = await client.event.subscribe(
            directory ? { directory } : void 0
          );
          const eventStream = eventsResult.stream;
          if (!eventStream) {
            throw new Error("Failed to subscribe to events");
          }
          if (approvalResponses.length > 0) {
            const approvalWarnings = await this.replyToPendingApprovals(
              client,
              sessionId,
              approvalResponses
            );
            streamWarnings.push(...approvalWarnings);
          }
          controller.enqueue(createStreamStartPart(streamWarnings));
          streamStartEmitted = true;
          let resolvePromptFailed;
          const promptFailed = new Promise((resolve) => {
            resolvePromptFailed = resolve;
          });
          let resolveAbortRequested;
          const abortRequested = new Promise((resolve) => {
            resolveAbortRequested = resolve;
          });
          let removeAbortListener = () => {
          };
          const abortSignal = options.abortSignal;
          if (abortSignal) {
            const onAbort = () => resolveAbortRequested?.();
            if (abortSignal.aborted) {
              onAbort();
            } else {
              abortSignal.addEventListener("abort", onAbort, { once: true });
              removeAbortListener = () => abortSignal.removeEventListener("abort", onAbort);
            }
          }
          client.session.prompt(requestBody).catch((error) => {
            logger.error(`Prompt error: ${extractErrorMessage(error)}`);
            controller.enqueue({ type: "error", error });
            resolvePromptFailed?.();
          });
          const state = createStreamState();
          let lastMessageInfo;
          const iterator = eventStream[Symbol.asyncIterator]();
          let iteratorClosed = false;
          const closeIterator = async () => {
            if (iteratorClosed) {
              return;
            }
            iteratorClosed = true;
            if (typeof iterator.return === "function") {
              try {
                await iterator.return(void 0);
              } catch (closeError) {
                logger.debug?.(
                  `Failed to close event stream iterator: ${extractErrorMessage(closeError)}`
                );
              }
            }
          };
          try {
            while (true) {
              const nextEvent = iterator.next();
              const result = await Promise.race([
                nextEvent.then((value) => ({ type: "event", value })),
                promptFailed.then(() => ({ type: "prompt-failed" })),
                abortRequested.then(() => ({ type: "aborted" }))
              ]);
              if (result.type === "prompt-failed") {
                await closeIterator();
                break;
              }
              if (result.type === "aborted") {
                try {
                  await client.session.abort({
                    sessionID: sessionId,
                    ...directory ? { directory } : {}
                  });
                } catch {
                }
                await closeIterator();
                break;
              }
              const { done, value: event } = result.value;
              if (done) {
                iteratorClosed = true;
                break;
              }
              if (!isEventForSession(event, sessionId)) {
                continue;
              }
              const streamParts = convertEventToStreamParts(
                event,
                state,
                logger
              );
              for (const part of streamParts) {
                controller.enqueue(part);
              }
              if (event.type === "message.updated") {
                const messageEvent = event;
                if (messageEvent.properties.info.role === "assistant") {
                  lastMessageInfo = messageEvent.properties.info;
                }
              }
              if (isSessionComplete(event, sessionId)) {
                const finishReason = mapOpencodeFinishReason(lastMessageInfo);
                const finishParts = createFinishParts(
                  state,
                  finishReason,
                  sessionId,
                  lastMessageInfo?.id
                );
                for (const part of finishParts) {
                  controller.enqueue(part);
                }
                await closeIterator();
                break;
              }
            }
          } finally {
            removeAbortListener();
            await closeIterator();
          }
        } catch (error) {
          if (!streamStartEmitted) {
            controller.enqueue(createStreamStartPart(streamWarnings));
          }
          if (!isAbortError(error)) {
            logger.error(`Stream error: ${extractErrorMessage(error)}`);
            controller.enqueue({ type: "error", error: wrapError(error) });
          }
        } finally {
          controller.close();
        }
      }
    });
    return {
      stream,
      request: { body: requestBody }
    };
  }
  getRequestDirectory() {
    return this.settings.directory ?? this.settings.cwd;
  }
  getResponseFormat(options) {
    if (options.responseFormat?.type !== "json") {
      return void 0;
    }
    return {
      type: "json_schema",
      schema: options.responseFormat.schema ?? {
        type: "object",
        additionalProperties: true
      },
      ...this.settings.outputFormatRetryCount !== void 0 ? { retryCount: this.settings.outputFormatRetryCount } : {}
    };
  }
  buildPromptRequestBody(sessionId, parts, systemPrompt, options, messageID) {
    const format = this.getResponseFormat(options);
    const directory = this.getRequestDirectory();
    return {
      sessionID: sessionId,
      ...directory ? { directory } : {},
      ...this.parsedModelId.providerID ? {
        model: {
          providerID: this.parsedModelId.providerID,
          modelID: this.parsedModelId.modelID
        }
      } : {},
      ...this.settings.agent ? { agent: this.settings.agent } : {},
      ...this.settings.tools ? { tools: this.settings.tools } : {},
      ...format ? { format } : {},
      ...systemPrompt ?? this.settings.systemPrompt ? { system: systemPrompt ?? this.settings.systemPrompt } : {},
      ...this.settings.variant ? { variant: this.settings.variant } : {},
      ...messageID ? { messageID } : {},
      parts
    };
  }
  async replyToPendingApprovals(client, sessionId, responses) {
    const permissionApi = client.permission;
    if (typeof permissionApi?.reply !== "function") {
      return [
        "OpenCode permission.reply is unavailable; tool approval responses were ignored."
      ];
    }
    const warnings = [];
    const directory = this.getRequestDirectory();
    const repliedApprovalIds = this.getRepliedApprovalIdsForSession(sessionId);
    const pendingResponses = this.getPendingApprovalResponses(
      responses,
      repliedApprovalIds
    );
    for (const response of pendingResponses) {
      try {
        await permissionApi.reply({
          requestID: response.approvalId,
          reply: response.approved ? "once" : "reject",
          ...response.reason ? { message: response.reason } : {},
          ...directory ? { directory } : {}
        });
        repliedApprovalIds.add(response.approvalId);
      } catch (error) {
        const warning = `Failed to apply tool approval response for ${response.approvalId}: ${extractErrorMessage(error)}`;
        this.logger.warn(warning);
        warnings.push(warning);
      }
    }
    return warnings;
  }
  getPendingApprovalResponses(responses, repliedApprovalIds) {
    const seenInRequest = /* @__PURE__ */ new Set();
    const pending = [];
    for (const response of responses) {
      if (seenInRequest.has(response.approvalId)) {
        continue;
      }
      seenInRequest.add(response.approvalId);
      if (repliedApprovalIds.has(response.approvalId)) {
        continue;
      }
      pending.push(response);
    }
    return pending;
  }
  getRepliedApprovalIdsForSession(sessionId) {
    const existing = this.repliedApprovalIdsBySession.get(sessionId);
    if (existing) {
      return existing;
    }
    const created = /* @__PURE__ */ new Set();
    this.repliedApprovalIdsBySession.set(sessionId, created);
    return created;
  }
  /**
   * Get or create a session for this model instance.
   */
  async getOrCreateSession() {
    if (this.sessionId && !this.settings.createNewSession) {
      return this.sessionId;
    }
    if (!this.settings.createNewSession && this.sessionInitPromise) {
      return this.sessionInitPromise;
    }
    const createSession = async () => {
      const client = await this.clientManager.getClient();
      const directory = this.getRequestDirectory();
      const result = await client.session.create({
        ...directory ? { directory } : {},
        title: this.settings.sessionTitle ?? "AI SDK Session",
        ...this.settings.permission ? { permission: this.settings.permission } : {}
      });
      const data = result.data;
      if (!data?.id) {
        throw new Error(
          `Failed to create session: ${JSON.stringify(result.error ?? result.data)}`
        );
      }
      this.sessionId = data.id;
      this.logger.debug?.(`Created session: ${this.sessionId}`);
      return this.sessionId;
    };
    if (this.settings.createNewSession) {
      return createSession();
    }
    const pending = createSession();
    this.sessionInitPromise = pending;
    try {
      return await pending;
    } finally {
      if (this.sessionInitPromise === pending) {
        this.sessionInitPromise = null;
      }
    }
  }
  /**
   * Extract content in AI SDK format from OpenCode parts.
   */
  extractContentFromParts(parts) {
    const content = [];
    for (const part of parts) {
      if (part.type === "text" && typeof part.text === "string") {
        if (!part.synthetic && !part.ignored) {
          content.push({
            type: "text",
            text: part.text
          });
        }
        continue;
      }
      if (part.type === "reasoning" && typeof part.text === "string") {
        content.push({
          type: "reasoning",
          text: part.text
        });
        continue;
      }
      if (part.type === "tool") {
        const toolParts = this.extractToolParts(part);
        content.push(...toolParts);
        continue;
      }
      if (part.type === "file") {
        content.push(...this.convertFilePartToContent(part));
      }
    }
    return content;
  }
  extractToolParts(part) {
    const toolParts = [];
    const toolPart = part;
    if (toolPart.state.status === "completed") {
      if (toolPart.tool === STRUCTURED_OUTPUT_TOOL) {
        const serialized = safeStringifyToolInput(toolPart.state.input, (message) => {
          this.logger.warn(
            `Failed to serialize StructuredOutput input for ${toolPart.callID}: ${message}`
          );
        });
        this.logger.debug?.(
          `[StructuredOutput doGenerate] callID=${toolPart.callID} status=${toolPart.state.status} raw input=${JSON.stringify(toolPart.state.input)} serialized=${serialized}`
        );
        toolParts.push({ type: "text", text: serialized });
        return toolParts;
      }
      toolParts.push({
        type: "tool-call",
        toolCallId: toolPart.callID,
        toolName: toolPart.tool,
        input: safeStringifyToolInput(toolPart.state.input, (message) => {
          this.logger.warn(
            `Failed to serialize tool input for ${toolPart.callID}: ${message}`
          );
        }),
        providerExecuted: true,
        dynamic: true
      });
      toolParts.push({
        type: "tool-result",
        toolCallId: toolPart.callID,
        toolName: toolPart.tool,
        result: toolPart.state.output ?? "",
        dynamic: true
      });
      const attachments = toolPart.state.attachments ?? [];
      for (const attachment of attachments) {
        if (attachment.type === "file") {
          toolParts.push(...this.convertFilePartToContent(attachment));
        }
      }
    } else if (toolPart.state.status === "error") {
      if (toolPart.tool === STRUCTURED_OUTPUT_TOOL) {
        return toolParts;
      }
      toolParts.push({
        type: "tool-call",
        toolCallId: toolPart.callID,
        toolName: toolPart.tool,
        input: safeStringifyToolInput(toolPart.state.input, (message) => {
          this.logger.warn(
            `Failed to serialize tool input for ${toolPart.callID}: ${message}`
          );
        }),
        providerExecuted: true,
        dynamic: true
      });
      toolParts.push({
        type: "tool-result",
        toolCallId: toolPart.callID,
        toolName: toolPart.tool,
        result: toolPart.state.error ?? "Unknown error",
        isError: true,
        dynamic: true
      });
    }
    return toolParts;
  }
  convertFilePartToContent(part) {
    const filePart = part;
    if (!filePart.url || !filePart.mime) {
      this.logger.debug?.(
        `Skipping file part with missing metadata: url=${String(filePart.url)} mime=${String(filePart.mime)}`
      );
      return [];
    }
    const { plan, error } = planFilePartConversion(filePart);
    if (!plan) {
      if (error === "invalid-data-url") {
        this.logger.debug?.(
          `Skipping file part with invalid data URL: ${filePart.url.slice(0, 80)}`
        );
      }
      return [];
    }
    const content = [];
    if (plan.primary.type === "file") {
      content.push({
        type: "file",
        mediaType: plan.primary.mediaType,
        data: plan.primary.data,
        ...plan.sourceMetadata ? {
          providerMetadata: {
            opencode: {
              source: plan.sourceMetadata
            }
          }
        } : {}
      });
    } else if (plan.primary.type === "source-url") {
      content.push({
        type: "source",
        sourceType: "url",
        id: plan.primary.id,
        url: plan.primary.url,
        ...plan.primary.title ? { title: plan.primary.title } : {}
      });
    } else {
      content.push({
        type: "source",
        sourceType: "document",
        id: plan.primary.id,
        mediaType: plan.primary.mediaType,
        title: plan.primary.title,
        ...plan.primary.filename ? { filename: plan.primary.filename } : {},
        ...plan.sourceMetadata ? {
          providerMetadata: {
            opencode: {
              source: plan.sourceMetadata
            }
          }
        } : {}
      });
    }
    if (plan.secondaryDocumentSource) {
      content.push({
        type: "source",
        sourceType: "document",
        id: plan.secondaryDocumentSource.id,
        mediaType: plan.secondaryDocumentSource.mediaType,
        title: plan.secondaryDocumentSource.title,
        ...plan.secondaryDocumentSource.filename ? { filename: plan.secondaryDocumentSource.filename } : {},
        ...plan.sourceMetadata ? {
          providerMetadata: {
            opencode: {
              source: plan.sourceMetadata
            }
          }
        } : {}
      });
    }
    return content;
  }
  /**
   * Extract usage information from step-finish parts.
   */
  extractUsageFromParts(parts) {
    const usage = {
      inputTokens: 0,
      outputTokens: 0,
      reasoningTokens: 0,
      cachedInputTokens: 0,
      cachedWriteTokens: 0,
      totalCost: 0
    };
    for (const part of parts) {
      if (part.type === "step-finish") {
        const stepPart = part;
        usage.inputTokens += stepPart.tokens.input;
        usage.outputTokens += stepPart.tokens.output;
        usage.reasoningTokens += stepPart.tokens.reasoning;
        usage.cachedInputTokens += stepPart.tokens.cache.read;
        usage.cachedWriteTokens += stepPart.tokens.cache.write;
        usage.totalCost += stepPart.cost;
      }
    }
    return usage;
  }
  /**
   * Get the current session ID.
   */
  getSessionId() {
    return this.sessionId;
  }
};

// src/opencode-client-manager.ts
var OpencodeClientManager = class _OpencodeClientManager {
  static instance = null;
  client = null;
  server = null;
  options;
  logger;
  initPromise = null;
  isDisposed = false;
  cleanupHandlersRegistered = false;
  cleanupHandlers = {};
  constructor(options) {
    const filteredOptions = Object.fromEntries(
      Object.entries(options).filter(([_, v]) => v !== void 0)
    );
    this.options = {
      hostname: "127.0.0.1",
      port: 4096,
      autoStartServer: true,
      serverTimeout: 1e4,
      ...filteredOptions
    };
    this.logger = getLogger(options.logger);
    this.registerCleanupHandlers();
  }
  /**
   * Get the singleton instance of the client manager.
   */
  static getInstance(options) {
    if (!_OpencodeClientManager.instance) {
      _OpencodeClientManager.instance = new _OpencodeClientManager(options ?? {});
    } else if (options) {
      _OpencodeClientManager.instance.updateOptions(options);
    }
    return _OpencodeClientManager.instance;
  }
  /**
   * Create a standalone (non-singleton) client manager instance.
   * Use this when you need isolated client managers, e.g. for concurrent
   * sessions pointing at different servers.
   */
  static createInstance(options) {
    return new _OpencodeClientManager(options);
  }
  /**
   * Reset the singleton instance.
   * Used primarily for testing.
   */
  static resetInstance() {
    if (_OpencodeClientManager.instance) {
      _OpencodeClientManager.instance.dispose().catch(() => {
      });
      _OpencodeClientManager.instance = null;
    }
  }
  /**
   * Update options for the client manager.
   */
  updateOptions(options) {
    if (!this.client && !this.initPromise) {
      const filteredOptions2 = Object.fromEntries(
        Object.entries(options).filter(([_, v]) => v !== void 0)
      );
      this.options = {
        ...this.options,
        ...filteredOptions2
      };
      this.logger = getLogger(options.logger ?? this.options.logger);
      return;
    }
    const filteredOptions = Object.fromEntries(
      Object.entries(options).filter(([_, v]) => v !== void 0)
    );
    if (Object.keys(filteredOptions).length === 0) {
      return;
    }
    if (filteredOptions.client && this.client && filteredOptions.client !== this.client) {
      this.logger.warn(
        "Client manager already initialized; provided preconfigured client was ignored because a client is already active. New options from createOpencode() are ignored after initialization. Use separate client manager instances or call dispose() first."
      );
      return;
    }
    this.logger.warn(
      "Client manager already initialized; new options from createOpencode() were ignored. Use separate client manager instances or call dispose() first."
    );
  }
  /**
   * Get or create the OpenCode client.
   * Will start the server if autoStartServer is true and server isn't running.
   */
  async getClient() {
    if (this.isDisposed) {
      throw new Error("Client manager has been disposed");
    }
    if (this.client) {
      return this.client;
    }
    if (this.initPromise) {
      return this.initPromise;
    }
    this.initPromise = this.initializeClient();
    try {
      this.client = await this.initPromise;
      return this.client;
    } finally {
      this.initPromise = null;
    }
  }
  /**
   * Initialize the client and optionally the server.
   */
  async initializeClient() {
    if (this.options.client) {
      if (this.options.clientOptions) {
        this.logger.warn(
          "Both client and clientOptions were provided; clientOptions will be ignored because client takes precedence."
        );
      }
      this.logger.debug?.("Using preconfigured OpenCode client");
      return this.options.client;
    }
    const { createOpencodeClient, createOpencodeServer } = await __webpack_require__.e(/* import() */ 907).then(__webpack_require__.bind(__webpack_require__, 50907));
    if (this.options.baseUrl) {
      this.logger.debug?.(
        `Connecting to external OpenCode server at ${this.options.baseUrl}`
      );
      return createOpencodeClient(
        this.createManagedClientOptions(this.options.baseUrl)
      );
    }
    const serverUrl = `http://${this.options.hostname}:${this.options.port}`;
    if (await this.isServerRunning(serverUrl)) {
      this.logger.debug?.(
        `Connected to existing OpenCode server at ${serverUrl}`
      );
      return createOpencodeClient(this.createManagedClientOptions(serverUrl));
    }
    if (this.options.autoStartServer) {
      this.logger.debug?.(`Starting OpenCode server at ${serverUrl}`);
      try {
        this.server = await createOpencodeServer({
          hostname: this.options.hostname,
          port: this.options.port,
          timeout: this.options.serverTimeout
        });
        this.logger.debug?.(`OpenCode server started at ${this.server.url}`);
        return createOpencodeClient(
          this.createManagedClientOptions(this.server.url)
        );
      } catch (error) {
        const message = extractErrorMessage(error);
        if (message.includes("Timeout")) {
          throw createTimeoutError(
            this.options.serverTimeout ?? 1e4,
            "server startup"
          );
        }
        throw new Error(`Failed to start OpenCode server: ${message}`);
      }
    }
    throw new Error(
      `No OpenCode server running at ${serverUrl} and autoStartServer is disabled`
    );
  }
  /**
   * Check if an OpenCode server is running at the given URL.
   */
  async isServerRunning(baseUrl) {
    try {
      const response = await fetch(`${baseUrl}/health`, {
        method: "GET",
        signal: AbortSignal.timeout(2e3)
      });
      return response.ok;
    } catch {
      try {
        const response = await fetch(`${baseUrl}/config`, {
          method: "GET",
          signal: AbortSignal.timeout(2e3)
        });
        return response.ok;
      } catch {
        return false;
      }
    }
  }
  /**
   * Build client options with manager-owned baseUrl and directory.
   */
  createManagedClientOptions(baseUrl) {
    const options = this.options.clientOptions ?? {};
    const optionsRecord = options;
    if (optionsRecord.baseUrl !== void 0) {
      this.logger.warn(
        "Ignoring clientOptions.baseUrl because provider baseUrl/hostname/port controls server routing."
      );
    }
    if (optionsRecord.directory !== void 0) {
      this.logger.warn(
        "Ignoring clientOptions.directory because directory is managed by model settings/defaultSettings."
      );
    }
    return {
      ...options,
      baseUrl,
      directory: this.options.cwd
    };
  }
  /**
   * Get the server URL.
   */
  getServerUrl() {
    if (this.server) {
      return this.server.url;
    }
    if (this.options.baseUrl) {
      return this.options.baseUrl;
    }
    return `http://${this.options.hostname}:${this.options.port}`;
  }
  /**
   * Check if the server was started by this manager.
   */
  isServerManaged() {
    return this.server !== null;
  }
  /**
   * Dispose of the client manager, stopping the server if managed.
   */
  async dispose() {
    if (this.isDisposed) {
      return;
    }
    this.isDisposed = true;
    this.unregisterCleanupHandlers();
    if (this.server) {
      this.logger.debug?.("Stopping managed OpenCode server");
      try {
        this.server.close();
      } catch (error) {
        this.logger.warn(
          `Error stopping server: ${extractErrorMessage(error)}`
        );
      }
      this.server = null;
    }
    this.client = null;
    this.initPromise = null;
  }
  /**
   * Register cleanup handlers for process exit.
   */
  registerCleanupHandlers() {
    if (this.cleanupHandlersRegistered) {
      return;
    }
    const cleanup = () => {
      if (this.server) {
        try {
          this.server.close();
        } catch {
        }
      }
    };
    const handleSigint = () => {
      cleanup();
      process.exit(0);
    };
    const handleSigterm = () => {
      cleanup();
      process.exit(0);
    };
    const handleUncaughtException = (error) => {
      this.logger.error(`Uncaught exception: ${error.message}`);
      cleanup();
      process.exit(1);
    };
    this.cleanupHandlers = {
      exit: cleanup,
      sigint: handleSigint,
      sigterm: handleSigterm,
      uncaughtException: handleUncaughtException
    };
    process.once("exit", cleanup);
    process.once("SIGINT", handleSigint);
    process.once("SIGTERM", handleSigterm);
    process.once("uncaughtException", handleUncaughtException);
    this.cleanupHandlersRegistered = true;
  }
  unregisterCleanupHandlers() {
    if (!this.cleanupHandlersRegistered) {
      return;
    }
    const { exit, sigint, sigterm, uncaughtException } = this.cleanupHandlers;
    if (exit) {
      process.removeListener("exit", exit);
    }
    if (sigint) {
      process.removeListener("SIGINT", sigint);
    }
    if (sigterm) {
      process.removeListener("SIGTERM", sigterm);
    }
    if (uncaughtException) {
      process.removeListener("uncaughtException", uncaughtException);
    }
    this.cleanupHandlers = {};
    this.cleanupHandlersRegistered = false;
  }
};
function createClientManager(options) {
  return OpencodeClientManager.getInstance(options);
}
function createClientManagerFromSettings(settings, logger) {
  return OpencodeClientManager.getInstance({
    hostname: settings.hostname,
    port: settings.port,
    baseUrl: settings.baseUrl,
    autoStartServer: settings.autoStartServer,
    serverTimeout: settings.serverTimeout,
    clientOptions: settings.clientOptions,
    client: settings.client,
    // Prefer explicit v2 directory setting; fall back to legacy cwd.
    cwd: settings.defaultSettings?.directory ?? settings.defaultSettings?.cwd,
    logger
  });
}

// src/opencode-provider.ts
function createOpencode(options) {
  const logger = getLogger(options?.defaultSettings?.logger);
  validateProviderSettings(options, logger);
  const clientManager = options?.clientManager ?? createClientManagerFromSettings(options ?? {}, logger);
  const createModel = (modelId, settings) => {
    const mergedSettings = mergeSettings(options?.defaultSettings, settings);
    return new OpencodeLanguageModel({
      modelId,
      settings: mergedSettings,
      clientManager
    });
  };
  const provider = Object.assign(
    // Main callable function
    (modelId, settings) => {
      return createModel(modelId, settings);
    },
    {
      // languageModel method
      languageModel: (modelId, settings) => {
        return createModel(modelId, settings);
      },
      // chat alias for languageModel
      chat: (modelId, settings) => {
        return createModel(modelId, settings);
      },
      // Provider info
      provider: "opencode",
      specificationVersion: "v3",
      // Required ProviderV3 methods that are not supported
      embeddingModel: (modelId) => {
        throw new _ai_sdk_provider__WEBPACK_IMPORTED_MODULE_0__/* .NoSuchModelError */ .eM({ modelId, modelType: "embeddingModel" });
      },
      imageModel: (modelId) => {
        throw new _ai_sdk_provider__WEBPACK_IMPORTED_MODULE_0__/* .NoSuchModelError */ .eM({ modelId, modelType: "imageModel" });
      },
      // Get the client manager (for advanced usage)
      getClientManager: () => {
        return clientManager;
      },
      // Dispose resources
      dispose: async () => {
        await clientManager.dispose();
      }
    }
  );
  return provider;
}
var opencode = createOpencode();
var OpencodeModels = {
  // Anthropic models (Claude 4.5 series - latest)
  "claude-sonnet-4-5": "anthropic/claude-sonnet-4-5-20250929",
  "claude-haiku-4-5": "anthropic/claude-haiku-4-5-20251001",
  "claude-opus-4-5": "anthropic/claude-opus-4-5-20251101",
  // OpenAI models
  "gpt-4o": "openai/gpt-4o",
  "gpt-4o-mini": "openai/gpt-4o-mini",
  // Google Gemini models
  "gemini-3-pro": "google/gemini-3-pro-preview",
  "gemini-2.5-flash": "google/gemini-2.5-flash",
  "gemini-2.5-pro": "google/gemini-2.5-pro",
  "gemini-2.0-flash": "google/gemini-2.0-flash"
};


//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map

/***/ })

};
