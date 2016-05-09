const serviceFilter = { serviceType: '_linkbot-hub._tcp.local' };
//const serviceFilter = { serviceType: '*' };

chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('index.html', {
    'outerBounds': {
      'width': 1024,
      'height':768 
    }
  });

  chrome.mdns.onServiceList.addListener( function(info) {
    console.log("Received services.");
    console.log(info);
  },
  serviceFilter
  );

  console.log("Forcing mdns discovery...");
  chrome.mdns.forceDiscovery(function () {
    console.log("Service discovery started...");
  } );
});
