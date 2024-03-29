export function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function getRandomCode(length = 6) {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += ((Math.random() * 16) | 0).toString(16);
  }

  return result;
}
