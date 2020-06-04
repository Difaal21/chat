const socket = io();

const chatMessage = document.querySelector('.chat-messages');

// Pesan dari server
socket.on('message', message => {
    outputMessage(message);

    // Scroll down ketika pesan masuk
    chatMessage.scrollTop = chatMessage.scrollHeight;
});

// Dapatkan elemen id
const chatForm = document.getElementById('chat-form');

// Ketika pesan dikirim
chatForm.addEventListener('submit', e => {
    // Otomatis mengirim file, maka digunakan preventDefault
    e.preventDefault();

    // Mengambil isi elemen yang mempunyai nama msg
    const msg = e.target.elements.msg.value;

    // Menampilkan pesan ke server
    socket.emit('chatMessage', msg);

    // Menghapus pesan yang telah dikirim
    e.target.elements.msg.value = '';

    // Akan fokus ke elemen mengirim pesan
    e.target.elements.msg.focus();

});

const {
    email,
    room
} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});


// Join chatRoom
socket.emit('joinRoom', {
    email,
    room
});

// Cek Siapa dan apa ruangannya
socket.on('roomUsers', ({
    room,
    users
}) => {
    outputRoomName(room);
    outputUsers(users);
});

const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// menambahkan room ke card
function outputRoomName(room) {
    return roomName.innerText = room;
}

// Menambahkan users ke card
function outputUsers(users) {
    const listUser = users.map(user => `<li>${user.email}</li>`).join('');
    return userList.innerHTML = listUser;
}


function outputMessage(message) {
    // Membaat elemen div
    const div = document.createElement('div');

    // Menambahkan class message
    div.classList.add('message');

    // Bubble pada room chat
    div.innerHTML =
        `
        <p class="meta">${message.email}<span>${message.time}</span></p>
        <p class="text">
        ${message.text}
        </p>
        `;

    // Menambahkan bubble chat
    document.querySelector('.chat-messages').appendChild(div);
}