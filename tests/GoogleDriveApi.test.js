import GoogleDriveApi from '../src/GoogleDriveApi';

var mockXhr = jest.fn();
var api = new GoogleDriveApi(mockXhr);
var baseUrl = 'https://www.googleapis.com/drive/v3';

var constants = {
	listFileUrl: baseUrl + '/files?q=mimeType%3D\'application%2Fpdf\'&fields=files(id%2Cname%2CwebContentLink)',
	listFileResult: [{
		id:"0000-00",
		name:"example.pdf",
		webContentLink:"https://drive.google.com/uc?id=Q&export=download"
	},{
		id:"0000-01",
		name:"Tmux Quick Reference & Cheat sheet - 2 column format for less scrolling!.pdf",
		webContentLink:"https://drive.google.com/uc?id=E&export=download"
	}],
	listFileResponse: JSON.stringify({
		files:[{
			id:"0000-00",
			name:"example.pdf",
			webContentLink:"https://drive.google.com/uc?id=Q&export=download"
		}, {
			id:"0000-01",
			name:"Tmux Quick Reference & Cheat sheet - 2 column format for less scrolling!.pdf",
			webContentLink:"https://drive.google.com/uc?id=E&export=download"
		}]
	}),
}

test('test api name', () => {
	expect(api.name).toBe('GoogleDriveApi');
});

test('test listFile request url', () => {
	mockXhr.mockReturnValueOnce(Promise.resolve(constants.listFileResponse));
	var promise = api.listFile();
	expect(mockXhr).toHaveBeenCalledWith('GET', constants.listFileUrl, null);
});

test('test listFile result', () => {
	mockXhr.mockReturnValueOnce(Promise.resolve(constants.listFileResponse));
	return api.listFile().then(data => {
		expect(data).toEqual(constants.listFileResult);
	});
});

test('test listFile XHR error', () => {
	mockXhr.mockReturnValueOnce(Promise.reject('unhappy'));
	return api.listFile().then(data => {
		expect(data).toBeNull();
	}).catch(data => {
		expect(data).toBe('unhappy');
	});
});
