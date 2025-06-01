import { CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ThankyouPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-100 to-white px-4">
      <CheckCircle className="text-green-500 w-16 h-16 mb-4" />
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Thank You for Your Order!</h1>
      <p className="text-gray-600 text-center max-w-md mb-6">
        We’ve received your order and will begin processing it right away. A confirmation email has been sent to your inbox.
      </p>
      <Link to="/" className="px-6 py-2 bg-yellow-400 text-white font-semibold rounded shadow hover:bg-yellow-500 transition duration-300">
        Continue Shopping
      </Link>
    </div>
  );
}
