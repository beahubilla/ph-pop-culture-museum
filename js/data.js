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
// - sources: [{ title, url, publisher, year, era: "then" | "now" | "both", note }]
//   Shown under each room and in the Sources section at the bottom of the page.
//   Add the references YOU actually used. Always double-check what a source says.
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
    impact: "Turned the Philippines into the 'texting capital of the world'",
    intro: "In the early 2000s the Philippines became known as the 'texting capital of the world'. Phones were small, load was precious, and every character counted. Filipinos squeezed whole conversations into tiny messages.",
    facts: [
      "A single SMS was capped at 160 characters, and texting grew its own lingo, which is why 'txt speak' like 'u', '2', and 'gud am' took off.",
      "Texting took off because it was far cheaper than phone calls or going online at home.",
      "Friendster was founded in the US in 2002 and opened to the public in 2003. Its biggest audience was in Southeast Asia, and by 2008 the Philippines made up about 39% of its traffic."
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
        "In the Digital 2025 report, Filipinos ranked fourth in the world for daily time on social media, at about 3.5 hours a day.",
        "Facebook, YouTube, Messenger, and Instagram take much of that time, and TikTok now competes closely with Facebook (Digital 2026 Philippines report).",
        "About half of Filipino internet users use mobile video calling every month (Digital 2025 report)."
      ],
      artifacts: [
        { emoji: "📱", name: "Smartphone", note: "Camera, maps, wallet, and chat in one device." },
        { emoji: "🎬", name: "Short videos", note: "Reels, Shorts, and TikTok-style clips set trends." },
        { emoji: "👥", name: "Group chats", note: "Class, family, and barkada chats run daily life." },
        { emoji: "📡", name: "5G & Wi-Fi", note: "Faster data replaced counting texts and load." }
      ]
    },
    sources: [
      { title: "3GPP TS 23.040", url: "https://www.3gpp.org/dynareport/23040.htm", publisher: "3GPP", era: "then", note: "Short Message Service technical specification." },
      { title: "Digital 2026: The Philippines", url: "https://datareportal.com/reports/digital-2026-philippines", publisher: "DataReportal", year: "2026", era: "now", note: "Recent digital and social media context." },
      { title: "The Philippine text messaging phenomenon", url: "https://www.philstar.com/lifestyle/business-life/2001/05/15/85823/philippine-text-messaging-phenomenon/amp/", publisher: "The Philippine STAR", year: "2001", era: "then", note: "Texting culture, low cost versus the internet, and 'Generation Txt'." },
      { title: "There was a time when SMS was free", url: "https://gmanetwork.com/news/opinion/content/101788/there-was-a-time-when-sms-was-free/story", publisher: "GMA News", era: "then", note: "The Philippines as the SMS capital of the world." },
      { title: "Applying the Digital Opportunity Index to the Philippines (presentation)", url: "https://itu.int/osg/spuold/digitalbridges/materials/salazar-ppt.pdf", publisher: "ITU / LIRNEasia", era: "then", note: "Why the SMS explosion happened and what people used it for." },
      { title: "Friendster", url: "https://en.wikipedia.org/wiki/Friendster", publisher: "Wikipedia", era: "then", note: "Founding, 2003 launch, and the shift to Southeast Asia." },
      { title: "Social media use in the Philippines", url: "https://en.wikipedia.org/wiki/Social_media_use_in_the_Philippines", publisher: "Wikipedia", era: "both", note: "Friendster's Philippine traffic share and social media use over time." },
      { title: "Filipinos spend more time than global average on social media", url: "https://campaignasia.com/article/filipinos-spend-more-time-than-global-average-on-social-media/500622", publisher: "Campaign Asia", year: "2025", era: "now", note: "Digital 2025 social media time." },
      { title: "Filipinos spend nearly equal time on TikTok, Facebook, report shows", url: "https://www.gmanetwork.com/news/topstories/nation/991811/filipinos-time-tiktok-facebook-report/story/", publisher: "GMA News", era: "now", note: "Digital 2026 Philippines platform time." },
      { title: "Pinoys remain among world's most internet-savvy users — 2025 report", url: "https://interaksyon.philstar.com/trends-spotlights/2025/02/26/292410/pinoys-among-worlds-internet-savvy-users-2025-report/", publisher: "Interaksyon", year: "2025", era: "now", note: "Mobile video calling and internet use." }
    ]
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
    impact: "Made band mania, burned CDs, and dance crazes part of everyday life",
    intro: "The 2000s were a golden age for Pinoy rock and a wild mix of dance crazes and fantasy TV. Music traveled on burned CDs and radio requests.",
    facts: [
      "Bands like Parokya ni Edgar (nicknamed 'The National Band of the Philippines' by local media), Kamikazee, and Sponge Cola were part of the early-2000s Pinoy rock scene, and FM radio and TV helped make them popular.",
      "The SexBomb Girls began as backup dancers on Eat Bulaga! (the group formed in 1999) and grew into multi-platinum recording stars.",
      "Mulawin premiered on GMA Network on August 2, 2004, as a primetime fantasy series."
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
      intro: "Burned CDs gave way to playlists you can stream anywhere. P-Pop groups and their fandoms use social media to reach audiences at home and abroad.",
      facts: [
        "SB19 debuted in October 2018 and entered Billboard's Social 50 chart in December 2019, helped by a growing international fanbase on social media.",
        "BINI debuted in June 2021 and was listed by Teen Vogue among its '12 Girl Groups to Watch in 2024'.",
        "BINI's fans call themselves 'Blooms', and the group's 2021 launch was held as a virtual event for fans and the press."
      ],
      artifacts: [
        { emoji: "🎧", name: "Streaming playlists", note: "Millions of songs, one tap away." },
        { emoji: "💃", name: "Dance challenges", note: "Short clips that turn songs into trends." },
        { emoji: "💬", name: "Fan communities", note: "Fans organize streams, projects, and meet-ups online." },
        { emoji: "📺", name: "Streaming series", note: "Shows on demand instead of waiting for primetime." }
      ]
    },
    sources: [
      { title: "Pogi rock", url: "https://en.wikipedia.org/wiki/Pogi_rock", publisher: "Wikipedia", era: "then", note: "Early-2000s Pinoy rock bands on FM radio and TV." },
      { title: "Parokya ni Edgar", url: "https://en.wikipedia.org/wiki/Parokya_ni_Edgar", publisher: "Wikipedia", era: "then", note: "The band and its 'National Band' nickname." },
      { title: "Kamikazee", url: "https://en.wikipedia.org/wiki/Kamikazee", publisher: "Wikipedia", era: "then", note: "First album in 2002." },
      { title: "SexBomb Girls", url: "https://en.wikipedia.org/wiki/SexBomb_Girls", publisher: "Wikipedia", era: "then", note: "From Eat Bulaga! backup dancers to recording stars." },
      { title: "Mulawin", url: "https://en.wikipedia.org/wiki/Mulawin", publisher: "Wikipedia", era: "then", note: "2004 GMA fantasy series." },
      { title: "Pirate hunters strike", url: "https://philstar.com/metro/2003/07/16/213833/pirate-hunters-strike", publisher: "The Philippine STAR", year: "2003", era: "then", note: "Quiapo and the pirated CD trade." },
      { title: "SB19 (artist page)", url: "https://billboard.com/music/sb19", publisher: "Billboard", era: "now", note: "Debut single and Social 50 chart history." },
      { title: "SB19 ranks as mainstay in Billboard's Social 50 chart", url: "https://gmanetwork.com/entertainment/showbiznews/news/59180/sb19-ranks-as-mainstay-in-billboards-social-50-chart/story", publisher: "GMA Network", era: "now", note: "International fanbase on social media." },
      { title: "ABS-CBN officially launches P-pop girl group BINI", url: "https://abs-cbn.com/2021/6/12/fresh-scoops/abs-cbn-officially-launches-p-pop-girl-group-bini-193975", publisher: "ABS-CBN", year: "2021", era: "now", note: "BINI's 2021 launch and fandom." },
      { title: "Meet Bini, a P-pop girl group introducing the 'modern Filipina' to the world", url: "https://ca.news.yahoo.com/meet-bini-p-pop-girl-004906214.html", publisher: "NextShark via Yahoo News", year: "2024", era: "now", note: "Teen Vogue's 2024 'Girl Groups to Watch' list." }
    ]
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
    then: "Crime reportedly fell to almost zero during Pacquiao boxing broadcasts, plus PBA arena finals and bulky CRT computer shops playing DotA 1 and Counter-Strike.",
    now: "Olympic gold medals (Carlos Yulo, Hidilyn Diaz), professional Esports championships (MPL/MLBB), and mobile game streaming.",
    change: "From one fight night on one TV to Olympic podiums, esports arenas, and highlights on every phone.",
    impact: "Fight nights and LAN shops became shared neighborhood rituals",
    intro: "Sports and games brought neighborhoods together. In the 2000s that meant crowding around one TV for a Pacquiao fight or packing a computer shop for an all-night DotA match.",
    facts: [
      "Pacquiao fight nights became famous for quiet streets, and police often reported close to zero crime while the fights were on.",
      "DotA started as a Warcraft III mod and was a staple of internet cafes across the country.",
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
        "Hidilyn Diaz won the Philippines' first Olympic gold (weightlifting, Tokyo 2020).",
        "Carlos Yulo won the men's floor exercise on August 3, 2024 and the vault the next day, becoming the first Filipino to win two Olympic golds.",
        "Bren Esports won the Mobile Legends world title in January 2021 (M2), and Blacklist International followed in December 2021 (M3) in an all-Filipino final."
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
    },
    sources: [
      { title: "Hidilyn Diaz (athlete profile)", url: "https://olympics.com/en/athletes/hidilyn-diaz", publisher: "Olympics.com", era: "now", note: "Official Olympic results." },
      { title: "Crime rate turns almost zilch on Pacquiao fight days - police", url: "https://gmanetwork.com/news/topstories/nation/63607/crime-rate-turns-almost-zilch-on-pacquiao-fight-days-police/story", publisher: "GMA News", era: "then", note: "Police reports on crime during Pacquiao fights." },
      { title: "Police on alert Sunday despite almost no crime during Pacquiao fights", url: "https://newsinfo.inquirer.net/92331/police-on-alert-sunday-despite-almost-no-crime-during-pacquiao-fights/amp", publisher: "Philippine Daily Inquirer", era: "then", note: "Crime was usually close to zero on fight days." },
      { title: "13 Top PC Games in Computer Cafes in the Philippines", url: "https://news.yahoo.com/13-top-pc-games-computer-200034195.html", publisher: "Tech in Asia via Yahoo News", era: "then", note: "DotA as a Warcraft III map; popular computer cafe games." },
      { title: "In Response to IGN Asia Pacific's 'Overview: Gaming in the Philippines'", url: "https://www.gamedeveloper.com/game-platforms/in-response-to-ign-asia-pacific-s-overview-gaming-in-the-philippines-", publisher: "Game Developer", era: "then", note: "Computer shops and cheap hourly PC rental." },
      { title: "Lakad matatag", url: "https://gameindustry.ph/article/lakad-matatag", publisher: "GameIndustry.ph", era: "then", note: "DotA culture in Philippine internet cafes." },
      { title: "Carlos Yulo and Hidilyn Diaz in Paris", url: "https://gmanetwork.com/news/sports/content/916438/carlos-yulo-and-hidilyn-diaz-in-paris-olympics/story", publisher: "GMA News", year: "2024", era: "now", note: "The Philippines' two Olympic gold medalists." },
      { title: "Meet Carlos Yulo, the Philippines' two-time Olympic gold medalist", url: "https://www.gmanetwork.com/entertainment/photos/meet-carlos-yulo-the-philippines-two-time-olympic-gold-medalist/11728/", publisher: "GMA Network", year: "2024", era: "now", note: "Floor exercise (Aug 3) and vault (Aug 4), 2024." },
      { title: "Blacklist International capture M3 title in historic showdown with Onic PH", url: "https://news.codashop.com/bd/blacklist-international-capture-m3-title-in-historic-showdown-with-onic-ph/", publisher: "Codashop News", year: "2021", era: "now", note: "M3 all-Filipino final; Bren Esports won M2." }
    ]
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
    impact: "Showed that a forwarded text could help gather a crowd",
    intro: "Politics moved at the speed of forwarded texts. In January 2001, messages spread calls to gather at EDSA, and the 'text brigade' became part of the story of how crowds were mobilized.",
    facts: [
      "Text volume reportedly jumped from about 30 million to about 70 million messages a day during the final days of Estrada's impeachment trial and EDSA 2.",
      "The 'Hello Garci' scandal began in June 2005, when audio recordings allegedly of a phone call between President Arroyo and election official Virgilio Garcillano about the 2004 election were released.",
      "Texting was also used for everyday services, like booking movie tickets and reaching government agencies."
    ],
    artifacts: [
      { emoji: "📩", name: "Chain text", note: "'Pls pass 2 all' spread news and rumors alike." },
      { emoji: "💿", name: "'Hello Garci' CDs", note: "Copies of the alleged recordings were played for reporters on CDs." },
      { emoji: "📺", name: "Satire shows", note: "Comedy as a way to talk about power." },
      { emoji: "📣", name: "EDSA gatherings", note: "Crowds gathered at EDSA in January 2001 (EDSA II)." }
    ],
    curator: 2,
    today: {
      icon: "🗳️",
      badge: "Social Media & Fact-Checks",
      tag: "VIRAL & FACT-CHECKED",
      title: "Viral Politics & Fact-Checks",
      blurb: "Campaigns now play out on video feeds and influencer posts, and fact-checkers work to verify claims.",
      image: "",
      alt: "",
      impact: "Political conversation is faster, louder, and harder to verify.",
      intro: "Political conversation today lives on video platforms and group chats. In the 2022 elections, campaigns spread to TikTok, Instagram, and YouTube, and fact-checkers worked to verify claims before they spread.",
      facts: [
        "In 2022, political campaigning spread to TikTok, Instagram, and YouTube, and social media influencers and celebrities helped amplify political messages.",
        "Tsek.ph, an election fact-checking collaboration of media, academe, and civil society, grew from 14 partners in 2019 to 34.",
        "Most of the election content that VERA Files fact-checked in 2022 came from Facebook."
      ],
      artifacts: [
        { emoji: "📹", name: "Campaign videos", note: "Short clips built for sharing." },
        { emoji: "🤳", name: "Influencer posts", note: "Creators and celebrities amplify messages." },
        { emoji: "🔍", name: "Fact-checks", note: "Checking claims before they spread." },
        { emoji: "💬", name: "Group-chat forwards", note: "The modern chain text." }
      ]
    },
    sources: [
      { title: "The Cell Phone and the Crowd", url: "https://doi.org/10.1215/08992363-15-3-399", publisher: "Vicente L. Rafael, Public Culture", year: "2003", era: "then", note: "People Power II and mobile communication." },
      { title: "The Philippine text messaging phenomenon", url: "https://www.philstar.com/lifestyle/business-life/2001/05/15/85823/philippine-text-messaging-phenomenon/amp/", publisher: "The Philippine STAR", year: "2001", era: "then", note: "SMS volume during EDSA 2." },
      { title: "Applying the Digital Opportunity Index to the Philippines (presentation)", url: "https://itu.int/osg/spuold/digitalbridges/materials/salazar-ppt.pdf", publisher: "ITU / LIRNEasia", era: "then", note: "Everyday uses of SMS." },
      { title: "Hello Garci scandal", url: "https://en.wikipedia.org/wiki/Hello_Garci_scandal", publisher: "Wikipedia", era: "then", note: "Timeline and background of the scandal." },
      { title: "What Went Before: Saga of the 'Hello Garci' tapes", url: "https://newsinfo.inquirer.net/606445/what-went-before-saga-of-the-hello-garci-tapes", publisher: "Philippine Daily Inquirer", era: "then", note: "Timeline of the 2005 tapes." },
      { title: "[B-SIDE Podcast] Trolls, TikTok, and the 2022 elections", url: "https://www.bworldonline.com/?p=450089", publisher: "BusinessWorld", year: "2022", era: "now", note: "Campaigning on TikTok, Instagram, and YouTube; influencers." },
      { title: "From Likes to Lies: Disinformation in the Philippines and Thailand", url: "https://fulcrum.sg/from-likes-to-lies-disinformation-in-the-philippines-and-thailand/", publisher: "Fulcrum (ISEAS)", era: "now", note: "Influencers and Tsek.ph in the 2022 election." },
      { title: "VERA Files Fact Check Yearender: Dahil hari ang video, misinformation ang nasa trono sa panahon ng TikTok", url: "https://verafiles.org/articles/vera-files-fact-check-yearender-dahil-hari-ang-video-misinformation-ang-nasa-trono-sa-panahon-ng-tiktok", publisher: "VERA Files", year: "2022", era: "now", note: "Election fact-checks and Tsek.ph growth." },
      { title: "Digital News Report 2022: Philippines", url: "https://reutersinstitute.politics.ox.ac.uk/digital-news-report/2022/philippines", publisher: "Reuters Institute", year: "2022", era: "now", note: "News, social media, and fact-checking in the 2022 election." }
    ]
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
    impact: "Created a night-shift workforce and a city that never slept",
    intro: "As call centers grew in the 2000s, whole districts stayed awake at night to serve customers overseas. Cities adapted with 24-hour food spots, shuttle services, and late-night shopping.",
    facts: [
      "Call centers served overseas customers, so many agents worked at night in Manila.",
      "GCash launched in October 2004 as an SMS-based money-transfer service, years before smartphone apps (the GCash app arrived in 2012).",
      "Pirated CDs and DVDs sold in places like Quiapo were a part of everyday entertainment."
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
        "GCash launched its mobile app in 2012 and now offers QR payments, bills payment, and online checkout.",
        "GCash introduced the Philippines' first mobile-money QR payment in 2017, according to a SunStar feature on its 20th anniversary.",
        "The 2025 Digital Report from Meltwater and We Are Social points to growing use of fintech apps among Filipinos."
      ],
      artifacts: [
        { emoji: "📲", name: "E-wallet", note: "Pay, send, and cash in from your phone." },
        { emoji: "🛍️", name: "Online marketplaces", note: "Shop and sell without a physical store." },
        { emoji: "🛵", name: "Delivery riders", note: "Food and parcels at your door." },
        { emoji: "💻", name: "Freelance work", note: "Earn from home or from anywhere." }
      ]
    },
    sources: [
      { title: "History of Business Process Outsourcing (BPO) in the Philippines", url: "https://www.codev.com/article/history-bpo-philippines", publisher: "Codev", era: "then", note: "1995 economic zone law, first call centers, 24/7 work culture." },
      { title: "Philippines BPO", url: "https://www.outsourceaccelerator.com/glossary/philippines-bpo/", publisher: "Outsource Accelerator", era: "then", note: "Night-shift work for North American clients." },
      { title: "The Philippines is further widening its portfolio of business process outsourcing", url: "https://oxfordbusinessgroup.com/reports/philippines/2018-report/economy/one-call-away-moves-undertaken-to-offer-a-wider-range-of-services-amid-strong-competition-and-reform-to-taxes-and-incentives", publisher: "Oxford Business Group", year: "2018", era: "then", note: "First contact centre (1992) and early-2000s growth." },
      { title: "Pirate hunters strike", url: "https://philstar.com/metro/2003/07/16/213833/pirate-hunters-strike", publisher: "The Philippine STAR", year: "2003", era: "then", note: "Quiapo's role in the pirated disc trade." },
      { title: "The Secret Lives of DVD Bootleggers", url: "https://nextcity.org/informalcity/entry/the-secret-lives-of-manilas-dvd-bootleggers", publisher: "Next City", era: "then", note: "Quiapo as the hub of Manila's pirated-film trade." },
      { title: "GCash", url: "https://en.wikipedia.org/wiki/GCash", publisher: "Wikipedia", era: "both", note: "2004 SMS launch, 2012 app, QR payments." },
      { title: "GCash: 20 years of transformative financial inclusion in the Philippines", url: "https://www.sunstar.com.ph/cebu/feature/gcash-20-years-of-transformative-financial-inclusion-in-the-philippines", publisher: "SunStar", era: "both", note: "From SMS transfers to the first mobile-money QR payment." },
      { title: "More Pinoys use fintech apps, study says", url: "https://malaya.com.ph/info-tech/fintech/more-pinoys-use-fintech-apps-study-says", publisher: "Malaya Business Insight", year: "2025", era: "now", note: "Digital 2025 fintech findings." }
    ]
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
    impact: "Showed how quickly people could ask for help and organize relief online",
    intro: "On September 26, 2009, Typhoon Ondoy (Ketsana) flooded much of Metro Manila. As phone lines and roads failed, people turned to texts and social media to share locations, request rescue, and organize donations. It showed how quickly people could ask for help and organize relief online.",
    facts: [
      "More than a month's worth of rain fell on Metro Manila in just 12 hours.",
      "People used Twitter, Facebook, online maps, and shared spreadsheets to pass along rescue requests.",
      "Online groups collected donations for flood victims within days."
    ],
    artifacts: [
      { emoji: "🆘", name: "Online rescue map", note: "Volunteers compiled flood victims' addresses and a situation map online." },
      { emoji: "📻", name: "Battery radio", note: "A lifeline when power went out." },
      { emoji: "🛶", name: "Rescue boats", note: "Neighbors and volunteers helping neighbors." },
      { emoji: "🥫", name: "Relief packs", note: "Community-packed goods organized online." }
    ],
    curator: null,
    today: {
      icon: "🌦️",
      badge: "Real-Time Alerts",
      tag: "APPS & EARLY WARNINGS",
      title: "Weather Apps & Early Warnings",
      blurb: "Forecasts, flood maps, and early warnings now reach people in near real time.",
      image: "",
      alt: "",
      impact: "Communities can prepare and respond with earlier, clearer warnings.",
      intro: "Today people check weather and flood information on their phones, and agencies publish hazard maps and early warnings online. The government launched Project NOAH in 2012 in response to the lessons of Ondoy.",
      facts: [
        "Project NOAH, launched in July 2012 in Marikina City, a city that Ondoy flooded, provides online flood hazard maps and near real-time weather information.",
        "Marikina's city government receives real-time weather and flood information through mobile apps such as PAGASA, Project NOAH, and ARKO.",
        "Marikina City recorded zero deaths when heavy monsoon rains flooded Metro Manila in August 2012, a month after Project NOAH launched, and the city credits improved preparedness and NOAH."
      ],
      artifacts: [
        { emoji: "🌦️", name: "Weather apps", note: "Real-time weather and flood updates on your phone." },
        { emoji: "🗺️", name: "Flood hazard maps", note: "Online maps show which areas are most at risk." },
        { emoji: "📡", name: "Rain gauges & sensors", note: "Automated stations feed near real-time data." },
        { emoji: "🔔", name: "Early warnings", note: "Project NOAH aimed for a six-hour lead time warning." }
      ]
    },
    sources: [
      { title: "Final Report on Tropical Storm Ondoy and Typhoon Pepeng", url: "https://ndrrmc.gov.ph/index.php/2-uncategorised/1543-final-report-on-tropical-storm-ondoy-and-typhoon-pepeng", publisher: "NDRRMC", year: "2009", era: "then", note: "Official disaster report, 2009." },
      { title: "'Ondoy' leaves 75 dead and missing", url: "https://www.philstar.com/headlines/2009/09/27/508736/ondoy-leaves-75-dead-and-missing", publisher: "The Philippine STAR", year: "2009", era: "then", note: "Rainfall in 12 hours and the early rescue effort." },
      { title: "Philippines: Worst Flooding in 40 Years", url: "https://globalvoices.org/2009/09/27/philippines-worst-flooding-in-40-years/", publisher: "Global Voices", year: "2009", era: "then", note: "Social media, rescue maps, and donation drives during Ondoy." },
      { title: "Ondoy's Onslaught: Philippines Battered By Typhoon", url: "https://asiafoundation.org/?p=2645", publisher: "The Asia Foundation", year: "2009", era: "then", note: "Texting and social networks during the storm." },
      { title: "Weather forecasting in Philippines enters 21st century", url: "https://newsinfo.inquirer.net/252662/weather-forecasting-in-philippines-enters-21st-century", publisher: "Philippine Daily Inquirer", year: "2012", era: "now", note: "Project NOAH's monitoring tools built after Ondoy." },
      { title: "'Noah' vs floods launched", url: "https://www.philstar.com/headlines/2012/07/07/825252/noah-vs-floods-launched", publisher: "The Philippine STAR", year: "2012", era: "now", note: "Project NOAH's launch in Marikina City." },
      { title: "Project NOAH is our reliable partner: Marikina City", url: "https://dost.gov.ph/knowledge-resources/news/34-2014-news/572-project-noah-is-our-reliable-partner-marikina-city.html", publisher: "DOST", year: "2014", era: "now", note: "Mobile apps, flood maps, and Marikina's 2012 results." }
    ]
  }
];

// ============================================================
// IMAGE & AUDIO CREDITS  (✏️ EDIT ME)
// List where your own pictures came from. Shown in the Sources section.
// Example: { item: "Nokia 3310 photo", credit: "Photo by Your Name", url: "" }
// ============================================================
const imageCredits = [];

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
