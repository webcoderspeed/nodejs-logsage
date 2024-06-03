import { EXECUTION_LOG_CALLER, EXECUTION_LOG_START_TIME } from '../constants';
import { TraceIdHandler } from './trace-handler.util';

function formatLogMessage(...optionalParams: any[]) {
  const TRACE_ID = TraceIdHandler.getTraceIdField();

  let traceId = null;
  let restData = [];
  let executionTime = null;
  let executionCallerName = null;

  for (const item of optionalParams.filter((o) => o)) {
    if (item && typeof item === 'object') {
      if (TRACE_ID in item) {
        traceId = item[TRACE_ID];
        delete item[TRACE_ID];
      }
      if (EXECUTION_LOG_START_TIME in item) {
        const currentTime = new Date().getTime();
        executionTime =
          currentTime -
          (typeof item[EXECUTION_LOG_START_TIME] === 'number'
            ? item[EXECUTION_LOG_START_TIME]
            : 0);
        delete item[EXECUTION_LOG_START_TIME];
      }
      if (EXECUTION_LOG_CALLER in item) {
        executionCallerName = item[EXECUTION_LOG_CALLER];
        delete item[EXECUTION_LOG_CALLER];
      }
    }

    if (Object?.keys(item)?.length) {
      restData.push(item);
    }
  }

  const formattedData = restData
    .filter((r) => r)
    .map((d) => (typeof d === 'object' ? JSON.stringify(d) : d))
    .join(' ');

  let logMessage = formattedData;

  if (executionTime !== null) {
    logMessage = `[${executionCallerName ? executionCallerName + ': ' : ''}${executionTime} ms]:${logMessage}`;
  }

  if (traceId) {
    logMessage = `[${traceId}]:${logMessage}`;
  }

  return logMessage;
}

export default formatLogMessage;
