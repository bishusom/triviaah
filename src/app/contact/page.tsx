'use client';
import Link from 'next/link';
import { useState, FormEvent } from 'react';
import { ArrowLeft, CheckCircle, XCircle, Mail, User, MessageSquare } from 'lucide-react';

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

export default function ContactPage() {
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch('https://formspree.io/f/xyzdvqlw', {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
        },
      });

      if (response.ok) {
        setStatus('success');
        form.reset();
      } else {
        const data = await response.json();
        setStatus('error');
        setErrorMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setStatus('error');
      setErrorMessage('Network error. Please check your connection and try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block bg-gradient-to-r from-purple-600 to-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6">
            GET IN TOUCH
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Contact Us
          </h1>
          
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Have questions or feedback? We&apos;d love to hear from you!
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Success Message */}
          {status === 'success' && (
            <div className="mb-8 p-6 bg-green-900/30 border border-green-800 rounded-2xl flex items-start gap-4">
              <CheckCircle className="text-green-400 mt-1 flex-shrink-0" size={24} />
              <div>
                <h3 className="font-bold text-green-400 text-lg mb-2">Message Sent Successfully!</h3>
                <p className="text-green-300">We&apos;ll get back to you as soon as possible.</p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {status === 'error' && (
            <div className="mb-8 p-6 bg-red-900/30 border border-red-800 rounded-2xl flex items-start gap-4">
              <XCircle className="text-red-400 mt-1 flex-shrink-0" size={24} />
              <div>
                <h3 className="font-bold text-red-400 text-lg mb-2">Failed to Send Message</h3>
                <p className="text-red-300">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Contact Form */}
          <div className="bg-gray-800/50 rounded-2xl border-2 border-gray-700 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="name" className="block font-medium text-gray-300 flex items-center gap-2">
                  <User size={18} />
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  disabled={status === 'submitting'}
                  className="w-full px-4 py-3 bg-gray-700 border-2 border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                  placeholder="Enter your name"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block font-medium text-gray-300 flex items-center gap-2">
                  <Mail size={18} />
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  disabled={status === 'submitting'}
                  className="w-full px-4 py-3 bg-gray-700 border-2 border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                  placeholder="Enter your email"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="subject" className="block font-medium text-gray-300">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  disabled={status === 'submitting'}
                  className="w-full px-4 py-3 bg-gray-700 border-2 border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                  placeholder="What's this about?"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="block font-medium text-gray-300 flex items-center gap-2">
                  <MessageSquare size={18} />
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  disabled={status === 'submitting'}
                  className="w-full px-4 py-3 bg-gray-700 border-2 border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed resize-vertical"
                  placeholder="Tell us what's on your mind..."
                />
              </div>

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-3"
              >
                {status === 'submitting' ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Sending Message...
                  </>
                ) : (
                  <>
                    <Mail size={20} />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="mt-12 pt-8 border-t border-gray-700">
            <h2 className="text-2xl font-bold mb-6 text-center">Other Ways to Reach Us</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="text-center p-6 bg-gray-800/30 rounded-xl border border-gray-700">
                <h3 className="font-semibold mb-3 text-purple-400">Response Time</h3>
                <p className="text-gray-300">We typically respond within 24-48 hours during business days.</p>
              </div>
              <div className="text-center p-6 bg-gray-800/30 rounded-xl border border-gray-700">
                <h3 className="font-semibold mb-3 text-purple-400">Support</h3>
                <p className="text-gray-300">For technical issues, please include details about your device and browser.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}