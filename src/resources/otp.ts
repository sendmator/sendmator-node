import { HttpClient } from '../utils/http-client';
import {
  SendOTPRequest,
  VerifyOTPRequest,
  ResendOTPRequest,
  SendOTPResponse,
  VerifyOTPResponse,
} from '../types';

export class OTP {
  constructor(private http: HttpClient) {}

  async send(data: SendOTPRequest): Promise<SendOTPResponse> {
    if (!data.channels || data.channels.length === 0) {
      throw new Error('channels array is required and must not be empty');
    }
    if (!data.recipients || Object.keys(data.recipients).length === 0) {
      throw new Error('recipients object is required');
    }

    return this.http.post<SendOTPResponse>('/v1/otp/send', data);
  }

  async verify(data: VerifyOTPRequest): Promise<VerifyOTPResponse> {
    if (!data.session_token) throw new Error('session_token is required');
    if (!data.otps || Object.keys(data.otps).length === 0) {
      throw new Error('otps object is required with at least one channel');
    }

    return this.http.post<VerifyOTPResponse>('/v1/otp/verify', data);
  }

  async resend(data: ResendOTPRequest): Promise<SendOTPResponse> {
    if (!data.session_token) throw new Error('session_token is required');

    return this.http.post<SendOTPResponse>('/v1/otp/resend', data);
  }
}
