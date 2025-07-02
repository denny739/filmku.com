// Menyimpan daftar film di localStorage atau array sementara
const filmList = document.getElementById("film-list");
let films = JSON.parse(localStorage.getItem("films")) || [];  // Mengambil data film dari localStorage

// Fungsi untuk menambahkan film baru (akses hanya untuk admin)
function addFilm() {
    if (!isAdmin()) {
        alert("Hanya admin yang bisa menambah film!");
        return;
    }

    const title = document.getElementById("film-title").value;
    const posterInput = document.getElementById("film-poster");

    if (!title || !posterInput.files[0]) {
        alert("Judul dan poster harus diisi.");
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const film = {
            title: title,
            poster: e.target.result
        };
        films.push(film);
        localStorage.setItem("films", JSON.stringify(films));  // Simpan film ke localStorage
        renderFilms();
    };
    reader.readAsDataURL(posterInput.files[0]);
}

// Fungsi untuk merender daftar film
function renderFilms() {
    filmList.innerHTML = ""; // Reset konten film-list
    films.forEach(film => {
        const card = document.createElement("div");
        card.className = "film-card";
        card.innerHTML = `
            <img src="${film.poster}" alt="${film.title}">
            <p>${film.title}</p>
        `;
        filmList.appendChild(card);
    });
}

// Fungsi untuk mencari film
function filterFilms() {
    const keyword = document.getElementById("search").value.toLowerCase();
    const cards = document.querySelectorAll(".film-card");
    cards.forEach(card => {
        const title = card.querySelector("p").textContent.toLowerCase();
        card.style.display = title.includes(keyword) ? "block" : "none";
    });
}

// Cek jika pengguna adalah admin berdasarkan email dan password
function isAdmin() {
    const loggedInUser = localStorage.getItem("loggedInUser");
    return loggedInUser === "admin@filmku.com";  // Hanya email admin yang bisa mengakses fitur tambah film
}

// Fungsi untuk registrasi
function register() {
    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;

    if (!email || !password) {
        alert("Email dan password tidak boleh kosong!");
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    // Cek apakah email sudah terdaftar
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
        alert("Email sudah terdaftar. Silakan login.");
        return;
    }

    // Menambahkan admin jika email admin belum ada di dalam users
    if (email === "admin@filmku.com" && password !== "admin3juli") {
        alert("Password untuk admin salah!");
        return;
    }

    users.push({ email: email, password: password });
    localStorage.setItem("users", JSON.stringify(users));

    alert("Pendaftaran berhasil!");
    showLogin();  // Kembali ke form login setelah registrasi berhasil
}

// Fungsi untuk login
function login() {
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    if (!email || !password) {
        alert("Email dan password tidak boleh kosong!");
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    const user = users.find(user => user.email === email && user.password === password);

    if (user) {
        alert("Login berhasil!");
        localStorage.setItem("loggedInUser", email);  // Simpan status login pengguna
        window.location.href = "dashboard.html";  // Arahkan ke halaman dashboard setelah login
    } else {
        alert("Email atau password salah!");
    }
}

// Fungsi untuk logout
function logout() {
    localStorage.removeItem("loggedInUser");
    alert("Logout berhasil!");
    window.location.href = "index.html";  // Kembali ke halaman login setelah logout
}

// Menampilkan form login
function showLogin() {
    document.querySelector(".login-form").style.display = "block";
    document.querySelector(".register-form").style.display = "none";
}

// Menampilkan form register
function showRegister() {
    document.querySelector(".login-form").style.display = "none";
    document.querySelector(".register-form").style.display = "block";
}

// Menampilkan form tambah film hanya jika admin login
(function checkAdmin() {
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (loggedInUser === "admin@filmku.com") {
        document.querySelector(".add-film-form").style.display = "block";  // Tampilkan form tambah film untuk admin
    }
    renderFilms();  // Tampilkan daftar film setelah login
})();