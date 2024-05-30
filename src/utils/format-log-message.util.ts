import { TraceIdHandler } from './trace-handler.util';

function formatLogMessage(...optionalParams: any[]) {
  const TRACE_ID = TraceIdHandler.getTraceIdField();
  let traceId = null;
  let restData = [];

  for (const item of optionalParams) {
    if (item && typeof item === 'object' && TRACE_ID in item) {
      traceId = item[TRACE_ID];
      restData.push(item);
    } else {
      restData.push(item);
    }
  }

  const formattedData = restData
    .map((d) => (typeof d === 'object' ? JSON.stringify(d) : d))
    .join(' ');

  return traceId ? `${traceId}:${formattedData}` : `${formattedData}`;
}

export default formatLogMessage;
