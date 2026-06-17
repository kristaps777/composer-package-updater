export const stringify = (): Stringify => {
    const sprintf = (format: string, ...args: any): string => {
        let i = 0;

        return format.replace(/%[sd%]/g, (match) => {
            let result: any;
            switch (true) {
                case match === '%%':
                    result = '%';
                    break;
                case match === '%s':
                    result = String(args[i++]);
                    break;
                case match === '%d':
                    result = Number(args[i++]);
                    break;
                default:
                    result = match;
                    break;
            }

            return result;
        });
    };

    return {
        sprintf,
    };
};

export interface Stringify {
    sprintf: (format: string, ...args: any) => string;
}
