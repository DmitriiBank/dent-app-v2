import { describe, expect, it } from '@jest/globals';

import { APIFeatures } from '../src/utils/apiFeatures';

describe('APIFeatures', () => {
    it('filter removes excluded fields and applies advanced operators', () => {
        const received: any[] = [];
        const queryOps: any = {
            find: (arg: unknown) => {
                received.push(arg);
                return queryOps;
            },
            sort: () => queryOps,
            select: () => queryOps,
            skip: () => queryOps,
            limit: () => queryOps,
        };

        const features = new APIFeatures<any>(queryOps, {
            difficulty: 'easy',
            duration: { gte: '5' },
            page: '2',
            sort: 'name',
        });

        const result = features.filter();

        expect(result).toBe(features);
        expect(received[0]).toEqual({ difficulty: 'easy', duration: { $gte: '5' } });
    });

    it('sort applies user defined and fallback ordering', () => {
        let sortArg: string | undefined;
        const queryOps: any = {
            find: () => queryOps,
            sort: (value: string) => {
                sortArg = value;
                return queryOps;
            },
            select: () => queryOps,
            skip: () => queryOps,
            limit: () => queryOps,
        };

        const withSort = new APIFeatures<any>(queryOps, { sort: 'price,-rating' });
        withSort.sort();
        expect(sortArg).toBe('price -rating');

        const withoutSort = new APIFeatures<any>(queryOps, {});
        withoutSort.sort();
        expect(sortArg).toBe('-createdAt');
    });

    it('limitFields selects specific fields or defaults to removing __v', () => {
        let selectArg: string | undefined;
        const queryOps: any = {
            find: () => queryOps,
            sort: () => queryOps,
            select: (value: string) => {
                selectArg = value;
                return queryOps;
            },
            skip: () => queryOps,
            limit: () => queryOps,
        };

        const withFields = new APIFeatures<any>(queryOps, { fields: 'name,duration' });
        withFields.limitFields();
        expect(selectArg).toBe('name duration');

        const withoutFields = new APIFeatures<any>(queryOps, {});
        withoutFields.limitFields();
        expect(selectArg).toBe('-__v');
    });

    it('paginate calculates skip and limit correctly', () => {
        let skipArg: number | undefined;
        let limitArg: number | undefined;

        const queryOps: any = {
            find: () => queryOps,
            sort: () => queryOps,
            select: () => queryOps,
            skip: (value: number) => {
                skipArg = value;
                return queryOps;
            },
            limit: (value: number) => {
                limitArg = value;
                return queryOps;
            },
        };

        const features = new APIFeatures<any>(queryOps, { page: '3', limit: '15' });
        features.paginate();

        expect(skipArg).toBe(30);
        expect(limitArg).toBe(15);
    });
});