(function() {

	var simpleNotification = document.querySelector('.simple-notification');
	var main = document.querySelector('main');
	var closeNotification = document.querySelector('.close-notification');

	// simpleNotification.classList.add('hide');
	main.classList.add('blur');

	closeNotification.onclick = function() {
		simpleNotification.classList.add('hide')
		main.classList.remove('blur');
	};

	function renderSimpleNotification(data){
		var data = data;
		var title = document.querySelector('.simple-notification .title');
		var location = document.querySelector('.simple-notification .location');
		var msg = document.querySelector('.simple-notification .msg');

		title.innerHTML = data.title;
		location.innerHTML = 'Locatie: ' + data.userId;
		msg.innerHTML = 'Beschrijving: ' + data.body;

		console.log(data);
	};


	function pushNotification() {
		// new Notification('Buurt preventie: dealer overlast', {
		// 	body: 'Mogelijke deal activiteiten gesignaleerd op Soembawastraat 6 - Oost'
		// })
	};
	
	var jsonData;

	function getData(){
		var root = 'http://jsonplaceholder.typicode.com';
		var result = null
		aja()
		  .url(root + '/posts/1')
		  .type('jsonp')
		  .sync(true)
		  .cache('false')
		  .on('success', function(data){
			    renderSimpleNotification(data);
			    jsonData = data;
			    console.log(jsonData);
			    return jsonData;
		  })	
		  .go();
	};	

	getData();	
	console.log(jsonData);

})();