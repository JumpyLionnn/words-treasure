class Random {
    private constructor () {

    }
    public static randint (max: number, min: number = 0): number {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    public static randfloat (max: number, min: number = 0,): number {
        return Math.random() * (max - min) + min;
    }

    public static random (): number {
        return Math.random();
    }

    public static choice <T> (array: T[]): T {
        return array[this.randint(0, array.length)];
    }

    public static shuffle <T> (array: T[]): void {
        array = [...array];
        for (let i = array.length - 1; i > 0; i--) {
            const j = this.randint(0, i + 1);
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
}