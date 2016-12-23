import GoogleDriveApi from '../src/GoogleDriveApi';

class MockXhr {
	constructor() {
		this.method = null;
		this.url = null;
		this.data = null;
		this.callback = null;
	}
	
	fire(method, url, data, callback) {
		this.method = method;
		this.url = url;
		this.data = data;
		this.callback = callback;
	}
}
var mockXhr = new MockXhr();
var api = new GoogleDriveApi(mockXhr);
var baseUrl = 'https://www.googleapis.com/drive/v3';
var listFileUrl = baseUrl + '/files?q=mimeType%3D%27application%2Fpdf%27&fields=files(id%2Cname%2CwebContentLink)'

test('test api name', () => {
	expect(api.name).toBe('GoogleDriveApi');
});

test('test list file', () => {
	api.listFile();
	expect(mockXhr.url).toBe(listFileUrl);
});
