(function() {

	var simpleNotification = document.querySelector('.simple-notification');
	var main = document.querySelector('main');
	var closeNotification = document.querySelector('.close-notification');
	var location = document.querySelector('.simple-notification .location');
	var time = document.querySelector('.simple-notification .time');
	var date = document.querySelector('.simple-notification .date');
	
	var interval = 3000;
	var root = 'http://api.leandervanbaekel.nl';
	
	var pushNotificationAvailable;
	var currentAlarm;
	var newAlarm;
	var currentAlarmId;
	var newAlarmId;


	// simpleNotification.classList.add('hide');

	closeNotification.onclick = function() {
		simpleNotification.classList.add('hide')
		main.classList.remove('blur');
	};

	function checkNotificationType() {
		if(!('Notification' in window)) {
	
			pushNotificationAvailable = false;
	
		} else if (Notification.permission == 'granted') {
	
			pushNotificationAvailable = true;
	
		} else if (Notification.permission == 'denied') {
	
			pushNotificationAvailable = false;
	
		} else if (Notification.permission !== 'denied') {

			Notification.requestPermission(function (permission) {
				if (permission == 'granted') {
			
					pushNotificationAvailable = true;
			
				} else if (permission == 'denied') {
			
					pushNotificationAvailable = false;

				}
			});
		}
	}

	function sendNotification(data){

		if(pushNotificationAvailable == true) {
			
			new Notification('Er is een melding ontvangen!', {
				body: 'op locatie: ' + data.location + 'om ' + data.time + 'op: ' + data.day + '/' + data.month + '/' + data.year
			});

		} else if(pushNotificationAvailable == false) {
			
			main.classList.add('blur');
			
			location.innerHTML = 'Locatie: ' + data.location;
			time.innerHTML = 'Tijdstip: ' + data.time;
			date.innerHTML = 'Datum: ' + data.day + '/' + data.month + '/' + data.year;

			simpleNotification.classList.remove('hide');
		}
	}

	function checkAlarm(data) {
	
		currentAlarm = newAlarm
		newAlarm = data._id;

		if(currentAlarm !== newAlarm && currentAlarm !== undefined){

			sendNotification(data);
		}

		console.log('currentAlarm: ' + currentAlarm);
		console.log('newAlarm: ' + newAlarm);
	}

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