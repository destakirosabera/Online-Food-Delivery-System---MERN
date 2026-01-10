
import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrderContext';
import { useToast } from '../context/ToastContext';
import { formatPrice } from '../utils/formatPrice';
import Button from '../components/common/Button';
import BackButton from '../components/common/BackButton';

interface Props {
  onNavigate: (page: any) => void;
  onBack: () => void;
}

const PaymentPage: React.FC<Props> = ({ onNavigate, onBack }) => {
  const { cart, clearCart } = useCart();
  const { placeOrder } = useOrders();
  const { showToast } = useToast();
  
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [deliveryLocation, setDeliveryLocation] = useState<string>('');
  const [receiptBase64, setReceiptBase64] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const deliveryFee = 50; // Standard flat logistics fee
  const total = subtotal + deliveryFee;

  const bankOptions = [
    { id: 'cbe', name: 'Commercial Bank of Ethiopia (CBE)', account: '1000123456789' },
    { id: 'boa', name: 'Bank of Abyssinia', account: '88776655' },
    { id: 'telebirr', name: 'Telebirr', account: '0911223344' }
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFinalizeOrder = async () => {
    if (!deliveryLocation.trim()) {
      showToast('Logistics Alert: Destination address is mandatory', 'error');
      return;
    }
    if (!paymentMethod) {
      showToast('Logistics Alert: Select a valid payment node', 'error');
      return;
    }
    if (!receiptBase64) {
      showToast('Logistics Alert: Transaction proof required', 'error');
      return;
    }

    setLoading(true);
    try {
      const orderPayload = {
        orderItems: cart.map(item => ({
          name: item.name,
          qty: item.qty,
          price: item.price,
          food: item.foodId,
          config: {
            selectedSize: item.selectedSize,
            selectedSauce: item.selectedSauce,
            modifiers: item.modifiers,
            notes: item.notes
          }
        })),
        totalPrice: total,
        deliveryLocation: deliveryLocation,
        deliveryFee: deliveryFee,
        paymentMethod: paymentMethod,
        paymentReceipt: receiptBase64
      };

      await placeOrder(orderPayload);
      clearCart();
      showToast('Transmission Received. Logistics team alerted.', 'success');
      onNavigate('tracker');
    } catch (err) {
      showToast('Critical Sync Failure. Try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-24 relative bg-white dark:bg-ino-dark transition-colors duration-300 min-h-screen">
      <BackButton onClick={onBack} />
      
      <div className="mb-12 text-center pl-14 md:pl-0">
        <h1 className="text-4xl font-black text-admas-blue dark:text-white uppercase tracking-tighter">Settlement & Logistics</h1>
        <p className="text-gray-500 mt-2 font-medium uppercase text-[10px] tracking-widest">Authorized Transmission Only</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          {/* DELIVERY LOCATION MODULE */}
          <div className="bg-gray-50 dark:bg-gray-900/50 p-8 rounded-[3rem] border border-gray-100 dark:border-gray-800">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-ino-red mb-6 flex items-center gap-2">
              <i className="ph-fill ph-map-pin"></i> 1. Destination Address
            </h3>
            <div className="space-y-4">
              <label className="text-[9px] font-black text-gray-400 uppercase ml-4">Exact Location Details</label>
              <textarea 
                value={deliveryLocation}
                onChange={(e) => setDeliveryLocation(e.target.value)}
                placeholder="Enter Sector, Street Name, House No, or Building Name..."
                className="w-full p-6 bg-white dark:bg-gray-800 border-2 border-transparent focus:border-ino-red rounded-3xl text-xs font-bold outline-none transition-all resize-none h-32"
                required
              />
            </div>
          </div>

          {/* PAYMENT METHOD MODULE */}
          <div className="bg-gray-50 dark:bg-gray-900/50 p-8 rounded-[3rem] border border-gray-100 dark:border-gray-800">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-ino-red mb-6 flex items-center gap-2">
              <i className="ph-fill ph-bank"></i> 2. Settlement Method
            </h3>
            <div className="space-y-3">
              {bankOptions.map((bank) => (
                <label 
                  key={bank.id}
                  className={`flex items-center justify-between p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                    paymentMethod === bank.name 
                    ? 'border-ino-red bg-red-50 dark:bg-red-900/10' 
                    : 'border-white dark:border-gray-800 bg-white dark:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <input type="radio" name="payment" className="hidden" onChange={() => setPaymentMethod(bank.name)} />
                    <div>
                      <p className="text-[11px] font-black text-gray-900 dark:text-white uppercase">{bank.name}</p>
                      <p className="text-[9px] text-gray-500 font-mono mt-0.5">#{bank.account}</p>
                    </div>
                  </div>
                  {paymentMethod === bank.name && <i className="ph-fill ph-check-circle text-ino-red text-xl"></i>}
                </label>
              ))}
            </div>
          </div>

          {/* RECEIPT UPLOAD MODULE */}
          <div className="bg-gray-50 dark:bg-gray-900/50 p-8 rounded-[3rem] border border-gray-100 dark:border-gray-800">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-ino-red mb-6 flex items-center gap-2">
              <i className="ph-fill ph-upload-simple"></i> 3. Upload Receipt
            </h3>
            <div className="relative group">
              <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
              <div className={`w-full py-12 border-2 border-dashed rounded-[2.5rem] flex flex-col items-center justify-center transition-all ${
                receiptBase64 ? 'border-green-500 bg-green-50 dark:bg-green-900/10' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
              }`}>
                {receiptBase64 ? (
                  <div className="text-center">
                    <i className="ph-fill ph-file-image text-4xl text-green-500 mb-2"></i>
                    <p className="text-[10px] font-black text-green-600 uppercase">Verification File Staged</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <i className="ph ph-camera text-4xl text-gray-300 mb-2"></i>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-8">Snap and upload your bank transfer receipt</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* SIDEBAR SUMMARY */}
        <div className="lg:sticky lg:top-24 h-fit">
          <div className="bg-ino-dark text-white p-10 rounded-[4rem] shadow-2xl border border-white/5">
            <h2 className="text-xl font-black mb-8 text-ino-yellow flex items-center gap-3 uppercase">
              <i className="ph-fill ph-receipt"></i> Order Summary
            </h2>
            <div className="space-y-5 mb-10 pb-10 border-b border-white/5">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400 font-bold uppercase tracking-widest">Tray Subtotal</span>
                <span className="font-black text-white">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400 font-bold uppercase tracking-widest">Logistics Fee</span>
                <span className="font-black text-ino-yellow">{formatPrice(deliveryFee)}</span>
              </div>
            </div>
            <div className="flex justify-between items-end mb-12">
              <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Final Liability</span>
              <span className="text-5xl font-black text-white leading-none tracking-tighter">{formatPrice(total)}</span>
            </div>

            <Button 
              onClick={handleFinalizeOrder} 
              loading={loading}
              className="w-full py-6 rounded-3xl text-sm bg-ino-red hover:bg-red-700 shadow-3xl uppercase tracking-widest font-black"
            >
              Authorize Dispatch
            </Button>
            
            <p className="mt-8 text-[9px] text-gray-600 text-center leading-relaxed font-bold uppercase tracking-tight">
              A dispatcher will verify your receipt before your payload enters the 'Preparing' state.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
