export const MOCK_OTP = '123456';

export function normalizeIndianMobile(input: string): string {
  return input.replace(/\D/g, '').slice(-10);
}

export function validateIndianMobile(phone: string): boolean {
  return /^[6-9]\d{9}$/.test(normalizeIndianMobile(phone));
}

export function sendOtpMock(_phone: string): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, 600));
}

export function verifyOtpMock(otp: string): boolean {
  return otp.replace(/\D/g, '') === MOCK_OTP;
}
