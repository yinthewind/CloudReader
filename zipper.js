var zipFolder = require('zip-folder');

zipFolder('extension/', 'CloudReaderExtension.zip', (err) => {
	if(err) {
		console.log(err);
	} else {
		console.log('zipped!');
	}
});
