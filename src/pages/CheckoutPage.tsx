import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, ChevronRight, MapPin, CreditCard, Package, Phone, Shield } from 'lucide-react';
import { useSelector } from 'react-redux';
import { selectCartItems, selectCartTotal } from '../store/cartSlice';

const steps = [
  { id: 1, label: 'Login', icon: Phone },
  { id: 2, label: 'Address', icon: MapPin },
  { id: 3, label: 'Review', icon: Package },
  { id: 4, label: 'Payment', icon: CreditCard },
  { id: 5, label: 'Confirm', icon: Check },
];

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [address, setAddress] = useState({ name: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '' });
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [orderPlaced, setOrderPlaced] = useState(false);

  const items = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartTotal);
  const shipping = subtotal > 999 ? 0 : 99;
  const total = subtotal + shipping;

  const handleNextStep = () => {
    if (currentStep < 5) setCurrentStep(prev => prev + 1);
    if (currentStep === 4) setOrderPlaced(true);
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-cream-100 pt-24 flex items-center justify-center px-4">
        <div className="bg-white rounded-sm shadow-luxury-lg p-10 max-w-lg w-full text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
            <Check size={28} className="text-emerald-600" />
          </div>
          <h1 className="font-playfair text-3xl font-semibold text-navy-700 mb-3">Order Confirmed!</h1>
          <p className="font-inter text-sm text-gray-600 leading-relaxed mb-2">
            Your order <span className="font-semibold text-rosegold-500">#SV2025001</span> has been placed successfully.
          </p>
          <p className="font-inter text-sm text-gray-500 mb-8">
            A confirmation has been sent to your phone. Estimated delivery: 4-7 business days.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <Link to="/account/orders" className="btn-primary text-center text-xs">Track Order</Link>
            <Link to="/collections" className="border border-navy-700 text-navy-700 text-xs font-inter font-medium px-4 py-3 rounded-sm text-center hover:bg-navy-700 hover:text-white transition-colors">Continue Shopping</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-100 pt-24">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="font-playfair text-3xl font-semibold text-navy-700 mb-8">Checkout</h1>

        {/* Progress Steps */}
        <div className="flex items-center gap-2 mb-10 overflow-x-auto scrollbar-hide pb-2">
          {steps.map((step, i) => (
            <div key={step.id} className="flex items-center gap-2 flex-shrink-0">
              <div className={`flex items-center gap-2 ${currentStep === step.id ? 'text-rosegold-500' : currentStep > step.id ? 'text-emerald-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${currentStep === step.id ? 'border-rosegold-500 bg-rosegold-50' : currentStep > step.id ? 'border-emerald-500 bg-emerald-50' : 'border-gray-300'}`}>
                  {currentStep > step.id ? <Check size={14} /> : <step.icon size={14} />}
                </div>
                <span className="font-inter text-xs font-medium hidden sm:block">{step.label}</span>
              </div>
              {i < steps.length - 1 && (
                <ChevronRight size={14} className="text-gray-300 flex-shrink-0" />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-sm shadow-card p-6">
              {/* Step 1: Login */}
              {currentStep === 1 && (
                <div>
                  <h2 className="font-playfair text-xl font-semibold text-navy-700 mb-6">Login with OTP</h2>
                  <div className="max-w-sm">
                    {!otpSent ? (
                      <>
                        <label className="font-inter text-sm font-medium text-navy-700 block mb-2">Mobile Number</label>
                        <div className="flex gap-2 mb-4">
                          <span className="flex items-center px-3 bg-cream-100 border border-rosegold-200 rounded-sm text-sm font-inter text-gray-600">+91</span>
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
                          onClick={() => phone.length === 10 && setOtpSent(true)}
                          disabled={phone.length !== 10}
                          className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Send OTP
                        </button>
                      </>
                    ) : (
                      <>
                        <p className="font-inter text-sm text-gray-600 mb-4">OTP sent to +91 {phone}</p>
                        <label className="font-inter text-sm font-medium text-navy-700 block mb-2">Enter OTP</label>
                        <input
                          type="text"
                          maxLength={6}
                          value={otp}
                          onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                          placeholder="123456"
                          className="input-field mb-4"
                        />
                        <button onClick={handleNextStep} className="btn-primary w-full">
                          Verify & Continue
                        </button>
                        <button onClick={() => setOtpSent(false)} className="w-full text-sm font-inter text-rosegold-500 mt-3 hover:text-navy-700 transition-colors">
                          Change Number
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Step 2: Address */}
              {currentStep === 2 && (
                <div>
                  <h2 className="font-playfair text-xl font-semibold text-navy-700 mb-6">Delivery Address</h2>
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
                        <label className="font-inter text-xs font-medium text-gray-600 block mb-1.5">{field.label}</label>
                        <input
                          type="text"
                          value={address[field.key as keyof typeof address]}
                          onChange={e => setAddress({ ...address, [field.key]: e.target.value })}
                          placeholder={field.placeholder}
                          className="input-field"
                        />
                      </div>
                    ))}
                  </div>
                  <button onClick={handleNextStep} className="btn-primary mt-6">Save & Continue</button>
                </div>
              )}

              {/* Step 3: Review */}
              {currentStep === 3 && (
                <div>
                  <h2 className="font-playfair text-xl font-semibold text-navy-700 mb-6">Review Your Order</h2>
                  <div className="space-y-4 mb-6">
                    {items.map(item => (
                      <div key={`${item.product.id}-${item.size}`} className="flex gap-4 py-4 border-b border-rosegold-100">
                        <div className="w-16 h-20 bg-cream-200 rounded-sm overflow-hidden flex-shrink-0">
                          <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <p className="font-inter text-sm font-medium text-navy-700 leading-tight">{item.product.name}</p>
                          <p className="font-inter text-xs text-gray-500 mt-1">{item.color} · {item.size} · Qty: {item.quantity}</p>
                          <p className="font-playfair text-base font-semibold text-navy-700 mt-2">₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button onClick={handleNextStep} className="btn-primary">Proceed to Payment</button>
                </div>
              )}

              {/* Step 4: Payment */}
              {currentStep === 4 && (
                <div>
                  <h2 className="font-playfair text-xl font-semibold text-navy-700 mb-6">Payment</h2>
                  <div className="space-y-3 mb-6">
                    {[
                      { value: 'razorpay', label: 'Pay Online', desc: 'UPI, Cards, Net Banking — powered by Razorpay' },
                      { value: 'cod', label: 'Cash on Delivery', desc: '₹49 handling charge applies' },
                    ].map(method => (
                      <label key={method.value} className={`flex items-start gap-4 p-4 border-2 rounded-sm cursor-pointer transition-all ${paymentMethod === method.value ? 'border-rosegold-500 bg-rosegold-50' : 'border-gray-200 hover:border-rosegold-200'}`}>
                        <input
                          type="radio"
                          name="payment"
                          value={method.value}
                          checked={paymentMethod === method.value}
                          onChange={() => setPaymentMethod(method.value)}
                          className="mt-0.5 accent-rosegold-500"
                        />
                        <div>
                          <p className="font-inter text-sm font-semibold text-navy-700">{method.label}</p>
                          <p className="font-inter text-xs text-gray-500 mt-0.5">{method.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 text-xs font-inter text-gray-500 mb-6">
                    <Shield size={14} className="text-rosegold-500" />
                    Your payment information is secure and encrypted
                  </div>
                  <button onClick={handleNextStep} className="btn-rose w-full">
                    {paymentMethod === 'cod' ? 'Place Order (COD)' : 'Pay Now'}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-sm shadow-card p-5 sticky top-28">
              <h3 className="font-playfair text-lg font-semibold text-navy-700 mb-4">Order Summary</h3>
              <div className="space-y-3 mb-4 max-h-48 overflow-y-auto scrollbar-hide">
                {items.map(item => (
                  <div key={`${item.product.id}-${item.size}`} className="flex gap-3">
                    <div className="w-12 h-14 bg-cream-200 rounded-sm overflow-hidden flex-shrink-0">
                      <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-inter text-xs font-medium text-navy-700 line-clamp-2 leading-tight">{item.product.name}</p>
                      <p className="font-inter text-xs text-gray-500 mt-0.5">×{item.quantity}</p>
                    </div>
                    <p className="font-inter text-xs font-semibold text-navy-700 whitespace-nowrap">₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-2 pt-4 border-t border-rosegold-100 text-sm font-inter">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-navy-700">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className={shipping === 0 ? 'text-emerald-600' : 'text-navy-700'}>
                    {shipping === 0 ? 'FREE' : `₹${shipping}`}
                  </span>
                </div>
                <div className="flex justify-between font-playfair text-base font-semibold text-navy-700 pt-2 border-t border-rosegold-100">
                  <span>Total</span>
                  <span>₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
