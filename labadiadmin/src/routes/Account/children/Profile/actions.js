export function deleteImage() {
  return {
    type: 'DELETE_IMAGE',
    promise: (client) => client.post('/resetImage'),
  };
}

export function editAccount() {

}
