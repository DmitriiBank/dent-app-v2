import {Query} from 'mongoose';

interface QueryString {
  [key: string]: any;
  sort?: string;
  fields?: string;
  page?: string | number;
  limit?: string | number;
}

export class APIFeatures<T> {
  query: Query<T[], T>;
  private queryString: QueryString;

  constructor(query: Query<T[], T>, queryString: QueryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter(): this {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryString = JSON.stringify(queryObj);
    queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    const parsedQuery = JSON.parse(queryString);
    this.query = this.query.find(parsedQuery);
    return this;
  }

  sort(): this {
    const sortValue = this.queryString.sort;
    if (typeof sortValue === 'string') {
      const sortBy = sortValue.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  limitFields(): this {
    const fields = this.queryString.fields;
    if (typeof fields === 'string') {
      const selectFields = fields.split(',').join(' ');
      this.query = this.query.select(selectFields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate(): this {
    const page = Number(this.queryString.page) || 1;
    const limit = Number(this.queryString.limit) || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}
