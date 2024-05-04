document.getElementById('login').addEventListener('submit', function(event) {
	event.preventDefault();

	var username = document.getElementById('username').value;
	var password = document.getElementById('password').value;

	if (username === '' || password === '') {
		alert('Please enter both username and password.');
		return;
	}

	if (username === 'admin' && password === '1') {
		alert('Login successful!');
		window.location.href = 'finale.html';
	} else {
		alert('Invalid username or password.');
	}
});