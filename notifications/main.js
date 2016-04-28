(function() {

	var simpleNotification = document.querySelector('.simple-notification');
	var main = document.querySelector('main');
	var closeNotification = document.querySelector('.close-notification');
	var interval = 5000;
	var currentAlarm;
	var newAlarm;
	var pushNotificationAvailable;

	simpleNotification.classList.add('hide');

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

			var location = document.querySelector('.simple-notification .location');
			var time = document.querySelector('.simple-notification .time');
			var date = document.querySelector('.simple-notification .date');

			
			location.innerHTML = 'Locatie: ' + data.location;
			time.innerHTML = 'Tijdstip: ' + data.time;
			date.innerHTML = 'Datum: ' + data.day + '/' + data.month + '/' + data.year;

			simpleNotification.classList.remove('hide');
		}
	}

	// function renderSimpleNotification(data) {


	// 	var location = document.querySelector('.simple-notification .location');
	// 	var time = document.querySelector('.simple-notification .time');
	// 	var date = document.querySelector('.simple-notification .date');

		
	// 	location.innerHTML = 'Locatie: ' + data.location;
	// 	time.innerHTML = 'Tijdstip: ' + data.time;
	// 	date.innerHTML = 'Datum: ' + data.day + '/' + data.month + '/' + data.year;

	// 	console.log(data);
	// };

	// function pushNotification() {
	// 	// new Notification('Buurt preventie: dealer overlast', {
	// 	// 	body: 'Mogelijke deal activiteiten gesignaleerd op Soembawastraat 6 - Oost'
	// 	// })
	// };
	



	function checkAlarm(data) {
	
		currentAlarm = newAlarm
		newAlarm = data._id;

		if(currentAlarm !== newAlarm && currentAlarm !== undefined){
			// alert('new alarm, currentAlarm: ' + currentAlarm + ' newAlarm: ' + newAlarm)
			sendNotification(data);
		}

		console.log('currentAlarm: ' + currentAlarm);
		console.log('newAlarm: ' + newAlarm);
	}

	function getData(){
		var currentAlarmId;
		var newAlarmId;

		var root = 'http://api.leandervanbaekel.nl';

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