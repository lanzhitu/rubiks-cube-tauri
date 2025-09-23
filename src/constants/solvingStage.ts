import type { SolvingStage } from "../utils/cubeTypes";


// 魔方的求解阶段定义
export type Stage = SolvingStage;

export const SOLVING_STAGES: Stage[] = [
    {
        id: 'white-cross',
        name: '白色十字',
        description: '开始解魔方的第一步是完成白色十字。这一步建议尝试自己完成，可以培养空间感和魔方直觉。关键在于：每个白色棱块不仅要放在白色面上形成十字图案，还要确保棱块的侧面颜色与周围的中心块颜色完全匹配。',
        targetPattern: '*W*WWW*W**O**O*****G**G*****R**R*****B**B*************',
        hints: [
            '1. 识别四个白色棱块：寻找魔方中包含白色的四个棱块（每个棱块有两种颜色）',
            '2. 逐一放置：先将一个白色棱块放到正确位置，再处理下一个，避免破坏已完成的部分',
            '3. 检查侧面匹配：确保每个白色棱块的另一面颜色与对应的中心块颜色一致',
            '4. 棱块翻转技巧：如果棱块在顶层但方向错误，使用 F U\' R U 进行翻转',
            '5. 棱块移动技巧：如果棱块在底层，先用 F2 移到前面，再用 F\' U\' R U 插入',
            '6. 中层棱块处理：如果棱块在中层，用 U\' R U 或 U L\' U\' 将其移出',
            '7. 最终检查：完成后确保十字的每个棱块侧面都与对应中心块颜色匹配'
        ],
        algorithm: ["F U' R U", "F' U' R U", "U' R U", "U L' U'"],
        cubeProgress: ['bottom-edges']
    },
    {
        id: 'white-corners',
        name: '白色角块',
        description: '目标：保持白色面在【顶部】，使用简单公式将4个白色角块逐一插入正确位置，完成第一层。根据角块白色贴纸的朝向（右侧/前侧/底部）选择对应的插入算法。完成所有角块后，将整个魔方翻转（白色面到底部，黄色面到顶部），准备进入中层求解。',
        targetPattern: 'WWWWWWWWWOOO*O****GGG*G****RRR*R****BBB*B*************',
        hints: [
            '1. 定位白色角块：选择一个还未归位的白色角块，使用 D 或 D\' 将其移到底层',
            '2. 放置到目标下方：将角块移动到其最终目标位置的正下方（以右前下角为操作位置）',
            '3. 观察白色贴纸朝向：仔细看白色贴纸面向哪里 - 右侧、前侧还是底部',
            '4. 选择对应算法：白色朝右→R\' D\' R；白色朝前→F D F\'；白色朝底→F L D2 L\' F\'',
            '5. 重复调整：如果一次插入后角块位置或朝向仍不正确，重复执行对应算法',
            '6. 完成第一层：重复上述步骤直到4个白色角块全部归位',
            '7. 整体翻转：所有白色角块完成后，将整个魔方翻转（白色面到底部，黄色面到顶部）'
        ],
        // Ruwix 初学者角块三种情况（保持白面在上时的常见插入方式：此处沿用其页面展示的三组）
        // 顺序与提示中朝向说明一致：右 / 前 / 底
        algorithm: ["R' D' R", 'F D F\'', "F L D2 L' F'"],
        cubeProgress: ['bottom-complete']
    },
    {
        id: 'middle-layer',
        name: '中间层',
        description: '目标：在魔方翻转后（白色面在底部，黄色面在顶部），完成中间层的四个棱块。寻找顶层中不含黄色的棱块，使用左右插入公式将它们准确放入中层对应位置。这一步将完成魔方的前两层（F2L - First Two Layers）。',
        targetPattern: 'WWWWWWWWWOOOOOO***GGGGGG***RRRRRR***BBBBBB************',
        hints: [
            '1. 寻找目标棱块：在顶层找到不含黄色的棱块（只有其他颜色组合）',
            '2. 对齐前面颜色：转动顶层U，使棱块的前面颜色与前中心块颜色对齐',
            '3. 判断目标位置：确定这个棱块应该插入到右侧还是左侧的中层位置',
            '4. 右侧插入：如果目标在右侧，执行右手公式：U R U\' R\' U\' F\' U F',
            '5. 左侧插入：如果目标在左侧，执行左手公式：U\' L\' U L U F U\' F\'',
            '6. 处理错位棱块：如果某个棱块已在中层但位置或方向错误，先用对应公式将其移出到顶层，再重新插入',
            '7. 重复完成：重复上述步骤，直到中间层的四个棱块全部归位'
        ],
        algorithm: ['U R U\' R\' U\' F\' U F', 'U\' L\' U L U F U\' F\''],
        cubeProgress: ['middle-layer-complete']
    },
    {
        id: 'yellow-cross',
        name: '黄色十字',
        description: '目标：在黄色顶面形成黄色十字。此阶段只关注十字的形状（"+"图案），暂时不需要考虑棱块侧面颜色的对齐。使用一个固定公式，通过多次执行在不同形态间转换：点状 → L形 → 直线 → 十字。',
        targetPattern: 'WWWWWWWWWOOOOOO***GGGGGG***RRRRRR***BBBBBB****Y*YYY*Y*',
        hints: [
            '1. 观察当前形态：仔细查看黄色顶面的当前图案 - 可能是点状、L形、直线或已经是十字',
            '2. 点状图案：如果只有中心是黄色，执行公式 F R U R\' U\' F\' 三次可得到L形',
            '3. L形图案：将L形调整到左上角位置（形如"┘"），执行公式两次可得到直线',
            '4. 直线图案：将直线调整为水平方向，执行公式一次即可得到完整十字',
            '5. 快捷方法：从L形可以直接跳到十字，使用公式 F U R U\' R\' F\'',
            '6. 完成检查：出现十字后，此阶段完成，进入下一阶段（棱块侧面颜色对齐）'
        ],
        algorithm: ['F R U R\' U\' F\''],
        cubeProgress: ['top-cross']
    },
    {
        id: 'yellow-edges',
        name: '黄色棱块定位',
        description: '目标：在已有黄色十字的基础上，调整四个黄色棱块的位置，使每个棱块的侧面颜色与相邻的中心块颜色完全匹配。这样就完成了顶层十字的正确定位。使用一个固定公式反复执行直到全部对齐。',
        targetPattern: 'WWWWWWWWWOOOOOO*O*GGGGGG*G*RRRRRR*R*BBBBBB*B**Y*YYY*Y*',
        hints: [
            '1. 检查对齐情况：观察十字四个棱块的侧面颜色是否与对应的中心块颜色匹配',
            '2. 两个相邻对齐：如果有两个相邻的棱块已经对齐，将它们转到背面和右侧位置，执行一次公式',
            '3. 零个或一个对齐：如果没有或只有一个棱块对齐，直接执行公式（有对齐的放背面），然后重新检查',
            '4. 重复执行：继续使用公式 R U R\' U R U2 R\' U，直到所有四个棱块的侧面都对齐'
        ],
        // Ruwix 第5步：Swap Yellow Edges
        algorithm: ['R U R\' U R U2 R\' U'],
        cubeProgress: ['top-cross-aligned']
    },
    {
        id: 'yellow-corners-position',
        name: '黄色角块定位',
        description: '目标：调整顶层四个角块的位置，使每个角块都移动到正确的位置集合（暂时忽略朝向问题）。使用角块循环公式，通过固定一个已正确的角块，让其他三个角块按顺序循环交换位置。',
        targetPattern: 'WWWWWWWWWOOOOOO*O*GGGGGG*G*RRRRRR*R*BBBBBB*B**Y*YYY*Y*',
        checkType: 'corner-position',
        hints: [
            '1. 寻找正确角块：找到已在正确位置的角块（颜色组合正确，不考虑朝向）',
            '2. 设定固定角：将找到的正确角块转动到右前顶角位置，作为固定参考点',
            '3. 执行循环公式：使用 U R U\' L\' U R\' U\' L 让其他三个角块循环交换，固定角保持不动',
            '4. 无正确角时：如果找不到任何正确位置的角块，先执行一次公式，然后重新寻找',
            '5. 完成检查：重复执行直到四个角块的位置都正确（颜色组合对但朝向可能还需调整）'
        ],
        // Ruwix 第6步：Position Yellow Corners
        algorithm: ['U R U\' L\' U R\' U\' L'],
        cubeProgress: ['top-corners-positioned']
    },
    {
        id: 'yellow-corners-orient',
        name: '黄色角块朝向',
        description: '目标：在所有角块位置正确的基础上，逐个调整每个角块的朝向，使所有黄色贴纸都朝向顶面，最终形成完整的黄色顶面。对每个朝向错误的角块重复执行简单公式，只通过转动顶层来切换操作角块。',
        targetPattern: 'WWWWWWWWWOOOOOOOOOGGGGGGGGGRRRRRRRRRBBBBBBBBBYYYYYYYYY',
        hints: [
            '1. 选择操作角：将一个黄色贴纸未朝上的角块转动到右前顶角位置',
            '2. 重复执行公式：对右前顶角执行 R\' D\' R D 公式，通常需要2次或4次直到黄色朝上',
            '3. 切换到下一个：只使用U或U\' 转动顶层，将下一个需要调整的角块移到右前顶位置',
            '4. 注意事项：整个过程中只转动顶层U，不要转动整个魔方或下面两层',
            '5. 最终完成：重复步骤1-3直到所有角块的黄色贴纸都朝上，整个魔方就复原完成了！'
        ],
        // Ruwix 第7步：Orient Yellow Corners （单角重复）
        algorithm: ["R' D' R D"],
        cubeProgress: ['complete']
    }
];

