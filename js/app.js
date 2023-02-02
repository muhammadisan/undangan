let isPlay = true;
let token = '';
let audio = new Audio('assets/music/sempurna-keroncong.mp3');
const tanggal = '2023-03-01 00:00:00';

const timer = () => {
    let countDownDate = new Date(tanggal).getTime();
    let time = null;

    time = setInterval(() => {
        let distance = countDownDate - (new Date().getTime());

        if (distance < 0) {
            clearInterval(time);
            return false;
        } else {
            document.getElementById('hari').innerText = Math.floor(distance / (1000 * 60 * 60 * 24));
            document.getElementById('jam').innerText = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            document.getElementById('menit').innerText = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            document.getElementById('detik').innerText = Math.floor((distance % (1000 * 60)) / 1000);
        }
    }, 1000);
}

const buka = () => {
    document.getElementById('loading').style.display = 'none';
    audio.play();
}

const play = (btn) => {
    if (!isPlay) {
        audio.play();
        isPlay = true;
        btn.innerHTML = '<i class="fa-solid fa-circle-pause"></i>';
    } else {
        audio.pause();
        isPlay = false;
        btn.innerHTML = '<i class="fa-solid fa-circle-play"></i>';
    }
}

const renderCard = (data) => {
    const DIV = document.createElement('div');
    //DIV.classList.add('mb-3');
    DIV.setAttribute('data-aos', 'fade-up')
    DIV.innerHTML = `
    <div class="card-body bg-light shadow p-3 rounded-3 mb-3">
        <h6 class="text-dark m-0 p-0">
            <strong>${data.nama}</strong>
        </h6>
        <small class="text-dark m-0 p-0">
            ${data.created_at}
        </small>
        <hr class="text-dark mt-1 mb-2">
        <small class="text-dark mt-2 mb-1 mx-0 p-0">${data.komentar}</small>
    </div>`;
    return DIV;
};

const ucapan = async () => {
    const UCAPAN = document.getElementById('daftarucapan');
    UCAPAN.innerHTML = `<div class="text-center"><span class="spinner-border spinner-border-sm me-1"></span>Loading...</div>`;

    await fetch('https://undangan-api-gules.vercel.app/api/comment')
        .then((res) => res.json())
        .then((res) => {
            UCAPAN.innerHTML = null;
            res.data.forEach((data) => UCAPAN.appendChild(renderCard(data)));
            if (res.data.length == 0) {
                UCAPAN.innerHTML = `<div class="h6 text-center">Tidak ada data</div>`;
            }
        })
        .catch((err) => alert(err));
};

const login = async () => {
    const REQ = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: 'user@example.com',
            password: '12345678'
        })
    };

    fetch('https://undangan-api-gules.vercel.app/api/login', REQ)
        .then((res) => res.json())
        .then((res) => {
            token = res.data.token;
        })
        .catch((err) => alert(err));
};

const kirim = async () => {
    let nama = document.getElementById('formnama').value;
    let komentar = document.getElementById('formpesan').value;

    if (nama.length == 0) {
        alert('nama tidak boleh kosong');
        return;
    }

    if (komentar.length == 0) {
        alert('pesan tidak boleh kosong');
        return;
    }

    document.getElementById('kirim').disabled = true;
    document.getElementById('kirim').innerHTML = `<span class="spinner-border spinner-border-sm me-1"></span>Loading...`;

    const REQ = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
            nama: nama,
            hadir: false,
            komentar: komentar
        })
    };

    await fetch('https://undangan-api-gules.vercel.app/api/comment', REQ)
        .then((res) => res.json())
        .then((res) => {
            if (res.code == 201) {
                ucapan();
            }

            if (res.error) {
                alert(Object.values(res.error)[0]);
            }
        })
        .catch((err) => alert(err));

    document.getElementById('formnama').value = null;
    document.getElementById('formpesan').value = null;
    document.getElementById('kirim').disabled = false;
    document.getElementById('kirim').innerHTML = `Kirim<i class="fa-solid fa-paper-plane ms-1"></i>`;
};

document.addEventListener('DOMContentLoaded', () => {
    let modal = new bootstrap.Modal('#exampleModal');
    modal.show();
    //document.getElementById('loading').style.display = 'none';
    AOS.init();

    timer();
    ucapan();
    login();
});