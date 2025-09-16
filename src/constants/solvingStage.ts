import type { SolvingStage } from "../utils/cubeTypes";


// 魔方的求解阶段定义
export type Stage = SolvingStage;

export const SOLVING_STAGES: Stage[] = [
    {
        id: 'white-cross',
        name: '白色十字',
        description: '开始解魔方的第一步是完成白色十字。这一步尝试自己完成，可以培养空间感。关键是每个白色棱块不仅要放在白色面上形成十字，还要确保它们的侧面颜色与周围中心块匹配',
        targetPattern: '*W*WWW*W**O**O*****G**G*****R**R*****B**B*************',
        hints: [
            '1. 找出四个带白色的棱块（每个棱块有两种颜色）',
            '2. 先放一个棱块到位，再放第二个，以此类推',
            '3. 当放置新棱块时，注意不要破坏已经放好的棱块',
            '4. 棱块翻转处理：① 当棱在顶层但方向错误：F U\' R U',
            '5. 棱块位置处理：② 当棱在底层且无法直接移动到顶层：先执行 F2 将其移到前面，然后用 F\' U\' R U 将其插入到位',
            '6. 棱块位置处理：③ 当棱在中层：U\' R U 或 U L\' U\'',
            '7. 确保每个棱块的侧面颜色与中心块匹配'
        ],
        algorithm: ["F U' R U", "F' U' R U", "U' R U", "U L' U'"],
        cubeProgress: ['bottom-edges']
    },
    {
        id: 'white-corners',
        name: '白色角块',
        description: '目标：继续保持白色面在【顶部】，用 3 个极短公式把 4 个白色角块逐一插入完成第一层（顶面整面 + 侧面一圈对齐）。根据角块当前白色贴纸朝向（右 / 前 / 底）选择对应算法。所有角完成后再整体翻转魔方（白底黄顶），进入中层步骤。',
        targetPattern: 'WWWWWWWWWOOO*O****GGG*G****RRR*R****BBB*B*************',
        hints: [
            '1. 选择一个未就位的白角，将其通过 D / D\' 转到底层，并放到其目标位置正下方（右前下角作为操作位）',
            '2. 观察该角白色贴纸朝向：朝右 / 朝前 / 朝底',
            '3. 朝右 → 用 R\' D\' R； 朝前 → 用 F D F\'； 朝底 → 用 R\' D2\' R D R\' D\' R',
            '4. 如果白色贴纸朝向不符合目标位置，使用 R\' D\' R D 重复执行，直到白角归位',
            '5. 重复直至 4 个角全部正确，然后整体翻转魔方（白色到底，黄色到顶）'
        ],
        // Ruwix 初学者角块三种情况（保持白面在上时的常见插入方式：此处沿用其页面展示的三组）
        // 顺序与提示中朝向说明一致：右 / 前 / 底
        algorithm: ["R' D' R", 'F D F\'', "F L D2 L' F'"],
        cubeProgress: ['bottom-complete']
    },
    {
        id: 'middle-layer',
        name: '中间层',
        description: '目标：翻转后（白色在底、黄色在顶），插入四个不含黄色的棱块完成前两层 (F2L)。使用对称的左 / 右插入公式。',
        targetPattern: 'WWWWWWWWWOOOOOO***GGGGGG***RRRRRR***BBBBBB************',
        hints: [
            '1. 寻找顶层不含黄色的棱块，将其前色与前中心对齐形成“竖线”',
            '2. 判断其目标在右还是左',
            '3. 右侧插入：执行右公式一次',
            '4. 左侧插入：执行左公式一次',
            '5. 若某棱在中层但方向错误，用对应公式执行两次把它顶出再重插'
        ],
        algorithm: ['U R U\' R\' U\' F\' U F', 'U\' L\' U L U F U\' F\''],
        cubeProgress: ['middle-layer-complete']
    },
    {
        id: 'yellow-cross',
        name: '黄色十字',
        description: '目标：在黄色顶面做出黄色十字（此时只关注“+”形，棱块侧色是否对齐暂不要求）。通过同一公式在不同形态间转换：点 → L → 直线 → 十字。',
        targetPattern: 'WWWWWWWWWOOOOOO***GGGGGG***RRRRRR***BBBBBB****Y*YYY*Y*',
        hints: [
            '1. 观察顶面形态：点 / L 形 / 直线 / 十字',
            '2. 点：执行 F R U R\' U\' F\' 三次 → 得 L 形',
            '3. L 形：将其摆成左上“┘”形，执行 F R U R\' U\' F\' 两次 → 得直线',
            '4. 直线：保持水平，执行 F R U R\' U\' F\' 一次 → 得十字',
            '5. 快捷方法：从 L 形直接到十字，可使用 F U R U\' R\' F\'',
            '6. 出现十字后继续下一阶段（暂不必对齐棱侧色）'
        ],
        algorithm: ['F R U R\' U\' F\''],
        cubeProgress: ['top-cross']
    },
    {
        id: 'yellow-edges',
        name: '黄色棱块定位',
        description: '目标：在已有黄色十字的基础上，使四个黄色棱块侧色与相邻中心对齐（完成顶层棱的位置与朝向）。反复使用同一公式直到全部对齐。',
        targetPattern: 'WWWWWWWWWOOOOOO*O*GGGGGG*G*RRRRRR*R*BBBBBB*B**Y*YYY*Y*',
        hints: [
            '1. 观察十字四个棱与侧面中心的匹配情况',
            '2. 若有两个相邻已对齐，可将它们放在背面+右侧，执行公式一次',
            '3. 若只有一个或没有对齐，直接执行公式（唯一对齐的放在背面）再重新评估',
            '4. 反复执行直至四个棱全部对齐'
        ],
        // Ruwix 第5步：Swap Yellow Edges
        algorithm: ['R U R\' U R U2 R\' U'],
        cubeProgress: ['top-cross-aligned']
    },
    {
        id: 'yellow-corners-position',
        name: '黄色角块定位',
        description: '目标：只调整顶层四个黄色角块的位置（忽略其朝向），把所有角块移动到正确“位置集合”。使用角循环公式。',
        targetPattern: 'WWWWWWWWWOOOOOO*O*GGGGGG*G*RRRRRR*R*BBBBBB*B**Y*YYY*Y*',
        hints: [
            '1. 寻找已在正确位置（颜色集合正确）的角块（不看朝向）',
            '2. 如找到，将它放右前顶角作为“固定角”',
            '3. 执行角循环公式，循环其余三个角，但固定角从始至终在右前顶不变',
            '4. 若无任何正确角，先执行一次公式再重新查找',
            '5. 重复直到四个角位置都正确（但可能仍有朝向未转好）'
        ],
        // Ruwix 第6步：Position Yellow Corners
        algorithm: ['U R U\' L\' U R\' U\' L'],
        cubeProgress: ['top-corners-positioned']
    },
    {
        id: 'yellow-corners-orient',
        name: '黄色角块朝向',
        description: '目标：在所有黄色角块已位于正确位置的前提下，逐个调整其朝向形成完整黄色面。对单个未朝上的角反复执行公式（2或4次），只转顶层切换至下一个角。',
        targetPattern: 'WWWWWWWWWOOOOOOOOOGGGGGGGGGRRRRRRRRRBBBBBBBBBYYYYYYYYY',
        hints: [
            '1. 手持魔方：选一个未朝上的黄色角放在右前顶',
            '2. 执行【R\' D\' R D】直至该角黄色朝上（通常 2 或 4 次）',
            '3. 仅转 U / U\' 将下一个未好的角移到右前顶',
            '4. 重复直至全部角朝上，过程中不要转动整块或中下两层',
            '5. 完成后整个魔方复原'
        ],
        // Ruwix 第7步：Orient Yellow Corners （单角重复）
        algorithm: ["R' D' R D"],
        cubeProgress: ['complete']
    }
];

