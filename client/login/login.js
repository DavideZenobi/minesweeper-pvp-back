import { io } from 'https://cdn.socket.io/4.6.0/socket.io.esm.min.js';
import { isPasswordValid, isUsernameValid } from '../utils.js';

const form = document.getElementById('form');
const logoutButton = document.getElementById('logout');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';

    const usernameMatchesRegex = isUsernameValid(username);
    const passwordMatchesRegex = isPasswordValid(password);

    if (!usernameMatchesRegex) {
        document.getElementById('input-error').hidden = false;
    }

    if (!passwordMatchesRegex) {
        document.getElementById('password-error').hidden = false;
    }

    if (usernameMatchesRegex && passwordMatchesRegex) {
        const dataToSend = {username: username, password: password};
        const response = await fetch('http://localhost:3000/api/public/authenticate', {
            method: 'POST',
            body: JSON.stringify(dataToSend),
            headers: {
                'Content-Type': 'application/json'
            },
        });
        
        if (response.status >= 200 && response.status < 300) {
            setTimeout(() => {
                window.location.replace('http://localhost:3000/lobbies');
            }, 500);
        } else {
            const data = await response.json();
            console.log(data);
        }
        
    } else {
        const data = await response.json();
    }
});

logoutButton.addEventListener('click', async (e) => {
    e.preventDefault();

    const response = await fetch('http://localhost:3000/api/private/logout', {
        method: 'POST' 
    });

    const dataResponse = await response.json();
    console.log(dataResponse);
});

