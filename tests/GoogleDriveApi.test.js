import GoogleDriveApi from '../src/GoogleDriveApi';

var api = new GoogleDriveApi();

test('test api name', () =>{
	expect(api.name).toBe('GoogleDriveApi');
});
