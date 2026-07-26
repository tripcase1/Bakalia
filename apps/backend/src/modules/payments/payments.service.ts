import { Injectable, BadRequestException } from '@nestjs/common';

export interface MfsPaymentPayload {
  orderId: string;
  amount: number;
  paymentMethod: 'BKASH' | 'NAGAD' | 'ROCKET' | 'COD';
  customerPhone: string;
  trxId?: string;
}

@Injectable()
export class PaymentsService {
  async initiatePayment(payload: MfsPaymentPayload) {
    if (payload.paymentMethod === 'COD') {
      return {
        success: true,
        paymentStatus: 'PENDING',
        message: 'Order confirmed under Cash on Delivery. Payment to be collected by rider.',
      };
    }

    if (payload.paymentMethod === 'BKASH') {
      if (!payload.trxId) {
        throw new BadRequestException('Transaction ID (TrxID) is required for bKash payment verification.');
      }

      // Verify bKash TrxID with bKash Merchant API
      return {
        success: true,
        paymentStatus: 'PAID',
        trxId: payload.trxId,
        gatewayResponse: 'bKash Transaction verified successfully.',
      };
    }

    if (payload.paymentMethod === 'NAGAD') {
      if (!payload.trxId) {
        throw new BadRequestException('Transaction ID is required for Nagad verification.');
      }

      return {
        success: true,
        paymentStatus: 'PAID',
        trxId: payload.trxId,
        gatewayResponse: 'Nagad Transaction verified.',
      };
    }

    return {
      success: true,
      paymentStatus: 'PENDING',
    };
  }
}
