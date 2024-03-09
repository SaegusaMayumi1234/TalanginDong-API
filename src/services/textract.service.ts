import { AnalyzeExpenseCommand } from '@aws-sdk/client-textract';
import { TextractClient } from '@aws-sdk/client-textract';
import { fromIni } from '@aws-sdk/credential-providers';
import httpStatus from 'http-status';

import config from '../config/config';
import ApiError from '../utils/apiError';
import { currencyStringToNumber } from '../utils/stringModifier';

interface IParsedItems {
  item: string;
  quantity: number;
  price: number;
}

interface ISummaryKey {
  text: number;
  confidence: number;
}

interface ISummary {
  subTotal: ISummaryKey;
  tax: ISummaryKey;
  discount: ISummaryKey;
  serviceCharge: ISummaryKey;
  total: ISummaryKey;
}

const textractClient = new TextractClient({ region: config.aws.region, credentials: fromIni({ profile: config.aws.profile }) });

export const scan = async (bytes: string) => {
  const params = {
    Document: {
      Bytes: Buffer.from(bytes, 'base64'),
    },
  };
  try {
    const aExpense = new AnalyzeExpenseCommand(params);
    const response = await textractClient.send(aExpense);

    const expenseItems: IParsedItems[] = [];
    const expenseSummary: ISummary = {
      subTotal: {
        text: 0,
        confidence: 0,
      },
      tax: {
        text: 0,
        confidence: 0,
      },
      discount: {
        text: 0,
        confidence: 0,
      },
      serviceCharge: {
        text: 0,
        confidence: 0,
      },
      total: {
        text: 0,
        confidence: 0,
      },
    };

    for (const document of response.ExpenseDocuments ?? []) {
      for (const item of document.LineItemGroups ?? []) {
        for (const field of item.LineItems ?? []) {
          const parsedItem: IParsedItems = {
            item: '',
            quantity: 0,
            price: 0,
          };
          for (const data of field.LineItemExpenseFields ?? []) {
            if (data.Type?.Text === 'ITEM') {
              parsedItem.item = data.ValueDetection?.Text ?? '';
            } else if (data.Type?.Text === 'QUANTITY') {
              parsedItem.quantity = currencyStringToNumber(data.ValueDetection?.Text ?? '0');
            } else if (data.Type?.Text === 'PRICE') {
              parsedItem.price = currencyStringToNumber(data.ValueDetection?.Text ?? '0');
            }
          }
          expenseItems.push(parsedItem);
        }
      }
      for (const summary of document.SummaryFields ?? []) {
        if (summary.Type?.Text === 'SUBTOTAL') {
          const text = currencyStringToNumber(summary.ValueDetection?.Text ?? '0');
          const confidence = summary.Type.Confidence ?? 0;
          if (expenseSummary.subTotal.text === 0 && expenseSummary.subTotal.confidence === 0) {
            expenseSummary.subTotal.text = text;
            expenseSummary.subTotal.confidence = confidence;
          }
          if (
            confidence > expenseSummary.subTotal.confidence ||
            (confidence === expenseSummary.subTotal.confidence && text > expenseSummary.subTotal.text)
          ) {
            expenseSummary.subTotal.confidence = confidence;
            expenseSummary.subTotal.text = text;
          }
        } else if (summary.Type?.Text === 'TAX') {
          const text = currencyStringToNumber(summary.ValueDetection?.Text ?? '0');
          const confidence = summary.Type.Confidence ?? 0;
          if (expenseSummary.tax.text === 0 && expenseSummary.tax.confidence === 0) {
            expenseSummary.tax.text = text;
            expenseSummary.tax.confidence = confidence;
          }
          if (confidence > expenseSummary.tax.confidence || (confidence === expenseSummary.tax.confidence && text > expenseSummary.tax.text)) {
            expenseSummary.tax.confidence = confidence;
            expenseSummary.tax.text = text;
          }
        } else if (summary.Type?.Text === 'DISCOUNT') {
          const text = currencyStringToNumber(summary.ValueDetection?.Text ?? '0');
          const confidence = summary.Type.Confidence ?? 0;
          if (expenseSummary.discount.text === 0 && expenseSummary.discount.confidence === 0) {
            expenseSummary.discount.text = text;
            expenseSummary.discount.confidence = confidence;
          }
          if (
            confidence > expenseSummary.discount.confidence ||
            (confidence === expenseSummary.discount.confidence && text > expenseSummary.discount.text)
          ) {
            expenseSummary.discount.confidence = confidence;
            expenseSummary.discount.text = text;
          }
        } else if (summary.Type?.Text === 'SERVICE_CHARGE') {
          const text = currencyStringToNumber(summary.ValueDetection?.Text ?? '0');
          const confidence = summary.Type.Confidence ?? 0;
          if (expenseSummary.serviceCharge.text === 0 && expenseSummary.serviceCharge.confidence === 0) {
            expenseSummary.serviceCharge.text = text;
            expenseSummary.serviceCharge.confidence = confidence;
          }
          if (
            confidence > expenseSummary.serviceCharge.confidence ||
            (confidence === expenseSummary.serviceCharge.confidence && text > expenseSummary.serviceCharge.text)
          ) {
            expenseSummary.serviceCharge.confidence = confidence;
            expenseSummary.serviceCharge.text = text;
          }
        } else if (summary.Type?.Text === 'TOTAL') {
          const text = currencyStringToNumber(summary.ValueDetection?.Text ?? '0');
          const confidence = summary.Type.Confidence ?? 0;
          if (expenseSummary.total.text === 0 && expenseSummary.total.confidence === 0) {
            expenseSummary.total.text = text;
            expenseSummary.total.confidence = confidence;
          }
          if (confidence > expenseSummary.total.confidence || (confidence === expenseSummary.total.confidence && text > expenseSummary.total.text)) {
            expenseSummary.total.confidence = confidence;
            expenseSummary.total.text = text;
          }
        }
      }
    }
    return {
      items: expenseItems,
      summary: {
        subTotal: expenseSummary.subTotal.text,
        tax: expenseSummary.tax.text,
        discount: expenseSummary.discount.text,
        serviceCharge: expenseSummary.serviceCharge.text,
        total: expenseSummary.total.text,
      },
    };
  } catch (error) {
    throw new ApiError(httpStatus.SERVICE_UNAVAILABLE);
  }
};
