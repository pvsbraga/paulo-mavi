import photoHero from "@/assets/photo-hero.jpg";
import photo2 from "@/assets/photo-2.jpg";
import photo3 from "@/assets/photo-3.jpg";
import photo4 from "@/assets/photo-4.jpg";
import photo5 from "@/assets/photo-5.jpg";
import photo6 from "@/assets/photo-6.jpg";
import photo7 from "@/assets/photo-7.jpg";
import photo8 from "@/assets/photo-8.jpg";
import video1 from "@/assets/video-1.mp4";
import video2 from "@/assets/video-2.mp4";

export const heroData = {
  title: "O maior casal do Brasil",
  subtitle: "Original Só Nosso",
  description: "Paulo e Mavis: de 26/09/2025 até o fim, com muitos jogos, filmes, séries e esportes",
  tags: ["Amor", "Real", "Para Sempre", "2025"],
  image: photoHero,
  video: video1,
  match: "Combinamos muito",
};

export type CardItem = {
  id: number;
  title: string;
  phrase: string;
  image?: string;
  video?: string;
  tag: string;
  year: string;
};

export const destaquesRow: CardItem[] = [
  {
    id: 1,
    title: "De Mãos Dadas",
    phrase: "Se pudesse, eu poderia segurar sua mãozinha para sempre",
    image: photo2,
    tag: "Romântico",
    year: "Agora",
  },
  {
    id: 2,
    title: "Você ❤️",
    phrase: "Poderia tirar fotos suas com seus cabelos cacheados todo momento",
    image: photo3,
    tag: "Amor",
    year: "Sempre",
  },
  {
    id: 3,
    title: "Nosso Universo",
    phrase: "Poderia viver só contigo",
    image: photo4,
    tag: "Mágico",
    year: "Eterno",
  },
  {
    id: 5,
    title: "Pôr do Sol",
    phrase: "Cada pôr do sol é mais bonito do seu lado",
    image: photo5,
    tag: "Cinematográfico",
    year: "Todo dia",
  },
];

export const momentosRow: CardItem[] = [
  {
    id: 4,
    title: "Atividades Juntos",
    phrase: "Qualquer atividade é especial com você, minha atleta 🎾🏐",
    image: photo6,
    tag: "Aconchego",
    year: "Nosso",
  },
  {
    id: 6,
    title: "Luzes do Coração",
    phrase: "Você ilumina tudo ao meu redor ✨",
    video: video2,
    tag: "Fofo",
    year: "Sempre",
  },
  {
    id: 7,
    title: "Sorrisos",
    phrase: "Só você me faz dar um sorriso verdadeiro",
    image: photo7,
    tag: "Cute",
    year: "Todo dia",
  },
  {
    id: 8,
    title: "Momentinhos",
    phrase: "Quero ter momentos assim com você até o fim",
    image: photo8,
    tag: "Especial",
    year: "2025",
  },
];

export { video1 };
