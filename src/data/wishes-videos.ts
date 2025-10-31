export interface WishVideo {
  id: string;
  title: string;
  thumbnail: string;
  videoUrl: string;
  audioUrl?: string;
  x: number;
  y: number;
  size: number;
  color: string;
  caption: string;
  authorName: string;
  createdAt: string;
}

export const getWishesVideos = (isMobile: boolean): WishVideo[] => [
  {
    id: 'wife-upgrade',
    title: "Wife",
    thumbnail: "https://picsum.photos/300/300?random=1",
    videoUrl: "https://lettubbe-development.s3.eu-north-1.amazonaws.com/truSouthKing/Ms.+UpgradeMain%5Bwife%5D.mp4",
    audioUrl: undefined,
    x: 15,
    y: 20,
    size: 120,
    color: '#ff6b6b',
    caption: "Wife",
    authorName: "Wife",
    createdAt: new Date().toISOString()
  },
  {
    id: 'wife-kids',
    title: "Wife&Kids", 
    thumbnail: "https://picsum.photos/300/300?random=2",
    videoUrl: "https://lettubbe-development.s3.eu-north-1.amazonaws.com/truSouthKing/wife%26kids.mp4",
    audioUrl: undefined,
    x: 85,
    y: 25,
    size: 100,
    color: '#4ecdc4',
    caption: "Wife&Kids",
    authorName: "Wife&Kids",
    createdAt: new Date().toISOString()
  },
  {
    id: 'Pst-isreal',
    title: "Brother", 
    thumbnail: "https://picsum.photos/300/300?random=2",
    videoUrl: isMobile 
      ? "https://lettubbe-development.s3.eu-north-1.amazonaws.com/truSouthKing/Pastor+Israel+Atima.mp4"
      : "https://lettubbe-development.s3.eu-north-1.amazonaws.com/truSouthKing/Pastor+Israel+Atima+-+HBD+P.TSK.mp4",
    audioUrl: undefined,
    x: 85,
    y: 25,
    size: 100,
    color: '#4ecdc4',
    caption: "Brother",
    authorName: "Brother",
    createdAt: new Date().toISOString()
  },
  {
    id: 'sister-esther',
    title: "Sister", 
    thumbnail: "https://picsum.photos/300/300?random=4",
    videoUrl: isMobile 
      ? "https://lettubbe-development.s3.eu-north-1.amazonaws.com/truSouthKing/Sis+Esther+Atima.mp4"
      : "https://lettubbe-development.s3.eu-north-1.amazonaws.com/truSouthKing/Sis+Esther+Atima+-+HBD+P.TSK.mp4",
    audioUrl: undefined,
    x: 60,
    y: 40,
    size: 120,
    color: '#e17055',
    caption: "Sister",
    authorName: "Sister",
    createdAt: new Date().toISOString()
  },
  {
    id: 'tb1',
    title: "TB1",
    thumbnail: "https://picsum.photos/300/300?random=3",
    videoUrl: "https://lettubbe-development.s3.eu-north-1.amazonaws.com/truSouthKing/TB1.mov",
    audioUrl: undefined,
    x: 10,
    y: 75,
    size: 140,
    color: '#45b7d1',
    caption: "TB1",
    authorName: "TB1",
    createdAt: new Date().toISOString()
  },
  {
    id: 'protek',
    title: "Protek",
    thumbnail: "https://picsum.photos/300/300?random=4",
    videoUrl: "https://lettubbe-development.s3.eu-north-1.amazonaws.com/truSouthKing/Protek.mp4",
    audioUrl: undefined,
    x: 75,
    y: 10,
    size: 130,
    color: '#ffeaa7',
    caption: "Protek",
    authorName: "Protek",
    createdAt: new Date().toISOString()
  },
  {
    id: 'peddygree',
    title: "Peddygree",
    thumbnail: "https://picsum.photos/300/300?random=5",
    videoUrl: "https://lettubbe-development.s3.eu-north-1.amazonaws.com/truSouthKing/Peddygree.mov",
    audioUrl: undefined,
    x: 30,
    y: 50,
    size: 110,
    color: '#fd79a8',
    caption: "Peddygree",
    authorName: "Peddygree",
    createdAt: new Date().toISOString()
  }
];