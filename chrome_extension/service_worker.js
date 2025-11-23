console.log('Service worker started');

// Keep the worker alive to see logs for a short time if needed
self.addEventListener('message', (ev) => {
	console.log('Service worker received message:', ev.data);
});
