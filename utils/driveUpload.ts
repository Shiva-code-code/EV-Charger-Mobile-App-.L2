export const uploadToGoogleDrive = async (fileUri: string, accessToken: string) => {
    const fileName = 'ev-map-screenshot.webp';
    const mimeType = 'image/webp';
  
    const file = await fetch(fileUri);
    const blob = await file.blob();
  
    const metadata = {
      name: fileName,
      mimeType
    };
  
    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    form.append('file', blob);
  
    const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      body: form
    });
  
    if (!response.ok) {
      throw new Error('Upload failed');
    }
  
    const data = await response.json();
    console.log('Uploaded file ID:', data.id);
    return data.id;
  };
  