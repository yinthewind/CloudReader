import GoogleDriveApi from './GoogleDriveApi';
var PDFJS = require('pdfjs-dist');

export default class StorageAdapter{

	constructor(driveApi) {
		this.driveApi = driveApi;
		this.url = this.getParameterByName('webContentLink');
		this.fileId = this.getParameterByName('fileId');;
		this.commentId = null;
	}

	getParameterByName(name) {
		var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
		return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
	}

	listFile() {
		return this.driveApi.listFile();
	}

	getMeta() {
		var that = this;
		return this.driveApi.getMeta(this.fileId).then(data => {
			that.commentId = data.id;
			return data;
		});
	}

	putMeta(data) {
		return this.driveApi.putMeta({
			fileId: this.fileId, 
			commentId: this.commentId
		}, data);
	}

	getPages() {
		PDFJS.disableWorker = true;   
		var doc = PDFJS.getDocument(this.url);
		var that = this;
		return doc.then(function(pdfDoc) {
			var pages = [];
			for(var i = 1; i < pdfDoc.numPages; i++) {
				pages[i - 1] = pdfDoc.getPage(i);
			}
			return Promise.all(pages);
		});
	}
}
