/* おのたしざん — もんだい
 * mode: 'prefix' … ＋お ボタンで あたまに たす
 *       'choose' … 「お」を いれる ところを えらぶ
 * answers[].pos … 「お」を いれる いち（0 = あたま）
 * kind … ないぶ よう の メモ。プレイヤーには みせない。
 */
window.PROBLEMS = [
  { base: 'ちゃ', mode: 'prefix', intro: 'ことばに「お」を ひとつ たしてみよう！',
    answers: [{ pos: 0, scene: 'yunomi', sound: 'pin', line: 'おちゃが できました！', kind: 'bika' }] },
  { base: 'かし', mode: 'prefix',
    answers: [{ pos: 0, scene: 'okashi', sound: 'okashi', line: 'おいしそうですね！', kind: 'imi' }] },
  { base: 'かね', mode: 'prefix', before: 'bell',
    answers: [{ pos: 0, scene: 'okane', sound: 'chalin', line: 'できました！', kind: 'imi' }] },
  { base: 'すし', mode: 'prefix', before: 'sushi',
    answers: [{ pos: 0, scene: 'sushiFancy', sound: 'kira', line: 'ていねいに なりました！', kind: 'bika' }] },
  { base: 'にぎり', mode: 'prefix',
    answers: [{ pos: 0, scene: 'onigiri', sound: 'pop', line: 'おにぎりに なりました！', kind: 'fumei' }] },
  { base: 'しろ', mode: 'prefix', before: 'whiteCard',
    answers: [{ pos: 0, scene: 'castle', sound: 'rumble', line: 'おしろが できました！', kind: 'imi' }] },
  { base: 'でん', mode: 'prefix',
    answers: [{ pos: 0, scene: 'oden', sound: 'pin', line: 'あったかいですね！', kind: 'fumei' }] },
  { base: 'なら', mode: 'prefix',
    answers: [{ pos: 0, scene: 'puff', sound: 'pu', line: 'せいかい！', kind: 'imi', special: 'nara' }] },
  { base: 'ばけ', mode: 'prefix',
    answers: [{ pos: 0, scene: 'ghost', sound: 'boing', line: 'かわいいですね！', kind: 'fumei' }] },
  { base: 'さけ', mode: 'prefix', before: 'salmon',
    answers: [{ pos: 0, scene: 'sake', sound: 'pin', line: 'おとなの のみものです。', kind: 'imi' }] },

  { base: 'こり', mode: 'choose', intro: 'こんどは「お」を いれる ところを えらんでね！',
    answers: [{ pos: 1, scene: 'ice', sound: 'kira', line: 'つめたいですね！', kind: 'soune' }] },
  { base: 'しり', mode: 'choose', intro: '「お」が はいる ところは ふたつ あるよ！',
    answers: [
      { pos: 0, scene: 'bunny', sound: 'boing', line: 'おしりです！', kind: 'bika' },
      { pos: 1, scene: 'shiori', sound: 'pin', line: 'ほんに はさめますね！', kind: 'soune' },
    ] },
  { base: 'とり', mode: 'choose', before: 'bird', intro: 'ここも ふたつ あるよ！',
    answers: [
      { pos: 0, scene: 'decoy', sound: 'whoosh', line: 'おとりに なりました！', kind: 'imi' },
      { pos: 1, scene: 'street', sound: 'whoosh', line: 'とおりが できました！', kind: 'soune' },
    ] },
  { base: 'とく', mode: 'choose', intro: 'よく かんがえてみよう！',
    answers: [
      { pos: 0, scene: 'tag', sound: 'chalin', line: 'おとくです！', kind: 'imi' },
      { pos: 1, scene: 'far', sound: 'whoosh', line: 'とおく なりました！', kind: 'soune' },
    ] },
  { base: 'かり', mode: 'choose',
    answers: [{ pos: 1, scene: 'kaori', sound: 'kira', line: 'いい かおりが します！', kind: 'soune' }] },
];

window.FINAL = { base: 'みおつけ' };

window.LINES = {
  press: ['「＋お」を おしてね！', 'つぎの もんだいです！', 'やってみよう！', '「お」を たしてみよう！'],
  choose: '「お」を いれる ところを えらんでね！',
  more: 'ほかにも あるよ！ さがしてみよう！',
  allFound: 'ぜんぶ みつけました！',
  wrong: ['うーん、そこでは ないみたい。', 'ほかの ところに たしてみよう！'],
  praise: ['できました！', 'とても じょうずですね！', 'せいかい！', 'すごいね！', 'その ちょうし！', 'よく できました！'],
  finalIntro: ['とっても じょうずに できました！', 'さいごは ちょっと むずかしい もんだいです！'],
};
