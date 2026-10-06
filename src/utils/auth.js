const USERS_KEY = "homepro_users";
const CURRENT_USER_KEY = "user";

/*
  Barcha eski localStorage userlarini olish
*/
export function getUsers() {
  const raw = localStorage.getItem(USERS_KEY);

  return raw ? JSON.parse(raw) : [];
}

/*
  Userlarni localStorage'ga saqlash
*/
function saveUsers(users) {
  localStorage.setItem(
    USERS_KEY,
    JSON.stringify(users)
  );
}

/*
  REGISTER
  Eski localStorage prototype uchun qoldirilgan.
  Hozir asosiy register backend orqali ishlaydi.
*/
export function registerUser({
  name,
  phone,
  password,
  profession,
}) {
  const users = getUsers();

  if (
    users.some(
      (u) => u.phone === phone
    )
  ) {
    throw new Error(
      "Bu telefon raqam bilan foydalanuvchi allaqachon ro'yxatdan o'tgan"
    );
  }

  const newUser = {
    id: Date.now().toString(),
    name,
    phone,
    password,
    profession,
    role: "usta",
  };

  users.push(newUser);

  saveUsers(users);

  return newUser;
}

/*
  LOGIN
  Eski localStorage login funksiyasi.
  Hozir asosiy login backend orqali ishlaydi.
*/
export function loginUser({
  phone,
  password,
}) {
  const users = getUsers();

  const user = users.find(
    (u) =>
      u.phone === phone &&
      u.password === password
  );

  if (!user) {
    throw new Error(
      "Telefon raqam yoki parol noto'g'ri"
    );
  }

  localStorage.setItem(
    CURRENT_USER_KEY,
    JSON.stringify(user)
  );

  return user;
}

/*
  LOGOUT

  Backend login bilan ishlayotganimiz uchun
  barcha auth ma'lumotlarini tozalaymiz.
*/
export function logoutUser() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("role");

  // Eski localStorage kaliti ham tozalanadi
  localStorage.removeItem(
    "homepro_current_user"
  );
}

/*
  CURRENT USER

  Endi Login.jsx saqlayotgan
  "user" kalitidan foydalanamiz.
*/
export function getCurrentUser() {
  const raw =
    localStorage.getItem(CURRENT_USER_KEY);

  return raw ? JSON.parse(raw) : null;
}
