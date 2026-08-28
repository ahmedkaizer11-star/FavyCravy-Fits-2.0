import React, { useState } from 'react';
import { Phone, Mail, MapPin, MessageCircle, Clock, Send, CheckCircle2 } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { useToast } from '../context/ToastContext';

export function ContactPage() {
  const { settings } = useSettings();
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const cleanPhone = settings.whatsapp.replace(/^0/, '880').replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent('Hello Favy Cravy Fits 2.0! I have an inquiry regarding your menswear collection.')}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    showToast('Your message has been sent to our customer care team.', 'success');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="text-xs font-mono tracking-widest text-neutral-400 uppercase">Customer Care & Studio</span>
        <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-white uppercase tracking-wider">
          Connect With FCF 2.0
        </h1>
        <p className="text-sm text-neutral-400 max-w-md mx-auto">
          Need sizing advice, order confirmation, or custom bulk ordering assistance? Our Dhaka team is ready.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Contact Info (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-neutral-900 p-6 rounded-2xl border border-neutral-800 space-y-6">
            <h3 className="font-serif text-base font-bold text-white uppercase tracking-wider">
              Studio Hotline & Channels
            </h3>

            <div className="space-y-4 text-xs text-neutral-300">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-lg bg-neutral-800 text-white shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-neutral-400">Customer Helpline</p>
                  <a href={`tel:${settings.phone}`} className="text-white font-mono font-bold hover:underline">
                    {settings.phone}
                  </a>
                  <p className="text-[10px] text-neutral-500">Everyday: 10:00 AM – 10:00 PM (BST)</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-lg bg-emerald-950 text-emerald-400 shrink-0 border border-emerald-800">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-neutral-400">WhatsApp Live Chat</p>
                  <a href={whatsappUrl} target="_blank" rel="noreferrer" className="text-white font-mono font-bold hover:underline">
                    {settings.whatsapp}
                  </a>
                  <p className="text-[10px] text-emerald-400 font-medium">Instant fit guidance & bKash confirmation</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-lg bg-neutral-800 text-white shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-neutral-400">Email Support</p>
                  <a href={`mailto:${settings.email}`} className="text-white font-mono hover:underline">
                    {settings.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-lg bg-neutral-800 text-white shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-neutral-400">Dhaka Flagship Studio</p>
                  <p className="text-white font-medium">Road 11, Block D, Banani</p>
                  <p className="text-neutral-400">Dhaka 1213, Bangladesh</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-800">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 transition-colors shadow"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Message on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* Contact Form (7 cols) */}
        <div className="lg:col-span-7">
          <div className="bg-neutral-900/60 p-6 sm:p-8 rounded-2xl border border-neutral-800 space-y-6">
            <h3 className="font-serif text-base font-bold text-white uppercase tracking-wider">
              Send Direct Message
            </h3>

            {submitted ? (
              <div className="p-8 text-center space-y-3 bg-neutral-950 rounded-xl border border-neutral-800">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h4 className="font-serif text-lg font-bold text-white">Inquiry Received</h4>
                <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                  Our Dhaka styling team will reply to your provided number or email within a few hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-4 py-2 bg-neutral-800 text-white text-xs rounded-lg mt-2"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-neutral-400">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Kaizer Ahmed"
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-xl p-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-neutral-400">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="01XXXXXXXXX"
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-xl p-2.5 text-xs text-white font-mono placeholder-neutral-500 focus:outline-none focus:border-white"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-neutral-400">Subject</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Size advice for Oxford Shirt / Order Inquiry"
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl p-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-neutral-400">Your Message *</label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="How can we assist you with our menswear collection?"
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl p-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-white text-neutral-950 font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-neutral-200 transition-colors shadow flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Inquiries</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
