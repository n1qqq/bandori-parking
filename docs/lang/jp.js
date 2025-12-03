export default {
  title: "バンドリイベントスコア電卓(?)",
  lb_cli: "CLI入力",
  lb_mode: "イベントタイプ",
  lb_boost: "イベントブースト (%)",
  lb_fire: "LB",
  lb_num: "Num パラメータ",
  lb_medley: "メドレーLB",
  lb_team: "チームスコア (チームライブフェスで勝利する場合)",
  lb_calculate: "目標イベントポイント (--calculate パラメータ)",
  run: "計算せよ!",
  lb_output: "結果",

  ph_cli: "bandori-parking --? を入力し、コマンドガイドを確認するのもできるようになる",
  ph_boost: "通常、 0 ~ 376 の間にある",
  ph_num: "サポートバンド / ランキング (或いはスコア) / メドレープレイ数 (或いはスコア)",
  ph_medley: "例: 1,0,3",
  ph_calculate: "必須",

  helpText: (
`公式:
pts = (⌊(底分+⌊单人得分/系数⌋)*加成倍率⌋+⌊副队综合力/3000⌋)*火倍率 | "⌊...⌋"表示向下取整

Event Types:
1. (Archived) Normal Event
2. (Archived) Challenge Live Event, Free/Multi Live Show
3. (Archived) Challenge Live Event, Challenge Live Show
4. (Archived) VS Live Event
5. (Archived) Live Goals Event (EX Trials)
6. (Archived) Mission Live Event
7. (Archived) Team Live Festival Event (5v5)
8. Challenge Live Event, Free/Multi Live Show
9. Challenge Live Event, Challenge Live Show
10.VS Live Event
11.Live Goals Event (EX Trials)
12.Mission Live Event
13.Team Live Festival Event (5v5)
14.Medley Live Event

示例:
  bandori-parking --mode 1 --fire 3 --calculate 2085
  bandori-score -medley 1,2,16383 -n 65 --parking 3750 -m 14

选项:
  --mode <n>         活动类型 (1..14)
    alias: --m
  --boost <n%>       加成倍率 (传 100 表示加成 100% 倍率)
    alias: --b
  --fire <n>         火数 (0/1/2/3)
    alias: --f
  --calculate <pts>  目标点数
    aliases: --c,  --calc,  --parking,  --park,  --p
  --num <num>        用于某些模式的第二参数 (副队综合[5~6位数]/排名[1/2/3/4/5]/附加底分[对邦5v5排名分/组曲演奏数量分])
    alias: --n
  --medley <list>    用于组曲模式的火数设置, 同时可能用于确定演奏曲目数量 (若未设置medley则必须填入num; 演奏数量如若冲突，由num最终决定)
    alias: --mdl
  --team <w/l>       用于5v5模式的胜负设置, 通常无需设置 (默认为负). 可不填参数 (此时为胜). 可选参数: w, W, win, Win; l, L, lose, Lose
    aliases: --t, --55, --5v5, --wl
  --dual <pts> --va <v> --atmpt <k>   呼叫 DualSemiAuto 功能 (暂未启用)
`),
};
