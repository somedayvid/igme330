// no changes needed in this file.
export const readAppData = (callback) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'data/av-data.json', true);
    xhr.onload = () => {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        callback(data);
      } else {
        console.error('Error reading the shape data');
      }
    };
  
    xhr.onerror = () => {
      console.error('Request failed');
    };
  
    xhr.send();
  }
  