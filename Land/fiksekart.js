<!-- MAP SECTION (To kart side om side) -->
        <section class="bg-white rounded-3xl p-6 shadow-md border-4 border-emerald-400">
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
                <div>
                    <h2 class="text-2xl md:text-3xl font-bold text-emerald-600 flex items-center gap-2">
                        🗺️ Kart over Danmark
                    </h2>
                    <p class="text-gray-600 text-sm">Klikk på et av kartene for å åpne og zoome i fullskjerm!</p>
                </div>
            </div>

            <!-- Bildebeholder -->
            <div class="bg-emerald-50/50 rounded-2xl p-4 border-2 border-emerald-200 grid grid-cols-1 md:grid-cols-2 gap-4 items-center justify-items-center">
                <!-- Vanlig kart (Venstre) -->
                <div class="text-center w-full">
                    <img 
                        src="Bilder/kart_danmark.png" 
                        alt="Illustrasjonskart over Danmark" 
                        onclick="openSingleModal('Bilder/kart_danmark.png', 'Illustrasjonskart over Danmark')"
                        class="max-h-[450px] w-auto mx-auto object-contain rounded-xl shadow-md cursor-pointer hover:opacity-90 hover:scale-[1.01] transition border border-emerald-200"
                    >
                    <button 
                        onclick="openSingleModal('Bilder/kart_danmark.png', 'Illustrasjonskart over Danmark')"
                        class="text-xs font-semibold text-emerald-800 mt-2 hover:underline inline-flex items-center gap-1"
                    >
                        🔍 Åpne Illustrasjonskart
                    </button>
                </div>

                <!-- Ekte kart (Høyre) -->
                <div class="text-center w-full">
                    <img 
                        src="Bilder/kart_danmark_ekte.png" 
                        alt="Ekte kart over Danmark" 
                        onclick="openSingleModal('Bilder/kart_danmark_ekte.png', 'Geografisk kart over Danmark')"
                        class="max-h-[450px] w-auto mx-auto object-contain rounded-xl shadow-md cursor-pointer hover:opacity-90 hover:scale-[1.01] transition border border-emerald-200"
                    >
                    <button 
                        onclick="openSingleModal('Bilder/kart_danmark_ekte.png', 'Geografisk kart over Danmark')"
                        class="text-xs font-semibold text-emerald-800 mt-2 hover:underline inline-flex items-center gap-1"
                    >
                        🔍 Åpne Geografisk kart
                    </button>
                </div>
            </div>
        </section>


<!-- FULLSKJERM MODAL FOR ENKELTBILDE MED ZOOM -->
    <div 
        id="mapModal" 
        class="fixed inset-0 bg-black/90 z-50 hidden flex-col transition-opacity"
        onclick="closeModal()"
    >
        <!-- TOPPBAR (Låst på toppen) -->
        <div class="w-full bg-slate-900/90 border-b border-white/10 px-4 py-3 flex flex-wrap items-center justify-between text-white shrink-0 z-20 gap-2" onclick="event.stopPropagation()">
            <div class="flex items-center gap-3">
                <span id="modalTitle" class="text-sm md:text-base font-bold text-emerald-400">
                    Kart over Danmark
                </span>
                <span class="text-xs text-white/60 hidden sm:inline">
                    | Klikk på bildet for å veksle zoom
                </span>
            </div>

            <!-- Zoome-kontroller og Bytte av kart -->
            <div class="flex items-center gap-2">
                <!-- Bytte-knapper -->
                <button onclick="switchMap('Bilder/kart_danmark.png', 'Illustrasjonskart over Danmark')" class="bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1.5 rounded-lg text-xs font-medium transition">
                    Illustrasjon
                </button>
                <button onclick="switchMap('Bilder/kart_danmark_ekte.png', 'Geografisk kart over Danmark')" class="bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1.5 rounded-lg text-xs font-medium transition">
                    Ekte kart
                </button>

                <div class="h-4 w-[1px] bg-white/20 mx-1"></div>

                <!-- Zoom-knapper -->
                <button onclick="zoomMap(30)" class="bg-white/20 hover:bg-white/40 text-white px-3 py-1.5 rounded-lg font-bold text-xs md:text-sm transition" title="Zoom inn">
                    ➕
                </button>
                <button onclick="zoomMap(-30)" class="bg-white/20 hover:bg-white/40 text-white px-3 py-1.5 rounded-lg font-bold text-xs md:text-sm transition" title="Zoom ut">
                    ➖
                </button>
                <button onclick="resetZoom()" class="bg-white/20 hover:bg-white/40 text-white px-3 py-1.5 rounded-lg font-bold text-xs md:text-sm transition" title="Nullstill zoom">
                    ↺
                </button>
                
                <button 
                    onclick="closeModal()" 
                    class="bg-red-500 hover:bg-red-600 text-white w-8 h-8 rounded-full font-bold text-sm flex items-center justify-center transition ml-2 shadow"
                    title="Lukk fullskjerm"
                >
                    ✕
                </button>
            </div>
        </div>

<!-- BILDER-OMRÅDE MED SENTRERT ZOOM -->
        <div class="w-full h-full overflow-auto p-4 md:p-8 flex items-center justify-center" id="modalScrollArea" onclick="closeModal()">
            <div class="m-auto flex items-center justify-center p-8" onclick="event.stopPropagation()">
                <img 
                    id="singleModalImg"
                    src="" 
                    alt="Kart i fullskjerm" 
                    onclick="handleImageClick(event)"
                    class="h-auto w-auto object-contain rounded-xl shadow-2xl border-2 border-white/20 cursor-zoom-in transition-transform duration-200"
                    style="max-height: 75vh; max-width: 85vw;"
                >
            </div>
        </div>

        <!-- BUNNBAR -->
        <div class="w-full bg-slate-900/80 text-center py-2 shrink-0 border-t border-white/10">
            <p class="text-white/60 text-xs">
                Klikk på kartet for å zoome inn/ut • Trykk på bakgrunnen eller ✕ for å lukke
            </p>
        </div>
    </div>




// MODAL OG SENTRERT ZOOM MOT KLIKKPUNKT
        let zoomStep = 0; // 0 = 100%, 1 = 175%, 2 = 250%, 3 = 325%
        const MAX_STEPS = 3;

        // Skaleringsfaktorer (1.0, 1.75, 2.5, 3.25)
        const ZOOM_LEVELS = [1, 1.75, 2.5, 3.25]; 

        function openSingleModal(imgSrc, titleText) {
            const modal = document.getElementById('mapModal');
            const img = document.getElementById('singleModalImg');
            const title = document.getElementById('modalTitle');

            if (img && title && modal) {
                img.src = imgSrc;
                title.textContent = titleText;
                modal.classList.remove('hidden');
                modal.classList.add('flex');
                resetZoom();
            }
        }

        function switchMap(imgSrc, titleText) {
            const img = document.getElementById('singleModalImg');
            const title = document.getElementById('modalTitle');
            if (img && title) {
                img.src = imgSrc;
                title.textContent = titleText;
                resetZoom();
            }
        }

        function closeModal() {
            const modal = document.getElementById('mapModal');
            if (modal) {
                modal.classList.remove('flex');
                modal.classList.add('hidden');
                resetZoom();
            }
        }

        function resetZoom() {
            zoomStep = 0;
            applyZoomStyles();
            
            const scrollArea = document.getElementById('modalScrollArea');
            if (scrollArea) {
                scrollArea.scrollLeft = 0;
                scrollArea.scrollTop = 0;
            }
        }

        function handleImageClick(event) {
            event.stopPropagation(); // Unngå at modalen lukker seg

            // Hvis vi er på maks zoom (Trinn 3 / 325%), nullstill tilbake til start
            if (zoomStep >= MAX_STEPS) {
                resetZoom();
                return;
            }

            const img = document.getElementById('singleModalImg');
            const scrollArea = document.getElementById('modalScrollArea');
            if (!img || !scrollArea) return;

            const imgRect = img.getBoundingClientRect();

            // Klikkets posisjon som en uendret prosentandel (0.0 til 1.0) av bildet
            const clickRatioX = (event.clientX - imgRect.left) / imgRect.width;
            const clickRatioY = (event.clientY - imgRect.top) / imgRect.height;

            executeZoomStep(zoomStep + 1, clickRatioX, clickRatioY);
        }

        function zoomMap(direction) {
            // Brukes hvis brukeren trykker på + / - knappene
            const targetStep = zoomStep + direction;
            executeZoomStep(targetStep, 0.5, 0.5); // Sentrerer på midten av bildet
        }

        function executeZoomStep(nextStep, ratioX, ratioY) {
            const scrollArea = document.getElementById('modalScrollArea');
            const img = document.getElementById('singleModalImg');
            const oldStep = zoomStep;

            zoomStep = Math.min(Math.max(nextStep, 0), MAX_STEPS);

            if (oldStep === zoomStep || !scrollArea || !img) return;

            // Oppdater bildeskaleringen
            applyZoomStyles();

            // Vent til nettleseren har oppdatert bildestørrelsen i DOM
            requestAnimationFrame(() => {
                const imgRect = img.getBoundingClientRect();
                const scrollRect = scrollArea.getBoundingClientRect();

                // Finner hvor det valgte punktet på bildet befinner seg i forhold til scroll-innholdet
                const targetXOnScroll = (imgRect.left - scrollRect.left + scrollArea.scrollLeft) + (imgRect.width * ratioX);
                const targetYOnScroll = (imgRect.top - scrollRect.top + scrollArea.scrollTop) + (imgRect.height * ratioY);

                // Beregn ny rulleposisjon for å plassere target-punktet midt i visningsområdet
                const newScrollLeft = targetXOnScroll - (scrollArea.clientWidth / 2);
                const newScrollTop = targetYOnScroll - (scrollArea.clientHeight / 2);

                scrollArea.scrollTo({
                    left: Math.max(0, newScrollLeft),
                    top: Math.max(0, newScrollTop),
                    behavior: 'smooth'
                });
            });
        }

        function applyZoomStyles() {
            const img = document.getElementById('singleModalImg');
            if (!img) return;

            const scale = ZOOM_LEVELS[zoomStep];

            // Skaler bildet fra midten
            img.style.transform = `scale(${scale})`;
            img.style.transformOrigin = 'center center';

            // Oppdater musepekeren
            if (zoomStep >= MAX_STEPS) {
                img.classList.remove('cursor-zoom-in');
                img.classList.add('cursor-zoom-out');
            } else {
                img.classList.remove('cursor-zoom-out');
                img.classList.add('cursor-zoom-in');
            }
        }

        // Lukk på Escape
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                closeModal();
            }
        });
