import { model, Schema } from 'mongoose';

interface IbillSchema {
  data: Object;
}

export const billSchema = model(
  'Bill',
  new Schema<IbillSchema>({
    data: Object,
  }),
  'Bill',
);
