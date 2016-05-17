console.log('main.js');

const serviceFilter = { serviceType: '_linkbot-hub._tcp.local' };

window.addEventListener('load', function() {

    console.log("Window load.");

    var results = [];

    var resultsList = document.getElementById('results');
    var selectResults = document.getElementById('select_results');

    var selectedResult = 0;

    var updateResultsList = function() {
        console.log("Updating results list...");
        var index;
        for ( index = 0; index < results.length; ++index) {
            var entry = results[index];
            resultsList.innerHTML += "<li> " + entry.serviceHostPort + "</li>\n";
        }
    };

    chrome.mdns.onServiceList.addListener( function(info) {
        var placeHolder = document.getElementById('placeholder');

        placeHolder.innerHTML = '';
        if ( info.length > 0 ) {
            console.log("Received services.");
            console.log(info);
            console.log(info[0].serviceHostPort);
            results = info;
            updateResultsList();
            placeHolder.appendChild( document.createTextNode('Linkbot hubs found:') );
            var index;
            for ( index = 0; index < info.length; ++index) {
                var hubOption = document.createElement('option');
                var port = info[0].serviceHostPort.split(':')[1];
                hubOption.setAttribute('value', info[index].ipAddress + ':' + port);
                hubOption.appendChild(document.createTextNode(info[index].serviceHostPort));
                selectResults.appendChild(hubOption);
            }
        } else {
            placeHolder.appendChild( document.createTextNode('No Linkbot hubs found.') );
        }
    },
        serviceFilter
    );

    var refreshBtn = document.getElementById('btn-refresh');
    refreshBtn.addEventListener('click', function() {
        console.log("Refresh.");
        chrome.mdns.forceDiscovery( function() {
            console.log('forceDiscovery started.'); 
        });
    });

    chrome.runtime.onMessageExternal.addListener( function(request, sender, sendResponse) {
        console.log("Received message from external source.");
        if ( selectResults.selectedIndex > 0 ) {
            var index = selectResults.selectedIndex;
            sendResponse({serviceHostPort: selectResults[index].value});
        } else {
            sendResponse({serviceHostPort : null});
        }
    });
});
