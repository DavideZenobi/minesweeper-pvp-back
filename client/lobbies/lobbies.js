

const lobbiesList = document.getElementById('lobbies-list');

const response = await fetch('http://localhost:3000/api/private/lobbies/');
const lobbies = await response.json();

lobbies.forEach(lobby => {
    lobbiesList.insertAdjacentHTML('beforeend', 
        `
            <div class="lobby-item">
                <h3>Name: ${lobby.nickname}</h3>
                <p>Capacity: 0/${lobby.capacity}</p>
                <button id="btn-join-${lobby.id}">Join</button>
            </div>
        `
    );

    const joinButton = document.getElementById(`btn-join-${lobby.id}`);

    joinButton.addEventListener('click', (e) => {
        e.preventDefault();
    })
});