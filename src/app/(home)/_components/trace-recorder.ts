// trace-recorder.ts
// 简单的trace recording工具，导出一个appendTraceRecord函数
'use client';

// 浏览器端 trace 记录，使用 localStorage
export function appendTraceRecord(data: any) {
  if (typeof window === 'undefined') return;
  let records: any[] = [];
  try {
    const raw = localStorage.getItem('trace-record');
    if (raw) {
      records = JSON.parse(raw);
    }
  } catch (e) {
    records = [];
  }
  records.push({ ...data });
  localStorage.setItem('trace-record', JSON.stringify(records));
}

// 可选：导出一个下载 trace 的函数
export function downloadTraceRecord(filename = 'trace-record.json') {
  if (typeof window === 'undefined') return;
  const raw = localStorage.getItem('trace-record') || '[]';
  const blob = new Blob([raw], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
