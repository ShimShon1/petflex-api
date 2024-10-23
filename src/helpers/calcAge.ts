export default function (birthDate: any) {
  const now = new Date();
  const then = birthDate as Date;

  let years = now.getFullYear() - then.getFullYear();
  let months = now.getMonth() - then.getMonth();
  let days = now.getDate() - then.getDate();
  if (months < 0) {
    years--;
    months += 12;
  }
  if (days < 0) {
    months--;
    const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (years < 0) years = 0;
  return { years, months, days };
}
