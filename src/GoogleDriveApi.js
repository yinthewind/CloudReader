
export default class GoogleDriveApi {
	constructor(xhr) {
		this.name = "GoogleDriveApi";
		this.baseUrl = 'https://www.googleapis.com/drive/v3';
		this.xhr = xhr;
	}

	buildUrl(type, queries) {
		var url = this.baseUrl + type;

		if(queries) {
			url += '?q=' + queries.join('&');
		}
		return url;
	}

	listFile() {
		var method = 'GET';
		var url = this.buildUrl('/files', [
			'mimeType%3D%27application%2Fpdf%27',
			'fields=files(id%2Cname%2CwebContentLink)'
		]);

		this.xhr.fire(method, url, null, null);
	}

}
