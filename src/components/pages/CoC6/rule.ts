import { constant, sum } from '@/utils/accumulator'
import { Dict } from '@/utils/dict'
import { add, div, floor, mul, partition } from '@/utils/transformer'
import { Translator } from '@/utils/translator'

const db = (arg: number[]) => {
  const value = sum(arg)
  if (value < 13) {
    return '-1d6'
  }
  if (value < 17) {
    return '-1d4'
  }
  if (value < 25) {
    return '±0'
  }
  if (value < 33) {
    return '+1d4'
  }
  if (value < 41) {
    return '+1d6'
  }
  const n = Math.ceil((value - 40) / 16)
  return `+${n}d6`
}

export const useRule = (translator: Translator) => {
  translator.terms.clear(true)
  translator.extend('name', { en: 'Name', ja: '名前' })
  translator.extend('addname', { en: ' Add %name%', ja: '%name%を追加' })
  translator.extend('item', { en: 'Item', ja: '項目' })
  translator.extend('dice', { en: 'Dice', ja: 'ダイス' })
  translator.extend('value', { en: 'Value', ja: '能力値' })
  translator.extend('equation', { en: 'Equation', ja: '計算式' })
  translator.extend('profile', { en: 'Profile', ja: 'プロフィール' })
  translator.extend('notes', { en: 'Notes', ja: 'メモ' })
  translator.extend('parameters', { en: 'Parameters', ja: '能力値' })
  translator.extend('skills', { en: 'Skills', ja: '技能' })

  translator.extend('password', { en: 'Password', ja: 'パスワード' })
  translator.extend('cancel', { en: 'Cancel', ja: 'キャンセル' })
  translator.extend('confirm', { en: 'Confirm', ja: '設定する' })
  translator.extend('unlock', { en: 'Unlock', ja: '解除する' })
  translator.extend('copied', { en: 'Copied', ja: 'コピー済み' })
  translator.extend('close', { en: 'Close', ja: '閉じる' })

  const profile = new Dict([
    ['occupation', { deps: [], convert: () => '' }],
    ['age', { deps: ['edu'], convert: (arg: number[]) => `${sum.then(add(6))(arg)}` }],
    ['sex', { deps: [], convert: () => '' }],
    ['height', { deps: [], convert: () => '' }],
    ['weight', { deps: [], convert: () => '' }],
    ['hometown', { deps: [], convert: () => '' }],
    ['hair', { deps: [], convert: () => '' }],
    ['eye', { deps: [], convert: () => '' }],
    ['skin', { deps: [], convert: () => '' }],
  ])

  translator.extend('occupation', { en: 'Occupation', ja: '職業' })
  translator.extend('age', { en: 'Age', ja: '年齢' })
  translator.extend('sex', { en: 'Sex', ja: '性別' })
  translator.extend('height', { en: 'Height', ja: '身長' })
  translator.extend('weight', { en: 'Weight', ja: '体重' })
  translator.extend('hometown', { en: 'Home Town', ja: '出身' })
  translator.extend('hair', { en: 'Hair Color', ja: '髪の色' })
  translator.extend('eye', { en: 'Eye Color', ja: '瞳の色' })
  translator.extend('skin', { en: 'Skin Color', ja: '肌の色' })

  const parameters = new Dict([
    ['str', { dice: [6, 6, 6], apply: sum.then(partition, true), palette: true }],
    ['con', { dice: [6, 6, 6], apply: sum.then(partition, true), palette: true }],
    ['pow', { dice: [6, 6, 6], apply: sum.then(partition, true), palette: true }],
    ['dex', { dice: [6, 6, 6], apply: sum.then(partition, true), palette: true }],
    ['app', { dice: [6, 6, 6], apply: sum.then(partition, true), palette: true }],
    ['siz', { dice: [6, 6], apply: sum.then(partition, true).then(add(6)), palette: true }],
    ['int', { dice: [6, 6], apply: sum.then(partition, true).then(add(6)), palette: true }],
    ['edu', { dice: [6, 6, 6], apply: sum.then(partition, true).then(add(3)), palette: true }],
    ['wlt', { dice: [6, 6, 6], apply: sum.then(partition, true), palette: false }],
  ])

  translator.extend('str', { en: 'STR' })
  translator.extend('con', { en: 'CON' })
  translator.extend('pow', { en: 'POW' })
  translator.extend('dex', { en: 'DEX' })
  translator.extend('app', { en: 'APP' })
  translator.extend('siz', { en: 'SIZ' })
  translator.extend('int', { en: 'INT' })
  translator.extend('edu', { en: 'EDU' })
  translator.extend('wlt', { en: 'WLT' })

  const attributes = new Dict([
    ['san', { deps: ['pow'], apply: sum.then(partition, true).then(mul(5)), palette: 'SAN' }],
    ['luk', { deps: ['pow'], apply: sum.then(partition, true).then(mul(5)), palette: true }],
    ['ida', { deps: ['int'], apply: sum.then(partition, true).then(mul(5)), palette: true }],
    ['knw', { deps: ['edu'], apply: sum.then(partition, true).then(mul(5)), palette: true }],
    ['hp', { deps: ['con', 'siz'], apply: sum.then(partition, true).then(div(2)).then(floor), palette: false }],
    ['mp', { deps: ['pow'], apply: sum.then(partition, true).then(mul(1)), palette: false }],
    ['jobpts', { deps: ['edu'], apply: sum.then(partition, true).then(mul(20)), palette: false }],
    ['hbypts', { deps: ['int'], apply: sum.then(partition, true).then(mul(10)), palette: false }],
  ])

  const properties = new Dict([['db', { deps: ['str', 'siz'], convert: db, palette: true }]])

  translator.extend('san', { en: 'SAN', ja: '正気度' })
  translator.extend('luk', { en: 'Luck', ja: '幸運' })
  translator.extend('ida', { en: 'Idea', ja: 'アイデア' })
  translator.extend('knw', { en: 'Knowledge', ja: '知識' })
  translator.extend('hp', { en: 'HP', ja: '耐久力' })
  translator.extend('mp', { en: 'MP', ja: 'マジックポイント' })
  translator.extend('jobpts', { en: 'Job Points', ja: '職業技能ポイント' })
  translator.extend('hbypts', { en: 'Hobby Points', ja: '趣味技能ポイント' })
  translator.extend('db', { en: 'Damage Bonus', ja: 'ダメージボーナス' })

  translator.extend('san-abbrev', { en: 'SAN', ja: 'SAN' })
  translator.extend('luk-abbrev', { en: 'LUK', ja: '幸運' })
  translator.extend('ida-abbrev', { en: 'IDA', ja: 'ｱｲﾃﾞｱ' })
  translator.extend('knw-abbrev', { en: 'KNW', ja: '知識' })
  translator.extend('hp-abbrev', { en: 'HP', ja: 'HP' })
  translator.extend('mp-abbrev', { en: 'MP', ja: 'MP' })
  translator.extend('jobpts-abbrev', { en: 'Job', ja: '職業P' })
  translator.extend('hbypts-abbrev', { en: 'Hby', ja: '趣味P' })
  translator.extend('db-abbrev', { en: 'DB', ja: 'DB' })

  const skillset = new Dict([
    [
      'combat',
      new Dict([
        ['dodge', { deps: ['dex'], apply: sum.then(mul(2)), fixed: true, custom: false }],
        ['fist', { deps: [], apply: constant(50), fixed: false, custom: false }],
        ['grapple', { deps: [], apply: constant(25), fixed: false, custom: false }],
        ['head', { deps: [], apply: constant(10), fixed: false, custom: false }],
        ['kick', { deps: [], apply: constant(25), fixed: false, custom: false }],
        ['martial', { deps: [], apply: constant(1), fixed: false, custom: false }],
        ['throw', { deps: [], apply: constant(25), fixed: false, custom: false }],
        ['handgun', { deps: [], apply: constant(20), fixed: false, custom: false }],
        ['machinegun', { deps: [], apply: constant(15), fixed: false, custom: false }],
        ['rifle', { deps: [], apply: constant(25), fixed: false, custom: false }],
        ['shotgun', { deps: [], apply: constant(30), fixed: false, custom: false }],
        ['smg', { deps: [], apply: constant(15), fixed: false, custom: false }],
      ]),
    ],
    [
      'search',
      new Dict([
        ['spot', { deps: [], apply: constant(25), fixed: true, custom: false }],
        ['listen', { deps: [], apply: constant(25), fixed: true, custom: false }],
        ['library', { deps: [], apply: constant(25), fixed: true, custom: false }],
        ['firstaid', { deps: [], apply: constant(30), fixed: true, custom: false }],
        ['hide', { deps: [], apply: constant(15), fixed: false, custom: false }],
        ['conceal', { deps: [], apply: constant(10), fixed: false, custom: false }],
        ['disguise', { deps: [], apply: constant(1), fixed: false, custom: false }],
        ['sneak', { deps: [], apply: constant(10), fixed: false, custom: false }],
        ['track', { deps: [], apply: constant(10), fixed: false, custom: false }],
        ['navigate', { deps: [], apply: constant(10), fixed: false, custom: false }],
        ['photography', { deps: [], apply: constant(10), fixed: false, custom: false }],
        ['lockpick', { deps: [], apply: constant(1), fixed: false, custom: false }],
        ['psychoanalysis', { deps: [], apply: constant(1), fixed: false, custom: false }],
      ]),
    ],
    [
      'action',
      new Dict([
        ['climb', { deps: [], apply: constant(40), fixed: false, custom: false }],
        ['jump', { deps: [], apply: constant(25), fixed: false, custom: false }],
        ['drive', { deps: [], apply: constant(20), fixed: false, custom: true }],
        ['pilot', { deps: [], apply: constant(1), fixed: false, custom: true }],
        ['oprhvymch', { deps: [], apply: constant(1), fixed: false, custom: false }],
        ['repairmch', { deps: [], apply: constant(20), fixed: false, custom: false }],
        ['repairelectr', { deps: [], apply: constant(10), fixed: false, custom: false }],
        ['craft', { deps: [], apply: constant(5), fixed: false, custom: true }],
        ['art', { deps: [], apply: constant(5), fixed: false, custom: true }],
        ['ride', { deps: [], apply: constant(5), fixed: false, custom: false }],
        ['swim', { deps: [], apply: constant(25), fixed: false, custom: false }],
      ]),
    ],
    [
      'negotiation',
      new Dict([
        ['fasttalk', { deps: [], apply: constant(5), fixed: false, custom: false }],
        ['trust', { deps: [], apply: constant(15), fixed: false, custom: false }],
        ['persuade', { deps: [], apply: constant(15), fixed: false, custom: false }],
        ['bargain', { deps: [], apply: constant(5), fixed: false, custom: false }],
        ['nativelang', { deps: ['edu'], apply: sum.then(mul(5)), fixed: true, custom: false }],
        ['foreignlang', { deps: [], apply: constant(1), fixed: false, custom: true }],
      ]),
    ],
    [
      'knowledge',
      new Dict([
        ['cthulhu', { deps: [], apply: constant(0), fixed: false, custom: false }],
        ['psychology', { deps: [], apply: constant(5), fixed: false, custom: false }],
        ['occult', { deps: [], apply: constant(5), fixed: false, custom: false }],
        ['history', { deps: [], apply: constant(20), fixed: false, custom: false }],
        ['law', { deps: [], apply: constant(5), fixed: false, custom: false }],
        ['accouting', { deps: [], apply: constant(10), fixed: false, custom: false }],
        ['anthropology', { deps: [], apply: constant(1), fixed: false, custom: false }],
        ['archaeology', { deps: [], apply: constant(1), fixed: false, custom: false }],
        ['natural', { deps: [], apply: constant(10), fixed: false, custom: false }],
        ['medicine', { deps: [], apply: constant(5), fixed: false, custom: false }],
        ['pharmacy', { deps: [], apply: constant(1), fixed: false, custom: false }],
        ['chemistry', { deps: [], apply: constant(1), fixed: false, custom: false }],
        ['biology', { deps: [], apply: constant(1), fixed: false, custom: false }],
        ['computer', { deps: [], apply: constant(1), fixed: false, custom: false }],
        ['electronics', { deps: [], apply: constant(1), fixed: false, custom: false }],
        ['physics', { deps: [], apply: constant(1), fixed: false, custom: false }],
        ['astronomy', { deps: [], apply: constant(1), fixed: false, custom: false }],
        ['geology', { deps: [], apply: constant(1), fixed: false, custom: false }],
      ]),
    ],
  ])

  translator.extend('combat', { en: 'Combat Skills', ja: '戦闘技能' })
  translator.extend('search', { en: 'Search Skills', ja: '探索技能' })
  translator.extend('action', { en: 'Action Skills', ja: '行動技能' })
  translator.extend('negotiation', { en: 'Negotiation Skills', ja: '交渉技能' })
  translator.extend('knowledge', { en: 'Knowledge Skills', ja: '知識技能' })

  translator.extend('dodge', { en: 'Dodge', ja: '回避' })
  translator.extend('fist', { en: 'Fist', ja: 'こぶし' })
  translator.extend('grapple', { en: 'Grapple', ja: '組み付き' })
  translator.extend('head', { en: 'Head', ja: '頭突き' })
  translator.extend('kick', { en: 'Kick', ja: 'キック' })
  translator.extend('martial', { en: 'Martial Arts', ja: 'マーシャルアーツ' })
  translator.extend('throw', { en: 'Throw', ja: '投擲' })
  translator.extend('handgun', { en: 'Handgun', ja: '拳銃' })
  translator.extend('machinegun', { en: 'Machine Gun', ja: 'マシンガン' })
  translator.extend('rifle', { en: 'Rifle', ja: 'ライフル' })
  translator.extend('shotgun', { en: 'Shotgun', ja: 'ショットガン' })
  translator.extend('smg', { en: 'SMG', ja: 'サブマシンガン' })

  translator.extend('firstaid', { en: 'First Aid', ja: '応急手当' })
  translator.extend('lockpick', { en: 'Lock Pick', ja: '鍵開け' })
  translator.extend('hide', { en: 'Hide', ja: '隠れる' })
  translator.extend('conceal', { en: 'Conceal', ja: '隠す' })
  translator.extend('listen', { en: 'Listen', ja: '聞き耳' })
  translator.extend('sneak', { en: 'Sneak', ja: '忍び歩き' })
  translator.extend('photography', { en: 'Photography', ja: '写真術' })
  translator.extend('psychoanalysis', { en: 'Psychoanalysis', ja: '精神分析' })
  translator.extend('track', { en: 'Track', ja: '追跡' })
  translator.extend('climb', { en: 'Climb', ja: '登攀' })
  translator.extend('library', { en: 'Library Use', ja: '図書館' })
  translator.extend('spot', { en: 'Spot Hidden', ja: '目星' })

  translator.extend('drive', { en: 'Drive', ja: '運転' })
  translator.extend('pilot', { en: 'Pilot', ja: '操縦' })
  translator.extend('oprhvymch', { en: 'Opr. Hvy. Mch.', ja: '重機械操作' })
  translator.extend('repairmch', { en: 'Mech. Repair', ja: '機械修理' })
  translator.extend('repairelectr', { en: 'Electr. Repair', ja: '電気修理' })
  translator.extend('ride', { en: 'Ride', ja: '乗馬' })
  translator.extend('swim', { en: 'Swim', ja: '水泳' })
  translator.extend('craft', { en: 'Craft', ja: '製作' })
  translator.extend('jump', { en: 'Jump', ja: '跳躍' })
  translator.extend('navigate', { en: 'Navigate', ja: 'ナビゲート' })
  translator.extend('disguise', { en: 'Disguise', ja: '変装' })

  translator.extend('fasttalk', { en: 'Fasttalk', ja: '言いくるめ' })
  translator.extend('trust', { en: 'Trust', ja: '信用' })
  translator.extend('persuade', { en: 'Persuade', ja: '説得' })
  translator.extend('bargain', { en: 'Bargain', ja: '値切り' })
  translator.extend('nativelang', { en: 'Native Lang.', ja: '母国語' })
  translator.extend('foreignlang', { en: 'Foreign Lang.', ja: '異国語' })

  translator.extend('medicine', { en: 'Medicine', ja: '医学' })
  translator.extend('occult', { en: 'Occult', ja: 'オカルト' })
  translator.extend('chemistry', { en: 'Chemistry', ja: '化学' })
  translator.extend('cthulhu', { en: 'Cthulhu', ja: 'クトゥルフ神話' })
  translator.extend('art', { en: 'Art', ja: '芸術' })
  translator.extend('accouting', { en: 'Accouting', ja: '経理' })
  translator.extend('archaeology', { en: 'Archaeology', ja: '考古学' })
  translator.extend('computer', { en: 'Computer', ja: 'コンピューター' })
  translator.extend('psychology', { en: 'Psychology', ja: '心理学' })
  translator.extend('anthropology', { en: 'Anthropology', ja: '人類学' })
  translator.extend('biology', { en: 'Biology', ja: '生物学' })
  translator.extend('geology', { en: 'Geology', ja: '地質学' })
  translator.extend('electronics', { en: 'Electronics', ja: '電子工学' })
  translator.extend('astronomy', { en: 'Astronomy', ja: '天文学' })
  translator.extend('natural', { en: 'Natural History', ja: '博物学' })
  translator.extend('physics', { en: 'Physics', ja: '物理学' })
  translator.extend('law', { en: 'Law', ja: '法律' })
  translator.extend('pharmacy', { en: 'Pharmacy', ja: '薬学' })
  translator.extend('history', { en: 'History', ja: '歴史' })

  return { profile, parameters, attributes, properties, skillset }
}

export type Rule = ReturnType<typeof useRule>

export const system = 'coc6'
