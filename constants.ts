
import { SiteCategory } from './types';

export const RAW_CSV_DATA = `Site_Name,Location,Type,Latitude,Longitude,Significance
Doti Rajya,Doti,Palace/Fort,29.2667,80.9833,Historic seat of the Doti Kings
Bajhang Rajya,Bajhang,Palace/Fort,29.5500,81.2000,Ancient kingdom of the Bajhang Kings
Ugratara Mandir,Dadeldhura,Hindu Temple,29.3033,80.5833,Major Shakti Peeth in Far-West Nepal
Badimalika Temple,Bajura,Hindu Temple,29.6833,81.4833,Sacred temple at high altitude
Garbha Durbar,Kailali,Palace/Fort,28.9833,80.6833,Historic Rana-era palace in the hills
Janaki Mandir,Dhanusa,Hindu Temple,26.7305,85.9259,Birthplace of Goddess Sita
Gadhimai Temple,Bara,Hindu Temple,26.9064,84.9702,Famous for the Gadhimai Festival
Sinja Palace,Jumla,Archaeological,29.3333,81.9833,Capital of the ancient Khasa Kingdom
Musikot Durbar,West Rukum,Palace/Fort,28.6333,82.4833,Historic fort of the Rukum Kings
Dullu Darbar,Dailekh,Palace/Fort,28.8500,81.6167,Ancient palace of the Dullu Kingdom
Kankrebihar,Surkhet,Archaeological,28.5833,81.6333,Buddhist stone temple ruins
Tripurasundari Temple,Dolpa,Hindu Temple,29.0833,82.8833,Ancient Shakti Peeth in Karnali
Deuti Bajai,Surkhet,Hindu Temple,28.5833,81.6500,Sacred temple of the Surkhet Valley
Mayadevi Temple,Lumbini,UNESCO Heritage,27.4696,83.2758,Birthplace of Lord Buddha
Swargadwari Temple,Pyuthan,Religious Site,28.1154,82.7845,Gateway to Heaven
Palpa Durbar,Palpa,Palace/Museum,27.8682,83.5463,Historic seat of the Sen Kings
Tilaurakot,Kapilvastu,Archaeological,27.5755,83.0039,Ancient palace of King Suddhodana
Gulmi Durbar,Gulmi,Palace/Fort,28.1065,83.2783,Historic site on Resunga Hill
Gorkha Durbar,Gorkha,Palace/Fort,28.0012,84.6295,Birthplace of King Prithvi Narayan Shah
Lamjung Durbar,Lamjung,Palace/Fort,28.2333,84.3667,Historic seat of the Shah Kings
Kaski Durbar,Kaski,Palace/Fort,28.2667,83.8833,Ancient fort of the Kaski Kings
Manakamana Temple,Gorkha,Hindu Temple,27.8943,84.5694,Goddess of Wishes
Muktinath Temple,Mustang,Hindu/Buddhist,28.8167,83.8718,Place of Salvation (Moksha)
Pathivara Temple,Taplejung,Hindu Temple,27.4294,87.7677,Major Shakti Peeth in East Nepal
Budha Subba Temple,Sunsari,Religious Site,26.8192,87.2942,Tomb of the last Limbu King
Halesi Mahadev Temple,Khotang,Religious Cave,27.1895,86.6234,Pashupatinath of the East
Mai Pokhari,Ilam,Natural/Religious,27.0000,87.9333,Sacred lake with nine corners
Dhankuta Durbar,Dhankuta,Palace/Fort,26.9833,87.3333,Historic administrative center
Ilam Durbar,Ilam,Palace/Fort,26.9167,87.9167,Historic palace in the tea city
Nuwakot Durbar,Nuwakot,Palace/Fort,27.9138,85.1648,Seven-storeyed historic palace
Patan Durbar Square,Lalitpur,UNESCO Heritage,27.6737,85.3252,Fine Arts and Newari Architecture
Bhaktapur Durbar Square,Bhaktapur,UNESCO Heritage,27.6713,85.4293,City of Devotees
Pashupatinath Temple,Kathmandu,Hindu Temple,27.7104,85.3486,Holiest Hindu Shiva Temple
Swayambhunath Stupa,Kathmandu,Buddhist/Hindu,27.7149,85.2900,The Monkey Temple
Sindhuli Gadhi,Sindhuli,Historic Fort,27.2833,85.9500,Historic battle site against British
Chilancho Stupa,Kathmandu,Buddhist Stupa,27.6782,85.2774,One of the most important Buddhist sites in Kirtipur, dating back to the 16th century.`;

export const CATEGORY_COLORS: Record<SiteCategory, string> = {
  [SiteCategory.HINDU]: '#EF4444', // Red
  [SiteCategory.BUDDHIST]: '#EAB308', // Yellow
  [SiteCategory.PALACE]: '#3B82F6', // Blue
};

export const DEFAULT_NEPAL_CENTER: [number, number] = [28.3949, 84.1240];
export const DEFAULT_ZOOM = 7;

export const PROVINCE_CENTROIDS: Record<string, [number, number]> = {
  'Sudurpaschim': [29.3, 81.0],
  'Karnali': [29.3, 82.5],
  'Lumbini': [27.8, 83.0],
  'Gandaki': [28.4, 84.2],
  'Bagmati': [27.7, 85.3],
  'Madhesh': [26.8, 85.5],
  'Koshi': [27.2, 87.3],
};

export const DISTRICT_TO_PROVINCE: Record<string, string> = {
  'Doti': 'Sudurpaschim', 'Bajhang': 'Sudurpaschim', 'Dadeldhura': 'Sudurpaschim', 'Bajura': 'Sudurpaschim', 'Kailali': 'Sudurpaschim',
  'Dhanusa': 'Madhesh', 'Bara': 'Madhesh',
  'Jumla': 'Karnali', 'West Rukum': 'Karnali', 'Dailekh': 'Karnali', 'Surkhet': 'Karnali', 'Dolpa': 'Karnali',
  'Lumbini': 'Lumbini', 'Pyuthan': 'Lumbini', 'Palpa': 'Lumbini', 'Kapilvastu': 'Lumbini', 'Gulmi': 'Lumbini',
  'Gorkha': 'Gandaki', 'Lamjung': 'Gandaki', 'Kaski': 'Gandaki', 'Mustang': 'Gandaki',
  'Taplejung': 'Koshi', 'Sunsari': 'Koshi', 'Khotang': 'Koshi', 'Ilam': 'Koshi', 'Dhankuta': 'Koshi',
  'Nuwakot': 'Bagmati', 'Lalitpur': 'Bagmati', 'Bhaktapur': 'Bagmati', 'Kathmandu': 'Bagmati', 'Sindhuli': 'Bagmati'
};
