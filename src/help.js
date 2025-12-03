// help.js
export const HELP_TEXT = (`
公式:
pts = (⌊(底分+⌊单人得分/系数⌋)*加成倍率⌋+⌊副队综合力/3000⌋)*火倍率 | "⌊...⌋"表示向下取整

模式:
1.普协
2.CP活(攒)
3.CP活(清)
4.对邦
5.EX活
6.课题
7.5v5
8.新CP活(攒)
9.新CP活(清)
10.新对邦
11.新EX活
12.新课题
13.新5v5
14.三组曲

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
`);
