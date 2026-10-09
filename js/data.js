// Nokia 3310 Preset SMS Messages
const smsData = {
  txt_clan: '"Eow poh! Sali kau s clan nmin? Txt CLAN ON 2 2366! Gud am sa lhat!"',
  edsa2: '"Go 2 EDSA! Wear blk. Pls pass 2 all. Overthrow corruption now!"',
  gm: '"gud am Pipz.. Kain tau bfast.. Tc alwayz.. Send to many."',
  jejemon: '"eOw pOwhz mHuZtAh nAh pOwh kAyOw dItOwh? jEjeJejE! >:)"'
};

// YouTube Music Stations for Winamp Player
const museumStations = {
  1: {
    title: "📼 2000s Pop, Dance & Nostalgia Hits",
    embedUrl: "https://www.youtube.com/embed/videoseries?list=RDCLAK5uy_k6FEgr-_4EVPoITSfmGGCMt1M6WtLBLbU"
  },
  2: {
    title: "🎸 2000s Pinoy Rock & Band Mania",
    embedUrl: "https://www.youtube.com/embed/videoseries?list=RDCLAK5uy_l70bSMa3aOX5oPp8j7Of_22VHbSDRGyYE"
  }
};

// ============================================================
// FRIENDSTER PROFILES  (✏️ EDIT ME — make these yours!)
// - avatar: put photos in /images/profiles/ (leave "" to show initials)
// - Everything below is placeholder fun text. Change anything.
// ============================================================
const friendsterProfiles = [
  {
    name: "Ysha Rose Beatrice Hubilla",
    handle: "★彡 BeA_Coups_2002 彡★",
    avatar: "./images/Keep Calm.jpg",
    quote: "KEEP CALM AND PLAY HARD",
    status: "Single (but txtmates 24/7)",
    memberSince: "November 2002",
    hometown: "Marikina, Philippines",
    about: "Certified Friendster addict. Collects sticker pages, burned CDs, and unli-text promos. Will reply to your testimonial within 3-5 business days.",
    interests: ["Texting", "Friendster", "OPM Rock", "Sticker pages", "Yahoo Messenger"],
    testimonials: [
      { from: "BEnzzzz", text: "wer na u, d2 na me comshop" },
      { from: "ingridientZz1230__", text: "accpt mu frend req q" }
    ]
  },
  {
    name: "Benz Buluran",
    handle: " BEnzzzz ",
    avatar: "",
    quote: "gg ez.. 1 more game",
    status: "In a Relationship (with DotA 1)",
    memberSince: "June 2005",
    hometown: "Metro Manila, Philippines",
    about: "Lives in the computer shop from after class until the 12 midnight closing. Owns 3 mouse pads. Knows every Pacquiao fight date by heart.",
    interests: ["DotA 1", "Counter-Strike", "Pacquiao fights", "PBA", "Burned game CDs"],
    testimonials: [
      { from: "★彡 BeA_Coups_2002 彡★", text: "uwi na! Hinahanap ka na ni Mama, 5 hrs ka na sa cafe! Txt mo naman ako." },
      { from: "♪♫ ingridientZz1230__ ♫♪", text: "Thanks sa pag-add! Penge naman ng tips sa game master, noob pa me hehe." }
    ]
  },
  {
    name: "Ingrid Mary Sacramento",
    handle: "♪♫ ingridientZz1230__ ♫♪",
    avatar: "./images/domo.png",
    quote: "gusto ko lang matulog‎꜀( ꜆-ࡇ-)꜆ ᶻ 𝗓 𐰁",
    status: "single ayee",
    memberSince: "December 2007",
    hometown: "Pasig, Philippines",
    about: "Burns her own MP3 CDs, watches every primetime fantasery, and forwards every chain text she receives. Yes, even the ones that say 'pass to 10 people'.",
    interests: ["OPM bands", "MP3 CDs", "Fantaseryes", "Chain texts", "SexBomb dance steps"],
    testimonials: [
      { from: "★彡 BeA_Coups_2002 彡★", text: "friend request accepted, pahiram naman ng CD mo" },
      { from: "BEnzzzz", text: "dati din akong noob, tara DOTA" }
    ]
  }
];

// ============================================================
// BEFORE / AFTER SLIDER PAIRS  (✏️ EDIT ME)
// - img: path to your photo, e.g. "./images/then-now/nokia.jpg"
//   If the photo is missing, a colorful placeholder is shown instead.
// ============================================================
const beforeAfterPairs = [
  {
    tab: "📱 Phones",
    title: "Nokia 3310 → 5G Smartphone",
    caption: "From 160-character texts and Snake to video calls, feeds, and live streams in one pocket-sized screen.",
    before: { img: "./images/phones 1.png", emoji: "📟", label: "Nokia 3310, 2002" },
    after:  { img: "./images/modernphones.jpg",  emoji: "📱", label: "5G Smartphone, Today" }
  },
  {
    tab: "🎵 Music",
    title: "Burned MP3 CDs → Streaming",
    caption: "Quiapo burned CDs and bulky CD players gave way to Spotify, YouTube Music, and global P-Pop fandoms.",
    before: { img: "./images/opm.png", emoji: "💿", label: "Burned MP3 CD, 2005" },
    after:  { img: "./images/ppop.png",  emoji: "🎧", label: "Spotify & P-Pop, Today" }
  },
  {
    tab: "🎮 Gaming",
    title: "LAN Shops → Mobile Esports",
    caption: "Rows of bulky CRT monitors running DotA 1 became pro Mobile Legends tournaments watched by millions.",
    before: { img: "./images/internetcafe.jpg", emoji: "🖥️", label: "LAN Shop, 2006" },
    after:  { img: "./images/esports.png",  emoji: "🏆", label: "Mobile Esports, Today" }
  }
];
