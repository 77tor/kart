/**
 * fakta.js - Geografiske data for land i og utenfor Europa
 * Inneholder de 3 høyeste toppene, 3 lengste elvene og 3 største innsjøene per land.
 */

// Mapping fra alle godkjente nøkler/koder til hovednøkkel (ISO 3-bokstavs kode)
const landAliasMap = {
  'ALB': 'ALB', 'albania': 'ALB',
  'AND': 'AND', 'andorra': 'AND',
  'AUT': 'AUT', 'austria': 'AUT',
  'BEL': 'BEL', 'belgium': 'BEL',
  'BGR': 'BGR', 'bulgaria': 'BGR',
  'BIH': 'BIH', 'bosnia and herzegovina': 'BIH', 'bosnia-hercegovina': 'BIH',
  'BLR': 'BLR', 'belarus': 'BLR', 'hviterussland': 'BLR',
  'CHE': 'CHE', 'switzerland': 'CHE', 'sveits': 'CHE',
  'CYP': 'CYP', 'cyprus': 'CYP', 'kypros': 'CYP',
  'CZE': 'CZE', 'czech republic': 'CZE', 'czechia': 'CZE', 'tsjekkia': 'CZE',
  'DEU': 'DEU', 'germany': 'DEU', 'tyskland': 'DEU',
  'DNK': 'DNK', 'denmark': 'DNK', 'danmark': 'DNK',
  'ESP': 'ESP', 'spain': 'ESP', 'spania': 'ESP',
  'EST': 'EST', 'estonia': 'EST', 'estland': 'EST',
  'FIN': 'FIN', 'finland': 'FIN',
  'FRA': 'FRA', 'france': 'FRA', 'frankrike': 'FRA',
  'GBR': 'GBR', 'united kingdom': 'GBR', 'storbritannia': 'GBR',
  'GEO': 'GEO', 'georgia': 'GEO',
  'GRC': 'GRC', 'greece': 'GRC', 'hellas': 'GRC',
  'HRV': 'HRV', 'croatia': 'HRV', 'kroatia': 'HRV',
  'HUN': 'HUN', 'hungary': 'HUN', 'ungarn': 'HUN',
  'IRL': 'IRL', 'ireland': 'IRL', 'irland': 'IRL',
  'ISL': 'ISL', 'iceland': 'ISL', 'island': 'ISL',
  'ITA': 'ITA', 'italy': 'ITA', 'italia': 'ITA',
  'KOS': 'KOS', 'kosovo': 'KOS',
  'LIE': 'LIE', 'liechtenstein': 'LIE',
  'LTU': 'LTU', 'lithuania': 'LTU', 'litauen': 'LTU',
  'LUX': 'LUX', 'luxembourg': 'LUX',
  'LVA': 'LVA', 'latvia': 'LVA', 'letland': 'LVA',
  'MCO': 'MCO', 'monaco': 'MCO',
  'MDA': 'MDA', 'moldova': 'MDA',
  'MKD': 'MKD', 'macedonia': 'MKD', 'north macedonia': 'MKD', 'nord-makedonia': 'MKD',
  'MLT': 'MLT', 'malta': 'MLT',
  'MNE': 'MNE', 'montenegro': 'MNE',
  'NLD': 'NLD', 'netherlands': 'NLD', 'nederland': 'NLD',
  'NOR': 'NOR', 'norway': 'NOR', 'norge': 'NOR',
  'POL': 'POL', 'poland': 'POL', 'polen': 'POL',
  'PRT': 'PRT', 'portugal': 'PRT',
  'ROU': 'ROU', 'romania': 'ROU',
  'RUS': 'RUS', 'russia': 'RUS', 'russland': 'RUS',
  'RUS-ASIA': 'RUS-ASIA', 'russland (asia)': 'RUS-ASIA',
  'SMR': 'SMR', 'san marino': 'SMR',
  'SRB': 'SRB', 'serbia': 'SRB',
  'SVK': 'SVK', 'slovakia': 'SVK',
  'SVN': 'SVN', 'slovenia': 'SVN',
  'SWE': 'SWE', 'sweden': 'SWE', 'sverige': 'SWE',
  'UKR': 'UKR', 'ukraine': 'UKR', 'ukraina': 'UKR',
  'VAT': 'VAT', 'vatican city': 'VAT', 'vatikanstaten': 'VAT',
  'ARM': 'ARM', 'armenia': 'ARM',
  'AZE': 'AZE', 'azerbaijan': 'AZE', 'aserbajdsjan': 'AZE',
  'KAZ': 'KAZ', 'kazakhstan': 'KAZ', 'kasakhstan': 'KAZ',
  'TUR': 'TUR', 'turkey': 'TUR', 'tyrkia': 'TUR',

  // Nye land som er lagt til
  'USA': 'USA', 'united states': 'USA', 'united states of america': 'USA', 'usa': 'USA',
  'CAN': 'CAN', 'canada': 'CAN',
  'BRA': 'BRA', 'brazil': 'BRA', 'brasil': 'BRA',
  'ARG': 'ARG', 'argentina': 'ARG',
  'CHN': 'CHN', 'china': 'CHN', 'kina': 'CHN',
  'IND': 'IND', 'india': 'IND',
  'IRN': 'IRN', 'iran': 'IRN',
  'IRQ': 'IRQ', 'iraq': 'IRQ', 'irak': 'IRQ',
  'JPN': 'JPN', 'japan': 'JPN',
  'BGD': 'BGD', 'bangladesh': 'BGD',
  'AUS': 'AUS', 'australia': 'AUS',
  'NZL': 'NZL', 'new zealand': 'NZL',
  'THA': 'THA', 'thailand': 'THA',
  'PAK': 'PAK', 'pakistan': 'PAK',
  'EGY': 'EGY', 'egypt': 'EGY',
  'MAR': 'MAR', 'morocco': 'MAR', 'marokko': 'MAR',
  'ZAF': 'ZAF', 'south africa': 'ZAF', 'sør-afrika': 'ZAF', 'sor-afrika': 'ZAF'
};

// Hoveddatabank med geografiske fakta for hvert land
const faktaData = {
  'ALB': {
    land: 'Albania',
    topper: ['Korab (2764 m)', 'Maja Jezercë (2694 m)', 'Maja e Popllukës (2569 m)'],
    elver: ['Drin (285 km)', 'Vjosë (272 km)', 'Devoll (196 km)'],
    innsjoer: ['Skadarsjøen', 'Ohridsjøen', 'Prespasjøen']
  },
  'AND': {
    land: 'Andorra',
    topper: ['Coma Pedrosa (2942 m)', 'Roca Entravessada (2928 m)', 'Pic de l\'Estany BANYELL (2915 m)'],
    elver: ['Gran Valira (35 km)', 'Valira del Nord (14 km)', 'Valira d\'Orient (24 km)'],
    innsjoer: ['Estany de Juclar', 'Estanys de Tristaina', 'Estany de Engolasters']
  },
  'ARM': {
    land: 'Armenia',
    topper: ['Aragats (4090 m)', 'Kaputjugh (3905 m)', 'Azhdahak (3597 m)'],
    elver: ['Araks (1072 km)', 'Akhurian (186 km)', 'Vorotan (178 km)'],
    innsjoer: ['Sevansjøen', 'Arpi', 'Kari']
  },
  'AUT': {
    land: 'Østerrike',
    topper: ['Großglockner (3798 m)', 'Wildspitze (3768 m)', 'Weisskugel (3738 m)'],
    elver: ['Donau (350 km i Østerrike)', 'Mur (348 km)', 'Inntal/Inn (280 km i Østerrike)'],
    innsjoer: ['Neusiedlersjøen', 'Attersee', 'Traunsee']
  },
  'AZE': {
    land: 'Aserbajdsjan',
    topper: ['Bazardüzü (4466 m)', 'Shahdagh (4243 m)', 'Tufandag (4191 m)'],
    elver: ['Kura (1515 km)', 'Aras (1072 km)', 'Alazani (390 km)'],
    innsjoer: ['Kaspihavet', 'Mingachevir-reservoaret', 'Sarysu']
  },
  'BEL': {
    land: 'Belgia',
    topper: ['Signal de Botrange (694 m)', 'Weisser Stein (693 m)', 'Baraque Michel (674 m)'],
    elver: ['Meuse / Maas (925 km tot.)', 'Schelde (350 km tot.)', 'Yser (78 km tot.)'],
    innsjoer: ['Eau d\'Heure-innsjøene', 'Gileppe-innsjøen', 'Bütgenbach-innsjøen']
  },
  'BGR': {
    land: 'Bulgaria',
    topper: ['Musala (2925 m)', 'Vihren (2914 m)', 'Kutelo (2908 m)'],
    elver: ['Donau (470 km i BG)', 'Iskar (368 km)', 'Tundzha (350 km i BG)'],
    innsjoer: ['Iskar-reservoaret', 'Burgassjøen', 'Varnasjøen']
  },
  'BIH': {
    land: 'Bosnia-Hercegovina',
    topper: ['Maglić (2386 m)', 'Volujak (2337 m)', 'Čvrsnica (2228 m)'],
    elver: ['Drina (346 km)', 'Sava (945 km tot.)', 'Neretva (225 km)'],
    innsjoer: ['Buško Blato', 'Balašjøen', 'Prokoško-sjøen']
  },
  'BLR': {
    land: 'Hviterussland',
    topper: ['Dzyarzhynskaya Hara (345 m)', 'Hara Svyataja (332 m)', 'Lysa-fjellet (312 m)'],
    elver: ['Dnjepr (2145 km tot.)', 'Neman (937 km tot.)', 'Pripjat (775 km tot.)'],
    innsjoer: ['Naratsj', 'Asveja', 'Cvyadas']
  },
  'CHE': {
    land: 'Sveits',
    topper: ['Dufourspitze (4634 m)', 'Dom (4545 m)', 'Liskamm (4533 m)'],
    elver: ['Rinen (375 km i CH)', 'Aare (295 km)', 'Rhône (264 km i CH)'],
    innsjoer: ['Genfersjøen (Lac Léman)', 'Sveitsersjøen (Vierwaldstättersjøen)', 'Zürichsjøen']
  },
  'CYP': {
    land: 'Kypros',
    topper: ['Olympos (1952 m)', 'Tripylos (1362 m)', 'Kionia (1423 m)'],
    elver: ['Pedieos (98 km)', 'Yialias (88 km)', 'SeraChis (55 km)'],
    innsjoer: ['Larnaka saltsjø', 'Limassol saltsjø', 'Kouris-reservoaret']
  },
  'CZE': {
    land: 'Tsjekkia',
    topper: ['Sněžka (1603 m)', 'Luční hora (1555 m)', 'Studniční hora (1554 m)'],
    elver: ['Vltava (Moldau) (430 km)', 'Elben (Labe) (370 km i CZ)', 'Morava (269 km i CZ)'],
    innsjoer: ['Lipno-reservoaret', 'Černé jezero', 'Kamencové jezero']
  },
  'DEU': {
    land: 'Tyskland',
    topper: ['Zugspitze (2962 m)', 'Hochwanner (2744 m)', 'Watzmann (2713 m)'],
    elver: ['Rinen (865 km i DE)', 'Elben (727 km i DE)', 'Donau (647 km i DE)'],
    innsjoer: ['Bodensjøen', 'Müritz', 'Chiemsee']
  },
  'DNK': {
    land: 'Danmark',
    topper: ['Møllehøj (170.8 m)', 'Yding Skovhøj (170.7 m)', 'Ejer Bavnehøj (170.3 m)'],
    elver: ['Gudenåen (149 km)', 'Varde Å (100 km)', 'Skjern Å (94 km)'],
    innsjoer: ['Arresø', 'Esrum Sø', 'Mossø']
  },
  'ESP': {
    land: 'Spania',
    topper: ['Teide (3715 m - Kanariøyene)', 'Mulhacén (3479 m - Fastlandet)', 'Aneto (3404 m)'],
    elver: ['Tajo (1007 km tot.)', 'Ebro (910 km)', 'Duero (897 km tot.)'],
    innsjoer: ['Sanabria-sjøen', 'Albufera de Valencia', 'Covadonga-innsjøene']
  },
  'EST': {
    land: 'Estland',
    topper: ['Suur Munamägi (318 m)', 'Vällamägi (304 m)', 'Kuutsemägi (217 m)'],
    elver: ['Võhandu (162 km)', 'Pärnu (144 km)', 'Põltsamaa (135 km)'],
    innsjoer: ['Peipus (Peipsi)', 'Võrtsjärv', 'Narva-reservoaret']
  },
  'FIN': {
    land: 'Finland',
    topper: ['Halti (1324 m)', 'Ridnitšohkka (1317 m)', 'Kiedditsohkka (1280 m)'],
    elver: ['Kemijoki (550 km)', 'Iijoki (370 km)', 'Ounasjoki (299 km)'],
    innsjoer: ['Saimaa', 'Päijänne', 'Inarisjøen']
  },
  'FRA': {
    land: 'Frankrike',
    topper: ['Mont Blanc (4806 m)', 'Mont Maudit (4465 m)', 'Dôme du Goûter (4304 m)'],
    elver: ['Loire (1006 km)', 'Seine (777 km)', 'Garonne (522 km i FR)'],
    innsjoer: ['Genfersjøen (Lac Léman - fransk del)', 'Lac du Bourget', 'Lac d\'Annecy']
  },
  'GBR': {
    land: 'Storbritannia',
    topper: ['Ben Nevis (1345 m)', 'Ben Macdui (1309 m)', 'Braeriach (1296 m)'],
    elver: ['Severn (354 km)', 'Themsen (346 km)', 'Trent (297 km)'],
    innsjoer: ['Loch Neagh', 'Loch Lomond', 'Loch Ness']
  },
  'GEO': {
    land: 'Georgia',
    topper: ['Shkhara (5200 m)', 'Janga (5059 m)', 'Kazbek (5054 m)'],
    elver: ['Kura / Mtkvari (1515 km tot.)', 'Rioni (327 km)', 'Enguri (213 km)'],
    innsjoer: ['Paravani', 'Tabatskuri', 'Paliastomi']
  },
  'GRC': {
    land: 'Hellas',
    topper: ['Olympos / Mytikas (2917 m)', 'Smolikas (2637 m)', 'Kaimaktsalan (2524 m)'],
    elver: ['Aliakmon (297 km)', 'Achelous (220 km)', 'Peneus (216 km)'],
    innsjoer: ['Trichonida', 'Volvi', 'Vegoritida']
  },
  'HRV': {
    land: 'Kroatia',
    topper: ['Dinara / Sinjal (1831 m)', 'Kamešnica (1810 m)', 'Sveti Jure (1762 m)'],
    elver: ['Sava (562 km i HR)', 'Drava (505 km i HR)', 'Kupa (296 km)'],
    innsjoer: ['Vransko jezero', 'Prokljansko jezero', 'Plitvice-innsjøene']
  },
  'HUN': {
    land: 'Ungarn',
    topper: ['Kékes (1014 m)', 'Galyatető (964 m)', 'Istállós-kő (959 m)'],
    elver: ['Tisza (597 km i HU)', 'Donau (417 km i HU)', 'Körös (218 km)'],
    innsjoer: ['Balatonsjøen', 'Velence-sjøen', 'Tisza-sjøen']
  },
  'IRL': {
    land: 'Irland',
    topper: ['Carrauntoohil (1038 m)', 'Beenkeragh (1010 m)', 'Caher (1001 m)'],
    elver: ['Shannon (360 km)', 'Barrow (192 km)', 'Suir (184 km)'],
    innsjoer: ['Lough Corrib', 'Lough Derg', 'Lough Ree']
  },
  'ISL': {
    land: 'Island',
    topper: ['Hvannadalshnúkur (2110 m)', 'Bárðarbunga (2009 m)', 'Kverkfjöll (1920 m)'],
    elver: ['Þjórsá (230 km)', 'Jökulsá á Fjöllum (206 km)', 'Ölfusá (185 km)'],
    innsjoer: ['Þingvallavatn', 'Þórisvatn', 'Lögurinn']
  },
  'ITA': {
    land: 'Italia',
    topper: ['Monte Bianco / Mont Blanc (4808 m)', 'Monte Rosa (4634 m)', 'Gran Paradiso (4061 m)'],
    elver: ['Po (652 km)', 'Adige (410 km)', 'Tiberen (405 km)'],
    innsjoer: ['Gardasjøen', 'Maggioresjøen', 'Comosjøen']
  },
  'KAZ': {
    land: 'Kasakhstan',
    topper: ['Khan Tengri (7010 m)', 'Peak Talgar (4979 m)', 'Mt. Belukha (4506 m)'],
    elver: ['Irtysj (4248 km tot.)', 'Ishim (2450 km tot.)', 'Ural (2428 km tot.)'],
    innsjoer: ['Kaspihavet', 'Balkhasjsjøen', 'Aralsjøen']
  },
  'KOS': {
    land: 'Kosovo',
    topper: ['Gjeravica (2656 m)', 'Rudoka (2658 m)', 'Marijaš (2533 m)'],
    elver: ['Hvite Drin (122 km i KS)', 'Sitnica (90 km)', 'Ibar (85 km i KS)'],
    innsjoer: ['Gazivoda-reservoaret', 'Radoniq', 'Batlava']
  },
  'LIE': {
    land: 'Liechtenstein',
    topper: ['Grauspitz (2599 m)', 'Hinter Grauspitz (2574 m)', 'Naafkopf (2570 m)'],
    elver: ['Rinen (27 km i FL)', 'Samina (12 km)', 'Sammelkanal'],
    innsjoer: ['Gampriner Seelein (Eneste naturlig innsjø)', 'Steg-reservoaret', 'Guschg']
  },
  'LTU': {
    land: 'Litauen',
    topper: ['Aukštojas Hill (294 m)', 'Juozapinė Hill (293 m)', 'Kruopinė Hill (293 m)'],
    elver: ['Neman / Nemunas (937 km tot.)', 'Neris (510 km tot.)', 'Venta (346 km tot.)'],
    innsjoer: ['Drūkšiai', 'Dusia', 'Asveja']
  },
  'LUX': {
    land: 'Luxembourg',
    topper: ['Kneiff (560 m)', 'Burgplatz (559 m)', 'Napoleonsgaard (554 m)'],
    elver: ['Sauer (173 km)', 'Alzette (73 km)', 'Mosel (37 km i LU)'],
    innsjoer: ['Haute-Sûre-reservoaret', 'Echternach-sjøen', 'Remerschen-innsjøene']
  },
  'LVA': {
    land: 'Letland',
    topper: ['Gaiziņkalns (312 m)', 'Sisenis (289 m)', 'Lielais Liepukalns (289 m)'],
    elver: ['Daugava (1020 km tot.)', 'Gauja (452 km)', 'Venta (346 km tot.)'],
    innsjoer: ['Lūbanas', 'Rāznas', 'Engures']
  },
  'MCO': {
    land: 'Monaco',
    topper: ['Chemin des Révoires (161 m)', 'Mont Agel slope (140 m)', 'Exotic Garden (120 m)'],
    elver: ['Ingen permanente elver (Kystlinje mot Middelhavet)', '-', '-'],
    innsjoer: ['Ingen naturlige eller store innsjøer', '-', '-']
  },
  'MDA': {
    land: 'Moldova',
    topper: ['Bălănești-åsen (430 m)', 'Veverița (407 m)', 'Măgura (389 m)'],
    elver: ['Dnjestr (1362 km tot.)', 'Prut (953 km tot.)', 'Răut (286 km)'],
    innsjoer: ['Dubăsari-reservoaret', 'Beleu', 'Manta']
  },
  'MKD': {
    land: 'Nord-Makedonia',
    topper: ['Korab (2764 m)', 'Titov Vrv (2748 m)', 'Turcin (2702 m)'],
    elver: ['Vardar (388 km tot.)', 'Svarte Drin (177 km tot.)', 'Bregalnica (225 km)'],
    innsjoer: ['Ohridsjøen', 'Prespasjøen', 'Dojransjøen']
  },
  'MLT': {
    land: 'Malta',
    topper: ['Ta\' Dmejrek / Dingli Cliffs (253 m)', 'Ta\' Zuta (240 m)', 'Tas-Salvatur (160 m)'],
    elver: ['Wied il-Għasri (Sesongbekk)', 'Wied il-Għasri', 'Wied il-Mela'],
    innsjoer: ['Chadwick Lakes (Kunstige reservoarer)', 'L-Għadira', 'Simar']
  },
  'MNE': {
    land: 'Montenegro',
    topper: ['Zla Kolata (2534 m)', 'Maja Kolata (2528 m)', 'Bobotov Kuk (2523 m)'],
    elver: ['Tara (146 km)', 'Lim (220 km tot.)', 'Zeta (65 km)'],
    innsjoer: ['Skadarsjøen', 'Piva-reservoaret', 'Crno jezero (Den svarte sjø)']
  },
  'NLD': {
    land: 'Nederland',
    topper: ['Mount Scenery (887 m - Karibia)', 'Vaalserberg (322 m - Fastlandet)', 'Gulperberg (156 m)'],
    elver: ['Rinen (1233 km tot.)', 'Maas (925 km tot.)', 'IJssel (125 km)'],
    innsjoer: ['IJsselmeer', 'Markermeer', 'Gooimeer']
  },
  'NOR': {
    land: 'Norge',
    topper: ['Galdhøpiggen (2469 m)', 'Glittertind (2465 m)', 'Store Skagastølstind (2405 m)'],
    elver: ['Glomma (623 km)', 'Pasvikelva (145 km i NO)', 'Numedalslågen (352 km)'],
    innsjoer: ['Mjøsa', 'Røssvatnet', 'Femunden']
  },
  'POL': {
    land: 'Polen',
    topper: ['Rysy (2499 m)', 'Mięguszowiecki Szczyt (2438 m)', 'Niezgoda (2393 m)'],
    elver: ['Vistula / Wisła (1047 km)', 'Oder / Odra (854 km tot.)', 'Warta (808 km)'],
    innsjoer: ['Śniardwy', 'Mamry', 'Łebsko']
  },
  'PRT': {
    land: 'Portugal',
    topper: ['Pico (1935 m - Azorene)', 'Torra / Serra da Estrela (1993 m - Fastlandet)', 'Pico Ruivo (1861 m - Madeira)'],
    elver: ['Tajo / Tejo (1007 km tot.)', 'Douro (897 km tot.)', 'Guadiana (818 km tot.)'],
    innsjoer: ['Alqueva-reservoaret', 'Lagoa das Sete Cidades', 'Lagoa Fogo']
  },
  'ROU': {
    land: 'Romania',
    topper: ['Moldoveanu (2544 m)', 'Negoiu (2535 m)', 'Viștea Mare (2527 m)'],
    elver: ['Donau (1075 km i RO)', 'Mureș (761 km)', 'Prut (953 km tot.)'],
    innsjoer: ['Razelm', 'Sinoe', 'Bicaz-reservoaret']
  },
  'RUS': {
    land: 'Russland',
    topper: ['Elbrus (5642 m)', 'Dykh-Tau (5205 m)', 'Pushkin Peak (5100 m)'],
    elver: ['Volga (3530 km)', 'Don (1870 km)', 'Pechora (1809 km)'],
    innsjoer: ['Ladoga', 'Onega', 'Kujbysjev-reservoaret']
  },
  'RUS-ASIA': {
    land: 'Russland (Asia)',
    topper: ['Kljutsjevskaia Sopka (4750 m)', 'Belukha (4506 m)', 'Koryaksky (3456 m)'],
    elver: ['Jenisej (4097 km)', 'Ob (3650 km)', 'Lena (4294 km)'],
    innsjoer: ['Bajkalsjøen', 'Taimyrsjøen', 'Khantayskoyesjøen']
  },
  'SMR': {
    land: 'San Marino',
    topper: ['Monte Titano (739 m)', 'Monte Carlo (559 m)', 'Monte Pennarossa (512 m)'],
    elver: ['San Marino (8.7 km)', 'Ausa (17 km tot.)', 'Marano (16 km tot.)'],
    innsjoer: ['Ingen naturlige innsjøer', '-', '-']
  },
  'SRB': {
    land: 'Serbia',
    topper: ['Midžor (2169 m)', 'Dupljak (2032 m)', 'Pančićev vrh (2017 m)'],
    elver: ['Donau (588 km i RS)', 'Sava (206 km i RS)', 'Velika Morava (185 km)'],
    innsjoer: ['Đerdap-sjøen (Iron Gate)', 'Vlasina-sjøen', 'Perućac']
  },
  'SVK': {
    land: 'Slovakia',
    topper: ['Gerlachovský štít (2655 m)', 'Lomnický štít (2633 m)', 'Ľadový štít (2627 m)'],
    elver: ['Váh (406 km)', 'Hron (298 km)', 'Ipeľ (232 km)'],
    innsjoer: ['Orava-reservoaret', 'Zemplínska Šírava', 'Liptovská Mara']
  },
  'SVN': {
    land: 'Slovenia',
    topper: ['Triglav (2864 m)', 'Škrlatica (2740 m)', 'Mangart (2679 m)'],
    elver: ['Sava (221 km i SI)', 'Drava (142 km i SI)', 'Soca (138 km)'],
    innsjoer: ['Bohinjsjøen', 'Bledsjøen', 'Cerkno-sjøen']
  },
  'SWE': {
    land: 'Sverige',
    topper: ['Kebnekaise Nordtoppen (2096 m)', 'Kebnekaise Sydtoppen (~2093 m)', 'Sarektjåhkkå (2089 m)'],
    elver: ['Klarälven/Göta älv (720 km)', 'Torne älv (522 km)', 'Ume älv (470 km)'],
    innsjoer: ['Vänern', 'Vättern', 'Mälaren']
  },
  'TUR': {
    land: 'Tyrkia',
    topper: ['Ararat (5137 m)', 'Uludoruk (4135 m)', 'Cilo Dağı (4116 m)'],
    elver: ['Kızılırmak (1355 km)', 'Eufrat (1263 km i TR)', 'Sakarya (824 km)'],
    innsjoer: ['Vansjøen', 'Tuzsjøen', 'Beyşehir-sjøen']
  },
  'UKR': {
    land: 'Ukraina',
    topper: ['Hoverla (2061 m)', 'Brebeneskul (2035 m)', 'Pip Ivan (2021 m)'],
    elver: ['Dnjepr (981 km i UA)', 'Sørlige Buh (806 km)', 'Dnjestr (705 km i UA)'],
    innsjoer: ['Kakhovka-reservoaret', 'Kremenchuk-reservoaret', 'Yalpug']
  },
  'VAT': {
    land: 'Vatikanstaten',
    topper: ['Vatikanhøyden (75 m)', 'Gardens Hill (60 m)', 'St. Petersplassen (19 m)'],
    elver: ['Tiberen (går like ved grensen)', '-', '-'],
    innsjoer: ['Ingen innsjøer', '-', '-']
  },

  // Nye land som er lagt til
  'USA': {
    land: 'USA',
    topper: ['Denali (6190 m)', 'Mount Saint Elias (5489 m)', 'Mount Foraker (5304 m)'],
    elver: ['Missouri (3767 km)', 'Mississippi (3730 km)', 'Yukon (3185 km tot.)'],
    innsjoer: ['Ovresjøen (Lake Superior)', 'Huronsjøen', 'Michigan-sjøen']
  },
  'CAN': {
    land: 'Canada',
    topper: ['Mount Logan (5959 m)', 'Mount Saint Elias (5489 m)', 'Mount Lucania (5226 m)'],
    elver: ['Mackenzie (1738 km)', 'Yukon (3185 km tot.)', 'Saint Lawrence (1197 km)'],
    innsjoer: ['Store Bjørnesjø', 'Store Slavesjø', 'Huronsjøen']
  },
  'BRA': {
    land: 'Brasil',
    topper: ['Pico da Neblina (2995 m)', 'Pico 3 de Março (2973 m)', 'Pico da Bandeira (2891 m)'],
    elver: ['Amasonas (6992 km tot.)', 'Paraná (4880 km tot.)', 'São Francisco (2914 m)'],
    innsjoer: ['Lagoa dos Patos', 'Lagoa Mirim', 'Sobradinho-reservoaret']
  },
  'ARG': {
    land: 'Argentina',
    topper: ['Aconcagua (6961 m)', 'Ojos del Salado (6893 m)', 'Monte Pissis (6795 m)'],
    elver: ['Paraná (4880 km tot.)', 'Uruguay (1838 km tot.)', 'Río Negro (635 km)'],
    innsjoer: ['Mar Chiquita', 'Lago Argentino', 'Lago Viedma']
  },
  'CHN': {
    land: 'Kina',
    topper: ['Mount Everest / Qomolangma (8848 m)', 'K2 (8611 m)', 'Lhotse (8516 m)'],
    elver: ['Yangtze / Chang Jiang (6300 km)', 'Guleelv / Huang He (5464 km)', 'Mekong (4350 km tot.)'],
    innsjoer: ['Qinghaisjøen', 'Poyang-sjøen', 'Dongting-sjøen']
  },
  'IND': {
    land: 'India',
    topper: ['Kangchenjunga (8586 m)', 'Nanda Devi (7816 m)', 'Kamet (7756 m)'],
    elver: ['Ganges (2525 km)', 'Godavari (1465 km)', 'Krishna (1400 km)'],
    innsjoer: ['Vembanad', 'Chilika-sjøen', 'Shivajisagar-reservoaret']
  },
  'IRN': {
    land: 'Iran',
    topper: ['Damavand (5610 m)', 'Alam-Kuh (4848 m)', 'Sabalan (4811 m)'],
    elver: ['Karun (950 km)', 'Karkheh (900 km)', 'Sefid-Rud (670 km)'],
    innsjoer: ['Urmiasjøen', 'Namak-sjøen', 'Bakhtegan']
  },
  'IRQ': {
    land: 'Irak',
    topper: ['Cheekha Dar (3611 m)', 'Hasar-i-Rost (3607 m)', 'Helgurd (3607 m)'],
    elver: ['Tigris (1850 km tot.)', 'Eufrat (2800 km tot.)', 'Shatt al-Arab (200 km)'],
    innsjoer: ['Tharthar-reservoaret', 'Razzaza-reservoaret', 'Habbaniyah-sjøen']
  },
  'JPN': {
    land: 'Japan',
    topper: ['Mount Fuji (3776 m)', 'Mount Kita (3193 m)', 'Mount Okuhotaka (3190 m)'],
    elver: ['Shinano (367 km)', 'Tone (322 km)', 'Ishikari (268 km)'],
    innsjoer: ['Biwa-sjøen', 'Kasumigaura', 'Saroma-sjøen']
  },
  'BGD': {
    land: 'Bangladesh',
    topper: ['Saka Haphong (1052 m)', 'Zow Tlang (1017 m)', 'Keokradong (986 m)'],
    elver: ['Padma / Ganges (1200 km tot.)', 'Meghna', 'Jamuna / Brahmaputra'],
    innsjoer: ['Kaptai-innsjøen (Reservoar)', 'Tanguar Haor', 'Bogakain Lake (Boga Lake)']
  },
  'AUS': {
    land: 'Australia',
    topper: ['Mawson Peak (2745 m - Heard-øya)', 'Mount Kosciuszko (2228 m - Fastlandet)', 'Mount Townsend (2209 m)'],
    elver: ['Murray (2508 km)', 'Murrumbidgee (1485 km)', 'Darling (1472 km)'],
    innsjoer: ['Kati Thanda / Lake Eyre', 'Lake Torrens', 'Lake Gairdner']
  },
  'NZL': {
    land: 'New Zealand',
    topper: ['Aoraki / Mount Cook (3724 m)', 'Mount Tasman (3497 m)', 'Mount Dampier (3440 m)'],
    elver: ['Waikato (425 km)', 'Clutha (338 km)', 'Whanganui (290 km)'],
    innsjoer: ['Lake Taupo', 'Lake Wakatipu', 'Lake Wanaka']
  },
  'THA': {
    land: 'Thailand',
    topper: ['Doi Inthanon (2565 m)', 'Doi Pha Hom Pok (2285 m)', 'Doi Luang Chiang Dao (2175 m)'],
    elver: ['Chao Phraya (372 km)', 'Mekong (4350 km tot.)', 'Mun (750 km)'],
    innsjoer: ['Songkhla-sjøen', 'Cheow Lan-sjøen (Ratchaprapha)', 'Kwan Phayao']
  },
  'PAK': {
    land: 'Pakistan',
    topper: ['K2 (8611 m)', 'Nanga Parbat (8126 m)', 'Gasherbrum I (8080 m)'],
    elver: ['Indus (3180 km tot.)', 'Sutlej (1450 km tot.)', 'Chenab (1087 km tot.)'],
    innsjoer: ['Manchar-sjøen', 'Keenjhar-sjøen', 'Attabad-sjøen']
  },
  'EGY': {
    land: 'Egypt',
    topper: ['Katarinafjellet / Mount Catherine (2629 m)', 'Mount Sinaai (2285 m)', 'Mount Um Shomer (2586 m)'],
    elver: ['Nilen (6650 km tot.)', '-', '-'],
    innsjoer: ['Nassersjøen', 'Qarun-sjøen', 'Manzala-sjøen']
  },
  'MAR': {
    land: 'Marokko',
    topper: ['Jbel Toubkal (4167 m)', 'Ouanoukrim (4089 m)', 'Jbel M\'Goun (4071 m)'],
    elver: ['Draa (1100 km)', 'Oum Er-Rbia (555 km)', 'Sebou (450 km)'],
    innsjoer: ['Bin el Ouidane-reservoaret', 'Aguelmame Azigza', 'Lake Sidi Ali']
  },
  'ZAF': {
    land: 'Sør-Afrika',
    topper: ['Mafadi (3450 m)', 'Njesuthi (3408 m)', 'Champagne Castle (3377 m)'],
    elver: ['Orange / Gariep (2200 km)', 'Limpopo (1750 km tot.)', 'Vaal (1210 km)'],
    innsjoer: ['Lake St Lucia', 'Gariep-dammen (Reservoar)', 'Chrissie-sjøen']
  }
};

/**
 * Hjelpefunksjon for å hente ut fakta basert på enten landskode eller landskode/navn.
 * @param {string} sok - f.eks. 'NOR', 'norge', 'Norway', 'ESP', 'USA', 'kina'
 * @returns {object|null} Landets faktaobjekt, eller null hvis ikke funnet.
 */
function hentFakta(sok) {
  if (!sok) return null;
  const renSok = sok.toString().trim().toLowerCase();
  
  // Finn ISO-koden basert på alias-mappen
  const isoKode = landAliasMap[renSok] || landAliasMap[sok.toString().trim().toUpperCase()];
  
  if (isoKode && faktaData[isoKode]) {
    return faktaData[isoKode];
  }
  return null;
}

// Eksport slik at den kan brukes både i nettleser og Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { faktaData, landAliasMap, hentFakta };
}