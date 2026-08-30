// Tage-Streak: wächst, wenn man an aufeinanderfolgenden Tagen lernt.
import { todayISO, yesterdayISO } from "./date.js";

/**
 * @param {{last:string|null, count:number}} streak bisheriger Streak-Stand
 * @param {Date} ref Referenzdatum (für Tests)
 * @returns {{last:string, count:number}} neuer Streak-Stand
 */
export function streakAktualisieren(streak, ref = new Date()) {
  const heute = todayISO(ref);
  if (streak.last === heute) return streak; // heute schon gezählt
  const gestern = yesterdayISO(ref);
  const count = streak.last === gestern ? streak.count + 1 : 1;
  return { last: heute, count };
}
