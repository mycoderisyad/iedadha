# Game Idul Adha - Pixel Adventure 🗡️

Game web interaktif 2D dengan style pixel art untuk merayakan Idul Adha. Mainkan sebagai penyembelih yang mengejar kambing untuk qurban!

## 🎮 Fitur Game

- **Animasi Karakter**: Penyembelih dengan golok dan kambing yang bergerak
- **AI Kambing**: Kambing akan lari ketika pemain mendekat
- **Sound Takbiran**: Background music dengan melodi takbir
- **Efek Partikel**: Animasi celebration saat berhasil menangkap kambing
- **Background Islami**: Tema visual khas Idul Adha dengan masjid
- **Responsive Design**: Kompatibel dengan mobile dan desktop
- **Settings System**: Pengaturan audio, visual, dan gameplay
- **Statistics**: Tracking skor dan statistik permainan

### Cara Bermain

1. **Kontrol**:
   - `Arrow Keys` atau `WASD` untuk bergerak
   - `Spasi` untuk memulai game
   - Klik tombol `MULAI GAME` untuk memulai
   - Mobile controls tersedia untuk perangkat sentuh

2. **Gameplay**:
   - Kejar kambing putih dengan karakter penyembelih
   - Kambing akan lari ketika Anda mendekat (radius merah)
   - Sentuh kambing untuk menangkapnya
   - Semakin cepat menangkap, semakin tinggi skor dan combo
   - Kumpulkan power-ups untuk bonus speed dan poin
   - Game berlangsung sesuai durasi yang dipilih (default 60 detik)

3. **Scoring**:
   - 100 poin per kambing + bonus waktu + bonus combo
   - Bonus waktu = sisa detik × 10
   - Bonus combo = level combo × 25

## Cara Menjalankan

### Method 1: Buka Langsung di Browser
1. Download semua file dan folder
2. Buka file `index.html` di browser modern (Chrome, Firefox, Safari, Edge)
3. Klik tombol "MULAI GAME" atau tekan Spasi

### Method 2: Local Server (Direkomendasikan)
```bash
# Jika punya Python 3
python -m http.server 8000

# Jika punya Node.js
npx serve .

# Jika punya PHP
php -S localhost:8000
```
Kemudian buka `http://localhost:8000` di browser.

## 🏗Arsitektur Code

### Core Components
- **Game.js**: Main game engine yang mengatur game loop dan koordinasi antar komponen
- **GameConfig.js**: Konfigurasi terpusat untuk semua konstanta dan pengaturan
- **BackgroundRenderer.js**: Khusus untuk rendering background dan lingkungan

### Entity System
- **Player.js**: Logika dan rendering karakter pemain
- **Goat.js**: AI dan rendering kambing dengan berbagai state

### Manager Pattern
- **SettingsManager.js**: Mengelola pengaturan, localStorage, dan statistik
- **AudioManager.js**: Menangani semua aspek audio termasuk Web Audio API
- **InputManager.js**: Centralized input handling untuk keyboard dan mobile
- **UIManager.js**: Mengelola semua aspek UI dan text rendering

### Effect System
- **ParticleSystem.js**: Sistem partikel, power-ups, dan bintang background


## 🎵 Audio

Game menggunakan Web Audio API untuk menghasilkan melodi takbiran sederhana. Browser modern mendukung fitur ini, namun beberapa browser mungkin memerlukan interaksi user terlebih dahulu.


## 🎊 Selamat Idul Adha!

Game ini dibuat untuk merayakan hari raya Idul Adha dengan cara yang menyenangkan dan interaktif. Dengan struktur code yang rapi dan modular, game ini mudah untuk dikembangkan dan dimaintenance.

**Takbir: Allahu Akbar! Allahu Akbar! Allahu Akbar!** 

---

*Game ini dibuat dengan semangat merayakan Idul Adha dan tidak bermaksud menyinggung nilai-nilai agama.* 
