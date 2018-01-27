import GoogleDriveApi from './GoogleDriveApi';
var PDFJS = require('pdfjs-dist');

export default class StorageAdapter{

	constructor(driveApi) {
		this.driveApi = driveApi;
		this.url = this.getParameterByName('webContentLink');
		this.fileId = this.getParameterByName('fileId');;
		this.commentId = null;
		PDFJS.disableWorker = true;   
		this.doc = PDFJS.getDocument(this.url);
	}

	getParameterByName(name) {
		var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
		return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
	}

	listFiles() {
		return this.driveApi.listFiles();
	}

	getMeta() {
		var that = this;
		return this.driveApi.getMeta(this.fileId).then(data => {
			if(!data) {
				return { pageIndex: 0, scale: 1.5 };
			}
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
		return this.doc.then(function(pdfDoc) {
			var pages = [];
			for(var i = 1; i <= pdfDoc.numPages; i++) {
				pages[i - 1] = pdfDoc.getPage(i);
			}
			return Promise.all(pages);
		});
	}

	getTitle() {
		return this.doc
			.then(pdfDoc => pdfDoc.getMetadata())
			.then(data => data.info.Title );
	}
}
