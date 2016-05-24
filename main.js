console.log('main.js');

const serviceFilter = { serviceType: '_linkbot-hub._tcp.local' };

window.addEventListener('load', function() {

    console.log("Window load.");
    var selectedHub = null;
    var hubs = [];

    var radioSelected = function(event) {
        console.log(event);
        selectedHub = hubs[event.target.value];
        console.log(hubs);
        console.log('Set Hub to: ', selectedHub);
    };
 
    var createRadioOption = function(id, text, value, selected) {
        var container = document.createElement('div');
        container.setAttribute('class', 'radio');
        var label = document.createElement('label');
        var input = document.createElement('input');
        input.type = 'radio';
        input.name = 'hubs';
        input.id = id;
        input.value = value;
        if (selected) {
            input.checked = true;
        }
        input.addEventListener('click', radioSelected);
        label.appendChild(input);
        label.appendChild(document.createTextNode(text));
        container.appendChild(label);
        return container;
    };

    chrome.mdns.onServiceList.addListener( function(info) {
        var index, selectRadioOption;
        if ( info.length > 0 ) {
            console.log("Received services.");
            console.log(info);
            document.getElementById('not-found').className = 'alert alert-warning hidden';
            for ( index = 0; index < info.length; ++index) {
                hubs.push(info[index].serviceHostPort);
                if (selectedHub !== null) {
                    selectRadioOption = false;
                } else {
                    selectRadioOption = true;
                    selectedHub = hubs[0];
                }
                var radioOption = createRadioOption('hub-radio-option-' + hubs.length, 'Linkbot Hub @' + info[index].ipAddress, hubs.length - 1, selectRadioOption);
                document.getElementById('hubForm').appendChild(radioOption);
            }
        } else {
            document.getElementById('not-found').className = 'alert alert-warning';
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

    var addBtn = document.getElementById('btn-add-manual');
    addBtn.addEventListener('click', function() {
        var txtInput = document.getElementById('input-manual');
        console.log('Push onto hubs: ' + txtInput.value);
        hubs.push(txtInput.value);
        var radioOption = createRadioOption('hub-radio-option-' + hubs.length, 'Linkbot Hub @' + txtInput.value, hubs.length - 1, true);
        selectedHub = hubs[0];
        document.getElementById('hubForm').appendChild(radioOption);
    });

    chrome.runtime.onMessageExternal.addListener( function(request, sender, sendResponse) {
        console.log("Received message from external source.");
        console.log("Selected Hub", selectedHub);
        if ( selectedHub && selectedHub !== null) {
            sendResponse({serviceHostPort: selectedHub});
        } else {
            sendResponse({serviceHostPort : null});
        }
    });
});
