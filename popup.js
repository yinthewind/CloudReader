document.addEventListener('DOMContentLoaded', function() {
	chrome.tabs.create({
		url: "page.html"
	});
});
