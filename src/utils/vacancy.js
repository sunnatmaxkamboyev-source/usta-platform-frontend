const VACANCIES_KEY = "homepro_vacancies";

export function getVacancies() {
  const raw = localStorage.getItem(VACANCIES_KEY);

  return raw ? JSON.parse(raw) : [];
}

export function addVacancy(vacancy) {
  const vacancies = getVacancies();

  const newVacancy = {
    id: Date.now().toString(),
    ...vacancy,
    createdAt: new Date().toISOString(),
  };

  vacancies.push(newVacancy);

  localStorage.setItem(
    VACANCIES_KEY,
    JSON.stringify(vacancies)
  );

  return newVacancy;
}

export function deleteVacancy(id) {
  const vacancies = getVacancies();

  const updatedVacancies = vacancies.filter(
    (vacancy) => vacancy.id !== id
  );

  localStorage.setItem(
    VACANCIES_KEY,
    JSON.stringify(updatedVacancies)
  );
}