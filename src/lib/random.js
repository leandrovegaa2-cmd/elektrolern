// Fisher-Yates-Mischen. Optionaler injizierbarer Zufallsgenerator für Tests.
export function mischen(arr, rng = Math.random) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const r = Math.floor(rng() * (i + 1));
    [a[i], a[r]] = [a[r], a[i]];
  }
  return a;
}
