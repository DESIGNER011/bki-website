// ============================================================
//  server/fallbackData.js  —  Static fallback data for BKI
// ============================================================

const fallbackBelts = [
  {
    name: "White Belt",
    kyu: "9th",
    color: "#ffffff",
    description: "Foundational stances, punching, and blocking techniques.",
    requirements: "Beginner level. Learn basic Dojo etiquette and vocabulary.",
    kihon: "Choku-Zuki (Straight punch), Age-Uke (Rising block), Zenkutsu-Dachi (Front stance)",
    kata: "Taikyoku Shodan (Basics Form)",
    kumite: "Gohon Kumite (5-step basic sparring)",
    gold: false
  },
  {
    name: "Yellow Belt",
    kyu: "8th",
    color: "#eab308",
    description: "Introduction to movement patterns, front kicks, and counter blocks.",
    requirements: "Minimum 3 months of regular training.",
    kihon: "Gyaku-Zuki (Reverse punch), Gedan-Barai (Downward block), Kokutsu-Dachi (Back stance)",
    kata: "Heian Shodan (Peaceful Mind - Level 1)",
    kumite: "Gohon Kumite (Focus on distance & timing)",
    gold: false
  },
  {
    name: "Orange Belt",
    kyu: "7th",
    color: "#f97316",
    description: "Introduction to side kicks, combinations, and basic sparring kata.",
    requirements: "Minimum 3 months as an 8th Kyu.",
    kihon: "Soto-Uke (Outside block), Mae-Geri (Front kick), combination transitions",
    kata: "Heian Nidan (Peaceful Mind - Level 2)",
    kumite: "Sanbon Kumite (3-step semi-free sparring)",
    gold: false
  },
  {
    name: "Green Belt",
    kyu: "6th",
    color: "#22c55e",
    description: "Intermediate blocks, sweeps, and kumite strategies.",
    requirements: "Minimum 4 months as a 7th Kyu.",
    kihon: "Uchi-Uke (Inside block), Shuto-Uke (Knife-hand block), Yoko-Geri Keage (Side snap kick)",
    kata: "Heian Sandan (Peaceful Mind - Level 3)",
    kumite: "Kihon Ippon Kumite (1-step basic sparring)",
    gold: false
  },
  {
    name: "Blue Belt",
    kyu: "5th",
    color: "#3b82f6",
    description: "Advanced kata precision, roundhouse kicks, and defense drills.",
    requirements: "Minimum 4 months as a 6th Kyu.",
    kihon: "Yoko-Geri Kekomi (Side thrust kick), Nukite (Spear hand strike)",
    kata: "Heian Yondan (Peaceful Mind - Level 4)",
    kumite: "Kihon Ippon Kumite (Semi-free combinations)",
    gold: false
  },
  {
    name: "Purple Belt",
    kyu: "4th",
    color: "#a855f7",
    description: "Specialized defense combinations, advanced body conditioning, and counter-attacks.",
    requirements: "Minimum 5 months as a 5th Kyu.",
    kihon: "Mawashi-Geri (Roundhouse kick), Ushiro-Geri (Back kick)",
    kata: "Heian Godan (Peaceful Mind - Level 5)",
    kumite: "Jiyu Ippon Kumite (1-step semi-free sparring)",
    gold: false
  },
  {
    name: "Brown Belt",
    kyu: "3rd - 1st",
    color: "#78350f",
    description: "Assistant instructor training, deep tournament tactics, and mastery of all Heian Katas.",
    requirements: "Minimum 6 months training per rank level.",
    kihon: "Multi-angle kick combinations, advanced stance shifts, speed drills",
    kata: "Tekki Shodan, Bassai Dai (To Penetrate a Fortress)",
    kumite: "Jiyu Ippon Kumite & Jiyu Kumite (Free sparring basics)",
    gold: false
  },
  {
    name: "Black Belt (Shodan)",
    kyu: "1st Dan",
    color: "#111111",
    description: "Mastery of Shotokan fundamentals, advanced Katas, and professional kumite.",
    requirements: "Minimum 12 months as a 1st Kyu Brown Belt, age 16+.",
    kihon: "All fundamental and advanced techniques at maximum power and speed",
    kata: "Bassai Dai, Kanku Dai (To View the Sky), plus one choice kata",
    kumite: "Jiyu Kumite (Advanced tournament free sparring)",
    gold: true
  }
];

const fallbackAchievements = [
  {
    category: "International Tournaments",
    icon: "🏆",
    items: [
      { title: "World Shotokan Championship 2025", award: "Gold Medal — Team Kata", location: "Tokyo, Japan", winner: "Senior Team A", highlight: true },
      { title: "World Open Karate 2023", award: "Bronze Medal — Individual Kumite", location: "Berlin, Germany", winner: "Sensei R. Kumar" }
    ]
  },
  {
    category: "National Champions",
    icon: "🥈",
    items: [
      { title: "National Games 2025", award: "Overall Team Champions", location: "New Delhi, India", winner: "Dojo Team" },
      { title: "All India Shotokan Cup 2024", award: "Gold — U18 Girls Kumite", location: "Mumbai, India", winner: "P. Priya" },
      { title: "South Zone Karate Open 2024", award: "Gold — Kids Team Kata", location: "Bengaluru, India", winner: "Kids Team A" }
    ]
  }
];

const fallbackGallery = [
  {
    _id: "default-1",
    type: "image",
    url: "https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&w=800&q=80",
    originalName: "kumite_practice.jpg",
    label: "Kumite Practice"
  },
  {
    _id: "default-2",
    type: "image",
    url: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80",
    originalName: "black_belt_focus.jpg",
    label: "Belt Graduation"
  },
  {
    _id: "default-3",
    type: "image",
    url: "https://images.unsplash.com/photo-1528164344705-47542687000d?auto=format&fit=crop&w=800&q=80",
    originalName: "dojo_hall.jpg",
    label: "Honbu Dojo"
  },
  {
    _id: "default-4",
    type: "image",
    url: "https://images.unsplash.com/photo-1576003767218-91374863e40f?auto=format&fit=crop&w=800&q=80",
    originalName: "traditional_training.jpg",
    label: "Traditional Kata"
  },
  {
    _id: "default-5",
    type: "image",
    url: "https://images.unsplash.com/photo-1615117961803-fa1518f888f4?auto=format&fit=crop&w=800&q=80",
    originalName: "youth_focus.jpg",
    label: "Youth Focus Program"
  },
  {
    _id: "default-6",
    type: "image",
    url: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=800&q=80",
    originalName: "dojo_championship.jpg",
    label: "Dojo Championship"
  }
];

module.exports = {
  fallbackBelts,
  fallbackAchievements,
  fallbackGallery
};
