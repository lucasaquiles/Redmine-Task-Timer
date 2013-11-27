
//GLOBAL VARS (defined in options.html)
var verifyRedmineUrl = true;
var isShowNotification = true;
var timeToCloseNotifications = 4000;

var idTask = 'taskNumber';

var EnumButtons = {
	PROGRESS: {
		buttons : [
			{ title: "Start", iconUrl: "http://redmine.infoway-pi.com.br/images/add.png" },
			{ title: "Send Email", iconUrl: "http://redmine.infoway-pi.com.br/images/add.png"}
		],
		actions : function(){
			chrome.notifications.onButtonClicked.addListener(function(notificationId, buttonIndex){
				//as all notifications have the same id, just use button index
				if(buttonIndex == 0){
					alert("CALL");
				}
				if(buttonIndex == 1){
					alert("EMAIL");
				}
			})
		}
	},
	SUBMIT: null,
	CLEAN: null
}

//when atualize tabs
chrome.tabs.onUpdated.addListener(function(tabId, info, tab) {
	chrome.tabs.query({
	    "status": "complete",
	    "windowType": "normal"
	}, function (tabs) {
	    for (i in tabs) {
	    	var tab = tabs[i];
	    	if(tab && tab.id == tabId){
	    		//verify if the page has redmine name to insert plugin
	    		if(verifyRedmineUrl && tab.url.toLowerCase().indexOf("redmine") != -1){
	    			chrome.tabs.executeScript(tabId, {file: "js/jquery.js"});
	    			chrome.tabs.executeScript(tabId, {file: "js/utils.js"});
					chrome.tabs.executeScript(tabId, {file: "js/counter.js"});
					chrome.tabs.insertCSS(tabId, {file: "css/time-tracker.css"});
	    		}
	    	}
	    }
	});

});

//when a extension send request
chrome.extension.onRequest.addListener(function(request, sender, sendResponse){
	switch(request.redmine){
		case "setTaskTime":
			var requestObject = parseJSONTimeTracker(request.data);
			localStorage.setItem(requestObject[idTask], request.data);
			break;
		case "getTaskTime":
			var value = request.data[idTask] ? localStorage.getItem(request.data[idTask]) : null;
			value = value ? parseJSONTimeTracker(value) : value;
			sendResponse(value);
			if(value && request.data['notification']){
				showNotification("Task Progress", "This task already has "+secondsToHmsTimeTracker(value.time)+" hours.", EnumButtons.SUBMIT);
			}
			break;
		case "eraseTaskTime":
			localStorage.removeItem(request.data[idTask]);
			sendResponse(localStorage);
			showNotification("Task Erase", "This task time has been erased!", EnumButtons.CLEAN);
			break;
		case "removeTaskTime":
			localStorage.removeItem(request.data[idTask]);
			showNotification("Submit Task Time", "Task time has been submitted!", EnumButtons.SUBMIT);
			break;
		case "listTaskTimes":
			sendResponse(localStorage);
			break;
	}
});

//NOTIFICATION
function showNotification(title, message, btns){
	if(isShowNotification){
		title = title ? title : " ";
		message = message ? message : " ";
		//if havent btns, buttons or actions, do the simple
		if(!btns || !btns.buttons || !btns.actions){
			btns = {
				buttons: undefined,
				actions: function(){}
			}
		}
		chrome.notifications.create("redmineTimeTracker", {   
				type: 'basic', 
				iconUrl: '../images/icon48.png',
				title: title, 
				message: message,
				priority: 0,
				buttons: btns.buttons
			},
			function(newId) {
				setTimeout(function(){
					chrome.notifications.clear(newId, function(){});
				}, timeToCloseNotifications);
			}
		);
		if( typeof(btns.actions) === "function" ){
			btns.actions();
		}
	}
}

//OMNIBOX
/*
var suggestions = {
	settings : /settings|options|preferencias|opcoes/gi,
}

chrome.omnibox.onInputChanged.addListener(function(text, suggest) {
	var sugestoes = new Array(), sug;
	//iterar sobre sugestoes
	for(var x in suggestions){
		sug = new String(suggestions[x]).replace(/\/gi|\/|\|/g," ");
		if(sug.indexOf(text)!=-1){
			sugestoes.push({content: x, description: text + " - " + x})
		}
	}
	suggest(sugestoes);
});

chrome.omnibox.onInputEntered.addListener(function(text) {
	omniboxEnteredFunction(text);
});

function omniboxEnteredFunction(text){
	var search = text.toLowerCase().replace(/\s/,"");
	if(suggestions.settings.test(text)){
		openPage('templates/omnibox/options.html');
		suggestions.settings.test(text);
	}
}

function openPage(page) {
    var options_url = chrome.extension.getURL(page);
    chrome.tabs.query({
        url: options_url,
    }, function(tabs) {
        if (tabs.length)
            chrome.tabs.update(tabs[0].id, {active:true});
        else
            chrome.tabs.create({url:options_url});
    });
}
*/


//----------------------------------------------------------------------------------------------------------------------------------------------


/*método genérico para realizar ajax*/
function ajax(caminho, tipo, dados){
	var retorno;
	$.ajax({
		url: caminho,
		cache: false,
		type: tipo,
		async: false,
		data: dados,
		success: function(dados){
			retorno = dados;
		},
		error: function(jqXHR, status, err){
			console.log(jqXHR);
		}
	});
	return retorno;
}