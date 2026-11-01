/**
 * The built-in GeoGuess pool: everyday street scenes from Wikimedia Commons, one per
 * town, geotagged by their authors. Every photo is CC0, public domain or CC BY(-SA), and
 * `credit` is shown on the big screen during the round (the attribution the license
 * asks for). `page` is the Commons file page with the full license text.
 */
export interface GeoLocation {
  place: string
  lat: number
  lng: number
  image: string
  credit: string
  page: string
}

export const LOCATION_POOL: GeoLocation[] = [
  {
    place: 'Cádiz, Spain',
    lat: 36.52994,
    lng: -6.2927,
    image:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e6/Cadiz_Plaza_de_San_Juan_de_Dios.jpg/1280px-Cadiz_Plaza_de_San_Juan_de_Dios.jpg',
    credit: 'Photo: Solundir, CC BY-SA 3.0, Wikimedia Commons',
    page: 'https://commons.wikimedia.org/wiki/File:Cadiz_Plaza_de_San_Juan_de_Dios.jpg',
  },
  {
    place: 'Bilbao, Spain',
    lat: 43.2592,
    lng: -2.92424,
    image:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f1/Bilbao_-_panoramio_%282%29.jpg/1280px-Bilbao_-_panoramio_%282%29.jpg',
    credit: 'Photo: Gunnar E. Heßke, CC BY-SA 3.0, Wikimedia Commons',
    page: 'https://commons.wikimedia.org/wiki/File:Bilbao_-_panoramio_(2).jpg',
  },
  {
    place: 'Coimbra, Portugal',
    lat: 40.20887,
    lng: -8.42651,
    image:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/36/S%C3%A9_Velha_de_Coimbra%2C_em_2025_-_Foto_10.jpg/1280px-S%C3%A9_Velha_de_Coimbra%2C_em_2025_-_Foto_10.jpg',
    credit: 'Photo: Threeohsix, CC BY-SA 4.0, Wikimedia Commons',
    page: 'https://commons.wikimedia.org/wiki/File:S%C3%A9_Velha_de_Coimbra,_em_2025_-_Foto_10.jpg',
  },
  {
    place: 'Colmar, France',
    lat: 48.07907,
    lng: 7.35882,
    image:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/81/14-06-30-colmar-by-RalfR-106.jpg/1280px-14-06-30-colmar-by-RalfR-106.jpg',
    credit: 'Photo: Ralf Roletschek, CC BY-SA 3.0, Wikimedia Commons',
    page: 'https://commons.wikimedia.org/wiki/File:14-06-30-colmar-by-RalfR-106.jpg',
  },
  {
    place: 'Bologna, Italy',
    lat: 44.4938,
    lng: 11.3427,
    image:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/31/Portico_di_Casa_Isolani.jpg/1280px-Portico_di_Casa_Isolani.jpg',
    credit: 'Photo: Giovanni Osbat, CC BY-SA 3.0, Wikimedia Commons',
    page: 'https://commons.wikimedia.org/wiki/File:Portico_di_Casa_Isolani.jpg',
  },
  {
    place: 'Naples, Italy',
    lat: 40.84174,
    lng: 14.24742,
    image:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4e/Spagnoli_-_panoramio.jpg/1280px-Spagnoli_-_panoramio.jpg',
    credit: 'Photo: trolvag, CC BY-SA 3.0, Wikimedia Commons',
    page: 'https://commons.wikimedia.org/wiki/File:Spagnoli_-_panoramio.jpg',
  },
  {
    place: 'Palermo, Italy',
    lat: 38.11568,
    lng: 13.36152,
    image:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a9/Quattro_Canti_-_panoramio_-_Gabriele_Giuseppini.jpg/1280px-Quattro_Canti_-_panoramio_-_Gabriele_Giuseppini.jpg',
    credit: 'Photo: Gabriele Giuseppini, CC BY 3.0, Wikimedia Commons',
    page: 'https://commons.wikimedia.org/wiki/File:Quattro_Canti_-_panoramio_-_Gabriele_Giuseppini.jpg',
  },
  {
    place: 'Utrecht, Netherlands',
    lat: 52.09074,
    lng: 5.12142,
    image:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/12/Utrecht%2C_Netherlands_%28Unsplash_KwVla2Ex2TY%29.jpg/1280px-Utrecht%2C_Netherlands_%28Unsplash_KwVla2Ex2TY%29.jpg',
    credit: 'Photo: Tim Gouw punttim, CC0, Wikimedia Commons',
    page: 'https://commons.wikimedia.org/wiki/File:Utrecht,_Netherlands_(Unsplash_KwVla2Ex2TY).jpg',
  },
  {
    place: 'Gothenburg, Sweden',
    lat: 57.69871,
    lng: 11.95546,
    image:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/db/SV_Goteborg_Haga_stadslager_216-1_ID_10154902160001_IMG_5822.JPG/1280px-SV_Goteborg_Haga_stadslager_216-1_ID_10154902160001_IMG_5822.JPG',
    credit: 'Photo: Bjoertvedt, CC BY-SA 3.0, Wikimedia Commons',
    page: 'https://commons.wikimedia.org/wiki/File:SV_Goteborg_Haga_stadslager_216-1_ID_10154902160001_IMG_5822.JPG',
  },
  {
    place: 'Bergen, Norway',
    lat: 60.39439,
    lng: 5.32585,
    image:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7c/Torget_-_Bergen%2C_Norway_-_panoramio.jpg/1280px-Torget_-_Bergen%2C_Norway_-_panoramio.jpg',
    credit: 'Photo: Sergey Ashmarin, CC BY-SA 3.0, Wikimedia Commons',
    page: 'https://commons.wikimedia.org/wiki/File:Torget_-_Bergen,_Norway_-_panoramio.jpg',
  },
  {
    place: 'Helsinki, Finland',
    lat: 60.18429,
    lng: 24.94927,
    image:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a7/White_Ford_at_a_pedestrian_crossing_%28Unsplash%29.jpg/1280px-White_Ford_at_a_pedestrian_crossing_%28Unsplash%29.jpg',
    credit: 'Photo: Stephen Arnold iamarnold, CC0, Wikimedia Commons',
    page: 'https://commons.wikimedia.org/wiki/File:White_Ford_at_a_pedestrian_crossing_(Unsplash).jpg',
  },
  {
    place: 'Kraków, Poland',
    lat: 50.05167,
    lng: 19.94472,
    image:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/dc/Nowy_%28New%29_Square_Krakow_Kazimierz.JPG/1280px-Nowy_%28New%29_Square_Krakow_Kazimierz.JPG',
    credit: 'Photo: Zygmunt Put Zetpe0202, CC BY-SA 4.0, Wikimedia Commons',
    page: 'https://commons.wikimedia.org/wiki/File:Nowy_(New)_Square_Krakow_Kazimierz.JPG',
  },
  {
    place: 'Brno, Czechia',
    lat: 49.19541,
    lng: 16.60664,
    image:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/29/St%C5%99edova_street%2C_west_view%2C_Brno.jpg/1280px-St%C5%99edova_street%2C_west_view%2C_Brno.jpg',
    credit: 'Photo: Pavel Hrdlička (Czech Wikipedia user Packa), CC BY-SA 4.0, Wikimedia Commons',
    page: 'https://commons.wikimedia.org/wiki/File:St%C5%99edova_street,_west_view,_Brno.jpg',
  },
  {
    place: 'Graz, Austria',
    lat: 47.07055,
    lng: 15.43929,
    image:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fd/Graz_tramways_car_266_line_1.jpg/1280px-Graz_tramways_car_266_line_1.jpg',
    credit: 'Photo: trams aux fils., CC BY 2.0, Wikimedia Commons',
    page: 'https://commons.wikimedia.org/wiki/File:Graz_tramways_car_266_line_1.jpg',
  },
  {
    place: 'Bern, Switzerland',
    lat: 46.94805,
    lng: 7.44752,
    image:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/84/Gr%C3%BCnes_Quartier%2C_Bern%2C_Switzerland_-_panoramio_%285%29.jpg/1280px-Gr%C3%BCnes_Quartier%2C_Bern%2C_Switzerland_-_panoramio_%285%29.jpg',
    credit: 'Photo: Foto Fitti, CC BY-SA 3.0, Wikimedia Commons',
    page: 'https://commons.wikimedia.org/wiki/File:Gr%C3%BCnes_Quartier,_Bern,_Switzerland_-_panoramio_(5).jpg',
  },
  {
    place: 'Budapest, Hungary',
    lat: 47.49194,
    lng: 19.07091,
    image:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b2/Gr%C3%B3f_N%C3%A1dasdy_b%C3%A9rpalot%C3%A1ja._Utcai_homlokzat._-_Budapest%2C_Palotanegyed%2C_J%C3%B3zsef_k%C3%B6r%C3%BAt_35.JPG/1280px-Gr%C3%B3f_N%C3%A1dasdy_b%C3%A9rpalot%C3%A1ja._Utcai_homlokzat._-_Budapest%2C_Palotanegyed%2C_J%C3%B3zsef_k%C3%B6r%C3%BAt_35.JPG',
    credit: 'Photo: Globetrotter19, CC BY-SA 3.0, Wikimedia Commons',
    page: 'https://commons.wikimedia.org/wiki/File:Gr%C3%B3f_N%C3%A1dasdy_b%C3%A9rpalot%C3%A1ja._Utcai_homlokzat._-_Budapest,_Palotanegyed,_J%C3%B3zsef_k%C3%B6r%C3%BAt_35.JPG',
  },
  {
    place: 'Brașov, Romania',
    lat: 45.64283,
    lng: 25.5888,
    image:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c0/Casa_Sfatului_v%C4%83zut%C4%83_de_pe_Strada_Mure%C8%99enilor..jpg/1280px-Casa_Sfatului_v%C4%83zut%C4%83_de_pe_Strada_Mure%C8%99enilor..jpg',
    credit: 'Photo: Aldea14, CC BY-SA 3.0 ro, Wikimedia Commons',
    page: 'https://commons.wikimedia.org/wiki/File:Casa_Sfatului_v%C4%83zut%C4%83_de_pe_Strada_Mure%C8%99enilor..jpg',
  },
  {
    place: 'Thessaloniki, Greece',
    lat: 40.63326,
    lng: 22.94573,
    image:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/28/THESS_-_Aghia_Sophia_01.JPG/1280px-THESS_-_Aghia_Sophia_01.JPG',
    credit: 'Photo: Geraki, CC BY 2.5, Wikimedia Commons',
    page: 'https://commons.wikimedia.org/wiki/File:THESS_-_Aghia_Sophia_01.JPG',
  },
  {
    place: 'Split, Croatia',
    lat: 43.50813,
    lng: 16.44019,
    image:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/25/Palace_Of_Diocletian_%28247979365%29.jpeg/1280px-Palace_Of_Diocletian_%28247979365%29.jpeg',
    credit: 'Photo: Kailash U, CC0, Wikimedia Commons',
    page: 'https://commons.wikimedia.org/wiki/File:Palace_Of_Diocletian_(247979365).jpeg',
  },
  {
    place: 'Ljubljana, Slovenia',
    lat: 46.05112,
    lng: 14.50605,
    image:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/17/Laibach_%2813891306909%29.jpg/1280px-Laibach_%2813891306909%29.jpg',
    credit: 'Photo: Alois Staudacher, CC BY 2.0, Wikimedia Commons',
    page: 'https://commons.wikimedia.org/wiki/File:Laibach_(13891306909).jpg',
  },
  {
    place: 'Galway, Ireland',
    lat: 53.27256,
    lng: -9.05327,
    image:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3b/Galway_-_Shop_Street%2C_High_Street%2C_Guard_Street_-_geograph.org.uk_-_3024927.jpg/1280px-Galway_-_Shop_Street%2C_High_Street%2C_Guard_Street_-_geograph.org.uk_-_3024927.jpg',
    credit: 'Photo: Joseph Mischyshyn, CC BY-SA 2.0, Wikimedia Commons',
    page: 'https://commons.wikimedia.org/wiki/File:Galway_-_Shop_Street,_High_Street,_Guard_Street_-_geograph.org.uk_-_3024927.jpg',
  },
  {
    place: 'Tallinn, Estonia',
    lat: 59.43707,
    lng: 24.74503,
    image:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/67/Old_Town_of_Tallinn%2C_Tallinn%2C_Estonia_-_panoramio_%2842%29.jpg/1280px-Old_Town_of_Tallinn%2C_Tallinn%2C_Estonia_-_panoramio_%2842%29.jpg',
    credit: 'Photo: Ben Bender, CC BY-SA 3.0, Wikimedia Commons',
    page: 'https://commons.wikimedia.org/wiki/File:Old_Town_of_Tallinn,_Tallinn,_Estonia_-_panoramio_(42).jpg',
  },
  {
    place: 'Riga, Latvia',
    lat: 56.94965,
    lng: 24.10519,
    image:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/14/Riga_%2847668294992%29.jpg/1280px-Riga_%2847668294992%29.jpg',
    credit: 'Photo: Jorge Franganillo from Barcelona, Spain, CC BY 2.0, Wikimedia Commons',
    page: 'https://commons.wikimedia.org/wiki/File:Riga_(47668294992).jpg',
  },
  {
    place: 'Belgrade, Serbia',
    lat: 44.81803,
    lng: 20.46325,
    image:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/cb/Ku%C4%87a_Velikana%2C_Skadarlija_02.jpg/1280px-Ku%C4%87a_Velikana%2C_Skadarlija_02.jpg',
    credit: 'Photo: BuhaM, CC BY-SA 4.0, Wikimedia Commons',
    page: 'https://commons.wikimedia.org/wiki/File:Ku%C4%87a_Velikana,_Skadarlija_02.jpg',
  },
  {
    place: 'Plovdiv, Bulgaria',
    lat: 42.14983,
    lng: 24.75117,
    image:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0f/Casa_Hindliyan_-_01_%285641181670%29.jpg/1280px-Casa_Hindliyan_-_01_%285641181670%29.jpg',
    credit: 'Photo: Ramón from Llanera, España, CC BY-SA 2.0, Wikimedia Commons',
    page: 'https://commons.wikimedia.org/wiki/File:Casa_Hindliyan_-_01_(5641181670).jpg',
  },
  {
    place: 'Reykjavík, Iceland',
    lat: 64.14641,
    lng: -21.94283,
    image:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9c/20190623_CityHall_8560_%2848468563382%29.jpg/1280px-20190623_CityHall_8560_%2848468563382%29.jpg',
    credit: 'Photo: Ray Swi-hymn from Sijhih-Taipei, Taiwan, CC BY-SA 2.0, Wikimedia Commons',
    page: 'https://commons.wikimedia.org/wiki/File:20190623_CityHall_8560_(48468563382).jpg',
  },
  {
    place: 'Valletta, Malta',
    lat: 35.89909,
    lng: 14.51479,
    image:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/be/Palazzo%2C_Christopher_Street.jpeg/1280px-Palazzo%2C_Christopher_Street.jpeg',
    credit: 'Photo: Continentaleurope, CC BY-SA 3.0, Wikimedia Commons',
    page: 'https://commons.wikimedia.org/wiki/File:Palazzo,_Christopher_Street.jpeg',
  },
]
