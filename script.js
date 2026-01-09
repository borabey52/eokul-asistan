(function() {
    // Panel zaten açıksa tekrar açma, uyar
    if (document.getElementById('gemini-panel-container')) {
        alert('Panel zaten açık.');
        return;
    }

    // 1. Arayüzü Oluştur (HTML & CSS)
    const panel = document.createElement('div');
    panel.id = 'gemini-panel-container';
    panel.innerHTML = `
        <div style="position: fixed; top: 100px; right: 20px; width: 260px; background: #fff; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.3); z-index: 10000; font-family: 'Segoe UI', sans-serif; overflow: hidden; border: 1px solid #ddd;">
            <div style="background: #2c3e50; color: white; padding: 15px; display: flex; justify-content: space-between; align-items: center;">
                <span style="font-weight: bold; font-size: 14px;">🎓 MEB Asistanı</span>
                <span onclick="document.getElementById('gemini-panel-container').remove()" style="cursor: pointer; font-size: 20px;">&times;</span>
            </div>
            
            <div style="padding: 15px;">
                <p style="margin: 0 0 10px 0; font-size: 12px; color: #7f8c8d;">Sınıf genel durumu nasıl?</p>
                
                <button onclick="window.geminiDoldur('4')" style="width: 100%; padding: 10px; margin-bottom: 8px; border: none; border-radius: 6px; background: #27ae60; color: white; cursor: pointer; font-weight: 500; transition: 0.2s;">Hepsini "Çok İyi" (4)</button>
                <button onclick="window.geminiDoldur('3')" style="width: 100%; padding: 10px; margin-bottom: 8px; border: none; border-radius: 6px; background: #2980b9; color: white; cursor: pointer; font-weight: 500; transition: 0.2s;">Hepsini "İyi" (3)</button>
                <button onclick="window.geminiDoldur('karisik')" style="width: 100%; padding: 10px; margin-bottom: 15px; border: none; border-radius: 6px; background: #8e44ad; color: white; cursor: pointer; font-weight: 500; transition: 0.2s;">✨ Dengeli Dağıt (Önerilen)</button>
                
                <div style="border-top: 1px solid #eee; padding-top: 10px;">
                    <label style="display: flex; align-items: center; font-size: 13px; color: #34495e; cursor: pointer;">
                        <input type="checkbox" id="oto-kaydet" style="margin-right: 8px; transform: scale(1.2);"> 
                        İşlem bitince kaydet
                    </label>
                </div>
            </div>
            <div style="background: #f8f9fa; padding: 8px; text-align: center; font-size: 10px; color: #bdc3c7;">
                v1.0 • Öğretmen Dostu
            </div>
        </div>
    `;
    document.body.appendChild(panel);

    // 2. İşlev Fonksiyonları
    window.geminiDoldur = function(seviye) {
        const groups = {};
        // Tüm radyo butonlarını topla
        const allRadios = document.querySelectorAll('input[type="radio"]');
        
        // Butonları soru ismine (name) göre grupla
        allRadios.forEach(radio => {
            if(radio.name && radio.type === 'radio') {
                if (!groups[radio.name]) groups[radio.name] = [];
                groups[radio.name].push(radio);
            }
        });

        // Her grup (soru) için işlem yap
        let islemSayisi = 0;
        for (let groupName in groups) {
            let hedefDeger;
            
            if (seviye === 'karisik') {
                // Rastgelelik mantığı: %10 Orta, %40 İyi, %50 Çok İyi
                const sans = Math.random();
                if (sans < 0.10) hedefDeger = "2";
                else if (sans < 0.50) hedefDeger = "3";
                else hedefDeger = "4";
            } else {
                hedefDeger = seviye;
            }

            // İlgili butonu bul ve işaretle
            groups[groupName].forEach(radio => {
                if (radio.value == hedefDeger) {
                    radio.click(); // .checked = true yerine .click() kullanmak bazen daha tetikleyicidir
                    islemSayisi++;
                }
            });
        }

        // Kullanıcıya bilgi ver
        /* İsteğe bağlı console.log("Toplam " + islemSayisi + " kutucuk işaretlendi."); */

        // Kaydetme işlemi
        if (document.getElementById('oto-kaydet').checked) {
            // Kaydet butonunu bulmaya çalış (Genellikle onclick içinde 'Kaydet' geçer veya title'ı vardır)
            const kaydetBtn = document.querySelector('a[onclick*="Kaydet"]') || 
                              document.querySelector('input[value="Kaydet"]') ||
                              document.querySelector('.btn-success'); // Olası buton sınıfları
            
            if (kaydetBtn) {
                setTimeout(() => {
                    kaydetBtn.click();
                }, 500); // İşaretlemeden yarım saniye sonra bas
            } else {
                alert("İşaretleme bitti ama 'Kaydet' butonu otomatik bulunamadı. Lütfen elle kaydediniz.");
            }
        }
    };
})();