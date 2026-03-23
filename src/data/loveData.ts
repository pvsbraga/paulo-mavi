import heroBanner from "@/assets/hero-banner.jpg";
import card1 from "@/assets/card-1.jpg";
import card2 from "@/assets/card-2.jpg";
import card3 from "@/assets/card-3.jpg";
import card4 from "@/assets/card-4.jpg";
import card5 from "@/assets/card-5.jpg";
import card6 from "@/assets/card-6.jpg";
import card7 from "@/assets/card-7.jpg";
import card8 from "@/assets/card-8.jpg";

export const heroData = {
  title: "A Maior História de Amor",
  subtitle: "Original Só Nosso",
  description:
    "Dois corações que se encontraram e nunca mais se largaram. Uma história que ainda está sendo escrita — a mais bonita de todas.",
  tags: ["Amor", "Real", "Para Sempre", "2025"],
  image: heroBanner,
  match: "💯 Combinamos muito",
};

export type CardItem = {
  id: number;
  title: string;
  phrase: string;
  image: string;
  tag: string;
  year: string;
};

export const destaquesRow: CardItem[] = [
  {
    id: 1,
    title: "De Mãos Dadas",
    phrase: "Posso segurar a sua mão para sempre?",
    image: card1,
    tag: "Romântico",
    year: "Agora",
  },
  {
    id: 2,
    title: "Para Você",
    phrase: "Você merece todas as rosas do mundo 🌹",
    image: card2,
    tag: "Amor",
    year: "Sempre",
  },
  {
    id: 3,
    title: "Nosso Universo",
    phrase: "No céu todo, só você importa",
    image: card3,
    tag: "Mágico",
    year: "Eterno",
  },
  {
    id: 5,
    title: "Pôr do Sol",
    phrase: "Cada pôr do sol é mais bonito do seu lado",
    image: card5,
    tag: "Cinematográfico",
    year: "Todo dia",
  },
];

export const momentosRow: CardItem[] = [
  {
    id: 4,
    title: "Cafezinho Juntos",
    phrase: "Qualquer momento é especial com você",
    image: card4,
    tag: "Aconchego",
    year: "Nosso",
  },
  {
    id: 6,
    title: "Luzes do Coração",
    phrase: "Você ilumina tudo ao meu redor ✨",
    image: card6,
    tag: "Fofo",
    year: "Sempre",
  },
  {
    id: 7,
    title: "Meu Coraçãozinho",
    phrase: "Meu coração bate assim quando penso em você 💖",
    image: card7,
    tag: "Cute",
    year: "Todo dia",
  },
  {
    id: 8,
    title: "Nosso Piquenique",
    phrase: "Quero ter momentos assim com você até o fim",
    image: card8,
    tag: "Especial",
    year: "2025",
  },
];
