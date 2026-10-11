// ============================================================
// 🎵 MINI PLAYER STATIONS  (✏️ EDIT / ADD YOUR OWN)
// ------------------------------------------------------------
// type: "embed"  -> plays inside the site (any public YouTube playlist link)
// type: "link"   -> opens in a NEW TAB (use this for YouTube Music, which
//                   can't be embedded on other websites)
// Add or remove stations freely; the tabs update automatically.
// Tip: playlists must be Public or Unlisted to play in the embed.
// ============================================================
const playlistStations = [
  {
    tab: "▶ YouTube",
    title: "🎸 OPM 2000–2009: Best Pinoy Songs",
    type: "embed",
    url: "https://www.youtube.com/playlist?list=PLiy0XOfUv4hGbDDI0gx6sFqsYdcQ6zMWx"
  },
  {
    tab: "🎵 YT Music",
    title: "☀️ '00s Summer Hits",
    type: "link",
    url: "https://music.youtube.com/playlist?list=RDCLAK5uy_mZ0IsRBiplkwK-nuyY63tYi9TerQRQJc4"
  }
];

// Shown automatically if a station has no valid playlist link yet
const playlistSearch = {
  youtube: "https://www.youtube.com/results?search_query=2000s+OPM+hits+playlist",
  music: "https://music.youtube.com/search?q=2000s+OPM+hits"
};

// Nokia 3310 Preset SMS Messages
const smsData = {
  txt_clan: '"Eow poh! Sali kau s clan nmin? Txt CLAN ON 2 2366! Gud am sa lhat!"',
  edsa2: '"Go 2 EDSA! Wear blk. Pls pass 2 all. Overthrow corruption now!"',
  gm: '"gud am Pipz.. Kain tau bfast.. Tc alwayz.. Send to many."',
  jejemon: '"eOw pOwhz mHuZtAh nAh pOwh kAyOw dItOwh? jEjeJejE! >:)"'
};

// Message shown on the Nokia screen when the page first loads
const smsDefault = '"D2 na me, wer na u? txt bck asap! <3"';

// ============================================================
// 🏛️ EXHIBITS  (cards AND detail rooms are built from this list)
// ✏️ EDIT ME. Add a new object to add a new exhibit/room.
// - image: swap for your own photo, e.g. "./images/exhibits/nokia.jpg".
//          If it fails to load, the colored emoji panel shows instead.
// - curator: index of the curator in friendsterProfiles (or null)
//
// ERA CONTENT (the 2000s Wing vs. the Today Wing):
// - Top-level fields (thenTitle, thenBlurb, intro, facts, artifacts, gallery, image)
//   are the 2000s version of the exhibit.
// - today: { ... } holds the Today version (title, blurb, intro, facts, artifacts,
//   gallery, image, icon, badge, tag, impact). Add today.image / today.gallery
//   with your own photos, e.g. "./images/today/gcash.jpg".
// - change: one line used in the Compare tab ("what changed").
// ⚠️ Double-check the facts and add your sources before submitting!
// ============================================================
const exhibits = [
  {
    id: "social",
    wing: "Social & Tech",
    icon: "📱",
    color: "#3aa7ff",
    domain: "Social Domain",
    badge: "Nokia 3310 & Friendster",
    tag: "SMS CLANS & OFWS",
    title: "The Texting Capital to 5G Feeds",
    blurb: "Evolution from 160-character SMS clans and early OFW video calls to instant global feeds.",
    thenTitle: "The Texting Capital of the World",
    thenBlurb: "160-character SMS clans, prepaid load, Friendster testimonials, and early OFW video calls.",
    image: "./images/nokia.png",
    alt: "Nokia Mobile Phones",
    then: "Nokia 3310 keypad texting, SMS clans, Friendster testimonials, and Yahoo Messenger video calls for OFW families.",
    now: "5G mobile smartphones, TikTok algorithms, Instagram Reels, Messenger, and live-streaming online communities.",
    change: "From 160-character texts and paid load to unlimited chat, video calls, and feeds on a single screen.",
    impact: "Birthed the hyper-connected Pinoy netizen",
    intro: "In the early 2000s the Philippines became known as the 'texting capital of the world'. Phones were small, load was precious, and every character counted. Filipinos squeezed whole conversations into tiny messages.",
    facts: [
      "A single SMS was capped at 160 characters, which is why 'txt speak' like 'u', '2', and 'gud am' took off.",
      "Friendster launched in the US in 2002 but found some of its biggest audiences in Southeast Asia, including the Philippines.",
      "Yahoo! Messenger and cheap webcams let OFW families see each other long before video calls fit in every pocket."
    ],
    artifacts: [
      { emoji: "📱", name: "Nokia 3310", note: "Remembered for its toughness, the Snake game, and the multi-tap keypad." },
      { emoji: "💳", name: "Prepaid 'load'", note: "Small top-ups and unli-text promos powered the texting craze." },
      { emoji: "👥", name: "Friendster testimonials", note: "Public messages on your profile were a social currency." },
      { emoji: "💬", name: "Yahoo! Messenger", note: "Buzz, nudges, and webcam calls kept families connected." }
    ],
    curator: 0,
    today: {
      icon: "📲",
      badge: "Smartphones & Social Apps",
      tag: "5G & SHORT VIDEO",
      title: "Always-On: Feeds, Reels & Group Chats",
      blurb: "Your whole social life now runs through one pocket-sized screen.",
      image: "./images/modernphones.jpg",
      alt: "Modern smartphones",
      impact: "Everyone is now a creator, broadcaster, and audience at once.",
      intro: "Today a single smartphone handles texting, calls, video, shopping, and school. Social life happens in group chats, short videos, and live streams, and news can reach millions of people in minutes.",
      facts: [
        "The Philippines is often ranked among the countries that spend the most time on social media each day.",
        "Group chats, stickers, and voice notes have largely replaced the 160-character 'txt speak' of the 2000s.",
        "Video calls over Wi-Fi or mobile data let OFW families see each other any time, without paying per minute."
      ],
      artifacts: [
        { emoji: "📱", name: "Smartphone", note: "Camera, maps, wallet, and chat in one device." },
        { emoji: "🎬", name: "Short videos", note: "Reels, Shorts, and TikTok-style clips set trends." },
        { emoji: "👥", name: "Group chats", note: "Class, family, and barkada chats run daily life." },
        { emoji: "📡", name: "5G & Wi-Fi", note: "Faster data replaced counting texts and load." }
      ]
    }
  },
  {
    id: "cultural",
    wing: "Culture & P-Pop",
    icon: "🎸",
    color: "#8b5cf6",
    domain: "Cultural Domain",
    badge: "OPM Rock & P-Pop",
    tag: "MP3 CDS & FANTASERYES",
    title: "OPM Band Craze to Global P-Pop",
    blurb: "From burned MP3 CDs and SexBomb dance crazes to global streaming and fandoms.",
    thenTitle: "OPM Rock, Burned CDs & Fantaseryes",
    thenBlurb: "Band mania on the radio, MP3 CDs from Quiapo, SexBomb dance crazes, and primetime fantaseryes.",
    image: "./images/opm albums.png",
    alt: "Audio & Stage Music",
    then: "OPM rock explosion (Parokya ni Edgar, Kamikazee), Quiapo burned MP3 CDs, SexBomb dance hits, and primetime fantaseryes (Mulawin).",
    now: "P-Pop international wave (SB19, BINI), Spotify streaming royalties, TikTok dance challenges, and Netflix adaptations.",
    change: "From burned CDs and radio requests to streaming playlists and worldwide fan communities.",
    impact: "Decentralized creator economy & global fandom",
    intro: "The 2000s were a golden age for Pinoy rock and a wild mix of dance crazes and fantasy TV. Music traveled on burned CDs and radio requests.",
    facts: [
      "Bands like Parokya ni Edgar, Kamikazee, and Sponge Cola filled radio, music channels, and karaoke playlists.",
      "The SexBomb Girls turned dance routines into a mainstream TV phenomenon.",
      "Fantaseryes such as Mulawin (2004) brought effects-heavy fantasy into primetime."
    ],
    artifacts: [
      { emoji: "💿", name: "Burned MP3 CD", note: "Dozens of songs on one disc, often bought in Quiapo." },
      { emoji: "📻", name: "Radio requests", note: "Text-in dedications shaped the hit parade." },
      { emoji: "🎤", name: "Videoke", note: "The family karaoke machine at every party." },
      { emoji: "📺", name: "Primetime fantasery", note: "Capes, creatures, and dramatic cliffhangers." }
    ],
    curator: 2,
    today: {
      icon: "🎧",
      badge: "P-Pop & Streaming",
      tag: "SPOTIFY & FANDOMS",
      title: "Streams, Fandoms & P-Pop",
      blurb: "Music is now streamed on demand, and fan communities help new artists go global.",
      image: "./images/ppop.png",
      alt: "P-Pop and music streaming",
      impact: "Fans and streams, not record stores, decide what becomes a hit.",
      intro: "Burned CDs gave way to playlists you can stream anywhere. P-Pop groups, indie artists, and creators build audiences on social media, and fans organize streaming parties and fan projects online.",
      facts: [
        "P-Pop groups like SB19 (debuted 2018) and BINI (debuted 2021) have built international followings.",
        "A short dance challenge can push a song to a brand-new audience within days.",
        "Independent artists can release music on streaming platforms without a record label or CD pressing."
      ],
      artifacts: [
        { emoji: "🎧", name: "Streaming playlists", note: "Millions of songs, one tap away." },
        { emoji: "💃", name: "Dance challenges", note: "Short clips that turn songs into trends." },
        { emoji: "💬", name: "Fan communities", note: "Fans organize streams, projects, and meet-ups online." },
        { emoji: "📺", name: "Streaming series", note: "Shows on demand instead of waiting for primetime." }
      ]
    }
  },
  {
    id: "sports",
    wing: "Sports & Cyberculture",
    icon: "🥊",
    color: "#ff8a3d",
    domain: "Sports & Cyberculture",
    badge: "Pacquiao & LAN Shops",
    tag: "DOTA 1 & CRIME DROPS",
    title: "LAN Cafes & Fight Days to Olympic Gold",
    blurb: "From empty streets during Manny Pacquiao fights and DotA 1 cafes to multi-sport triumphs and global Esports.",
    thenTitle: "Fight Nights & LAN Cafes",
    thenBlurb: "Streets that went quiet for Pacquiao fights, and computer shops packed for all-night DotA.",
    image: "./images/computer shop.png",
    alt: "Esports Gaming Room",
    then: "Zero crime rate during Pacquiao boxing broadcasts, PBA arena finals, and bulky CRT computer shops playing DotA 1 and Counter-Strike.",
    now: "Olympic gold medals (Carlos Yulo, Hidilyn Diaz), professional Esports championships (MPL/MLBB), and mobile game streaming.",
    change: "From one fight night on one TV to Olympic podiums, esports arenas, and highlights on every phone.",
    impact: "LAN culture built the foundation for PH Esports dominance",
    intro: "Sports and games brought neighborhoods together. In the 2000s that meant crowding around one TV for a Pacquiao fight or packing a computer shop for an all-night DotA match.",
    facts: [
      "Pacquiao fight nights became famous for quiet streets, because so many families watched together.",
      "DotA started as a Warcraft III mod and packed internet cafes across the country.",
      "Internet cafes rented computers by the hour, so a few pesos could buy an afternoon of games."
    ],
    artifacts: [
      { emoji: "🥊", name: "Fight-night TV", note: "Whole barangays watching one screen." },
      { emoji: "🖥️", name: "CRT monitor rows", note: "Pay-per-hour computer shops after school." },
      { emoji: "🎧", name: "Headset & Mouse", note: "Essential gear for a late-night match." },
      { emoji: "🏀", name: "PBA finals", note: "Basketball nights filled arenas and living rooms." }
    ],
    curator: 1,
    today: {
      icon: "🥇",
      badge: "Olympians & Esports",
      tag: "MLBB & OLYMPIC GOLD",
      title: "Olympic Gold & Esports Arenas",
      blurb: "National pride now comes from Olympic medals, esports stages, and highlights anyone can watch on a phone.",
      image: "./images/recentsports.png",
      alt: "Today's champions",
      impact: "National pride is now shared live, from stadiums to phone screens.",
      intro: "Sports fandom has moved from one TV to every screen. Filipino athletes win on the world stage, and mobile esports fill arenas and live streams.",
      facts: [
        "Hidilyn Diaz won the Philippines' first Olympic gold (weightlifting, Tokyo 2020), and Carlos Yulo took two gymnastics golds at Paris 2024.",
        "Filipino teams have won Mobile Legends world championship titles.",
        "Highlights, live matches, and athlete updates reach fans instantly through social media and streaming apps."
      ],
      artifacts: [
        { emoji: "🏅", name: "Olympic gold", note: "A new era of national sports pride." },
        { emoji: "🎮", name: "Mobile Legends", note: "Esports tournaments with huge online audiences." },
        { emoji: "📺", name: "Live streams", note: "Watch matches and highlights anywhere." },
        { emoji: "🤸", name: "Home-grown champions", note: "Athletes who are also social media stars." }
      ],
      gallery: [
        { src: "./images/esports.png", caption: "Mobile esports on stage" }
      ]
    }
  },
  {
    id: "political",
    wing: "Politics & EDSA II",
    icon: "📢",
    color: "#ff4f6d",
    domain: "Political Domain",
    badge: "EDSA II & Text Brigades",
    tag: "GMS & HELLO GARCI",
    title: "Text Revolutions to Algorithmic Politics",
    blurb: "How SMS chain messages mobilized EDSA Dos, contrasted with modern digital video campaigning.",
    thenTitle: "Text Brigades & Hello Garci",
    thenBlurb: "Chain texts, wiretap scandals, and satire shows shaped how Filipinos talked politics.",
    image: "./images/people power.png",
    alt: "Civic Protests",
    then: "\"Go 2 EDSA, wear black\" SMS chains that toppled Estrada, the Hello Garci scandal, and political satire shows (Wazzup Wazzup).",
    now: "TikTok viral campaigns, political podcasts, algorithmic influencer endorsements, and live-streamed hearings.",
    change: "From forwarded chain texts to viral videos, live-streamed hearings, and online fact-checking.",
    impact: "SMS chains birthed viral citizen mobilization",
    intro: "Politics moved at the speed of forwarded texts. In January 2001, messages spread calls to gather at EDSA, and the 'text brigade' became part of the story of how crowds were mobilized.",
    facts: [
      "EDSA II (January 2001) is often cited as an early example of text messaging being used to mobilize crowds.",
      "The 'Hello Garci' scandal of 2005 centered on alleged wiretapped phone calls connected to the 2004 elections.",
      "Chain texts like 'Go 2 EDSA, wear black' showed how fast a message could travel with no social media at all."
    ],
    artifacts: [
      { emoji: "📩", name: "Chain text", note: "'Pls pass 2 all' spread news and rumors alike." },
      { emoji: "🖤", name: "Black shirts", note: "A visual signal worn by protesters at EDSA." },
      { emoji: "🎙️", name: "Leaked recordings", note: "Audio clips that shook public trust." },
      { emoji: "📰", name: "Satire shows", note: "Comedy as a way to talk about power." }
    ],
    curator: 2,
    today: {
      icon: "🗳️",
      badge: "Social Media & Streams",
      tag: "VIRAL & LIVE",
      title: "Viral Politics & Live Hearings",
      blurb: "Campaigns, debates, and public hearings now play out on video feeds and live streams.",
      image: "",
      alt: "",
      impact: "Political conversation is faster, louder, and harder to verify.",
      intro: "Political conversation today lives on video platforms, podcasts, and group chats. Campaigns work with creators, hearings are streamed live, and clips can spread nationwide within hours.",
      facts: [
        "Short clips and memes can spread a political message faster than a forwarded text ever could.",
        "Live-streamed hearings and press conferences let anyone watch government proceedings in real time.",
        "Fact-checking has become a big part of online political talk, because misleading posts can spread as quickly as accurate ones."
      ],
      artifacts: [
        { emoji: "📹", name: "Campaign videos", note: "Short clips built for sharing." },
        { emoji: "🎙️", name: "Political podcasts", note: "Long conversations on demand." },
        { emoji: "🔍", name: "Fact-checks", note: "Checking claims before they spread." },
        { emoji: "💬", name: "Group-chat forwards", note: "The modern chain text." }
      ]
    }
  },
  {
    id: "economic",
    wing: "BPO & Economy",
    icon: "💼",
    color: "#12b886",
    domain: "Economic Domain",
    badge: "BPO Nightshifts & Piracy",
    tag: "CALL CENTERS & DVDS",
    title: "The Call Center Boom to the Gig Economy",
    blurb: "Transition from 24/7 BPO nightshift economies and pirated DVDs to cashless e-wallets.",
    thenTitle: "Call Centers & Quiapo DVDs",
    thenBlurb: "Night-shift BPO offices, pirated DVD stalls, and TV rating wars.",
    image: "./images/bpo.png",
    alt: "Urban Business District",
    then: "Explosion of call centers creating the 24/7 night economy, Quiapo pirated DVD stalls, and TV rating wars.",
    now: "Cashless e-wallets (GCash, Maya), platform e-commerce (Shopee, TikTok Shop), and digital content monetization.",
    change: "From night-shift call centers and pirated DVDs to e-wallets, online shops, and gig work.",
    impact: "BPO nightshifts established the 24/7 consumer society",
    intro: "As call centers grew in the 2000s, whole districts stayed awake at night to serve customers overseas. Cities adapted with 24-hour food spots, shuttle services, and late-night shopping.",
    facts: [
      "Call centers worked on overseas time zones, so many agents worked at night in Manila.",
      "GCash began in 2004 as an SMS-based mobile wallet, long before smartphone apps.",
      "Pirated DVDs and CDs from stalls like Quiapo's were a part of everyday entertainment."
    ],
    artifacts: [
      { emoji: "🎧", name: "Agent headset", note: "The uniform of the night-shift workforce." },
      { emoji: "🌙", name: "24/7 eateries", note: "Late-night meals for the BPO crowd." },
      { emoji: "📀", name: "Pirated DVD", note: "Blockbusters before streaming existed." },
      { emoji: "📲", name: "E-wallets", note: "From SMS cash-in to QR payments." }
    ],
    curator: null,
    today: {
      icon: "💳",
      badge: "Cashless & Online",
      tag: "GCASH & E-COMMERCE",
      title: "E-Wallets, Online Shops & Gig Work",
      blurb: "Payments, shopping, and side hustles now happen on an app.",
      image: "",
      alt: "",
      impact: "Money, shopping, and work now move through apps.",
      intro: "Many everyday purchases now happen through e-wallets and online marketplaces, and freelancing or gig work lets people earn from home or on the road.",
      facts: [
        "GCash, which began in 2004 as an SMS-based service, is now a full smartphone wallet.",
        "QR payments are accepted at everything from malls to small neighborhood stores.",
        "Online marketplaces and live-selling let small sellers reach customers across the country."
      ],
      artifacts: [
        { emoji: "📲", name: "E-wallet", note: "Pay, send, and cash in from your phone." },
        { emoji: "🛍️", name: "Online marketplaces", note: "Shop and sell without a physical store." },
        { emoji: "🛵", name: "Delivery riders", note: "Food and parcels at your door." },
        { emoji: "💻", name: "Freelance work", note: "Earn from home or from anywhere." }
      ]
    }
  },
  {
    id: "environmental",
    wing: "Environment (Ondoy)",
    icon: "🌧️",
    color: "#14b8c6",
    domain: "Environmental Domain",
    badge: "Typhoon Ondoy (2009)",
    tag: "DISASTER RESCUE TWEETS",
    title: "Disaster Alerts & Online Rescue Mobilization",
    blurb: "How Typhoon Ondoy in 2009 transformed emergency communication from television to online coordination.",
    thenTitle: "Typhoon Ondoy, 2009",
    thenBlurb: "The flood that pushed Filipinos to rescue each other online.",
    image: "./images/ondoy.png",
    alt: "Storm & Heavy Rain",
    then: "Broadcast TV and radio storm signals; Typhoon Ondoy (2009) prompted the first viral online rescue calls and donation drives.",
    now: "Real-time mobile weather apps, crowd-sourced flood rescue maps, and social media youth climate advocacy.",
    change: "From TV storm signals and the first online rescue calls to real-time apps and crowd-sourced relief.",
    impact: "Sparked community-driven real-time disaster response",
    intro: "On September 26, 2009, Typhoon Ondoy (Ketsana) flooded much of Metro Manila. As phone lines and roads failed, people turned to social media to share locations, request rescue, and organize donations. It was a turning point for how Filipinos respond to disasters online.",
    facts: [
      "Roughly a month's worth of rain fell in a matter of hours, causing widespread flooding.",
      "People used Twitter, Facebook, and hashtags like #rescuePH to relay rescue requests.",
      "Volunteers organized donation drives and relief packing online within days."
    ],
    artifacts: [
      { emoji: "🆘", name: "#rescuePH", note: "A hashtag used to coordinate rescue requests." },
      { emoji: "📻", name: "Battery radio", note: "A lifeline when power went out." },
      { emoji: "🛶", name: "Rescue boats", note: "Neighbors and volunteers helping neighbors." },
      { emoji: "🥫", name: "Relief packs", note: "Community-packed goods organized online." }
    ],
    curator: null,
    today: {
      icon: "🌦️",
      badge: "Real-Time Alerts",
      tag: "APPS & CLIMATE ADVOCACY",
      title: "Weather Apps & Crowd-Sourced Rescue",
      blurb: "Forecasts, flood maps, and relief drives are now organized in real time.",
      image: "",
      alt: "",
      impact: "Communities can warn, rescue, and rebuild together in real time.",
      intro: "Today people check radar and rainfall forecasts on their phones, share flood updates in community groups, and organize relief drives within hours. Young people also use social media to push for climate action.",
      facts: [
        "Weather and radar apps update far more often than a TV bulletin.",
        "Community groups and volunteer networks share road and flood conditions in real time.",
        "Government agencies and news groups now post weather advisories on social media alongside TV and radio."
      ],
      artifacts: [
        { emoji: "🌦️", name: "Weather apps", note: "Forecasts and radar in your pocket." },
        { emoji: "🗺️", name: "Flood maps", note: "Crowd-sourced reports of flooded roads." },
        { emoji: "📣", name: "Relief drives", note: "Donations organized online within hours." },
        { emoji: "🌱", name: "Youth climate groups", note: "Young people campaigning for climate action." }
      ]
    }
  }
];

// ============================================================
// FRIENDSTER PROFILES  (✏️ EDIT ME — make these yours!)
// - avatar: put photos in /images/profiles/ (leave "" to show initials)
// ============================================================
const friendsterProfiles = [
  {
    name: "Ysha Rose Beatrice Hubilla",
    short: "Bea", initials: "BH",
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
    short: "Benz", initials: "BB",
    handle: " BEnzzzz ",
    avatar: "./images/deku.jpg",
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
    short: "Ingrid", initials: "IS",
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
    tab: " Phones",
    title: "Nokia 3310 → 5G Smartphone",
    caption: "From 160-character texts and Snake to video calls, feeds, and live streams in one pocket-sized screen.",
    before: { img: "./images/phones 1.png", emoji: "📟", label: "Nokia 3310, 2002" },
    after:  { img: "./images/modernphones.jpg",  emoji: "📱", label: "5G Smartphone, Today" }
  },
  {
    tab: " Music",
    title: "Burned MP3 CDs → Streaming",
    caption: "Quiapo burned CDs and bulky CD players gave way to Spotify, YouTube Music, and global P-Pop fandoms.",
    before: { img: "./images/opm 1.png", emoji: "💿", label: "Burned MP3 CD, 2005" },
    after:  { img: "./images/ppop.png",  emoji: "🎧", label: "Spotify & P-Pop, Today" }
  },
  {
    tab: " Gaming",
    title: "LAN Shops → Mobile Esports",
    caption: "Rows of bulky CRT monitors running DotA 1 became pro Mobile Legends tournaments watched by millions.",
    before: { img: "./images/internetcafe.jpg", emoji: "🖥️", label: "LAN Shop, 2006" },
    after:  { img: "./images/esports.png",  emoji: "🏆", label: "Mobile Esports, Today" }
  },
  {
    tab: " Sports",
    title: "From One Boxing Icon to a Multi-Sport Golden Era",
    caption: "From halting a nation during Pacquiao's fights to celebrating Olympic golds across gymnastics, weightlifting, and athletics.",
    before: { img: "./images/manny.jpg", emoji: "🥊", label: "Boxing, 2008" },
    after:  { img: "./images/recentsports.png",  emoji: "🥇", label: "Sports, Today" }
  },
];
