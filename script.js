// ================= KONFIGURASI KOORDINAT =================
const CONFIG = {
    date: { x: 1160, y: 150 }, 
    year: { x: 1550, y: 160 }, 
    receiver: { x: 1020, y: 320 },
    itemsStart: { y: 800, gap: 94 },
    
    cols: { 
        qty: 260,    
        name: 450,   
        satuan: 1060,
        total: 1350  
    },
    
    grandTotal: { x: 1330, y: 2015 },

    // 🔥🔥🔥 KOORDINAT CORETAN (STRIKETHROUGH) 🔥🔥🔥
    coret: {
        // Posisi kata "Lunas" di nota
        lunas: { x: 203, y: 1980, width: 120 }, 
        
        // Posisi kata "Belum Lunas" di nota
        belum: { x: 386, y: 1980, width: 287 }  
    }
};

function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}

function generateNota(event) {
    event.preventDefault();
    console.log("Memulai proses generate...");

    const canvas = document.getElementById('canvasNota');
    const ctx = canvas.getContext('2d');
    const placeholder = document.getElementById('placeholderText');

    const image = new Image();
    image.crossOrigin = "Anonymous";
    image.src = 'assets/nota-harist.png'; 

    image.onload = function() {
        document.fonts.load('48px PaperNote').then(function() {
            
            canvas.width = image.width;
            canvas.height = image.height;
            
            // Gambar Background
            ctx.globalCompositeOperation = 'source-over';
            ctx.shadowColor = 'transparent';
            ctx.drawImage(image, 0, 0);

            // Setting Realistis
            ctx.globalCompositeOperation = 'multiply'; 
            ctx.fillStyle = '#1f2a36'; 
            ctx.globalAlpha = 0.85; 
            ctx.shadowColor = 'rgba(0, 0, 0, 0.2)'; 
            ctx.shadowBlur = 0.5; 
            ctx.shadowOffsetX = 0.5;
            ctx.shadowOffsetY = 0.5;

            // Ambil Data
            const dateVal = document.getElementById('inputTanggal').value;
            const yearVal = document.getElementById('inputTahun').value;
            const receiverVal = document.getElementById('inputKepada').value;

            // Tulis Header
            ctx.font = '48px PaperNote'; 
            ctx.fillText(dateVal, CONFIG.date.x + getRandom(-2, 2), CONFIG.date.y + getRandom(-2, 2));
            ctx.fillText(yearVal, CONFIG.year.x + getRandom(-2, 2), CONFIG.year.y + getRandom(-2, 2));
            ctx.fillText(receiverVal, CONFIG.receiver.x + getRandom(-2, 2), CONFIG.receiver.y + getRandom(-2, 2));

            // Tulis Items
            let totalAkhir = 0;

            for (let i = 1; i <= 13; i++) {
                const inputNama = document.getElementById(`item${i}`);
                const inputQty = document.getElementById(`qty${i}`);
                const inputHrg = document.getElementById(`hrg${i}`);

                if (inputNama && inputNama.value !== "") {
                    const nama = inputNama.value;
                    const harga = parseInt(inputHrg.value) || 0;
                    const qty = inputQty.value === "" ? 1 : parseInt(inputQty.value);
                    const subTotal = qty * harga;
                    totalAkhir += subTotal;

                    const currentY = CONFIG.itemsStart.y + ((i - 1) * CONFIG.itemsStart.gap);
                    const randomSize = Math.floor(getRandom(60, 70)); 
                    ctx.font = `${randomSize}px PaperNote`;

                    ctx.fillText(qty, CONFIG.cols.qty + getRandom(-5, 5), currentY + getRandom(-2, 2));
                    ctx.fillText(nama, CONFIG.cols.name + getRandom(-2, 2), currentY + getRandom(-2, 2));
                    ctx.fillText(formatRupiah(harga), CONFIG.cols.satuan + getRandom(-2, 2), currentY + getRandom(-2, 2));
                    ctx.fillText(formatRupiah(subTotal), CONFIG.cols.total + getRandom(-2, 2), currentY + getRandom(-2, 2));
                }
            }

            // Total Akhir
            ctx.font = '64px PaperNote'; 
            ctx.fillText(formatRupiah(totalAkhir), CONFIG.grandTotal.x + getRandom(-2, 2), CONFIG.grandTotal.y + getRandom(-2, 2));


            // 🔥🔥🔥 FITUR CORET STATUS LUNAS 🔥🔥🔥
            // Cek radio button mana yang dipilih
            const statusLunas = document.querySelector('input[name="statusLunas"]:checked');

            if (statusLunas) {
                ctx.beginPath();
                ctx.lineWidth = 6; // Ketebalan garis coret
                ctx.strokeStyle = '#1f2a36'; // Warna garis (sama kayak tinta)
                
                // Bikin garisnya agak miring dikit biar realistis
                const jitterY = getRandom(-5, 5); 

                if (statusLunas.value === "lunas") {
                    // Jika LUNAS, coret kata "Belum Lunas"
                    const startX = CONFIG.coret.belum.x;
                    const startY = CONFIG.coret.belum.y + jitterY;
                    const endX = startX + CONFIG.coret.belum.width;
                    const endY = startY + getRandom(-2, 2); // Miring dikit ujungnya

                    ctx.moveTo(startX, startY);
                    ctx.lineTo(endX, endY);
                } 
                else if (statusLunas.value === "belum") {
                    // Jika BELUM LUNAS, coret kata "Lunas"
                    const startX = CONFIG.coret.lunas.x;
                    const startY = CONFIG.coret.lunas.y + jitterY;
                    const endX = startX + CONFIG.coret.lunas.width;
                    const endY = startY + getRandom(-2, 2);

                    ctx.moveTo(startX, startY);
                    ctx.lineTo(endX, endY);
                }
                ctx.stroke(); // Gambar garisnya
            }

            // Reset Setting
            ctx.globalCompositeOperation = 'source-over';
            ctx.globalAlpha = 1.0;

            // Tampilkan & Download
            if(placeholder) placeholder.style.display = 'none';
            canvas.style.display = 'block';
            canvas.scrollIntoView({behavior: "smooth"});
            
            downloadImage(canvas);

        }).catch(function(error) {
            console.error("Font error:", error);
            alert("Font belum siap. Coba klik Generate sekali lagi.");
        });
    };

    image.onerror = function() {
        alert("GAGAL: Gambar 'assets/nota-harist.png' tidak ditemukan!");
    };
}

function formatRupiah(angka) {
    return angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function downloadImage(canvas) {
    try {
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        const link = document.createElement('a');
        link.download = 'nota-' + Date.now() + '.jpg';
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        const dlBtn = document.getElementById('downloadLink');
        if(dlBtn) {
            dlBtn.href = dataUrl;
            dlBtn.style.display = 'block';
        }
    } catch (e) {
        console.error(e);
    }
}