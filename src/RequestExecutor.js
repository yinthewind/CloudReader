var PDFJS = require('pdfjs-dist');

export default class RequestExecutor {

	constructor(url, fileId, sendMessage) {
		this.url = url;
		this.fileId = fileId;
		this.sendMessage = sendMessage;
		this.commentId = null;
	}

	executeRequest(data, callback) {
		if(this.sendMessage) {
			this.sendMessage(data, callback);
		} else {
			console.log('invalid requestExecutor');
		}
	}

	getPages() {

		PDFJS.disableWorker = true;   
		var doc = PDFJS.getDocument(this.url);
		var that = this;

		return new Promise((resolve,reject)=>{
			doc.then(function(pdfDoc) {
				var promises = [];
				for(var i = 1; i <= pdfDoc.numPages; i++) {
					promises[i-1]=pdfDoc.getPage(i);
				}
				Promise.all(promises).then((value)=>{
					resolve(value);
				});
			});
		});
	}

	getMetadata() {
		var that = this;
		return new Promise((resolve,reject)=>{
			
			this.executeRequest(
				{ type: 'getMetadata', fileId: this.fileId },
				function(response) {
					var scale = 1.5;
					if(response) {
						that.commentId = response.id;
						that.pageIndex = response.pageIndex;
						scale = response.scale;
					}
					console.log('get metadata...'); 
					console.log(response);
					resolve({
						pageIndex: that.pageIndex,
						scale: scale
					});
				}
			);
		});
	}

	uploadMetadata(metadata) {
		var request = {
			type: 'uploadMetadata',
			fileId: this.fileId,
			commentId: this.commentId,
			data: metadata
		};
		this.executeRequest(request);
		console.log('uploading metadata...');
		console.log(metadata);
	}
}
