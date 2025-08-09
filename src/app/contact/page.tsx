'use client';
import Link from 'next/link';
import { MdArrowBack } from 'react-icons/md';

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="mb-6">
        <Link href="/" className="flex items-center text-blue-600 hover:text-blue-800">
          <MdArrowBack className="mr-1" /> Back to Home
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
      <p className="text-lg mb-8">Have questions or feedback? We&apos;d love to hear from you!</p>

      <form 
        name="contact" 
        method="POST" 
        action="/submit-form" // Add this line
        className="space-y-6"
      >
        <input type="hidden" name="form-name" value="contact" />
        
        {/* Rest of your form fields remain the same */}
        <div className="space-y-2">
          <label htmlFor="name" className="block font-medium">Your Name</label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="block font-medium">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="subject" className="block font-medium">Subject</label>
          <input
            type="text"
            id="subject"
            name="subject"
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="message" className="block font-medium">Message</label>
          <textarea
            id="message"
            name="message"
            rows={5}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          ></textarea>
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
        >
          Send Message
        </button>
      </form>
    </div>
  );
}