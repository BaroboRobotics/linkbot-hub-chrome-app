console.log('main.js');

const serviceFilter = { serviceType: '_linkbot-hub._tcp.local' };

window.addEventListener('load', function() {

    console.log("Window load.");

    var results = [];

    var resultsList = document.getElementById('results');

    var updateResultsList = function() {
        console.log("Updating results list...");
        var index;
        for ( index = 0; index < results.length; ++index) {
            var entry = results[index];
            resultsList.innerHTML += "<li> " + entry.serviceHostPort + "</li>\n";
        }
    };

    chrome.mdns.onServiceList.addListener( function(info) {
        if ( info.length > 0) {
            console.log("Received services.");
            console.log(info);
            console.log(info[0].serviceHostPort);
            results = info;
            updateResultsList();
        }
    },
        serviceFilter
    );

    var refreshBtn = document.getElementById('btn-refresh');
    refreshBtn.addEventListener('click', function() {
        console.log("Refresh.");
        chrome.mdns.forceDiscovery( function() {
            resultsList.innerHTML = '';
            results = [];
        });
    });

    chrome.runtime.onMessageExternal.addListener( function(request, sender, sendResponse) {
        console.log("Received message from external source.");
        if ( results.length > 0 ) {
            console.log("Sending response: " + results[0].serviceHostPort);
            var port = results[0].serviceHostPort.split(':')[1];
            sendResponse({serviceHostPort: results[0].ipAddress + ':' + port});
        } else {
            sendResponse({serviceHostPort : null});
        }
    });
});
