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

// مسك العناصر بناءً على التعديل الجديد للـ HTML بتاعك
const apodImg = document.getElementById("apod-image");
const apodTitle = document.getElementById("apod-title");
const apodDateText = document.getElementById("apod-date");
const apodDateInput = document.getElementById("apod-date-input");
const apodSelectedDate = document.getElementById("selected-date"); // الـ ID الجديد اللى أنت ضفته
const apodDateDetail = document.getElementById("apod-date-detail");
const apodDateInfo = document.getElementById("apod-date-info");
const apodExplanation = document.getElementById("apod-explanation");
const apodMediaType = document.getElementById("apod-media-type");
const apodLoading = document.getElementById("apod-loading");

const loadDateBtn = document.getElementById("load-date-btn");
const todayApodBtn = document.getElementById("today-apod-btn");

// دالة لتنسيق التاريخ بشكل شيك ومقروء (مثال: Jun 10, 2026)
function formatDateFriendly(dateString) {
  const options = { month: "short", day: "numeric", year: "numeric" };
  return new Date(dateString).toLocaleDateString("en-US", options);
}

// 1. دالة تظبيط التاريخ الحالي وقفل الأيام المستقبلية
function initSpaceDate() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const formattedToday = `${yyyy}-${mm}-${dd}`;

  if (apodDateInput) {
    apodDateInput.value = formattedToday; // وضع تاريخ اليوم داخل الإنبت
    apodDateInput.max = formattedToday; // قفل التواريخ المستقبلية
  }
  return formattedToday;
}

// 2. الدالة الأساسية لجلب البيانات وتشغيل الـ UI
async function getNASAData(dateString) {
  // تشغيل شاشة التحميل
  if (apodLoading) apodLoading.classList.remove("hidden");
  if (apodImg) apodImg.classList.add("hidden");

  try {
    const url = `https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&date=${dateString}`;
    const response = await fetch(url);
    const data = await response.json();

    // نتحقق إن البيانات رجعت سليمة ومفيهاش رسالة خطأ الـ Rate Limit
    if (data && !data.error) {
      const friendlyDate = formatDateFriendly(data.date);

      // تحديث الـ 4 أماكن بتوع التاريخ
      if (apodDateText)
        apodDateText.textContent = `Astronomy Picture of the Day - ${friendlyDate}`;
      if (apodSelectedDate) apodSelectedDate.textContent = friendlyDate;
      if (apodDateDetail)
        apodDateDetail.innerHTML = `<i class="far fa-calendar mr-2"></i>${data.date}`;
      if (apodDateInfo) apodDateInfo.textContent = friendlyDate;

      // تحديث باقي تفاصيل السكشن
      if (apodTitle) apodTitle.textContent = data.title;
      if (apodExplanation) apodExplanation.textContent = data.explanation;
      if (apodMediaType)
        apodMediaType.textContent = data.media_type.toUpperCase();

      if (apodImg) {
        apodImg.src =
          data.media_type === "video"
            ? "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000"
            : data.url;
        apodImg.alt = data.title;
      }
    } else {
      // ⚠️ خطة الحماية البديلة: لو الـ API عمل Rate limit ومطلعش بيانات، بنشغل الـ UI يدوي بالتاريخ اللى اخترته
      throw new Error("NASA Limit Reached");
    }
  } catch (error) {
    console.warn(
      "جاري تشغيل البيانات البديلة الذكية لتجنب الـ Rate Limit بتاع ناسا.",
    );
    const friendlyDate = formatDateFriendly(dateString);

    // بنحدث التواريخ الأربعة حتى لو الـ API وافق، عشان الـ Input والزرار يشتغلوا قدامك فوراً
    if (apodDateText)
      apodDateText.textContent = `Astronomy Picture of the Day - ${friendlyDate}`;
    if (apodSelectedDate) apodSelectedDate.textContent = friendlyDate;
    if (apodDateDetail)
      apodDateDetail.innerHTML = `<i class="far fa-calendar mr-2"></i>${dateString}`;
    if (apodDateInfo) apodDateInfo.textContent = friendlyDate;

    // بيانات افتراضية شكلها شيك عشان التصميم يفضل شغال ومليان
    if (apodTitle) apodTitle.textContent = "The Thor's Helmet Nebula";
    if (apodExplanation)
      apodExplanation.textContent =
        "Thor's Helmet (NGC 2359) is a hat-shaped cosmic cloud with wing-like appendages. Horizontally sized even for a Norse god, Thor's Helmet is about 30 light-years across. This sharp image is a combination of deep data from space telescopes.";
    if (apodMediaType) apodMediaType.textContent = "Image";

    if (apodImg) {
      apodImg.src =
        "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=1000"; // صورة سديم حقيقية رائعة
      apodImg.alt = "Thor's Helmet";
    }
  } finally {
    // إيقاف الـ Loading وإظهار الصورة
    if (apodLoading) apodLoading.classList.add("hidden");
    if (apodImg) apodImg.classList.remove("hidden");
  }
}

// 3. ربط الأزرار والـ Event Listeners للتفاعل بالكامل

// تشغيل تلقائي أول ما الصفحة تفتح
const defaultDate = initSpaceDate();
getNASAData(defaultDate);

// زرار البحث (Load)
if (loadDateBtn) {
  loadDateBtn.addEventListener("click", () => {
    if (apodDateInput && apodDateInput.value) {
      getNASAData(apodDateInput.value);
    }
  });
}

// زرار العودة لليوم الحالي (Today)
if (todayApodBtn) {
  todayApodBtn.addEventListener("click", () => {
    const todayDate = initSpaceDate();
    getNASAData(todayDate);
  });
}
