import type { Movie, ProviderId, ProviderInfo } from './types';

export const PROVIDERS: Record<ProviderId, ProviderInfo> = {
  netflix: { id: 'netflix', name: 'Netflix', price: 169, color: 'bg-red-600' },
  disney: { id: 'disney', name: 'Disney+ Hotstar', price: 289, color: 'bg-blue-600' },
  prime: { id: 'prime', name: 'Prime Video', price: 149, color: 'bg-sky-500' },
  hbo: { id: 'hbo', name: 'HBO Max', price: 199, color: 'bg-purple-600' },
};

// ฐานข้อมูลภาพยนตร์ตั้งต้น
const BASE_MOVIES: Movie[] = [
  // Action & Sci-Fi
  { id: 'act-1', title: 'Inception', runtime: 148, genres: ['Action', 'Sci-Fi'], providers: ['netflix'], poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&auto=format&fit=crop&q=80', overview: 'จอมโจรกรรมความคิดที่แทรกซึมเข้าไปในจิตใต้สำนึกผ่านความฝัน กับภารกิจฝังความคิดครั้งสุดท้าย', year: 2010 },
  { id: 'act-2', title: 'The Dark Knight', runtime: 152, genres: ['Action', 'Crime'], providers: ['hbo', 'netflix'], poster: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80', overview: 'แบทแมนต้องเผชิญหน้ากับความโกลาหลที่นำโดยโจ๊กเกอร์ อาชญากรจิตวิปริตที่ท้าทายศีลธรรมของก็อตแธม', year: 2008 },
  { id: 'act-3', title: 'Avengers: Endgame', runtime: 181, genres: ['Action', 'Sci-Fi'], providers: ['disney'], poster: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80', overview: 'บทสรุปสงครามครั้งยิ่งใหญ่ของเหล่าอเวนเจอร์สเพื่อกอบกู้จักรวาลจากการดีดนิ้วของธานอส', year: 2019 },
  { id: 'act-4', title: 'Dune: Part Two', runtime: 166, genres: ['Action', 'Sci-Fi'], providers: ['hbo'], poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80', overview: 'พอล อะทรีเดส ร่วมมือกับชานีและชาวเฟรเมนเพื่อล้างแค้นผู้สมรู้ร่วมคิดที่ทำลายครอบครัวของเขา', year: 2024 },
  { id: 'act-5', title: 'The Batman', runtime: 176, genres: ['Action', 'Crime'], providers: ['hbo'], poster: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?w=600&auto=format&fit=crop&q=80', overview: 'บรูซ เวย์น ในปีที่สองของการเป็นแบทแมน ต้องตามล่าฆาตกรปริศนาที่กำลังเปิดโปงความฉ้อฉลของก็อตแธม', year: 2022 },
  { id: 'act-6', title: 'John Wick: Chapter 4', runtime: 169, genres: ['Action', 'Thriller'], providers: ['prime'], poster: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80', overview: 'การต่อสู้เพื่ออิสรภาพของนักฆ่าระดับพระกาฬที่ต้องเผชิญหน้ากับสภาสูงทั่วโลก', year: 2023 },

  // Horror & Mystery
  { id: 'hor-1', title: 'Stranger Things', runtime: 140, genres: ['Horror', 'Sci-Fi'], providers: ['netflix'], poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80', overview: 'เมื่อเด็กชายคนหนึ่งหายตัวไปอย่างลึกลับ เมืองเล็กๆ แห่งนี้จึงได้เผชิญหน้ากับความลับเหนือธรรมชาติ', year: 2016 },
  { id: 'hor-2', title: 'The Conjuring', runtime: 112, genres: ['Horror', 'Mystery'], providers: ['hbo'], poster: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=600&auto=format&fit=crop&q=80', overview: 'แฟ้มคดีล่าท้าผีของสองสามีภรรยาวอร์เรนที่ต้องช่วยเหลือครอบครัวที่ถูกวิญญาณร้ายตามหลอกหลอน', year: 2013 },
  { id: 'hor-3', title: 'A Quiet Place', runtime: 90, genres: ['Horror', 'Sci-Fi'], providers: ['netflix', 'prime'], poster: 'https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?w=600&auto=format&fit=crop&q=80', overview: 'สิ่งมีชีวิตประหลาดที่ล่ามนุษย์ด้วยคลื่นเสียง ครอบครัวหนึ่งต้องเอาชีวิตรอดโดยห้ามส่งเสียงใดๆ', year: 2018 },
  { id: 'hor-4', title: 'IT: Chapter One', runtime: 135, genres: ['Horror'], providers: ['hbo'], poster: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80', overview: 'กลุ่มเด็กขี้แพ้ต้องเผชิญหน้ากับฝันร้ายที่กลายมาเป็นความจริงในคราบปีศาจตัวตลกเพนนีไวส์', year: 2017 },
  { id: 'hor-5', title: 'Hereditary', runtime: 127, genres: ['Horror', 'Drama'], providers: ['prime'], poster: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=600&auto=format&fit=crop&q=80', overview: 'ความลับดำมืดและคำสาปประจำตระกูลที่เริ่มเปิดเผยหลังจากการจากไปของคุณยายผู้ลึกลับ', year: 2018 },

  // Romance & Drama
  { id: 'rom-1', title: 'La La Land', runtime: 128, genres: ['Romance', 'Drama'], providers: ['netflix'], poster: 'https://images.unsplash.com/photo-1518709414768-a88981a4515d?w=600&auto=format&fit=crop&q=80', overview: 'ความรักและความฝันของสองหนุ่มสาวในเมืองแห่งดาราที่ต้องเลือกระหว่างความสำเร็จกับหัวใจ', year: 2016 },
  { id: 'rom-2', title: 'About Time', runtime: 123, genres: ['Romance', 'Sci-Fi'], providers: ['netflix', 'prime'], poster: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=600&auto=format&fit=crop&q=80', overview: 'ชายหนุ่มผู้สามารถย้อนเวลาได้ค้นพบว่าความรักและความสุขที่แท้จริงคือการใช้ชีวิตในปัจจุบัน', year: 2013 },
  { id: 'rom-3', title: 'Titanic', runtime: 194, genres: ['Romance', 'Drama'], providers: ['disney'], poster: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=600&auto=format&fit=crop&q=80', overview: 'โศกนาฏกรรมความรักเหนือกาลเวลาบนเรือเดินสมุทรที่ยิ่งใหญ่ที่สุดในโลก', year: 1997 },
  { id: 'rom-4', title: 'Past Lives', runtime: 105, genres: ['Romance', 'Drama'], providers: ['prime'], poster: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80', overview: 'พรหมลิขิตและสายสัมพันธ์ที่ผูกพันสองเพื่อนสมัยเด็กข้ามทวีปและกาลเวลานานนับสิบปี', year: 2023 },
  { id: 'rom-5', title: 'Before Sunrise', runtime: 101, genres: ['Romance', 'Drama'], providers: ['hbo'], poster: 'https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=600&auto=format&fit=crop&q=80', overview: 'หนึ่งคืนแห่งบทสนทนาอันลึกซึ้งและการค้นพบความรักของสองคนแปลกหน้าในกรุงเวียนนา', year: 1995 },
];

function generateCategoryMovies(genre: string, count: number = 30): Movie[] {
  const filtered = BASE_MOVIES.filter(m => m.genres.includes(genre));
  const pool = filtered.length > 0 ? filtered : BASE_MOVIES;
  const result: Movie[] = [];

  for (let i = 0; i < count; i++) {
    const template = pool[i % pool.length];
    result.push({
      ...template,
      id: `${genre.toLowerCase()}-${i + 1}`,
      title: i < pool.length ? template.title : `${template.title} (ภาค ${Math.floor(i / pool.length) + 1})`,
    });
  }
  return result;
}

export const TRENDING_MOVIES = generateCategoryMovies('Action', 30);
export const ACTION_MOVIES = generateCategoryMovies('Action', 30);
export const HORROR_MOVIES = generateCategoryMovies('Horror', 30);
export const ROMANCE_MOVIES = generateCategoryMovies('Romance', 30);

export const MOCK_MOVIES: Movie[] = [
  ...BASE_MOVIES,
  ...ACTION_MOVIES.slice(0, 10),
  ...HORROR_MOVIES.slice(0, 10),
  ...ROMANCE_MOVIES.slice(0, 10)
].filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);

