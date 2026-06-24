import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Check, ChevronRight, MapPin, CreditCard, Package, Phone, Shield } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { selectCartItems, selectCartTotal, clearCart } from '../store/cartSlice';
import { selectAppliedCoupon } from '../store/couponSlice';
import { setSession, selectAuth, selectIsUser } from '../store/authSlice';
import { saveAbandonedCart } from '../lib/storage';
import type { Order } from '../types';
import { useFormatPrice } from '../hooks/useFormatPrice';
import { mediaUrl } from '../lib/api';
import { sendOtp, verifyOtp, createOrder } from '../lib/api';
import { normalizeIndianMobile, validateIndianMobile } from '../lib/otpAuth';

const steps = [
  { id: 1, label: 'Login', icon: Phone },
  { id: 2, label: 'Address', icon: MapPin },
  { id: 3, label: 'Review', icon: Package },
  { id: 4, label: 'Payment', icon: CreditCard },
  { id: 5, label: 'Confirm', icon: Check },
];

export default function CheckoutPage() {
  const dispatch = useDispatch();
  const formatPrice = useFormatPrice();
  const [currentStep, setCurrentStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [otpSuccess, setOtpSuccess] = useState(false);
  const [address, setAddress] = useState({ name: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '' });
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod'>('razorpay');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');

  const items = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartTotal);
  const applied = useSelector(selectAppliedCoupon);
  const auth = useSelector(selectAuth);
  const isUser = useSelector(selectIsUser);

  const discount = applied.discount;
  const shipping = subtotal > 999 ? 0 : 99;
  const codFee = paymentMethod === 'cod' ? 49 : 0;
  const total = subtotal - discount + shipping + codFee;

  useEffect(() => {
    if (isUser && currentStep === 1) setCurrentStep(2);
  }, [isUser]);

  useEffect(() => {
    return () => {
      if (items.length > 0 && !orderPlaced) saveAbandonedCart(items);
    };
  }, [items, orderPlaced]);

  const handleSendOtp = async () => {
    if (!validateIndianMobile(phone)) return;
    try {
      await sendOtp(phone);
      setOtpSent(true);
      setOtpError('');
    } catch (err) {
      setOtpError(err instanceof Error ? err.message : 'Failed to send OTP');
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      setOtpError('Please enter a 6-digit OTP');
      return;
    }
    try {
      const { token, user } = await verifyOtp(phone, otp);
      setOtpError('');
      setOtpSuccess(true);
      dispatch(setSession({ token, user }));
      setTimeout(() => {
        setCurrentStep(2);
        setOtpSuccess(false);
      }, 800);
    } catch {
      setOtpError('Invalid OTP. Use 123456 for demo.');
    }
  };

  const handlePlaceOrder = async () => {
    const id = `SV${Date.now().toString().slice(-8)}`;
    const order: Order = {
      id,
      date: new Date().toISOString().split('T')[0],
      status: 'placed',
      items: [...items],
      subtotal,
      discount,
      shipping,
      codFee,
      total,
      paymentMethod,
      couponCode: applied.appliedCode || undefined,
      phone: auth.user?.phone || phone,
      trackingNumber: `TRK${Date.now().toString().slice(-10)}`,
      address: {
        id: '1',
        name: address.name,
        phone: address.phone || phone,
        line1: address.line1,
        line2: address.line2,
        city: address.city,
        state: address.state,
        pincode: address.pincode,
        isDefault: true,
      },
    };
    try {
      await createOrder(order);
    } catch (err) {
      console.error('Order creation failed:', err);
    }
    dispatch(clearCart());
    setOrderId(id);
    setOrderPlaced(true);
  };

  const handleNextStep = () => {
    if (currentStep === 4) {
      handlePlaceOrder();
      return;
    }
    if (currentStep < 5) setCurrentStep(prev => prev + 1);
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-cream-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-sm shadow-luxury-lg p-10 max-w-lg w-full text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6"><Check size={28} className="text-emerald-600" /></div>
          <h1 className="font-heading text-3xl font-semibold text-navy-700 mb-3">Order Confirmed!</h1>
          <p className="font-body text-sm text-gray-600 leading-relaxed mb-2">Your order <span className="font-semibold text-rosegold-500">#{orderId}</span> has been placed successfully.</p>
          <p className="font-body text-sm text-gray-500 mb-8">A confirmation has been sent to +91 {auth.user?.phone || phone}. Estimated delivery: 4-7 business days.</p>
          <div className="grid grid-cols-2 gap-3">
            <Link to="/account/orders" className="btn-primary text-center text-xs">Track Order</Link>
            <Link to="/collections" className="border border-navy-700 text-navy-700 text-xs font-body font-medium px-4 py-3 rounded-sm text-center hover:bg-navy-700 hover:text-white transition-colors">Continue Shopping</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-100">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="font-heading text-3xl font-semibold text-navy-700 mb-8">Checkout</h1>

        {isUser && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-sm px-4 py-3 mb-6 text-sm font-body text-emerald-700">
            Logged in as +91 {auth.user?.phone}
          </div>
        )}

        <div className="flex items-center gap-2 mb-10 overflow-x-auto scrollbar-hide pb-2">
          {steps.map((step, i) => (
            <div key={step.id} className="flex items-center gap-2 flex-shrink-0">
              <div className={`flex items-center gap-2 ${currentStep === step.id ? 'text-rosegold-500' : currentStep > step.id ? 'text-emerald-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${currentStep === step.id ? 'border-rosegold-500 bg-rosegold-50' : currentStep > step.id ? 'border-emerald-500 bg-emerald-50' : 'border-gray-300'}`}>
                  {currentStep > step.id ? <Check size={14} /> : <step.icon size={14} />}
                </div>
                <span className="font-body text-xs font-medium hidden sm:block">{step.label}</span>
              </div>
              {i < steps.length - 1 && <ChevronRight size={14} className="text-gray-300 flex-shrink-0" />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-sm shadow-card p-6">
              {currentStep === 1 && (
                <div>
                  <h2 className="font-heading text-xl font-semibold text-navy-700 mb-6">Login with OTP</h2>
                  <div className="max-w-sm">
                    {!otpSent ? (
                      <>
                        <label className="font-body text-sm font-medium text-navy-700 block mb-2">Mobile Number</label>
                        <div className="flex gap-2 mb-4">
                          <span className="flex items-center px-3 bg-cream-100 border border-rosegold-200 rounded-sm text-sm font-body text-gray-600">+91</span>
                          <input type="tel" maxLength={10} value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, ''))} placeholder="9876543210" className="input-field flex-1" />
                        </div>
                        <button onClick={handleSendOtp} disabled={!validateIndianMobile(phone)} className="btn-primary w-full disabled:opacity-50">Send OTP</button>
                        <p className="text-xs text-gray-400 mt-2">Demo: any 10-digit number, OTP is 123456</p>
                      </>
                    ) : (
                      <>
                        <p className="font-body text-sm text-gray-600 mb-4">OTP sent to +91 {phone}</p>
                        <label className="font-body text-sm font-medium text-navy-700 block mb-2">Enter OTP</label>
                        <input type="text" maxLength={6} value={otp} onChange={e => { setOtp(e.target.value.replace(/\D/g, '')); setOtpError(''); }} placeholder="123456" className="input-field mb-2" />
                        {otpError && <p className="text-xs text-red-500 mb-2">{otpError}</p>}
                        {otpSuccess && <p className="text-xs text-emerald-600 mb-2">✓ Verified successfully!</p>}
                        <button onClick={handleVerifyOtp} className="btn-primary w-full">Verify & Continue</button>
                        <button onClick={() => setOtpSent(false)} className="w-full text-sm font-body text-rosegold-500 mt-3 hover:text-navy-700">Change Number</button>
                      </>
                    )}
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div>
                  <h2 className="font-heading text-xl font-semibold text-navy-700 mb-6">Delivery Address</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { key: 'name', label: 'Full Name', placeholder: 'Priya Sharma', col: 2 },
                      { key: 'phone', label: 'Phone Number', placeholder: '9876543210', col: 1 },
                      { key: 'line1', label: 'Address Line 1', placeholder: '123, Rose Garden Apartment', col: 2 },
                      { key: 'line2', label: 'Address Line 2 (Optional)', placeholder: 'Near City Mall', col: 2 },
                      { key: 'city', label: 'City', placeholder: 'Mumbai', col: 1 },
                      { key: 'state', label: 'State', placeholder: 'Maharashtra', col: 1 },
                      { key: 'pincode', label: 'Pincode', placeholder: '400001', col: 1 },
                    ].map(field => (
                      <div key={field.key} className={field.col === 2 ? 'sm:col-span-2' : ''}>
                        <label className="font-body text-xs font-medium text-gray-600 block mb-1.5">{field.label}</label>
                        <input type="text" value={address[field.key as keyof typeof address]} onChange={e => setAddress({ ...address, [field.key]: e.target.value })} placeholder={field.placeholder} className="input-field" />
                      </div>
                    ))}
                  </div>
                  <button onClick={handleNextStep} className="btn-primary mt-6">Save & Continue</button>
                </div>
              )}

              {currentStep === 3 && (
                <div>
                  <h2 className="font-heading text-xl font-semibold text-navy-700 mb-6">Review Your Order</h2>
                  <div className="space-y-4 mb-6">
                    {items.map(item => (
                      <div key={`${item.product.id}-${item.size}`} className="flex gap-4 py-4 border-b border-rosegold-100">
                        <div className="w-16 h-20 bg-cream-200 rounded-sm overflow-hidden flex-shrink-0">
                          <img src={mediaUrl(item.product.images[0])} alt={item.product.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <p className="font-body text-sm font-medium text-navy-700">{item.product.name}</p>
                          <p className="font-body text-xs text-gray-500 mt-1">{item.color} · {item.size} · Qty: {item.quantity}</p>
                          <p className="font-heading text-base font-semibold text-navy-700 mt-2">{formatPrice(item.product.price * item.quantity)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button onClick={handleNextStep} className="btn-primary">Proceed to Payment</button>
                </div>
              )}

              {currentStep === 4 && (
                <div>
                  <h2 className="font-heading text-xl font-semibold text-navy-700 mb-6">Payment</h2>
                  <div className="space-y-3 mb-6">
                    {[
                      { value: 'razorpay' as const, label: 'Pay Online', desc: 'UPI, Cards, Net Banking — powered by Razorpay' },
                      { value: 'cod' as const, label: 'Cash on Delivery', desc: `${formatPrice(49)} handling charge applies` },
                    ].map(method => (
                      <label key={method.value} className={`flex items-start gap-4 p-4 border-2 rounded-sm cursor-pointer transition-all ${paymentMethod === method.value ? 'border-rosegold-500 bg-rosegold-50' : 'border-gray-200 hover:border-rosegold-200'}`}>
                        <input type="radio" name="payment" value={method.value} checked={paymentMethod === method.value} onChange={() => setPaymentMethod(method.value)} className="mt-0.5 accent-rosegold-500" />
                        <div>
                          <p className="font-body text-sm font-semibold text-navy-700">{method.label}</p>
                          <p className="font-body text-xs text-gray-500 mt-0.5">{method.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 text-xs font-body text-gray-500 mb-6"><Shield size={14} className="text-rosegold-500" />Your payment information is secure and encrypted</div>
                  <button onClick={handleNextStep} className="btn-rose w-full">{paymentMethod === 'cod' ? 'Place Order (COD)' : 'Pay Now'}</button>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-sm shadow-card p-5 sticky top-28">
              <h3 className="font-heading text-lg font-semibold text-navy-700 mb-4">Order Summary</h3>
              <div className="space-y-2 pt-2 text-sm font-body">
                <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span>{formatPrice(subtotal)}</span></div>
                {discount > 0 && <div className="flex justify-between"><span className="text-emerald-600">Coupon ({applied.appliedCode})</span><span className="text-emerald-600">−{formatPrice(discount)}</span></div>}
                <div className="flex justify-between"><span className="text-gray-600">Shipping</span><span className={shipping === 0 ? 'text-emerald-600' : ''}>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span></div>
                {codFee > 0 && <div className="flex justify-between"><span className="text-gray-600">COD Fee</span><span>{formatPrice(codFee)}</span></div>}
                <div className="flex justify-between font-heading text-base font-semibold text-navy-700 pt-2 border-t border-rosegold-100"><span>Total</span><span>{formatPrice(total)}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
