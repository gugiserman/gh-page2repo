(function() {

  var tabs = [];

  chrome.runtime.onMessage.addListener(function(request, sender) {
    for (var i = 0; i < tabs.length; i++) {
      if (tabs[i].id === sender.tab.id) {
        tabs[i].url = request.url;
      }
    }
    tabs.push({ id: sender.tab.id, url: request.url });
  });

  chrome.tabs.onRemoved.addListener(function(tabId) {
    for (var i = 0; i < tabs.length; i++) {
      if (tabs[i].id === tabId) {
        tabs.splice(i, 1);
      }
    }
  });

  chrome.browserAction.onClicked.addListener(function(tab) {
    for (var i = 0; i < tabs.length; i++) {
      if (tabs[i].id === tab.id) {
        chrome.tabs.update(tab.id, { url: tabs[i].url });
      }
    }
  });

}());
