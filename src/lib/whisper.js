const OPENAI_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY;

function mimeFromUri(uri) {
  if (uri.endsWith('.mp3')) return 'audio/mpeg';
  if (uri.endsWith('.mp4')) return 'audio/mp4';
  if (uri.endsWith('.wav')) return 'audio/wav';
  if (uri.endsWith('.webm')) return 'audio/webm';
  return 'audio/m4a';
}

export function transcribeAudio(uri) {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    // XHR still supports the RN file-part shorthand that the new fetch does not
    formData.append('file', {
      uri,
      name: uri.split('/').pop(),
      type: mimeFromUri(uri),
    });
    formData.append('model', 'whisper-1');
    formData.append('language', 'en');

    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://api.openai.com/v1/audio/transcriptions');
    xhr.setRequestHeader('Authorization', `Bearer ${OPENAI_KEY}`);

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText);
          resolve(data.text ?? '');
        } catch {
          reject(new Error('Invalid response from Whisper'));
        }
      } else {
        let msg = `Whisper error ${xhr.status}`;
        try {
          const err = JSON.parse(xhr.responseText);
          if (err.error?.message) msg = err.error.message;
        } catch {}
        reject(new Error(msg));
      }
    };

    xhr.onerror = () => reject(new Error('Network error'));
    xhr.ontimeout = () => reject(new Error('Request timed out'));
    xhr.timeout = 60000;

    xhr.send(formData);
  });
}
