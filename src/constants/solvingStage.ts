import type { SolvingStage } from '../types/cube';

// 魔方的求解阶段定义
export type Stage = SolvingStage;

export const SOLVING_STAGES: Stage[] = [
    {
        id: 'white-cross',
        name: '白色十字',
        description: '在白色面构建一个十字形状',
        targetPattern: '*W*WWW*W**O**O*****G**G*****R**R*****B**B*************',
        hints: [
            '1. 保持白色中心块在底部',
            '2. 找到一个带白色的棱块',
            '3. 将白色面转到底部，同时确保棱块颜色与侧面中心块颜色对齐',
            '4. 可以使用 F或F\' 放置棱块，或 F2 直接放入',
            '5. 重复以上步骤直到完成白色十字'
        ],
        algorithm: ['F2', 'U\' R\' F R', 'R U R\' F\''],
        cubeProgress: ['bottom-edges']
    },
    {
        id: 'white-corners',
        name: '白色角块',
        description: '完成第一层（白色面）',
        targetPattern: 'WWWWWWWWWOOO*O****GGG*G****RRR*R****BBB*B*************',
        hints: [
            '1. 保持白色面在底部',
            '2. 找到一个白色角块',
            '3. 将角块移到目标位置的正上方',
            '4. 如果白色在顶面：执行 U R U\' R\'',
            '5. 如果白色在前面：执行 R U\' R\' U2 R U\' R\'',
            '6. 如果白色在右面：执行 U\' F\' U F'
        ],
        algorithm: ['R U R\'', 'U\'', 'R U R\'', 'U2 F\' U\' F'],
        cubeProgress: ['bottom-complete']
    },
    {
        id: 'middle-layer',
        name: '中间层',
        description: '完成第二层的棱块',
        targetPattern: 'WWWWWWWWWOOOOOO***GGGGGG***RRRRRR***BBBBBB************',
        hints: [
            '1. 找到一个不含黄色的棱块',
            '2. 将棱块移到顶层，使其前面的颜色与前面的中心块匹配',
            '3. 向右插入：U R U\' R\' U\' F\' U F',
            '4. 向左插入：U\' L\' U L U F U\' F\'',
            '5. 如果棱块在正确位置但方向错误，先取出再重新插入'
        ],
        algorithm: ['U R U\' R\' U\' F\' U F', 'U\' L\' U L U F U\' F\''],
        cubeProgress: ['middle-layer-complete']
    },
    {
        id: 'yellow-cross',
        name: '黄色十字',
        description: '在顶面形成黄色十字',
        targetPattern: 'WWWWWWWWWOOOOOO***GGGGGG***RRRRRR***BBBBBB****Y*YYY*Y*',
        hints: [
            '1. 观察顶面黄色形状：点、线或L形',
            '2. 点型：执行完整公式',
            '3. 线型：调整至横线，执行公式',
            '4. L型：调整至左上角，执行公式',
            '5. 标准公式：F R U R\' U\' F\''
        ],
        algorithm: ['F R U R\' U\' F\'', 'F U R U\' R\' F\''],
        cubeProgress: ['top-cross']
    },
    {
        id: 'yellow-face',
        name: '黄色面定向',
        description: '使所有黄色角块朝上',
        targetPattern: 'WWWWWWWWWOOOOOO***GGGGGG***RRRRRR***BBBBBB***YYYYYYYYY',
        hints: [
            '1. 找到已经朝上的黄色角块',
            '2. 将该角块放在左后方（U面的左后角）',
            '3. 执行角块定向公式：R U R\' U R U2 R\'',
            '4. 重复执行直到所有角块朝上',
            '5. 如果没有朝上的角块，从任意位置开始'
        ],
        algorithm: ['R U R\' U R U2 R\'', 'R\' U\' R U\' R\' U2 R'],
        cubeProgress: ['top-face']
    },
    {
        id: 'yellow-corners',
        name: '顶层角块调整',
        description: '调整黄色角块的位置（不考虑方向）',
        targetPattern: 'WWWWWWWWWOOOOOO***GGGGGG***RRRRRR***BBBBBB***YYYYYYYYY',
        hints: [
            '1. 观察四个角块的位置',
            '2. 找到至少一个位置正确的角块',
            '3. 将正确的角块放在右后方',
            '4. 执行 U R U\' L\' U R\' U\' L',
            '5. 如果没有位置正确的角块，从任意位置执行一次公式',
            '6. 重复检查和执行直到所有角块就位'
        ],
        algorithm: ['U R U\' L\' U R\' U\' L', 'L\' U R U\' L U R\''],
        cubeProgress: ['top-corners']
    },
    {
        id: 'yellow-edges',
        name: '顶层棱块调整',
        description: '完成最后的棱块位置调整',
        targetPattern: 'WWWWWWWWWOOOOOOOOOGGGGGGGGGRRRRRRRRRBBBBBBBBBYYYYYYYYY',
        hints: [
            '1. 找到一个位置正确的棱块作为后面',
            '2. 根据其他棱块的情况选择算法：',
            '3. 顺时针循环：R U\' R U R U R U\' R\' U\' R2',
            '4. 逆时针循环：R2 U R U R\' U\' R\' U\' R\' U R\'',
            '5. 对换相邻棱块：R U\' R U R U R U\' R\' U\' R2',
            '6. 对换对面棱块：R2 U R U R\' U\' R\' U\' R\' U R\''
        ],
        algorithm: ['R U\' R U R U R U\' R\' U\' R2', 'R2 U R U R\' U\' R\' U\' R\' U R\''],
        cubeProgress: ['complete']
    }
];
