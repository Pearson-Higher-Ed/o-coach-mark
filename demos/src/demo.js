/*global require*/

document.addEventListener('DOMContentLoaded', function() {
	const CoachMark = require('../../main');
	new CoachMark(document.getElementById('top'), {
		title: 'Coach Mark Below Feature',
		text: 'Some text explaining to the user why you changed their interface',
		id: '9834893449'
	}, function (id) {
		console.log('Callback executed on exit '+ id);
	});

	new CoachMark(document.getElementById('cm-left'), {
		title: 'Coach Mark Right of Feature',
		text: 'Some text explaining to the user why you changed their interface',
		id: '9834893498'
	}, function (id) {
		console.log('Callback executed on exit '+ id);
	});

	new CoachMark(document.getElementById('cm-right-1'), {
		title: 'Coach Mark Left of Feature',
		text: 'Some text explaining to the user why you changed their interface',
		id: '9837494320',
		currentCM: '1',
		totalCM: '2',
		hasNext:true
	}, function (id) {
		console.log('Callback executed on exit of ' + id);
	});

	new CoachMark(document.getElementById('cm-bottom'), {
		like: true,
		title: 'Coach Mark Above Feature',
		text: 'Some text explaining to the user why you changed their interface',
		id: '9892387492098',
		currentCM: '2',
		totalCM: '2',
		hasBack:true,
		hasNext:true
	}, function (id) {
		console.log('Callback executed on exit '+ id);
	});

	document.addEventListener('o-cm-like-clicked', (event) => {
		console.log("user clicked " + event.data.id + " " + event.data.type)
	});
	document.addEventListener('o-cm-submit-clicked', (event) => console.log("user clicked " + event.data.id + " " + event.data.type + " and commented: " + event.data.payload));
	document.addEventListener('o-cm-cancel-clicked', (event) => console.log("user clicked " + event.data.id + " " + event.data.type));
	document.addEventListener('o-cm-backNext-clicked', (event) => console.log("user clicked " + event.data.id + " " + event.data.type));
});

