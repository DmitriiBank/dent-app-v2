import { beforeAll, describe, expect, it } from '@jest/globals';

process.env.DATABASE ??= 'mongodb://user:<PASSWORD>@localhost/test';
process.env.DATABASE_PASSWORD ??= 'secret';
process.env.JWT_ACCESS_SECRET ??= 'test-access-secret';
process.env.JWT_REFRESH_SECRET ??= 'test-refresh-secret';

let ApplServiceImplMongoClass: typeof import('../src/services/ApplServiceImplMongo').ApplServiceImplMongo;
let HttpErrorClass: typeof import('../src/errorHandler/HttpError').HttpError;

beforeAll(async () => {
    const serviceModule = await import('../src/services/ApplServiceImplMongo');
    const errorModule = await import('../src/errorHandler/HttpError');
    ApplServiceImplMongoClass = serviceModule.ApplServiceImplMongo;
    HttpErrorClass = errorModule.HttpError;
});

describe('ApplServiceImplMongo', () => {
    it('getAll uses the feature pipeline and returns documents', async () => {
        const expectedDocs = [{ id: 'a' }];
        const findResult = { marker: 'findQuery' };
        const model: any = {
            find: () => findResult,
        };

        let receivedQuery: unknown;
        let receivedQueryString: unknown;
        const flags = { filter: 0, sort: 0, limitFields: 0, paginate: 0 };

        const service = new ApplServiceImplMongoClass(<T>(query: unknown, queryString: unknown) => {
            receivedQuery = query;
            receivedQueryString = queryString;

            return {
                filter() {
                    flags.filter += 1;
                    return this;
                },
                sort() {
                    flags.sort += 1;
                    return this;
                },
                limitFields() {
                    flags.limitFields += 1;
                    return this;
                },
                paginate() {
                    flags.paginate += 1;
                    return this;
                },
                query: {
                    exec: () => Promise.resolve(expectedDocs),
                },
            } as any;
        });

        const docs = await service.getAll(model, { some: 'query' });

        expect(docs).toEqual(expectedDocs);
        expect(receivedQuery).toBe(findResult);
        expect(receivedQueryString).toEqual({ some: 'query' });
        expect(flags).toEqual({ filter: 1, sort: 1, limitFields: 1, paginate: 1 });
    });

    it('getOne returns the document when found', async () => {
        const doc = { id: 'abc' };
        const model: any = {
            findById: () => ({
                exec: () => Promise.resolve(doc),
            }),
        };

        const service = new ApplServiceImplMongoClass();
        const result = await service.getOne(model, 'abc');

        expect(result).toBe(doc);
    });

    it('getOne populates when options are provided', async () => {
        const doc = { id: 'with-populate' };
        const populateCalls: unknown[] = [];
        const model: any = {
            findById: () => ({
                populate: (options: unknown) => {
                    populateCalls.push(options);
                    return {
                        exec: () => Promise.resolve(doc),
                    };
                },
                exec: () => Promise.resolve(doc),
            }),
        };

        const service = new ApplServiceImplMongoClass();
        const result = await service.getOne(model, 'id', { path: 'related' });

        expect(result).toBe(doc);
        expect(populateCalls).toEqual([{ path: 'related' }]);
    });

    it('getOne throws HttpError when document not found', async () => {
        const model: any = {
            findById: () => ({
                exec: () => Promise.resolve(null),
            }),
        };

        const service = new ApplServiceImplMongoClass();

        await expect(service.getOne(model, 'missing')).rejects.toBeInstanceOf(HttpErrorClass);
    });

    it('createOne returns created document and throws when creation fails', async () => {
        const model: any = {
            create: () => Promise.resolve({ id: 'created' }),
        };

        const service = new ApplServiceImplMongoClass();
        const created = await service.createOne(model, { value: 1 });
        expect(created).toEqual({ id: 'created' });

        const failingModel: any = {
            create: () => null,
        };

        await expect(service.createOne(failingModel, {})).rejects.toBeInstanceOf(HttpErrorClass);
    });

    it('updateOne returns updated document or throws when missing', async () => {
        const doc = { id: 'updated' };
        const model: any = {
            findByIdAndUpdate: () => Promise.resolve(doc),
        };

        const service = new ApplServiceImplMongoClass();
        const updated = await service.updateOne(model, 'id', { value: 1 });
        expect(updated).toBe(doc);

        const missingModel: any = {
            findByIdAndUpdate: () => Promise.resolve(null),
        };

        await expect(service.updateOne(missingModel, 'missing', {})).rejects.toBeInstanceOf(HttpErrorClass);
    });

    it('deleteOne resolves when document is deleted and throws otherwise', async () => {
        const doc = { id: 'deleted' };
        const model: any = {
            findByIdAndDelete: () => Promise.resolve(doc),
        };

        const service = new ApplServiceImplMongoClass();
        const deleted = await service.deleteOne(model, 'id');
        expect(deleted).toBe(doc);

        const missingModel: any = {
            findByIdAndDelete: () => Promise.resolve(null),
        };

        await expect(service.deleteOne(missingModel, 'missing')).rejects.toBeInstanceOf(HttpErrorClass);
    });
});
