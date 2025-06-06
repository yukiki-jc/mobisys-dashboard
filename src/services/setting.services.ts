export async function sendNewSetting(
  settings : {
    bandwidth: number;
    accuracy: number;
    latency: number;
  }
) {
  // Fake delay
  const response = await fetch('http://127.0.0.1:8080/setting', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(settings),
  });
  // 打印 response 的码
  console.log('Response status:', response.status);
  if (!response.ok) {
    throw new Error(`Network response status: ${response.status} ${response.statusText}`);
  }
  // parse json 
  const data = await response.json();
  console.log('Response data:', data);
  return data;  
}

export async function startInference() {
  const response = await fetch('http://127.0.0.1:8080/start', {
    method: 'GET',
  });
  if (response.status !== 200) {
    throw new Error(`Network response status: ${response.status} ${response.statusText}`);
  }
  return;
}
  