import { EXECUTION_START_TIME } from '../constants';
import { TraceIdHandler } from './trace-handler.util';

function formatLogMessage(...optionalParams: any[]) {
  const TRACE_ID = TraceIdHandler.getTraceIdField();

  let traceId = null;
  let restData = [];
  let executionTime = null;

  for (const item of optionalParams) {
    if (item && typeof item === 'object') {
      if (TRACE_ID in item) {
        traceId = item[TRACE_ID];
      }
      if (EXECUTION_START_TIME in item) {
        const currentTime = new Date().getTime();
        executionTime = currentTime - item[EXECUTION_START_TIME];
      }
    }
    restData.push(item);
  }

  const formattedData = restData
    .map((d) => (typeof d === 'object' ? JSON.stringify(d) : d))
    .join(' ');

  let logMessage = formattedData;

  if (traceId) {
    logMessage = `${traceId}:${logMessage}`;
  }

  if (executionTime !== null) {
    logMessage = `[EXECUTION_TIME] = ${executionTime}ms : ${logMessage}`;
  }

  return logMessage;
}

export default formatLogMessage;
