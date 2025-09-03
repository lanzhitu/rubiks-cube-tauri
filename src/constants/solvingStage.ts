import type { SolvingStage } from '../types/cube';

// 魔方的求解阶段定义
export type Stage = SolvingStage;

export const SOLVING_STAGES: Stage[] = [
    {
        id: 'white-cross',
        name: '白色十字',
        description: '构建白色十字',
        targetPattern: '*W*WWW*W**O**O*****G**G*****R**R*****B**B*************',
        hints: [
            '1. 找到一个白色棱块',
            '2. 将它移动到顶层',
            '3. 旋转顶层使其对应颜色与中心块对齐',
            '4. 执行F2转动将其放置到底层正确位置'
        ],
        algorithm: ['F', 'R', 'U', 'R\'', 'U\'', 'F\''],
        cubeProgress: ['bottom-edges']
    },
    {
        id: 'white-corners',
        name: '白色角块',
        description: '完成白色面',
        targetPattern: 'WWWWWWWWWOOO*O****GGG*G****RRR*R****BBB*B*************',
        hints: [
            '1. 找到一个白色角块',
            '2. 将它移动到顶层对应位置',
            '3. 执行R U R\'或其对称操作放置到正确位置'
        ],
        algorithm: ['R', 'U', 'R\'', 'U\''],
        cubeProgress: ['bottom-complete']
    },
    {
        id: 'middle-layer',
        name: '中间层',
        description: '完成中间层',
        targetPattern: 'WWWWWWWWWOOOOOO***GGGGGG***RRRRRR***BBBBBB************',
        hints: [
            '1. 找到一个不含黄色的棱块',
            '2. 将它移动到顶层',
            '3. 根据颜色选择U R U\' R\' U\' F\' U F或其镜像操作'
        ],
        algorithm: ['U', 'R', 'U\'', 'R\'', 'U\'', 'F\'', 'U', 'F'],
        cubeProgress: ['middle-layer-complete']
    },
    {
        id: 'yellow-cross',
        name: '顶层十字',
        description: '构建黄色十字',
        targetPattern: 'WWWWWWWWWOOOOOO***GGGGGG***RRRRRR***BBBBBB****Y*YYY*Y*',
        hints: [
            '1. 观察顶面黄色块的形状',
            '2. 根据形状执行F R U R\' U\' F\'或其变体'
        ],
        algorithm: ['F', 'R', 'U', 'R\'', 'U\'', 'F\''],
        cubeProgress: ['top-cross']
    },
    {
        id: 'yellow-face',
        name: '顶层面完成',
        description: '完成黄色面',
        targetPattern: 'WWWWWWWWWOOOOOO***GGGGGG***RRRRRR***BBBBBB***YYYYYYYYY',
        hints: [
            '1. 如果有一个角块已经是黄色朝上，将其放在左后方',
            '2. 执行R U R\' U R U2 R\'旋转其他角块'
        ],
        algorithm: ['R', 'U', 'R\'', 'U', 'R', 'U2', 'R\''],
        cubeProgress: ['top-face']
    },
    {
        id: 'yellow-edges',
        name: '顶层棱块调整',
        description: '完成魔方还原',
        targetPattern: 'WWWWWWWWWOOOOOOOOOGGGGGGGGGRRRRRRRRRBBBBBBBBBYYYYYYYYY',
        hints: [
            '1. 找到一个位置正确的棱块',
            '2. 执行R2 U R U R\' U\' R\' U\' R\' U R\'或其变体'
        ],
        algorithm: ['R2', 'U', 'R', 'U', 'R\'', 'U\'', 'R\'', 'U\'', 'R\'', 'U', 'R\''],
        cubeProgress: ['complete']
    }
];
