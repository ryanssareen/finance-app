import React, { useState, useRef } from 'react';
import { Upload, Camera, FileText, X, Check, Loader } from 'lucide-react';

export default function ReceiptScanner({ onReceiptProcessed, isDark }) {
  const [receiptImage, setReceiptImage] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Create preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setReceiptImage(event.target.result);
      processReceipt(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const processReceipt = async (imageData) => {
    setProcessing(true);
    
    // Simulate OCR processing - In production, you'd use Tesseract.js or a backend OCR service
    setTimeout(() => {
      // Mock extracted data
      const mockData = {
        merchant: 'Sample Store',
        date: new Date().toISOString().split('T')[0],
        total: (Math.random() * 100 + 10).toFixed(2),
        items: [
          { name: 'Item 1', price: '15.99' },
          { name: 'Item 2', price: '24.99' },
          { name: 'Item 3', price: '8.50' }
        ],
        category: 'shopping',
        paymentMethod: 'Credit Card'
      };
      
      setExtractedData(mockData);
      setProcessing(false);
    }, 2000);
  };

  const handleConfirm = () => {
    if (extractedData) {
      onReceiptProcessed({
        receiptImage,
        extractedData
      });
      // Reset
      setReceiptImage(null);
      setExtractedData(null);
    }
  };

  const handleCancel = () => {
    setReceiptImage(null);
    setExtractedData(null);
    setProcessing(false);
  };

  return (
    <div className={`rounded-xl border-2 border-dashed p-6 ${
      isDark ? 'border-gray-600 bg-gray-800/50' : 'border-gray-300 bg-gray-50'
    }`}>
      {!receiptImage ? (
        <div className="text-center">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          
          <Upload className={`w-12 h-12 mx-auto mb-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
          
          <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Upload Receipt
          </h3>
          <p className={`mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Take a photo or upload an image of your receipt
          </p>
          
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => fileInputRef.current.click()}
              className="px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Choose File
            </button>
            <button
              onClick={() => fileInputRef.current.click()}
              className={`px-6 py-3 rounded-lg border transition-all flex items-center gap-2 ${
                isDark 
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Camera className="w-4 h-4" />
              Take Photo
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {processing ? 'Processing Receipt...' : 'Receipt Details'}
            </h3>
            <button
              onClick={handleCancel}
              className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
            >
              <X className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Receipt Image */}
            <div className="rounded-lg overflow-hidden">
              <img 
                src={receiptImage} 
                alt="Receipt" 
                className="w-full h-auto max-h-96 object-contain bg-gray-900"
              />
            </div>

            {/* Extracted Data */}
            <div>
              {processing ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <Loader className="w-8 h-8 text-blue-600 animate-spin mb-4" />
                  <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                    Analyzing receipt...
                  </p>
                </div>
              ) : extractedData && (
                <div className="space-y-4">
                  <div>
                    <label className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Merchant
                    </label>
                    <p className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {extractedData.merchant}
                    </p>
                  </div>

                  <div>
                    <label className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Date
                    </label>
                    <p className={`text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {extractedData.date}
                    </p>
                  </div>

                  <div>
                    <label className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Total Amount
                    </label>
                    <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      ${extractedData.total}
                    </p>
                  </div>

                  <div>
                    <label className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Items
                    </label>
                    <div className="space-y-1 mt-1">
                      {extractedData.items.map((item, index) => (
                        <div key={index} className={`flex justify-between ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          <span>{item.name}</span>
                          <span>${item.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Suggested Category
                    </label>
                    <p className={`text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {extractedData.category}
                    </p>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={handleConfirm}
                      className="flex-1 px-4 py-3 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-all flex items-center justify-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      Confirm & Add
                    </button>
                    <button
                      onClick={handleCancel}
                      className={`flex-1 px-4 py-3 rounded-lg border transition-all ${
                        isDark 
                          ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                          : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
