export default {
  title: "邦多利控分计算器",
  lb_cli: "命令行输入",
  lb_mode: "活动模式",
  lb_boost: "活动加成 (%)",
  lb_fire: "火",
  lb_num: "Num 参数",
  lb_medley: "组曲火数",
  lb_team: "队伍得分 (5v5团队live获胜请勾选)",
  lb_calculate: "目标活动点数 (--calculate 参数)",
  run: "计算!",
  lb_output: "控分结果",

  ph_cli: "键入 bandori-parking --? 以查看指令菜单",
  ph_boost: "通常 0 ~ 376",
  ph_num: "副队综合力 / 排名 (或排名分) / 组曲演奏数 (或演奏数奖励分)",
  ph_medley: "例如 1,0,3",
  ph_calculate: "必填",

  helpText: (
`公式:
pts = (⌊(底分+⌊单人得分/系数⌋)*加成倍率⌋+⌊副队综合力/3000⌋)*火倍率 | "⌊...⌋"表示向下取整

模式:
1. (旧)普协
2. (旧)CP活(攒)
3. (旧)CP活(清)
4. (旧)对邦
5. (旧)EX活
6. (旧)课题
7. (旧)5v5
8. CP活(攒)
9. CP活(清)
10.对邦
11.EX活
12.课题
13.5v5
14.组曲

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
