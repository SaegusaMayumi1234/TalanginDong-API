import db from '../storages/mongoDB/index';

export const createBill = async function createBill(data: Object) {
  await new db.billSchema({
    data: data,
  }).save();
};

export const getBill = async function getBill(userId: String) {
  const billData = (await db.billSchema.find()) as any;
  const proc = [];
  for (const bill of billData) {
    proc.push(bill.data);
    if (bill.data.createdBy.id === userId || bill.data.members.some((value: any) => value.id === userId)) {
      console.log(bill.data);
    }
  }
  return proc;
};
