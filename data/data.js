// Резервный массив для открытия index/catalog.html двойным кликом без локального сервера.
// Над каждым товаром указан код двигателя, чтобы позже легко найти его изображение.
const rawProducts=[
// CWVA
{sku:'CWVA',category:'Двигатели',title:'CWVA — двигатель 1.6 л, 110 л.с.',description:'CWVA (1.6 MPI, 110 л.с., ремень). Разработан для стран СНГ и Восточной Европы.',price:119000,brand:['Volkswagen','Skoda'],models:'Golf 7;Octavia A7;Yeti;Polo Sedan;Jetta 6;Caddy 4;Rapid 1;Jetta 7;Karoq;Polo 6 (лифтбек);Rapid 2;Octavia A8',engineVolume:'1.6 л',power:'110 л.с.',engineCode:'CWVA',timingDrive:'ремень'},
// CWVB
{sku:'CWVB',category:'Двигатели',title:'CWVB — двигатель 1.6 л, 90 л.с.',description:'CWVB (1.6 MPI, 90 л.с., ремень). Дефорсированная версия мотора CWVA.',price:125000,brand:['Volkswagen','Skoda'],models:'Polo Sedan;Rapid 1;Polo 6 (лифтбек);Rapid 2',engineVolume:'1.6 л',power:'90 л.с.',engineCode:'CWVB',timingDrive:'ремень'},
// CFNA
{sku:'CFNA',category:'Двигатели',title:'CFNA — двигатель 1.6 л, 105 л.с.',description:'CFNA (1.6 MPI, 105 л.с., цепь). Предыдущее поколение атмосферных двигателей VAG.',price:99000,brand:['Volkswagen','Skoda'],models:'Polo Sedan;Fabia 2;Roomster;Rapid 1;Jetta 6',engineVolume:'1.6 л',power:'105 л.с.',engineCode:'CFNA',timingDrive:'цепь'},
// CFNB
{sku:'CFNB',category:'Двигатели',title:'CFNB — двигатель 1.6 л, 85 л.с.',description:'CFNB (1.6 MPI, 85 л.с., цепь). Дефорсированная версия мотора CFNA.',price:105000,brand:['Volkswagen','Skoda'],models:'Polo Sedan;Rapid 1',engineVolume:'1.6 л',power:'85 л.с.',engineCode:'CFNB',timingDrive:'цепь'},
// G4FC
{sku:'G4FC',category:'Двигатели',title:'G4FC — двигатель 1.6 л, 122–130 л.с.',description:'G4FC (1.6 Gamma, 122–130 л.с.).',price:79000,brand:['Hyundai','KIA'],models:'Avante/Elantra (HD);i30 (FD);Ceed (ED);Soul 1 (AM);Cerato 2 (TD);Rio 3 (QB);Solaris 1 (RB)',engineVolume:'1.6 л',power:'122–130 л.с.',engineCode:'G4FC',timingDrive:''},
// G4FA
{sku:'G4FA',category:'Двигатели',title:'G4FA — двигатель 1.4 л, 107 л.с.',description:'G4FA (1.4 Gamma, 107 л.с.).',price:79000,brand:['Hyundai','KIA'],models:'i30 (FD);Ceed (ED);Rio 3 (QB);Solaris 1 (RB);Ceed (JD);i30 (GD)',engineVolume:'1.4 л',power:'107 л.с.',engineCode:'G4FA',timingDrive:''},
// G4FG
{sku:'G4FG',category:'Двигатели',title:'G4FG — двигатель 1.6 л, 123–132 л.с.',description:'G4FG (1.6 Gamma II, 123–132 л.с.). Модернизированный мотор Dual CVVT.',price:85000,brand:['Hyundai','KIA'],models:'Elantra (MD);Ceed (JD);Cerato 3 (YD);Soul 2 (PS);Solaris;Rio 3;Creta 1;Elantra (AD);Solaris 2;Rio 4;Seltos;Creta 2',engineVolume:'1.6 л',power:'123–132 л.с.',engineCode:'G4FG',timingDrive:''},
// G4KD
{sku:'G4KD',category:'Двигатели',title:'G4KD — двигатель 2.0 л, 150–165 л.с.',description:'G4KD (2.0 Theta II, 150–165 л.с.).',price:138000,brand:['Hyundai','KIA'],models:'Sonata 5;Magentis 2 / Optima 2;Tucson 1;Sportage 2;ix35;Sportage 3;Cerato 2;Sonata 6;Optima 3',engineVolume:'2.0 л',power:'150–165 л.с.',engineCode:'G4KD',timingDrive:''},
// G4NA
{sku:'G4NA',category:'Двигатели',title:'G4NA — двигатель 2.0 л, 150 л.с.',description:'G4NA (2.0 Nu, 150 л.с.). Пришёл на смену G4KD.',price:137000,brand:['Hyundai','KIA'],models:'Elantra; i40; ix35; Cerato; Sportage; Sonata; Optima; Soul; Creta; Tucson; Seltos',engineVolume:'2.0 л',power:'150 л.с.',engineCode:'G4NA',timingDrive:''},
// G4LC
{sku:'G4LC',category:'Двигатели',title:'G4LC — двигатель 1.4 л, 99–100 л.с.',description:'G4LC (1.4 Kappa, 99–100 л.с.).',price:92000,brand:['Hyundai','KIA'],models:'i20 (GB);Rio 4;Rio X-Line;Solaris 2;Ceed; i30',engineVolume:'1.4 л',power:'99–100 л.с.',engineCode:'G4LC',timingDrive:''},
// G4KJ
{sku:'G4KJ',category:'Двигатели',title:'G4KJ — двигатель 2.4 л, 180–201 л.с.',description:'G4KJ (2.4 Theta II GDI, 180–201 л.с.).',price:243000,brand:['Hyundai','KIA'],models:'Sonata 6;Optima 3;Sportage 3;Santa Fe 3;Sorento 2;Sorento 3;Optima 4;Tucson 3;Sonata 7',engineVolume:'2.4 л',power:'180–201 л.с.',engineCode:'G4KJ',timingDrive:''},
// CZCA
{sku:'CZCA',category:'Двигатели',title:'CZCA — двигатель 1.4 л, 125 л.с.',description:'CZCA (1.4 TSI, 125 л.с., ремень). Турбомотор EA211.',price:125000,brand:['Volkswagen','Audi','Skoda'],models:'Golf 7;A3 (8V);Leon 3;Octavia A7;Passat B8;Rapid;Jetta 6;Polo Sedan;Tiguan 2;Kodiaq',engineVolume:'1.4 л',power:'125 л.с.',engineCode:'CZCA',timingDrive:'ремень'},
// CAXA
{sku:'CAXA',category:'Двигатели',title:'CAXA — двигатель 1.4 л, 122 л.с.',description:'CAXA (1.4 TSI, 122 л.с., цепь). Турбомотор EA111.',price:115000,brand:['Volkswagen','Skoda'],models:'Golf 5;Jetta 5;Scirocco 3;Golf 6;Tiguan 1;Passat B6;Octavia A5;Passat B7;Jetta 6;Yeti',engineVolume:'1.4 л',power:'122 л.с.',engineCode:'CAXA',timingDrive:'цепь'},
// 2NZ
{sku:'2NZ',category:'Двигатели',title:'2NZ — двигатель 1.5 л / 1.3 л, не указан в оригинале',description:'2NZ (1.5 VVT-i / 1.3 VVT-i). Легендарный мотор Toyota.',price:139000,brand:['Toyota'],models:'Yaris 1;FunCargo;Platz;Corolla E120;Prius; bB;Allion;Probox;Sienta;Yaris 2;Auris;Ist 2;Corolla E160',engineVolume:'1.5 л / 1.3 л',power:'',engineCode:'2NZ',timingDrive:''},
// 2AZ
{sku:'2AZ',category:'Двигатели',title:'2AZ — двигатель 2.4 л, не указан в оригинале',description:'2AZ-FE (2.4 VVT-i). Мотор среднеразмерной линейки Toyota.',price:149000,brand:['Toyota'],models:'Camry XV30;Highlander;RAV4 XA20;Alphard;Ipsum;Camry XV40;RAV4 XA30;Previa;Mark X Zio',engineVolume:'2.4 л',power:'',engineCode:'2AZ',timingDrive:''},
// 2TR
{sku:'2TR',category:'Двигатели',title:'2TR — двигатель 2.7 л, не указан в оригинале',description:'2TR-FE (2.7 VVT-i). Мотор для внедорожников и коммерческого транспорта.',price:199000,brand:['Toyota'],models:'Hilux 7;Hiace 5;Land Cruiser Prado 120;Tacoma 2;Fortuner;Innova;Prado 150;Hilux 8;Tacoma 3;Prado 250',engineVolume:'2.7 л',power:'',engineCode:'2TR',timingDrive:''},
// 2ZR
{sku:'2ZR',category:'Двигатели',title:'2ZR — двигатель 1.8 л, не указан в оригинале',description:'2ZR-FE / 2ZR-FAE (1.8 Dual VVT-i / Valvematic).',price:139000,brand:['Toyota'],models:'Corolla E150;Auris;Allion;Matrix;Avensis;Wish;Prius 3;Verso;Corolla E180;Prius 4;C-HR;Corolla E210;Corolla Cross',engineVolume:'1.8 л',power:'',engineCode:'2ZR',timingDrive:''},
// 1NZ
{sku:'1NZ',category:'Двигатели',title:'1NZ — двигатель 1.5 л / 1.3 л, не указан в оригинале',description:'1NZ-FE (1.5 VVT-i) / 2NZ-FE (1.3 VVT-i).',price:138000,brand:['Toyota'],models:'Yaris;FunCargo;Platz;Corolla;Prius;bB;Allion;Probox;Sienta;Auris;Ist;Corolla Axio / Fielder',engineVolume:'1.5 л / 1.3 л',power:'',engineCode:'1NZ',timingDrive:''},
// 1ZZ
{sku:'1ZZ',category:'Двигатели',title:'1ZZ — двигатель 1.8 л, не указан в оригинале',description:'1ZZ-FE (1.8 VVT-i). Первое поколение алюминиевых 1.8-литровых моторов.',price:119000,brand:['Toyota'],models:'Corolla E110;Celica;MR2;Opa;RAV4;Allion;Corolla E120;Matrix;Caldina;Wish;Avensis;Corolla Verso',engineVolume:'1.8 л',power:'',engineCode:'1ZZ',timingDrive:''}
];
window.PRODUCTS=rawProducts.map(p=>({...p,models:p.models.split(';')}));
