import type { SolvingStage } from '../types/cube';

// 魔方标准层先法（Beginner's Method）步骤
export const SOLVING_STAGES: SolvingStage[] = [
    {
        id: 'white-cross',
        name: '白色十字',
        description: '构建底层（白色）十字',
        cubeProgress: 'IN_PROGRESS',
        steps: [
            {
                id: 'white-cross',
                name: '白色十字',
                description: '构建顶层（白色）十字',
                algorithm: undefined, // 运行时从后端获取
                targetPattern: 'WWWWWWWWW*********************************', // 白色在上方
                hints: [
                    '1. 观察白色棱块的位置',
                    '2. 将白色棱块转至顶层',
                    '3. 对齐白色中心块'
                ]
            },
        ]
    },
    {
        id: 'white-corners',
        name: '白色角块',
        description: '完成顶层（白色面）',
        cubeProgress: 'BOTTOM_CROSS',
        steps: [
            {
                id: 'white-corners',
                name: '白色角块',
                description: '调整白色角块到正确位置',
                algorithm: undefined,
                targetPattern: 'WWWWWWWWWRRRGGGOOOBBB***************************', // 顶层完成
                hints: [
                    '1. 找到一个带白色的角块',
                    '2. 调整到正确位置',
                    '3. 根据解法执行'
                ]
            }
        ]
    },
    {
        id: 'second-layer',
        name: '第二层',
        description: '完成中间层',
        cubeProgress: 'BOTTOM_COMPLETE',
        steps: [
            {
                id: 'second-layer',
                name: '中层棱块',
                description: '调整中层的所有棱块到正确位置',
                algorithm: undefined,
                targetPattern: 'WWWWWWWWWRRRRRRRRRGGGGGGGGG************************', // 第二层完成
                hints: [
                    '1. 观察中层棱块的位置',
                    '2. 根据解法调整棱块',
                    '3. 确保颜色对齐'
                ]
            }
        ]
    },
    {
        id: 'yellow-cross',
        name: '黄色十字',
        description: '完成底层（黄色）十字',
        cubeProgress: 'MIDDLE_LAYER',
        steps: [
            {
                id: 'yellow-cross',
                name: '黄色十字',
                description: '构建底层的黄色十字',
                algorithm: undefined,
                targetPattern: 'WWWWWWWWWRRRRRRRRRGGGGGGGGGOOOOOOOOOBBBBBBBBBY*YYY*YYY', // 底层黄色十字
                hints: [
                    '1. 观察黄色棱块的位置',
                    '2. 根据解法调整黄色棱块',
                    '3. 形成底层十字'
                ]
            }
        ]
    },
    {
        id: 'yellow-corners',
        name: '黄色角块',
        description: '完成底层角块',
        cubeProgress: 'SOLVED',
        steps: [
            {
                id: 'yellow-corners',
                name: '黄色角块',
                description: '调整底层黄色角块',
                algorithm: undefined,
                targetPattern: 'WWWWWWWWWRRRRRRRRRGGGGGGGGGOOOOOOOOOBBBBBBBBBYYYYYYYYY', // 完全还原
                hints: [
                    '1. 观察黄色角块的位置',
                    '2. 根据解法调整角块位置',
                    '3. 完成魔方还原'
                ]
            }
        ]
    }
];