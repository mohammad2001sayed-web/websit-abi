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
