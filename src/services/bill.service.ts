import db from '../storages/mongoDB/index';

export const createBill = async function createBill(data: Object) {
  await new db.billSchema({
    data: data,
  }).save();
};

export const getBill = async function getBill() {
  const billData = await db.billSchema.find();
  const proc = [];
  for (const bill of billData) {
    proc.push(bill.data);
  }
  return proc;
};
