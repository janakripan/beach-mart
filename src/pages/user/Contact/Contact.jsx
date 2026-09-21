import { useState, useContext } from 'react';
import { MapPin, Mail, PhoneCall, Clock, Send, ExternalLink, ArrowRight } from 'lucide-react';
import { AppLoadingContext } from '../../../context/AppLoadingContext';

/* ─── Dummy Contact Data ─────────────────────────────────────────────── */
const CONTACT_INFO = [
  {
    icon: MapPin,
    label: 'Our Location',
    value: 'Ajman Market, Al Jurf, Ajman, UAE',
    href: 'https://maps.google.com/?q=Ajman+Market,+Al+Jurf,+Ajman,+UAE',
  },
  {
    icon: PhoneCall,
    label: 'Phone Number',
    value: '+971 55 123 4567',
    href: 'tel:+971551234567',
  },
  {
    icon: Mail,
    label: 'Email Address',
    value: 'beachmart@gmail.com',
    href: 'mailto:beachmart@gmail.com',
  },
  {
    icon: Clock,
    label: 'Working Hours',
    value: 'Mon – Sat  ·  8 AM – 10 PM',
    href: null,
  },
];

/* ─── Google Maps embed ──────────────────────────────────────────────── */
const MAP_EMBED_URL =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d57854.25748085097!2d55.4252!3d25.4052!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f5a1e7e7e7e7%3A0x0!2sAjman%2C+UAE!5e0!3m2!1sen!2sae!4v1698765432100!5m2!1sen!2sae';

/* ─── Shared input / textarea classes ───────────────────────────────── */
const FIELD =
  'w-full h-11 px-4 rounded-xl border border-gray-200 bg-gray-50 font-poppins text-[14px] text-text-main placeholder:text-gray-400 outline-none focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all duration-200';

/* ─── Contact Page Shimmer ──────────────────────────────────────────── */
const ContactShimmer = () => (
  <div className="min-h-[calc(100vh-118px)] bg-[#F8FCF8]">
    {/* Hero Banner Shimmer */}
    <div className="w-full h-[180px] md:h-[240px] shimmer" />

    <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 xl:px-[80px] py-10 md:py-14 flex flex-col gap-8 lg:gap-12">
      {/* ── TOP SECTION: Form & Map ───────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-8 lg:gap-12 items-stretch">
        {/* Form Shimmer */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 flex flex-col h-full min-h-[480px]">
          <div className="w-48 h-7 rounded-md shimmer mb-8" />
          <div className="flex flex-col gap-4 flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="h-11 rounded-xl shimmer" />
              <div className="h-11 rounded-xl shimmer" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="h-11 rounded-xl shimmer" />
              <div className="h-11 rounded-xl shimmer" />
            </div>
            <div className="h-full min-h-[120px] rounded-xl shimmer flex-1 mt-1.5" />
            <div className="h-12 w-full sm:w-40 rounded-full shimmer mt-2" />
          </div>
        </div>

        {/* Map Shimmer (desktop only) */}
        <div className="hidden lg:flex flex-col h-full">
          <div className="flex-1 rounded-2xl shimmer min-h-[400px]" />
          <div className="mt-3 self-end w-32 h-4 rounded-md shimmer" />
        </div>
      </div>

      {/* ── BOTTOM SECTION: Info cards ─────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-start gap-3 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm h-full">
            <div className="w-9 h-9 rounded-xl shimmer shrink-0" />
            <div className="flex flex-col gap-2 w-full mt-1">
              <div className="w-16 h-2.5 rounded-sm shimmer" />
              <div className="w-3/4 h-3.5 rounded-sm shimmer" />
            </div>
          </div>
        ))}
      </div>

      {/* ── Mobile / Tablet: Open in Maps button ────────────────── */}
      <div className="lg:hidden h-12 rounded-full shimmer mt-4" />
    </div>
  </div>
);

export default function Contact() {
  const { isLoading } = useContext(AppLoadingContext);
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]   = useState(false);

  if (isLoading) return <ContactShimmer />;

  const handleChange  = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  const handleSubmit  = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setSubmitted(true); }, 1200);
  };
  const handleReset   = () => { setSubmitted(false); setForm({ name: '', email: '', phone: '', subject: '', message: '' }); };

  return (
    <div className="min-h-[calc(100vh-118px)] bg-[#F8FCF8]">

      {/* ── Page Header ─────────────────────────────────────────────── */}
      <div className="relative bg-[#00380E] overflow-hidden">
        {/* Subtle radial green glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(52,199,89,0.18),transparent)] pointer-events-none" />
        {/* leaf accents */}
        <img src="/assets/common/leaf.png" alt="" className="absolute -left-6 bottom-0 w-[130px] opacity-[0.12] rotate-[-127deg] pointer-events-none" />
        <img src="/assets/common/leaf.png" alt="" className="absolute -right-4 top-0  w-[130px] opacity-[0.12] rotate-[180deg]  pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 lg:px-16 xl:px-[80px] py-10 md:py-14">
          <span className="inline-block font-poppins text-[12px] md:text-[13px] text-primary uppercase tracking-[0.2em] font-medium mb-3">
            Get in Touch
          </span>
          <h1 className="font-marcellus text-white text-[32px] md:text-[44px] leading-tight max-w-lg">
            We'd love to hear<br className="hidden sm:block" /> from you
          </h1>
          <p className="font-poppins text-[14px] text-gray-300 mt-3 max-w-md leading-relaxed">
            Have a question, feedback, or just want to say hello? Fill in the form and our team will respond within 24 hours.
          </p>
        </div>
      </div>

      {/* ── Main Content ────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 xl:px-[80px] py-10 md:py-14 flex flex-col gap-8 lg:gap-12">
        
        {/* ── TOP SECTION: Form & Map ───────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-8 lg:gap-12 items-stretch">

          {/* ── LEFT COLUMN: Form ───────────────────────────────────── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 flex flex-col h-full">
            <h2 className="font-marcellus text-text-main text-[22px] md:text-[26px] mb-1">
              Send us a Message
            </h2>
            <div className="w-8 h-0.5 bg-primary rounded-full mb-6" />

            {submitted ? (
              /* ── Success state ─────────────────────────────────── */
              <div className="flex-1 flex flex-col items-center justify-center gap-4 py-14 text-center">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
                      <Send size={20} className="text-white" />
                    </div>
                  </div>
                  {/* animated ring */}
                  <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-ping" />
                </div>
                <p className="font-marcellus text-text-main text-[22px] mt-2">Message Sent!</p>
                <p className="font-poppins text-text-muted text-[14px] max-w-[280px] leading-relaxed">
                  Thanks for reaching out. We'll get back to you within 24 hours.
                </p>
                <button
                  onClick={handleReset}
                  className="mt-1 flex items-center gap-1 font-poppins text-[14px] text-primary hover:text-secondary transition-colors"
                >
                  Send another <ArrowRight size={14} />
                </button>
              </div>
            ) : (
              /* ── Form ─────────────────────────────────────────── */
              <form onSubmit={handleSubmit} className="flex flex-col gap-4 flex-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="c-name" className="font-poppins text-[12px] font-semibold text-gray-500 uppercase tracking-wide">
                      Full Name <span className="text-primary normal-case tracking-normal">*</span>
                    </label>
                    <input id="c-name" name="name" type="text" required placeholder="John Doe"
                      value={form.name} onChange={handleChange} className={FIELD} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="c-email" className="font-poppins text-[12px] font-semibold text-gray-500 uppercase tracking-wide">
                      Email <span className="text-primary normal-case tracking-normal">*</span>
                    </label>
                    <input id="c-email" name="email" type="email" required placeholder="you@example.com"
                      value={form.email} onChange={handleChange} className={FIELD} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="c-phone" className="font-poppins text-[12px] font-semibold text-gray-500 uppercase tracking-wide">
                      Phone
                    </label>
                    <input id="c-phone" name="phone" type="tel" placeholder="+971 55 000 0000"
                      value={form.phone} onChange={handleChange} className={FIELD} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="c-subject" className="font-poppins text-[12px] font-semibold text-gray-500 uppercase tracking-wide">
                      Subject
                    </label>
                    <input id="c-subject" name="subject" type="text" placeholder="Order inquiry…"
                      value={form.subject} onChange={handleChange} className={FIELD} />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 flex-1">
                  <label htmlFor="c-message" className="font-poppins text-[12px] font-semibold text-gray-500 uppercase tracking-wide">
                    Message <span className="text-primary normal-case tracking-normal">*</span>
                  </label>
                  <textarea id="c-message" name="message" required rows={5}
                    placeholder="How can we help you today?"
                    value={form.message} onChange={handleChange}
                    className={`${FIELD} h-full min-h-[120px] py-3 resize-none`} />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center justify-center gap-2 w-full sm:w-auto sm:self-start sm:px-10 h-12 bg-primary hover:bg-secondary text-white font-poppins font-medium text-[15px] rounded-full transition-all duration-300 shadow-md hover:shadow-primary/30 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed mt-1"
                >
                  {loading ? (
                    <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Sending…</>
                  ) : (
                    <><Send size={15} /> Send Message</>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* ── RIGHT COLUMN: Map (desktop only) ────────────────────── */}
          <div className="hidden lg:flex flex-col h-full">
            <div className="flex-1 rounded-2xl overflow-hidden border border-gray-100 shadow-sm min-h-[400px]">
              <iframe
                title="Beach Circle Mini Mart Location"
                src={MAP_EMBED_URL}
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '100%', display: 'block' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            {/* Open in Maps — compact text link below map */}
            <a
              href={CONTACT_INFO[0].href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 self-end flex items-center gap-1.5 text-primary hover:text-secondary font-poppins text-[13px] font-medium transition-colors"
            >
              <ExternalLink size={13} />
              Open in Google Maps
            </a>
          </div>
        </div>

        {/* ── BOTTOM SECTION: Info cards ─────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          {CONTACT_INFO.map(({ icon: Icon, label, value, href }) => (
            <div key={label}
              className="group flex items-start gap-3 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-primary/40 hover:shadow-[0_4px_20px_rgba(52,199,89,0.12)] transition-all duration-300 h-full"
            >
              <div className="w-9 h-9 rounded-xl bg-primary/8 group-hover:bg-primary/12 flex items-center justify-center shrink-0 transition-colors">
                <Icon size={16} className="text-primary" strokeWidth={1.75} />
              </div>
              <div className="min-w-0">
                <p className="font-poppins text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">
                  {label}
                </p>
                {href ? (
                  <a href={href}
                    target={href.startsWith('http') ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    className="font-poppins text-[12px] md:text-[13px] text-text-main hover:text-primary transition-colors leading-snug break-all"
                  >
                    {value}
                  </a>
                ) : (
                  <p className="font-poppins text-[12px] md:text-[13px] text-text-main leading-snug">{value}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* ── Mobile / Tablet: Open in Maps button ────────────────── */}
        <a
          href={CONTACT_INFO[0].href}
          target="_blank"
          rel="noopener noreferrer"
          className="lg:hidden flex items-center justify-center gap-2 h-12 bg-[#00380E] hover:bg-primary text-white font-poppins font-medium text-[15px] rounded-full transition-all duration-300 shadow-sm mt-4"
        >
          <MapPin size={17} />
          Open in Google Maps
          <ExternalLink size={13} />
        </a>
      </div>
    </div>
  );
}
