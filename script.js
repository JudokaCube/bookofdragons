/* ============================================
   Book of Dragons — script.js
   ============================================ */

'use strict';

document.addEventListener('DOMContentLoaded', function () {

/* ── Theme toggle (dark / light), shared storage key with the rest of the site ── */
try {
(function () {
  const root   = document.documentElement;
  const toggle = document.getElementById('themeToggle');
  if (!toggle) return;

  toggle.addEventListener('click', () => {
    const isLight = root.getAttribute('data-theme') === 'light';
    if (isLight) {
      root.removeAttribute('data-theme');
      localStorage.setItem('jdkcube-theme', 'dark');
    } else {
      root.setAttribute('data-theme', 'light');
      localStorage.setItem('jdkcube-theme', 'light');
    }
  });
})();
} catch (e) { console.error('theme toggle setup failed:', e); }



/* ── Dragon data + grid ── */
try {
(function () {

  // Class badges now live locally as assets/<class>.png (the real HTTYD
  // class emblems, dropped in by hand) — this just maps each class name
  // to its filename and renders an <img>, sized/rounded by CSS depending
  // on where it's used (filter chip, class tag, or big tile icon).
  const CLASS_ICON_FILES = {
    Stoker: 'stoker.png',
    Sharp: 'sharp.png',
    Strike: 'strike.png',
    Tidal: 'tidal.png',
    Boulder: 'boulder.png',
    Tracker: 'tracker.png',
    Mystery: 'mystery.png',
  };

  function classIcon(cls) {
    const base = cls.split(' (')[0];
    const file = CLASS_ICON_FILES[base] || CLASS_ICON_FILES.Mystery;
    return `<img src="assets/${file}" alt="${base} class" loading="lazy" />`;
  }

  // Turns a dragon's display name into the filename we look for in
  // assets/dragons/ — lowercase, no spaces, no punctuation/diacritics.
  // e.g. "Hideous Zippleback" -> "hideouszippleback.png",
  //      "Jörmungandr" -> "jormungandr.png"
  function dragonSlug(name) {
    return name
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // strip accents
      .toLowerCase()
      .replace(/[^a-z0-9]/g, ''); // strip spaces, hyphens, apostrophes, etc.
  }

  function dragonImagePath(name) {
    return `assets/dragons/${dragonSlug(name)}.png`;
  }


  const dragons = [
    { name: 'Abomibumble', cls: 'Mystery', size: '≈ 9–11 m long, stocky hybrid build (est.)', weight: '≈ 2,600–3,400 kg (est.)', behaviour: 'A lesser-documented gronckle and monstrous nightmare hybrid.', appears: 'Extended franchise (games, comics & spin-offs)' },
    { name: 'Armorwing', cls: 'Sharp', size: '≈ 7–10 m long (est.)', weight: '≈ 900–1,600 kg, armoured hide (est.)', behaviour: 'Curious and generally docile, with magnetic abilities tied to its metal-like hide.', appears: 'Race to the Edge' },
    { name: 'Barklethorn', cls: 'Sharp', size: '≈ 5–8 m long (est.)', weight: '≈ 300–700 kg (est.)', behaviour: 'Mostly known from spin-off games and comics rather than the films or TV series, so confirmed details remain limited.', appears: 'Extended franchise (games, comics & spin-offs)' },
    { name: 'Bewilderbeast', cls: 'Tidal', size: '≈ 158.5 m long · 45.7 m wingspan', weight: '≈ 90,700 kg (est., official mass unconfirmed)', behaviour: 'A calm, commanding alpha that controls and protects an entire dragon nest using ice breath.', appears: 'HTTYD 2 (2014)' },
    { name: 'Boneknapper', cls: 'Mystery', size: '≈ 15–18 m long (est.)', weight: '≈ 3,000–5,000 kg (est.)', behaviour: 'Elusive and almost mythical; camouflages itself with bones and is patient to the point of holding grudges.', appears: 'Legend of the Boneknapper Dragon (short)' },
    { name: 'Bonestormer', cls: 'Mystery', size: '≈ 10–14 m long, four-winged (est., Stormcutter × Boneknapper)', weight: '≈ 2,500–4,000 kg (est.)', behaviour: 'A bred hybrid combining the Stormcutter\'s four wings and sharp intellect with the Boneknapper\'s bone-camouflaged hide, first introduced as a breedable dragon in the extended franchise.', appears: 'Dragons: Titan Uprising (mobile game)' },
    { name: 'Boomback', cls: 'Mystery', size: '≈ 4–7 m long (est.)', weight: '≈ 300–600 kg (est.)', behaviour: 'One of the many species catalogued by the wider fandom rather than featured heavily on-screen; details are sparse.', appears: 'Extended franchise (games, comics & spin-offs)' },
    { name: 'Bubblegill', cls: 'Tidal', size: '≈ 2–4 m long (est.)', weight: '≈ 40–120 kg (est.)', behaviour: 'A lesser-documented species from the wider franchise (mobile games, comics or spin-offs); solid canon detail is still thin.', appears: 'Extended franchise (games, comics & spin-offs)' },
    { name: 'Bubblehorn', cls: 'Tidal', size: '≈ 5–8 m long (est.)', weight: '≈ 400–900 kg (est.)', behaviour: 'Mostly known from spin-off games and comics rather than the films or TV series, so confirmed details remain limited.', appears: 'Extended franchise (games, comics & spin-offs)' },
    { name: 'Buffalord', cls: 'Tracker', size: '≈ 6–9 m long, thickset (est.)', weight: '≈ 900–1,800 kg (est.)', behaviour: 'Calm grazer that only turns defensive when provoked.', appears: 'Race to the Edge' },
    { name: 'Catastrophic Quaken', cls: 'Boulder', size: '≈ 8–11 m long, boulder-like (est.)', weight: '≈ 4,000–6,500 kg (est.)', behaviour: 'Territorial and easily startled; causes tremors when it stomps.', appears: 'Race to the Edge' },
    { name: 'Cavern Crasher', cls: 'Mystery', size: '≈ 6–9 m long (est.)', weight: '≈ 2,500–4,000 kg (est.)', behaviour: 'A wingless scavenger that burrows fast through rock, flings flammable mucus from its back, and drives other dragons out of their nests to steal eggs and firecomb.', appears: 'Race to the Edge' },
    { name: 'Changewing', cls: 'Mystery', size: '≈ 6–8 m long, 9.1 m wingspan (official wingspan; length est.)', weight: '≈ 431 kg', behaviour: 'Shy unless protecting its young, can camouflage and spits corrosive acid.', appears: 'Riders of Berk' },
    { name: 'Chaperang', cls: 'Tracker', size: '≈ 5–8 m long (est.)', weight: '≈ 300–700 kg (est.)', behaviour: 'One of the many species catalogued by the wider fandom rather than featured heavily on-screen; details are sparse.', appears: 'Extended franchise (games, comics & spin-offs)' },
    { name: 'Chillblaster', cls: 'Mystery', size: '≈ 6–9 m long (est.)', weight: '≈ 500–900 kg (est.)', behaviour: 'A lesser-documented species from the wider franchise (mobile games, comics or spin-offs); solid canon detail is still thin.', appears: 'Extended franchise (games, comics & spin-offs)' },
    { name: 'Chimeragon', cls: 'Mystery', size: '≈ 8–12 m long, composite build (est.)', weight: '≈ 1,500–3,000 kg (est.)', behaviour: 'A human-made hybrid dragon rather than a naturally occurring species, stitched together from traits of others.', appears: 'Extended franchise (games)' },
    { name: 'Copyclaw', cls: 'Sharp', size: '≈ 5–8 m long (est.)', weight: '≈ 300–600 kg (est.)', behaviour: 'Appears in the extended franchise outside the main films/series; specifics haven\'t been fleshed out much yet.', appears: 'Extended franchise (games, comics & spin-offs)' },
    { name: 'Crimson Goregutter', cls: 'Sharp', size: '≈ 8–11 m long, antlered (est.)', weight: '≈ 700–1,300 kg (est.)', behaviour: 'Mostly peaceful grazer with large antler-like horns, but will fight fiercely if cornered.', appears: 'Race to the Edge' },
    { name: 'Crimson Howler', cls: 'Tracker', size: '≈ 5–8 m long (est.)', weight: '≈ 400–800 kg (est.)', behaviour: 'One of the many species catalogued by the wider fandom rather than featured heavily on-screen; details are sparse.', appears: 'Extended franchise (games, comics & spin-offs)' },
    { name: 'Crimson Slash', cls: 'Sharp', size: '≈ 5–7 m long (est.)', weight: '≈ 300–600 kg (est.)', behaviour: 'Quick and aggressive, with blade-like claws built for slashing through dense brush.', appears: 'Race to the Edge' },
    { name: 'Deadly Nadder', cls: 'Sharp', size: '9.1 m long · 12.8 m wingspan', weight: '≈ 1,192 kg', behaviour: 'Vain and proud; loves attention and being praised, fires spines when threatened.', appears: 'How to Train Your Dragon (2010)' },
    { name: 'Deadly Spinner', cls: 'Sharp', size: '≈ 5–8 m long (est.)', weight: '≈ 350–700 kg (est.)', behaviour: 'A lesser-documented species from the wider franchise (mobile games, comics or spin-offs); solid canon detail is still thin.', appears: 'Extended franchise (games, comics & spin-offs)' },
    { name: 'Death Song', cls: 'Mystery', size: '≈ 12–15 m long (est.)', weight: '≈ 2,500–4,000 kg (est.)', behaviour: 'Predatory and dangerous when hungry, lures prey with a hypnotic song and traps them in amber.', appears: 'Race to the Edge' },
    { name: 'Deathgripper', cls: 'Strike', size: '≈ 9–12 m long (est.) · 11.8 m wingspan (official)', weight: '≈ 1,800–3,000 kg (est.)', behaviour: 'Highly aggressive and territorial, with a venomous stinger and crushing claws; very difficult to tame.', appears: 'HTTYD: The Hidden World (2019)' },
    { name: 'Devilish Dervish', cls: 'Sharp', size: '≈ 4–6 m long (est.)', weight: '≈ 200–450 kg (est.)', behaviour: 'Wild, stubborn, and reckless; uses its scythe-like tail to slash through trees, leaving forests in disarray wherever it roams.', appears: 'School of Dragons (game)' },
    { name: 'Divewing', cls: 'Tidal', size: '≈ 5–8 m long (est.)', weight: '≈ 400–800 kg (est.)', behaviour: 'Mostly known from spin-off games and comics rather than the films or TV series, so confirmed details remain limited.', appears: 'Extended franchise (games, comics & spin-offs)' },
    { name: 'Dramillion', cls: 'Mystery', size: '≈ 4–6 m long, slender build (est.)', weight: '≈ 150–350 kg (est.)', behaviour: 'Known as the "parrot of the dragon world," wary of humans but able to mimic and even combine the fire blasts of any dragon it sees.', appears: 'Race to the Edge' },
    { name: 'Egg Biter', cls: 'Sharp', size: '≈ 6–8 m long, stocky and thick-tailed (est.)', weight: '≈ 800–1,400 kg (est.)', behaviour: 'Bites the first thing it sees the moment it hatches and stays fiercely protective of its rider ever after; a sturdy, thick-tailed dragon that fires an especially hot blue flame.', appears: 'How to Train Your Dragon Live Spectacular (2012)' },
    { name: 'Eruptodon', cls: 'Boulder', size: '6.1 m long · 9.1 m wingspan', weight: '≈ 5,000–8,000 kg (est.)', behaviour: 'A gentle giant that eats lava rock and sneezes fireballs when it has a cold.', appears: 'Race to the Edge' },
    { name: 'Evolved Scuttleclaw', cls: 'Tracker', size: '≈ 6–8 m long (est.)', weight: '≈ 600–1,000 kg (est.)', behaviour: 'A stronger, more vividly-patterned variant of the Scuttleclaw seen in spin-off games rather than the TV series.', appears: 'Extended franchise (mobile games)' },
    { name: 'Fastfin', cls: 'Tidal', size: '≈ 4–6 m long, streamlined (est.)', weight: '≈ 200–450 kg (est.)', behaviour: 'One of the many species catalogued by the wider fandom rather than featured heavily on-screen; details are sparse.', appears: 'Extended franchise (games, comics & spin-offs)' },
    { name: 'Fathomfin', cls: 'Tidal', size: '≈ 6–9 m long (est.)', weight: '≈ 500–1,000 kg (est.)', behaviour: 'A lesser-documented species from the wider franchise (mobile games, comics or spin-offs); solid canon detail is still thin.', appears: 'Extended franchise (games, comics & spin-offs)' },
    { name: 'Fault Ripper', cls: 'Sharp', size: '≈ 6–9 m long (est.)', weight: '≈ 700–1,300 kg (est.)', behaviour: 'Mostly known from spin-off games and comics rather than the films or TV series, so confirmed details remain limited.', appears: 'Extended franchise (games, comics & spin-offs)' },
    { name: 'Featherhide', cls: 'Mystery', size: '≈ 4–6 m long (est.)', weight: '≈ 150–350 kg (est.)', behaviour: 'Appears in the extended franchise outside the main films/series; specifics haven\'t been fleshed out much yet.', appears: 'Extended franchise (games, comics & spin-offs)' },
    { name: 'Fire Fury', cls: 'Stoker', size: '≈ 4–6 m long (est.)', weight: '≈ 200–400 kg (est.)', behaviour: 'One of the many species catalogued by the wider fandom rather than featured heavily on-screen; details are sparse.', appears: 'Extended franchise (games, comics & spin-offs)' },
    { name: 'Fire Terror', cls: 'Stoker', size: '≈ 1–1.5 m long, Night Terror-sized (est.)', weight: '≈ 8–15 kg (est.)', behaviour: 'A red-hued Night Terror subspecies that lives in volcanic caves and eats fire and lava; hunts in packs but has a long-standing, protective bond with Eruptodon eggs.', appears: 'Race to the Edge ("Out of the Frying Pan")' },
    { name: 'Firefang', cls: 'Stoker', size: '≈ 6–8 m long (est.)', weight: '≈ 900–1,500 kg (est.)', behaviour: 'Normally placid and curious, burrowing into shorelines with only its heated head-frill and fangs showing; became infamous after Drago Bludvist unleashed an armored Firefang on a meeting of chiefs.', appears: 'HTTYD 2 (2014)' },
    { name: 'Fireworm', cls: 'Stoker', size: '≈ 5 cm long', weight: '≈ 0.34 kg', behaviour: 'Lives in large colonies and is placid unless its nest is disturbed.', appears: 'Riders of Berk' },
    { name: 'Fireworm Queen', cls: 'Stoker', size: '≈ 14–16 m long (est., comparable to a Boneknapper)', weight: '≈ 2,778 kg (queen); ≈ 2,722–3,629 kg (plain queen variants)', behaviour: 'Highly aggressive and territorial while guarding her nest and firecombs, but not malicious; her venom can reignite a fellow Stoker Class dragon\'s dying flame, as she did for Snotlout\'s Hookfang.', appears: 'Defenders of Berk ("Race to Fireworm Island")' },
    { name: 'Flame Thrower', cls: 'Stoker', size: '≈ 4–6 m long (est.)', weight: '≈ 200–400 kg (est.)', behaviour: 'A lesser-documented species from the wider franchise (mobile games, comics or spin-offs); solid canon detail is still thin.', appears: 'Extended franchise (games, comics & spin-offs)' },
    { name: 'Flame Whipper', cls: 'Stoker', size: '≈ 5–7 m long (est.)', weight: '≈ 300–550 kg (est.)', behaviour: 'Mostly known from spin-off games and comics rather than the films or TV series, so confirmed details remain limited.', appears: 'Extended franchise (games, comics & spin-offs)' },
    { name: 'Flightmare', cls: 'Mystery', size: '≈ 6–8 m long (est.)', weight: '≈ 400–700 kg (est.)', behaviour: 'Eerie and nocturnal, glows and can freeze enemies in place with a paralyzing gaze.', appears: 'Race to the Edge' },
    { name: 'Flood Fang', cls: 'Tidal', size: '≈ 6–9 m long (est.)', weight: '≈ 500–900 kg (est.)', behaviour: 'Appears in the extended franchise outside the main films/series; specifics haven\'t been fleshed out much yet.', appears: 'Extended franchise (games, comics & spin-offs)' },
    { name: 'Flyhopper', cls: 'Mystery', size: '≈ 2–4 m long (est.)', weight: '≈ 60–150 kg (est.)', behaviour: 'One of the many species catalogued by the wider fandom rather than featured heavily on-screen; details are sparse.', appears: 'Extended franchise (games, comics & spin-offs)' },
    { name: 'Foreverhorn', cls: 'Mystery', size: '≈ 6–9 m long (est.)', weight: '≈ 500–900 kg (est.)', behaviour: 'A lesser-documented species from the wider franchise (mobile games, comics or spin-offs); solid canon detail is still thin.', appears: 'Extended franchise (games, comics & spin-offs)' },
    { name: 'Foreverwing', cls: 'Mystery', size: '≈ 15–35 m long, grows larger with age (est.)', weight: '≈ 8,000–18,000 kg (est.)', behaviour: 'A colossal, ancient dragon covered in forest growth that sleeps for most of its life; lazy but has a huge temper if disturbed, and can breathe destructive lava.', appears: 'Dragons: Rise of Berk (game)' },
    { name: 'Gem Blaster', cls: 'Mystery', size: '≈ 5–7 m long (est.)', weight: '≈ 300–600 kg (est.)', behaviour: 'Mostly known from spin-off games and comics rather than the films or TV series, so confirmed details remain limited.', appears: 'Extended franchise (games, comics & spin-offs)' },
    { name: 'Gembreaker', cls: 'Mystery', size: '≈ 6–9 m long (est.)', weight: '≈ 700–1,200 kg (est.)', behaviour: 'Appears in the extended franchise outside the main films/series; specifics haven\'t been fleshed out much yet.', appears: 'Extended franchise (games, comics & spin-offs)' },
    { name: 'Gigantic Grumplumper', cls: 'Boulder', size: '≈ 12–18 m long (est.)', weight: '≈ 6,000–10,000 kg (est.)', behaviour: 'One of the many species catalogued by the wider fandom rather than featured heavily on-screen; details are sparse.', appears: 'Extended franchise (games, comics & spin-offs)' },
    { name: 'Glass Caster', cls: 'Mystery', size: '≈ 5–7 m long (est.)', weight: '≈ 300–600 kg (est.)', behaviour: 'A lesser-documented species from the wider franchise (mobile games, comics or spin-offs); solid canon detail is still thin.', appears: 'Extended franchise (games, comics & spin-offs)' },
    { name: 'Gobsucker', cls: 'Boulder', size: '≈ 6–9 m long, boulder-like (est.)', weight: '≈ 2,000–3,500 kg (est.)', behaviour: 'Mostly known from spin-off games and comics rather than the films or TV series, so confirmed details remain limited.', appears: 'Extended franchise (games, comics & spin-offs)' },
    { name: 'Golden Dragon', cls: 'Mystery', size: '≈ 6–9 m long (est.)', weight: '≈ 500–1,000 kg (est.)', behaviour: 'Appears in the extended franchise outside the main films/series; specifics haven\'t been fleshed out much yet.', appears: 'Extended franchise (games, comics & spin-offs)' },
    { name: 'Grapple Grounder', cls: 'Boulder', size: '≈ 5–7 m long (est.)', weight: '≈ 350–650 kg (est.)', behaviour: 'A fast, springy, serpent-like dragon, aggressive toward other dragons and able to fire pulse blasts.', appears: 'Dragons: Rise of Berk (game)' },
    { name: 'Grapple Snapper', cls: 'Mystery', size: '≈ 5–7 m long (est.)', weight: '≈ 350–650 kg (est.)', behaviour: 'Ambushes prey using strong jaws and a low, ground-hugging hunting style.', appears: 'Race to the Edge' },
    { name: 'Green Death', cls: 'Stoker', size: '≈ 90–120 m long (est., hive-queen scale)', weight: '≈ 45,000–70,000 kg (est.)', behaviour: 'A giant hive-queen dragon in the same mold as the Red Death, appearing in the wider franchise outside the first film.', appears: 'Extended franchise (comics/games)' },
    { name: 'Grim Gnasher', cls: 'Sharp', size: '≈ 2–3 m long (est.)', weight: '≈ 40–90 kg (est.)', behaviour: 'A sneaky pack hunter that circles injured or elderly dragons before striking; regenerates rows of shark-like teeth it can fire in blasts.', appears: 'Race to the Edge' },
    { name: 'Groncicle', cls: 'Boulder', size: '≈ 4–5 m long, thickset (est.)', weight: '≈ 2,200–2,800 kg (est.)', behaviour: 'A peaceful, social cousin of the Gronckle with ice in its veins; freezes the water around it as it swims and fires explosive blasts of liquid nitrogen.', appears: 'Dragons: Rise of Berk (game)' },
    { name: 'Gronckle', cls: 'Boulder', size: '4.5 m long · 5.5 m wingspan', weight: '≈ 2,596 kg', behaviour: 'Lazy and easygoing despite eating rocks; surprisingly strong fliers once moving.', appears: 'How to Train Your Dragon (2010)' },
    { name: 'Hackatoo', cls: 'Sharp', size: '≈ 6–8 m long (est.)', weight: '≈ 600–1,000 kg (est.)', behaviour: 'Reckless and impulsive; uses its axe-like beak to cut down trees for wood, though it often gets its snout stuck in the trunk.', appears: 'Dragons: Rise of Berk (game)' },
    { name: 'Hideous Heatwing', cls: 'Stoker', size: '≈ 5–7 m long (est.)', weight: '≈ 400–700 kg (est.)', behaviour: 'A lesser-documented species from the wider franchise (mobile games, comics or spin-offs); solid canon detail is still thin.', appears: 'Extended franchise (games, comics & spin-offs)' },
    { name: 'Hideous Zippleback', cls: 'Mystery', size: '20.1 m long · 11.6 m wingspan', weight: '≈ 2,738 kg', behaviour: 'Mischievous and a little dim; the two heads have to work together to attack (gas + spark).', appears: 'How to Train Your Dragon (2010)' },
    { name: 'Hobblegrunt', cls: 'Stoker', size: '≈ 6–12 m long (est.)', weight: '≈ 400–1,200 kg (est.)', behaviour: 'Calm and sensitive; changes color like a mood ring and can sense — and even calm or rile up — the emotions of nearby dragons and people with its head frill.', appears: 'HTTYD 2 (2014)' },
    { name: 'Hobgobbler', cls: 'Mystery', size: '≈ 2–6 m long (est.)', weight: '≈ 50–300 kg (est.)', behaviour: 'A small, plump dragon with an enormous appetite; coats itself in flammable slobber and devours everything in its path when hunting in packs, like airborne piranhas.', appears: 'HTTYD: The Hidden World (2019)' },
    { name: 'Hotburple', cls: 'Boulder', size: '≈ 4.3 m long · 5.5 m wingspan', weight: '≈ 2,596 kg', behaviour: 'Sleepy and slow-moving, mostly harmless unless woken suddenly.', appears: 'Race to the Edge' },
    { name: 'Jörmungandr', cls: 'Mystery', size: 'Unknown, said to be enormous', weight: 'Unknown', behaviour: 'A mythical serpent-dragon tied to Norse-inspired franchise lore rather than a confirmed, documented species.', appears: 'Referenced in franchise lore (mythical)' },
    { name: 'Large Shadow Wing', cls: 'Strike', size: '≈ 10–13 m long, broad-winged (est.)', weight: '≈ 1,800–2,800 kg (est.)', behaviour: 'The larger of the two Shadow Wing variants; a stealthy glider that hunts using its dark, light-absorbing hide to vanish against night skies.', appears: 'Extended franchise (games, comics & spin-offs)' },
    { name: 'Light Fury', cls: 'Strike', size: '≈ 2–6 m long (est.)', weight: '≈ 50–300 kg (est.)', behaviour: 'Wild and wary of humans; can turn invisible-ish via camouflage scales.', appears: 'HTTYD: The Hidden World (2019)' },
    { name: 'Luminous Krayfin', cls: 'Tidal', size: '≈ 3–5 m long, crustacean-plated (est.)', weight: '≈ 150–350 kg (est.)', behaviour: 'A shallow-water dragon with bioluminescent fin-plates that pulse with light to confuse predators and attract small prey at night.', appears: 'Extended franchise (games, comics & spin-offs)' },
    { name: 'Lycanwing', cls: 'Mystery', size: '≈ 5–7 m long, wolf-like build (est.)', weight: '≈ 350–650 kg (est.)', behaviour: 'A wolfish, fur-maned dragon said to hunt in small coordinated packs at dusk; treated by much of the fandom as a theoretical species since it has never been formally confirmed on-screen.', appears: 'Disputed / theoretical (fan discussion)' },
    { name: 'Magma Breather', cls: 'Stoker', size: '≈ 7–10 m long, thick-hided (est.)', weight: '≈ 1,200–2,200 kg (est.)', behaviour: 'A volcano-dwelling dragon whose molten-orange throat sac lets it exhale superheated gas; sluggish in cool air but highly active near heat sources.', appears: 'Extended franchise (games, comics & spin-offs)' },
    { name: 'Memorazor', cls: 'Sharp', size: '≈ 5–8 m long, blade-crested (est.)', weight: '≈ 400–800 kg (est.)', behaviour: 'Named for the razor-sharp crest running along its skull, used both to slice through foliage and to intimidate rivals during territorial displays.', appears: 'Extended franchise (games, comics & spin-offs)' },
    { name: 'Mimicore', cls: 'Mystery', size: '≈ 4–6 m long, adaptable build (est.)', weight: '≈ 200–450 kg (est.)', behaviour: 'A shapeshifting-adjacent species able to mimic the colouration and rough silhouette of nearby dragons, making it notoriously hard for trainers to identify at a glance.', appears: 'Extended franchise (games, comics & spin-offs)' },
    { name: 'Mist Twister', cls: 'Mystery', size: '≈ 6–9 m long (est.)', weight: '≈ 500–900 kg (est.)', behaviour: 'Exhales a cold, disorienting mist that it spirals through the air, using the resulting fog bank as cover to ambush prey or slip away from threats.', appears: 'Extended franchise (games, comics & spin-offs)' },
    { name: 'Moldruffle', cls: 'Stoker', size: '≈ 12–20 m long (est.)', weight: '≈ 1,500–4,000 kg (est.)', behaviour: 'Catlike, curious, and an excellent long-range hunter; gathers fire along its wings and fan-like tail to unleash a powerful fireball.', appears: 'School of Dragons (game)' },
    { name: 'Monstrous Nightmare', cls: 'Stoker', size: '18.6 m long · 20.7 m wingspan', weight: '≈ 2,268 kg', behaviour: 'Hot-tempered and aggressive at first, but becomes a stubbornly loyal companion once trained.', appears: 'How to Train Your Dragon (2010)' },
    { name: 'Mudraker', cls: 'Tracker', size: '≈ 6–12 m long (est.)', weight: '≈ 400–1,200 kg (est.)', behaviour: 'Playful and happy-go-lucky in swamps; uses sonic blasts and echolocation to sense its surroundings, and loves splashing mud on trainers.', appears: 'School of Dragons (game)' },
    { name: 'Night Fury', cls: 'Strike', size: '7.9 m long · 13.7 m wingspan', weight: '≈ 806 kg', behaviour: 'Extremely rare and intelligent; cautious of strangers but fiercely loyal once bonded.', appears: 'How to Train Your Dragon (2010)' },
    { name: 'Night Terror', cls: 'Mystery', size: '≈ 1–1.5 m long, Night Terror-sized (est.)', weight: '≈ 8–15 kg (est.)', behaviour: 'A small, dark-scaled cousin of the Terrible Terror that is most active after dark; skittish around humans but travels in loose, chattering groups.', appears: 'Extended franchise (games, comics & spin-offs)' },
    { name: 'Octofin', cls: 'Tidal', size: '≈ 3–5 m long, eight-finned (est.)', weight: '≈ 150–400 kg (est.)', behaviour: 'Propels itself with an unusual set of eight fin-like limbs, giving it exceptional agility underwater and a distinctive rippling swimming gait.', appears: 'Extended franchise (games, comics & spin-offs)' },
    { name: 'Piercing Shriekscale', cls: 'Mystery', size: '≈ 6–9 m long (est.)', weight: '≈ 500–900 kg (est.)', behaviour: 'Lets out a piercing, high-pitched shriek to disorient rivals before closing in with narrow, piercing teeth built for gripping slippery prey.', appears: 'Extended franchise (games, comics & spin-offs)' },
    { name: 'Prickleboggle', cls: 'Sharp', size: '≈ 2–6 m long (est.)', weight: '≈ 50–300 kg (est.)', behaviour: 'Not built for combat, but has essential healing powers that let it calm and mend even the most ferocious wounded dragons; defensive skin shields it while it works.', appears: 'School of Dragons (game)' },
    { name: 'Puffertail', cls: 'Mystery', size: '≈ 3–5 m long (est.)', weight: '≈ 100–250 kg (est.)', behaviour: 'Inflates a spiked tail-sac when threatened, much like a pufferfish, to appear larger and deter predators before it has to fight or flee.', appears: 'Extended franchise (games, comics & spin-offs)' },
    { name: 'Purple Death', cls: 'Stoker', size: '≈ 30–160 m long (est.)', weight: '≈ 20,000+ kg (est.)', behaviour: 'Another massive hive-queen species, generally treated as distinct from the Red and Green Death by fans.', appears: 'Extended franchise (comics/games)' },
    { name: 'Raincutter', cls: 'Sharp', size: '≈ 12–20 m long (est.)', weight: '≈ 1,500–4,000 kg (est.)', behaviour: 'Loves wet, rainy places; its fire stays lit even in a downpour, and it digs up worms and grubs from soaked soil with its long, tendril-fringed chin.', appears: 'HTTYD 2 (2014)' },
    { name: 'Razortooth Metalmaw', cls: 'Sharp', size: '≈ 7–10 m long, heavily fanged (est.)', weight: '≈ 1,200–2,000 kg (est.)', behaviour: 'Possesses an unusually hard, metallic-sheened jaw and teeth capable of shearing through thick hide and light armour alike.', appears: 'Extended franchise (games, comics & spin-offs)' },
    { name: 'Razorwhip', cls: 'Sharp', size: '≈ 12–20 m long (est.) · 15.2 m wingspan (official)', weight: '≈ 400–1,200 kg (est.)', behaviour: 'Proud and graceful in flight; fiercely loyal once a bond is formed.', appears: 'Riders of Berk' },
    { name: 'Red Death', cls: 'Stoker', size: '≈ 121.9 m long · ≈ 30 m tall (official film scale)', weight: 'Unpublished (est. 60,000+ kg given its scale)', behaviour: 'A ruthless hive-queen that commands smaller dragons to feed it; territorial and dangerous.', appears: 'How to Train Your Dragon (2010)' },
    { name: 'Relentless Rainbowhorn', cls: 'Mystery', size: '≈ 6–9 m long (est.)', weight: '≈ 500–1,000 kg (est.)', behaviour: 'Displays a shifting, rainbow-hued horn during mating and territorial displays, and is known for pursuing rivals with unusual persistence.', appears: 'Extended franchise (games, comics & spin-offs)' },
    { name: 'Relentless Razorwing', cls: 'Sharp', size: '≈ 6–9 m long (est.)', weight: '≈ 500–900 kg (est.)', behaviour: 'A tenacious flier with blade-edged wing membranes; once it marks a target or territory it rarely gives up the chase.', appears: 'Extended franchise (games, comics & spin-offs)' },
    { name: 'Ripwrecker', cls: 'Tidal', size: '≈ 12–20 m long (est.)', weight: '≈ 5,000–10,000 kg (est.)', behaviour: 'A massive, territorial deep-sea dragon that grabs ships and prey with its long prehensile tail and shoots corrosive acid at intruders.', appears: 'Dangers of the Deep (comic) / Dragons: Rise of Berk' },
    { name: 'Roaming Ramblefang', cls: 'Mystery', size: '≈ 6–9 m long (est.)', weight: '≈ 500–900 kg (est.)', behaviour: 'A nomadic species that rarely settles in one nest for long, roaming wide territories and marking trails with scent and shed fangs.', appears: 'Extended franchise (games, comics & spin-offs)' },
    { name: 'Rockspitter', cls: 'Boulder', size: '≈ 7–10 m long, boulder-plated (est.)', weight: '≈ 2,500–4,500 kg (est.)', behaviour: 'Swallows small stones and spits them out at high speed as a defensive projectile attack, much like a slingshot built into its jaw.', appears: 'Extended franchise (games, comics & spin-offs)' },
    { name: 'Rumblehorn', cls: 'Tracker', size: '≈ 12–20 m long (est.)', weight: '≈ 5,000–10,000 kg (est.)', behaviour: 'Calm and dependable, with heavily armored plating, a powerful tusked headbutt, and a keen sense of smell that can track a scent across long distances.', appears: 'HTTYD 2 (2014)' },
    { name: 'Sand Wraith', cls: 'Tidal', size: '≈ 6–12 m long (est.)', weight: '≈ 400–1,200 kg (est.)', behaviour: 'A sandy-brown camouflage expert that buries itself to ambush prey by surprise.', appears: 'Dragons: Rise of Berk (game)' },
    { name: 'Sandbuster', cls: 'Mystery', size: '≈ 6–9 m long, desert-built (est.)', weight: '≈ 700–1,300 kg (est.)', behaviour: 'Adapted to arid terrain, it can burrow rapidly through loose sand to ambush prey or escape the midday heat.', appears: 'Extended franchise (games, comics & spin-offs)' },
    { name: 'Scauldron', cls: 'Tidal', size: '≈ 31.3 m long · 31.8 m wingspan', weight: '≈ 1,361 kg', behaviour: 'Patient, whale-like ambush predator that hunts in pods and blasts scalding boiling water at prey and intruders.', appears: 'Book of Dragons (short)' },
    { name: 'Screaming Death', cls: 'Boulder', size: '≈ 111 m long (est. from on-screen scale)', weight: 'Colossal (unpublished)', behaviour: 'An obsessive, relentless burrower related to the Whispering Death, known for its piercing screech.', appears: 'Defenders of Berk' },
    { name: 'Scuttleclaw', cls: 'Tracker', size: '≈ 6–12 m long (est.)', weight: '≈ 400–1,200 kg (est.)', behaviour: 'A camouflage-capable dragon used by Dagur the Deranged; blends into rocky terrain and strikes from ambush.', appears: 'Dragons: Race to the Edge' },
    { name: 'Sea Gronckle', cls: 'Tidal', size: '≈ 4–5 m long, stocky (est., Gronckle-sized)', weight: '≈ 2,000–2,600 kg (est.)', behaviour: 'A saltwater-adapted cousin of the Gronckle with denser, water-resistant scales; just as placid but prefers coastal rock to inland caves.', appears: 'Extended franchise (games, comics & spin-offs)' },
    { name: 'Seashocker', cls: 'Tidal', size: '≈ 6–9 m long (est.)', weight: '≈ 500–1,000 kg (est.)', behaviour: 'Generates a mild electric charge along its fins, using small shocks to stun fish and deter would-be predators in open water.', appears: 'Extended franchise (games, comics & spin-offs)' },
    { name: 'Sentinel', cls: 'Boulder', size: '≈ 12–20 m long (est.)', weight: '≈ 1,500–4,000 kg (est.)', behaviour: 'Blind guardians of the dragon graveyard on Vanaheim; stand motionless as stone for days, then wake instantly to defend the island with sonic screeches and wing-blasts.', appears: 'Race to the Edge' },
    { name: 'Shellfire', cls: 'Stoker', size: '≈ 5–7 m long, shell-backed (est.)', weight: '≈ 500–900 kg (est.)', behaviour: 'Carries a heat-resistant, shell-like plating across its back that glows faintly when its internal fire sacs are active.', appears: 'Extended franchise (games, comics & spin-offs)' },
    { name: 'Shivertooth', cls: 'Sharp', size: '≈ 12–20 m long (est.)', weight: '≈ 1,500–4,000 kg (est.)', behaviour: 'A mischievous, cat-like prankster with razor-sharp claws and remarkable speed and agility for a Sharp Class dragon.', appears: 'Dragons: Rise of Berk (game)' },
    { name: 'Shockjaw', cls: 'Tidal', size: '≈ 12–20 m long (est.)', weight: '≈ 1,500–4,000 kg (est.)', behaviour: 'A fast, solitary swimmer that fires bio-electric blasts from tendrils on its jaw, powerful enough underwater to down a ship and crew.', appears: 'Dragons: Rise of Berk (game)' },
    { name: 'Shocktail', cls: 'Mystery', size: '≈ 6–9 m long (est.)', weight: '≈ 500–900 kg (est.)', behaviour: 'Delivers a sharp electric jolt through a specialised tail tip, using it both to hunt in murky water and to fend off larger rivals.', appears: 'Extended franchise (games, comics & spin-offs)' },
    { name: 'Shovelhelm', cls: 'Boulder', size: '≈ 12–20 m long (est.)', weight: '≈ 1,500–4,000 kg (est.)', behaviour: 'A broad, shovel-headed digger Fishlegs briefly rode early in Race to the Edge before finding Meatlug\'s cousins elsewhere.', appears: 'Dragons: Race to the Edge' },
    { name: 'Silkspanner', cls: 'Sharp', size: '≈ 5–7 m long (est.)', weight: '≈ 300–600 kg (est.)', behaviour: 'Spins fine, web-like strands from glands near its jaw to snare small prey or reinforce its nest against wind and rain.', appears: 'Extended franchise (games, comics & spin-offs)' },
    { name: 'Silver Phantom', cls: 'Stoker', size: '≈ 12–20 m long (est.)', weight: '≈ 400–1,200 kg (est.)', behaviour: 'Elusive and almost ghostlike in flight; rarely seen and highly intelligent.', appears: 'Extended franchise (HTTYD books & School of Dragons game)' },
    { name: 'Silver-tailed Ironclaw', cls: 'Sharp', size: '≈ 6–9 m long, armoured (est.)', weight: '≈ 1,000–1,800 kg (est.)', behaviour: 'Named for its distinctive silver-sheened tail and reinforced claws, strong enough to dig through packed earth and loose rock with ease.', appears: 'Extended franchise (games, comics & spin-offs)' },
    { name: 'Singetail', cls: 'Stoker', size: '≈ 6–12 m long (est.)', weight: '≈ 400–1,200 kg (est.)', behaviour: 'Fiercely territorial, with chameleon-like eyes for a 360° view; shoots fire from its jaws, gills, and tail alike, and calls reinforcements by setting the land ablaze.', appears: 'Race to the Edge' },
    { name: 'Skrill', cls: 'Strike', size: 'Similar in size to a Scuttleclaw · ≈ 9.4 m wingspan', weight: 'Heavy (unpublished)', behaviour: 'Reclusive and nearly untrainable; rides lightning bolts for supersonic bursts of speed and channels it into powerful electric blasts.', appears: 'Book of Dragons (short)' },
    { name: 'Sky Torcher', cls: 'Stoker', size: '≈ 5–7 m long (est.)', weight: '≈ 350–650 kg (est.)', behaviour: 'A high-altitude flier that ignites brief bursts of flame mid-dive, using the flash of light and heat to disorient prey below.', appears: 'Extended franchise (games, comics & spin-offs)' },
    { name: 'Slinkwing', cls: 'Mystery', size: '≈ 4–6 m long, low-slung build (est.)', weight: '≈ 150–350 kg (est.)', behaviour: 'Keeps a low, slinking posture close to the ground and moves with unusual stealth, preferring to avoid confrontation over fighting.', appears: 'Extended franchise (games, comics & spin-offs)' },
    { name: 'Slippery Slickscale', cls: 'Mystery', size: '≈ 5–7 m long (est.)', weight: '≈ 300–600 kg (est.)', behaviour: 'Secretes a slick, oily coating over its scales that lets it wriggle free of a predator\'s grip almost instantly.', appears: 'Extended franchise (games, comics & spin-offs)' },
    { name: 'Sliquifier', cls: 'Tidal', size: '≈ 6–12 m long (est.)', weight: '≈ 400–1,200 kg (est.)', behaviour: 'The fastest swimmer among Tidal Class dragons; churns up a powerful acid stream to fire at threats, the blast growing stronger the faster it moves.', appears: 'Dragons: Rise of Berk (game)' },
    { name: 'Slithersong', cls: 'Mystery', size: '≈ 6–12 m long (est.)', weight: '≈ 50–300 kg (est.)', behaviour: 'Uses a hypnotic singing call to lure and confuse prey before striking.', appears: 'Race to the Edge' },
    { name: 'Slitherwing', cls: 'Mystery', size: '≈ 6–9 m long, serpentine (est.)', weight: '≈ 400–800 kg (est.)', behaviour: 'Has an elongated, serpentine body that lets it slither through narrow crevices most other dragons its size cannot reach.', appears: 'Extended franchise (games, comics & spin-offs)' },
    { name: 'Slobber Smelter', cls: 'Mystery', size: '≈ 6–8 m long (est.)', weight: '≈ 500–900 kg (est.)', behaviour: 'Produces a corrosive, heated saliva capable of slowly melting through metal, which it uses to break into ore deposits and old wreckage.', appears: 'Extended franchise (games, comics & spin-offs)' },
    { name: 'Small Shadow Wing', cls: 'Strike', size: '≈ 4–6 m long, narrow-winged (est.)', weight: '≈ 250–500 kg (est.)', behaviour: 'The smaller of the two Shadow Wing variants; quick and nimble in flight, relying on speed rather than size to evade danger.', appears: 'Extended franchise (games, comics & spin-offs)' },
    { name: 'Smothering Smokebreath', cls: 'Mystery', size: '3.1 m long · 2.8 m wingspan', weight: '≈ 64 kg', behaviour: 'Mischievous and a bit of a thief, hides in thick self-made smokescreens.', appears: 'Riders of Berk' },
    { name: 'Snafflefang', cls: 'Boulder', size: '≈ 5–8 m long (est.)', weight: '≈ 400–800 kg (est.)', behaviour: 'Has an overlapping set of snaggled fangs adapted for snatching fast-moving prey out of the air mid-flight.', appears: 'Extended franchise (games, comics & spin-offs)' },
    { name: 'Snaptrapper', cls: 'Mystery', size: '≈ 12–20 m long (est.)', weight: '≈ 1,500–4,000 kg (est.)', behaviour: 'A four-headed dragon modeled on carnivorous plants; lures prey close with a sweet, chocolate-like scent before its flower-like jaws snap shut.', appears: 'Book of Dragons (short)' },
    { name: 'Snifflehide', cls: 'Tracker', size: '≈ 6–9 m long (est.)', weight: '≈ 500–1,000 kg (est.)', behaviour: 'A fruit-loving, arboreal dragon with poor eyesight but an extraordinary sense of smell and hearing, often found hanging upside-down from branches.', appears: 'Dragons: The Nine Realms' },
    { name: 'Snifflehunch', cls: 'Tracker', size: '≈ 6–12 m long (est.)', weight: '≈ 50–300 kg (est.)', behaviour: 'Has an extraordinary sense of smell, used to track prey and other dragons over long distances.', appears: 'Race to the Edge' },
    { name: 'Snow Wraith', cls: 'Strike', size: '≈ 6–12 m long (est.)', weight: '≈ 400–1,200 kg (est.)', behaviour: 'Elusive and fiercely territorial, navigates icy terrain using heat-sensing instead of sight.', appears: 'Race to the Edge' },
    { name: 'Snowtail', cls: 'Mystery', size: '≈ 5–8 m long, pale-scaled (est.)', weight: '≈ 400–800 kg (est.)', behaviour: 'Adapted for snowy terrain with pale, insulating scales and a broad tail used almost like a snowshoe to move across drifts.', appears: 'Extended franchise (games, comics & spin-offs)' },
    { name: 'Songwing', cls: 'Tracker', size: '≈ 6–12 m long (est.)', weight: '≈ 400–1,200 kg (est.)', behaviour: 'A tuneful, social dragon from the spin-off series set in its own corner of the wider dragon world.', appears: 'Dragons: Rescue Riders (spin-off)' },
    { name: 'Speed Stinger', cls: 'Tracker', size: '≈ 2–6 m long (est.)', weight: '≈ 50–300 kg (est.)', behaviour: 'Hunts in packs with a paralyzing sting; avoids deep water.', appears: 'Riders of Berk' },
    { name: 'Spiderwing', cls: 'Mystery', size: '≈ 4–6 m long, many-limbed silhouette (est.)', weight: '≈ 200–450 kg (est.)', behaviour: 'Its wing membranes fold into thin, leg-like struts at rest, giving it a spider-like silhouette that helps it blend into cave ceilings.', appears: 'Extended franchise (games, comics & spin-offs)' },
    { name: 'Stinger', cls: 'Mystery', size: '≈ 5–8 m long (est.)', weight: '≈ 400–800 kg (est.)', behaviour: 'Carries a venomous tail stinger as its primary defense, favouring a single decisive strike over prolonged fights.', appears: 'Extended franchise (games, comics & spin-offs)' },
    { name: 'Stinkwing', cls: 'Mystery', size: '≈ 5–7 m long (est.)', weight: '≈ 300–600 kg (est.)', behaviour: 'Releases a powerful, foul-smelling musk when startled, driving off predators and rival dragons without needing to fight.', appears: 'Extended franchise (games, comics & spin-offs)' },
    { name: 'Stormcutter', cls: 'Sharp', size: '9.5 m long · 14.6 m wingspan', weight: '≈ 1,500–4,000 kg (est.)', behaviour: 'Highly intelligent and family-oriented; very protective of its rider and kin.', appears: 'HTTYD 2 (2014)' },
    { name: 'Submaripper', cls: 'Tidal', size: '≈ 12–20 m long (est.)', weight: '≈ 1,500–4,000 kg (est.)', behaviour: 'A deep-sea ambush hunter rarely seen at the surface; aggressive toward anything that strays into its waters.', appears: 'Race to the Edge' },
    { name: 'Sweet Death', cls: 'Mystery', size: '≈ 12–20 m long (est.)', weight: '≈ 1,500–4,000 kg (est.)', behaviour: 'Lures victims in with an irresistibly sweet scent before trapping them in sticky resin.', appears: 'Race to the Edge' },
    { name: 'Swiftwing', cls: 'Strike', size: '≈ 6–9 m long, streamlined (est.)', weight: '≈ 400–800 kg (est.)', behaviour: 'Built for speed with narrow, streamlined wings, making it one of the faster fliers among Strike Class dragons despite its middling size.', appears: 'Extended franchise (games, comics & spin-offs)' },
    { name: 'Sword Stealer', cls: 'Sharp', size: '≈ 6–12 m long (est.)', weight: '≈ 400–1,200 kg (est.)', behaviour: 'Dagur the Deranged\'s original mount before Shattermaster; agile and blade-tailed, true to its Sharp-class roots.', appears: 'Dragons: Race to the Edge' },
    { name: 'Terrible Terror', cls: 'Stoker', size: '≈ 1.8 m long · 1.8 m wingspan', weight: '≈ 9 kg', behaviour: 'Feisty and sneaky, hunts and travels in swarms, has a venomous bite for its size.', appears: 'How to Train Your Dragon (2010)' },
    { name: 'Thornridge', cls: 'Sharp', size: '≈ 6–9 m long, spined (est.)', weight: '≈ 600–1,100 kg (est.)', behaviour: 'A ridge of hardened thorn-like spines runs down its back, used defensively against predators that try to attack from above.', appears: 'Extended franchise (games, comics & spin-offs)' },
    { name: 'Threadtail', cls: 'Mystery', size: '≈ 4–6 m long, thin-tailed (est.)', weight: '≈ 200–450 kg (est.)', behaviour: 'Has an unusually long, thread-thin tail it uses for balance in flight and, occasionally, to whip and disorient smaller threats.', appears: 'Extended franchise (games, comics & spin-offs)' },
    { name: 'Three-Wing Thrasher', cls: 'Mystery', size: '≈ 7–10 m long, three-winged (est.)', weight: '≈ 900–1,600 kg (est.)', behaviour: 'An unusual three-winged dragon whose extra wing gives it sharper turns in flight, though at some cost to top speed.', appears: 'Extended franchise (games, comics & spin-offs)' },
    { name: 'Thunderclaw', cls: 'Sharp', size: '≈ 6–9 m long (est.)', weight: '≈ 600–1,100 kg (est.)', behaviour: 'Claws crackle faintly with static before a strike, and its heavy talons are capable of tearing through wood and thin metal alike.', appears: 'Extended franchise (games, comics & spin-offs)' },
    { name: 'Thunderdrum', cls: 'Tidal', size: '20.7 m long · 14.6 m wingspan', weight: '≈ 408 kg', behaviour: 'A reclusive dweller of sea caves and tide pools; produces a concussive sonic roar powerful enough to be lethal at close range.', appears: 'Book of Dragons (short)' },
    { name: 'Thunderpede', cls: 'Strike', size: '≈ 8–12 m long, multi-legged (est.)', weight: '≈ 1,000–1,800 kg (est.)', behaviour: 'An elongated, many-legged dragon that moves in a rapid, centipede-like scuttle and can deliver a mild electric charge through its many limbs.', appears: 'Extended franchise (games, comics & spin-offs)' },
    { name: 'Tide Glider', cls: 'Tidal', size: '≈ 6–12 m long (est.)', weight: '≈ 50–300 kg (est.)', behaviour: 'Calm and social, glides gracefully along the ocean surface in small groups.', appears: 'Race to the Edge' },
    { name: 'Timberjack', cls: 'Sharp', size: '18.3 m long · 27.4 m wingspan', weight: '≈ 408 kg', behaviour: 'Sensitive and peace-loving in dense forests, but its huge wings have razor edges that can shear through trees when it is provoked.', appears: 'Book of Dragons (short)' },
    { name: 'Tormentipede', cls: 'Mystery', size: '≈ 7–10 m long, multi-legged (est.)', weight: '≈ 900–1,600 kg (est.)', behaviour: 'A larger, more aggressive relative of the Thunderpede, using its many clawed legs to pin down prey before delivering a venomous bite.', appears: 'Extended franchise (games, comics & spin-offs)' },
    { name: 'Triple Stryke', cls: 'Strike', size: '≈ 12–20 m long (est.) · 9.1 m wingspan (official)', weight: '≈ 1,500–4,000 kg (est.)', behaviour: 'Aggressive and territorial; wields three tail stingers each with a different venom.', appears: 'Race to the Edge' },
    { name: 'Vine Tail', cls: 'Mystery', size: '≈ 5–7 m long (est.)', weight: '≈ 300–600 kg (est.)', behaviour: 'Its long, flexible tail is covered in vine-like tendrils that can grip branches and rock, letting it climb almost as well as it flies.', appears: 'Extended franchise (games, comics & spin-offs)' },
    { name: 'Wave Glider', cls: 'Tidal', size: '≈ 6–9 m long, finned (est.)', weight: '≈ 500–1,000 kg (est.)', behaviour: 'Skims low over open water on broad, wing-like fins, riding wave crests for long stretches with barely a flap of its wings.', appears: 'Extended franchise (games, comics & spin-offs)' },
    { name: 'Whispering Death', cls: 'Boulder', size: '15.2 m long · 3 m wingspan', weight: 'Very heavy (unpublished)', behaviour: 'Relentless burrower with rings of rotating teeth; territorial, dangerous underground, and immune to dragon nip.', appears: 'Book of Dragons (short)' },
    { name: 'Whistling Windwing', cls: 'Strike', size: '≈ 6–9 m long, narrow-winged (est.)', weight: '≈ 400–800 kg (est.)', behaviour: 'Its wing membranes are perforated in a way that produces a distinctive whistling note in flight, audible long before the dragon itself is seen.', appears: 'Extended franchise (games, comics & spin-offs)' },
    { name: 'Whooping Whifflewing', cls: 'Mystery', size: '≈ 5–7 m long (est.)', weight: '≈ 300–600 kg (est.)', behaviour: 'Known for a loud, whooping call it makes mid-flight, often used to signal to others in its small family groups.', appears: 'Extended franchise (games, comics & spin-offs)' },
    { name: 'Windgnasher', cls: 'Strike', size: '≈ 6–9 m long (est.)', weight: '≈ 500–1,000 kg (est.)', behaviour: 'An aggressive flier that gnashes its teeth audibly when riding strong updrafts, using powerful gusts to gain sudden bursts of altitude.', appears: 'Extended franchise (games, comics & spin-offs)' },
    { name: 'Windstriker', cls: 'Sharp', size: '≈ 12–20 m long (est.)', weight: '≈ 400–1,200 kg (est.)', behaviour: 'Peaceful but a capable fighter when provoked, breathes superheated air instead of flame and can dive-bomb foes head-on.', appears: 'How to Train Your Dragon 2 (2014)' },
    { name: 'Windwalker', cls: 'Tracker', size: '≈ 12–20 m long (est.)', weight: '≈ 1,500–4,000 kg (est.)', behaviour: 'Wise and ancient, said to be able to sense danger on the wind long before it arrives.', appears: 'Race to the Edge' },
    { name: 'Woodchipper', cls: 'Sharp', size: '≈ 6–9 m long, powerful-jawed (est.)', weight: '≈ 700–1,300 kg (est.)', behaviour: 'Uses rapid, repeated bites to shred through dense timber, clearing paths through forest and building nesting material in the process.', appears: 'Extended franchise (games, comics & spin-offs)' },
    { name: 'Woolly Howl', cls: 'Strike', size: '≈ 12–20 m long (est.)', weight: '≈ 1,500–4,000 kg (est.)', behaviour: 'Fast, stealthy, and highly intelligent; its dark, fur-like scales and pale belly let it ambush prey out of blizzards with bursts of ice blasts.', appears: 'Dragons: Rise of Berk (game)' },
    { name: 'Yetiwing', cls: 'Tracker', size: '≈ 6–9 m long, thick-furred (est.)', weight: '≈ 800–1,500 kg (est.)', behaviour: 'Covered in a thick, shaggy coat suited to alpine cold, and reputed among trainers for leaving oddly large tracks in snow.', appears: 'Extended franchise (games, comics & spin-offs)' },
    { name: 'Zoomerang', cls: 'Mystery', size: '≈ 4–6 m long, curved-winged (est.)', weight: '≈ 200–450 kg (est.)', behaviour: 'Has distinctively curved wings that let it loop back toward its starting point mid-flight, almost like a living boomerang.', appears: 'Extended franchise (games, comics & spin-offs)' },
    { name: 'Typhoomerang', cls: 'Stoker', size: '33.3 m long · 61.1 m wingspan (official model sheet)', weight: '≈ 431 kg (est.)', behaviour: 'Ferociously protective parent, attacks in a spinning tornado of fire.', appears: 'Riders of Berk (‘The Terrible Twos’)' },
    { name: 'Brooding Boltstamper', cls: 'Strike', size: '≈ 10–14 m long (est., Skrill × Rumblehorn)', weight: '≈ 3,000–5,000 kg (est.)', behaviour: 'A bred hybrid combining the Skrill\'s storm-channelling instincts with the Rumblehorn\'s armoured bulk; broods and sulks visibly before releasing a lightning-charged burst.', appears: 'Dragons: Titan Uprising (mobile game)' },
    { name: 'Cyclarion', cls: 'Tracker', size: '≈ 10–14 m long, bulky bipedal build (est., Typhoomerang × Rumblehorn)', weight: '≈ 3,500–6,000 kg (est.)', behaviour: 'A bred hybrid that struggles to fit in socially with other dragons, sometimes decorating itself with mud and plant matter to win approval; fires exploding, fiery rock projectiles inherited from its Rumblehorn parent.', appears: 'Dragons: Titan Uprising (mobile game)' },
    { name: 'Deathburple', cls: 'Sharp', size: '≈ 5–7 m long, stocky and spined (est., Deadly Nadder × Hotburple)', weight: '≈ 1,500–2,200 kg (est.)', behaviour: 'A bred hybrid pairing the Deadly Nadder\'s vain, spine-launching temperament with the Hotburple\'s sleepy, rock-eating bulk.', appears: 'Dragons: Titan Uprising (mobile game)' },
    { name: 'Deathly Galeslash', cls: 'Sharp', size: '≈ 10–14 m long, four-winged (est., Deadly Nadder × Stormcutter)', weight: '≈ 800–1,500 kg (est.)', behaviour: 'A bred hybrid combining the Stormcutter\'s four wings and sharp intellect with the Deadly Nadder\'s spine-launching defenses.', appears: 'Dragons: Titan Uprising (mobile game)' },
    { name: 'Ghastly Zapplejack', cls: 'Mystery', size: '≈ 15–20 m long, twin-headed (est., Hideous Zippleback × Timberjack)', weight: '≈ 1,200–2,200 kg (est.)', behaviour: 'A bred hybrid with the Hideous Zippleback\'s twin gas-and-spark heads mounted on a long, blade-winged Timberjack body.', appears: 'Dragons: Titan Uprising (mobile game)' },
    { name: 'Hoarsbrumble', cls: 'Tidal', size: '≈ 12–18 m long (est., Thunderdrum × Typhoomerang)', weight: '≈ 800–1,500 kg (est.)', behaviour: 'A bred hybrid uniting the Thunderdrum\'s sonic-roar defenses with the Typhoomerang\'s tornado-fuelled fire breath.', appears: 'Dragons: Titan Uprising (mobile game)' },
    { name: 'Humbanger', cls: 'Boulder', size: '≈ 8–12 m long, ring-toothed (est., Whispering Death × Snafflefang)', weight: '≈ 2,000–3,500 kg (est.)', behaviour: 'A bred hybrid combining the Whispering Death\'s rotating rings of teeth with the Snafflefang\'s snaggle-fanged snatching bite.', appears: 'Dragons: Titan Uprising (mobile game)' },
    { name: 'Hushbogle', cls: 'Boulder', size: '≈ 8–12 m long (est., Whispering Death × Snow Wraith)', weight: '≈ 1,800–3,000 kg (est.)', behaviour: 'A bred hybrid that burrows like a Whispering Death but favours cold, icy terrain inherited from its Snow Wraith parent.', appears: 'Dragons: Titan Uprising (mobile game)' },
    { name: 'Ridgesnipper', cls: 'Sharp', size: '≈ 10–15 m long, blade-tailed (est., Razorwhip × Snafflefang)', weight: '≈ 1,200–2,200 kg (est.)', behaviour: 'A bred hybrid pairing the Razorwhip\'s razor-edged tail with the Snafflefang\'s digging claws and snapping bite.', appears: 'Dragons: Titan Uprising (mobile game)' },
    { name: 'Slumberjack', cls: 'Stoker', size: '≈ 15–20 m long, thin-bodied (est., Monstrous Nightmare × Timberjack)', weight: '≈ 1,200–2,000 kg (est.)', behaviour: 'A bred hybrid that walks on its wing-claws like a Timberjack while carrying the Monstrous Nightmare\'s hot temper and self-igniting flame.', appears: 'Dragons: Titan Uprising (mobile game)' },
    { name: 'Thunderbottom', cls: 'Tidal', size: '≈ 4–6 m long, stocky (est., Thunderdrum × Gronckle)', weight: '≈ 2,000–2,800 kg (est.)', behaviour: 'A bred hybrid with the Gronckle\'s dense, rock-eating build and the Thunderdrum\'s deep sonic roar.', appears: 'Dragons: Titan Uprising (mobile game)' },
    { name: 'Zipplewraith', cls: 'Mystery', size: '≈ 15–20 m long, twin-headed (est., Hideous Zippleback × Snow Wraith)', weight: '≈ 1,500–2,500 kg (est.)', behaviour: 'A bred hybrid combining the Hideous Zippleback\'s twin gas-and-spark heads with the Snow Wraith\'s heat-sensing hunt in icy terrain.', appears: 'Dragons: Titan Uprising (mobile game)' },
  ];

  const gridEl    = document.getElementById('dragonsGrid');
  const searchEl  = document.getElementById('dragonsSearch');
  const countEl   = document.getElementById('dragonsCount');
  const emptyEl   = document.getElementById('dragonsEmpty');
  const filterRow = document.getElementById('dragonsFilterRow');
  const sortRow   = document.getElementById('dragonsSortRow');
  if (!gridEl || !searchEl || !filterRow) return;

  // build class filter chips from the data itself, so it stays in sync
  const classNames = Array.from(new Set(dragons.map(d => d.cls.split(' (')[0]))).sort();
  classNames.forEach(cls => {
    const chip = document.createElement('button');
    chip.className = 'dragons-filter-chip';
    chip.dataset.class = cls;
    chip.innerHTML = `<span class="dragons-filter-chip-icon">${classIcon(cls)}</span><span>${cls}</span>`;
    filterRow.appendChild(chip);
  });

  let activeClass = 'all';
  let activeSort  = 'alpha';

  function sortDragons(list) {
    const sorted = list.slice();
    if (activeSort === 'class') {
      sorted.sort((a, b) => {
        const clsA = a.cls.split(' (')[0], clsB = b.cls.split(' (')[0];
        return clsA.localeCompare(clsB) || a.name.localeCompare(b.name);
      });
    } else if (activeSort === 'appears') {
      sorted.sort((a, b) => a.appears.localeCompare(b.appears) || a.name.localeCompare(b.name));
    } else {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    }
    return sorted;
  }

  function cardHTML(d) {
    const icon = classIcon(d.cls);
    const photo = dragonImagePath(d.name);
    return `
      <article class="dragon-tile">
        <div class="dragon-tile-image">
          <img
            class="dragon-tile-photo"
            src="${photo}"
            alt="${d.name}"
            loading="lazy"
            onload="this.closest('.dragon-tile-image').classList.add('has-photo')"
            onerror="this.remove()"
          />
          <span class="dragon-tile-image-icon">${icon}</span>
          <span class="dragon-tile-image-label">image coming soon</span>
        </div>
        <div class="dragon-tile-body">
          <div class="dragon-tile-head">
            <h3 class="dragon-tile-name">${d.name}</h3>
            <span class="dragon-tile-class"><span class="dragon-tile-class-icon">${icon}</span>${d.cls} Class</span>
          </div>
          <div class="dragon-tile-meta">
            <span><b>Size</b> ${d.size}</span>
            <span><b>Weight</b> ${d.weight}</span>
            <span><b>First appearance</b> ${d.appears}</span>
          </div>
          <p class="dragon-tile-behaviour">${d.behaviour}</p>
        </div>
      </article>
    `;
  }

  function render() {
    const q = searchEl.value.trim().toLowerCase();

    const filtered = dragons.filter(d => {
      const matchesClass = activeClass === 'all' || d.cls.split(' (')[0] === activeClass;
      const matchesQuery =
        !q ||
        d.name.toLowerCase().includes(q) ||
        d.cls.toLowerCase().includes(q) ||
        d.appears.toLowerCase().includes(q);
      return matchesClass && matchesQuery;
    });

    if (countEl) countEl.textContent = `${filtered.length} / ${dragons.length}`;

    if (!filtered.length) {
      gridEl.innerHTML = '';
      if (emptyEl) emptyEl.hidden = false;
      return;
    }

    if (emptyEl) emptyEl.hidden = true;
    gridEl.innerHTML = sortDragons(filtered).map(cardHTML).join('');
  }

  searchEl.addEventListener('input', render);

  filterRow.addEventListener('click', (e) => {
    const chip = e.target.closest('.dragons-filter-chip');
    if (!chip) return;
    filterRow.querySelectorAll('.dragons-filter-chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    activeClass = chip.dataset.class;
    render();
  });

  if (sortRow) {
    sortRow.addEventListener('click', (e) => {
      const chip = e.target.closest('.dragons-sort-chip');
      if (!chip) return;
      sortRow.querySelectorAll('.dragons-sort-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      activeSort = chip.dataset.sort;
      render();
    });
  }

  /* ── Random dragon spotlight ── */
  const randomBtn      = document.getElementById('dragonsRandomBtn');
  const spotlightBg     = document.getElementById('dragonsSpotlightBackdrop');
  const spotlightBody   = document.getElementById('dragonsSpotlightBody');
  const spotlightClose  = document.getElementById('dragonsSpotlightClose');
  const spotlightAgain  = document.getElementById('dragonsSpotlightAgain');

  function showRandomDragon() {
    const pick = dragons[Math.floor(Math.random() * dragons.length)];
    const icon = classIcon(pick.cls);
    const photo = dragonImagePath(pick.name);
    spotlightBody.innerHTML = `
      <span class="dragons-spotlight-icon">
        <img
          class="dragons-spotlight-photo"
          src="${photo}"
          alt="${pick.name}"
          loading="lazy"
          onload="this.closest('.dragons-spotlight-icon').classList.add('has-photo')"
          onerror="this.remove()"
        />
        ${icon.replace('<img ', '<img class="dragons-spotlight-class-fallback" ')}
      </span>
      <span class="dragons-spotlight-eyebrow">your random dragon is…</span>
      <h3 class="dragons-spotlight-name">${pick.name}</h3>
      <span class="dragons-spotlight-class">${pick.cls} Class</span>
      <div class="dragons-spotlight-meta">
        <span><b>Size</b> ${pick.size}</span>
        <span><b>Weight</b> ${pick.weight}</span>
        <span><b>First appearance</b> ${pick.appears}</span>
      </div>
      <p class="dragons-spotlight-behaviour">${pick.behaviour}</p>
    `;
    if (spotlightBg) spotlightBg.hidden = false;
  }

  function hideSpotlight() {
    if (spotlightBg) spotlightBg.hidden = true;
  }

  if (randomBtn)     randomBtn.addEventListener('click', showRandomDragon);
  if (spotlightAgain) spotlightAgain.addEventListener('click', showRandomDragon);
  if (spotlightClose) spotlightClose.addEventListener('click', hideSpotlight);
  if (spotlightBg) {
    spotlightBg.addEventListener('click', (e) => {
      if (e.target === spotlightBg) hideSpotlight();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && spotlightBg && !spotlightBg.hidden) hideSpotlight();
  });

  render();
})();
} catch (e) { console.error('dragon grid setup failed:', e); }

});