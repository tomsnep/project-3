(function() {


	// Declare all variables
	var simpleNotification = document.querySelector('.simple-notification');
	var main = document.querySelector('main');
	var closeNotification = document.querySelector('.close-notification');
	var location = document.querySelector('.simple-notification .location');
	var time = document.querySelector('.simple-notification .time');
	var date = document.querySelector('.simple-notification .date');
	var confirmationButton = document.querySelectorAll('.confirmation');

	var interval = 3000;
	var root = 'http://api.leandervanbaekel.nl';
	
	var pushNotificationAvailable;
	var currentAlarm;
	var newAlarm;
	var currentAlarmId;
	var newAlarmId;

	// Hide notification
	closeNotification.onclick = function() {
		simpleNotification.classList.add('hide')
		// main.classList.remove('blur');
	};

	// Detect if Notifications are supported
	function checkNotificationType() {
		if(!('Notification' in window)) {
			//notifications are not supported, set availability to false
			pushNotificationAvailable = false;

		} else if (Notification.permission == 'granted') {
			//notifications are granted, set availability to true
			pushNotificationAvailable = true;
	
		} else if (Notification.permission == 'denied') {
			//notifications are denied, set availability to false
			pushNotificationAvailable = false;
	
		} else if (Notification.permission !== 'denied') {
			//notifications are not denied, ask for permission
			Notification.requestPermission(function (permission) {
				if (permission == 'granted') {
					//notifications are granted, set availability to true
					pushNotificationAvailable = true;
			
				} else if (permission == 'denied') {
					//notifications are denied, set availability to false
					pushNotificationAvailable = false;

				}
			});
		}
	}

	function sendNotification(data){

		// add blur to the main content
		// main.classList.add('blur');
		
		// put data from alarm object into html
		location.innerHTML = 'Locatie: ' + data.street;
		time.innerHTML = 'Tijdstip: ' + data.time;
		date.innerHTML = 'Datum: ' + data.day + '/' + data.month + '/' + data.year;

		//Remove hide class to show SimpleNotificaiton
		simpleNotification.classList.remove('hide');

		// If Notifications are available send Notification
		if(pushNotificationAvailable == true) {
			
			new Notification('Er is een melding ontvangen!', {
				body: 'op locatie: ' + data.street + 'om ' + data.time + 'op: ' + data.day + '/' + data.month + '/' + data.year
			});

		} 

		// The user can confirm if the mention is valid
		// loop trough all buttons
		for(var i = 0; i < confirmationButton.length; i++){
			
			confirmationButton[i].onclick = function() {
				
				// Ajax POST request to update the status of the given alarm
				aja()
				  .url(root + '/alarm/update/' + data._id + '/' + this.value)
				  .method('POST')
				  .on('success', function(data){
					 console.log('succes!')	
				  })
				  .go();
			}			
		}
	}

	// Check if the newest alarmId differs from the previous alarmId
	function checkAlarm(data) {
		//Set value of currentAlarm to the id of the newAlarm
		currentAlarm = newAlarm
		// Set value of newAlarm to the newest Id
		newAlarm = data._id;

		// If the currentAlarm does not match the newAlarm send a notification
		// On first load the currentAlarm would be undefined
		if(currentAlarm !== newAlarm && currentAlarm !== undefined){
			sendNotification(data);
		}

		console.log('currentAlarm: ' + currentAlarm);
		console.log('newAlarm: ' + newAlarm);
	}

	// Get data from latest alarms, updates every 30 seconds
	function getData(){
		aja()
		  .url(root + '/alarm/latest')
		  .type('json')
		  .cache('false')
		  .on('success', function(data){
			 	var data = data[0];
				checkAlarm(data);
			    setTimeout(getData, interval);
			
		  })
		  .go();
	};	

	setTimeout(getData, interval);
	checkNotificationType();
})();