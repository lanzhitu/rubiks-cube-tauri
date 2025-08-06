import type { SolvingStage } from '../types/cube';

// 魔方标准层先法（Beginner's Method）步骤
export const SOLVING_STAGES: SolvingStage[] = [
    {
        id: 'white-cross',
        name: '白色十字',
        description: '构建底层（白色）十字',
        steps: [
            {
                id: 'white-cross-1',
                name: '定位白色中心',
                description: '将白色中心块转到底面',
                algorithm: ['X', 'X'], // 魔方整体旋转
                targetPattern: '*********WWWWWWWWW*********************************', // 白色在底面中心
                hints: [
                    '1. 找到白色中心块',
                    '2. 使用 X X 将白色面转到底部',
                    '3. 这是解魔方的基础姿势'
                ]
            },
            {
                id: 'white-cross-2',
                name: '白色棱块定位',
                description: '将白色棱块放到正确位置',
                algorithm: ['F', 'R', 'U', 'R\'', 'U\'', 'F\''], // 标准十字公式
                targetPattern: '*********WW*WW*WW**********************************', // 底面十字
                hints: [
                    '1. 找到一个带白色的棱块',
                    '2. 将棱块移动到顶层',
                    '3. 对准目标位置后放下'
                ]
            }
        ]
    },
    {
        id: 'white-corners',
        name: '白色角块',
        description: '完成第一层（白色面）',
        steps: [
            {
                id: 'white-corners-1',
                name: '定位白色角块',
                description: '将白色角块放到正确位置',
                algorithm: ['R', 'U', 'R\'', 'U\''], // 插入角块公式
                targetPattern: '*********WWWWWWWWW***WWW***WWW***WWW**************', // 底面角块
                hints: [
                    '1. 找到一个带白色的角块',
                    '2. 将角块移到目标位置上方',
                    '3. 使用基本公式插入'
                ]
            }
        ]
    },
    {
        id: 'second-layer',
        name: '第二层',
        description: '完成中间层',
        steps: [
            {
                id: 'second-layer-1',
                name: '中层棱块（左公式）',
                description: '将中层棱块放到左侧',
                algorithm: ['U\'', 'L\'', 'U', 'L', 'U', 'F', 'U\'', 'F\''], // 左公式
                targetPattern: '*********WWWWWWWWW*********RRRRRRRRRGGGGGGGGG*********OOOOOOOOOBBBBBBBBBYYYYYYYYY', // 中层棱块
                hints: [
                    '1. 找到一个不含黄色的棱块',
                    '2. 将棱块对准顶层对应中心块',
                    '3. 根据需要选择左公式'
                ]
            },
            {
                id: 'second-layer-2',
                name: '中层棱块（右公式）',
                description: '将中层棱块放到右侧',
                algorithm: ['U', 'R', 'U\'', 'R\'', 'U\'', 'F\'', 'U', 'F'], // 右公式
                targetPattern: '*********WWWWWWWWW*********RRRRRRRRRGGGGGGGGG*********OOOOOOOOOBBBBBBBBBYYYYYYYYY', // 中层棱块
                hints: [
                    '1. 找到一个不含黄色的棱块',
                    '2. 将棱块对准顶层对应中心块',
                    '3. 根据需要选择右公式'
                ]
            }
        ]
    },
    {
        id: 'yellow-cross',
        name: '顶层十字',
        description: '完成顶层黄色十字',
        steps: [
            {
                id: 'yellow-cross-1',
                name: '黄色十字',
                description: '形成顶层黄色十字',
                algorithm: ['F', 'R', 'U', 'R\'', 'U\'', 'F\''], // 顶层十字公式
                targetPattern: '****************************************YYYYYYYYY', // 顶面十字
                hints: [
                    '1. 观察顶层黄色块形状',
                    '2. 根据形状选择公式',
                    '3. 可能需要重复执行'
                ]
            }
        ]
    },
    {
        id: 'yellow-corners',
        name: '顶层角块',
        description: '完成顶层角块位置与方向',
        steps: [
            {
                id: 'yellow-corners-1',
                name: '角块位置',
                description: '调整顶层角块位置',
                algorithm: ['U', 'R', 'U\'', 'L\'', 'U', 'R\'', 'U\'', 'L'], // 交换顶层角块位置
                targetPattern: '****************************************YYYYYYYYY', // 顶面角块位置正确
                hints: [
                    '1. 找到位置正确的角块',
                    '2. 将其放在右后方',
                    '3. 执行公式调整其他角块'
                ]
            },
            {
                id: 'yellow-corners-2',
                name: '角块方向',
                description: '调整顶层角块方向',
                algorithm: ['R\'', 'D\'', 'R', 'D'], // 顶层角块方向公式
                targetPattern: 'WWWWWWWWWRRRRRRRRRGGGGGGGGGOOOOOOOOOBBBBBBBBBYYYYYYYYY', // 完全还原
                hints: [
                    '1. 找到需要调整的角块',
                    '2. 重复执行公式直到方向正确',
                    '3. 移动到下一个角块继续'
                ]
            }
        ]
    }
];