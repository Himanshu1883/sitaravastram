import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Check, MapPin, CreditCard, Package, Phone } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { selectCartItems, selectCartTotal, clearCart } from '../store/cartSlice';
import { selectAppliedCoupon } from '../store/couponSlice';
import { setSession, selectAuth, selectIsUser, updateUser } from '../store/authSlice';
import { saveAbandonedCart } from '../lib/storage';
import type { Order } from '../types';
import { useFormatPrice } from '../hooks/useFormatPrice';
import { mediaUrl, sendOtp, verifyOtp, createOrder, fetchOrders, updateProfile } from '../lib/api';
import { validateIndianMobile } from '../lib/otpAuth';
import { emptyCheckoutAddress, type CheckoutAddress } from '../lib/checkout/types';
import {
  validateCheckoutAddress,
  type AddressFieldErrors,
} from '../lib/checkout/validateAddress';
import CheckoutStepper, { type CheckoutStep } from '../components/checkout/CheckoutStepper';
import CheckoutAddressForm from '../components/checkout/CheckoutAddressForm';
import CheckoutPaymentStep from '../components/checkout/CheckoutPaymentStep';
import CheckoutOrderSummary from '../components/checkout/CheckoutOrderSummary';

const steps: CheckoutStep[] = [
  { id: 1, labelKey: 'checkout.stepLogin', icon: Phone },
  { id: 2, labelKey: 'checkout.stepAddress', icon: MapPin },
  { id: 3, labelKey: 'checkout.stepReview', icon: Package },
  { id: 4, labelKey: 'checkout.stepPayment', icon: CreditCard },
];

export default function CheckoutPage() {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const formatPrice = useFormatPrice();
  const [currentStep, setCurrentStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [otpSuccess, setOtpSuccess] = useState(false);
  const [address, setAddress] = useState<CheckoutAddress>(emptyCheckoutAddress);
  const [addressErrors, setAddressErrors] = useState<AddressFieldErrors>({});
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod'>('razorpay');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [orderEmail, setOrderEmail] = useState('');

  const items = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartTotal);
  const applied = useSelector(selectAppliedCoupon);
  const auth = useSelector(selectAuth);
  const isUser = useSelector(selectIsUser);

  const discount = applied.discount;
  const shipping = subtotal > 999 ? 0 : 99;
  const codFee = paymentMethod === 'cod' ? 49 : 0;
  const total = subtotal - discount + shipping + codFee;

  const validationMessages = useCallback(
    () => ({
      nameRequired: t('checkout.nameRequired'),
      emailRequired: t('checkout.emailRequired'),
      emailInvalid: t('checkout.emailInvalid'),
      phoneRequired: t('checkout.phoneRequired'),
      phoneInvalid: t('checkout.phoneInvalid'),
      line1Required: t('checkout.line1Required'),
      stateRequired: t('checkout.stateRequired'),
      cityRequired: t('checkout.cityRequired'),
      pincodeRequired: t('checkout.pincodeRequired'),
      pincodeInvalid: t('checkout.pincodeInvalid'),
      countryRequired: t('checkout.countryRequired'),
    }),
    [t],
  );

  useEffect(() => {
    if (isUser && currentStep === 1) setCurrentStep(2);
  }, [isUser, currentStep]);

  useEffect(() => {
    return () => {
      if (items.length > 0 && !orderPlaced) saveAbandonedCart(items);
    };
  }, [items, orderPlaced]);

  useEffect(() => {
    setAddress(prev => ({
      ...prev,
      name: prev.name || auth.user?.name || '',
      email: prev.email || auth.user?.email || '',
      phone: prev.phone || auth.user?.phone || phone || '',
    }));
  }, [auth.user, phone]);

  useEffect(() => {
    if (!isUser) return;
    fetchOrders()
      .then(orders => {
        const last = orders[0]?.address;
        if (!last) return;
        setAddress(prev => ({
          ...prev,
          name: prev.name || last.name,
          phone: prev.phone || last.phone,
          line1: prev.line1 || last.line1,
          line2: prev.line2 || last.line2 || '',
          city: prev.city || last.city,
          state: prev.state || last.state,
          pincode: prev.pincode || last.pincode,
          countryCode: prev.countryCode || last.country || 'IN',
        }));
      })
      .catch(() => undefined);
  }, [isUser]);

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
      setOtpError(t('checkout.otpLength'));
      return;
    }
    try {
      const { token, user } = await verifyOtp(phone, otp);
      setOtpError('');
      setOtpSuccess(true);
      dispatch(setSession({ token, user }));
      setAddress(prev => ({ ...prev, phone: prev.phone || user.phone || phone }));
      setTimeout(() => {
        setCurrentStep(2);
        setOtpSuccess(false);
      }, 800);
    } catch {
      setOtpError(t('checkout.otpInvalid'));
    }
  };

  const handleAddressSubmit = () => {
    const errors = validateCheckoutAddress(address, validationMessages());
    setAddressErrors(errors);
    if (Object.keys(errors).length > 0) return;
    setCurrentStep(3);
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
      email: address.email.trim(),
      phone: auth.user?.phone || address.phone || phone,
      trackingNumber: `TRK${Date.now().toString().slice(-10)}`,
      address: {
        id: '1',
        name: address.name.trim(),
        phone: address.phone || phone,
        line1: address.line1.trim(),
        line2: address.line2.trim() || undefined,
        city: address.city.trim(),
        state: address.state.trim(),
        pincode: address.pincode.trim(),
        country: address.countryCode,
        isDefault: true,
      },
    };

    try {
      await createOrder(order);
      if (isUser && address.email.trim()) {
        try {
          const { user } = await updateProfile({
            name: address.name.trim(),
            email: address.email.trim(),
          });
          dispatch(updateUser(user));
        } catch {
          // non-blocking
        }
      }
    } catch (err) {
      console.error('Order creation failed:', err);
    }

    dispatch(clearCart());
    setOrderId(id);
    setOrderEmail(address.email.trim());
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
      <div className="flex min-h-screen items-center justify-center bg-[#faf8f5] px-4">
        <div className="w-full max-w-lg rounded-2xl border border-rosegold-100/70 bg-white p-10 text-center shadow-[0_10px_36px_rgba(27,42,74,0.08)]">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
            <Check size={28} className="text-emerald-600" />
          </div>
          <h1 className="mb-3 font-heading text-3xl font-semibold text-navy-700">
            {t('checkout.orderConfirmed')}
          </h1>
          <p className="mb-2 font-body text-sm leading-relaxed text-gray-600">
            {t('checkout.orderConfirmedDetail', { id: orderId })}
          </p>
          <p className="mb-8 font-body text-sm text-gray-500">
            {t('checkout.confirmationSent', {
              email: orderEmail,
              phone: auth.user?.phone || phone,
            })}
          </p>
          <div className="grid grid-cols-2 gap-3">
            <Link to="/account/orders" className="btn-primary text-center text-xs">
              {t('checkout.trackOrder')}
            </Link>
            <Link to="/collections" className="btn-outline-navy text-xs">
              {t('checkout.continueShopping')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <div className="mx-auto max-w-screen-xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="mb-8 font-heading text-3xl font-semibold text-navy-700">
          {t('checkout.title')}
        </h1>

        {isUser && (
          <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 font-body text-sm text-emerald-700">
            {t('checkout.loggedInAs', { phone: auth.user?.phone })}
          </div>
        )}

        <CheckoutStepper steps={steps} currentStep={currentStep} />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-rosegold-100/70 bg-white p-6 shadow-[0_10px_36px_rgba(27,42,74,0.05)] sm:p-8">
              {currentStep === 1 && (
                <div>
                  <h2 className="mb-6 font-heading text-xl font-semibold text-navy-700">
                    {t('checkout.loginOtp')}
                  </h2>
                  <div className="max-w-sm">
                    {!otpSent ? (
                      <>
                        <label className="mb-2 block font-body text-sm font-medium text-navy-700">
                          {t('checkout.phone')}
                        </label>
                        <div className="mb-4 flex gap-2">
                          <span className="flex items-center rounded-sm border border-rosegold-200 bg-cream-100 px-3 font-body text-sm text-gray-600">
                            +91
                          </span>
                          <input
                            type="tel"
                            maxLength={10}
                            value={phone}
                            onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                            placeholder="9876543210"
                            className="input-field flex-1"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={handleSendOtp}
                          disabled={!validateIndianMobile(phone)}
                          className="btn-primary w-full disabled:opacity-50"
                        >
                          {t('checkout.sendOtp')}
                        </button>
                        <p className="mt-2 font-body text-xs text-gray-400">{t('checkout.otpDemo')}</p>
                      </>
                    ) : (
                      <>
                        <p className="mb-4 font-body text-sm text-gray-600">
                          {t('checkout.otpSent', { phone })}
                        </p>
                        <label className="mb-2 block font-body text-sm font-medium text-navy-700">
                          {t('checkout.enterOtp')}
                        </label>
                        <input
                          type="text"
                          maxLength={6}
                          value={otp}
                          onChange={e => {
                            setOtp(e.target.value.replace(/\D/g, ''));
                            setOtpError('');
                          }}
                          placeholder="123456"
                          className="input-field mb-2"
                        />
                        {otpError && <p className="mb-2 text-xs text-red-500">{otpError}</p>}
                        {otpSuccess && (
                          <p className="mb-2 text-xs text-emerald-600">{t('checkout.otpVerified')}</p>
                        )}
                        <button type="button" onClick={handleVerifyOtp} className="btn-primary w-full">
                          {t('checkout.verifyContinue')}
                        </button>
                        <button
                          type="button"
                          onClick={() => setOtpSent(false)}
                          className="mt-3 w-full font-body text-sm text-rosegold-500 hover:text-navy-700"
                        >
                          {t('checkout.changeNumber')}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <CheckoutAddressForm
                  address={address}
                  errors={addressErrors}
                  onChange={setAddress}
                  onSubmit={handleAddressSubmit}
                />
              )}

              {currentStep === 3 && (
                <div>
                  <h2 className="mb-6 font-heading text-xl font-semibold text-navy-700">
                    {t('checkout.reviewOrder')}
                  </h2>
                  <div className="mb-6 space-y-4">
                    {items.map(item => (
                      <div
                        key={`${item.product.id}-${item.size}`}
                        className="flex gap-4 border-b border-rosegold-100 py-4"
                      >
                        <div className="h-20 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-cream-100">
                          <img
                            src={mediaUrl(item.product.images[0])}
                            alt={item.product.name}
                            className="h-full w-full object-cover object-top"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-body text-sm font-medium text-navy-700">
                            {item.product.name}
                          </p>
                          <p className="mt-1 font-body text-xs text-gray-500">
                            {item.color} · {item.size} · Qty: {item.quantity}
                          </p>
                          <p className="mt-2 font-heading text-base font-semibold text-navy-700">
                            {formatPrice(item.product.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mb-6 rounded-xl border border-rosegold-100 bg-cream-50/50 p-4 text-sm">
                    <p className="font-semibold text-navy-700">{address.name}</p>
                    <p className="mt-1 text-gray-600">{address.email}</p>
                    <p className="mt-1 text-gray-600">
                      {address.line1}
                      {address.line2 ? `, ${address.line2}` : ''}, {address.city}, {address.state}{' '}
                      {address.pincode}
                    </p>
                  </div>
                  <button type="button" onClick={handleNextStep} className="btn-primary">
                    {t('checkout.proceedPayment')}
                  </button>
                </div>
              )}

              {currentStep === 4 && (
                <CheckoutPaymentStep
                  paymentMethod={paymentMethod}
                  codFeeLabel={formatPrice(49)}
                  onChange={setPaymentMethod}
                  onSubmit={handleNextStep}
                />
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <CheckoutOrderSummary
              items={items}
              subtotal={subtotal}
              discount={discount}
              appliedCode={applied.appliedCode}
              shipping={shipping}
              codFee={codFee}
              total={total}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
