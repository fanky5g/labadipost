export function sendMessage(body) {
  return {
    type: 'SEND_CONTACT_MESSAGE',
    promise: (client) => client.post('/contact_message', {
      data: body,
    }),
  };
}

export function clearResponse() {

}
