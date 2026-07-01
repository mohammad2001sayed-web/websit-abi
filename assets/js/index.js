//!(1) Show & Hide Sections
const sections = document.querySelectorAll("section");
const links = document.querySelectorAll(".nav-link");

function showSection(id) {
  // اخفي كل السكاشن
  sections.forEach((section) => {
    section.classList.add("hidden");
  });

  // اظهر السكشن المطلوب
  document.getElementById(id).classList.remove("hidden");
}

//& Active Link + Navigation
links.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();

    // شيل الـ active من كل اللينكات
    links.forEach((item) => {
      item.classList.remove("bg-blue-500/10", "text-blue-400");
      item.classList.add("text-slate-300");
    });

    // حط active على اللينك الحالي
    link.classList.remove("text-slate-300");
    link.classList.add("bg-blue-500/10", "text-blue-400");

    // اعرض السكشن المطلوب
    showSection(link.dataset.section);
  });
});

//! (2) sections one

// //& (2) Today in Space - NASA API
// const dateInput = document.getElementById("apod-date-input");
// const loadDateBtn = document.getElementById("load-date-btn");
// const todayApodBtn = document.getElementById("today-apod-btn");

// // تحديد باقي عناصر العرض
// const apodImg = document.getElementById("apod-image");
// const apodTitle = document.getElementById("apod-title");
// const apodDateText = document.getElementById("apod-date");
// const apodDateDetail = document.getElementById("apod-date-detail");
// const apodDateInfo = document.getElementById("apod-date-info");
// const apodExplanation = document.getElementById("apod-explanation");
// const apodMediaType = document.getElementById("apod-media-type");

// // --- تظبيط التاريخ الأوتوماتيك والحد الأقصى ---
// function setupDateInput() {
//   const today = new Date();

//   // تحويل التاريخ لصيغة YYYY-MM-DD
//   const year = today.getFullYear();
//   const month = String(today.getMonth() + 1).padStart(2, '0'); // الشهور بتدأ من 0
//   const day = String(today.getDate()).padStart(2, '0');

//   const formattedToday = `${year}-${month}-${day}`;

//   // وضع القيمة الافتراضية والحد الأقصى للتاريخ
//   if (dateInput) {
//     dateInput.value = formattedToday;
//     dateInput.max = formattedToday; // لقفل أي يوم بعد النهاردة
//   }
// }

// // تشغيل تظبيط التاريخ فوراً
// setupDateInput();

//! (2)

//& =========================================================
//& (2) Today in Space - NASA API Section
//& =========================================================

// دالة تنسيق التاريخ ليكون مقروء (مثال: Jun 10, 2026)
function formatDateFriendly(dateString) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// 1. تظبيط التاريخ الحالي وقفل المستقبل
function initSpaceDate() {
  const apodDateInput = document.getElementById("apod-date-input");
  const today = new Date();
  const formattedToday = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  if (apodDateInput) {
    apodDateInput.value = formattedToday;
    apodDateInput.max = formattedToday;
  }
  return formattedToday;
}

// 2. الدالة الذكية للتعامل مع الـ API والـ Fallback وممسوك جواها متغيراتها لحماية الميموري
async function getNASAData(dateString) {
  const apodImg = document.getElementById("apod-image");
  const apodLoading = document.getElementById("apod-loading");

  if (apodLoading) apodLoading.classList.remove("hidden");
  if (apodImg) apodImg.classList.add("hidden");

  const friendlyDate = formatDateFriendly(dateString);

  try {
    const response = await fetch(
      `https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&date=${dateString}`,
    );

    if (response.status === 429) throw new Error("NASA_RATE_LIMIT");

    const data = await response.json();

    if (data && !data.error) {
      // تحديث التواريخ الأربعة وباقي العناصر مباشرة بدون حجز متغيرات global
      document.getElementById("apod-date").textContent =
        `Astronomy Picture of the Day - ${friendlyDate}`;
      document.getElementById("selected-date").textContent = friendlyDate;
      document.getElementById("apod-date-detail").innerHTML =
        `<i class="far fa-calendar mr-2"></i>${data.date}`;
      document.getElementById("apod-date-info").textContent = friendlyDate;
      document.getElementById("apod-title").textContent = data.title;
      document.getElementById("apod-explanation").textContent =
        data.explanation;
      document.getElementById("apod-media-type").textContent =
        data.media_type.toUpperCase();

      if (apodImg) apodImg.src = data.url;

      // ربط زرار التكبير برابط الصورة الحالية
      const viewFullResBtn = document.getElementById("view-full-res-btn");
      if (viewFullResBtn)
        viewFullResBtn.onclick = () => window.open(data.url, "_blank");

      return;
    }
  } catch (error) {
    console.warn(
      "الـ API الحقيقي فيه مشكلة (Rate Limit)، الكود يشغل المحاكاة المحلية.",
    );
  }

  // === جزء المحاكاة الذكية (لو الـ API واقـع) ===
  document.getElementById("apod-date").textContent =
    `Astronomy Picture of the Day - ${friendlyDate}`;
  document.getElementById("selected-date").textContent = friendlyDate;
  document.getElementById("apod-date-detail").innerHTML =
    `<i class="far fa-calendar mr-2"></i>${dateString}`;
  document.getElementById("apod-date-info").textContent = friendlyDate;

  const dayNumber = new Date(dateString).getDate();
  let fallbackTitle = "Thor's Helmet Nebula";
  let fallbackDesc =
    "Thor's Helmet (NGC 2359) is a hat-shaped cosmic cloud with wing-like appendages. Located about 15,000 light-years away.";
  let fallbackSrc =
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000";

  if (dayNumber % 2 === 0) {
    fallbackTitle = "The Rosette Nebula";
    fallbackDesc =
      "The Rosette Nebula is a large spherical H II region located near one end of a giant molecular cloud in the Monoceros region.";
    fallbackSrc =
      "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=1000";
  }

  document.getElementById("apod-title").textContent = fallbackTitle;
  document.getElementById("apod-explanation").textContent = fallbackDesc;
  document.getElementById("apod-media-type").textContent = "IMAGE";
  if (apodImg) apodImg.src = fallbackSrc;

  // ربط زرار التكبير بالصورة البديلة
  const viewFullResBtn = document.getElementById("view-full-res-btn");
  if (viewFullResBtn)
    viewFullResBtn.onclick = () => window.open(fallbackSrc, "_blank");

  if (apodLoading) apodLoading.classList.add("hidden");
  if (apodImg) apodImg.classList.remove("hidden");
}

// 3. ربط الأزرار والتشغيل (المتغيرات هنا لحظية وتنتهي فوراً)
(() => {
  const defaultDate = initSpaceDate();
  getNASAData(defaultDate);

  const loadDateBtn = document.getElementById("load-date-btn");
  const todayApodBtn = document.getElementById("today-apod-btn");
  const apodDateInput = document.getElementById("apod-date-input");

  if (loadDateBtn) {
    loadDateBtn.addEventListener("click", () => {
      if (apodDateInput && apodDateInput.value)
        getNASAData(apodDateInput.value);
    });
  }

  if (todayApodBtn) {
    todayApodBtn.addEventListener("click", () => {
      getNASAData(initSpaceDate());
    });
  }
})();

//& =========================================================
//& (3) Space Launches Section - With Solid For Loop & Images
//& =========================================================

async function getUpcomingLaunches() {
  const launchesGrid = document.getElementById("launches-grid");
  const featuredLaunch = document.getElementById("featured-launch");

  try {
    const response = await fetch(
      "https://ll.thespacedevs.com/2.2.0/launch/upcoming/?limit=10",
    );
    const data = await response.json();

    if (data && data.results && data.results.length > 0) {
      const launches = data.results;

      // 1. الرحلة المميزة (Featured)
      if (featuredLaunch) {
        const featured = launches[0];
        const daysLeft = featured.window_start
          ? Math.max(
              0,
              Math.ceil(
                (new Date(featured.window_start) - new Date()) /
                  (1000 * 60 * 60 * 24),
              ),
            )
          : "TBD";

        // صورة ذكية للصاروخ الأول
        const featuredImg =
          featured.image ||
          "https://images.unsplash.com/photo-1517976487492-5750f3195933?q=80&w=800";

        featuredLaunch.innerHTML = `
          <div class="relative bg-slate-800/30 border border-slate-700 rounded-3xl overflow-hidden group hover:border-blue-500/50 transition-all">
            <div class="absolute inset-0 bg-linear-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div class="relative grid grid-cols-1 lg:grid-cols-2 gap-6 p-8">
              <div class="flex flex-col justify-between">
                <div>
                  <div class="flex items-center gap-3 mb-4">
                    <span class="px-4 py-1.5 bg-blue-500/20 text-blue-400 rounded-full text-sm font-semibold flex items-center gap-2">
                      <i class="fas fa-star"></i> Featured Launch
                    </span>
                    <span class="px-4 py-1.5 bg-green-500/20 text-green-400 rounded-full text-sm font-semibold">
                      ${featured.status?.abbrev || "Go"}
                    </span>
                  </div>
                  <h3 class="text-3xl font-bold mb-3 leading-tight">${featured.name.split("|")[0]}</h3>
                  <div class="flex flex-col xl:flex-row xl:items-center gap-4 mb-6 text-slate-400">
                    <div class="flex items-center gap-2"><i class="fas fa-building"></i><span>${featured.launch_service_provider?.name || "Unknown"}</span></div>
                    <div class="flex items-center gap-2"><i class="fas fa-rocket"></i><span>${featured.rocket?.configuration?.name || "Rocket"}</span></div>
                  </div>
                  
                  <div class="inline-flex items-center gap-3 px-6 py-3 bg-linear-to-r from-blue-500/20 to-purple-500/20 rounded-xl mb-6">
                    <i class="fas fa-clock text-2xl text-blue-400"></i>
                    <div>
                      <p class="text-2xl font-bold text-blue-400">${daysLeft}</p>
                      <p class="text-xs text-slate-400">Days Until Launch</p>
                    </div>
                  </div>

                  <div class="grid xl:grid-cols-2 gap-4 mb-6">
                    <div class="bg-slate-900/50 rounded-xl p-4">
                      <p class="text-xs text-slate-400 mb-1 flex items-center gap-2"><i class="fas fa-calendar"></i>Launch Date</p>
                      <p class="font-semibold text-sm">${featured.window_start ? new Date(featured.window_start).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" }) : "TBD"}</p>
                    </div>
                    <div class="bg-slate-900/50 rounded-xl p-4">
                      <p class="text-xs text-slate-400 mb-1 flex items-center gap-2"><i class="fas fa-clock"></i>Launch Time</p>
                      <p class="font-semibold text-sm">${featured.window_start ? new Date(featured.window_start).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) : "TBD"}</p>
                    </div>
                  </div>
                </div>
                <div class="flex flex-col md:flex-row gap-3">
                  <button onclick="window.open('${featured.url || "#"}', '_blank')" class="flex-1 px-6 py-3 bg-blue-500 rounded-xl hover:bg-blue-600 transition-colors font-semibold flex items-center justify-center gap-2">
                    <i class="fas fa-info-circle"></i> View Full Details
                  </button>
                </div>
              </div>
              <div class="relative">
                <div class="relative h-full min-h-[400px] rounded-2xl overflow-hidden bg-slate-900/50">
                  <img src="${featuredImg}" class="w-full h-full object-cover" alt="Featured Rocket">
                </div>
              </div>
            </div>
          </div>
        `;
      }

      // 2. عمل الـ For Loop الصريحة لباقي الكروت المتكررة في الـ Grid
      if (launchesGrid) {
        launchesGrid.innerHTML = ""; // تصفير الهيكل القديم

        // الـ Loop بتبدأ من العنصر رقم 1 وتلف على الباقي بالكامل
        for (let i = 1; i < launches.length; i++) {
          const launch = launches[i];

          const launchDate = launch.window_start
            ? new Date(launch.window_start).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            : "TBD";
          const launchTime = launch.window_start
            ? new Date(launch.window_start).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              }) + " UTC"
            : "TBD";

          // تأمين جلب صورة حقيقية بناءً على اسم الصاروخ لو الـ API سقط منه الرابط
          let cardImg = launch.image;
          if (!cardImg) {
            const rocketName = (
              launch.rocket?.configuration?.name || ""
            ).toLowerCase();
            if (rocketName.includes("falcon"))
              cardImg =
                "https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?q=80&w=500";
            else if (rocketName.includes("long march"))
              cardImg =
                "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=500";
            else if (rocketName.includes("soyuz"))
              cardImg =
                "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?q=80&w=500";
            else
              cardImg =
                "https://images.unsplash.com/photo-1517976487492-5750f3195933?q=80&w=500";
          }

          launchesGrid.innerHTML += `
            <div class="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all group cursor-pointer flex flex-col justify-between h-full">
              <div>
                <div class="relative h-48 bg-slate-900/50 overflow-hidden">
                  <img src="${cardImg}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Rocket">
                  <div class="absolute top-3 right-3">
                    <span class="px-3 py-1 bg-green-500/90 text-white backdrop-blur-sm rounded-full text-xs font-semibold">
                      ${launch.status?.abbrev || "Go"}
                    </span>
                  </div>
                </div>
                <div class="p-5">
                  <div class="mb-3">
                    <h4 class="font-bold text-base mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">${launch.name}</h4>
                    <p class="text-xs text-slate-400 flex items-center gap-2">
                      <i class="fas fa-building text-[10px]"></i> ${launch.launch_service_provider?.name || "Unknown"}
                    </p>
                  </div>
                  <div class="space-y-2 mb-4 text-xs">
                    <div class="flex items-center gap-2"><i class="fas fa-calendar text-slate-500 w-4"></i><span class="text-slate-300">${launchDate}</span></div>
                    <div class="flex items-center gap-2"><i class="fas fa-clock text-slate-500 w-4"></i><span class="text-slate-300">${launchTime}</span></div>
                    <div class="flex items-center gap-2"><i class="fas fa-rocket text-slate-500 w-4"></i><span class="text-slate-300">${launch.rocket?.configuration?.name || "Rocket"}</span></div>
                    <div class="flex items-center gap-2"><i class="fas fa-map-marker-alt text-slate-500 w-4"></i><span class="text-slate-300 line-clamp-1">${launch.pad?.location?.name || "Spaceport"}</span></div>
                  </div>
                </div>
              </div>
              <div class="p-5 pt-0">
                <div class="flex items-center gap-2 pt-4 border-t border-slate-700">
                  <button onclick="window.open('${launch.url || "#"}', '_blank')" class="flex-1 px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors text-sm font-semibold">Details</button>
                  <button class="px-3 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"><i class="far fa-heart"></i></button>
                </div>
              </div>
            </div>
          `;
        }
      }
    }
  } catch (error) {
    console.error("Error loading launches:", error);
  }
}

getUpcomingLaunches();




//& =========================================================
//& (4) Planets Section - Ultimate Engine with Dynamic Table
//& =========================================================

function initPlanetsSection() {
  const planetCards = document.querySelectorAll(".planet-card");
  const tableBody = document.getElementById("planet-comparison-tbody");
  
  // 1. قاعدة البيانات الكاملة والمطابقة لبيانات الكروت والجدول في ملف cd1501fa-04e7-43ac-9bf1-8f554078b0fa
  const allPlanetsData = {
    uranus: {
      name: "Uranus", color: "#06b6d4", bgBadge: "bg-cyan-500/50 text-cyan-200", type: "Ice Giant",
      distanceAU: "19.19", diameter: "50,724", massE: "14.536", orbitP: "84.0 years", moonsCount: "29",
      description: "Uranus is the seventh planet from the Sun. Its name is a reference to the Greek god of the sky, Uranus. It has the third-largest planetary radius and fourth-largest planetary mass in the Solar System.",
      distance: "2.87B km", radius: "25,362 km", mass: "8.681 × 10²⁵ kg", density: "1.27 g/cm³",
      orbitalPeriod: "84 years", rotation: "17.2 hours", moons: "29", gravity: "8.69 m/s²",
      discoveredBy: "William Herschel", discoveryDate: "March 13, 1781", bodyType: "Planet", volume: "6.833 × 10¹³ km³",
      quickFacts: ["Mass: 8.681 × 10²⁵ kg", "Surface gravity: 8.69 m/s²", "Density: 1.270 g/cm³", "Axial tilt: 97.77°"],
      perihelion: "2.74B km", aphelion: "3.00B km", eccentricity: "0.0463", inclination: "0.77°", axialTilt: "97.77°", temp: "-197°C", escape: "21.3 km/s"
    },
    neptune: {
      name: "Neptune", color: "#2563eb", bgBadge: "bg-blue-500/50 text-blue-200", type: "Ice Giant",
      distanceAU: "30.07", diameter: "49,244", massE: "17.148", orbitP: "164.8 years", moonsCount: "16",
      description: "Neptune is the eighth and farthest-known solar planet from the Sun. In the Solar System, it is the fourth-largest planet by diameter, the third-most-massive planet, and the densest giant planet.",
      distance: "4.50B km", radius: "24,622 km", mass: "1.024 × 10²⁶ kg", density: "1.64 g/cm³",
      orbitalPeriod: "164.8 years", rotation: "16.1 hours", moons: "16", gravity: "11.15 m/s²",
      discoveredBy: "Urbain Le Verrier", discoveryDate: "September 23, 1846", bodyType: "Planet", volume: "6.254 × 10¹³ km³",
      quickFacts: ["Mass: 1.024 × 10²⁶ kg", "Surface gravity: 11.15 m/s²", "Density: 1.638 g/cm³", "Axial tilt: 28.32°"],
      perihelion: "4.46B km", aphelion: "4.54B km", eccentricity: "0.0097", inclination: "1.77°", axialTilt: "28.32°", temp: "-201°C", escape: "23.5 km/s"
    },
    jupiter: {
      name: "Jupiter", color: "#fb923c", bgBadge: "bg-purple-500/50 text-purple-200", type: "Gas Giant",
      distanceAU: "5.20", diameter: "139,820", massE: "317.829", orbitP: "11.9 years", moonsCount: "101",
      description: "Jupiter is the fifth planet from the Sun and the largest in the Solar System. It is a gas giant with a mass more than two and a half times that of all the other planets in the Solar System combined.",
      distance: "778.5M km", radius: "69,911 km", mass: "1.898 × 10²⁷ kg", density: "1.33 g/cm³",
      orbitalPeriod: "11.86 years", rotation: "9.9 hours", moons: "101", gravity: "24.79 m/s²",
      discoveredBy: "Known since antiquity", discoveryDate: "Ancient times", bodyType: "Planet", volume: "1.431 × 10¹⁵ km³",
      quickFacts: ["Mass: 1.898 × 10²⁷ kg", "Surface gravity: 24.79 m/s²", "Density: 1.326 g/cm³", "Axial tilt: 3.13°"],
      perihelion: "740.5M km", aphelion: "816.6M km", eccentricity: "0.0489", inclination: "1.30°", axialTilt: "3.13°", temp: "-108°C", escape: "59.5 km/s"
    },
    mars: {
      name: "Mars", color: "#ef4444", bgBadge: "bg-orange-500/50 text-orange-200", type: "Terrestrial",
      distanceAU: "1.52", diameter: "6,779", massE: "0.107", orbitP: "1.9 years", moonsCount: "2",
      description: "Mars is the fourth planet from the Sun and the second-smallest planet in the Solar System. Often referred to as the 'Red Planet' due to the iron oxide prevalent on its surface.",
      distance: "227.9M km", radius: "3,389 km", mass: "6.39 × 10²³ kg", density: "3.93 g/cm³",
      orbitalPeriod: "687 days", rotation: "24.6 hours", moons: "2", gravity: "3.72 m/s²",
      discoveredBy: "Known since antiquity", discoveryDate: "Ancient times", bodyType: "Planet", volume: "1.631 × 10¹¹ km³",
      quickFacts: ["Mass: 6.39 × 10²³ kg", "Surface gravity: 3.72 m/s²", "Density: 3.933 g/cm³", "Axial tilt: 25.19°"],
      perihelion: "206.6M km", aphelion: "249.2M km", eccentricity: "0.0934", inclination: "1.85°", axialTilt: "25.19°", temp: "-62°C", escape: "5.03 km/s"
    },
    mercury: {
      name: "Mercury", color: "#eab308", bgBadge: "bg-orange-500/50 text-orange-200", type: "Terrestrial",
      distanceAU: "0.39", diameter: "4,879", massE: "0.055", orbitP: "88 days", moonsCount: "0",
      description: "Mercury is the smallest planet in our Solar System and the closest to the Sun. Its orbit around the Sun takes 87.97 Earth days, the shortest of all the Sun's planets.",
      distance: "57.9M km", radius: "2,439 km", mass: "3.285 × 10²³ kg", density: "5.43 g/cm³",
      orbitalPeriod: "88 days", rotation: "1,408 hours", moons: "0", gravity: "3.7 m/s²",
      discoveredBy: "Known since antiquity", discoveryDate: "Ancient times", bodyType: "Planet", volume: "6.083 × 10¹⁰ km³",
      quickFacts: ["Mass: 3.285 × 10²³ kg", "Surface gravity: 3.7 m/s²", "Density: 5.427 g/cm³", "Axial tilt: 0.034°"],
      perihelion: "46.0M km", aphelion: "69.8M km", eccentricity: "0.2056", inclination: "7.00°", axialTilt: "0.034°", temp: "167°C", escape: "4.25 km/s"
    },
    saturn: {
      name: "Saturn", color: "#facc15", bgBadge: "bg-purple-500/50 text-purple-200", type: "Gas Giant",
      distanceAU: "9.54", diameter: "116,464", massE: "95.161", orbitP: "29.5 years", moonsCount: "285",
      description: "Saturn is the sixth planet from the Sun and the second-largest in the Solar System. It is a gas giant with an average radius about nine times that of Earth, and is best known for its extensive ring system.",
      distance: "1426.7M km", radius: "58,232 km", mass: "5.68336 × 10²⁶ kg", density: "0.69 g/cm³",
      orbitalPeriod: "10759.22 days", rotation: "10.66 hours", moons: "285", gravity: "10.44 m/s²",
      discoveredBy: "Known since antiquity", discoveryDate: "Ancient times", bodyType: "Planet", volume: "8.2713 × 10¹⁴ km³",
      quickFacts: ["Mass: 5.68336 × 10²⁶ kg", "Surface gravity: 10.44 m/s²", "Density: 0.6971 g/cm³", "Axial tilt: 26.73°"],
      perihelion: "1349.8M km", aphelion: "1503.5M km", eccentricity: "0.05650", inclination: "2.48°", axialTilt: "26.73°", temp: "-139°C", escape: "36.09 km/s"
    },
    earth: {
      name: "Earth", color: "#3b82f6", bgBadge: "bg-orange-500/50 text-orange-200", type: "Terrestrial",
      distanceAU: "1.00", diameter: "12,742", massE: "1.000", orbitP: "1.0 years", moonsCount: "1",
      description: "Earth is the third planet from the Sun and the only astronomical object known to harbor life. About 29% of Earth's surface is land consisting of continents and islands, while 71% is covered with water.",
      distance: "149.6M km", radius: "6,371 km", mass: "5.972 × 10²⁴ kg", density: "5.51 g/cm³",
      orbitalPeriod: "365.25 days", rotation: "24 hours", moons: "1", gravity: "9.8 m/s²",
      discoveredBy: "Known since antiquity", discoveryDate: "Ancient times", bodyType: "Planet", volume: "1.083 × 10¹² km³",
      quickFacts: ["Mass: 5.972 × 10²⁴ kg", "Surface gravity: 9.8 m/s²", "Density: 5.514 g/cm³", "Axial tilt: 23.44°"],
      perihelion: "147.1M km", aphelion: "152.1M km", eccentricity: "0.0167", inclination: "0.00°", axialTilt: "23.44°", temp: "15°C", escape: "11.19 km/s"
    },
    venus: {
      name: "Venus", color: "#f97316", bgBadge: "bg-orange-500/50 text-orange-200", type: "Terrestrial",
      distanceAU: "0.72", diameter: "12,104", massE: "0.815", orbitP: "225 days", moonsCount: "0",
      description: "Venus is the second planet from the Sun. It is a terrestrial planet and is the closest in size and mass to Earth, often called Earth's twin, though it has a massive, toxic atmosphere.",
      distance: "108.2M km", radius: "6,051 km", mass: "4.867 × 10²⁴ kg", density: "5.24 g/cm³",
      orbitalPeriod: "225 days", rotation: "5,832 hours", moons: "0", gravity: "8.87 m/s²",
      discoveredBy: "Known since antiquity", discoveryDate: "Ancient times", bodyType: "Planet", volume: "9.284 × 10¹¹ km³",
      quickFacts: ["Mass: 4.867 × 10²⁴ kg", "Surface gravity: 8.87 m/s²", "Density: 5.243 g/cm³", "Axial tilt: 177.3°"],
      perihelion: "107.5M km", aphelion: "108.9M km", eccentricity: "0.0067", inclination: "3.39°", axialTilt: "177.3°", temp: "464°C", escape: "10.36 km/s"
    }
  };

  // 2. دالة بناء الجدول ديناميكياً بنفس الترتيب المظبوط في لقطة الشاشة
  function buildComparisonTable() {
    if (!tableBody) return;
    tableBody.innerHTML = ""; // تصفير الهيكل القديم الثابت

    // مصفوفة الترتيب المخصصة من الصورة (Uranus -> Neptune -> Jupiter -> Mars -> Mercury -> Saturn -> Earth -> Venus)
    const order = ["uranus", "neptune", "jupiter", "mars", "mercury", "saturn", "earth", "venus"];

    order.forEach(key => {
      const p = allPlanetsData[key];
      tableBody.innerHTML += `
        <tr class="hover:bg-slate-800/30 transition-colors">
          <td class="px-4 md:px-6 py-3 md:py-4 sticky left-0 bg-slate-800 z-10">
            <div class="flex items-center space-x-2 md:space-x-3">
              <div class="w-6 h-6 rounded-full flex-shrink-0" style="background-color: ${p.color}"></div>
              <span class="font-semibold text-sm md:text-base whitespace-nowrap">${p.name}</span>
            </div>
          </td>
          <td class="px-4 md:px-6 py-3 md:py-4 text-slate-300 text-sm whitespace-nowrap">${p.distanceAU}</td>
          <td class="px-4 md:px-6 py-3 md:py-4 text-slate-300 text-sm whitespace-nowrap">${p.diameter}</td>
          <td class="px-4 md:px-6 py-3 md:py-4 text-slate-300 text-sm whitespace-nowrap">${p.massE}</td>
          <td class="px-4 md:px-6 py-3 md:py-4 text-slate-300 text-sm whitespace-nowrap">${p.orbitP}</td>
          <td class="px-4 md:px-6 py-3 md:py-4 text-slate-300 text-sm whitespace-nowrap">${p.moonsCount}</td>
          <td class="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap">
            <span class="px-2 py-1 rounded text-xs ${p.bgBadge}">${p.type}</span>
          </td>
        </tr>
      `;
    });
  }

  // 3. دالة تحديث الكروت العلوية بالتفاصيل الكاملة
  function updatePlanetUI(planetId) {
    const data = allPlanetsData[planetId];
    if (!data) return;

    const nameEl = document.getElementById("planet-detail-name");
    const descEl = document.getElementById("planet-detail-description");
    const imgEl = document.getElementById("planet-detail-image");

    if (nameEl) nameEl.innerText = data.name;
    if (descEl) descEl.innerText = data.description;
    if (imgEl) {
      imgEl.src = `./assets/images/${planetId}.png`;
      imgEl.onerror = function() {
        this.src = `https://img.icons8.com/plasticine/200/${planetId}.png`;
      };
    }

    const setTxt = (id, txt) => { const el = document.getElementById(id); if(el) el.innerHTML = txt; };
    
    setTxt("planet-distance", data.distance);
    setTxt("planet-radius", data.radius);
    setTxt("planet-mass", data.mass);
    setTxt("planet-density", data.density);
    setTxt("planet-orbital-period", data.orbitalPeriod);
    setTxt("planet-rotation", data.rotation);
    setTxt("planet-moons", data.moons);
    setTxt("planet-gravity", data.gravity);

    setTxt("planet-discoverer", data.discoveredBy);
    setTxt("planet-discovery-date", data.discoveryDate);
    setTxt("planet-body-type", data.bodyType);
    setTxt("planet-volume", data.volume);

    const factsList = document.getElementById("planet-facts");
    if (factsList) {
      factsList.innerHTML = data.quickFacts.map(fact => `
        <li class="flex items-start">
          <i class="fas fa-check text-green-400 mt-1 mr-2"></i>
          <span class="text-slate-300">${fact}</span>
        </li>
      `).join('');
    }

    setTxt("planet-perihelion", data.perihelion);
    setTxt("planet-aphelion", data.aphelion);
    setTxt("planet-eccentricity", data.eccentricity);
    setTxt("planet-inclination", data.inclination);
    setTxt("planet-axial-tilt", data.axialTilt);
    setTxt("planet-temp", data.temp);
    setTxt("planet-escape", data.escape);
  }

  // ربط الأكشن بضغط الكروت
  planetCards.forEach(card => {
    card.addEventListener("click", function () {
      planetCards.forEach(c => c.style.borderColor = "#334155");
      
      const planetColor = this.getAttribute("style").match(/--planet-color:\s*(#[a-fA-A0-9]+)/)[1];
      this.style.borderColor = planetColor;
      
      const planetId = this.getAttribute("data-planet-id").trim().toLowerCase();
      updatePlanetUI(planetId);
    });
  });

  // بناء الجدول فوراً وتنشيط كوكب زحل افتراضياً لمطابقة اللقطة تماماً
  buildComparisonTable();
  updatePlanetUI("saturn");
}

// تشغيل محرك الكواكب
initPlanetsSection();