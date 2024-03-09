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
  value: number;
  confidence: number;
}

interface ISummary {
  subtotal: ISummaryKey;
  tax: ISummaryKey;
  discount: ISummaryKey;
  serviceCharge: ISummaryKey;
  total: ISummaryKey;
}

const summaryTypeToPropertyKey = {
  SUBTOTAL: 'subtotal',
  TAX: 'tax',
  DISCOUNT: 'discount',
  SERVICE_CHARGE: 'serviceCharge',
  TOTAL: 'total',
};

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
      subtotal: {
        value: 0,
        confidence: 0,
      },
      tax: {
        value: 0,
        confidence: 0,
      },
      discount: {
        value: 0,
        confidence: 0,
      },
      serviceCharge: {
        value: 0,
        confidence: 0,
      },
      total: {
        value: 0,
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
        const type = (summary.Type?.Text ?? '') as keyof typeof summaryTypeToPropertyKey;
        if (Object.keys(summaryTypeToPropertyKey).includes(type)) {
          const text = currencyStringToNumber(summary.ValueDetection?.Text ?? '0');
          const confidence = summary.Type?.Confidence ?? 0;
          const propertyKey = summaryTypeToPropertyKey[type] as keyof typeof expenseSummary;
          if (expenseSummary[propertyKey].value === 0 && expenseSummary[propertyKey].confidence === 0) {
            expenseSummary[propertyKey].value = text;
            expenseSummary[propertyKey].confidence = confidence;
          }
          if (
            confidence > expenseSummary[propertyKey].confidence ||
            (confidence === expenseSummary[propertyKey].confidence && text > expenseSummary[propertyKey].value)
          ) {
            expenseSummary[propertyKey].confidence = confidence;
            expenseSummary[propertyKey].value = text;
          }
        }
      }
    }
    return {
      items: expenseItems,
      summary: {
        subtotal: expenseSummary.subtotal.value,
        tax: expenseSummary.tax.value,
        discount: expenseSummary.discount.value,
        serviceCharge: expenseSummary.serviceCharge.value,
        total: expenseSummary.total.value,
      },
    };
  } catch (error) {
    throw new ApiError(httpStatus.SERVICE_UNAVAILABLE);
  }
};
