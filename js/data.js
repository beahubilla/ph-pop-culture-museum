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
    title: "🎸 2000s Pinoy Rock & Band Mania",
    embedUrl: "https://www.youtube.com/embed/videoseries?list=RDCLAK5uy_k6FEgr-_4EVPoITSfmGGCMt1M6WtLBLbU"
  },
  2: {
    title: "📼 2000s Pop, Dance & Nostalgia Hits",
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
    short: "Ysha",
    initials: "YH",
    role: "Curator • Social & Tech Wing",
    handle: "★彡 [ysha_rose_xx] 彡★",
    avatar: "./images/profiles/ysha.jpg",
    quote: "txt me 2 b my bestie.. luv luv luv! <3",
    status: "Single (but txtmates 24/7)",
    memberSince: "March 2004",
    hometown: "Metro Manila, Philippines",
    about: "Certified Friendster addict. Collects sticker pages, burned CDs, and unli-text promos. Will reply to your testimonial within 3-5 business days.",
    interests: ["Texting", "Friendster", "OPM Rock", "Sticker pages", "Yahoo Messenger"],
    testimonials: [
      { from: "Benz", text: "Pre!! Ganda ng glitter background mo, nag-crash pc ko haha! Tara DotA later!" },
      { from: "Ingrid", text: "Bestie tnx sa pag-accept! Txt mko pag nasa mall ka na, d2 na me sa Jollibee <3" }
    ]
  },
  {
    name: "Benz Buluran",
    short: "Benz",
    initials: "BB",
    role: "Curator • Sports & Cyberculture Wing",
    handle: "≈[ b3nz_dota_king ]≈",
    avatar: "./images/profiles/benz.jpg",
    quote: "gg ez.. 1 more game lang tlga pre",
    status: "In a Relationship (with DotA 1)",
    memberSince: "June 2005",
    hometown: "Metro Manila, Philippines",
    about: "Lives in the computer shop from after class until the 12 midnight closing. Owns 3 mouse pads. Knows every Pacquiao fight date by heart.",
    interests: ["DotA 1", "Counter-Strike", "Pacquiao fights", "PBA", "Burned game CDs"],
    testimonials: [
      { from: "Ysha", text: "Pre uwi na! Hinahanap ka na ni Mama, 5 hrs ka na sa cafe! Txt mo naman ako." },
      { from: "Ingrid", text: "Thanks sa pag-add! Penge naman ng tips sa game, noob pa me hehe. Ganda ng profile pic!" }
    ]
  },
  {
    name: "Ingrid Mary Sacramento",
    short: "Ingrid",
    initials: "IS",
    role: "Curator • Culture & Politics Wing",
    handle: "♪♫ [ingrid_musicluvr] ♫♪",
    avatar: "./images/profiles/ingrid.jpg",
    quote: "mUSiC iZ mY LyF... rOcK oN! \uD83C\uDFB8",
    status: "In a Relationship (it's complicated)",
    memberSince: "January 2005",
    hometown: "Metro Manila, Philippines",
    about: "Burns her own MP3 CDs, watches every primetime fantasery, and forwards every chain text she receives. Yes, even the ones that say 'pass to 10 people'.",
    interests: ["OPM bands", "MP3 CDs", "Fantaseryes", "Chain texts", "SexBomb dance steps"],
    testimonials: [
      { from: "Ysha", text: "Bestie ano pla song sa profile mo? Sponge Cola ba yan? Pa-burn naman sa CD!" },
      { from: "Benz", text: "Pre thanks sa mix CD! Ganda ng playlist, pang-LAN shop talaga. Ingat lagi!" }
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
    before: { img: "./images/then-now/phone-then.jpg", emoji: "📟", label: "Nokia 3310, 2002" },
    after:  { img: "./images/then-now/phone-now.jpg",  emoji: "📱", label: "5G Smartphone, Today" }
  },
  {
    tab: "🎵 Music",
    title: "Burned MP3 CDs → Streaming",
    caption: "Quiapo burned CDs and bulky CD players gave way to Spotify, YouTube Music, and global P-Pop fandoms.",
    before: { img: "./images/then-now/music-then.jpg", emoji: "💿", label: "Burned MP3 CD, 2005" },
    after:  { img: "./images/then-now/music-now.jpg",  emoji: "🎧", label: "Spotify & P-Pop, Today" }
  },
  {
    tab: "🎮 Gaming",
    title: "LAN Shops → Mobile Esports",
    caption: "Rows of bulky CRT monitors running DotA 1 became pro Mobile Legends tournaments watched by millions.",
    before: { img: "./images/then-now/gaming-then.jpg", emoji: "🖥️", label: "LAN Shop, 2006" },
    after:  { img: "./images/then-now/gaming-now.jpg",  emoji: "🏆", label: "Mobile Esports, Today" }
  }
];
