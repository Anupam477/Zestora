import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';
import { SectionHeader } from '../components/common/SectionHeader';
import { Modal } from '../components/common/Modal';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Star, Quote, Plus, MessageSquarePlus, CheckCircle2 } from 'lucide-react';

export const Testimonials = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { success, error: toastError } = useToast();

  const [form, setForm] = useState({
    name: '',
    roleOrProfession: '',
    rating: 5,
    comment: '',
  });

  const fetchReviews = async () => {
    try {
      const res = await api.getReviews();
      if (res.success) setReviews(res.data);
    } catch (err) {
      console.error('Failed to load reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.comment) {
      toastError('Please provide your name and your review comment.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.createReview(form);
      if (res.success) {
        success('Thank you! Your dining review has been posted.');
        setIsModalOpen(false);
        setForm({ name: '', roleOrProfession: '', rating: 5, comment: '' });
        fetchReviews();
      }
    } catch (err) {
      toastError(err.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <SectionHeader
          subtitle="Critical Acclaim"
          title="Guest & Critic Reflections"
          align="left"
          className="mb-0"
          description="Read genuine impressions from food critics, connoisseurs, and our beloved regular patrons."
        />
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-primary to-accent-orange text-[#0B1120] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:brightness-110 transition-all flex-shrink-0"
        >
          <MessageSquarePlus className="w-4 h-4" />
          Write a Review
        </button>
      </div>

      {loading ? (
        <LoadingSpinner text="Gathering guest impressions..." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev._id}
              className="luxury-card p-8 rounded-3xl flex flex-col justify-between space-y-6 relative"
            >
              <Quote className="w-10 h-10 text-primary/15 absolute top-6 right-6" />

              <div className="space-y-4">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-slate-300 italic leading-relaxed">
                  "{rev.comment}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
                <img
                  src={rev.avatar || '/img/testimonial-1.jpg'}
                  alt={rev.name}
                  className="w-12 h-12 rounded-full object-cover border border-primary/40"
                />
                <div>
                  <h4 className="text-sm font-bold text-white">{rev.name}</h4>
                  <p className="text-xs text-primary">{rev.roleOrProfession || 'Patron'}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review Submission Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Share Your Zestora Experience"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Your Name *
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Julian Sterling"
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Profession or Title
            </label>
            <input
              type="text"
              value={form.roleOrProfession}
              onChange={(e) => setForm({ ...form, roleOrProfession: e.target.value })}
              placeholder="e.g. Michelin Dining Enthusiast"
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Rating
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setForm({ ...form, rating: star })}
                  className="p-1"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= form.rating
                        ? 'text-amber-400 fill-current'
                        : 'text-slate-600'
                    }`}
                  />
                </button>
              ))}
              <span className="text-xs font-bold text-slate-300 ml-2">
                {form.rating} of 5 Stars
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Your Feedback & Experience *
            </label>
            <textarea
              required
              rows={4}
              value={form.comment}
              onChange={(e) => setForm({ ...form, comment: e.target.value })}
              placeholder="Describe the flavors, ambiance, or service..."
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-primary"
            />
          </div>

          <div className="pt-3">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary to-accent-orange text-[#0B1120] font-black text-sm shadow-xl shadow-primary/20 hover:brightness-110 transition-all"
            >
              {submitting ? 'Submitting Review...' : 'Publish Guest Review'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
