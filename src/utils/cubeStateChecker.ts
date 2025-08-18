// 魔方状态检查器
export class CubeStateChecker {
    static SOLVED_STATE = "WWWWWWWWWOOOOOOOOOGGGGGGGGGRRRRRRRRRBBBBBBBBBYYYYYYYYY";

    // 检查指定区域是否匹配目标颜色
    static checkArea(state: string, start: number, end: number, color: string): boolean {
        return state.slice(start, end + 1).split('').every(c => c === color);
    }

    // 检查指定位置是否匹配目标颜色
    static checkPositions(state: string, positions: number[], color: string): boolean {
        return positions.every(pos => state[pos] === color);
    }

    // 获取当前解法进度
    static getProgress(state: string): string {
        // 检查是否已完成
        if (state === this.SOLVED_STATE) return 'SOLVED';

        // 检查白色底面
        if (this.checkArea(state, 0, 8, 'W')) {
            // 检查中层是否完成
            const middleIndices = [10, 13, 16, 19, 22, 25, 28, 31, 34];
            if (this.checkPositions(state, middleIndices, 'O')) {
                return 'MIDDLE_LAYER';
            }
            return 'BOTTOM_COMPLETE';
        }

        // 检查白色十字
        const crossIndices = [1, 3, 4, 5, 7];
        if (this.checkPositions(state, crossIndices, 'W')) {
            return 'BOTTOM_CROSS';
        }

        return 'IN_PROGRESS';
    }
}
