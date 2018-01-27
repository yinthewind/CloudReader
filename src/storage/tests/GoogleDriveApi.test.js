import GoogleDriveApi from '../GoogleDriveApi';

var mockXhr = jest.fn();
var api = new GoogleDriveApi(mockXhr);
var baseUrl = 'https://www.googleapis.com/drive/v3';

var constants = {
	listFilesUrl: baseUrl + '/files?q=mimeType%3D\'application%2Fpdf\'&fields=files(id%2Cname%2CwebContentLink)',
	listFilesResult: [{
		id:'0000-00',
		name:'example.pdf',
		webContentLink:'https://drive.google.com/uc?id=Q&export=download'
	},
	{
		id:'0000-01',
		name:'Tmux Quick Reference & Cheat sheet - 2 column format for less scrolling!.pdf',
		webContentLink:'https://drive.google.com/uc?id=E&export=download'
	}],
	listFilesResponse: JSON.stringify({
		files:[{
			id:'0000-00',
			name:'example.pdf',
			webContentLink:'https://drive.google.com/uc?id=Q&export=download'
		}, 
		{
			id:'0000-01',
			name:'Tmux Quick Reference & Cheat sheet - 2 column format for less scrolling!.pdf',
			webContentLink:'https://drive.google.com/uc?id=E&export=download'
		}]
	}),
	fileId0: '0000',
	commentId0: 'AAAAA0vMokM',
	getMetaUrl: baseUrl + '/files/0000/comments?fields=comments',
	getMetaResponse: JSON.stringify({
		comments: [{
			id: 'AAAAA0vMokM',
			content: 'CloudReaderMetaData:{"pageIndex":15,"scale":2.25}',
		},
		{
			id: 'AAAAA0vMokI',
			content: 'CloudReaderMetaData:{"pageIndex":22,"scale":1.5}',
		}]
	}),
	getMetaResponseNotExist: JSON.stringify({
		comments: [{
			id: 'AAAAA0vMokM',
			content: 'My dreams of Lamia are mixed with Lamia\'s dreams',
		}]
	}),
	getMetaResult: {
		id: 'AAAAA0vMokM', 
		pageIndex: 15, 
		scale: 2.25
	},
	postMetaUrl: baseUrl + '/files/0000/comments?fields=content', 
	patchMetaUrl: baseUrl + '/files/0000/comments/AAAAA0vMokM?fields=content',
	putMetaData: {
		pageIndex:22,
		scale:1.5
	},
	putMetaDataWrapped: {
		content: 'CloudReaderMetaData:{"pageIndex":22,"scale":1.5}'
	},
	errorName: 'Somehow request failed',
	errorCode: 503,
	errorResponse: 'Service Unavailable',
	OKCode: 200
}

test('test api name', () => {
	expect(api.name).toBe('GoogleDriveApi');
});

test('test listFiles request url', () => {
	mockXhr.mockReturnValueOnce(Promise.resolve(constants.listFilesResponse));
	api.listFiles();
	expect(mockXhr).toHaveBeenLastCalledWith('GET', constants.listFilesUrl, null);
});

test('test listFiles result', () => {
	mockXhr.mockReturnValueOnce(Promise.resolve(constants.listFilesResponse));
	return api.listFiles().then(data => {
		expect(data).toEqual(constants.listFilesResult);
	});
});

test('test listFiles XHR error', () => {
	mockXhr.mockReturnValueOnce(Promise.reject('unhappy'));
	return api.listFiles().then(data => {
		expect(data).toBeNull();
	}).catch(data => {
		expect(data).toBe('unhappy');
	});
});

test('test getMeta request url', () => {
	mockXhr.mockReturnValueOnce(Promise.resolve(constants.getMetaResponse));
	api.getMeta(constants.fileId0);
	expect(mockXhr).toHaveBeenLastCalledWith('GET', constants.getMetaUrl, null);
});

test('test getMeta result', () => {
	mockXhr.mockReturnValueOnce(Promise.resolve(constants.getMetaResponse));
	return api.getMeta(constants.fileId0).then(data => {
		expect(data).toEqual(constants.getMetaResult);
	})
});

test('test getMeta no meta exist', () => {
	mockXhr.mockReturnValueOnce(Promise.resolve(constants.getMetaResponseNotExist));
	return api.getMeta(constants.fileId0).then(data => {
		expect(data).toBeNull();
	});
});

test('test getMeta request failed', () => {
	mockXhr.mockReturnValueOnce(Promise.reject(constants.errorName));
	return api.getMeta(constants.fileId0).catch((data) => {
		expect(data).toBe(constants.errorName);
	});
});

test('test putMeta post request url', () => {
	mockXhr.mockReturnValueOnce(Promise.resolve(constants.putMetaResponse));
	api.putMeta({ fileId: constants.fileId0 }, constants.putMetaData);
	expect(mockXhr).toHaveBeenLastCalledWith('POST', constants.postMetaUrl, constants.putMetaDataWrapped);
});

test('test putMeta patch request url', () => {
	mockXhr.mockReturnValueOnce(Promise.resolve(constants.putMetaResponse));
	api.putMeta({ fileId: constants.fileId0, commentId: constants.commentId0 }, constants.putMetaData);
	expect(mockXhr).toHaveBeenLastCalledWith('PATCH', constants.patchMetaUrl, constants.putMetaDataWrapped);
});

test('test putMeta request succeed', () => {
	mockXhr.mockReturnValueOnce(Promise.resolve(constants.OKCode));
	return api.putMeta({ fileId: constants.fildId0 }, constants.putMetaData).then(data => {
		expect(data).toBe(constants.OKCode);
	});
});

test('test putMeta requst failed', () => {
	mockXhr.mockReturnValueOnce(Promise.reject(constants.errorCode));
	return api.putMeta({ fileId: constants.fildId0 }, constants.putMetaData).catch(data => {
		expect(data).toBe(constants.errorCode);
	});
});
