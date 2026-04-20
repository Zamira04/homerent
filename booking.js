const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

const bookingForm = document.getElementById("bookingForm");
const checkInInput = document.getElementById("checkIn");
const checkOutInput = document.getElementById("checkOut");
const guestsInput = document.getElementById("guests");

const summaryProperty = document.getElementById("summaryProperty");
const pricePerNightElement = document.getElementById("pricePerNight");
const summaryCheckIn = document.getElementById("summaryCheckIn");
const summaryCheckOut = document.getElementById("summaryCheckOut");
const summaryNights = document.getElementById("summaryNights");
const summaryGuests = document.getElementById("summaryGuests");
const summaryTotal = document.getElementById("summaryTotal");
const toast = document.getElementById("toast");

const propertyName = document.getElementById("propertyName");
const propertyDesc = document.getElementById("propertyDesc");
const propertyPrice = document.getElementById("propertyPrice");
const propertyImage = document.getElementById("propertyImage");
const propertyTag = document.getElementById("propertyTag");
const propertyRating = document.getElementById("propertyRating");

const propertyMap = {
  skyline: {
    name: "云境天际公寓",
    desc: "浦东新区 · 2室1厅 · 高品质精装 · 通勤便利",
    nightly: 680,
    tag: "高人气精选",
    rating: "★ 4.9",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
  },
  garden: {
    name: "梧桐花园住宅",
    desc: "长宁区 · 3室2厅 · 绿化社区 · 家庭优选",
    nightly: 920,
    tag: "家庭优选",
    rating: "★ 4.8",
    image:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80",
  },
  studio: {
    name: "城市轻奢 Studio",
    desc: "静安区 · 1室 · 双地铁交汇 · 年轻首选",
    nightly: 460,
    tag: "通勤便利",
    rating: "★ 4.7",
    image:
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80",
  },
};

menuToggle.addEventListener("click", () => {
  navMenu.classList.toggle("active");
});

const params = new URLSearchParams(window.location.search);
const selectedKey = params.get("property") || "skyline";
const selectedProperty = propertyMap[selectedKey] || propertyMap.skyline;
let pricePerNight = selectedProperty.nightly;

propertyName.textContent = selectedProperty.name;
propertyDesc.textContent = selectedProperty.desc;
propertyPrice.textContent = `¥ ${selectedProperty.nightly.toLocaleString("zh-CN")} / 晚`;
propertyImage.src = selectedProperty.image;
propertyImage.alt = selectedProperty.name;
propertyTag.textContent = selectedProperty.tag;
propertyRating.textContent = selectedProperty.rating;
summaryProperty.textContent = selectedProperty.name;
pricePerNightElement.textContent = `¥ ${selectedProperty.nightly.toLocaleString("zh-CN")}`;

function formatDate(dateString) {
  if (!dateString) return "—";
  const date = new Date(dateString);
  return date.toLocaleDateString("zh-CN");
}

function calculateNights(checkIn, checkOut) {
  if (!checkIn || !checkOut) return 0;

  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diff = end - start;
  const nights = diff / (1000 * 60 * 60 * 24);

  return nights > 0 ? nights : 0;
}

function updateSummary() {
  const checkIn = checkInInput.value;
  const checkOut = checkOutInput.value;
  const guests = guestsInput.value;

  const nights = calculateNights(checkIn, checkOut);
  const total = nights * pricePerNight;

  summaryCheckIn.textContent = formatDate(checkIn);
  summaryCheckOut.textContent = formatDate(checkOut);
  summaryNights.textContent = `${nights} 晚`;
  summaryGuests.textContent = guests ? `${guests} 人` : "—";
  summaryTotal.textContent = `¥ ${total.toLocaleString("zh-CN")}`;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2600);
}

const today = new Date().toISOString().split("T")[0];
checkInInput.min = today;
checkOutInput.min = today;

checkInInput.addEventListener("change", () => {
  checkOutInput.min = checkInInput.value || today;

  if (checkOutInput.value && checkOutInput.value <= checkInInput.value) {
    checkOutInput.value = "";
  }

  updateSummary();
});

checkOutInput.addEventListener("change", updateSummary);
guestsInput.addEventListener("change", updateSummary);

bookingForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const checkIn = checkInInput.value;
  const checkOut = checkOutInput.value;
  const nights = calculateNights(checkIn, checkOut);

  if (nights <= 0) {
    showToast("退房日期必须晚于入住日期，请重新选择。");
    return;
  }

  showToast("预订申请已提交，我们会尽快联系你。");
  bookingForm.reset();

  summaryCheckIn.textContent = "—";
  summaryCheckOut.textContent = "—";
  summaryNights.textContent = "0 晚";
  summaryGuests.textContent = "—";
  summaryTotal.textContent = "¥ 0";
  checkOutInput.min = today;
});
