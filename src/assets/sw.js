// -------------------------------------------------------
// background sync
// -------------------------------------------------------


self.addEventListener('sync', event => {
  swLog('I heard a sync event!', event);
  if (event.tag === 'my-pwa-messages') {
    event.waitUntil(getMessagesFromOutbox()
      .then(messages => Promise.all(mapAndSendMessages(messages)))
      .catch(err => swLog('unable to send messages to server', err))
      .then(response => removeMessagesFromOutBox(response))
    );
  }
});

function getMessagesFromOutbox() {
  const key = 'pwa-messages';
  return idbKeyval.get(key).then(values => {
    values = values || '[]';
    const messages = JSON.parse(values) || [];
    return messages;
  });
}

function mapAndSendMessages(messages) {
  return messages.map(
    message => sendMessage(message)
      .then(response => response.json())
      .catch(err => swLog('server unable to handle the message', message, err))
  );
}

function sendMessage(message) {
  const headers = {
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json'
  };
  const msg = {
    method: 'POST',
    body: JSON.stringify(message),
    headers: headers
  };
  return fetch('/messages', msg).then((response) => {
    swLog('message sent!', message);
    return response;
  });
}

function removeMessagesFromOutBox(response) {
  // If the first worked,let's assume for now they all did
  if (response && response.length && response[0] && response[0].result === 'success') {
    return idbKeyval.clear()
      .then(() => swLog('messages removed from outbox'))
      .catch(err => swLog('unable to remove messages from outbox', err));
  }
  return Promise.resolve(true);
}


// -------------------------------------------------------
// push
// -------------------------------------------------------
   var url='';
self.addEventListener('push', event => {
  //console.log('[Service Worker] Push Received.');
  //console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);
  let data = JSON.parse(event.data.text())
 const  body = data.notification.body.body;
  const  URL= data.notification.body.url
  const type= data.notification.body.type;
 const title = data.notification.title;

if(data.notification.tag=='msg'){
    url=`${URL}/main/messaging`

}
else if(type=='joindre' || type=='subscribe')
{
 url=`${URL}/main/profile/${data.notification.tag}`
}
else 
{
    url=`${URL}/main/post/${data.notification.tag}`
}




  const options = {
    body,
    icon:data.notification.icon,
    badge: data.notification.icon
  };

  if(data.notification.tag){
      options.tag=data.notification.tag;
  }

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', event => {
  swLog('Notification click Received.');

  event.notification.close();

  event.waitUntil(clients.openWindow(url));
});




// -------------------------------------------------------
// logging
// -------------------------------------------------------
function swLog(eventName, event) {
  //console.log('[Service Worker] ' + eventName);
  if (event) {
    //console.log(event);
  }
}
