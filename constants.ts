import { User } from './types';

// Auth Data Map
export const AUTH_DB: Record<string, { pass: string, callsign: string, realName: string, jobTitle: string }> = {
  'akif': { pass: 'RA-akf1192', callsign: 'RoseAero', realName: 'Akif', jobTitle: 'Mekanik Ekip Lideri' },
  'tunahan': { pass: 'RA-tnh4421', callsign: 'RoseOps', realName: 'Tunahan', jobTitle: 'Mekanik Personeli' },
  'ceren': { pass: 'RA-crn8422', callsign: 'RoseFlight', realName: 'Ceren', jobTitle: 'Aviyonik Uzmanı' },
  'sare': { pass: 'RA-sr9008', callsign: 'RoseCore', realName: 'Sare', jobTitle: 'Aviyonik Uzmanı' },
  'aleyna': { pass: 'RA-alyn5501', callsign: 'RoseSystems', realName: 'Aleyna', jobTitle: 'Sosyal Medya & İletişim' },
  'fahri': { pass: 'RA-fh7723', callsign: 'RoseCommand', realName: 'Fahri', jobTitle: 'Aviyonik Ekip Lideri' },
  'selçuk': { pass: 'RA-slk5520', callsign: 'RoseUnitX', realName: 'Selçuk', jobTitle: 'Takım Kaptanı / Yazılım & Tasarım' },
  'hakkı': { pass: 'RA-hk1204', callsign: 'RoseSecure', realName: 'Hakkı', jobTitle: 'Mekanik & Kalite Kontrol' },
  'cengiz': { pass: 'RA-cgz0132', callsign: 'RoseEngineers', realName: 'Cengiz', jobTitle: 'Sosyal Medya & İletişim' },
};

// Sistem ilk açıldığında gözükecek tek mesaj (Veritabanı boşsa)
export const INITIAL_SYSTEM_MSG = [
  { id: 'sys-init', sender: 'Sistem', content: 'Rose E-Team Yönetim Paneli v4.2 Çevrimiçi. Güvenli bağlantı kuruldu.', timestamp: '08:00', channel: 'Genel', isSystem: true }
];

export const SYSTEM_PROMPT_ROSE_AI = `
Sen "Rose AI"sin, bir savunma sanayi şirketi için geliştirilmiş gelişmiş bir askeri sınıf operasyon asistanısın.
Dilin Türkçe olmalı. Tonun resmi, kısa, analitik, profesyonel ve güvenli olmalı.
Risk analizi, teknik özetler ve operasyonel optimizasyon konularında yardımcı olursun.
Durum göstergesi için kesinlikle gerekli olmadıkça emoji kullanma.
Cevapların sanki bir terminalden geliyormuş gibi net olmalı.
`;